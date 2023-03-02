# pinia-api

## createPinia

```js
function createPinia() {
  const scope = vueDemi.effectScope(true);
  const state = scope.run(() => vueDemi.ref({}));
  let _p = [];
  let toBeInstalled = [];
  const pinia = vueDemi.markRaw({
    install(app) {
      setActivePinia(pinia);
      if (!vueDemi.isVue2) {
        pinia._a = app;
        app.provide(piniaSymbol, pinia);
        app.config.globalProperties.$pinia = pinia;
        if (USE_DEVTOOLS) {
          registerPiniaDevtools(app, pinia);
        }
        toBeInstalled.forEach((plugin) => _p.push(plugin));
        toBeInstalled = [];
      }
    },
    use(plugin) {
      if (!this._a && !vueDemi.isVue2) {
        toBeInstalled.push(plugin);
      } else {
        _p.push(plugin);
      }
      return this;
    },
    _p,
    _a: null,
    _e: scope,
    _s: new Map(),
    state,
  });
  if (USE_DEVTOOLS && typeof Proxy !== "undefined") {
    pinia.use(devtoolsPlugin);
  }
  return pinia;
}
```

## defineStore

```js
function defineStore(
  idOrOptions,
  setup,
  setupOptions
) {
  let id;
  let options;
  const isSetupStore = typeof setup === "function";
  if (typeof idOrOptions === "string") {
    id = idOrOptions;
    options = isSetupStore ? setupOptions : setup;
  } else {
    options = idOrOptions;
    id = idOrOptions.id;
  }
  function useStore(pinia, hot) {
    const currentInstance = vueDemi.getCurrentInstance();
    pinia =
      pinia || (currentInstance && vueDemi.inject(piniaSymbol, null));
    if (pinia) setActivePinia(pinia);
    if (!activePinia) {
      throw new Error(
        `[🍍]: getActivePinia was called with no active Pinia. Did you forget to install pinia?\n` +
          `\tconst pinia = createPinia()\n` +
          `\tapp.use(pinia)\n` +
          `This will fail in production.`
      );
    }
    pinia = activePinia;
    if (!pinia._s.has(id)) {
      if (isSetupStore) {
        createSetupStore(id, setup, options, pinia);
      } else {
        createOptionsStore(id, options, pinia);
      }
      {
        useStore._pinia = pinia;
      }
    }
    const store = pinia._s.get(id);
    if (hot) {
      const hotId = "__hot:" + id;
      const newStore = isSetupStore
        ? createSetupStore(hotId, setup, options, pinia, true)
        : createOptionsStore(hotId, assign({}, options), pinia, true);
      hot._hotUpdate(newStore);
      delete pinia.state.value[hotId];
      pinia._s.delete(hotId);
    }
    if (
      IS_CLIENT &&
      currentInstance &&
      currentInstance.proxy &&
      !hot
    ) {
      const vm = currentInstance.proxy;
      const cache = "_pStores" in vm ? vm._pStores : (vm._pStores = {});
      cache[id] = store;
    }
    return store;
  }
  useStore.$id = id;
  return useStore;
}
```

## createOptionsStore

```js
function createOptionsStore(id, options, pinia, hot) {
const { state, actions, getters } = options;
const initialState = pinia.state.value[id];
let store;
function setup() {
  if (!initialState && !hot) {
    if (vueDemi.isVue2) {
      vueDemi.set(pinia.state.value, id, state ? state() : {});
    } else {
      pinia.state.value[id] = state ? state() : {};
    }
  }
  const localState = hot
    ? 
      vueDemi.toRefs(vueDemi.ref(state ? state() : {}).value)
    : vueDemi.toRefs(pinia.state.value[id]);
  return assign(
    localState,
    actions,
    Object.keys(getters || {}).reduce((computedGetters, name) => {
      if (name in localState) {
        console.warn(
          `[🍍]: A getter cannot have the same name as another state property. Rename one of them. Found with "${name}" in store "${id}".`
        );
      }
      computedGetters[name] = vueDemi.markRaw(
        vueDemi.computed(() => {
          setActivePinia(pinia);
          const store = pinia._s.get(id);
          if (vueDemi.isVue2 && !store._r) return;
          return getters[name].call(store, store);
        })
      );
      return computedGetters;
    }, {})
  );
}
store = createSetupStore(id, setup, options, pinia, hot, true);
store.$reset = function $reset() {
  const newState = state ? state() : {};
  this.$patch(($state) => {
    assign($state, newState);
  });
};
return store;
}
```

