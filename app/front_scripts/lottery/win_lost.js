require.config({
  paths: {
    jquery: '../lib/jquery',
    lodash: '../lib/lodash.compat.min',
    bootstrap: '../lib/bootstrap.min',
    store: '../lib/store.min',
    app: '../common/app',
    core: '../lib/core'
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    }
  }
});

require(['jquery', 'lodash', 'app', 'store', 'bootstrap', 'core'], function ($, _, APP, store) {
  'use strict';

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
      lotyCNName:'胜负彩'
    };

    winlost.prototype.init = function () {

      this.bindEvent();
    };

    winlost.prototype.getCodes = function (matchs, items) {

      var f = null;
      var result = '';
      var arr = [];
      var rArr = [];
      var indexMap = [3,1,0];

      for (var i = 0; i < matchs.length; i++) {

        arr = [];
        f = items[matchs[i]];

        for (var j = 0; j < f.length; j++) {

          arr.push(indexMap[f[j].index]);
        };

        rArr.push(arr.join(','));
      };

      result = rArr.join('|');

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
        matchKeys: matchs.join(','),
        content: content,
      };

      return obj;

    };

    winlost.prototype.bindEvent = function () {

      var wlConfig = this;

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

      $('.j-data-dl .co7,.j-data-dl .co8,.j-data-dl .co9').click(function (event) {
        var mLsContent1HTML = '',
          mLsContent2HTML = '',
          i = 0;
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
        if (wlConfig.uniqMatch.length == 14) {
          wlConfig.zhus = wlConfig.getTotalZhus();
          wlConfig.money = wlConfig.zhus * 2;
          $('.j-gameZhu').text(wlConfig.zhus);
          $('#j-totalMoney').text(wlConfig.money);
        } else if (wlConfig.uniqMatch.length < 14) {
          wlConfig.zhus = 0;
          wlConfig.money = 0;
          $('.j-gameZhu').text(wlConfig.zhus);
          $('#j-totalMoney').text(wlConfig.money);
        }

        $('.j-data-dl dd').each(function (index, el) {
          var _this = $(this);
          var co7Obj = _this.find('.co7');
          var co8Obj = _this.find('.co8');
          var co9Obj = _this.find('.co9');
          var co7isActive = co7Obj.hasClass('active');
          var co8isActive = co8Obj.hasClass('active');
          var co9isActive = co9Obj.hasClass('active');
          var co7Val = '',
            co8Val = '',
            co9Val = '';
          if (co7isActive) {
            co7Val = co7Obj.text();
          }
          if (co8isActive) {
            co8Val = co8Obj.text();
          }
          if (co9isActive) {
            co9Val = co9Obj.text();
          }
          if (co7isActive || co8isActive || co9isActive) {
            i++;
          }
          if (index < 7) {
            mLsContent1HTML += '<li class="t2">' + co7Val + co8Val + co9Val + '</li>';
          }
          if (index >= 7) {
            mLsContent2HTML += '<li class="t2">' + co7Val + co8Val + co9Val + '</li>';
          }

        });
        mLsContent1HTML = '<li class="t1">投注</li>' + mLsContent1HTML;
        mLsContent2HTML = '<li class="t1">投注</li>' + mLsContent2HTML;

        $('.j-m-lscontent1').html('');
        $('.j-m-lscontent1').html(mLsContent1HTML);
        $('.j-m-lscontent2').html('');
        $('.j-m-lscontent2').html(mLsContent2HTML);
        $('.j-gameNumber').text(i);
        wlConfig.updateMoney();

      });

      $('#j-btn-clear').click(function (event) {
        $('.dataBody').find('span').removeClass('active');
        $('.j-m-lscontent1').html('<li class="t1">投注</li>');
        $('.j-m-lscontent2').html('<li class="t1">投注</li>');
        wlConfig.match = [];
        wlConfig.group = null;
        wlConfig.zhus = 0;
        wlConfig.money = 0;
        wlConfig.beishu = 1;
        $('.j-gameNumber').text('0');
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

      function craeteTzTable() {

        var tmpHtml1 = '<table class="touzhu-table"><tr class="grey-bg"><td>场次</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td></tr><tr class="h-100"><td>主队</td>';

        var tmpHtml2 = '</tr><tr class="grey-bg"><td colspan="15" class="fc-3d">VS</td></tr><tr class="h-100"><td>客队</td>';

        var tmpHtml3 = '</tr><tr class="grey-bg"><td>投注</td>';

        var tmpHtml4 = '</tr></table>';

        var tzHtml = '';
        var zdHtml = '';
        var kdHtml = '';
        var arr = [];
        var result = '';

        $('.j-data-dl dd').each(function (index, el) {

          var _this = $(this);
          var matchcode = $(this).attr('matchcode');

          zdHtml += '<td class="fc-3d">' + _this.find('.j-maind').text() + '</td>';
          kdHtml += '<td class="fc-3d">' + _this.find('.j-ked').text() + '</td>';

          arr = _.map(wlConfig.group[matchcode], function (g) {
            var indexMap = [3, 1, 0];
            return indexMap[g.index];
          });

          tzHtml += '<td class="fc-3d">' + arr.join(' ') + '</td>';

        });

        result = tmpHtml1 + zdHtml + tmpHtml2 + kdHtml + tmpHtml3 + tzHtml + tmpHtml4;
        return result;

      }

      $('#j-ljtzBtn').on('click', function (event) {

        if (wlConfig.uniqMatch.length < 14) {
          APP.showTips('请对14场比赛的赛过进行竞猜，每场比赛至少竞猜一个赛果');
          return;
        }
        var params = wlConfig.getSubmitParams();
        var confirmHtml = '<div class="ljtz-info"><p>投注金额：总计<strong class="fc-3"> ' + wlConfig.money + ' </strong>元，共<strong> ' + wlConfig.zhus + ' </strong>注，投注<strong> ' + wlConfig.beishu + ' </strong>倍</p></div>';

        var tableHtml = '';

        tableHtml = craeteTzTable();

        wlConfig.payMoney = wlConfig.money;

        wlConfig.buyLoty(function () {

          // 购买操作函数
          APP.showTips({
            type: 2,
            text: tableHtml + confirmHtml,
            title: '投注信息确认',
            className: 'touzhuinfo-modal',
            onConfirm: function () {
              alert(1);
            }
          });

        }, params);

      });

      $('#j-hemai').on('click', function (event) {
        event.preventDefault();

        var obj = BET.getSubmitParams();
        var type = 'buy-together';

        obj.shareNum = $('#ballModal .j-share-num').val();
        obj.buyNum = Number($('#ballModal .j-rengou').val());
        obj.aegisNum = Number($('#ballModal .j-baodi-text').val());

        obj.tichengPercent = $('#ipt_extraPercent').val();
        obj.shareLevel = $('#ballModal .br-set.active').attr('data-set');
        obj.projectTitle = $('#ballModal .j-project-title').val();
        obj.projectText = $('#ballModal .br-textarea').val();

        Config.payMoney = obj.zhushu * 2 * obj.beishu / obj.shareNum * (obj.buyNum + obj.aegisNum);

        buy(function () {

          $('#hemaiModal').modal('hide');

        }, params, true);

      });

      $('#j-fqhmBtn').on('click', function (event) {

        if (wlConfig.uniqMatch.length < 14) {
          APP.showTips('请对14场比赛的赛过进行竞猜，每场比赛至少竞猜一个赛果');
          return;
        }
        var params = wlConfig.getSubmitParams();

        var confirmHtml = '<div class="fqhm-info"><p>投注金额：总计<strong class="fc-3"> ' + wlConfig.money + ' </strong>元，共<strong> ' + wlConfig.zhus + ' </strong>注，投注<strong> ' + wlConfig.beishu + ' </strong>倍</p></div>'

        var tableHtml = '';

        tableHtml = craeteTzTable();

        $('#j-modal-table').html(tableHtml);

        wlConfig.payMoney = 1;

        wlConfig.buyLoty(function () {
          $('#hemaiModal').modal('show');
          updateCreatePartProjectParame();
        }, params);

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

      lessMoneyTips += '<p>本次需支付：<span class="fc-3 mlr5">' + _this.payMoney + '.00</span>元';

      APP.checkLogin(_this.payMoney, {
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
    }

    winlost.prototype.addOneItem = function (i, dd, sp, title, dzTab) {
      var code = dd.attr('matchcode');
      this.match.push({
        index: i,
        type: dzTab,
        matchcode: code,
        sp: sp,
        title: title
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
      var ms = this.uniqMatch;
      var _this = this;
      var sum = 1;
      for (var i = 0; i < 14; i++) {
        sum = sum * _this.group[ms[i].matchcode].length;
      };
      return sum;
    };
    winlost.prototype.updateMoney = function () {
      var m = $('.j-quick-bei');
      var v = parseInt(m.val(), 10);
      this.money = this.zhus * 2 * v;
      $('#j-totalMoney').text(this.money);
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

  function updateCreatePartProjectParame() {

    // 总金额
    var totalMoney = WINLOST.money;

    // 获取份数 shareNum
    var copies = $("#share-num").val() || totalMoney;

    // 单份金额 iUnitPrice
    var oneCopiesMoney = '';

    // 认购金额
    var rengouMoney = '';

    // 认购份数
    var rengouCopies = $('#part_buy').val();

    // 认购百分比
    var rengouPercent = '';

    // 提成
    var ticheng = $('#commission_percent').val() * 1 || 0;

    // 保底金额 b-用户输入保底份数
    // 保底份数 aegisNum
    var baodiCopies = '';
    var baodiPercent = '';
    var b = parseInt($('#part_aegis_num').val()) || 0;

    // 是否保底 hasPartAegis
    var isBaodi = $('#has_part_aegis')[0].checked || false;

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

    // 认购金额必须大于提成金额
    if (ticheng > (rengouCopies / copies * 100)) {
      rengouCopies = Math.ceil(copies * ticheng * 0.01);
    }
    rengouMoney = rengouCopies * oneCopiesMoney;

    // 是否保底
    if ($('#has_part_aegis')[0]) {
      isBaodi = $('#has_part_aegis')[0].checked;
    }

    // 设置保底份数
    if (isBaodi) {

      $('#part_aegis_num')[0].disabled = false;

      if (b === 0) {

        if ((rengouCopies / copies) < 0.8) {
          baodiCopies = Math.ceil(copies * 0.2);
        } else {
          baodiCopies = copies - rengouCopies;
        }

      } else {

        if ((b + rengouCopies) < copies) {

          if ((b / copies) < 0.2) {

            if ((Math.ceil(copies * 0.2) + rengouCopies) > copies) {

              baodiCopies = copies - rengouCopies;

            } else {

              baodiCopies = Math.ceil(copies * 0.2);
            }

          } else {

            baodiCopies = b;

          }

        } else {

          baodiCopies = copies - rengouCopies;

        }

      }

      baodiPercent = (baodiCopies / copies * 100).toFixed(2);

    } else {
      $('#part_aegis_num')[0].disabled = true;
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
    $('#buy_money_tips').html(rengouCopies * oneCopiesMoney);
    $('#aegis_money_tips').html(baodiTips);
    $('#total_money_tips').html(totalTips);

  }

  /* 合买 End */

});