# vue3源码研究记录

## vue.compile内部原理

- 先是将template 转换成ast (parse阶段/解析)

- 对ast 进行优化 (transform阶段/优化)

- 将ast 代码生成(生成内部code函数)

- 结合上下文(context) 生成render函数(该render用来生成vnode) 类似于h函数

## h函数内部原理

- 

## render函数内部原理

