require.config({
    paths: {
        jquery: '../lib/jquery',
        bootstrap: '../lib/bootstrap.min',
        lodash: '../lib/lodash.compat.min',
        app: '../common/app',
        betting: 'betting'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        app: {
            deps: ['jquery'],
            exports: 'app'
        }
    }
});

require(['jquery', 'lodash', 'app', 'betting', 'bootstrap'], function($, _, APP, B) {
    'use strict';
    // use app here
    APP.init();
    B.bindEvent();
});