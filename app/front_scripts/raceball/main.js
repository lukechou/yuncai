require.config({
    paths: {
        jquery: '../lib/jquery',
        bootstrap: '../lib/bootstrap.min',
        lodash: '../lib/lodash.compat.min',
        app: '../common/app',
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

require(['jquery', 'lodash', 'app', 'bootstrap'], function($, _, APP) {
    'use strict';
    // use app here
    APP.init();
    console.log('Running jQuery %s', $().jquery);
});













