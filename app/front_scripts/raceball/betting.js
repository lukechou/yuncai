define(['jquery', 'app'], function($, APP) {
  'use strict';

  var bet = (function() {

    function bet(args) {
      // enforces new
      if (!(this instanceof bet)) {
        return new bet(args);
      }
      // constructor body
    }

    /**
     * Bet
     * beishu  倍数
     * zhushu  注数
     * isAgreen  是否同意协议
     * match  对阵信息
     * bunch  几串几集合
     * maxBunch  最多几串几
     * maxBonus  最大预计奖金
     *
     * @type {Object}
     */
    bet.prototype = {
      beishu: 1,
      zhushu: null,
      isAgreen: true,
      match: [],
      bunch: [],
      collect: [],
      maxBunch: {
        'spf': 8,
        'rqspf': 8,
        'bf': 4,
        'zjq': 6,
        'bqc': 4,
        'hhtz': 8,
        'sxds': 6
      },
      dd: null,
      maxBonus: null,
      bjdcPassWay: true,
      box: $('#bettingBox'),
      tab: 'spf',
      zjqSpValueArr: ['0', '1', '2', '3', '4', '5', '6', '7+'],
      bqcSpValueArr: ['胜胜', '胜平', '胜负', '平胜', '平平', '平负', '负胜', '负平', '负负'],
      rqspfSpValueArr: ['让球胜', '让球平', '让球负'],
      spfSpValueArr: ['胜', '平', '负'],
      sxdsSpValueArr: ['上单', '上双', '下单', '下双'],
      hhtzIconHtml: '<i class="arrow-up"></i><i class="arrow-down"></i><i class="arrow-down2"></i>'
    };

    bet.prototype.init = function() {

      this.beishu = $('#j-qiucksub-bei').val();
      this.zhushu = null;
      this.isAgreen = true;
      this.match = [];
      this.bunch = [];
      this.dd = null;
      this.maxBonus = null;
      this.tab = 'spf';
      this.bindMain();
      this.bindRight();

    };

    bet.prototype.updateCount = function(m, c) {
      var v = parseInt(m.val(), 10);
      if (c == 1) {
        v++;
      } else {
        v--;
      }
      v = (v >= 1) ? v : 1;
      v = v > 99999 ? 99999 : v;
      this.beishu = v;
      m.val(v);
    };

    bet.prototype.getOtherEm = function(el, i) {
      if (el.parents().hasClass('bidCounts')) {
        return this.box.find('.even em[index="' + i + '"]');
      } else {
        return this.box.find('.even em[index="' + i + '"]');
      }
    };

    bet.prototype.toggleBunch = function(isActive, method) {

      var _this = this;

      if (isActive) {
        _this.bunch.push(method);
        _this.bunch = _.uniq(_this.bunch).sort(function(a, b) {
          return a.slice(0, 1) - b.slice(0, 1);
        });
      } else {
        _.remove(_this.bunch, function(b) {
          return b == method;
        });
      }

    };

    /**
     * Add One Item to rightBox NumberDetails
     * @param {String} i     index
     * @param {Dom} dd    dd Dom
     * @param {String} sp    sp value
     * @param {String} title title
     */
    bet.prototype.addOneItem = function(i, dd, sp, title, dzTab) {

      var _this = this;
      var code = dd.attr('matchcode');

      if (_.find(_this.match, function(chr) {
          return (chr.index == i && chr.matchcode == code);
        })) {
        return;
      }

      var compiled = _.template('<tr matchcode="<%= matchcode%>" class="gameTitle"><th class="t1"><a class="icoDel j-del-all" href="javascript:;">&times;</a><%= matchnumcn%></th><th class="t2"><%= hostname%> <%= guestname%></th></tr><tr class="gameOption" matchcode="<%= matchcode%>"><td colspan="5" class="betList"><a index="<%= i%>" gametype="<%= gametype%>" matchcode="<%= matchcode%>" href="javascript:;" class="<%= color%>"><%= text%></a></td></tr>');
      var oneMatchHTML = '';
      var color = 'block block' + i;

      if (_this.tab === 'bf' || _this.tab === 'zjq' || _this.tab === 'bqc') {
        color = 'block';
      }

      var fill = {
        i: i,
        color: color,
        gametype: dzTab,
        text: title,
        matchcode: code,
        matchnumcn: dd.attr('matchnumcn'),
        hostname: dd.attr('hostname'),
        guestname: dd.attr('guestname')
      };

      var linkHTML = '';
      var linkHTML1 = '';
      var linkHTML2 = '';
      var linkHTML3 = '';

      var hasMatch = _.find(_this.match, {
        'matchcode': code
      });

      _this.match.push({
        index: i,
        type: dzTab,
        matchcode: code,
        sp: sp,
        title: title,
      });

      var selectMatch = _.uniq(_this.match, function(n) {
        return n.matchcode;
      });

      _this.match = _this.match.sort(function(a, b) {
        return Number(a.index) - Number(b.index);
      });

      selectMatch = _this.match.concat().sort(function(a, b) {
        return Number(a.matchcode) - Number(b.matchcode);
      });
      if (hasMatch) {

        _.each(_this.match, function(matchs) {

          if (matchs.matchcode == code) {

            if (_this.tab === 'bf' || _this.tab === 'zjq' || _this.tab === 'bqc') {
              color = 'block';
            } else {
              color = 'block block' + matchs.index;
            }

            if (matchs.index >= 0 && matchs.index <= 12) {
              linkHTML1 += '<a index="' + matchs.index + '" gametype="' + matchs.type + '" matchcode="' + matchs.matchcode + '" href="javascript:;" class="' + color + '">' + matchs.title + '</a>';
            } else if (matchs.index >= 13 && matchs.index <= 17) {
              linkHTML2 += '<a index="' + matchs.index + '" gametype="' + matchs.type + '" matchcode="' + matchs.matchcode + '" href="javascript:;" class="' + color + '">' + matchs.title + '</a>';
            } else if (matchs.index >= 18 && matchs.index <= 30) {
              linkHTML3 += '<a index="' + matchs.index + '" gametype="' + matchs.type + '" matchcode="' + matchs.matchcode + '" href="javascript:;" class="' + color + '">' + matchs.title + '</a>';
            }
          }
        });
        if(!!linkHTML1){
          linkHTML1 = '<p class="clearfix">' + linkHTML1 + '</p>';
        }
        if(!!linkHTML2){
          linkHTML2 = '<p class="clearfix">' + linkHTML2 + '</p>';
        }
        if(!!linkHTML3){
          linkHTML3 = '<p class="clearfix">' + linkHTML3 + '</p>';
        }
        linkHTML = linkHTML1 + linkHTML2 + linkHTML3;

        $('#selectGamePool .gameOption[matchcode=' + code + '] .betList').html(linkHTML);

      } else {

        oneMatchHTML = compiled(fill);
        if (selectMatch.length > 1) {
          var selectMatchcodeArr = [];
          for (var i = 0; i < selectMatch.length; i++) {
            selectMatchcodeArr.push(selectMatch[i].matchcode);
          };
          var nextIndex = _.indexOf(selectMatchcodeArr, code) + 1;

          if (nextIndex < selectMatchcodeArr.length) {
            $('#selectGamePool tbody tr.gameTitle[matchcode=' + selectMatchcodeArr[nextIndex] + ']').before(oneMatchHTML);
          } else {
            $('#selectGamePool tbody').append(oneMatchHTML);
          }
        } else {
          $('#selectGamePool tbody').append(oneMatchHTML);
        }

      }

      $('#poolStep1 .scrollMoni').show();
      $('#poolStep1 .unSeleTips').hide();

      _this.setSecondBox();
      _this.setAllTotal();

    };

    /**
     * Remove one Active Items
     * @param  {string} i  index
     * @param  {element} dd 选中的行
     * @return {null}
     */
    bet.prototype.removeOneItem = function(i, dd) {

      var _this = this;
      var code = dd.attr('matchcode');
      var hasMatch = null;
      var matchTotal = 0;

      _.remove(_this.match, function(o) {
        return (o.index == i && o.matchcode == code);
      });

      hasMatch = _.find(_this.match, {
        'matchcode': code
      });

      // First Right Box
      if (hasMatch) {
        $('#selectGamePool a[matchcode=' + code + '][index=' + i + ']').remove();
      } else {
        $('#selectGamePool tr[matchcode=' + code + ']').remove();
        if (_this.match.length == 0) $('#poolStep1 .unSeleTips').show();
      }
      _this.setSecondBox();
      _this.setAllTotal();
    };

    /**
     *  Update Pass Way
     */
    bet.prototype.getBjdcZhggBunchHtml = function(len, maxLen) {

      var _this = this;
      var bunchHtml = '';
      var isActiveBunch = '';
      var isDg = '';
      var cStr = '';
      var obj = '';
      var html = '';
      var bunchMap = {
        bunch2: [3],
        bunch3: [4, 7],
        bunch4: [5, 11, 15],
        bunch5: [6, 16, 26, 31],
        bunch6: [7, 22, 42, 57, 63]
      };
      var item = null;
      var bunchCount = len;

      if (bunchCount > maxLen) {
        bunchCount = maxLen;
      }

      if (bunchCount > 6) {
        bunchCount = 6;
      }

      for (var i = 2; i <= maxLen; i++) {
        isActiveBunch = _.find(_this.bunch, function(bunch) {
          return Number(bunch.slice(0, 1)) === i;
        });

        if (i > len && isActiveBunch) {
          _.remove(_this.bunch, function(chr) {
            return Number(chr.slice(0, 1)) === i;
          });
        }

      };

      for (var i = 2; i <= bunchCount; i++) {

        item = bunchMap['bunch' + i];

        for (var j = 0; j < item.length; j++) {

          cStr = i + '_' + item[j];
          isDg = i + '串' + item[j];

          isActiveBunch = _.find(_this.bunch, function(bunch) {
            return bunch === cStr;
          });

          if (isActiveBunch) {

            obj = {
              method: cStr,
              isCheck: true,
              active: 'active',
              bunch: isDg
            };

          } else {

            obj = {
              method: cStr,
              isCheck: false,
              active: '',
              bunch: isDg
            };

          }

          html = _.template('<li class="jtip <%= active%>" data-method="<%= method%>" data-check="<%= isCheck%>"><%= bunch%></li>');
          bunchHtml += html(obj);

        };

      };

      return bunchHtml;
    };

    bet.prototype.getBjdcZyggBunchHtml = function(len, maxLen) {

      var _this = this;
      var bunchHtml = '';
      var isActiveBunch = '';
      var isDg = '';
      var obj = '';
      var html = '';

      for (var i = 2; i <= maxLen; i++) {
        isActiveBunch = _.find(_this.bunch, function(bunch) {
          return Number(bunch.slice(0, 1)) === i;
        });

        if (i > len && isActiveBunch) {
          _.remove(_this.bunch, function(chr) {
            return Number(chr.slice(0, 1)) === i;
          });
        }

      };

      for (var i = 1; i <= len; i++) {

        isActiveBunch = _.find(_this.bunch, function(bunch) {
          return Number(bunch.slice(0, 1)) === i;
        });

        if (i === 1) {
          isDg = '单关';
        } else {
          isDg = i + '串1';
        }

        if (isActiveBunch) {

          obj = {
            len: i,
            isCheck: true,
            active: 'active',
            bunch: isDg
          };

        } else {

          obj = {
            len: i,
            isCheck: false,
            active: '',
            bunch: isDg
          };

        }

        if (i <= maxLen) {
          html = _.template('<li class="jtip <%= active%>" id="j-me-<%= len%>" data-method="<%= len%>_1" data-check="<%= isCheck%>"><%= bunch%></li>');
          bunchHtml += html(obj);
        } else {
          i = len + 1;
        }

      };

      return bunchHtml;

    };

    /**
     * 北京单场-组合过关
     * len  对阵场数
     * tip  对阵选择提示
     * list 几串几dom
     * bunchHtml  几串几html
     * obj  生成html对象
     * html  html生成
     * bunchMap  组合过关映射数组
     */
    bet.prototype.setBjdcBox = function() {

      var _this = this;
      var len = _.uniq(_this.match, 'matchcode').length;
      var tips = $('#poolErrorTips');
      var list = $('#j-method-ls');
      var bunchHtml = '';
      var obj = null;
      var html = '';
      var maxLen = _this.maxBunch[_this.tab];

      switch (_this.tab) {
        case 'bqc':
          maxLen = 6;
          break;
        case 'bf':
          maxLen = 3;
          break;
        case 'spf':
          maxLen = 15;
          break;
        default:
          break;
      }

      if (len < 2) {

        _this.bunch = [];
        list.hide().html('');
        tips.show();
        return;

      } else {
        bunchHtml = _this.getBjdcZhggBunchHtml(len, maxLen);
        tips.hide();
        list.html(bunchHtml).show();
        return;

      }

    };

    bet.prototype.setSecondBox = function() {

      var _this = this;
      var len = _.uniq(_this.match, 'matchcode').length;
      var obj = null;
      var tips = $('#poolErrorTips');
      var list = $('#j-method-ls');
      var html = '';
      var jtip = list.find('.jtip');
      var jtipLen = jtip.length;
      var hasHhtzBf = null;
      var hasHhtzBqc = null;
      var hasHhtzZjq = null;
      var maxLen = _this.maxBunch[_this.tab];
      var moreBunchIndex = 0;
      var startIndex = 2;
      var bunchHtml = '';
      var isActiveBunch = '';

      // 几串几北京单场
      if (Config.lotyName === 'bjdc') {

        if (!_this.bjdcPassWay) {
          _this.setBjdcBox();
          return;
        }

        switch (_this.tab) {
          case 'bqc':
            maxLen = 6;
            break;
          case 'bf':
            maxLen = 3;
            break;
          case 'spf':
            maxLen = 15;
            break;
          default:
            break;
        }

        if (len < 1) {

          _this.bunch = [];
          list.hide().html('');
          tips.show();
          return;

        } else {

          var isDg = '';

          // create html
          bunchHtml = _this.getBjdcZyggBunchHtml(len, maxLen);
          tips.hide();
          list.html(bunchHtml).show();
          return;

        }

      }

      if (len < 2) {

        _this.bunch = [];
        list.hide().html('');
        tips.show();
        return;

      }

      if (_this.tab === 'hhtz') {

        hasHhtzBf = _.find(_this.match, function(chr) {
          return chr.type === 'bf';
        });

        hasHhtzBqc = _.find(_this.match, function(chr) {
          return chr.type === 'bqc';
        });

        hasHhtzZjq = _.find(_this.match, function(chr) {
          return chr.type === 'zjq';
        });

        if (hasHhtzZjq) {

          maxLen = 6;
          $('#j-me-7,#j-me-8').remove();
          _this.toggleBunch(false, '7_1');
          _this.toggleBunch(false, '8_1');

        }

        if (hasHhtzBf || hasHhtzBqc) {

          maxLen = 4;
          $('#j-me-5,#j-me-6,#j-me-7,#j-me-8').remove();
          _this.toggleBunch(false, '5_1');
          _this.toggleBunch(false, '6_1');
          _this.toggleBunch(false, '7_1');
          _this.toggleBunch(false, '8_1');

        }

      }

      if (len >= startIndex) {

        if ($('#j-me-' + len)[0]) {

          if ((jtipLen + 1) > len) {

            _.remove(_this.bunch, function(b) {
              return b.slice(0, 1) == (jtipLen + 1);
            });

            jtip.eq(jtipLen - 1).remove();

          }

        } else {

          if (len == startIndex) {
            _this.toggleBunch(true, '2_1');
          }

          if (len == startIndex + 1) {
            _this.toggleBunch(false, '2_1');
          }

          if (len >= startIndex) {

            for (var i = 2; i <= len; i++) {

              isActiveBunch = _.find(_this.bunch, function(bunch) {
                return Number(bunch.slice(0, 1)) === i;
              });

              if (isActiveBunch) {

                obj = {
                  len: i,
                  isCheck: true,
                  active: 'active'
                };

              } else {

                obj = {
                  len: i,
                  isCheck: false,
                  active: ''
                };

              }

              if (i <= maxLen) {
                html = _.template('<li class="jtip <%= active%>" id="j-me-<%= len%>" data-method="<%= len%>_1" data-check="<%= isCheck%>"><%= len%>串1</li>');
                bunchHtml += html(obj);
              } else {
                i = len + 1;
              }

            };
          }

          tips.hide();
          list.html(bunchHtml).show();

        }

      }

    };

    /**
     *  获取组合数组
     * @param  {Array}   numArr    选中的数组
     * @param  {Number}   choose    几串几
     * @param  {Function} callback 回调函数
     * @return {null}
     */
    bet.prototype.combinations = function(numArr, choose, callback) {
      var n = numArr.length;
      var c = [];
      var inner = function(start, choose_) {
        if (choose_ == 0) {
          callback(c);
        } else {
          for (var i = start; i <= n - choose_; ++i) {
            c.push(numArr[i]);
            inner(i + 1, choose_ - 1);
            c.pop();
          }
        }
      };
      inner(0, choose);
    };

    /**
     *  获取投注总注数和最高奖金
     * @return {null}
     */
    bet.prototype.getTotalZhus = function() {

      var _this = this;
      var matchkeys = [];
      var acTotalNum = 1;
      var method = null;
      var group = _.groupBy(_this.match, function(match) {
        return match.matchcode;
      });
      var ms = _.uniq(_this.match, 'matchcode');
      var matchTotal = ms.length;
      var chuanArr = _this.bunch;
      var maxList = [];
      var mb = 0;
      var result = {
        zhus: 0,
        maxBonus: 0,
      };

      var mapBjdcChuanguanDetail = {
        '1_1': ['1_1'],
        '2_1': ['2_1'],
        '2_3': ['1_1', '2_1'],
        '3_1': ['3_1'],
        '3_4': ['2_1', '3_1'],
        '3_7': ['1_1', '2_1', '3_1'],
        '4_1': ['4_1'],
        '4_5': ['3_1', '4_1'],
        '4_11': ['2_1', '3_1', '4_1'],
        '4_15': ['1_1', '2_1', '3_1', '4_1'],
        '5_1': ['5_1'],
        '5_6': ['4_1', '5_1'],
        '5_16': ['3_1', '4_1', '5_1'],
        '5_26': ['2_1', '3_1', '4_1', '5_1'],
        '5_31': ['1_1', '2_1', '3_1', '4_1', '5_1'],
        '6_1': ['6_1'],
        '6_7': ['5_1', '6_1'],
        '6_22': ['4_1', '5_1', '6_1'],
        '6_42': ['3_1', '4_1', '5_1', '6_1'],
        '6_57': ['2_1', '3_1', '4_1', '5_1', '6_1'],
        '6_63': ['1_1', '2_1', '3_1', '4_1', '5_1', '6_1'],
        '7_1': ['7_1'],
        '8_1': ['8_1'],
        '9_1': ['9_1'],
        '10_1': ['10_1'],
        '11_1': ['11_1'],
        '12_1': ['12_1'],
        '13_1': ['13_1'],
        '14_1': ['14_1'],
        '15_1': ['15_1'],
      }
      var matchkeySp = {};
      var matchkeySpArr = [];

      for (var prop in group) {
        if (group.hasOwnProperty(prop)) {
          maxList.push(_.max(group[prop], 'sp'));
        }
      }

      if (chuanArr.length != 0) {

        for (var i = 0; i < ms.length; i++) {

          matchkeySpArr = [];
          matchkeys.push(ms[i].matchcode);

          var tem = group[ms[i].matchcode];

          for (var k = tem.length - 1; k >= 0; k--) {
            matchkeySpArr.push(tem[k].sp);
          };

          matchkeySp[ms[i].matchcode] = matchkeySpArr;

        };

        for (var i = 0; i < chuanArr.length; i++) {

          for (var k = 0; k < mapBjdcChuanguanDetail[chuanArr[i]].length; k++) {
            var bunchIndex = Number(mapBjdcChuanguanDetail[chuanArr[i]][k].split('_')[0]);
            var combinedData = YC.Unit.explodeCombined(matchkeys, bunchIndex);

            for (var m = combinedData.length - 1; m >= 0; m--) {

              var _tmpZhushu = 1;
              var _tmpMaxBonus = 1;

              for (var j = combinedData[m].length - 1; j >= 0; j--) {

                _tmpZhushu *= matchkeySp[combinedData[m][j]].length;
                _tmpMaxBonus *= _.max(matchkeySp[combinedData[m][j]], function(chr) {
                  return parseInt(chr);
                });

              };

              result.zhus += _tmpZhushu;
              result.maxBonus += _tmpMaxBonus;

            };

          }

        }
      }

      result.maxBonus *= _this.beishu * 2;
      result.maxBonus = result.maxBonus.toFixed(2);

      return result;

    };

    /**
     *  Clear Betting Object Data
     * @return {null}
     */
    bet.prototype.clearBetData = function() {
      var _this = this;
      $('#selectGamePool tbody').html('');
      $('#poolStep1 .scrollMoni').hide();
      $('#poolStep1 .unSeleTips').fadeIn();
      _this.box.find('.j-sp-btn,.j-bf-all').removeClass('active hover');
      _this.box.find('.j-show-bf').removeClass('has');
      _this.match = [];
      _this.dd = null;
      _this.beishu = $('#j-qiucksub-bei').val();
      _this.zhushu = null;
      _this.maxBonus = null;
      _this.bunch = [];
      _this.setSecondBox();
      _this.setAllTotal();
    };

    /**
     *  设置右侧第三个Box
     */
    bet.prototype.setAllTotal = function() {

      var _this = this;
      var ms = _.uniq(_this.match, 'matchcode').length;
      var s = _this.getTotalZhus();
      var zhus = s.zhus || 0;
      var totalMoney = zhus * 2 * _this.beishu;
      var maxBonus = s.maxBonus;
      maxBonus = (maxBonus == 0) ? '0.00' : maxBonus;
      _this.maxBonus = maxBonus;

      _this.zhushu = zhus;
      $('#j-no-method').hide();
      $('#gameNumber').html(ms);
      $('#gameZhu').html(zhus);
      $('#totalMoney').html(totalMoney);
      $('#maxbonus').html(maxBonus);
    };

    bet.prototype.getSubContent = function(matchs) {

      var _this = this;
      var c = [];
      var f = [];
      var allHhtzPlay = null;
      var content = [];
      var result = null;
      var params = {
        spf: [3, 1, 0],
        rqspf: [3, 1, 0],
        zjq: [0, 1, 2, 3, 4, 5, 6, 7],
        sxds: ['00', '01', '10', '11'],
        bqc: ['33', '31', '30', '13', '11', '10', '03', '01', '00'],
        bf: ['10', '20', '21', '30', '31', '32', '40', '41', '42', '50', '51', '52', '90', '00', '11', '22', '33', '99', '01', '02', '12', '03', '13', '23', '04', '14', '24', '05', '15', '25', '09'],
      };

      if (Config.lotyName === 'bjdc') {

        params.bf = ['10', '20', '21', '30', '31', '32', '40', '41', '42', '90', '00', '11', '22', '33', '99', '01', '02', '12', '03', '13', '23', '04', '14', '24', '09'];

      }

      params.hhtz = params.spf.concat(params.rqspf, params.bqc, params.bf, params.zjq);

      var item = null;

      for (var i = 0; i < matchs.length; i++) {

        c = [];

        f = _.where(this.match, {
          'matchcode': matchs[i]
        });

        if (_this.tab == 'hhtz') {

          allHhtzPlay = {
            spf: [],
            rqspf: [],
            bqc: [],
            bf: [],
            zjq: [],
          };

          for (var k = 0; k < f.length; k++) {

            item = f[k];
            allHhtzPlay[item.type].push(params.hhtz[item.index]);

          };

          for (var prop in allHhtzPlay) {
            if (allHhtzPlay.hasOwnProperty(prop)) {
              c.push(allHhtzPlay[prop].join(','));
            }
          }

          content.push(c.join('$'));

          result = content.join('|');

        } else {
          for (var k = 0; k < f.length; k++) {
            item = f[k];
            c.push(params[item.type][item.index]);
          };
          content.push(c.join(','));
          result = content.join('|');
        }

      };

      return result;
    }

    /**
     *  提交表单,获取要提交的参数
     * @return {object}
     */
    bet.prototype.getSubmitParams = function() {

      var _this = this;
      var obj = null;
      var matchs = [];
      var content = null;
      var uniqMatch = null;

      // get Params
      uniqMatch = _.uniq(_this.match, 'matchcode').sort(function(a, b) {
        return a.matchcode - b.matchcode;
      });

      for (var i = 0; i < uniqMatch.length; i++) {
        matchs.push(uniqMatch[i].matchcode);
      };

      content = _this.getSubContent(matchs);

      obj = {
        zhushu: _this.zhushu,
        beishu: _this.beishu,
        matchKeys: matchs.join(','),
        bunch: _this.bunch.join(','),
        content: content,
      };

      return obj;

    };

    /*
      获取一注比分的HTML
     */
    bet.prototype.getOneBfHtml = function(matchcode) {

      var data = '';
      var html = '';
      var spArr = '';
      var sArr = ['1:0', '2:0', '2:1', '3:0', '3:1', '3:2', '4:0', '4:1', '4:2', '5:0', '5:1', '5:2', '胜其他'];
      var pArr = ['0:0', '1:1', '2:2', '3:3', '平其他'];
      var fArr = ['0:1', '0:2', '1:2', '0:3', '1:3', '2:3', '0:4', '1:4', '2:4', '0:5', '1:5', '2:5', '负其他'];
      var common = '';
      var hArr = null;
      var shtml = [];
      var phtml = [];
      var fhtml = [];
      var noSp = '';
      var indexArr = [12, 17, 30];
      var tableCol = 8;

      // 北京单场
      if (Config.lotyName === 'bjdc') {

        sArr.splice(9, 3);
        fArr.splice(9, 3);
        indexArr = [9, 14, 24];
        tableCol = 5;

      }

      hArr = sArr.concat(pArr, fArr);

      for (var key in jczqData) {
        if (jczqData.hasOwnProperty(key)) {
          for (var i = jczqData[key].length - 1; i >= 0; i--) {
            if (String(jczqData[key][i].match_key) === String(matchcode)) {
              data = jczqData[key][i];
            }
          };
        }
      }

      spArr = data.bf_gg_sp.split('|');

      for (var i = 0, len = sArr.length + pArr.length + fArr.length; i < len; i++) {

        if (spArr[i]) {
          noSp = 'j-sp-btn';
        } else {
          spArr[i] = '--';
          noSp = '';
        }
        common = 'class="sp-btn ' + noSp + '" gametype="bf"';

        if (0 <= i && i <= indexArr[0]) {
          shtml.push('<td data-item="' + hArr[i] + '" sp="' + spArr[i] + '" index="' + i + '"' + common + '>' + hArr[i] + '<div>' + spArr[i] + '</div></td>');
        }

        if (indexArr[0] + 1 <= i && i <= indexArr[1]) {
          phtml.push('<td data-item="' + hArr[i] + '" sp="' + spArr[i] + '" index="' + i + '"' + common + '>' + hArr[i] + '<div>' + spArr[i] + '</div></td>');
        }

        if (indexArr[1] + 1 <= i && i <= indexArr[2]) {
          fhtml.push('<td data-item="' + hArr[i] + '" sp="' + spArr[i] + '" index="' + i + '"' + common + '>' + hArr[i] + '<div>' + spArr[i] + '</div></td>');
        }

      };

      html += '<div class="bf-nobor"></div><table class="analyMoreTable"><tbody>';

      html += '<tr><th>主胜</th>' + shtml.join('') + '<td class="j-bf-all sp-btn">全包</td></tr>';
      html += '<tr><th>平</th>' + phtml.join('') + '<td colspan="' + tableCol + '" class="noBg"></td><td class="j-bf-all sp-btn">全包</td></tr>';
      html += '<tr><th>主负</th>' + fhtml.join('') + '<td class="j-bf-all sp-btn">全包</td></tr>';

      html += '</tbody></table>';

      if (data.bf != 1) {
        html = '<div class="bf-nobor"></div><div class="bf-nosupport">本场对阵不支持该玩法</div>'
      }

      return html;
    };

    /**
     * 创建按钮组
     * @param  {Boolean} isSupport 是否支持该玩法
     * @param  {Object}  item      Data
     * @param  {Array}  spArr     SP数组
     * @param  {String}  tab        玩法类型
     * @param  {Number}  moreIndex        add index
     */
    bet.prototype.getSpBtn = function(isSupport, item, spArr, tab, moreIndex) {

      var hasSp = '';
      var l = '';
      var h = '';

      if (!moreIndex) {
        moreIndex = 0;
      }

      if (isSupport == 1) {

        for (var i = 0, len = item.length; i < len; i++) {

          if (spArr[i]) {

            hasSp = 'j-sp-btn';

          } else {

            spArr[i] = '--';
            hasSp = '';

          }

          if (i === (len - 1)) l = 'lastOne';

          h += '<em index="' + (i + moreIndex) + '" data-item="' + item[i] + '" gametype="' + tab + '" sp="' + spArr[i] + '" class="' + l + ' ' + hasSp + ' sp-btn">' + spArr[i] + '</em>';

        };

      } else {

        h = '<b class="no-support">本场对阵不支持该玩法</b>';

      }

      return h;

    };

    bet.prototype.craeteDateBtn = function(type, sp) {

      var _this = this;
      var h = '';
      var spArr = sp.split('|');
      var item = [];

      item = _this[_this.tab + 'SpValueArr'];

      h = _this.getSpBtn(type, item, spArr, _this.tab) || '';

      return h;

    };

    bet.prototype.getOneHhtzHtml = function(matchcode) {

      var _this = this;
      var data = '';
      var html = '';
      var spArr = '';
      var sArr = ['1:0', '2:0', '2:1', '3:0', '3:1', '3:2', '4:0', '4:1', '4:2', '5:0', '5:1', '5:2', '胜其他'];
      var pArr = ['0:0', '1:1', '2:2', '3:3', '平其他'];
      var fArr = ['0:1', '0:2', '1:2', '0:3', '1:3', '2:3', '0:4', '1:4', '2:4', '0:5', '1:5', '2:5', '负其他'];
      var common = '';
      var hArr = sArr.concat(pArr, fArr);
      var shtml = [];
      var phtml = [];
      var fhtml = [];
      var bfHtml = [];
      var noSp = '';

      for (var key in jczqData) {
        if (jczqData.hasOwnProperty(key)) {
          for (var i = jczqData[key].length - 1; i >= 0; i--) {
            if (String(jczqData[key][i].match_key) === String(matchcode)) {
              data = jczqData[key][i];
            }
          };
        }
      }

      spArr = data.bf_gg_sp.split('|');

      for (var i = 0, len = sArr.length + pArr.length + fArr.length; i < len; i++) {

        if (spArr[i]) {

          noSp = 'j-sp-btn';

        } else {

          spArr[i] = '--';
          noSp = '';

        }

        common = 'class="sp-btn ' + noSp + '" gametype="bf"';

        if (0 <= i && i <= 12) {
          shtml.push('<td data-item="' + hArr[i] + '" sp="' + spArr[i] + '" index="' + (i + 15) + '"' + common + '>' + hArr[i] + '<div>' + spArr[i] + '</div></td>');
        }

        if (13 <= i && i <= 17) {
          phtml.push('<td data-item="' + hArr[i] + '" sp="' + spArr[i] + '" index="' + (i + 15) + '"' + common + '>' + hArr[i] + '<div>' + spArr[i] + '</div></td>');
        }

        if (18 <= i && i <= 30) {
          fhtml.push('<td data-item="' + hArr[i] + '" sp="' + spArr[i] + '" index="' + (i + 15) + '"' + common + '>' + hArr[i] + '<div>' + spArr[i] + '</div></td>');
        }

      };

      var bqcHtml = '';
      var zjqHtml = '';
      var bqcSpArr = data.bqc_gg_sp.split('|') || [];
      var zjqSpArr = data.zjq_gg_sp.split('|') || [];

      for (var i = 0, len = _this.bqcSpValueArr.length; i < len; i++) {

        if (bqcSpArr[i]) {

          noSp = 'j-sp-btn';

        } else {

          bqcSpArr[i] = '--';
          noSp = '';

        }

        common = 'class="sp-btn ' + noSp + '" gametype="bqc"';

        bqcHtml += '<td data-item="' + _this.bqcSpValueArr[i] + '" sp="' + bqcSpArr[i] + '" index="' + (i + 6) + '"' + common + '>' + _this.bqcSpValueArr[i] + '<div>' + bqcSpArr[i] + '</div></td>';

      };

      for (var i = 0, len = _this.zjqSpValueArr.length; i < len; i++) {

        if (zjqSpArr[i]) {

          noSp = 'j-sp-btn';

        } else {

          zjqSpArr[i] = '--';
          noSp = '';

        }

        common = 'class="sp-btn ' + noSp + '" gametype="zjq"';

        zjqHtml += '<td data-item="' + _this.zjqSpValueArr[i] + '" sp="' + zjqSpArr[i] + '" index="' + (i + 46) + '"' + common + '>' + _this.zjqSpValueArr[i] + '<div>' + zjqSpArr[i] + '</div></td>';

      };

      bfHtml = '<tr><th rowspan="3">比分</th>' + shtml.join('') + '</tr><tr>' + phtml.join('') + '<td colspan="8" class="noBg"></td></tr><tr>' + fhtml.join('') + '</tr>';

      // 是否支持玩法
      if (data.bqc != 1) {
        bqcHtml = '<td colspan="13" class="no-all">本场对阵不支持该玩法</td>';
      }

      if (data.bf != 1) {
        bfHtml = '<tr><th>比分</th><td colspan="13" class="no-all">本场对阵不支持该玩法</td></tr>'
      }

      if (data.zjq != 1) {
        zjqHtml = '<td colspan="13" class="no-all">本场对阵不支持该玩法</td>';
      }

      html += '<div class="hhtz-nobor"></div><table class="analyMoreTable analyMoreTable2 j-analymore-table"><tbody>';

      html += '<tr><th>半全场</th>' + bqcHtml + '</tr>';

      html += bfHtml;

      html += '<tr><th>总进球</th>' + zjqHtml + '</tr>';

      html += '</tbody></table>';

      return html;
    };

    /**
     *  购票主体事件绑定
     * @return {null}
     */
    bet.prototype.bindMain = function() {

      var _this = this;
      var a = 'active';
      var h = 'hover';

      _this.box.on('mousemove', 'dd', function(event) {
        $(this).addClass('even');
      });

      _this.box.on('mouseout', 'dd', function(event) {
        $(this).removeClass('even');
      });

      //混合投注
      _this.box.on('click', '.j-show-hhtz', function(event) {

        var t = $(this);
        var matchcode = t.parents('dd').attr('matchcode');
        var dd = t.parents('dd');
        var newDd = null;
        var html = _this.getOneHhtzHtml(matchcode);

        var hasNewDd = _this.box.find('[data-newdd=' + matchcode + ']').length;
        var minHieght = null;

        if (!t.hasClass('active')) {
          t.html('隐藏' + _this.hhtzIconHtml);
          if (hasNewDd) {
            _this.box.find('[data-newdd=' + matchcode + ']').show();
          } else {
            newDd = dd.clone().removeClass().addClass('bf-box hhtz-box j-bf-box').attr('data-newdd', matchcode).html(html);
            dd.after(newDd);
            minHieght = _this.box.find('[data-newdd=' + matchcode + '] .j-analymore-table')[0].offsetHeight + 30;
            _this.box.find('[data-newdd=' + matchcode + ']').height(minHieght);

          }

          t.removeClass('has').addClass('active');

        } else {

          if (hasNewDd) {
            _this.box.find('[data-newdd=' + matchcode + ']').hide();
          }

          if (_.find(_this.match, function(chr) {
              return chr.matchcode === matchcode && chr.type !== 'spf' && chr.type !== 'rqspf';
            })) {
            t.html('展开' + _this.hhtzIconHtml);
            t.addClass('has').removeClass('active');
          } else {
            t.html('展开' + _this.hhtzIconHtml);
            t.removeClass('active has');
          }

        }

      });

      // 比分展开
      _this.box.on('click', '.j-show-bf', function(event) {

        var t = $(this);
        var row = t.parents('.row1-1');
        var dd = t.parents('dd');
        var matchcode = dd.attr('matchcode');
        var newDd = null;
        var html = _this.getOneBfHtml(matchcode);
        var dl = dd.parents('dl');
        var hasNewDd = dl.find('[data-newdd=' + matchcode + ']').length;

        row.toggleClass('on');

        if (row.hasClass('on')) {

          if (hasNewDd) {
            dl.find('[data-newdd=' + matchcode + ']').show();
          } else {
            newDd = dd.clone().removeClass().addClass('bf-box j-bf-box').attr('data-newdd', matchcode).html(html);
            dd.after(newDd);
          }

          t.removeClass('has').addClass('active');

        } else {

          if (hasNewDd) {
            dl.find('[data-newdd=' + matchcode + ']').hide();
          }

          if (_.find(_this.match, function(chr) {
              return chr.matchcode === matchcode;
            })) {
            t.addClass('has').removeClass('active');
          } else {
            t.removeClass('active has');
          }

        }

      });

      //全包
      _this.box.on('click', '.j-bf-all', function(event) {

        var t = $(this);
        var dd = t.parents('dd');
        var i = null;
        var sp = null;
        var title = null;

        t.toggleClass(a);

        t.siblings('.j-sp-btn').each(function(index, el) {

          i = $(this).attr('index');
          sp = $(this).attr('sp');
          title = $(this).attr('data-item');

          if (t.hasClass(a)) {
            $(this).addClass(a);
            _this.addOneItem(i, dd, sp, title, 'bf');
          } else {
            $(this).removeClass(a);
            _this.removeOneItem(i, dd);
          }

        });

      });

      _this.box.on('mousemove', '.j-sp-btn,.j-bf-all', function(event) {

        var t = $(this);
        var i = t.attr('index');

        if (!t.hasClass(a) && !t.hasClass('rq')) {
          t.addClass(h);
        };

      });

      _this.box.on('mouseout', '.j-sp-btn,.j-bf-all', function(event) {

        var t = $(this);
        var i = t.attr('index');

        if (!t.hasClass(a) && !t.hasClass('rq')) {
          t.removeClass(h);
        };

      });

      /*
       * 投注区 sp按钮点击事件
       * Number  index  sp值索引
       * String  sp  sp值
       * String  sp  sp对应title
       * Dom  dd  事件触发父dd
       */
      _this.box.on('click', '.j-sp-btn', function(event) {

        var t = $(this);
        var index = t.attr('index');
        var sp = t.attr('sp');
        var title = t.attr('data-item');
        var dd = t.parents('dd');
        var matchcode = dd.attr('matchcode');
        var allSp = true;
        var lock = true;
        var matchLen = _.uniq(_this.match, 'matchcode').length;
        var hasMatch = _.find(_this.match, function(chr) {
          return chr.matchcode === matchcode;
        });
        var dzTab = t.attr('gametype');

        if (t.hasClass('rq')) {
          return;
        }

        if (matchLen >= 15 && !hasMatch) {
          APP.showTips('您好，投注场次不得超过15场哦');
          return false;
        }

        if (t.hasClass(a)) {

          t.siblings('.j-bf-all').removeClass(a + ' ' + h);
          t.removeClass(a);
          _this.removeOneItem(index, dd);

        } else {

          t.removeClass(h).addClass(a);
          _this.addOneItem(index, dd, sp, title, dzTab);

          t.siblings('.j-sp-btn').each(function(index, el) {
            if (!$(this).hasClass(a) && lock) {
              allSp = false;
              lock = false;
            }
          });

          if (allSp) {
            t.siblings('.j-bf-all').addClass(a);
          }

        }

      });

      //  Buy Main Toggle
      _this.box.on('click', '.j-dataBody-toggle', function(event) {

        var t = $(this);
        var s = Number(t.attr('data-show'));
        var dl = t.parents('dl');
        var allDd = dl.find('dd');
        var listDd = dl.find('.j-data-dd');
        var bfDd = dl.find('.j-bf-box');
        var title = ['隐藏', '展开'];
        var unS = (s === 1) ? 0 : 1;

        if (s === 1) {

          allDd.hide();

          if (_this.tab === 'hhtz') {

            bfDd.each(function(index, el) {

              if ($(this).find('.j-sp-btn.active').length > 0) {
                var matchcode = $(this).attr('matchcode');
                var bfNearBox = dl.find('.j-data-dd[matchcode=' + matchcode + ']');
                bfNearBox.find('.j-show-hhtz').addClass('has');
              }

            });

          }

          if (_this.tab === 'bf') {

            bfDd.each(function(index, el) {

              if ($(this).find('.j-sp-btn.active').length > 0) {
                var matchcode = $(this).attr('matchcode');
                var bfNearBox = dl.find('.j-data-dd[matchcode=' + matchcode + ']');
                bfNearBox.find('.j-show-bf').addClass('has');
              }

            });

          }

          t.attr('data-show', unS);

        } else {

          if ($(this).parents('#j-collect-body').length) {
            listDd.show();
          } else {
            listDd.each(function(index, el) {
              var m = $(this).attr('matchcode');
              if ($('#j-collect-body .j-data-dd[matchcode=' + m + ']').length == 0) {
                $(this).show();
              }
            });
          }

          if (_this.tab === 'hhtz') {
            listDd.find('.j-show-hhtz').removeClass('active').html(
              '展开' + _this.hhtzIconHtml);
          }

          if (_this.tab === 'bf') {
            listDd.find('.j-show-bf,.j-show-hhtz').removeClass('active');
            listDd.find('.row1-1').removeClass('on');
          }

          t.attr('data-show', unS);

        }

        t.find('.icon').toggleClass('show-icon').toggleClass('hide-icon');
        t.find('.j-nav-text').html(title[s]);

      });

    };

    bet.prototype.filterNum = function(v) {

      if (v === '') {
        return v;
      }

      var n = parseInt(v, 10);

      if (isNaN(n)) {
        n = 1;
      } else {
        n = (n >= 1) ? n : 1;
        n = n;
      }
      n = n > 99999 ? 99999 : n;
      return n;
    };

    /**
     * 购票右侧时间绑定
     * @return {null}
     */
    bet.prototype.bindRight = function() {

      var _this = this;

      $('.j-coutn-total').on('click', '.j-count', function(event) {

        var m = $(this).siblings('.btn-results'),
          c = $(this).attr('data-c'),
          r = m.attr('data-r');

        _this.updateCount(m, c);
        _this.setAllTotal();

      });

      $('#j-qiucksub-bei').on('keyup', function(event) {

        var t = $(this);
        var r = t.attr('data-r');
        var v = _this.filterNum(t.val());

        t.val(v);
        _this.beishu = v;
        _this.setAllTotal();

      });

      $('#j-qiucksub-bei').on('change', function(event) {

        var t = $(this);
        var r = t.attr('data-r');
        var v = _this.filterNum(t.val());
        v = v || 1;

        t.val(v);
        _this.beishu = v;
        _this.setAllTotal();

      });

      $('#j-method-ls').on('click', '.jtip', function(event) {

        var t = $(this);
        var a = 'active';
        var h = null;
        var method = t.attr('data-method') || null;

        if (Config.lotyName === 'bjdc' && !_this.bjdcPassWay) {
          _this.bunch = [];
          $('#j-method-ls .jtip').removeClass(a);
        }

        t.toggleClass(a);
        h = t.hasClass(a);
        t.attr('data-check', h);

        _this.toggleBunch(h, method);
        _this.setAllTotal();

      });

      $('#orderRule').on('click', '.icon', function(event) {
        var t = $(this);
        t.toggleClass('icon-cbox').toggleClass('icon-cgou');
        _this.isAgreen = t.hasClass('icon-cgou');
      });

      $('#j-touzhu-tips').on('click', function(event) {

        $('#j-touzhu-tipstext').toggle();
        $(this).find('.icon').toggleClass('icon-bup').toggleClass('icon-bdown');

        if ($(this).find('.icon').hasClass('icon-bdown')) {

          var asideBox = $('.j-navbar-wrapper').eq(1);
          var asideBoxHeight = asideBox.height();
          var bodyHeight = $('body').height();
          var windowHeight = $(window).height();
          var footerHeight = $('.ft').height();

          asideBox.css({
            'top': '-200'
          });

        }

      });

      $('#j-btn-clear').on('click', function(event) {
        _this.box.find('.j-show-hhtz').removeClass('has');
        _this.clearBetData();
      });

      // BetList Button remvoe match
      $('#selectGamePool').on('click', '.betList a', function(event) {

        var code = $(this).attr('matchcode');
        var i = $(this).attr('index');
        var type = $(this).attr('gametype');
        var actItem = $('#bettingBox dd[matchcode=' + code + ']').find('[gametype=' + type + '][index=' + i + ']');
        var totalLinks = $(this).siblings('a');
        var removeItem = '';

        if (totalLinks.length == 0) {
          removeItem = $('#selectGamePool tr[matchcode=' + code + ']');
        } else {
          removeItem = $(this);
        }

        removeItem.remove();
        actItem.removeClass('active');

        _.remove(_this.match, function(o) {
          return (o.index == i && o.matchcode == code);
        });

        if (_this.match == 0) {
          $('#poolStep1 .unSeleTips').show();
        }

        _this.setSecondBox();
        _this.setAllTotal();

        if (_this.tab === 'bf') {
          actItem.siblings('.j-bf-all').removeClass('active hover');
          if (_.filter(_this.match, function(chr) {
              return chr.matchcode === code;
            }).length === 0) {
            $('#bettingBox dd[matchcode=' + code + '] .j-show-bf').removeClass('has');
          }
        }

        if (_this.tab === 'hhtz') {
          if (_.filter(_this.match, function(chr) {
              return chr.matchcode === code;
            }).length === 0) {
            $('#bettingBox dd[matchcode=' + code + '] .j-show-hhtz').removeClass('has');
          }
        }

      });

      $('#selectGamePool').on('click', '.j-del-all', function(event) {

        var code = $(this).parents('tr').attr('matchcode');
        var removeItem = $('#selectGamePool tr[matchcode=' + code + ']');
        var actItem = $('#bettingBox dd[matchcode=' + code + ']').find('.j-sp-btn.active,.j-bf-all');

        removeItem.remove();
        actItem.removeClass('active hover');

        if (_this.tab === 'hhtz') {
          $('#bettingBox dd[matchcode=' + code + '] .j-show-hhtz').removeClass('has');
        }

        if (_this.tab === 'bf') {
          $('#bettingBox dd[matchcode=' + code + ']').find('.j-show-bf').removeClass('has');
        }
        _.remove(_this.match, function(o) {
          return o.matchcode == code;
        });

        if (_this.match == 0) $('#poolStep1 .unSeleTips').show();

        _this.setSecondBox();
        _this.setAllTotal();

      });

    };

    return bet;

  }());

  var b = new bet();
  b.init();
  return b;
});