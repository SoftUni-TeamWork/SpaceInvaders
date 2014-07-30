define(function() {
	/**
	 * Function for creation of bullets.
	 * Like the ship, they have start position, but also and speed.
	 */
	function Bullet(x, y, velocity) {
		this.x = x;
		this.y = y;
		this.velocity = velocity;
	}

	return Bullet;
})