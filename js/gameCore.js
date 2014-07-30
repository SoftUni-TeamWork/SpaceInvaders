define(['gameWelcome'], function(Welcome) {
	'use strict';
	/**
	 * <h1>Object GameCore</h1>
	 * GameCore object holds the core of the game.
	 *
	 * @author  Vasil Tsintsev
	 * @version 0.1
	 * @since   2014-07-22
	 */

	function GameCore() {
		/**
		 * Canvas settings
		 */
		this.width = 800;
		this.height = 600;
		this.borders = {
			left: 10,
			top: 10,
			right: 790,
			bottom: 590
		};
		this.intervalId = 0;
		this.lastShootTime = null;

		/**
		 * Player values
		 */
		this.defaultShipHealth = 20;
		this.playerScore = 0;
		this.playerShipHealth = this.defaultShipHealth;
		this.currentLevel = 1;
		this.currentLives = 3;
		this.riseLevelOnScore = 20;

		/**
		 * Game values
		 */
		this.ship = null;
		this.boss = null;
		this.shipMoveSpeed = 5;
		this.bullets = [];
		this.bulletSpeed = 10;
		this.stateStack = [];
		this.enemies = [];
		this.enemiesFallingSpeed = 1;
		this.lastEnemyAppear = null;
		this.pressedKeys = {};
		this.gameCanvas = null;

		var self = this;

		/**
		 * Functions for iteration with the client
		 */
		this.pressed = function(keyCode) {
			this.pressedKeys[keyCode] = true;
			if (self.currentState() && self.currentState().keyDown) {
				self.currentState().keyDown(this, keyCode);
			}
		};

		this.released = function(keyCode) {
			delete this.pressedKeys[keyCode];
			if (self.currentState() && self.currentState().keyUp) {
				self.currentState().keyUp(this, keyCode);
			}
		};
	}


	GameCore.prototype = {
		initGame: function() {
			var self = this;
			/**
			 * To prevent problems with some browsers - we clear the default
			 * functions / events for the main buttons (left and right arrow,
			 * and space). We save the pressed button and we used it later in the game.
			 * 32: space
			 * 37: left arrow
			 * 39: right arrow
			 */
			window.addEventListener('keydown', function keydown(e) {
				var keycode = e.which || window.event.keycode;
				if (keycode == 32 || keycode == 37 || keycode == 39) {
					e.preventDefault();
				}

				self.pressed(keycode);
			});

			window.addEventListener('keyup', function keydown(e) {
				var keycode = e.which || window.event.keycode;
				self.released(keycode);
			});

			/**
			 * We get the main canvas into the variable "canvas" and we set its parameters
			 */
			var canvas = document.getElementById("mainCanvas");
			canvas.width = 800;
			canvas.height = 600;

			self.gameCanvas = canvas;
		},

		/**
		 * Start the game with welcome window before playing
		 */
		startGame: function() {
			var self = this;
			self.setState(new Welcome());

			this.intervalId = setInterval(function() {
				MainLoop(self);
			}, 20);
		},

		/**
		 * Returns the current state of the game
		 */
		currentState: function() {
			if (this.stateStack.length > 0) {
				return this.stateStack[this.stateStack.length - 1];
			} else {
				return null;
			}
		},

		/**
		 * This function set a new state and erase the old one, if there is such.
		 */
		setState: function(state) {
			if (this.currentState()) {
				this.stateStack.pop();
			}

			this.stateStack.push(state);
		},
	}

	/**
	 * Main loop, where the condition is checked and it is running until
	 * we get different state. The states are kept in array.
	 */
	function MainLoop(game) {
		if (game.currentState()) {
			var time = 0.04;
			var ctx = game.gameCanvas.getContext("2d");

			if (game.currentState().update) {
				game.currentState().update(game, time);
			}

			if (game.currentState().draw) {
				game.currentState().draw(game, time, ctx);
			}
		}
	}



	/**
	 * Function for stop/pause the game, for the moment it is not used, but it can be attached.
	 */
	function Stop() {
		clearInterval(game.intervalId);
	}

	return GameCore;
});