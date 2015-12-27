jQuery( function($) {
    
    // Init sequencer    
    window.seq = new Sequencer();

    /**
     * Bind general interface listeners
    **/

    $('.toolbar .ui-create-track').on('click', function(e) {
        // Add track button
        e.preventDefault();

        seq.addTrack();

        return false;
    });
    

    

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