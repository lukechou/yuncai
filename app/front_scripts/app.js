// Common Module
var APP = {};

/**
 * APP Decimal
 * @param  {Number}  num
 * @return {Boolean}     [description]
 */
APP.isDecimal = function(num) {
  if (parseInt(num) == num) {
    return false;
  } else {
    return true;
  }
};

/**
 * HandRetCode for Ajax
 * @param  {retCode} retCode Ajax Respone Status
 * @param  {retMsg} retMsg  Ajaxa Respone Msg
 * @return {null}
 */
APP.handRetCode = function(retCode, retMsg) {
  switch (retCode) {
    case 120002:
      this.showLoginBox();
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
APP.updateUserMoney = function() {

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
 * Update Head User Info
 * @return {null}
 */
APP.updateHeadUserInfo = function() {

};

APP.showLoginBox = function() {

  if (!$('#user-login')[0]) {
    var html = '<div id="j-login-modal" class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><i class="icon icon-close"></i></button>登录</div><div class="modal-body"><div class="login-form"><label for="user">用户名：</label><input type="text" id="login-username"/><a href="/account/register">注册新用户</a></div><div class="login-form"><label for="pwd">登录密码：</label><input type="password" id="login-password"/><a href="#">找回密码</a></div><button class="btn btn-danger" id="user-login">立即登录</button></div></div></div></div>';
    $('body').append(html);
  }

  $('#j-login-modal').on('show.bs.modal', APP.centerModal);
  $('#j-login-modal').modal('show');
  $('#user-login').unbind();
  this.bindLoginEvent();

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
            APP.showTips(data.retMsg);
          }
        })
        .fail(function() {
          APP.showTips('Server has some error!');
        });
    } else {
      APP.showTips('帐号密码不能为空');
      return;
    }

  });

}

APP.createShowTipsHTML = function(obj) {
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
    var compiled = '<div class="friend-modal modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h4 class="modal-title j-apptips-title" id="myModalLabel">' + obj.title + '</h4></div><div class="modal-body text-center fc-84" id="apptips-content">' + html + '</div></div></div>';
    $('body').append(compiled);

  } else {

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
 * [showTips 拟态框]
 * @param  {Object} obj tips's HTML {title:'title', html:'html'}
 * @return {null}
 */
APP.showTips = function(o) {

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

APP.centerModal = function() {
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

$(window).on("resize", function() {
  $('.modal:visible').each(APP.centerModal);
});

APP.getUrlPara = function(paraName) {
  var sUrl = window.location.href;
  var sReg = "(?:\\?|&){1}" + paraName + "=([^&]*)"
  var re = new RegExp(sReg, "gi");
  re.exec(sUrl);
  return RegExp.$1;
};

APP.onSubmitConfirm = function(callback, data, html) {

  $.ajax({
      url: '/account/islogin',
      type: 'get',
      dataType: 'json',
    })
    .done(function(D) {
      if (D.retCode === 100000) {
        if (Number(D.retData.money.replace(/,/g, '')) >= data.byNum) {
          APP.showTips(html);
          $('#buyConfirm').on('click', function(event) {
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

APP.onServiceFail = function() {
  APP.showTips('服务器繁忙,请稍后再试!');
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
        APP.updateUserMoney();
        APP.showTips({
          text: '合买成功!',
          type: 1,
          onConfirm: function() {
              window.location.reload();
          }
        });
        $('body').on('click', '.close', function(event) {
          window.history.go(0);
        });
      } else {
        APP.handRetCode(data.retCode, data.retMsg);
      }
    })
    .fail(function() {
      APP.onServiceFail();
    });

};

////////////////////////////////////////////////////////////////////////////
/**
 * ALL Page Common Event
 */
$(function() {

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

});