require.config({
  paths: {
    jquery: '../lib/jquery',
    lodash: '../lib/lodash.compat.min',
    bootstrap: '../lib/bootstrap.min',
    store: '../lib/store.min',
    app: '../common/app',
    pager: '../account/pager',
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    },
  }
});

require(['jquery', 'lodash', 'store', 'app', 'pager', 'bootstrap'], function($, _, store, APP) {
  'use strict';
  var rHd = $('.right-hd');
  if (rHd.length) {
    $('.left-hd').height(rHd[0].clientHeight);
  }

  var HeMai = {
    max: $('#j-max').html(),
    dan: $('#j-dan').html(),
    total: $('#j-total').html(),
  };

  var buy = {
    buyTotal: $('#j-buy'),
    buyMoney: $('#j-buy-total')
  };

  function updateBuyMoneyTotal() {
    var x = parseInt(buy.buyTotal.val());
    var y = parseInt(HeMai.dan);
    $('#j-buy-total').html(x * y);
  }

  function checkBuyTotal() {
    var v = parseInt(buy.buyTotal.val());
    var results = true;
    if (!buy.buyTotal.val()) {
      APP.showTips('购买份数不能为空！');
      return false;
    }
    if (isNaN(v)) {
      buy.buyTotal.val(HeMai.max);
      updateBuyMoneyTotal();
      APP.showTips('请输入购买份数');
      return false;
    }
    if (APP.isDecimal(buy.buyTotal.val())) {
      APP.showTips('购买份数不能为小数');
      return false;
    }
    if (v > HeMai.max) {
      APP.showTips('现在最多可以购买' + HeMai.max + '份啊！');
      return false;
    }
    return results;
  }

  $('body').on('click', '#hemaiRefresh', function(event) {
    window.location.reload();
  });

  $('#j-buy').on('keyup', function(event) {
    $(this).val($(this).val().replace(/\D|^0/g, ''));
    updateBuyMoneyTotal();
  });

  $('#j-buy').on('change', function() {
    var v = parseInt(buy.buyTotal.val());
    if (isNaN(v)) {
      buy.buyTotal.val(HeMai.max);
    }
    if (APP.isDecimal(buy.buyTotal.val())) {
      buy.buyTotal.val(HeMai.max);
    }
    if (v > HeMai.max) {
      buy.buyTotal.val(HeMai.max);
    }
    updateBuyMoneyTotal();
  });

  $('#buy-submit').on('click', function() {

    var isAgreen = $('#j-isAgreen')[0].checked;
    var template = '';
    var h = '';
    var b = parseInt(buy.buyTotal.val());
    var onePrice = Number(HeMai.dan);
    var mtotal = $('#j-total').html();
    var mid = $('#j-qihao').val();
    var midHtml = '';
    var mname = $('#j-lotyName').html();
    var html = '';
    var v = '';
    var max = '';
    var percent = '';
    var data = '';
    var appendHtml = '';
    var date = '';

    if (!isAgreen) {
      APP.showTips('请先阅读并同意《委托投注规则》后才能继续');
    } else {
      if (checkBuyTotal()) {

        data = {
          byNum: b,
          joinURI: $('#j-joinURI').val(),
          prjctId: $('#j-projectId').val(),
          onSuccess: function() {

            v = parseInt(buy.buyTotal.val());
            max = parseInt(HeMai.max);
            percent = (100 - ((max - v) * HeMai.dan / HeMai.total * 100)).toFixed(2);

            if (percent == 100) {
              $('#j-buy')[0].disabled = true;
              $('#buy-submit')[0].disabled = true;
              buy.buyTotal.val('').attr('placeholder', '剩余0份');
              $('#j-pro-bar').html('100%').width('100%');
              buy.buyMoney.html(0);
              HeMai = null;
              buy = null;
            } else {
              $('#j-max').html(max - v);
              $('#j-pro-bar').html(percent + '%').width(percent + '%');
              buy.buyTotal.val('').attr('placeholder', '剩余' + (max - v) + '份');
              buy.buyMoney.html(0);
              HeMai.max = max - v;
            }
            date = new Date();
            appendHtml = '<tr><td>' + ($('#messages tbody tr').length + 1) + '</td><td>' + $('#myname').html() + '</td><td>' + b + '</td><td>' + b + '</td><td>0.00</td><td>' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '</td></tr>';
            $('#messages tbody').append(appendHtml);

          }
        };

        // if (mid) midHtml = '第<span>' + mid + '</span>期';

        template = _.template('<div class="frbox"><img src="' + staticHostURI + '/front_images/fail.png" alt="success" class="icon"><div class="text"><p><%= lotyName%> ' + midHtml + '</p><p>方案总金额<span class="fc-3"><%= total %></span></p><p>您认购<span><%= pay %></span>份</p><p>共需支付<span class="fc-3"><%= payMoney %>.00</span>元</p><div class="btns"><button class="btn btn-danger" id="buyConfirm">确定</button><button class="btn btn-gray" data-dismiss="modal">取消</button></div></div></div>');

        h = template({
          lotyName: mname,
          total: mtotal,
          pay: b,
          payMoney:b*onePrice
        });

        html = {
          html: h,
        };

        APP.checkLogin(b*onePrice, {
          enoughMoney: function() {
            APP.showTips(html);
            $('#buyConfirm').one('click', function(event) {
              submitHemai(data);
            });
          }
        });

      }
    }

  });

  var submitHemai = function(obj) {
    $.ajax({
        url: obj.joinURI,
        type: 'get',
        dataType: 'json',
        data: {
          pid: obj.prjctId,
          buyNum: obj.byNum,
          unikey: (new Date()).valueOf(),
        },
      })
      .done(function(data) {
        if (data.retCode == 100000) {
          if (obj.onSuccess) {
            obj.onSuccess();
          }
          APP.updateUserMoney();
          APP.showTips({
            text: '合买成功!',
            type: 1,
            onConfirm: function() {
              window.location.reload();
            }
          });
          $('body').on('click', '.close', function(event) {
            window.history.go(0);
          });
        } else {
          APP.handRetCode(data.retCode, data.retMsg);
        }
      })
      .fail(function() {
        APP.onServiceFail();
      });
  };

  PAGE.loadTicketRecord = function (obj) {
    PAGE.ajaxUrl = '/lottery/cp-detail/'+$('#j-strLotyName').val()+'/ajax';
    PAGE.pageElement = $('.j-page-box');
    PAGE.initAjax(obj);
    PAGE.onSuccess = function (data) {
      var htmlOutput = '';
      var nextPage = ((PAGE.config.page-1)*10 >0)? (PAGE.config.page-1)*10 :'';

      if (data.retCode == 100000) {
        for (var i =0, len=data.retData.length; i < len; i++) {
          htmlOutput+='<tr>\
            <td class="w180">'+(i+1 + nextPage)+'</td>\
            <td>'+data.retData[i].code.replace(/x/g, '<br/><div style="height:5px;"></div>')+'</td>\
            <td>'+data.retData[i].gg+'</td>\
            <td>'+(data.retData[i].money/data.retData[i].multiple/2)+'</td>\
            <td>'+data.retData[i].multiple+'</td>\
            <td>'+data.retData[i].money+'</td>\
            <td>'+data.retData[i].status+'</td>\
          </tr>';
        };
        PAGE.config.pageNum = Math.ceil(data.total / obj.pageSize);
        PAGE.makePageHtml();
        PAGE.bindPageEvent(PAGE.loadTicketRecord);
      } else {
        htmlOutput = "<tr><td colspan='6'>" + data.retMsg + "</td></tr>";
      }
      this.appendTable(htmlOutput);
    };
    PAGE.onFail = function(){
      return;
    };
  };

  $('#j-tab').on('click', 'a', function(event) {
    event.preventDefault();
    /* Act on the event */
    var tables = $('.tab-content .table');
    var index = parseInt($(this).attr('data-x'));
    switch (index) {
      case 1:
          switch($('#j-project-status').val()){
              case '已撤单':
                  tables.eq(index).find('tbody').html('<tr><td colspan="7">您的方案已撤单，系统会自动将投注金退款到您的账户</td></tr>');
                  break;

              case '待出票':
                  tables.eq(index).find('tbody').html('<tr><td colspan="7">等待出票中...</td></tr>');
                  break;

              default:
                  // getNewPage
                  PAGE.pageTable = tables.eq(index).find('tbody');
                  PAGE.loadTicketRecord({
                    project_no: $('#j-projectNo').val(),
                    page: 1,
                    pageSize: 10,
                  });
                  break;
          }
    }
  });

});
