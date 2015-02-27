define(['jquery', 'app'], function ($, APP) {
  'use strict';

  var bet = (function () {

    function bet(args) {
      // enforces new
      if (!(this instanceof bet)) {
        return new bet(args);
      }
      // constructor body
    }

    bet.prototype = {
      beishu: 1,
      zhushu: null,
      isAgreen: true,
      match: [],
      bunch: [],
      maxBunch: {
        'spf': 8,
        'rqspf': 8,
        'bf': 4,
        'zjq': 6,
        'bqc': 4
      },
      dd: null,
      maxBonus: null,
      box: $('#bettingBox'),
      tab: 'spf'
    };

    bet.prototype.init = function () {

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

    bet.prototype.updateCount = function (m, c) {
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

    bet.prototype.getOtherEm = function (el, i) {
      if (el.parents().hasClass('bidCounts')) {
        return this.box.find('.even em[index="' + i + '"]');
      } else {
        return this.box.find('.even em[index="' + i + '"]');
      }
    };

    bet.prototype.toggleBunch = function (h, method) {

      var _this = this;

      if (h) {
        _this.bunch.push(method);
        _this.bunch = _.uniq(_this.bunch).sort(function (a, b) {
          return a.slice(0, 1) - b.slice(0, 1);
        });
      } else {
        _.remove(_this.bunch, function (b) {
          return b == method;
        });
      }

    };

    bet.prototype.addOneItem = function (i, dd, sp, title) {

      var _this = this;
      var code = dd.attr('matchcode');

      if (_.find(_this.match, function (chr) {
          return (chr.index == i && chr.matchcode == code);
        })) {
        return;
      }

      var compiled = _.template('<tr matchcode="<%= matchcode%>" class="gameTitle"><th class="t1"><a class="icoDel j-del-all" href="javascript:;">&times;</a><%= matchnumcn%></th><th class="t2"><%= hostname%> <%= guestname%></th></tr><tr class="gameOption" matchcode="<%= matchcode%>"><td colspan="5" class="betList"><a index="<%= i%>" gametype="<%= gametype%>" matchcode="<%= matchcode%>" href="javascript:;" class="<%= color%>"><%= text%></a></td></tr>');
      var oneMatchHTML = '';
      var color = 'block' + i;

      if (_this.tab !== 'spf' && _this.tab !== 'rqspf') {
        color = 'block';
      }

      var fill = {
        i: i,
        color: color,
        gametype: _this.tab,
        text: title,
        matchcode: code,
        matchnumcn: dd.attr('matchnumcn'),
        hostname: dd.attr('hostname'),
        guestname: dd.attr('guestname')
      };

      var linkHTML = '';

      var hasMatch = _.find(_this.match, {
        'matchcode': code
      });

      _this.match.push({
        index: i,
        type: _this.tab,
        matchcode: code,
        sp: sp,
        title: title,
      });

      var selectMatch = _.uniq(_this.match, function (n) {
        return n.matchcode;
      });

      _this.match = _this.match.sort(function (a, b) {
        return Number(a.index) - Number(b.index);
      });

      selectMatch = _this.match.concat().sort(function (a, b) {
        return Number(a.matchcode) - Number(b.matchcode);
      });

      if (hasMatch) {

        _.each(_this.match, function (matchs) {

          if (matchs.matchcode == code) {

            if (_this.tab !== 'spf' && _this.tab !== 'rqspf') {
              color = 'block';
            } else {
              color = 'block' + matchs.index;
            }

            linkHTML += '<a index="' + matchs.index + '" gametype="' + matchs.type + '" matchcode="' + matchs.matchcode + '" href="javascript:;" class="' + color + '">' + matchs.title + '</a>';
          }
        });

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
    bet.prototype.removeOneItem = function (i, dd) {

      var _this = this;
      var code = dd.attr('matchcode');
      var hasMatch = null;
      var matchTotal = 0;

      _.remove(_this.match, function (o) {
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
     *  设置右侧第二个Box
     */
    bet.prototype.setSecondBox = function () {

      var _this = this;
      var len = _.uniq(_this.match, 'matchcode').length;

      var obj = {
        len: len,
        isCheck: false,
        active: ''
      };
      var tips = $('#poolErrorTips');
      var list = $('#j-method-ls');
      var html = '';
      var jtip = list.find('.jtip');
      var jtipLen = jtip.length;

      if (len > _this.maxBunch[_this.tab]) return;

      if (len >= 2) {

        if ($('#j-me-' + len)[0]) {
          if ((jtipLen + 1) > len) {
            _.remove(_this.bunch, function (b) {
              return b.slice(0, 1) == (jtipLen + 1);
            });
            jtip.eq(jtipLen - 1).remove();
          }
        } else {

          if (len == 2) {
            obj.isCheck = true;
            obj.active = 'active';
            _this.toggleBunch(true, '2_1');
          }

          if (len == 3) {
            jtip.removeClass('active').attr('data-check', 'false');
            _this.toggleBunch(false, '2_1')
          }

          html = _.template('<li inf="至少猜中<%= len%>场可中奖" class="jtip <%= active%>" id="j-me-<%= len%>" data-method="<%= len%>_1" data-check="<%= isCheck%>"><%= len%>串1</li>');

          tips.hide();
          list.show().append(html(obj));
        }

      } else {
        _this.bunch = [];
        list.hide().html('');
        tips.show();
      }

    };

    /**
     *  获取组合数组
     * @param  {Array}   numArr    选中的数组
     * @param  {Number}   choose    几串几
     * @param  {Function} callback 回调函数
     * @return {null}
     */
    bet.prototype.combinations = function (numArr, choose, callback) {
      var n = numArr.length;
      var c = [];
      var inner = function (start, choose_) {
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
    bet.prototype.getTotalZhus = function () {

      var _this = this;
      var matchkeys = [];
      var acTotalNum = 1;
      var method = null;
      var group = _.groupBy(_this.match, function (match) {
        return match.matchcode;
      });
      var ms = _.uniq(_this.match, 'matchcode');
      var matchTotal = ms.length;
      var chuanArr = [];
      var maxList = [];
      var mb = 0;
      var result = {
        zhus: 0,
        maxBonus: 0,
      };

      $('#j-method-ls .jtip[data-check="true"]').each(function (index, el) {
        chuanArr.push(el.attributes['data-method'].value);
      });

      for (var prop in group) {
        if (group.hasOwnProperty(prop)) {
          maxList.push(_.max(group[prop], 'sp'));
        }
      }
      var matchkeySp = {};
      var matchkeySpArr = [];
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

          mb = 0;
          method = Number(chuanArr[i].slice(0, 1));
          _this.combinations(matchkeys, method, function (matchs) {
            var _tmpZhushu = 1;
            var _tmpMaxBonus = 1;
            for (var i = 0; i < matchs.length; i++) {
              _tmpZhushu *= matchkeySp[matchs[i]].length;
              _tmpMaxBonus *= _.max(matchkeySp[matchs[i]], function (chr) {
                return parseInt(chr);
              });
            }
            result.zhus += _tmpZhushu;
            result.maxBonus += _tmpMaxBonus;
          });

        };

      }

      result.maxBonus *= _this.beishu * 2;
      result.maxBonus = result.maxBonus.toFixed(2);

      return result;

    };

    /**
     *  Clear Betting Object Data
     * @return {null}
     */
    bet.prototype.clearBetData = function () {
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
    bet.prototype.setAllTotal = function () {

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

    bet.prototype.getSubContent = function (matchs) {

      var c = [];
      var f = [];
      var content = [];
      var params = {
        spf: [3, 1, 0],
        rqspf: [3, 1, 0],
        zjq: [0, 1, 2, 3, 4, 5, 6, 7],
        bqc: ['33', '31', '30', '13', '11', '10', '03', '01', '00'],
        bf: ['10', '20', '21', '30', '31', '32', '40', '41', '42', '50', '51', '52', '90', '00', '11', '22', '33', '99', '01', '02', '12', '03', '13', '23', '04', '14', '24', '05', '15', '25', '09']
      };
      var item = null;

      for (var i = 0; i < matchs.length; i++) {

        c = [];

        f = _.where(this.match, {
          'matchcode': matchs[i]
        });

        for (var k = 0; k < f.length; k++) {
          item = f[k];
          c.push(params[item.type][item.index]);
        };

        content.push(c.join(','));

      };

      return content.join('|');
    }

    /**
     *  提交表单,获取要提交的参数
     * @return {object}
     */
    bet.prototype.getSubmitParams = function () {

      var _this = this;
      var obj = null;
      var matchs = [];
      var content = null;
      var uniqMatch = null;

      // get Params
      uniqMatch = _.uniq(_this.match, 'matchcode').sort(function (a, b) {
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

    bet.prototype.getOneBfHtml = function (matchcode) {

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
          shtml.push('<td data-item="' + hArr[i] + '" sp="' + spArr[i] + '" index="' + i + '"' + common + '>' + hArr[i] + '<div>' + spArr[i] + '</div></td>');
        }

        if (13 <= i && i <= 17) {
          phtml.push('<td data-item="' + hArr[i] + '" sp="' + spArr[i] + '" index="' + i + '"' + common + '>' + hArr[i] + '<div>' + spArr[i] + '</div></td>');
        }

        if (18 <= i && i <= 30) {
          fhtml.push('<td data-item="' + hArr[i] + '" sp="' + spArr[i] + '" index="' + i + '"' + common + '>' + hArr[i] + '<div>' + spArr[i] + '</div></td>');
        }

      };

      html += '<table class="analyMoreTable"><colgroup><col width="45px"><col><col><col><col><col><col><col><col><col><col><col><col><col><col></colgroup><tbody>';

      html += '<tr><th>主胜</th>' + shtml.join('') + '<td class="j-bf-all sp-btn">全包</td></tr>';
      html += '<tr><th>平</th>' + phtml.join('') + '<td colspan="8" class="noBg"></td><td class="j-bf-all sp-btn">全包</td></tr>';
      html += '<tr><th>主负</th>' + fhtml.join('') + '<td class="j-bf-all sp-btn">全包</td></tr>';

      html += '</tbody></table>';

      return html;
    };
    /**
     *  购票主体事件绑定
     * @return {null}
     */
    bet.prototype.bindMain = function () {

      var _this = this;
      var a = 'active';
      var h = 'hover';

      _this.box.on('mousemove', 'dd', function (event) {
        $(this).addClass('even');
      });

      _this.box.on('mouseout', 'dd', function (event) {
        $(this).removeClass('even');
      });

      // 比分展开
      _this.box.on('click', '.j-show-bf', function (event) {

        var t = $(this);
        var row = t.parents('.row1-1');
        var matchcode = t.parents('dd').attr('matchcode');
        var dd = t.parents('dd');
        var newDd = null;
        var html = _this.getOneBfHtml(matchcode);

        var hasNewDd = _this.box.find('[data-newdd=' + matchcode + ']').length;

        row.toggleClass('on');

        if (row.hasClass('on')) {

          if (hasNewDd) {
            _this.box.find('[data-newdd=' + matchcode + ']').show();
          } else {
            newDd = dd.clone().removeClass().addClass('bf-box j-bf-box').attr('data-newdd', matchcode).html(html);
            dd.after(newDd);
          }

          t.removeClass('has').addClass('active');

        } else {

          if (hasNewDd) {
            _this.box.find('[data-newdd=' + matchcode + ']').hide();
          }

          if (_.find(_this.match, function (chr) {
              return chr.matchcode === matchcode;
            })) {
            t.addClass('has').removeClass('active');
          } else {
            t.removeClass('active has');
          }

        }

      });

      //全包
      _this.box.on('click', '.j-bf-all', function (event) {

        var t = $(this);
        var dd = t.parents('dd');
        var i = null;
        var sp = null;
        var title = null;
        t.toggleClass(a);

        t.siblings('.j-sp-btn').each(function (index, el) {

          i = $(this).attr('index');
          sp = $(this).attr('sp');
          title = $(this).attr('data-item');

          if (t.hasClass(a)) {
            $(this).addClass(a);
            _this.addOneItem(i, dd, sp, title);
          } else {
            $(this).removeClass(a);
            _this.removeOneItem(i, dd);
          }

        });

      });

      _this.box.on('mousemove', '.j-sp-btn,.j-bf-all', function (event) {

        var t = $(this);
        var i = t.attr('index');

        if (!t.hasClass(a) && !t.hasClass('rq')) {
          t.addClass(h);
        };

      });

      _this.box.on('mouseout', '.j-sp-btn,.j-bf-all', function (event) {

        var t = $(this);
        var i = t.attr('index');

        if (!t.hasClass(a) && !t.hasClass('rq')) {
          t.removeClass(h);
        };

      });

      _this.box.on('click', '.j-sp-btn', function (event) {

        var t = $(this);
        var i = t.attr('index');
        var sp = t.attr('sp');
        var title = t.attr('data-item');
        var dd = t.parents('dd');
        var matchcode = dd.attr('matchcode')
        var allSp = true;
        var lock = true;
        var matchLen = _.uniq(_this.match, 'matchcode').length;
        var hasMatch = _.find(_this.match, function (chr) {
          return chr.matchcode === matchcode;
        });

        if (matchLen >= 15 && !hasMatch) {
          APP.showTips('您好，投注场次不得超过15场哦');
          return false;
        }

        if (t.hasClass('rq')) return;

        if (t.hasClass(a)) {
          t.siblings('.j-bf-all').removeClass(a + ' ' + h);
          t.removeClass(a);
          _this.removeOneItem(i, dd);
        } else {
          t.removeClass(h).addClass(a);
          _this.addOneItem(i, dd, sp, title);

          t.siblings('.j-sp-btn').each(function (index, el) {
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
      _this.box.on('click', '.j-dataBody-toggle', function (event) {

        var t = $(this);
        var s = t.attr('data-show');
        var dl = t.parents('dl');
        var allDd = dl.find('dd');
        var listDd = dl.find('.j-data-dd');
        var bfDd = dl.find('.j-bf-box');
        var title = ['隐藏', '展开'];

        if (s == 1) {
          allDd.hide();
          if (_this.tab === 'bf') {
            bfDd.each(function (index, el) {
              if ($(this).find('.j-sp-btn.active').length > 0) {
                var matchcode = $(this).attr('matchcode');
                var bfNearBox = dl.find('.j-data-dd[matchcode=' + matchcode + ']');
                bfNearBox.find('.j-show-bf').addClass('has');
              }
            });

          }
          t.attr('data-show', 0);
        } else {
          listDd.show();

          if (_this.tab === 'bf') {
            listDd.find('.j-show-bf').removeClass('active');
            listDd.find('.row1-1').removeClass('on');
          }
          t.attr('data-show', 1);
        }

        t.html(title[s]);

      });

    };

    bet.prototype.filterNum = function (v) {

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
    bet.prototype.bindRight = function () {

      var _this = this;

      $('.j-coutn-total').on('click', '.j-count', function (event) {

        var m = $(this).siblings('.btn-results'),
          c = $(this).attr('data-c'),
          r = m.attr('data-r');

        _this.updateCount(m, c);
        _this.setAllTotal();

      });

      $('#j-qiucksub-bei').on('keyup', function (event) {

        var t = $(this);
        var r = t.attr('data-r');
        var v = _this.filterNum(t.val());

        t.val(v);
        _this.beishu = v;
        _this.setAllTotal();

      });

      $('#j-qiucksub-bei').on('change', function (event) {

        var t = $(this);
        var r = t.attr('data-r');
        var v = _this.filterNum(t.val());
        v = v || 1;

        t.val(v);
        _this.beishu = v;
        _this.setAllTotal();

      });

      $('#poolStep2').on('click', '.jtip', function (event) {

        var t = $(this);
        var a = 'active';
        var h = null;
        var method = t.attr('data-method') || null;

        t.toggleClass(a);
        h = t.hasClass(a);
        t.attr('data-check', h);

        _this.toggleBunch(h, method);
        _this.setAllTotal();

      });

      $('#orderRule').on('click', '.icon', function (event) {
        var t = $(this);
        t.toggleClass('icon-cbox').toggleClass('icon-cgou');
        _this.isAgreen = t.hasClass('icon-cgou');
      });

      $('#j-touzhu-tips').on('click', function (event) {
        $('#j-touzhu-tipstext').toggle();
        $(this).find('.icon').toggleClass('icon-bup').toggleClass('icon-bdown');
      });

      $('#j-btn-clear').on('click', function (event) {
        _this.clearBetData();
      });

      // BetList Button remvoe match
      $('#selectGamePool').on('click', '.betList a', function (event) {

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

        _.remove(_this.match, function (o) {
          return (o.index == i && o.matchcode == code);
        });

        if (_this.match == 0) $('#poolStep1 .unSeleTips').show();
        _this.setSecondBox();
        _this.setAllTotal();

        if (_this.tab === 'bf') {
          actItem.siblings('.j-bf-all').removeClass('active hover');
          if (_.filter(_this.match, function (chr) {
              return chr.matchcode === code;
            }).length === 0) {
            $('#bettingBox dd[matchcode=' + code + '] .j-show-bf').removeClass('has');
          }
        }

      });

      $('#selectGamePool').on('click', '.j-del-all', function (event) {

        var code = $(this).parents('tr').attr('matchcode');
        var removeItem = $('#selectGamePool tr[matchcode=' + code + ']');
        var actItem = $('#bettingBox dd[matchcode=' + code + ']').find('.j-sp-btn.active,.j-bf-all');

        removeItem.remove();
        actItem.removeClass('active hover');

        $('#bettingBox dd[matchcode=' + code + ']').find('.j-show-bf').removeClass('has');
        _.remove(_this.match, function (o) {
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