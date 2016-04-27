var socket = require("socket.io-client")("http://crimson.local:8181");


/** generate a bot*/
generate_client = function(index){
    client_deets = {}
    name = Math.random();
    role = "ensemble";
    var ev_dets = {}
    ev_dets.event_type = "add_client_special"
    var ev_args = {}
    ev_args.name = name
    ev_args.socket_id = index
    ev_dets.event_args = ev_args
    return ev_dets
}

/* generate a channel message */
generate_ChannelMessage = function(name, val){
    var final_message = name + " " + parseInt(val);
    var ev_dets = {}
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
    for (var k = 0; k < 5; k++){
        socket.emit("event", generate_ctrl_disable(k))
    }
});

note_arr = [60,62,63,67,68,72]
i = 1

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


var delay_play = function(cb, actual_cb, list, channel, vel, delay, counter){
    setTimeout(cb, delay,actual_cb, list, channel, vel, counter)
}
function sequence(obj){
        this.obj = obj;
        this.counter = 1;
}

sequence.prototype.return_melody = function(){
    return this.obj;
}
sequence.prototype.get_counter = function(){
    return this.counter;
}
sequence.prototype.play_beat = function(channel, vel, dur){
    str = "beat" + (this.counter);
    for (note in this.obj[str]){
        note_num = parseInt(this.obj[str][note]);
        console.log(this.counter, '::', note_num);
        midi_byte_note_on = [143 + channel, note_num,vel]
        socket.emit("MIDImessage", midi_byte_note_on)
        setTimeout(function(){
                midi_byte_note_off = [127 + channel, note_num, vel]
                socket.emit("MIDImessage", midi_byte_note_off)
        },dur)
    }
    if(this.counter == 8){
        this.counter = 1;
    }else{
        this.counter += 1
    }
}

sequence.prototype.play = function(channel, vel, dur){
    setInterval(function(){
        this.play_beat(channel, vel, dur)
    }.bind(this),dur*2);
}


/* main sequences */
var melody_bell = new sequence(melody1)
var bass_line = new sequence(bass_beats)
var guitar_line = new sequence(melody2)
melody_bell.play(1,72,500)
bass_line.play(2, 72, 500)
guitar_line.play(4, 72,500)
