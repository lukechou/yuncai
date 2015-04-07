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

  var mobile = (function () {
    'use strict';

    var mobile = {
      smsControl: true,
      nextTime: 120,
      getCaptchaBtn: null,
      timeOutEvent: null,
      getOldCaptcha: function () {

        var _this = this;

        if (_this.smsControl) {
          $.ajax({
              url: '/account/bind_mobile/uno-sms/ajax',
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
              url: '/account/bind_mobile/check/ajax',
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
        var m = $('#mobile').val();

        if (inp.regGroup.mobile.test(m)) {

          if (_this.smsControl) {
            $.ajax({
                url: '/account/bind_mobile/sms/ajax',
                type: 'get',
                dataType: 'json',
                data: {
                  'mobile': m,
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

          $('#mobile').parents('.info-list').find('.j-tips-e').removeClass('hide');
          return;

        }

      },
      modifyBindMobile: function () {

        var m = $('#mobile').val();
        var c = $('#new-captcha').val();

        if (inp.regGroup.mobile.test(m)) {

          $.ajax({
              url: '/account/bind_mobile/mdf/ajax',
              type: 'get',
              dataType: 'json',
              data: {
                'mobile': m,
                'captcha': c
              }
            })
            .done(function (data) {
              if (data.retCode == 100000) {
                $('#j-info-text2').remove();
                $('#bindcard-suc').fadeIn();
                $('#bindMobile').html(m);
              } else {
                APP.handRetCode(data.retCode, data.retMsg);
              }
            });

        } else {

          $('#mobile').parents('.info-list').find('.j-tips-e').removeClass('hide');
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

    return mobile;
  }());

  /**
   * old mobile get captcha
   */
  $('#j-get-captcha').on('click', function (event) {
    mobile.getOldCaptcha();
  });

  /**
   * 校验老手机号码
   */
  $('#j-next-step').on('click', function (event) {
    mobile.checkOldMobile();
  });

  /**
   * new mobile get captcha
   */
  $('#j-get-captcha2').on('click', function (event) {
    mobile.getNewCaptcha();
  });

  /**
   * 校验老手机号码
   */
  $('#j-bind-new-mobile').on('click', function (event) {
    mobile.modifyBindMobile();
  });

});