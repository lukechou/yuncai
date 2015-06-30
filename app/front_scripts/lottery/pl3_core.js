define(['jquery', 'lodash', 'core'], function($, _) {
  'use strict';

  var pl3 = (function() {
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

    pl3.prototype.init = function(args) {
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
    pl3.prototype.getIllegalCode = function(code, callback) {

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

      return returnCodes.sort(function(a, b) {
        return a - b;
      });

    }

    /**
     * 获取直选注数,传入该住数组即可
     * @param  {Array} 该注数组  Arrray[Array,Array,Array]
     * @return {Number} 注数
     */
    pl3.prototype.getZxZhushu = function(arr) {

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
    pl3.prototype.getZhiXuanZhushu = function(hundredCodes, tenCodes, digitalCodes) {
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
    pl3.prototype.getZhiXuanHeZhiZhushu = function(codes) {
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
    pl3.prototype.getZuXuan3NormalZhushu = function(codes) {
      return 2 * Math.getCombineNum(codes.length, this.ZiXuan3Normal.oneBetCodeNum);
    }

    /**
     * 获取组选3合值投注的注数
     * @param  {[type]} codes [description]
     * @return {[type]}      [description]
     */
    pl3.prototype.getZuXuan3HeZhiZhushu = function(codes) {
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
    pl3.prototype.getZuXuan3DanTuoZhushu = function(danCodes, tuoCodes) {
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
    pl3.prototype.getZuXuan6NormalZhushu = function(codes) {
      return Math.getCombineNum(codes.length, this.ZiXuan6Normal.oneBetCodeNum);
    }

    /**
     * 获取组选6合值的注数
     * @param  {[type]} codes [description]
     * @return {[type]}      [description]
     */
    pl3.prototype.getZuXuan6HeZhiZhushu = function(codes) {
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
    pl3.prototype.getZuXuan6DanTuoZhushu = function(danCodes, tuoCodes) {

      var danLen = danCodes.length;
      var tuoLen = tuoCodes.length;

      if (danLen === 0 || tuoLen === 0) {
        return 0;
      }

      var total = Math.getCombineNum(tuoLen, this.ZiXuan6Normal.oneBetCodeNum - danLen);

      return total;

    };



    /*
     * 机选新玩法随机选号数组
     * @return Array
     */
    pl3.prototype.produceNewCodes = function() {

      var _this = this;
      var numArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      var groupArr = [0, 1, 2];
      var dxArr = ['1', '3'];
      var d1Index = 0;
      var result = [];
      var hsArr = [];
      var cd2 = '';
      var bx3 = '';

      if (_this.nav.small === 'd1') {

        d1Index = _.sample(groupArr);

        for (var j = _this.ZhiXuanNormal.oneBetCodeDigitalNum - 1; j >= 0; j--) {

          result[j] = [];

          if (j === d1Index) {

            result[j].push(_.sample(numArr));

          } else {

            result[j].push('_');
          }
        }

      }

      if (_this.nav.small === 'cd1') {

        result[0] = [_.sample(numArr)];

      }

      if (_this.nav.small === 'd2') {

        d1Index = _.sample(groupArr);

        for (var j = _this.ZhiXuanNormal.oneBetCodeDigitalNum - 1; j >= 0; j--) {

          result[j] = [];

          if (j === d1Index) {

            result[j].push('_');

          } else {

            result[j].push(_.sample(numArr));

          }
        }

      }

      if (_this.nav.small === 'cd2') {

        cd2 = _.sample(numArr, 2);
        result[0] = [
          [cd2[0]]
        ];
        result[1] = [
          [cd2[1]]
        ];
      }

      if (_this.nav.small === 'bx3') {

        var bx3Index = 0;
        var bx3Arr = [];

        bx3Index = _.sample([0, 1, 2]);
        bx3 = _.sample(numArr, 2);

        for (var i = 0; i < 3; i++) {

          if (i === bx3Index) {

            bx3Arr.push([bx3[0]]);

          } else {

            bx3Arr.push([bx3[1]]);

          }

        };

        result = bx3Arr;

        return result;
      }

      if (_this.nav.small === 'dx') {

        result[0] = [_.sample(dxArr)];

      }

      if (_this.nav.small === 'qo') {

        result[0] = [_.sample(dxArr)];

      }

      if (_this.nav.small === 'hs') {

        for (var i = 0; i < 28; i++) {
          hsArr.push(i);
        }

        result[0] = [_.sample(hsArr)];

      }

      return result;
    };

    /**
     * 生成直选常规投注号码
     * @param  {[type]} betNum 获取N注随机选号数组
     * @return {[type]}
     */
    pl3.prototype.produceZhixuanNormalCode = function(betNum) {

      var _this = this;
      var produceCodes = [];


      for (var i = betNum - 1; i >= 0; i--) {

        produceCodes[i] = [];



        if (_.indexOf(['d1', 'd2', 'qo', 'hs', 'tlj', 'st', 'dx'], this.nav.big) >= 0) {

          // 新玩法机选
          produceCodes[i] = _this.produceNewCodes();


        } else if (_this.nav.small == 'bx3') {

          produceCodes[i] = _this.produceNewCodes();

        } else {

          //默认玩法机选
          for (var j = _this.ZhiXuanNormal.oneBetCodeDigitalNum - 1; j >= 0; j--) {

            produceCodes[i][j] = [];
            produceCodes[i][j].push(Math.getRandomInt(_this.ZhiXuanNormal.minCode, _this.ZhiXuanNormal.maxCode));

          }

        }

      };

      return produceCodes;
    };

    // 获取投注列表左侧标题
    pl3.prototype.getBuyZhuListTitle = function() {

      var title = '';

      var b = {
        zx: '直选',
        zx3: '组选三',
        zx6: '组选六',
        d1: {
          d1: '1D',
          cd1: '猜1D'
        },
        d2: {
          d2: '2D',
          cd2: '猜2D'
        },
        bx: {
          bx3: '包选三',
          bx6: '包选六'
        },
        qo: {
          qo: '奇偶'
        },
        hs: {
          hs: '和数'
        },
        tlj: {
          tlj: '拖拉机'
        },
        st: {
          st: '三同'
        },
        dx: {
          dx: '大小'
        },
        tx: {
          tx: '通选'
        },
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


      if (_.indexOf(['d1', 'd2', 'bx', 'qo', 'hs', 'tlj', 'st', 'dx', 'tx'], this.nav.big) >= 0) {

        title = t[this.nav.small];
      }

      return title;
    };

    pl3.prototype.getCombined = function(code, index) {

      var _this = this;
      var result = [];
      var arr = [];
      var firstVal = null;
      var secondVal = null;
      var thirdVal = null;

      if (!code[index]) {
        return;
      }

      for (var j = 0; j < code[index].length; j++) {

        for (var i = 0; i < 3; i++) {

          if (i !== index) {

            if (code[i]) {

              for (var m = 0; m < code[i].length; m++) {

                arr = [];

                for (var g = 0; g < 3; g++) {

                  if (g == i) {

                    arr.push(code[i][m]);

                  } else if (g === index) {

                    arr.push(code[index][j]);

                  } else {

                    arr.push('_');

                  }

                };

                result.push(arr.join('-'));

              };
            }

          }

        };

      };

      return result;
    };

    pl3.prototype.getCd2Combined = function(code) {

      var _this = this;
      var index = 0;
      var result = [];
      var arr = [];
      var a = '';
      var b = '';
      var c = '';
      var codes = code[index];

      for (var j = 0; j < codes.length; j++) {

        for (var i = 0; i < codes.length; i++) {

          a = codes[j] + '-' + codes[i];
          b = codes[i] + '-' + codes[j];

          if (_.indexOf(arr, a) < 0 && _.indexOf(arr, b) < 0) {

            arr.push(codes[j] + '-' + codes[i]);

          }

        };

      };

      for (var i = 0; i < arr.length; i++) {

        c = arr[i].split('-');

        result.push([
          [c[0]],
          [c[1]]
        ]);


      };

      return result;
    };

    pl3.prototype.getComAllbined = function(code) {

      var codeA = code[0][0];
      var codeB = code[0][1];
      var codeC = code[0][2];
      var result = [];
      var firstVal = null;
      var secondVal = null;
      var thirdVal = null;

      for (var i = 0; i < codeA.length; i++) {

        firstVal = codeA[i];

        for (var j = 0; j < codeB.length; j++) {

          secondVal = codeB[j];

          for (var k = 0; k < codeC.length; k++) {
            thirdVal = codeC[k];
            result.push([
              [firstVal],
              [secondVal],
              [thirdVal]
            ]);
          };

        };

      };

      return result;
    };


    // 分割新玩法，1d,2d
    pl3.prototype.splitCodes = function(newCodes) {

      var _this = this;
      var result = [];
      var item = null;
      var arr = [];
      var d2Result = [];

      if (!newCodes) {
        newCodes[0] = ['_'];
      };

      for (var i = 0; i < newCodes.length; i++) {

        for (var j = 0; j < newCodes[i].length; j++) {

          item = newCodes[i][j];

          if (_this.nav.small === 'd2') {

            arr = [];
            arr = arr.concat(_this.getCombined(newCodes[i], j));
            result = result.concat(arr);

          }

          if (_this.nav.small === 'cd2') {

            result = _this.getCd2Combined(newCodes[i]);

          }

          if (_this.nav.small === 'd1' || _this.nav.small === 'cd1') {

            if (item) {


              for (var m = 0; m < item.length; m++) {

                arr = [];

                if (_this.nav.small === 'd1') {

                  for (var f = 0; f < 3; f++) {

                    if (f === j) {

                      arr.push([item[m]]);

                    } else {

                      arr.push(['_']);

                    }

                  };

                  result.push(arr);

                }

                if (_this.nav.small === 'cd1') {

                  for (var f = 0; f < 3; f++) {

                    if (f === j) {

                      arr.push([item[m]]);

                    }

                  };

                  result.push(arr);

                }

              };
            }
          }
        };

      };

      if (_this.nav.small === 'd2') {

        result = _.remove(_.uniq(result), function(n) {
          return n;
        });

        for (var i = 0; i < result.length; i++) {


          d2Result = result[i].split('-');

          result[i] = [];

          for (var k = 0; k < d2Result.length; k++) {

            result[i].push([d2Result[k]]);

          };


        };
      }

      if (_this.nav.small === 'bx6') {

        result = _this.getComAllbined(newCodes);

      }

      if (_this.nav.small === 'bx3') {

        var bx3A = newCodes[0][0];
        var bx3B = newCodes[0][1];
        var bx3C = newCodes[0][2];
        var bx3Arr = [];

        if (bx3A && bx3B && bx3C) {

          for (var i = 0; i < bx3A.length; i++) {

            if (_.indexOf(bx3B, bx3A[i]) >= 0) {

              for (var j = 0; j < bx3C.length; j++) {
                bx3Arr.push([
                  [bx3A[i]],
                  [bx3A[i]],
                  [bx3C[j]]
                ]);
              };


            }

            if (_.indexOf(bx3C, bx3A[i]) >= 0) {

              for (var g = 0; g < bx3B.length; g++) {
                bx3Arr.push([
                  [bx3A[i]],
                  [bx3B[g]],
                  [bx3A[i]]
                ]);
              };

            }

          };

          for (var i = 0; i < bx3B.length; i++) {

            if (_.indexOf(bx3C, bx3B[i]) >= 0) {

              for (var g = 0; g < bx3A.length; g++) {
                bx3Arr.push([
                  [bx3A[g]],
                  [bx3B[i]],
                  [bx3B[i]]
                ]);
              };

            }

          };


        }

        result = bx3Arr;

      }

      return result;
    };

    // 通过选中的号码 形成下面的投注列表HTML
    pl3.prototype.makeChooseCodeHtml = function(codes, addToList) {

      var newCodes = codes;
      var html = '';
      var _this = this;
      var money = 0;
      var mdfBtn = '';
      var title = _this.getBuyZhuListTitle();
      var isHz = _this.nav.small === 'hz' ? ' ' : '';

      // 新玩法组成变量
      var playTitle = [];
      var playArr = [];

      money = _this.addMoney;

      // 1d,2d 号码分割
      if (addToList) {

        if (_.indexOf(['d1', 'cd1', 'd2', 'cd2', 'bx3', 'bx6'], _this.nav.small) >= 0) {

          money = 2;
          newCodes = _this.splitCodes(newCodes);

        }

        if (_this.nav.small == 'dx' || _this.nav.small == 'qo') {

          money = 2;

          if (newCodes[0][0].length === 2) {

            newCodes = [
              [
                [newCodes[0][0][0]]
              ],
              [
                [newCodes[0][0][1]]
              ]
            ];

          }

        }

      }


      for (var i = 0; i < newCodes.length; i++) {

        _this.G_BUY.rowIndex++;

        html += '<div class="br-zhu-item clearfix" dataBit=' + _this.G_BUY.rowIndex + '><b>[' + title + ']</b><div class="list">';

        if (_.indexOf(['dx', 'qo', 'hs', 'st', 'tlj'], _this.nav.small) >= 0) {
          // 福彩3d新玩法

          playArr = newCodes[i][0];

          if (_this.nav.small === 'hs') {

            for (var l = 0; l < playArr.length; l++) {

              html += '<span>' + playArr[l] + '</span>';

            };

          }

          if (_this.nav.small === 'dx') {

            playTitle = ['', '小', '', '大'];

            for (var l = 0; l < playArr.length; l++) {

              html += '<span>' + playTitle[playArr[l]] + '</span>';

            };

          }

          if (_this.nav.small === 'qo') {

            playTitle = ['', '奇', '', '偶'];

            for (var l = 0; l < playArr.length; l++) {

              html += '<span>' + playTitle[playArr[l]] + '</span>';

            };

          }

          if (_this.nav.small === 'st') {
            html += '<span>三同号</span>';
          }

          if (_this.nav.small === 'tlj') {
            html += '<span>拖拉机</span>';
          }


        } else {

          // 遍历选中号码
          for (var m = 0; m < newCodes[i].length; m++) {

            if (m === 0 && _this.nav.small === 'dt') {

              html += '<span>(';

            } else {

              html += '<span>';

            }

            if (newCodes[i][m]) {

              html += newCodes[i][m].sort(function(a, b) {
                return a - b;
              }).join(isHz);

            }

            if (m === 0 && _this.nav.small === 'dt') {

              html += ')</span>';

            } else {

              html += '</span>';

            }

          };
        }

        if (_.indexOf(['up', 'st', 'tlj'], _this.nav.small) < 0) {
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