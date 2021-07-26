const fs = require('fs')
const express = require('express')
const Student = require('./student')

const router = express.Router()

// 首页
router.get('/', (req, res) => {
  Student.find((err, students) => {
    if (err) return res.status(500).send('Server error.')
    res.render('index.html', {
      students
    })
  })
})

// 跳转到添加学生页面
router.get('/addstudent', (req, res) => {
  res.render('addpage.html')
})

// 添加学生到数据文件
router.post('/addstudent', (req, res) => {
  Student.add(req.body, (err) => {
    if (err) return res.status(500).send('Server error.')
    res.redirect('/')
  })
})

// 跳转到修改学生信息页面
router.get('/editstudent', (req, res) => {
  Student.findById(req.query.id, (err, student) => {
    if (err) return res.status(500).send('Server error.')
    res.render('edit.html', {
      student
    })
  })
})
// 修改
router.post('/editstudent', (req, res) => {
  Student.edit(req.body, err => {
    if (err) return res.status(500).send('Server error.')
    res.redirect('/')
  })
})
// 删除
router.get('/deletestudent', (req, res) => {
  Student.delete(req.query.id, err => {
    if (err) return res.status(500).send('Server error.')
    res.redirect('/')
  })
})

module.exports = router