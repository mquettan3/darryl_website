var state = "stop";
var playlist_entries, audio;
var current_song_id = 0;

function buttonStopPress(){
    state = 'stop';
    var button = d3.select("#button_play").classed('btn-success', false);
    button.select("i").attr('class', "fa fa-play");
}

function playAudio(){
    state='play';
    $("#button_play").addClass('btn-success');
    $("#button_play i").removeClass("fa fa-play");
    $("#button_play i").addClass("fa fa-pause");
    audio.load();
    audio.play();
}

function pauseAudio() {
    state='pause';
    $("#button_play").addClass('btn-success');
    $("#button_play i").removeClass("fa fa-pause");
    $("#button_play i").addClass("fa fa-play");
    audio.pause();
}

function stopAudio() {
    state='stop';
    $("#button_play").removeClass('btn-success');
    $("#button_play i").removeClass("fa fa-pause");
    $("#button_play i").addClass("fa fa-play");
    audio.pause();
    audio.currentTime = 0;
}

Template.audio_gallery.onCreated(function(){
    // Soundcloud Widget
    // var SC = require('soundcloud');
    // SC.initialize({
    //     client_id: 'e4bdf5c01dcc284ba9563cdb74395790'
    // });
    //
    // var track_url = 'https://soundcloud.com/thebrilliantidiots';
    // SC.oEmbed(track_url, {
    //     element: document.getElementById('sound_cloud_widget'),
    //     maxheight: 500,
    //     show_comments: true,
    //     show_user: true,
    //     color: 666666
    // }).then(
    //     function(oembed) {
    //         jQuery("#sound_cloud_widget").html(oembed.html.replace('visual=true&',''));
    //     }
    // );

    this.audio_location = new ReactiveVar("audio/Yuppppp(s.u.)69bpm.mp3");
    this.current_song_name = new ReactiveVar("N/A");

});

Template.audio_gallery.onRendered(function(){
    playlist_entries = document.getElementById('list').getElementsByTagName("a");
    audio = document.getElementById('audio_player');
});

Template.audio_gallery.destroyed = function(){
    // Remove dynamic classes
};

Template.audio_gallery.helpers({
    audio_source: function(){
        return Template.instance().audio_location.get();
    },
    current_song_name: function(){
        return Template.instance().current_song_name.get();
    }
})

Template.audio_gallery.events({
    "click ul li a": function(event, template) {
        //Prevent the Default Behavior
        event.preventDefault();

        //Set the current_song_id
        current_song_id = $(event.currentTarget).data("index");

        //Set the appropriate reactive variables then flush to produce to the helper functions
        template.audio_location.set($(event.currentTarget).attr("href"));
        template.current_song_name.set($(event.currentTarget).attr("value"));
        Tracker.flush();

        //Play the selected song
        playAudio();
    },
    "click #button_play": function(event, template) {
        if(state=='stop'){
          state='play';
          playAudio();
        }
        else if(state=='play' || state=='resume'){
          state = 'pause';
          pauseAudio();
        }
        else if(state=='pause'){
          state = 'resume';
          playAudio();
        }
    },
    "click #button_next": function(event, template) {
        current_song_id++;
        if(current_song_id > (playlist_entries.length - 1)) {
            current_song_id = 0;
        }
        template.audio_location.set(playlist_entries[current_song_id].getAttribute("href"));
        template.current_song_name.set(playlist_entries[current_song_id].getAttribute("value"));
        Tracker.flush();
        playAudio();
    }
});
