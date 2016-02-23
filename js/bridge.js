var express = require('express');
var mongoose = require('mongoose');

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

function get_client(id) {
    var found_index = -1;
    for (i in clients) {
        if (clients[i].id == id) {
            found_index = i;
        }
    }
    return found_index
}

function count_total_csoundable(arr) {
    var total = 0
    for (i in arr) {
        console.log(arr[i].role)
        if (arr[i].role == "ensemble") {
            total += 1
            console.log(total)
        }
    }
    return total
}
//connection event


// All the event handling happens under here

io.on('connection', function(socket) {


    //useful debug info
    console.log("Connected a client");
    //  clients.push(socket.id);
    // you get your ID
    io.to(socket.id).emit("current_id", socket.id);
    var n_client = {}
        //var n_client = client_deets(NaN, socket.id, "observer");
        //create a new client object
    n_client.name = "Hello" // name
    n_client.id = socket.id // id
    n_client.role = "Observer" // observer
    clients.push(n_client) //append to array
    console.log(clients); //print it out
    total_clients += 1 // add to total

    // might need to relook into this function

    for (i in clients) {
        console.log(clients[i].id) // clients
        io.to(clients[i].id).emit("instrument_ctrl", i % 6) // client modulo 6
    }

    if (count_total_csoundable(clients) === 6) { //ONLY IF IT EQUALS 6
        io.emit("serve_choices")
    }
    // if you request the orchestra, you get it.
    socket.on("request_orc", function() {
        io.to(socket.id).emit('orc', orc_str);
    });

    // if you get a note_message, throw the note_message through. Deprecated soon.
    socket.on("note_message", function(msg) {
        io.emit("note_message", msg);
        console.log(msg);
    });

    socket.on("event", function(msg) {
        console.log(msg);
        io.emit("event", msg);
    })

    socket.on("orc", function(msg) {
        io.emit("orc", msg);
        console.log(msg);
    });

    // if you get a note_message, throw the score through. Deprecated soon.
    socket.on("sco", function(msg) {
        io.emit("sco", msg);
        console.log(msg);
    });

    // if you get a note_message, throw the channel through. Deprecated soon.
    socket.on("chanmsg", function(msg) {
        io.emit("chanmsg", msg);
        console.log(msg);
    });

    //Handle disconnects like the champ that you are.

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

    // If you get the message about being able to Csound, you basically update things on your end
    socket.on("csound_able", function() {
        console.log("csound able called?")
        console.log("index: ", get_client(socket.id));
        if (get_client(socket.id) <= 5) {
            console.log("lol?")
            clients[get_client(socket.id)].role = "ensemble";
            if (get_client(socket.id) == 5) {
                io.emit("serve_choices")
            }
        } else if (get_client(socket.id) > 5) {
            console.log("lol, no");
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

    // If you send a client name, I'll change it for you, following which, I will send you the details about the object to add. 
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
