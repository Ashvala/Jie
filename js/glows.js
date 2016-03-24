glow_animate = function(div_obj){
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
        backgroundColor: $.Color({lightness: new_lightness})
    }, 1500).delay(1400);
    div_obj.animate({
        backgroundColor: $.Color({lightness: original_lightness})
    }, 1500);
}
glow_animate_color = function(div_obj){
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
        color: $.Color({lightness: new_lightness})
    }, 200).delay(1400);
    div_obj.animate({
        color: $.Color({lightness: original_lightness})
    }, 200);
}

glow_repeats = function(){
    n = 1
    setInterval(function(){
        beat_val = n%16
        if (beat_val == 0){
            beat_str = "[data-beat=" + 16 + "]"
        }else{
            beat_str = "[data-beat=" + beat_val + "]"
        }
        $(beat_str).transition({"-webkit-filter": "brightness(0.8)"}).delay(10).transition({"-webkit-filter": "brightness(1)"})
        n += 1
    }, 248)
}
