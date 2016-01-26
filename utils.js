// on
function on(dom, event, listener, capture) {
	dom.addEventListener(event, listener, capture);
}

// ready
var ready = [];
ready.run = function() {
	while (ready.length) {
		ready.shift()();
	}
};
on(window, "load", ready.run);

// raf
var raf = requestAnimationFrame;

// viewport
var resize;
ready.push(function() {
	var cw = canvas.width, ch = canvas.height, cr = canvas.width / canvas.height;
	var ww, wh, wr;
	var s, ox, oy;
	resize = function() {
		ww = window.innerWidth; wh = window.innerHeight; wr = ww / wh;
		
		if (wr < cr) { // tall
			s = ww / cw;
			ox = 0;
			oy = (wh - (ch * s)) / 2;
		}
		else { // wide
			s = wh / ch;
			ox = (ww - (cw * s)) / 2;
			oy = 0;
		}
		
		canvas.style.transform = "translate3d(" + (ox/s) + "px," + (oy/s) + "px,0)";
		canvas.style.zoom = s;
	}
	on(window, "resize", resize);
	resize();
});

// load
function load(base) {
	var assets, loader = { base: base || "$&", assets: assets = {}, complete: 0, total: arguments.length - 2, errored: false, callback: null };
	function onload() {
		if (loader.errored) { return; }
		else if (++loader.complete >= loader.total) {
			loader.callback.call(loader, null, assets);
			this.onload = null;
		}
	}
	function onerror() {
		loader.errored = true;
		loader.callback.call(loader, new Error("Failed to load " + this.src));
	}
	
	for (var i = 1, img, l = arguments.length - 1; i < l; i++) {
		img = assets[arguments[i]] = new Image();
		img.onload = onload; img.onerror = onerror;
		img.src = arguments[i].replace(/.*/, loader.base);
	}
	
	loader.callback = arguments[i];
	
	return loader;
}

// graphics
ready.push(function() {
	var render = { x: 0, y: 0 };
	graphics.FLIP = { x: 1, y: 1 << 1, none: 0 };
	
	graphics.animation = {
		setFramePosition: function(original, x, y) {
			var frame = Object.create(original.frame);
			frame.position = Object.create(frame.position);
			frame.position.x = x; frame.position.y = y;
			return frame;
		}
	};
	graphics.METHODS = {
		startAnimation: function(name, time) {
			if (this.current !== this[name]) {
				if (isNaN(time)) { time = performance.now(); }
				this.startTime = time;
				this.current = this[name];
				this.index = 0;
			}
		},
		update: function(time) {
			if (this.current.length > 1) {
				this.index = (((time - this.startTime) / this.frameDuration) % this.current.length) | 0;
			}
		},
		draw: function() {
			var src = this;
			var c = camera.translate(src.position, render);
			//c.x -= src.centre.x; c.y -= src.centre.y;
			ctx.save(); ctx.translate(c.x, c.y);
			if (src.flip) {
				ctx.scale(src.flip & graphics.FLIP.x ? -1 : 1, src.flip & graphics.FLIP.y ? -1 : 1);
			}
			
			var frame = src.frame;
			if (frame && src.animation) {
				frame = src.animation.current[src.animation.index];
			}
				
			if (frame) {
				ctx.drawImage(src.image,
					frame.position.x, frame.position.y, frame.size.width, frame.size.height,
					-src.centre.x, -src.centre.y, frame.size.width, frame.size.height
				);
			}
			else {
				ctx.drawImage(src.image, -src.centre.x, -src.centre.y);
			}
			ctx.restore();
		}
	};
});

// input
var input = [];
(function() {
	function log(e) {
		e = e || window.event;
		//e.preventDefault();
		e.time = performance.now();
		input.push(e);
	}
	"keydown,keyup".split(",").forEach(function(event) {
		on(window, event, log);
	});
})();