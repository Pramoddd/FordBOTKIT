var express = require('express');
//var router = express.Router();
var request = require('request');
var rp = require('request-promise');
var googleAuth = require('google-oauth-jwt');
var app = express();
var server = require('http').Server(app);
var port = process.env.PORT || 8080;

var body_parser = require('body-parser');
var accessToken = "ya29.Ci_CA4PDT4qGJ4AL4Ph5_NIg5ikrNvglvi_bWBhtAFiN0ewojwDWg1joyqYW1w9axQ";
app.use(body_parser.json());

function sendMailHelper(_Ticket,_Body){
    return sendEmail(_Ticket,_Body, accessToken);
}

function sendEmail(_Ticket,_Body, access_token){
  var mail = [
  'Content-Type: multipart/mixed; boundary="foo_bar_baz"\r\n',
  'MIME-Version: 1.0\r\n',
  'From: <kstream001@gmail.com>\r\n',
  'To: <pramod.deshpande@kore.com><shantanu.ghorai@kore.com>\r\n',
  'Ticket:<'+_Ticket+'>\r\n',
  'Subject:Ticket '+_Ticket+':escalation\r\n\r\n',
  'Body:<'+_Body+'>\r\n',
  '--foo_bar_baz\r\n',
  'Content-Type: text/plain; charset="UTF-8"\r\n',
  'MIME-Version: 1.0\r\n',
  'Content-Transfer-Encoding: 7bit\r\n\r\n',

   _Body+'\r\n\r\n'
];
var options = {
	uri :'https://www.googleapis.com/upload/gmail/v1/users/me/messages/send?uploadType=multipart',
	method: "POST",
    headers: {
        "Authorization": "Bearer "+accessToken,
        "Content-Type": "message/rfc822",
      },
    body: mail
  }
 
 var data = {
 	_Ticket:_Ticket,
    _Body:_Body
 }
 
 return APICall(options, data).then(function(result){
 	return result;
 });

}
function APICall(_options, data){
_options.resolveWithFullResponse= true;
_options.simple = false
 return rp(_options).then(function(response){
 	console.log('Send mail response');
 	console.log(response.statusCode)
  	if(response.statusCode == 200){
  		return JSON.parse(response.body);
  	} else if(response.statusCode == 401) {
  		console.log('Token expired')
		var refresh_token = "1/3HabHykFsv-o1QWWKw9zw62wtwanDpXvyOfkew9p87Y";
      return getAccessToken(refresh_token).then(function(dataRes){
      	   console.log('Get access token');
           accessToken = dataRes.access_token;
           return sendEmail(data._Ticket, data._Body);
      });
  	}
  });
}
function getAccessToken(_token) {
   var rOptions = { 
   	 method: 'POST',
     url: 'https://accounts.google.com/o/oauth2/token',
     headers: 
      { 
       'content-type': 'application/x-www-form-urlencoded' 
      },
     form: 
      { 
   	   client_id: '560607550870-4hlmnvhjmobu8nrl0nk066odfg2t118j.apps.googleusercontent.com',
       client_secret: 'dLeMbLK1HcHyZDI-ylck0Rn8',
       grant_type: 'refresh_token',
       refresh_token: _token 
     },
     resolveWithFullResponse: true,
     simple: false 
   };
 return rp(rOptions).then(function(response){
 	console.log('Refress Token');
 	console.log(typeof response.body);
       return JSON.parse(response.body);
  })
  .catch(function(err){
   console.log(err.statusCode);
  });
}  
module.exports.sendMailHelper = sendMailHelper;
