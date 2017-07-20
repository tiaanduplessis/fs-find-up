'use strict'

const fs = require('fs')
const path = require('path')

/**
 * Find one or more files from the current directory and upwards
 *
 * @param {Array|String|RegExp} files One or more files to find
 * @param {Object} opts Additional options e.g. the cwd
 */
const findUp = function findUp (files = [], opts = { cwd: process.cwd() }) {
  if (!Array.isArray(files)) {
    files = [files]
  }

  return files.reduce((found, file) => {
    const result = findInDir(opts.cwd, file)
    return result ? found.concat(result) : found
  }, [])
}

/**
 * Look for the existence of file matching the given filename
 * @param {String} currentDir Current directory to look for file
 * @param {String|RegExp} filename file name to find
 */
const fileExists = function fileExists (currentDir, filename) {
  if (typeof filename === 'string') {
    const filePath = path.join(currentDir, filename)
    if (fs.existsSync(filePath)) {
      return [filePath]
    }
    return false
  } else if (filename instanceof RegExp) {
    return fs
      .readdirSync(currentDir)
      .filter(file => file.match(filename))
      .map(f => path.join(currentDir, f))
  }

  return false
}

/**
 * Recursively look for a file
 *
 * @param {String} pathStr Current path
 * @param {String|RegExp} file File to look for
 */
const findInDir = function findInDir (pathStr = '', file) {
  if (!pathStr.length) {
    return false
  }

  const result = fileExists(pathStr, file)

  if (result) {
    return result
  }

  const parentDir = pathStr.split(path.sep).slice(0, -1).join(path.sep)

  return findInDir(parentDir, file)
}

module.exports = findUp
