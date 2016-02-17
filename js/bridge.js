var express = require('express');
var app = express();
var url = 'mongodb://localhost:27017/CsSocket';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect(url);
//express stuff. Just for Cross-origin requests. Don't do this on production.
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});


// socket.io
var io = require('socket.io').listen(8181);
console.log("Listening on port: 8181");
// instrument definitions
var instruments = [];
var retrieve = function(err, collection){
  collection.find().toArray(function(err, results){
    console.log(results)
  });
}

var instrumentModel = mongoose.model("instrumentModel", new Schema({"name": String, "orchestra":String}), "instruments")
instrumentModel.find({}, function(err, doc){
  if(doc != null){
    console.log(doc.length)
    console.log(doc[0]);
    instruments.push(doc[0]);
  }
})

io.on("connection", function(socket){
    console.log("connected a client!");
    console.log(instruments)
    socket.on("get_instruments", function(){
      io.to(socket.id).emit("instrs", instruments);
    });
});
