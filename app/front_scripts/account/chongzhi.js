$(function() {

  var BANK = '',
    MONEY = '';

  // Next Button
  $('#j-sub-bank').on('click', function() {

    if ($(this).hasClass('selected')) {
      var user = $('#uinfo').html();
      var bank = $('input[name=type]:checked').val();
      if (checkMoney()) {
        $('#js-sum-e').removeClass('hide');
      } else {
        if (bank) {
          $('.recharge').hide();
          $('#j-money-sum').html(MONEY);
          $('.cz-sure').fadeIn();
          console.log(user, MONEY, bank);
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

  function checkMoney() {
    MONEY = parseInt($('#js-sum').val());
    return isNaN(MONEY);
  }

  // 金额更改
  $('#js-sum').on('change', function() {
    if (checkMoney()) {
      $('#js-sum-e').removeClass('hide');
      $('#js-sum-suc').addClass('hide');
    } else {
      $('#js-sum-suc').removeClass('hide');
      $('#js-sum-e').addClass('hide');
      if ($('input[name=type]:checked').val()) {
        $('#j-sub-bank').addClass('selected');
      }
    }
  });

  // 银行更改
  $('#bank-area .bank').on('click', function() {
    toggleTypeTips($(this));
    $('.bank-selected').removeClass('bank-selected');
    $(this).addClass('bank-selected');
    $(this).find('input')[0].checked = true;
    if (!checkMoney()) $('#j-sub-bank').addClass('selected');
  });

  // 选择其他银行
  $('#j-sure-back').on('click', function() {
    $('.recharge').fadeIn();
    $('.cz-sure').hide();
  });


});