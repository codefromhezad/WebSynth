var Sequencer = (function() {
	
	var audioContext = new (window.AudioContext || window.webkitAudioContext)();

	var $mainContainer = $('.main-sequencer');
	var $tracksContainer = $('.main-sequencer .tracks');
	var $mixerContainer = $('.main-sequencer .mixer');
	var $bpmContainer = $('.main-sequencer .bpm-indicator');
	var $playbackTimerIndicator = $('.main-sequencer .playback-timer');
	var $guidesContainer = $('.main-sequencer .tracks-wrapper .guides')
	var $playbackNowIndicator = $('.main-sequencer .playback-now-wrapper .playback-now');;

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

		this.notesPerBeatArray;

		this.generateTimeline = function(numBars, beatSpacing) {
			this.beatSpacing = beatSpacing;

			var currentBeat = 1;
			var spacingCss = 'width: '+beatSpacing+'px;';
			var guidesHtml = '';
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

		this.buildNotesPerBeatArray = function() {
			var notesPerBeat = [];

			for(var t in this.tracks) {
				var track = this.tracks[t];

				for(var c in track.midiClips) {
					var midiClip = track.midiClips[c];

					for(var n in midiClip.notes) {
						var note = midiClip.notes[n];
						var start = parseInt(note.start) + parseInt(midiClip.start) - 1;

						if( ! notesPerBeat[start] ) {
							notesPerBeat[start] = [];
						}

						notesPerBeat[start].push({
							note: note,
							track: track
						});
					}
				}
			}

			this.notesPerBeatArray = notesPerBeat;
		}

		// PLAYBACK METHODS
		this.updateTimerUI = function() {
			var floatSecs = this.playbackTimer / 1000;
			var minutes = (floatSecs / 60) << 0;
			var secs = (floatSecs % 60) << 0;
			var millisecs = (this.playbackTimer % 1000) << 0;

			$playbackTimerIndicator.text(numPad(minutes, 2)+':'+numPad(secs, 2)+':'+numPad(millisecs, 3));

			var beatsPerSecond = this.bpm / 60;
			var beatsPerMillisecond = beatsPerSecond / 1000;

			var distLeft = Math.floor(this.beatSpacing * this.playbackTimer * beatsPerMillisecond);

			$playbackNowIndicator.css('left', distLeft+'px');
		}

		this.getCurrentBeat = function() {
			return Math.floor(this.bpm * ((this.playbackTimer / 1000) / 60)) + 1;
		}

		this.millisPerBeat = function() {
			return 1 / ( (this.bpm / 60) / 1000 );
		}

		this.play = function() {
			var thatInPlayback = this;

			this.buildNotesPerBeatArray();
			this.isPlaying = true;

			var lastPlaybackBeat = -1;

			this.playbackInterval = setInterval(function() {
				thatInPlayback.playbackTimer += 100;
				thatInPlayback.updateTimerUI();
				
				var currBeat = thatInPlayback.getCurrentBeat();

				if( currBeat != lastPlaybackBeat ) {

					if( thatInPlayback.notesPerBeatArray[currBeat] ) {
						var items = thatInPlayback.notesPerBeatArray[currBeat];

						for(var i in items) {
							var item = items[i];

							var note = item.note;
							var track = item.track;
							
							if( track.mainInstrument ) {
								track.mainInstrument.noteOnForDuration(note.note, note.duration * thatInPlayback.millisPerBeat());
							}
						}
					}

					lastPlaybackBeat = currBeat;
				}

			}, 100);
		}

		this.pause = function() {
			clearInterval(this.playbackInterval);
			this.updateTimerUI();
			this.isPlaying = false;
		}

		this.stop = function() {
			clearInterval(this.playbackInterval);
			this.playbackTimer = 0;
			this.updateTimerUI();

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