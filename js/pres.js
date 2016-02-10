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
	   $(".dir-left").removeClass("active_dir");
	   $(".dir-left").addClass("inactive_dir");
	   $(".dir-right").removeClass("inactive_dir");
	   $(".dir-right").addClass("active_dir");

	   return false;
    });
    $(".dir-right").click(function(){
	   console.log(slide);
	   $(".dir-left").removeClass("inactive_dir");
	   $(".dir-left").addClass("active_dir");
	   $(this).removeClass("active_dir");
	   $(this).addClass("inactive_dir");
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

