define(['jquery'], function ($) {
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
      dd: null,
      maxBonus: null,
      box: $('#bettingBox'),
      tab: 'spf',
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

    bet.prototype.addOneItem = function (i, dd, sp) {
      var _this = this;
      var m = ['胜', '平', '负'];
      var code = dd.attr('matchcode');
      var compiled = _.template('<tr matchcode="<%= matchcode%>" class="gameTitle"><th class="t1"><a class="icoDel" href="javascript:;">&times;</a><%= matchnumcn%></th><th class="t2"><%= hostname%> <%= guestname%></th></tr><tr class="gameOption" matchcode="<%= matchcode%>"><td colspan="5" class="betList"><a index="<%= i%>" gametype="<%= gametype%>" matchcode="<%= matchcode%>" href="javascript:;" class="block<%= i%>"><%= text%></a></td></tr>');
      var oneMatchHTML = '';
      var fill = {
        i: i,
        gametype: _this.tab,
        text: m[i],
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
        sp: sp
      });

      _this.match = _this.match.sort(function (a, b) {
        return a.index - b.index;
      });

      var selectMatch = _.uniq(_this.match, function (n) {
        return n.matchcode;
      });

      selectMatch = _this.match.sort(function (a, b) {
        return a.matchcode - b.matchcode;
      });

      if (hasMatch) {
        _.each(_this.match, function (matchs) {
          if (matchs.matchcode == code) {
            linkHTML += '<a index="' + matchs.index + '" gametype="' + matchs.type + '" matchcode="' + matchs.matchcode + '" href="javascript:;" class="block' + matchs.index + '">' + m[matchs.index] + '</a>';
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
      if (len > 8) return;

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
              _tmpMaxBonus *= _.max(matchkeySp[matchs[i]]);
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
      _this.box.find('.towLine em').removeClass('active hover');

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

    /**
     *  提交表单,获取要提交的参数
     * @return {object}
     */
    bet.prototype.getSubmitParams = function () {

      var _this = this;
      var matchs = [];
      var content = [];
      var j = [3, 1, 0];
      var obj = null;
      var t = null;
      var o = {};
      var c = [];
      var m = [];
      var f = [];

      // get Params
      m = _.uniq(_this.match, 'matchcode');
      for (var i = 0; i < m.length; i++) {
        matchs.push(m[i].matchcode);
      };

      for (var i = 0; i < matchs.length; i++) {

        c = [];

        f = _.where(_this.match, {
          'matchcode': matchs[i]
        });

        for (var k = 0; k < f.length; k++) {
          c.push(j[f[k].index]);
        };

        content.push(c.join(','));
      };

      obj = {
        zhushu: _this.zhushu,
        beishu: _this.beishu,
        matchKeys: matchs.join(','),
        bunch: _this.bunch.join(','),
        content: content.join('|'),
      };

      return obj;

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

      _this.box.on('mousemove', '.towLine em', function (event) {

        var t = $(this);
        var i = t.attr('index');
        //var e = _this.getOtherEm(t, i);

        if (!t.hasClass(a) && !t.hasClass('rq')) {
          t.addClass(h);
          // e.addClass(h);
        };

      });

      _this.box.on('mouseout', '.towLine em', function (event) {

        var t = $(this);
        var i = t.attr('index');

        if (!t.hasClass(a) && !t.hasClass('rq')) {
          t.removeClass(h);
        };

      });

      _this.box.on('click', '.towLine em', function (event) {
        var t = $(this);
        var i = t.attr('index');
        var sp = t.attr('sp');
        var gametype = t.attr('gametype');
        var dd = t.parents('dd');

        if (t.hasClass('rq')) return;
        if (t.hasClass(a)) {
          t.removeClass();
          _this.removeOneItem(i, dd);
        } else {
          t.removeClass(h).addClass(a);
          _this.addOneItem(i, dd, sp);
        }

      });

      //  Buy Main Toggle
      _this.box.on('click', '.j-dataBody-toggle', function (event) {

        var t = $(this);
        var s = t.attr('data-show');
        var dd = t.parents('dl').find('dd');
        var title = ['隐藏', '展开'];

        if (s == 1) {
          dd.hide();
          t.attr('data-show', 0);
        } else {
          dd.show();
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

      $('#j-qiucksub-bei').on('change', function(event) {

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

      $('#btnclear').on('click', function (event) {
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

      });

      $('#selectGamePool').on('click', '.icoDel', function (event) {
        var code = $(this).parents('tr').attr('matchcode');
        var removeItem = $('#selectGamePool tr[matchcode=' + code + ']');
        var actItem = $('#bettingBox dd[matchcode=' + code + ']').find('em.active');

        removeItem.remove();
        actItem.removeClass('active');

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