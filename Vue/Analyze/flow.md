# flow

根据不同的环境打包时

完整版:  Runtime + Compiler

Runtime: 

TODO:

1. Vue.compile 

2. initLifecycle 构建父子关系时 注意 abstract

3. _hasHookEvent 意义何在?
    callHook 时判断 hooks 是否存在

4. _isBeingDestroyed _isDestroyed
    在调用 $destroy 时 锁定状态

5. _vnode $vnode 区别

6. $destory 原理

7. _installedPlugins 插件数组

8. initInjections 时 toggleObverving(false) 为什么

9. mergeOptions 先格式化参数
    normalizeProps
    normalizeInject
    normalizeDirectives

  合并策略