var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d")
 
window.addEventListener('keydown', function(evt) {onKeyDown(evt); }, false);
window.addEventListener('keyup', function(evt) {onKeyUp(evt); }, false);
 
var startFrameMillis = Date.now();
var endFrameMillis = Date.now();
function getDeltaTime() // Only call this function once per frame
{
        endFrameMillis = startFrameMillis;
        startFrameMillis = Date.now();
        var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
        if (deltaTime > 1) // validate that the delta is within range
        {
            deltaTime = 1;
        }
        return deltaTime;
}
 
var deltaTime = getDeltaTime();
 
var STATE_SPLASH = 0;
var STATE_GAME = 1;
var STATE_GAMEOVER = 2;
 
var gameState = STATE_SPLASH;
 
var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;
 
var grass = document.createElement("img");
grass.src = "spacebackground.png";

var splashbackground = document.createElement("img");
splashbackground.src = "SplashWallpaper.jpg";
 
var ASTEROID_SPEED = 1;
var PLAYER_SPEED = 2;
var PLAYER_TURN_SPEED = 0.05;
var BULLET_SPEED = 6;
var SCORE = 0;
 
var player = {
        image: document.createElement("img"),
        x: SCREEN_WIDTH/2,
        y: SCREEN_HEIGHT/2,
        width: 93,
        height: 80,
        directionX: 0,
        directionY: 0,
        angularDirection: 0,
        rotation: 0,
        isDead: false,
};
 
player.image.src = "ship.png";
 
var asteroids = [];
 
var shoot = false;
var bullets = [];
 
function playerShoot()
{
        var bullet = {
                image: document.createElement("img"),
                x: player.x,
                y: player.y,
                width: 5,
                height: 5,
                velocityX: 0,
                velocityY: 0,
        };
 
        bullet.image.src = "bullet.png";
 
        var velX = 0;
        var velY = 1;
 
        var s = Math.sin(player.rotation);
        var c = Math.cos(player.rotation);
 
        var xVel = (velX * c) - (velY * s);
        var yVel = (velX * s) + (velY * c);
 
        bullet.velocityX = xVel * BULLET_SPEED;
        bullet.velocityY = yVel * BULLET_SPEED;
 
        bullets.push(bullet);
};
 
var KEY_SPACE = 32;
var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;
var KEY_A = 65;
var KEY_S = 83;
var KEY_SHIFT = 16;
 
var shootTimer = 0;
 
function scoreadd()
{
        SCORE += 100;
        return SCORE;

}
 
function onKeyDown(event)
{
        if(event.keyCode == KEY_UP)
        {
                player.directionY = 1;
        }
        if(event.keyCode == KEY_DOWN)
        {
                player.directionY = -1;
        }
        if(event.keyCode == KEY_LEFT)
        {
                player.angularDirection = -1;
        }
        if(event.keyCode == KEY_RIGHT)
        {
                player.angularDirection = 1;
        }
        if(event.keyCode == KEY_A)
        {
                player.directionX = 1;
        }
        if(event.keyCode == KEY_S)
        {
                player.directionX = -1;
        }
        if(event.keyCode == KEY_SPACE && shootTimer <= 0)
        {
                shootTimer += 0.3;
                playerShoot();
                shoot = true;
        }
        if(event.keyCode == KEY_SHIFT)
        {
            gameState = STATE_SPLASH;
        }
}
 
function onKeyUp(event)
{
        if(event.keyCode == KEY_UP)
        {
                player.directionY = 0;
        }
        if(event.keyCode == KEY_DOWN)
        {
                player.directionY = 0;
        }
        if(event.keyCode == KEY_LEFT)
        {
                player.angularDirection = 0;
        }
        if(event.keyCode == KEY_RIGHT)
        {
                player.angularDirection = 0;
        }
        if(event.keyCode == KEY_A)
        {
                player.directionX = 0;
        }
        if(event.keyCode == KEY_S)
        {
                player.directionX = 0;
        }
        if(event.keyCode == KEY_SPACE)
        {
                shoot = false;
        }
}
 
