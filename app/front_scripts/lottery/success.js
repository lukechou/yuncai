$(function() {
  init();

  function init() {
    var loty = store.get('lotyName');
    var type = (loty == 'ssq') ? '双色球' : '大乐透';
    var pay = store.get('payMoney');
    if (!store.enabled) {
      alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.')
      return
    }
    var projectNo = store.get('projectNo');
    var trackId = store.get('trackId');
    $('#j-fu-money').html(pay);
    if (typeof projectNo !== "undefined") {
      var url = '/lottery/project-detail/index?loty_name=' + loty + '&project_no=' + projectNo;
    } else {
      var url = '/account/track/detail?trackId=' + trackId + '&lotyName=' + loty;
    }
    $('#j-type').html(type).attr('href', '/lottery/buy/' + loty);
    $('#j-detail').attr('href', url);
    $('#j-jixu').attr('href', '/lottery/buy/' + loty);
  }

});