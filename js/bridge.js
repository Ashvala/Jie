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
var client_id_arr = [];
var total_clients = 0;
var current_orc = "";
var split_orcs = [];
var section_count = 0;

var orc_str;
fs.readFile("0_1.orc", "utf-8", function(err, data) {
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
        console.log(msg);
        if (msg.event_type == "add_client"){
            temp_ins_num = get_client_idArr(socket.id)
            temp_client_val = {}
            temp_client_val.name = msg.event_args.name
            if(clients.length <= 6){
                temp_client_val.role = "ensemble"
            }else{
                socket.emit("disable_all");
            }
            temp_client_val.socket_id = socket.id
            temp_client_val.controlling = NaN
            clients.push(temp_client_val);
            console.log(clients)
            console.log(get_client(socket.id))
            ind = get_client(socket.id)
            clients[ind].id = ind
            io.emit("client_add",clients[ind])
            io.to(socket.id).emit("you",clients[ind])
            if (count_total_csoundable(clients) == 6){
                console.log("full orch")
            }
            if (count_total_csoundable(clients) > 6){
                console.log("not sending anything")
            }
	        if (count_total_csoundable(clients) < 6){
                console.log("not sending anything... yet", count_total_csoundable(clients))
            }
        }else if (msg.event_type == "control_disable") {
            client_ind = get_client(msg.from.socket_id)
            if(client_ind != -1){
                clients[client_ind].controlling = msg.event_args
                console.log("Updated client list to reflect control change!")
                io.emit("client_list", clients)
            }
        }else{
            io.emit("event", msg);
        }
    });

    /** MIDI things */

    socket.on("MIDImessage", function(msg){
        console.log("MIDImessage");
        io.emit("MIDImessage",msg);
    })

    /** Old code that actually works. */
    // if you request the orchestra, you get it.
    socket.on("request_orc", function() {
        io.to(socket.id).emit('orc', orc_str);
    });

    socket.on("orc", function(msg) {
        io.emit("orc", msg);
    });


    //Handle disconnects like the champ that you are.

    socket.on("disconnect", function() {
        console.log("Disconnected");
        var outgoing_client = socket;
        var index = get_client(outgoing_client.id);
        clients.splice(index, 1);
        for(i in clients){
            clients[i].id = i
            io.to(clients[i].socket_id).emit("you", clients[i])
        }
        console.log("Clients list post disconnect: ", clients);
        total_clients = total_clients - 1;
        io.emit("client_list", clients);
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
