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

require(['jquery', 'app', 'bootstrap'], function ($, APP) {

  var Inp = (function () {
    'use strict';

    var Inp = {
      Parent: null,
      elParent: function (el) {
        return el.parents('.info-list');
      },
      init: function () {
        var _this = this;

        $('.j-tips-inp').on('focus', function (event) {

          _this.Parent = _this.elParent($(this));
          _this.warmingShow();

        });

        $('.j-tips-inp').on('blur', function (event) {

          var method = $(this).attr('data-method');
          var v = $(this).val();
          var newPwd = $.trim($('#newpwd').val());
          var checkPwd = $.trim($('#checkpwd').val());

          _this.Parent = _this.elParent($(this));

          if (method == 2) {
            if (newPwd !== checkPwd) {
              _this.errorShow();
            } else {
              _this.successShow();
            }
          } else {

            if (/^[^\s]{6,15}$/.test(v)) {
              _this.successShow();
            } else {
              _this.errorShow();
            }

          }
        });

      },
      checkInp: function (userPwd, newPwd, checkPwd) {

        var _this = this;
        var paramStatus = true;

        if (!/^[^\s]{6,15}$/.test(userPwd)) {

          paramStatus = false;
          _this.Parent = _this.elParent($('#userpwd'));
          _this.errorShow();

        }

        if (!/^[^\s]{6,15}$/.test(newPwd)) {

          paramStatus = false;
          _this.Parent = _this.elParent($('#newpwd'));
          _this.errorShow();

        }

        if (checkPwd !== newPwd) {

          paramStatus = false;
          _this.Parent = _this.elParent($('#checkpwd'));
          _this.errorShow();

        }

        return paramStatus;

      },
      hideAllTips: function () {
        this.Parent.find('.j-tips-s,.j-tips-e,.j-tips-w').addClass('hide');
      },
      successShow: function () {
        this.hideAllTips();
        this.Parent.find('.j-tips-s').removeClass('hide');
      },
      errorShow: function () {
        this.hideAllTips();
        this.Parent.find('.j-tips-e').removeClass('hide');
      },
      warmingShow: function () {
        this.hideAllTips();
        this.Parent.find('.j-tips-w').removeClass('hide');
      }
    };

    return Inp;
  }());

  Inp.init();

  //修改密码
  $('#j-pwdsave').on('click', function () {

    var userPwd = $.trim($('#userpwd').val());
    var newPwd = $.trim($('#newpwd').val());
    var checkPwd = $.trim($('#checkpwd').val());

    if (Inp.checkInp(userPwd, newPwd, checkPwd)) {

      $.ajax({
          url: '/account/modify_password/ajax',
          type: 'post',
          dataType: 'json',
          data: {
            userPwd: userPwd,
            newPwd: newPwd,
            checkPwd: checkPwd
          }
        })
        .done(function (data) {

          if (data.retCode == 100000) {
            Inp.hideAllTips();
            $('.pwd-tips').fadeIn('fast', function () {

              setTimeout(function () {
                $('.pwd-tips').fadeOut();
              }, 1000);

            });

          } else {

            APP.showTips(data.retMsg);

          }

        })
        .fail(function () {

          APP.showTips('服务器繁忙,请稍后再试');

        });

    }

  });

});