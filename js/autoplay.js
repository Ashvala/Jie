var socket = require("socket.io-client")("http://crimson.local:8181");


/** generate a bot*/
generate_client = function(index){
    client_deets = {}
    name = Math.random();
    role = "ensemble";
    ev_dets = {}
    ev_dets.event_type = "add_client_special"
    ev_args = {}
    ev_args.name = name
    ev_args.socket_id = index
    ev_dets.event_args = ev_args
    return ev_dets
}

/* generate a channel message */
generate_ChannelMessage = function(name, val){
    var final_message = name + " " + parseInt(val);
    ev_dets = {}
    ev_dets.event_type = "channel_message"
    ev_dets.event_args = final_message
    socket.emit('event', ev_dets);
}

/** generate a control disable command! */
generate_ctrl_disable = function(instr){
    c = generate_client(instr);
    socket.emit('event',c)
    var ev_r = {};
    ev_r.from = c
    ev_r.event_type = "control_disable";
    ev_r.event_args = instr;
    return ev_r
}

/** Main socket code */
socket.on("connect", function(){

    console.log("connected");
    generate_ChannelMessage("Modal-Resonance", 90);
    generate_ChannelMessage("filterFreq", 394);
    generate_ChannelMessage("instr-1-level", 800);
    generate_ChannelMessage("instr-4-level", 300);
    generate_ChannelMessage("instr-3-level", 800);
    generate_ChannelMessage("instr-2-level", 100);
    generate_ChannelMessage("lfo-rate", 250);
    generate_ChannelMessage("reverb-feedback", 800);
    generate_ChannelMessage("WaveGuide-Filter-Freq", 800)
    for (k = 0; k < 5; k++){
        socket.emit("event", generate_ctrl_disable(k))
    }
});

note_arr = [60,62,63,67,68,72]
i = 1

/** simple play note example */
var play_note = function(note_num, vel, duration){
    console.log("Note number was: ", note_num)
    midi_byte_note_on = [147, note_num,vel]
    midi_byte_note_off = [131, note_num,vel]
    console.log("note on message sent: ",  midi_byte_note_on)
    socket.emit("MIDImessage", midi_byte_note_on)
    setTimeout(function(){
        console.log("note off message sent: ", midi_byte_note_off)
        socket.emit("MIDImessage", midi_byte_note_off)
    },duration)

}

/** play a sequence of notes from an array */

var play_note_sequence = function(vel, dur){
    arr_ind = i
    console.log("Note number was: ", note_arr[arr_ind])
    midi_byte_note_on = [144, note_arr[arr_ind],vel]
    midi_byte_note_off = [128, note_arr[arr_ind],vel]
    console.log("note on message sent to channel 1")
    socket.emit("MIDImessage", midi_byte_note_on)
    setTimeout(function(){
        console.log("note off message sent to channel 1")
        socket.emit("MIDImessage", midi_byte_note_off)
    },dur)
    if (i == 5){
        i = 0
    }else{
        i +=1
    }
}


var melody1 = {
    beat1: [60],
    beat2: [63],
    beat3: [65],
    beat4: [63],
    beat5: [67],
    beat6: [60],
    beat7: [70],
    beat8: [72]
}

var bass_beats = {
    beat1: [60-24],
    beat2: [63-24],
    beat3: [65-24],
    beat4: [63-24],
    beat5: [67-24],
    beat6: [60-24],
    beat7: [70-24],
    beat8: [72-24]
}

var melody2 = {
    beat1: [72],
    beat2: [65],
    beat3: [63],
    beat4: [67],
    beat5: [70],
    beat6: [60],
    beat7: [63],
    beat8: [60]
}

var play_sequence_object = function(obj_inp,channel, vel, dur){
    arr_ind = i
    str = "beat" + arr_ind;
    for (note in obj_inp[str]){
        note_num = parseInt(obj_inp[str][note]);
        midi_byte_note_on = [143 + channel, note_num,vel]
        console.log("note on message sent: ",  midi_byte_note_on)
        socket.emit("MIDImessage", midi_byte_note_on)
        setTimeout(function(){
                midi_byte_note_off = [127 + channel, note_num, vel]
                console.log("note off message sent: ", midi_byte_note_off)
                socket.emit("MIDImessage", midi_byte_note_off)
        },dur)
    }
    //reset counters
    if (i == 9){
        i = 1
    }else{
        i += 1
    }
}

var play_seq = function(cb, list, channel, vel){
    setInterval(cb, 500, list, channel, vel, 250)
}

var delay_play = function(cb, actual_cb, list, channel, vel, delay){
    setTimeout(cb, delay,actual_cb, list, channel, vel)
}

/* main sequences */

play_seq(play_sequence_object, melody1, 1, 70)
delay_play(play_seq, play_sequence_object, melody2, 4, 70, 4000)
delay_play(play_seq, play_sequence_object, bass_beats, 2, 70, 12000)
