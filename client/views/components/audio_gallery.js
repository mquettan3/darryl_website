var state = "pause";
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

function resumeAudio(){
    state='resume';
    $("#button_play").addClass('btn-success');
    $("#button_play i").removeClass("fa fa-play");
    $("#button_play i").addClass("fa fa-pause");
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

function formatTime(seconds) {
    minutes = Math.floor(seconds / 60);
    minutes = (minutes >= 10) ? minutes : "0" + minutes;
    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
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
    this.current_song_time = new ReactiveVar("0:00");
    this.current_song_duration = new ReactiveVar("0:00");
    this.current_song_percentage = new ReactiveVar("0");
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
    },
    current_song_time: function() {
        return Template.instance().current_song_time.get();
    },
    current_song_total_duration: function() {
        return Template.instance().current_song_duration.get();
    },
    current_song_percentage: function() {
        return Template.instance().current_song_percentage.get();
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
          resumeAudio();
        }
    },
    "click #button_next": function(event, template) {
        state='play';
        current_song_id++;
        if(current_song_id > (playlist_entries.length - 1)) {
            current_song_id = 0;
        }
        template.audio_location.set(playlist_entries[current_song_id].getAttribute("href"));
        template.current_song_name.set(playlist_entries[current_song_id].getAttribute("value"));
        Tracker.flush();
        playAudio();
    },
    "click #button_previous": function(event, template) {
        current_song_id--;
        state='play';
        if(current_song_id < 0) {
            current_song_id = playlist_entries.length - 1;
        }
        template.audio_location.set(playlist_entries[current_song_id].getAttribute("href"));
        template.current_song_name.set(playlist_entries[current_song_id].getAttribute("value"));
        Tracker.flush();
        playAudio();
    },
    "ended audio": function(event, template) {
        state='play';
        current_song_id++;
        if(current_song_id > (playlist_entries.length - 1)) {
            current_song_id = 0;
        }
        template.audio_location.set(playlist_entries[current_song_id].getAttribute("href"));
        template.current_song_name.set(playlist_entries[current_song_id].getAttribute("value"));
        Tracker.flush();
        playAudio();
    },
    "timeupdate audio": function(event, template) {
        template.current_song_time.set(formatTime(audio.currentTime));
        template.current_song_duration.set(formatTime(audio.duration));
        template.current_song_percentage.set((audio.currentTime / audio.duration) * 100);
    },
    "click #seek_slider": function(event, template) {
        var clicked_width = event.pageX - event.currentTarget.offsetLeft;
        var total_element_width = event.currentTarget.clientWidth;
        var percentage = (clicked_width / total_element_width) * 100;
        if (percentage > 100) {
          percentage = 100;
        } else if (percentage < 0) {
          percentage = 0;
        }
        console.log(percentage);
        audio.currentTime = (percentage / 100) * audio.duration;
        template.current_song_percentage.set(percentage);
        Tracker.flush();
    }
});
