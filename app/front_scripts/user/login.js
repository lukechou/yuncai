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
          password: $('#password').val()
        },
      })
      .done(function (data) {
        if (data.retCode == 100000) {
          window.location.href = data.retData.redirectURL;
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

  $('#j-find-pwd').on('click', function (event) {
    event.preventDefault();
    APP.showTips('<p>请致电客服，由客服人员为您解决。<br>客服中心电话：4008-898-310</p>');
  });

});