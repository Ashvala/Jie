function arg(arg_name, argument_list){
    this.arg_name =  arg_name
    this.argument_list = argument_list
}

dial_init = function(){
    $(".dial").knob({
	'font' : "AvenirNext-UltraLight",
	'change' : function(val) {
	    var final_message;
	    var name = this.$.attr("data-name");
	    var final_message_filt = name +" "+ parseInt(val);
	    socket.emit('chanmsg', final_message_filt);
	}
    }); //Dial handled here

}

parseOrcLineAndRender = function(str, context){

//    console.log(str);
    var new_str = str.split(" ");
    var dial_str_head = '<div class="knob_container"><input type="text" value="0" class="dial" data-fgcolor="#0Ca7DB" data-angleOffset="0" data-displayPrevious=true data-skin="tron" data-angleArc="360" data-min="0" data-max="880" data-thickness="0.1" data-width=80%" data-height="125" data-font-family="Avenir" data-font-weight="300" data-name='

    var dial_str_mid = '> <div class="knob_name"> '

    var dial_str_tail = "</div> </div>"

    if(new_str[1] == "chnget"){
	console.log("Rendering Channel Controller for this");
	var new_str = dial_str_head + new_str[2] + dial_str_mid + new_str[2] + dial_str_tail
	$(".parsed_knobs").append(new_str);
	dial_init();
    }

    if (context == "seq_button"){

	if (new_str[0] == "instr"){

	    seq_str = "<div class='seq_button' data-name='" + new_str[1] + "'> <div class='name'>" + new_str[1] + "</div> </div>";
	    $(".seq_container").append(seq_str);
	}
    }
    $(".parsed_elements_container").fadeIn(100);
}
var split_orcs = [];
var section_count = 0;
split_orc = function(orc_str){
    var prev_index = 0;

    temp_arr = orc_str.split("\n");
    for (i = 0; i < temp_arr.length; i++){
	if(temp_arr[i].indexOf(";") == 0){
	    temp_str = temp_arr[i];
	    if(temp_str[0] == ";" && temp_str[temp_str.length-1] == ";"){
		section_count += 1;
		console.log("Section count: ", section_count);
		var ret_str = orc_str.substring(prev_index,orc_str.indexOf(temp_str)-1);
		split_orcs.push(ret_str);
		prev_index = orc_str.indexOf(temp_str) + temp_str.length + 1;
		var remaining = orc_str.substring(prev_index, orc_str.length);
		split_orc(remaining);
	    }
	}
    }
}
sanitize = function(orc_str){
    args_arr = [];

    return str_arr_final;
}
function moduleDidLoad(){
    csound.Play();
    socket.emit("request_orc");
}

function append_sections(split_orc_arr){
    for (i = 0; i < split_orc_arr.length; i++){
	var instr_button_header = "<div class='instrument_button' data-section-number='" + i + "'> Section "+ i + "</div>"
	$(".instruments_container").append(instr_button_header);
    }
}
function parseOrc(str, job){
    $(".parsed_knobs").html(" ");
    $(".seq_container").html(" ");
    str_arr = str.split("\n");
    split_orc(str);
    if (job == "init"){
	$(".instruments_container").html(" ");
	append_sections(split_orcs);
    }
    else if (job == "seq_button"){
	for (var i = 0; i < str_arr.length; i++){
	    parseOrcLineAndRender(str_arr[i], "seq_button")
	}
    }
    else if (job == "default"){
	for (var i = 0; i < str_arr.length; i++){
	    parseOrcLineAndRender(str_arr[i], "default")
	}
    }

}
$(document).ready(function(){
    var active = 0;
    var seq_list = [];

    dial_init();
    $(".button").hover(function(){
	   $(this).transition({scale: 1.01});
    }); //Button hover

    $(".button").mouseout(function(){
	   $(this).transition({scale: 1.0});
    }); //Button hover 2
    $(".key").click(function(){
	console.log($(this).attr("data"));
	var final_mesg = "note_message " + ($(this).attr("data"));
	socket.emit('note_message', final_mesg);
    }); //Pressing the button

    $(".button").click(function(){
	$(this).transition({scale: 0.98}).transition({scale:1.0});
	if($(this).attr("data") == "compile"){
	    var orc = "instr 1\n " +
		"kFilt chnget \"freq\"\n" +
		"kReso chnget \"reso\"\n" +
		"a1 oscili 0.8, cpsmidinn(p4)\n" +
		"a2 butterbp a1, kFilt, kReso\n" +
		"outs a2*2,a2*2\n" +
		"endin"
	    socket.emit('orc', orc);
	} // Send a sample orchestra
	if($(this).attr("data") == "score"){
	    var score_event = "i 1 0 -1 60"
	    socket.emit('sco', score_event);
	    $(this).css("display", "none");
	} // Send a midi note 60 forever.
	if($(this).attr('data') == "stop"){
	    csound.Pause();
	} // Pause!
    });

    $(document).on("click", ".seq_button", function(){
	$(this).transition({scale: 0.98}).transition({scale:1.0});
	console.log($(this).attr("data-name"));
	str_for_ev = 'i "' + $(this).attr("data-name") + '" 0 3';
	csound.Event(str_for_ev);
    });
    $(document).on("click", ".instrument_button", function(){
	console.log($(this).attr('data-section-number'));
	temp_sec_val = split_orcs[parseInt($(this).attr("data-section-number"))]
	console.log(temp_sec_val);
	$(".editor").val(temp_sec_val)
	if(parseInt($(this).attr("data-section-number")) == 1){
	    parseOrc(temp_sec_val, "seq_button");
	}else{
	    parseOrc(temp_sec_val, "default");
	}
    });

    $(".help_button").click(function(){
	   $(".help_screen").fadeToggle(400);
    }); //Help screen.

    $(".send").click(function(){
	var string = $(".editor").val();
	parseOrc(string);
	socket.emit("orc", string)
    })
    $(".up").click(function(){
	$(".floating_keyboard").fadeToggle();
	$(this).toggleClass("rotate");
    });
    var clicked = 0;
    $(".slide_in").click(function(){
	console.log("Expansion of parsed_elements_container happens here!");
	$(this).toggleClass("rotate");
	if (clicked == 0){
	    $(".parsed_elements_container").transition({width: '100%'}, 'slow', 'ease');
	    $(".floating_keyboard").fadeIn("fast");
	    clicked = 1
	}else{
	    $(".parsed_elements_container").transition({width: '20%'});
	    $(".floating_keyboard").fadeOut("fast");
	    clicked = 0;
	}
    });
});
