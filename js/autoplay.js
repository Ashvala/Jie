var socket = require("socket.io-client")("http://crimson.local:8181");

function generate_client(){
    client_deets = {}
    name = Math.random();
    role = "ensemble";
    ev_dets = {}
    ev_dets.event_type = "add_client"
    ev_args = {}
    ev_args.name = name
    ev_dets.event_args = ev_args
    return ev_dets
}

generate_ChannelMessage = function(name, val){
    var final_message = name + " " + parseInt(val);
    ev_dets = {}
    ev_dets.event_type = "channel_message"
    ev_dets.event_args = final_message
    socket.emit('event', ev_dets);
}
socket.on("connect", function(){
    console.log("connected");
    generate_ChannelMessage("Modal-Resonance", 800);
    generate_ChannelMessage("filterFreq", 800);
    generate_ChannelMessage("instr-1-level", 800);
});

note_arr = [60,62,63,67,68,72]
get_note = function(){
    return note_arr[Math.floor(Math.random()*note_arr.length)];
}
var note = note_arr[Math.floor(Math.random()*note_arr.length)];
var playNoteOn = function(instr_num){
    MIDIByte1 = [(143 + instr_num), note, 72]
    socket.emit("MIDImessage", MIDIByte1)
    // setInterval(function(){
    //     MIDIByte2 = [(127 + instr_num), note, 72]
    //     socket.emit("MIDImessage", MIDIByte)
    // }, 2500)
}

var playNoteOff = function(instr_num){

}
playNoteOn(1)
