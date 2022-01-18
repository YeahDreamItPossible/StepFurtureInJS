# Vue中函数式组件的原理及应用

## 前提: 组件基础 与 JSX

在看这篇文章之前

需要大致了解下[组件基础](https://cn.vuejs.org/v2/guide/components.html)和[动态组件&异步组件](https://cn.vuejs.org/v2/guide/components-dynamic-async.html)

另外还要了解下[JSX](https://react.docschina.org/docs/introducing-jsx.html)(Vue中的JSX相对于React是弱化版的,只是为了react用户适应)

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

抽象组件中的选项 abstract 为 true, 会创建 VueComponent 的实例

两者的区别暂不详述(稍后会在源码中进行分析[Vue组件详解TODO]())

## 定义: Vue函数式组件的定义

关于函数组件的定义

我们先看官网对函数式组件的描述:

![Alt functional](https://github.com/YeahDreamItPossible/StepFurtureInJS/blob/main/Vue/Images/Advanced/functional.png)

从以上描述可以了解到,

函数式组件相对于普通组件,

无状态，也没有this上下文，数据来源均来源props或attrs

再接着看官网对 函数式组件 的进一步描述

![Alt functional_strongger](https://github.com/YeahDreamItPossible/StepFurtureInJS/blob/main/Vue/Images/Advanced/functional_strongger.png)

一定请注意: 

函数式组件在解析时会注入一个 context 

这个context 是 FunctionalRenderContext

这个构造函数中 存储着该组件的 props data children parent

至于更具体的内容会在源码[名字暂时没想好TODO](https://github.com/YeahDreamItPossible/StepFurtureInJS/blob/main/Vue/Advanced/Vue%E4%B8%AD%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6%E7%9A%84%E5%8E%9F%E7%90%86%E5%8F%8A%E5%BA%94%E7%94%A8.md)文章详细解释

除了能提高性能，那函数式组件还有什么其他更好的应用吗?!!!

![Alt functional_strongger](https://github.com/YeahDreamItPossible/StepFurtureInJS/blob/main/Vue/Images/Advanced/functional_2.png)

## 应用: 平时工作中的使用

当我们在使用elementUI中的el-table组件和el-pagination的时候

是不是觉得有些繁琐

能不能想antd中的表格Tale组件一样 可配置呢?

答案是当然可以的啦~

利用函数式组件和JSX就可以解决~

首先
### 1. 二次封装
1.1 封装TableColumn组件
```js
// TableColumnFactory.js
import { TableColumn } from 'element-ui'

// 注意: ctx 就是上文中所说的 FunctionalRenderContext
const TableColumnFactory = (ctx) => {
  return (
    <TableColumn { ...ctx } />
  )
}

export default TableColumnFactory
```

1.2. 封装Table组件
```js
// TableFactory.js
import { Table } from 'element-ui'
import TableColumnFactory from './TableColumnFactory'

const TableFactory = (ctx) => {
  const { 
    listeners = {},
    props = {},
  } = ctx
  
  const { 
    columns = [] // 请注意columns属性
  } = props

  const TableColumns = columns.map((item, idx) => {
    const context = {
      props: { ...item }
    }

    if (item.render) {
      context.scopedSlots = {
        default: scope => {
          // h函数在高版本中函数式组件会自动注入,需要传递给自定义render函数
          // TableColumn 内部允许自定义 render 函数 而且会传递 内部合成的作用域对象
          return item.render.bind(h)(scope)
        }
      }
    }

    return (
      <TableColumn { ...context } />
    )
  })

  const onSelectionChange = (selection) => {
    listeners.selectionChange && listeners.selectionChange(selection)
  }

  return (
    <div class="tableContainer" id="tableContainer">
      <Table 
        {...ctx} 
        onSelection-change={onSelectionChange}>
        { TableColumns }
      </Table>
    </div>
  )
}

export default TableFactory
```

1.3. 封装ElPagination组件
```js
// BasePagination.js
import { Pagination} from 'element-ui'

// 全局默认的el-pagination配置
function getDefaultOptions () {
  return {
    background: true,
    layout: 'total, sizes, prev, pager, next, jumper',
    total: 0
  }
}
const defaultOptions = getDefaultOptions()

const PaginationFactory = ctx => {
  const {
    props = {},
    listeners = {}
  } = ctx
  
  const { paginationOptions = {} } = props
  const options = Object.assign({}, defaultOptions, paginationOptions)

  const onSizeChange = (pageSize) => {
    onPageChange({
      type: 'PageSize',
      pageSize
    })      
  }

  const onCurrentChange = (currentPage) => {
    onPageChange({
      type: 'CurrentPage',
      currentPage
    })
  }

  // 事件合并
  const onPageChange = (payload) => {
    listeners.pageChange && listeners.pageChange({ ...payload })
  }

  return (
    <div class="paginationContainer" id="paginationContainer">
      <Pagination
        background={options.background}
        onSize-change={onSizeChange}
        onCurrent-change={onCurrentChange}
        currentPage={options.currentPage}
        page-sizes={options.pageSizes}
        layout={options.layout}
        total={options.total}
      />
    </div>
  )
}

export default PaginationFactory
```

1.4. 将Table组件和ElPagination组件组合 封装成TableLayout组件
```js
import TableFactory from './TableFactory'
import PaginationFactory from './PaginationFactory'

// 自定义样式
import './index.scss'

const BaseTableLayout = ctx => {
  const { 
    listeners = {},
    props = {},
    scopedSlots = {}
  } = ctx

  const { 
    data = [],
    columns = [],
    pagination = {},
  } = props

  const onSelectionChange = (selection) => {
    listeners.selectionChange && listeners.selectionChange(selection)
  }

  const onPageChange = (payload) => {
    listeners.pageChange && listeners.pageChange(payload)
  }
  
  return (
    // id="tableLayout" 是为了在table请求做局部加载
    <div class="tableLayout" id="tableLayout">
      <div class="tableContainer" id="tableContainer">
        <TableFactory 
          { ...ctx } 
          onSelectionChange={onSelectionChange}
        />
      </div>
      {
        pagination ? (
          <div class="tablePaginationContainer" id="tablePaginationContainer">
            <PaginationFactory 
              paginationOptions={pagination}
              onPageChange={onPageChange}/>
          </div>
        ) : null
      }
    </div>
  )
}

export default BaseTableLayout
```

### 2. 使用

新建Table目录

2.1 先配置表格

```js
// columns.js
// 代码简化
export default [
  // 支持TableColumn 组件所有的API, 并新增 render api用于个性化渲染自定义组件
  {
    label: '接口名称',
    prop: 'name',
  },
  {
    label: '状态',
    prop: 'status',
    render: 'ColorText'  // render 指的是 下文中的自定义个性化组件
  },
  {
    label: '操作',
    width: '200',
    render: 'ActionGroup'
  }
]
```

2.2 自定义个性化组件 如: ColorText ActionGroup

```js
// ColorText.js
const ColorText = (ctx) => {
  const row = (ctx.props && ctx.props.scope && ctx.props.scope.row) || {}
  const {
    status,
    _statusText = ''
  } = row

  const className = status ? "l-text l-text_normal" : "l-text_abnormal"
  return (
    <span class={className}>{_statusText}</span>
  )
}

export default ColorText
```

```js
// ActionGroup.js
const ActionGroup = (ctx) => {
  const {
    props,
    listeners
  } = ctx
  const {
    scope
  } = props
  const dealConf = [
    {
      name: '编辑',
      handler: () => {
        listeners.edit && listeners.edit(scope.row, scope.$index)
      }
    },  
    {
      name: '详情',
      handler: () => {
        listeners.detail && listeners.detail(scope.row, scope.$index)
      }
    }
  ]

  return (
    <div class='action-group'>
      {dealConf.map((item) => (
        <el-button onClick={item.handler} type='text' size='small'>
          {item.name}
        </el-button>
      ))}
    </div>
  )
}

export default ActionGroup
```

2.3 再次封装Table

```js
// index.js
import BaseTable from 'path/BaseTableLayout' // 上文封装的 Table组件
import columns from './columns'

import StatusText from './StatusText'
import ActionGroup from './ActionGroup'

const columnBridge = (column, listeners, h) => {
  switch (column.render) {
    case 'StatusText':
      return ({
        ...column,
        render: (scope) => <StatusText scope={scope} />
      })
    case 'ActionGroup':
      return ({
        ...column,
        render: (scope) => <ActionGroup scope={scope} onEdit={listeners.edit} onDetail={listeners.detail}></ActionGroup>
      })
    default:
      return column
  }
}


const TableLayout = (ctx) => {
  let { listeners } = ctx

  const onPageChange = (payload) => {
    listeners.pageChange && listeners.pageChange(payload)
  }

  const onSelectionChange = selections => {
    listeners.pageChange && listeners.selectionChange(selections)
  }

  const TableColumns = columns.map(column => columnBridge(column, listeners, h))

  return (
    <BaseTableLayout 
      {...ctx} 
      columns={TableColumns} 
      onPageChange={onPageChange}
      onSelectionChange={onSelectionChange}
    />
  )
}

export default TableLayout
```

2.4 使用

```js
<TableLayout 
  ref="myApiTable"
  :data="apiList" 
  :paginationConfig="paginationInfo"
  @pageChange="onPageChange" 
  @selectionChange="onSelectionChange"
/>
```

## 扩展: 何时使用函数式组件

## 备注:

  * a. 以上展示的代码为伪代码,部分功能并未完全实现，具体场景还可能需要读者去实现

  * b. 由于个人能力的原因，本文可能会存在一定的错误，如有理解错误的地方还望读者选择性阅读及及时指出