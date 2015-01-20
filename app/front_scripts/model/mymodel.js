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
    modelComment: ''
  });

  model.bindCollectEvent();

  // 显示曲线图
  $('#track_detail_list').on('click', '.j-show-chart', function(event) {

    if (event.target.tagName !== 'A') {
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
      }else{
        $(this).removeClass('active');
        $('#chart-tr').remove();
      }
    }

  });
});