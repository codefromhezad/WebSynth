var Sequencer = (function() {
	
	var $mainContainer = $('.main-sequencer');
	var $tracksContainer = $('.main-sequencer .tracks');
	var $mixerContainer = $('.main-sequencer .mixer');

	return function() {
		this.tracks = [];

		this.addTrack = function() {
			var newTrack = new Track();
			newTrack.boot();

			$tracksContainer.append(newTrack.$trackDom);
			$mixerContainer.append(newTrack.$mixerDom);

			this.tracks.push(newTrack);
		}
	}
})();