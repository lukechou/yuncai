$(function() {

  // Register
  $('#register-form').on('submit', function(event) {
    event.preventDefault();

    var user = $.trim($("#username").val());
    var pwd = $.trim($('#password').val());
    var repwd = $.trim($('#repassword').val());
    var code = $.trim($('#check_code').val());
    var agreen = $('#j-agreen')[0].checked;
    var l = GetLength(user);

    if (!agreen) {
      APP.showTips('请先阅读并同意《注册协议》后才能继续')
      return;
    }

    if (!user || l < 3 || l > 16) {
      APP.showTips('用户名由长度为3-16个字符，只能由字母，数字，汉字组成')
      return;
    }

    if (!pwd || pwd.length < 6 || pwd.length > 16) {
      APP.showTips('密码由长度为6-16个字符，不能使用空格')
      return;
    }
    if (repwd != pwd) {
      APP.showTips('两次输入的密码不一致')
      return;
    }

    if (user && pwd && code) {
      $.ajax({
          url: '/account/doRegister',
          type: 'get',
          dataType: 'json',
          data: {
            username: user,
            password: pwd,
            code: code
          },
        })
        .done(function(data) {
          if (data.retCode == 100000) {
            $('#register-form').hide();
            $('#reg-success').fadeIn();
            $('#showUserName').html($("#username").val());
            isLogined();
          } else {
            APP.showTips(data.retMsg);
          }
        })
        .fail(function() {
          APP.showTips('服务器错误!')
        });
    } else {
      APP.showTips('请先输入完整注册信息!')
    }

  });

  $('#password').on('change', function(event) {
    event.preventDefault();
    /* Act on the event */
    $(this).val($(this).val().replace(/ /g, ''));
  });

  $('#repassword').on('change', function(event) {
    event.preventDefault();
    /* Act on the event */
    $(this).val($(this).val().replace(/ /g, ''));
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

  function isLogined() {
    var html = '';
    $.ajax({
        url: '/account/islogin',
        type: 'get',
        dataType: 'json',
      })
      .done(function(data) {
        if (data.retCode === 100000) {

          html = '<span>欢迎来到彩胜网&nbsp;!&nbsp;&nbsp;&nbsp;&nbsp;<img src="' + staticHostURI + '/front_images/bor.png" alt="bor"></span>' + data.retData.username + '       账户余额:<span id="userMoney">' + data.retData.money + '</span>元<a href="/account/top-up" class="active">充值</a><img src="http://static3.yuncai.com/front_images/bor.png" alt="bor"><a href="/account/logout">退出</a><img src="http://static3.yuncai.com/front_images/bor.png" alt="bor"><a href="/account/index" class="last">我的账户</a><img src="http://static3.yuncai.com/front_images/top-down.png" alt="bor">';
          $('#hd-top').html(html);
        }
      });
  }

  // Replace Check Image
  $('#j-replace-check').on('click', function(event) {

    var img = new Image('');
    var d = new Date().getTime()
    img.src = '/tools/captcha?' + d

    var checkImg = document.getElementById('j-check-img')
    checkImg.src = img.src

  });

});
