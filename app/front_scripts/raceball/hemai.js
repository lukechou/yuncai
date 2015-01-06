define(['jquery'], function($) {
  'use strict';
  var hemai = (function() {
    'use strict';

    function hemai(args) {
      // enforces new
      if (!(this instanceof hemai)) {
        return new hemai(args);
      }
      // constructor body
    }

    hemai.prototype = {
      box: $('#ballModal'),
    };

    hemai.prototype.setHeMaiTotal = function() {

      var _this = this;
      var box = _this.box;

      // 方案总金额
      var m = box.find('#j-total-money').html() * 1;
      var rengouMoney = '';
      var ticheng = '';

      var conf = {
        minRengouMoney: Math.ceil(m * .05),
        RemgouMoneyVal: box.find('.j-rengou').val() * 1,
      }

      rengouMoney = (conf.RemgouMoneyVal < conf.minRengouMoney) ? conf.minRengouMoney : conf.RemgouMoneyVal;

      ticheng = box.find('.br-select').val() * 1 || 0;

      if (rengouMoney > m) {
        rengouMoney = m
      } else {
        if (rengouMoney <= 0) {
          rengouMoney = m
        }
      }

      // 对比 认购百分比 和 我要提成
      if (ticheng < (rengouMoney / m * 100)) {} else {
        rengouMoney = Math.ceil(ticheng * 0.01 * m);
      }

      //我要保底金额
      var baodiMoney = '';
      var baodiPercent = '';
      var b = '';
      var isBaodi = true;
      var isFullBao = box.find('#j-full-bao')[0].checked;

      if (isFullBao && m != 0) {
        baodiMoney = m - rengouMoney;
        baodiPercent = (baodiMoney / m * 100).toFixed(2);
      } else {

        b = parseInt(box.find('.j-baodi-text').val()) || 0;

        if (b == 0) {
          baodiMoney = 0;
          baodiPercent = '0.00';
        } else {
          if ((b + rengouMoney) < m) {
            baodiMoney = b
            baodiPercent = (baodiMoney / m * 100).toFixed(2);
          } else {
            baodiMoney = m - rengouMoney;
            baodiPercent = (baodiMoney / m * 100).toFixed(2);
          }
        }

      }

      box.find('.j-rengou').val(rengouMoney);
      box.find('.br-select').val(ticheng);
      if (m === 0) {
        box.find('.j-rengou-percentage').html(0);
      } else {
        box.find('.j-rengou-percentage').html((rengouMoney / m * 100).toFixed(2));
      }

      //如果要保底 更新保底金额
      box.find('.j-baodi-text').val(baodiMoney);
      box.find('.j-baodi-percent').html(baodiPercent);
      box.find('.j-rengou-tip').html(rengouMoney);
      box.find('.j-baidi-tip').html(baodiMoney);
      box.find('.j-totalm-tip').html(rengouMoney + baodiMoney);

    };

    hemai.prototype.inputOnfocus = function(el) {
      if ($.trim(el.val()) == el.attr('data-text')) {
        el.parents('p').find('.j-btext-total').html(0)
        el.val('')
      }
    };

    hemai.prototype.inputOnblur = function(el) {
      var text = el.attr('data-text');
      if ($.trim(el.val()) == '') {
        el.val(text);
        el.parents('p').find('.j-btext-total').html(text.length)
      }
    };

    hemai.prototype.reSetStrsize = function(t) {

      var len = t.val().length;
      var size = parseInt(t.attr('data-size'));

      if (len <= size) {
        t.parents('p').find('.j-btext-total').html(len)
      } else {
        t.val(t.val().slice(0, (size - 1)))
        t.parents('p').find('.j-btext-total').html(size)
      }

    };

    hemai.prototype.init = function() {

      var _this = this;

      $('.j-rengou').on('change', function(event) {
        _this.setHeMaiTotal();
      });

      $('.br-select').on('change', function(event) {
        _this.setHeMaiTotal();
      });

      $('#j-full-bao').on('change', function(event) {
        _this.setHeMaiTotal();
      });

      $('.j-baodi-text').on('change', function(event) {
        _this.setHeMaiTotal();
      });

      $('.br-textarea').on('focus', function(event) {
        _this.inputOnfocus($(this));
      });

      $('.j-project-title').on('focus', function(event) {
        _this.inputOnfocus($(this));
      });

      $('.br-textarea').on('blur', function(event) {
        _this.inputOnblur($(this));
      });

      $('.j-project-title').on('blur', function(event) {
        _this.inputOnblur($(this));
      });

      $('.br-textarea').on('keyup', function(event) {
        _this.reSetStrsize($(this));
      });

      $('.j-project-title').on('keyup', function(event) {
        _this.reSetStrsize($(this));
      });

      $('.br-set-group').on('click', '.br-set', function(event) {
        $(this).siblings('.active').removeClass('active');
        $(this).addClass('active');
      });

    };

    return hemai;

  }());

  var h = new hemai();
  h.init();
  return h;
});