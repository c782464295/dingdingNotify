module.exports = {
	port:8080,//监听端口号
	session:{
		secret:'session_secret',
		key:'session_id',//
		maxAge:10*60*1000//session过期时间,10min
	},//session配置信息
	mongodb:'mongodb://localhost:27017/',//mongodb地址
	corp:{
		CORP_ID : '',
		CORP_SECRET :'',
		AGENT_ID:''
	},//设置企业CorpSecret
	
}