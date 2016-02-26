var socket = io.connect("http://crimson.local:8181");
//Me. Just me.
var me = {};
// Get instrument number
var ins_num;
//the strategy for this is simple: replicate the server side client_arr here to make it easier to parse through data and the changes.
var client_arr = [];

//Temporary instrument number:
var temp_ins_num
// Enable socket

socket.on('connect', function(msg) {
    //console.log('Socket is up');
    if (!csound.module) {
        //console.log("oh");
    }
    socket.emit("client_list_req")
});



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

glow_animate = function(div_obj){
    original_lightness = $.Color(div_obj, 'background').lightness()
    new_lightness = original_lightness + 0.05;
    original_hsla = $.Color(div_obj, 'background').hsla()
    original_rgba = $.Color(div_obj, 'background').rgba()
    new_hsla = {}
    new_hsla.hue = original_hsla.hue
    new_hsla.saturation = original_hsla.saturation
    new_hsla.lightness = new_lightness
    new_hsla.alpha = original_hsla.alpha


    div_obj.animate({
        backgroundColor: $.Color({lightness: new_lightness})
    }, 1500).delay(1400);
    div_obj.animate({
        backgroundColor: $.Color({lightness: original_lightness})
    }, 1500);
}
glow_animate_color = function(div_obj){
    original_lightness = $.Color(div_obj, 'color').lightness()
    new_lightness = original_lightness + 0.4;
    original_hsla = $.Color(div_obj, 'color').hsla()
    original_rgba = $.Color(div_obj, 'color').rgba()
    new_hsla = {}
    new_hsla.hue = original_hsla.hue
    new_hsla.saturation = original_hsla.saturation
    new_hsla.lightness = new_lightness
    new_hsla.alpha = original_hsla.alpha
    console.log(original_lightness)
    div_obj.animate({
        color: $.Color({lightness: new_lightness})
    }, 200).delay(1400);
    div_obj.animate({
        color: $.Color({lightness: original_lightness})
    }, 200);
}

parse_event = function(event_obj) {
    //console.log("the event type specified was: ", event_obj.event_type)
    if (event_obj.event_type == "note_message") {
        //console.log("This is a note event")
        if (verifyNote(event_obj.event_args) == true) {
            //console.log("this can be sent");
            //console.log(event_obj.event_args)
            notify("note_event", event_obj)
            $(".performer_space").each(function(){
                if($(this).attr("data-id") == event_obj.from.id){
                    glow_animate($(this))
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
    } else if (event_obj.event_type == "add_client_to_ensemble"){

    }
}

// You get your instrument number here.
socket.on("instrument_ctrl", function(msg) {
    //console.log(msg);
    ins_num = msg;
    $("body").css("background", "#eee" );
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

// function handleMessage(message) {
//     //console.log(message.data)
// }

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
    //console.log(args[0], args[1])
    if (args[0] != ins_num) {
        ////console.log("I am " + ins_num + " you are on: " + args[1] + " and this implies that the background is going to be " + color_arr_orig[parseInt(args[0])])
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
        "white"+ "'> " + obj[i].name + "</div>"
        $(".client_bar").append(div_str)
        // //console.log(obj[i].id)
        $(".performer_space").each(function() {
            if (parseInt($(this).attr("data-id")) == i) {
                //console.log("from client_list");
                $(this).css("background", color_arr_orig[i]);
                $(this).children(".performer_name").html(obj[i].name)
            }
        });
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
});

// When the server says "SERVE ORCHESTRAS", you serve the damn orchestras.

socket.on("serve_choices", function() {
    socket.emit("request_orc")
});

// aw, data about me? AWWWW
socket.on("you", function(obj){
    me = obj;
    $(".my_color").css("background", color_arr_orig[obj.id])
    //console.log("Received data about me!")
})

socket.on("disconnect", function(obj){
    console.log("Oh noes!");
})

socket.on("MIDImessage", function(obj){
    csound.MIDIin(obj)
})
