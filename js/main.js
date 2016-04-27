    var performance_mode;
    var controlling_bool = false;
    var controlling_item = NaN;
    var field_visible = true;

    function arg(arg_name, argument_list) {
        this.arg_name = arg_name
        this.argument_list = argument_list
    }
    var play_sequence_object = function(obj_inp, vel, dur) {
        arr_ind = i
        str = "beat" + arr_ind;



        for (note in obj_inp[str]) {
            note_num = parseInt(obj_inp[str][note]);
            midi_byte_note_on = [(143 + controlling_item), note_num, vel]
            socket.emit("MIDImessage", midi_byte_note_on)
            setTimeout(function() {
                midi_byte_note_off = [(127 + controlling_item), note_num, vel]
                socket.emit("MIDImessage", midi_byte_note_off)
            }, dur)
        }

        //reset counters

        if (i == 9) {
            i = 1
        } else {
            i += 1
        }
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
    var section_names = ["Ambience", "Bells", "Bass", "Clarinet", "Guitar", "Drums"]

    function moduleDidLoad() {
        csound.Play();
    }

    function createCSD(string) {
        var csd = "<CsoundSynthesizer>\n<CsOptions>\n-o dac -M0\n</CsOptions>\n<CsInstruments>\n"
        csd += string
        csd += "\n</CsInstruments>\n<CsScore>\n"
        csd += "\n</CsScore>\n</CsoundSynthesizer>\n"
        return csd
    }

    beat_number = 1;
    var parse_boxes_musical = function() {
        obj = {
            "beat1": [],
            "beat2": [],
            "beat3": [],
            "beat4": [],
            "beat5": [],
            "beat6": [],
            "beat7": [],
            "beat8": []
        }
        for (i = beat_number; i < 9; i++) {
            $("[data-beat = " + i + "]").each(function() {
                if ($(this).hasClass("active_m_s_box") == true) {
                    console.log(i)
                    console.log($(this).attr("data-note"))
                    beat_str = "beat" + i
                    obj[beat_str].push(parseInt($(this).attr("data-note")))
                }
            });
        }
        return obj;
        beat_number = 1;
    }

    $(document).ready(function() {
        /*** Generate! **/
        generator("drums");
        /*** Work on WebMidi things here: */
        $(".help_section").delay(2000).fadeOut("slow");
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

        $(".key")
            .mousedown(function() {
                console.log($(this).attr("data"));
                midi_byte = [(controlling_item + 143), parseInt($(this).attr("data")), 70]
                socket.emit("MIDImessage", midi_byte)
            })
            .mouseup(function() {
                console.log($(this).attr("data"));
                midi_byte = [(controlling_item + 127), parseInt($(this).attr("data")), 70]
                socket.emit("MIDImessage", midi_byte)
            }).bind("touchstart", function(e) {
                console.log($(this).attr("data"));
                midi_byte = [(controlling_item + 143), parseInt($(this).attr("data")), 70]
                socket.emit("MIDImessage", midi_byte)
            }).bind('touchend', function(e) {
                console.log($(this).attr("data"));
                midi_byte = [(controlling_item + 127), parseInt($(this).attr("data")), 70]
                socket.emit("MIDImessage", midi_byte)
            });
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
        $(".item").click(function() {
            var clicked_div = $(this);
            if ($(this).attr("data-disabled") == "false" && controlling_bool == false) {
                controlling_bool = true
                sectionNumber = parseInt($(this).attr("data-section-number"))
                temp_sec_val = split_orcs[sectionNumber]
                controlling_item = sectionNumber
                $(".content_instr_details").html(content_arr[sectionNumber])
                $(this).children(".sector").css("fill", color_arr_orig[ins_num])
                $(this).css("color", "white")
                $(this).css("stroke", "white")
                ev_args = {}
                ev_args.from = me
                ev_args.event_type = "control_disable"
                ev_args.event_args = sectionNumber;
                socket.emit("event", ev_args)
                me.controlling = sectionNumber
                if (sectionNumber == 5) {
                    parseOrc(temp_sec_val, "default");
                    console.log("EH?")
                    $(".looper_creator").fadeIn("fast");
                } else if (sectionNumber == 0) {
                    $(".looper_creator").fadeOut("fast");
                    $(".samples").fadeIn("fast");
                    parseOrc(temp_sec_val, "default");
                } else {
                    $(".looper_creator").fadeOut("fast");
                    $(".instrument_name_float").html(section_names[sectionNumber])
                    $(".m_main_window").fadeIn("fast");
                    parseOrc(temp_sec_val, "default");
                }
            }
        });
        $(document).on("click", ".sample", function() {
            if ($(this).attr('data-triggered') == "false") {

                str_for_ev = 'i "' + $(this).attr("data") + '" 0 -1'
                ev_dets = {}
                ev_dets.from = me
                ev_dets.event_type = "note_message"
                ev_dets.event_args = str_for_ev
                socket.emit('event', ev_dets)
                $(this).attr('data-triggered', 'true')
            } else {
            }
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

        $(document).on("click", ".s_box", function() {
            if ($(this).attr("data-instr") == "kick") {
                $(this).toggleClass("active_box_kick");
            }
            if ($(this).attr("data-instr") == "snare") {
                $(this).toggleClass("active_box_snare");
            }
            if ($(this).attr("data-instr") == "hat") {
                $(this).toggleClass("active_box_hat");
            }
        });

        $(document).on("click", ".m_s_box", function() {
            $(this).toggleClass("active_m_s_box")
        });

        $(document).on("click", "[data-action=play_midi]", function() {
            midi_str = parse_boxes_musical()
            console.log(midi_str);
            requestAnimationFrame(setInterval(play_sequence_object, 500, midi_str, 72, 250))

        });
        $(document).on("click", "[data-action=show_piano]", function() {
            $(".floating_keyboard").fadeToggle("fast");
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
                ev_dets.event_args = ev_args
                socket.emit("event", ev_dets)
                socket.emit("request_orc")

                $(".instruments_container").fadeIn("fast");
            }
        });
        $(document).on("click", "[data-action=play]", function() {
            csd_str = parse_boxes()
            ev_dets = {}
            ev_dets.from = me
            ev_dets.event_type = "sequence"
            ev_dets.event_args = csd_str
            socket.emit("event", ev_dets)
            setInterval(function() {
                nev_dets = {}
                nev_dets.from = me
                nev_dets.event_type = "sequence"
                nev_dets.event_args = parse_boxes()
                socket.emit("event", nev_dets)
            }, 4000);
        });

        $(document).on("click", "[data-action=full_screen]", function() {
            $(".looper_creator").transition({
                width: "98%"
            }).transition({
                height: "100%"
            });
            $(this).attr("data-action", "contract");
            $(this).html("Condense")
        });
        $(document).on("click", "[data-action=contract]", function() {
            $(".looper_creator").transition({
                width: "70%"
            }).transition({
                height: "50%"
            });
            $(this).attr("data-action", "full_screen");
            $(this).html("Expand")
        });


        $(document).on("input change", ".slide", function() {
            console.log($(this).attr("data-channel"))
            console.log($(this).val())
            if (csound.module) {
                csound.SetChannel($(this).attr("data-channel"), parseInt($(this).val()))
            } else {
                csoundObj.setControlChannel($(this).attr("data-channel"), parseInt($(this).val()))
            }
        });
    });
