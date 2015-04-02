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

  inp.init();

  // 修改密码
  $('#j-pwdsave').on('click', function () {

    var m1 = $("#mobile").val();
    var m2 = $("#newmobile").val();
    var m3 = $("#userpwd").val();

    var status = {
      m1: true,
      m2: true,
      m3: true,
    };

    var idGroup = {
      m1: 'mobile',
      m2: 'newmobile',
      m3: 'userpwd',
    };

    if (!inp.regGroup.mobile.test(m1)) {
      status.m1 = false;
    }

    if (!inp.regGroup.mobile.test(m2)) {
      status.m2 = false;
    }

    if (!inp.regGroup.pwd.test(m3)) {
      status.m3 = false;
    }

    if (inp.checkInp(status, idGroup)) {
      $.ajax({
          url: '/account/modify_mobile/ajax',
          type: 'get',
          dataType: 'json',
          data: {
            oldMobile: $("#mobile").val(),
            newMobile: $("#newmobile").val(),
            password: $("#userpwd").val()
          },
        })
        .done(function (data) {
          if (data.retCode == 100000) {
            $('.pwd-tips').fadeIn('fast', function () {
              setTimeout(function () {
                $('.pwd-tips').fadeOut();
              }, 1000);
            });
          } else {
            APP.handRetCode(data.retCode, data.retMsg);
          }
        });
    }
  });

});