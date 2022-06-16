$('[data-url]').click(function(){chrome.tabs.create({url:$(this).data('url')});});
$(window).on("load resize ", function() {
    var scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
    $('.tbl-header').css({'padding-right':scrollWidth});
  }).resize();