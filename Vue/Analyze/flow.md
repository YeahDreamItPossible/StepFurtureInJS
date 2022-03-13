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
    合并策略的代码写的有点low

10. initState
    顺序 props => methods => data => compute => watch

    initProps时  非根实例 toggleObverving(false)
        defineReactive(props, key, value)

    initData obverse(data, true)

    initComputed Object.defineProperty(target, key, {
        sharedPropertyDefinition: {
            get: // 重写 getter 函数
        }
    })

    initWatch

11. watcher computed

    相同:

        1. 都是响应式的 watcher computed 都是Watcher 的实例

        2. 都是依赖 某个响应式数据的

        3. 

    不同:

        1. watcher 只有 setter 函数, 而 computed 只有 getter 函数

        2. watcher 只要依赖变化后 会 立即update, 而 computed 只有 调用 渲染watcher 时 即 render 函数时才会去 update
        即: computed 是惰性的 lazy = true


12. $vnode 与 _vnode 区别

    $vnode 应用组件

    _vnode 所有节点

13. _app.$options.render 函数

    function anonymous () {
        with (this) {
            _c('', {}, [])
        }
    }

    _c:
    _v: createTextVNode
    _e: createEmptyNode // 注释节点 node.isComment = true
    _m: renderStatic // 渲染静态节点
    _f: resolveFilter // 过滤器

    _s: toString
    _n: toNumber

    _q: looseEqual // compare(a, b)
    _i: looseIndexOf // findIndexInArray

    _l: renderList // renderList(list, function (item, index) {_c()})
    _t: renderSlot
    _u: resolveScopedSlots // resolveScopedSlots(fns)

    // TODO:
    _o: markOnce
    _k: checkKeyCodes
    _b: bindObjectProps
    _g: bindObjectListeners
    _d: bindDynamicKeys
    _p: prependModifier


    // 解释
    _s: Object.prototype.toString.call(unknown).slice(8, -1)