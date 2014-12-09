// Common Module
var APP = {};

APP.handRetCode = function(retCode, retMsg){
  switch(retCode){
    case 120002:
      this.showLoginBox();
    default:
      this.showTips(retMsg);
  }
}

APP.showLoginBox = function() {

  var html = '<div id="j-login-modal" class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="modal-header">登录</div><div class="modal-body"><div class="login-form"><label for="user">用户名：</label><input type="text"/><a href="/account/register">注册新用户</a></div><div class="login-form"><label for="pwd">登录密码：</label><input type="password"/><a href="#">找回密码</a></div><button class="btn btn-danger" id="user-login">立即登录</button></div></div></div></div>';

  $('body').append(html)
  $('#j-login-modal').modal('show')

  this.bindLoginEvent()
};

APP.bindLoginEvent = function() {

  $('#user-login').on('click', function(event) {
    event.preventDefault();
    debugger
  });

}

APP.showTips = function(h) {

  var html = '<div class="modal fade bs-example-modal-sm" id="myModal" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">温馨提示</h4></div><div class="modal-body text-center fc-84" id="tip-content"></div></div></div>';

  $('body').append(html)
  $('#tip-content').html(h)
  $('#myModal').modal('show')

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

  //APP.showLoginBox()
});