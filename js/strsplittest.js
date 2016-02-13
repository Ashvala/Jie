var fs = require("fs");
var split_orcs = [];
var orc_strs = "";

fs.readFile("0.orc", "utf-8", function(err, data){
    if(err){throw err;}
    orc_strs = data;
    split_orc(orc_strs)
    console.log(split_orcs)
});
var section_count = 0;

split_orc = function(orc_str){
    var prev_index = 0;
    temp_arr = orc_str.split("\n");
    console.log(temp_arr)
    for (i = 0; i < temp_arr.length; i++){
		if(temp_arr[i].indexOf(";") == 0){
		    temp_str = temp_arr[i];
	    	if(temp_str[0] == ";" && temp_str[temp_str.length-1] == ";"){
				section_count += 1;
				console.log("Section count: ", section_count);
				var ret_str = orc_str.substring(prev_index,orc_str.indexOf(temp_str)-1);
				split_orcs.push(ret_str);
				prev_index = orc_str.indexOf(temp_str) + temp_str.length + 1;
				var remaining = orc_str.substring(prev_index, orc_str.length);
				split_orc(remaining);
	    	}
		}
    }
}

//split_orc(orc_strs)
//console.log(split_orcs)
