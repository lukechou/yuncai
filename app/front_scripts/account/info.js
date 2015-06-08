require.config({
  paths: {
    jquery: '../lib/jquery',
    bootstrap: '../lib/bootstrap.min',
    app: '../common/app',
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    },
  },
});

require(['jquery', 'app', 'bootstrap'], function($, APP) {

  'use strict';

  $('#j-toggle-head').on('click', function(event) {
    event.preventDefault();

    $('#j-info-tg').show().removeClass('zoomOut').addClass('animated zoomIn');

  });

  $('#j-tg-cancel').on('click', function(event) {
    event.preventDefault();

    $('#j-info-tg').addClass('animated zoomOut');

    setTimeout(function() {
      $('#j-info-tg').hide();
    }, 500);

  });


  // 确认修改头像
  $('#j-tg-confirm').on('click', function(event) {
    event.preventDefault();
    debugger
  });

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

          switch (DATA.sex) {
            case '0':
              $('#j-info-text2 .user-head').eq(0).show();
              $('#j-info-text2 .user-head').eq(1).hide();
              break;
            case '1':
              $('#j-info-text2 .user-head').eq(0).hide();
              $('#j-info-text2 .user-head').eq(1).show();
              break;
            default:
              $('#j-info-text2 .user-head').hide();
              break;
          }

          $('#j-info-text1').hide();
          $('#j-info-text2').fadeIn();
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

    $('#j-info-text1').fadeIn()
    $('#j-info-text2').hide()

  });

});