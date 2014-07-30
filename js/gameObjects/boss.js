define(function() {
	/**
	 * Function for creation of the boss.
	 * Unlike the enemies, it has health.
	 */
	function Boss(x, y, score, direction) {
		this.x = x;
		this.y = y;
		this.width = 70;
		this.height = 113;
		this.score = score;
		this.direction = direction;
		this.health = 30;
		this.velocity = 2.5;
	}

	return Boss;
});