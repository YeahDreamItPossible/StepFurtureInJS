# Redux 架构设计的研究及思考

## 序言

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;个人觉得研读源码是理解作者设计逻辑和提高水平的最好方法。

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这次研究redux的版本为v4.2.0，版本v5以上已经用ts重构，个人ts水平一般，故选择v4版本。

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[源码按行研读注解](https://github.com/YeahDreamItPossible/StepFurtureInJS/tree/main/SourceCode/Redux/v4.2.0)(仅供参考)


  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Redux 结合 React 简易版TODOLIST](https://github.com/YeahDreamItPossible/StepFurtureInJS/blob/main/SourceCode/Redux/v4.2.0/demo/index.html)(redux v4.2.0 + react v18.0.0)


## Redux架构

### api总结

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Redux API:

  ```javascript  

      createStroe
          
      combineReducers

      bindActionCreators

      applyMiddleware

      compose

  ```

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Store API:

  ```javascript

      getState

      dispatch

      subscribe

      replaceReducer

      $$observable

  ```

  如图所示：

![Alt redux_api](https://github.com/YeahDreamItPossible/StepFurtureInJS/blob/dev_0.1.0/VBlog/Images/redux_api.png)

### 设计架构

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;反复研读源码后结合个人理解整理的架构图：

![Alt redux_arch](https://github.com/YeahDreamItPossible/StepFurtureInJS/blob/dev_0.1.0/VBlog/Images/redux_arch.png)


  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;根据官网描述，结合架构图来更好理解设计理念：

  1. 单一数据源

    整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 store 中。


  2. State 是只读的

    state是只读的, 只能通过getState获取satte。唯一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象(也可以理解为数据突变的源头)。

  3. 使用纯函数来执行修改

    为了描述 action 如何改变 state tree ，你需要编写 reducers。(reducer 函数记录了数据突变的整个过程)

## 思考