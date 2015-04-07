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

  // 初始化 右侧 tips
  inp.init();

  var email = (function () {
    'use strict';

    var email = {
      smsControl: true,
      nextTime: 120,
      getCaptchaBtn: null,
      timeOutEvent: null,
      getOldCaptcha: function () {

        var _this = this;

        if (_this.smsControl) {
          $.ajax({
              url: '/account/bind_mail/uno-mail/ajax',
              type: 'get',
              dataType: 'json',
            })
            .done(function (data) {
              if (data.retCode == 100000) {
                _this.getCaptchaBtn = 'j-get-captcha';
                _this.initSmsEvent();
              } else {
                APP.handRetCode(data.retCode, data.retMsg);
              }
            });
        } else {
          return;
        }

      },
      clearRun: function () {

        var _this = this;
        clearInterval(_this.timeOutEvent);

      },
      checkOldMobile: function () {

        var _this = this;
        var c = $('#old-captcha').val();
        var p = $('#userpwd').val();

        if (inp.regGroup.pwd.test(p)) {

          $.ajax({
              url: '/account/bind_mail/check/ajax',
              type: 'get',
              dataType: 'json',
              data: {
                'captcha': c,
                'password': p
              }
            })
            .done(function (data) {
              if (data.retCode == 100000) {
                $('#j-info-text').remove();
                $('#j-info-text2').fadeIn();
                _this.updateSmSEvent(false);
                _this.clearRun();
              } else {
                APP.handRetCode(data.retCode, data.retMsg);
              }
            });

        } else {

          $('#userpwd').parents('.info-list').find('.j-tips-e').removeClass('hide');
          return;

        }
      },
      getNewCaptcha: function () {

        var _this = this;
        var el = $('#email');
        var m = el.val();

        if (inp.regGroup.email.test(m)) {

          if (_this.smsControl) {
            $.ajax({
                url: '/account/bind_mail/upwd-mail/ajax',
                type: 'get',
                dataType: 'json',
                data: {
                  'email': m,
                }
              })
              .done(function (data) {
                if (data.retCode == 100000) {
                  _this.getCaptchaBtn = 'j-get-captcha2';
                  _this.initSmsEvent();
                } else {
                  APP.handRetCode(data.retCode, data.retMsg);
                }
              });

          } else {
            return;
          }

        } else {

          el.parents('.info-list').find('.j-tips-e').removeClass('hide');
          return;

        }

      },
      modifyBindMobile: function () {
        var el = $('#email');
        var m = el.val();
        var c = $('#new-captcha').val();

        if (inp.regGroup.email.test(m)) {

          $.ajax({
              url: '/account/bind_mail/ajax',
              type: 'get',
              dataType: 'json',
              data: {
                'email': m,
                'captcha': c
              }
            })
            .done(function (data) {
              if (data.retCode == 100000) {
                $('#j-info-text2').remove();
                $('#bindcard-suc').fadeIn();
                $('#bindEmail').html(m);
              } else {
                APP.handRetCode(data.retCode, data.retMsg);
              }
            });

        } else {

          el.parents('.info-list').find('.j-tips-e').removeClass('hide');
          return;

        }
      },
      updateSmsBtn: function (str) {

        $("#" + this.getCaptchaBtn).html(str);

      },
      updateSmSEvent: function (noEvent) {

        var _this = this;

        if (noEvent) {

          _this.smsControl = 0;
          $("#" + this.getCaptchaBtn).addClass('no-event');

        } else {

          _this.smsControl = 1;
          $("#" + this.getCaptchaBtn).removeClass('no-event');

        }

      },

      initSmsEvent: function () {

        var _this = this;

        _this.reStartTime = (+new Date()) + _this.nextTime * 1000;

        _this.updateSmsBtn(_this.nextTime + '秒后可重新发送');
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

            _this.updateSmsBtn('重新发送');
            _this.updateSmSEvent(false);
            _this.clearRun();

          }

        }, 1000);

      }
    };

    return email;
  }());

  /**
   * old email get captcha
   */
  $('#j-get-captcha').on('click', function (event) {
    email.getOldCaptcha();
  });

  /**
   * 校验老手机号码
   */
  $('#j-next-step').on('click', function (event) {
    email.checkOldMobile();
  });

  /**
   * new email get captcha
   */
  $('#j-get-captcha2').on('click', function (event) {
    email.getNewCaptcha();
  });

  /**
   * 校验老手机号码
   */
  $('#j-bind-new-email').on('click', function (event) {
    email.modifyBindMobile();
  });

});