$("#player").load("./templates/characters/mario-standing.html")
//$("#player2").load("./templates/characters/luigi-standing.html")
var player = document.getElementById("player");

$(document.body).on('keydown', function(e) {
	switch (e.which) {
		case 37:
			console.log('left arrow key pressed!');
			//player.css("left","100px");
			break;
		case 39:
			console.log('right arrow key pressed!');
			break;
		case 32:
			playAudio("jump-sound");
			jump("mario");
			break;
		case 16:
			console.log("shift pressed");
			break;
	}
});

function playAudio(className) {
	document.getElementById(className).play();
}

function jump(characterName) {
	$("#player").load("./templates/characters/" + characterName + "-jumping.html");
	window.setTimeout(function() {
		$("#player").load("./templates/characters/" + characterName + "-standing.html")
	}, 350);
}