const fs = require('fs')
const { parse } = require('path')

const dbPath = './db.json'

// 获取学生列表
exports.find = function (cb) {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) return cb(err)
    cb(null, JSON.parse(data).students)
  })
}
// 根据 id 获取学生信息
exports.findById = function (id, cb) {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) return cb(err)
    const students = JSON.parse(data).students
    const currentStu = students.find(item => {
      return item.id === parseInt(id)
    })
    cb(null, currentStu)
  })
}

// 添加学生信息
exports.add = function (stu, cb) {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) return cb(err)
    // 读到的字符串转换成值
    const students = JSON.parse(data).students
    // 添加 id
    stu.id = students[students.length - 1].id + 1
    stu.gender = parseInt(stu.gender)
    stu.age = parseInt(stu.age)
    students.push(stu)
    // 结果转成JSON字符串
    const result = JSON.stringify({
      students
    })
    fs.writeFile(dbPath, result, (err) => {
      if (err) return cb(err)
      cb(null)
    })
  })
}

// 修改学生信息
exports.edit = function (stu, cb) {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) return cb(err)
    const students = JSON.parse(data).students
    // 修改 id 的数据类型为数值
    stu.id = parseInt(stu.id)
    stu.gender = parseInt(stu.gender)
    stu.age = parseInt(stu.age)
    const currentStu = students.find(item => {
      return item.id === stu.id
    })
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

// 删除
exports.delete = function (id, cb) {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) return cb(err)
    const students = JSON.parse(data).students
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