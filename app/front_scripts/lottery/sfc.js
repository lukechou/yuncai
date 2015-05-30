require.config({
  paths: {
    jquery: '../lib/jquery',
    lodash: '../lib/lodash.compat.min',
    bootstrap: '../lib/bootstrap.min',
    store: '../lib/store.min',
    app: '../common/app',
    core: '../lib/core',
    tipsy: '../lib/jquery.tipsy',
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    },
    tipsy: {
      deps: ['jquery'],
      exports: 'jquery'
    },
  }
});

require(['jquery', 'lodash', 'app', 'store', 'bootstrap', 'core', 'tipsy'], function ($, _, APP, store) {
  'use strict';

  $('.j-icon').tipsy({
    gravity: 'nw',
    html: true,
    opacity: 1
  });

  var winlost = (function () {

    function winlost(args) {
      if (!(this instanceof winlost)) {
        return new winlost(args);
      }
    }

    winlost.prototype = {
      isAgreen: true,
      match: [],
      group: null,
      zhus: 0,
      money: 0,
      beishu: 1,
      uniqMatch: [],
      payMoney: 0,
      lotyCNName: Config.lotyCNName,
      indexMap: [3, 1, 0],
      data: null,
      qihao: $('#j-qihao').val(),
      qihaoId: $('#j-qihao-id').val()
    };

    winlost.prototype.init = function () {

      var _this = this;
      var f = null;

      _this.data = [];

      for (var prop in Config.MatchData) {
        if (Config.MatchData.hasOwnProperty(prop)) {
          f = Config.MatchData[prop];
          if (f && _.isArray(f) && f.length) {
            _this.data = _this.data.concat(f);
          }
        }
      }

      if (Config.serverTime == 1) {

        APP.showStopSellModal(Config.lotyCNName);
        $('#j-ljtzBtn,#j-fqhmBtn').addClass('btn-stop').html('暂停销售');
        $('#j-ljtzBtn').attr('id', '');
        $('#j-fqhmBtn').remove();
        $('#j-data-body .data-loadbox').html(Config.lotyCNName + ' 暂停销售');

      } else {
        _this.createTable();

        _this.bindEvent();
      }
    };

    winlost.prototype.createTable = function () {

      var _this = this;
      var html = '';
      var d = _this.data;
      var item = null;
      var spArr = [];

      html += '<dl class="j-data-dl">';

      d.sort(function (a, b) {
        return Number(a.game_order) - Number(b.game_order);
      });

      for (var i = 0; i < d.length; i++) {

        item = d[i];
        spArr = ['-', '-', '-'];

        if (item.spf_gg_sp && _.isString(item.spf_gg_sp)) {
          spArr = item.spf_gg_sp.split('|');
        }

        html += '<dd matchcode="' + item.matchcode + '" data-mindex="' + i + '">';
        html += '<span class="co1">' + (i + 1) + '</span>';
        html += '<span class="co2">' + item.league + '</span>';
        html += '<span class="co3">' + item.game_start_time + '</span>';
        html += '<span class="co4"><strong class="hostTeam">' + item.home + '</strong>  <strong class="guestTeam">' + item.away + '</strong></span>';
        html += '<span class="co7 sp-btn j-sp-btn" index="0" data-item="胜" gametype="spf" sp="' + spArr[0] + '">' + spArr[0] + '</span>';
        html += '<span class="co8 sp-btn j-sp-btn" index="1" data-item="平" gametype="spf" sp="' + spArr[1] + '">' + spArr[1] + '</span>';
        html += '<span class="co9 sp-btn j-sp-btn" index="2" data-item="负" gametype="spf" sp="' + spArr[2] + '">' + spArr[2] + '</span>';
        html += '</dd>';

      };

      html += '</dl>';

      $('#j-data-body').html(html);

    };

    winlost.prototype.getCodes = function (matchs, items) {

      var _this = this;
      var result = '';
      var arr = [];
      var rArr = [];
      var k = null;
      var m = null;
      var f = null;

      for (var i = 0; i < _this.data.length; i++) {

        arr = [];
        k = _this.data[i];
        m = k.matchcode;

        f = _this.group[m];

        if (f && f.length) {

          for (var j = 0; j < f.length; j++) {
            arr.push(_this.indexMap[f[j].index]);
          };

          rArr.push(arr.join(','));

        } else {

          rArr.push('^');

        }

      };

      result = rArr.join('/');

      return result;
    };

    /**
     *  提交表单,获取要提交的参数
     * @return {object}
     */
    winlost.prototype.getSubmitParams = function () {

      var _this = this;
      var obj = null;
      var matchs = [];
      var content = null;
      var uniqMatch = null;

      // get Params
      uniqMatch = _this.group;
      for (var prop in uniqMatch) {
        if (uniqMatch.hasOwnProperty(prop)) {
          matchs.push(prop);
        }
      }

      content = _this.getCodes(matchs, uniqMatch);

      obj = {
        zhushu: _this.zhus,
        beishu: _this.beishu,
        content: content,
        qihao: _this.qihao,
        qihaoId: _this.qihaoId,
        unikey: $.now()
      };

      return obj;

    };

    winlost.prototype.getChooseGroupCode = function (group) {

      var _this = this;
      var r = '';

      for (var i = 0; i < group.length; i++) {
        r += _this.indexMap[group[i].index];
      };

      return r;
    };

    winlost.prototype.updateChooseDetail = function () {

      var _this = this;
      var matchs = _this.group;
      var mLsContent1HTML = '';
      var mLsContent2HTML = '';
      var matchCount = 0;
      var d = _this.data;
      var midIndex = 7;
      var item = null;
      var lastIndex = '';

      mLsContent1HTML = '<li class="t1">投注</li>';
      mLsContent2HTML = '<li class="t1">投注</li>';

      // 遍历所有对阵
      for (var i = 0, len = d.length; i < len; i++) {

        item = d[i];

        if(i === (len - 1) || i ===6){
          lastIndex = 'last';
        }else{
          lastIndex = '';
        }

        if (i < midIndex) {

          if (matchs[item.matchcode]) {
            matchCount++;
            mLsContent1HTML += '<li class="t2 ' + lastIndex + '">' + _this.getChooseGroupCode(matchs[item.matchcode]) + '</li>';

          } else {

            mLsContent1HTML += '<li class="t2 ' + lastIndex + '"></li>';

          }

        } else {

          if (matchs[item.matchcode]) {
            matchCount++;
            mLsContent2HTML += '<li class="t2 ' + lastIndex + '">' + _this.getChooseGroupCode(matchs[item.matchcode]) + '</li>';
          } else {
            mLsContent2HTML += '<li class="t2 ' + lastIndex + '"></li>';
          }

        }

      };

      $('#j-m-lscontent1').html(mLsContent1HTML);
      $('#j-m-lscontent2').html(mLsContent2HTML);
      $('.j-gameNumber').text(matchCount);

    };

    winlost.prototype.craeteTzTable = function () {

      var _this = this;

      var tzHtml = '';
      var zdHtml = '';
      var kdHtml = '';
      var arr = [];
      var result = '';
      var matchcode = null;
      var item = null;
      var h = '';
      var a = '';
      var tmpHtml1 = '<table class="touzhu-table"><tr class="grey-bg"><td>场次</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td></tr><tr class="h-100"><td>主队</td>';

      var tmpHtml2 = '</tr><tr class="grey-bg"><td colspan="15" class="fc-3d">VS</td></tr><tr class="h-100"><td>客队</td>';

      var tmpHtml3 = '</tr><tr class="grey-bg"><td>投注</td>';

      var tmpHtml4 = '</tr></table>';

      for (var i = 0; i < _this.data.length; i++) {

        item = _this.data[i];
        matchcode = item.matchcode;

        h = item.home.replace(/\s/g, '');
        a = item.away.replace(/\s/g, '');

        zdHtml += '<td class="fc-3d">' + h + '</td>';
        kdHtml += '<td class="fc-3d">' + a + '</td>';

        arr = _.map(_this.group[matchcode], function (g) {
          return _this.indexMap[g.index];
        });

        tzHtml += '<td class="fc-3d">' + arr.join(' ') + '</td>';

      };

      result = tmpHtml1 + zdHtml + tmpHtml2 + kdHtml + tmpHtml3 + tzHtml + tmpHtml4;

      return result;
    };

    winlost.prototype.checkStatus = function () {

      var _this = this;

      var result = {
        statu: true,
        info: '',
      };

      if (!$('#j-agreen').hasClass('icon-cgou')) {
        result.statu = false;
        result.info = '请先阅读并同意《委托投注规则》后才能继续';

      } else if (_this.uniqMatch.length < Config.matchsTotal) {
        result.statu = false;
        result.info = '请对' + Config.matchsTotal + '场比赛的赛果进行竞猜，每场比赛至少竞猜一个赛果';
      } else if (_this.zhus > 10000) {
        result.statu = false;
        result.info = '方案注数已超过<span class="fc-3 mlr-8">10000</span>注<br/><p class="fs-12">理性购彩,可适当减少投注</p>';
      }

      return result;

    };

    winlost.prototype.bindEvent = function () {

      var wlConfig = this;

      $('#j-data-body').on('click', '.j-sp-btn', function (event) {
        event.preventDefault();

        var _this = $(this);
        var index = _this.attr('index');
        var sp = _this.attr('sp');
        var title = _this.attr('data-item');
        var dzTab = _this.attr('gametype');
        var dd = _this.parents('dd');

        _this.toggleClass('active');

        if (_this.hasClass('active')) {

          wlConfig.addOneItem(index, dd, sp, title, dzTab);

        } else {

          wlConfig.removeOneItem(index, dd);

        }

        wlConfig.group = _.groupBy(wlConfig.match, function (match) {

          return match.matchcode;

        });

        wlConfig.uniqMatch = _.uniq(wlConfig.match, 'matchcode');

        if (wlConfig.uniqMatch.length >= Config.matchsTotal) {

          wlConfig.zhus = wlConfig.getTotalZhus();
          wlConfig.money = wlConfig.zhus * 2;

          $('.j-gameZhu').text(wlConfig.zhus);
          $('#j-totalMoney').text(wlConfig.money);

        } else if (wlConfig.uniqMatch.length < Config.matchsTotal) {

          wlConfig.zhus = 0;
          wlConfig.money = 0;

          $('.j-gameZhu').text(wlConfig.zhus);
          $('#j-totalMoney').text(wlConfig.money);

        }

        wlConfig.updateChooseDetail();

        wlConfig.updateMoney();

        // 无数据不要左侧格子
        if(!wlConfig.match.length){
          $('#j-m-lscontent1').html('<li class="t1">投注</li>');
        $('#j-m-lscontent2').html('<li class="t1">投注</li>');
        }

      });

      $('#j-btn-clear').click(function (event) {

        $('.dataBody').find('span').removeClass('active');
        $('#j-m-lscontent1').html('<li class="t1">投注</li>');
        $('#j-m-lscontent2').html('<li class="t1">投注</li>');

        wlConfig.match = [];
        wlConfig.uniqMatch = [];
        wlConfig.group = null;
        wlConfig.zhus = 0;
        wlConfig.money = 0;
        wlConfig.beishu = 1;

        $('.j-gameNumber').text(0);
        $('.j-gameZhu').text(wlConfig.zhus);
        $('.j-quick-bei').val(wlConfig.beishu);
        $('#j-totalMoney').text(wlConfig.money);
      });

      $('.j-coutn-total').on('click', '.j-count', function (event) {

        var m = $(this).siblings('.btn-results'),
          c = $(this).attr('data-c'),
          r = m.attr('data-r');

        wlConfig.updateCount(m, c);
        wlConfig.updateMoney();
      });
      $('#orderRule').on('click', '.icon', function (event) {
        var t = $(this);
        t.toggleClass('icon-cbox').toggleClass('icon-cgou');
        wlConfig.isAgreen = t.hasClass('icon-cgou');
      });

      $('.j-quick-bei').on('change', function (event) {

        var v = $(this).val();

        if (!v) {
          v = 1;
          $(this).val(1);
        }
        var result = wlConfig.filterNum(v, 99999);

        $(this).val(result);
        wlConfig.beishu = result;
        wlConfig.updateMoney();

      });

      $('.j-quick-bei').on('keyup', function (event) {
        var v = $(this).val();
        var result = wlConfig.filterNum(v, 99999);
        $(this).val(result);
        wlConfig.updateMoney();
      });

      $('#j-ljtzBtn').on('click', function (event) {

        var r = wlConfig.checkStatus();

        if (!r.statu) {
          APP.showTips(r.info);
          return;
        }

        var params = wlConfig.getSubmitParams();
        var confirmHtml = '<div class="ljtz-info"><p>投注金额：总计<strong class="fc-3"> ' + wlConfig.money + ' </strong>元，共<strong> ' + wlConfig.zhus + ' </strong>注，投注<strong> ' + wlConfig.beishu + ' </strong>倍</p></div>';

        var tableHtml = '';

        tableHtml = wlConfig.craeteTzTable();

        Config.payMoney = wlConfig.money;

        wlConfig.buyLoty(function () {

          // 购买操作函数
          APP.showTips({
            type: 2,
            text: tableHtml + confirmHtml,
            title: '投注信息确认',
            className: 'touzhuinfo-modal',
            onConfirm: function () {
              wlConfig.buy(params);
            }
          });

        }, params);

      });

      $('#j-hemai').on('click', function (event) {
        event.preventDefault();

        var params = wlConfig.getSubmitParams();

        params.shareNum = $('#share-num').val();
        params.buyNum = Number($('#part_buy').val());
        params.aegisNum = Number($('#part_aegis_num').val());

        params.tichengPercent = $('#commission_percent').val();
        params.shareLevel = $('#hemaiModal .br-set.active').attr('data-set');
        params.projectTitle = $('#title').val();
        params.projectText = $('#desc').val();

        Config.payMoney = params.zhushu * 2 * params.beishu / params.shareNum * (params.buyNum + params.aegisNum);;
        wlConfig.buyLoty(function () {

          wlConfig.buy(params, true);
          $('#hemaiModal').modal('hide');

        }, params, true);

      });

      $('#j-fqhmBtn').on('click', function (event) {

        var r = wlConfig.checkStatus();
        if (!r.statu) {
          APP.showTips(r.info);
          return;
        }

        var params = wlConfig.getSubmitParams();

        var confirmHtml = '<div class="fqhm-info"><p>投注金额：总计<strong class="fc-3"> ' + wlConfig.money + ' </strong>元，共<strong> ' + wlConfig.zhus + ' </strong>注，投注<strong> ' + wlConfig.beishu + ' </strong>倍</p></div>'

        var tableHtml = '';

        tableHtml = wlConfig.craeteTzTable();

        $('#j-modal-table').html(tableHtml);

        wlConfig.payMoney = 1;
        Config.payMoney = 1;

        wlConfig.buyLoty(function () {

          $('#share-num').val(wlConfig.money);
          $('#hemaiModal').modal('show');
          updateCreatePartProjectParame();

        }, params);

      });

    };

    winlost.prototype.buy = function (params, isHemai) {

      var _this = this;
      var type = 'buy-self';
      var url = '';

      if (isHemai) {
        type = 'buy-together';
      }

      url = '/lottery/football/' + type + '/' + Config.lotyName;
      $.ajax({
          url: url,
          type: 'post',
          dataType: 'json',
          data: params,
        })
        .done(function (data) {
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
        .fail(function () {
          APP.onServiceFail();
        });
    };

    winlost.prototype.buyLoty = function (cb, params, isHemai) {

      var _this = this;
      var lessMoneyTips = '';
      lessMoneyTips += '<p>' + _this.lotyCNName + '</p>';

      if (isHemai) {

        lessMoneyTips += '<p>方案总金额<span class="fc-3 mlr5">' + params.zhushu * params.beishu * 2 + '.00</span>元</p>';
        lessMoneyTips += '<p>您认购<span class="fc-3 mlr5">' + params.buyNum + '</span>份, 保底<span class="fc-3 mlr5">' + params.aegisNum + '</span>份</p>';

      } else {
        lessMoneyTips += '<p>共<span class="fc-3 mlr5">' + params.zhushu + '</span>注，<span class="fc-3 mlr5">' + params.beishu + '</span>倍';

      }

      lessMoneyTips += '<p>本次需支付：<span class="fc-3 mlr5">' + Config.payMoney + '.00</span>元';

      APP.checkLogin(Config.payMoney, {
        enoughMoney: cb,
        lessMoneyTips: lessMoneyTips
      });

    };

    winlost.prototype.updateCount = function (m, c) {
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

    winlost.prototype.filterNum = function (v, max) {
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
      n = n > max ? max : n;
      return n;
    };

    winlost.prototype.addOneItem = function (i, dd, sp, title, dzTab) {

      var _this = this;
      var code = dd.attr('matchcode');
      var matchIndex = Number(dd.attr('data-mindex'));

      _this.match.push({
        index: i,
        type: dzTab,
        matchcode: code,
        sp: sp,
        title: title,
        matchIndex: matchIndex
      });

      _this.match = _.sortBy(_this.match, function (r) {
        return r.index;
      });

    };

    winlost.prototype.removeOneItem = function (i, dd) {

      var _this = this;
      var code = dd.attr('matchcode');

      _.remove(_this.match, function (o) {
        return (o.index == i && o.matchcode == code);
      });

    };

    winlost.prototype.getTotalZhus = function () {

      var _this = this;
      var result = 0;
      var n = 1;
      var groupArr = [];

      for (var prop in _this.group) {
        if (_this.group.hasOwnProperty(prop)) {
          groupArr.push(_this.group[prop]);
        }
      }

      var allCombine = YC.Unit.explodeCombined(groupArr, Config.matchsTotal);

      for (var i = allCombine.length - 1; i >= 0; i--) {

        n = 1;

        for (var j = allCombine[i].length - 1; j >= 0; j--) {
          n *= allCombine[i][j].length;
        };

        result += n;
      };

      return result;

    };

    winlost.prototype.updateMoney = function () {

      var _this = this;
      var m = $('.j-quick-bei').val();
      var v = parseInt(m, 10);

      if (!m || isNaN(v)) {
        v = 1;
      }

      _this.money = _this.zhus * 2 * v;
      _this.beishu = v;

      $('#j-totalMoney').text(_this.money);

    };

    return winlost;

  }());

  var WINLOST = new winlost();
  WINLOST.init();

  /* 合买 */

  // 我要分成多少份，最少一份，最多购买金额的数量
  $("#share-num").on('change', function (event) {
    updateCreatePartProjectParame();
  });

  // 我要认购的份数
  $("#part_buy").on('change', function (event) {
    updateCreatePartProjectParame();
  });

  // 我要提成比例
  $('#commission_percent').on('change', function (event) {

    var val = parseInt($(this).val()) || 0;

    var rengouPercent = Math.floor($('#part_buy_percent').html());

    if (val > rengouPercent) {

      $("#part_buy").val(Math.ceil($("#commission_percent").val() / 100 * ($('#share-num').val() || 0)));

      updateCreatePartProjectParame();

    }

  });

  // 是否保底
  $('#has_part_aegis').on('change', function (event) {

    if ($(this)[0].checked) {

      $('#part_aegis_num').removeAttr('disabled');

    } else {

      $('#part_aegis_num').attr('disabled', 'disabled');
      $('#part_aegis_num').val(0);
      $('#part_aegis_percent').html('0.00');

    }

    updateCreatePartProjectParame();

  });

  // 保底金额修改
  $('#part_aegis_num').on('change', function (event) {

    updateCreatePartProjectParame();

  });

  // 方案保密设置
  $('.br-set-group').on('click', 'a', function (event) {

    $(this).parents('.br-set-group').find('a').removeClass('active');

    $(this).toggleClass('active');

  });

  $('.j-input-place').on('focus', function (event) {
    inputOnfocus($(this));
  });

  $('.j-input-place').on('blur', function (event) {
    inputOnblur($(this));
  });

  $('.j-input-place').on('keyup', function (event) {
    reSetStrsize($(this));
  });

  $('#is_end_zhongjiang').on('change', function (event) {

    if ($(this)[0].checked) {

      $('#track_stop_money').removeAttr('disabled');

    } else {

      $('#track_stop_money').attr('disabled', 'disabled');
      $('#part_aegis_num').val(0);

    }

  });

  function inputOnfocus(el) {
    if ($.trim(el.val()) == el.attr('data-text')) {
      el.parents('p').find('.j-btext-total').html(0)
      el.val('')
    }
  }

  function inputOnblur(el) {
    var text = el.attr('data-text');
    if ($.trim(el.val()) == '') {
      el.val(text);
      el.parents('p').find('.j-btext-total').html(text.length)
    }
  }

  function reSetStrsize(t) {

    var len = t.val().length;
    var size = parseInt(t.attr('data-size'));

    if (len <= size) {
      t.parents('p').find('.j-btext-total').html(len)
    } else {
      t.val(t.val().slice(0, (size - 1)))
      t.parents('p').find('.j-btext-total').html(size)
    }
  }

  $('#j-full-bao').on('change', function (event) {
    event.preventDefault();
    /* Act on the event */
    updateCreatePartProjectParame();
  });

  function updateCreatePartProjectParame() {
    var totalMoney = WINLOST.money;   // 总金额
    var $shareEl = $('#share-num');   //划分份数DOM
    var $partEl = $('#part_buy');     //认购份数DOM
    var $commissionEl = $('#commission_percent');  //提成比例DOM
    var $partAegisEl = $('#part_aegis_num');  //保底分数DOM
    var $fullBaoEl = $('#j-full-bao');  //是否保底checkbox DOM


    // 获取划分份数 shareNum
    var copies = $shareEl.val() || totalMoney;

    // 单份金额 iUnitPrice
    var oneCopiesMoney = '';

    // 认购金额
    var rengouMoney = '';

    // 认购份数
    var rengouCopies = $partEl.val();

    // 认购百分比
    var rengouPercent = '';

    // 提成
    var ticheng = $commissionEl.val() * 1 || 0;

    // 保底金额 b-用户输入保底份数
    // 保底份数 aegisNum
    var baodiCopies = '';
    var baodiPercent = '';
    var b = parseInt($partAegisEl.val()) || 0;

    // 是否保底
    var isBaodi = true;
    var isFullBao = $fullBaoEl[0].checked;
    if (isFullBao) {
      $('.j-baodi-text').attr('readonly', true);
    } else {
      $('.j-baodi-text').removeAttr('readonly');
    }

    copies = Number(copies.replace(/[^0-9]/g, ''));
    rengouCopies = Number(rengouCopies.replace(/[^0-9]/g, ''));

    // 无购买总金额
    if (totalMoney <= 0) {
      updatePartView(0, ticheng, 0, 0, 0, 0, 0);
      return;
    }

    // 生成对应份数
    if (totalMoney % copies === 0) {
      oneCopiesMoney = totalMoney / copies;
    } else {
      oneCopiesMoney = 1;
      copies = totalMoney;
    }

    // 认购份数小于0 或大于总份数时
    if (rengouCopies <= 0) {
      rengouCopies = 1;
    }

    if (copies < rengouCopies) {
      rengouCopies = copies;
    }

    if (rengouCopies / copies < .05) {
      rengouCopies = Math.ceil(copies * .05);
    }

    // 认购金额必须大于提成金额
    if (ticheng > (rengouCopies / copies * 100)) {
      rengouCopies = Math.ceil(copies * ticheng * 0.01);
    }
    rengouMoney = rengouCopies * oneCopiesMoney;

    // 设置保底份数
    if (isBaodi) {

      $partAegisEl[0].disabled = false;

      if ((b + rengouCopies) < copies) {

        baodiCopies = b;

      } else {

        baodiCopies = copies - rengouCopies;

      }

      if (isFullBao) {
        baodiCopies = copies - rengouCopies;
      }

      baodiPercent = (baodiCopies / copies * 100).toFixed(2);

    } else {
      $partAegisEl[0].disabled = true;
      baodiCopies = 0;
      baodiPercent = '0.00';
    }

    if (totalMoney === 0) {
      rengouPercent = 0;
    } else {
      rengouPercent = (rengouCopies / copies * 100).toFixed(2);
    }

    updatePartView(copies, oneCopiesMoney, rengouCopies, ticheng, rengouPercent, baodiPercent, baodiCopies);
    return;

  }

  function updatePartView(copies, oneCopiesMoney, rengouCopies, ticheng, rengouPercent, baodiPercent, baodiCopies) {

    var gBuy = {};
    var baodiTips = baodiCopies * oneCopiesMoney || 0;
    var totalTips = (rengouCopies + baodiCopies) * oneCopiesMoney || 0;
    if (copies === 0) {
      oneCopiesMoney = 0;
    }

    // update partnerBuy
    // 分成多少份,购买的份数,单份金额,提成比例,保底份数
    gBuy.shareNum = copies;
    gBuy.partBuyNum = rengouCopies;
    gBuy.unitPrice = oneCopiesMoney;
    gBuy.commissionPercent = parseInt($('#commission_percent').val());
    gBuy.partAegisNum = baodiCopies;

    // 分成多少份,每份金额,认购份数,提成百分比,认购百分比
    $('#share-num').val(copies);
    $('.j-unit-price').html(oneCopiesMoney);
    $('#part_buy').val(rengouCopies);
    $('#part_buy_percent').html(rengouPercent);

    // 保底份数,保底百分比,认购,保底金额tips,共需支付金额tips
    $('#part_aegis_num').val(baodiCopies);
    $('#part_aegis_percent').html(baodiPercent);
    $('.j-baodi-percent').html(baodiPercent);
    $('#buy_money_tips').html(rengouCopies * oneCopiesMoney);
    $('#aegis_money_tips').html(baodiTips);
    $('#total_money_tips').html(totalTips);

  }

  /* 合买 End */

  $('#j-touzhu-tips').on('click', function (event) {

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

});