require.config({
  paths: {
    jquery: '../lib/jquery',
    lodash: '../lib/lodash.compat.min',
    store: '../lib/store.min',
    bootstrap: '../lib/bootstrap.min',
    app: '../common/app',
    model: 'model',
    chart: 'chart',
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

  var active = 'icon-y2';
  var noActive = 'icon-y';

  $('#j-collect-table').on('click', 'thead .icon', function(event) {
    var t = $(this);
    $(this).toggleClass(noActive+' '+active);
    if (t.hasClass(active)) {
      $('#j-collect-table .icon').removeClass(noActive).addClass(active);
    } else {
      $('#j-collect-table .icon').removeClass(active).addClass(noActive)
    }
  });

  $('#j-collect-table').on('click', 'tbody .icon', function(event) {
    var t = $(this);
    $(this).toggleClass(noActive+' '+active);

  });

  $('#j-del-manycollect').on('click', function(event) {
    event.preventDefault();

    var obj = {
      model_id: [],
      rnd: null
    };

    $('#j-collect-table tbody .' + active).each(function(index, el) {
      obj.model_id.push(_.escape($(this).attr('data-id')));
    });

    $.ajax({
        url: '/lottery/trade/model-batch-cancel-collect',
        type: 'post',
        dataType: 'json',
        data: obj,
      })
      .done(function() {
        console.log("success");
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });

  });
});