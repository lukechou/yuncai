var PAGE = (function () {
  'use strict';

  /***
    @Config  Request必须参数  必要
    @PageTable 数据展示表格Element 必要
    @ajaxUrl Request-Data-Url 必要
    @initAjax 发送Ajax 请求 必要
    @onSuccess 数据请求成功后回到函数,主要用于组织返回数据的HTML 必要
    @onFail  数据请求失败回调 可选
    @makePageHtml  组织分页栏HTML 默认
    @bindPageEvent  绑定分页事件 默认
    @Config.pageNum 分页页数 默认
   ***/

  var PAGE = {
    ajaxUrl: '',
    config: {
      pageNum: 0,
    },
    pageElement: null,
    pageTable: null,
    pageNext:'j-next-page',
    pageBack:'j-next-page',
    pageValue:'j-next-page',
    pageGo:'j-pages-go',
    appendTable: function (html) {
      this.pageTable.html(html);
    },
    makePageHtml: function (pageHtmlNode) {
      if (this.pageElement || !pageHtmlNode) {
        pageHtmlNode = this.pageElement;
      }
      if (this.config.pageNum <= 1) {
        pageHtmlNode.html('');
        return;
      }
      pageHtmlNode.html('<div class="pull-right pages">' + this.config.page + '/<span class="j-days">' + this.config.pageNum + '</span>页<a href="javascript:;" class="back-page" >上一页</a><a href="javascript:;" class="next-page">下一页</a><input type="text" value="' + this.config.page + '" class="govalue j-pages-value"><button class="btn j-pages-go" type="button">Go</button>页</div>').show();
    },
    initAjax: function (obj) {

      var _this = this;
      _this.config = obj;

      $.ajax({
          url: _this.ajaxUrl,
          type: 'get',
          dataType: 'json',
          data: _this.config,
        })
        .done(function (data) {
          _this.onSuccess(data);
        })
        .fail(function () {
          _this.onFail();
        });
    },
    bindPageEvent: function (callback) {

      $('.next-page').on('click', function (event) {
        PAGE.config.page = parseInt(PAGE.config.page);
        if (PAGE.config.page < PAGE.config.pageNum) {
          PAGE.config.page += 1;
          callback(PAGE.config);
        }
      });

      $('.back-page').on('click', function (event) {
        PAGE.config.page = parseInt(PAGE.config.page);
        PAGE.config.page -= 1;
        if (PAGE.config.page <= 0) {
          PAGE.config.page = 1;
        }
        callback(PAGE.config);
      });

      $('.j-pages-value').on('change', function (event) {

        var max = $(this).siblings('.j-days').html();
        var go = parseInt($(this).val());

        if (isNaN(go)) {
          go = 1;
        } else {
          go = Math.ceil(go);
        }

        if (max < go) {
          go = max;
        }
        if (go < 1) {
          go = 1;
        }
        $(this).val(go);
      });

      $('.j-pages-go').on('click', function (event) {
        PAGE.config.page = $(this).siblings('.j-pages-value').val() || 1;
        callback(PAGE.config);
      });

    },
    onSuccess: null,
    onFail: function () {
      APP.showTips('服务器繁忙,请稍后再试!');
    },
  };

  return PAGE;

}());

