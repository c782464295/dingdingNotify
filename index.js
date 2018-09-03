const path = require('path');
const winston = require('winston')
const expressWinston = require('express-winston')
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const config = require('config-lite')(__dirname)
const pkg = require('./package')
const routes = require('./routes/index');
const bodyParser = require('body-parser');
const app = express();


//设置模板目录
app.set('views', path.join(__dirname, 'views'))
//设置模板引擎ejs
app.set('view engine', 'ejs');
//设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')))
//session中间件
app.use(session({
	name:config.session.key,//设置cookie中保存session id的字段名称
	secret:config.session.secret,//设置secret计算hash值放在cookie中，防止篡改
	resave:true,//强制更新session
	saveUninitialized:true,//即使用户未登录也会创建一个session
	cookie:{
		maxAge:config.session.maxAge//过期时间，过期后cookie中的session id自动删除
	},
	store: new MongoStore({//将session存储到mongodb
		url:config.mongodb//mongodb地址
	})
}))
app.use(bodyParser.urlencoded({extended:true}))
//flash中间件，显示通知
app.use(flash())

// 设置模板全局常量
app.locals.blog = {
  title: pkg.name,
  description: pkg.description
}

// 添加模板必需的三个变量
app.use(function (req, res, next) {
  res.locals.user = req.session.user
  res.locals.success = req.flash('success').toString()
  res.locals.error = req.flash('error').toString()
  next()
})

//日志记录
// 正常请求的日志
app.use(expressWinston.logger({
  transports: [
    new (winston.transports.Console)({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/success.log'
    })
  ]
}))


//路由
app.use('', routes);
app.use('/', require('./routes/signin'));
app.use('/table', require('./routes/table'))
app.use('/table_yx', require('./routes/table_yx'))
app.use('/signup', require('./routes/signup'))
app.use('/signin', require('./routes/signin'))
app.use('/signout', require('./routes/signout'))








// 404 page，设置404页面
app.use(function (req, res) {
	if (!res.headersSent) {
		res.sendfile("./html/404.html"); 
		//res.status(404).render('404')
	}
})

// 监听端口，启动程序
app.listen(config.port)

