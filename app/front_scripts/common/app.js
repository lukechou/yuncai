define(['jquery', 'bootstrap'], function($) {
  'use strict';

  var app = (function() {

    function app(args) {
      // enforces new
      if (!(this instanceof app)) {
        return new app(args);
      }

      this.init();
    }

    /*
     * checkBuyMoney  要购买彩种金额
     * lessMoneyTips  余额不足提示HTML
     * cb  登录后充值后自动购买回调
     * userMoney  用户余额
     */
    app.prototype = {
      checkBuyMoney: null,
      lessMoneyTips: null,
      cb: null,
      userMoney: null
    };

    /**
     * 全局通用登录弹出框
     * @return {null}
     */
    app.prototype.showLoginBox = function(callback) {

      var _this = this;
      var loginModal = null;
      var user = null;
      var pwd = null;

      if (!$('#user-login')[0]) {
        var html = '<div id="j-login-modal" class="modal bs-example-modal-sm login-modal" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><i class="icon icon-close"></i></button>登录</div><div class="modal-body"><div class="login-form"><label for="user">用户名：</label><input type="text" id="login-username"/><a href="/account/register">注册新用户</a></div><div class="login-form"><label for="pwd">登录密码：</label><input type="password" id="login-password"/><a href="/html/user/find_psw.html">找回密码</a></div><button class="btn btn-danger" id="user-login">立即登录</button></div></div></div></div>';
        $('body').append(html);
      };

      loginModal = $('#j-login-modal');
      loginModal.on('show.bs.modal', _this.centerModal);
      loginModal.modal('show');

      $('#user-login').unbind();

      ////////////////////show Login Modal///////////////////////

      //////////////////////Model Login//////////////////////////
      $('#user-login').on('click', function(event) {

        user = _this.filterStr($('#login-username').val());
        pwd = _this.filterStr($('#login-password').val());

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

                loginModal.modal('hide');
                _this.updateHeadUserInfo();

                // 回调检测
                if (_this.checkBuyMoney) {

                  _this.checkLogin(_this.checkBuyMoney, {

                    enoughMoney: function() {
                      if (callback) {
                        callback();
                      }
                    },
                    lessMoneyTips: _this.lessMoneyTips
                  });

                } else {

                  if (callback) {
                    callback();
                  }

                }

                return;

              } else {

                _this.showTips(data.retMsg);

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
      $('#login-password').on('keydown', function(event) {
        if (event.keyCode == "13") {
          $('#user-login').click();
        }
      });

    };

    /**
     * HandRetCode for Ajax
     * @param  {retCode} retCode Ajax Respone Status
     * @param  {retMsg} retMsg  Ajaxa Respone Msg
     * @return {null}
     */
    app.prototype.handRetCode = function(retCode, retMsg, cb) {

      var _this = this;

      switch (retCode) {
        case 120002:

          _this.showLoginBox(cb);

          break;

        case 120001:

          if (_this.lessMoneyTips) {
            _this.onLessMoney(_this.lessMoneyTips);
          }

          break;
        default:

          _this.showTips({
            text: retMsg
          });

          break;
      }
    };

    app.prototype.onLessMoney = function(lessMoneyTips) {

      var _this = this;
      var html = '';

      html += '<div class="lessbox"><img src="' + staticHostURI + '/front_images/fail.png" alt="success" class="icon"><div class="tipbox" id="j-modal-tipbox"><div class="less-text">';
      html += '<h4>您的余额不足，请先充值</h4>' + lessMoneyTips;

      html += '<p>账&nbsp;户&nbsp;&nbsp;余&nbsp;额：<span class="fc-3 mlr5">' + (Number(_this.userMoney)).toFixed(2) + '</span>元</p>';
      html += '</div><div class="m-one-btn ml30"><a id="j-less-money" href="/account/top-up" class="btn btn-danger" target="_blank">立即充值</a></div></div></div>';

      _this.showTips({
        html: html
      });

      $('body').on('click', '#j-less-money', function(event) {

        var h = '<h3>请在新打开的充值页面完成充值操作</h3><div class="m-btns"><button class="btn btn-danger" id="j-pay-success">已完成充值，继续投注</button><a href="/html/help/help.html?page=6&ps=pay" class="btn btn-gray fc-3d" target="_blank">付款遇到问题</a></div>';

        $('#j-modal-tipbox').html(h);

      });

      $('body').on('click', '#j-pay-success', function(event) {
        event.preventDefault();

        $.ajax({
            url: '/account/islogin',
            type: 'get',
            dataType: 'json',
          })
          .done(function(D) {

            var userMoney = Number(D.retData.money.replace(/,/g, ''));
            _this.userMoney = userMoney;

            if (_this.checkBuyMoney <= _this.userMoney) {
              if (_this.cb) {
                _this.cb();
              }
            } else {
              $('#myModal').modal('hide');
              _this.showTips({
                text: '付款失败，账户余额不足，请及时充值！'
              });
            }

          });

      });

    };

    /**
     * Check User Status And Has Enougth Money
     * @param {Number} money
     * @param  {Object} o.enoughMoney,
     * @return {null}
     */
    app.prototype.checkLogin = function(money, o, notCheckMoney) {

      var _this = this;

      money = Number(money);

      _this.checkBuyMoney = money;

      if (o.lessMoneyTips) {
        _this.lessMoneyTips = o.lessMoneyTips;
      } else {
        _this.lessMoneyTips = '';
      }

      // 检测购买金额
      if (o.enoughMoney) {

        _this.cb = o.enoughMoney;

      } else {

        _this.cb = null;

      }

      // check money type
      if ((typeof money) !== 'number') {
        return;
      }

      $.ajax({
          url: '/account/islogin',
          type: 'get',
          dataType: 'json',
        })
        .done(function(D) {

          if (D.retCode === 100000) {

            var userMoney = Number(D.retData.money.replace(/,/g, ''));

            _this.userMoney = userMoney;

            if (userMoney != 0 && userMoney >= money) {

              if (o.enoughMoney) {
                o.enoughMoney();
              }

            } else {

              if (_this.lessMoneyTips) {
                _this.onLessMoney(_this.lessMoneyTips);
              }

            }

            if (o.always) o.always(userMoney);

          } else {

            if (notCheckMoney) {

              _this.handRetCode(D.retCode, D.retMsg, o.always);

            } else {

              _this.handRetCode(D.retCode, D.retMsg, o.enoughMoney);

            }

          }
        });

    };

    app.prototype.createShowTipsHTML = function(obj) {

      // 生成对应HTML
      var html = '';
      var type = Number(obj.type);
      if (obj.html === '') {
        html = '<div class="tipbox"><p>' + obj.text + '</p></div>';

        switch (type) {
          case 1:
            html += '<div class="m-onebtn"><button class="btn modal-sure-btn" id="j-modal-confirm">' + obj.ensuretext + '</button></div>';
            break;
          case 2:
            html += '<div class="m-btns"><button class="btn btn-danger" id="j-modal-confirm">' + obj.ensuretext + '</button><button class="btn btn-gray ml15" data-dismiss="modal">' + obj.canceltext + '</button></div>';
            break;
          default:
            html += '<div class="m-one-btn"><button class="btn" data-dismiss="modal">' + obj.ensuretext + '</button></div>';
            break;
        }
      } else {
        html = obj.html;
      }

      if (!obj.className) {
        obj.className = null;
      }

      if (!$('#myModal')[0]) {
        var compiled = '<div class="friend-modal modal ' + obj.className + '" id="myModal" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><i class="icon icon-close"></i></button><h4 class="modal-title j-apptips-title" id="myModalLabel">' + obj.title + '</h4></div><div class="modal-body text-center fc-84" id="apptips-content">' + html + '</div></div></div>';
        $('body').append(compiled);

      } else {

        if (!obj.className) {
          $('#myModal').removeClass().addClass('friend-modal modal');
        } else {
          $('#myModal').addClass(obj.className);
        }

        $('.j-apptips-title').html(obj.title);
        $('#apptips-content').html(html);

      }

      // 绑定确认按钮事件
      $('#j-modal-confirm').unbind('click');

      if (obj.onConfirm) {
        $('#j-modal-confirm').on('click', function(event) {
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
    app.prototype.showTips = function(o) {

      var _this = this;

      var obj = {
        title: '友情提示',
        html: '',
        type: 0,
        text: '',
        ensuretext: '确定',
        canceltext: '取消',
        onConfirm: null,
        className: null,
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

    // 确定后移除
    app.prototype.checkUserLoginStatus = function() {

      var _this = this;
      var user = $('#myname');

      if (user.length) {
        return true;
      } else {
        return false;
      }

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
        if (t == _this.val()) {
          $(this).val('').addClass('active');
        }
      });

      $('.j-input-place').on('blur', function(event) {
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
    app.prototype.bindInputOnlyInt = function(str) {

      if (typeof str === 'string') {

        $(str).on('keyup paste', function(event) {
          event.preventDefault();
          $(this).val($(this).val().replace(/\D|^0/g, ''));
        });

      } else {

        console.log('error');
        return;

      }

    };

    app.prototype.bindProxyLink = function() {

      var _this = this;

      $('body').on('click', '#j-proxy-link', function(event) {
        event.preventDefault();

        var url = $(this).attr('data-url') || '';

        if (url) {

          _this.showTips({
            title: '代理链接',
            text: '<p>请将下面的链接复制给你好友：</p><p>' + url + '</p>'
          });

        }

      });

    };

    /**
     * 初始化头部 导航 切换
     * @return null
     */
    app.prototype.init = function() {

      var _this = this;

      var u = window.location.href;


      if (u.indexOf('hall') >= 0) {
        $('.hd-nav li a.active').removeClass('active');
        $('.j-nav-hall').addClass('active');
      }
      if (u.indexOf('project-center') >= 0 || u.indexOf('follow') >= 0) {
        $('.hd-nav li a.active').removeClass('active');
        $('.j-nav-center').addClass('active');
      }
      if (u.indexOf('award') >= 0) {
        $('.hd-nav li a.active').removeClass('active');
        $('.j-nav-award').addClass('active');
      }

      $('#j-header-login-btn').on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        var url = location.href.replace(location.origin, '');
        url = url.replace(/#/, '');
        location.href = '/account/login?ret_url=' + encodeURIComponent(url);
      });

      var menu = {
        el: $('#choseCai'),
        init: function(args) {
          var _this = this;
          for (var key in args) {
            if (args.hasOwnProperty(key)) {
              _this[key] = args[key];
            }
          }
          _this.bindEvent();
        },
        bindEvent: function() {
          var _this = this;
          _this.el.hover(function() {
            _this.el.addClass('on');
            _this.el.find('.j-white-tri').removeClass('icon-hdown').addClass('icon-hup');
          }, function() {
            _this.el.removeClass('on');
            _this.el.find('.j-white-tri').removeClass('icon-hup').addClass('icon-hdown');
          });
        }
      };

      menu.init({
        el: $('#choseCai')
      });

      var hemaiNav = {
        el: $('#j-hemai-nav'),
        bindEvent: function() {

          var _this = this;
          _this.el.hover(function() {
            _this.el.addClass('on');
          }, function() {
            _this.el.removeClass('on');
          });
        }
      };
      hemaiNav.bindEvent();

      var subNav = {
        bindEvent: function(obj) {
          var _this = obj;
          _this.el.hover(function() {
            _this.target.addClass('behover');
          }, function() {
            _this.target.removeClass('behover');
          });
        }
      };
      subNav.bindEvent({
        el: $('.j-num-li'),
        target: $('.j-num-nav')
      });
      subNav.bindEvent({
        el: $('.j-heighp-li'),
        target: $('.j-heighp-nav')
      });

      _this.initLrkf();

      _this.bindProxyLink();

      $('.modal').on('show.bs.modal', _this.centerModal);

    };

    // 侧栏客服
    app.prototype.initLrkf = function() {

      var qq = ['2726429522'];
      var tel = '400-8788-310';
      var side = '<div id="j-side" class="side"><a class="icon-text" target="_blank" href="http://wpa.qq.com/msgrd?v=3&amp;uin=' + qq[0] + '&amp;site=qq&amp;menu=yes" ></a></div>';
      var link = null;

      $('body').append(side);

      link = $('#j-side .icon-text');

      $("#j-side").hover(function() {
        link.animate({
          'left': '-64px',
          'opacity': '1',
        }, 200)
      }, function() {
        link.animate({
          'left': '-70px',
          'opacity': '0',
        }, 200)
      });

    };

    /**
     * 可转为使用 updateHeadUserInfo 以便统一  确认后移除
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

    // 更新用户信息
    app.prototype.updateHeadUserInfo = function() {

      var html = '';
      var proxyHtml = '';
      var item = '';

      $.ajax({
          url: '/account/islogin',
          type: 'get',
          dataType: 'json',
        })
        .done(function(data) {

          if (data.retCode === 100000) {

            item = data.retData;

            if (item['is_proxy'] == 3) {

              proxyHtml = '<a href="javascript:;" id="j-proxy-link" data-url="' + item['$proxy_url'] + '">代理链接</a><i class="icon icon-bor"></i>';

            }

            html = '<span>欢迎来到彩胜网&nbsp;!&nbsp;&nbsp;&nbsp;&nbsp;<i class="icon icon-bor"></i></span><span id="myname">' + item.username + '</span>账户余额:<span id="userMoney">' + item.money + '</span>元<a href="/account/top-up" class="active">充值</a><i class="icon icon-bor"></i>' + proxyHtml + '<a href="/account/logout">退出</a><i class="icon icon-bor"></i><a href="/account/index" class="last">我的账户</a>';

            $('#j-hd-top').html(html);

          }

        });
    };

    // 显示停售弹出层
    app.prototype.showStopSellModal = function(lotyName) {

      var link = '';
      link += '<p>选择其它彩种投注 或 <a href="/">返回首页</a></p><ul>';

      link = '<li><img class="logo" src="' + staticHostURI + '/front_images/lottery/dlt_home_logo.png" alt="大乐透"/><a href="/lottery/buy/dlt">大乐透</a></li>\
      <li class="text-right"><img class="logo" src="' + staticHostURI + '/front_images/lottery/qxc_home_logo.png" alt="七星彩"/><a href="/lottery/buy/qxc">七星彩</a></li>\
      <li><img class="logo" src="' + staticHostURI + '/front_images/lottery/pl3_home_logo.png" alt="排列3"/><a href="/lottery/buy/pl3">排列3</a></li>\
      <li class="text-right"><img class="logo" src="' + staticHostURI + '/front_images/lottery/pl5_home_logo.png" alt="排列5"/><a href="/lottery/buy/pl5">排列5</a></li>';
      link += '</ul></div>';

      link = '';

      var html = '<img src="' + staticHostURI + '/front_images/stopsell.png" class="stopsell-img" alt="mask-main" alt="暂停销售"/><div class="stopsell-box"><h4>' + lotyName + ' 暂停销售</h4>' + link;

      var modalHtml = '<div class="m-mask m-stopsell-mask" id="j-stopsell-mask"><div class="m-mask-bg"></div><div class="m-mask-main"><div class="modal-header"><button type="button" class="close" id="j-stopsellmask-close"><i class="icon icon-close"></i></button><h4 class="modal-title">暂停销售</h4></div><div class="stopsell-body">' + html + '</div></div></div>';

      $('body').append(modalHtml);
      $('#j-stopsell-mask').show();

      $('#j-stopsellmask-close').on('click', function(event) {
        $('#j-stopsell-mask').remove();
      });

    };

    /**
     * APP Decimal
     * @param  {Number}  num
     * @return {Boolean}
     */
    app.prototype.isDecimal = function(num) {
      if (parseInt(num) == num) {
        return false;
      } else {
        return true;
      }
    };

    /*
     * 获取Get参数
     * paraName 要获取的参数
     * return
     */
    app.prototype.getUrlPara = function(paraName) {
      var sUrl = window.location.href;
      var sReg = "(?:\\?|&){1}" + paraName + "=([^&]*)"
      var re = new RegExp(sReg, "gi");
      re.exec(sUrl);
      return RegExp.$1;
    };

    /**
     * 获取参数
     * @param  {url} kp2.yuncai.com?name=raymond&age=15
     * @return 获取url 里面的 get参数 {name:raymond,age:15}
     *
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
     * 过滤文本内容中含有的脚本等危险信息
     * @param  {String} str 需要过滤的字符串
     * @return {String}
     */
    app.prototype.filterStr = function(str) {

      str = str || '';
      str = decodeURIComponent(str);
      str = str.replace(/<.*>/g, ''); // 过滤标签注入
      str = str.replace(/(java|vb|action)script/gi, ''); // 过滤脚本注入
      str = str.replace(/[\"\'][\s ]*([^=\"\'\s ]+[\s ]*=[\s ]*[\"\']?[^\"\']+[\"\']?)+/gi, ''); // 过滤HTML属性注入
      str = str.replace(/[\s ]/g, '&nbsp;'); // 替换空格

      return str;

    };

    // 格式化 时间  dateFormat(new Date(),'%Y-%M-%d %h:%m:%s')
    // date  时间对象 new Date()
    // pattern  时间格式  '%Y-%M-%d %h:%m:%s'
    // isFill  是否补零 默认补零
    // return 2015-06-19 15:46:00
    app.prototype.dateFormat = function(date, pattern, isFill) {

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

  return a;

});