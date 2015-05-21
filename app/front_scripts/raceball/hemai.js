define(['jquery'], function ($) {
  'use strict';
  var hemai = (function () {
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

    hemai.prototype.updateHemai = function (copies, oneCopiesMoney, rengouCopies, ticheng, rengouPercent, baodiPercent, baodiCopies) {

      var _this = this;
      var box = _this.box;

      // 更新份数,每份金额,认购份数,提成百分比,认购百分比
      box.find('.j-share-num').val(copies);
      box.find('.j-unit-price').html(oneCopiesMoney);
      box.find('.j-rengou').val(rengouCopies);
      box.find('.br-select').val(ticheng);
      box.find('.j-rengou-percentage').html(rengouPercent);

      // 保底金额,保底百分比,认购
      box.find('.j-baodi-text').val(baodiCopies);
      box.find('.j-baodi-percent').html(baodiPercent);
      box.find('.j-rengou-tip').html(rengouCopies * oneCopiesMoney);
      box.find('.j-baidi-tip').html(baodiCopies * oneCopiesMoney);
      box.find('.j-totalm-tip').html((rengouCopies + baodiCopies) * oneCopiesMoney);

    };

    hemai.prototype.setHeMaiTotal = function () {

      var _this = this;
      var box = _this.box;

      // 方案总金额
      var totalMoney = box.find('#j-total-money').html() * 1;

      // 获取份数
      var copies = box.find('.j-share-num').val();

      // 单份金额
      var oneCopiesMoney = '';

      // 认购金额
      var rengouMoney = '';

      // 认购份数
      var rengouCopies = box.find('.j-rengou').val();

      // 认购百分比
      var rengouPercent = '';

      // 提成
      var ticheng = box.find('.br-select').val() * 1 || 0;

      // 保底金额 b-用户输入保底份数
      var baodiCopies = '';
      var baodiPercent = '';
      var b = parseInt(box.find('.j-baodi-text').val()) || 0;
      var isBaodi = true;
      var isFullBao = box.find('#j-full-bao')[0].checked;

      if (isFullBao) {
        box.find('.j-baodi-text').attr('readonly', true);
      } else {
        box.find('.j-baodi-text').removeAttr('readonly');
      }

      copies = Number(copies.replace(/[^0-9]/g, ''));
      rengouCopies = Number(rengouCopies.replace(/[^0-9]/g, ''));

      // 无购买总金额
      if (totalMoney === 0) {
        ZHUI.updateHemai(0, ticheng, 0, 0, 0);
        return;
      }

      // 生成对应份数
      if (totalMoney % copies === 0) {
        oneCopiesMoney = totalMoney / copies;
      } else {
        oneCopiesMoney = 2;
        copies = totalMoney / 2;
      }

      // 认购份数小于0 或大于总份数时
      if (rengouCopies <= 0) {
        rengouCopies = 1;
      }

      if (copies < rengouCopies) {
        rengouCopies = copies;
      }

      if (rengouCopies / copies < .05) {
        rengouCopies = Math.ceil(copies * .05);
      }

      // 认购金额必须大于提成金额
      if (ticheng > (rengouCopies / copies * 100)) {
        rengouCopies = Math.ceil(copies * ticheng * 0.01);
      }
      rengouMoney = rengouCopies * oneCopiesMoney;

      // 设置保底份数
      if (isBaodi) {

        box.find('.j-baodi-text')[0].disabled = false;

        if ((b + rengouCopies) < copies) {

          baodiCopies = b;

        } else {

          baodiCopies = copies - rengouCopies;

        }

        if (isFullBao) {
          baodiCopies = copies - rengouCopies;
        }

        baodiPercent = (baodiCopies / copies * 100).toFixed(2);

      } else {
        box.find('.j-baodi-text')[0].disabled = true;
        baodiCopies = 0;
        baodiPercent = '0.00';
      }

      if (totalMoney === 0) {
        rengouPercent = 0;
      } else {
        rengouPercent = (rengouCopies / copies * 100).toFixed(2);
      }

      _this.updateHemai(copies, oneCopiesMoney, rengouCopies, ticheng, rengouPercent, baodiPercent, baodiCopies);

    };

    hemai.prototype.inputOnfocus = function (el) {
      if ($.trim(el.val()) == el.attr('data-text')) {
        el.parents('p').find('.j-btext-total').html(0)
        el.val('')
      }
    };

    hemai.prototype.inputOnblur = function (el) {
      var text = el.attr('data-text');
      if ($.trim(el.val()) == '') {
        el.val(text);
        el.parents('p').find('.j-btext-total').html(text.length)
      }
    };

    hemai.prototype.reSetStrsize = function (t) {

      var len = t.val().length;
      var size = parseInt(t.attr('data-size'));

      if (len <= size) {
        t.parents('p').find('.j-btext-total').html(len)
      } else {
        t.val(t.val().slice(0, (size - 1)))
        t.parents('p').find('.j-btext-total').html(size)
      }

    };

    hemai.prototype.init = function () {

      var _this = this;

      $('.j-rengou,.br-select,#j-full-bao,.j-baodi-text,.j-share-num').on('change', function (event) {
        _this.setHeMaiTotal();
      });

      $('.br-textarea,.j-project-title').on('focus', function (event) {
        _this.inputOnfocus($(this));
      });

      $('.br-textarea,.j-project-title').on('blur', function (event) {
        _this.inputOnblur($(this));
      });

      $('.br-textarea,.j-project-title').on('keyup', function (event) {
        _this.reSetStrsize($(this));
      });

      $('.br-set-group').on('click', '.br-set', function (event) {
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