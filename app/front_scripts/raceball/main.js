require.config({
    paths: {
        jquery: '../lib/jquery',
        bootstrap: '../lib/bootstrap.min',
        scroll: '../lib/jquery.mCustomScrollbar.concat.min',
        lodash: '../lib/lodash.compat.min',
        betting: 'betting'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        scroll: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    }
});

require(['jquery', 'lodash', 'betting', 'bootstrap', 'scroll'], function($, _, B) {
    'use strict';

    B.init();

    $("#poolStep1 .scrollMoni").mCustomScrollbar({
        theme: "minimal",
        setHeight: 120,
    });

    $.ajax({
        url: 'http://kp2.yuncai.com/lottery/match-detail/index',
        type: 'get',
        dataType: 'jsonp',
        jsonp:"jsonpcallback",
    })
    .done(function(data) {
        debugger
        console.log("success");
    })
    .fail(function() {
        console.log("error");
    })
    .always(function() {
        console.log("complete");
    });

});