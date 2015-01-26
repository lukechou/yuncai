$(function () {

  var html = '';
  $.ajax({
      url: '/account/islogin',
      type: 'get',
      dataType: 'json',
    })
    .done(function (data) {
      if (data.retCode === 100000) {
        html = '<span>欢迎来到彩胜网&nbsp;!&nbsp;&nbsp;&nbsp;&nbsp;<img src="' + staticHostURI + '/front_images/bor.png" alt="bor"></span>' + data.retData.username + '       账户余额:<span id="userMoney">' + data.retData.money + '</span>元<a href="/account/top-up" class="active">充值</a><img src="http://static3.yuncai.com/front_images/bor.png" alt="bor"><a href="/account/logout">退出</a><img src="http://static3.yuncai.com/front_images/bor.png" alt="bor"><a href="/account/index" class="last">我的账户</a><img src="http://static3.yuncai.com/front_images/top-down.png" alt="bor">';
        $('#hd-top').html(html);
      }
    });

  init();

  function init() {

    var loty = store.get('lotyName');
    var pay = store.get('payMoney');
    var projectNo = store.get('projectNo');
    var trackId = store.get('trackId');

    var lotyNameObj = {
      ssq: '双色球',
      dlt: '大乐透',
      jczq: '竞彩足球',
    };
    var type = store.get('lotyCNName') || lotyNameObj[loty];
    var url = '';

    if (!store.enabled) {
      alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.');
      return;
    }

    $('#j-fu-money').html(pay);

    if (typeof projectNo !== "undefined") {
      url = '/lottery/project-detail/index?loty_name=' + loty + '&project_no=' + projectNo;
    } else {
      url = '/account/track/detail?trackId=' + trackId + '&lotyName=' + loty;
    }

    $('#j-type').html(type).attr('href', '/lottery/buy/' + loty);
    $('#j-detail').attr('href', url);
    $('#j-jixu').attr('href', '/lottery/buy/' + loty);
  }

});