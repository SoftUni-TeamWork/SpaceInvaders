define(function() {
	var Play = null;
	/**
	 *
	 * <h1>GameOver procedure</h1>
	 * Procedure which shows the GameOver screen and waits for
	 * user interaction to change the state and run again the game.
	 *
	 * @author  Vasil Tsintsev
	 * @version 0.1
	 * @since   2014-07-26
	 *
	 */
	function GameOver(Play) {
		// Fix circular reference dependency
		Play = Play;
		/**
		 *
		 * <h1> Draw method </h1>
		 * This method draws the GameOver texts and items on the screen.
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
			ctx.fillStyle = "#FFFFFF";
			ctx.textBaseline = "center";
			ctx.textAlign = "center";
			ctx.fillText("Game Over", game.width / 2, game.height / 2 - 70);
			ctx.font = "23px Arial";

			ctx.fillText("Your score is: " + game.playerScore, game.width / 2, game.height / 2 - 40);
			ctx.font = "16px Arial";
			ctx.fillText("Press 'Space' to play again.", game.width / 2, game.height / 2);
		};

		/**
		 *
		 * <h1>KeyDown method</h1>
		 * This method is listening for KeyDown event changes the
		 * game state. After press - runs again the game
		 *
		 * @author Vasil Tsintsev
		 * @return undefined  Doesn't return anything.
		 * @param game Requires tha main game Object instance
		 * @param keyCode This parameter reads the key pressed.
		 *
		 */
		this.keyDown = function(game, keyCode) {
			if (keyCode == 32) {
				game.playerScore = 0;
				game.currentLevel = 1;
				game.currentLives = 3;
				game.playerShipHealth = game.defaultShipHealth;
				game.setState(new Play(game));
			}
		};
	}

	return GameOver;
});