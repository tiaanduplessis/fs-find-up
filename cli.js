#!/usr/bin/env node
'use strict'

const file = process.argv.slice(2)
const fileUp = require('./')

if (file.length) {
  const result = fileUp(file)
  if (result.length) {
    console.log(result)
  }
} else {
  console.log('No filename given')
}
