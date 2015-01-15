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

    /**
     * 全局通用登录弹出框
     * @return {null}
     */
    app.prototype.showLoginBox = function() {

      var _this = this;

      if (!$('#user-login')[0]) {
        var html = '<div id="j-login-modal" class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>登录</div><div class="modal-body"><div class="login-form"><label for="user">用户名：</label><input type="text" id="login-username"/><a href="/account/register">注册新用户</a></div><div class="login-form"><label for="pwd">登录密码：</label><input type="password" id="login-password"/><a href="#">找回密码</a></div><button class="btn btn-danger" id="user-login">立即登录</button></div></div></div></div>';
        $('body').append(html);
      };

      $('#j-login-modal').on('show.bs.modal', _this.centerModal);
      $('#j-login-modal').modal('show');
      $('#user-login').unbind();

      $('#user-login').on('click', function(event) {

        var user = _this.filterStr($('#login-username').val())
        var pwd = _this.filterStr($('#login-password').val())

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
                _this.showTips({
                  text: data.retMsg
                });
              }
            })
            .fail(function() {
              _this.onServiceFail();
            });
        } else {
          _this.showTips({
            text: '帐号密码不能为空'
          });
          return;
        }

      });

    };

    /**
     * 过滤字符串
     * @param  {String} str 字符串
     * @return {String}   过滤后的字符串
     */
    app.prototype.filterStr = function(str) {
      str = $.trim(str);
      var pattern = new RegExp("[%--`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——| {}【】‘；：”“'。，、？]")
      var rs = "";
      for (var i = 0; i < str.length; i++) {
        rs = rs + str.substr(i, 1).replace(pattern, '');
      }
      return rs;
    };

    /**
     * Update User Money
     * @return {null}
     */
    app.prototype.updateUserMoney = function() {
      $.ajax({
          url: '/account/islogin',
          type: 'get',
          dataType: 'json',
        })
        .done(function(data) {
          if (data.retCode === 100000) {
            $('#userMoney').html(data.retData.money);
          }
        });
    };

    /**
     * 获取参数
     * @param  {url} paraName 获取参数
     * @return {String}
     */
    app.prototype.parseQueryString = function(url) {
      var re = /[\?&]([^\?&=]+)=([^&]+)/g,
        matcher = null,
        items = {};
      url = url || window.location.search;
      while (null != (matcher = re.exec(url))) {
        items[matcher[1]] = decodeURIComponent(matcher[2]);
      }
      return items;
    };

    /**
     * 获取通用弹出框 有确定按钮
     * @param  {String} h 弹出框HTML
     * @return {String}   弹出框HTML
     */
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
          _this.showTips({
            html: '<div class="tipbox"><p>' + retMsg + ',购买失败！</p><p class="last"><a href="/account/top-up" class="btn btn-danger" target="_blank">立即充值</a></p></div>'
          });
          break;
        default:
          _this.showTips({
            text: retMsg
          });
          break;
      }
    };

    /**
     * Buy ticket Submit Init
     * @param  {Object} vote 回调对象
     * @return {null}
     */
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

    /**
     * Check User Status And Has Enougth Money
     * @param  {Object} o 回调对象
     * @return {null}
     */
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
              _this.showTips({
                html:'<div class="tipbox"><p>您的余额不足,购买失败！</p><p class="last"><a href="/account/top-up" class="btn btn-danger" target="_blank">立即充值</a></p></div>',
                title:'余额不足'
              });
            }
            if (o.always) o.always();
          } else {
            _this.handRetCode(D.retCode, D.retMsg);
          }
        });
    };

    app.prototype.checkUserLoginStatus = function() {

      var _this = this;
      var user = $('#myname');

      if (user.length) {
        return true;
      } else {
        return false;
      }

    };

    app.prototype.createShowTipsHTML = function(obj) {
      var html = '';
      var type = Number(obj.type);
      if (obj.html === '') {
        html = '<div class="tipbox"><p>' + obj.text + '</p></div>';

        switch (type) {
          case 1:
            html += '<p class="last"><button class="btn modal-sure-btn" id="j-reload">确定</button></p>';
            break;
          default:
            html += '<p class="last"><button class="btn modal-sure-btn" data-dismiss="modal">确定</button></p>';
            break;
        }
      } else {
        html = obj.html;
      }

      if (!$('#myModal')[0]) {
        var compiled = '<div class="friend-modal modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h4 class="modal-title j-apptips-title" id="myModalLabel">' + obj.title + '</h4></div><div class="modal-body text-center fc-84" id="apptips-content">' + html + '</div></div></div>';
        $('body').append(compiled);

      } else {

        $('.j-apptips-title').html(obj.title);
        $('#apptips-content').html(html);
      }

      if (obj.callback) obj.callback();

    };

    /**
     * showTips 全局通用拟态框
     * @param  {Object} obj tips's HTML {title:'title', html:'html'}
     * @return {null}
     */
    app.prototype.showTips = function(o) {

      var _this = this;

      var obj = {
        title: '友情提示',
        html: '',
        type: 0,
        text: ''
      };

      if (typeof o == 'object' && o !== null) {
        for (var prop in o) {
          if (o.hasOwnProperty(prop)) {
            if (o[prop] != '') {
              obj[prop] = o[prop]
            }
          }
        }
      } else {
        obj.text = o;
      }

      _this.createShowTipsHTML(obj);

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
      var top = ($(window).height() - $dialog.height()) / 2;
      var left = ($(window).width() - $dialog.width()) / 2;
      $dialog.css({
        "margin-top": top,
        "margin-left": left
      });

    };

    /**
     * Ajax ServiceFial ShowTips
     * @return {null}
     */
    app.prototype.onServiceFail = function() {
      this.showTips({
        text: '服务器繁忙,请稍后再试!'
      });
    };

    /**
     * 输入框获取丢失焦点element 监听
     * @return {[type]} [description]
     */
    app.prototype.bindInputPlace = function() {

      $('.j-input-place').on('focus', function(event) {
        var _this = $(this);
        var t = _this.attr('data-place');
        if (t == _this.val()) $(this).val('');
      });

      $('.j-input-place').on('blur', function(event) {
        var _this = $(this);
        var t = _this.attr('data-place');
        if ('' == _this.val()) $(this).val(t);
      });

    };

    /**
     * 输入框只允许输入整数
     * @return null
     */
    app.prototype.bindInputOnlyInt = function() {
      $('.j-only-int').on('keyup paste', function(event) {
        event.preventDefault();
        $(this).val($(this).val().replace(/\D|^0/g, ''));
      });
    };

    /**
     * 初始化头部 导航 切换
     * @return null
     */
    app.prototype.init = function() {

      var _this = this;
      $('#choseCai').hover(function() {
        var m = $(this);
        m.find('#hdMask').toggle();
        m.find('a').toggleClass('on');
      }, function() {
        var m = $(this);
        m.find('#hdMask').toggle();
        m.find('a').toggleClass('on');
      });

      $('.modal').on('show.bs.modal', _this.centerModal);

    };

    return app;

  }());

  var a = new app();
  a.init();
  return a;
});