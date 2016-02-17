var socket = io.connect("http://localhost:8181");

socket.on('connect', function(){
  socket.emit('get_instruments');
})

var instruments;

function parse_instruments(arr){
  for (i in instruments){
    console.log(arr[i].name);
  }
}

socket.on('instrs', function(obj){
  instruments = obj;
  parse_instruments(instruments)
})
