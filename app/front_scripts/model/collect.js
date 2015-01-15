require.config({
  urlArgs: "bust=" + (new Date()).getTime(),
  paths: {
    jquery: '../lib/jquery',
    lodash: '../lib/lodash.compat.min',
    store: '../lib/store.min',
    bootstrap: '../lib/bootstrap.min',
    app: '../common/app',
    model: 'model',
    chart: 'chart',
    highcharts: 'highcharts'
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    }
  }
});

require(['jquery', 'lodash', 'store', 'chart', 'app', 'model', 'bootstrap'], function($, _, store, chart, APP, model) {
  'use strict';

  model.init({
    modal: $('#collect'),
    starList: $('.td-star-level a'),
    starLevel: null,
    modelId: null,
    starComment: '',
    modelComment: '',
    isCollectPage: true,
  });

  model.bindCollectEvent();

  var active = 'icon-y2';
  var noActive = 'icon-y';

  function getDelId() {
    var delIdArr = [];
    $('#j-collect-table tbody .' + active).each(function(index, el) {
      delIdArr.push($(this).attr('data-modelId'));
    });
    return delIdArr;
  }

  function toggleDelBtn(d) {
    if (d.length) {
      $('#j-del-manycollect').show(300);
    } else {
      $('#j-del-manycollect').hide();
    }
  }

  function updateTableIndex() {
    $('#j-collect-table tbody .index').each(function(index, el) {
      $(this).html(index + 1);
    });
  }

  $('#j-collect-table').on('click', 'thead .icon', function(event) {

    var t = $(this),
      delId;
    $(this).toggleClass(noActive + ' ' + active);
    if (t.hasClass(active)) {
      $('#j-collect-table .icon').removeClass(noActive).addClass(active);
    } else {
      $('#j-collect-table .icon').removeClass(active).addClass(noActive);
    }

    delId = getDelId();
    toggleDelBtn(delId);
  });

  $('#j-collect-table').on('click', 'tbody .icon', function(event) {
    var t = $(this),
      delId = '';
    $(this).toggleClass(noActive + ' ' + active);
    delId = getDelId();
    toggleDelBtn(delId);
    if (delId == 0) $('#j-collect-table thead .' + active).removeClass(active).addClass(noActive);
  });

  $('#j-del-manycollect').on('click', '.btn-del-collect', function(event) {
    event.preventDefault();

    var delId = getDelId();
    var obj = {
      model_id: delId.join(','),
      rnd: $.now()
    };

    $.ajax({
        url: '/lottery/trade/model-batch-cancel-collect',
        type: 'get',
        dataType: 'json',
        data: obj,
      })
      .done(function(D) {
        if (D.retCode === 100000) {
          for (var i = delId.length - 1; i >= 0; i--) {
            $('#track_detail_list tr[data-modelid=' + delId[i] + ']').remove();
            $('#j-del-manycollect').slideDown();
          };
          updateTableIndex();
        }
        APP.handRetCode(D.retCode, D.retMsg);
      })
      .fail(function() {
        APP.onServiceFail();
      });

  });

  // 显示曲线图
  $('#track_detail_list').on('click', '.j-show-chart', function(event) {

    if (event.target.tagName === 'TD') {
      var a = 'active';
      var id = $(this).attr('data-modelId');
      var colspan = $(this).find('td').length;
      var chartHTML = '<div class="chart-box"><a href="/lottery/model/history-data" class="his-link" title="查看历史数据">查看历史数据</a><div class="chart-loading" id="j-chart-loder"><img src="' + Config.staticHostURI + '/front_images/loader.gif" alt="Logding.."/></div><div class="chart" id="chart"></div></div>';
      var tr = '<tr id="chart-tr"><td colspan="' + colspan + '" style="padding:0;">' + chartHTML + '</td></tr>';
      if(!id) return;
      if (!$(this).hasClass(a)) {
        $('.j-show-chart').removeClass(a);
        $(this).addClass(a);
        $('#chart-tr').remove();
        $(this).after(tr);

        chart.init({
          chartEl: $('#chart')
        });
        chart.getChartData(id);
      }
    }
  });

});