# readline

readline.createInterface(options)

rl.question(query[, options], callback)

r1.close

r1.line

```js
const rl = readline.createInterface({
  input: fs.createReadStream(process.cwd(), './Hello.txt')
})

rl.on('line', chunk => {
  console.log(chunk)
})
```js