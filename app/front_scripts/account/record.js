$(function() {
  'use strict';
  PAGE.loadOrderRecord = function(obj) {

    PAGE.ajaxUrl = window.location.pathname + '/ajax';
    PAGE.pageElement = $('.j-page-box');
    PAGE.initAjax(obj);

    PAGE.onSuccess = function(data) {
      var htmlOutput = '';
      if (data.retCode == 100000) {
        htmlOutput = craeteOutputHTML(data, obj.type);
        PAGE.config.pageNum = Math.ceil(data.retData.totalRecord / obj.pageSize);
        PAGE.makePageHtml();
        PAGE.bindPageEvent(PAGE.loadOrderRecord);
      } else {
        htmlOutput = "<tr><td colspan='6'>" + data.retMsg + "</td></tr>";
      }
      this.appendTable(htmlOutput);
    };

  };

  var tables = $('.tab-content .table');
  var record = (function() {

    var record = {
      page: 1,
      pageSize: 10,
      init: function() {

        var type = 0;

        if (APP.getUrlPara('type') != "") {
          type = APP.getUrlPara('type');
          if (isNaN(type)) type = 0;
          if (type < 0) type = 0;
          if (type >= tables.length) type = 0;
        }

        $('#nav-tabs li:eq(' + type + ') a').tab('show');

        // getNewPage
        PAGE.pageTable = tables.eq(type).find('tbody');
        PAGE.loadOrderRecord({
          type: type,
          days: 30,
          page: 1,
          pageSize: 10,
        });
      }
    };

    return record;

  }());

  // Change Many Days
  $('.nearday').on('change', function() {

    var i = parseInt($(this).parents('.tab-pane').index());
    var days = $(this).val() || 30;

    PAGE.pageTable = tables.eq(i).find('tbody');
    PAGE.loadOrderRecord({
      type: i,
      days: days,
      page: 1,
      pageSize: 10,
    });

  });

  // Tab Toggle
  $('#nav-tabs').on("click", ' a', function() {

    var i = parseInt($(this).attr('data-type'));
    var days = $('.tab-pane').eq(i).find('.nearday').val() || 30;

    PAGE.pageTable = tables.eq(i).find('tbody');
    PAGE.loadOrderRecord({
      type: i,
      days: days,
      page: 1,
      pageSize: 10,
    });

  });

  /**
   * 创建Table HTML
   * @param  {json} data
   * @param  {String} type 0:全部记录 1:中奖记录  2:未开奖  3:模型投注记录
   * @return {craeteOutputHTML}
   */
  function craeteOutputHTML(data, type) {

    var dataSize = data.retData.data.length;
    var detailData = data.retData.data;
    var htmlOutput = '';
    var projectDetailUrl = '';
    var continueBuy = '';
    var isZhongJiang = '';
    var dataItem = '';

    if (dataSize > 0) {
      for (var i = 0; i < detailData.length; i++) {
        dataItem = detailData[i];

        continueBuy = '<a  target="_blank" class="ml8" href="' + dataItem.buyURI + '">继续投注</a>';

        if (dataItem.lotyCNName == '模型') {
          dataItem.lotyCNName = '竞彩足球<i class="icon-font icon-f7">模</i>';
          projectDetailUrl = '<a href="javascript:;" class="j-history-more" data-order="' + dataItem.order_no + '">查看详情</a>';
        } else {
          projectDetailUrl = '<a  target="_blank" href="' + dataItem.detailURI + '">查看详情</a>';
        }

        switch (type) {
          case 3:
            if (Number(dataItem.bonusMoney) > 0) {
              isZhongJiang = 'fc-3';
            } else {
              isZhongJiang = '';
            }
            htmlOutput += '<tr><td>' + dataItem.createTime + '</td><td>' + dataItem.qihao + '</td><td>' + dataItem.projectNo + '</td><td>' + dataItem.money + '</td><td class="' + isZhongJiang + '">' + dataItem.bonusMoney + '</td><td class="' + isZhongJiang + '">' + dataItem.status + '</td><td>' + projectDetailUrl + continueBuy + '</td></tr>';
            break;
          case 0:
            htmlOutput += '<tr><td>' + dataItem.lotyCNName + '</td><td>' + dataItem.createTime + '</td><td>' + dataItem.money + '元</td><td>' + dataItem.status + '</td><td>' + projectDetailUrl + continueBuy + '</td></tr>';
            break;
          default:
            htmlOutput += '<tr><td>' + dataItem.lotyCNName + '</td><td>' + dataItem.createTime + '</td><td>' + dataItem.money + '元</td><td>' + dataItem.status + '</td><td>' + projectDetailUrl + continueBuy + '</td></tr>';
            break;
        }

      };


      // 中奖列表才有汇总功能
      if (type == '1') {
        $('#summary_bonus_sum').html(data.retData.summary.bonusSum);
        $('#summary_bonus_size').html(data.retData.summary.bonusSize);
      }

    } else {
      htmlOutput = "<tr><td colspan='6'>没有数据</td></tr>";
    }
    return htmlOutput;
  }

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

  function craeteTdHTML2(tznr, sg) {

      var html = '';
      var s = sg.join();

      for (var i = tznr.length - 1; i >= 0; i--) {
        if (tznr[i].join() == s) {
          tznr[i] = '<span class="fc-3">' + tznr[i] + '</span>';
        } else {
          tznr[i] = '<span>' + tznr[i] + '</span>';
        }
      };

      html = tznr.join('');
      return html;
    }
    // Read Model Record Detail
  $('#j-table-main').on('click', '.j-history-more', function(event) {
    event.preventDefault();

    var _this = $(this);
    var TR = _this.parents('tr');
    var no = $(this).attr('data-order');
    $('#j-look').remove();
    TR.after('<tr id="j-look" class="h-look" data-no="' + no + '"><td colspan="7">正在加载..</td></tr>');

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
          var html = '<td colspan="7"><div class="look-box"><table class="table m-mn-table m-table-border m-table-middle"><thead><tr><th>赛事编号</th><th>对阵</th><th>赛果</th><th>投注内容</th><th>投注注数</th><th>投注金额（元）</th><th>奖金（元）</th></tr></thead><tbody><tr>';

          html += '<td>' + craeteTdHTML(dataItem.ssbh) + '</td>';
          html += '<td>' + craeteTdHTML(dataItem.dz) + '</td>';
          html += '<td class="fc-3">' + dataItem.sg + '</td>';
          html += '<td>' + craeteTdHTML2(dataItem.tzNr, dataItem.sg) + '</td>';
          html += '<td>' + craeteTdHTML(dataItem.tzZs) + '</td>';
          html += '<td>' + craeteTdHTML(dataItem.tzJe) + '</td>';
          html += '<td class="fc-3">' + dataItem.bonus + '</td>';
          html += '</tr></tbody></table></div></td>';
          $('#j-look').html(html);

        } else {
          APP.handRetCode(data.retCode, data.retMsg);
        }
      })
      .fail(function() {
        APP.onServiceFail();
      });
  });
  // Init Page
  record.init();

});