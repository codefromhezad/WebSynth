
var midiView = function($dest, numBeatsPerClip, numQuartersPerBeat) {

	this.$dest = $dest;
	this.numBeatsPerClip;
	this.numQuartersPerBeat;

	this.setup = function(numBeatsPerClip, numQuartersPerBeat) {
		this.numBeatsPerClip = numBeatsPerClip;
		this.numQuartersPerBeat = numQuartersPerBeat;
	}

	this.rebuild = function() {
		var midiRowsHTML = '<table><tbody>';
		for(var noteName in Harmony.nameToFreq) {
			midiRowsHTML += '<tr>';
			midiRowsHTML += '<th><span>'+noteName+'</span></th>';
			for(var bar = 0; bar < this.numBeatsPerClip; bar++) {
				for(var quarter = 0; quarter < this.numQuartersPerBeat; quarter++) {
					midiRowsHTML += '<td class="'+(quarter == 0 ? 'bar': '')+'"></td>';
				}	
			}
			midiRowsHTML += '</tr>';
		}
		midiRowsHTML += '</tbody></table>';

		this.$dest.html( midiRowsHTML );
	}

	this.setup(numBeatsPerClip, numQuartersPerBeat);
	this.rebuild();
}