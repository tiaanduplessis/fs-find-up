const findUp = require('./')

test('should export function', () => {
  expect(findUp).toBeDefined()
  expect(typeof findUp).toBe('function')
})

test('should find a file', () => {
  expect(findUp('index.js')[0]).toMatch(/.*\/index.js/)
})

test('should find multiple files', () => {
  const result = findUp(['index.js', /^package.json$/, 'LICENSE'])
  expect(result[0]).toMatch(/.*\/index.js/)
  expect(result[1]).toMatch(/.*\/package.json/)
  expect(result.length).toBeGreaterThanOrEqual(3)
})

test('should return empty array if file does not exist', () => {
  const result = findUp('foobarbaz.foobarbaz')
  expect(result.length).toBeFalsy()
})

test('should return empty array for invalid input', () => {
  const result = findUp([undefined, null])
  expect(result.length).toBeFalsy()
})
