$(document).ready(function(){
    $(document).keydown(function(e) {
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
    });
});
