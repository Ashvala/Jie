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
    generate_ChannelMessage("instr-4-level", 800);
    generate_ChannelMessage("reverb-feedback", 800);
    generate_ChannelMessage("WaveGuide-Filter-Freq", 800)
});

note_arr = [60,62,63,67,68,72]
i = 1

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


var obj = {
    beat1: [60, 63, 67],
    beat2: [72],
    beat3: [48],
    beat4: [64],
    beat5: [60, 67],
    beat6: [84],
    beat7: [60],
    beat8: [60]
}

var play_sequence_object = function(obj_inp, vel, dur){
    arr_ind = i
    str = "beat" + arr_ind;



    for (note in obj_inp[str]){
        note_num = parseInt(obj_inp[str][note]);
        midi_byte_note_on = [147, note_num,vel]
        console.log("note on message sent: ",  midi_byte_note_on)
        console.log("current arr_ind: ", note)
        console.log("current note number: ", note_num)
        socket.emit("MIDImessage", midi_byte_note_on)
        setTimeout(function(){
                console.log("---------");
                console.log("current arr_ind: ", note)
                console.log("current note number: ", note_num)
                midi_byte_note_off = [131, note_num, vel]
                console.log("note off message sent: ", midi_byte_note_off)
                console.log("---------");
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



//setInterval(play_note, 3000, note_arr[Math.floor(Math.random()*note_arr.length)],72, 1500)
//setInterval(play_note_sequence, 500,72, 250)

setInterval(play_sequence_object, 3000, obj, 72, 1000)

//console.log("that was using a setTimeout")
