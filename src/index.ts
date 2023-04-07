/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  Transform as TransformStream,
  PassThrough as PassThroughStream,
} from 'stream'
import zlib from 'zlib'

import mimicResponse from 'mimic-response'

import type { IncomingMessage, IncomingHttpHeaders } from 'http'

export interface UncompressedIncomingHttpHeaders extends IncomingHttpHeaders {
  'content-encoding'?: never
}

export interface UncompressedIncomingMessage extends IncomingMessage {
  headers: UncompressedIncomingHttpHeaders
}

/**
Decompress a HTTP response if needed.
@param response - The HTTP incoming stream with compressed data.
@returns The decompressed HTTP response stream.
@example
```
import http from 'http';
import decompressResponse from '@jimmy-guzman/decompress-response';
http.get('https://sindresorhus.com', response => {
	response = decompressResponse(response);
});
```
*/
// eslint-disable-next-line max-lines-per-function, @typescript-eslint/explicit-module-boundary-types
export default function decompressResponse(response: IncomingMessage) {
  const contentEncoding = (
    response.headers['content-encoding'] ?? ''
  ).toLowerCase()

  if (!['gzip', 'deflate', 'br'].includes(contentEncoding)) {
    return response
  }

  delete response.headers['content-encoding']

  let isEmpty = true

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleContentEncoding(data: any) {
    const decompressStream =
      // eslint-disable-next-line no-nested-ternary
      contentEncoding === 'br'
        ? zlib.createBrotliDecompress()
        : contentEncoding === 'deflate' &&
          data.length > 0 &&
          (data[0] & 0x08) === 0 // eslint-disable-line no-bitwise
        ? zlib.createInflateRaw()
        : zlib.createUnzip()

    decompressStream.once('error', (error) => {
      if (isEmpty && !response.readable) {
        finalStream.end()
        return
      }

      finalStream.destroy(error)
    })

    checker.pipe(decompressStream).pipe(finalStream)
  }

  const checker = new TransformStream({
    transform(data, _encoding, callback) {
      if (!isEmpty) {
        callback(null, data)
        return
      }

      isEmpty = false

      handleContentEncoding(data)

      callback(null, data)
    },

    flush(callback) {
      callback()
    },
  })

  const finalStream = new PassThroughStream({
    autoDestroy: false,
    destroy(error, callback) {
      response.destroy()

      callback(error)
    },
  })

  mimicResponse(response, finalStream)
  response.pipe(checker)

  return finalStream
}
