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

    client.on("load", function(client) {
      console.log("movie is loaded");
    });

    client.on("error", function(event) {

      APP.showTips('您所使用的浏览器不支持自动复制,请您手工复制。');
    });

    client.on("noflash", function(client, args) {
      console.log('noflash');
    });

    client.on("complete", function(client, args) {
      console.log("Copied text to clientboard: " + args.text);
    });

    client.on("mouseover", function(client) {
      console.log("mouse over");
    });

    client.on("mouseout", function(client) {
      console.log("mouse out");
    });

    client.on("mousedown", function(client) {
      console.log("mouse down");
    });

    client.on("mouseup", function(client) {
      console.log("mouse up");
    });



  }

  initClip();

  $('#j-address').on('change', function(event) {
    event.preventDefault();

    $('#j-zclip').attr('data-clipboard-text', $(this).val());
  });

});