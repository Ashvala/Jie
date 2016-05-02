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
    generate_ChannelMessage("Modal-Resonance", 1000);
    generate_ChannelMessage("filterFreq", 394);
    generate_ChannelMessage("Sampler-Out-Level", 400);
    generate_ChannelMessage("Sampler-Reverb-Level", 400);
    generate_ChannelMessage("instr-1-level", 344);
    generate_ChannelMessage("instr-4-level", 100);
    generate_ChannelMessage("instr-3-level", 100);
    generate_ChannelMessage("kick-send", 400);
    generate_ChannelMessage("snare-send", 600);
    generate_ChannelMessage("hat-send", 400);
    generate_ChannelMessage("vibrato-depth", 1000);
    generate_ChannelMessage("instr-2-level", 10);
    generate_ChannelMessage("lfo-rate", 250);
    generate_ChannelMessage("ReverbSend", 500);
    generate_ChannelMessage("reverb-feedback", 300);
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

function sequence(obj, name, type) {
    this.obj = obj;
    this.counter = 1;
    this.name = name;
    if (type == undefined) {
        this.type = "melodic"
    }
    this.repeat = 0;
}

sequence.prototype.arr_to_obj = function(array) {
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
            beat_str = "beat" + (i + 1)
            console.log(array[i])
            obj_arr[beat_str].push(array[i])
        }
        this.obj = obj_arr
    } else {
        return -1
    }
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
//        console.log("name: ", this.name, " sending midi note on: ", midi_byte_note_on[1], "beat number: ", this.counter)
    console.log("beat number: ", this.counter, " :: ", this.name)
        socket.emit("MIDImessage", midi_byte_note_on)
        setTimeout(function() {
            midi_byte_note_off = [127 + channel, note_num, vel]
            socket.emit("MIDImessage", midi_byte_note_off)
        }.bind(this), dur)
    }
    if (this.counter == 8) {
        this.counter = 1;
        this.repeat += 1;
        this.check_repeat_update();
    } else {
        this.counter += 1;
    }


}
sequence.prototype.generate_csound_score = function(instr, arr) {
    curr_time = 0
    string = ""
    for (beat in arr) {
        if (arr[beat] == 1) {
            csd_str = "i \"" + instr + "\" " + curr_time + " 0.25" + "\n"
            string += csd_str
        }
        curr_time += 0.25
    }
    return (string)
}
sequence.prototype.create_drum_str = function() {
    csd_str = ""
    csd_str += this.generate_csound_score("hat", this.obj["hat"])
    csd_str += this.generate_csound_score("snare", this.obj["snare"])
    csd_str += this.generate_csound_score("kick", this.obj["kick"])
    return csd_str
}

sequence.prototype.check_repeat_update = function(){
//    console.log(this.repeat + " number of repeats")
    if (this.repeat == 4){
        if(this.name == "bell"){
            console.log("Update bell melody")
            this.set_melody(melody2);
        }
        if(this.name == "guitar"){
            this.set_melody(melody1);
        }
    }
    if (this.repeat == 8){
        if(this.name == "bell"){
            console.log("Update bell melody back")
            this.set_melody(melody1);
        }

    }
    if (this.repeat == 6){
        if(this.name == "bell"){
            drum_line.play(10, 0, 4000);
        }
    }
    if(this.repeat == 16){
        if(this.name == "bell"){
            generate_ChannelMessage("instr-1-level", 0)
            generate_ChannelMessage("instr-2-level", 0)
            generate_ChannelMessage("instr-3-level", 0)
            generate_ChannelMessage("instr-4-level", 0)
            generate_ChannelMessage("reverb-feedback", 0)
        }
    }
}


sequence.prototype.play_drums = function() {
    var ev_d = {}
    ev_d.from = 5
    ev_d.event_type = "sequence"
    ev_d.event_args = this.create_drum_str()
    socket.emit("event", ev_d)
}
trigger_sample= function() {
    var ev_d = {}
    ev_d.from = 0
    ev_d.event_type = "note_message"
    ev_d.event_args = "i \"rural\" 0 60"
    socket.emit("event", ev_d)
}
sequence.prototype.play = function(channel, vel, dur) {
    if (this.type == "melodic") {
        setInterval(function() {
            this.play_beat(channel, vel, (dur/2))
        }.bind(this), dur);
    } else {
        setInterval(function() {
            this.play_drums()
        }.bind(this), dur)
    }
}

sequence.prototype.delay = function(channel, vel, delay_dur, dur) {
    setTimeout(function() {
        this.play(channel, vel, dur);
    }.bind(this), delay_dur);
}


sequence.prototype.stop = function(int, time) {
    setTimeout(clearInterval(int), time)
}

sequence.prototype.set_melody = function(new_obj){
    console.log("setting melody")
    this.obj = new_obj
}

/** Main part of this app */
var drum_obj = {
    "kick": [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    "hat": [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0],
    "snare": [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
};
var melody_bell = new sequence(melody1, "bell")
var bass_bell = new sequence(bass_beats, "bell_bass")
var bass_line = new sequence(bass_beats, "bass")
var guitar_line = new sequence(melody2, "guitar")
var clarinet_line = new sequence(melody1, "clarinet_line")
var drum_line = new sequence(drum_obj, "drums", "drum")
/**-------ALL THE MUSIC HAPPENS HERE--------*/
trigger_sample()
melody_bell.play(1, 72,1000)
bass_line.delay(2, 72, 20000, 2000)
guitar_line.play(4, 50, 2000)

/**-------ALL THE MUSIC HAPPENS HERE--------*/
