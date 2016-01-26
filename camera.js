var camera = {
	x: 0, y: 0,
	centre: { x: 0, y: 0 },
	
	translate: function(position, result) {
		if (!result) { result = {}; }
		
		if (!isNaN(position.z) && (position.z !== 1)) {
			result.x = camera.centre.x - camera.x + (position.x / position.z);
			result.y = camera.centre.y - camera.y + (position.y / position.z);
		}
		else {
			result.x = position.x + camera.centre.x - camera.x;
			result.y = position.y  + camera.centre.y - camera.y;
		}
		
		return result;
	}
};

ready.push(function() {
	camera.centre.x = canvas.width / 2;
	camera.centre.y = canvas.height / 2;
});