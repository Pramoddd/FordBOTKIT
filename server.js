var Application = require("./lib/app");
var Server      = require("./lib/server");
var sdk         = require("./lib/sdk");
var config      = require("./config");

var app    = new Application(null, config);
var server = new Server(config, app);
var port = process.env.PORT || 8000;

app.listen(port, function () {
    console.log("Listening on " + port);
});
server.start();
sdk.registerBot(require('./SimpleConversationalBot.js'));
sdk.registerBot(require('./LiveChat.js'));
sdk.registerBot(require('./GuessTheNumber.js'));
sdk.registerBot(require('./emailSending.js'));
