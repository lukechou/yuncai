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

function setStart(len) {
  var str = '';
  for (var i = 0; i < len; i++) {
    str += '*';
  };
  return str;
}


$(function() {

  // Sure Bind Info
  $('#j-bind-sub').on('click', function(event) {
    event.preventDefault();

    // Get From Bind Info
    var username = $('#username').val();
    var identityCardNo = $('#number').val();
    var confirmIdentityCardNo = $('#confirm-number').val();
    var password = $('#password').val();


    // Filter Bind Info
    var reg = new RegExp('/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/');
    var isFill = reg.test(identityCardNo);
    var cardInfo = getIdCardInfo(identityCardNo);

    if (!isUserName(username)) {
      APP.showTips(APP.getConfirmHtml('请输入正确的姓名'));
      return;
    }

    if (cardInfo.isTrue) {
      var d1 = new Date().getTime();
      var d2 = new Date(cardInfo.year + '-' + cardInfo.month + '-' + cardInfo.day).getTime();
      var age = (d1 - d2) / 1000 / 31558150;
      if (age < 18) {
        APP.showTips(APP.getConfirmHtml('未满18岁不能注册！'));
        return;
      }

    } else {
      APP.showTips(APP.getConfirmHtml('输入的身份证不合法,请检查后再输入！'));
      return;
    }

    if (username == '' || identityCardNo == '' || confirmIdentityCardNo == '' || password == '') {
      APP.showTips(APP.getConfirmHtml('请先填写完整信息'));
      return;
    }
    if (identityCardNo != confirmIdentityCardNo) {
      APP.showTips(APP.getConfirmHtml('两次输入身份证号码不一致！'));
      return;
    }

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
      .done(function(data) {
        if (data.retCode == 100000) {
          $('#bind-form').hide().remove();
          $('#bindcard-suc').fadeIn();
          $('#bindName').html(username.slice(0, 1) + setStart(username.length - 1));
          $('#bindNumber').html(identityCardNo.slice(0, 6) + setStart(identityCardNo.length - 10) + identityCardNo.slice(-4));
        } else {
          APP.handRetCode(data.retCode, data.retMsg);
        }

      })
      .fail(function() {
        APP.onServerFail();
      });
  });
});