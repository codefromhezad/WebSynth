var SynthBase = (function() {
    
    // Private variables
    var voices = {};

    // Constructor
    return function(audioContext, dest) {
        this.title = "SynthBase";
        this.outputNode = dest;

        this.noteOn = function(noteName) {
            // Checking Voice is not already in use
            if( voices[noteName] ) {
                voices[noteName]['oscillator'].stop(0);
            }

            // Creating nodes
            var voiceNodes = {};
            voiceNodes['oscillator'] = audioContext.createOscillator();
            voiceNodes['gain'] = audioContext.createGain();

            // Connecting nodes
            voiceNodes['gain'].connect(this.outputNode);
            voiceNodes['oscillator'].connect(voiceNodes['gain']);

            // Setting up nodes
            voiceNodes['oscillator'].type = 'square'; // sine, square, sawtooth, triangle or custom
            voiceNodes['oscillator'].frequency.value = Harmony.note( noteName );
            voiceNodes['gain'].gain.value = 0.8;

            // Registering 
            voices[noteName] = voiceNodes;

            // Playing
            voiceNodes['oscillator'].start(0);
        }

        this.noteOff = function(noteName) {
            if( noteName && voices[noteName] ) {
                voices[noteName]['oscillator'].stop(0);
            } else {
                for(var noteName in voices) {
                    voices[noteName]['oscillator'].stop(0);
                }
            }
        }
    }
})();