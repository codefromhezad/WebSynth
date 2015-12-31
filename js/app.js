jQuery( function($) {
    
    // Init sequencer    
    var seq = new Sequencer();

    // While developping, add a default empty track
    seq.addTrack();

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
        // Select a track as active
        e.preventDefault();
        seq.selectTrack($(this).closest('.track').attr('data-track-index'));
        return false;
    });

    $('.main-sequencer').on('dblclick', '.tracks-wrapper .guides .beat', function(e) {
        // Add a midi clip to the active track
        e.preventDefault();

        if( ! seq.activeTrack ) {
            seq.addTrack();
            return false;
        }

        var $this = $(this);

        var start = $this.attr('data-beat');
        var duration = 16;

        seq.activeTrack.addMidiClip(start, duration);
        return false;
    });

    
    // Register Dialogs
    $('.midi-clip-editor').dialog({
        autoOpen: false,
        maxHeight: 400,
        maxWidth: 900,
        minWidth: 600,
        title: 'MIDI Clip Editor',
        buttons: [{
            text: "OK",
            click: function() {
                $( this ).dialog( "close" );
            }
        }]
    });

    // $('.note').on('click', function(e) {
    //     e.preventDefault();

    //     var noteName = $(this).attr('data-note');

    //     mySynth.noteOn( noteName );

    //     ( function(noteName) {
    //         setTimeout(function() {
    //             mySynth.noteOff(noteName);
    //         }, 500);
    //     }) (noteName);

    //     return false;
    // });

    // $('.chord').on('click', function(e) {
    //     e.preventDefault();

    //     mySynth.noteOn('A4');
    //     mySynth.noteOn('C4');
    //     mySynth.noteOn('E5');

    //     setTimeout(function() {
    //         mySynth.noteOff();
    //     }, 500);

    //     return false;
    // })
});