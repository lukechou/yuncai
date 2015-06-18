require.config({
  paths: {
    jquery: '../lib/jquery',
    bootstrap: '../lib/bootstrap.min',
    app: '../common/app',
    zclip: '../lib/zclip',
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    },
    zclip: {
      deps: ['jquery'],
      exports: 'jquery'
    }
  },
});

require(['jquery', 'app', 'zclip', 'bootstrap'], function($, APP, ZeroClipboard) {

  'use strict';

  function initClip() {

    var swfPath = staticHostURI + '/front_scripts/lib/ZeroClipboard.swf';
    var clipBtns = $("#j-nav-text").val();

    ZeroClipboard.config({
      swfPath: swfPath
    });

    var client = new ZeroClipboard($("#j-zclip"));

    client.on("ready", function(readyEvent) {

      client.on("beforecopy", function(event) {});

      client.on("aftercopy", function(event) {
        APP.showTips("复制成功!");
      });

    });

  }

  initClip();

  $('#j-address').on('change', function(event) {
    event.preventDefault();

    $('#j-zclip').attr('data-clipboard-text', $(this).val());
  });

});