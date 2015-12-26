var Harmony = {

    A4Frequency: 440,

    notesPerOctave: ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],

    indexToFreq: [],
    nameToFreq: {},

    boot: function() {
        Harmony.precalculateFreqBuffers();
    },

    note: function(name) {
        if( ! Harmony.nameToFreq[name] ) {
            console.error('"' + name + '" is not a valid note name. Using "A4" instead.');
            name = "A4";
        }
        return Harmony.nameToFreq[name];
    },

    precalculateFreqBuffers: function() {
        var currentOctave = 0;
        var currentNoteIndex = 0;

        for(var n = 1; n <= 88; n++) {
            Harmony.indexToFreq[n] = Math.pow(2, (n - 49) / 12) * Harmony.A4Frequency;

            var baseNoteName = Harmony.notesPerOctave[currentNoteIndex % 12];
            var noteName = baseNoteName + currentOctave;
            Harmony.nameToFreq[noteName] = Harmony.indexToFreq[n];

            currentNoteIndex ++;
            if( baseNoteName == "C" ) {
                currentOctave ++;
            }
        }
    }
};

Harmony.boot();