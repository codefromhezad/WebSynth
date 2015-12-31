var randomColor = function() {
	return '#'+Math.floor(Math.random()*16777215).toString(16);
}

var numPad = function(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}