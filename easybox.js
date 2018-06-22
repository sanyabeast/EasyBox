window.Class=window.Class||function(name,description){if("object"==typeof name&&(description=name,name="Class"),"object"!=typeof description||Array.isArray(description))throw new Error("Invalid class description");var _constructor=description.constructor;delete description.constructor;var constructor=eval(["var "+name+" = function(){","\tif (_constructor) _constructor.apply(this, arguments);","};"+name].join(""));return constructor.prototype=Object.create(description).__proto__,constructor},function(o,e){if("function"==typeof define&&define.amd)define(e);else if("object"==typeof module&&module.exports)module.exports=e();else{var t=new(e());window.clavis=t}}(0,function(){
    
	var EasyBox = Class("EasyBox", {
		constructor : function(){

		}
	});

	return EasyBox;

});