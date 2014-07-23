/*
 * Тук създаваме обект Play
 */

function Play() {

    //бекграунд на играта
    var background = new Image();
    background.onload = function() {};
    background.src = "./images/Background.png";
    
    // Създаваме нов обект от тип - кораб. Позиционираме го в долната част на екрана.
    game.ship = new Ship(game.width / 2, game.borders.bottom);

    /* 
     * нов обект тип враг
     */

    game.enemies.push(new Enemy((Math.random() * 100), 10, 70, 10));
    game.lastEnemyAppear = (new Date()).valueOf();

	var enemyImg=new Image(33,42);
	enemyImg.onload=function (){};
	enemyImg.src='./images/Enemy1.png';

    /*
     * Този метод изчиства игралното поле, оцветява кораба и патроните.
     */
    this.draw = function(game, dt, ctx) {

        ctx.clearRect(0, 0, game.width, game.height);
        ctx.drawImage(background, 0, 0);
        ctx.fillStyle = '#555555';
        ctx.fillRect(game.ship.x - (game.ship.width / 2), game.ship.y - (game.ship.height / 2), game.ship.width, game.ship.height);

        ctx.fillStyle = '#ff0000';
        for (var i = 0; i < game.bullets.length; i++) {
            var bullet = game.bullets[i];
            ctx.fillRect(bullet.x, bullet.y - 2, 2, 6);
        }
        
        for(var j=0;j<game.enemies.length;j++){
            var enemy=game.enemies[j];
	        ctx.drawImage(enemyImg,enemy.x,enemy.y);
            enemyImg.onload();
        }

    };


    /*
     * Този метод променя позицията на кораба и патроните, като се рефрешва на около 50ms.
     */
    this.update = function(game, dt) {

        if (game.pressedKeys[37]) { // Натисната е стрелка наляво - местим кораба наляво
            game.ship.x -= 200 * dt;
        }
        if (game.pressedKeys[39]) {
            game.ship.x += 200 * dt; // Натисната е стрелка надясно - местим кораба
        }

        // Ако сме стигнали края на игралното поле - спираме да местим кораба
        if (game.ship.x < game.borders.left) {
            game.ship.x = game.borders.left;
        }
        if (game.ship.x > game.borders.right) {
            game.ship.x = game.borders.right;
        }

        /* Преместваме всеки от изстреляните патрони по вертикала - нагоре. 
         * Ако е достигната най-горна точка - изтриваме патрона.
         */


        for (i = 0; i < game.bullets.length; i++) {
            var bullet = game.bullets[i];
            bullet.y -= dt * bullet.velocity;

            if (bullet.y < 5)
                game.bullets.splice(i--, 1);
        }
        
        for (var j = 0; j < game.enemies.length; j++) {
            var enemy = game.enemies[j];
            enemy.y += Math.round(dt * enemy.velocity);
            if (enemy.y >= game.borders.bottom) {
                game.enemies.splice(j--, 1);
            }
        }
        if(((new Date()).valueOf() - game.lastEnemyAppear) > 2000){
            this.newEnemy();
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
        if (game.lastShootTime === null || ((new Date()).valueOf() - game.lastShootTime) > 200)
        {
            game.bullets.push(new Bullet(game.ship.x, game.ship.y - 12, 150));
            game.lastShootTime = (new Date()).valueOf();
        }
    };

/* с този метод се извиква и създава нова ГАД!
*/
    this.newEnemy= function() {
            var newX=Math.random()*750;
            game.enemies.push(new Enemy(newX, 20, 50, 10));
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
    this.width = 20;
    this.height = 16;
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
    this.score = score; // different enemy will bring different score
    this.isHitted = false;
}