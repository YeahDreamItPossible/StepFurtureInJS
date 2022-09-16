# Redux 架构设计的研究及思考

## 序言

  研读Redux的目的：

  * 理解Redux的设计原理 更好的使用API

  * 功能扩展 实现某些个性化需求

  * 提升个人能力

  * ...

  这次研究redux的版本为v4.2.0，版本v5以上已经用ts重构，个人ts水平一般，故选择v4版本。

  [源码按行研读注解](https://github.com/YeahDreamItPossible/StepFurtureInJS/tree/main/SourceCode/Redux/v4.2.0)(仅供参考)

  [Redux 结合 React 简易版TODOLIST](https://github.com/YeahDreamItPossible/StepFurtureInJS/blob/main/SourceCode/Redux/v4.2.0/demo/index.html)(redux@4.2.0 + react@18.0.0)


## Redux设计架构

### Redux API

  结合源码 对Redux API总结

  如图所示：

![Alt redux_api](https://github.com/YeahDreamItPossible/StepFurtureInJS/blob/dev_0.1.0/VBlog/Images/redux_api.png)

### 设计架构

  反复研读源码后，结合个人理解，整理的架构图：

  [简易版](https://github.com/YeahDreamItPossible/StepFurtureInJS/blob/dev_0.1.0/VBlog/Images/redux_arch.png)

  ![Alt redux_arch](https://github.com/YeahDreamItPossible/StepFurtureInJS/blob/dev_0.1.0/VBlog/Images/redux_arch.png)

  [复杂版](https://github.com/YeahDreamItPossible/StepFurtureInJS/blob/dev_0.1.0/VBlog/Images/redux_deprecated_arch.png)

  ![Alt redux_deprecated_arch](https://github.com/YeahDreamItPossible/StepFurtureInJS/blob/dev_0.1.0/VBlog/Images/redux_deprecated_arch.png)

  根据官网描述，结合架构图来更好理解设计理念：

  1. 单一数据源

    整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 store 中。


  2. State 是只读的

    state是只读的, 只能通过getState获取satte。唯一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象(也可以理解为数据突变的源头)。

  3. 使用纯函数来执行修改

    为了描述 action 如何改变 state tree ，你需要编写 reducers。(reducer 函数记录了数据突变的整个过程)

## 思考


  作为一个状态管理的库，得具备以下特征：

    * 获取状态

    * 修改状态

    * 监听状态

  那么 redux 结合我们平时开发 还应该具备哪些能力呢

    * 状态变更 可同步 可异步

    * 状态变更 可依赖别的状态 惰性变更

    * 状态的存储 可持久

    * 状态的监听 更加颗粒化

  