# stream

所有的流 都是 EventEmitter 的实例

## 可写流

stream.Writable

监听事件: ['pipe', 'unpipe', 'drain', 'error', 'finish', 'close']

writable.destory([error])

writable.setDefaultEncoding(encoding)

writable.write(chunk[, encoding][, callback])

writable.end([chun[, encoding]][, callback])

writable.cork()

writable.uncork()

## 可读流

stream.readable

监听事件: ['data', 'pipe', 'pause', 'resume', 'readable','error', 'close', 'end']

readable.setDefaultEncoding(encoding)

readable.read([size])

readable.pause()

readable.isPaused()

readable.resume()

readable.pipe()
