# [path](http://nodejs.cn/api/path.html)

一. 属性: 

1. path.delimiter

  提供特定于平台的路径定界符

2. path.sep

  提供特定于平台的路径片段分隔符

3. path.win32

  提供对 path 方法的 Windows 特定实现的访问

4. path.posix

  提供对 path 方法的 POSIX 特定实现的访问

  POSIX: 可移植操作系统接口(Portable Operating System Interface of UNIX)

二. 方法

1. path.dirname(path)

  返回 path 的目录名

2. path.basename(path)

  返回 path 的最后一部分

3. path.extname(path)

  返回 path 的扩展名

4. path.isAbsoute(path)

  确定 path 是否为绝对路径

5. path.join([...paths])

  path 片段连接 生成规范化的路径

6. path.resolve([...paths])

  将路径或路径片段的序列解析为绝对路径

7. path.parse(path)

  返回pathObject

```js
{
  dir,
  root,
  base,
  name,
  ext
}
```
  
  

8. path.format(pathObject)

  从对象返回路径字符串

9. path.normlize(path)

  路径片段

10. path.relative(from, to)

  根据当前工作目录返回从 from 到 to 的相对路径
