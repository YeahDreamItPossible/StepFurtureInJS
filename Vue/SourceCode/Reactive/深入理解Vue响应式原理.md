# 深入理解Vue响应式原理

## 一. 前提
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
  enumerable: truem
  get () {
    return value
  },
  set (newValue) {}
}
```

## 二. 原理

### 1. 哪些选项在Vue内部会被转化为响应式的
在Vue选项中以下属性是会被转换为响应式的
  * data
  * props
  * computed
  * watch
  * provide/inject

### 2. 这些选项在什么时机被转换的呢
当我们执行下面代码时
```js
new Vue({ /** 选项 **/ })
```
本质上就是调用Vue.prototype._init方法
```js
// 代码简化
Vue.prototype._init = function (Object) {
    const vm = this
    vm._uid = uid++

    let startTag, endTag
    vm._isVue = true
    // 选项合并
    if (options && options._isComponent) {
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    
    vm._self = vm
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    // 请注意 initInjections initState initProvide 函数
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
```
在生命周期beforeCreate触发之后, created生命周期触发之前调用以下三个方法
```js
initInjections
initState
initProvide
```
先看 initInjections方法
```js
// 代码简化
function initInjections (vm: Component) {
  const result = resolveInject(vm.$options.inject, vm)
  if (result) {
    toggleObserving(false)
    Object.keys(result).forEach(key => {
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        defineReactive(vm, key, result[key], () => {
          warn(
            `Avoid mutating an injected value directly since the changes will be ` +
            `overwritten whenever the provided component re-renders. ` +
            `injection being mutated: "${key}"`,
            vm
          )
        })
      } else {
        defineReactive(vm, key, result[key])
      }
    })
    toggleObserving(true)
  }
}
```

```js
function initProvide (vm: Component) {
  const provide = vm.$options.provide
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide
  }
}
```



## 三. 结论
Vue的响应式原理可大致分为两步
  1. 利用Object.defineProperty对用户传入的数据选项进行<u>**数据劫持**</u>
  2. 当用户获取数据的时候会触发getter函数 <u>**收集依赖**</u>，变更数据的时候会触发setter函数 <u>**派发依赖**</u> 更新Dom