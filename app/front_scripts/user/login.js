$(function () {

  $('#login-form').on('submit', function (event) {
    event.preventDefault();
    var btn = $(this).find('[type="submit"]');
    btn[0].disabled = true;
    btn.html('正在登录..');
    $.ajax({
        url: '/account/userinfo/user/dologin',
        type: 'post',
        dataType: 'json',
        data: {
          username: $('#username').val(),
          password: $('#password').val(),
          ret_url: $('#ret_url').val()
        },
      })
      .done(function (data) {
        if (data.retCode == 100000) {
          window.location.href = decodeURIComponent(data.retData.redirectURL);

        } else {
          $("#j-tips").html(data.retMsg);
          $('.tips').css('visibility', 'visible');
          btn[0].disabled = false;
          btn.html('登录');
        }
        console.log("success");
      })
      .fail(function () {
        btn[0].disabled = false;
        btn.html('登录');
        console.log("error");
      });
  });
});
