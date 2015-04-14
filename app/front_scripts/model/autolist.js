require.config({
  paths: {
    jquery: '../lib/jquery',
    lodash: '../lib/lodash.compat.min',
    store: '../lib/store.min',
    bootstrap: '../lib/bootstrap.min',
    app: '../common/app',
    tipsy: '../lib/jquery.tipsy',
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    },
    tipsy: {
      deps: ['jquery'],
      exports: 'jquery'
    },
  }
});

require(['jquery', 'lodash', 'store', 'app', 'bootstrap', 'tipsy'], function ($, _, store, APP) {
  'use strict';

  // Config-Constant
  var BET_MIN = 30; //最小投注
  var BET_MAX = 500000; //最大投注
  var INTERVAL_MIN = 0; //最小间隔
  var INTERVAL_MAX = 10; //最大间隔
  var NUM_MIN = 1; //最小期数
  var NUM_MAX = 50; //最大期数
  var PERCENT_MIN = -100; //最小比例
  var PERCENT_MAX = 1000; //最大比例





















});