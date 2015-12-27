jQuery( function($) {
    
    // Init sequencer    
    var seq = new Sequencer();

    /**
     * Bind general interface listeners
    **/

    $('.toolbar .ui-create-track').on('click', function(e) {
        // Add track button
        e.preventDefault();

        seq.addTrack();

        return false;
    });
    
    $('.main-sequencer').on('click', '.tracks .track .left-pane', function(e) {
        // Set a track as active
        e.preventDefault();

        seq.selectTrack($(this).closest('.track').attr('data-track-index'));
        return false;
    });

    $('.main-sequencer').on('dblclick', '.tracks-wrapper .guides .beat', function(e) {
        // Adds a midi clip to the active track
        e.preventDefault();

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