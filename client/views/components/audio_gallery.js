var audio_location;

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

});

Template.audio_gallery.destroyed = function(){
    // Remove dynamic classes
};

Template.audio_gallery.helpers({
    audioSource: function(){
        return Template.instance().audio_location.get();
        // return audio_location;
    }
})

Template.audio_gallery.events({
    "click a": function(event, template) {
        event.preventDefault();
        console.log("Button clicked!");
        template.audio_location.set($(event.currentTarget).attr("href"));
        // audio_location = $(event.currentTarget).attr("href");
        Tracker.flush();
        template.find("audio").load();
        template.find("audio").play();
    }
});
