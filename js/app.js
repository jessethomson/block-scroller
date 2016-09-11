(function() {
	var gameWidth = $(window).width();
	var gameHeight = $(window).height();
	var gameDiv = $("#game");
	var characterName = "mario";
	// var player = $("#player");
	var jumping = false
	var dying = false;
	var paused;
	var game;

	var enemies = [];

	function startGame() {
		
		stopGame();
		loadPlayer(characterName);
		loadEnemy("goomba");
		
		paused = false;
		dying = false;

		window.setTimeout(function(){
			game = window.setInterval(function() {
				if(!paused) {
					// update
					for(var i=0; i<enemies.length; i++) {
						shift($("#" + enemies[i]), -8);
						if(collision(characterName, enemies[i])) {
							die(characterName);
							clearInterval(game);
						}
						console.log(collision(characterName, enemies[i]));
					}
				}
			}, 30);
		}, 1000); // one second pause before starting
	}

	function collision(name1, name2) {

		var thing1 = $("#" + name1);
		var thing2 = $("#" + name2);
		if(!thing1.length || !thing2.length) {
			return false;
		}

		var r1 = {
			top: parseInt(thing1.css("top")),
			bottom: parseInt(thing1.css("top")) + parseInt(thing1.attr("height")),
			left: parseInt(thing1.css("left")),
			right: parseInt(thing1.css("left")) + parseInt(thing1.attr("width"))
		};

		var r2 = {
			top: parseInt(thing2.css("top")),
			bottom: parseInt(thing2.css("top")) + parseInt(thing2.attr("height")),
			left: parseInt(thing2.css("left")),
			right: parseInt(thing2.css("left")) + parseInt(thing2.attr("width"))
		};


		var result = !(r2.left > r1.right ||
			r1.left > r2.right ||
			r2.top > r1.bottom ||
			r1.top > r2.bottom);

		if(result) {
			console.log("top: " + r2.top);
			console.log("bottom: " + r2.bottom);
			console.log("left: " + r2.left);
			console.log("right: " + r2.right);
		}
		return result;
	}

	function changePlayerTemplate(characterName, suffix = "", callback) {
		$("#" + characterName).load("./templates/characters/" + characterName + suffix + ".html", callback)
	}

	function changeEnemyTemplate(enemyName, suffix = "", callback) {
		$("#" + enemyName).load("./templates/enemies/" + enemyName + suffix + ".html", callback)
	}

	function loadPlayer(characterName) {

		var player = $("<div class='moveable'" + "id=" + characterName + ">").load("./templates/characters/" + characterName + ".html", function() {
			gameDiv.append(player);

			player.css("left", gameWidth/8);
			player.css("top", gameHeight/4 * 3);

			var data = player.find("#" + characterName);
			player.attr("width", data.attr("width"));
			player.attr("height", data.attr("height"));
		});
	}

	function loadEnemy(enemyName) {

		var enemy = $("<div class='moveable'" + "id=" + enemyName + ">").load("./templates/enemies/" + enemyName + ".html", function() {
			gameDiv.append(enemy);
			enemies.push(enemyName);

			enemy.css("left", gameWidth - gameWidth/8);
			enemy.css("top", gameHeight/4 * 3);

			var data = enemy.find("#" + enemyName);
			enemy.attr("width", data.attr("width"));
			enemy.attr("height", data.attr("height"));
		});
	}

	function stopGame() {
		clearInterval(game);
	}

	$(document.body).on('keydown', function(e) {
		switch (e.which) {
			case 80: // 'p' pressed
				paused = true;
				break;
			case 81: // 'q' pressed
				stopGame();
				break;
			case 83: // 's' pressed
				startGame();
				break;
			case 37: // 'left arrow' pressed 
				console.log('left arrow key pressed!');
				//shift(player, -8);
				die("mario");
				break;
			case 39: // 'right arrow' pressed
				console.log('right arrow key pressed!');
				//shift(player, 8);
				break;
			case 32: // 'space bar' pressed
				if(paused) {
					paused = false;
				}
				else if(!jumping) {
					jump(characterName);
				}
				break;
			case 38: // 'up arrow' pressed
				lift(player, -8);
				break;
			case 40: // 'down arrow' pressed
				lift(player, 8);
				break;
			default: // temporary
				console.log(e.which);
		}
	});

	function playAudio(className) {
		document.getElementById(className).play();
	}

	function jump(characterName) {

		var player = $("#" + characterName);

		jumping = true;
		var jumpHeight = 250;
		var jumpSpeed = 80;
		playAudio("jump-sound");
		changePlayerTemplate(characterName, "-jumping");
		var amount = jumpHeight/10;
		var start = parseFloat(player.css("top"));
		var direction = -1;
		var jumpAction = setInterval(function() {
			if(dying) {
				clearInterval(jumpAction);
			}
			else {
				var top = parseFloat(player.css("top"));
				if(top <= (start - jumpHeight) && direction == -1) {
					direction = 1;
				}
				if(direction == 1 && top == start) {
					changePlayerTemplate(characterName);
					jumping = false;
					clearInterval(jumpAction);
				}
				else {
					lift(player, amount*direction);
				}
			}
		}, jumpSpeed);
	}

	function die(characterName) {
		dying = true;
		playAudio("player-death");
		var player = $("#" + characterName);

		changePlayerTemplate(characterName, "-dead");
		var upDuration = 250;
		var goUp = window.setInterval(function() {
			lift(player, -10);
		}, 25);
		window.setTimeout(function() {
			clearInterval(goUp);
		}, upDuration)

		window.setTimeout(function() {
			var top = parseFloat(player.css("top"));
			var dieScene = window.setInterval(function() {
				if(top < gameHeight) {
					lift(player, 10);
				}
				else {
					$("#" + characterName).remove();
					clearInterval(dieScene);
				}
				top = parseFloat(player.css("top"));
			}, 30);
		}, upDuration * 2);

	}

	function shift(element, amount) {
		var currentLeft = parseFloat(element.css("left"));
		if(currentLeft + amount + parseFloat(element.attr("width")) >= 0 && currentLeft + amount <= gameWidth) {
		 	element.css("left", parseFloat(element.css("left")) + amount);
		}
		else {
			var index = enemies.indexOf(element.attr("id"));
			if(index > -1) {
				enemies.splice(index, 1);
				element.remove();
			}
		}
	}

	function lift(element, amount) {

		var currentTop = parseInt(element.css("top"));
		if(currentTop + amount + parseInt(element.attr("height")) < 0) {
			amount = currentTop + parseInt(element.attr("height"));
		}
		if(currentTop + amount > gameHeight) {
			amount = gameHeight - currentTop;
		}
		element.css("top", parseFloat(element.css("top")) + amount);
	}

	startGame();
}());