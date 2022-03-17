# [fs](http://nodejs.cn/api/fs.html)

# 前提

文件的权限位 mode、标识位 flag、文件描述符 fd 

一. 静态属性

1. fs.Dir

  表示目录流的类

  fs.path

  fs.read(callback)

  fs.close(callback)

2. fs.Dirent

  目录条目的表示，可以是目录中的文件或子目录

3. fs.Stats

4. fs.FSWatcher

5. fs.StatWatcher

<!-- TODO: -->
6. fs.ReadStream

<!-- TODO: -->
7. fs.WriteStream

8. fs.constant


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

6. fs.unlink(path, callback)

  异步地删除文件或符号链接

7. fs.open(path[, flags[, mode]], callback)

8. fs.opendir(path[, options], callback)

9. fs.read(fd, buffer, offset, length, position, callback)

  fs.read(fd, [options,] callback)

10. fs.close(callback)

  <!-- 文件存在  -->
  fs.exists(path, callback)

  <!-- 文件权限 -->
  fs.access(path[, mode], callback)

  fs.chmod(path, mode, callback)

  fs.chown(path, uid, gid, callback)

    <!-- 目录(文件夹)操作 -->
11. fs.mkdir(path[,options], callback)

  异步地创建目录

12. fs.mkdtemp(prefix[, options], callback)

  创建唯一的临时目录

13. fs.rmdir(path[, options], callback)

  异步的删除文件夹
14. fs.rm(path[, options], callback)

  异步地删除文件和目录

15. fs.readdir(path[, options], callback)

<!-- Stats -->

16. fs.stat(path[, options], callback)

<!-- Wacther -->

fs.watch(filename[, options][, listener])

fs.watchFile(filename[, options][, listener])