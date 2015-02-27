// Common Module
var APP = {};

/**
 * APP Decimal
 * @param  {Number}  num
 * @return {Boolean}     [description]
 */
APP.isDecimal = function (num) {
  if (parseInt(num) == num) {
    return false;
  } else {
    return true;
  }
};

/**
 * 输入框获取丢失焦点element 监听
 * @return {[type]} [description]
 * on PL5
 */
APP.bindInputPlace = function () {

  $('.j-input-place').on('focus', function (event) {
    var _this = $(this);
    var t = _this.attr('data-place');
    if (t == _this.val()) $(this).val('');
  });

  $('.j-input-place').on('blur', function (event) {
    var _this = $(this);
    var t = _this.attr('data-place');
    if ('' == _this.val()) $(this).val(t);
  });

};
APP.bindInputPlace();

/**
 * HandRetCode for Ajax
 * @param  {retCode} retCode Ajax Respone Status
 * @param  {retMsg} retMsg  Ajaxa Respone Msg
 * @return {null}
 */
APP.handRetCode = function (retCode, retMsg, callback) {
  switch (retCode) {
  case 120002:
    this.showLoginBox(callback);
    break;
  case 120001:
    this.showTips({
      html: '<div class="tipbox"><p>' + retMsg + ',购买失败！</p><div class="m-one-btn"><a href="/account/top-up" class="btn btn-danger" target="_blank">立即充值</a></div></div>'
    });
    break;
  default:
    this.showTips({
      text: retMsg
    });
    break;
  }
};

/**
 * Update User Money
 * @return {null}
 */
APP.updateUserMoney = function () {

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
 * Update Head User Info
 * @return {null}
 */
APP.updateHeadUserInfo = function () {

  var html = '';
  $.ajax({
      url: '/account/islogin',
      type: 'get',
      dataType: 'json',
    })
    .done(function (data) {
      if (data.retCode === 100000) {
        html = '<span>欢迎来到彩胜网&nbsp;!&nbsp;&nbsp;&nbsp;&nbsp;<i class="icon icon-bor"></i></span>' + data.retData.username + '       账户余额:<span id="userMoney">' + data.retData.money + '</span>元<a href="/account/top-up" class="active">充值</a><i class="icon icon-bor"></i><a href="/account/logout">退出</a><i class="icon icon-bor"></i><a href="/account/index" class="last">我的账户</a>';
        $('#j-hd-top').html(html);
      }
    });

};

APP.showLoginBox = function (callback) {
  var loginModal = null;

  if (!$('#user-login')[0]) {
    var html = '<div id="j-login-modal" class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><i class="icon icon-close"></i></button>登录</div><div class="modal-body"><div class="login-form"><label for="user">用户名：</label><input type="text" id="login-username"/><a href="/account/register">注册新用户</a></div><div class="login-form"><label for="pwd">登录密码：</label><input type="password" id="login-password"/><a href="/html/user/find_psw.html">找回密码</a></div><button class="btn btn-danger" id="user-login">立即登录</button></div></div></div></div>';
    $('body').append(html);
  }

  loginModal = $('#j-login-modal');
  loginModal.on('show.bs.modal', APP.centerModal);
  loginModal.modal('show');

  $('#user-login').unbind();
  $('#user-login').on('click', function (event) {
    event.preventDefault();

    var user = APP.regStr($('#login-username').val());
    var pwd = APP.regStr($('#login-password').val());

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
            APP.updateHeadUserInfo();
            if (callback) {
              callback();
            }
            return;
          } else {
            APP.showTips(data.retMsg);
          }
        })
        .fail(function () {
          APP.showTips('Server has some error!');
        });
    } else {
      APP.showTips('帐号密码不能为空');
      return;
    }

  });
};

APP.regStr = function (s) {
  var pattern = new RegExp("[%--`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——| {}【】‘；：”“'。，、？]")
  var rs = "";
  for (var i = 0; i < s.length; i++) {
    rs = rs + s.substr(i, 1).replace(pattern, '');
  }
  return rs;
};

