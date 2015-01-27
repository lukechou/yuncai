define(['jquery'], function ($) {
  'use strict';

  var gdx = (function () {
    'use strict';

    function gdx(args) {
      // enforces new
      if (!(this instanceof gdx)) {
        return new gdx(args);
      }
      // constructor body
    }

    gdx.prototype = {};

    gdx.prototype.init = function (args) {
      for (var prop in args) {
        if (args.hasOwnProperty(prop)) {
          this[prop] = args[prop];
        }
      }
    };

    return gdx;

  }());

  var p = new gdx();
  return p;

});