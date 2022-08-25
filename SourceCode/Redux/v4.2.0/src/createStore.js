import $$observable from './utils/symbol-observable'

import ActionTypes from './utils/actionTypes'
import isPlainObject from './utils/isPlainObject'
import { kindOf } from './utils/kindOf'

export function createStore(reducer, preloadedState, enhancer) {
  // NOTE:
  // 参数检验
  // 1. normalize(规范化)参数
  // 2. 兼容之前版本的传参方式
  // 3. 对于废弃的传参方式 直接报错
  if (
    (typeof preloadedState === 'function' && typeof enhancer === 'function') ||
    (typeof enhancer === 'function' && typeof arguments[3] === 'function')
  ) {
    throw new Error(
      'It looks like you are passing several store enhancers to ' +
        'createStore(). This is not supported. Instead, compose them ' +
        'together to a single function. See https://redux.js.org/tutorials/fundamentals/part-4-store#creating-a-store-with-enhancers for an example.'
    )
  }

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState
    preloadedState = undefined
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error(
        `Expected the enhancer to be a function. Instead, received: '${kindOf(
          enhancer
        )}'`
      )
    }

    return enhancer(createStore)(reducer, preloadedState)
  }

  // NOTE: reducer 必须是函数
  if (typeof reducer !== 'function') {
    throw new Error(
      `Expected the root reducer to be a function. Instead, received: '${kindOf(
        reducer
      )}'`
    )
  }

  let currentReducer = reducer
  // NOTE:
  // Redux 的状态state是内部变量, 而不是直接暴漏出 state 字段
  // 是保证 获取state 只能通过 特定的方式 即getState 
  // 且也是为了保证 防止用户直接通过 state[field] 去修改
  // 这是 与 vuex 的 state 的区别之一
  let currentState = preloadedState
  let currentListeners = []
  let nextListeners = currentListeners
  // NOTE:
  // reducer 进行中的标识 用来防止用户在此期间进行其他的副作用
  let isDispatching = false

  function ensureCanMutateNextListeners() {
    // NOTE:
    // 浅copy
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice()
    }
  }
  
  function getState() {
    // NOTE:
    // reducer 内部不能获取state 防止出现副作用
    if (isDispatching) {
      throw new Error(
        'You may not call store.getState() while the reducer is executing. ' +
          'The reducer has already received the state as an argument. ' +
          'Pass it down from the top reducer instead of reading it from the store.'
      )
    }

    // NOTE:
    // 通过闭包的方式 使state 私有化 防止用户直接修改
    return currentState
  }

  function subscribe(listener) {
    // NOTE: 
    // listener 必须是函数 否则报错
    if (typeof listener !== 'function') {
      throw new Error(
        `Expected the listener to be a function. Instead, received: '${kindOf(
          listener
        )}'`
      )
    }

    // NOTE:
    // 避免 reducer 出现 subscribe 逻辑
    if (isDispatching) {
      throw new Error(
        'You may not call store.subscribe() while the reducer is executing. ' +
          'If you would like to be notified after the store has been updated, subscribe from a ' +
          'component and invoke store.getState() in the callback to access the latest state. ' +
          'See https://redux.js.org/api/store#subscribelistener for more details.'
      )
    }

    let isSubscribed = true

    ensureCanMutateNextListeners()
    nextListeners.push(listener)

    return function unsubscribe() {
      // NOTE:
      // 保证 移除监听者 的行为是合法的(即是通过 subscribe 返回的fn执行的)
      if (!isSubscribed) {
        return
      }

      // NOTE:
      // 避免 reducer 出现 unsubscribe 逻辑
      if (isDispatching) {
        throw new Error(
          'You may not unsubscribe from a store listener while the reducer is executing. ' +
            'See https://redux.js.org/api/store#subscribelistener for more details.'
        )
      }

      isSubscribed = false

      ensureCanMutateNextListeners()
      const index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)
      // NOTE:
      // 保证 监听者队列 在未添加新的队列时 只浅复制一次(代码优化)
      currentListeners = null
    }
  }

  
  function dispatch(action) {
    // NOTE:
    // action 必须是纯对象 否则报错
    if (!isPlainObject(action)) {
      throw new Error(
        `Actions must be plain objects. Instead, the actual type was: '${kindOf(
          action
        )}'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.`
      )
    }

    // NOTE:
    // action.type 不能是undefined 否则报错
    if (typeof action.type === 'undefined') {
      throw new Error(
        'Actions may not have an undefined "type" property. You may have misspelled an action type string constant.'
      )
    }

    // NOTE:
    // reducer 内部不能 dispatch action 
    // 主要是为了保证 state的变更是由某个单独的acion引起的
    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.')
    }

    try {
      isDispatching = true
      currentState = currentReducer(currentState, action)
    } finally {
      isDispatching = false
    }

    // NOTE:
    // 调度监听者队列
    // 个人看法: 该监听者 能力过于简单
    const listeners = (currentListeners = nextListeners)
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }

    // NOTE:
    // dispatch 返回用户传参 可以让用户 扩展dispatch 
    return action
  }

  function replaceReducer(nextReducer) {
    // NOTE:
    // 保证 reducer 必须是函数 否则报错
    if (typeof nextReducer !== 'function') {
      throw new Error(
        `Expected the nextReducer to be a function. Instead, received: '${kindOf(
          nextReducer
        )}`
      )
    }

    currentReducer = nextReducer

    // This action has a similiar effect to ActionTypes.INIT.
    // Any reducers that existed in both the new and old rootReducer
    // will receive the previous state. This effectively populates
    // the new state tree with any relevant data from the old one.
    dispatch({ type: ActionTypes.REPLACE })
  }

  // NOTE:
  // 个人看法: 这个API 意义不大
  function observable() {
    const outerSubscribe = subscribe
    return {
      subscribe(observer) {
        // NOTE:
        // 保证 observer 必须是对象 否则报错
        if (typeof observer !== 'object' || observer === null) {
          throw new TypeError(
            `Expected the observer to be an object. Instead, received: '${kindOf(
              observer
            )}'`
          )
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState())
          }
        }

        observeState()
        const unsubscribe = outerSubscribe(observeState)
        return { unsubscribe }
      },

      [$$observable]() {
        return this
      },
    }
  }

  // NOTE:
  // 之所以内部手动调用一次dispatch 
  // 1. 主要是为了初始化state(previousState可能未传递)
  dispatch({ type: ActionTypes.INIT })

  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: observable,
  }
}

// NOTE:
// createStore 可能会在后续大版本废弃
export const legacy_createStore = createStore