function intersects(x1, y1, w1, h1, x2, y2, w2, h2)
{
        if(y2 + h2 < y1 ||
                x2 + w2 < x1 ||
                x2 > x1 + w1 ||
                y2 > y1 + h1)
        {
                return false;
        }
        return true;
}

var splashTimer = 3;
function runSplash(deltaTime)
{
        splashTimer -= deltaTime;
        if(splashTimer <= 0)
            {
                gameState = STATE_GAME;
                return;
            }

        ctx.drawImage(splashbackground, 0, 0);
        ctx.fillStyle="#0FEBC6"
        ctx.font="24px Arial";
        ctx.fillText("ASTEROIDS!", 250, 160);
        ctx.fillText("By Harvey H-S", 250, 400);
        var asteroid = document.createElement("img");
        asteroid.src = "rock_large.png";
        ctx.drawImage(asteroid, 290, 210);
        }
 
        function runGame(deltaTime)
        {
                ctx.drawImage(grass, 0, 0);
                
                ctx.fillStyle="#FE2EF7";
                ctx.font="24px Arial";
                ctx.fillText(SCORE, 50, 50);
 
                function rand(floor, ceil)
                {
                        return Math.floor( (Math.random()* (ceil-floor)) +floor );
                }
 
                function spawnAsteroid()
                {
                        var type = rand(0, 3);
 
                        var asteroid = {};
 
                        asteroid.image = document.createElement("img");
                        asteroid.image.src = "rock_large.png";
                        asteroid.width = 69;
                        asteroid.height = 75;
 
                        var x = SCREEN_WIDTH/2;
                        var y = SCREEN_HEIGHT/2;
 
                        var dirX = rand(-10,10);
                        var dirY = rand(-10,10);
 
                        var magnitude = (dirX * dirX) + (dirY * dirY);
                        if(magnitude != 0)
                        {
                                var oneOverMag = 1 / Math.sqrt(magnitude);
                                dirX *= oneOverMag;
                                dirY *= oneOverMag;
                        }
                        var movX = dirX * SCREEN_WIDTH;
                        var movY = dirY * SCREEN_HEIGHT;
 
                        asteroid.x = x + movX;
                        asteroid.y = y + movY;
 
                        asteroid.velocityX = -dirX * ASTEROID_SPEED;
                        asteroid.velocityY = -dirY * ASTEROID_SPEED;
 
                        asteroids.push(asteroid);
                }
 
 
                if(shootTimer > 0)
                        shootTimer -= deltaTime;
 
                for(var i=0; i<bullets.length; i++)
                {
                     bullets[i].x += bullets[i].velocityX;
                     bullets[i].y += bullets[i].velocityY;
        
                        if(bullets[i].x < -bullets[i].width ||
                                bullets[i].x > SCREEN_WIDTH    ||
                                bullets[i].y < -bullets[i].height ||
                                bullets[i].y > SCREEN_HEIGHT)
                        {
                                bullets.splice(i, 1);
 
                                break;
                        }
                }
 
                for(var i=0; i<bullets.length; i++)
                {
                        ctx.drawImage(bullets[i].image,
                        bullets[i].x - bullets[i].width/2,
                        bullets[i].y - bullets[i].height/2);
                }
 
                for(var i=0; i<asteroids.length; i++)
                {
                        asteroids[i].x = asteroids[i].x + asteroids[i].velocityX // *deltaTime;
                        asteroids[i].y = asteroids[i].y + asteroids[i].velocityY // *deltaTime;
 
                        //Wrap the asteroid
                        if (asteroids[i].x > SCREEN_WIDTH + asteroids[i].width + 1) {
                                asteroids[i].x = 0 - asteroids[i].width;
                                };
                        if (asteroids[i].x < 0 - asteroids[i].width - 1) {
                                asteroids[i].x = SCREEN_WIDTH + asteroids[i].width;
                                };
                        if (asteroids[i].y > SCREEN_HEIGHT + asteroids[i].height) {
                                asteroids[i].y = 0 - asteroids[i].height;
                                };
                        if (asteroids[i].y < 0 - asteroids[i].height) {
                                asteroids[i].y = SCREEN_HEIGHT + asteroids[i].height;
                                };
 
                        ctx.drawImage(asteroids[i].image, asteroids[i].x, asteroids[i].y);
                }
 
                var spawnTimer = 0;
                spawnTimer -= deltaTime;
                if(asteroids.length < 5)
                {
                if(spawnTimer <= 0)
                {
                        spawnTimer = 3;
                        spawnAsteroid();
                }
                }
 
                for(var i=0; i<asteroids.length; i++)
                {
                        for(var j=0; j<bullets.length; j++)
                        {
                                if(intersects(
                                        bullets[j].x, bullets[j].y,
                                        bullets[j].width, bullets[j].height,
                                asteroids[i].x, asteroids[i].y,
                                asteroids[i].width, asteroids[i].height) == true)
                                {
                                        asteroids.splice(i, 1);
                                        bullets.splice(j, 1);
                                        scoreadd();
                                        ctx.fillStyle="#FE2EF7";
                                        ctx.font="24px Arial";
                                        ctx.fillText(SCORE, 50, 50);
                                        break;
                                }
                        }
                }
 
 
                var s = Math.sin(player.rotation);
                var c = Math.cos(player.rotation);
 
                var xDir = (player.directionX * c) - (player.directionY * s);
                var yDir = (player.directionX * s) + (player.directionY * c);
                var xVel = xDir * PLAYER_SPEED;
                var yVel = yDir * PLAYER_SPEED;
 
                player.x += xVel;
                player.y += yVel;
 
                player.rotation += player.angularDirection * PLAYER_TURN_SPEED;
 
                for(var i = 0; i<asteroids.length; i++)
                {
                        var hit = intersects(player.x, player.y,
                                player.width, player.height,
                                asteroids[i].x, asteroids[i].y,
                                asteroids[i].width, asteroids[i].height);
                        if(hit == true)
                        {
                                gameState = STATE_GAMEOVER;
                                asteroids.splice(i, 1);
                        }
                }
 
 
                ctx.save();
                        ctx.translate(player.x, player.y);
                        ctx.rotate(player.rotation);
                        ctx.scale(0.75,0.75);
                        if(player.isDead == false)
                        {
                        ctx.drawImage(player.image,-player.width/2,-player.height/2);                  
                        }
                ctx.restore();     
        }
 
