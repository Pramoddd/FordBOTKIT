var botId = "st-b1341b26-18fe-53da-9020-fec09b679e5a";
var botName = "FORD Poc_Demo";
var sendMail = require('./sendMail.js').sendMailHelper; 
var sdk = require("./lib/sdk");
module.exports = {
    botId   : botId,
    botName : botName,

    on_user_message : function(requestId, data, callback) {
        sdk.sendBotMessage(data, callback);
    },
    on_bot_message  : function(requestId, data, callback) {
        var message;
	
        if (data.context.guess) {
            if (data.context.guess.isMore) {
                message = "Lesser than that";
            } else if (data.context.guess.isLess) {
                message = "More than that";
            } else if (data.context.guess.isCorrect) {
                message = "That is correct! You just took " + data.context.guessCount + " guesses!" ;
            }
        } else if (data.context.theNumber) {
            message = "I have a number between 1 & 100. Try and guess it!";
        }

        if (message) {
            data.message = message;
        }
        sdk.sendUserMessage(data, callback);
    },
    on_webhook    : function(requestId, data, componentName, callback) {
        var context  = data.context;
        var entities = context.entities || {};

        if (componentName === 'Send_email') {
            //context.comment= context.entities.comment;
            //context.cdsid = context.entities.Cdsid;
			sendMail(context.entities.Comment, context.entities.Email_id,context.entities.CDSID);
			console.log("Your details will be updated.");
            callback(null, data);
        }
}};