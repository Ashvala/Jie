var socket = io.connect("http://172.30.9.66:8585");
//Me. Just me.
var me = {};
// Get instrument number
var ins_num;
//the strategy for this is simple: replicate the server side client_arr here to make it easier to parse through data and the changes.
var client_arr = [];
var note_ev_dets = {}
    //Temporary instrument number:
var temp_ins_num
    // Enable socket


socket.on('connect', function(msg) {
    ev_dets = {}
    ev_dets.event_type = "add_client"
    ev_args = {}
    ev_args.name = "presentation_ipad"
    ev_args.role = "ensemble";
    ev_dets.event_args = ev_args
    socket.emit("event", ev_dets)
        //console.log('Socket is up');
    if (!csound.module) {
        //console.log("oh");
    }
    socket.emit("client_list_req")
});


dial_init = function() {
    $(".dial").knob({
        'font': "Roboto",
        'change': function(val) {
            // var final_message;
            // var name = this.$.attr("data-name");
            // var final_message_filt = name +" "+ parseInt(val);
            // socket.emit('chanmsg', final_message_filt);
            var final_message;
            var name = this.$.attr("data-name");
            var final_message_filt = name + " " + parseInt(val);
            ev_dets = {}
            ev_dets.from = me
            ev_dets.event_type = "channel_message"
            ev_dets.event_args = final_message_filt
            socket.emit('event', ev_dets);
        }
    }); //Dial handled here

}

parseOrcLineAndRender = function(str) {
    var new_str = str.split(" ");
    var dial_str_head = '<div class="knob_container"><input type="text" value="0" class="dial" data-fgcolor="#27ae60" data-angleOffset="-125" data-angleArc="256" data-min="0" data-max="1000" data-thickness="0.2" data-width="150" data-height="150" data-font-family="Roboto" data-font-weight="300" data-name='

    var dial_str_mid = '> <div class="knob_name"> '

    var dial_str_tail = "</div> </div>"

    if (new_str[1] == "chnget") {
        console.log("Rendering Channel Controller for this");
        var new_str = dial_str_head + new_str[2] + dial_str_mid + new_str[2] + dial_str_tail
        $(".parsed_knobs").append(new_str);
        dial_init();
    }

}
sanitize = function(orc_str) {
    args_arr = [];
    args_start = orc_str.indexOf("[{");
    args_end = orc_str.indexOf("}]");
    args_str = orc_str.slice(args_start, args_end + 2);
    args_arr = args_str.split("\n");
    str_arr = orc_str.split("\n");
    console.log(str_arr.indexOf("[{"));
    str_arr_final = str_arr.slice(0, str_arr.indexOf("[{"));
    console.log(str_arr_final.indexOf("[{"));
    console.log(args_str);
    console.log(args_arr);
    parseArgs(args_arr);
    return str_arr_final;
}

parseOrc = function(str) {
    $(".parsed_knobs").html(" ");
    str_arr = str.split("\n");
    for (var i = 0; i < str_arr.length; i++) {
        parseOrcLineAndRender(str_arr[i]);
    }
    $(".parsed_elements_container").fadeIn("fast");
}

verifyNote = function(event_args) {
    //console.log(event_args);
    //console.log("here?")
    var split = event_args.split(" ");
    if (split[0] == "i") {
        return true
    } else {
        return false
    }
}
var color_arr_orig = ["#e67e22", "#0CA7DB", "#2c3e50", "#e74c3c", "#f1c40f", "#1abc9c"]

var color_arr = ["#afafaf", "#afafaf", "#afafaf", "#afafaf", "#afafaf", "#afafaf"]
sequence_play = function(event_args) {
    csonud.ReadScore(event_args);
}

