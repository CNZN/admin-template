const Goods = require('./model/goods')
const Login = require('./model/login')
// const Register = require('./model/register')
const express = require('express')

var bodyParser = require('body-parser')
const multer = require('multer')
const app = new express()

// 自定义路径存放和文件名
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 接收到文件后输出的保存路径（若不存在则需要创建）
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
    cb(null, Date.now() + file.originalname)
  }
})
//创建multer对象
var upload = multer({ storage: storage });
app.use('/uploads', express.static('uploads'));//配置虚拟访问路径
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// 登录后台的接口 冯管了
app.post('/user/login', function (req, res) {
  // req.session.token='加密算法生成随机token'
  // const data={'code':20000,'data':{'roles':['editor'],'token':req.session.token,'introduction':'I am a super administrator','avatar':'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif','name':'Super Admin'}}
  const data = {
    code: 20000,
    data: {
      token: 'asasasasas',
      orangiseid: 'wwwwwwww',
      introduction: 'I am a super administrator',
      avatar: 'https://dgss0.bdstatic.com/5bVWsj_p_tVS5dKfpU_Y_D3/res/r/image/2020-09-22/7afe3efb3e8fb391539e4e821e9ece28.jpg',
      name: 'Super Admin'
    }
  }
  res.json(data)
})
app.get('/user/info', function (req, res) {
  const data = {
    code: 20000,
    data: {
      roles: ['admin'],
      introduction: 'I am a super administrator',
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      name: 'Super Admin'
    }
  }
  res.json(data)
})
app.post('/user/logout', function (req, res) {
  res.json({ code: 20000, message: 'success' })
})
// 服务端
// 获取信息
app.get('/allinfo', async (req, res) => {
  const zz = await Login.find()
  const bb = await Goods.find()
  res.json({
    code: 20000,
    userlist: zz,
    goodslist: bb
  })
})
// 商品添加
// 添加页面 图片上传接口
app.post('/upload', upload.single('avatar'), function (req, res, next) {
  if (req.file) {
    res.json({
      code: 20000,
      path: req.file.path
    })
  }
})
// 添加页面 
// 商品
app.post('/addgoods', (req, res) => {
  const goods = new Goods({
    title: req.body.title,
    img: req.body.img,
    desc: req.body.desc,
    price: req.body.price,
  });
  goods.save().then(mon => {
    res.json({
      code: 200,
      msg: "添加成功"
    })
  })
})
app.delete('/delgoods/:id', (req, res) => {
  var id = req.params.id
  Goods.findByIdAndDelete(id).then(mon => {
    res.json({
      code: 20000,
      msg: '删除成功'
    })
  })
})
app.get('/getgoodsInfo', async (req, res) => {
  var page = req.query.page || 1
  var pagesize = req.query.pagesize || 3
  var start = (Number(page) - 1) * Number(pagesize)
  var num = Number(pagesize)
  // console.log(page,pagesize)
  var total = await Goods.find().populate('p')
  var result = await Goods.find().skip(start).limit(num).populate('p')
  res.json({
    code: 20000,
    list: result,
    total: total.length,
    all: total
  })
})
// 用户
app.get('/getuserInfo', async (req, res) => {
  var page = req.query.page || 1
  var pagesize = req.query.pagesize || 3
  var start = (Number(page) - 1) * Number(pagesize)
  var num = Number(pagesize)
  // console.log(page,pagesize)
  var total = await Login.find().populate('p')
  var result = await Login.find().skip(start).limit(num).populate('p')
  res.json({
    code: 20000,
    list: result,
    total: total.length,
    all: total
  })
})
app.delete('/deluser/:id', (req, res) => {
  var id = req.params.id
  Login.findByIdAndDelete(id).then(mon => {
    res.json({
      code: 20000,
      msg: '删除成功'
    })
  })
})



// 客户端
// 注册的接口
app.post('/login1', async (req, res) => {
  const username = req.body.username
  const password = req.body.password
  // console.log(req.body)
  var zz = await Login.find({ username })
  // console.log(zz)
  if (zz.length > 0) {
    res.json({ code: 20001, msg: "用户名已被占用" })
  } else {
    var bb = await new Login({ username, password }).save()
    res.json({ code: 20000, msg: '注册成功' })
  }
})
// 登录的接口
app.post('/login2', async (req, res) => {
  const username = req.body.username
  const password = req.body.password
  // console.log(req.body)
  var zz = await Login.find({ username, password })
  // console.log(zz)
  if (zz.length > 0) {
    res.json({ code: 20000, msg: "登录成功" })
  } else {
    res.json({ code: 20001, msg: '用户名或者密码错误' })
  }
})
// 商品接口
app.get('/someone/:id', (req, res) => {
  var id = req.params.id
  Goods.findById(id).then(mon => {
    res.json({
      code: 20000,
      list: mon
    })
  })
})
// 购物车
app.get('/someonecar/:id', async (req, res) => {
  // console.log(req.params.id)
  var bb = req.params.id  //数组 ['12','112'] 但是到这成了字符串
  var zz = bb.split(',')
  var list = []
  for (var i = 0; i < zz.length; i++) {
    var id = zz[i]
    list.push(await Goods.findById(id))
  }
  res.json({
    code: 20000,
    list
  })
})
app.listen(7777, '127.0.0.1')
