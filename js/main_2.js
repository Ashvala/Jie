/**
    @brief: Constructor
    @param conn_url - connection URL
    @param midi_bool - boolean to connect
*/


function Jie_API(conn_URL, midi_bool){
    this.url = conn_url
    this.midi_enable = midiBool
}

function Jie_API.prototype.init(){
    var socket = io.connect(conn_url);
    return socket;
}

function Jie_API.prototype.parse_event(event_obj){


}
