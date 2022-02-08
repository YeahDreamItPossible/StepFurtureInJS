# 装饰者模式

## 定义

允许向一个现有的对象添加新的功能，同时又不改变其结构

## 应用

```js
class OriginalObject {
  constructor (name) {
    this.name = name
  }

  doSomething () {
    console.log('OriginalObject.doSomething')
  }
}


class Decorator {
  constructor (object) {
    this.object = object
  }

  doSomething () {
    this.object.doSomething && this.object.doSomething()
  }

  // 装饰方法
  doAnother () {
    console.log('Decorator.doAnother')
  }
}
```