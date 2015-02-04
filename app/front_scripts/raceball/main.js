require.config({
  paths: {
    jquery: '../lib/jquery',
    lodash: '../lib/lodash.compat.min',
    bootstrap: '../lib/bootstrap.min',
    store: '../lib/store.min',
    app: '../common/app',
    scroll: '../lib/jquery.mCustomScrollbar.concat.min',
    tipsy: '../lib/jquery.tipsy',
    betting: 'betting',
    hemai: 'hemai',
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    },
    scroll: {
      deps: ['jquery'],
      exports: 'jquery'
    },
    tipsy: {
      deps: ['jquery'],
      exports: 'jquery'
    }
  }
});

require(['jquery', 'lodash', 'betting', 'app', 'store', 'hemai', 'bootstrap', 'scroll', 'tipsy'], function ($, _, BET, APP, store, H) {
  'use strict';

  function craeteDateBtn(type, sp) {

    var h = '';
    var spArr = sp.split('|');
    var l = '';
    var tab = BET.tab;

    if (type == 1) {
      for (var i = 0, len = spArr.length; i < len; i++) {
        if (i === (len - 1)) l = 'lastOne';
        h += '<em index="' + i + '" gametype="' + tab + '" sp="' + spArr[i] + '" class="' + l + '">' + spArr[i] + '</em>';
      };

    } else {

      h = '<b class="no-support">本场对阵不支持该玩法</b>';

    }

    return h;
  }

  function createDateMain(data) {

    var arr = [];
    var line = '';
    var item = null;
    var tab = BET.tab;

    for (var i = 0; i < data.length; i++) {

      item = data[i];
      line = craeteDateBtn(item[tab], item[tab + '_gg_sp']);
      arr.push('<dd isstop="0" matchcode="' + item.match_key + '" matchnumcn="' + item.week + item.game_order + '" starttime="' + item.game_start_time + '" endtime="' + item.end_time + '" isdg="0,1,0,0,0" hostname="' + item.home_short + '" guestname="' + item.away_short + '" leaguename="' + item.league + '" class="league_36">');

      arr.push('<span class="co1"><i class="jtip" inf="' + item.week + item.game_order + '">' + item.game_order + '</i></span>');

      arr.push('<span class="co2" style="background:' + item.league_color + ';">' + item.league + '</span>');

      arr.push('<span class="co3 gameTime"><i class="jtip">' + item.end_time + '</i></span>');

      arr.push('<span class="co4"><em class="hostTeam" title="' + item.home_short + '"><b>' + item.home_short + '</b></em><em class="guestTeam" title="' + item.away_short + '"><b>' + item.away_short + '</b></em></span>');

      switch (tab) {
      case 'spf':
        arr.push('<span class="co6_1 btnBox towLine "><div class="line1 "><em class="rq">0</em>' + line + '</div></span></dd>');
        break;
      case 'rqspf':
        arr.push('<span class="co6_1 btnBox towLine "><div class="line1 "><em class="rq">' + item['rqspf_rangqiu_num'] + '</em>' + line + '</div></span></dd>');
        break;
      case 'bf':
        break;
      case 'bqc':
        break;
      case 'zjq':
        break;
      default:
        return;
        break;
      }

    };
    return arr.join('');
  }

  function createDataBody(data, d) {

    var time = APP.dateFormat(new Date(d * 1000), '%Y-%M-%d', true) + ' ' + data[0].week;
    var dataCount = data.length;

    var h = '';

    // head
    h += '<dl><dt>' + time + '<span class="cuspText fc-84 j-dataBody-toggle pull-right" data-show="1">隐藏</span>(12:00 -- 次日12:00)<span class="matchSize">' + dataCount + '</span>场比赛可投注</dt>';

    // main
    h += createDateMain(data);

    // foot
    h += '</dl>'
    return h;
  }

  function initDataBody() {

    var dataBodyHTML = '';

    for (var key in jczqData) {
      if (jczqData.hasOwnProperty(key)) {
        dataBodyHTML += createDataBody(jczqData[key], key);
      }
    }

    $('#j-data-body').html(dataBodyHTML);
  }

  initDataBody();
  gameSeleListInit();
  Config.lotyName = 'jczq';

  // Toggle Buy Type
  $('#j-vote-nav').on('click', 'a', function (event) {

    $('#j-vote-nav .active').removeClass('active');
    $(this).parents('li').addClass('active');

    var type = $(this).attr('data-type');
    var tab = $(this).attr('data-game');

    BET.tab = $(this).attr('data-game');
    BET.box.removeClass().addClass('bettingBox clearfix ' + type);
    BET.clearBetData();

    initDataBody();
  });

  $('.icon').tipsy({
    fade: true,
    gravity: 'nw',
    html: true,
    opacity: 1
  });

  var buyTicket = function (obj, type) {
    $.ajax({
        url: '/lottery/jingcai/' + type + '/jczq/' + BET.tab + '_gg',
        type: 'POST',
        dataType: 'json',
        data: obj
      })
      .done(function (data) {
        if (data.retCode == 100000) {
          store.set('lotyName', Config.lotyName);
          store.set('payMoney', Config.payMoney);
          store.set('projectNo', data.retData.projectNo);
          store.set('lotyCNName', '竞彩足球');
          window.location.href = '/html/lottery/trade/success.html';
        } else {
          APP.handRetCode(data.retCode, data.retMsg);
        }
      })
      .fail(function () {
        APP.onServiceFail();
      });
  };

  var showTipMask = function () {
    var b = $('#j-game-method');
    var top = b[0].offsetTop;
    var m = $('#tipMark');

    $('#j-no-method').show();
    m.css({
      display: 'block',
      width: b.width(),
      height: b.height(),
      top: top,
    });
    var count = 0;
    var times = function () {
      m.fadeToggle('fast', function () {});
      if (count > 5) {
        clearInterval(f);
      }
      count++
    };
    var f = setInterval(times, 100);
  };

  var checkParams = function () {
    if (_.uniq(BET.match, 'matchcode').length > 8) {
      APP.showTips('您好，投注场次不得超过8场哦');
      return false;
    }
    if (!BET.isAgreen) {
      APP.showTips('请先阅读并同意《委托投注规则》后才能继续');
      return false;
    }
    if (!BET.match.length) {
      APP.showTips('请在左侧至少选择2场比赛');
      return false;
    }
    if (!BET.bunch.length) {
      showTipMask();
      return false;
    }
    return true;
  };

  // 部分ui 下拉框
  $('#poolStep1 .scrollMoni').mCustomScrollbar({
    theme: "light-3",
    mouseWheelPixels: 200
  });

  $('#j-ball-table').mCustomScrollbar({
    theme: "light-3",
    mouseWheelPixels: 200
  });

  // 赛事筛选
  $('#showOption').hover(function () {

    $('#gameSeleList').show();

  }, function () {
    $('#gameSeleList').hide();
  });

  $('#gameSeleList').on('click', 'li', function (event) {

    var start = [];
    var isAllHide = false;

    $(this).toggleClass('active');

    $('#gameSeleList li.active').each(function (index, el) {
      start.push($.trim($(this).text()));
    });

    $('.gameSelect dd').each(function (index, el) {
      if (_.indexOf(start, $(this).attr('leaguename')) < 0) {
        $(this).hide();
      } else {
        $(this).show();
      }
    });

  });

  $('#gameSeleList').on('click', '.makeSure', function (event) {

    var start = [];

    if ($('#gameSeleList .icon').hasClass('icon-cgou')) {
      $('#gameSeleList li.active').each(function (index, el) {
        start.push($.trim($(this).text()));
      });
      $('#gameSeleList').hide();

      setToggleBtn(start);

      store.set('startArr', start);
    } else {
      store.clear('startArr');
    }

  });

  $('#gameSeleList').on('click', '.icon', function (event) {
    var t = $(this);
    t.toggleClass('icon-cbox').toggleClass('icon-cgou');
  });

  function gameSeleListInit() {
    var start = store.get('startArr');

    if (start) {
      $('#gameSeleList li').each(function (index, el) {
        if (_.indexOf(start, $.trim($(this).text())) >= 0) {
          $(this).addClass('active');
        } else {
          $(this).removeClass('active');
        }
      });

      $('.gameSelect dd').each(function (index, el) {
        if (_.indexOf(start, $(this).attr('leaguename')) < 0) {
          $(this).hide();
        } else {
          $(this).show();
        }
      });
      setToggleBtn(start);
    }

  }

  function setToggleBtn(start) {
    var t = $('.j-dataBody-toggle');
    if (start.length == 0) {
      t.html('展开').attr('data-show', 0);
    } else {
      t.html('隐藏').attr('data-show', 1);
    }
  }

  // 截止时间
  $('#j-changeTime').hover(function () {
    $(this).find('.optionList').show();
  }, function () {
    $(this).find('.optionList').hide();
  });

  $('#j-changeTime .optionList').on('click', 'a', function (event) {

    var type = $(this).attr('data-timeType');
    $('#j-changeTimeText').html($(this).html());

    $('.dataBody dd').each(function (index, el) {
      var time = $(this).attr(type);
      $(this).find('.co3 .jtip').html(time);
    });

  });

  // 合买
  $('#j-fqhmBtn').on('click', function (event) {

    var obj = BET.getSubmitParams();
    var c = null;
    var html = '';
    var bunch = obj.bunch.replace(/\_/g, '串');
    var tr = $('#selectGamePool tbody tr');
    var t = '';

    tr.each(function (index, el) {
      var e = tr.eq(index);
      if (index % 2 == 0) {
        t += '<tr><td>' + e.find('.t1').html() + '</td><td>' + e.find('.t2').html() + '</td>';
      } else {
        t += '<td>' + e.find('.betList').html() + '</td></tr>';
      }
    });

    Config.payMoney = 1;
    c = checkParams();
    if (c) {
      APP.checkLogin(Config.payMoney, {
        enoughMoney: function () {

          html = '<p><b>投注金额：</b>总计<span id="j-total-money" class="fc-3 mlr-8">' + obj.zhushu * 2 * obj.beishu + '</span>元,共<span id="j-total-zhu">' + obj.zhushu + '</span>注,投注<span id="j-total-bei">' + obj.beishu + '</span>倍</p><p><b>过关方式：</b><span id="j-total-bunch">' + bunch + '</span>,理论最高奖金<span id="j-lilu-award" class="fc-3 mlr-8">' + BET.maxBonus + '</span>元</p>';
          $('#j-tips-table').html(t);
          $('#j-modal-text').html(html);
          H.setHeMaiTotal();
          $('#ballModal').modal('show');

        }
      });
    }

  });

  // 确认合买
  $('#j-hemai').on('click', function (event) {

    var obj = BET.getSubmitParams();
    var type = 'buy-together';

    obj.rengouMoney = $('#ballModal .j-rengou').val();
    obj.tichengPercent = $('#ipt_extraPercent').val();
    obj.baodiMoney = $('#ballModal .j-baodi-text').val();
    obj.shareLevel = $('#ballModal .br-set.active').attr('data-set');
    obj.projectTitle = $('#ballModal .j-project-title').val();
    obj.projectText = $('#ballModal .br-textarea').val();

    Config.payMoney = Number(obj.rengouMoney) + Number(obj.baodiMoney);

    APP.checkLogin(Config.payMoney, {
      enoughMoney: function () {
        buyTicket(obj, type);
      }
    });

  });

  // 立即购买
  $('#j-ljtzBtn').on('click', function (event) {

    var obj = BET.getSubmitParams();
    var vote = {};
    var c = null;
    var type = 'buy-self';
    var tr = $('#selectGamePool tbody tr');
    var tbodyHtml = '';
    var bunch = obj.bunch.replace(/\_/g, '串');

    tr.each(function (index, el) {
      var e = tr.eq(index);
      if (index % 2 == 0) {
        tbodyHtml += '<tr><td>' + e.find('.t1').html() + '</td><td>' + e.find('.t2').html() + '</td>';
      } else {
        tbodyHtml += '<td>' + e.find('.betList').html() + '</td></tr>';
      }
    });
    Config.payMoney = BET.zhushu * 2 * BET.beishu;

    vote.title = '投注信息确认';
    vote.confirmHtml = '<div class="ljtz-box"><div class="text"><p>投注金额：总计<span class="fc-3">' + Config.payMoney + '</span>元，共' + obj.zhushu + '注，投注' + obj.beishu + '倍</p><table class="table table-bordered"><thead><tr><th>场次</th><th class="gameTeam">主队 VS 客队</th><th style="width:150px;">赛果</th></tr></thead><tbody>' + tbodyHtml + '</tbody></table><p>过关方式：' + bunch + ', 理论最高奖金：<span class="fc-3">' + BET.maxBonus + '</span>元</p><div class="btns"><button class="btn btn-danger" id="buyConfirm">确定</button><button class="btn btn-gray" data-dismiss="modal">取消</button></div></div></div>';
    vote.callback = function () {
      buyTicket(obj, type);
    };

    c = checkParams();

    if (c) {
      APP.checkLogin(Config.payMoney, {
        enoughMoney: function () {
          APP.showTips({
            html: vote.confirmHtml,
            title: vote.title
          });

          $('#buyConfirm').one('click', function (event) {
            vote.callback();
          });

        }
      });
    };

  });

});