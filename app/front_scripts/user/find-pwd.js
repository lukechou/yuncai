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
  /**
   * 输入用户名获取可以找回密码的方式
   */
  $('#j-start-find').on('click', function(event) {
    var fdUserName = APP.filterStr($.trim($('#username').val()));
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
        if (data.retCode != 120036) {
          $('#j-set-user').hide();
          $('#j-choose-way').fadeIn();
          // 手机是否绑定
          if (data.retData.mobile != '') {
            $('#j-choose-way li[data-method="mobile"]').removeClass('disable');
            $('#mobile_status_img').removeClass('mobile');
            $('#mobile_status_img').addClass('mobile_active');
            $('#fd_mobile').html(data.retData.mobile);
          }
          // 邮箱是否绑定
          if (data.retData.email.address != '') {
            $('#j-choose-way li[data-method="email"]').removeClass('disable');
            $('#email_status_img').removeClass('email');
            $('#email_status_img').addClass('email_active');
            $('#mail_server').val(data.retData.email.host);
            $('.j-fd-email').html(data.retData.email.address);
          }
        } else {
          $('#j-set-tips').fadeIn();
          // APP.showTips(data.retMsg);
          $('#first_tips').html('请输入正确的用户名');
        }
      })
      .fail(function() {
        APP.showTips("系统繁忙，请联系客服");
      });
  });

  /**
   * 选择找回密码的方式
   */
  $('#j-choose-way .f-step-ls').on('click', 'li', function(event) {
    var method = APP.filterStr($(this).attr('data-method'));
    if ('customer' == method) {
      return;
    }
    $('#j-choose-way').hide();
    $('#j-' + method + '-way').fadeIn();
  });

  var lessActiveSeconds = 0;
  
  /**
   * 发送手机短信
   */
  $('#j-get-mobile-code').on('click', function(event) {
    event.preventDefault();
    $('#j-get-mobile-code').attr('disabled', true);
    /* Act on the event */
    var fdUserName = APP.filterStr($.trim($('#username').val()));
    // 发送短信
    $.ajax({
        url: '/account/userinfo/ucenter/getPwdCheckUser',
        type: 'GET',
        dataType: 'json',
        data: {
          username: fdUserName
        },
      })
      .done(function(data) {
        if (data.retCode == 100000) {
          lessActiveSeconds = 120;
          var itv = setInterval(function() {
              lessActiveSeconds--;
              if(lessActiveSeconds <=0){
                  lessActiveSeconds = 0;
                  $('#j-get-mobile-code').html("重新获取验证码");
                  $('#j-get-mobile-code').attr('disabled', false);
                  clearInterval(itv);
              }else{
                  time4NextCode();
              }
          }, 1000);
          $('#j-get-mobile-code').attr('disabled', true);
        } else {
          APP.showTips(data.retMsg);
          $('#j-get-mobile-code').attr('disabled', false);
        }
      })
      .fail(function() {
          APP.showTips("系统繁忙，请联系客服");
      });
  });

   function time4NextCode(){
       if(lessActiveSeconds < 100){
           $('#j-get-mobile-code').html(" "+lessActiveSeconds.toString() +'秒后可重新获取');
       }else if(lessActiveSeconds < 10){
           $('#j-get-mobile-code').html("  "+lessActiveSeconds.toString() +'秒后可重新获取');
       }else if(lessActiveSeconds > 0) {
           $('#j-get-mobile-code').html(lessActiveSeconds+'秒后可重新获取');
       }else{
           $('#j-get-mobile-code').html("重新获取验证码");
           $('#j-get-mobile-code').attr('disabled', false);
       }
   }
  
  /**
   * 提交验证码
   */
  $('#j-sub-mobile').on('click', function(event) {
    var fdUserName = APP.filterStr($.trim($('#username').val()));
    // 验证输入的校验码
    $.ajax({
        url: '/account/userinfo/ucenter/doPostPwd',
        type: 'GET',
        dataType: 'json',
        data: {
          username: fdUserName,
          vf_code: $('#mobile_code').val()
        },
      })
      .done(function(data) {
        if (data.retCode == 100000) {
          $('#j-mobile-way').hide();
          $('#j-reset-pwd').fadeIn();
          $('#way').val(1);
          $('#vf_code').val($('#mobile_code').val());
        } else {
          $('#j-mobile-tips').show();
        }
      })
      .fail(function() {
//        APP.showTips("系统繁忙，请联系客服");
        $('#j-mobile-tips').show();
      });
  });

  $('#j-login-mail').on('click', function(event) {
    event.preventDefault();
    /* Act on the event */
    window.open($('#mail_server').val());
  });

  /**
   * 发送邮件验证码内容
   */
  $('#j-send-email').on('click', function(event) {
      sendMail(false);
  });
  
  $('#j-send-mail-again').on('click', function(event) {
      sendMail(true);
  });
  
  function sendMail(bool){
      var fdUserName = APP.filterStr($.trim($('#username').val()));
      // 发送邮件
      $.ajax({
          url: '/account/send-verify-mail',
          type: 'GET',
          dataType: 'json',
          data: {
            username: fdUserName
          },
        })
        .done(function(data) {
          if (data.retCode == 100000) {
            $('#j-email-way').hide();
            $('#j-email-sure').fadeIn();
            bool && $('.j-send-rst').html('发送成功');
          } else {
            APP.showTips(data.retMsg);
          }
        })
        .fail(function() {
          APP.showTips("系统繁忙，请联系客服");
        });
  }
  
  /**
   * 发送邮件验证码内容
   */
  $('#j-next-email').on('click', function(event) {
    var fdUserName = APP.filterStr($.trim($('#username').val()));
    // 发送邮件
    $.ajax({
        url: '/account/check-mail-verify-code',
        type: 'GET',
        dataType: 'json',
        data: {
          username: fdUserName,
          vf_code: $('#email_code').val(),
        },
      })
      .done(function(data) {
        if (data.retCode == 100000) {
          $('#j-email-sure').hide();
          $('#j-reset-pwd').fadeIn();
          $('#way').val(2);
          $('#vf_code').val($('#email_code').val());
        } else {
          $('#j-email-tips').show();
        }
      })
      .fail(function() {
        APP.showTips("系统繁忙，请联系客服");
      });
  });

  $('#j-sub-modify').on('click', function(event) {
    event.preventDefault();
    /* Act on the event */
    var newPassword = $('#new_password').val();
    var oldPassword = $('#ensure_password').val();
    if (newPassword != oldPassword) {
      $('#j-modify-tips').html("两次输入的密码不一致！");
      $('#j-password-tips').show();
      return;
    }
    var fdUserName = APP.filterStr($.trim($('#username').val()));
    var url = '';
    switch (parseInt($('#way').val(), 10)) {
      case 1:
        url = '/account/userinfo/ucenter/resetPwd';
        break;
      case 2:
        url = '/account/reset-password-by-mail';
        break;
      default:
        return;
    }
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        data: {
          username: fdUserName,
          password: newPassword,
          vf_code: $('#vf_code').val()
        },
      })
      .done(function(data) {
        if (data.retCode == 100000) {
          APP.showTips("修改成功");
          setTimeout(function() {
            window.location.href = '/account/login';
          }, 1500);
        } else {
          $('#j-modify-tips').html(data.retMsg);
          $('#j-password-tips').show();
        }
      })
      .fail(function() {
        APP.showTips("系统繁忙，请联系客服");
      });
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
