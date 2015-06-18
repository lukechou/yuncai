/* 购买失败 Page */
require.config({
  paths: {
    jquery: '../lib/jquery',
    bootstrap: '../lib/bootstrap.min',
    store: '../lib/store.min',
    app: '../common/app',
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    }
  },
});

require(['jquery', 'app', 'store', 'bootstrap'], function($, APP, store) {

  APP.updateHeadUserInfo();

  init();

  function getHotLoty() {
    $.ajax({
        url: '/account/suggest-lottery/ajax',
        type: 'get',
        dataType: 'json',
      })
      .done(function(data) {

        if (data.retCode === 100000) {

          var html = '';
          var item = data.retData.data;
          var index = '';

          if (item.length) {

            for (var i = 0; i < item.length; i++) {

              index = (i % 2 === 0) ? 'odd' : 'even';

              html += '<div class="content-left ' + index + '"><div class="re-img clearfix">';
              html += '<img src="' + staticHostURI + '/front_images/lottery/' + item[i]['lotyname'] + '_logo.png" alt="' + item[i]['lotyCnname'] + '" />';
              html += '<div><p class="title fs-yh">' + item[i]['lotyCnname'] + '</p>';
              html += '<p class="slogan fs-yh">' + item[i]['lotytitle'] + '</p></div>';
              html += '</div>';
              html += '<div><a href="' + item[i]['lotyUrl'] + '" target="_blank" class="btn btn-red fs-yh btn-big">立即投注</a></div>';
              html += '<div class="tips tips-left"><i class="icon icon-gray-dot"></i>' + item[i]['lotyTips'] + '</div>';
              html += '</div>';

            };

          }

          $('#j-hot-loty').html(html);
        }

      });

  }
  function init() {
    var loty = store.get('lotyName');
    var lotyNameObj = {
      ssq: '双色球',
      dlt: '大乐透',
      jczq: '竞彩足球',
    };

    //    var type = lotyNameObj[loty];
    var type = store.get('lotyCNName');

    if (!store.enabled) {
      alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.')
      return
    }

    $('#j-type').html(type).attr('href', '/lottery/buy/' + loty);
    $('#j-jixu').attr('href', '/lottery/buy/' + loty);
     getHotLoty();
  }
});