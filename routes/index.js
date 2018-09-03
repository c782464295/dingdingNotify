var https = require('https');
var querystring = require('querystring');
var express = require('express');
var router = express.Router();



//apis
var auth = require('../api/auth');
var department = require('../api/department');

//utils
var sign = require('../util/sign');

//自建API
var notify = require('../api/notify');
var notify_yx = require('../api/notify_yx');

var accessToken;
var departmentId;
var jsapiTicket;

var apis = {
  'auth/getAccessToken': {
    tag: '获取AccessToken',
    action: function(cb) {
      auth.getAccessToken({
          success: function(data) {
            if (data && data.access_token) {
              accessToken = data.access_token;
              //cb.success(accessToken);
			  cb.success('OK');
            }
            else {
              error('cannot get access_token');
            }
          },
          error: cb.error
        });
    }
  },
  
  'department/create': {
    tag: '创建部门',
    action: function(cb) {
      var dept = {
        name: 'TestDeptNodeJs6',
        parentid: '1',
        order: '1'
      };
      department.create(accessToken, dept, {
          success: function(data) {
            if (data) {
              departmentId = data.id;
              if (departmentId) {
                cb.success('OK. 新增部门id:' + departmentId);
                return;
              }
            }
            cb.error('cannot get departmentId: ' + data);
          },
          error: cb.error
        });
    }
  },
  
  'department/list': {
    tag: '获取部门列表',
    action: function(cb) {
      department.list(accessToken, {
        success: function(data) {
          cb.success('OK. 部门数量:' + data.department.length);
        },
        error: cb.error
      });
    }
  },
  
  'department/delete': {
    tag: '删除部门',
    action: function(cb) {
      department.delete(accessToken, departmentId, {
        success: function(data) {
          cb.success('OK. 删除部门id:' + departmentId);
        },
        error: cb.error
      });
    }
  },
  
  'auth/getTicket': {
    tag: '获取jsapi ticket',
    action: function(cb) {
      auth.getTicket(accessToken, {
        success: function(data) {
          if (data && data.ticket) {
            jsapiTicket = data.ticket;
            cb.success('OK. jsapi ticket:' + jsapiTicket);
          }
          else {
            error('cannot get jsapi_ticket');
          }
        },
        error: cb.error
      });
    }
  },

  'sign/getJsapiSign': {
    tag: '获取signature',
    action: function(cb) {
      var signature = sign.getJsapiSign({
        ticket: jsapiTicket,
        nonceStr: 'abcdefg',
        timeStamp: new Date().getTime(),
        url: "http://www.baidu.com"
      });
      console.log('signature:' + signature);
      cb.success('OK. signature:' + signature);
    }
  },

};

var apiMap = {};
var apiSequence = [];


function addApi(apiName, api) {
  var apiPath = '/api/' + apiName;
  apiSequence.push(apiPath);
  apiMap[apiPath] = {
    tag: api.tag
  };
  router.get(apiPath, function(req, res, next) {
      api.action({
        success: function(data) {
          res.send({msg: JSON.stringify(data)});
        },
        error: function(message) {
          res.send({err: 'api error: ' + JSON.stringify(message)});
        }
      });
  });
}




router.get('/get_sign', function(req, res, next) {
  var params = {
    nonceStr: req.query.nonceStr,
    timeStamp: req.query.timeStamp,
    url: decodeURIComponent(req.query.url)
  };
  sign.getSign(params, {
    success: function(data) {
      res.send(data);
    },
    error: function(err) {
      res.send(err);
    }
  });
});

router.get('/get_apis', function(req, res, next) {
  res.send({
    msg : {
      map: apiMap,
      sequence: apiSequence
    }
  });
});
//新增的通知功能-----------------------------

router.post('/post_notify', function(req, res, next) {
	notify.postNotify(accessToken, req);
	res.send("OK:Notify");
});
router.post('/post_notify_yx', function(req, res, next) {
	notify_yx.postNotify(accessToken, req);
	res.send("OK:Notify");
});
//--------------------------------------------
for (var api in apis) {
  addApi(api, apis[api]);
}

module.exports = router;