// glow_animate = function(div_obj) {
//     original_lightness = $.Color(div_obj, 'background').lightness()
//     new_lightness = original_lightness + 0.1;
//     original_hsla = $.Color(div_obj, 'background').hsla()
//     original_rgba = $.Color(div_obj, 'background').rgba()
//     new_hsla = {}
//     new_hsla.hue = original_hsla.hue
//     new_hsla.saturation = original_hsla.saturation
//     new_hsla.lightness = new_lightness
//     new_hsla.alpha = original_hsla.alpha
//
//
//     div_obj.animate({
//         backgroundColor: $.Color({
//             lightness: new_lightness
//         })
//     }, 1500).delay(1400);
//     div_obj.animate({
//         backgroundColor: $.Color({
//             lightness: original_lightness
//         })
//     }, 1500);
// }
// glow_animate_color = function(div_obj) {
//     original_lightness = $.Color(div_obj, 'color').lightness()
//     new_lightness = original_lightness + 0.4;
//     original_hsla = $.Color(div_obj, 'color').hsla()
//     original_rgba = $.Color(div_obj, 'color').rgba()
//     new_hsla = {}
//     new_hsla.hue = original_hsla.hue
//     new_hsla.saturation = original_hsla.saturation
//     new_hsla.lightness = new_lightness
//     new_hsla.alpha = original_hsla.alpha
//     console.log(original_lightness)
//     div_obj.animate({
//         color: $.Color({
//             lightness: new_lightness
//         })
//     }, 200).delay(1400);
//     div_obj.animate({
//         color: $.Color({
//             lightness: original_lightness
//         })
//     }, 200);
// }

parse_event = function(event_obj) {
    //console.log("the event type specified was: ", event_obj.event_type)
    if (event_obj.event_type == "note_message") {
        //console.log("This is a note event")
        if (verifyNote(event_obj.event_args) == true) {
            //console.log("this can be sent");
            //console.log(event_obj.event_args)
            //            notify("note_event", event_obj)
            $(".performer_space").each(function() {
                if ($(this).attr("data-id") == event_obj.from.id) {
                    // glow_animate($(this))
                    // glow_animate_color($(".topbar"))
                }
            })
            $(".mini_performer_space").each(function() {
                if ($(this).attr("data-id") == event_obj.from.id) {
                    // glow_animate($(this))
                }
            })
            csound.Event(event_obj.event_args);
        }
    } else if (event_obj.event_type == "channel_message") {
        //console.log("This is a channel message")
        channel_message(event_obj.event_args)
    } else if (event_obj.event_type == "sequence") {
        //console.log("Got a sequence");
        sequence_play(event_obj.event_args)
    } else if (event_obj.event_type == "add_client_to_ensemble") {

    }
}

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

//Solitary note messages. Deprecated.
socket.on('note_message', function(obj) {
    //console.log("THIS IS DEPRECATED. USE socket.emit('event') INSTEAD ")
    //console.log(obj);
    if (csound.module) {
        //console.log("can do csound events");
        var new_str = obj.split(" ");
        //console.log(new_str[1]);
        var event_str = "i 1 0 4 " + new_str[1];
        //console.log(event_str);
        csound.Event(event_str);
    } else {
        //console.log("Sends csound events.");
    }
});


// current id... never used this...

socket.on('current_ind', function(msg) {
    //console.log(msg);
    temp_ins_num = msg
});

orc_str = ""

//if I ever use the csound moduleDidLoad function, I'll handle some of that code here.
function moduleDidLoad() {
    csound.Play();
    console.log("Csound loaded, perhaps!")
    $(".SocketField").css("display", "block");
    $(".obs_screen").fadeOut("slow");
    //        $(".client_bar").fadeIn("slow");
}

function handleMessage(message) {
    console.log(message.data)
}

//Handle Orchestra messages here

socket.on('orc', function(obj) {
    //    //console.log(obj);
    if (csound.module) {
        csound.CompileOrc(obj);
    } else {
        //console.log("Huh");
    }
    parseOrc(obj, "init");
});


//Handle Score messages here

socket.on('sco', function(obj) {
    //console.log("THIS IS DEPRECATED. USE socket.emit('event') INSTEAD ")
    //console.log(obj);
    if (csound.module) {
        var new_str = obj.split(" ");
        //console.log(new_str[1]);
        csound.Event(obj);
    } else {
        //console.log("Sends csound events.")
    }
});


//needs a rewrite. Can I tie this in with the new Event API?

socket.on("control_disable", function(obj) {

    var args = obj.split(":::")
    if (args[0] != ins_num) {
        $(".instrument_button").each(function() {
            //console.log($(this).attr("data-section-number"))
            if ($(this).attr("data-section-number") == parseInt(args[1])) {
                $(this).css("background", color_arr_orig[parseInt(args[0])])
                $(this).attr("data-disabled", "true");
            }

        });
        $(".performer_space").each(function() {
            if (parseInt($(this).attr("data-id")) == parseInt(args[0])) {
                $(this).css("background", color_arr_orig[parseInt(args[0])]);
                $(this).children(".performer_controlling").html(section_names[parseInt(args[1])])
            }
        });
    }
});


