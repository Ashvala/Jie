var performance_mode;

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
      ev_dets.from = ins_num
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

  var dial_str_head = '<div class="knob_container"><input type="text" value="0" class="dial" data-fgcolor="#0CA7DB" data-angleOffset="-125" data-angleArc="256" data-min="0" data-max="1000" data-thickness="0.1" data-width="125" data-height="125" data-font-family="Avenir" data-font-weight="300" data-name='
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




function append_sections(split_orc_arr) {
  for (i = 0; i < split_orc_arr.length; i++) {
    var instr_button_header = "<div class='instrument_button' data-section-number='" + i + "'>"+ section_names[i] + "</div>"
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
    $(".instruments_container").html(" ");
    append_sections(split_orcs);
    for (var i = 0; i < str_arr.length; i++) {
      count_instrs(str_arr[i]);
    }
  }
  if (job == "init_solo") {
    $(".instruments_container").html(" ");
    append_sections(temp_new_orc);
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
$(document).ready(function() {
  if (!csound.module){
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
    ev_dets.from = ins_num
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
    csound.Event(str_for_ev);
  });

  var content_arr = ["This is the mix section for your group. You have control over the reverb and output levels!<br/>" + "Use the power wisely and make your group sound better", "This is a mode synth!<br/><br/> Usage: i 1 0 4 60.<br/><br/> Use the side bar to manipulate values.", "Uh", "uh", "You have the percussion section!"]

  $(document).on("click", ".instrument_button", function() {
    temp_sec_val = split_orcs[parseInt($(this).attr("data-section-number"))]
    $(".content_instr_details").html(content_arr[parseInt($(this).attr("data-section-number"))])
    $(".editor").val(temp_sec_val)
    $(this).css("background", ins_num)
    socket.emit("control_disable", ins_num + " ::: " + $(this).attr("data-section-number"));
    if (parseInt($(this).attr("data-section-number")) == 5) {
      parseOrc(temp_sec_val, "seq_button");
    } else {
      parseOrc(temp_sec_val, "default");
    }
  });

  $(".help_button").click(function() {
    $(".obs_screen").fadeToggle(400);
  }); //Help screen.

  $(".send").click(function() {
    var string = $(".editor").val();
    parseOrc(string);
    socket.emit("orc", string)
  })
  $(".up").click(function() {
    $(".floating_keyboard").fadeToggle();
    $(this).toggleClass("rotate");
  });
  $(".SocketField").on("keypress", function(e) {
    if (e.which == 13) {
      console.log($(this).val());
      $(this).css("display", "none");
      me.name = $(this).val();
      socket.emit("client_name", ins_num + ":::" + $(this).val())
      if (csound.module){
        socket.emit("csound_able")
      }
    }
  });

  var clicked = 0;
  $(".slide_in").click(function() {
    console.log("Expansion of parsed_elements_container happens here!");
    $(this).toggleClass("rotate");
    if (clicked == 0) {
      $(".parsed_elements_container").transition({
        height: '100%'
      }, 'slow', 'ease');
      $(".floating_keyboard").fadeIn("fast");
      clicked = 1
    } else {
      $(".parsed_elements_container").transition({
        height: '240px'
      });
      $(".floating_keyboard").fadeOut("fast");
      clicked = 0;
    }
  });
});
