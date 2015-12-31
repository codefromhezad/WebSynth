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

	this.renderNotesInEditor = function() {
		$('.midi-clip-editor-table .midi-item').remove();

		for(var i in this.notes) {
			var item = this.notes[i];
			var $tr = $('.midi-clip-editor-table tr[data-note="'+item.note+'"]');
			var $td = $tr.find('td[data-beat="'+item.start+'"]');
			var w = ($td.width() + 1) * item.duration;

			$td.html('<div class="midi-item" '+
							'data-note-index="'+i+'" '+
							'data-start="'+item.start+'" '+
							'data-duration="'+item.duration+'" '+
							'data-note="'+item.note+'" '+
							'style="width: '+w+'px;"></div>');
		}

		var thatInEditor = this;

		// Register resizable listener
		$('.midi-clip-editor-table .midi-item').resizable({
			grid: [$('.midi-clip-editor-table td').eq(0).width() + 1, 0],
			containment: $('.midi-clip-editor-table'),
			handles: "w, e",
			stop: function(event, ui) {
				var $this = $(this);
				var newDuration = Math.floor(ui.size.width/($('.midi-clip-editor-table td').eq(0).width() + 1)) + 1;
				var noteIndex = $this.attr('data-note-index');

				$this.attr('data-duration', newDuration);
				thatInEditor.notes[noteIndex].duration = newDuration;
			}
		});
	}

	this.launchEditor = function(beatWidth) {
		var midiRowsHTML = '<table class="midi-clip-editor-table"><tbody>';
		var rows = [];
		for(var noteName in Harmony.nameToFreq) {
			var rowHTML = '<tr data-note="'+noteName+'" class="'+(noteName.indexOf('#') !== -1 ? 'sharp' : '')+'">';
			rowHTML += '<th><span>'+noteName+'</span></th>';
			var beatIndex = 1;
			for(var beat = 0; beat < this.duration; beat++) {
				rowHTML += '<td style="width: '+beatWidth+'px;" data-beat="'+beatIndex+'" class="'+(beat % 4 == 0 ? 'bar': '')+'"></td>';
				beatIndex ++;
			}
			rowHTML += '</tr>';
			rows.push(rowHTML);
		}
		rows.reverse();
		midiRowsHTML += rows.join('') + '</tbody></table>';

		var $editor = $('.midi-clip-editor');
		$editor.html( midiRowsHTML ).dialog('open');

		this.renderNotesInEditor();

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

	$('body').on('dblclick', '.midi-clip-editor-table td', function(e) {
		var $this = $(this);
		var note = $this.closest('tr').attr('data-note');
		var beat = $this.attr('data-beat');

		that.addNote(note, beat, 1);
		that.renderNotesInEditor();
	})

	// Boot
	this.setStart(start);
	this.setDuration(duration);
}