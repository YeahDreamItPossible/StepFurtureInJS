# [fs](http://nodejs.cn/api/fs.html)

# 前提

文件的权限位 mode、标识位 flag、文件描述符 fd 

一. 属性

1. fs.constants

二. 方法

1. fs.readFile(path[, options], callback)

2. fs.writeFile(path, data[, options], callback)

    options {
      flag: 'a' // 追加数据
    }

3. fs.appendFile(path, data[, options], callback)

4. fs.copyFile(src, dest[, mode], callback)

  异步地将 src 复制到 dest

5. fs.cp(src, dest[, options], callback)

  将整个目录结构从 src 异步地复制到 dest，包括子目录和文件