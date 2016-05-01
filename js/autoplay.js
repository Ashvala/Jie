var socket = require("socket.io-client")("http://crimson.local:8181");


/** generate a bot*/
generate_client = function(index) {
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
generate_ChannelMessage = function(name, val) {
    var final_message = name + " " + parseInt(val);
    var ev_dets = {}
    ev_dets.event_type = "channel_message"
    ev_dets.event_args = final_message
    socket.emit('event', ev_dets);
}

/** generate a control disable command! */
generate_ctrl_disable = function(instr) {
    c = generate_client(instr);
    socket.emit('event', c)
    var ev_r = {};
    ev_r.from = c
    ev_r.event_type = "control_disable";
    ev_r.event_args = instr;
    return ev_r
}

/** Main socket code */
socket.on("connect", function() {
    console.log("connected");
    generate_ChannelMessage("Modal-Resonance", 90);
    generate_ChannelMessage("filterFreq", 394);
    generate_ChannelMessage("instr-1-level", 800);
    generate_ChannelMessage("instr-4-level", 800);
    generate_ChannelMessage("instr-3-level", 100);
    generate_ChannelMessage("instr-2-level", 10);
    generate_ChannelMessage("lfo-rate", 250);
    generate_ChannelMessage("ReverbSend", 500);
    generate_ChannelMessage("reverb-feedback", 100);
    generate_ChannelMessage("WaveGuide-Filter-Freq", 440)

});

note_arr = [60, 63, 65, 67, 70, 72, 63, 72]
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
    beat1: [60 - 12],
    beat2: [63 - 12],
    beat3: [65 - 12],
    beat4: [63 - 12],
    beat5: [67 - 12],
    beat6: [60 - 12],
    beat7: [70 - 12],
    beat8: [72 - 12]
}

var bass_line = {
    beat1: [60 - 12],
    beat2: [60 - 12],
    beat3: [60 - 12],
    beat4: [60 - 12],
    beat5: [67 - 12],
    beat6: [67 - 12],
    beat7: [67 - 12],
    beat8: [67 - 12]
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

var melody3 = {
    beat1: [65],
    beat2: [60],
    beat3: [63],
    beat4: [70],
    beat5: [72],
    beat6: [67],
    beat7: [70],
    beat8: [67]
}

function sequence(obj, name) {
    this.obj = obj;
    this.counter = 1;
    this.name = name
}

sequence.prototype.return_melody = function() {
    return this.obj;
}
sequence.prototype.get_counter = function() {
    return this.counter;
}
sequence.prototype.play_beat = function(channel, vel, dur) {

    str = "beat" + (this.counter);
    for (note in this.obj[str]) {
        note_num = parseInt(this.obj[str][note]);

        midi_byte_note_on = [143 + channel, note_num, vel]
        console.log("name: ", this.name, " sending midi note on: ", midi_byte_note_on)
        socket.emit("MIDImessage", midi_byte_note_on)
        setTimeout(function() {
            midi_byte_note_off = [127 + channel, note_num, vel]
            console.log("name: ", this.name, " sending midi note off: ", midi_byte_note_off)
            console.log("---------")
            socket.emit("MIDImessage", midi_byte_note_off)
        }.bind(this), dur)
    }
    if (this.counter == 8) {
        this.counter = 1;
    } else {
        this.counter += 1
    }
}

sequence.prototype.play = function(channel, vel, dur) {
    setInterval(function() {
        this.play_beat(channel, vel, dur / 2)
    }.bind(this), dur);
}

sequence.prototype.delay = function(channel, vel, delay_dur, dur) {
    setTimeout(function() {
        this.play(channel, vel, dur);
    }.bind(this), delay_dur);
}

sequence.prototype.convert_to_obj = function(array) {
    var obj_arr = {
        "beat1": [],
        "beat2": [],
        "beat3": [],
        "beat4": [],
        "beat5": [],
        "beat6": [],
        "beat7": [],
        "beat8": []
    }
    if (array.length == 8) {
        for (i = 0; i < array.length; i++) {
            beat_str = "beat" + (i+1)
            console.log(array[i])
            obj_arr[beat_str].push(array[i])
        }
        this.obj = obj_arr
    } else {
        return -1
    }
}
var empty_obj = {}
var melody_bell = new sequence(melody1, "bell")
var bass_line = new sequence(bass_beats, "bass")
var guitar_line = new sequence(melody2, "guitar")
var clarinet_line = new sequence({}, "clarinet_line")
clarinet_line.convert_to_obj(note_arr)
//bass_line.play(2, 72, 500)
melody_bell.play(1, 72, 1000)
guitar_line.delay(4, 10, 1000)

//melody_bell.play(1, 50, 1000)
