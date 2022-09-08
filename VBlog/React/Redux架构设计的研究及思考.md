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



## 思考