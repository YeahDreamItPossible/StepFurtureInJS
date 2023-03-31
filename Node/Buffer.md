# Buffer

## 简介

Buffer对象用于表示固定长度的字节序列

## 属性和方法

一. 静态属性

1. Buffer.poolSize

  用于池的预分配内部 Buffer 实例的大小（以字节为单位）

二. 静态方法

1. Buffer.alloc(size[, fill[, encoding]])

   Buffer.allocUnsafe(size)

   Buffer.allocUnsafeSlow(size)

2. Buffer.from(string[, encoding])

   Buffer.from(buffer)
   
   Buffer.from(array)

   Buffer.from(arrayBuffer[, byteOffset[, length]])
   
   // 不常用

   Buffer.from(object[, offsetOrEncoding[, length]])

3. Buffer.byteLength(string[, encoding])

  使用 encoding 编码时返回字符串的字节长度

  这与 String.prototype.length 不同，String.prototype.length 不考虑用于将字符串转换为字节的编码

4. Buffer.compare(buf1, buf2)

5. Buffer.concat(Buffer[][, totalLength])

6. Buffer.isBuffer(obj)

7. Buffer.isEncoding(encoding)

三. 实例属性

1. buffer.length

四. 实例方法

1. buffer.toString([encoding[, start[, end]]])

2. buffer.toJSON

3. buffer.keys

4. buffer.values

5. buffer.entries

6. buffer.copy

7. buffer.compare