var socket = require("socket.io-client")("http://crimson.local:8181");

// function generate_client(){
//     client_deets = {}
//     name = Math.random();
//     role = "ensemble";
//     ev_dets = {}
//     ev_dets.event_type = "add_client"
//     ev_args = {}
//     ev_args.name = name
//     ev_dets.event_args = ev_args
//     return ev_dets
// }

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

//var note = note_arr[Math.floor(Math.random()*note_arr.length)];
var play_note = function(note_num, vel, duration){
    console.log("Note number was: ", note_num)
    midi_byte_note_on = [144, note_num,vel]
    midi_byte_note_off = [128, note_num,vel]
    console.log("note on message sent to channel 1")
    socket.emit("MIDImessage", midi_byte_note_on)
    setTimeout(function(){
        console.log("note off message sent to channel 1")
        socket.emit("MIDImessage", midi_byte_note_off)
    },duration)

}
i = 0

setInterval(play_note, 3000, note_arr[Math.floor(Math.random()*note_arr.length)],72, 1500)

console.log("that was using a setTimeout")
