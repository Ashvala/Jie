var performance_mode;
var controlling_bool = false;
var controlling_item = NaN;
var field_visible = true;
function arg(arg_name, argument_list) {
    this.arg_name = arg_name
    this.argument_list = argument_list
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
            console.log("Rendering Channel Controller for this");
            var new_str = dial_str_head + new_str[2] + dial_str_mid + new_str[2] + dial_str_tail
            $(".parsed_knobs").append(new_str);
            dial_init();
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

generate_lane_for_name = function(name){
    for(var i = 0; i < 16; i++){
        div_str = "<div class='s_box' data-beat='" + (i+1) + "' data-instr=" + name + "></div>"
        $("[data-lane=" + name + "]").append(div_str)
    }
}

generator = function(type){
    var options = $(".options")
    if(type == "drums"){
        $(".looper_creator").html(" ")
        /** Generate kicks */
        $(".looper_creator").append("<div class='kick_line' data-lane='kick'>")
        $("[data-lane=kick]").append("<div class='name'> Kick </div>")
        generate_lane_for_name("kick")
        /** Generate Snare */
        $(".looper_creator").append("<div class='kick_line' data-lane='snare'>")
        $("[data-lane=snare]").append("<div class='name'> Snare </div>")
        generate_lane_for_name("snare")
        /** Generate Hat */
        $(".looper_creator").append("<div class='kick_line' data-lane='hat'>")
        $("[data-lane=hat]").append("<div class='name'> Hat </div>")
        generate_lane_for_name("hat")
        $(".looper_creator").append(options);
    }
}

generator("drums")

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
    $(".key").click(function() {
        var final_mesg;
        console.log($(this).attr("data"));
        console.log(total_instrs);
        if ($(".instrnum").val() <= total_instrs) {
            console.log("sendable");
            console.log($(".time").val());
        }
        final_mesg = "i " + $(".instrnum").val() + " 0 " + $(".time").val() + " " + $(this).attr("data");
        console.log(final_mesg);
        var ev_dets = {}
        ev_dets.from = me
        ev_dets.event_type = "note_message"
        ev_dets.event_args = final_mesg
        socket.emit('event', ev_dets);
        //    socket.emit("sco", final_mesg)
    }); //Pressing the button

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
            $(".content_instr_details").html(content_arr[sectionNumber])
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

    $(document).on("click", ".sample", function() {

        var uri_str = "./http/assets/samples/" + $(this).attr("data") + ".wav"
        console.log(uri_str);
        str_for_ev = 'i \"sampler\" 0 60 \"'+uri_str+"\"";
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

    $(document).on("click",".s_box",  function(){
        if($(this).attr("data-instr") == "kick"){
            $(this).toggleClass("active_box_kick");
        }
        if($(this).attr("data-instr") == "snare"){
            $(this).toggleClass("active_box_snare");
        }
        if($(this).attr("data-instr") == "hat"){
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
            if (temp_ins_num <= 6) {
                ev_args.role = "ensemble";
            } else {
                ev_args.role = "observer";
            }
            ev_dets.event_args = ev_args
            socket.emit("event", ev_dets)
            socket.emit("request_orc")
        }
    });

    $(".item").click(function() {
        sectionNumber = parseInt($(this).attr("data-section-number"))
        temp_sec_val = split_orcs[sectionNumber]
        controlling_item = sectionNumber
        $(".content_instr_details").html(content_arr[sectionNumber])
        $(this).children(".sector").css("fill", color_arr_orig[ins_num])
        $(this).css("color", "white")
        $(this).css("stroke", "white")
        socket.emit("control_disable", me.id + " ::: " + sectionNumber);
        if (sectionNumber == 5) {
            parseOrc(temp_sec_val, "default");
            console.log("EH?")
            $(".looper_creator").fadeIn("fast");
        } else {
            parseOrc(temp_sec_val, "default");
        }

    });
    var clicked = 0;
    $(".slide_in").click(function() {
        console.log("Expansion of parsed_elements_container happens here!");
        $(this).toggleClass("rotate");
        if (clicked == 0) {
            $(".parsed_elements_container").transition({
                height: '100%'
            }, 'fast', 'ease');
            $(".floating_keyboard").fadeIn("fast");
            $(".screen").css("-webkit-filter", "blur(3px)");
            clicked = 1
        } else {
            $(".parsed_elements_container").transition({
                height: '240px'
            }, 'fast', 'ease');
            $(".floating_keyboard").fadeOut("fast");
            $(".screen").css("-webkit-filter", "blur(0px)");
            clicked = 0;
        }

    });
    $(document).keydown(function(e) {
        console.log(e.keyCode);
        var code = e.keyCode;
        if (field_visible == false){
        switch (code) {
            case 65: // a
                midi_byte = [(controlling_item + 143), 60, 60]
                socket.emit("MIDImessage", midi_byte)
                return false;
            case 87: // w
                midi_byte = [(controlling_item + 143), 61, 60]
                socket.emit("MIDImessage", midi_byte)
                return false;
            case 83: // s
                midi_byte = [(controlling_item + 143), 62, 60]
                socket.emit("MIDImessage", midi_byte)
                return false;
            case 69: // e
                midi_byte = [(controlling_item + 143), 63, 60]
                socket.emit("MIDImessage", midi_byte)
                return false;
            case 68: // d
                midi_byte = [(controlling_item + 143), 64, 60]
                socket.emit("MIDImessage", midi_byte)
                return false;
            case 70: // f
                midi_byte = [(controlling_item + 143), 65, 60]
                socket.emit("MIDImessage", midi_byte)
                return false;
            case 84:
                midi_byte = [(controlling_item + 143), 66, 60]
                socket.emit("MIDImessage", midi_byte)
                return false;
            case 71:
                midi_byte = [(controlling_item + 143), 67, 60]
                socket.emit("MIDImessage", midi_byte)
                return false;
            case 89:
                midi_byte = [(controlling_item + 143), 68, 60]
                socket.emit("MIDImessage", midi_byte)
                return false;
            case 72:
                midi_byte = [(controlling_item + 143), 69, 60]
                socket.emit("MIDImessage", midi_byte)
                return false;
            case 85:
                midi_byte = [(controlling_item + 143), 70, 60]
                socket.emit("MIDImessage", midi_byte)
                return false;
            case 74:
                midi_byte = [(controlling_item + 143), 71, 60]
                socket.emit("MIDImessage", midi_byte)
                return false;
            case 75:
                midi_byte = [(controlling_item + 143), 72, 60]
                socket.emit("MIDImessage", midi_byte)
                return false;

        }
    }
    });
    $(document).keyup(function(e){
        console.log(e.keyCode);
        var code = e.keyCode;
        if (field_visible == false){


        switch (code) {
            case 65: // a
                midi_byte = [(controlling_item + 127), 60, 60]
                socket.emit("MIDImessage", midi_byte)
                return false;
            case 87: // w
                midi_byte = [(controlling_item + 127), 61, 60]
                socket.emit("MIDImessage", midi_byte)
                return false;
            case 83: // s
                midi_byte = [(controlling_item + 127), 62, 60]
                socket.emit("MIDImessage", midi_byte)
                return false;
            case 69: // e
                midi_byte = [(controlling_item + 127), 63, 60]
                socket.emit("MIDImessage", midi_byte)
                return false;
            case 68: // d
                midi_byte = [(controlling_item + 127), 64, 60]
                socket.emit("MIDImessage", midi_byte)
                return false;
            case 70: // f
                midi_byte = [(controlling_item + 127), 65, 60]
                socket.emit("MIDImessage", midi_byte)
                return false;
            case 84:
                midi_byte = [(controlling_item + 127), 66, 60]
                socket.emit("MIDImessage", midi_byte)
                return false;
            case 71:
                midi_byte = [(controlling_item + 127), 67, 60]
                socket.emit("MIDImessage", midi_byte)
                return false;
            case 89:
                midi_byte = [(controlling_item + 127), 68, 60]
                socket.emit("MIDImessage", midi_byte)
                return false;
            case 72:
                midi_byte = [(controlling_item + 127), 69, 60]
                socket.emit("MIDImessage", midi_byte)
                return false;
            case 85:
                midi_byte = [(controlling_item + 127), 70, 60]
                socket.emit("MIDImessage", midi_byte)
                return false;
            case 74:
                midi_byte = [(controlling_item + 127), 71, 60]
                socket.emit("MIDImessage", midi_byte)
                return false;
            case 75:
                midi_byte = [(controlling_item + 127), 72, 60]
                socket.emit("MIDImessage", midi_byte)
                return false;

        }
    }
    })
});
