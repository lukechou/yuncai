$(function() {

  // Save Info
  $('#infosave').on('click', function() {

    //数据过滤
    var sex = $('input[name=sex]:checked').val()
    var address = $('#address').val();
    var qq = $('#userqq').val();

    if (!qq.match(/[1-9][0-9]{5,9}/)) {
      APP.showTips('QQ号码不合法！')
      return;
    }

    var DATA = {
      sex: sex,
      address: address,
      qq: qq,
    };

    $.ajax({
        url: '/account/info/ajax',
        type: 'get',
        dataType: 'json',
        data: DATA,
      })
      .done(function(data) {
        var sexStr = ['女', '男', '保密'];

        if (data.retCode == 100000) {
          $('#saved-sex').html(sexStr[DATA.sex]);
          $('#saved-address').html(address);
          $('#saved-qq').html(DATA.qq);

          switch (DATA.sex){
            case '0':
              $('#info-text2 .user-head').eq(0).show();
              $('#info-text2 .user-head').eq(1).hide();
            break;
            case '1':
              $('#info-text2 .user-head').eq(0).hide();
              $('#info-text2 .user-head').eq(1).show();
            break;
            default:
              $('#info-text2 .user-head').hide();
            break;
          }

          $('#info-text1').hide();
          $('#info-text2').fadeIn();
        } else {
          APP.handRetCode(data.retCode, data.retMsg)
        }
      })
      .fail(function() {
        APP.onServiceFail();
      });
  });

  // Back Update User Info
  $('#infoback').on('click', function() {

    $('#info-text1').fadeIn()
    $('#info-text2').hide()

  });

});