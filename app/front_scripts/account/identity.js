$(function() {

  //确认绑定
  $('#j-bind-sub').on('click', function(event) {
    event.preventDefault();
    var username = $('#username').val();
    var identityCardNo = $('#number').val();
    var confirmIdentityCardNo = $('#confirm-number').val();
    var password = $('#password').val();
    var reg = new RegExp('/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/');

    var isFill = reg.test(identityCardNo);

    if (!isUserName(username)) {
      APP.showTips(APP.getConfirmHtml('请输入正确的姓名'));
    }
    return;
    debugger
    if (!isFill) {
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

    function isUserName(user){
      var reg1 = new RegExp('/[\u4e00-\u9fa5]{2,6}/g');
      return reg.test(user);
    }

    function setStart(len) {
      var str = '';
      for (var i = 0; i < len; i++) {
        str += '*';
      };
      return str;
    }

    //Ajax 提交绑定信息
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
        APP.showTips('服务器繁忙请稍后再试！');
        console.log("error");
      });

  });
});