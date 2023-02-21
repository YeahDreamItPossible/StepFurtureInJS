# vue3源码研究记录

## vue.compile内部原理

- 先是将template 转换成ast (parse阶段/解析)

- 对ast 进行优化 (transform阶段/优化)

- 将ast 代码生成(生成内部code函数)

- 结合上下文(context) 生成render函数(该render用来生成vnode) 类似于h函数

## h函数内部原理

- 

## render函数内部原理

## 响应式api 区别

### ref

返回 RefImpl 的实例

```js
function createRef(rawValue: unknown, shallow: boolean) {
  if (isRef(rawValue)) {
    return rawValue
  }
  return new RefImpl(rawValue, shallow)
}
```

```js
class RefImpl<T> {
  private _value: T
  private _rawValue: T

  public dep?: Dep = undefined

  // NOTE: 作为 isRef 的判断条件
  public readonly __v_isRef = true

  constructor(value: T, public readonly __v_isShallow: boolean) {
    this._rawValue = __v_isShallow ? value : toRaw(value)
    this._value = __v_isShallow ? value : toReactive(value)
  }

  get value() {
    // TODO: 收集依赖
    trackRefValue(this)
    return this._value
  }

  set value(newVal) {
    newVal = this.__v_isShallow ? newVal : toRaw(newVal)
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal
      this._value = this.__v_isShallow ? newVal : toReactive(newVal)
      // TODO: 派发依赖
      triggerRefValue(this, newVal)
    }
  }
}
```

```js
function ref(value?: unknown) {
  return createRef(value, false)
}
```

### shallowRef

```js
function shallowRef(value?: unknown) {
  return createRef(value, true)
}
```



### isRef

是通过 判断 RefImpl 实例的只读属性__v_isRef 是否为true

```js
function isRef(r: any): r is Ref {
  return !!(r && r.__v_isRef === true)
}
```

### unref

```js
function unref<T>(ref: T | Ref<T>): T {
  return isRef(ref) ? (ref.value as any) : ref
}
```


### toRefs

### toRef

### reactive

### shallowReactive

### isReactive

### isReadonly

### isShallow

### isProxy

### toRaw