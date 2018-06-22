!function(e,o){if("function"==typeof define&&define.amd)define(o);else if("object"==typeof module&&module.exports)module.exports=o();else{var n=new(o());window.clavis=n}}(0,function(){
	window.Class = window.Class || function(name, description){
		if (typeof name == "object"){
			description = name;
			name = "Class";
		}

		if (typeof description !== "object" || Array.isArray(description)){
			throw new Error("Invalid class description");
		}

		var _constructor = description.$constructor;
		delete description.$constructor;
		var $constructor = eval([
			"var " + name + " = function(){",
			"	if (_constructor) _constructor.apply(this, arguments);",
			"};" + name
		].join(""));
		$constructor.prototype = Object.create(description);
		return $constructor;
	};


	var EasyBox = Class("EasyBox", {
		constructor : function(){

		},
		privet : function(){

		}
	});


    return EasyBox;


});