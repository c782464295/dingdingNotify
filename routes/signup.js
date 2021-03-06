const path = require('path')
const sha1 = require('sha1')
const express = require('express')
const router = express.Router()

const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin



// GET /signup 注册页
router.get('/', checkNotLogin, function (req, res, next) {
  res.render('signup')
})

// POST /signup 用户注册
router.post('/', checkNotLogin, function (req, res, next) {
  const name = req.body.name
  let password = req.body.password
  const repassword = req.body.repassword
  console.log(name)
  // 校验参数
  try {
    if (name.length > 100) {
      throw new Error('名字太长')
    }
    if (password.length < 6) {
      throw new Error('密码至少 6 个字符')
    }
    if (!(repassword == password)) {
      throw new Error('两次输入密码不一致')
    }
  } catch (e) {
    // 注册失败，异步删除上传的头像
    req.flash('error', e.message)
    return res.redirect('/signup')
  }



  // 待写入数据库的用户信息
  let user = {
    name: name,
    password: password,//本来是存储md5（password)，有点麻烦，现使用明文存储密码
  }
  // 用户信息写入数据库
  UserModel.create(user)
    .then(function (result) {
      // 此 user 是插入 mongodb 后的值，包含 _id
      user = result.ops[0]
      // 删除密码这种敏感信息，将用户信息存入 session
      delete user.password
      req.session.user = user
      // 写入 flash
      req.flash('success', '注册成功')
      // 跳转到首页
      res.redirect('/posts')
    })
    .catch(function (e) {
      // 用户名被占用则跳回注册页，而不是错误页
      if (e.message.match('duplicate key')) {
        req.flash('error', '用户名已被占用')
        return res.redirect('/signup')
      }
      next(e)
    })
})

module.exports = router