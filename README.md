[![version][version-badge]][package] [![downloads][downloads-badge]][npmtrends]
[![semantic-release][semantic-release-badge]][semantic-release]
[![code style: prettier][prettier-badge]][prettier]

# decompress-response

<!-- ![description starts here] -->

> 🍱 A fork of [decompress-response](https://github.com/sindresorhus/decompress-response) but with CJS support

Decompresses the [response](https://nodejs.org/api/http.html#http_class_http_incomingmessage) from [`http.request`](https://nodejs.org/api/http.html#http_http_request_options_callback) if it's gzipped, deflated or compressed with Brotli, otherwise just passes it through.

## Install

```sh
pnpm add decompress-response
```

## Usage

```ts
import http from 'node:http'
import decompressResponse from 'decompress-response'

http.get('https://sindresorhus.com', (response) => {
  response = decompressResponse(response)
})
```

## API

### decompressResponse(response)

Returns the decompressed HTTP response stream.

#### response

Type: [`http.IncomingMessage`](https://nodejs.org/api/http.html#http_class_http_incomingmessage)

The HTTP incoming stream with compressed data.

<!-- ![usage ends here] -->

<!-- badges links -->

[version-badge]: https://img.shields.io/npm/v/decompress-response.svg?logo=npm&style=flat-square
[package]: https://www.npmjs.com/package/decompress-response
[downloads-badge]: https://img.shields.io/npm/dm/decompress-response.svg?logo=npm&style=flat-square
[npmtrends]: http://www.npmtrends.com/decompress-response
[semantic-release]: https://semantic-release.gitbook.io/semantic-release/
[semantic-release-badge]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square
[coverage-badge]: https://img.shields.io/codecov/c/github/jimmy-guzman/decompress-response.svg?style=flat-square
[prettier-badge]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier]: https://github.com/prettier/prettier