function runGameOver(deltaTime)
{
    var gradient = ctx.createLinearGradient(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
    gradient.addColorStop(0,"red");
    gradient.addColorStop(1,"grey");
    ctx.fillStyle=gradient
    ctx.fillRect(0,0, canvas.width, canvas.height);

    ctx.fillStyle="#000";
    ctx.font="24px Arial";
    ctx.fillText("GAME OVER", 225, 50);

    var a = "Your Score Was: ";
    var b = SCORE;
    ctx.fillText(a + b, 200, 100);
    ctx.fillText("Refresh (F5) to Restart", 180, canvas.height - 75);
}
 
function run()
{
    ctx.fillStyle = "#ccc";
    ctx.fillRect(0,0, canvas.width, canvas.height);
 
    var deltaTime = getDeltaTime();

        ctx.fillStyle="#FE2EF7";
        ctx.font="24px Arial";
        ctx.fillText(SCORE, 50, 50);
 

        switch(gameState)
        {
                case STATE_SPLASH:
                        runSplash(deltaTime);
                        break;
                case STATE_GAME:
                        runGame(deltaTime);
                        break;
                case STATE_GAMEOVER:
                        runGameOver(deltaTime);
                        break;
        }

        
}



 
 
 
//-------------------- Don't modify anything below here
// This code will set up the framework so that the 'run' function is
// called 60 times per second. We have some options to fall back on
// in case the browser doesn't support our preferred method.
(function() {
 var onEachFrame;
 if (window.requestAnimationFrame) {
 onEachFrame = function(cb) {
 var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
 _cb();
 };
 } else if (window.mozRequestAnimationFrame) {
 onEachFrame = function(cb) {
 var _cb = function() { cb();
window.mozRequestAnimationFrame(_cb); }
 _cb();
 };
 } else {
 onEachFrame = function(cb) {
 setInterval(cb, 1000 / 60);
 }
 }
 
 window.onEachFrame = onEachFrame;
})();
window.onEachFrame(run);