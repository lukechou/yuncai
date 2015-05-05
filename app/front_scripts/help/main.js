require.config({
  paths: {
    jquery: '../lib/jquery',
    app: '../common/app',
    bootstrap: '../lib/bootstrap.min'
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    }
  }
});

require(['jquery', 'app'], function($, APP) {

  var page = null;

  $('#j-nav').on('click', 'li', function() {

    // 是否多级导航
    if ($(this).hasClass('more')) {

      var m = $(this).attr('data-more')
      $('.more-' + m).toggle()

    } else {

      var pages = APP.filterStr($(this).attr('data-page'));
      togglePage(pages);

    }

  });

  function togglePage(pageIndex) {

    var leftNav = $('#j-nav [data-page=' + pageIndex + ']').find('a');
    var title = APP.filterStr(leftNav.html());
    var smallNav = leftNav.attr('data-nav');

    $('#j-nav .active').removeClass('active');

    if (smallNav) {
      $('.more-' + smallNav).show();
    }

    leftNav.addClass('active');

    $('#j-page-title').html(title);
    $('#j-page-main .j-page').hide();

    // toggleRightMain
    if ($('.j-page-' + pageIndex).length === 0) {
      getHelpHtml(pageIndex);
    } else {
      $('.j-page-' + pageIndex).fadeIn('300');
    }

  }


  function init() {

    var pageIndex = APP.filterStr(APP.parseQueryString().page);

    if (pageIndex === '') {
      pageIndex = 6;
    }

    togglePage(pageIndex);
    APP.updateHeadUserInfo();
  }

  function getHelpHtml(pageIndex) {

    $.ajax({
        url: './doc/' + pageIndex + '.html',
        type: 'get',
        dataType: 'html',
      })
      .done(function(d) {

        $('#j-page-main').append(d);
        $('.j-page-' + pageIndex).fadeIn('300');

      })
      .fail(function() {
        console.log("error");
      });

  }

  init();

});