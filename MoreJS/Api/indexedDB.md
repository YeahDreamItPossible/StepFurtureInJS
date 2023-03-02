# indexedDB

- 数据库：IDBDatabase 对象

- 对象仓库：IDBObjectStore 对象

- 索引： IDBIndex 对象

- 事务： IDBTransaction 对象

- 操作请求：IDBRequest 对象

- 指针： IDBCursor 对象

- 主键集合：IDBKeyRange 对象

## 名词

### 数据库

- 数据库是一系列相关数据的容器。每个域名（严格的说，是协议 + 域名 + 端口）都可以新建任意多个数据库。

- IndexedDB 数据库有版本的概念。同一个时刻，只能有一个版本的数据库存在。如果要修改数据库结构（新增或删除表、索引或者主键），只能通过升级数据库版本完成

### 对象仓库

- 每个数据库包含若干个对象仓库（object store）。它类似于关系型数据库的表格

### 数据记录

对象仓库保存的是数据记录。每条记录类似于关系型数据库的行，但是只有主键和数据体两部分。主键用来建立默认的索引，必须是不同的，否则会报错。主键可以是数据记录里面的一个属性，也可以指定为一个递增的整数编号

### 索引

为了加速数据的检索，可以在对象仓库里面，为不同的属性建立索引。

### 事务

数据记录的读写和删改，都要通过事务完成。事务对象提供error、abort和complete三个事件，用来监听操作结果

## 流程

1. 打开数据库
  
  - var request = window.indexedDB.open(databaseName, version)

  - 这个方法接受两个参数，第一个参数是字符串，表示数据库的名字。如果指定的数据库不存在，就会新建数据库。第二个参数是整数，表示数据库的版本。如果省略，打开已有数据库时，默认为当前版本；新建数据库时，默认为1

  - 方法返回一个 IDBRequest 对象。这个对象通过三种事件error、success、upgradeneeded，处理打开数据库的操作结果

  - error事件表示打开数据库失败。

  - success事件表示成功打开数据库

2. 新建数据库

  - 新建数据库与打开数据库是同一个操作。如果指定的数据库不存在，就会新建。不同之处在于，后续的操作主要在upgradeneeded事件的监听函数里面完成，因为这时版本从无到有，所以会触发这个事件

  - 通常，新建数据库以后，第一件事是新建对象仓库（即新建表） 更好的写法是先判断一下，这张表格是否存在，如果不存在再新建

    ```js
    request.onupgradeneeded = function (event) {
      db = event.target.result;
      var objectStore;
      if (!db.objectStoreNames.contains('person')) {
        objectStore = db.createObjectStore('person', { keyPath: 'id' });
      }
    }
    ```

3. 新增数据

  - 新增数据指的是向对象仓库写入数据记录。这需要通过事务完成。

  ```js
  function add() {
    var request = db.transaction(['person'], 'readwrite')
      .objectStore('person')
      .add({ id: 1, name: '张三', age: 24, email: 'zhangsan@example.com' });

    request.onsuccess = function (event) {
      console.log('数据写入成功');
    };

    request.onerror = function (event) {
      console.log('数据写入失败');
    }
  }

  add()
  ```
4. 读取数据

5. 遍历数据

6. 更新数据

7. 删除数据

8. 使用索引
