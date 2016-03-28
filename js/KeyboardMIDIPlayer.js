$(document).ready(function() {
    current_oct_mult = 1
    current_vel = 60;
    $(document).keydown(function(e) {
        var code = e.keyCode;
        if (field_visible == false) {
            switch (code) {
                case 65: // a
                    midi_byte = [(controlling_item + 143), (60 + (12 * current_oct_mult)),current_vel]
                    socket.emit("MIDImessage", midi_byte)
                    return false;
                case 87: // w
                    midi_byte = [(controlling_item + 143), (61 + (12 * current_oct_mult)),current_vel]
                    socket.emit("MIDImessage", midi_byte)
                    return false;
                case 83: // s
                    midi_byte = [(controlling_item + 143), (62 + (12 * current_oct_mult)),current_vel]
                    socket.emit("MIDImessage", midi_byte)
                    return false;
                case 69: // e
                    midi_byte = [(controlling_item + 143), (63 + (12 * current_oct_mult)),current_vel]
                    socket.emit("MIDImessage", midi_byte)
                    return false;
                case 68: // d
                    midi_byte = [(controlling_item + 143), (64 + (12 * current_oct_mult)),current_vel]
                    socket.emit("MIDImessage", midi_byte)
                    return false;
                case 70: // f
                    midi_byte = [(controlling_item + 143), (65 + (12 * current_oct_mult)),current_vel]
                    socket.emit("MIDImessage", midi_byte)
                    return false;
                case 84: // t
                    midi_byte = [(controlling_item + 143), (66 + (12 * current_oct_mult)),current_vel]
                    socket.emit("MIDImessage", midi_byte)
                    return false;
                case 71: // g
                    midi_byte = [(controlling_item + 143), (67 + (12 * current_oct_mult)),current_vel]
                    socket.emit("MIDImessage", midi_byte)
                    return false;
                case 89: // y
                    midi_byte = [(controlling_item + 143), (68 + (12 * current_oct_mult)),current_vel]
                    socket.emit("MIDImessage", midi_byte)
                    return false;
                case 72: // h
                    midi_byte = [(controlling_item + 143), (69 + (12 * current_oct_mult)),current_vel]
                    socket.emit("MIDImessage", midi_byte)
                    return false;
                case 85: // u
                    midi_byte = [(controlling_item + 143), (70 + (12 * current_oct_mult)),current_vel]
                    socket.emit("MIDImessage", midi_byte)
                    return false;
                case 74: // j
                    midi_byte = [(controlling_item + 143), (71 + (12 * current_oct_mult)),current_vel]
                    socket.emit("MIDImessage", midi_byte)
                    return false;
                case 75: // k
                    midi_byte = [(controlling_item + 143), (72 + (12 * current_oct_mult)),current_vel]
                    socket.emit("MIDImessage", midi_byte)
                    return false;
                case 90: // z
                    current_oct_mult = current_oct_mult - 1
                    console.log(current_oct_mult)
                    return false;
                case 88: // x
                    current_oct_mult = current_oct_mult + 1
                    console.log(current_oct_mult)
                    return false;
                case 67: // c
                    if (current_vel >= 10) {
                        current_vel = current_vel - 10
                    } else {
                        current_vel = 10;
                    }
                    return false;
                case 86: // c
                    if ((current_vel + 10) > 127) {
                        current_vel = 127
                    } else {
                        current_vel += 10;
                    }

            }
        }
    });
    $(document).keyup(function(e) {
        var code = e.keyCode;
        if (field_visible == false) {


            switch (code) {
                case 65: // a
                    midi_byte = [(controlling_item + 127), (60 + (12 * current_oct_mult)), 60]
                    socket.emit("MIDImessage", midi_byte)
                    return false;
                case 87: // w
                    midi_byte = [(controlling_item + 127), (61 + (12 * current_oct_mult)), 60]
                    socket.emit("MIDImessage", midi_byte)
                    return false;
                case 83: // s
                    midi_byte = [(controlling_item + 127), (62 + (12 * current_oct_mult)), 60]
                    socket.emit("MIDImessage", midi_byte)
                    return false;
                case 69: // e
                    midi_byte = [(controlling_item + 127), (63 + (12 * current_oct_mult)), 60]
                    socket.emit("MIDImessage", midi_byte)
                    return false;
                case 68: // d
                    midi_byte = [(controlling_item + 127), (64 + (12 * current_oct_mult)), 60]
                    socket.emit("MIDImessage", midi_byte)
                    return false;
                case 70: // f
                    midi_byte = [(controlling_item + 127), (65 + (12 * current_oct_mult)), 60]
                    socket.emit("MIDImessage", midi_byte)
                    return false;
                case 84: // t
                    midi_byte = [(controlling_item + 127), (66 + (12 * current_oct_mult)), 60]
                    socket.emit("MIDImessage", midi_byte)
                    return false;
                case 71: // g
                    midi_byte = [(controlling_item + 127), (67 + (12 * current_oct_mult)), 60]
                    socket.emit("MIDImessage", midi_byte)
                    return false;
                case 89: // y
                    midi_byte = [(controlling_item + 127), (68 + (12 * current_oct_mult)), 60]
                    socket.emit("MIDImessage", midi_byte)
                    return false;
                case 72: // h
                    midi_byte = [(controlling_item + 127), (69 + (12 * current_oct_mult)), 60]
                    socket.emit("MIDImessage", midi_byte)
                    return false;
                case 85: // u
                    midi_byte = [(controlling_item + 127), (70 + (12 * current_oct_mult)), 60]
                    socket.emit("MIDImessage", midi_byte)
                    return false;
                case 74: // j
                    midi_byte = [(controlling_item + 127), (71 + (12 * current_oct_mult)), 60]
                    socket.emit("MIDImessage", midi_byte)
                    return false;
                case 75: // k
                    midi_byte = [(controlling_item + 127), (72 + (12 * current_oct_mult)), 60]
                    socket.emit("MIDImessage", midi_byte)
                    return false;

            }
        }
    });
});
