var socket = io.connect("http://localhost:8181");

// Enable socket

socket.on('connect', function(msg) {
  console.log('Socket is up');
  if (!csound.module) {
    console.log("oh");
  }
  socket.emit("client_list_req")
});
var color_arr_orig = ["#e67e22", "#0CA7DB", "#34495e", "#e74c3c", "#f1c40f", "#1abc9c"]

  var color_arr = ["#333", "#333", "#333", "#333", "#333", "#333"]
  var ins_num;
socket.on("instrument_ctrl", function(msg) {
  console.log(msg);
  ins_num = msg;
  $("body").css("background", color_arr[ins_num]);
  $(".title").css("color", color_arr_orig[ins_num]);
});

var csound_msg; //use this in the future to develop stuff.

//Solitary note messages.
socket.on('note_message', function(obj) {
  console.log(obj);
  if (csound.module) {
    console.log("can do csound events");
    var new_str = obj.split(" ");
    console.log(new_str[1]);
    var event_str = "i 1 0 4 " + new_str[1];
    console.log(event_str);
    csound.Event(event_str);
  } else {
    console.log("Sends csound events.");
  }
});

socket.on('current_id', function(msg) {
  console.log(msg);
});

orc_str = ""

//Handle Orchestra messages here

socket.on('orc', function(obj) {
  //    console.log(obj);
  if (csound.module) {
    csound.CompileOrc(obj);
  } else {
    console.log("Huh");
  }
  parseOrc(obj, "init");
});


//Handle Score messages here

socket.on('sco', function(obj) {
  console.log(obj);
  if (csound.module) {
    console.log("can do csound events");
    var new_str = obj.split(" ");
    console.log(new_str[1]);
    csound.Event(obj);
  } else {
    console.log("Sends csound events.")
  }
});


socket.on("control_disable", function(obj) {
  console.log(obj.split(":::"))
  var args = obj.split(":::")
  console.log(args[0], args[1])
  if (args[0] != ins_num) {
    console.log("I am " + ins_num + " you are on: " + args[1] + " and this implies that the background is going to be " + color_arr_orig[parseInt(args[0])])
    $(".instrument_button").each(function() {
      console.log($(this).attr("data-section-number"))
      if ($(this).attr("data-section-number") == parseInt(args[1])) {
        $(this).css("background", color_arr_orig[parseInt(args[0])])
      }
    });
  }
});

//Handle channel messages.
socket.on('chanmsg', function(obj) {
  if (csound.module) {
    console.log("can do csound events");
    var new_str = obj.split(" ");
    console.log(new_str[0]);
    var new_val = parseFloat(new_str[1]);
    console.log(new_val);
    csound.SetChannel(new_str[0], new_val)
    name = new_str[0];
    divstr = ".dial[data-name=" + name + "]";
    $(divstr).val(new_val);
  } else {
    console.log("Sends csound events.")
  }
});

socket.on('client_list', function(obj){
  console.log(obj)

  for (i = 0; i < obj.length-1; i++){
    console.log(obj[i].name);
    var div_str = "<div class='client_button' style='background:" + color_arr_orig[i] + "'> " + obj[i].name + "</div>"
    $(".client_bar").append(div_str)
    console.log(obj[i].id)
  }

});

socket.on("client_add", function(obj) {

  console.log(obj);
  console.log(obj.split(":::"))
  var args = obj.split(":::")
  var div_str = "<div class='client_button' style='background:" + color_arr_orig[parseInt(args[0])] + "'> " + args[1] + "</div>"
  $(".client_bar").append(div_str)
});

socket.on("serve_choices", function(){
  socket.emit("request_orc")
});