// chnset handler

function channel_message(obj) {
    var new_str = obj.split(" ");
    //console.log(new_str[0]);
    var new_val = parseFloat(new_str[1]);
    //console.log(new_val);
    csound.SetChannel(new_str[0], new_val)
    name = new_str[0];
    divstr = ".dial[data-name=" + name + "]";
    $(divstr).val(new_val);
}

//Handle channel messages. Deprecated.

socket.on('chanmsg', function(obj) {
    //console.log("THIS IS DEPRECATED. USE socket.emit('event') INSTEAD ")
    if (csound.module) {
        //console.log("can do csound events");
        var new_str = obj.split(" ");
        //console.log(new_str[0]);
        var new_val = parseFloat(new_str[1]);
        //console.log(new_val);
        csound.SetChannel(new_str[0], new_val)
        name = new_str[0];
        divstr = ".dial[data-name=" + name + "]";
        $(divstr).val(new_val);
    } else {
        //console.log("Sends csound events.")
    }
});

// Client List. This can use a bit of tweaking

socket.on('client_list', function(obj) {
    //console.log(obj)
    client_arr = obj;
    for (i = 0; i <= obj.length - 1; i++) {
        //console.log(obj[i].name);
        var div_str = "<div class='client_button' style='background:" +
            "white" + "'> " + obj[i].name + "</div>"
        $(".client_bar").append(div_str)
            // //console.log(obj[i].id)
        $(".performer_space").each(function() {
            if (parseInt($(this).attr("data-id")) == i) {
                //console.log("from client_list");
                $(this).css("background", color_arr_orig[i]);
                $(this).children(".performer_name").html(obj[i].name)
            }
        });
        $(".mini_performer_space").each(function() {
            if (parseInt($(this).attr("data-id")) == i) {
                //console.log("from client_list");
                $(this).css("background", color_arr_orig[i]);
            }
        });
    }
});

// Add a client. Could use tweaking.

socket.on("client_add", function(obj) {
    //console.log(obj);
    //    glow_animate_color($(".help_button"))
    var div_str = "<div class='client_button' style='background:" + color_arr_orig[obj.id] + "'> " + obj.name + "</div>"
    $(".client_bar").append(div_str)
    $(".performer_space").each(function() {
        if (parseInt($(this).attr("data-id")) == obj.id) {
            $(this).css("background", color_arr_orig[obj.id]);
            //            notify("new_client", obj);
            $(this).children(".performer_name").html(obj.name)
        }
    });
    $(".mini_performer_space").each(function() {
        if (parseInt($(this).attr("data-id")) == obj.id) {
            $(this).css("background", color_arr_orig[obj.id]);
            //            notify("new_client", obj);
            $(this).children(".performer_name").html(obj.name)
        }
    });
});

// When the server says "SERVE ORCHESTRAS", you serve the damn orchestras.

socket.on("serve_choices", function() {
    socket.emit("request_orc")
});

// aw, data about me? AWWWW
socket.on("you", function(obj) {
    me = obj;
    console.log(obj);
    console.log($(".curr_sock_id").html())
    var final_mesg = "i 1 0 4 60"
    console.log(final_mesg);

    note_ev_dets.from = obj
    note_ev_dets.event_type = "note_message"
    note_ev_dets.event_args = final_mesg
    $(".editor").val(JSON.stringify(note_ev_dets, null, 2))
    $(".my_color").css("background", color_arr_orig[obj.id])
    $(".topbar").css("border-bottom", ("1px dotted " + color_arr_orig[obj.id]))
    ins_num = obj.id;
    //console.log("Received data about me!")
})

socket.on("disconnect", function(obj) {
    console.log("Oh noes!");
})

socket.on("MIDImessage", function(obj) {
    decompiledObj = obj
    console.log("MIDIMessage: Got message: ", obj)
    csound.MIDIin(decompiledObj[0], decompiledObj[1], decompiledObj[2])
})
var startTime;

setInterval(function() {
    startTime = Date.now();
    socket.emit('ping');
}, 2000);

socket.on('pong', function() {
    latency = Date.now() - startTime;
    console.log(latency);
});
