(function($){
	$(function(){



		var app = new Bingo_BoardApp();

		//var board = new Bingo_Board();
		//board.startNewGame();
		// board.playNext();
		// board.playNext();
		// board.playNext();
		// board.playNext();

		// var ui = new Bingo_BoardUI();
		// ui.valueDrawn(null, 10);
		// ui.valueDrawn(null, 20);
		// ui.valueDrawn(null, 30);
		// ui.valueDrawn(null, 40);
		// ui.valueDrawn(null, 50);
		// ui.valueDrawn(null, 60);
		// ui.valueDrawn(null, 70);
		// ui.valueDrawn(null, 11);
		// ui.valueDrawn(null, 21);
		// ui.valueDrawn(null, 31);
		// ui.valueDrawn(null, 41);
		// ui.valueDrawn(null, 51);
		// ui.valueDrawn(null, 61);
		// ui.valueDrawn(null, 71);
		// ui.valueDrawn(null, 12);
		// ui.valueDrawn(null, 22);
		// ui.valueDrawn(null, 32);
		// ui.valueDrawn(null, 42);
		// ui.valueDrawn(null, 52);
		// ui.valueDrawn(null, 62);
		// ui.valueDrawn(null, 72);
		// ui.valueDrawn(null, 13);
		// ui.valueDrawn(null, 23);
		// ui.valueDrawn(null, 33);
		// ui.valueDrawn(null, 43);
		// ui.valueDrawn(null, 53);
		// ui.valueDrawn(null, 63);
		// ui.valueDrawn(null, 73);
		// ui.valueDrawn(null, 14);
		// ui.valueDrawn(null, 24);
		// ui.valueDrawn(null, 34);
		// ui.valueDrawn(null, 44);
		// ui.valueDrawn(null, 54);
		// ui.valueDrawn(null, 64);
		// ui.valueDrawn(null, 74);
		// ui.valueDrawn(null, 15);
		// ui.valueDrawn(null, 25);
		// ui.valueDrawn(null, 35);
		// ui.valueDrawn(null, 45);
		// ui.valueDrawn(null, 55);
		// ui.valueDrawn(null, 65);
		// ui.valueDrawn(null, 75);
		//
		//
		// ui.newGameStarted(null);

	});
})(jQuery);

var Bingo_BoardApp = (function(){
	var board = new Bingo_Board();
	var ui = new Bingo_BoardUI();

	function init(){
		Bingo_EventBus.on("Bingo:newGameStarted", {}, newGameStarted);
		Bingo_EventBus.on("Bingo:valueDrawn", {}, valueDrawn);

		Bingo_EventBus.on("Bingo:startNewGameCalled", {}, startNewGame);
		Bingo_EventBus.on("Bingo:playNextCalled", {}, playNext);

	}

	function startNewGame(){
		board.startNewGame();
	}

	function newGameStarted(event){
		ui.newGameStarted(event);
		console.debug(event.type);
	}

	function playNext(){
		board.playNext();
	}

	function valueDrawn(event, value){
		ui.valueDrawn(event, value);
		console.debug(event.type + "=" + value);
	}

	init();

	return{
		startNewGame: startNewGame,
		playNext: playNext
	}
});

var Bingo_EventBus = (function(){
	function on(eventName, data, fn){
		$(document).on(eventName, data, fn);
	}

	function trigger(eventName, args){
		$(document).trigger(eventName, args);
	}

	return{
		on: on,
		trigger: trigger
	}
})();


var Bingo_Board = (function(){
	var allValues = [];
	var drawnValues = [];
	var notDrawnValues = [];

	function init(){
		for(var i = 1; i <= 75; i++){
			allValues.push(i);
		}
		startNewGame();
	}

	function startNewGame(){
		notDrawnValues = allValues.slice();
		drawnValues = [];

		Bingo_EventBus.trigger("Bingo:newGameStarted");
	}

	function playNext(){
		if(notDrawnValues.length > 0){
			var random = randomInt(0, notDrawnValues.length - 1);
			var drawn = notDrawnValues.splice(random, 1)[0];
			drawnValues.push(drawn);

			Bingo_EventBus.trigger("Bingo:valueDrawn", [drawn]);
		}
	}

	init();

	return{
		startNewGame: startNewGame,
		playNext: playNext
	}
});

var Bingo_BoardUI = (function(options){
	options = options || {};

	var HEADER = "BINGO";

	function init(){
		var tb = $("<table/>");
		tb.appendTo("#bingo-board");

		var count = 1;
		for(var i = 0; i < HEADER.length; i++){
			var tr = $( "<tr/>");
			tr.appendTo(tb);

			$("<td/>", {
				"class": "header",
				text: HEADER.charAt(i)
			}).appendTo(tr);

			for(var j = 1; j <= 15; j++){
				$("<td/>", {
					"class": "value-" + count,
					text: formatValue(count)
				}).appendTo(tr);
				count++;
			}
		}
		$("<div/>").appendTo("#bingo-board");

		$("#bingo-board-startNewGame").click(function(){
			Bingo_EventBus.trigger("Bingo:startNewGameCalled");
		});
		$("#bingo-board-playNext").click(function(){
			Bingo_EventBus.trigger("Bingo:playNextCalled");
		});
	}

	function valueDrawn(event, value){
		$("#bingo-board td").removeClass("last");
		$("#bingo-board span").removeClass("last");
		$("#bingo-board td.value-" + value).addClass("drawn").addClass("last");

		$("<span/>", {
			"class": "last value-" + value,
			text: formatValue(value)
		}).prependTo("#bingo-board div");
		speakValue(value);
	}

	function speakValue(value){
		var comment = Bingo_Value_Comments[value];
		if(comment){
			speak(comment + "!", 0.8);
		}

		speak("Número: ", 1);
		speak(formatValue(value), 1);

		speak(formatValue(value), 0.7);
	}

	function newGameStarted(event){
		$("#bingo-board td").removeClass("drawn").removeClass("last");
		$("#bingo-board div").empty();
	}

	init();

	return {
		valueDrawn: valueDrawn,
		newGameStarted: newGameStarted
	}
});


function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function speak(text, rate){
	var msg = new SpeechSynthesisUtterance(text);
	msg.lang = 'pt-BR';
	msg.rate = rate;
	window.speechSynthesis.speak(msg);
}

function formatValue(number) {
	return (number < 10 ? '0' : '') + number
}



