require.config({
  paths: {
    jquery: '../lib/jquery',
    lodash: '../lib/lodash.compat.min',
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

require(['jquery', 'lodash', 'app', 'bootstrap'], function($, _, APP) {

  /*
  输入用户名获取可以找回密码的方式
  */
  $('#j-sub').on('click', function(event) {
    var username = APP.filterStr($.trim($('#username').val()));
    var userLen = GetLength(username);
    if (!username || userLen < 3 || userLen > 16) {
      $('#j-set-tips').fadeIn();
    } else {
      var fdUserName = $('#username').val();
      $('.j-fd-user').html(fdUserName);
      $.ajax({
          url: '/account/feedback/get-user-mobile',
          type: 'GET',
          dataType: 'json',
          data: {
            username: fdUserName
          },
        })
        .done(function(data) {
          if (data.retCode == 100000) {
            $('#j-set-user').hide();
            $('#j-choose-way').fadeIn();
            // 手机是否绑定
            if (data.retData.mobile != '') {
              $('#mobile_status_img').addClass('active');
              $('#fd_mobile').html(data.retData.mobile);
            }

            // 邮箱是否绑定
            if (data.retData.email != '') {
              $('#email_status_img').addClass('active');
              $('#j-next-email').html(data.retData.email);
            }
          } else {
            // 请联系客服
          }
        })
        .fail(function() {
          // 请联系客服
        });
    }
  });

  /*
  选择找回密码的方式
  */
  $('#j-choose-way .f-step-ls').on('click', 'li', function(event) {
    $('#j-choose-way').hide();
    var method = APP.filterStr($(this).attr('data-method'));
    var fdUserName = APP.filterStr($.trim($('#username').val()));
    $('#j-' + method + '-way').fadeIn();
    switch (method) {
      case 'mobile':
        // 发送短信
        $.ajax({
          url: '/account/userinfo/ucenter/getPwdCheckUser',
          type: 'GET',
          dataType: 'json',
          data: {username: fdUserName},
        })
        .done(function(data) {
          if(data.retCode == 100000){
            console.log("success");
          }else{
            console.log("success");
          }
        })
        .fail(function() {
          console.log("error");
        });
        break;

      case 'email':
        $('#j-' + method + '-way').fadeIn();
        // 发送邮件
        $.ajax({
          url: '/account/send-verify-mail',
          type: 'GET',
          dataType: 'json',
          data: {username: fdUserName},
        })
        .done(function(data) {
          if(data.retCode == 100000){
            console.log("success");
          }else{
            console.log("success");
          }
        })
        .fail(function() {
          console.log("error");
        });
        break;

      default:
        break;
    }
  });


  $('#j-sub-mobile').on('click', function(event) {
    $('#j-mobile-way').hide();
    // show tips
    $('#j-mobile-tips').show();
    // go to set
    $('#j-reset-pwd').fadeIn();
  });

  $('#j-next-email').on('click', function(event) {
    $('#j-email-way').hide();
    $('#j-email-sure').fadeIn();
  });



  function GetLength(str) {
    var realLength = 0,
      len = str.length,
      charCode = -1;
    for (var i = 0; i < len; i++) {
      charCode = str.charCodeAt(i);
      if (charCode >= 0 && charCode <= 128) realLength += 1;
      else realLength += 2;
    }
    return realLength;
  };

});
