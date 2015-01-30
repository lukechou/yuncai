require.config({
  paths: {
    jquery: '../lib/jquery',
    lodash: '../lib/lodash.compat.min',
    bootstrap: '../lib/bootstrap.min',
    app: '../common/app',
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    },
  },

});

require(['jquery', 'lodash', 'app', 'bootstrap'], function ($, _, APP) {

  $('#j-sub').on('click', function (event) {

    var username = APP.filterStr($.trim($('#username').val()));
    var userLen = GetLength(username);

    if (!username || userLen < 3 || userLen > 16) {
      $('#j-set-tips').fadeIn();
    } else {
      $('#j-set-user').hide();
      $('#j-choose-way').fadeIn();
    }

  });


  $('#j-choose-way .f-step-ls').on('click', 'li', function(event) {

    var method = APP.filterStr($(this).attr('data-method'));

    $('#j-choose-way').hide();
    if(method){
      $('#j-'+method+'-way').fadeIn();
    }
  });


  $('#j-sub-mobile').on('click', function(event) {

    $('#j-mobile-way').hide();
    // show tips
    $('#j-mobile-tips').show();
    // go to set
    $('#j-reset-pwd').fadeIn();

  });

  $('#j-next-email').on('click', function(event) {
    $('#j-email-way').hide();
    $('#j-email-sure').fadeIn();
  });




  function GetLength(str) {
    var realLength = 0,
      len = str.length,
      charCode = -1;
    for (var i = 0; i < len; i++) {
      charCode = str.charCodeAt(i);
      if (charCode >= 0 && charCode <= 128) realLength += 1;
      else realLength += 2;
    }
    return realLength;
  };

});