require.config({
  paths: {
    jquery: '../lib/jquery',
    bootstrap: '../lib/bootstrap.min',
    app: '../common/app',
    inp: '../account/inp'
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    },
    inp: {
      deps: ['jquery'],
      exports: 'inp'
    }
  },
});

require(['jquery', 'app', 'inp', 'bootstrap'], function ($, APP, inp) {

  inp.init({
    parentClass: '.form-group'
  });

  // 确认绑定button
  $('#j-bind-sub').on('click', function (event) {
    event.preventDefault();

    var info = {};
    var bank = $.trim($('#j-yinhang').val()) || '';
    var card = $.trim($('#j-card').val()) || '';
    var confirmCard = $.trim($('#j-confirm-card').val()) || '';
    var pwd = $.trim($('#j-pwd').val()) || '';

    info.bank = bank;
    info.card = card;
    info.pwd = pwd;

    var status = {
      card: true,
      confirmCard: true,
      pwd: true,
      bank: true
    };

    var idGroup = {
      card: 'j-card',
      confirmCard: 'j-confirm-card',
      pwd: 'j-pwd',
      bank: 'j-yinhang'
    };

    if (!inp.regGroup.bank.test(card)) {
      status.card = false;
    }

    if (card != confirmCard) {
      status.confirmCard = false;
    }

    if (!inp.regGroup.pwd.test(pwd)) {
      status.pwd = false;
    }

    if (!bank == 0) {
      status.bank = false;
    }

    if (inp.checkInp(status, idGroup)) {
      bindBankInfo(info);
    }

  });

  //用户在输入银行卡号时须放大当前已输入的号码
  $('#j-card,#j-confirm-card').on('keyup', function (event) {
    event.preventDefault();

    var t = $(this);
    var v = $.trim(t.val());
    var tips = t.siblings('.j-card-tips');

    if (v === '') {
      tips.html(v).hide();
    } else {
      tips.html(v).fadeIn();
    }

  });

  $('#j-card,#j-confirm-card').on('blur', function (event) {
    var t = $(this);
    var tips = t.siblings('.j-card-tips');
    tips.hide();
  });

  // 提交绑定信息
  function bindBankInfo(info) {

    if (!info) {
      return;
    }

    $.ajax({
        url: '/account/bind_bank/ajax',
        type: 'get',
        dataType: 'json',
        data: {
          bankName: info.bank,
          bankAccount: info.card,
          password: info.pwd
        },
      })
      .done(function (data) {

        if (data.retCode == 100000) {

          $('#j-bindBank').html(info.bank);
          $('#j-bindCard').html(data.retData.bankAccount);
          $('#bind-form').hide();
          $('#bindbak-suc').fadeIn();
          $('.bindcard-tips').toggle();

        } else {

          APP.handRetCode(data.retCode, data.retMsg);
        }

      })
      .fail(function () {
        APP.showTips('服务器繁忙请稍后再试！');
      });
  }

});