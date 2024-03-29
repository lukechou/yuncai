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

    $(this).toggleClass('active');
    // 是否多级导航
    if ($(this).hasClass('more')) {

      var m = $(this).attr('data-more');
      $('.more-' + m).toggle();

    } else {

      var pages = APP.filterStr($(this).attr('data-page'));
      togglePage(pages);

    }

  });

  function togglePage(pageIndex, ps) {

    var leftNav = $('#j-nav [data-page=' + pageIndex + ']').find('a');
    var title = APP.filterStr(leftNav.html());
    var smallNav = leftNav.attr('data-nav');
    var parentLi = $('#j-nav [data-more=' + smallNav + ']');

    $('#j-nav .active').removeClass('active');

    if (smallNav) {
      $('.more-' + smallNav).show();
    }

    leftNav.addClass('active');
    parentLi.addClass('active');

    $('#j-page-title').html(title);
    $('#j-page-main .j-page').hide();


    // toggleRightMain
    if ($('.j-page-' + pageIndex).length === 0) {

      getHelpHtml(pageIndex, function() {
        if (ps) {

          var el = '#j-position-' + ps;

          var top = $(el).offset().top;

          $('body').animate({
            scrollTop: top + 'px'
          }, 200);

        }
      });

    } else {

      $('.j-page-' + pageIndex).fadeIn('300');

    }

  }

  function init() {

    var params = APP.parseQueryString();
    var pageIndex = APP.filterStr(params.page);
    var ps = null;

    if (pageIndex === '') {
      pageIndex = 6;
    }

    if (params.ps) {
      ps = params.ps;
    }

    togglePage(pageIndex, ps);
    APP.updateHeadUserInfo();
  }

  function getHelpHtml(pageIndex, cb) {

    $.ajax({
        url: './doc/' + pageIndex + '.html',
        type: 'get',
        dataType: 'html',
      })
      .done(function(d) {

        $('#j-page-main').append(d);
        $('.j-page-' + pageIndex).fadeIn('300');

        if (cb) {
          cb();
        }

      })
      .fail(function() {
        console.log("error");
      });

  }

  init();

});