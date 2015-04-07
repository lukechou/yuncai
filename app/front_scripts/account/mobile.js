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

  inp.init();

  var Mobile = (function () {
    'use strict';

    var Mobile = {
      reStartTime: null,
      timeOutEvent: null,
      init: function () {
        var _this = this;

        // 手机号码绑定按钮
        $('#j-infosave').on('click', function () {

          var m1 = $("#usermobile").val();
          var m2 = $("#userpwd").val();

          var status = {
            m1: true,
            m2: true,
          };

          var idGroup = {
            m1: 'usermobile',
            m2: 'userpwd',
          };

          if (!inp.regGroup.mobile.test(m1)) {
            status.m1 = false;
          }

          if (!inp.regGroup.pwd.test(m2)) {
            status.m2 = false;
          }

          if (inp.checkInp(status, idGroup)) {
            $.ajax({
                url: '/account/bind_mobile/ajax',
                type: 'get',
                dataType: 'json',
                data: {
                  mobile: m1,
                  captcha: $('#checknum').val(),
                  password: m2
                },
              })
              .done(function (data) {

                if (data.retCode == 100000) {

                  $('#bindMobile').html(m1)
                  $('#j-info-text').hide();
                  $('#bindcard-suc').fadeIn();

                } else {
                  APP.handRetCode(data.retCode, data.retMsg);
                }

              });
          }
        });

        // SMS 信息发送按钮
        $("#send_captcha_sms").on('click', function (event) {
          event.preventDefault();
          var mb = $("#usermobile").val();

          if (!inp.regGroup.mobile.test(mb)) {
            $('#usermobile').parents('.info-list').find('.j-tips-e').removeClass('hide');
            _this.smsControl = false;
            return;
          }else{
            _this.smsControl = true;
          }

          if (_this.smsControl) {
            $.ajax({
                url: '/account/bind_mobile/sms/ajax',
                type: 'get',
                dataType: 'json',
                data: {
                  mobile: $('#usermobile').val()
                },
              })
              .done(function (data) {

                if (data.retCode == 100000) {

                  $("#j-sms-tips").removeClass('hide');
                  Mobile.initSmsEvent();

                } else {
                  APP.handRetCode(data.retCode, data.retMsg);
                }

              });
          }
        });

      },
      smsControl: true,
      updateSmsBtn: function (str) {
        $("#send_captcha_sms").html(str);
      },
      updateSmSEvent: function (noEvent) {
        var _this = this;
        if (noEvent) {
          _this.smsControl = 0;
          $("#send_captcha_sms").addClass('active');
        } else {
          _this.smsControl = 1;
          $("#send_captcha_sms").removeClass('active');
        }
      },
      initSmsEvent: function () {

        var _this = this;
        var nextTime = 120;

        _this.reStartTime = (+new Date()) + 120 * 1000;

        _this.updateSmsBtn(nextTime + '秒后可重新发送');
        _this.updateSmSEvent(true);

        _this.timeOutEvent = setInterval(function () {

          var html = '';
          var d = +new Date();
          var c = ((_this.reStartTime - d) / 1000).toFixed(0);

          if (c > 0) {

            html = c;
            html += '秒后可重新发送';
            _this.updateSmsBtn(html);

          } else {

            $("#j-sms-tips").addClass('hide');
            _this.updateSmsBtn('重新发送');
            _this.updateSmSEvent(false);
            clearInterval(_this.timeOutEvent);

          }

        }, 1000);

      }
    };

    return Mobile;
  }());

  Mobile.init();
});