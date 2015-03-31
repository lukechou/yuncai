$(function () {

  // 确认绑定button
  $('#j-bind-sub').on('click', function (event) {
    event.preventDefault();

    var info = {};
    var bank = $.trim($('#j-yinhang').val()) || '';
    var card = $.trim($('#j-card').val()) || '' ;
    var confirmCard = $.trim($('#j-confirm-card').val()) || '';
    var pwd = $.trim($('#j-pwd').val()) || '';


    if (bank == '' || card == '' || confirmCard == '' || pwd == '') {
      APP.showTips('请先填写完整信息');
      return;
    }

    if (card != confirmCard) {
      APP.showTips('两次输入银行卡号不一致！');
      return;
    }

    info.bank = bank;
    info.card = card;
    info.pwd = pwd;
    bindBankInfo(info);

  });


  //用户在输入银行卡号时须放大当前已输入的号码
  $('#j-card,#j-confirm-card').on('keyup', function(event) {
    event.preventDefault();

    var t = $(this);
    var v = $.trim(t.val());
    var tips = t.siblings('.j-card-tips');

    if(v===''){
      tips.html(v).hide();
    }else{
      tips.html(v).fadeIn();
    }

  });

  $('#j-card,#j-confirm-card').on('blur', function(event) {
    var t = $(this);
    var tips = t.siblings('.j-card-tips');
    tips.hide();
  });

  // 提交绑定信息
  function bindBankInfo(info) {

    if(!info){
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