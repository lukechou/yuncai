require.config({
  paths: {
    jquery: '../lib/jquery',
    bootstrap: '../lib/bootstrap.min',
    app: '../common/app',
    PAGE: 'pager',
    DRAW: 'draw'
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    },
    PAGE: {
      deps: ['jquery'],
      exports: 'jquery'
    },
    DRAW: {
      deps: ['jquery'],
      exports: 'jquery'
    }
  },
});

require(['jquery', 'app', 'PAGE', 'bootstrap', 'DRAW'], function($, APP) {

  'use strict';

  $('.j-hide-btn').on('click', function(event) {
    event.preventDefault();
    var _this = $(this);
    var hideType = _this.attr('hide-type');
    var confirmText = '';
    switch (hideType) {
      case '1':
        confirmText = '您确认取消隐藏用户名吗？';
        break;
      case '2':
        confirmText = '您确认隐藏用户名吗？';
        break;

    }
    APP.showTips({
      title: '确认提示',
      text: confirmText,
      type: 2,
      onConfirm: function() {
        $.ajax({
            url: '/account/set-hide-model/ajax',
            type: 'get',
            dataType: 'json',
            data: {
              type: hideType
            },
          })
          .done(function() {
            window.location.reload();
          })
          .fail(function() {
            APP.onServiceFail();
          });
      }
    });


  });


});