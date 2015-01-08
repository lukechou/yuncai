require.config({
  paths: {
    jquery: '../lib/jquery',
    lodash: '../lib/lodash.compat.min',
    store: '../lib/store.min',
    bootstrap: '../lib/bootstrap.min',
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    }
  }
});

require(['jquery', 'lodash', 'store', 'bootstrap'], function($, _, store) {
  'use strict';

  //精确筛选
  $('.j-id-input').focus(function() {
    var _this = $(this);
    if ('输入模型编号精确查找' == _this.val()) {
      $(this).val('');
    }
  }).blur(function() {
    var _this = $(this);
    if ('' == _this.val()) {
      $(this).val('输入模型编号精确查找');
    }
  })
  $('#detail-form').submit(function() {
    var val = $('.j-id-input').val();
    if ('' == val || '输入模型编号精确查找' == val) {
      APP.showTip('请输入模型编号再查询');
      return false;
    }
  });

  $('.j-sort-btn').on('click', function(event) {
    $('.j-sort-box').toggleClass('hide');
  });

});