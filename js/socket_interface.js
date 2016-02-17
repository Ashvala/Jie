var socket = io.connect("http://crimson.local:8181");

socket.on('connect', function(){
  socket.emit('get_instruments');
})

var instruments;
var new_id;

function parse_instruments(arr){
  arr.forEach(function(err, arr_val){
    console.log(arr[arr_val].name);
    var div_str = "<div class='instr_list_button' data-orc='" + arr[arr_val].orchestra + "' data-type='existing_ins' data-id='" + arr[arr_val]._id + "' data-name='" + arr[arr_val].name + "'>" + arr[arr_val].name + "</div>"
    $(".instr_list").append(div_str)
  });
}

socket.on('instrs', function(obj){
  instruments = obj;
  parse_instruments(instruments)
});

socket.on('instr_new', function(obj){
  new_id = obj
  $(".editor").val("")
  var div_str = "<div class='instr_list_button' data-orc='' data-type='new_ins' data-id='" + new_id + "'> new instrument" + "</div>"
  $(".instr_list").append(div_str)
  $(".file_name").val("new instrument")
});
