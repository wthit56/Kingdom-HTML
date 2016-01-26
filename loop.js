var draw, update; (function() {
	draw = function() {
		switch (state) {
			case STATES.loading: drawLoading(); break;
			case STATES.game: drawGame(); break;
		}
	};

	function drawLoading() {
		if (stateChange) {
			ctx.strokeStyle =
				ctx.fillStyle =
					"white";
			ctx.lineWidth = 2; ctx.lineJoin = "miter";
			stateChange = false;
		}
		
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		var pad = 10, thick = 2, height = 10;
		ctx.strokeRect(pad + (thick / 2), canvas.height - (height * 2) - (thick / 2), canvas.width - thick - (pad * 2), height);
		
		ctx.fillRect(pad + (thick * 2), canvas.height - (height * 2) + thick, (canvas.width - pad - pad - (thick * 4)) * (loader.complete / loader.total), height - (thick * 3));
	}

	function drawGame() {
		ctx.clearRect(0,0, canvas.width, canvas.height);
		
		graphics.cobblestones.draw();
		graphics.king.draw();
		/*
		ctx.translate(-graphics.king.frame.size.width, 2);
		drawImage(graphics.king);
		ctx.translate(graphics.king.frame.size.width, -2);
		//*/
	}

	var uTime = 0;
	update = function(time) {
		switch (state) {
			case STATES.game:
				/*
				var delta = time - uTime;
				graphics.cobblestones.position.x += delta / (1000 / 10);
				//*/
				
				graphics.king.animation.update(time);
				break;
		}
		
		uTime = time;
	};
})();