## createSetupStore

```js
function createSetupStore(
  $id,
  setup,
  options = {},
  pinia,
  hot,
  isOptionsStore
) {
  let scope;
  const optionsForPlugin = assign({ actions: {} }, options);
  if (!pinia._e.active) {
    throw new Error("Pinia destroyed");
  }
  const $subscribeOptions = {
    deep: true,
    // flush: 'post',
  };
  if (!vueDemi.isVue2) {
    $subscribeOptions.onTrigger = (event) => {
      if (isListening) {
        debuggerEvents = event;
      } else if (isListening == false && !store._hotUpdating) {
        if (Array.isArray(debuggerEvents)) {
          debuggerEvents.push(event);
        } else {
          console.error(
            "🍍 debuggerEvents should be an array. This is most likely an internal Pinia bug."
          );
        }
      }
    };
  }
  let isListening; // set to true at the end
  let isSyncListening; // set to true at the end
  let subscriptions = vueDemi.markRaw([]);
  let actionSubscriptions = vueDemi.markRaw([]);
  let debuggerEvents;
  const initialState = pinia.state.value[$id];
  if (!isOptionsStore && !initialState && !hot) {
    /* istanbul ignore if */
    if (vueDemi.isVue2) {
      vueDemi.set(pinia.state.value, $id, {});
    } else {
      pinia.state.value[$id] = {};
    }
  }
  const hotState = vueDemi.ref({});
  let activeListener;
  function $patch(partialStateOrMutator) {
    let subscriptionMutation;
    isListening = isSyncListening = false;
    // reset the debugger events since patches are sync
    /* istanbul ignore else */
    {
      debuggerEvents = [];
    }
    if (typeof partialStateOrMutator === "function") {
      partialStateOrMutator(pinia.state.value[$id]);
      subscriptionMutation = {
        type: exports.MutationType.patchFunction,
        storeId: $id,
        events: debuggerEvents,
      };
    } else {
      mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
      subscriptionMutation = {
        type: exports.MutationType.patchObject,
        payload: partialStateOrMutator,
        storeId: $id,
        events: debuggerEvents,
      };
    }
    const myListenerId = (activeListener = Symbol());
    vueDemi.nextTick().then(() => {
      if (activeListener === myListenerId) {
        isListening = true;
      }
    });
    isSyncListening = true;
    triggerSubscriptions(
      subscriptions,
      subscriptionMutation,
      pinia.state.value[$id]
    );
  }
  const $reset = () => {
    throw new Error(
      `🍍: Store "${$id}" is built using the setup syntax and does not implement $reset().`
    );
  };
  function $dispose() {
    scope.stop();
    subscriptions = [];
    actionSubscriptions = [];
    pinia._s.delete($id);
  }
  /**
   * Wraps an action to handle subscriptions.
   *
   * @param name - name of the action
   * @param action - action to wrap
   * @returns a wrapped action to handle subscriptions
   */
  function wrapAction(name, action) {
    return function () {
      setActivePinia(pinia);
      const args = Array.from(arguments);
      const afterCallbackList = [];
      const onErrorCallbackList = [];
      function after(callback) {
        afterCallbackList.push(callback);
      }
      function onError(callback) {
        onErrorCallbackList.push(callback);
      }
      triggerSubscriptions(actionSubscriptions, {
        args,
        name,
        store,
        after,
        onError,
      });
      let ret;
      try {
        ret = action.apply(this && this.$id === $id ? this : store, args);
      } catch (error) {
        triggerSubscriptions(onErrorCallbackList, error);
        throw error;
      }
      if (ret instanceof Promise) {
        return ret
          .then((value) => {
            triggerSubscriptions(afterCallbackList, value);
            return value;
          })
          .catch((error) => {
            triggerSubscriptions(onErrorCallbackList, error);
            return Promise.reject(error);
          });
      }
      triggerSubscriptions(afterCallbackList, ret);
      return ret;
    };
  }
  const _hmrPayload = /*#__PURE__*/ vueDemi.markRaw({
    actions: {},
    getters: {},
    state: [],
    hotState,
  });
  const partialStore = {
    _p: pinia,
    // _s: scope,
    $id,
    $onAction: addSubscription.bind(null, actionSubscriptions),
    $patch,
    $reset,
    $subscribe(callback, options = {}) {
      const removeSubscription = addSubscription(
        subscriptions,
        callback,
        options.detached,
        () => stopWatcher()
      );
      const stopWatcher = scope.run(() =>
        vueDemi.watch(
          () => pinia.state.value[$id],
          (state) => {
            if (options.flush === "sync" ? isSyncListening : isListening) {
              callback(
                {
                  storeId: $id,
                  type: exports.MutationType.direct,
                  events: debuggerEvents,
                },
                state
              );
            }
          },
          assign({}, $subscribeOptions, options)
        )
      );
      return removeSubscription;
    },
    $dispose,
  };
  if (vueDemi.isVue2) {
    partialStore._r = false;
  }
  const store = vueDemi.reactive(
    assign(
      {
        _hmrPayload,
        _customProperties: vueDemi.markRaw(new Set()), // devtools custom properties
      },
      partialStore
      // must be added later
      // setupStore
    )
  );
  pinia._s.set($id, store);
  const setupStore = pinia._e.run(() => {
    scope = vueDemi.effectScope();
    return scope.run(() => setup());
  });
  for (const key in setupStore) {
    const prop = setupStore[key];
    if (
      (vueDemi.isRef(prop) && !isComputed(prop)) ||
      vueDemi.isReactive(prop)
    ) {
      if (hot) {
        vueDemi.set(hotState.value, key, vueDemi.toRef(setupStore, key));
      } else if (!isOptionsStore) {
        if (initialState && shouldHydrate(prop)) {
          if (vueDemi.isRef(prop)) {
            prop.value = initialState[key];
          } else {
            mergeReactiveObjects(prop, initialState[key]);
          }
        }
        if (vueDemi.isVue2) {
          vueDemi.set(pinia.state.value[$id], key, prop);
        } else {
          pinia.state.value[$id][key] = prop;
        }
      }
      {
        _hmrPayload.state.push(key);
      }
    } else if (typeof prop === "function") {
      const actionValue = hot ? prop : wrapAction(key, prop);
      if (vueDemi.isVue2) {
        vueDemi.set(setupStore, key, actionValue);
      } else {
        setupStore[key] = actionValue;
      }
      {
        _hmrPayload.actions[key] = prop;
      }
      optionsForPlugin.actions[key] = prop;
    } else {
      if (isComputed(prop)) {
        _hmrPayload.getters[key] = isOptionsStore
          ? // @ts-expect-error
            options.getters[key]
          : prop;
        if (IS_CLIENT) {
          const getters =
            setupStore._getters ||
            (setupStore._getters = vueDemi.markRaw([]));
          getters.push(key);
        }
      }
    }
  }
  if (vueDemi.isVue2) {
    Object.keys(setupStore).forEach((key) => {
      vueDemi.set(store, key, setupStore[key]);
    });
  } else {
    assign(store, setupStore);
    assign(vueDemi.toRaw(store), setupStore);
  }
  Object.defineProperty(store, "$state", {
    get: () => (hot ? hotState.value : pinia.state.value[$id]),
    set: (state) => {
      if (hot) {
        throw new Error("cannot set hotState");
      }
      $patch(($state) => {
        assign($state, state);
      });
    },
  });
  {
    store._hotUpdate = vueDemi.markRaw((newStore) => {
      store._hotUpdating = true;
      newStore._hmrPayload.state.forEach((stateKey) => {
        if (stateKey in store.$state) {
          const newStateTarget = newStore.$state[stateKey];
          const oldStateSource = store.$state[stateKey];
          if (
            typeof newStateTarget === "object" &&
            isPlainObject(newStateTarget) &&
            isPlainObject(oldStateSource)
          ) {
            patchObject(newStateTarget, oldStateSource);
          } else {
            newStore.$state[stateKey] = oldStateSource;
          }
        }
        vueDemi.set(
          store,
          stateKey,
          vueDemi.toRef(newStore.$state, stateKey)
        );
      });
      Object.keys(store.$state).forEach((stateKey) => {
        if (!(stateKey in newStore.$state)) {
          vueDemi.del(store, stateKey);
        }
      });
      isListening = false;
      isSyncListening = false;
      pinia.state.value[$id] = vueDemi.toRef(
        newStore._hmrPayload,
        "hotState"
      );
      isSyncListening = true;
      vueDemi.nextTick().then(() => {
        isListening = true;
      });
      for (const actionName in newStore._hmrPayload.actions) {
        const action = newStore[actionName];
        vueDemi.set(store, actionName, wrapAction(actionName, action));
      }
      for (const getterName in newStore._hmrPayload.getters) {
        const getter = newStore._hmrPayload.getters[getterName];
        const getterValue = isOptionsStore
          ? // special handling of options api
            vueDemi.computed(() => {
              setActivePinia(pinia);
              return getter.call(store, store);
            })
          : getter;
        vueDemi.set(store, getterName, getterValue);
      }
      Object.keys(store._hmrPayload.getters).forEach((key) => {
        if (!(key in newStore._hmrPayload.getters)) {
          vueDemi.del(store, key);
        }
      });
      Object.keys(store._hmrPayload.actions).forEach((key) => {
        if (!(key in newStore._hmrPayload.actions)) {
          vueDemi.del(store, key);
        }
      });
      store._hmrPayload = newStore._hmrPayload;
      store._getters = newStore._getters;
      store._hotUpdating = false;
    });
  }
  if (USE_DEVTOOLS) {
    const nonEnumerable = {
      writable: true,
      configurable: true,
      enumerable: false,
    };
    ["_p", "_hmrPayload", "_getters", "_customProperties"].forEach((p) => {
      Object.defineProperty(
        store,
        p,
        assign({ value: store[p] }, nonEnumerable)
      );
    });
  }
  if (vueDemi.isVue2) {
    store._r = true;
  }
  pinia._p.forEach((extender) => {
    if (USE_DEVTOOLS) {
      const extensions = scope.run(() =>
        extender({
          store,
          app: pinia._a,
          pinia,
          options: optionsForPlugin,
        })
      );
      Object.keys(extensions || {}).forEach((key) =>
        store._customProperties.add(key)
      );
      assign(store, extensions);
    } else {
      assign(
        store,
        scope.run(() =>
          extender({
            store,
            app: pinia._a,
            pinia,
            options: optionsForPlugin,
          })
        )
      );
    }
  });
  if (
    store.$state &&
    typeof store.$state === "object" &&
    typeof store.$state.constructor === "function" &&
    !store.$state.constructor.toString().includes("[native code]")
  ) {
    console.warn(
      `[🍍]: The "state" must be a plain object. It cannot be\n` +
        `\tstate: () => new MyClass()\n` +
        `Found in store "${store.$id}".`
    );
  }
  if (initialState && isOptionsStore && options.hydrate) {
    options.hydrate(store.$state, initialState);
  }
  isListening = true;
  isSyncListening = true;
  return store;
}
```