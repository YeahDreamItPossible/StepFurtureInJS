# redux的简单应用

```html
<script src="http://xxx.xx/redux/4.2.0/redux.global.js"></script>
<script>
  const {
    createStore,
    applyMiddleware,
    combineReducers,
    bindActionCreators
  } = Redux

  // 先定义两个插件(看不懂可跳过)
  // 插件1: 日志输出(输出action)
  const logger = ({getState}) => dispatch => action => {
    console.log('Redux Logger:', action)
    return dispatch(action)
  }
  // 插件2: thunk函数
  const thunk = ({getState}) => dispatch => action => {
    console.log('Redux Thunk:', action)
    if (typeof action === 'function') {
      return action(dispatch, getState)
    }
    return dispatch(action)
  }

  // 定义常量
  const TODO = Object.freeze({
    'ADD': 'ADD',
    'CLEAR': 'CLEAR'
  })

  // 创建todo reducer
  const todoReducer = (state = [], action) => {
    if (action.type === TODO.ADD) {
      state.push({
        id: Date.now,
        todo: action.todo
      })
    }
    return state
  }

  // 混合reducers
  const reducers = combineReducers({
    todoList: todoReducer
  })

  // 初始状态(如果自定义初始状态时 状态里的key 必须于combineReducers入参中的key 保持一致)
  let state = ({
    todoList: []
  })

  // 应用插件
  const middlewares = applyMiddleware(thunk, logger)

  // 创建store
  const store = createStore(reducers, state, middlewares)

  // 绑定action
  const createAddActionCreator = text => ({type: TODO.ADD, todo: text})
  const actionCreator = bindActionCreators({ addTodo: createAddActionCreator}, store.dispatch)

  // 监听
  const unsubscribe = store.subscribe(() => {console.log('正在监听中...')})

  // 监听
  const observable = store['@@observable']()
  const unobservable = observable.subscribe({
    next (state) {
      console.log('变更前和变更后都会触发:', state)
    }
  })

  console.log(1, store.getState().todoList)

  actionCreator.addTodo('Hello')

  console.log(2, store.getState().todoList)

</script>
```