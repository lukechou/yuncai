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

  var bjdc = {
    'spfShow': true,
    'rqspfShow': true,
    'stopShow': false
  };

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
        var rightBox = _this.el.eq(1);
        var bodyHeight = $('body').height();
        var asideBoxHeight = rightBox.height();
        var footerHeight = $('.ft').height();
        _this.el.css({
          'position': 'relative',
          'top': 0
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
            rightBox.css({
              'position': 'relative',
              'top': 0
            });

          } else {

            if ((winTop + asideBoxHeight + footerHeight + offBottom) > bodyHeight) {
              rightBox.css({
                'position': 'absolute',
                'top': bodyHeight - footerHeight - asideBoxHeight - 40
              });
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
  /*******************************fixed menu********************************/

  /**
   * 页面初始化
   * 停售检测
   * 正常销售-初始化表单-检测对阵列表-返回顶部控件-固定菜单控件
   * Icon 事件初始化
   * UI 下拉框
   * UI 下拉框
   * 赛事筛选
   * @return {[type]} [description]
   */
  function pageInit() {

    // check Sell Status
    if (serverTime == 1) {
      APP.showStopSellModal(Config.lotyCNName);
      $('#j-ljtzBtn,#j-fqhmBtn').addClass('btn-stop').html('暂停销售');
      $('#j-ljtzBtn').attr('id', '');
      $('#j-fqhmBtn').remove();
      $('#j-data-body .data-loadbox').html(Config.lotyCNName + ' 暂停销售');
    } else {
      initDataBody();
      gameSeleListInit();

      scrollUp.init();
      scrollMenu.init();
    }

    $('.icon').tipsy({
      gravity: 'nw',
      html: true,
      opacity: 1
    });

    $('#poolStep1 .scrollMoni').mCustomScrollbar({
      theme: "light-3",
      mouseWheelPixels: 200
    });

    $('#j-ball-table').mCustomScrollbar({
      theme: "light-3",
      mouseWheelPixels: 200
    });

    $('#j-show-option').hover(function () {
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

        var t = $(this);
        var isBfBox = t.hasClass('j-bf-box');

        if (_.indexOf(start, t.attr('leaguename')) < 0) {
          $(this).hide();

          if (BET.tab === 'hhtz' || BET.tab === 'bf') {

            if (t.find('.j-sp-btn.active').length > 0) {
              var matchcode = t.attr('matchcode');
              var bfNearBox = $('#j-data-body .j-data-dd[matchcode=' + matchcode + ']');
              bfNearBox.find('.j-show-hhtz,.j-show-bf').addClass('has');
              bfNearBox.find('.row1-1').removeClass('on');
            }

          }

        } else {

          if (BET.tab === 'hhtz') {
            $(this).find('.j-show-hhtz').removeClass('active').html('展开' + BET.hhtzIconHtml);
          }

          if (BET.tab === 'bf') {
            $(this).find('.j-show-bf').removeClass('active');
            $(this).find('.row1-1').removeClass('on');
          }

          if (!isBfBox) {
            $(this).show();
          }
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

    $('.j-bd-mid').on('click', function (event) {
      event.preventDefault();

      var t = $(this);
      var ac = Number(t.attr('data-ac'));
      var m = _.escape(t.attr('data-method'));

      if (ac) {
        t.removeClass('icon-bd2').addClass('icon-bd');
        t.attr('data-ac', 0);
        bjdc[m + 'Show'] = false;
        filterBjdc();
      } else {
        t.removeClass('icon-bd').addClass('icon-bd2');
        t.attr('data-ac', 1);
        bjdc[m + 'Show'] = true;
        filterBjdc();
      }

    });

    if (Config.lotyName === 'bjdc') {

      var data = jczqData;
      var allMatch = 0;
      var expiredMatch = 0;
      var rqMatch = 0;
      var norqMatch = 0;

      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          allMatch += data[key].length;
          for (var i = data[key].length - 1; i >= 0; i--) {
            if (data[key][i]['is_expired'] == 1) {
              expiredMatch++
            }
            if (Number(data[key][i]['rqspf_rangqiu_num']) === 0) {
              norqMatch++
            } else {
              rqMatch++
            }
          };
        }
      }

      $('#j-bjdc-all').html(allMatch);
      $('#j-bjdc-stop').html(expiredMatch);
      $('#j-bjdc-rq').html(rqMatch);
      $('#j-bjdc-norq').html(norqMatch);

      $('#j-gg-tab').on('click', 'li', function (event) {

        var t = $(this);

        if (!t.hasClass('active')) {
          BET.bunch = [];
          BET.setAllTotal();
        };

        $('#j-gg-tab li').removeClass('active');
        t.addClass('active');

        if (t.attr('data-bunch') === '0') {
          BET.bjdcPassWay = true;
          BET.setSecondBox();
        } else {
          BET.bjdcPassWay = false;
          BET.setBjdcBox();
        }

      });

    }

  }

  pageInit();

  function getZhGg() {

  }

  // 北京单场对阵筛选
  function filterBjdc() {

    if (BET.tab === 'spf') {

      if (bjdc.spfShow) {
        BET.box.find('.isSpfShow').show();
      } else {
        BET.box.find('.isSpfShow').hide();
      }

      if (bjdc.rqspfShow) {
        BET.box.find('.isRqspfShow').show();
      } else {
        BET.box.find('.isRqspfShow').hide();
      }

    }
    if (bjdc.stopShow) {
      BET.box.removeClass('bjdc');
    } else {
      BET.box.addClass('bjdc');
    }

  }

  /**
   * 创建数据主体
   * @param  {Object} data 对阵数据对象
   * @return {String}      生成数据主体HTML
   */
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

        var rqspfNum = '';
        rqspfNum = Number(item['rqspf_rangqiu_num'])

        if (rqspfNum > 0) {
          rqspfNum = '<b class="fc-7">' + item['rqspf_rangqiu_num'] + '</b>';
        }

        if (rqspfNum < 0) {
          rqspfNum = '<b class="fc-3">' + item['rqspf_rangqiu_num'] + '</b>';
        }

        arr.push('<span class="co6-1 btnBox towLine "><div class="line1 "><em class="rq">' + rqspfNum + '</em>' + line + '</div></span></dd>');
      }

      if (tab === 'spf') {
        var bjdcSpfRq = 0;
        if (Config.lotyName === 'bjdc') {
          bjdcSpfRq = Number(item['rqspf_rangqiu_num'])

          if (bjdcSpfRq > 0) {
            bjdcSpfRq = '<b class="fc-7">' + item['rqspf_rangqiu_num'] + '</b>';
          }

          if (bjdcSpfRq < 0) {
            bjdcSpfRq = '<b class="fc-3">' + item['rqspf_rangqiu_num'] + '</b>';
          }
        }
        arr.push('<span class="co6-1 btnBox towLine "><div class="line1 "><em class="rq">' + bjdcSpfRq + '</em>' + line + '</div></span></dd>');
      }

      if (tab === 'bqc') {
        arr.push('<span class="row2 row2-1">' + line + '</span></dd>');
      }

      if (tab === 'zjq') {
        arr.push('<span class="row3 row3-1">' + line + '</span></dd>');
      }

      if (tab === 'sxds') {
        arr.push('<span class="row5">' + line + '</span></dd>');
      }

    };

    return arr.join('');

  }

  /**
   * 返回一列通用左侧html
   * @param  {Object} item 对阵数据对象
   * @return {String}      html
   */
  function getDataLeftCommon(item) {

    var isExpired = '';

    if (Config.lotyName === 'bjdc' && item.is_expired == 1) {
      isExpired = 'bjdc-expired';
    }

    var arr = [];
    var bjdcSpfStyle = 'isSpfShow';

    if (Number(item.rqspf_rangqiu_num) !== 0) {
      bjdcSpfStyle = 'isRqspfShow';
    }

    arr.push('<dd isstop="0" matchcode="' + item.match_key + '" matchnumcn="' + item.week + item.game_order + '" starttime="' + item.game_start_time + '" endtime="' + item.end_time + '" isdg="0,1,0,0,0" hostname="' + item.home_short + '" guestname="' + item.away_short + '" leaguename="' + item.league + '" class="j-data-dd ' + isExpired + ' ' + bjdcSpfStyle + '">');

    arr.push('<span class="co1"><i class="jtip" inf="' + item.week + item.game_order + '">' + item.game_order + '</i></span>');

    arr.push('<span class="co2" style="background:' + item.league_color + ';">' + item.league + '</span>');

    arr.push('<span class="co3 gameTime"><i class="jtip">' + item.end_time + '</i></span>');

    arr.push('<span class="co4"><em class="hostTeam" title="' + item.home_short + '"><b>' + item.home_short + '</b></em><em class="guestTeam" title="' + item.away_short + '"><b>' + item.away_short + '</b></em></span>');

    return arr;

  }

  /**
   * 创建混合投注html
   * @param  {Object} item 对阵数据对象
   * @return {String}      html
   */
  function createHhtzBtnHtml(item) {

    var rqspfNum = '';
    var html = '';
    var spfArr = item['spf_gg_sp'].split('|');
    var spfTitle = ['胜', '平', '负'];
    var rqspfArr = item['rqspf_gg_sp'].split('|');
    var rqspfTitle = ['让球胜', '让球平', '让球负'];
    var noSupportTips = '本场对阵不支持该玩法';

    rqspfNum = Number(item['rqspf_rangqiu_num'])

    if (rqspfNum > 0) {
      rqspfNum = '<b class="fc-7">' + item['rqspf_rangqiu_num'] + '</b>';
    }

    if (rqspfNum < 0) {
      rqspfNum = '<b class="fc-3">' + item['rqspf_rangqiu_num'] + '</b>';
    }

    html += '<span class="row4-1"><em class="rq">0</em>';
    if (item.spf == 1) {
      html += BET.getSpBtn(item.spf, spfTitle, spfArr, 'spf');
    } else {
      html += noSupportTips;
    }

    html += '</span>';

    html += '<span class="row4-1"><em class="rq">' + rqspfNum + '</em>';
    if (item.rqspf == 1) {
      html += BET.getSpBtn(item.rqspf, rqspfTitle, rqspfArr, 'rqspf', 3);
    } else {
      html += noSupportTips;
    }
    html += '</span>';

    html += '<em class="tg-data j-show-hhtz">展开' + BET.hhtzIconHtml + '</em></dd>';

    return html;
  }

  /**
   * 创建混合投注html
   * @param  {Object} item 对阵数据对象
   * @return {String}      html
   */
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

    if (serverTime == 0) {
      $('#j-data-body').html(dataBodyHTML);
    } else {
      $('#j-data-body .data-loadbox').html(Config.lotyCNName + ' 暂停销售');
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

  // Toggle Buy Type
  $('#j-vote-nav').on('click', 'a', function (event) {

    var type = $(this).attr('data-type');
    var tab = $(this).attr('data-game');
    var newClass = 'bettingBox clearfix ' + type;

    if (Config.lotyName === 'bjdc') {
      newClass = 'bettingBox bjdc clearfix ' + type;
    }

    $('#j-vote-nav .active').removeClass('active');
    $(this).parents('li').addClass('active');

    BET.tab = $(this).attr('data-game');
    BET.box.removeClass().addClass(newClass);
    BET.clearBetData();

    if (Config.lotyName === 'bjdc' && BET.tab === 'spf') {
      $('.j-bd-spf').show();
    } else {
      $('.j-bd-spf').hide();
    }

    initDataBody();

  });

  /**
   * 购票函数
   * @param  {Object} obj      购彩参数
   * @param  {String} type     购票类型 自购,合买
   * @param  {String} lotyName 彩种类型
   * @return {null}
   */
  var buyTicket = function (obj, type, lotyName) {

    var u = 'jingcai';
    var l = '';

    if (lotyName === 'bjdc') {
      u = 'bjdc';
    } else {
      l = '_gg';
    }

    obj.unikey = $.now();

    $.ajax({
        url: '/lottery/' + u + '/' + type + '/' + lotyName + '/' + BET.tab + l,
        type: 'POST',
        dataType: 'json',
        data: obj
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

  /**
   * 底部提示切换
   * @return {null}
   *
   */
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

  /**
   * 弹出前对阵合法性检测
   * @return {Boolean} 是否合法
   */
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
    if (matchLen < 2 && Config.lotyName==='jczq') {
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
        buyTicket(obj, type, Config.lotyName);
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

            buyTicket(obj, type, Config.lotyName);
          });

        }
      });
    };

  });

});