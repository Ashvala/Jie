var socket = io.connect("http://crimson.local:8181");
//Me. Just me.
var me = {};
// Get instrument number
var ins_num;
//the strategy for this is simple: replicate the server side client_arr here to make it easier to parse through data and the changes.
var client_arr = [];

//Temporary instrument number:
var temp_ins_num
var csoundObj;
verifyNote = function(event_args) {
    var split = event_args.split(" ");
    if (split[0] == "i") {
        return true
    } else {
        return false
    }
}
var color_arr_orig = ["#e67e22", "#0CA7DB", "#2c3e50", "#e74c3c", "#f1c40f", "#1abc9c"]

sequence_play = function(event_args) {
    if (sequence_triggered == 0) {
        sequence_triggered = 1
        glow_repeats()
    }
    if (csound.module){
        csound.ReadScore(event_args);
    }else{
        csoundObj.readScore(event_args);
    }

}
parse_event = function(event_obj) {
    if (event_obj.event_type == "note_message") {
        if (verifyNote(event_obj.event_args) == true) {
            notify("note_event", event_obj)
            $(".performer_space").each(function() {
                if ($(this).attr("data-id") == event_obj.from.id) {
                    //                    glow_animate($(this))
                }
            })
            $(".mini_performer_space").each(function() {
                if ($(this).attr("data-id") == event_obj.from.id) {
                    glow_animate($(this))
                }
            })
            if (csound.module) {
                csound.Event(event_obj.event_args);
            } else {
                csound.ReadScore(event_)
            }

        }
    } else if (event_obj.event_type == "channel_message") {
        channel_message(event_obj.event_args)
    } else if (event_obj.event_type == "sequence") {
        sequence_play(event_obj.event_args)
    } else if (event_obj.event_type == "MIDImessage") {
        handle_midi_message(event_obj.event_args)
    }
}

function handle_midi_message(args){
    console.log(args);
}
//if I ever use the csound moduleDidLoad function, I'll handle some of that code here.
function moduleDidLoad() {
    csound.Play();
    console.log("Csound loaded, perhaps!")
    $(".SocketField").css("display", "block");
    $(".obs_screen").fadeOut("slow");
}

Module['noExitRuntime'] = true;
Module['_main'] = function() {
    csoundObj = new CsoundObj();

    $(".obs_screen").fadeOut("slow");
    $('.SocketField').css("display", "block");
};

function handleMessage(message){
    console.log(message.data)
    if (message.data == "hat") {
        glow_animate_svg($(".menu-trigger"))
    }
    if (message.data == "kick") {
        scale_svg("#item-6")
    }
}

function channel_message(obj) {
    var new_str = obj.split(" ");
    var new_val = parseFloat(new_str[1]);
    if (csound.module){
        csound.SetChannel(new_str[0], new_val)
    }else{
        csoundObj.setControlChannel(new_str[0], new_val)
    }

    name = new_str[0];
    divstr = ".dial[data-name=" + name + "]";
    $(divstr).val(new_val);
}


// Enable socket
socket.on('connect', function(msg) {
    //console.log('Socket is up');
    if (!csound.module) {
        //console.log("oh");
    }
    socket.emit("client_list_req")
});

// You get your instrument number here.
socket.on("instrument_ctrl", function(msg) {
    //console.log(msg);
    ins_num = msg;
    $("body").css("background", "#eee");
    $(".title").css("color", "black");
});


socket.on("event", function(msg) {
    parse_event(msg)

});
var csound_msg; //use this in the future to develop stuff.
orc_str = ""

//Handle Orchestra messages here

socket.on('orc', function(obj) {
    //    //console.log(obj);
    if (csound.module) {
        csound.CompileOrc(obj);
    } else {
        console.log(createCSD(obj));
        FS.writeFile("/temp.csd", createCSD(obj), {encoding: 'utf8'});
        csoundObj.compileCSD("/temp.csd");
        csoundObj.start();
        var midiInputCallback = function(status) {

            if (status === true) {

                console.log("true")
            }
            else {

                console.log('false')
            }
        }
        csoundObj.enableMidiInput(midiInputCallback);

    }

    parseOrc(obj, "init");
});

socket.on('client_list', function(obj) {
    // set semi-circle back to a more default state.
    $(".item").children(".sector").css("fill", "#222");
    $(".item").each(function() {
        $(this).attr("data-disabled", false)
    });
    client_arr = obj;

    // iterate through an array
    for (i = 0; i <= obj.length - 1; i++) {
        //performer space details
        $(".performer_space").each(function() {
            if (parseInt($(this).attr("data-id")) == i) {
                $(this).css("background", color_arr_orig[i]);
                $(this).children(".performer_name").html(obj[i].name)
                $(this).children(".performer_controlling").html(section_names[parseInt(obj[i].controlling)])
            }
        });

        // semi circle sectors:
        $(".item").each(function() {
            if (parseInt($(this).attr("data-section-number")) == parseInt(obj[i].controlling)) {
                $(this).children(".sector").css("fill", color_arr_orig[i])
                $(this).attr("data-disabled", true)
            }
        })
    }
});

// Add a client. Could use tweaking.

socket.on("client_add", function(obj) {
    //console.log(obj);
    glow_animate_color($(".help_button"))
    var div_str = "<div class='client_button' style='background:" + color_arr_orig[obj.id] + "'> " + obj.name + "</div>"
    $(".client_bar").append(div_str)
    $(".performer_space").each(function() {
        if (parseInt($(this).attr("data-id")) == obj.id) {
            $(this).css("background", color_arr_orig[obj.id]);
            notify("new_client", obj);
            $(this).children(".performer_name").html(obj.name)
        }
    });
    $(".mini_performer_space").each(function() {
        if (parseInt($(this).attr("data-id")) == obj.id) {
            $(this).css("background", color_arr_orig[obj.id]);
            notify("new_client", obj);
            $(this).children(".performer_name").html(obj.name)
        }
    });
});


// aw, data about me? AWWWW
socket.on("you", function(obj) {
    me = obj;
    console.log(obj);
    $(".my_color").css("background", color_arr_orig[obj.id])
    $(".menu-trigger").css("fill", color_arr_orig[obj.id])
    $(".topbar").css("border-bottom", ("1px dotted " + color_arr_orig[obj.id]))
    ins_num = obj.id;
    $(".my_name").html(obj.name);
    //console.log("Received data about me!")
})

socket.on("disconnect", function(obj) {
    console.log("Oh noes!");
})

socket.on("MIDImessage", function(obj) {
    decompiledObj = obj
    console.log("MIDIMessage: Got message: ", obj)
    if(csound.module){
        csound.MIDIin(decompiledObj[0], decompiledObj[1], decompiledObj[2])
    }else{
        csoundObj.midiin(decompiledObj[0], decompiledObj[1], decompiledObj[2])
    }
})
var startTime;

setInterval(function() {
    startTime = Date.now();
    socket.emit('ping');
}, 2000);

socket.on('pong', function() {
    latency = Date.now() - startTime;
    //    console.log(latency);
});
