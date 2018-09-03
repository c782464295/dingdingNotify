﻿const express = require('express')
const router = express.Router()
const checkNotLogin = require('../middlewares/check').checkNotLogin
const UserModel = require('../models/users')
// GET /signin 登录页
router.get('/', checkNotLogin, function (req, res, next) {
  res.render('signin')
})


// POST /signin 用户登录
router.post('/', checkNotLogin, function (req, res, next) {
  
  const name = req.body.name
  const password = req.body.password

  // 校验参数
  try {
    if (!name.length) {
      throw new Error('请填写用户名')
    }
    if (!password.length) {
      throw new Error('请填写密码')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  UserModel.getUserByName(name)
    .then(function (user) {
      if (!user) {
        req.flash('error', '用户不存在')
        return res.redirect('back')
      }
      // 检查密码是否匹配
      if (password!== user.password) {
        req.flash('error', '用户名或密码错误')
        return res.redirect('back')
      }
      req.flash('success', '登录成功')
      // 用户信息写入 session
      delete user.password
      req.session.user = user
      // 跳转到主页
      res.redirect(301,'/table')
    })
    .catch(next)
})

module.exports = router