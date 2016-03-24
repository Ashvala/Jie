/* Csound string handling */

function parseOrcLineAndRender(str, context) {
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


function split_orc(orc_str) {
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
