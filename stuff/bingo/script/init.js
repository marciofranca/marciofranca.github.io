(function($){
	$(function(){

		var board = new Bingo_Board();
		board.startNewGame();

	});
})(jQuery);

var Bingo_Board = (function(){

	function startNewGame(){
		console.debug("0222");
	}

	return{
		startNewGame: startNewGame
	}
});

var Bingo_BoardUI = (function(options){
	options = options || {};

	function init(){
		
	}

	init();

	return{
		init: init
	}
})