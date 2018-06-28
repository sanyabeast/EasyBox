require(["easybox"], function(EasyBox){
	window.EasyBox = EasyBox;
	window.easybox = new EasyBox();

	var testViewport = document.querySelector(".test-viewport .scene");
	var viewport = easybox.createViewport();
	var easytree = easybox.fromDOM(testViewport);

	viewport.add(easytree);

	window.easytree = easytree;

	$(".test-viewport").resizable({
		resize : function(evt, ui){
			viewport.setComputed({
				x : 0,
				y : 0,
				width : ui.size.width,
				height : ui.size.height
			});
		}
	});
});