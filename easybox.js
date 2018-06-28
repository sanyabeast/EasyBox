window.Class=window.Class||function(name,description){if("object"==typeof name&&(description=name,name="Class"),"object"!=typeof description||Array.isArray(description))throw new Error("Invalid class description");var _constructor=description.constructor;delete description.constructor;var constructor=eval(["var "+name+" = function(){","\tif (_constructor) _constructor.apply(this, arguments);","};"+name].join(""));return constructor.prototype=Object.create(description).__proto__,constructor},function(o,e){if("function"==typeof define&&define.amd)define(e);else if("object"==typeof module&&module.exports)module.exports=e();else{var t=new(e());window.clavis=t}}(0,function(){
    
    var StyleProcessor = Class("StyleProcessor", {
    	constructor : function(processor){
    		this.processor = processor;
    	},
    	process : function(parent, child){
    		return this.processor(parent, child);
    	}
    });

    var ValueProcessor = Class("ValueProcessor", {
    	constructor : function(processor, checker, parser){
    		this.processor = processor;
    		this.checker = checker;
    		this.parser = parser;
    	},
    	process : function(parentValue, childValue){
    		return this.processor(base, relative);
    	},
    	is : function(value){
    		return this.checker(value);
    	},
    	parse : function(value){
    		return this.parser(value);
    	}
    });

	var EasyBoxNode = Class("EasyBoxNode", {
		constructor : function(easybox, isViewport){
			this.isViewport = isViewport;
			this.easybox = easybox;

			this.children = [];
			this.styles = {};
			this.computed = {
				width : 0,
				height : 0,
				x : 0,
				y : 0
			};

			this.parentNode = null;
		},
		onChange : function(){

		},
		add : function(child){
			this.children.push(child);
			child.parentNode = this;
		},
		setStyle : function(name, value){
			this.styles[name] = value;
		},
		mutate : function(parent){
			console.log(parent);
		},
		setComputed(computed){
			if (!this.isViewport){
				return;
			}

			this.computed = computed;
			this.easybox.forEach(this.children, function(child){
				child.mutate(this);
			}.bind(this));
		}
	});

	var EasyBox = Class("EasyBox", {
		createViewport : function(){
			return new EasyBoxNode(this, true);
		},	
		constructor : function(tree){

		},
		fromDOM : function(dom){
			var tree;
			this.traverse(true, dom, function(domNode){ 
				return domNode.children; 
			}, function(domNode){
				return domNode.parentNode;
			}, function(domNode, parentDomNode, isRoot){
				var easynode = new EasyBoxNode(this);
				var styles = this.extractStylesFromDomNode(domNode);

				this.eachProp(styles, function(styleValue, styleName){ easynode.setStyle(styleName, styleValue) });

				if (isRoot){
					tree = easynode;
				};

				return easynode;
			}.bind(this), function(parentEasyNode, childEasyNode){
				parentEasyNode.add(childEasyNode);
			});

			console.log(tree);

			return tree;
		},
		extractStylesFromDomNode : function(domNode){
			var styles = {};
			this.forEach(domNode.attributes, function(attribute){
				if (attribute.name.match(/easy:/)){
					styles[attribute.name.replace(/easy:/, "")] = attribute.value;
				}
			});

			return styles;
		},
		traverse : function(isRoot, node, childGetter, parentGetter, traverseCB, resultCB){
			var children = childGetter(node);
			var parent = parentGetter(node);
			var parentResult = traverseCB(node, parent, isRoot);

			if (children){
				this.forEach(children, function(child){
					var childResult = this.traverse(false, child, childGetter, parentGetter, traverseCB, resultCB);
					if (resultCB) resultCB(parentResult, childResult);
				}.bind(this));
			}

			return parentResult;
		},
		forEach : function(list, cb){
			for (var a = 0, l = list.length; a < l; a++) cb(list[a], a, list);
		},
		eachProp : function(list, cb){
			for (var k in list) cb(list[k], k, list);
		},
		fromHTML : function(html){
			var div = document.createElement("div");
			div.innerHTML = html;
			dom = div.children[0];
			div.remove();
			return this.fromDOM(dom);
		},
		styles : {
			width : new StyleProcessor(function(parent, child){

			}),
			height : new StyleProcessor(function(parent, child){

			})
		},
		valueProcessors : {
			percentage : new ValueProcessor(function(parentValue, childValue){
				return parentValue * childValue;
			}, function(value){
				return value.indexOf("%" == value.length - 1);
			}, function(value){
				return (window.parseFloat(value) || 0) / 100;
			}),
			pixel : new ValueProcessor(function(parentValue, childValue){
				return childValue;
			}, function(value){
				return value.indexOf("px" == value.length - 1);
			}, function(value){
				return window.parseFloat(value);
			})
		},
		getValueType : function(value){
			var _type;
			this.eachProp(this.valueProcessors, function(valueProcessor, type){
				if (valueProcessor.is(value)){
					_type = type;
				}
			});

			return _type;
		}
	});

	return EasyBox;

});