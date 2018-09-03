var querystring = require("querystring");
var httpUtil = require('../util/http');
const config = require('config-lite')(__dirname)

module.exports = {
    
    getAccessToken: function(cb) {
      var path = '/gettoken?' + querystring.stringify({
        corpid: config.corp.CORP_ID,
        corpsecret: config.corp.CORP_SECRET
      });
      httpUtil.get(path, cb);
    },
    
    getTicket: function(accessToken, cb) {
      var path = '/get_jsapi_ticket?' + querystring.stringify({
        type: 'jsapi',
        access_token: accessToken
      });
      httpUtil.get(path, cb);
    },
};