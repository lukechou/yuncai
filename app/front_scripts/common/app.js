define(['jquery'], function($) {
  'use strict';

  var APP = {};

  APP.handRetCode = function(retCode, retMsg) {
    switch (retCode) {
      case 120002:
        this.showLoginBox();
        break;
      case 120001:
        this.showTips(retMsg + ',购买失败！' + '<a href="/account/top-up" class="btn btn-danger ml15" target="_blank">立即充值</a>')
        break;
      default:
        this.showTips(retMsg);
        break;
    }
  };

  APP.showLoginBox = function() {

    var html = '<div id="j-login-modal" class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>登录</div><div class="modal-body"><div class="login-form"><label for="user">用户名：</label><input type="text" id="login-username"/><a href="/account/register">注册新用户</a></div><div class="login-form"><label for="pwd">登录密码：</label><input type="password" id="login-password"/><a href="#">找回密码</a></div><button class="btn btn-danger" id="user-login">立即登录</button></div></div></div></div>';

    $('body').append(html)
    $('#j-login-modal').modal('show')

    this.bindLoginEvent()
  };

  APP.regStr = function(s) {
    var pattern = new RegExp("[%--`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——| {}【】‘；：”“'。，、？]")
    var rs = "";
    for (var i = 0; i < s.length; i++) {
      rs = rs + s.substr(i, 1).replace(pattern, '');
    }
    return rs;
  };

  APP.bindLoginEvent = function() {

    $('#user-login').on('click', function(event) {
      event.preventDefault();

      var user = APP.regStr($('#login-username').val())
      var pwd = APP.regStr($('#login-password').val())

      if (user && pwd) {
        $.ajax({
            url: '/account/userinfo/user/dologin',
            type: 'post',
            dataType: 'json',
            data: {
              username: user,
              password: pwd
            },
          })
          .done(function(data) {
            if (data.retCode == 100000) {
              window.location.href = data.retData.redirectURL;
            } else {
              alert(data.retMsg);
            }
          })
          .fail(function() {
            APP.showTips('Server has some error!')
          });
      } else {
        alert('帐号密码不能为空')
        return;
      }

    });

  };

  APP.showTips = function(h) {

    if (!$('#myModal')[0]) {
      var html = '<div class="friend-modal modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">友情提示</h4></div><div class="modal-body text-center fc-84" id="app-content"></div></div></div>';
      $('body').append(html)
    }

    $('#app-content').html(h)
    $('#myModal').modal('show')

  };

  APP.getUrlPara = function(paraName) {
    var sUrl = window.location.href;
    var sReg = "(?:\\?|&){1}" + paraName + "=([^&]*)"
    var re = new RegExp(sReg, "gi");
    re.exec(sUrl);
    return RegExp.$1;
  };

  APP.onServerFail = function() {
    APP.showTips('服务器繁忙,请稍后再试!')
  };

  APP.submitHemai = function(obj) {
    $.ajax({
        url: obj.joinURI,
        type: 'get',
        dataType: 'json',
        data: {
          pid: obj.prjctId,
          buyNum: obj.byNum
        },
      })
      .done(function(data) {
        if (data.retCode == 100000) {

          if (obj.onSuccess) {
            obj.onSuccess();
          }

          APP.showTips('参与合买成功');
        } else {
          APP.handRetCode(data.retCode, data.retMsg);
        }
      })
      .fail(function() {
        APP.onServerFail();
      });
  };

  APP.init = function() {

    // Header Nav Toggle
    $('#choseCai').hover(function() {
      toggleMask($(this));
    }, function() {
      toggleMask($(this));
    });

    function toggleMask(m) {
      m.find('#hdMask').toggle();
      m.find('a').toggleClass('on');
    }

  };

  return APP;

});