# Welcome to dockerfile-check-updates 👋
![Version](https://img.shields.io/badge/version-0.0.7-blue.svg?cacheSeconds=2592000)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://github.com/apatryda/dockerfile-check-updates#readme)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/apatryda/dockerfile-check-updates/graphs/commit-activity)
[![License: MIT](https://img.shields.io/github/license/apatryda/dockerfile-check-updates)](https://github.com/apatryda/dockerfile-check-updates/blob/master/LICENSE)

> Check for updates for your Dockerfile base images

### 🏠 [Homepage](https://github.com/apatryda/dockerfile-check-updates#readme)

## Install

```sh
npm install
```

## Usage

### Simple

When run with no argument `dockerfile-check-updates` will try to analyse a _Dockerfile_ present in the current directory.

```sh
dockerfile-check-updates
```

### Glob

Or you can provide a glob to find Dockerfiles.

```sh
dockerfile-check-updates '**/{.*{D,d},D}ockerfile'
```

### Output `sed` commands

When `--sed` option is provided, output will consist of sed commands necessary to perform updates to Dockerfiles.

Running:

```sh
dockerfile-check-updates --sed
```

on a Dockerfile that starts with the following line:

```Dockerfile
FROM node:12.2.1-alpine
```

will output:

```sh
sed -i '1s#node:12.2.1-alpine#node:12.20.1-alpine#' Dockerfile
```

## Author

👤 **Artur Nerkowski**

* Github: [@apatryda](https://github.com/apatryda)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/apatryda/dockerfile-check-updates/issues).

## Show your support

Give a ⭐️ if this project helped you!


## 📝 License

Copyright © 2021 [Artur Nerkowski](https://github.com/apatryda).

This project is [MIT](https://github.com/apatryda/dockerfile-check-updates/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
