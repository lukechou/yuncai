define(['jquery'], function($) {
  'use strict';

  var bet = (function() {
    'use strict';

    function bet(args) {
      // enforces new
      if (!(this instanceof bet)) {
        return new bet(args);
      }
      // constructor body
    }

    bet.prototype = {
      beishu: 1,
      isAgreen: true,
      match: [],
      dd: null,
      box: $('#bettingBox'),
      tab: 'spf',
    };

    bet.prototype.init = function() {
      this.bindMain();
      this.bindRight();
      this.bindHdnav();
    };

    bet.prototype.getOtherEm = function(el, i) {
      if (el.parents().hasClass('bidCounts')) {
        return this.box.find('.even em[index="' + i + '"]');
      } else {
        return this.box.find('.even em[index="' + i + '"]');
      }
    };

    bet.prototype.addOneItem = function(i, dd) {
      var _this = this;
      var m = ['胜', '平', '负'];
      var code = dd.attr('matchcode');
      var compiled = null;
      var fill = {
        i: i,
        gametype: _this.tab,
        text: m[i],
        matchcode: code,
        matchnumcn: dd.attr('matchnumcn'),
        hostname: dd.attr('hostname'),
        guestname: dd.attr('guestname')
      };

      var hasMatch = _.find(_this.match, {
        'matchcode': code
      });

      _this.match.push({
        index: i,
        type: _this.tab,
        matchcode: code
      });

      if (hasMatch) {
        compiled = _.template('<a index="<%= i%>" gametype="<%= gametype%>" matchcode="<%= matchcode%>" href="javascript:;" class="block<%= i%>"><%= text%></a>');
        $('#selectGamePool .gameOption[matchcode=' + code + '] .betList').append(compiled(fill));
      } else {
        compiled = _.template('<tr matchcode="<%= matchcode%>" class="gameTitle"><th class="t1"><a class="icoDel" href="javascript:;"></a><%= matchnumcn%></th><th class="t2"><%= hostname%> <%= guestname%></th><th class="t3"><a href="javascript:;" class="icoDan" disabled="disabled" checked="">胆</a></th></tr><tr class="gameOption" matchcode="<%= matchcode%>"><td colspan="5" class="betList"><a index="<%= i%>" gametype="<%= gametype%>" matchcode="<%= matchcode%>" href="javascript:;" class="block<%= i%>"><%= text%></a></td></tr>');
        $('#selectGamePool tbody').append(compiled(fill));
      }
      $('#poolStep1 .scrollMoni').show();
      $('#poolStep1 .unSeleTips').hide();
      _this.setSecondBox();
      _this.setAllTotal();

    };

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

    bet.prototype.setSecondBox = function() {
      var len = $('#selectGamePool .gameTitle').length;
      var obj = {
        len: len,
      };
      var html = _.template('<li inf="至少猜中<%= len%>场可中奖" class="jtip" data-method="<%= len%>_1" data-check="false"><%= len%>串1</li>');

      if (len >= 2) {
        $('#poolErrorTips').hide();
        $('#poolStep2 .guoguanList').html(html(obj));
      } else {
        $('#poolErrorTips').show();
      }
    };

    bet.prototype.setAllTotal = function() {

    };

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

      _this.box.on('mousemove', '.towLine em', function(event) {

        var t = $(this);
        var i = t.attr('index');
        var e = _this.getOtherEm(t, i);

        if (!t.hasClass(a) && !t.hasClass('rq')) {
          t.addClass(h);
          e.addClass(h);
        };

      });

      _this.box.on('mouseout', '.towLine em', function(event) {

        var t = $(this);
        var i = t.attr('index');
        var e = _this.getOtherEm(t, i);

        if (!t.hasClass(a) && !t.hasClass('rq')) {
          t.removeClass(h);
          e.removeClass(h);
        };

      });

      _this.box.on('click', '.towLine em', function(event) {
        var t = $(this);
        var i = t.attr('index');
        var gametype = t.attr('gametype');
        var e = _this.getOtherEm(t, i);
        var dd = t.parents('dd');

        if (t.hasClass('rq')) return;
        if (t.hasClass(a)) {
          t.removeClass();
          e.removeClass();
          _this.removeOneItem(i, dd);
        } else {
          t.addClass(a);
          e.addClass(a);
          _this.addOneItem(i, dd);
        }

      });

      // Toggle Buy Type
      $('#j-vote-nav').on('click', 'a', function(event) {
        var type = $(this).attr('data-type');
        _this.box.removeClass('onlySpf onlyRqSpf').addClass(type);
        t.tab = (type == 'onlySpf') ? 'spf' : 'rfspf';
      });

      //  Buy Main Toggle
      _this.box.on('click', '.j-dataBody-toggle', function(event) {
        $(this).parents('dl').find('dd').toggle();
      });

    };

    bet.prototype.bindRight = function() {

      var _this = this;

      $('.j-coutn-total').on('click', '.j-count', function(event) {
        var m = $(this).siblings('.btn-results'),
          c = $(this).attr('data-c'),
          r = m.attr('data-r');
        _this.updateCount(m, c);
        _this.setAllTotal();
      });

      $('.btn-results').on('keyup', function(event) {
        var t = $(this);
        var r = t.attr('data-r');
        var v = _this.filterNum(t.val());
        t.val(v);
        _this.beishu = v;
        _this.setAllTotal();
      });

      $('#poolStep2').on('click', '.jtip', function(event) {
        var t = $(this);
        var a = 'active';
        t.toggleClass(a);
        t.attr('data-check', t.hasClass(a));
      });

      $('#orderRule').on('click', '.icon', function(event) {
        var t = $(this);
        t.toggleClass('icon-cbox').toggleClass('icon-cgou');
        _this.isAgreen = t.hasClass('icon-cgou');
      });

      $('#j-touzhu-tips').on('click', function(event) {
        $('#j-touzhu-tipstext').toggle();
        $(this).find('.icon').toggleClass('icon-bup').toggleClass('icon-bdown');
      });

    };

    bet.prototype.bindHdnav = function() {
      $('#choseCai').hover(function() {
        toggleMask($(this));
      }, function() {
        toggleMask($(this));
      });

      function toggleMask(m) {
        m.find('#hdMask').toggle();
        m.find('a').toggleClass('on');
      }
    };

    bet.prototype.updateCount = function(m, c) {
      var v = parseInt(m.val(), 10);
      if (c == 1) {
        v++;
      } else {
        v--;
      }
      v = (v >= 1) ? v : 1;
      this.beishu = v;
      m.val(v);
    };

    bet.prototype.filterNum = function(v) {
      var n = parseInt(v, 10);

      if (isNaN(n)) {
        n = 1;
      } else {
        n = (n >= 1) ? n : 1;
        n = n;
      }
      return n;
    };

    return bet;

  }());

  var b = new bet();

  Object.observe(b, function(changes) {

    // 这个异步毁掉函数将会运行
    changes.forEach(function(change) {

      // 让我们获知变化
      console.log(change.type, change.name, change.oldValue);
    });

  });

  return b;
});