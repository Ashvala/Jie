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
var split_orcs = [];
var section_count = 0;

var orc_str;
fs.readFile("0.orc", "utf-8", function(err, data) {
  if (err) {
    throw err;
  }
  orc_str = data;
  console.log(orc_str);

});

function client_deets(name, id) {
  this.name = name
  this.id = id
}

function get_client(id) {
  var found_index = -1;
  for (i in clients) {
    if (clients[i].id == id) {
      found_index = id;
    }
  }
  return found_index
}

//
io.on('connection', function(socket) {
  console.log("Connected a client");
  //  clients.push(socket.id);
  io.to(socket.id).emit("current_id", socket.id);

  var n_client = new client_deets(NaN, socket.id);
  clients.push(n_client)
  console.log(clients);
  total_clients += 1

  for (i in clients) {
    console.log(clients[i].id)
    io.to(clients[i].id).emit("instrument_ctrl", i % 6)
  }

  if (clients.length == 6) {
    io.emit("serve_choices")
  }

  socket.on("request_orc", function() {
    io.to(socket.id).emit('orc', orc_str);;
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
    var index = get_client(outgoing_client.id);
    console.log(index);
    clients.splice(index, 1);
    console.log(clients);
    total_clients = total_clients - 1;
    for (i in clients) {
      io.to(clients[i].id).emit("instrument_ctrl", (get_client(socket.id) % 6))
    }
  });
  socket.on("control_disable", function(msg) {
    console.log(msg);
    io.emit("control_disable", msg)
  });

  socket.on("client_list_req", function() {
    console.log("Client list was requested!")
    io.to(socket.id).emit("client_list", clients)
  });
  socket.on("client_name", function(obj) {
    var args = obj.split(":::")
    console.log(obj);
    for (i in clients) {
      if (clients[i].id == socket.id) {
        clients[i].name = args[1]
      }
    }
    console.log(clients)
    io.emit("client_add", obj)
  });

});
