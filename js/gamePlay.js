/**
 * <h1>Object Play</h1>
 * This objects holds the most of the game-play functionality.
 * It is initialized once, but it's methods ( Draw and Update )
 * can be called from "gameCore.js:104,107" on every 20ms
 * depending on the game state.
 *
 * @author  Vasil Tsintsev
 * @version 0.1
 * @since   2014-07-22
 */
function Play() {
	/**
	 * <h1>Game Background Image</h1>
	 * We attach the game background image here.
	 *
	 * @author Asen Nikolov
	 * @type {Image}
	 */
	var background = new Image();
	background.src = "./images/Background.jpg";

	game.ship = new Ship(game.width / 2, game.borders.bottom);

	/**
	 * Creation of new enemy on random position 
	 */
	game.enemies.push(new Enemy((Math.random() * 100), 10, 70, 10));
	game.lastEnemyAppear = (new Date()).valueOf();

	/**
	 * Main images are selected here, and used later in the game
	 */
	var enemyImg = new Image();
	enemyImg.src = './images/Enemy.png';

	var ourShipImg = new Image();
	ourShipImg.src = './images/Ship.png';

	var bossImg = new Image();
	bossImg.src = './images/Boss.png';
	
	var fullHealthImg = new Image();
	fullHealthImg.src = './images/FullHealth.png';
	
	var emptyHealthImg = new Image();
	emptyHealthImg.src = './images/EmptyHealth.png';
	
	var bossHealthImg = new Image();
	bossHealthImg.src = './images/BossHealth.png';

	/**
	 * <h1> Draw method </h1>
	 * Depending on the game state - this method is used to
	 * draw almost all objects on the scene.
	 *
	 * @author Vasil Tsintsev
	 * @return undefined  Doesn't return anything.
	 * @param game Requires tha main game Object instance
	 * @param dt This parameter will not be used in future
	 * @param ctx This parameter is the main Canvas context object.
	 */
	this.draw = function(game, dt, ctx){
		ctx.clearRect(0, 0, game.width, game.height);
		
		/**
		 * Game background
		 */
		ctx.drawImage(background, 0, 0);
		ctx.fillStyle = '#555555';
		
		/**
		 * Here we show the rest of the lives with images
		 */
		function getLives(){
			if(game.currentLives == 3){
				for(var i = 0; i < 3; i += 1){
					ctx.drawImage(fullHealthImg, 50 + i * fullHealthImg.width, 10, fullHealthImg.width, fullHealthImg.height);
				}
			}
			else if(game.currentLives == 2){
				for(var i = 0; i < 2; i += 1){
					ctx.drawImage(fullHealthImg, 50 + i * fullHealthImg.width, 10, fullHealthImg.width, fullHealthImg.height);
				}
				
				ctx.drawImage(emptyHealthImg, 50 + 2 * emptyHealthImg.width, 10, emptyHealthImg.width, emptyHealthImg.height);
			}
			else if(game.currentLives == 1){
				ctx.drawImage(fullHealthImg, 50, 10, fullHealthImg.width, fullHealthImg.height);
				for(var i = 1; i < 3; i += 1){
					ctx.drawImage(emptyHealthImg, 50 + i * emptyHealthImg.width, 10, emptyHealthImg.width, emptyHealthImg.height);
				}
			}
		};
		
		/**
		 * Here we show the rest of the lives of the boss
		 */
		function showBossLives(){
			for(var i = 0; i < game.boss.health; i += 1){
				ctx.drawImage(bossHealthImg, 200 + i * bossHealthImg.width, 50, bossHealthImg.width, bossHealthImg.height);
			}
		};

		/**
		 * Here we Draw all the player's info
		 */
		var textYposition = game.borders.top + 10;
		ctx.font = "14px Arial";
		ctx.fillStyle = '#ffffff';
		var info = "Lives:          ";
		getLives();
		info += " , Health: "+ game.playerShipHealth;
		ctx.textAlign = "left";
		ctx.fillText(info, game.borders.left, textYposition);
		info = "Score: " + game.playerScore + ", Level: " + game.currentLevel;
		ctx.textAlign = "right";
		ctx.fillText(info, game.borders.right, textYposition);

		ctx.drawImage(ourShipImg, game.ship.x - (game.ship.width / 2), game.ship.y - (game.ship.height / 2), game.ship.width, game.ship.height);

		/**
		 * Boss appears when the level is > 4
		 */
		if(game.boss != null) {
			if (game.boss.health > 0){
				ctx.drawImage(bossImg, game.boss.x - (game.boss.width / 2), game.boss.y - (game.ship.height / 2), game.boss.width, game.boss.height);
				var bossHealth = 'Boss Health: ';
				showBossLives();
				ctx.fillText(bossHealth, ((game.width / 2) - 10), game.borders.top + 30);
			}
			
			if(game.boss.health == 0){
				game.boss = null;
			}
		}

		ctx.fillStyle = '#ff0000';
		
		for(var i = 0; i < game.bullets.length; i++){
			var bullet = game.bullets[i];
			ctx.fillRect(bullet.x, bullet.y - 2, 2, 6);
		}

		for(var j = 0; j < game.enemies.length; j++){
			var enemy = game.enemies[j];
			ctx.drawImage(enemyImg,enemy.x,enemy.y,enemy.width,enemy.height);
		}
	};
	
	/**
	 * This method changes the position of the ship, bullets, enemies.
	 * It refreshes on every 50ms.
	 */
	this.update = function(game){
		// Left arrow - moves the ship to the left
		if(game.pressedKeys[37]){ 
			game.ship.x -= ( game.shipMoveSpeed + (game.currentLevel / 2) );
		}

		// Right arrow - moves the ship to the right
		if(game.pressedKeys[39]){ 
			game.ship.x += ( game.shipMoveSpeed + (game.currentLevel / 2) );
		}

		if(game.ship.x < game.borders.left){
			game.ship.x = game.borders.left;
		}
		
		if(game.ship.x > game.borders.right){
			game.ship.x = game.borders.right;
		}

		for (var i = 0; i < game.bullets.length; i++){
			var bullet = game.bullets[i];
			bullet.y -= game.bullets[i].velocity;

			if(bullet.y < 5){
				game.bullets.splice(i--, 1);
			}
			
			if(bullet.y > game.ship.y){
				game.bullets.splice(i--, 1);
			}
		}

		for(var j = 0; j < game.enemies.length; j++) {
			var enemy = game.enemies[j];
			enemy.y += (game.enemiesFallingSpeed + (game.currentLevel));

			/**
			 * Ships health is decreasing on ship/enemy collisions
			 */
			if((enemy.x + enemy.width) > (game.ship.x - game.ship.width / 2) &&
			   (enemy.x) < (game.ship.x + game.ship.width / 2.3) &&
			   (enemy.y + (enemy.height + 7)) >= game.ship.y){
					game.playerShipHealth--;
					game.enemies.splice(j--,1);
	        }
			else{
				/**
				 * Remove the enemy's ship if reach the bottom's border of the game frame.
				 */
				if(enemy.y >= game.borders.bottom) {
					game.enemies.splice(j--, 1);
					game.playerShipHealth--; //If the player haven't destroyed the enemy on time, his health is decreasing
				}
			}

			/**
			 * This feature destroys the enemy
			 */
			var boom = false;

			for(var i = 0; i < game.bullets.length; i++){
				var bullet = game.bullets[i];

				if((bullet.x >= enemy.x) && (bullet.x <= (enemy.x + enemy.width)) && (bullet.y <= (enemy.y + (enemy.height - 20)))){
					game.bullets.splice(i--,1);
					boom = true;
					game.playerScore++;
					break;
				}
			}
			
			if(boom == true){
				game.enemies.splice(j--,1);
			}
		}
		
		/**
		 * Here we see if the bullet has hitted the boss
		 */
		if (game.boss != null) {
			for(var i = 0; i < game.bullets.length; i++){
				var bullet = game.bullets[i];

				if((bullet.x >= (game.boss.x - (game.boss.width / 2))) &&
				   (bullet.x <= (game.boss.x + (game.boss.width / 2))) &&
				   (bullet.y <= (game.boss.y + (game.boss.height - 10)))){
						game.bullets.splice(i--,1);
						game.boss.health--;
						game.playerScore++;
						break;
				}
			}
		}
		
		/**
		 * Here we see if the boss has hitted us
		 */
		for(var i = 0; i < game.bullets.length; i++){
			var bullet = game.bullets[i];

			if((bullet.x >= (game.ship.x - (game.ship.width / 2))) &&
			   (bullet.x <= (game.ship.x + (game.ship.width / 2))) &&
			   (bullet.y >= game.height - game.ship.height / 2)){
					game.bullets.splice(i--,1);
					game.playerShipHealth--;
					break;
			}
		}
		
		/**
		 * Changes of player statistics:
		 */
		if (game.playerScore > game.riseLevelOnScore) {
			game.playerScore = 0;
			game.currentLevel++;
		}

		if (game.playerShipHealth < 0) {
			game.playerShipHealth = game.defaultShipHealth;
			game.currentLives--;
		}

		if (game.currentLevel > 4) {
			this.boss();
		}
		else{
			if (((new Date()).valueOf() - game.lastEnemyAppear) > 2000){
				this.newEnemy();
			}
		}

		if (game.currentLives < 1){
			setState(new GameOver());
		}

		if (game.boss != null) {
			if (game.boss.health < 1){
				game.boss = null;
				setState(new GameOver());
			}
		}
	};

	/**
	 * This method shoots bullets on pressed SpaceBar button
	 */
	this.keyDown = function(game, keyCode){
		if (keyCode == 32){
			this.fireRocket();
		}
	};

	/**
	 * This method simulates shooting and shoots on all 200ms.
	 */
	this.fireRocket = function(){
		if (game.lastShootTime === null || ((new Date()).valueOf() - game.lastShootTime) > 200) {
			game.bullets.push(new Bullet(game.ship.x, game.ship.y - 12, game.bulletSpeed));
			game.lastShootTime = (new Date()).valueOf();
		}
	};

	/**
	 * This method creates new enemy on every 2000 ms
	 */
	this.newEnemy = function(){
		var newX = Math.random() * 750;
		game.enemies.push(new Enemy(newX, 20, (game.currentLevel * 50), (game.currentLevel * 10)));
		game.lastEnemyAppear = (new Date()).valueOf();
	};
	
	/**
	 * Function for creation of the boss, after the level 5 is reached
	 */
	this.boss = function(){
		if(game.boss == null){
			game.boss = new Boss(game.width / 2, 20, (new Date()).valueOf(), 'left');
		}

		if(game.boss.y < (game.height / 3)){
			game.boss.y++;
		}
		else{
			var leftBorder = 200;
			var rightBorder = 500;
			while(true){
				if(game.boss.x < rightBorder && game.boss.direction == 'right'){
					game.boss.x += game.boss.velocity;
					break;
				}
				
				if(game.boss.x >= rightBorder && game.boss.direction == 'right'){
					game.boss.direction = 'left';
					break;
				}
				
				if(game.boss.x > leftBorder && game.boss.direction == 'left'){
					game.boss.x -= game.boss.velocity;
					break;
				}
				
				if(game.boss.x <= leftBorder && game.boss.direction == 'left'){
					game.boss.direction = 'right';
					break;
				}
			}
			
			/**
			 * Each 35 pixels the boss is firing upon our ship
			 */
			if(game.boss.x % 35 == 0){
				game.bullets.push(new Bullet(game.boss.x, game.boss.y + game.boss.height, -10));
			}
		}
	};
}

/**
 * Function for defining the ship, it takes "x" and "y",
 * which are the start position of the ship.
 * It also has fixed size.
 */
function Ship(x, y) {
	this.x = x;
	this.y = y;
	this.width = 45;
	this.height = 43;
}

/**
 * Function for creation of bullets.
 * Like the ship, they have start position, but also and speed.
 */
function Bullet(x, y, velocity) {
	this.x = x;
	this.y = y;
	this.velocity = velocity;
}

/**
 * Function for creation of enemies.
 * They have start position, speed, score and size.
 */
function Enemy(x, y, velocity, score) {
	this.x = x;
	this.y = y;
	this.velocity = velocity;
	this.score = score;
	this.width = 29;
	this.height = 36;
}

/**
 * Function for creation of the boss.
 * Unlike the enemies, it has health.
 */
function Boss(x, y, score, direction) {
	this.x = x;
	this.y = y;
	this.width = 70;
	this.height = 113;
	this.score = score;
	this.direction = direction;
	this.health = 30;
	this.velocity = 2.5;
}