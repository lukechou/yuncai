$(function() {

  var cz = (function() {
    'use strict';

    var cz = {
      money: '',
      bank: '',
      type: '',
      setTipsTable: function() {
        $('#j-cz-sureft .item').hide();
        $('#j-cz-sureft .item'+this.type).show();
      }
    };

    return cz;

  }());

  // Next Button
  $('#j-sub-bank').on('click', function() {
    if ($(this).hasClass('selected')) {
      // var user = $('#uinfo').html();
      var bank = $('input[name=type]:checked').val();
      if (isIllageMoney()) {
        $('#js-sum-e').removeClass('hide');
      } else {
        if (bank) {
          $.ajax({
              url: '/account/pre_top_up',
              type: 'post',
              dataType: 'json',
              data: {
                money: cz.money,
                type: bank
              },
            })
            .done(function(data) {
              if (data.retCode != 100000) {
                APP.showTips(data.retMsg);
              } else {
                $('.recharge').hide();
                $('#j-money-sum').html(cz.money);
                $('.cz-sure').fadeIn();
                cz.setTipsTable();
                $('.cz-surehd-ft').html(data.retData.topUpFormHtml);
              }
            })
            .fail(function() {
              APP.onServiceFail();
            });
        } else {
          $('.js-type-e').removeClass('hide');
        }
      }
    }
  });

  function toggleTypeTips(el) {
    cz.bank = el.attr('class');
    cz.type = el.attr('data-type');
    $('#j-type-tips').find('.bank').removeClass().addClass(cz.bank);
    $('#j-type-tips').show();
    $('#j-sure-bank').removeClass().addClass(cz.bank);
  }

  function isIllageMoney() {
    cz.money = $('#js-sum').val() * 1;
    return isNaN(cz.money);
  }

  function isAllSelect() {
    if ($('input[name=type]:checked').val() && !isIllageMoney()) {
      var n = Number($('#js-sum').val());
      if (n <= 1000000 && n >= 0.01) {
        $('#j-sub-bank').addClass('selected');
      }
    }
  }

  // 金额更改
  $('#js-sum').on('change', function() {

    if (isIllageMoney()) {
      $('#j-sum-tips').html('请输入整数的金额');
      $('#js-sum-e').removeClass('hide');
      $('#js-sum-suc').addClass('hide');
    } else {
      cz.money = cz.money.toFixed(2)
      $('#js-sum').val(cz.money)

      if (cz.money < 0.01) {
        $('#j-sum-tips').html('充值金额不能小于0.01元');
        $('#js-sum-e').removeClass('hide');
        $('#js-sum-suc').addClass('hide');
      } else {
        if (cz.money > 1000000) {
          $('#j-sum-tips').html('输入的金额不能大于一百万');
          $('#js-sum-e').removeClass('hide');
          $('#js-sum-suc').addClass('hide');
        } else {
          $('#js-sum-suc').removeClass('hide');
          $('#js-sum-e').addClass('hide');
          isAllSelect();
        }
      }
    }

  });

  // 银行更改
  $('#bank-area .bank').on('click', function() {

    toggleTypeTips($(this));

    $('.bank-selected').removeClass('bank-selected');

    $(this).addClass('bank-selected');

    $(this).find('input')[0].checked = true;

    isAllSelect();

  });

  // 选择其他银行
  $('#j-sure-back').on('click', function() {
    $('.recharge').fadeIn();
    $('.cz-sure').hide();
  });


});