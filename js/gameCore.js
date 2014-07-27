/**
 * <h1>Object GameCore</h1>
 * GameCore object holds the core of the game.
 *
 * @author  Vasil Tsintsev
 * @version 0.1
 * @since   2014-07-22
 */
 
function GameCore(){
	/**
	 * Canvas settings
	 */
	this.width = 800;
	this.height = 600;
	this.borders = {left:10, top:10, right:790, bottom:590};
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
	
	/**
	 * Functions for iteration with the client
	 */
	this.pressed = function(keyCode){
		this.pressedKeys[keyCode] = true;
		if(currentState() && currentState().keyDown){
			currentState().keyDown(this, keyCode);
		}
	};
	
	this.released = function(keyCode){
		delete this.pressedKeys[keyCode];
		if(currentState() && currentState().keyUp){
			currentState().keyUp(this, keyCode);
		}
	};
}

function initGame(){
	/**
	 * To prevent problems with some browsers - we clear the default
	 * functions / events for the main buttons (left and right arrow,
	 * and space). We save the pressed button and we used it later in the game.
	 * 32: space
	 * 37: left arrow
	 * 39: right arrow
	 */
	window.addEventListener('keydown', function keydown(e){
		var keycode = e.which || window.event.keycode;
		if(keycode == 32 || keycode == 37 || keycode == 39){
			e.preventDefault();
		}
		
		game.pressed(keycode);
	});

	window.addEventListener('keyup', function keydown(e){
		var keycode = e.which || window.event.keycode;
		game.released(keycode);
	});
	
	/**
	 * We get the main canvas into the variable "canvas" and we set its parameters
	 */
	var canvas = document.getElementById("mainCanvas");
	canvas.width = 800;
	canvas.height = 600;
	
	game.gameCanvas = canvas;
}

/**
 * Start the game with welcome window before playing
 */
function startGame(){
	setState(new Welcome());

	this.intervalId = setInterval(function(){
			MainLoop(game);
		},20);
}

/**
 * Main loop, where the condition is checked and it is running until
 * we get different state. The states are kept in array.
 */
function MainLoop(game){
	if(currentState()){
		var time = 0.04;
		var ctx = game.gameCanvas.getContext("2d");
		
		if(currentState().update){
			currentState().update(game,time);
		}
		
		if(currentState().draw){
			currentState().draw(game,time,ctx);
		}
	}
}

/**
 * Returns the current state of the game
 */
function currentState(){
	if(game.stateStack.length > 0){
		return game.stateStack[game.stateStack.length - 1];
	}
	else{
		return null;
	}
}

/**
 * This function set a new state and erase the old one, if there is such. 
 */
function setState(state){
	if(currentState()){	
		game.stateStack.pop();
	}
	
	game.stateStack.push(state);
}

/**
 * Function for stop/pause the game, for the moment it is not used, but it can be attached.
 */
function Stop(){
	clearInterval(game.intervalId);
}