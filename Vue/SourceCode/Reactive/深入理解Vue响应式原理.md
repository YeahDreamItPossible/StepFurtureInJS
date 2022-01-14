# 深入理解Vue响应式原理

## 前提
在深入理解Vue响应式原理之前，需要具备的技能:
1. ES5语法:
  * 引用数据类型之间的相互引用
  * Javascript中提供的Api: Object.defineProperty
  * 闭包（实质上是函数,提供了访问内部变量的接口）
2. ES6
  * 类Class（类的静态属性、方法和实例属性、方法的区别）
  * 代理Proxy
3. 设计模式
  * 发布订阅模式（发布订阅模式和观察者模式的区别）

先看一段代码 来理解一些基础知识
```js
// 先理解引用数据类型之间相互引用
cosnt dep = {
	name: 'dep',
  watcher: null
}

const watcher = {
	name: 'watcher',
  dep: null
}

dep.watcher = watcher
watcher.dep = dep
```
```js
// 理解 Object.defineProperty 以及 descriptor 对象
// descriptor {configurable, enumerable, writable, value, getter, setter}
const descriptor = {
	configurable: true,
  enumerable: true,
  get () {
  	return value
 	},
  set (newValue) {
  }
```

## 原理

## 结论