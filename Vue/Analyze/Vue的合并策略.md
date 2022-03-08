# Vue的合并策略

Vue.config = {
  optionMergeStrategies: {}
}

合并策略大概 分为 三类

1. 默认策略
    childVal === undefined ? parentVal : childVal

2. Object类
    extend 扩展 child 扩展到 parent

3. 函数类 如 Hook
    数组 选项唯一