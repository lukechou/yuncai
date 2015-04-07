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

   $('#j-send').on('click', function () {

     var m1 = $("#email").val() || '';
     var m2 = $("#password").val() || '';

     var status = {
       m1: true,
       m2: true,
     };

     var idGroup = {
       m1: 'email',
       m2: 'password'
     };

     if (!inp.regGroup.email.test(m1)) {
       status.m1 = false;
     }

     if (!inp.regGroup.pwd.test(m2)) {
       status.m2 = false;
     }

     if (inp.checkInp(status, idGroup)) {
       sendCaptchaEmail(false);
     }

   });

   $('#j-send-again').on('click', function () {
     if ($(this).hasClass('active')) {
       return;
     } else {
       sendCaptchaEmail(true);
     }

   });

   var sengAgain = null;
   var nextTime = 0;

   function sendCaptchaEmail(isForceSend) {

     var e = $("#email").val();
     var p = $("#password").val();
     var f = isForceSend ? 1 : 0;

     // 禁止重复发送
     $('#j-send-again').addClass('active');

     $.ajax({
         url: '/account/bind_mail/mail/ajax',
         type: 'get',
         dataType: 'json',
         data: {
           email: e,
           password: p,
           force: f
         },
       })
       .done(function (data) {

         if (data.retCode === 100000) {
           $('#j-safeemail-1').hide();
           $('#j-safeemail-2').fadeIn();

           // 计算可再次发送时间
           nextTime = (+new Date()) + 120000;

           sengAgain = setInterval(function () {
             var now = $.now();
             var t = ((nextTime - now) / 1000).toFixed(0);
             if (t > 0) {
               $('#j-send-again').html(t + '秒后可再次发送');
             } else {
               clearInterval(sengAgain);
               $('#j-send-again').html('重新发送').removeClass('active');
             }
           }, 1000);
           $('#email_temp').html(e);
           $('#email_login').attr('href', data.retData.mailHost);
         } else {
           APP.handRetCode(data.retCode, data.retMsg);
         }
       });

   }

   $('#j-send-2').on('click', function () {
    var e = $("#email").val();
    var c = $('#checknum').val();
     $.ajax({
         url: '/account/bind_mail/ajax',
         type: 'get',
         dataType: 'json',
         data: {
           email: e,
           captcha: c
         },
       })
       .done(function (data) {

         if (data.retCode == 100000) {
           $('#j-safeemail-2').hide();
           $('#j-safeemail-3').fadeIn();
           $('#bindMail').html(e);
         } else {
           APP.handRetCode(data.retCode, data.retMsg);
         }

       });
   });

 });