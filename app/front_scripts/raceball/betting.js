define(['jquery'], function($) {
  'use strict';

  var bindEvent = function() {

    // hover click btn
    $('.towLine').on('mousemove', 'em', function(event) {
      if (!$(this).hasClass('active') && !$(this).hasClass('rq')) {
        $(this).addClass('hover');
      };
    });

    $('.towLine').on('mouseout', 'em', function(event) {
      if ($(this).hasClass('hover')) {
        $(this).removeClass('hover');
      };
    });

    $('.towLine').on('click', 'em', function(event) {
      $(this).toggleClass('active');
      debugger
      console.log('add one zhu to right aside');
    });


    //切换购买类型
    $('#j-vote-nav').on('click', 'a', function(event) {
      var type = $(this).attr('data-type');
      $('#bettingBox').removeClass('onlySpf onlyRqSpf').addClass(type)
    });

    //  购买主体 Toggle
    $('.j-dataBody-toggle').on('click', function(event) {
      $(this).parents('dl').find('dd').toggle();
    });

    // 投注提示 Toggle
    $('#j-touzhu-tips').on('click', function(event) {
      $('#j-touzhu-tipstext').toggle();
      $(this).find('.icon').toggleClass('icon-bup').toggleClass('icon-bdown');
    });

    // 同意投注规则
    $('#orderRule').on('click', function(event) {
      $(this).find('.icon').toggleClass('icon-cbox').toggleClass('icon-cgou');
    });


    // 加减控件
    $('.j-coutn-total').on('click', '.j-count', function(event) {

      var m = $(this).siblings('.btn-results'),
        c = $(this).attr('data-c'),
        r = m.attr('data-r');
      updateCount(m, c);

    });

    $('.btn-results').on('keyup', function(event) {

      var r = $(this).attr('data-r');
      $(this).val(filterNum($(this).val()));

    });

  };

  var filterNum = function(v) {

    var n = parseInt(v, 10);

    if (isNaN(n)) {
      n = 1;
    } else {
      n = (n >= 1) ? n : 1;
      n = n;
    }
    return n;
  };


  var updateCount = function(m, c) {
    var v = parseInt(m.val(), 10);
    if (c == 1) {
      v++;
    } else {
      v--;
    }
    v = (v >= 1) ? v : 1;
    m.val(v);
  };

  return {
    bindEvent: bindEvent
  };
});