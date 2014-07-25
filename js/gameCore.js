/**
 * <h1>Object GameCore</h1>
 * GameCore object holds the core of the game.
 *
 * @author  Vasil Tsintsev
 * @version 0.1
 * @since   2014-07-22
 */

function GameCore(){


	this.width=800;
	this.height=600;
	this.borders={left:10,top:10,right:790,bottom:590};
	this.intervalId=0;
	this.lastShootTime=null;

	this.defaultShipHealth=3;

	this.playerScore=0;
	this.playerShipHealth=this.defaultShipHealth;
	this.currentLevel=1;
	this.currentLives=3;
	this.riseLevelOnScore=10;

	this.ship=null;
	this.boss = null;
	this.shipMoveSpeed=5;
	this.bullets = [];
	this.bulletSpeed=10;
	this.stateStack = [];
	this.enemies = [];
	this.enemiesFallingSpeed=0.5;
    this.lastEnemyAppear=null;
	
	this.pressedKeys = {};
	this.gameCanvas =  null;
	
	this.pressed=function(keyCode){
		this.pressedKeys[keyCode]=true;
		if(currentState() && currentState().keyDown){
			currentState().keyDown(this,keyCode);
		}
	};
	
	this.released=function(keyCode){
		delete this.pressedKeys[keyCode];
		if(currentState() && currentState().keyUp){
			currentState().keyUp(this,keyCode);
		}
	};
}

function initGame(){
	
	/*
	 * За да избегнем проблеми с някой браузъри - на основните бутони 
	 * на играта (стрелките наляво / надясно и спейс им изключваме 
	 * основните функций / events, като запомняме натиснатият бутон и 
	 * го използваме по-късно в играта... до колкото е възможно.
	 * 32: space
	 * 37: стрелка - наляво
	 * 39: стрелка - надясно
	 */
	window.addEventListener("keydown",function keydown(e){
		var keycode=e.which || window.event.keycode;
		if(keycode == 32 || keycode == 37 || keycode == 39)e.preventDefault();
		game.pressed(keycode);
	});

	window.addEventListener("keyup",function keydown(e){
		var keycode = e.which || window.event.keycode;
		game.released(keycode);
	});
	
	// Хващаме основният канвас в променлива "canvas" и му подаваме основни параметри.

	var canvas=document.getElementById("mainCanvas");
	canvas.width=800;
	canvas.height=600;
	
	game.gameCanvas = canvas;
	
}

/*
 * Стартиране на играта
 */

function startGame(){
	
	setState(new Welcome());

	this.intervalId=setInterval(
		function(){
			MainLoop(game);
		},20);
}

/*
 * Основният loop, изпълнява се постоянно и проверява за състоянието 
 * на играта, което трябва да извиква. Състоянията се пазят в масив.
 * 
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

/*
 * Връща текущото състояние на играта.
 */

function currentState(){
	if(game.stateStack.length > 0){
		return game.stateStack[game.stateStack.length - 1];
	}
	else{
		return null;
	}
}

/*
 * Записва ново състояние на играта, като премахва предишното 
 * ако го има. 
 */

function setState(state){
	if(currentState()){	
		game.stateStack.pop();
	}
	
	game.stateStack.push(state);
}

/*
 * Метод за спиране / пауза на играта, поне за момента не се 
 * използва никъде. Но може да се приложи.
 */
function Stop(){
	clearInterval(game.intervalId);
}