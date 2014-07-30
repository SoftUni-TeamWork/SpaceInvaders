define(function() {
	/**
	 * Function for creation of enemies.
	 * They have start position, speed, score and size.
	 */
	function Enemy(x, y, velocity, score) {
		this.x = x;
		this.y = y;
		this.velocity = velocity;
		this.score = score;
		this.width = 29;
		this.height = 36;
	}

	return Enemy;
});