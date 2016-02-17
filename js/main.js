var activeID = 0;
$(document).ready(function(){
  console.log("ready to roll");
  $(document).on("click", ".instr_list_button", function(){
      $(".editor").val($(this).attr("data-orc"))
      $(".file_name").val($(this).attr("data-name"))
      $(this).toggleClass("active");
  });
  var handleNew = function(){
    socket.emit("create_new_instr");
  }
  var handleSave = function(){
    $(".instr_list_button").each(function(){
      action = $(this).attr("data-type");
      if (action == "new_ins"){
          console.log(action);
      }
    });
  }
  $(document).on("click", ".options_button", function(){
      action = $(this).attr("data-action");
      if(action == "new"){
        console.log("This will create a new orchestra file");
        handleNew()
      }else if(action == "save"){
        console.log("this will save this file");
        handleSave();
      }else{
        console.log("illegal action");
      }
  });
})
