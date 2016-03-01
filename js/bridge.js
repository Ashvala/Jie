var express = require('express');
var mongoose = require('mongoose');
//var midi = require('midi');

var app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});

var fs = require("fs");


var io = require('socket.io').listen(8080);
console.log("Listening on port: 8181");
var clients = [];
var client_id_arr = [];
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
//    console.log(orc_str);

});

function get_client(id) {
    var found_index = -1;
    for (i in clients) {
        if (clients[i].socket_id == id) {
            found_index = i;
        }
    }
    return found_index
}
function get_client_idArr(id) {
    var found_index = -1;
    for (i in client_id_arr) {
        if (client_id_arr[i]== id) {
            found_index = i;
        }
    }
    return found_index
}



function count_total_csoundable(arr) {
    var total = 0
    for (i in arr) {
        //console.log(arr[i].role)
        if (arr[i].role == "ensemble") {
            total += 1
            //console.log("Csound Total: ", total)
        }
    }
    return total
}


function handle_event(msg){
    console.log(msg);
    event = msg

}


//Connection event handlers.
io.on('connection', function(socket) {


    //useful debug info
    console.log("Connected a client");
    //  clients.push(socket.id);
    // you get your ID
    client_id_arr.push(socket.id)
    io.to(socket.id).emit("current_ind", get_client_idArr(socket.id));
    // might need to relook into this function

    // Basically, a event handler for event handling... Much ayy lmao
    socket.on("event", function(msg) {
        console.log("Event message coming through:\n")
        if (msg.event_type == "add_client"){
            temp_ins_num = get_client_idArr(socket.id)
            temp_client_val = {}
            temp_client_val.name = msg.event_args.name
            temp_client_val.role = msg.event_args.role
            temp_client_val.socket_id = socket.id

            clients.push(temp_client_val);
            console.log(clients)
            console.log(get_client(socket.id))
            ind = get_client(socket.id)
            clients[ind].id = ind
            io.emit("client_add",clients[ind])
            io.to(socket.id).emit("you",clients[ind])

            if (count_total_csoundable(clients) == 6){
                io.emit("serve_choices");
            }
            if (count_total_csoundable(clients) > 6){
                console.log("not sending anything")
            }
	    if (count_total_csoundable(clients) < 6){
                console.log("not sending anything... yet", count_total_csoundable(clients))
            }
        }else{
	    console.log(msg);
            io.emit("event", msg);
        }
    });

    /** MIDI things */

    socket.on("MIDImessage", function(msg){
        console.log("Client Side MIDI!");
        io.emit("MIDImessage",msg);
    })

    /** Old code that actually works. */
    // if you request the orchestra, you get it.
    socket.on("request_orc", function() {
        io.to(socket.id).emit('orc', orc_str);
    });

    // if you get a note_message, throw the note_message through. Deprecated soon.
    socket.on("note_message", function(msg) {
        io.emit("note_message", msg);
        //        console.log(msg);
    });



    socket.on("orc", function(msg) {
        io.emit("orc", msg);
        //        console.log(msg);
    });

    // if you get a note_message, throw the score through. Deprecated soon.
    socket.on("sco", function(msg) {
        io.emit("sco", msg);
        //        console.log(msg);
    });

    // if you get a note_message, throw the channel through. Deprecated soon.
    socket.on("chanmsg", function(msg) {
        io.emit("chanmsg", msg);
        //        console.log(msg);
    });

    //Handle disconnects like the champ that you are.

    socket.on("disconnect", function() {
        console.log("Disconnected");
        var outgoing_client = socket;
        var index = get_client(outgoing_client.id);

        console.log(index);
        clients.splice(index, 1);
        client_id_arr.splice(index,1)
        console.log(clients);
        total_clients = total_clients - 1;

        for (i in clients) {
            io.to(clients[i].id).emit("instrument_ctrl", (get_client(socket.id) % 6))
        }
    });

    // If you click on something, you disable it here.

    socket.on("control_disable", function(msg) {
        console.log(msg);
        io.emit("control_disable", msg)
    });

    // If you request a client list, you get it here.

    socket.on("client_list_req", function() {
        console.log("Client list was requested!")
        io.to(socket.id).emit("client_list", clients)
    });

    socket.on('ping', function() {
        socket.emit('pong');
    });

});
