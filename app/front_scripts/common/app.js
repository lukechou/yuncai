define(['jquery'], function ($) {
  'use strict';

  var ConstructorName = (function () {
    'use strict';

    function ConstructorName(args) {
      // enforces new
      if (!(this instanceof ConstructorName)) {
        return new ConstructorName(args);
      }
      // constructor body
    }

    ConstructorName.prototype.methodName = function (args) {
      // method body
    };

    return ConstructorName;

  }());
  var app = (function () {

    function app(args) {
      // enforces new
      if (!(this instanceof app)) {
        return new app(args);
      }
      // constructor body
    }

    app.prototype = {};

    /**
     * APP Decimal
     * @param  {Number}  num
     * @return {Boolean}     [description]
     */
    app.prototype.isDecimal = function (num) {
      if (parseInt(num) == num) {
        return false;
      } else {
        return true;
      }
    };

    /**
     * 全局通用登录弹出框
     * @return {null}
     */
    app.prototype.showLoginBox = function (callback) {

      var _this = this;
      var loginModal = null;

      if (!$('#user-login')[0]) {
        var html = '<div id="j-login-modal" class="modal bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><i class="icon icon-close"></i></button>登录</div><div class="modal-body"><div class="login-form"><label for="user">用户名：</label><input type="text" id="login-username"/><a href="/account/register">注册新用户</a></div><div class="login-form"><label for="pwd">登录密码：</label><input type="password" id="login-password"/><a href="/html/user/find_psw.html" id="j-find-pwd">找回密码</a></div><button class="btn btn-danger" id="user-login">立即登录</button></div></div></div></div>';
        $('body').append(html);
      };

      loginModal = $('#j-login-modal');
      loginModal.on('show.bs.modal', _this.centerModal);
      loginModal.modal('show');

      $('#user-login').unbind();
      $('#j-find-pwd').unbind();
      $('#j-find-pwd').on('click', function (event) {
        _this.showTips('请致电客服，由客服人员为您解决。<br>客服中心电话：4008-898-310');
      });
      $('#user-login').on('click', function (event) {

        var user = _this.filterStr($('#login-username').val());
        var pwd = _this.filterStr($('#login-password').val());

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
            .done(function (data) {
              if (data.retCode == 100000) {
                loginModal.hide();
                _this.updateHeadUserInfo();
                _this.checkLogin(_this.checkBuyMoney, {
                  enoughMoney: function () {
                    if (callback) {
                      callback();
                    }
                  }
                });
                return;
              } else {
                _this.showTips(data.retMsg);
              }
            })
            .fail(function () {
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

    app.prototype.updateHeadUserInfo = function () {
      var html = '';
      $.ajax({
          url: '/account/islogin',
          type: 'get',
          dataType: 'json',
        })
        .done(function (data) {
          if (data.retCode === 100000) {
            html = '<span>欢迎来到彩胜网&nbsp;!&nbsp;&nbsp;&nbsp;&nbsp;<img src="' + staticHostURI + '/front_images/bor.png" alt="bor"></span>' + data.retData.username + '       账户余额:<span id="userMoney">' + data.retData.money + '</span>元<a href="/account/top-up" class="active">充值</a><img src="' + staticHostURI + '/front_images/bor.png" alt="bor"><a href="/account/logout">退出</a><img src="' + staticHostURI + '/front_images/bor.png" alt="bor"><a href="/account/index" class="last">我的账户</a>';
            $('#hd-top').html(html);
          }
        });
    };

    /**
     * Update User Money
     * @return {null}
     */
    app.prototype.updateUserMoney = function () {
      $.ajax({
          url: '/account/islogin',
          type: 'get',
          dataType: 'json',
        })
        .done(function (data) {
          if (data.retCode === 100000) {
            $('#userMoney').html(data.retData.money);
          }
        });
    };

    /**
     * HandRetCode for Ajax
     * @param  {retCode} retCode Ajax Respone Status
     * @param  {retMsg} retMsg  Ajaxa Respone Msg
     * @return {null}
     */
    app.prototype.handRetCode = function (retCode, retMsg, callback) {
      var _this = this;

      switch (retCode) {
      case 120002:
        _this.showLoginBox(callback);
        break;
      case 120001:
        _this.showTips({
          html: '<div class="tipbox"><p>您的余额不足,购买失败！</p><div class="m-one-btn"><a href="/account/top-up" class="btn btn-danger" target="_blank">立即充值</a></div></div>'
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
     * Check User Status And Has Enougth Money
     * @param {Number} money
     * @param  {Object} o.enoughMoney,
     * @return {null}
     */
    app.prototype.checkLogin = function (money, o) {

      var _this = this;
      money = Number(money);
      _this.checkBuyMoney = money;

      // check money type
      if ((typeof money) !== 'number') {
        return;
      }

      $.ajax({
          url: '/account/islogin',
          type: 'get',
          dataType: 'json',
        })
        .done(function (D) {

          if (D.retCode === 100000) {

            var userMoney = Number(D.retData.money.replace(/,/g, ''));

            if (userMoney != 0 && userMoney >= money) {

              if (o.enoughMoney) {
                o.enoughMoney();
              }

            } else {

              _this.showTips({
                html: '<div class="tipbox"><p>您的余额不足,购买失败！</p><div class="m-one-btn"><a href="/account/top-up" class="btn btn-danger" target="_blank">立即充值</a></div></div>',
                title: '余额不足'
              });

            }

            if (o.always) o.always();

          } else {
            _this.handRetCode(D.retCode, D.retMsg, o.enoughMoney);

          }
        });

    };

    app.prototype.checkUserLoginStatus = function () {

      var _this = this;
      var user = $('#myname');

      if (user.length) {
        return true;
      } else {
        return false;
      }

    };

    app.prototype.createShowTipsHTML = function (obj) {

      // 生成对应HTML
      var html = '';
      var type = Number(obj.type);
      if (obj.html === '') {
        html = '<div class="tipbox"><p>' + obj.text + '</p></div>';

        switch (type) {
        case 1:
          html += '<div class="m-onebtn"><button class="btn modal-sure-btn" id="j-modal-confirm">确定</button></div>';
          break;
        case 2:
          html += '<div class="m-btns"><button class="btn btn-danger" id="j-modal-confirm">确定</button><button class="btn btn-gray ml15" data-dismiss="modal">取消</button></div>';
          break;
        default:
          html += '<div class="m-one-btn"><button class="btn" data-dismiss="modal">确定</button></div>';
          break;
        }
      } else {
        html = obj.html;
      }

      if (!$('#myModal')[0]) {
        var compiled = '<div class="friend-modal modal" id="myModal" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><i class="icon icon-close"></i></button><h4 class="modal-title j-apptips-title" id="myModalLabel">' + obj.title + '</h4></div><div class="modal-body text-center fc-84" id="apptips-content">' + html + '</div></div></div>';
        $('body').append(compiled);

      } else {

        $('.j-apptips-title').html(obj.title);
        $('#apptips-content').html(html);
      }

      // 绑定确认按钮事件
      $('#j-modal-confirm').unbind('click');
      if (obj.onConfirm) {
        $('#j-modal-confirm').on('click', function (event) {
          event.preventDefault();
          obj.onConfirm();
        });
      }

      if (obj.callback) obj.callback();
    };

    /**
     * showTips 全局通用拟态框
     * @param  {Object} obj tips's HTML {title:'title', html:'html'}
     * o === String 通用弹出框,只有确定按钮
     * type==null 参数 无默认按钮
     * type==1 确定
     * type==2 确定，取消
     * onConfirm 确定按钮成功事件
     * @return {null}
     */
    app.prototype.showTips = function (o) {

      var _this = this;

      var obj = {
        title: '友情提示',
        html: '',
        type: 0,
        text: '',
        onConfirm: null,
        callback: null
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
    app.prototype.centerModal = function () {

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
    app.prototype.onServiceFail = function () {
      this.showTips({
        text: '服务器繁忙,请稍后再试!'
      });
    };

    /**
     * 输入框获取丢失焦点element 监听
     * @return {[type]} [description]
     */
    app.prototype.bindInputPlace = function () {

      $('.j-input-place').on('focus', function (event) {
        var _this = $(this);
        var t = _this.attr('data-place');
        if (t == _this.val()) {
          $(this).val('').addClass('active');
        }
      });

      $('.j-input-place').on('blur', function (event) {
        var _this = $(this);
        var t = _this.attr('data-place');
        if ('' == _this.val()) {
          $(this).val(t).removeClass('active');
        }
      });

    };

    /**
     * 输入框输入限制 只允许整数
     * @param  {String} str 输入框 Selector
     * @return {null}
     */
    app.prototype.bindInputOnlyInt = function (str) {

      if (typeof str === 'string') {

        $(str).on('keyup paste', function (event) {
          event.preventDefault();
          $(this).val($(this).val().replace(/\D|^0/g, ''));
        });

      } else {

        console.log('error');
        return;

      }

    };

    /**
     * 过滤文本内容中含有的脚本等危险信息
     * @param  {String} str 需要过滤的字符串
     * @return {String}
     */
    app.prototype.filterStr = function (str) {
      str = str || '';
      str = decodeURIComponent(str);
      str = str.replace(/<.*>/g, ''); // 过滤标签注入
      str = str.replace(/(java|vb|action)script/gi, ''); // 过滤脚本注入
      str = str.replace(/[\"\'][\s ]*([^=\"\'\s ]+[\s ]*=[\s ]*[\"\']?[^\"\']+[\"\']?)+/gi, ''); // 过滤HTML属性注入
      str = str.replace(/[\s ]/g, '&nbsp;'); // 替换空格
      return str;
    };

    /**
     * 获取参数
     * @param  {url} paraName 获取参数
     * @return {String}
     */
    app.prototype.parseQueryString = function (url) {
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
     * 初始化头部 导航 切换
     * @return null
     */
    app.prototype.init = function () {

      var _this = this;
      var menu = {
        el: $('#choseCai'),
        mask: $('#hdMask'),
        checkTopMenu: function () {

          // var checkTopMenu = setInterval(function () {
          //   console.log(menu.el.is());
          // }, 300);
        },
        init: function (args) {
          var _this = this;
          for (var key in args) {
            if (args.hasOwnProperty(key)) {
              _this[key] = args[key];
            }
          }
          _this.bindEvent();
        },
        bindEvent: function () {
          var _this = this;
          _this.el.hover(function () {
            _this.mask.toggle();
          }, function () {
            _this.mask.toggle();
          });
        }
      };

      menu.init({
        el: $('#choseCai'),
        mask: $('#hdMask')
      });

      _this.initLrkf();
      $('.modal').on('show.bs.modal', _this.centerModal);

    };

    app.prototype.initLrkf = function () {
      var qq = ['123520260', '2264990340'];
      var tel = '4008-898-310';
      var side = '<div id="j-side" class="side"><a class="icon-text" target="_blank" href="http://wpa.qq.com/msgrd?v=3&amp;uin=' + qq[0] + '&amp;site=qq&amp;menu=yes" ></a></div>';

      $('body').append(side);

      var link = $('#j-side .icon-text');
      $("#j-side").hover(function () {
        // link.show();
        link.animate({
          'left': '-64px',
          'opacity': '1',
        }, 200)
      }, function () {
        // link.hide();
        link.animate({
          'left': '-70px',
          'opacity': '0',
        }, 200)
      });
    };

    app.prototype.dateFormat = function (date, pattern, isFill) {

      var Y = date.getFullYear();

      var M = date.getMonth() + 1;

      var d = date.getDate();

      var h = date.getHours();

      var m = date.getMinutes();

      var s = date.getSeconds();

      var w = date.getDay();

      var week = ['日', '一', '二', '三', '四', '五', '六'];

      w = week[w];

      if (isFill) {

        M = (M < 10) ? ('0' + M) : M;

        d = (d < 10) ? ('0' + d) : d;

        h = (h < 10) ? ('0' + h) : h;

        m = (m < 10) ? ('0' + m) : m;

        s = (s < 10) ? ('0' + s) : s;

        w = w;

      }

      pattern = pattern || '%Y-%M-%d %h:%m:%s';

      pattern = pattern.replace('%Y', Y);

      pattern = pattern.replace('%M', M);

      pattern = pattern.replace('%d', d);

      pattern = pattern.replace('%h', h);

      pattern = pattern.replace('%m', m);

      pattern = pattern.replace('%s', s);

      pattern = pattern.replace('%w', w);

      return pattern;
    };

    return app;

  }());

  var a = new app();
  a.init();
  return a;
});