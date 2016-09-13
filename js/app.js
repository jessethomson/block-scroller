(function() {

	var gameWidth = window.innerWidth;// || document.documentElement.clientWidth;
	var gameHeight = window.innerHeight;// || document.documentElement.clientHeight;

	var playerName = "mario";
	var jumping, dying, game, nextEnemyId, playing;
	var enemyOptions = ["goomba","ghost","enemy"];
	var backgroundOptions = [""];
	var enemies = [];
	var messages = [];
	var backgroundObjects = [];

	function startGame() {
		
		stopGame();
		playAudio("theme-song");

		nextEnemyId = 0;
		nextMessageId = 0;

		$("#floor").css("top", gameHeight/4 * 3);
		$("#floor").css("height", gameHeight/5);
		$("#floor").css("width", gameWidth/100 * 99);
		loadPlayer(playerName);
		
		playing = true;

		var gameSpeed = 30;
		var counter = 0;
		var frequency = 1500;

		window.setTimeout(function(){
			game = window.setInterval(function() {
				if(!dying && playing) {
					// update
					for(var i=0; i<enemies.length; i++) {
						var enemyName = enemies[i];
						shift($("#" + enemyName), -9);
						var deadMan = collision(playerName, enemyName);
						if(deadMan) {
							if(deadMan === playerName) {
								playerDie(playerName);
								clearInterval(game);
							}
							else {
								removeEnemy(enemyName);
								enemyDie(enemyName);
								break;
							}
						}
					}
					// generate enemies
					if(counter > frequency / gameSpeed) {
						var enemyIndex = Math.floor(Math.random() * enemyOptions.length);
						loadEnemy(enemyOptions[enemyIndex]);
						frequency = (Math.floor(Math.random() * 3) + 1) * 1500;
				        counter = 0;
				    }
				    counter++;
				    // generate background objects
				    if(counter > frequency / gameSpeed) {

				    }
				}
			}, gameSpeed);
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
			var topOverlap = r1.bottom - r2.top;
			var sideOverlap = r1.right - r2.left;
			if(topOverlap > sideOverlap) {
				return name1;
			}
			else {
				return name2;
			}
		}
		return null;
	}

	function changePlayerTemplate(playerName, suffix = "", callback) {
		$("#" + playerName).load("./templates/players/" + playerName + suffix + ".html", callback)
	}

	function changeEnemyTemplate(enemyName, suffix = "", callback) {
		$("#" + enemyName).load("./templates/enemies/" + enemyName + suffix + ".html", callback)
	}

	function loadMessage(messageName) {
		var message = $("<div class='moveable'" + "id=" + messageName + "-" + nextMessageId + ">").load("./templates/messages/" + messageName + ".html", function() {
			$("#game").append(message);
			messages.push(messageName + "-" + nextMessageId++);

			var data = message.find("#" + messageName);
			message.attr("width", data.attr("width"));
			message.attr("height", data.attr("height"));

			message.css("left", gameWidth/2  - parseInt(message.attr("width"))/2);
			message.css("top", gameHeight/4 - parseInt(message.attr("height"))/2);
		});
	}

	function loadBackgroundObject(backgroundName) {

		var backgroundObject = $("<div class='moveable'" + "id=" + backgroundName + "-" + nextBackgroundId + ">").load("./templates/" + backgroundName + ".html", function() {
			$("#game").append(backgroundObject);
			backgroundObjects.push(backgroundName + "-" + nextBackgroundId++);

			var data = backgroundObject.find("#" + backgroundName);
			backgroundObject.attr("width", data.attr("width"));
			backgroundObject.attr("height", data.attr("height"));

			backgroundObject.css("left", gameWidth/8 * 7);
			backgroundObject.css("top", (gameHeight/4 * 3) - parseInt(backgroundObject.attr("height")));
		});
	}

	function loadPlayer(playerName) {

		var player = $("<div class='moveable'" + "id=" + playerName + ">").load("./templates/players/" + playerName + ".html", function() {
			$("#game").append(player);

			var data = player.find("#" + playerName);
			player.attr("width", data.attr("width"));
			player.attr("height", data.attr("height"));

			player.css("left", gameWidth/8);
			player.css("top", (gameHeight/4 * 3) - parseInt(player.attr("height")));
		});
	}

	function loadEnemy(enemyName) {

		var enemy = $("<div class='moveable'" + "id=" + enemyName + "-" + nextEnemyId + ">").load("./templates/enemies/" + enemyName + ".html", function() {
			$("#game").append(enemy);
			enemies.push(enemyName + "-" + nextEnemyId++);

			var data = enemy.find("#" + enemyName);
			enemy.attr("width", data.attr("width"));
			enemy.attr("height", data.attr("height"));

			enemy.css("left", gameWidth/8 * 7);
			enemy.css("top", (gameHeight/4 * 3) -  parseInt(enemy.attr("height")));
		});
	}

	function stopGame() {
		stopAudio("theme-song");
		// remove enemies
		for(var i=0; i<enemies.length; i++) {
			$("#" + enemies[i]).remove();
		}
		// remove messages
		for(var i=0; i<messages.length; i++) {
			console.log(messages[i]);
			$("#" + messages[i]).remove();
		}
		enemies = [];
		clearInterval(game);
	}

	$(document.body).on('keydown', function(e) {
		switch (e.which) {
			case 37: // 'left arrow' pressed 
				//shift(player, -8);
				break;
			case 39: // 'right arrow' pressed
				//shift(player, 8);
				break;
			case 32: // 'space bar' pressed
				if(!playing) {
					startGame();
				}
				else if(!jumping && !dying) {
					jump(playerName);
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

	function playAudio(audioId) {
		document.getElementById(audioId).play();
	}

	function stopAudio(audioId) {
		var sound = document.getElementById(audioId);
		sound.pause();
		sound.currentTime = 0;
	}

	function jump(characterName) {

		var player = $("#" + characterName);

		jumping = true;
		var jumpHeight = 250;
		var jumpSpeed = 75;
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

	function playerDie(playerName) {
		dying = true;
		stopAudio("theme-song");
		playAudio("player-death");
		changePlayerTemplate(playerName.split('-', 1)[0], "-dead");
		die(playerName, function() {
			dying = false;
			playing = false;
			loadMessage("gameover");
		});
	}

	function enemyDie(enemyName) {
		playAudio("stomp");
		changeEnemyTemplate(enemyName.split('-', 1)[0], "-dead");
		die(enemyName);
	}

	function die(characterName, callback) {

		if(!callback) {
			callback = function() {};
		}

		var player = $("#" + characterName);

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
					callback();
				}
				top = parseFloat(player.css("top"));
			}, 30);
		}, upDuration * 2);

	}

	function removeEnemy(enemyName) {
		var index = enemies.indexOf(enemyName);
		if(index > -1) {
			enemies.splice(index, 1);
		}
	}

	function shift(element, amount) {
		var currentLeft = parseFloat(element.css("left"));
		if(currentLeft + amount + parseFloat(element.attr("width")) >= 0 && currentLeft + amount <= gameWidth) {
		 	element.css("left", parseFloat(element.css("left")) + amount);
		}
		else {
			removeEnemy(element.attr("id"));
			element.remove();
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