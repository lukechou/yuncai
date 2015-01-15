require.config({
  urlArgs: "bust=" + (new Date()).getTime(),
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
    }
  }
});

require(['jquery', 'app', 'lodash', 'bootstrap'], function($, APP, _) {
  'use strict';

  var active = 'icon-y2';
  var noActive = 'icon-y';

  function escapeStr(str) {
    return _.escape($.trim(str));
  }

  // 页面初始化
  function init() {
    var query = APP.parseQueryString();
    for (var prop in query) {
      if (query.hasOwnProperty(prop)) {
        query[prop] = _.escape(query[prop]);
      }
    }
    $('.j-select-list [data-type=' + query.type + ']').toggleClass(active + ' ' + noActive);
    $('.j-select-list [data-day=' + query.day + ']').toggleClass(active + ' ' + noActive);
  }

  init();

  // 头部筛选事件
  $('.j-select-list').on('click', '.icon', function(event) {

    $(this).parents('.j-select-list').find('.icon').removeClass(active).addClass(noActive);
    $(this).toggleClass(active + ' ' + noActive);
    var day = escapeStr($('.j-select-day .' + active).attr('data-day'));
    var type = escapeStr($('.j-select-type .' + active).attr('data-type'));
    var id = escapeStr($('#j-model-id').val());
    var url = '/lottery/model/history-data?day=' + day + '&type=' + type + '&model_id=' + id
    window.location.href = url;

  });
  /**
   * Create Td HTML
   * @param  {Array} arr
   * @return {String}
   */
  function craeteTdHTML(arr) {
      var html = '';
      for (var i = arr.length - 1; i >= 0; i--) {
        arr[i] = '<span>' + arr[i] + '</span>';
      };
      html = arr.join('');
      return html;
    }
    //查看详情
  $('.j-show-data').on('click', function(event) {
    event.preventDefault();
    var _this = $(this);
    var TR = _this.parents('.j-stretch-t');
    var no = TR.find('.j-order_no').val();

    if (no !== $('#j-data .h-look').attr('data-no')) {
      $.ajax({
          url: '/lottery/trade/view-detail',
          type: 'get',
          dataType: 'json',
          data: {
            order_no: no
          },
        })
        .done(function(data) {
          if (data.retCode == 100000) {
            var dataItem = data.retData;
            var html = '<tr class="h-look" data-no="'+no+'"><td  colspan="5"><div class="look-box"><table class="table m-mn-table m-table-border m-table-middle"><thead><tr><th>投注时间</th><th>赛事编号</th><th>对阵</th><th>赛果</th><th>投注内容</th><th>投注注数</th><th>投注金额（元）</th><th>奖金（元）</th><th>状态</th></tr></thead><tbody><tr>';

            html += '<td>' + dataItem.tzTime + '</td>';
            html += '<td>' + craeteTdHTML(dataItem.ssbh) + '</td>';
            html += '<td>' + craeteTdHTML(dataItem.dz) + '</td>';
            html += '<td class="fc-3">' + dataItem.sg + '</td>';
            html += '<td>' + craeteTdHTML(dataItem.tzNr) + '</td>';
            html += '<td>' + craeteTdHTML(dataItem.tzZs) + '</td>';
            html += '<td>' + craeteTdHTML(dataItem.tzJe) + '</td>';
            html += '<td class="fc-3">' + dataItem.bonus + '</td>';
            html += '<td class="fc-3">' + dataItem.status + '</td>';
            html += '</tr></tbody></table></div></td></tr>';
            $('#j-data .h-look').remove();
            TR.after(html);
          } else {
            APP.handRetCode(data.retCode, data.retMsg);
          }
        })
        .fail(function() {
          APP.onServiceFail();
        });
    }
  });

});