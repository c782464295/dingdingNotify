var https=require('https');
const querystring = require('querystring');
const config = require('config-lite')(__dirname)

module.exports = {
    postNotify: function(accessToken, req){
		for(var p in req.body.data){//遍历json数组时，这么写p为索引

			let l_msg = JSON.stringify(
			{
				"msgtype": "markdown",
				"markdown": {
					"title":req.body.data[p]['姓名'] +":工资",
					"text":
		   
					"# 工资条：\r\n"+
					"# ●人员基本费用总计（一+六）：" + req.body.data[p]['费用总计'] + "\r\n" +
					"# 一、应发工资 ：" + req.body.data[p]["一、应发"] + "\r\n" +
					"# 二、实发工资（一+三-四-五）：" + req.body.data[p]["二、实发"] + "\r\n" +
					"# 三、奖励部分：" + req.body.data[p]["三、奖励"] + "\r\n" +
					"# 四、扣减部分合计：" + req.body.data[p]["四、扣减"] + "\r\n" +
						"# 4.1、考勤：" + req.body.data[p]["考勤"] + "\r\n" +
						"# 4.2、处罚：" + req.body.data[p]["处罚"] + "\r\n" +
						"# 4.3、餐费：" + req.body.data[p]["餐费"] + "\r\n" +
						"# 4.4、差额部分：" + req.body.data[p]["差额"] + "\r\n" +
					"# 五、代缴部分合计：" + req.body.data[p]["五、代缴"] + "\r\n" +
						"# 5.1、个税代缴：" + req.body.data[p]["个税"] + "\r\n" +
						"# 5.2、五险一金代缴：" + req.body.data[p]["五险一金"] + "\r\n" +
						"# 5.3、意外险代缴：" + req.body.data[p]["意外险"] + "\r\n" +
					"# 六、公司承担部分合计：" + req.body.data[p]["六、公司承担合计"] + "\r\n" +
						"# 6.1、五险一金：" + req.body.data[p]["五险一金"] + "\r\n" +
						"# 6.2、意外险：" + req.body.data[p]["意外险"] + "\r\n" +
						"# 6.3、工会经费：" + req.body.data[p]["工会"] + "\r\n" +
						"# 6.4、职工教育经费：" + req.body.data[p]["职工教育"] + "\r\n" 
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