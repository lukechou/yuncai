define(['jquery'], function($) {
  'use strict';

  var app = (function() {

    function app(args) {
      // enforces new
      if (!(this instanceof app)) {
        return new app(args);
      }
      // constructor body
    }

    app.prototype = {};
    app.prototype.showLoginBox = function() {
      var _this = this;

      if (!$('#user-login')[0]) {
        var html = '<div id="j-login-modal" class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>登录</div><div class="modal-body"><div class="login-form"><label for="user">用户名：</label><input type="text" id="login-username"/><a href="/account/register">注册新用户</a></div><div class="login-form"><label for="pwd">登录密码：</label><input type="password" id="login-password"/><a href="#">找回密码</a></div><button class="btn btn-danger" id="user-login">立即登录</button></div></div></div></div>';
        $('body').append(html);
      };

      $('#j-login-modal').on('show.bs.modal', _this.centerModal);
      $('#j-login-modal').modal('show');
      $('#user-login').unbind();
      _this.bindLoginEvent();

    };

    app.prototype.bindLoginEvent = function() {
      var _this = this;

      $('#user-login').on('click', function(event) {

        var user = _this.regStr($('#login-username').val())
        var pwd = _this.regStr($('#login-password').val())

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
                _this.showTips(_this.getConfirmHtml(data.retMsg));
              }
            })
            .fail(function() {
              _this.showTips('Server has some error!')
            });
        } else {
          _this.showTips(_this.getConfirmHtml('帐号密码不能为空'));
          return;
        }

      });

    }

    app.prototype.regStr = function(s) {
      var pattern = new RegExp("[%--`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——| {}【】‘；：”“'。，、？]")
      var rs = "";
      for (var i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, '');
      }
      return rs;
    };

    app.prototype.getConfirmHtml = function(h) {
      return '<div class="tipbox"><p>' + h + '</p><p class="last"><button class="btn btn-danger" data-dismiss="modal">确定</button></p></div>';
    };

    /**
     * HandRetCode for Ajax
     * @param  {retCode} retCode Ajax Respone Status
     * @param  {retMsg} retMsg  Ajaxa Respone Msg
     * @return {null}
     */
    app.prototype.handRetCode = function(retCode, retMsg) {
      var _this = this;

      switch (retCode) {
        case 120002:
          _this.showLoginBox();
          break;
        case 120001:
          _this.showTips('<div class="tipbox"><p>' + retMsg + ',购买失败！</p><p class="last"><a href="/account/top-up" class="btn btn-danger" target="_blank">立即充值</a></p></div>');
          break;
        default:
          _this.showTips('<div class="tipbox"><p>' + retMsg + '</p><p class="last"><button class="btn btn-danger" data-dismiss="modal">确定</button></p></div>');
          break;
      }
    };

    // Buy ticket Submit Init
    app.prototype.onSubmitInit = function(vote) {
      var _this = this;

      _this.checkLogin({
        enoughMoney: function() {
          _this.showTips({
            title: vote.title,
            html: vote.confirmHtml
          });

          $('#buyConfirm').on('click', function(event) {
            vote.callback();
          });
        }
      });

    };

    // Check User Login
    app.prototype.checkLogin = function(o) {
      var _this = this;

      $.ajax({
          url: '/account/islogin',
          type: 'get',
          dataType: 'json',
        })
        .done(function(D) {
          if (D.retCode === 100000) {
            var userMoney = Number(D.retData.money.replace(/,/g, ''));
            if (userMoney >= Config.payMoney && userMoney != 0) {
              if (o.enoughMoney) o.enoughMoney();
            } else {
              _this.showTips('<div class="tipbox"><p>您的余额不足,购买失败！</p><p class="last"><a href="/account/top-up" class="btn btn-danger" target="_blank">立即充值</a></p></div>');
            }
            if (o.always) o.always();
          } else {
            _this.handRetCode(D.retCode, D.retMsg);
          }
        });

    };

    /**
     * [showTips 拟态框]
     * @param  {Object} obj tips's HTML {title:'title', html:'html'}
     * @return {null}
     */
    app.prototype.showTips = function(o) {

      var _this = this;
      var obj = {
        title: '友情提示',
        html: ''
      };

      if (typeof o == 'string') {
        obj.html = o;
      } else {
        obj = o;
        if (!o.title) {
          obj.title = '友情提示';
        }
      }

      if (!$('#myModal')[0]) {
        var compiled = '<div class="friend-modal modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h4 class="modal-title j-apptips-title" id="myModalLabel">' + obj.title + '</h4></div><div class="modal-body text-center fc-84" id="apptips-content">' + obj.html + '</div></div></div>';
        $('body').append(compiled);

      } else {

        $('.j-apptips-title').html(obj.title);
        $('#apptips-content').html(obj.html);
      }

      $('#myModal').on('show.bs.modal', _this.centerModal);

      $('#myModal').modal('show');

    };

    /**
     * Modal Center
     * @return {[type]} null
     */
    app.prototype.centerModal = function() {
      $(this).css('display', 'block');
      var $dialog = $(this).find(".modal-dialog");
      var offset = ($(window).height() - $dialog.height()) / 2;
      $dialog.css("margin-top", offset);
    };

    app.prototype.onServiceFail = function() {
      this.showTips(this.getConfirmHtml('服务器繁忙,请稍后再试!'));
    };

    return app;

  }());

  var a = new app();
  return a;
});