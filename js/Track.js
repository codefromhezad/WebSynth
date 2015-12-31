var Track = function(seq) {
	this.audioContext;
	this.gainNode;
	this.sequencer = seq;

	this.isMaster = false;
	this.title;
	this.volume;

	this.effects = [];
	this.midiClips = [];
	this.mainInstrument = null;

	this.$trackDom = $('<div class="track">' +
						'<div class="left-pane">'+
							'<div class="track-title"></div>'+
						'</div>'+
						'<div class="right-pane">'+
						'</div>'+
					'</div>');

	this.$mixerDom = $('<div class="track">' +
							'<div class="track-title"></div>'+
							'<div class="track-effects">'+
								'<div class="effect-holder"></div>'+
								'<div class="effect-holder"></div>'+
								'<div class="effect-holder"></div>'+
								'<div class="effect-holder"></div>'+
							'</div>'+
							'<div class="track-volume">'+
								'<div class="fader"></div>'+
							'</div>'+
						'</div>');

	this.$volumeFader = this.$mixerDom.find('.track-volume .fader');
	this.$title = this.$trackDom.find('.left-pane .track-title').add(this.$mixerDom.find('.track-title'));
	this.$effectHolders = this.$mixerDom.find('.effect-holder');
	this.$clipsHolder = this.$trackDom.find('.right-pane');

	this.addEffect = function(effect) {
		var fxIndex = this.effects.length;
		var fxHtml = '<span class="effect" data-index="'+fxIndex+'" style="background: '+randomColor()+'">'+
						effect.title+
					 '</span>';

		if( effect.isInstrument ) {
			this.mainInstrument = effect;
		}
		
		this.$effectHolders.eq(fxIndex).html(fxHtml);
		this.effects.push(effect);
	}

	this.addMidiClip = function(start, duration) {
		var clipIndex = this.midiClips.length;
		var newClip = new MidiClip(start, duration);
		newClip.$dom.attr('data-clip-index', clipIndex)
					.css({
						'width': Math.floor(this.sequencer.beatSpacing * duration) + 'px',
						'left' : Math.floor(this.sequencer.beatSpacing * (start-1)) + 'px'
					});

		this.$clipsHolder.append(newClip.$dom);
		this.midiClips.push(newClip);
	}

	this.setVolume = function(value) {
		this.volume = value;
		this.gainNode.gain.value = value;
		var intVolume = Math.floor(this.volume * 100);
		this.$volumeFader.slider('value', intVolume);
	}

	this.setTitle = function(title) {
		this.title = title;
		this.$title.text(title);
	}

	this.setAsMaster = function() {
		this.isMaster = true;
	}

	this.connect = function(dest) {
		this.gainNode.connect(dest);
	}

	this.boot = function(audioContext) {

		// Init Tracks's gain node
		this.audioContext = audioContext;
		this.gainNode = this.audioContext.createGain();

		var that = this;

		// Bind Volume slider
		this.$volumeFader.slider({
			min: 0,
			max: 100,
			orientation: "vertical",

			slide: function(event, ui) {
				that.volume = ui.value / 100;
				that.gainNode.gain.value = that.volume;
			},
			start: function(event, ui) {
				if( that.isMaster )
					return;

				that.effects[0].noteOn('C4');
				setTimeout(function() {
	                that.effects[0].noteOff('C4');
	            }, 500);
			}
		});

		// Bind effect adder / editor
		this.$effectHolders.on('click', function(e) {
			e.preventDefault();

			if( ! $(this).hasClass('has-effect') ) {
				// TODO: Dialog to select Synth / Effect among a list
				var mySynth = new SynthBase(that.audioContext, that.gainNode);

				that.addEffect(mySynth);
				$(this).addClass('has-effect');
			} else {
				// TODO: Effect/Synth editor
				console.error('Not implemented yet')
			}
			
			return false;
		})

		// init base values
		this.setVolume(0.8);
		this.setTitle('New track');

	}
}