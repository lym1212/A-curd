const express = require('express')
const router = require('./router')
const bodyParser = require('body-parser')

const app = express()

app.use('/node_modules/', express.static('./node_modules'))
app.use('/public', express.static('./public'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.engine('html', require('express-art-template'))

// 把路由挂载到app中
app.use(router)

app.listen(3000, () => {
  console.log('running...');
})