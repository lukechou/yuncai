require.config({
  paths: {
    jquery: '../lib/jquery',
    lodash: '../lib/lodash.compat.min',
    bootstrap: '../lib/bootstrap.min',
    store: '../lib/store.min',
    app: '../common/app',
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    },
  }
});

require(['jquery', 'lodash', 'app', 'store', 'bootstrap'], function($, _, APP, store) {
  'use strict';

  var perScript = {
    pageInit: function() {
      this.tri();
      this.hisMore();
      this.togglePerTabs();
      this.modelMore();
    },
    tri: function() {
      $('.j-show-recent-news').click(function(event) {
        if ($(this).hasClass('icon-tridown')) {
          $(this).removeClass('icon-tridown').addClass('icon-triup');
          $(this).parents('p').siblings('.j-more-recent-news').css({
            display: 'block'
          });
        } else if ($(this).hasClass('icon-triup')) {
          $(this).removeClass('icon-triup').addClass('icon-tridown');
          $(this).parents('p').siblings('.j-more-recent-news').css({
            display: 'none'
          });
        }
      });
    },
    hisMore: function() {
      $('.j-his-more-details').click(function(event) {
        var target = $(this).parent('td').parent('tr').next('tr.j-his-more-tr');
        var _this = $(this);
        if ('展开详情' == _this.text()) {
          _this.text('收起');
          target.css({
            display: 'table-row'
          });
        } else if ('收起' == _this.text()) {
          _this.text('展开详情');
          target.css({
            display: 'none'
          });
        }
      });
    },
    togglePerTabs: function() {
      $('#j-nav').on('click', 'a', function(event) {
        event.preventDefault();
        var objCurrentSelect = $(this).parents('li');
        var pagetype = $(this).attr('data-pagetype');
        objCurrentSelect.addClass('active');
        objCurrentSelect.siblings('li').removeClass('active');
        switch (pagetype) {
          case '0':
            $('.j-per-index').css({
              display: 'block'
            });
            $('.j-per-index').siblings('.j-per-his,.j-per-dzgd,.j-per-model').css({
              display: 'none'
            });
            break;
          case '1':
            $('.j-per-his').css({
              display: 'block'
            });
            $('.j-per-his').siblings('.j-per-index,.j-per-dzgd,.j-per-model').css({
              display: 'none'
            });
            break;
          case '2':
            $('.j-per-dzgd').css({
              display: 'block'
            });
            $('.j-per-dzgd').siblings('.j-per-index,.j-per-his,.j-per-model').css({
              display: 'none'
            });
            break;
          case '3':
            $('.j-per-model').css({
              display: 'block'
            });
            $('.j-per-model').siblings('.j-per-index,.j-per-his,.j-per-dzgd').css({
              display: 'none'
            });
            break;
        }
      });
    },
    modelMore: function() {
      //模型的“更多”则自动跳转至“历史记录-模型投注-查看全部记录”
      $('.j-per-modelmore').click(function(event) {
        $('#j-nav li:nth-child(2)').addClass('active');
        $('#j-nav li:nth-child(2)').siblings('li').removeClass('active');
        $('.j-per-his').css({
          display: 'block'
        });
        $('.j-per-his').siblings('.j-per-index,.j-per-dzgd,.j-per-model').css({
          display: 'none'
        });
        //还要进行数据加载
      });
    }
  };
  perScript.pageInit();
});