# Vue中高阶组件的定义及应用

## 前提: 高阶函数

在学习Vue高阶组件的应用前提,

我们先了解下JavaScript中的高阶函数定义：

  * a.接受一个或者多个函数作为参数
  
  * b.返回一个函数

下面看这段代码, 大致理解下高阶函数

代码块:
```js
// 代码简化
const comparator = (a, b) => a.id === b.id

const createEqualFn = comparator => {
  comparator = comparator || (a, b) => a === b
  return function equal (a, b) {
    return comparator(a, b)
  }
}
const equal = createEqualFn(comparator)

const p1 = {
  id: 1,
  name: 'P1'
}
const p2 = {
  id: 1,
  name: 'P1'
}
console.log(equal(p1, p2))
```

以下代码大致是Vue.compile内部实现原理, 了解即可
```js
// 以下代码简化
// 模版解析
const parse = (template, options) => ast

// ast优化
const optimize = (ast, options) => ast

// 生成render函数
const generate = (ast, options) => ({
  render () {}
})

// 合并选项
const mergeOptions = (baseOptions, options) => ({/* 合并之后的options */})

const baseCompile = (template, options) => {
  const ast = parse(template, options)
  if (/* 默认开启压缩 */) {
    optimize(ast, options)
  }
  const render = generate(ast, options)
  return ast
}

// 高阶函数
const createCompilerCreator = baseCompile => {
  return function createCompiler (baseOptions) {
    function compile (template, options) {
      const finalOptions = mergeOptions(baseOptions, options)
      return { baseCompile(template, finalOptions)}
    }

    return {
      compile
    }
  }
}
```

对于高阶函数的优点及应用 可以自行了解与掌握

## 定义: Vue中高阶组件的定义

在vue单文件组件中(vue-cli搭建的项目)

当我们import组件时

实质上是经过vue-loader加载处理之后的一个Object实例

如图所示:

![Alt sfc](https://github.com/YeahDreamItPossible/StepFurtureInJS/blob/main/Vue/Images/Advanced/sfc.png)

所以以此类推，vue中的高阶组件则应该定义为:

  * a. 接受一个对象(该对象属性是vue中定义的opions选项的对象)
  * b. 返回一个对象(该对象是对参数对象进行加工处理之后的对象)

## 核心: 粗略定义一个通用的Vue高阶组件

下面代码可能需要了解[渲染函数](https://cn.vuejs.org/v2/guide/render-function.html#%E6%B7%B1%E5%85%A5%E6%95%B0%E6%8D%AE%E5%AF%B9%E8%B1%A1)的知识

代码中的h函数(渲染函数, 功能是将模板渲染成vnode)内部是 createElement函数

也可以代指是 vm._c

只不过是 区分某些环境(暂不详述)

```js
function ComponentWrapper (BaseComponent) { 
  return { 
    name: 'ComponentWrapper’, 
    props: BaseComponent.props, 
    render (h) { 
      return h(
        BaseComponent, 
        { 
          on: this.$listeners, 
          attrs: this.$attrs, 
          props: this.$props, 
          refs: this.$refs, 
          slots: this.$slots, 
          scopedSlots: this.$scopedSlots 
        }
      ) 
    } 
  } 
}
```

## 扩展: React高阶组件及应用场景

[React中的高阶组件应用可以参考资料:](https://zhuanlan.zhihu.com/p/61711492?utm_source=wechat_session)

个人觉得还是写的很不错的！

## 应用: 平时工作中的使用

当我们在使用element-ui进行开发时

时常会因为某些组件功能无法满足我们当前的业务需求而需要二次封装

而我们在封装的时候最好要满足以下两点

  * 1. 完全兼容该组件的所有api支持

  * 2. 在兼容基础上 扩展新的功能

下面以el-input组件为例

```js
// BaseInput.js
import { Input } from 'element-ui'

const InputWrapper = Input => ({
  name: 'BaseInput',

  props: {
    ...Input.props,
    // 扩展新的props
    formatter: {
      type: String,
      required: false
    },
    format: {
      type: RegExp,
      required: false
    }
  },

  data () {
    return {
      inputedValue: ''
    }
  },
  
  mounted () {
    this.inputedValue = this.value
  },

  methods: {
    onInput (value) {
      this.inputedValue = this.formatInputedValue(value)
      // @hack: 为了满足 input组件在table组件下的使用
      this.$emit('input', this.inputedValue)
    },

    formatInputedValue (value) {
      const formatFn = this.getFormatterMap(this.formatter)
      return formatFn(value)
    },

    // 简单formatter
    getFormatterMap (formatter) {
      const _toStrinig = String.prototype.toString
      const formatterMap = {
        trim (value) {
          return _toStrinig.call(value).trim()
        },
        trimLeft (value) {
          return _toStrinig.call(value).trimLeft()
        },
        trimRight (value) {
          return _toStrinig.call(value).trimRight()
        },
        phone (value) {
          return value.replace(/\D/g, '')
        },
        default (value) {
          return value
        }
      }

      return formatterMap[formatter] || formatterMap['default']
    }
  },

  render (h) {
    return (
      h(Input, {
        on: {
          ...this.$listeners,
          input: this.onInput
        }, 
        attrs: this.$attrs, 
        props: {
          ...this.$props,
          value: this.inputedValue
        }, 
        refs: this.$refs, 
        slots: this.$slots, 
        scopedSlots: this.$scopedSlots
      })
    )
  }
})

export default InputWrapper(Input)
```

## 备注:
  * a. 以上展示的代码为伪代码,部分功能并未完全实现，具体场景还可能需要读者去实现
  
  * b. 由于个人能力的原因，本文可能会存在一定的错误，如有理解错误的地方还望读者选择性阅读及及时指出