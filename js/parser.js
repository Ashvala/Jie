function arg(arg_name, argument){
    this.arg_name =  arg_name
    this.argument = argument
}

//instr_str = ";instr 01"
instr_str = "k1 chnget \"hello\";[max=1200]"

function parseArgStr(str){

    if (str.indexOf("=") == -1){
	throw "ERROR, NOT AN ARGUMENT"
    }else{
	arr = str.split("=");
	if(arr[0] == "display"){
	    if(arr[1] == "seq_button" || arr[1] == "knob" || arr[1] == "slider" || arr[1] == "none"){
		var args = new arg("display", arr[1])
		return args;
	    }
	}else if(arr[0] == "max"){
	    var args = new arg("data-max", arr[1])
	    return args;
	}else{
	    throw "UNPARSABLE"
	}
    }


}

parseArgs = function(str){
    semiColonIndex = str.indexOf(";")
    if (semiColonIndex != 0 && semiColonIndex != -1){
	if(str[semiColonIndex+1] == "["){
	    openBracketIndex = str.indexOf("[")
	    closeBracketIndex = str.indexOf("]");
	    if(closeBracketIndex != -1){
		new_arg = parseArgStr(str.substring(openBracketIndex+1,closeBracketIndex));
		console.log(new_arg);
	    }
	}
    }
}
parseArgs(instr_str);
