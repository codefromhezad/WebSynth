var Sequencer = (function() {
	
	var $mainContainer = $('.main-sequencer');
	var $tracksContainer = $('.main-sequencer .tracks');
	var $mixerContainer = $('.main-sequencer .mixer');
	var $bpmContainer = $('.main-sequencer .bpm-indicator');

	return function() {

		this.bpm;
		this.tracks = [];

		this.setBPM = function(bpm) {
			this.bpm = bpm;
			$bpmContainer.text(this.bpm);
		}

		this.addTrack = function() {
			var newTrack = new Track();
			newTrack.boot();

			$tracksContainer.append(newTrack.$trackDom);
			$mixerContainer.append(newTrack.$mixerDom);

			newTrack.setTitle("Track " + (this.tracks.length + 1));
			this.tracks.push(newTrack);
		}

		// Boot
		this.setBPM(120);
	}
})();