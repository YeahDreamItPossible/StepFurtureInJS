# Vue中函数式组件的原理及应用

## 前提: 组件基础

在看这篇文章之前

需要大致了解下[组件基础](https://cn.vuejs.org/v2/guide/components.html)和[动态组件&异步组件](https://cn.vuejs.org/v2/guide/components-dynamic-async.html)

## 分类: Vue中组件的分类

在Vue中组件大致有这么几种
  * a. 全局组件
  * b. 局部组件
  * c. 动态组件(is)
  * d. 异步组件()
  * e. 函数式组件(RouterView)
  * f. 抽象组件(KeepAlive)

大致介绍下

函数式组件中的选项 functional 为 true, 不会创建 VueComponent 的实例

抽象组件中的选项 abstract 为 true

两者的区别暂不详述(稍后会在源码中进行分析)

## 定义: Vue函数式组件的定义

关于函数组件的定义

我们先看官网对函数式组件的描述:

![Alt functional](https://github.com/YeahDreamItPossible/StepFurtureInJS/blob/main/Vue/Images/Advanced/functional.png)

从以上描述可以了解到,

函数式组件相对于普通组件,

无状态，也没有this上下文，数据来源均来源props或attrs

再接着看官网对 函数式组件 的进一步描述

![Alt functional_strongger](https://github.com/YeahDreamItPossible/StepFurtureInJS/blob/main/Vue/Images/Advanced/functional_strongger.png)

## 应用:

## 扩展:

## 备注:

  * a. 以上展示的代码为伪代码,部分功能并未完全实现，具体场景还可能需要读者去实现

  * b. 由于个人能力的原因，本文可能会存在一定的错误，如有理解错误的地方还望读者选择性阅读及及时指出