# events

一. 属性

1. events.defaultMaxListeners

2. events.errorMonitor

3. events.captureRejections

4. events.EventEmitter

二. 方法

1. events.on(emitter, eventName[, options]) // AsyncIteraotr

2. events.once(emitter, name[, options]) // Promise

3. events.listenerCount(emitter, eventName)

4. events.setMaxListeners()

5. events.getEventListeners(emitterOrTarget, eventName)

```js
const events = require('events')
```

三. EventEmitter

1. newListener 事件

2. removeListener 事件

3. emitter.on(eventName, listener) or emitter.addListener(eventName, listener)

4. emitter.once(eventName, listener) 

5. emitter.prependListener(eventName, listener)

6. emitter.prependOnceListener(eventName, listener)

7. emitter.off(eventName, listener) or emitter.removeListener(eventName, listener)

8. emitter.removeAllListeners([eventName])

9. emitter.getMaxListeners()

10. emitter.setMaxListeners(n)

11. emitter.rawListeners(eventName)