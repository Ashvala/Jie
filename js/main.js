var performance_mode;
var controlling_bool = false;
var controlling_item = NaN;
var field_visible = true;

function arg(arg_name, argument_list) {
    this.arg_name = arg_name
    this.argument_list = argument_list
}
glow_repeats = function(){
    n = 1
    setInterval(function(){
        beat_val = n%16
        if (beat_val == 0){
            beat_str = "[data-beat=" + 16 + "]"
        }else{
            beat_str = "[data-beat=" + beat_val + "]"
        }
        $(beat_str).transition({"-webkit-filter": "brightness(0.8)"}).delay(10).transition({"-webkit-filter": "brightness(1)"})
        n += 1
    }, 248)
}
dial_init = function() {
    $(".dial").knob({
        'font': "AvenirNext-UltraLight",
        'change': function(val) {
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
var section_names = ["Mix section", "modal synth", "LFOoo", "Clarinet", "FM synth", "Drums"]
    //parse a line

parseOrcLineAndRender = function(str, context) {
    var new_str = str.split(" ");

    var dial_str_head = '<div class="knob_container"><input type="text" value="0" class="dial" data-fgcolor="#0CA7DB" data-bgcolor="#333" data-angleOffset="-125" data-angleArc="256" data-min="0" data-max="1000" data-thickness="0.15" data-width="120" data-height="120" data-font-family="Roboto Light" data-name='
    var dial_str_mid = '> <div class="knob_name"> '
    var dial_str_tail = "</div> </div>"

    if (context == "default") {
        if (new_str[1] == "chnget") {
            if (new_str[3] != ";local") {
                console.log("Rendering Channel Controller for this");
                var new_str = dial_str_head + new_str[2] + dial_str_mid + new_str[2] + dial_str_tail
                $(".parsed_knobs").append(new_str);
                dial_init();
            }
        }
    }
    if (context == "seq_button") {
        if (new_str[1] == "chnget") {
            var new_str = dial_str_head + new_str[2] + dial_str_mid + new_str[2] + dial_str_tail
            $(".parsed_knobs").append(new_str);
            dial_init();
        }
        if (new_str[0] == "instr") {
            seq_str = "<div class='seq_button' data-name='" + new_str[1] + "'> <div class='name'>" + new_str[1] + "</div> </div>";
            $(".seq_container").append(seq_str);
            console.log(str.indexOf(";"));
        }
    }
    $(".parsed_elements_container").fadeIn(100);
    $(".parsed_elements_container").css("opacity", "1.0");
}

//orchestra stuff

var split_orcs = [];
var section_count = 0;


split_orc = function(orc_str) {
    var prev_index = 0;
    temp_arr = orc_str.split("\n");
    for (i = 0; i < temp_arr.length; i++) {
        if (temp_arr[i].indexOf(";") == 0) {
            temp_str = temp_arr[i];
            if (temp_str[0] == ";" && temp_str[temp_str.length - 1] == ";") {
                section_count += 1;
                console.log("Section count: ", section_count);
                var ret_str = orc_str.substring(prev_index, orc_str.indexOf(temp_str) - 1);
                split_orcs.push(ret_str);
                prev_index = orc_str.indexOf(temp_str) + temp_str.length + 1;
                var remaining = orc_str.substring(prev_index, orc_str.length);
                split_orc(remaining);
            }
        }
    }
}

function moduleDidLoad() {
    csound.Play();
}



notify = function(type, obj) {
    console.log("Notification!");
    if (type == "new_client") {
        $(".notification_title").html("New client added");
        client_str = obj.name + " was added to the ensemble!"
        $(".notification_content").html(client_str);
    }
    if (type == "note_event") {
        $(".notification_title").html(obj.from.name + " played a note")
        $(".notification_content").html(obj.event_args + " was sent")
    }
    $(".notification_area").fadeIn("fast").delay(1000);
    $(".notification_area").fadeOut("fast");

}

function append_sections(split_orc_arr) {
    for (i = 0; i < split_orc_arr.length; i++) {
        var instr_button_header = "<div class='instrument_button' data-disabled='false' data-section-number='" + i + "'>" + section_names[i] + "</div>"
        $(".instruments_container").append(instr_button_header);
    }
    $(".instruments_container").fadeIn("slow")
}
var total_instrs = 0

function count_instrs(str) {
    new_str = str.split(" ");
    if (new_str[0] == "instr") {
        total_instrs += 1;
    }
}

function parseOrc(str, job) {
    $(".parsed_knobs").html(" ");
    $(".seq_container").html(" ");
    str_arr = str.split("\n");
    if (job == "init") {
        split_orc(str);
        for (var i = 0; i < str_arr.length; i++) {
            count_instrs(str_arr[i]);
        }
    }
    if (job == "init_solo") {
        for (var i = 0; i < str_arr.length; i++) {
            count_instrs(str_arr[i]);
        }
    } else if (job == "seq_button") {
        for (var i = 0; i < str_arr.length; i++) {
            parseOrcLineAndRender(str_arr[i], "seq_button")
        }
    } else if (job == "default") {
        for (var i = 0; i < str_arr.length; i++) {
            parseOrcLineAndRender(str_arr[i], "default")
        }
    }

}

generate_lane_for_name = function(name) {
    for (var i = 0; i < 16; i++) {
        div_str = "<div class='s_box' data-beat='" + (i + 1) + "' data-instr=" + name + "></div>"
        $("[data-lane=" + name + "]").append(div_str)
    }
}

generator = function(type) {
    var options = $(".options")
    if (type == "drums") {
        $(".looper_creator").html(" ")
        $(".looper_creator").append("<div class='section-title' style='margin-left: 10px; font-size: 1.4em; font-weight: 100;'> Drum Looper </div>")
            /** Generate Hat */
        $(".looper_creator").append("<div class='kick_line' data-lane='hat'>")
        $("[data-lane=hat]").append("<div class='name'> Hat </div>")
        generate_lane_for_name("hat")
            /** Generate Snare */
        $(".looper_creator").append("<div class='kick_line' data-lane='snare'>")
        $("[data-lane=snare]").append("<div class='name'> Snare </div>")
        generate_lane_for_name("snare")
            /** Generate kicks */
        $(".looper_creator").append("<div class='kick_line' data-lane='kick'>")
        $("[data-lane=kick]").append("<div class='name'> Kick </div>")
        generate_lane_for_name("kick")


        $(".looper_creator").append(options);
    }
}

generate_csound_score = function(instr, arr) {
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

parse_boxes = function() {
    csd_str = ""
        // generate kick sequence first:
    var kick_arr = []
    line = $("[data-lane=kick]")
    line.children("[data-instr=kick]").each(function() {
        if ($(this).hasClass("active_box_kick")) {
            kick_arr.push(1)
        } else {
            kick_arr.push(0)
        }
    })
    console.log(kick_arr);
    csd_str += generate_csound_score("kick", kick_arr)
        // generate snare sequence next:
    var snare_arr = []
    line = $("[data-lane=snare]")
    line.children("[data-instr=snare]").each(function() {
        if ($(this).hasClass("active_box_snare")) {
            snare_arr.push(1)
        } else {
            snare_arr.push(0)
        }
    })
    console.log(snare_arr);
    csd_str += generate_csound_score("snare", snare_arr)

    // generate hat sequence next:
    var hat_arr = []
    line = $("[data-lane=hat]")
    line.children("[data-instr=hat]").each(function() {
        if ($(this).hasClass("active_box_hat")) {
            hat_arr.push(1)
        } else {
            hat_arr.push(0)
        }
    });

    console.log(hat_arr);
    csd_str += generate_csound_score("hat", hat_arr)
    return csd_str
}

$(document).ready(function() {
    /*** Generate! **/
    generator("drums");
    /*** Work on WebMidi things here: */

    WebMidi.enable(onSuccess, onFailure);

    function onSuccess() {
        console.log("WebMidi enabled.");
        console.log(WebMidi.inputs);
        console.log(WebMidi.outputs);
        WebMidi.addListener(
            'noteon',
            function(e) {
                decompiledData = e.data
                if (controlling_item != NaN) {
                    decompiledData[0] += (controlling_item - 1)
                    socket.emit("MIDImessage", decompiledData);
                }
            }

        );
        WebMidi.addListener(
            'noteoff',
            function(e) {
                if (controlling_item != NaN) {
                    decompiledData[0] += (controlling_item - 1)
                    socket.emit("MIDImessage", decompiledData);
                }
            }
        );
        WebMidi.addListener(
            'controlchange',
            function(e) {
                if (controlling_item != NaN) {
                    decompiledData[0] += (controlling_item - 1)
                    socket.emit("MIDImessage", decompiledData);
                }
            }
        );
    }


    function onFailure(err) {
        console.log("WebMidi could not be enabled.", err);
    }


    if (!csound.module) {
        $(".SocketField").css("display", "none");
        $(".client_bar").css("display", "none");
        $(".obs_screen").fadeIn("slow");
    }
    var active = 0;
    var seq_list = [];
    dial_init();
    $(".button").hover(function() {
        $(this).transition({
            scale: 1.01
        });
    }); //Button hover
    $(".button").mouseout(function() {
        $(this).transition({
            scale: 1.0
        });
    }); //Button hover 2

    $(".key")
        .mousedown(function() {
            console.log($(this).attr("data"));
            midi_byte = [(controlling_item + 143), parseInt($(this).attr("data")), 70]
            socket.emit("MIDImessage", midi_byte)

        })
        .mouseup(function() {
            console.log($(this).attr("data"));
            midi_byte = [(controlling_item + 127), parseInt($(this).attr("data")), 70]
            socket.emit("MIDImessage", midi_byte)
        });

    $(".button").click(function() {
        $(this).transition({
            scale: 0.98
        }).transition({
            scale: 1.0
        });
    });

    $(document).on("click", ".seq_button", function() {
        $(this).transition({
            scale: 0.98
        }).transition({
            scale: 1.0
        });
        console.log($(this).attr("data-name"));
        str_for_ev = 'i "' + $(this).attr("data-name") + '" 0 3';
        ev_dets = {}
        ev_dets.from = me
        ev_dets.event_type = "note_message"
        ev_dets.event_args = str_for_ev
        socket.emit('event', ev_dets)
    });

    var content_arr = [
        "This is the mix section for your group. You have control over the reverb and output levels!<br/>" + "Use the power wisely and make your group sound better",
        "This is a mode synth!<br/><br/> It uses a mode filter as both the excitation and the resonator. <br/><br/> Usage: Use the bottom bar to manipulate filter values... When you click the drawer icon on the bottom right, change instrument number to 1 and set your duration to your desire.",
        "This is an LFO chained into an oscillator <br/><br/> Usage: Use the bottom bar to manipulate LFO values... When you click the drawer icon on the bottom right, change instrument number to 2 and set your duration to your desire.",
        "This is a waveguide clarinet<br/><br/> Usage: Use the bottom bar to manipulate LFO values... When you click the drawer icon on the bottom right, change instrument number to 2 and set your duration to your desire.",
        "This is an FM Synth <br/><br/> Usage: Use the bottom bar to manipulate LFO values... When you click the drawer icon on the bottom right, change instrument number to 2 and set your duration to your desire.",
        "You have the percussion section!"
    ]

    $(document).on("click", ".instrument_button", function() {
        var clicked_div = $(this);
        if ($(this).attr("data-disabled") == "false" && controlling_bool == false) {
            controlling_bool = true
            sectionNumber = parseInt($(this).attr("data-section-number"))
            temp_sec_val = split_orcs[sectionNumber]
            controlling_item = sectionNumber
            $(".editor").val(temp_sec_val)
            $(this).css("background", ins_num)
            $(this).attr("data-disabled", "true")
            socket.emit("control_disable", me.id + " ::: " + sectionNumber);
            if (sectionNumber == 5) {
                parseOrc(temp_sec_val, "seq_button");

                $(".looper_creator").show();
            } else {
                parseOrc(temp_sec_val, "default");
            }
        }
    });
    $(".item").click(function() {
        var clicked_div = $(this);
        if ($(this).attr("data-disabled") == "false" && controlling_bool == false) {
            controlling_bool = true
            sectionNumber = parseInt($(this).attr("data-section-number"))
            temp_sec_val = split_orcs[sectionNumber]
            controlling_item = sectionNumber
            $(".content_instr_details").html(content_arr[sectionNumber])
            $(this).children(".sector").css("fill", color_arr_orig[ins_num])
            $(this).css("color", "white")
            $(this).css("stroke", "white")
            ev_args = {}
            ev_args.from = me
            ev_args.event_type = "control_disable"
            ev_args.event_args = sectionNumber;
            socket.emit("event", ev_args)
            socket.emit("control_disable", me.id + " ::: " + sectionNumber);
            me.controlling = sectionNumber
            if (sectionNumber == 5) {
                parseOrc(temp_sec_val, "default");
                console.log("EH?")
                $(".looper_creator").fadeIn("fast");
            } else {
                $(".looper_creator").fadeOut("fast");
                $(".floating_keyboard").fadeIn("fast");
                parseOrc(temp_sec_val, "default");
            }
        }
    });
    $(document).on("click", ".sample", function() {

        var uri_str = "./http/assets/samples/" + $(this).attr("data") + ".wav"
        console.log(uri_str);
        str_for_ev = 'i \"sampler\" 0 60 \"' + uri_str + "\"";
        ev_dets = {}
        ev_dets.from = me
        ev_dets.event_type = "note_message"
        ev_dets.event_args = str_for_ev
        socket.emit('event', ev_dets)

    });

    $(".help_button").click(function() {
        $(".obs_screen").fadeToggle(400);
    }); //Help screen.

    $(".send").click(function() {
        var string = $(".editor").val();
        parseOrc(string);
        socket.emit("orc", string)
    });

    $(".up").click(function() {
        $(".floating_keyboard").fadeToggle();
        $(this).toggleClass("rotate");
    });

    $(document).on("click", ".s_box", function() {
        if ($(this).attr("data-instr") == "kick") {
            $(this).toggleClass("active_box_kick");
        }
        if ($(this).attr("data-instr") == "snare") {
            $(this).toggleClass("active_box_snare");
        }
        if ($(this).attr("data-instr") == "hat") {
            $(this).toggleClass("active_box_hat");
        }
    });


    $(".SocketField").on("keypress", function(e) {
        if (e.which == 13) {
            console.log($(this).val());
            $(this).css("display", "none");
            field_visible = false
            me.name = $(this).val();
            me.role = "ensemble";
            ev_dets = {}
            ev_dets.event_type = "add_client"
            ev_args = {}
            ev_args.name = $(this).val()
            ev_dets.event_args = ev_args
            socket.emit("event", ev_dets)
            socket.emit("request_orc")
            $(".instruments_container").fadeIn("fast");
        }
    });
    $(document).on("click", "[data-action=play]", function() {

        csd_str = parse_boxes()
        console.log("total sequence now is: ", csd_str)
        ev_dets = {}
        ev_dets.from = me
        ev_dets.event_type = "sequence"
        ev_dets.event_args = csd_str

        socket.emit("event", ev_dets)
        glow_repeats();
        setInterval(function(){
            nev_dets = {}
            nev_dets.from = me
            nev_dets.event_type = "sequence"
            nev_dets.event_args = parse_boxes()
            socket.emit("event", nev_dets)
        }, 4000);

    });
    $(document).on("click", "[data-action=full_screen]", function() {
        $(".looper_creator").transition({x:0}).transition({y:0}).transition({width:"98%"}).transition({height:"100%"});

    });


    $(document).on("input change", ".slide", function() {
        console.log($(this).attr("data-channel"))
        console.log($(this).val())
        csound.SetChannel($(this).attr("data-channel"), parseInt($(this).val()))
    });
});
