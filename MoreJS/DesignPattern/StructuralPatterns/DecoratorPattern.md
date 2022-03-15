# 装饰者模式

## 定义

允许向一个现有的对象添加新的功能，同时又不改变其结构

## 源码

```js
```

## 应用

在平时开发项目中时

经常会遇到这样的问题

重复请求(当我们新增数据时 如果用户手速过快时 数据库可能新增两条相同的数据)

此时

可以利用拦截功能

在请求开始前 缓存此请求

在请求结束后 清除此请求

```js
```

```js
class RequestMap {
  constructor () {
    this.cache = new Map()
  }

  has (key) {
    return this.cache.has(key)
  }

  get (key) {
    if (!this.has(key)) {
      return
    }
    return this.cache.get(key)
  }

  set(key, val) {
    this.cache.set(key, val)
    return this
  }

  delete (key) {
    if (this.has(key)) {
      return true
    }
    try {
      this.cache.delete(key)
      return true
    } catch (e) {
      // Warn
      return false
    }
  }

  clear () {
    this.caceh.clear()
  }
}

```

```js
class RequestMapDecorator {
  constructor (requestMap) {
    this.requestMap = requestMap
    this.timers = {}
  }

  // 容量检测
  static MAX_CAPACITY = 20

  // 延时时间
  static DELAY_TIME = 600

  serializer (config) {
    let key = `${config.method || 'get'}:${config.url}?`;
    try {
      if (config.params) {
        key += obj2Str(config.params);
      }
      if (config.data) {
        key += obj2Str(config.data);
      }
    } catch (e) {
      // Warn
    }
    return key
  }

  has (config) {
    let key = this.serializer(config)
    return this.requestMap.has(key)
  }

  get (config) {
    let key = this.serializer(config)
    return this.requestMap.get(key)
  }

  set (config) {
    let key = this.serializer(config)
    if (!this.requestMap.has(key)) {
      this.requestMap.set(key, true)
    }
    return this
  }

  keys () {
    return Object.keys(this.requestURLMap).filter(key => !this.requestURLMap.get(key))
  }

  size () {
    return this.keys().length
  }

  checkCapacity () {
    const size = this.size()
    const capacity = this.constructor.MAX_CAPACITY
    if (size >= capacity) {
      this.keys().forEach(key => this.delete(key))
    }
  }
}
```

## 参考:

  * 1. [https://refactoringguru.cn/design-patterns/decorator](https://refactoringguru.cn/design-patterns/decorator)

  * 2. [https://www.runoob.com/design-pattern/adapter-pattern.html](https://www.runoob.com/design-pattern/adapter-pattern.html)

## 备注:
  * a. 以上展示的代码为伪代码,部分功能并未完全实现，具体场景还可能需要读者去实现
  
  * b. 由于个人能力的原因，本文可能会存在一定的错误，如有理解错误的地方还望读者选择性阅读及及时指出