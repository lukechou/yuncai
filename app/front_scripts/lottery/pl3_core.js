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
     * 获取最后一条错误提示信息
     * @return {[type]} [description]
     */
    pl3.prototype.getLastErrorMsg = function () {
      return this.errorMsg;
    };

    /**
     * 验证输入的内容是否合法
     * @param  {[type]}  code [description]
     * @return {Boolean}      [description]
     */
    pl3.prototype.isIllegalCode = function (code, callback) {

      var returnZhushu = 0;
      var returnCodes = [];
      var allDigitalCodes = code.split(this.digitalCodeConnector);
      var digitalCodes = null;
      var hash = {};
      if (!this.ZhiXuanNormal.codeRegex.test(code)) {
        this.errorMsg = "投注号码格式错误, 参考格式:12,34,56,78,90或者12，34，56，78，90";
        return false;
      }

      for (var m = 0; m < allDigitalCodes.length; m++) {
        digitalCodes = allDigitalCodes[m].split('');
        hash = {};
        returnCodes[m] = digitalCodes;
        for (var n = 0; n < digitalCodes.length; n++) {
          if (hash[digitalCodes[n]]) {
            this.errorMsg = this.digitalDescMap[m] + "重复投注了:" + digitalCodes[n];
            return false;
          }
          hash[digitalCodes[n]] = true;
        }
      }

      returnZhushu += this.getZhiXuanZhushu(allDigitalCodes[0].split(''), allDigitalCodes[1].split(''), allDigitalCodes[2].split(''), allDigitalCodes[3].split(''), allDigitalCodes[4].split(''));
      callback(returnCodes, returnZhushu);

      return true;

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
      return Math.getCombineNum(tuoCodes.length, this.ZiXuan3Normal.oneBetCodeNum - danCodes.length);
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
     * 获取组选3胆托投注的注数
     * @param  {[type]} codes [description]
     * @return {[type]}      [description]
     */
    pl3.prototype.getZuXuan3DanTuoZhushu = function (danCodes, tuoCodes) {
      return Math.getCombineNum(tuoCodes.length, this.ZiXuan6Normal.oneBetCodeNum - danCodes.length);
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

    /**
     * 检测选取号码是否符合条件
     * @return {Boolean}
     */
    pl3.prototype.isLegalChoose = function () {
      debugger
      var b = this.nav.big;
      var s = this.nav.small;
      if (b === 'zx' && s === 'cgtz') {
        for (var i = this.G_CHOOSE.codes.length - 1; i >= 0; i--) {
          if (!(this.G_CHOOSE.codes[i][0].length > 0 && this.G_CHOOSE.codes[i][1].length > 0 && this.G_CHOOSE.codes[i][2].length > 0)) {

            return true;
          }
        }
      }

      if (b === 'zx6' && s === 'cgtz') {
        if (this.G_CHOOSE.codes[0][0]) {
          return true;
        }
      }

      if (b === 'zx3' && s === 'cgtz') {
        debugger
      }

      return false;
    }

    pl3.prototype.makeChooseCodeHtml = function (codes) {

      var newCodes = codes;
      var html = '';
      var totalMoney = 0;
      var _this = this;

      for (var i = 0; i < newCodes.length; i++) {
        _this.G_BUY.rowIndex++;
        html += '<div class="br-zhu-item clearfix" dataBit=' + _this.G_BUY.rowIndex + '><b>[常规投注]</b><div class="list">';
        for (var m = 0; m < newCodes[i].length; m++) {
          html += '<span data-c="0">' + newCodes[i][m].join('') + '</span>';
        };

        var money = 2 * _this.getZhiXuanZhushu(newCodes[i][0], newCodes[i][1], newCodes[i][2]);
        totalMoney += money;
        var mdfBtn = (_this.G_BUY.isManual) ? '' : '<a href="javascript:;" class="br-zhu-set">修改</a>';
        html += '</div><div class="pull-right"><b><i class="money" data-m="1">' + money + '</i>元</b>' + mdfBtn + '<a href="javascript:;" class="br-zhu-del">删除</a></div></div>';
        _this.G_BUY.codes.push({
          key: _this.G_BUY.rowIndex,
          value: newCodes[i]
        });
      }
      if (totalMoney > _this.maxOneBetMoney) {
        APP.showTips('您好，单个投注的金额应小于' + _this.maxOneBetMoney + '元，请返回重新选择');
        return false;
      }
      if (_this.G_BUY.codes.length > _this.maxBuyCodeLength) {
        APP.showTips('您的投注号码多于' + _this.maxBuyCodeLength + '行，请返回重新选择');
        return;
      }

      $("#code_list").append(html);
      return true;

    };

    return pl3;

  }());

  var p = new pl3();
  return p;

});