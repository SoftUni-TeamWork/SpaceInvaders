define({
	/*
	 * Създаваме нова глобална променлива "game" като инстанция на обект (клас): "GameCore".
	 */
	var game = new GameCore();

	// Инициализираме играта.
	initGame();

	// Пускаме играта.
	startGame();
});