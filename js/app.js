(function() {
	'use strict';
	require.config({
		paths: {
			'gameCore': 'gameCore',
			'gameWelcome': 'gameWelcome',
			'gamePlay': 'gamePlay',
			'gameOver': 'gameOver',
			'ship': 'gameObjects/ship',
			'enemy': 'gameObjects/enemy',
			'bullet': 'gameObjects/bullet',
			'boss': 'gameObjects/boss'
		}
	});

	require(['gameCore'], function(GameCore) {
		/**
		 * We create new global variable "game" as instance of class: "GameCore".
		 */
		var game = new GameCore();

		/**
		 * We initialize a new game
		 */
		game.initGame();

		/**
		 * Running the game
		 */
		game.startGame();
	});
}());