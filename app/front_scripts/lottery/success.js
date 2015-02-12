$(function () {

  APP.updateHeadUserInfo();

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
    var type = store.get('lotyCNName');
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