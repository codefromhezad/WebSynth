var Track = function() {
	this.title;
	this.volume;
	this.effects = [];
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

	this.addEffect = function(effect) {
		this.effects.push(effect);
	}

	this.setVolume = function(value) {
		this.volume = value;
		var intVolume = Math.floor(this.volume * 100);
		this.$volumeFader.slider('value', intVolume);
	}

	this.setTitle = function(title) {
		this.title = title;
		this.$title.text(title);
	}

	this.boot = function() {

		var that = this;

		// Binds Volume slider
		this.$volumeFader.slider({
			min: 0,
			max: 100,
			orientation: "vertical",

			slide: function(event, ui) {
				that.volume = ui.value / 100;
				console.log(ui.value);
			}
		});

		// init base values
		this.setVolume(0.8);
		this.setTitle('New track');

	}
}