// 详情分页
PAGE.loadDetailRecord = function (obj) {

  PAGE.config = obj;
  var url = window.location.pathname + '/ajax';
  $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      data: {
        type: obj.type,
        tradeType: obj.tradeType,
        days: obj.days,
        page: obj.page,
        pageSize: obj.pageSize,
      },
    })
    .done(function (data) {
      if (data.retCode == 100000) {
        var dataSize = data.retData.data.length;
        var html = "";
        if (dataSize > 0) {
          var detailData = data.retData.data;

          for (var i = 0; i < detailData.length; i++) {
            dataItem = detailData[i];

            switch (parseInt(obj.type)) {
            case 0:
              html += "<tr><td>" + dataItem.tradeTime + "</td><td>" + dataItem.tradeType + "</td><td class='fc-3'>" + dataItem.balanceInMoney + "</td><td class='fc-3'>" + dataItem.balanceOutMoney + "</td><td class='fc-3'>" + dataItem.restMoney + "</td><td>" + dataItem.tradeRemark + "</td></tr>";
              break;
            case 3:
              html += "<tr><td>" + dataItem.tradeTime + "</td><td>" + dataItem.tradeType + "</td><td>" + dataItem.orderNo + "</td><td class='fc-3'>" + dataItem.tradeMoney + "</td><td>" + dataItem.restMoney + "</td><td>" + dataItem.tradeRemark + "</td></tr>";
              break;
            case 4:
              html += "<tr><td>" + dataItem.tradeTime + "</td><td>" + dataItem.tradeType + "</td><td>" + dataItem.orderNo + "</td><td>" + dataItem.tradeMoney + "</td><td>" + dataItem.tradeRemark + "</td></tr>";
              break;
            case 5:
              var tkStaus = '提款完成';
              html += "<tr><td>" + dataItem.tradeTime + "</td><td>" + dataItem.orderNo + "</td><td>" + dataItem.tradeMoney + "</td><td>" + tkStaus + "</td><td>" + dataItem.tradeRemark + "</td></tr>";
              break;
            default:
              html += "<tr><td>" + dataItem.tradeTime + "</td><td>" + dataItem.tradeType + "</td><td>" + dataItem.orderNo + "</td><td>" + dataItem.tradeMoney + "</td><td>" + dataItem.restMoney + "</td><td>" + dataItem.tradeRemark + "</td></tr>";
              break;
            }

          };
        } else {
          html = "<tr><td colspan='6'>没有数据</td></tr>";
        }

        // 中奖列表才有汇总功能
        if (data.retData.summary) {
          obj['innerHtmlObj'].parents('.tab-pane').find('.j-summary-money').html(data.retData.summary.money)
          obj['innerHtmlObj'].parents('.tab-pane').find('.j-summary-times').html(data.retData.summary.times)
        }

        PAGE.config.pageNum = Math.ceil(data.retData.totalRecord / obj.pageSize);
        PAGE.makePageHtml(obj['innerHtmlObj'].parents('.table').siblings('.j-page-box'));
        //        PAGE.callBack = PAGE.getDrawRecord;
        PAGE.bindPageEvent(PAGE.loadDetailRecord);
      } else {
        html = "<tr><td colspan='6'>" + data.retMsg + "</td></tr>";
      }
      obj['innerHtmlObj'].html(html);
    });
};

// 提款记录分页
PAGE.getDrawRecord = function (obj) {
  PAGE.config = obj;
  var url = '/account/draw/record/ajax';
  $.ajax({
      url: url,
      type: 'get',
      dataType: 'json',
      data: {
        page: obj.page,
        pageSize: obj.pageSize,
        days: $('#days').val(),
        status: $('#status').val()
      }
    })
    .done(function (data) {
      var htmlOutput = "";
      if (data.retCode == 100000) {
        var dataSize = data.retData.data.length;
        if (dataSize > 0) {
          var detailData = data.retData.data;
          for (var i = 0; i < detailData.length; i++) {
            dataItem = detailData[i];
            htmlOutput += '<tr><td>' + dataItem.time + '</td><td>' + dataItem.drawMoney + '元</td><td class="j-status">' + dataItem.status + '</td>';
            if (dataItem.tkCaoZuo) {
              htmlOutput += '<td><a href="javascript:;" class="j-cancel" data-id="' + dataItem.tkCaoZuo + '">取消</a></td></tr>';
            } else {
              htmlOutput += '<td></td></tr>';
            }
          }
        } else {
          htmlOutput = '<td colspan="4">暂无相关记录</td>';
        }
        PAGE.config.pageNum = Math.ceil(data.retData.totalRecord / obj.pageSize);
        PAGE.makePageHtml(obj['innerHtmlObj'].parents('.table').siblings('.j-page-box'));
        //        PAGE.callBack = PAGE.getDrawRecord;
        PAGE.bindPageEvent(PAGE.getDrawRecord);
      } else {
        htmlOutput = '<td colspan="4">' + data.retMsg + '</td>';
      }
      $('#tkRecordList').html(htmlOutput);
    })
    .fail(function () {
      console.log("error");
    });
};
