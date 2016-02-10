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

var io = require('socket.io').listen(8181);
console.log("Listening on port: 8181");
var clients = [];
var total_clients = 0;
var current_orc = "";

io.on('connection', function(socket) {
  console.log("Connected a client");
  clients.push(socket.id);,
  io.emit("current_id", socket.id);
  console.log(clients);
  total_clients += 1
  var orc_str;
  fs.readFile("0.orc", "utf-8", function(err, data) {
    if (err) throw err;
    orc_str = data;
    console.log(orc_str);
    console.log(typeof orc_str);
  });
  io.to(socket.id).emit("instrument_ctrl", clients.indexOf(socket.id));
  socket.on("request_orc", function() {
    io.to(socket.id).emit('orc', orc_str);
  });

  socket.on("note_message", function(msg) {
    io.emit("note_message", msg);
    console.log(msg);
  });

  socket.on("orc", function(msg) {
    io.emit("orc", msg);
    console.log(msg);
  });

  socket.on("sco", function(msg) {
    io.emit("sco", msg);
    console.log(msg);
  });
  socket.on("chanmsg", function(msg) {
    io.emit("chanmsg", msg);
    console.log(msg);
  });

  socket.on("disconnect", function() {
    console.log("Disconnected");
    var outgoing_client = socket;
    var index = clients.indexOf(outgoing_client.id);
    console.log(index);
    clients.splice(index, 1);
    console.log(clients);
    total_clients = total_clients - 1
  });
  socket.on('ping', function() {
    socket.emit('pong');
  });
});
