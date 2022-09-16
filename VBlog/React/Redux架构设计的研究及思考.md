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

  1. 单一数据源（数据的流向是单向的 图中红色标记的线条）

    整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 store 中。


  2. State 是只读的 （状态的获取只能通过特定的方式）

    state是只读的, 只能通过getState获取satte。唯一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象(也可以理解为数据突变的源头)。

  3. 使用纯函数来执行修改 （状态的变更也只能通过特定的方式）

    为了描述 action 如何改变 state tree ，你需要编写 reducers。(reducer 函数记录了数据突变的整个过程)

## 思考

  Redux 作为一个经典久而不衰的状态管理库，源码虽然简单，但是功能确实非常强大。更重要的是，其底层的设计思想确实非常棒的。

  但是呢

  在我仔细研究源码后，结合工作中的使用体验，也发现了一些设计上的小问题。

  1. state 的变更只能是同步的

    可以通过插件(redux-thunk redux-promise) 通过增强dispath 方式实现

    
    
    ![Alt redux_api](https://github.com/YeahDreamItPossible/StepFurtureInJS/blob/dev_0.1.0/VBlog/Images/redux_apply_middleware.png)

  2. 一个reducer 对应 一个state
  
    故 reducer 只能变更某个特定的state， 这样的好处就是 保证 state 的变更是由单个突变引起的

  3. state 的存储是非持久性的

    有时候我们的token 或者用户信息需要持久存储 需要自己封装插件(如 db)实现某些数据的读写是持久性的

  4. state 变更过程的检测不够强大

    如 state 的变更 

    
    如图

    ![Alt redux_api](https://github.com/YeahDreamItPossible/StepFurtureInJS/blob/dev_0.1.0/VBlog/Images/redux_dispatch.jpeg)




  作为一个状态管理的库，得具备以下特征：

    * 获取状态

    * 修改状态

    * 监听状态

  那么 redux 结合我们平时开发 还应该具备哪些能力呢

    * 状态变更 可同步 可异步

    * 状态变更 可依赖别的状态 惰性变更

    * 状态的存储 可持久

    * 状态的监听 更加颗粒化

  