(function() {
	'use strict';
	require.config({
		paths: {
			'gameCore': 'gameCore',
			'gameWelcome': 'gameWelcome',
			'gamePlay': 'gamePlay',
			// 'init': 'init.js'
		}
	});

	require(['gameCore'], function(GameCore) {
		/*
		 * Създаваме нова глобална променлива "game" като инстанция на обект (клас): "GameCore".
		 */
		var game = new GameCore();

		// Инициализираме играта.
		game.initGame();

		// Пускаме играта.
		game.startGame();
	});
}());