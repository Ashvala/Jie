function arg(arg_name, argument_list){
    this.arg_name =  arg_name
    this.argument_list = argument_list
}


var args_arr = ["//", "repeat: max=120, min=10;", "Q22: max=220, min=10;", "//"];

function parseArgArray(array){
    var argh;
    var name;
    var args = [];

    for(i = 0; i < array.length; i++){
	if (array[i].indexOf(":") != -1){
	    name = array[i].split(":")[0];
	}
	if (array[i].indexOf(",") != -1){
	    args.push(array[i].split(",")[0]);
	}
	if (array[i].indexOf(";") != -1){
	    args.push(array[i].split(";")[0]);
	}
    }

    argh = new arg(name, args);
    return argh;

}

parseArgs = function(arg_arr){
    var args_list = [];
    var temp_arg = [];
    console.log(arg_arr);
    for (i = 0; i < arg_arr.length; i++){
	console.log(arg_arr[i]);
	temp_arr = arg_arr[i].split(" ");
	if (temp_arr[0] == "//"){
	    console.log("HEH");
	}else{
	    temp_arg = parseArgArray(temp_arr);
	    args_list.push(temp_arg);
	}
    }

    console.log(args_list);
    return args_list;
}
parseArgs(args_arr);
