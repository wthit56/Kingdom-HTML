var canvas = document.createElement("CANVAS"), ctx;
if (canvas.getContext && (ctx = canvas.getContext("2d"))) {
	canvas.width = 288 * 1; canvas.height = 160 * 1;
	//ctx.fillRect(0,0,canvas.width,canvas.height);
	ready.push(function() {
		document.body.appendChild(canvas);
	});
	
	var graphics, loader = load("assets/$&.png", "cobblestones","king", function(error) {
		if (error) { throw error; }
		else {
			graphics = this.assets;
			state = STATES.game;
			
			ready.run();
			
			graphics.cobblestones = {
				image: graphics.cobblestones,
				position: { x: 0, y: 0 },
				centre: { x: 64, y: 4 },
				draw: graphics.METHODS.draw
			};
			
			function moveFrame(x) {
				return graphics.animation.setFramePosition(this, x * this.frame.size.width, 0);
			}
			
			graphics.king = {
				image: graphics.king,
				position: { x: 0, y: 0 },
				centre: { x: 30, y: 64 },
				frame: { position: { x: 0, y: 0 }, size: { width: 64, height: 64 } },
				flip: graphics.FLIP.none,
				draw: graphics.METHODS.draw
			};
			graphics.king.animation = {
				frameDuration: 1000 / 10,
				current: null, index: 0, startTime: 0,
				idle: [8].map(moveFrame, graphics.king),
				walk: [0, 1, 2, 3, 4, 5, 6, 7].map(moveFrame, graphics.king),
				startAnimation: graphics.METHODS.startAnimation, update: graphics.METHODS.update
			};
			graphics.king.animation.startAnimation("walk", 100);
		}
	});
	
	var STATES = { loading: {}, game: {} };
	var state = STATES.loading, stateChange = true;
	raf(function frame(time) {
		draw(time);
		update(time);
		raf(frame);
	});
}
else {
	alert("This browser does not support canvas.");
}