define(['jquery', 'app'], function ($, APP) {
  'use strict';

  var inp = (function () {

    function inp(args) {
      // enforces new
      if (!(this instanceof inp)) {
        return new inp(args);
      }
      // constructor body
    }

    /*
     * parentClass  input 父元素 className
     * inpEl  添加事件的DOM元素
     * idGrop  对应DOM的ID
     * method  正则不同的东西
     * val  当前值
     * onBlur  失去焦点回调
     */
    inp.prototype = {
      Parent: null,
      parentClass: '.info-list',
      inpEl: '.j-tips-inp',
      idGroup: {},
      inpWarm: '.j-tips-w',
      inpSuc: '.j-tips-s',
      inpErr: '.j-tips-e',
      method: null,
      val: null,
      onBlur: null,
      regGroup: {
        email: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
        pwd: /^[^\s]{6,15}$/,
        bank: /^\d{19}$/,
        mobile:/^1[0-9]{10}$/,
      }
    };

    inp.prototype.elParent = function (el) {
      return el.parents(this.parentClass);
    };

    inp.prototype.onBlur = function () {

      if (this.regGroup[this.method].test(this.val)) {

        this.successShow();

      } else {

        this.errorShow();

      }

    };

    inp.prototype.bindFocusEvent = function () {

      var _this = this;
      $(_this.inpEl).on('focus', function (event) {

        _this.Parent = _this.elParent($(this));
        _this.warmingShow();

      });

    };

    inp.prototype.bindBlurEvent = function () {

      var _this = this;

      $(_this.inpEl).on('blur', function (event) {

        _this.method = $(this).attr('data-method');
        _this.val = $(this).val();
        _this.Parent = _this.elParent($(this));

        if (_this.onBlur) {
          _this.onBlur();
        }

      });

    };

    inp.prototype.init = function (args) {

      for (var prop in args) {
        if (args.hasOwnProperty(prop)) {
          this[prop] = args[prop];
        }
      }

      var _this = this;

      _this.bindFocusEvent();

      _this.bindBlurEvent();

    };

    inp.prototype.hideAllTips = function () {
      this.Parent.find(this.inpSuc + ',' + this.inpErr + ',' + this.inpWarm).addClass('hide');
    };

    inp.prototype.successShow = function () {
      this.hideAllTips();
      this.Parent.find(this.inpSuc).removeClass('hide');
    };

    inp.prototype.errorShow = function () {
      this.hideAllTips();
      this.Parent.find(this.inpErr).removeClass('hide');
    };

    inp.prototype.warmingShow = function () {
      this.hideAllTips();
      this.Parent.find(this.inpWarm).removeClass('hide');
    };

    inp.prototype.checkInp = function (status, idGroup) {

      var _this = this;
      var paramStatus = true;
      var st = status || {};

      _this.idGroup = idGroup;

      for (var key in st) {
        if (st.hasOwnProperty(key)) {

          if (!st[key]) {

            paramStatus = false;

            if (_this.idGroup[key]) {
              _this.Parent = _this.elParent($('#' + _this.idGroup[key]));
              _this.errorShow();
            }

          }

        }
      }

      return paramStatus;
    };

    return inp;
  }());

  return new inp();

});