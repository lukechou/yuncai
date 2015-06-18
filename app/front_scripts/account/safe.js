require.config({
  paths: {
    jquery: '../lib/jquery',
    bootstrap: '../lib/bootstrap.min',
    app: '../common/app',
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    }
  },
});

require(['jquery', 'app', 'bootstrap'], function($, APP) {

  function checkUserSafeStatus() {

    var c = Number($.trim($('#j-card').val())) || 0;
    var m = Number($.trim($('#j-mobile').val())) || 0;
    var e = Number($.trim($('#j-email').val())) || 0;
    var b = Number($.trim($('#j-bank').val())) || 0;
    var s = 0;
    var t = c + m + e + b;

    if (t === 3) {
      s = 1;
    }

    if (t === 4) {
      s = 2;
    }

    return s;

  }

  function updateUserSafeStatus() {

    var s = checkUserSafeStatus();

    if (s !== 2) {
      $('#j-safe-tips').removeClass('hide');
    }

    $('.j-safe-st').eq(s).find('.icon').removeClass('icon-d0').addClass('icon-d1');
    $('.j-safe-st').eq(s).find('.fc-84').removeClass('fc-84').addClass('fc-3')

  }

  updateUserSafeStatus();

});