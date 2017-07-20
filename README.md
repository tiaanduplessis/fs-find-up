
<h1 align="center">fs-find-up</h1>
<div align="center">
  <strong>Search up directory tree for specific file(s)</strong>
</div>
<br>
<div align="center">
  <a href="https://npmjs.org/package/@tiaanduplessis/fs-find-up">
    <img src="https://img.shields.io/npm/v/@tiaanduplessis/fs-find-up.svg?style=flat-square" alt="npm package version" />
  </a>
  <a href="https://npmjs.org/package/@tiaanduplessis/fs-find-up">
  <img src="https://img.shields.io/npm/dm/@tiaanduplessis/fs-find-up.svg?style=flat-square" alt="npm downloads" />
  </a>
  <a href="https://codecov.io/gh/tiaanduplessis/fs-find-up">
  <img src="https://codecov.io/gh/tiaanduplessis/fs-find-up/branch/master/graph/badge.svg" alt="Codecov" />
</a>
  <a href="https://github.com/feross/standard">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square" alt="standard JS linter" />
  </a>
  <a href="https://github.com/prettier/prettier">
    <img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square" alt="prettier code formatting" />
  </a>
  <a href="https://travis-ci.org/tiaanduplessis/fs-find-up">
    <img src="https://img.shields.io/travis/tiaanduplessis/fs-find-up.svg?style=flat-square" alt="travis ci build status" />
  </a>
  <a href="https://github.com/tiaanduplessis/fs-find-up/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/@tiaanduplessis/fs-find-up.svg?style=flat-square" alt="project license" />
  </a>
  <a href="http://makeapullrequest.com">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="make a pull request" />
  </a>
</div>
<br>
<div align="center">
  <a href="https://github.com/tiaanduplessis/fs-find-up/watchers">
    <img src="https://img.shields.io/github/watchers/tiaanduplessis/fs-find-up.svg?style=social" alt="Github Watch Badge" />
  </a>
  <a href="https://github.com/tiaanduplessis/fs-find-up/stargazers">
    <img src="https://img.shields.io/github/stars/tiaanduplessis/fs-find-up.svg?style=social" alt="Github Star Badge" />
  </a>
  <a href="https://twitter.com/intent/tweet?text=Check%20out%20fs-find-up!%20https://github.com/tiaanduplessis/fs-find-up%20%F0%9F%91%8D">
    <img src="https://img.shields.io/twitter/url/https/github.com/tiaanduplessis/fs-find-up.svg?style=social" alt="Tweet" />
  </a>
</div>
<br>
<div align="center">
  Built with ❤︎ by <a href="https://github.com/tiaanduplessis">tiaanduplessis</a> and <a href="https://github.com/tiaanduplessis/fs-find-up/contributors">contributors</a>
</div>

<h2>Table of Contents</h2>
<details>
  <summary>Table of Contents</summary>
  <li><a href="#about">About</a></li>
  <li><a href="#install">Install</a></li>
  <li><a href="#usage">Usage</a></li>
  <li><a href="#contribute">Contribute</a></li>
  <li><a href="#license">License</a></li>
</details>

## About

Find file(s) by walking up parent directories. Similar to [find-up](https://www.npmjs.com/package/find-up), but adds support for matching using regex and is synchronous by default.

## Install

```sh
$ npm install @tiaanduplessis/fs-find-up
# OR
$ yarn add @tiaanduplessis/fs-find-up
```

## Usage

```js
const findUp = require('@tiaanduplessis/fs-find-up')

console.log(findUp('index.js'))
// [ '/Users/Tiaan/Workspace/fs-find-up/index.js' ]

console.log(findUp(['index.js', /.*\.test\.js/])) 
// [ '/Users/Tiaan/Workspace/fs-find-up/index.js', '/Users/Tiaan/Workspace/fs-find-up/index.test.js' ]

console.log(findUp('foobar.bazbazboom'))
// []
```


## Contributing

Contributions are welcome!

1. Fork it.
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

Or open up [a issue](https://github.com/tiaanduplessis/fs-find-up/issues).

## License

Licensed under the MIT License.
