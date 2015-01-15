$(function() {

  var pay = (function() {
    'use strict';

    var pay = {
      moneyEl: $('#j-tiqu-money'),
      max: Number($('#j-max-money').html()),
      min: 10,
      less: 50000,
    };

    return pay;

  }());

  // Next
  $('#j-bind-sub').on('click', function(event) {
    event.preventDefault();
    var money = pay.moneyEl.val();

    if (pay.max < pay.min && money != pay.max) {
      if (money != pay.max) {
        money = pay.max;
        pay.moneyEl.val(pay.max);
        APP.showTips(APP.getConfirmHtml('账户余额小于10元，提款需一次性提清'));
        return;
      }
    }
    if (pay.max >= pay.min) {
      if (money < pay.min) {
        if (money != pay.max) {
          APP.showTips(APP.getConfirmHtml('每次提款金额需大于等于' + pay.min + '元!'));
          return;
        }
      }
      if (money > pay.max) {
        APP.showTips(APP.getConfirmHtml('超出最大可提取金额'));
        if (pay.max > pay.less) {
          pay.moneyEl.val(pay.less);
        } else {
          pay.moneyEl.val(pay.max);
        }
        return;
      }
      if (money > pay.less) {
        APP.showTips(APP.getConfirmHtml('提现金额每笔不可超过50000元'));
        pay.moneyEl.val(pay.less);
        return;
      }
    }

    if (isNaN(money) || money == 0) {
      APP.showTips(APP.getConfirmHtml('请先输入正确金额'));
      pay.moneyEl.val(10);
      return;
    } else {
      money = Number(money).toFixed(2);
      pay.moneyEl.val(money);
      $('.getmoney').html(money);
      $('#j-bind-form').hide();
      $('#j-confirm').fadeIn();
      $('#j-tips-box').hide();
    }

  });

  //确认提交提款申请
  $('#j-confirm-sub').on('click', function(event) {
    event.preventDefault();
    //提取金额
    var money = $('#j-tiqu-money').val();

    $('#j-confirm').hide();
    $('#j-next').fadeIn();
    $.ajax({
        url: '/account/draw/ajax',
        type: 'get',
        dataType: 'json',
        data: {
          money: money
        },
      })
      .done(function(data) {
        if (data.retCode == 100000) {
          $('#j-confirm').hide();
          $('#j-next').fadeIn();
          $('#drawTime').html(data.retData.time);
          $('#drawBank').html($('#bankName').html());
          $('#drawMoney').html(data.retData.drawMoney);
          $('#drawRealMoney').html(data.retData.drawRealMoney);
          APP.updateUserMoney();
        } else {
          APP.showTips(data.retMsg);
        }
      })
      .fail(function() {
        APP.onServiceFail();
      });
  });

  $('#findTKRecord').on('click', function(event) {
    event.preventDefault();
    PAGE.getDrawRecord({
      type: $('#days').val(),
      status: $('#status').val(),
      page: 1,
      pageSize: 10,
      innerHtmlObj: $('#tkRecordList')
    });
  });

  $('#j-draw-nav').on('click', 'a', function() {
    if ($(this).attr('data-cord') == 1) {
      PAGE.getDrawRecord({
        type: $('#days').val(),
        status: $('#status').val(),
        page: 1,
        pageSize: 10,
        innerHtmlObj: $('#tkRecordList')
      });
    }
  });

  $('#tkRecordList').on('click', '.j-cancel', function() {

    var _this = $(this);
    var id = $(this).attr('data-id');
    $.ajax({
        url: '/account/draw/cancel/ajax',
        type: 'get',
        dataType: 'json',
        data: {
          id: id
        },
      })
      .done(function(D) {
        if (D.retCode == 100000) {
          APP.showTips(APP.getConfirmHtml(D.retMsg));
          _this.parents('tr').find('.j-status').html('提款取消');
          _this.remove();
          APP.updateUserMoney();
        } else {
          APP.handRetCode(D.retCode, D.retMsg);
        }
      })
      .fail(function() {
        APP.onServiceFail();
      });

  });


});