jQuery( function($) {

    // $('.ui-create-track').on('click', function(e) {
    //     e.preventDefault();

    //     return false;
    // });
    
    var seq = new Sequencer();
    seq.addTrack();

    var mySynth = new SynthBase();

    //var midiWindow = new midiView($('.midi-view'), 8, 4);

    $('.note').on('click', function(e) {
        e.preventDefault();

        var noteName = $(this).attr('data-note');

        mySynth.noteOn( noteName );

        ( function(noteName) {
            setTimeout(function() {
                mySynth.noteOff(noteName);
            }, 500);
        }) (noteName);

        return false;
    });

    $('.chord').on('click', function(e) {
        e.preventDefault();

        mySynth.noteOn('A4');
        mySynth.noteOn('C4');
        mySynth.noteOn('E5');

        setTimeout(function() {
            mySynth.noteOff();
        }, 500);

        return false;
    })
});