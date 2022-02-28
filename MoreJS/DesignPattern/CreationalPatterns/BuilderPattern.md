# 建造者模式

## 定义

使用多个简单的对象一步一步构建成一个复杂的对象

## 应用

visitor  <= => director  -> builder -> Part

```js
class Director {
  constructor (options) {
    this.builder = new Builder()
  }
}

class Builder {
  constructor () {
    this.buildPartOne()
    this.buildPartTwo()
  }

  buildPartOne () {
  }

  buildPartTwo () {}
}

class Part {}
```