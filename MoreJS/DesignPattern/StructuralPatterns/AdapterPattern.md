# 适配器模式

## 定义: 适配器的定义

> 作为两个不兼容的接口之间的桥梁

## 特点: 适配器模式的功能

> 结构型模式

> 将一个类的接口转换成客户希望的另外一个接口，使得原本由于接口不兼容而不能一起工作的那些类能一起工作

## 源码: 适配器模式在开发框架中的应用

我们平时在开发中 经常会与服务端进行沟通

常用的库莫过于 Axios

在JS发送请求大概有三种

  * a. XMLHttpRequest

  * b. fetch

  * c. Http(Node)

## 应用: 平时工作中的使用

平时工作中,我们在与后端联调接口时,

会经常出现我们所需要的数据结构与后端返回的数据结构有出入的情况。

例如当我们使用element-ui中的DateTimePicker(日期时间选择器时)

如果我们使用的类型type是区间选择

那此时该组件的value = [startDateTime, endDateTime]

而后端一般返回的数据是Object

```js
const res = {
  startDateTime: String || timestamp || null,
  endDateTime: String || timestamp || null,
}
```
此时 我们可以封装一个简单的适配器 来适配数据结构

```js
const dateTime2Timestamp = dateTime => {
  let timestamp = ''
  try {
    timestamp = new Date(dateTime).getTime()
    if (Number.isNaN(timestamp)) {
      console.log('IllegalArgumentException: ' + 'expect the dateTime of ' + dateTime + 'is the formatter of Date but not')
      timestamp = ''
    }
  } catch (DateTimeTransferError) {
    timestamp = ''
  }
  return timestamp
}

const dateTimePickerAdapter = (startDateTime, endDateTime) => {
  if (!startDateTime || !endDateTime) {
    return ['', '']
  }
  return [dateTime2Timestamp(startDateTime), dateTime2Timestamp(endDateTime)]
}
```

## 参考:

  * 1. [https://refactoringguru.cn/design-patterns/adapter](https://refactoringguru.cn/design-patterns/adapter)

  * 2. [https://www.runoob.com/design-pattern/adapter-pattern.html](https://www.runoob.com/design-pattern/adapter-pattern.html)

## 备注:
  * a. 以上展示的代码为伪代码,部分功能并未完全实现，具体场景还可能需要读者去实现
  
  * b. 由于个人能力的原因，本文可能会存在一定的错误，如有理解错误的地方还望读者选择性阅读及及时指出