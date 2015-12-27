var Sequencer = (function() {
	
	var audioContext = new (window.AudioContext || window.webkitAudioContext)();

	var $mainContainer = $('.main-sequencer');
	var $tracksContainer = $('.main-sequencer .tracks');
	var $mixerContainer = $('.main-sequencer .mixer');
	var $bpmContainer = $('.main-sequencer .bpm-indicator');

	return function() {

		this.bpm;
		this.tracks = [];
		this.masterTrack;

		this.setBPM = function(bpm) {
			this.bpm = bpm;
			$bpmContainer.text(this.bpm);
		}

		this.addTrack = function(isMaster) {
			var newTrack = new Track();
			newTrack.boot(audioContext);

			if( ! isMaster ) {
				$tracksContainer.append(newTrack.$trackDom);
				newTrack.setTitle("Track " + (this.tracks.length + 1));
				newTrack.connect(this.masterTrack.gainNode);
				this.tracks.push(newTrack);
			} else {
				newTrack.$mixerDom.addClass('master-track');
				newTrack.setTitle("Master");
				newTrack.setAsMaster();
				newTrack.connect(audioContext.destination);
				this.masterTrack = newTrack;
			}
			
			$mixerContainer.append(newTrack.$mixerDom);
		}

		// Boot and create Master Track
		this.setBPM(120);
		this.addTrack(true);
	}
})();