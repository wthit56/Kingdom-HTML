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

	var uTime = 0, uDelta = 0, ue;
	var sTime = 0;
	update = function(time) {
		var _sim = sim[
			state === STATES.game ? "game" :
				"none"
		];
		switch (state) {
			case STATES.game:
				while (input.length > 0) {
					ue = input.shift();
					_sim(ue.time - sTime, ue.time);
					sTime = ue.time;
					if (ue.type.substr(0, 3) === "key") {
						input.keys[input.keys.byCode[ue.keyCode]] = (ue.type === "keydown");
					}
				}
				_sim(time - sTime, time);
				sTime = time;
				
				graphics.king.animation.update(time);
				break;
		}
		
		uTime = time;
	};
	
	input.keys = {
		byCode: {
			37: "left", 39: "right", 28: "up", 40: "down",
			16: "shift", 17: "control"
		}
	};
	
	var sim = {
		game: function(delta, time) {
			window.time = time;
			if (input.keys.left && !input.keys.right) {
				graphics.king.position.x -= delta * graphics.king.speed;
				graphics.king.flip = graphics.FLIP.x;
				graphics.king.animation.startAnimation("walk", time);
			}
			else if (input.keys.right && !input.keys.left) {
				graphics.king.position.x += delta * graphics.king.speed;
				graphics.king.flip = graphics.FLIP.none;
				graphics.king.animation.startAnimation("walk", time);
			}
			else if ((graphics.king.animation.current === graphics.king.animation.idle) && (time - graphics.king.animation.startTime > 1000)) {
				console.log("eat");
				graphics.king.animation.startAnimation("eat", time);
			}
			else if (graphics.king.animation.current !== graphics.king.animation.eat) {
				graphics.king.animation.startAnimation("idle", time);
				
			}
		},
		none: function() { }
	};
})();