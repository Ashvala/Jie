notify = function(type, obj) {
    console.log("Notification!");
    if (type == "new_client") {
        $(".notification_title").html("New client added");
        client_str = obj.name + " was added to the ensemble!"
        $(".notification_content").html(client_str);
    }
    if (type == "note_event") {
        $(".notification_title").html(obj.from.name + " played a note")
        $(".notification_content").html(obj.event_args + " was sent")
    }
    $(".notification_area").fadeIn("fast").delay(1000);
    $(".notification_area").fadeOut("fast");

}

generate_lane_for_name = function(name, type, total) {
    for (var i = 0; i < total; i++) {
        div_str = "<div class='s_box' data-beat='" + (i + 1) + "' data-instr=" + name + "></div>"
        $("[data-lane=" + name + "]").append(div_str)
    }
}

generator = function(type) {
    var options = $(".options")
    if (type == "drums") {
        $(".looper_creator").html(" ")
        $(".looper_creator").append("<div class='section-title' style='margin-left: 10px; font-size: 1.4em; font-weight: 100;'> Drum Looper </div>")
            /** Generate Hat */
        $(".looper_creator").append("<div class='kick_line' data-lane='hat'>")
        $("[data-lane=hat]").append("<div class='name'> Hat </div>")
        generate_lane_for_name("hat")
            /** Generate Snare */
        $(".looper_creator").append("<div class='kick_line' data-lane='snare'>")
        $("[data-lane=snare]").append("<div class='name'> Snare </div>")
        generate_lane_for_name("snare")
            /** Generate kicks */
        $(".looper_creator").append("<div class='kick_line' data-lane='kick'>")
        $("[data-lane=kick]").append("<div class='name'> Kick </div>")
        generate_lane_for_name("kick")
        $(".looper_creator").append(options);
    }

}


generate_csound_score = function(instr, arr) {
    curr_time = 0
    string = ""
    for (beat in arr) {
        if (arr[beat] == 1) {
            csd_str = "i \"" + instr + "\" " + curr_time + " 0.25" + "\n"
            string += csd_str
        }
        curr_time += 0.25
    }
    return (string)
}

parse_boxes = function() {
    csd_str = ""
        // generate kick sequence first:
    var kick_arr = []
    line = $("[data-lane=kick]")
    line.children("[data-instr=kick]").each(function() {
        if ($(this).hasClass("active_box_kick")) {
            kick_arr.push(1)
        } else {
            kick_arr.push(0)
        }
    })
    console.log(kick_arr);
    csd_str += generate_csound_score("kick", kick_arr)
        // generate snare sequence next:
    var snare_arr = []
    line = $("[data-lane=snare]")
    line.children("[data-instr=snare]").each(function() {
        if ($(this).hasClass("active_box_snare")) {
            snare_arr.push(1)
        } else {
            snare_arr.push(0)
        }
    })
    console.log(snare_arr);
    csd_str += generate_csound_score("snare", snare_arr)

    // generate hat sequence next:
    var hat_arr = []
    line = $("[data-lane=hat]")
    line.children("[data-instr=hat]").each(function() {
        if ($(this).hasClass("active_box_hat")) {
            hat_arr.push(1)
        } else {
            hat_arr.push(0)
        }
    });

    console.log(hat_arr);
    csd_str += generate_csound_score("hat", hat_arr)
    return csd_str
}
