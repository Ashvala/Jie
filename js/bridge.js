var express = require('express');
var app = express();
var url = 'mongodb://crimson.local:27017/CsSocket';
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

// get instruments and follow a schema
var instrumentModel = mongoose.model("instrumentModel", new Schema({name: String, orchestra:String}), "instruments")

// I'm getting used to Mongoose. This is actually kind of cool! I like it.
// this is a find function to update the instruments
instrumentModel.find({}, function(err, doc){
  if(doc != null){
    console.log(doc.length)
    for (i in doc){
      console.log(doc[i])
      instruments.push(doc[i]);
    }
  }
});

// connection event
io.on("connection", function(socket){
    console.log("connected a client!");
    // handle a request for instruments.
    socket.on("get_instruments", function(){
      io.to(socket.id).emit("instrs", instruments);
    });
    // update instr - TODO
    socket.on("update_instr", function(obj){
      console.log(obj._id);

    });
    // create new instr - IN PROGRESS
    socket.on("create_new_instr", function(){
      var new_instr = new instrumentModel({name: "new instrument", orchestra: ""})
      new_instr.save(function(err, res){
        if(err){
          console.log("oops");
        }else{
          console.log(res.id)
          io.to(socket.id).emit("instr_new", res.id)
        }
      });
    });
});
