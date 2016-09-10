(function() {
	var gameWidth = $(window).width();
	var gameHeight = $(window).height();
	var character = "mario";
	var player = $("#player");
	var paused;
	var game;

	var enemies = [];

	function startGame() {
		
		stopGame();
		loadPlayer(character);
		paused = false;

		window.setTimeout(function(){
			game = window.setInterval(function() {
				if(!paused) {
					// update
					//shift(player, 5)
				}
			}, 30)
			//kill();
		}, 1000); // one second pause before starting
	}

	function stopGame() {
		player.css("left", gameWidth/8);
		player.css("top", gameHeight/2);
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
				break;
			case 39: // 'right arrow' pressed
				console.log('right arrow key pressed!');
				break;
			case 32: // 'space bar' pressed
				if(paused) {
					paused = false;
				}
				else {
					jump();
				}
				break;
			default: // temporary
				console.log(e.which);
		}
	});

	function playAudio(className) {
		document.getElementById(className).play();
	}

	function jump() {
		if(!paused) {
			var jumpHeight = 160;
			playAudio("jump-sound");
			injectCharacter(character + "-jumping");
			var amount = 10;
			var start = parseFloat(player.css("top"));
			var direction = 1;
			var jumpAction = setInterval(function() {
				var top = parseFloat(player.css("top"));
				if(top < (start - jumpHeight) && direction == 1) {
					direction = -1;
				}
				lift(player, amount*direction);
				if(direction == -1 && top == start) {
					injectCharacter(character);
					clearInterval(jumpAction);
				}

			}, 25);

		}
	}

	function kill() {
		//injectCharacter(deadMan)
		var upDuration = 250;
		var goUp = window.setInterval(function() {
			lift(player, -10);
		}, 30);
		window.setTimeout(function() {
			clearInterval(goUp);
		}, upDuration)

		window.setTimeout(function() {
			var top = parseFloat(player.css("top"));
			var goDown = window.setInterval(function() {
				if(top <= gameHeight) {
					lift(player, 10);
				}
				else {
					clearInterval(goDown);
				}
				top = parseFloat(player.css("top"));
			}, 30);
		}, upDuration + 100);
	}

	function injectCharacter(fileName, callback) {
		player.load("./templates/characters/" + fileName + ".html", callback)
	}

	function loadPlayer(character) {
		injectCharacter(character, function() {
			// inject width and height into parent
			var data = player.find("#" + character);
			player.attr("width", data.attr("width"));
			player.attr("height", data.attr("height"));
		})
	}

	function shift(element, amount) {
		element.css("left", parseFloat(element.css("left")) + amount);
	}

	function lift(element, amount) {
		element.css("top", parseFloat(element.css("top")) + -1*amount)
	}

	startGame();
}());