var https=require('https');
const querystring = require('querystring');
const config = require('config-lite')(__dirname)

module.exports = {
    postNotify: function(accessToken, req){
		for(var p in req.body.data){//遍历json数组时，这么写p为索引

			let l_msg = JSON.stringify({
				"msgtype": "oa",
				"oa": {
					"message_url": "http://jylink.com",
					"head": {
						"text": "工资卡",//无效，会被自动替换为微应用名称
						"bgcolor": "FFBBBBBB",
					},

					"body":{
						"title":req.body.data[p]['部门'] + "账户卡",
						"form":[//超过10个会被隐藏
						{
							"key": "全年任务:",
							"value": req.body.data[p]['全年任务']
						},
						{
							"key": "基础任务:",
							"value": req.body.data[p]['基础任务']
						},
						{
							"key": "提取比例:" + req.body.data[p]['提取比例'] + "\r\n" + "技术服务费标准:" + req.body.data[p]['技术服务费'] + "\r\n" + "汇款比例:" + req.body.data[p]['汇款比例'],
							"value": ""
						},
						{
							"key": "收入:",
							"value": req.body.data[p]['收入']
						},{
							"key": "合同收入：" + req.body.data[p]['合同收入'] + "\r\n" + "退税收入：" + req.body.data[p]['退税收入'] + "\r\n" + "其他收入：" + req.body.data[p]['其他收入'],
							"value": ""
						},
						{
							"key": "支出:",
							"value": req.body.data[p]['支出']
						},
						{
							"key": "成本支出:" + req.body.data[p]['成本支出'] + "\r\n" + "费用支出:" + req.body.data[p]['费用支出'] + "\r\n" + "其他支出：" + req.body.data[p]['其他支出'],
							"value": ""
						},
						{
							"key": "毛利:",
							"value": req.body.data[p]['毛利']
						},
						{
							"key": "已支薪资:",
							"value": req.body.data[p]['已支薪资']
						},
						],
					"rich": {
						"num": "余额：" + req.body.data[p]['账户余额'],
						"unit": "元"
					},
					"content": "收件人:" + req.body.data[p]['姓名'],
					"image": "@lADPBY0V5EpOHXFHzQFw",
					"author": "财务"
					}
				}
			})
		
		
			let post_data = querystring.stringify({
				access_token : accessToken,
				agent_id	:config.corp.AGENT_ID,
				userid_list :req.body.data[p]['员工UserID'],
				msg	:l_msg
			
			});
			
			let options = {
				host: 'oapi.dingtalk.com',
				path:'/topapi/message/corpconversation/asyncsend_v2',
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'

				}
			};
			
			let reqHttps = https.request(options, function(resHttps) {
				//console.log("statusCode: ", resHttps.statusCode);
				//console.log("headers: ", resHttps.headers);
		 
				resHttps.setEncoding('utf8');
				resHttps.on('data', function(d) {
						console.log(''+d);//将buffer转为字符串或者使用d.toString()
						let b = JSON.parse(''+d);//将buffer转成JSON
						
				});
			// write data to request body

			
			
			

			
			});
			reqHttps.write(post_data);
			reqHttps.end();
			

			
		}
	}

  
  
  
  

};