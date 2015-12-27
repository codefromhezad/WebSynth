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

	this.launchEditor = function(beatWidth) {
		var midiRowsHTML = '<table class="midi-clip-editor-table"><tbody>';
		var rows = [];
		for(var noteName in Harmony.nameToFreq) {
			var rowHTML = '<tr data-note="'+noteName+'" class="'+(noteName.indexOf('#') !== -1 ? 'sharp' : '')+'">';
			rowHTML += '<th><span>'+noteName+'</span></th>';
			for(var beat = 0; beat < this.duration; beat++) {
				rowHTML += '<td style="width: '+beatWidth+'px;" class="'+(beat % 4 == 0 ? 'bar': '')+'"></td>';	
			}
			rowHTML += '</tr>';
			rows.push(rowHTML);
		}
		rows.reverse();
		midiRowsHTML += rows.join('') + '</tbody></table>';

		var $editor = $('.midi-clip-editor');
		$editor.html( midiRowsHTML ).dialog('open');
		$editor.scrollTop( $editor.find('[data-note="A4"]').offset().top );
	}

	// Setup listeners
	var that = this;
	this.$dom.on('dblclick', function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		that.launchEditor(20);

		return false;
	});

	// Boot
	this.setStart(start);
	this.setDuration(duration);
}