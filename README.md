

## app.js

#### express 配置

```javascript
const express = require('express')
const app = express()

// 托管静态文件
app.use('/node_modules/', express.static('./node_modules'))
app.use('/public', express.static('./public'))

app.listen(3000, () => {
  console.log('running...');
})
```

#### express 中的模板引擎

- 安装

```shell
npm install --save art-template
npm install --save express-art-template
```

- 配置

```javascript
app.engine('html', require('express-art-template'))
```

#### body-parser 解析 post 数据

```javascript
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
```

#### 路由挂载

```javascript
const router = require('./router')

app.use(router)
```

## router.js

#### 创建路由

```javascript
const router = express.Router()
```

####  引入student.js

```javascript
const Student = require('./student')
```

#### 首页

```javascript
router.get('/', (req, res) => {
  Student.find((err, students) => {
    if (err) return res.status(500).send('Server error.')
    // students 为替换对象
    res.render('index.html', {
      students
    })
  })
})
```

#### 添加学生请求

```javascript
router.post('/addstudent', (req, res) => {
  // req.body 是 body-parser 解析的 post 数据，可以直接使用
  Student.add(req.body, (err) => {
    if (err) return res.status(500).send('Server error.')
    // 重定向到首页
    res.redirect('/')
  })
})
```

#### 修改学生信息

```javascript
// 渲染修改页面
router.get('/editstudent', (req, res) => {
  // 用封装的 findById 方法找到要修改的学生然后传给模板引擎替换
  Student.findById(req.query.id, (err, student) => {
    if (err) return res.status(500).send('Server error.')
    res.render('edit.html', {
      student
    })
  })
})
// 修改请求
router.post('/editstudent', (req, res) => {
  Student.edit(req.body, err => {
    if (err) return res.status(500).send('Server error.')
    res.redirect('/')
  })
})
```

#### 删除学生

```javascript
router.get('/deletestudent', (req, res) => {
  // req.query 是 get 请求的数据
  Student.delete(req.query.id, err => {
    if (err) return res.status(500).send('Server error.')
    res.redirect('/')
  })
})
```

## student.js (封装操作方法)

- json 文件路径：`const dbPath = './db.json'`

#### 1. 获取所有学生信息

```javascript
// 读取文件是异步的，用回调函数传递数据
exports.find = function (cb) {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) return cb(err)
    // data 是 JSON 字符串，JSON.parse 转换成对象，传给回调函数
    cb(null, JSON.parse(data).students)
  })
}
```

#### 2. 根据 id 查找

```javascript
// 第一个参数传入要查找的 id
exports.findById = function (id, cb) {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) return cb(err)
    const students = JSON.parse(data).students
    // 用数组的 find 函数得到对应 id 的对象
    const currentStu = students.find(item => {
      return item.id === parseInt(id)
    })
    // 把结果传给回调函数
    cb(null, currentStu)
  })
}
```

#### 3. 添加新的学生

```javascript
// 第一个参数传入要添加的学生信息
exports.add = function (stu, cb) {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) return cb(err)
    const students = JSON.parse(data).students
    // 手动添加 id
    stu.id = students[students.length - 1].id + 1
    stu.gender = parseInt(stu.gender)
    stu.age = parseInt(stu.age)
    // 把新的对象添加到数组
    students.push(stu)
    // 把结果转换成 JSON 字符串，然后写入 json 文件
    const result = JSON.stringify({
      students
    })
    fs.writeFile(dbPath, result, (err) => {
      if (err) return cb(err)
      cb(null)
    })
  })
}
```

#### 4. 修改学生信息

```javascript
// 第一个参数传入要修改的学生信息
exports.edit = function (stu, cb) {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) return cb(err)
    const students = JSON.parse(data).students
    stu.id = parseInt(stu.id)
    stu.gender = parseInt(stu.gender)
    stu.age = parseInt(stu.age)
    // 根据 id 查找要修改的学生
    const currentStu = students.find(item => {
      return item.id === stu.id
    })
    // 遍历并重新赋值  浅拷贝
    for (let key in currentStu) {
      currentStu[key] = stu[key]
    }
    const result = JSON.stringify({
      students
    })
    fs.writeFile(dbPath, result, (err) => {
      if (err) return cb(err)
      cb(null)
    })
  })
}
```

#### 5. 删除学生信息

```javascript
// 传入要删除的学生的 id
exports.delete = function (id, cb) {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) return cb(err)
    const students = JSON.parse(data).students
    // 找到对应 id 的 index
    const currentIndex = students.findIndex(item => {
      return item.id === parseInt(id)
    })
    students.splice(currentIndex, 1)
    const result = JSON.stringify({
      students
    })
    fs.writeFile(dbPath, result, err => {
      if (err) return cb(err)
      cb(null)
    })
  })
}
```

## index.html

- 遍历

```html
<tbody>
    {{each students }}
    <tr>
        <td>{{ $value.id }}</td>
        <td>{{ $value.name }}</td>
        <td>{{ $value.gender }}</td>
        <td>{{ $value.age }}</td>
        <td>{{ $value.mobile }}</td>
        <td>
            <a href="/editstudent?id={{ $value.id }}" class="btn btn-primary">修改</a>
            <a href="/deletestudent?id={{ $value.id }}" class="btn btn-primary">删除</a>
        </td>
    </tr>
    {{/each}}
</tbody>
```

## edit.html

- 不显示，但是会和表单一起提交

```html
<input type="hidden" name="id" value="{{ student.id }}">
```

- 判断选中按钮
```html
{{ if student.gender === 0 }}
<label class="radio-inline">
    <input type="radio" name="gender" id="man" value="0" checked> 男
</label>
<label class="radio-inline">
    <input type="radio" name="gender" id="man" value="0"> 女
</label>
{{ else }}
<label class="radio-inline">
    <input type="radio" name="gender" id="man" value="0"> 男
</label>
<label class="radio-inline">
    <input type="radio" name="gender" id="man" value="0" checked> 女
</label>
{{ /if}}
```



