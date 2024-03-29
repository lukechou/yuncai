define(['jquery', 'app', 'store', 'hemai'], function($, APP, store, H) {
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
      danMatchCode: [],
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
      dsContent: [],
      box: $('#bettingBox'),
      dsscBox: $('#j-ddsc-box'),
      xzccRightBox: $('#j-xzcc-right-box'),
      navBox: $('#j-hd-nav'),
      navType: 'ggtz',
      tab: 'spf',
      zjqSpValueArr: ['0', '1', '2', '3', '4', '5', '6', '7+'],
      bqcSpValueArr: ['胜胜', '胜平', '胜负', '平胜', '平平', '平负', '负胜', '负平', '负负'],
      rqspfSpValueArr: ['让球胜', '让球平', '让球负'],
      spfSpValueArr: ['胜', '平', '负'],
      sxdsSpValueArr: ['上单', '上双', '下单', '下双'],
      hhtzIconHtml: '<i class="arrow-up"></i><i class="arrow-down"></i><i class="arrow-down2"></i>',
      upFileResData: null
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

    bet.prototype.dsAddOneItem = function(matchcode, matchnumcn, hostname, type) {
      var _this = this;
      _this.match.push({
        // sp: sp,
        matchcode: matchcode,
        matchnumcn: matchnumcn,
        hostname: hostname,
        type: type
      });

      $('.j-dsPoolStep1 .scrollMoni').show();
      $('.j-dsPoolStep1 .unSeleTips').hide();

    };

    bet.prototype.dsRemoveOneItem = function(code) {
      var _this = this;

      _.remove(this.match, function(o) {
        return o.matchcode == code;
      });
      if (_this.match.length == 0) {
        $('.j-dsPoolStep1 .j-unSeleTips').show();
      }

    };

    bet.prototype.initPoolStep1 = function() {
      var _this = this;
      var sortMatchs = [];
      var matchs = _.groupBy(_this.match, 'matchcode');
      var key = '';
      var matchcode = '';
      var matchnumcn = '';
      var hostname = '';
      var span = '';
      var html = '';
      $('.j-selectDsGamePool tbody').html(html);
      for (var prop in matchs) {
        if (matchs.hasOwnProperty(prop)) {
          sortMatchs.push(Number(prop));
        }
      }

      sortMatchs.sort(function(a, b) {
        return a - b;
      });

      for (var i = 0; i < sortMatchs.length; i++) {
        key = sortMatchs[i];
        matchcode = key;
        span = $('.j-game-span[matchcode=' + matchcode + ']')
        matchnumcn = span.attr('matchnumcn');

        hostname = span.attr('hostname');

        html += '<tr matchcode="' + matchcode + '"><td class="td1"><a class="icoDel j-del-one" href="javascript:;">×</a>';

        html += matchnumcn + '</td>';

        html += '<td class="td2">' + hostname + '</td></tr>';

      };

      $('.j-selectDsGamePool tbody').html(html);

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

      var sortMatchs = [];
      var key = '';

      for (var prop in matchs) {
        if (matchs.hasOwnProperty(prop)) {
          sortMatchs.push(Number(prop));
        }
      }

      sortMatchs.sort(function(a, b) {
        return a - b;
      });

      for (var i = 0; i < sortMatchs.length; i++) {

        key = sortMatchs[i];
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

        if ($('.j-gg-tab').find('li.active').attr('data-bunch') == '0') { //如果是自由过关方式
          html += '<th class="t2"><span class="t2-left">' + hostname + '</span><span class="t2-right">' + guestname + '</span><span class="t3-right j-dan">胆</span></th></tr>';
        } else {
          html += '<th class="t2"><span class="t2-left">' + hostname + '</span><span class="t2-right">' + guestname + '</span></th></tr>';
        }

        // 选项排序
        oneMatch = matchs[key].sort(function(a, b) {
          return a.index - b.index;
        });

        for (var j = 0, jLen = oneMatch.length; j < jLen; j++) {

          item = oneMatch[j];

          if (_this.tab === 'bf') {

            bfLinkObj[_this.getBfLinkGroupIndex(item.title)].push(_this.createLinkHtml(item, matchcode));

          } else {
            oneMatchLink += _this.createLinkHtml(item, matchcode);
          }

        };

        if (_this.tab === 'bf') {

          for (var prop in bfLinkObj) {
            if (bfLinkObj.hasOwnProperty(prop)) {

              if (bfLinkObj[prop].length) {
                oneMatchLink += '<div class="m-bf-group">';
                oneMatchLink += bfLinkObj[prop].join('');
                oneMatchLink += '</div>';
              }

            }
          }

        }

        html += '<tr class="gameOption" matchcode="' + matchcode + '"><td colspan="5" class="betList">' + oneMatchLink + '</td></tr>';
      };

      // 更新选中对阵信息
      $('#selectGamePool tbody').html(html);

    };

    bet.prototype.getBfLinkGroupIndex = function(t) {

      var i = ['1:0', '2:0', '2:1', '3:0', '3:1', '3:2', '4:0', '4:1', '4:2', '5:0', '5:1', '5:2', '胜其他'];
      var j = ['0:0', '1:1', '2:2', '3:3', '平其他'];
      var k = ['0:1', '0:2', '1:2', '0:3', '1:3', '2:3', '0:4', '1:4', '2:4', '0:5', '1:5', '2:5', '负其他'];

      if (_.indexOf(i, t) >= 0) {
        return 's';
      }

      if (_.indexOf(j, t) >= 0) {
        return 'p';
      }

      if (_.indexOf(k, t) >= 0) {
        return 'f';
      }

      return null;
    };

    bet.prototype.createLinkHtml = function(item, matchcode) {

      var _this = this;
      var html = '';
      var color = '';

      color = 'block block' + item.index;

      if (_this.tab === 'bf' || _this.tab === 'zjq' || _this.tab === 'bqc') {
        color = 'block';
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
      var bunchMap = {};
      if (Config.lotyName === 'bjdc') {
        bunchMap = {
          bunch2: [3],
          bunch3: [4, 7],
          bunch4: [5, 11, 15],
          bunch5: [6, 16, 26, 31],
          bunch6: [7, 22, 42, 57, 63]
        };
      } else if (Config.lotyName === 'jczq') {
        bunchMap = {
          bunch2: [],
          bunch3: [3, 4],
          bunch4: [4, 5, 6, 11],
          bunch5: [5, 6, 10, 16, 20, 26],
          bunch6: [6, 7, 15, 20, 22, 35, 42, 50, 57],
          bunch7: [7, 8, 21, 35, 120],
          bunch8: [8, 9, 28, 56, 70, 247]
        };
      }

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
          html = _.template('<li class="jtip <%= active%> j-me-<%= len%>" data-method="<%= len%>_1" data-check="<%= isCheck%>"><%= bunch%></li>');
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
      var tips = $('.j-poolErrorTips');
      var list = $('.j-method-ls');
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

    // 设置右侧第二个选项卡
    bet.prototype.setSecondBox = function() {

      var _this = this;
      var len = _.uniq(_this.match, 'matchcode').length;
      var obj = null;
      var tips = $('.j-poolErrorTips');
      var $rightBox;
      switch (_this.navType) {
        case 'dssc':
          $rightBox = $('#j-xzcc-right-box');
          break;
        default:
          $rightBox = $('#j-right-box');
          break;
      }
      var list = $rightBox.find('.j-method-ls');
      var html = '';
      var jtip = list.find('.jtip');
      var jtipLen = jtip.length;
      var hasHhtzBf = null;
      var hasHhtzBqc = null;
      var hasHhtzZjq = null;
      var maxLen = _this.maxBunch[_this.tab];
      var moreBunchIndex = 0;
      var startIndex = 1;
      var bunchHtml = '';
      var isActiveBunch = '';
      var navType = _this.navType;
      var dgFlag = true;
      var ggFlag = true;

      //组合过关（包括北京单场、竞彩足球）
      if (!_this.bjdcPassWay) {
        _this.setBjdcBox();
        return;
      }

      // 几串几北京单场
      if (Config.lotyName === 'bjdc') {

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


      // 竞彩足球 单关和混合投注处理

      if ('ggtz' == navType) {

        if (len < 1) {

          _this.bunch = [];
          list.hide().html('');
          tips.show();
          return;

        }

        //混合投注没有单关
        if (_this.tab === 'hhtz') {

          _this.hhtzTab(hasHhtzBf, hasHhtzBqc, hasHhtzZjq, maxLen, startIndex, len, list, tips, jtip, jtipLen, isActiveBunch, obj, html, bunchHtml, _this);

        } //end  if (_this.tab === 'hhtz')

        if (_this.tab !== 'hhtz' && len >= startIndex) {

          _this.nothhtzTab(dgFlag, ggFlag, len, startIndex, jtipLen, jtip, list, isActiveBunch, obj, maxLen, html, bunchHtml, tips, _this);


        } //end  if (_this.tab !== 'hhtz' && len >= startIndex)

      } else if ('dg' == navType) {

        _this.dgNav(len, list, tips, dgFlag, ggFlag, bunchHtml, _this);

      } else {
        startIndex = 2;
        _this.dsNav(len, startIndex, jtipLen, jtip, list, isActiveBunch, obj, maxLen, html, bunchHtml, tips, _this);
      }

    };

    /*
     *没有单关的情况
     */
    bet.prototype.dsNav = function(len, startIndex, jtipLen, jtip, list, isActiveBunch, obj, maxLen, html, bunchHtml, tips, _this) {
      if (len < 2) {

        _this.bunch = [];
        list.hide().html('');
        tips.show();
        return;

      }

      if (len >= startIndex) {

        if ($('.j-me-' + len)[0]) {

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
                html = _.template('<li class="jtip <%= active%> j-me-<%= len%>" data-method="<%= len%>_1" data-check="<%= isCheck%>"><%= len%>串1</li>');
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

    bet.prototype.nothhtzTab = function(dgFlag, ggFlag, len, startIndex, jtipLen, jtip, list, isActiveBunch, obj, maxLen, html, bunchHtml, tips, _this) {
      dgFlag = true;
      ggFlag = true;

      for (var j = 0; j < len; j++) {
        if (_this.match[j]['dgSale'] == '0') {
          dgFlag = false;
        }
        if (_this.match[j]['ggSale'] == '0') {
          ggFlag = false;
        }
      }

      if (!dgFlag) {
        _.remove(_this.bunch, function(b) {
          return b.slice(0, 1) == 1;
        });
      }

      //如果单关选项存在
      if ($('.j-me-' + len)[0]) {

        if ($('.j-me-' + 1)[0]) { //如果单关选项存在

          if (jtipLen > len) {

            _.remove(_this.bunch, function(b) {
              return b.slice(0, 1) == (jtipLen);
            });

            jtip.eq(jtipLen - 1).remove();

          }

        } else {

          if (jtipLen > (len - 1)) {

            _.remove(_this.bunch, function(b) {
              return b.slice(0, 1) == (jtipLen + 1);
            });

            jtip.eq(jtipLen - 1).remove();

          }

        }


        if (dgFlag && list.find('.j-me-1').length == 0) {
          _this.toggleBunch(false, '1_1');
          list.prepend('<li class="jtip j-me-1" data-method="1_1" data-check="false">单关</li>');
        }


      } else {

        if (len == startIndex) {
          if (_this.match[0]['dgSale'] == '0') {
            dgFlag = false;
            _this.toggleBunch(false, '1_1');
          } else {
            _this.toggleBunch(true, '1_1');
          }
        }

        if (len == startIndex + 1) {
          _this.toggleBunch(false, '1_1');
        }

        if (len >= startIndex) {

          for (var i = 1; i <= len; i++) {

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
              for (var j = 0; j < len; j++) {
                if (_this.match[j]['dgSale'] == '0') {
                  dgFlag = false;
                }
                if (_this.match[j]['ggSale'] == '0') {
                  ggFlag = false;
                }
              }

              if (dgFlag && i == 1) {
                html = _.template('<li class="jtip <%= active%> j-me-<%= len%>" data-method="<%= len%>_1" data-check="<%= isCheck%>">单关</li>');
                bunchHtml += html(obj);
              } else if (i > 1) {
                html = _.template('<li class="jtip <%= active%> j-me-<%= len%>" data-method="<%= len%>_1" data-check="<%= isCheck%>"><%= len%>串1</li>');
                bunchHtml += html(obj);
              }

            } else {
              i = len + 1;
            }

          };
        }

        tips.hide();
        list.html('');
        list.html(bunchHtml).show();
        if (!dgFlag && len == 1) {
          list.html('<div class="unSeleTips">请在左侧列表至少选择2场比赛</div>');
        }

      }
    };

    bet.prototype.hhtzTab = function(hasHhtzBf, hasHhtzBqc, hasHhtzZjq, maxLen, startIndex, len, list, tips, jtip, jtipLen, isActiveBunch, obj, html, bunchHtml, _this) {

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
        $('.j-me-7,.j-me-8').remove();
        _this.toggleBunch(false, '7_1');
        _this.toggleBunch(false, '8_1');

      }

      if (hasHhtzBf || hasHhtzBqc) {

        maxLen = 4;
        $('.j-me-5,.j-me-6,.j-me-7,.j-me-8').remove();
        _this.toggleBunch(false, '5_1');
        _this.toggleBunch(false, '6_1');
        _this.toggleBunch(false, '7_1');
        _this.toggleBunch(false, '8_1');

      }

      startIndex = 2;

      if (len < 2) {

        _this.bunch = [];
        list.hide().html('');
        tips.show();
        return;

      }
      if (len >= startIndex) {

        if ($('.j-me-' + len)[0]) {

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
                html = _.template('<li class="jtip <%= active%> j-me-<%= len%>" data-method="<%= len%>_1" data-check="<%= isCheck%>"><%= len%>串1</li>');
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

      var mapBjdcChuanguanDetail = {};

      if (Config.lotyName === 'bjdc') {

        mapBjdcChuanguanDetail = {
          '1_1': [1],
          '2_1': [2],
          '2_3': [1, 2],
          '3_1': [3],
          '3_4': [2, 3],
          '3_7': [1, 2, 3],
          '4_1': [4],
          '4_5': [3, 4],
          '4_11': [2, 3, 4],
          '4_15': [1, 2, 3, 4],
          '5_1': [5],
          '5_6': [4, 5],
          '5_16': [3, 4, 5],
          '5_26': [2, 3, 4, 5],
          '5_31': [1, 2, 3, 4, 5],
          '6_1': [6],
          '6_7': [5, 6],
          '6_22': [4, 5, 6],
          '6_42': [3, 4, 5, 6],
          '6_57': [2, 3, 4, 5, 6],
          '6_63': [1, 2, 3, 4, 5, 6],
          '7_1': [7],
          '8_1': [8],
          '9_1': [9],
          '10_1': [10],
          '11_1': [11],
          '12_1': [12],
          '13_1': [13],
          '14_1': [14],
          '15_1': [15],
        };

      } else if (Config.lotyName === 'jczq') {
        mapBjdcChuanguanDetail = {
          '1_1': [1],
          '2_1': [2],
          //'2_3': [1, 2],
          '2_3': [],
          '3_1': [3],
          '3_3': [2],
          '3_4': [2, 3],
          //'3_6': [1, 2],
          //'3_7': [1, 2, 3],
          '3_6': [],
          '3_7': [],
          '4_1': [4],
          '4_4': [3],
          '4_5': [3, 4],
          '4_6': [2],
          //'4_10': [1, 2],
          '4_10': [],
          '4_11': [2, 3, 4],
          //'4_14': [1, 2, 3],
          //'4_15': [1, 2, 3, 4],
          '4_14': [],
          '4_15': [],
          '5_1': [5],
          '5_5': [4],
          '5_6': [4, 5],
          '5_10': [2],
          //'5_15': [1, 2],
          '5_15': [],
          '5_16': [3, 4, 5],
          '5_20': [2, 3],
          //'5_25': [1, 2, 3],
          '5_25': [],
          '5_26': [2, 3, 4, 5],
          //'5_30': [1, 2, 3, 4],
          //'5_31': [1, 2, 3, 4, 5],
          '5_30': [],
          '5_31': [],
          '6_1': [6],
          '6_6': [5],
          '6_7': [5, 6],
          '6_15': [2],
          '6_20': [3],
          //'6_21': [1, 2],
          '6_21': [],
          '6_22': [4, 5, 6],
          '6_35': [2, 3],
          //'6_41': [1, 2, 3],
          '6_41': [],
          '6_42': [3, 4, 5, 6],
          '6_50': [2, 3, 4],
          //'6_56': [1, 2, 3, 4],
          '6_56': [],
          '6_57': [2, 3, 4, 5, 6],
          //'6_62': [1, 2, 3, 4, 5],
          //'6_63': [1, 2, 3, 4, 5, 6],
          '6_62': [],
          '6_63': [],
          '7_1': [7],
          '7_7': [6],
          '7_8': [6, 7],
          '7_21': [5],
          '7_35': [4],
          '7_120': [2, 3, 4, 5, 6, 7],
          //'7_127': [1, 2, 3, 4, 5, 6, 7],
          '7_127': [],
          '8_1': [8],
          '8_8': [7],
          '8_9': [7, 8],
          '8_28': [6],
          '8_56': [5],
          '8_70': [4],
          '8_247': [2, 3, 4, 5, 6, 7, 8],
          //'8_255': [1, 2, 3, 4, 5, 6, 7, 8],
          '8_255': [],
          '9_1': [9],
          '10_1': [10],
          '11_1': [11],
          '12_1': [12],
          '13_1': [13],
          '14_1': [14],
          '15_1': [15]
        };
      }


      var matchkeySp = {};
      var matchkeySpArr = [];
      var danArr = [];
      var danLen, dTmp, aArr = [],
        combinedDataTmp = [];

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

            //每次串的组合情况
            danLen = _this.danMatchCode.length;
            if (danLen != 0) { //如果有选择胆
              combinedDataTmp = [];
              aArr = [];
              for (var a = 0; a < combinedData.length; a++) {
                dTmp = 0;
                for (var b = 0; b < combinedData[a].length; b++) {
                  for (var c = 0; c < danLen; c++) {
                    if (_this.danMatchCode[c] == combinedData[a][b]) {
                      dTmp++;
                    }
                  }
                }

                if (dTmp == danLen) {
                  aArr.push(a);
                }
              } //end for a

              for (var a = 0; a < combinedData.length; a++) {
                for (var b = 0; b < aArr.length; b++) {
                  if (aArr[b] == a) {
                    combinedDataTmp[b] = combinedData[a];
                  }
                }
              }
              combinedData = combinedDataTmp;

            }

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
      $('.j-selectDsGamePool tbody').html('');
      $('.j-dsPoolStep1 .j-unSeleTips').show();
      $('#poolStep1 .scrollMoni').hide();
      $('#poolStep1 .unSeleTips').show();
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
      var $rightBox;
      switch (_this.navType) {
        case 'dssc':
          $rightBox = $('#j-xzcc-right-box');
          break;
        default:
          $rightBox = $('#j-right-box');
          break;
      }

      var maxBonus = s.maxBonus;
      maxBonus = (maxBonus == 0) ? '0.00' : maxBonus;
      _this.maxBonus = maxBonus;

      _this.zhushu = zhus;

      var navType = $('#j-hd-nav a.active').attr('nav-type');
      if (navType == 'dssc') {
        maxBonus = 0;
        _this.maxBonus = maxBonus;
        zhus = 0;
        _this.zhushu = zhus;
        totalMoney = 0;
      }

      $rightBox.find('.j-no-method').hide();
      $rightBox.find('.j-gameNumber').html(ms);
      $rightBox.find('.j-gameZhu').html(zhus);
      $rightBox.find('.j-totalMoney').html(totalMoney);
      $rightBox.find('.j-maxbonus').html(maxBonus);
    };

    // 获取购买对阵的 code
    bet.prototype.getSubContent = function(matchs) {

      var _this = this;
      var c = [];
      var f = [];
      var allHhtzPlay = null;
      var content = [];
      var result = null;
      var navType = $('#j-hd-nav a.active').attr('nav-type');
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

      //单式上传
      if (navType == 'dssc') {

        return _this.dsContent;

      }

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
      var matchKeys, matchsTmp = [],
        c = [],
        o = {};
      var navType = $('#j-hd-nav a.active').attr('nav-type');

      //单式上传
      if (navType == 'dssc') {

        return;

      }

      // get Params
      uniqMatch = _.uniq(_this.match, 'matchcode').sort(function(a, b) {
        return a.matchcode - b.matchcode;
      });

      for (var i = 0; i < uniqMatch.length; i++) {
        matchs.push(uniqMatch[i].matchcode);
      };

      matchsTmp = _this.danMatchCode.concat(matchs);
      for (var i = 0; i < matchsTmp.length; i++) {
        (matchsTmp[i] in o) ? o[matchsTmp[i]]++: o[matchsTmp[i]] = 1;
      }
      for (var x in o) {
        if (o[x] == 1) {
          c.push(x);
        }
      }

      matchs = c;

      if (_this.danMatchCode.length) {
        matchKeys = _this.danMatchCode.join(',') + '@' + matchs.join(',');
        content = _this.getSubContent(_this.danMatchCode) + '|' + _this.getSubContent(matchs);
      } else {
        matchKeys = matchs.join(',');
        content = _this.getSubContent(matchs);
      }

      obj = {
        zhushu: _this.zhushu,
        beishu: _this.beishu,
        matchKeys: matchKeys,
        bunch: _this.bunch.join(','),
        content: content,
      };
      return obj;

    };


    /**
     *  单式上传
     *  提交表单,获取要提交的参数
     * @return {object}
     */
    bet.prototype.getDsSubmitParams = function() {

      var _this = this;
      var obj = null;
      var content = _this.dsContent;
      var beishu = _this.beishu;
      var zhushu = _this.zhushu;

      obj = {
        content: content,
        zhushu: zhushu,
        beishu: beishu,
        bunch: _this.bunch.join(','),
      };
      return obj;

    }


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
        //1表示不停售，0表示停售
        var dgSale = t.parents('.j-dg-sale').attr('dg-sale');
        var ggSale = t.parents('.j-dg-sale').attr('gg-sale');
        var minBunch, flag, matchLenAfter;


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
          flag = 'minus';
        } else {
          flag = 'plus';
          t.removeClass(h).addClass(a);
          _this.addOneItem(index, dd, sp, title, dzTab, dgSale, ggSale);

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


        matchLenAfter = _.uniq(_this.match, 'matchcode').length;
        minBunch = _this.bunch[0] ? _this.bunch[0].slice(0, -2) : '';
        var jDan = $('#selectGamePool').find('tr.gameTitle').find('.j-dan');
        if (matchLenAfter < 3 || (minBunch && (minBunch == matchLenAfter || minBunch == '1'))) {

          jDan.removeClass('active').addClass('dan-disabled');
          _this.danMatchCode = [];

          //处理串
          $('.j-method-ls li').removeClass('active').removeClass('disabled-chuan');
          //在_this.bunch中有的置为active
          for (var i = 0; i < _this.bunch.length; i++) {
            $('.j-method-ls').find('li.jtip[data-method="' + _this.bunch[i] + '"]').addClass('active');
          }

        } else if (!_this.danMatchCode.length && !minBunch) {
          //既没有选串，没有选择胆
          jDan.removeClass('active').removeClass('dan-disabled');
          $('.j-method-ls li').removeClass('active').removeClass('disabled-chuan');

        } else if (_this.danMatchCode.length && !minBunch) {
          //选择了胆，没有选择串

          if (matchLenAfter < matchLen) {
            _.remove(_this.danMatchCode, function(d) {
              return d == matchcode;
            });

          } else {

          }

          jDan.removeClass('active').removeClass('dan-disabled');
          for (var i = 0; i < _this.danMatchCode.length; i++) {
            $('#selectGamePool').find('tr.gameTitle[matchcode="' + _this.danMatchCode[i] + '"]').find('.j-dan').addClass('active');
          }

          //处理串
          $('.j-method-ls li').removeClass('active').removeClass('disabled-chuan');

          $('.j-method-ls li').each(function(index, el) {
            var t = $(this);
            var dm = t.attr('data-method');
            var dm0 = t.attr('data-method').slice(0, -2);
            if (dm0 <= _this.danMatchCode.length) {
              t.addClass('disabled-chuan');
              _.remove(_this.bunch, function(b) {
                return b == dm;
              });
            }
          });

        } else if (_this.danMatchCode.length && minBunch) {
          //胆串都选择了

          //前提是对阵数减少了
          if (matchLenAfter < matchLen) {

            _.remove(_this.danMatchCode, function(d) {
              return d == matchcode;
            });

          } else {

          }

          if (_this.danMatchCode.length < minBunch - 1) {
            //胆数<最小串数-1

            //存在胆串中的active，其余保持正常状态
            jDan.removeClass('active').removeClass('dan-disabled');
            for (var i = 0; i < _this.danMatchCode.length; i++) {
              $('#selectGamePool').find('tr.gameTitle[matchcode="' + _this.danMatchCode[i] + '"]').find('.j-dan').addClass('active');
            }

            //处理串
            $('.j-method-ls li').removeClass('active').removeClass('disabled-chuan'); //所有的串先保持正常状态
            $('.j-method-ls li').each(function(index, el) { //比胆数小于等于的置为disabled
              var t = $(this);
              var dm = t.attr('data-method');
              var dm0 = t.attr('data-method').slice(0, -2);
              if (dm0 <= _this.danMatchCode.length) {
                t.addClass('disabled-chuan');
                _.remove(_this.bunch, function(b) {
                  return b == dm;
                });
              }
            });
            //在_this.bunch中有的置为active
            for (var i = 0; i < _this.bunch.length; i++) {
              $('.j-method-ls').find('li.jtip[data-method="' + _this.bunch[i] + '"]').addClass('active');
            }


          } else if (_this.danMatchCode.length == minBunch - 1) {
            //胆数=最小串数-1

            //存在胆串中的active，其余保持disabled状态
            jDan.removeClass('active').addClass('dan-disabled');
            for (var i = 0; i < _this.danMatchCode.length; i++) {
              $('#selectGamePool').find('tr.gameTitle[matchcode="' + _this.danMatchCode[i] + '"]').find('.j-dan').removeClass('dan-disabled').addClass('active');
            } //end for
          }

        }

        _this.setAllTotal();

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

      $('#j-ddsc-box').on('click', '.j-ds-databody-toggle', function(event) {
        var t = $(this);
        var $dd = t.parents('dt').siblings('dd');
        var s = Number(t.attr('data-show'));
        var title = ['隐藏', '展开'];
        var unS = (s === 1) ? 0 : 1;
        var $icon = t.find('.icon');
        var $navText = t.find('.j-nav-text');

        if (s == 1) {

          $dd.hide();
          $navText.text(title[1]);
          t.attr('data-show', unS);
          $icon.removeClass('show-icon').addClass('hide-icon');

        } else {

          $dd.show();
          $navText.text(title[0]);
          t.attr('data-show', unS);
          $icon.addClass('show-icon').removeClass('hide-icon');

        }

        _this.updateMidDsMatchUi();

      });

      $('#j-ddsc-box').on('click', '.j-toggle-all', function(event) {
        var t = $(this);
        var s = Number(t.attr('data-show'));
        var $span = $('.j-ds-databody').find('span.j-game-span');
        var title = ['隐藏全部场次', '显示全部场次'];
        var unS = (s === 1) ? 0 : 1;

        if (s == 1) {

          $span.hide();
          t.text(title[1]);
          t.attr('data-show', unS);

        } else {

          $span.show();
          t.text(title[0]);
          t.attr('data-show', unS);

        }
        _this.updateMidDsMatchUi();
      });


      $('.j-sc-choose').on('click', 'input[type="radio"]', function(event) {
        var t = $(this);
        var id = t.attr('id');
        switch (id) {
          case 'xzcc':
            H.box = $('#ballModal');
            $('#j-xzcc-box').show();
            $('#j-dccsc-box').hide();
            $('#j-fqys-box').hide();
            break;
          case 'dcc':
            H.box = $('#ballModal');
            $('#j-xzcc-box').hide();
            $('#j-dccsc-box').show();
            $('#j-fqys-box').hide();
            break;
          case 'fqys':
            H.box = $('#j-fqys-box');
            $('#j-xzcc-box').hide();
            $('#j-dccsc-box').hide();
            $('#j-fqys-box').show();
            H.setHeMaiTotal();
            _this.maxMoneyTips();
            _this.fqysSetTotalMoney();
            break;
        }

        $('.j-game-span').removeClass('active');
        _this.clearBetData();
        $('.j-delfile').trigger('click');


      });

      _this.box.on('click', '.j-dg-tips', function(event) {
        var t = $(this);
        var isCheck = t.find('input[type="checkbox"]').prop('checked'); //原来是否有勾选上，false表示原来没有勾选，true表示原来有勾选
        var $dgItips = t.find('.j-dg-itips');
        var $dgHintNbot = t.parents('.dg-choose').siblings('#j-game-select').find('.j-dg-hint-nbot');
        var $dgHint = t.parents('.dg-choose').siblings('#j-game-select').find('.j-dg-hint');
        var $dgHintNbotI = $dgHintNbot.find('i');
        var $dgHintI = $dgHint.find('i');

        if (isCheck) {
          $dgItips.css({
            'display': 'inline-block'
          });
          $dgHintNbot.addClass('dg-hint-nbot');
          $dgHintNbotI.show();
          $dgHint.addClass('dg-hint');
          $dgHintI.show();
        } else {
          $dgItips.hide();
          $dgHintNbot.removeClass('dg-hint-nbot');
          $dgHintNbotI.hide();
          $dgHint.removeClass('dg-hint');
          $dgHintI.hide();
        }

      });

      _this.dsscBox.on('click', '.j-what-bd', function(event) {
        $('#j-what-bd').modal('show');
      });

      $(".j-fileForm").submit(function() {
        var t = $(this);
        var btnType = t.find('.j-upfile').attr('btn-type');
        var playName = $('#j-dssc-nav li.active').find('a').attr('data-game');
        var playCnName = $('#j-dssc-nav li.active').find('a').text();
        var matchArr = [];
        var uniqMatch = _.uniq(_this.match, 'matchcode').sort(function(a, b) {
          return a.matchcode - b.matchcode;
        });
        var fileName = '';
        var url = '';
        var $upfile = t.find('.j-upfile');
        var $sucFtips = t.siblings('.j-suc-ftips');
        var $fileName = $sucFtips.find('.j-file-name');

        for (var i = 0; i < uniqMatch.length; i++) {
          matchArr.push(uniqMatch[i].matchcode);
        };

        t.find('.j-match-keys').val(matchArr.join(','));

        var formData = new FormData(t[0]);
        switch (btnType) {
          case 'small':
            formData.append("matchKeys", matchArr.join(','));
            formData.append("bunch", _this.bunch.join(','));
            url = '/lottery/upload/code/no-match-no-project/jczq/' + playName;
            break;
          case 'big':
            url = '/lottery/upload/code/match-no-project/jczq/' + playName;
            break;
        }

        $.ajax({
          // url: '/lottery/upload/code/match-no-project/jczq/' + playName,
          url: url,
          type: 'POST',
          data: formData,
          async: false,
          cache: false,
          contentType: false,
          processData: false
        }).done(function(data) {
          var zhushu;
          if (data.retCode == 100000) {

            _this.upFileResData = data.retData;
            fileName = $upfile.val();
            fileName = fileName.slice(fileName.lastIndexOf('\\') + 1);
            $upfile.val('');
            t.hide();
            $sucFtips.show();
            $fileName.text(fileName);
            $sucFtips.find('.j-navType').text(playCnName);
            zhushu = _this.upFileResData.data.length;


            switch (btnType) {
              case 'small':
                $('#j-xzcc-right-box').find('.j-gameZhu').text(zhushu);
                $('#j-xzcc-right-box').find('.j-totalMoney').text(zhushu * 2);
                _this.dsXzccSetContent();
                $('#j-xzcc-right-box').find('.j-maxbonus').text(_this.getMaxBobus());
                break;
              case 'big':
                $('#j-dccsc-box').find('.j-gameZhu').text(zhushu);
                $('.j-dcc-scon').find('.j-gameZhu').text(zhushu);
                $('.j-dcc-scon').find('.j-totalMoney').text(zhushu * 2);
                _this.dsDccSetContent();
                break;
            }


          } else {
            $upfile.val('');
            APP.handRetCode(data.retCode, data.retMsg);
          }
        }).fail(function() {
          $upfile.val('');
          APP.onServiceFail();
        });

        return false;
      });

      _this.dsscBox.on('change', '.j-upfile', function(event) {
        $(this).parents('.j-fileForm').submit();
      });


      _this.dsscBox.on('click', '.j-game-span', function(event) {
        event.preventDefault();
        var t = $(this);
        var a = 'active';
        var type = $('#j-dssc-nav li.active a').attr('data-game');
        var matchnumcn = t.attr('matchnumcn');
        var hostname = t.attr('hostname');
        var matchcode = t.attr('matchcode');

        if (t.hasClass(a)) {
          t.removeClass(a);
          _this.dsRemoveOneItem(matchcode);
        } else {
          t.addClass(a);
          _this.dsAddOneItem(matchcode, matchnumcn, hostname, type);
        }

        _this.initPoolStep1();

        _this.setSecondBox();
        _this.setAllTotal();
      });

      _this.dsscBox.on('click', '.j-delfile', function(event) {
        var t = $(this);
        var $sucFtips = t.parents('.j-suc-ftips');
        $sucFtips.hide();
        $sucFtips.find('.j-file-name').text('');
        $sucFtips.siblings('.j-fileForm').show();

        var type = '';

        $('.j-sc-choose input[type="radio"]').each(function() {
          var t = $(this);
          if (t.prop('checked')) {
            type = t.attr('data-type');
          }
        });

        switch (type) {
          case '1':
            //_this.clearBetData();
            //$('.j-game-span').removeClass('active');
            break;
          case '2':
            var $dccContent = $('.j-dcc-scon');
            $dccContent.find('.j-gameZhu').text(0);
            $dccContent.find('.j-totalMoney').text(0);
            break;
        }

      });

      _this.dsscBox.on('click', '.j-dccljtz', function(event) {
        var fileName = $('#j-dccsc-box').find('.j-file-name').text();
        if(!fileName){
          APP.showTips('请先上传文件！');
          return false;
        }

        var unikey = $.now();
        var $dccScon = $('.j-dcc-scon');
        var money = $dccScon.find('.j-totalMoney').text();
        var html = '<div class="frbox"><img src="http://static3.yuncai.com/front_images/fail.png" alt="success" class="icon"><div class="text"><p>投注金额：<strong class="fc-3 mlr5">' + money + '</strong>元</p><p>注数：<strong class="mlr5">' + $dccScon.find('.j-gameZhu').text() + '</strong></p></div></div>';

        var playGame = $('#j-dssc-nav li.active a').attr('data-game'); //玩法
        var beishu = 1;
        var content = [];
        var data = _this.upFileResData.data;
        var chuan = [];
        var con = '';
        var codes = [];
        var codeArr = [];
        var bunchArr = [];
        var file_id = _this.upFileResData.file_id;

        var type = '';

        $('.j-sc-choose input[type="radio"]').each(function() {
          var t = $(this);
          if (t.prop('checked')) {
            type = t.attr('data-type');
          }
        });


        _this.zhushu = _this.upFileResData.data.length;

        for (var i = 0; i < data.length; i++) {
          codeArr = [];
          for (var j = 0; j < data[i]['code'].length; j++) {
            codeArr.push(data[i]['match_key'][j] + '|' + data[i]['code'][j]);
          };

          codes.push(codeArr.join('/'));
        };

        for (var i = 0; i < data.length; i++) {
          bunchArr.push(data[i]['bunch']);
        };

        for (var i = 0; i < data.length; i++) {
          con = '';
          con = playGame + ':' + beishu + ':' + codes[i] + ':' + bunchArr[i];
          content.push(con);

        };

        var Data = {
          content: content,
          unikey: unikey,
          beishu: beishu,
          file_id: file_id,
          money: money,
          type: type
        };

        APP.checkLogin(Config.payMoney, {
          enoughMoney: function() {

            APP.showTips({
              type: 2,
              title: '投注信息确认',
              text: html,
              onConfirm: function() {
                $.ajax({
                    url: '/lottery/jingcai/buy-upload-self/jczq/' + playGame,
                    type: 'post',
                    dataType: 'json',
                    data: Data,
                  })
                  .done(function(data) {
                    if (data.retCode == 100000) {
                      store.set('lotyName', Config.lotyName);
                      store.set('payMoney', Config.payMoney);
                      store.set('projectNo', data.retData.projectNo);
                      store.set('lotyCNName', Config.lotyCNName);
                      window.location.href = '/html/lottery/trade/success.html';
                    } else {
                      APP.handRetCode(data.retCode, data.retMsg);
                    }
                  })
                  .fail(function() {
                    APP.onServiceFail();
                  });
              }
            });

          }
        });


      });


      _this.dsscBox.on('click', '.j-dsfqys', function(event) {
        var $fqysBox = $('#j-fqys-box');
        var maxMoney = $fqysBox.find('.j-max-money').val();
        var shareNum = $fqysBox.find('.j-share-num').val();
        var rengou = $fqysBox.find('.j-rengou').val();

        if (maxMoney && shareNum && rengou) {} else {
          APP.showTips('请填写好相关信息！');
          return false;
        }

        var playType = $('#j-dssc-nav li.active a').text();
        var baodi = $fqysBox.find('.j-baodi-text').val();
        baodi = baodi == '' ? 0 : baodi;
        var html = '<div class="frbox"><img src="http://static3.yuncai.com/front_images/fail.png" alt="success" class="icon"><div class="text"><p>竞彩足球' + playType + 　'</p><p>方案总金额：<strong class="fc-3 mlr5">' + $('.j-fqys-totalMoney').text() + '</strong>元</p><p>您认购<strong class="mlr5">' + rengou + '</strong>份，保底<strong class="mlr5">' + baodi + '</strong>份</p><p>共需支付<strong class="mlr5">' + $('.j-fqys-totalMoney').text() + '</strong>元</p>';

        var $fqysBox = $('#j-fqys-box');
        var playName = $('#j-dssc-nav li.active').find('a').attr('data-game');
        var Data = {};
        var unikey = $.now();
        var beishu = 1;
        var projectTitle = $fqysBox.find('.j-project-title').val();
        var projectText = $fqysBox.find('.j-project-text').text();
        var buyNum = $fqysBox.find('.j-rengou').val();
        var aegisNum = $fqysBox.find('.j-baodi-text').val();
        var tichengPercent = $fqysBox.find('.j-ticheng').val();
        var openSet = $('.j-fa-set a.active').attr('data-set');
        Data = {
          unikey: unikey,
          beishu: beishu,
          projectTitle: projectTitle,
          projectText: projectText,
          buyNum: buyNum,
          aegisNum: aegisNum,
          shareNum: shareNum,
          tichengPercent: tichengPercent,
          openSet: openSet,
          maxMoney: maxMoney
        }

        APP.checkLogin(Config.payMoney, {
          enoughMoney: function() {

            APP.showTips({
              type: 2,
              title: '投注信息确认',
              text: html,
              onConfirm: function() {
                $.ajax({
                    url: '/lottery/jingcai/buy-together-without-content/jczq/' + playName,
                    type: 'post',
                    dataType: 'json',
                    data: Data,
                  })
                  .done(function(data) {

                    if (data.retCode == 100000) {

                      store.set('lotyName', Config.lotyName);
                      store.set('payMoney', Config.payMoney);
                      store.set('projectNo', data.retData.projectNo);
                      store.set('lotyCNName', Config.lotyCNName);
                      window.location.href = '/html/lottery/trade/success.html';
                    } else {
                      APP.handRetCode(data.retCode, data.retMsg);
                    }
                  })
                  .fail(function() {
                    APP.onServiceFail();
                  });
              }

            });

          }

        });



      });

      _this.dsscBox.on('click', '.j-dsClear', function(event) {
        _this.clearBetData();
        $('.j-game-span').removeClass('active');
        $('#j-xzcc-right-box').find('.j-delfile').trigger('click');

      });

      $('#j-fqys-box').on('change', '.j-max-money', function(event) {
        _this.maxMoneyCheck();
        _this.maxMoneyTips();
        _this.fqysSetTotalMoney();
      });

      $('#j-fqys-box').on('blur', '.j-max-money', function(event) {
        _this.maxMoneyCheck();
        _this.maxMoneyTips();
        _this.fqysSetTotalMoney();
      });


      $('#j-fqys-box').on('change', '.j-baodi-text', function(event) {

        _this.fqysSetTotalMoney();
        _this.addBaodi();

      });

      $('#j-fqys-box').on('blur', '.j-baodi-text', function(event) {

        _this.fqysSetTotalMoney();
        _this.addBaodi();

      });

      $('#j-fqys-box').on('change', '.j-share-num', function(event) {

        _this.fqysSetTotalMoney();

      });

      $('#j-fqys-box').on('blur', '.j-share-num', function(event) {

        _this.fqysSetTotalMoney();

      });

      $('#j-fqys-box').on('change', '.j-rengou', function(event) {

        var t = $(this);
        var val = t.val();
        $('.j-fqys-totalFen').text(val);
        _this.fqysSetTotalMoney();

      });

      $('#j-fqys-box').on('blur', '.j-rengou', function(event) {

        var t = $(this);
        var val = t.val();
        $('.j-fqys-totalFen').text(val);
        _this.fqysSetTotalMoney();

      });

      $('#j-fqys-box').on('keyup', '.j-rengou', function(event) {

        var t = $(this);
        var val = t.val();
        $('.j-fqys-totalFen').text(val);
        _this.fqysSetTotalMoney();

      });

      $('#j-fqys-box').on('click', '#j-full-bao', function(event) {

        _this.fqysSetTotalMoney();
        _this.addBaodi();

      });


      $('.j-zheng').on('change', function(event) {

        var t = $(this);

        t.val(_this.filterNum(t.val()));

      });

      $('.j-zheng').on('blur', function(event) {

        var t = $(this);

        t.val(_this.filterNum(t.val()));

      });

      $('.j-zheng').on('keyup', function(event) {

        var t = $(this);

        t.val(_this.filterNum(t.val()));

      });
    };

    bet.prototype.addBaodi = function(){
      var $fqysBox = $('#j-fqys-box');
      var baodiVal = $fqysBox.find('.j-baodi-text').val();

      if(baodiVal){

        $fqysBox.find('.j-baodi').text(baodiVal);
        $fqysBox.find('.j-add-baodi').show();

      }else{

        $fqysBox.find('.j-add-baodi').hide();

      }

    };

    bet.prototype.maxMoneyCheck = function() {
      var t = $('#j-fqys-box').find('.j-max-money');
      var tVal = t.val();
      if (tVal % 2 == 1 && tVal < 2) {

        tVal = 2;
        t.val(tVal);
        //APP.showTips('最大值只能是偶数，且大于等于2');
        return false;

      } else if (tVal < 2) {

        tVal = 2;
        t.val(tVal);
        //APP.showTips('最大值必须大于等于2');
        return false;

      } else if (tVal % 2 == 1) {

        tVal = tVal - 1;
        t.val(tVal);
        //APP.showTips('最大值只能是偶数');
        return false;

      }

    };

    bet.prototype.maxMoneyTips = function() {

      var t = $('#j-fqys-box').find('.j-max-money');
      var $rangeTips = t.siblings('.j-range-tips');
      var maxVal = t.val();
      var per70 = Math.round(maxVal * 0.7);

      if (maxVal) {
        $rangeTips.text('（' + per70 + '-' + maxVal + '）');
      } else {
        $rangeTips.text('');
      }

    };

    bet.prototype.fqysSetTotalMoney = function() {
      var $fqysBox = $('#j-fqys-box');
      var maxVal = $fqysBox.find('.j-max-money').val();
      var shareNum = $fqysBox.find('.j-share-num').val();
      var rengou = $fqysBox.find('.j-rengou').val();
      var totalMoney = 0;
      var unitPrice = $fqysBox.find('.j-unit-price').text();

      if (maxVal && shareNum && rengou) {
        //没有包含保底的金额
        totalMoney = Math.round(maxVal / shareNum * rengou)
      }

      if (unitPrice) {
        totalMoney = $('.j-baodi-text').val() * unitPrice + totalMoney;
      }

      $('.j-fqys-totalMoney').text(totalMoney);
      $('.j-fqys-totalFen').text(rengou);
    };


    bet.prototype.updateMidDsMatchUi = function() {
      var navType = $('#j-hd-nav a.active').attr('nav-type');
      var hide = 0;

      $('.j-ds-databody .j-game-span').each(function(index, el) {
        if ($(this).is(":hidden")) {
          hide++;
        }
      });

      $('#j-bjdc-all').html(hide);
    }

    bet.prototype.dsXzccSetContent = function() {
      var _this = this;
      var codes = {};
      var con = '';
      var data = _this.upFileResData.data;
      var content = [];
      var chuanNum = [];

      var playGame = $('#j-dssc-nav li.active a').attr('data-game'); //玩法
      var beishu = _this.beishu; //倍数
      var xzccRightBox = $('#j-xzcc-right-box');

      _this.zhushu = _this.upFileResData.data.length;

      xzccRightBox.find('.j-method-ls li.active').each(function() {
        var t = $(this);
        chuanNum.push(t.attr('data-method'));
      });

      for (var i = 0; i < _this.zhushu; i++) {
        codes[i] = [];
        for (var prop in data[i]) {

          if (data[i].hasOwnProperty(prop)) {
            codes[i].push(prop + '|' + data[i][prop]);
          }
        }
      };

      for (var i = 0; i < _this.zhushu; i++) {
        con = playGame + ':' + beishu + ':' + codes[i].join('/') + ':' + chuanNum.join('^');
        content.push(con);
      };

      _this.dsContent = content;

    };


    bet.prototype.dsDccSetContent = function() {
      var _this = this;
      var codes = {};
      var con = '';
      var data = _this.upFileResData.data;
      var content = [];
      var chuanNum = [];
      var codeArr = [];
      var codes = [];
      var bunchArr = [];
      var con = '';
      var beishu = [];

      var playGame = $('#j-dssc-nav li.active a').attr('data-game'); //玩法
      var beishu = _this.beishu; //倍数
      var xzccRightBox = $('#j-xzcc-right-box');

      _this.zhushu = _this.upFileResData.data.length;

      xzccRightBox.find('.j-method-ls li.active').each(function() {
        var t = $(this);
        chuanNum.push(t.attr('data-method'));
      });


      for (var i = 0; i < data.length; i++) {
        codeArr = [];
        for (var j = 0; j < data[i]['code'].length; j++) {
          codeArr.push(data[i]['match_key'][j] + '|' + data[i]['code'][j]);
        };

        codes.push(codeArr.join('/'));
      };

      for (var i = 0; i < data.length; i++) {
        bunchArr.push(data[i]['bunch']);
      };

      for (var i = 0; i < data.length; i++) {
        beishu.push(data[i]['multiple']);
      };

      for (var i = 0; i < data.length; i++) {
        con = '';
        con = playGame + ':' + beishu[i] + ':' + codes[i] + ':' + bunchArr[i];
        content.push(con);

      };

      _this.dsContent = content;


    };



    bet.prototype.dsGetContent = function() {
      var _this = this;

      return _this.dsContent;
    };

    bet.prototype.getMaxBobus = function() {
      var _this = this;
      var matchsObj = {};
      var data = _this.upFileResData.data;
      var matchSp = [];
      var matchSpArr = [];
      var maxBonus;
      for (var i = 0; i < data.length; i++) {
        for (var prop in data[i]) {
          if (data[i].hasOwnProperty(prop)) {
            matchsObj[i] = data[i];
          }
        }
      };

      for (var prop in matchsObj) {

        matchSp = [];

        if (matchsObj.hasOwnProperty(prop)) {

          for (var p in matchsObj[prop]) {

            if (matchsObj[prop].hasOwnProperty(p)) {

              matchSp.push(p + '|' + matchsObj[prop][p]);

            }
          }

          matchSpArr.push(matchSp.join('/'));
        }
      }


      var matchcode = '';
      var sp = '';
      var tmpSum = 1;
      var sumArr = [];
      matchSp = [];
      for (var i = 0; i < matchSpArr.length; i++) {
        matchSp.push(matchSpArr[i].split('/'));
      };

      for (var i = 0; i < matchSp.length; i++) {
        tmpSum = 1;
        for (var j = 0; j < matchSp[i].length; j++) {
          matchcode = matchSp[i][j].split('|')[0];
          sp = matchSp[i][j].split('|')[1];
          switch (sp) {
            case '3':
              tmpSum *= $('.j-ds-databody .j-game-span[matchcode="' + matchcode + '"]').attr('sp3');
              break;

            case '1':
              tmpSum *= $('.j-ds-databody .j-game-span[matchcode="' + matchcode + '"]').attr('sp1');
              break;

            case '0':
              tmpSum *= $('.j-ds-databody .j-game-span[matchcode="' + matchcode + '"]').attr('sp0');
              break;
          }

        };

        sumArr.push(tmpSum);
      };

      maxBonus = _.max(sumArr);

      maxBonus *= 2;

      maxBonus = maxBonus.toFixed(2);

      _this.maxBonus = maxBonus;

      return maxBonus;
    };


    bet.prototype.filterNum = function(v) {

      if (v === '') {
        return v;
      }

      var n = parseInt(v, 10);

      if (isNaN(n)) {
        n = 0;
      } else {
        n = (n >= 0) ? n : 0;
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
        var navType = $('#j-hd-nav a.active').attr('nav-type');

        _this.updateCount(m, c);

        if (navType == 'dssc') {

          var $xzccRightBox = $('#j-xzcc-right-box');
          var $totalMoney = $xzccRightBox.find('.j-totalMoney');
          var zhus = $xzccRightBox.find('.j-poolStep4').find('.j-gameZhu').text();
          var beishu = m.val();

          $totalMoney.text(zhus * 2 * beishu);

        } else {

          _this.setAllTotal();

        }

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

      $('.j-method-ls').on('click', '.jtip', function(event) {
        var t = $(this);
        var navType = $('#j-hd-nav a.active').attr('nav-type');
        var fileName = $('.j-file-name').text();
        if (t.hasClass('disabled-chuan')) {
          return;
        }
        var a = 'active';
        var h = null;
        var method = t.attr('data-method') || null;
        var minBunch, matchLen, maxDanLen, activeLen, hasActive;
        var jDan = $('#selectGamePool').find('tr.gameTitle').find('.j-dan');

        if (!_this.bjdcPassWay || navType == 'dssc') {
          _this.bunch = [];
          $('.j-method-ls .jtip').removeClass(a);
        }


        t.toggleClass(a);
        h = t.hasClass(a);
        t.attr('data-check', h);
        _this.toggleBunch(h, method);
        if (navType == 'dssc' && fileName) {
          APP.showTips('如选择新的过关方式，需重新选择文件上传！');
          $('.j-delfile').click();
          return;
        }

        if (navType == 'ggtz' && $('.j-gg-tab').find('li.active').attr('data-bunch') == '0') { //如果是自由过关方式
          matchLen = _.uniq(_this.match, 'matchcode').length; //已选择的对阵数
          minBunch = _this.bunch[0] ? _this.bunch[0].slice(0, -2) : ''; //最小串数
          activeLen = $('#selectGamePool').find('.j-dan.active').length; //已选择的胆数
          hasActive = t.hasClass('active');

          if (minBunch) { //说明有选择串数
            maxDanLen = minBunch - 1; //最多可选胆数.j-delfile
          } else {
            maxDanLen = matchLen;
          }

          if (minBunch) { //已选择串数
            if (minBunch == matchLen || minBunch == '1') {
              //)如果已选择的最小串数=对阵数 or 最小串数是单关
              jDan.removeClass('active').addClass('dan-disabled');
              _this.danMatchCode = [];

            } else if (_this.danMatchCode.length == minBunch - 1) {
              //胆数=最小串数-1

              //存在胆串中的active，其余保持disabled状态
              jDan.removeClass('active').addClass('dan-disabled');

              for (var i = 0; i < _this.danMatchCode.length; i++) {
                $('#selectGamePool').find('tr.gameTitle[matchcode="' + _this.danMatchCode[i] + '"]').find('.j-dan').removeClass('dan-disabled').addClass('active');
              }

            } else if (_this.danMatchCode.length < minBunch - 1) {
              //胆数<最小串数-1

              //重置胆字状态，存在胆串中的active
              jDan.removeClass('active').removeClass('dan-disabled');

              for (var i = 0; i < _this.danMatchCode.length; i++) {
                $('#selectGamePool').find('tr.gameTitle[matchcode="' + _this.danMatchCode[i] + '"]').find('.j-dan').removeClass('dan-disabled').addClass('active');
              }

            }


          } else { //未选择串数

            if (matchLen < 3) {
              jDan.removeClass('active').addClass('dan-disabled');
            } else {
              //重置胆字状态，存在胆串中的active
              jDan.removeClass('active').removeClass('dan-disabled');

              for (var i = 0; i < _this.danMatchCode.length; i++) {
                $('#selectGamePool').find('tr.gameTitle[matchcode="' + _this.danMatchCode[i] + '"]').find('.j-dan').removeClass('dan-disabled').addClass('active');
              }

              //重置几串几状态

              $('.j-method-ls li').removeClass('active').removeClass('disabled-chuan');

              $('.j-method-ls li').each(function(index, el) {
                var t = $(this);
                var dm = t.attr('data-method');
                var dm0 = t.attr('data-method').slice(0, -2);
                if (dm0 <= _this.danMatchCode.length) {
                  t.addClass('disabled-chuan');
                  _.remove(_this.bunch, function(b) {
                    return b == dm;
                  })
                }
              });
            }

          } //end minBunch


        }


        _this.setAllTotal();

      });

      $('#orderRule').on('click', '.icon', function(event) {
        var t = $(this);
        t.toggleClass('icon-cbox').toggleClass('icon-cgou');
        _this.isAgreen = t.hasClass('icon-cgou');
      });

      $('.j-touzhu-tips').on('click', function(event) {

        $('.j-touzhu-tipstext').toggle();
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
        //var totalLinks = $(this).parents("p").siblings('p');
        //var aLinks = $(this).siblings('a');
        var removeItem = '';
        var t = $(this);
        var parentTr = t.parents('tr.gameOption');
        var tMatchcode = parentTr.attr('matchcode');
        var danObj = parentTr.prev('tr.gameTitle').find('.j-dan');
        var minBunch = _this.bunch[0] ? _this.bunch[0].slice(0, -2) : '';
        var jDan = $('#selectGamePool').find('tr.gameTitle').find('.j-dan');

        if (danObj.hasClass('active')) {
          _.remove(_this.danMatchCode, function(d) {
            return d == tMatchcode;
          });
        }

        //处理胆

        //重置胆
        jDan.removeClass('active').removeClass('dan-disabled');
        for (var i = 0; i < _this.danMatchCode.length; i++) {
          $('#selectGamePool').find('tr.gameTitle[matchcode="' + _this.danMatchCode[i] + '"]').find('.j-dan').removeClass('dan-disabled').addClass('active');
        }

        if (totalLinks.length == 0) {
          removeItem = $('#selectGamePool tr[matchcode=' + code + ']');
        } else {
          removeItem = $(this);
        }
        /*if (aLinks.length == 0 && totalLinks.length == 0) {
          removeItem = $('#selectGamePool tr[matchcode=' + code + ']');
        } else if (aLinks.length == 0) {
          removeItem = $(this).parents("p");
        } else {
          removeItem = $(this);
        }*/
        removeItem.remove();
        actItem.removeClass('active');

        _.remove(_this.match, function(o) {
          //return (o.index == i && o.matchcode == code);
          return o.matchcode == code;
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
        var t = $(this);
        var parentTr = t.parents('tr.gameTitle');
        var tMatchcode = parentTr.attr('matchcode');
        var danObj = parentTr.find('.j-dan');
        var minBunch = _this.bunch[0] ? _this.bunch[0].slice(0, -2) : '';
        var jDan = $('#selectGamePool').find('tr.gameTitle').find('.j-dan');

        if (danObj.hasClass('active')) {
          _.remove(_this.danMatchCode, function(d) {
            return d == tMatchcode;
          });
        }

        //处理胆

        //重置胆
        jDan.removeClass('active').removeClass('dan-disabled');
        for (var i = 0; i < _this.danMatchCode.length; i++) {
          $('#selectGamePool').find('tr.gameTitle[matchcode="' + _this.danMatchCode[i] + '"]').find('.j-dan').removeClass('dan-disabled').addClass('active');
        }

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

      $('.j-selectDsGamePool').on('click', '.j-del-one', function(event) {
        var code = $(this).parents('tr').attr('matchcode');
        var removeItem = $('.j-selectDsGamePool tr[matchcode=' + code + ']');
        var actItem = $('.j-game-select span.active[matchcode=' + code + ']');
        var t = $(this);

        removeItem.remove();
        actItem.removeClass('active');

        _.remove(_this.match, function(o) {
          return o.matchcode == code;
        });

        $('.j-delfile').trigger('click');
        if (_this.match == 0) $('.j-dsPoolStep1 .unSeleTips').show();

        _this.setSecondBox();
        _this.setAllTotal();

      });


      $('#selectGamePool').on('click', '.j-dan', function(event) {
        var minBunch, matchLen, maxDanLen, activeLen, danMatchLen;
        var t = $(this);
        if (t.hasClass('dan-disabled')) {
          return;
        }
        var hasActive = t.hasClass('active');
        var jDan = $('#selectGamePool').find('tr.gameTitle').find('.j-dan');
        var trParent = t.parents('tr.gameTitle');
        var tMatchCode = trParent.attr('matchcode');

        matchLen = _.uniq(_this.match, 'matchcode').length; //已选择的对阵数
        minBunch = _this.bunch[0] ? _this.bunch[0].slice(0, -2) : ''; //最小串数
        activeLen = $('#selectGamePool').find('.j-dan.active').length; //已选择的胆数

        if (minBunch) {
          maxDanLen = minBunch - 1; //最多可选胆数
        } else {
          maxDanLen = matchLen;
        }

        if (hasActive) {

          t.removeClass('active');
          _.remove(_this.danMatchCode, function(d) {
            return d == tMatchCode;
          });
          if (activeLen == maxDanLen) {
            $('#selectGamePool').find('tr.gameTitle').find('.j-dan.dan-disabled').removeClass('dan-disabled');
          }

        } else {

          t.addClass('active');
          _this.danMatchCode.push(tMatchCode);
          _this.danMatchCode = _.uniq(_this.danMatchCode);

          if (activeLen == maxDanLen - 1) {

            jDan.removeClass('active').addClass('dan-disabled');

            for (var i = 0; i < _this.danMatchCode.length; i++) {
              $('#selectGamePool').find('tr.gameTitle[matchcode="' + _this.danMatchCode[i] + '"]').find('.j-dan').removeClass('dan-disabled').addClass('active');
            }

          }

        }
        $('.j-method-ls li').removeClass('disabled-chuan');
        danMatchLen = _this.danMatchCode.length;
        $('.j-method-ls li').each(function(index, el) {
          var t = $(this);
          var tBunch = t.attr('data-method');
          var chuan = t.attr('data-method').slice(0, -2);

          if (chuan <= danMatchLen) {

            t.removeClass('active').addClass('disabled-chuan');
            _.remove(_this.bunch, function(o) {
              return tBunch == o;
            });

          }

        });

        _this.setAllTotal();

      });

    };

    return bet;

  }());

  var b = new bet();
  b.init();
  return b;
});