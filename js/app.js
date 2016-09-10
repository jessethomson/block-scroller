(function() {
	var character = "mario";
	var player = $("#player");
	var paused;
	var game;
	var gameWidth = $(window).width();
	var gameHeight = $(window).height();

	var enemies = [];

	function startGame() {
		
		stopGame();
		player.load("./templates/characters/" + character + ".html");
		paused = false;

		window.setTimeout(function(){
			game = window.setInterval(function() {
				if(!paused) {
					// update
					shift(player, 5)
				}
			}, 30)
		}, 1000); // one second pause
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
			playAudio("jump-sound");
			player.load("./templates/characters/" + character + "-jumping.html")
			window.setTimeout(function() {
				player.load("./templates/characters/" + character + ".html")
			}, 350);
		}
	}

	function loadPlayer(character) {
		player.load("./templates/characters/" + character + ".html");
		var width = player.children();
		console.log(width);
	}

	function shift(element, amount) {
		element.css("left", parseFloat(element.css("left")) + amount);
	}

	startGame();
}());