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

});