define(['jquery'], function($) {
  'use strict';

  var user = (function() {

    function user(args) {
      // enforces new
      if (!(this instanceof user)) {
        return new user(args);
      }
      // constructor body
    }

    user.prototype = {};
    user.propotype.init = function() {
      $.ajax({
        url: '/path/to/file',
        type: 'default GET (Other values: POST)',
        dataType: 'default: Intelligent Guess (Other values: xml, json, script, or html)',
        data: {param1: 'value1'},
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

    }
    user.prototype.showLoginBox = function(callback) {

    };

    var a = new user();
    a.init();
    return a;
  });
});
