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

  inp.init({
    parentClass: '.form-group',
    onBlur: function () {
      var _this = this;
      var number = $.trim($('#number').val());
      var confirmNumber = $.trim($('#confirm-number').val());

      // 姓名验证
      if (_this.method == 0) {
        if (!isUserName(_this.val)) {
          _this.errorShow();
        } else {
          _this.successShow();
        }
      }

      // 身份证验证
      if (_this.method == 1) {

        var identityCardNo = _this.val;
        var cardInfo = getIdCardInfo(identityCardNo);
        if (cardInfo.isTrue) {

          var d1 = new Date().getTime();
          var d2 = new Date(cardInfo.year + '-' + cardInfo.month + '-' + cardInfo.day).getTime();
          var age = (d1 - d2) / 1000 / 31558150;
          if (age < 18) {
            _this.errorShow();
          } else {
            _this.successShow();
          }

        } else {
          _this.errorShow();
        }

      }

      // 身份证二次确认
      if (_this.method == 2) {
        if (confirmNumber == '') {
          _this.hideAllTips();
          return;
        }
        if (number !== confirmNumber) {
          _this.errorShow();
        } else {
          _this.successShow();
        }

      }

      // 密码验证
      if (_this.method == 3) {

        if (inp.regGroup.pwd.test(_this.val)) {

          _this.successShow();

        } else {

          _this.errorShow();

        }
      }
    }
  });

  function getIdCardInfo(cardNo) {

    var info = {
      isTrue: false,
      year: null,
      month: null,
      day: null,
      isMale: false,
      isFemale: false
    };

    if (!cardNo && 15 != cardNo.length && 18 != cardNo.length) {
      info.isTrue = false;
      return info;
    }
    if (15 == cardNo.length) {
      var year = cardNo.substring(6, 8);
      var month = cardNo.substring(8, 10);
      var day = cardNo.substring(10, 12);
      var p = cardNo.substring(14, 15); //性别位
      var birthday = new Date(year, parseFloat(month) - 1,
        parseFloat(day));
      // 对于老身份证中的年龄则不需考虑千年虫问题而使用getYear()方法
      if (birthday.getYear() != parseFloat(year) || birthday.getMonth() != parseFloat(month) - 1 || birthday.getDate() != parseFloat(day)) {
        info.isTrue = false;
      } else {
        info.isTrue = true;
        info.year = birthday.getFullYear();
        info.month = birthday.getMonth() + 1;
        info.day = birthday.getDate();
        if (p % 2 == 0) {
          info.isFemale = true;
          info.isMale = false;
        } else {
          info.isFemale = false;
          info.isMale = true
        }
      }
      return info;
    }
    if (18 == cardNo.length) {
      var year = cardNo.substring(6, 10);
      var month = cardNo.substring(10, 12);
      var day = cardNo.substring(12, 14);
      var p = cardNo.substring(14, 17)
      var birthday = new Date(year, parseFloat(month) - 1,
        parseFloat(day));
      // 这里用getFullYear()获取年份，避免千年虫问题
      if (birthday.getFullYear() != parseFloat(year) || birthday.getMonth() != parseFloat(month) - 1 || birthday.getDate() != parseFloat(day)) {
        info.isTrue = false;
        return info;
      }

      var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
      var Y = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X
      // 验证校验位
      var sum = 0; // 声明加权求和变量
      var _cardNo = cardNo.split("");
      if (_cardNo[17].toLowerCase() == 'x') {
        _cardNo[17] = 10; // 将最后位为x的验证码替换为10方便后续操作
      }
      for (var i = 0; i < 17; i++) {
        sum += Wi[i] * _cardNo[i]; // 加权求和
      }
      var i = sum % 11; // 得到验证码所位置
      if (_cardNo[17] != Y[i]) {
        info.isTrue = false;
        return info;
      }
      info.isTrue = true;
      info.year = birthday.getFullYear();
      info.month = birthday.getMonth() + 1;
      info.day = birthday.getDate();

      if (p % 2 == 0) {
        info.isFemale = true;
        info.isMale = false;
      } else {
        info.isFemale = false;
        info.isMale = true
      }
      return info;
    }
    return info;
  }

  function isUserName(user) {
    var reg = new RegExp(/^[\u4E00-\u9FA5]+$/i);
    return reg.test(user);
  }

  // Sure Bind Info
  $('#j-bind-sub').on('click', function (event) {
    event.preventDefault();

    // Get From Bind Info
    var username = $('#username').val();
    var identityCardNo = $('#number').val();
    var confirmIdentityCardNo = $('#confirm-number').val();
    var password = $('#password').val();

    // Filter Bind Info
    var cardInfo = getIdCardInfo(identityCardNo);

    var status = {
      userName: true,
      identityCardNo: true,
      identityCardNo18: true,
      pwd: true,
      ckPwd: true
    };

    var idGroup = {
      userName: 'username',
      identityCardNo: 'number',
      identityCardNo18: '',
      ckPwd: 'confirm-number',
      pwd: 'password'
    };

    if (!isUserName(username)) {
      status.userName = false;
    }

    if (cardInfo.isTrue) {

      var d1 = new Date().getTime();
      var d2 = new Date(cardInfo.year + '-' + cardInfo.month + '-' + cardInfo.day).getTime();
      var age = (d1 - d2) / 1000 / 31558150;
      if (age < 18) {
        status.identityCardNo18 = false;
      }

    } else {
      status.identityCardNo = false;
    }

    if (!inp.regGroup.pwd.test(password)) {
      status.pwd = false;
    }

    if (identityCardNo != confirmIdentityCardNo) {
      status.ckPwd = false;
    }

    if (inp.checkInp(status, idGroup)) {

      // Save Bind Identity Info
      $.ajax({
          url: '/account/bind_identity/ajax',
          type: 'post',
          dataType: 'json',
          data: {
            realName: username,
            identityCardNo: identityCardNo,
            password: password
          },
        })
        .done(function (data) {

          if (data.retCode == 100000) {

            $('#bind-form').remove();
            $('#bindcard-suc').fadeIn();
            $('#bindName').html(username);
            $('#bindNumber').html(identityCardNo);

          } else {

            APP.handRetCode(data.retCode, data.retMsg);

          }

        })
        .fail(function () {
          APP.onServiceFail();
        });

    }

  });

});