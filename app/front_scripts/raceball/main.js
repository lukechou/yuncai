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

  Config.lotyName = 'jczq';
  gameSeleListInit();

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
    theme: "light",
  });

  $('#j-ball-table').mCustomScrollbar({
    theme: "light",
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
      APP.checkLogin({
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

    APP.checkLogin({
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
      APP.checkLogin({
        enoughMoney: function () {
          APP.onSubmitInit(vote);
        }
      });
    };

  });

});