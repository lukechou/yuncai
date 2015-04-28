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
    }
  }
});

require(['jquery', 'app', 'lodash', 'bootstrap'], function ($, APP, _) {
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
  $('.j-select-list').on('click', '.icon', function (event) {

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

  var rowIndex = 0;

  function getDetailHTML(data) {

    var html = '';
    var dataItem = '';
    var isZhong = '';
    var sg = '';
    var tzNr = '';

    for (var i = data.length - 1; i >= 0; i--) {
      dataItem = data[i];
      html += '<tr class="h-look j-look" data-no="' + rowIndex + '"><td  colspan="5"><div class="look-box"><table class="table m-mn-table m-table-border m-table-middle"><thead><tr><th>投注时间</th><th>赛事编号</th><th>对阵</th><th>赛果</th><th>投注内容</th><th>投注注数</th><th>投注金额（元）</th><th>状态</th></tr></thead><tbody><tr>';

      if (Number(dataItem.bonus) > 0) {
        isZhong = 'class="fc-3"';
      }

      sg = dataItem.sg.join(',');
      for (var j = dataItem.tzNr.length - 1; j >= 0; j--) {
        if (dataItem.tzNr[j].join(',') === sg) {
          dataItem.tzNr[j] = '<span class="fc-3">' + dataItem.tzNr[j] + '</span>';
        } else {
          dataItem.tzNr[j] = '<span>' + dataItem.tzNr[j] + '</span>';
        }
      };

      tzNr = dataItem.tzNr.join('');

      html += '<td>' + dataItem.tzTime + '</td>';
      html += '<td class="">' + craeteTdHTML(dataItem.ssbh) + '</td>';
      html += '<td>' + craeteTdHTML(dataItem.dz) + '</td>';
      html += '<td class="fc-3">' + sg + '</td>';
      html += '<td>' + tzNr + '</td>';
      html += '<td>' + craeteTdHTML(dataItem.tzZs) + '</td>';
      html += '<td>' + craeteTdHTML(dataItem.tzJe) + '</td>';
      html += '<td ' + isZhong + '>' + dataItem.status + '</td>';
      html += '</tr></tbody></table></div></td></tr>';

    };

    return html;
  }

  function getDetail(no, TR) {

    $.ajax({
        url: '/lottery/trade/view-detail',
        type: 'get',
        dataType: 'json',
        data: {
          order_no: no
        },
      })
      .done(function (data) {
        if (data.retCode == 100000) {
          var dataItem = data.retData;
          var html = getDetailHTML(dataItem);
          TR.after(html);
        } else {
          APP.handRetCode(data.retCode, data.retMsg);
        }
      })
      .fail(function () {
        APP.onServiceFail();
      });

  }

  //查看详情
  $('.j-show-data').on('click', function (event) {

    event.preventDefault();
    var _this = $(this);
    var TR = _this.parents('.j-stretch-t');
    var no = TR.find('.j-order_no').val();
    var myRowIndex = TR.attr('data-index');
    rowIndex++;

    if (!APP.checkUserLoginStatus()) {
      APP.showLoginBox();
    } else {
      if (TR.hasClass('on')) {
        $('.j-look[data-no=' + myRowIndex + ']').remove();
        _this.html('查看');
        TR.removeClass('on').attr('data-index', '');
      } else {
        TR.addClass('on').attr('data-index', rowIndex);
        _this.html('收起');
        getDetail(no, TR);
      }
    }

  });

});