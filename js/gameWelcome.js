define(['gamePlay'], function(Play) {
	/**
	 *
	 * <h1>Welcome procedure</h1>
	 * New method which shows the welcome texts and waits for
	 * user interaction to change the state and run the game.
	 *
	 * @author  Vasil Tsintsev
	 * @version 0.1
	 * @since   2014-07-23
	 *
	 */
	function Welcome() {
		/**
		 *
		 * <h1> Draw method </h1>
		 * This method draws the welcome texts and items on the screen.
		 *
		 * @author Vasil Tsintsev
		 * @return undefined  Doesn't return anything.
		 * @param game Requires tha main game Object instance
		 * @param time This parameter is currently not used
		 * @param ctx This parameter is the main Canvas context object.
		 *
		 */
		this.draw = function(game, time, ctx) {
			ctx.clearRect(0, 0, game.width, game.height);
			ctx.font = "28px Arial";
			ctx.fillStyle = "#ffffff";
			ctx.textBaseline = "center";
			ctx.textAlign = "center";
			ctx.fillText("Team Dobrovolski game", game.width / 2, game.height / 2 - 40);
			ctx.font = "16px Arial";
			ctx.fillText("Press 'Space' to play.", game.width / 2, game.height / 2);
		};

		/**
		 *
		 * <h1>KeyDown method</h1>
		 * This method is listening for KeyDown event changes the
		 * game state.
		 *
		 * @author Vasil Tsintsev
		 * @return undefined  Doesn't return anything.
		 * @param game Requires tha main game Object instance
		 * @param keyCode This parameter reads the key pressed.
		 *
		 */
		this.keyDown = function(game, keyCode) {
			if (keyCode == 32) {
				game.setState(new Play(game));
			}
		};
	}

	return Welcome;
})