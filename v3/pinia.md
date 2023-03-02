# Pinia

- $reset 方法底层原理?

  - 该方法 在options选项配置 可以调用
  
  - 该方法 在函数式配置是个接口 需要自定义实现(原因可能是函数返回的Object 虽然可以区分state和action 但是我估计懒得搞了)

- subscribe 底层实现原理

  MutationType 枚举

    - direct = 'direct'

    - patchObject = 'patch object'

    - patchFunction = 'patch function'

  在有subscribe mutation时
   
    - 如果是通过$patch修改状态, 参数是 Object 时 此时mutation type 是 MutationType.patchObject

    - 如果是通过$patch修改状态, 参数是 Function 时 此时mutation type 是 MutationType.patchFunction

    - 如果是直接修改state, 此时mutation type 是 MutationType.direct

  且 $patch 的方式都是手动调用 监听队列

  而 直接暴利修改 则是通过 watch 监听来执行回掉函数


- onAction 底层实现原理


  