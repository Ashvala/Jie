var total_slides=0;
var slide=1;
var slide_list = [];
var clone;
var id_num;

function slide_display(number){
  if(number<=0 || number > total_slides) {return}
    slide_list[slide].delay(100).fadeOut("fast");
    slide_list[number].delay(200).fadeIn("fast");
    slide=number;
    console.log(slide_list[number]);
    if(number == 6){
        socket.emit("request_orc", 1)
    }else if(number == 7){
        socket.emit("request_orc", 2)
        socket.emit("chanmsg", "Q11 120")
        socket.emit("chanmsg", "Q12 120")
        socket.emit("chanmsg", "Q21 120")
        socket.emit("chanmsg", "Q22 120")
        socket.emit("sco", "i 1 0 240 60" )
    }
//    window.location.hash = (total_slides - slide)+1;

}

scan = function(){
    slide_list = []
    total_slides = 0;
    $(".screen").each(function(){
        $(this).css("display", "none");
        slide_list[++total_slides] = $(this);
    });
    console.log(total_slides);
    slide_list[1].addClass("topoflist");
    slide_list[2].removeClass("topoflist");
    slide_list[1].css("display", "block");
}

window.blog_init = function () {
    $(".screen").each(function(){
        $(this).css("display", "none");
        slide_list[++total_slides] = $(this);
    });
    slide_list[1].addClass("topoflist");

    $(".dir-left").click(function(){
	   console.log(slide);
	   slide_display(slide-1);


	   return false;
    });
    $(".dir-right").click(function(){
	   console.log(slide);

	   slide_display(slide+1);

	   return false;
    });
    $(document).keydown(function(e) {

	   var code = e.keyCode;
	   switch(code){
	   case 37:slide_display(slide-1);return false;
	   case 39:slide_display(slide+1);return false;
	   }
    });

    scan();
    slide_list[1].css("display", "block");
}
