/*
   Catch Your Breath
   (c) 2015, Boulanger Labs
   Written by Ashvala Vinay,
   Developer @ Boulanger Labs
   avinay@berklee.edu
*/


function loadOrc(){ //Load an orchestra
	csound.CompileOrc(
	    "instr 1\n" +
		"a1 oscili 0.8, cpsmidinn(p4)\n"+
		"outs a1,a1\n" +
		"endin"
	);

}
var current_pres = 1;

function current_preset(){

    return current_pres;
}
function moduleDidLoad(){
    csound.Play();
    console.log("Csound Loaded");
}

function handleMessage(message){
//    $(".console").append(message.data + "<br/>");

}

$(document).ready(function(){

    $(".compile").click(function(){
	loadOrc();
    }); // When you press the compile button, it calls the loadOrc function.

    $(".play").click(function(){
	play_score();
    }); //When you press the play button, it calls the play_score function.
});
