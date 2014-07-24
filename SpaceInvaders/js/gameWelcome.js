define(['gamePlay'], function(Play) {
	/*
	 * Създаваме Функция / Обект "Welcome" имаща за цел да покаже
	 * начален текст преди да започне играта и да я стартира след
	 * натискане на "Space" бутон. Обекта има 2 променливи от тип функция:
	 *
	 * draw: Рисува канвас по целия размер на играта, като позиционира
	 * 		текст по средата. Очаква параметри: game,time,ctx
	 *
	 *
	 * keyDown: Слухти за натискане на "Space" и при натискане извиква
	 * 		функция Play(); Приема параметри: game, keyCode
	 *
	 */

	function Welcome() {

		/*
		 * Тази променлива (метод) рисува блокчето с текст.
		 */
		this.draw = function(game, time, ctx) {
			ctx.clearRect(0, 0, game.width, game.height);
			ctx.font = "28px Arial";
			ctx.fillStyle = "#ffffff";
			ctx.textBaseline = "center";
			ctx.textAlign = "center";
			ctx.fillText("Team Dobrovolski game", game.width / 2, game.height / 2 - 40);
			ctx.font = "16px Arial";
			ctx.fillText("Натиснете 'Space' за да играете.", game.width / 2, game.height / 2);
		};

		/*
		 * Тази променлива (метод) изчаква за натискане на бутон Space.
		 */
		this.keyDown = function(game, keyCode) {
			if (keyCode == 32) {
				game.setState(new Play(game));
			}
		};

	}

	return Welcome;
})