APP.createShowTipsHTML = function (obj) {
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
    var compiled = '<div class="friend-modal modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><i class="icon icon-close"></i></button><h4 class="modal-title j-apptips-title" id="myModalLabel">' + obj.title + '</h4></div><div class="modal-body text-center fc-84" id="apptips-content">' + html + '</div></div></div>';
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
 * [showTips 拟态框]
 * @param  {Object} obj tips's HTML {title:'title', html:'html'}
 * @return {null}
 */
APP.showTips = function (o) {

  var _this = APP;

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

APP.centerModal = function () {
  $(this).css('display', 'block');
  var $dialog = $(this).find(".modal-dialog");
  var top = ($(window).height() - $dialog.height()) / 2;
  var left = ($(window).width() - $dialog.width()) / 2;
  $dialog.css({
    "margin-top": top,
    "margin-left": left
  });
};

$('.Modal').on('show.bs.modal', APP.centerModal);

$(window).on("resize", function () {
  $('.modal:visible').each(APP.centerModal);
});

APP.getUrlPara = function (paraName) {
  var sUrl = window.location.href;
  var sReg = "(?:\\?|&){1}" + paraName + "=([^&]*)"
  var re = new RegExp(sReg, "gi");
  re.exec(sUrl);
  return RegExp.$1;
};

APP.onSubmitConfirm = function (callback, data, html) {

  $.ajax({
      url: '/account/islogin',
      type: 'get',
      dataType: 'json',
    })
    .done(function (D) {
      if (D.retCode === 100000) {
        if (Number(D.retData.money.replace(/,/g, '')) >= data.byNum) {
          APP.showTips(html);
          $('#buyConfirm').on('click', function (event) {
            callback(data);
          });
        } else {
          APP.showTips({
            html: '<div class="tipbox"><p>您的余额不足,购买失败！</p><div class="m-one-btn"><a href="/account/top-up" class="btn btn-danger" target="_blank">立即充值</a></div></div>',
            title: '余额不足'
          });
        }
      } else {
        APP.handRetCode(D.retCode, D.retMsg);
      }
    });

}

APP.onServiceFail = function () {
  APP.showTips('服务器繁忙,请稍后再试!');
};

APP.initLrkf = function () {
  var qq = ['2726429522'];
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

APP.showStopSellModal = function (lotyName) {
  var link =
    '<li><img class="logo" src="' + staticHostURI + '/front_images/lottery/dlt_home_logo.png" alt="大乐透"/><a href="/lottery/buy/dlt">大乐透</a></li>\
      <li class="text-right"><img class="logo" src="' + staticHostURI + '/front_images/lottery/qxc_home_logo.png" alt="七星彩"/><a href="/lottery/buy/qxc">七星彩</a></li>\
      <li><img class="logo" src="' + staticHostURI + '/front_images/lottery/pl3_home_logo.png" alt="排列3"/><a href="/lottery/buy/pl3">排列3</a></li>\
      <li class="text-right"><img class="logo" src="' + staticHostURI + '/front_images/lottery/pl5_home_logo.png" alt="排列5"/><a href="/lottery/buy/pl5">排列5</a></li>';
  var html = '<img src="' + staticHostURI + '/front_images/stopsell.png" class="stopsell-img" alt="mask-main" alt="暂停销售"/><div class="stopsell-box"><h4>' + lotyName + ' 暂停销售</h4><p>选择其它彩种投注 或 <a href="/">返回首页</a></p><ul>' + link + '</ul></div>';
  var modalHtml = '<div class="m-mask m-stopsell-mask" id="j-stopsell-mask"><div class="m-mask-bg"></div><div class="m-mask-main"><div class="modal-header"><button type="button" class="close" id="j-stopsellmask-close"><i class="icon icon-close"></i></button><h4 class="modal-title">暂停销售</h4></div><div class="stopsell-body">' + html + '</div></div></div>'
  $('body').append(modalHtml);
  $('#j-stopsell-mask').show();

  $('#j-stopsellmask-close').on('click', function (event) {
    $('#j-stopsell-mask').remove();
  });
};




APP.init = function () {

  var menu = {
    el: $('#choseCai'),
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
      _this.el.on('mouseout', function(event) {
        _this.el.removeClass('on');
      });


      _this.el.mouseover(function () {
        _this.el.addClass('on');
      });
    }
  };

  menu.init({
    el: $('#choseCai')
  });

  APP.initLrkf();

};

////////////////////////////////////////////////////////////////////////////
/**
 * ALL Page Common Event
 */
$(function () {

  APP.init();

  var u = window.location.href;
  if (u.indexOf('hall') >= 0) {
    $('.hd-nav li a.active').removeClass('active');
    $('.j-nav-hall').addClass('active');
  }
  if (u.indexOf('project-center') >= 0) {
    $('.hd-nav li a.active').removeClass('active');
    $('.j-nav-center').addClass('active');
  }

  $('#j-header-login-btn').on('click', function(event) {
    event.preventDefault();
    /* Act on the event */
    var url = location.href.replace(location.origin, '');
    url = url.replace(/#/, '');
    location.href='/account/login?ret_url=' + encodeURIComponent(url);
  });
});
