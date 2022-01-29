# Blob类的应用

```js
Object.prototype
  Blob.prototype
      File.prototype
  FileReader.prototype

  FileList.prototype
      item

  URL.prototype
      searchParams // URLSearchParams
  URLSearchParams.prototype

  Event.prototype
  EventTarget.prototype
      Node.prototype
          Element.prototype
              HTMLElement.prototype
                  HTMLImageElement.prototype
                  HTMLDivElement.prototype
                  HTMLCanvasElement.prototype

  CanvasRenderingContext2D.prototype

  XMLSerializer.prototype

  FormData.prototype
```

```js
Blob.prototype
    size
    slice // 分片处理
    text // Promise
    stream // Promise
```

```js
FileReader.prototype
    readAsDataURL
    readAsText
    readAsBinaryString
    readAsArrayBuffer

    onload
    onprogress
    onerror
    onabort
```

```js
URL
  createObjectURL // Blob
```

```js
URLSearchParams.prototype
    keys
    has
    get
    set
```

```js
HTMLCanvasElement.prototype
    getContex // CanvasRenderingContext2D
```

```js
CanvasRenderingContext2D.prototype
    drawImage
```

```js
XMLSerializer.prototype
  serializeToString
```

```js
FormData.prototype
  append
  delete
  get
  getAll
  has
  keys
  set
````
