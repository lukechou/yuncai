require.config({
  paths: {
    jquery: '../lib/jquery',
    lodash: '../lib/lodash.compat.min',
    bootstrap: '../lib/bootstrap.min',
    store: '../lib/store.min',
    app: '../common/app',
    scroll: '../lib/jquery.mCustomScrollbar.concat.min',
    tipsy: '../lib/jquery.tipsy',
    core: '../lib/core',
    betting: 'betting',
    hemai: 'hemai',
    scrollUp: 'scrollUp',
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
    },
    scrollUp: {
      deps: ['jquery'],
      exports: 'jquery'
    },
  }
});

require(['jquery', 'lodash', 'betting', 'app', 'store', 'hemai', 'bootstrap', 'scroll', 'tipsy', 'core', 'scrollUp'], function ($, _, BET, APP, store, H) {
  'use strict';

  var scrollUp = (function () {

    var scrollUp = {
      el: $('#scrollUp'),
      init: function () {

        $.scrollUp({
          scrollText: '<div class="scroll-icon"><i class="icon icon-link-top"></i></div><div class="scroll-text">返回顶部</div>',
        });

        this.el.hover(function () {
          $(this).addClass('active');
        }, function () {
          $(this).removeClass('active');
        });

      }
    };

    return scrollUp;

  }());

  var scrollMenu = (function () {

    var scrollMenu = {
      el: $('.j-navbar-wrapper'),
      top: 300,
      init: function (argm) {

        var _this = this;
        if (argm) {
          for (var prop in argm) {
            if (argm.hasOwnProperty(prop)) {
              _this[prop] = argm[prop];
            }
          }
        };

        $(window).scrollTop(0);

        $(window).scroll(function (event) {

          var winTop = $(this).scrollTop();

          if (winTop > _this.top) {
            _this.isMoreTop(winTop);
          } else {
            _this.isLessTop();
          }

        });

      },
      isLessTop: function () {

        var _this = this;
        _this.el.css({
          'position': 'relative',
        });

        _this.el.eq(0).removeClass('active');

      },
      isMoreTop: function (winTop) {

        var _this = this;
        var setTop = 0;
        var betBoxHeight = $('#bettingBox').height() + _this.top;
        var leftBox = _this.el.eq(0);
        var rightBox = _this.el.eq(1);
        var offBottom = 50;

        var asideBoxHeight = rightBox.height();
        var bodyHeight = $('body').height();
        var windowHeight = $(window).height();
        var footerHeight = $('.ft').height();

        if (winTop < betBoxHeight) {
          leftBox.addClass('active');

          _this.el.css({
            'position': 'fixed',
            'top': setTop
          });

          if (windowHeight < asideBoxHeight) {
            rightBox.css('position', 'relative');
          } else {
            if ((winTop + asideBoxHeight + footerHeight + offBottom) > bodyHeight) {
              rightBox.css('position', 'relative');
            }
          }

        } else {

          leftBox.removeClass('active');
          _this.isLessTop();

        }
      }

    };

    return scrollMenu;

  }());

  function pageInit() {

    // check Sell Status
    if (serverTime == 1) {
      APP.showStopSellModal("竞彩足球");
      $('#j-ljtzBtn,#j-fqhmBtn').addClass('btn-stop').html('暂停销售');
      $('#j-ljtzBtn').attr('id', '');
      $('#j-fqhmBtn').remove();
    }

    scrollUp.init();
    scrollMenu.init();
  }

  pageInit();

  function createDateMain(data) {

    var arr = [];
    var dataLeftCommon = [];
    var line = '';
    var item = null;
    var tab = BET.tab;
    var bfLine = '';

    for (var i = 0, len = data.length; i < len; i++) {

      item = data[i];

      if (item[tab] == 1) {
        bfLine = '<button class="btn j-show-bf"></button>';
      } else {
        bfLine = '<b class="no-support">本场对阵不支持该玩法</b>';
      }

      dataLeftCommon = getDataLeftCommon(item);
      arr = arr.concat(dataLeftCommon);

      if (tab === 'bf') {
        arr.push('<span class="row1 row1-1">' + bfLine + '</span></dd>');
      } else {
        line = BET.craeteDateBtn(item[tab], item[tab + '_gg_sp']);
      }

      if (tab === 'rqspf') {

        var rqspf_num = '';

        switch (Number(item['rqspf_rangqiu_num'])) {
        case -1:
          rqspf_num = '<b class="fc-3">' + item['rqspf_rangqiu_num'] + '</b>';
          break;
        case 1:
          rqspf_num = '<b class="fc-7">' + item['rqspf_rangqiu_num'] + '</b>';
          break;
        default:
          rqspf_num = item['rqspf_rangqiu_num'];
          break;
        }

        arr.push('<span class="co6-1 btnBox towLine "><div class="line1 "><em class="rq">' + rqspf_num + '</em>' + line + '</div></span></dd>');
      }

      if (tab === 'spf') {
        arr.push('<span class="co6-1 btnBox towLine "><div class="line1 "><em class="rq">0</em>' + line + '</div></span></dd>');
      }

      if (tab === 'bqc') {
        arr.push('<span class="row2 row2-1">' + line + '</span></dd>');
      }

      if (tab === 'zjq') {
        arr.push('<span class="row3 row3-1">' + line + '</span></dd>');
      }

    };

    return arr.join('');

  }

  function getDataLeftCommon(item) {

    var arr = [];
    arr.push('<dd isstop="0" matchcode="' + item.match_key + '" matchnumcn="' + item.week + item.game_order + '" starttime="' + item.game_start_time + '" endtime="' + item.end_time + '" isdg="0,1,0,0,0" hostname="' + item.home_short + '" guestname="' + item.away_short + '" leaguename="' + item.league + '" class="j-data-dd">');

    arr.push('<span class="co1"><i class="jtip" inf="' + item.week + item.game_order + '">' + item.game_order + '</i></span>');

    arr.push('<span class="co2" style="background:' + item.league_color + ';">' + item.league + '</span>');

    arr.push('<span class="co3 gameTime"><i class="jtip">' + item.end_time + '</i></span>');

    arr.push('<span class="co4"><em class="hostTeam" title="' + item.home_short + '"><b>' + item.home_short + '</b></em><em class="guestTeam" title="' + item.away_short + '"><b>' + item.away_short + '</b></em></span>');

    return arr;

  }

  function createHhtzBtnHtml(item) {

    var rqspf_num = '';
    var html = '';
    var spfArr = item['spf_gg_sp'].split('|');
    var spfTitle = ['胜', '平', '负'];
    var rqspfArr = item['rqspf_gg_sp'].split('|');
    var rqspfTitle = ['让球胜', '让球平', '让球负'];

    switch (Number(item['rqspf_rangqiu_num'])) {
    case -1:
      rqspf_num = '<b class="fc-3">' + item['rqspf_rangqiu_num'] + '</b>';
      break;
    case 1:
      rqspf_num = '<b class="fc-7">' + item['rqspf_rangqiu_num'] + '</b>';
      break;
    default:
      rqspf_num = item['rqspf_rangqiu_num'];
      break;
    }

    html += '<span class="row4-1"><em class="rq">0</em>';
    html += BET.getSpBtn(1, spfTitle, spfArr, 'spf');
    html += '</span>';

    html += '<span class="row4-1"><em class="rq">' + rqspf_num + '</em>';
    html += BET.getSpBtn(1, rqspfTitle, rqspfArr, 'rqspf', 3);
    html += '</span>';

    html += '<em class="tg-data j-show-hhtz">展开<i class="arrow-down"></i></em></dd>';

    return html;
  }

  function createHhtzHtml(data) {

    if (!data) {
      return '';
    }

    var arr = [];
    var dataLeftCommon = [];
    var item = null;

    for (var i = 0, len = data.length; i < len; i++) {

      item = data[i];
      dataLeftCommon = getDataLeftCommon(item);
      arr = arr.concat(dataLeftCommon);
      arr.push(createHhtzBtnHtml(item));

    }

    return arr.join('');

  }

  // 初始化数据主体
  function initDataBody() {

    var dataBodyHTML = '';

    for (var key in jczqData) {
      if (jczqData.hasOwnProperty(key)) {
        dataBodyHTML += createDataBody(jczqData[key], key);
      }
    }

    if (serverTime === 0) {
      $('#j-data-body').html(dataBodyHTML);
    } else {
      $('#j-data-body .data-loadbox').html('竞彩足球 暂停销售');
    }

  }

  // 创建数据主体HTML
  function createDataBody(data, d) {

    var time = APP.dateFormat(new Date(d * 1000), '%Y-%M-%d', true) + ' ' + data[0].week;
    var dataCount = data.length;

    var h = '';

    // head
    h += '<dl><dt>' + time + '(12:00 -- 次日12:00)<span class="matchSize">' + dataCount + '</span>场比赛可投注<span class="cuspText fc-84 j-dataBody-toggle pull-right" data-show="1"><span class="j-nav-text">隐藏</span><i class="icon show-icon"></i></span></dt>';

    if (BET.tab === 'hhtz') {
      h += createHhtzHtml(data);
    } else {
      h += createDateMain(data);
    }

    // foot
    h += '</dl>'
    return h;
  }

  initDataBody();
  gameSeleListInit();
  Config.lotyName = 'jczq';

  // Toggle Buy Type
  $('#j-vote-nav').on('click', 'a', function (event) {

    var type = $(this).attr('data-type');
    var tab = $(this).attr('data-game');

    $('#j-vote-nav .active').removeClass('active');
    $(this).parents('li').addClass('active');

    BET.tab = $(this).attr('data-game');
    BET.box.removeClass().addClass('bettingBox clearfix ' + type);
    BET.clearBetData();

    initDataBody();

  });

  $('.icon').tipsy({
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

    var matchLen = _.uniq(BET.match, 'matchcode').length;

    if (matchLen > 15) {
      APP.showTips('您好，投注场次不得超过15场哦');
      return false;
    }
    if (!BET.isAgreen) {
      APP.showTips('请先阅读并同意《委托投注规则》后才能继续');
      return false;
    }
    if (matchLen < 2) {
      APP.showTips('请在左侧至少选择2场比赛');
      return false;
    }

    if (BET.zhushu > 10000) {
      APP.showTips('方案注数已超过<span class="fc-3 mlr-8">10000</span>注<br/><p class="fs-12">理性购彩,可适当减少投注</p>');
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
    $(this).addClass('hovered');
    $('#gameSeleList').show();

  }, function () {
    $(this).removeClass('hovered');
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
    $(this).addClass('hovered');
    $(this).find('.optionList').show();
  }, function () {
    $(this).removeClass('hovered');
    $(this).find('.optionList').hide();
  });

  $('#j-changeTime .optionList').on('click', 'a', function (event) {

    var type = $(this).attr('data-timeType');
    $('#j-changeTime .optionList a').removeClass('active');
    $(this).addClass('active');
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
    $('.j-share-num').val(obj.zhushu * 2 * obj.beishu);
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

    obj.shareNum = $('#ballModal .j-share-num').val();
    obj.buyNum = Number($('#ballModal .j-rengou').val());
    obj.aegisNum = Number($('#ballModal .j-baodi-text').val());

    obj.tichengPercent = $('#ipt_extraPercent').val();
    obj.shareLevel = $('#ballModal .br-set.active').attr('data-set');
    obj.projectTitle = $('#ballModal .j-project-title').val();
    obj.projectText = $('#ballModal .br-textarea').val();

    Config.payMoney = obj.zhushu * 2 * obj.beishu / obj.shareNum * (obj.buyNum + obj.aegisNum);

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
    vote.confirmHtml = '<div class="ljtz-box"><div class="text"><p>投注金额：总计<span class="fc-3">' + Config.payMoney + '</span>元，共' + obj.zhushu + '注，投注' + obj.beishu + '倍</p><div class="ljtz-main" id="j-ljtz-box"><table class="table table-bordered"><thead><tr><th>场次</th><th class="gameTeam">主队 VS 客队</th><th style="width:150px;">赛果</th></tr></thead><tbody>' + tbodyHtml + '</tbody></table></div><p>过关方式：' + bunch + ', 理论最高奖金：<span class="fc-3">' + BET.maxBonus + '</span>元</p><div class="btns"><button class="btn btn-danger" id="buyConfirm">确定</button><button class="btn btn-gray" data-dismiss="modal">取消</button></div></div></div>';

    c = checkParams();

    if (c) {

      APP.checkLogin(Config.payMoney, {
        enoughMoney: function () {

          APP.showTips({
            html: vote.confirmHtml,
            title: vote.title
          });

          $('#j-ljtz-box').mCustomScrollbar({
            theme: "light-3",
            mouseWheelPixels: 200
          });

          $('#buyConfirm').one('click', function (event) {
            buyTicket(obj, type);
          });

        }
      });
    };

  });

});