var curr_beat_on_animate = 0
glow_animate = function(div_obj) {
    original_lightness = $.Color(div_obj, 'background').lightness()
    new_lightness = original_lightness + 0.1;
    original_hsla = $.Color(div_obj, 'background').hsla()
    original_rgba = $.Color(div_obj, 'background').rgba()
    new_hsla = {}
    new_hsla.hue = original_hsla.hue
    new_hsla.saturation = original_hsla.saturation
    new_hsla.lightness = new_lightness
    new_hsla.alpha = original_hsla.alpha


    div_obj.animate({
        backgroundColor: $.Color({
            lightness: new_lightness
        })
    }, 250).delay(250);
    div_obj.animate({
        backgroundColor: $.Color({
            lightness: original_lightness
        })
    }, 500);
}
glow_animate_svg = function(div_obj) {
    var main_circle = Snap("#trigger")
    original_lightness = $.Color(div_obj, 'fill').lightness()
    new_lightness = original_lightness + 0.1;
    original_hsla = $.Color(div_obj, 'fill').hsla()
    original_rgba = $.Color(div_obj, 'fill').rgba()
    new_hsla = {}
    new_hsla.h = original_hsla.hue
    new_hsla.s = original_hsla.saturation
    new_hsla.l = new_lightness
    var g = main_circle.select("circle")
        //    console.log(g)

    var glow1 = function() {
        g.animate({
            fill: Snap.hsl((original_hsla[0]), (original_hsla[1] * 100), ((original_hsla[2] + 0.1) * 100))
        }, 100, mina.linear, glow2);
    }
    var glow2 = function() {
            g.animate({
                fill: Snap.hsl((original_hsla[0]), (original_hsla[1] * 100), ((original_hsla[2]) * 100))
            }, 100);
        }

    glow1()
}

glow_animate_color = function(div_obj) {
    original_lightness = $.Color(div_obj, 'color').lightness()
    new_lightness = original_lightness + 0.4;
    original_hsla = $.Color(div_obj, 'color').hsla()
    original_rgba = $.Color(div_obj, 'color').rgba()
    new_hsla = {}
    new_hsla.hue = original_hsla.hue
    new_hsla.saturation = original_hsla.saturation
    new_hsla.lightness = new_lightness
    new_hsla.alpha = original_hsla.alpha
    console.log(original_lightness)
    div_obj.animate({
        color: $.Color({
            lightness: new_lightness
        })
    }, 200).delay(1400);
    div_obj.animate({
        color: $.Color({
            lightness: original_lightness
        })
    }, 200);
}

glow_repeats = function() {
    n = 1
    setInterval(function() {
        beat_val = n % 16
        if (beat_val == 0) {
            beat_str = "[data-beat=" + 16 + "]"
        } else {
            beat_str = "[data-beat=" + beat_val + "]"
        }
        curr_beat_on_animate = beat_val
        $(beat_str).transition({
            "-webkit-filter": "brightness(0.8)"
        }).delay(5).transition({
            "-webkit-filter": "brightness(1)"
        })
        n += 1
    }, 250)
}

scale_svg = function(item) {
    var scaler = Snap(item);
    var s = scaler.select("path")

    var mat_scaler_lower = new Snap.Matrix()
    mat_scaler_lower.scale(0.99, 1.0)
    var mat_scaler_higher = new Snap.Matrix()
    mat_scaler_higher.scale(1.01, 1.0)
    var animate_1 = function(){
        s.animate({transform: mat_scaler_higher}, 100, mina.linear, animate_2)
    }
    var animate_2 = function(){
        s.animate({transform: mat_scaler_lower}, 100, mina.linear)
    }
    animate_1()
}

scale_svg_release = function(item, scale_val){
    var scaler = Snap(item);
    var s = scaler.select("path")

    var mat_scaler_lower = new Snap.Matrix()
    mat_scaler_lower.scale(scale_val, 1.0)
    var animate_1 = function(){
        s.animate({transform: mat_scaler_higher}, 100, mina.linear)
    }
    animate_1()
}
