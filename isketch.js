"undefined"===typeof sketch&&(sketch={});
(function(g){
	g.registerToolkit = function(name, object){
		var module = g.module;
		module.toolkit = module.toolkit || {};
		module.toolkit[name] = object;
	}

	g.module = g.module || {};
	g.module.Toolkit = function(sk, document){

	}
})(sketch);

(function(g){
	var vector = g.vector = g.vector || {};
	var shape = vector.Shape = vector.Shape || {};

	shape.VOBPathOffset = function(ctx, operations, xOffset, yOffset){
		for (var op in operations) {
			if (op.cmd == "M") {
				ctx.moveTo(op.x + xOffset, op.y + yOffset);
				ctx.lineTo(op.x + xOffset + 0.01, op.y + yOffset + 0.01);
			} else if (op.cmd == "L") {
				ctx.lineTo(op.x + xOffset, op.y + yOffset);
			} else if (op.cmd == "C") {
				ctx.bezierCurveTo(op.x1 + xOffset, op.y1 + yOffset, op.x2 + xOffset, op.y2 + yOffset, op.x + xOffset, op.y + yOffset);
			}
		}
	}
})(sketch);


(function(g){
	g.registerToolkit("brush", function(sk, document){
		this.enable = function(){

		};
		this.disable = function(){

		}
	})
})