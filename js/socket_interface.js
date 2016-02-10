var socket = io.connect("http://crimson.local:8181");

// Enable socket

socket.on('connect', function(msg) {
    console.log('Socket is up');
    if(!csound.module){
	console.log("oh");
    }
});

var csound_msg; //use this in the future to develop stuff.

//Solitary note messages.

socket.on('note_message', function(obj) {
    console.log(obj);
    if (csound.module){
	console.log("can do csound events");
	var new_str = obj.split(" ");

	console.log(new_str[1]);
	var event_str = "i 1 0 4 " + new_str[1];
	console.log(event_str);
	csound.Event(event_str);
    }else{
	console.log("Sends csound events.");
    }
});

socket.on('current_id', function(msg){
    console.log(msg);
});

var ins_num;
socket.on("instrument_ctrl", function(msg){
    console.log(msg);
    ins_num = msg;
});
//Handle Orchestra messages here

socket.on('orc', function(obj) {
    console.log(obj);
    csound.CompileOrc(obj);
    parseOrc(obj, "init");
});


//Handle Score messages here

socket.on('sco', function(obj) {
    console.log(obj);
    if (csound.module){
	console.log("can do csound events");
	var new_str = obj.split(" ");
	console.log(new_str[1]);
	csound.Event(obj);
    }else{
	console.log("Sends csound events.")
    }
});

//Handle channel messages.

socket.on('chanmsg', function(obj) {
    if (csound.module){
	console.log("can do csound events");
	var new_str = obj.split(" ");
	console.log(new_str[0]);
	var new_val = parseFloat(new_str[1]);
	console.log(new_val);
	csound.SetChannel(new_str[0], new_val)
	name = new_str[0];
	divstr = ".dial[data-name=" + name + "]";
	$(divstr).val(new_val);
    }else{
	console.log("Sends csound events.")
    }
});

//Use a simple ping and pong mechanism
var startTime;
setInterval(function() {
    startTime = Date.now();
    socket.emit('ping');
}, 200);

socket.on('pong', function() {
    latency = Date.now() - startTime;
    console.log(latency + " ms");
});
