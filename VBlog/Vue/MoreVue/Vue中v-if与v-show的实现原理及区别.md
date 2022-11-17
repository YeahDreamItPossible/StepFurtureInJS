# Vue中v-if与v-show的实现原理及区别

## 前提: 条件渲染

在看这篇文章之前

需要大致了解这两个指令[条件渲染](https://cn.vuejs.org/v2/guide/conditional.html)的使用  

## 分析: 浏览器调试

先看下面的代码
```js
<div id="root">
  <p class="show" v-show="show">Show</p>
  <p class="ifExist" v-if="ifExist">ifExist</p>
  <button class="btn" @click.stop="onToggle">toggle</button>
</div>
<script>
  const initApp = () => {
    const app = new Vue({
      el: '#root',
      
      name: 'Root',

      data: {
        show: true,
        ifExist: true
      },

      methods: {
        onToggle () {
          this.show = !this.show
          this.ifExist = !this.ifExist
        }
      }
    })

    window._app = app
  }

  window.addEventListener('load', initApp)
</script>
```

当在浏览器打开这个html文件时 审查元素看到真实dom

![Alt show](https://github.com/YeahDreamItPossible/StepFurtureInJS/blob/main/Vue/Images/Advanced/dom_show.png)

当我们点击按钮后 再次审查元素

![Alt show](https://github.com/YeahDreamItPossible/StepFurtureInJS/blob/main/Vue/Images/Advanced/dom_hidden.png)

发现 

v-show指令 的元素新增了 style="display: none;" 属性

而 v-if指令 的元素则渲染成 注释节点

## 原理: 指令内部实现

当我们在浏览器中调试上文的html代码

在console中 将渲染函数(render) 打印出来  即: _app.$options.render

代码如下:

```js
(function anonymous() {
  with (this) {
    return _c('div', {
      attrs: {
          "id": "root"
      }
    }, [
    // v-show指令
      _c('p', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (show),
        expression: "show"
      }],
      staticClass: "show"
    }, [_v("Show")]), 
    _v(" "), 
    // v-if指令
    (ifExist) ? _c('p', {
      staticClass: "ifExist"
    }, [_v("ifExist")]) : _e(), 
    _v(" "), 
    _c('button', {
      staticClass: "btn",
      on: {
        "click": function($event) {
          $event.stopPropagation();
          return onToggle.apply(null, arguments)
        }
      }
    }, [_v("toggle")])])
  }
})
```

可以发现:

其实 v-if指令 在render函数中 实质上是三元表达式 根据条件动态渲染

(_c函数是将该ast渲染成vnode, _v函数是渲染成文本vnode, _e函数是渲染成空vnode)

而 v-show指令 则是动态添加 style="display: none;" 属性

最后放一张官网两个api的对比来更好的理解吧～

![Alt 对比](https://github.com/YeahDreamItPossible/StepFurtureInJS/blob/main/VBlog/Images/Vue/MoreVue/v_if_%26_v_show.jpg)

## 备注:

  * a. 以上展示的代码为伪代码,部分功能并未完全实现，具体场景还可能需要读者去实现

  * b. 由于个人能力的原因，本文可能会存在一定的错误，如有理解错误的地方还望读者选择性阅读及及时指出