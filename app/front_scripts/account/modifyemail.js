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

   $('#j-pwdsave').on('click', function () {

     var m1 = $("#email").val() || '';
     var m2 = $("#sureemail").val() || '';
     var m3 = $("#userpwd").val() || '';

     var status = {
       m1: true,
       m2: true,
       m3: true
     };

     var idGroup = {
       m1: 'email',
       m2: 'sureemail',
       m3: 'userpwd'
     };

     if (!inp.regGroup.email.test(m1)) {
       status.m1 = false;
     }

     if (!inp.regGroup.email.test(m2)) {
       status.m2 = false;
     }

     if (!inp.regGroup.pwd.test(m3)) {
       status.m3 = false;
     }

     if (inp.checkInp(status, idGroup)) {
       $.ajax({
           url: '/account/modify_email/ajax',
           type: 'get',
           dataType: 'json',
           data: {
             oldMail: $('#email').val(),
             newMail: $('#sureemail').val(),
             password: $('#userpwd').val()
           },
         })
         .done(function (data) {
           console.log("success");
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