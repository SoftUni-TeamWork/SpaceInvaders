define(function() {
	/**
	 * Function for defining the ship, it takes "x" and "y",
	 * which are the start position of the ship.
	 * It also has fixed size.
	 */
	function Ship(x, y) {
		this.x = x;
		this.y = y;
		this.width = 45;
		this.height = 43;
	}

	return Ship;
});