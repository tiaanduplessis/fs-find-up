'use strict'

const assert = require('assert')
const fs = require('fs')
const os = require('os')
const path = require('path')
const findUp = require(process.env.FS_FIND_UP_MODULE || '..')

const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-find-up-regression-'))
const parent = path.join(fixture, 'parent')
const child = path.join(parent, 'child')
const originalCwd = process.cwd()
const originalReaddirSync = fs.readdirSync
const originalExistsSync = fs.existsSync
let reads = []
let failures = 0
let total = 0

const fixtureFiles = [
  'top.match',
  'parent/parent.match',
  'parent/first.config',
  'parent/second.config',
  'parent/nearest.match',
  'parent/child/nearest.match',
  'parent/child/local.txt',
  'parent/child/other.txt'
]
fs.mkdirSync(parent)
fs.mkdirSync(child)
for (const file of fixtureFiles) {
  fs.writeFileSync(path.join(fixture, file), '')
}

// Only read our synthetic tree. Ancestors outside it are empty virtual directories.
// This exercises termination without inspecting the machine's real directories.
fs.readdirSync = function (dir) {
  const absolute = path.resolve(dir)
  reads.push(absolute)
  if (absolute === fixture || absolute.startsWith(fixture + path.sep)) {
    return originalReaddirSync.apply(fs, arguments)
  }
  assert(fixture.startsWith(absolute.endsWith(path.sep) ? absolute : absolute + path.sep))
  return []
}
fs.existsSync = function (file) {
  const absolute = path.resolve(file)
  return absolute.startsWith(fixture + path.sep) && originalExistsSync.apply(fs, arguments)
}

function check (name, run) {
  total++
  reads = []
  try {
    run()
    console.log('ok - ' + name)
  } catch (error) {
    failures++
    console.error('not ok - ' + name)
    console.error(error.stack)
  }
}

try {
  check('regex finds a parent-only match from an absolute start', () => {
    assert.deepStrictEqual(findUp(/^parent\.match$/, { cwd: child }), [path.join(parent, 'parent.match')])
    assert.deepStrictEqual(reads, [child, parent])
  })

  check('regex crosses more than one empty directory', () => {
    assert.deepStrictEqual(findUp(/^top\.match$/, { cwd: child }), [path.join(fixture, 'top.match')])
    assert.deepStrictEqual(reads, [child, parent, fixture])
  })

  check('regex returns all matching files from the nearest matching directory', () => {
    assert.deepStrictEqual(findUp(/\.config$/, { cwd: child }).sort(), [
      path.join(parent, 'first.config'),
      path.join(parent, 'second.config')
    ])
    assert.deepStrictEqual(reads, [child, parent])
  })

  check('regex stops at a match in the starting directory', () => {
    assert.deepStrictEqual(findUp(/^nearest\.match$/, { cwd: child }), [path.join(child, 'nearest.match')])
    assert.deepStrictEqual(reads, [child])
  })

  check('regex keeps multiple results in the starting directory', () => {
    assert.deepStrictEqual(findUp(/\.txt$/, { cwd: child }).sort(), [
      path.join(child, 'local.txt'),
      path.join(child, 'other.txt')
    ])
    assert.deepStrictEqual(reads, [child])
  })

  check('regex miss returns an empty array and terminates', () => {
    assert.deepStrictEqual(findUp(/^not-present$/, { cwd: child }), [])
    assert.deepStrictEqual(reads.slice(0, 3), [child, parent, fixture])
    assert.strictEqual(new Set(reads).size, reads.length)
    assert(reads.length <= child.split(path.sep).length)
  })

  check('regex miss starting at a virtual filesystem root terminates', () => {
    const root = path.parse(fixture).root
    assert.deepStrictEqual(findUp(/^not-present$/, { cwd: root }), [])
    assert.deepStrictEqual(reads, [root])
  })

  check('an empty start does not read the filesystem', () => {
    assert.deepStrictEqual(findUp(/./, { cwd: '' }), [])
    assert.deepStrictEqual(reads, [])
  })

  check('string lookup still traverses parents and returns an array', () => {
    assert.deepStrictEqual(findUp('parent.match', { cwd: child }), [path.join(parent, 'parent.match')])
    assert.deepStrictEqual(reads, [])
  })

  check('string lookup still stops at the nearest match', () => {
    assert.deepStrictEqual(findUp('nearest.match', { cwd: child }), [path.join(child, 'nearest.match')])
  })

  check('string miss still returns an empty array', () => {
    assert.deepStrictEqual(findUp('not-present', { cwd: child }), [])
  })

  check('mixed inputs keep order, flatten results and search independently', () => {
    assert.deepStrictEqual(findUp(['local.txt', /^parent\.match$/, /^top\.match$/], { cwd: child }), [
      path.join(child, 'local.txt'),
      path.join(parent, 'parent.match'),
      path.join(fixture, 'top.match')
    ])
  })

  check('invalid inputs are ignored', () => {
    assert.deepStrictEqual(findUp([undefined, null, 1, {}], { cwd: child }), [])
    assert.deepStrictEqual(reads, [])
  })

  check('relative starts preserve relative result paths', () => {
    process.chdir(fixture)
    try {
      assert.deepStrictEqual(findUp(/^parent\.match$/, { cwd: path.join('parent', 'child') }), [
        path.join('parent', 'parent.match')
      ])
    } finally {
      process.chdir(originalCwd)
    }
  })

  check('omitted options use the current working directory', () => {
    process.chdir(child)
    try {
      assert.deepStrictEqual(findUp(/^parent\.match$/), [path.join(parent, 'parent.match')])
      assert.deepStrictEqual(findUp(), [])
    } finally {
      process.chdir(originalCwd)
    }
  })

  check('missing directory errors still propagate', () => {
    assert.throws(() => findUp(/./, { cwd: path.join(child, 'missing') }), error => error.code === 'ENOENT')
  })

  check('non-directory errors still propagate', () => {
    assert.throws(() => findUp(/./, { cwd: path.join(child, 'local.txt') }), error => error.code === 'ENOTDIR')
  })

  check('an error in a parent reached after a regex miss propagates unchanged', () => {
    const guardedReaddirSync = fs.readdirSync
    const denied = Object.assign(new Error('synthetic access denied'), { code: 'EACCES' })
    fs.readdirSync = function (dir) {
      if (path.resolve(dir) === parent) throw denied
      return guardedReaddirSync.apply(fs, arguments)
    }
    try {
      assert.throws(() => findUp(/^parent\.match$/, { cwd: child }), error => error === denied)
    } finally {
      fs.readdirSync = guardedReaddirSync
    }
  })
} finally {
  process.chdir(originalCwd)
  fs.readdirSync = originalReaddirSync
  fs.existsSync = originalExistsSync
  for (const file of fixtureFiles) fs.unlinkSync(path.join(fixture, file))
  fs.rmdirSync(child)
  fs.rmdirSync(parent)
  fs.rmdirSync(fixture)
}

console.log(`${total - failures}/${total} regression checks passed`)
if (failures) process.exitCode = 1
