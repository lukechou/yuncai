$(function() {
  init();

  function init() {
    var loty = store.get('lotyName');
    var lotyNameObj = {
      ssq: '双色球',
      dlt: '大乐透',
      jczq: '竞彩足球',
    };
    var type = lotyNameObj[loty];

    if (!store.enabled) {
      alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.')
      return
    }

    $('#j-type').html(type).attr('href', '/lottery/buy/' + loty);
    $('#j-jixu').attr('href', '/lottery/buy/' + loty);
  }
});