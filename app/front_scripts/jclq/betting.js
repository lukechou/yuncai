define(['jquery', 'app'], function($, APP) {
  'use strict';

  var bet = (function() {

    function bet(args) {
      // enforces new
      if (!(this instanceof bet)) {
        return new bet(args);
      }
      // constructor body
      this.init();

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
        'sf': 8,
        'rfsf': 8,
        'dxf': 8,
        'sfc': 4,
        'hhtz': 8,
      },
      dd: null,
      maxBonus: null,
      bjdcPassWay: true,
      box: $('#bettingBox'),
      navBox: $('#j-hd-nav'),
      navType: 'ggtz',
      tab: 'hhtz',
      sfcSpValueArr: ['1-5', '6-10', '11-15', '16-20', '21-25', '26+'],
      rfsfSpValueArr: ['让分主胜', '让分客胜'],
      sfSpValueArr: ['主胜', '客胜'],
      dxfSpValueArr: ['小分', '大分'],
      hhtzIconHtml: '<i class="arrow-up"></i><i class="arrow-down"></i><i class="arrow-down2"></i><div class="sfc-lbor"></div>'
    };

    bet.prototype.init = function() {

      this.beishu = $('#j-qiucksub-bei').val();
      this.zhushu = null;
      this.isAgreen = true;
      this.match = [];
      this.bunch = [];
      this.dd = null;
      this.maxBonus = null;
      this.tab = 'hhtz';
      this.bindMain();
      this.bindRight();

    };

    bet.prototype.toggleNav = function(t, c) {

      var _this = this;

      _this.tab = t;
      _this.box.removeClass().addClass(c);
      _this.clearBetData();

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
     * @param {String} i     赛事索引
     * @param {Dom} dd    dd dom
     * @param {String} sp    sp值
     * @param {String} title  选中赛事选项标题
     */
    bet.prototype.addOneItem = function(i, dd, sp, title, dzTab, dgSale, ggSale) {

      var _this = this;
      var code = dd.attr('matchcode');

      if (_.find(_this.match, function(chr) {
          return (chr.index == i && chr.matchcode == code);
        })) {
        return;
      }

      i = Number(i);

      if (i < 0) {
        return;
      }

      _this.match.push({
        index: i,
        type: dzTab,
        matchcode: code,
        sp: sp,
        title: title,
        dgSale: dgSale,
        ggSale: ggSale
      });

      _this.createRightFirstBox();

      // 显示对阵信息,隐藏无对阵提示
      $('#poolStep1 .scrollMoni').show();
      $('#poolStep1 .unSeleTips').hide();

      // 设置右侧第二,三个选项卡
      _this.setSecondBox();
      _this.setAllTotal();

    };

    // 创建右侧第一个box
    bet.prototype.createRightFirstBox = function() {

      var _this = this;

      var html = '';
      var oneMatchLink = '';
      var matchcode = '';
      var matchnumcn = '';
      var hostname = '';
      var guestname = '';
      var item = '';
      var dd = '';
      var oneMatch = '';
      var bfLinkObj = {};

      // 对阵分组
      var matchs = _.groupBy(_this.match, 'matchcode');

      for (var key in matchs) {
        if (matchs.hasOwnProperty(key)) {

          oneMatchLink = '';
          bfLinkObj = {
            s: [],
            p: [],
            f: []
          };

          dd = $('.j-data-dd[matchcode=' + key + ']');

          matchcode = key;
          matchnumcn = dd.attr('matchnumcn');
          hostname = dd.attr('hostname');
          guestname = dd.attr('guestname');

          html += '<tr matchcode="' + matchcode + '" class="gameTitle">';

          html += '<th class="t1"><a class="icoDel j-del-all" href="javascript:;">&times;</a>' + matchnumcn + '</th>';

          html += '<th class="t2"><span class="t2-left">' + guestname + '</span><span class="t2-right">' + hostname + '</span></th></tr>';

          // 选项排序
          oneMatch = matchs[key].sort(function(a, b) {
            return a.index - b.index;
          });

          for (var j = 0, jLen = oneMatch.length; j < jLen; j++) {

            item = oneMatch[j];

            oneMatchLink += _this.createLinkHtml(item, matchcode);

          };

          html += '<tr class="gameOption" matchcode="' + matchcode + '"><td colspan="5" class="betList">' + oneMatchLink + '</td></tr>';

        }
      }

      // 更新选中对阵信息
      $('#selectGamePool tbody').html(html);

    };

    bet.prototype.createLinkHtml = function(item, matchcode) {

      var _this = this;
      var html = '';
      var color = '';

      color = 'block block' + item.index;

      if (item.type === 'sfc') {

        if (item.index >= 6) {
          color = 'block block1';
        } else {
          color = 'block block0';
        }

      }

      html = '<a index="' + item.index + '" gametype="' + item.type + '" matchcode="' + matchcode + '" href="javascript:;" class="' + color + '">' + item.title + '</a>';

      return html;
    }

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
        bunch2: [],
        bunch3: [3, 4],
        bunch4: [4, 5, 6, 11],
        bunch5: [5, 6, 10, 16, 20, 26],
        bunch6: [6, 7, 15, 20, 22, 35, 42, 50, 57],
        bunch7: [7, 8, 21, 35, 120],
        bunch8: [8, 9, 28, 56, 70, 247]
      };

      var item = null;
      var bunchCount = len;

      // 限制最大几串几
      if (bunchCount > maxLen) {
        bunchCount = maxLen;
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
      var dgFlag = true;
      var playTab = $('#j-vote-nav li.active a').attr('data-type');

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

      for (var i = 0; i < _this.match.length; i++) {
        if (_this.match[i]['dgSale'] == '0') {
          dgFlag = false;
        }
      };
      switch (playTab) {
        case 'onlyHhtz':
          if (len == 1) {
            bunchHtml = '<div class="unAddSeleTips">请在左侧列表至少选择2场比赛</div>';
          } else {
            bunchHtml = bunchHtml.slice(74);
          }
          break;

        default:
          if (!dgFlag && len == 1) {
            bunchHtml = '<div class="unAddSeleTips">请在左侧列表至少选择2场比赛</div>';
          } else if (!dgFlag) {
            bunchHtml = bunchHtml.slice(74);
          } else {
            bunchHtml = bunchHtml;
          }
          break;
      }


      return bunchHtml;

    };

    /**
     * 组合过关
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

      if (_this.tab === 'hhtz') {

        if (_.find(_this.match, function(r) {
            return r.type === 'sfc';
          })) {
          maxLen = _this.maxBunch['sfc'];
        } else {
          maxLen = 8;
        }

      } else {

        maxLen = _this.maxBunch[_this.tab];

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

    // 设置右侧第二个选项卡
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
      var dgFlag = true;
      var ggFlag = true;

      //单关 过关方式只有单关
      if(_this.navType == 'dg'){
        _this.dgNav(len, list, tips, dgFlag, ggFlag, bunchHtml, _this);
        return;
      }

      // 几串几
      if (!_this.bjdcPassWay) {
        _this.setBjdcBox();
        return;
      }

      if (_this.tab === 'hhtz') {

        if (_.find(_this.match, function(r) {
            return r.type === 'sfc';
          })) {
          maxLen = _this.maxBunch['sfc'];
        } else {
          maxLen = 8;
        }

      } else {

        maxLen = _this.maxBunch[_this.tab];

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
     * 处理单关
     * @param  {[type]} len       match长度
     * @param  {[type]} list      过关方式
     * @param  {[type]} tips      没有选择过关方式时的tips
     * @param  {[type]} dgFlag    单关标志
     * @param  {[type]} ggFlag    过关标志
     * @param  {[type]} bunchHtml 过关方式组合html
     * @param  {[type]} _this     bet对象
     * @return {[type]}           [description]
     */
    bet.prototype.dgNav = function(len, list, tips, dgFlag, ggFlag, bunchHtml, _this) {
      if (len < 1) {

        _this.bunch = [];
        list.hide().html('');
        tips.show();
        return;

      } else {

        for (var j = 0; j < len; j++) {
          if (_this.match[j]['dgSale'] == '0') {
            dgFlag = false;
          }
          if (_this.match[j]['ggSale'] == '0') {
            ggFlag = false;
          }
        }
        if (dgFlag) {
          _this.toggleBunch(true, '1_1');
          bunchHtml = '<li class="jtip active j-me-1" data-method="1_1" data-check="true">单关</li>';
          tips.hide();
          list.html(bunchHtml).show();
        } else {
          _this.bunch = [];
          list.hide().html('');
          tips.show();
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
        '1_1': [1],
        '2_1': [2],
        '2_3': [1, 2],
        '3_1': [3],
        '3_3': [2],
        '3_4': [2, 3],
        '3_6': [1, 2],
        '3_7': [1, 2, 3],
        '4_1': [4],
        '4_4': [3],
        '4_5': [3, 4],
        '4_6': [2],
        '4_10': [1, 2],
        '4_11': [2, 3, 4],
        '4_14': [1, 2, 3],
        '4_15': [1, 2, 3, 4],
        '5_1': [5],
        '5_5': [4],
        '5_6': [4, 5],
        '5_10': [2],
        '5_15': [1, 2],
        '5_16': [3, 4, 5],
        '5_20': [2, 3],
        '5_25': [1, 2, 3],
        '5_26': [2, 3, 4, 5],
        '5_30': [1, 2, 3, 4],
        '5_31': [1, 2, 3, 4, 5],
        '6_1': [6],
        '6_6': [5],
        '6_7': [5, 6],
        '6_15': [2],
        '6_20': [3],
        '6_21': [1, 2],
        '6_22': [4, 5, 6],
        '6_35': [2, 3],
        '6_41': [1, 2, 3],
        '6_42': [3, 4, 5, 6],
        '6_50': [2, 3, 4],
        '6_56': [1, 2, 3, 4],
        '6_57': [2, 3, 4, 5, 6],
        '6_62': [1, 2, 3, 4, 5],
        '6_63': [1, 2, 3, 4, 5, 6],
        '7_1': [7],
        '7_7': [6],
        '7_8': [6, 7],
        '7_21': [5],
        '7_35': [4],
        '7_120': [2, 3, 4, 5, 6, 7],
        '7_127': [1, 2, 3, 4, 5, 6, 7],
        '8_1': [8],
        '8_8': [7],
        '8_9': [7, 8],
        '8_28': [6],
        '8_56': [5],
        '8_70': [4],
        '8_247': [2, 3, 4, 5, 6, 7, 8],
        '8_255': [1, 2, 3, 4, 5, 6, 7, 8],
      };
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
            var bunchIndex = mapBjdcChuanguanDetail[chuanArr[i]][k];
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

      _this.box.find('.j-sp-btn').removeClass('active hover');
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
        sf: [3, 0],
        rfsf: [3, 0],
        dxf: [0, 3],
        sfc: [11, 12, 13, 14, 15, 16, '01', '02', '03', '04', '05', '06'],
        hhtz: [3, 3, 3, 0, 0, 0, 11, 12, 13, 14, 15, 16, '01', '02', '03', '04', '05', '06']
      };

      var item = null;

      for (var i = 0; i < matchs.length; i++) {

        c = [];

        f = _.where(this.match, {
          'matchcode': matchs[i]
        });

        if (_this.tab == 'hhtz') {

          allHhtzPlay = {
            sf: [],
            rfsf: [],
            sfc: [],
            dxf: [],
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
      var common = '';
      var shtml = [];
      var phtml = [];
      var bfHtml = [];
      var noSp = '';
      var titleArr = ['客胜1-5', '客胜6-10', '客胜11-15', '客胜16-20', '客胜21-25', '客胜26+', '主胜1-5', '主胜6-10', '主胜11-15', '主胜16-20', '主胜21-25', '主胜26+'];
      var indexMap = [12, 13, 14, 15, 16, 17, 6, 7, 8, 9, 10, 11];
      var tdHtml = '';

      for (var key in jczqData) {
        if (jczqData.hasOwnProperty(key)) {
          for (var i = jczqData[key].length - 1; i >= 0; i--) {
            if (String(jczqData[key][i].match_key) === String(matchcode)) {
              data = jczqData[key][i];
            }
          };
        }
      }

      spArr = data.sfc_sp.split('|');
      spArr = spArr.slice(6).concat(spArr.slice(0, 6));

      for (var i = 0, len = spArr.length; i < len; i++) {

        if (spArr[i]) {

          noSp = 'j-sp-btn';

        } else {

          spArr[i] = '--';
          noSp = '';

        }

        common = 'class="sp-btn ' + noSp + ' sfc-box-btn" gametype="sfc"';

        tdHtml = '<td data-item="' + titleArr[i] + '" sp="' + spArr[i] + '" index="' + indexMap[i] + '"' + common + '>' + spArr[i] + '</td>';

        if (0 <= i && i < 6) {
          shtml.push(tdHtml);
        }

        if (i >= 6) {
          phtml.push(tdHtml);
        }

      };

      // 是否支持玩法
      if (data.sfc != 1) {
        html = '<td colspan="13" class="no-all">本场对阵不支持该玩法</td>';
      }

      html += '<div class="hhtz-nobor"></div><div class="hhtz-bbor"></div><div class="hhtz-rbor"></div>';
      html += '<table class="analyMoreTable analyMoreTable2 j-analymore-table">'

      html += '<thead><tr><th>胜分差</th><td>1-5</td><td>6-10</td><td>11-15</td><td>16-20</td><td>21-25</td><td>26+</td></tr></thead>';

      html += '<tbody>';

      html += '<tr><th>客场胜</th>' + shtml.join('') + '</tr>';
      html += '<tr><th>主场胜</th>' + phtml.join('') + '</tr>';

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
        var $analymoreTable = t.parents('.j-data-dd').next('.j-bf-box').find('.j-analymore-table');
        var tableBtnIsActive = false;
        tableBtnIsActive = $analymoreTable.find('.j-sp-btn').hasClass('active');

        if (!t.hasClass('active')) {

          t.html('隐藏' + _this.hhtzIconHtml);
          dd.addClass('hhtz-tg-active');

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
              return chr.matchcode === matchcode && chr.type === 'hhtz';
            })) {

            t.html('胜分差' + _this.hhtzIconHtml);
            t.addClass('has').removeClass('active');
            dd.removeClass('hhtz-tg-active');

          } else {

            t.html('胜分差' + _this.hhtzIconHtml);
            t.removeClass('active has');
            dd.removeClass('hhtz-tg-active');
            if (tableBtnIsActive) {
              t.addClass('has');
            }
          }

        }



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
        var lock = true;
        var matchLen = _.uniq(_this.match, 'matchcode').length;
        var hasMatch = _.find(_this.match, function(chr) {
          return chr.matchcode === matchcode;
        });
        var dzTab = t.attr('gametype');
        var dgSale = t.parents('.j-dg-sale').attr('dg-sale');
        var ggSale = t.parents('.j-dg-sale').attr('gg-sale');
        var playTab = $('#j-vote-nav li.active a').attr('data-type');

        if (t.hasClass('rq')) {
          return;
        }

        if (matchLen >= 15 && !hasMatch) {
          APP.showTips('您好，投注场次不得超过15场哦');
          return false;
        }

        if (t.hasClass(a)) {
          // 移除选中项
          t.siblings('.j-bf-all').removeClass(a + ' ' + h);
          t.removeClass(a);
          _this.removeOneItem(index, dd);

        } else {

          t.removeClass(h).addClass(a);
          _this.addOneItem(index, dd, sp, title, dzTab, dgSale, ggSale);

          t.siblings('.j-sp-btn').each(function(index, el) {
            if (!$(this).hasClass(a) && lock) {
              lock = false;
            }
          });

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

      _this.box.on('click', '.j-dg-tips', function(event) {
        var t = $(this);
        var isCheck = t.find('input[type="checkbox"]').prop('checked'); //原来是否有勾选上，false表示原来没有勾选，true表示原来有勾选
        var $dgItips = t.find('.j-dg-itips');
        var $gameSelect = t.parents('.dg-choose').siblings('#j-game-select');
        var $dgHintTop = $gameSelect.find('.j-dg-hint-top');
        var $dgHintBot = $gameSelect.find('.j-dg-hint-bot');
        var $dgHintNbot = $gameSelect.find('.j-dg-hint-nbot');


        var $dgHintNbotI = $dgHintTop.find('s');
        var $dgHintI = $dgHintTop.find('s');

        if (isCheck) {
          $dgItips.css({
            'display': 'inline-block'
          });
          $dgHintTop.addClass('row-dg-top');
          $dgHintBot.addClass('row-dg-bot');
          $dgHintNbot.addClass('row-dg-bot').addClass('row-dg-nbot');
          $dgHintNbotI.show();
          $dgHintI.show();

        } else {
          $dgItips.hide();
          $dgHintTop.removeClass('row-dg-top');
          $dgHintBot.removeClass('row-dg-bot');
          $dgHintNbot.removeClass('row-dg-bot').removeClass('row-dg-nbot');
          $dgHintNbotI.hide();
          $dgHintI.hide();

        }

      });

      _this.navBox.on('click', 'a' , function(event) {
        var t = $(this);
        var $hhtz = $('#j-vote-nav').find('a[data-type="onlyHhtz"]');
        var $sf = $('#j-vote-nav').find('a[data-type="onlySf"]');
        _this.navType = t.attr('nav-type');
        t.siblings('a').removeClass('active');
        t.addClass('active');

        switch(_this.navType){
          case 'dg':
            $hhtz.hide();
            $sf.trigger('click');
          break;
          case 'ggtz':
            $hhtz.show();
            $hhtz.trigger('click');
          break;
        }


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

        if (!_this.bjdcPassWay) {
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

  return b;

});