define(['gameWelcome'], function(Welcome) {
	'use strict';
	// Създаваме нова обект "GameCore" с необходимите параметри.
	function GameCore() {
		// конфигурационни параметри.
		var self = this;
		
		self.width = 800;
		self.height = 600;
		self.borders = {
			left: 10,
			top: 10,
			right: 790,
			bottom: 590
		};
		self.intervalId = 0;
		self.lastShootTime = null;

		self.ship = null;
		self.bullets = [];
		self.stateStack = [];
		self.enemies = [];
		self.lastEnemyAppear = null;

		self.pressedKeys = {};
		self.gameCanvas = null;

		self.pressed = function(keyCode) {
			this.pressedKeys[keyCode] = true;
			if (self.currentState() && self.currentState().keyDown) {
				self.currentState().keyDown(this, keyCode);
			}
		}

		self.released = function(keyCode) {
			delete this.pressedKeys[keyCode];
			if (self.currentState() && self.currentState().keyUp) {
				self.currentState().keyUp(this, keyCode);
			}
		}
	}

	GameCore.prototype = {
		initGame: function() {
			/*
			 * За да избегнем проблеми с някой браузъри - на основните бутони
			 * на играта (стрелките наляво / надясно и спейс им изключваме
			 * основните функций / events, като запомняме натиснатият бутон и
			 * го използваме по-късно в играта... до колкото е възможно.
			 * 32: space
			 * 37: стрелка - наляво
			 * 39: стрелка - надясно
			 */
			var self = this;

			window.addEventListener("keydown", function keydown(e) {
				var keycode = e.which || window.event.keycode;
				if (keycode == 32 || keycode == 37 || keycode == 39) e.preventDefault();
				self.pressed(keycode);
			});

			window.addEventListener("keyup", function keydown(e) {
				var keycode = e.which || window.event.keycode;
				self.released(keycode);
			});

			// Хващаме основният канвас в променлива "canvas" и му подаваме основни параметри.

			var canvas = document.getElementById("mainCanvas");
			canvas.width = 800;
			canvas.height = 600;

			self.gameCanvas = canvas;
		},

		/*
		 * Стартиране на играта
		 */
		startGame: function() {
			var self = this;
			self.setState(new Welcome());
			self.intervalId = setInterval(function() {
				self.MainLoop();
			}, 22);
		},

		/*
		 * Връща текущото състояние на играта.
		 */
		currentState: function() {
			if (this.stateStack.length > 0) {
				return this.stateStack[this.stateStack.length - 1];
			} else {
				return null;
			}
		},
		/*
		 * Записва ново състояние на играта, като премахва предишното
		 * ако го има.
		 */
		setState: function(state) {
			if (this.currentState()) {
				this.stateStack.pop();
			}

			this.stateStack.push(state);
		},

		/*
		 * Основният loop, изпълнява се постоянно и проверява за състоянието
		 * на играта, което трябва да извиква. Състоянията се пазят в масив.
		 *
		 */
		MainLoop: function() {
			if (this.currentState()) {
				var time = 0.04;
				var ctx = this.gameCanvas.getContext("2d");

				if (this.currentState().update) {
					this.currentState().update(this, time);
				}
				if (this.currentState().draw) {
					this.currentState().draw(this, time, ctx);
				}
			}
		},

		/*
		 * Метод за спиране / пауза на играта, поне за момента не се
		 * използва никъде. Но може да се приложи.
		 */
		Stop: function() {
			clearInterval(game.intervalId);
		}
	}

	return GameCore;
});