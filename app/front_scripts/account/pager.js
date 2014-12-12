var PAGE = {};
PAGE.config = {};
PAGE.makePageHtml = function(pageHtmlNode) {
  if (PAGE.config.pageNum <= 1) {
	  pageHtmlNode.html('');
    return;
  }
  pageHtmlNode.html('<div class="pull-right pages">' + (PAGE.config.page) + '/<span class="j-days">' + PAGE.config.pageNum + '</span>页<a href="javascript:;" class="back-page" >上一页</a><a href="javascript:;" class="next-page">下一页</a><input type="text" value="'+PAGE.config.page+'" class="govalue j-pages-value"><button class="btn j-pages-go" type="button">Go</button>页</div>');
};

PAGE.bindPageEvent = function(callback) {

  $('.next-page').on('click', function(event) {
    PAGE.config.page = parseInt(PAGE.config.page)
    PAGE.config.page += 1;
    callback(PAGE.config);
  });

  $('.back-page').on('click', function(event) {
    PAGE.config.page = parseInt(PAGE.config.page)
    PAGE.config.page -= 1;
    if (PAGE.config.page <= 0) {
      PAGE.config.page = 1;
    }
    callback(PAGE.config);
  });

  $('.j-pages-value').on('change', function(event) {

    var max = $(this).siblings('.j-days').html();
    var go = parseInt($(this).val());

    if(isNaN(go)){
      go = 1;
    }else{
      go = Math.ceil(go);
    }

    if(max<go){
      go = max;
    }
    if(go<1){
      go =1;
    }
    $(this).val(go);
  });

  $('.j-pages-go').on('click', function(event) {
    PAGE.config.page = $(this).siblings('.j-pages-value').val()||1;
    callback(PAGE.config);
  });

};

//投注记录
PAGE.loadOrderRecord = function(obj) {

  PAGE.config = obj;
  var url = window.location.pathname + '/ajax';
  $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      data: {
          type: obj.type,
          days: obj.days,
          page: obj.page,
          pageSize: obj.pageSize,
      },
    })
    .done(function(data) {
      if (data.retCode == 100000) {
        var dataSize = data.retData.data.length;
        var html = "";
        if (dataSize > 0) {
          var detailData = data.retData.data;
          for (var i = 0; i < detailData.length; i++) {
            dataItem = detailData[i];
            var projectDetailUrl = '<a  target="_blank" href="' + dataItem.detailURI + '">查看详情</a>';
            var continueBuy = '<a  target="_blank" class="ml8" href="' + dataItem.buyURI + '">继续投注</a>';
            html += "<tr><td>" + dataItem.lotyCNName + "</td><td>" + dataItem.createTime + "</td><td>" + dataItem.money + "元</td><td>" + dataItem.status + "</td><td>" + projectDetailUrl + continueBuy + "</td></tr>";
          };
          // 中奖列表才有汇总功能
          if (obj.type == '1') {
            $('#summary_bonus_sum').html(data.retData.summary.bonusSum);
            $('#summary_bonus_size').html(data.retData.summary.bonusSize);
          }
        } else {
          html = "<tr><td colspan='6'>没有数据</td></tr>";
        }
        PAGE.config.pageNum = Math.ceil(data.retData.totalRecord / obj.pageSize);
        PAGE.makePageHtml(obj['innerHtmlObj'].parents('.table').siblings('.j-page-box'));
        PAGE.bindPageEvent(PAGE.loadOrderRecord);
      } else {
        html = "<tr><td colspan='6'>" + data.retMsg + "</td></tr>";
      }
      obj['innerHtmlObj'].html(html);
    });
};

// 详情分页
PAGE.loadDetailRecord = function(obj) {

  PAGE.config = obj;
  var url = window.location.pathname + '/ajax';
  $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      data: {
        type: obj.type,
        days: obj.days,
        page: obj.page,
        pageSize: obj.pageSize,
      },
    })
    .done(function(data) {
      if (data.retCode == 100000) {
        var dataSize = data.retData.data.length;
        var html = "";
        if (dataSize > 0) {
          var detailData = data.retData.data;
          for (var i = 0; i < detailData.length; i++) {
            dataItem = detailData[i];
            if (obj.type == 4) {
              html += "<tr><td>" + dataItem.tradeTime + "</td><td>" + dataItem.tradeType + "</td><td>" + dataItem.orderNo + "</td><td>" + dataItem.tradeMoney + "</td><td>" + dataItem.tradeRemark + "</td></tr>";
            } else if (obj.type == 5) {
              html += "<tr><td>" + dataItem.tradeTime + "</td><td>" + dataItem.orderNo + "</td><td>" + dataItem.tradeMoney + "</td><td>提款中</td><td>" + dataItem.tradeRemark + "</td><td>取消</td></tr>";
            } else {
              html += "<tr><td>" + dataItem.tradeTime + "</td><td>" + dataItem.tradeType + "</td><td>" + dataItem.orderNo + "</td><td>" + dataItem.tradeMoney + "</td><td>" + dataItem.restMoney + "</td><td>" + dataItem.tradeRemark + "</td></tr>";
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


// 充值分页
PAGE.getDrawRecord = function(obj) {
  PAGE.config = obj;
  var url = '/account/draw/record/ajax';
  $.ajax({
      url: url,
      type: 'get',
      dataType: 'json',
      data: {
    	page:obj.page,
    	pageSize:obj.pageSize,
        days: $('#days').val(),
        status: $('#status').val()
      },
    })
    .done(function(data) {
      var htmlOutput = "";
      if (data.retCode == 100000) {
        var dataSize = data.retData.data.length;
        if (dataSize > 0) {
          var detailData = data.retData.data;
          for (var i = 0; i < detailData.length; i++) {
            dataItem = detailData[i];
            htmlOutput += '<tr><td>' + dataItem.time + '</td><td>' + dataItem.drawMoney + '元</td><td>' + dataItem.status + '</td><td>手续费' + dataItem.commission + '元</td></tr>';
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
    .fail(function() {
      console.log("error");
    });
};