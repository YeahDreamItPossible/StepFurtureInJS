# worker_threads

Node 开启多线程

一. 属性

1. workder_threads.isMainThread

2. worker_threads.getEnviormentData(key)

3. worker_threads.setEnviormentData(key[, val])

4. worker_threads.parentPort

  主线程 与 工作线程通信

5. worker_threads.receiveMessageOnPort(port)

6. worker_threads.threadId

7. worker_threads.workerData

8. worker_threads.Worker

9. worker_threads.MessagePort

10. worker_threads.MessageChannel

```js
// main.js
const worker_threads = require('worker_threads')
const path = require('path')

const filename = path.join(process.cwd(), './worker.js')
const worker = new worker_threads.Worker(filename)

worker.on('online', () => console.log('online'))
worker.on('message', payload => console.log(payload))
worker.on('messageerror', err => console.log(err))
worker.on('error', err => console.log(err))
worker.on('exit', () => console.log('exit'))

// worker.js
const worker_threads = require('worker_threads')
worker_threads.parentPort.postMessage({
  done: true,
  name: 'Lee'
})
```