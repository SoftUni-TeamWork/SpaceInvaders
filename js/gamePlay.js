/**
 * <h1>Object Play</h1>
 * This objects holds the most of the game-play functionality.
 * It is initialized once, but it's methods ( Draw and Update )
 * can be called from "gameCore.js:104,107" on every 20ms
 * depending on the game state.
 *
 * @author Vasil Tsintsev
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



    // Създаваме нов обект от тип - кораб. Позиционираме го в долната част на екрана.
    game.ship = new Ship(game.width / 2, game.borders.bottom);

    /* 
     * нов обект тип враг
     */

    game.enemies.push(new Enemy((Math.random() * 100), 10, 70, 10));
    game.lastEnemyAppear = (new Date()).valueOf();

    var enemyImg = new Image();
    enemyImg.src = './images/Enemy2.png';

    var ourShipImg = new Image();
    ourShipImg.src = './images/Ship2.png';

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
    this.draw = function(game, dt, ctx) {


	    // Clean all
	    ctx.clearRect(0, 0, game.width, game.height);


	    /*
	     * Game background
	     */

        ctx.drawImage(background, 0, 0);
        ctx.fillStyle = '#555555';


	    /*
	     * Here we Draw all the player's info
	     */

	    var textYposition = game.borders.top + 10;
	    ctx.font="14px Arial";
	    ctx.fillStyle = '#ffffff';
	    var info = "Животи: " + game.currentLives+" , Състояние на кораба / Health: "+ game.playerShipHealth;
	    ctx.textAlign = "left";
	    ctx.fillText(info, game.borders.left, textYposition);
	    info = "Точки: " + game.playerScore + ", Ниво: " + game.currentLevel;
	    ctx.textAlign = "right";
	    ctx.fillText(info, game.borders.right, textYposition);


        ctx.drawImage(ourShipImg, game.ship.x - (game.ship.width / 2), game.ship.y - (game.ship.height / 2), game.ship.width, game.ship.height);
        ctx.fillStyle = '#ff0000';
        for (var i = 0; i < game.bullets.length; i++) {
            var bullet = game.bullets[i];
            ctx.fillRect(bullet.x, bullet.y - 2, 2, 6);
        }

        for (var j = 0; j < game.enemies.length; j++) {
            var enemy = game.enemies[j];
            ctx.drawImage(enemyImg,enemy.x,enemy.y,enemy.width,enemy.height);
        }

    };


    /*
     * Този метод променя позицията на кораба и патроните, като се рефрешва на около 50ms.
     */
    this.update = function(game, dt) {

        if (game.pressedKeys[37]) { // Натисната е стрелка наляво - местим кораба наляво
            game.ship.x -= ( game.shipMoveSpeed + (game.currentLevel / 2) );
        }
        if (game.pressedKeys[39]) {
            game.ship.x += ( game.shipMoveSpeed + (game.currentLevel / 2) ); // Натисната е стрелка надясно - местим кораба
        }

        // Ако сме стигнали края на игралното поле - спираме да местим кораба
        if(game.ship.x < game.borders.left)game.ship.x=game.borders.left;
        if(game.ship.x > game.borders.right)game.ship.x=game.borders.right;

        /* Преместваме всеки от изстреляните патрони по вертикала - нагоре. 
         * Ако е достигната най-горна точка - изтриваме патрона.
         */


        for (i = 0; i < game.bullets.length; i++) {
            var bullet = game.bullets[i];
            bullet.y -= game.bulletSpeed;

            if (bullet.y < 5)
                game.bullets.splice(i--, 1);
        }

        for (var j = 0; j < game.enemies.length; j++) {
            var enemy = game.enemies[j];
            enemy.y += (game.enemiesFallingSpeed + (game.currentLevel ));


	        /**
	         * Ships health is decreasing on ship/enemy collisions
	         */

	        if(
		        (enemy.x + enemy.width) > (game.ship.x - game.ship.width/2) &&
		        (enemy.x) < (game.ship.x + game.ship.width/2.3) &&
			    (enemy.y + (enemy.height + 7)) >= game.ship.y ) {
		        game.playerShipHealth--;
		        game.enemies.splice(j--,1);

	        }else{

		        /**
		         * Remove the enemy's ship if reach the bottom's border of the game.
		         */

		        if (enemy.y >= game.borders.bottom) {
			        game.enemies.splice(j--, 1);
					game.playerShipHealth--; //If the player haven't destroyed the enemy on time, his health is decreasing
		        }

	        }


	        /**
	         * This feature destroys the enemy
	         */

	        var boom = false;

	        for(var i=0; i<game.bullets.length; i++){
		        var bullet = game.bullets[i];

		        if((bullet.x >= enemy.x) && (bullet.x <= (enemy.x + enemy.width) ) && (bullet.y <= (enemy.y + (enemy.height - 20) )) ){

			        game.bullets.splice(i--,1);
			        boom = true;
			        game.playerScore++;
			        break;
		        }
	        }
	        if(boom == true)game.enemies.splice(j--,1);


        }



        if (((new Date()).valueOf() - game.lastEnemyAppear) > 2000) {
            this.newEnemy();
        }


        if (game.playerScore > game.riseLevelOnScore) {
	        game.playerScore=0;
	        game.currentLevel++;
        }

        if (game.currentLevel > 4) {
            //Call the boss
        }

        if (game.currentLives < 1) {
            //End game
        }


        for(var i=0; i<game.enemies.length; i++) {
		   // var enemy = game.enemies[i];

	    }

    };


    /*
     * Този метод слухти за натиснат "Space", ако го улови - изстрелва патрон.
     */
    this.keyDown = function(game, keyCode) {
        if (keyCode == 32)
            this.fireRocket();
    };

    /*
     * С този метод се симулира изстрелването на патрон. Като първо се проверява дали в рамките
     * на последните 200ms не е изстрелят вече един, ако не е - се създава нов обект - патрон
     * и се ъпдейтва таймера.
     */
    this.fireRocket = function() {
        if (game.lastShootTime === null || ((new Date()).valueOf() - game.lastShootTime) > 200) {
            game.bullets.push(new Bullet(game.ship.x, game.ship.y - 12, 150));
            game.lastShootTime = (new Date()).valueOf();
        }
    };

    /* с този метод се извиква и създава нова ГАД!
     */
    this.newEnemy = function() {
        var newX = Math.random() * 750;
        game.enemies.push(new Enemy(newX, 20, (game.currentLevel * 50), (game.currentLevel * 10)));
        game.lastEnemyAppear = (new Date()).valueOf();

    };
}

/*
 * Функция за дефиниране на кораба
 * Очаква параметри "x" и "y", който определят началната позиция
 * на кораба, също има и допълнителни настройки за размери.
 */
function Ship(x, y) {
    this.x = x;
    this.y = y;
    this.width = 45;
    this.height = 43;
}

/*
 * Функция за създаване на патрони
 * Това са патроните, които се изстрелват от кораба, имат позиция
 * както и скорост на движение
 */
function Bullet(x, y, velocity) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
}

function Enemy(x, y, velocity, score) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
	this.width = 29;
	this.height = 36;
    this.score = score; // different enemy will bring different score
}