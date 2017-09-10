var express = require("express");
var mongodb = require("mongodb");
var bodyParser = require('body-parser');
var moment = require('moment');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
var MongoClient = require('mongodb').MongoClient,assert = require('assert');
//var url = "mongodb://52.71.161.217:27017/ford";
var url = "mongodb://heroku_vxr8k48q:uk3quacbn4u8tk63ungijlmh3n@ds119064.mlab.com:19064/heroku_vxr8k48q";
app.post('/ford/bot/getUserDetails', function (request, response) {
    console.log("/ford/bot/getUserDetails", request.body);
    MongoClient.connect(url, function (err, db) {
		assert.equal(null, err);
		console.log("Connected correctly to server");
        if (err)
            throw err;
        var filter = {};
        if (request.body.cdsId == null || request.body.cdsId == undefined || request.body.cdsId == '') {
		var user = {"data": {"success": "No results found."}};
		response.send(user);		
		db.close();
        }
		else {
			filter.cdsId = request.body.cdsId;		
			db.collection("userDetails").find(filter).toArray(function (err, result) {
            if (err)
                throw err;            
			var user = {"data": {"tables": result, "totalRows": result.length, "pageRows": result.length, "success": true}};
            response.send(user);			
			db.close();
        });
		}
        
		console.log(filter)
    });
});

app.post('/ford/bot/getTicketStatus', function (request, response) {
    console.log("/ford/bot/getTicketStatus", request.body);
    MongoClient.connect(url, function (err, db) {
		assert.equal(null, err);
		console.log("Connected correctly to server");
        if (err)
            throw err;
        var filter = {};
        if (request.body.ticketId == null || request.body.ticketId == undefined || request.body.ticketId == '') {
            var user = {"data": {"success": "No results found."}};
			response.send(user);		
			db.close();			
        }		
		else {
			filter.ticketId = request.body.ticketId;
			db.collection("ticketDetails").find(filter).toArray(function (err, result) {
            if (err)
                throw err;
			var ticket = {"data": {"tables": result, "totalRows": result.length, "pageRows": result.length, "success": true}};
            response.send(ticket);
			db.close();
        });
		}        
		console.log(filter);
    });
});

app.post('/ford/bot/getMyTicketDetails', function (request, response) {
    console.log("/ford/bot/getMyTicketDetails", request.body);
    MongoClient.connect(url, function (err, db) {
		assert.equal(null, err);
		console.log("Connected correctly to server");
        if (err)
            throw err;
        var filter = {};
        if (request.body.requestedForCdsId == null || request.body.requestedForCdsId == undefined || request.body.requestedForCdsId == '') {
            //console.log(filter);
			var ticket = {"data": {"success": "No results found."}};
            response.send(ticket);
			db.close();			
        }
		else{
			filter.requestedForCdsId = request.body.requestedForCdsId;
			db.collection("ticketDetails").find(filter).toArray(function (err, result) {
            if (err)
                throw err;
			var ticket = {"data": {"tables": result, "totalRows": result.length, "pageRows": result.length, "success": true}};
            response.send(ticket);
			db.close();
        });
		}
		console.log(filter);
    });
});
app.get('/ford/bot/getLatestTicketId', function (request, response) {
    console.log("/ford/bot/getLatestTicketId");
    MongoClient.connect(url, function (err, db) {
		assert.equal(null, err);
		console.log("Connected correctly to server");
        if (err)
            throw err;
        db.collection('ticketDetails').aggregate([{$sort: {"ticketId": -1}}, {$limit: 1}]).toArray(function (err, result) {
            if (err)
                throw err;
            var lastTicket = {"data": {"tables": result, "totalRows": result.length, "pageRows": result.length, "success": true}};
            response.send(lastTicket);
            db.close();
        });
    });
});
app.post('/webhook',function(err,res){
	if(err){
		console.log(err.stack);
	}
	var filter = {"userName": "mladd", "region": "North America"};
	console.log("success");
	res.send(filter);
	
});
app.post('/ford/bot/submitRequest', function (request, response) {
    console.log("/ford/bot/submitRequest", request.body);
    MongoClient.connect(url, function (err, db) {
		assert.equal(null, err);
		console.log("Connected correctly to server");
        if (err)
            throw err;
        var filter = {};
        if (request.body.ticketId !== null && request.body.ticketId !== undefined && request.body.ticketId !== '') {
            filter.ticketId = request.body.ticketId;
        }
		if (request.body.requestedForCdsId !== null && request.body.requestedForCdsId !== undefined && request.body.requestedForCdsId !== '') {
            filter.requestedForCdsId = request.body.requestedForCdsId;
        }
		if (request.body.requestedForEmail !== null && request.body.requestedForEmail !== undefined && request.body.requestedForEmail !== '') {
            filter.requestedForEmail = request.body.requestedForEmail;
        }
		if (request.body.requestedForFullName !== null && request.body.requestedForFullName !== undefined && request.body.requestedForFullName !== '') {
            filter.requestedForFullName = request.body.requestedForFullName;
        }
		if (request.body.approverCdsId !== null && request.body.approverCdsId !== undefined && request.body.approverCdsId !== '') {
            filter.approverCdsId = request.body.approverCdsId;
        }
		if (request.body.approverFullName !== null && request.body.approverFullName !== undefined && request.body.approverFullName !== '') {
            filter.approverFullName = request.body.approverFullName;
        }
		if (request.body.approverEmail !== null && request.body.approverEmail !== undefined && request.body.approverEmail !== '') {
            filter.approverEmail = request.body.approverEmail;
        }
		if (request.body.region !== null && request.body.region !== undefined && request.body.region !== '') {
            filter.region = request.body.region;
        }
		if (request.body.requestType !== null && request.body.requestType !== undefined && request.body.requestType !== '') {
            filter.requestType = request.body.requestType;
        }
		if (request.body.comment !== null && request.body.comment !== undefined && request.body.comment !== '') {
            filter.comment = request.body.comment;
        }
		if (request.body.affectedDevice !== null && request.body.affectedDevice !== undefined && request.body.affectedDevice !== '') {
            filter.affectedDevice = request.body.affectedDevice;
        }
		if (request.body.issueType !== null && request.body.issueType !== undefined && request.body.issueType !== '') {
            filter.issueType = request.body.issueType;
        }
		if (request.body.shortDescription !== null && request.body.shortDescription !== undefined && request.body.shortDescription !== '') {
            filter.shortDescription = request.body.shortDescription;
        }
		if (request.body.longDescription !== null && request.body.longDescription !== undefined && request.body.longDescription !== '') {
            filter.longDescription = request.body.longDescription;
        }
		if (request.body.status !== null && request.body.status !== undefined && request.body.status !== '') {
            filter.status = request.body.status;
        }
		if (request.body.startDate !== null && request.body.startDate !== undefined && request.body.startDate !== '') {
            filter.startDate = request.body.startDate;
        }
		if (request.body.completionDate !== null && request.body.completionDate !== undefined && request.body.completionDate !== '') {
            filter.completionDate = request.body.completionDate;
        }
		console.log(filter);
        db.collection("ticketDetails").insert(filter, function (err, result) {
            if (err)
                throw err;
            var ticketSubmitDetails = {"data": {"success": true}};
            response.send(ticketSubmitDetails);
            db.close();
        });
    });
});


var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Listening on " + port);
});
