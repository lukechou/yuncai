$(function() {
  var BANK = '',
    MONEY = '';
  // Next Button
  $('#j-sub-bank').on('click', function() {
    if ($(this).hasClass('selected')) {
      // var user = $('#uinfo').html();
      var bank = $('input[name=type]:checked').val();
      if (isIllageMoney()) {
        $('#js-sum-e').removeClass('hide');
      } else {
        if (bank) {
          console.log(MONEY, bank);
          $.ajax({
              url: '/account/pre_top_up',
              type: 'post',
              dataType: 'json',
              data: {
                money: MONEY,
                type: bank
              },
            })
            .done(function(data) {
              if (data.retCode != 100000) {
                APP.showTips(data.retMsg);
              } else {
                $('.recharge').hide();
                $('#j-money-sum').html(MONEY);
                $('.cz-sure').fadeIn();
                $('.cz-surehd-ft').html(data.retData.topUpFormHtml);
              }
            })
            .fail(function() {
              APP.onServerFail();
            });
        } else {
          $('.js-type-e').removeClass('hide');
        }
      }
    }
  });

  function toggleTypeTips(el) {
    var BANK = el.attr('class');
    $('#j-type-tips').find('.bank').removeClass().addClass(BANK);
    $('#j-type-tips').show();
    $('#j-sure-bank').removeClass().addClass(BANK);
  }

  function isIllageMoney() {
    MONEY = $('#js-sum').val() * 1;
    return isNaN(MONEY);
  }

  function isAllSelect() {
    if ($('input[name=type]:checked').val() && !isIllageMoney()) {
      if (Number($('#js-sum').val()) <= 1000000) {
        $('#j-sub-bank').addClass('selected');
      }
    }
  }

  // 金额更改
  $('#js-sum').on('change', function() {
    if (isIllageMoney()) {
      $('#js-sum-e').html('请输入整数的金额')
      $('#js-sum-e').removeClass('hide');
      $('#js-sum-suc').addClass('hide');
    } else {
      MONEY = MONEY.toFixed(2)
      $('#js-sum').val(MONEY)

      if (MONEY < 0.01) {
        $('#js-sum-e').html('充值金额不能小于0.01元')
        $('#js-sum-e').removeClass('hide');
        $('#js-sum-suc').addClass('hide');
      } else {
        if (MONEY > 1000000) {
          $('#js-sum-e').html('输入的金额不能大于一百万')
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