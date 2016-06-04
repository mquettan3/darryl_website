Template.navbar.rendered = function(){
  // Smart scrolling
  $('body').scrollspy({
      target: '#navbar',
      offset: 80
  })

  // Page scrolling feature
  $('a.page_scroll').bind('click', function (event) {
      var link = $(this);
      $('html, body').stop().animate({
          scrollTop: $(link.attr('href')).offset().top - 65
      }, 500);
      event.preventDefault();
  });
}

Template.navbar.destroyed = function(){
    // Remove dynamic classes
};
