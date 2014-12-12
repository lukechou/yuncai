$(function() {

  // Register
  $('#register-form').on('submit', function(event) {
    event.preventDefault();

    var user = $.trim($("#username").val());
    var pwd = $.trim($('#password').val());
    var code = $.trim($('#check_code').val());
    var agreen = $('#j-agreen')[0].checked;

    if (!agreen) {
      APP.showTips('请先阅读并同意《注册协议》后才能继续')
      return;
    }
    if (!user || user.length < 3 || user.length > 16) {
      APP.showTips('用户名由长度为3-16个字符，只能由字母，数字，汉字组成')
      return;
    }

    if (!pwd || pwd.length < 6 || pwd.length > 16) {
      APP.showTips('密码由长度为6-16个字符，不能使用空格')
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

  // Replace Check Image
  $('#j-replace-check').on('click', function(event) {

    var img = new Image('');
    var d = new Date().getTime()
    img.src = '/tools/captcha?' + d

    var checkImg = document.getElementById('j-check-img')
    checkImg.src = img.src

  });

});