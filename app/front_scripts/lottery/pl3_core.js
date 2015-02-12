define(['jquery'], function ($) {
  'use strict';

  var pl3 = (function () {
    'use strict';

    function pl3(args) {
      // enforces new
      if (!(this instanceof pl3)) {
        return new pl3(args);
      }
      // constructor body
    }

    pl3.prototype = {
      digitalCodeConnector: ',',
      errorMsg: '',
      maxOneBetMoney: 20000,
      maxBuyCodeLength: 100,
      maxMultiple: 9999,
      minMultiple: 1,
      maxBetNum: 100,
      minBetNum: 1,
      maxIssueNum: 30,
      minIssueNum: 1,
      ZhiXuanNormal: {
        minCode: 0,
        maxCode: 9,
        oneBetCodeDigitalNum: 3, // 需要三位组成
        unitDigtalNum: 1, // 每位一个数
        codeRegex: /^([0-9]{1,10}[,]){4}([0-9]{1,10})$/,
      },
      ZhixuanHeZhi: {
        minCode: 0,
        maxCode: 27,
        oneBetCodeNum: 1,
      },
      ZiXuan3Normal: {
        minCode: 0,
        maxCode: 9,
        oneBetCodeNum: 2,
      },
      Zixuan3HeZhi: {
        minCode: 1,
        maxCode: 26,
        oneBetCodeNum: 1,
      },
      ZiXuan6Normal: {
        minCode: 0,
        maxCode: 9,
        oneBetCodeNum: 3,
      },
      Zixuan6HeZhi: {
        minCode: 3,
        maxCode: 24,
        oneBetCodeNum: 1,
      },
    };

    pl3.prototype.init = function (args) {
      for (var prop in args) {
        if (args.hasOwnProperty(prop)) {
          this[prop] = args[prop];
        }
      }
    };

    /**
     * 验证输入的内容是否合法
     * @param  {[type]}  code [description]
     * @return {Boolean}      [description]
     */
    pl3.prototype.getIllegalCode = function (code, callback) {

      var returnZhushu = 0;
      var returnCodes = [];
      var allDigitalCodes = code.split(this.digitalCodeConnector);
      var digitalCodes = null;
      var hash = {};
      var codeLen = _.uniq(allDigitalCodes).length;
      var regCode = null;

      switch (this.nav.big) {
      case 'zx':
        regCode = /^([0-9]{1,10}[,]){2}([0-9]{1,10})$/;
        break;
      case 'zx3':
        regCode = /^([0-9][,]){1,9}([0-9])$/;
        break;
      case 'zx6':
        regCode = /^([0-9][,]){2,9}([0-9])$/;
        break;
      default:
        return;
        break;
      }

      if (this.nav.big === 'zx3' && codeLen !== allDigitalCodes.length) {
        return;
      }

      if (this.nav.big === 'zx6' && codeLen !== allDigitalCodes.length) {
        return false;
      }

      if (!regCode.test(code)) {
        return false;
      }

      for (var m = 0; m < allDigitalCodes.length; m++) {
        digitalCodes = allDigitalCodes[m].split('');
        hash = {};
        returnCodes[m] = digitalCodes;
        for (var n = 0; n < digitalCodes.length; n++) {
          if (hash[digitalCodes[n]]) {
            return false;
          }
          hash[digitalCodes[n]] = true;
        }
      }

      return returnCodes.sort(function (a, b) {
        return a - b;
      });

    }

    /**
     * 获取直选注数,传入该住数组即可
     * @param  {Array} 该注数组  Arrray[Array,Array,Array]
     * @return {Number} 注数
     */
    pl3.prototype.getZxZhushu = function (arr) {

      var num = [];
      var total = 1;

      for (var i = arr.length - 1; i >= 0; i--) {
        num.push(Math.getCombineNum(arr[i].length, 1, 'C'));
      };

      for (var i = num.length - 1; i >= 0; i--) {
        total *= num[i];
      };

      return total;
    }

    /**
     * 直选
     * @param  {[type]} hundredCodes  [description]
     * @param  {[type]} tenCodes      [description]
     * @param  {[type]} digitalCodes  [description]
     * @return {[type]}               [description]
     */
    pl3.prototype.getZhiXuanZhushu = function (hundredCodes, tenCodes, digitalCodes) {
      var hundredNum = Math.getCombineNum(hundredCodes.length, 1, 'C');
      var tenNum = Math.getCombineNum(tenCodes.length, 1, 'C');
      var digitalNum = Math.getCombineNum(digitalCodes.length, 1, 'C');
      return hundredNum * tenNum * digitalNum;
    }

    /**
     * 获取直选合值的注数
     * @param  {[type]} codes [description]
     * @return {[type]}      [description]
     */
    pl3.prototype.getZhiXuanHeZhiZhushu = function (codes) {
      var hezhiZhushuMap = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 63, 69, 73, 75, 75, 73, 69, 63, 55, 45, 36, 28, 21, 15, 10, 6, 3, 1];
      var zhushu = 0;
      for (var i = codes.length - 1; i >= 0; i--) {
        zhushu += hezhiZhushuMap[codes[i]] | 0;
      };
      return zhushu;
    }

    /**
     * 获取组选3常规投注的注数
     * @param  {[type]} codes [description]
     * @return {[type]}      [description]
     */
    pl3.prototype.getZuXuan3NormalZhushu = function (codes) {
      return 2 * Math.getCombineNum(codes.length, this.ZiXuan3Normal.oneBetCodeNum);
    }

    /**
     * 获取组选3合值投注的注数
     * @param  {[type]} codes [description]
     * @return {[type]}      [description]
     */
    pl3.prototype.getZuXuan3HeZhiZhushu = function (codes) {
      var hezhiZhushuMap = [1, 2, 1, 3, 3, 3, 4, 5, 4, 5, 5, 4, 5, 5, 4, 5, 5, 4, 5, 4, 3, 3, 3, 1, 2, 1];
      var zhushu = 0;
      for (var i = codes.length - 1; i >= 0; i--) {
        zhushu += hezhiZhushuMap[codes[i] - 1] | 0;
      };
      return zhushu;
    }

    /**
     * 获取组选3胆托投注的注数
     * @param  {[type]} codes [description]
     * @return {[type]}      [description]
     */
    pl3.prototype.getZuXuan3DanTuoZhushu = function (danCodes, tuoCodes) {
      var danLen = danCodes.length;
      var tuoLen = tuoCodes.length;
      if (danLen === 0 || tuoLen === 0) {
        return 0;
      }
      var total = Math.getCombineNum(tuoLen, this.ZiXuan3Normal.oneBetCodeNum - danLen) * 2;
      return total;
    }

    /**
     * 获取组选6常规投注的注数
     * @param  {[type]} codes [description]
     * @return {[type]}      [description]
     */
    pl3.prototype.getZuXuan6NormalZhushu = function (codes) {
      return Math.getCombineNum(codes.length, this.ZiXuan6Normal.oneBetCodeNum);
    }

    /**
     * 获取组选6合值的注数
     * @param  {[type]} codes [description]
     * @return {[type]}      [description]
     */
    pl3.prototype.getZuXuan6HeZhiZhushu = function (codes) {
      var hezhiZhushuMap = [1, 1, 2, 3, 4, 5, 7, 8, 9, 10, 10, 10, 10, 9, 8, 7, 5, 4, 3, 2, 1, 1];
      var zhushu = 0;
      for (var i = codes.length - 1; i >= 0; i--) {
        zhushu += hezhiZhushuMap[codes[i] - 3] | 0;
      };
      return zhushu;
    };

    /**
     * 获取组选6胆托投注的注数
     * @param  {[type]} codes [description]
     * @return {[type]}      [description]
     */
    pl3.prototype.getZuXuan6DanTuoZhushu = function (danCodes, tuoCodes) {

      var danLen = danCodes.length;
      var tuoLen = tuoCodes.length;

      if (danLen === 0 || tuoLen === 0) {
        return 0;
      }

      var total = Math.getCombineNum(tuoLen, this.ZiXuan6Normal.oneBetCodeNum - danLen);

      return total;

    };

    /**
     * 生成直选常规投注号码
     * @param  {[type]} betNum [description]
     * @return {[type]}        [description]
     */
    pl3.prototype.produceZhixuanNormalCode = function (betNum) {

      var _this = this;
      var produceCodes = [];

      for (var i = betNum - 1; i >= 0; i--) {
        produceCodes[i] = [];

        for (var j = _this.ZhiXuanNormal.oneBetCodeDigitalNum - 1; j >= 0; j--) {
          produceCodes[i][j] = [];
          produceCodes[i][j].push(Math.getRandomInt(_this.ZhiXuanNormal.minCode, _this.ZhiXuanNormal.maxCode));
        }
      };

      return produceCodes;
    };

    pl3.prototype.getBuyZhuListTitle = function () {

      var title = '';

      var b = {
        zx: '直选',
        zx3: '组选三',
        zx6: '组选六',
      };

      var t = b[this.nav.big];

      if (this.nav.small === 'cgtz') {
        if (this.nav.big === 'zx') {
          title = '普通投注';
        } else {
          title = t + '复式';
        }
      }
      if (this.nav.small === 'dt') {
        title = t + '胆拖';
      }
      if (this.nav.small === 'hz') {
        title = t + '和值';
      }

      if (this.nav.small === 'up') {
        title = '手动录入';
      }

      return title;
    };

    pl3.prototype.makeChooseCodeHtml = function (codes) {

      var newCodes = codes;
      var html = '';
      var totalMoney = 0;
      var _this = this;
      var money = 0;
      var mdfBtn = '';
      var title = _this.getBuyZhuListTitle();
      var isHz = _this.nav.small === 'hz' ? ' ' : '';

      for (var i = 0; i < newCodes.length; i++) {

        _this.G_BUY.rowIndex++;

        html += '<div class="br-zhu-item clearfix" dataBit=' + _this.G_BUY.rowIndex + '><b>[' + title + ']</b><div class="list">';



        for (var m = 0; m < newCodes[i].length; m++) {

          if(m===0 && _this.nav.small==='dt'){
            html += '<span data-c="0">(';
          }else{
            html += '<span data-c="0">';
          }

          html += newCodes[i][m].sort(function (a, b) {
            return a - b;
          }).join(isHz);

          if(m===0 && _this.nav.small==='dt'){
            html += ')</span>';
          }else{
            html += '</span>';
          }

        };

        money = _this.addMoney;

        totalMoney += money;

        if (_this.nav.small !== 'up') {
          mdfBtn = (_this.G_BUY.isManual) ? '' : '<a href="javascript:;" class="br-zhu-set">修改</a>';
        }

        html += '</div><div class="pull-right"><b><i class="money" data-m="1">' + money + '</i>元</b>' + mdfBtn + '<a href="javascript:;" class="br-zhu-del">删除</a></div></div>';

        _this.G_BUY.codes.push({
          key: _this.G_BUY.rowIndex,
          value: newCodes[i]
        });

      }

      $("#code_list").append(html);
      return true;
    };

    return pl3;

  }());

  var p = new pl3();
  return p;

});