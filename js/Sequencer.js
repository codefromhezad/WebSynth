var Sequencer = (function() {
	
	var audioContext = new (window.AudioContext || window.webkitAudioContext)();

	var $mainContainer = $('.main-sequencer');
	var $tracksContainer = $('.main-sequencer .tracks');
	var $mixerContainer = $('.main-sequencer .mixer');
	var $bpmContainer = $('.main-sequencer .bpm-indicator');
	var $playbackTimerIndicator = $('.main-sequencer .playback-timer');
	var $guidesContainer = $('.main-sequencer .tracks-wrapper .guides')

	return function() {

		this.bpm;
		this.tracks = [];
		this.masterTrack;
		this.beatSpacing;

		this.activeTrackIndex;
		this.activeTrack;

		this.isPlaying = false;
		this.playbackTimer = 0;
		this.playbackInterval;

		this.generateTimeline = function(numBars, beatSpacing) {
			this.beatSpacing = beatSpacing;

			var currentBeat = 1;
			var spacingCss = 'width: '+beatSpacing+'px;';
			var guidesHtml = '<div class="playback-now"></div>';
			for(var bar=0; bar < numBars; bar++) {
				for(var beat=0; beat < 4; beat++) {
					if( beat == 0 ) {
						guidesHtml += '<div data-bar="'+(bar+1)+'" data-beat="'+currentBeat+'" data-inner-beat="'+(beat+1)+'" class="beat bar" style="'+spacingCss+'"></div>';
					} else {
						guidesHtml += '<div data-bar="'+(bar+1)+'" data-beat="'+currentBeat+'" data-inner-beat="'+(beat+1)+'" class="beat" style="'+spacingCss+'"></div>';
					}
					currentBeat ++;
				}
			}

			$guidesContainer.html(guidesHtml);
		}

		this.setBPM = function(bpm) {
			this.bpm = bpm;
			$bpmContainer.text(this.bpm);
		}

		this.selectTrack = function(index) {
			$('.main-sequencer .tracks .track').removeClass('active');
			this.tracks[index].$trackDom.addClass('active');
			this.activeTrack = this.tracks[index];
			this.activeTrackIndex = index;
		}

		this.addTrack = function(isMaster) {
			var newTrack = new Track(this);
			newTrack.boot(audioContext);

			if( ! isMaster ) {
				newTrack.$trackDom.attr('data-track-index', this.tracks.length);
				$tracksContainer.append(newTrack.$trackDom);
				newTrack.setTitle("Track " + (this.tracks.length + 1));
				newTrack.connect(this.masterTrack.gainNode);
				this.tracks.push(newTrack);

				this.selectTrack(this.tracks.length - 1);
			} else {
				newTrack.$mixerDom.addClass('master-track');
				newTrack.setTitle("Master");
				newTrack.setAsMaster();
				newTrack.connect(audioContext.destination);
				this.masterTrack = newTrack;
			}
			
			$mixerContainer.append(newTrack.$mixerDom);
		}

		// PLAYBACK METHODS
		this.play = function() {
			var thatInPlayback = this;

			var $playbackNowIndicator = $('.main-sequencer .guides .playback-now');

			this.isPlaying = true;

			this.playbackInterval = setInterval(function() {
				thatInPlayback.playbackTimer += 100;

				var floatSecs = thatInPlayback.playbackTimer / 1000;
				var minutes = (floatSecs / 60) << 0;
				var secs = (floatSecs % 60) << 0;
				var millisecs = (thatInPlayback.playbackTimer % 1000) << 0;

				$playbackTimerIndicator.text(numPad(minutes, 2)+':'+numPad(secs, 2)+':'+numPad(millisecs, 3));
				
				var beatsPerSecond = thatInPlayback.bpm / 60;
				var beatsPerMillisecond = beatsPerSecond / 1000;

				var distLeft = Math.floor(thatInPlayback.beatSpacing * thatInPlayback.playbackTimer * beatsPerMillisecond);

				$playbackNowIndicator.css('left', distLeft+'px');
			}, 100);
		}

		this.pause = function() {
			clearInterval(this.playbackInterval);
			this.isPlaying = false;
		}

		this.stop = function() {
			var $playbackNowIndicator = $('.main-sequencer .guides .playback-now');
			clearInterval(this.playbackInterval);
			this.playbackTimer = 0;
			$playbackTimerIndicator.text('00:00:000');
			$playbackNowIndicator.css('left', '0px');
			this.isPlaying = false;
		}


		// UI Listeners
		var thatSeq = this;
		$('.main-sequencer').on('click', '.playback-bar .play-pause', function(e) {
	        // Play/pause playback
	        e.preventDefault();

	        var $this = $(this);

	        if( ! thatSeq.isPlaying ) {
	            $this.text('Pause');
	            thatSeq.play();
	        } else {
	            $this.text('Play');
	            thatSeq.pause();
	        }

	        return false;
	    });

	    $('.main-sequencer').on('click', '.playback-bar .stop', function(e) {
	        // Stop playback
	        e.preventDefault();

	        $('.main-sequencer .playback-bar .play-pause').text('Play');

	        thatSeq.stop();

	        return false;
	    });


		// Boot and create Master Track
		this.setBPM(120);
		this.addTrack(true);
		this.generateTimeline(16, 16);
	}
})();