var MidiNote = function(note, start, duration) {
	this.note = note;
	this.start = start;
	this.duration = duration;
}

var MidiClip = function(start, duration) {
	this.start;
	this.duration;
	this.notes = [];

	this.$dom = $('<div class="midi-clip" '+
					'data-start="" '+
					'data-duration="" '+
					'style="background: '+randomColor()+'">'+
				'</div>');

	this.setStart = function(start) {
		this.start = start;
		this.$dom.attr('data-start', start);
	}

	this.setDuration = function(duration) {
		this.duration = duration;
		this.$dom.attr('data-duration', duration);
	}

	this.addNote = function(note, start, duration) {
		this.notes.push( new MidiNote(note, start, duration) );
	}

	// Boot
	this.setStart(start);
	this.setDuration(duration);
}