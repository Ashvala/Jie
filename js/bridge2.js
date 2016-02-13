var express = require('express');
var app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});

var fs = require("fs");

var io = require('socket.io').listen(8282);
console.log("Listening on port: 8181");
var clients = [];
var total_clients = 0;
var current_orc = "";
var split_orcs = [];
var section_count = 0;

var orc_str;

split_orc = function(orc_str){
    var prev_index = 0;
    fs.readFile("0.orc", "utf-8", function(err, data){
	if(err){throw err;}
	orc_str = data;
	console.log(orc_str);
    });
    temp_arr = orc_str.split("\n");
    for (i = 0; i < temp_arr.length; i++){
	if(temp_arr[i].indexOf(";") == 0){
	    temp_str = temp_arr[i];
	    if(temp_str[0] == ";" && temp_str[temp_str.length-1] == ";"){
		section_count += 1;
		console.log("Section count: ", section_count);
		var ret_str = orc_str.substring(prev_index,orc_str.indexOf(temp_str)-1);
		split_orcs.push(ret_str);
		prev_index = orc_str.indexOf(temp_str) + temp_str.length + 1;
		var remaining = orc_str.substring(prev_index, orc_str.length);
		split_orc(remaining);
	    }
	}
    }
}

split_orc(orc_str)
console.log(split_orcs)

//
io.on('connection', function (socket) {
    console.log("Connected a client");
    clients.push(socket.id);
    io.to(socket.id).emit("current_id",socket.id);
    console.log(clients);
    total_clients +=1
    io.to(socket.id).emit("instrument_ctrl", (clients.indexOf(socket.id)%6));
    socket.on("request_orc", function(){
	io.to(socket.id).emit('orc',orc_str);;
    });

    socket.on("note_message", function (msg) {
	io.emit("note_message", msg);
	console.log(msg);
    });

    socket.on("orc", function (msg) {
	io.emit("orc", msg);
	console.log(msg);
    });

    socket.on("sco", function (msg) {
	io.emit("sco", msg);
	console.log(msg);
    });
    socket.on("chanmsg", function (msg) {
	io.emit("chanmsg", msg);
	console.log(msg);
    });

    socket.on("disconnect", function(){
	console.log("Disconnected");
	var outgoing_client = socket;
	var index = clients.indexOf(outgoing_client.id);
	console.log(index);
	clients.splice(index, 1);
	console.log(clients);
	total_clients = total_clients -1;

    });
});
