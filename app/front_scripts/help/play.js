require.config({
  paths: {
    jquery: '../lib/jquery',
    app: '../common/app',
    bootstrap: '../lib/bootstrap.min'
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    }
  }
});

require(['jquery', 'app'], function ($, APP) {

  APP.updateHeadUserInfo();

});