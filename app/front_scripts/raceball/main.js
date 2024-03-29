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

require(['jquery', 'lodash', 'betting', 'app', 'store', 'hemai', 'bootstrap', 'scroll', 'tipsy', 'core', 'scrollUp'], function($, _, BET, APP, store, H) {
  'use strict';

  var bjdc = {
    'spfShow': true,
    'rqspfShow': true,
    'stopShow': false
  };

  var scrollUp = (function() {

    var scrollUp = {
      el: $('#scrollUp'),
      init: function() {

        $.scrollUp({
          scrollText: '<div class="scroll-icon"><i class="icon icon-link-top"></i></div><div class="scroll-text">返回顶部</div>',
        });

        this.el.hover(function() {
          $(this).addClass('active');
        }, function() {
          $(this).removeClass('active');
        });

      }
    };

    return scrollUp;

  }());

  var scrollMenu = (function() {

    var scrollMenu = {
      el: $('.j-navbar-wrapper'),
      top: 300,
      init: function(argm) {

        var _this = this;
        if (argm) {
          for (var prop in argm) {
            if (argm.hasOwnProperty(prop)) {
              _this[prop] = argm[prop];
            }
          }
        };

        $(window).scrollTop(0);

        $(window).scroll(function(event) {

          var winTop = $(this).scrollTop();

          if (winTop > _this.top) {
            _this.isMoreTop(winTop);
          } else {
            _this.isLessTop();
          }

        });

      },
      isLessTop: function() {

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
      isMoreTop: function(winTop) {

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
      //gameSeleListInit();
      initDsDataBody();

      scrollUp.init();
      scrollMenu.init();
    }

    $('.icon').tipsy({
      gravity: 'nw',
      html: true,
      opacity: 1
    });
    $('.j-check-standard').tipsy({
      gravity: 'n',
      html: true,
      opacity: 1,
      //delayOut:34424224
    });

    $('#poolStep1 .scrollMoni').mCustomScrollbar({
      theme: "light-3",
      mouseWheelPixels: 200
    });
    $('.j-dsPoolStep1 .scrollMoni').mCustomScrollbar({
      theme: "light-3",
      mouseWheelPixels: 200
    });

    $('#j-ball-table').mCustomScrollbar({
      theme: "light-3",
      mouseWheelPixels: 200
    });

    //赛事筛选切换
    $('.j-show-option').hover(function() {
      $(this).addClass('hovered');
      $(this).find('.j-gameSeleList').show();

    }, function() {
      $(this).removeClass('hovered');
      $(this).find('.j-gameSeleList').hide();
    });

    // 收藏星星 点击事件
    $('.j-gameSeleList').on('click', 'li', function(event) {
      var isAllHide = false;
      var t = $(this);
      var matchTypeText = _.escape($.trim(t.text()));
      var ac = 'active';
      var navType = $('#j-hd-nav a.active').attr('nav-type');

      // 切换星星颜色,赛事筛选数据
      if (t.hasClass(ac)) {
        _.remove(BET.collect, function(chr) {
          return chr === matchTypeText;
        });
        t.removeClass(ac);
        switch (navType) {
          case 'dssc':
            updateDsAfterCollectUi(true);
            break;
          default:
            updateAfterCollectUi(true);
            break;
        }

      } else {
        BET.collect.push(matchTypeText);
        t.addClass(ac);
        switch (navType) {
          case 'dssc':
            updateDsAfterCollectUi(false);
            break;
          default:
            updateAfterCollectUi(false);
            break;
        }

      }

      return;

    });

    // 收藏确认按钮
    $('#j-match-collect').on('click', function(event) {

      debugger
      var start = [];

      if ($('.j-gameSeleList .icon').hasClass('icon-cgou')) {
        $('.j-gameSeleList li.active').each(function(index, el) {
          start.push($.trim($(this).text()));
        });
        $('.j-gameSeleList').hide();

        setToggleBtn(start);

        store.set('startArr', start);
      } else {
        store.clear('startArr');
      }

    });

    // 是否记住收藏信息 暂时不做
    $('.j-gameSeleList').on('click', '.icon', function(event) {
      var t = $(this);
      t.toggleClass('icon-cbox').toggleClass('icon-cgou');
    });

    // 截止时间
    $('#j-changeTime').hover(function() {
      $(this).addClass('hovered');
      $(this).find('.optionList').show();
    }, function() {
      $(this).removeClass('hovered');
      $(this).find('.optionList').hide();
    });

    // 截止时间,比赛时间切换
    $('#j-changeTime .optionList').on('click', 'a', function(event) {

      var type = $(this).attr('data-timeType');
      $('#j-changeTime .optionList a').removeClass('active');
      $(this).addClass('active');
      $('#j-changeTimeText').html($(this).html());

      $('.dataBody dd').each(function(index, el) {
        var time = $(this).attr(type);
        $(this).find('.co3 .jtip').html(time);
      });

    });

    // 北京单场中间按钮区
    $('.j-bd-mid').on('click', function(event) {
      event.preventDefault();

      var t = $(this);
      var ac = Number(t.attr('data-ac'));
      var m = _.escape(t.attr('data-method'));

      if (ac) {

        t.removeClass('icon-bd2').addClass('icon-bd');
        t.attr('data-ac', 0);
        bjdc[m + 'Show'] = false;

        if (m === 'stop') {
          bjdc[BET.tab + 'StopStatus'] = false;
        }

      } else {

        t.removeClass('icon-bd').addClass('icon-bd2');
        t.attr('data-ac', 1);
        bjdc[m + 'Show'] = true;

        if (m === 'stop') {
          bjdc[BET.tab + 'StopStatus'] = true;
        }

      }

      filterBjdc();
      updateMidMatchUi();

      if (BET.tab === 'spf') {

        if (bjdc.rqspfShow && bjdc.stopShow && bjdc.spfShow) {

          $('#j-toggle-allmatch').attr('data-status', 0);
          $('#j-toggle-allmatch').text('隐藏全部场次');
        } else {
          $('#j-toggle-allmatch').attr('data-status', 1);
          $('#j-toggle-allmatch').text('显示全部场次');
        }
      } else {
        if (bjdc.stopShow) {
          $('#j-toggle-allmatch').attr('data-status', 0);
          $('#j-toggle-allmatch').text('隐藏全部场次');

        } else {
          $('#j-toggle-allmatch').attr('data-status', 1);
          $('#j-toggle-allmatch').text('显示全部场次');
        }
      }

    });

    $('#j-toggle-allmatch').on('click', function(event) {
      event.preventDefault();

      var t = $(this);
      var status = Number(t.attr('data-status'));
      var mid = $('.j-bd-mid');
      var tipsHtml = ['显示全部场次', '隐藏全部场次'];
      var iconArr = ['icon-bd2', 'icon-bd'];
      var unStatus = status ? 0 : 1;

      if (BET.tab === 'spf') {

        bjdc.rqspfShow = status;
        bjdc.spfShow = status;

      } else {

        if (status) {
          $('.j-data-dd').show();
        } else {
          $('.j-data-dd').hide();
        }

      }

      bjdc.stopShow = status;
      filterBjdc();
      mid.attr('data-ac', status);

      t.attr('data-status', unStatus);
      t.text(tipsHtml[status]);

      mid.removeClass(iconArr[status]).addClass(iconArr[unStatus]);

      updateMidMatchUi();

    });

    if (Config.lotyName === 'bjdc' || Config.lotyName === 'jczq') {

      /*
       * data  对阵数据
       * allMatch  对阵总数
       * expiredMatch 已截止对阵数
       * rqMatch 让球对阵数
       * norqMatch  非让球对阵数
       *
       */
      var data = jczqData;
      BET.allMatch = 0;
      BET.expiredMatch = 0;
      BET.rqMatch = 0;
      BET.norqMatch = 0;
      BET.hideMatch = 0;

      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          BET.allMatch += data[key].length;
          for (var i = data[key].length - 1; i >= 0; i--) {
            if (data[key][i]['is_expired'] == 1) {
              BET.expiredMatch++
            }

            if (Number(data[key][i]['rqspf_rangqiu_num']) === 0) {
              BET.norqMatch++
            } else {
              BET.rqMatch++
            }

          };
        }
      }

      // 初始化中间栏赛事统计
      BET.hideMatch = BET.expiredMatch;
      updateMidMatchUi();

      //普通过关,组合过关切换
      $('.j-gg-tab').on('click', 'li', function(event) {

        var t = $(this);
        var isZhBunch = Number(t.attr('data-bunch'));
        var tipsArr = ['请选择至少一场比赛进行投注', '请选择至少两场比赛进行投注'];
        var t2Obj = $('#selectGamePool').find('.gameTitle').find('.t2');
        var matchLen = Number(_.uniq(BET.match, 'matchcode').length);
        if (!t.hasClass('active')) {
          BET.bunch = [];
          BET.setAllTotal();
        };

        t.siblings('li').removeClass('active');
        t.addClass('active');

        $('.j-unselect-tips').html(tipsArr[isZhBunch]);

        if (isZhBunch) { //表示点击了组合过关
          BET.bjdcPassWay = false;
          BET.setBjdcBox();
          $('#selectGamePool').find('tr.gameTitle').find('.j-dan').removeClass('active').addClass('dan-disabled');
          BET.danMatchCode = [];

          //处理胆字，组合过关不要显示胆字，自由过关要显示
          t2Obj.find('.j-dan').remove();

        } else { //表示点击了自由过关
          BET.bjdcPassWay = true;
          BET.setSecondBox();
          $('#selectGamePool').find('tr.gameTitle').find('.j-dan').removeClass('dan-disabled');
          BET.danMatchCode = [];

          if (matchLen < 3) {
            t2Obj.append('<span class="t3-right j-dan dan-disabled">胆</span>');
          } else {
            t2Obj.append('<span class="t3-right j-dan">胆</span>');
          }

        }

      });

    }

  }

  pageInit();

  function updateAfterCollectUi(isRemove) {

    var start = BET.collect;
    var dataBody = $('#j-game-select');
    var collectBody = $('#j-collect-body');
    var collectObj = [];
    var collectGroup = [];

    // 如果是移除
    if (isRemove) {

      collectBody.find('.j-data-dd').each(function(index, el) {

        var m = $(this).attr('matchcode');
        var ne = $(this).html();

        $('#j-game-select .j-data-dd[matchcode=' + m + ']').html(ne);

      });

    }

    // 初始化 收藏区域
    $('#j-collect-body dl').remove();

    // 判断是否收藏
    if (start.length > 0) {
      collectBody.show();
    } else {
      collectBody.hide();
    }

    // 生成收藏数据,隐藏已收藏数据
    $('#j-game-select .j-data-dd').each(function(index, el) {

      var t = $(this);
      var isBfBox = t.hasClass('j-bf-box');
      var matchcode = t.attr('matchcode');
      var onCollectBody = t.parents('#j-collect-body').length;

      if (_.indexOf(start, t.attr('leaguename')) < 0) {

        dataBody.find('.j-data-dd[matchcode=' + matchcode + ']').show();
        dataBody.find('.j-bf-box[matchcode=' + matchcode + ']').show();

        // 混合投注 和 比分 额外处理
        if (BET.tab === 'hhtz' || BET.tab === 'bf') {

          if (t.find('.j-sp-btn.active').length > 0) {

            var matchcode = t.attr('matchcode');
            var bfNearBox = $('#j-data-body .j-data-dd[matchcode=' + matchcode + ']');
            bfNearBox.find('.j-show-hhtz,.j-show-bf').addClass('has');
            bfNearBox.find('.row1-1').removeClass('on');

          }

        }

      } else {

        // 收藏

        //不在收藏里的
        collectObj.push(t.clone());
        t.hide();

        // 混合投注 比分处理
        if (BET.tab === 'bf') {

          var bfMoreEl = $('#j-data-body .j-bf-box[matchcode=' + matchcode + ']');

          if (bfMoreEl.length > 0) {
            collectObj.push(bfMoreEl.clone());
            bfMoreEl.hide();
          }

        }

        if (BET.tab === 'hhtz') {

          var hhtzMoreEl = $('#j-data-body .hhtz-box[matchcode=' + matchcode + ']');

          if (hhtzMoreEl.length > 0) {
            collectObj.push(hhtzMoreEl.clone());
            hhtzMoreEl.hide();
          }

        }

        return;

      }

    });

    //关注赛事分组

    // 多少组, 每组多少人
    collectGroup = _.groupBy(collectObj, function(chr) {
      return chr.attr('data-time');
    });

    var collectHtml = '';

    var bTime = '12:00';
    var keyTime = '';
    var collectTotalMatch = 0;

    if (Config.lotyName === 'bjdc') {
      bTime = '10:00';
    }

    for (var key in collectGroup) {
      if (collectGroup.hasOwnProperty(key)) {

        keyTime = APP.dateFormat(new Date(key * 1000), '%Y-%M-%d', true) + ' ' + collectGroup[key][0].attr('matchnumcn').replace('\d/g', '');

        collectHtml += '<dl><dt>' + keyTime + '(' + bTime + ' -- 次日' + bTime + ')<span class="matchSize">' + collectGroup[key].length + '</span>场比赛可投注<span class="cuspText fc-84 j-dataBody-toggle pull-right" data-show="1"><span class="j-nav-text">隐藏</span><i class="icon show-icon"></i></span></dt>';
        for (var i = 0; i < collectGroup[key].length; i++) {
          collectHtml += collectGroup[key][i][0].outerHTML;
        };

        collectHtml += '</dl>';

        collectTotalMatch += collectGroup[key].length;
      }
    }

    collectBody.append(collectHtml);
    collectBody.find('.j-data-dd').show();

    // 更新 数据主体DT比赛场数统计
    $('#j-data-body dl').each(function(index, el) {

      var totalM = 0;

      $(this).find('.j-data-dd').each(function(index, el) {

        if (!$(this).is(':hidden')) {
          totalM++;
        }

      });

      if (totalM) {
        $(this).find('dt').show();
        $(this).find('.j-match-size').html(totalM);
      } else {
        $(this).find('dt').hide();
      }

    });

    // 更新 关注赛事总场数
    $('#j-match-total').html(collectTotalMatch);

  }

  function updateDsAfterCollectUi(isRemove) {
    var box = '#j-ddsc-box';
    var start = BET.collect;
    var $gameSelect = $(box + ' .j-game-select');
    var $collectBody = $(box + ' .j-collect-body');
    var collectObj = [];
    var collectGroup = [];

    if (isRemove) {

      $collectBody.find('.j-game-span').each(function(index, el) {

        var m = $(this).attr('matchcode');
        var ne = $(this).html();

        $gameSelect.find('.j-game-span[matchcode=' + m + ']').html(ne);

      });

      $collectBody.hide();

    }

    // 初始化 收藏区域
    $collectBody.find('dl').remove();

    // 判断是否收藏
    if (start.length > 0) {
      $collectBody.show();
    } else {
      $collectBody.hide();
    }

    // 生成收藏数据,隐藏已收藏数据
    $(box + ' .j-game-select .j-game-span').each(function(index, el) {

      var t = $(this);
      var matchcode = t.attr('matchcode');

      if (_.indexOf(start, t.attr('leaguename')) < 0) {

        $gameSelect.find('.j-game-span[matchcode=' + matchcode + ']').show();

      } else {

        //在收藏里面的
        collectObj.push(t.clone());
        t.hide();

      }


    });

    //关注赛事分组

    // 多少组, 每组多少人
    collectGroup = _.groupBy(collectObj, function(chr) {
      return chr.attr('data-time');
    });

    var collectHtml = '';

    var bTime = '12:00';
    var keyTime = '';
    var collectTotalMatch = 0;

    for (var key in collectGroup) {
      if (collectGroup.hasOwnProperty(key)) {

        keyTime = APP.dateFormat(new Date(key * 1000), '%Y-%M-%d', true) + ' ' + collectGroup[key][0].attr('matchnumcn').replace('\d/g', '');

        collectHtml += '<dl><dt>' + keyTime + '(' + bTime + ' -- 次日' + bTime + ')<span class="matchSize">' + collectGroup[key].length + '</span>场比赛可投注<span class="cuspText fc-84 j-ds-databody-toggle pull-right" data-show="1"><span class="j-nav-text">隐藏</span><i class="icon show-icon"></i></span></dt><dd class="clearfix">';

        for (var i = 0; i < collectGroup[key].length; i++) {
          collectHtml += collectGroup[key][i][0].outerHTML;
        };

        collectHtml += '</dd></dl>';

        collectTotalMatch += collectGroup[key].length;
      }
    }

    $collectBody.append(collectHtml);
    $(box + ' .j-collect-body .j-game-span').each(function(index, el) {
      var t = $(this);
      t.addClass('right-bor');

    });

    $collectBody.find('.j-game-span').show();

    // 更新 数据主体DT比赛场数统计
    $('.j-ds-databody dl').each(function(index, el) {

      var totalM = 0;

      $(this).find('.j-game-span').each(function(index, el) {

        if (!$(this).is(':hidden')) {
          totalM++;
        }

      });

      if (totalM) {
        $(this).find('dt').show();
        $(this).find('.j-match-size').html(totalM);
      } else {
        $(this).find('dt').hide();
      }

    });

    // 更新 关注赛事总场数
    $(box + ' .j-match-total').html(collectTotalMatch);


  }

  //北京单场 中间栏赛事统计更新
  function updateMidMatchUi() {

    var hide = 0;

    $('.j-data-dd').each(function(index, el) {
      if ($(this).is(":hidden")) {
        hide++;
      }
    });

    $('#j-bjdc-all').html(hide);
    $('#j-bjdc-stop').html(BET.expiredMatch);
    $('#j-bjdc-rq').html(BET.rqMatch);
    $('#j-bjdc-norq').html(BET.norqMatch);

  }

  // 北京单场对阵筛选
  function filterBjdc() {

    if (BET.tab === 'spf') {

      if (bjdc.spfShow) {
        BET.box.find('.isRqspfShow').show();
      } else {
        BET.box.find('.isRqspfShow').hide();
      }

      if (bjdc.rqspfShow) {
        BET.box.find('.isSpfShow').show();
      } else {
        BET.box.find('.isSpfShow').hide();
      }

    }

    if (bjdc.stopShow) {
      BET.box.removeClass('bjdc');
    } else {
      BET.box.addClass('bjdc');
    }

    if (Config.lotyName === 'bjdc' && BET.collect) {
      for (var i = 0; i < BET.collect.length; i++) {
        $('#j-data-body .j-data-dd[leaguename=' + BET.collect[i] + ']').hide();
      };

    }

  }

  /**
   * 创建数据主体
   * @param  {Object} data 对阵数据对象
   * @return {String}      生成数据主体HTML
   */
  function createDateMain(data, dTime) {

    var arr = [];
    var dataLeftCommon = [];
    var line = '';
    var item = null;
    var nextItem = null;
    var tab = BET.tab;
    var bfLine = '';
    var itemDgBool, nextItemDgBool, itemGgBool, nextItemGgBool;
    var tmpHtml1, tmpHtml2, tmpHtml3, tmpHtml4, tmpHtml5, tmpAllStopHtml;

    for (var i = 0, len = data.length; i < len; i++) {

      item = data[i];
      nextItem = null;
      if (i < len - 1) {
        nextItem = data[i + 1];
      }



      if (item[tab] == 1) {
        bfLine = '<button class="btn j-show-bf"></button>';
      } else {
        bfLine = '<b class="no-support">本场对阵不支持该玩法</b>';
      }

      dataLeftCommon = getDataLeftCommon(item, dTime);
      arr = arr.concat(dataLeftCommon);

      if (tab === 'bf') {

        /*arr.push('<span class="row1 row1-1 dg-hint-nbot j-dg-hint-nbot">' + bfLine + '<i class="icon icon-green-tri-2"></i><i class="dan-tips">单</i></span></dd>');*/

        //某一场对阵相同的玩法，过关、单场都不停售，且不是最后一行，底边框要没有
        tmpHtml1 = '<span class="row1 row1-1 dg-hint-nbot j-dg-hint-nbot j-dg-sale" dg-sale="1" gg-sale="1">' + bfLine + '<i class="icon icon-green-tri-2"></i><i class="dan-tips">单</i></span></dd>';

        //某一场对阵相同的玩法，过关、单场都不停售，或没有下一行，底边框要有
        tmpHtml2 = '<span class="row1 row1-1 dg-hint j-dg-hint j-dg-sale" dg-sale="1" gg-sale="1">' + bfLine + '<i class="icon icon-green-tri-2"></i><i class="dan-tips">单</i></span></dd>';

        //某一场对阵相同的玩法，过关不停售、单场停售，前端显示这场对阵，但选择单关投注时隐藏单关过关方式
        tmpHtml3 = '<span class="row1 row1-1 j-dg-sale" dg-sale="0" gg-sale="1">' + bfLine + '</span></dd>';

        //某一场对阵相同的玩法，过关停售、单场不停售，前端显示这场对阵，但选择串关投注时隐藏串关过关方式；且不是最后一行，底边框要没有
        tmpHtml4 = '<span class="row1 row1-1 dg-hint-nbot j-dg-hint-nbot j-dg-sale" dg-sale="1" gg-sale="0">' + bfLine + '<i class="icon icon-green-tri-2"></i><i class="dan-tips">单</i></span></dd>';

        //某一场对阵相同的玩法，过关停售、单场不停售，前端显示这场对阵，但选择串关投注时隐藏串关过关方式；或没有下一行，底边框要有
        tmpHtml5 = '<span class="row1 row1-1 dg-hint j-dg-hint j-dg-sale" dg-sale="1" gg-sale="0">' + bfLine + '<i class="icon icon-green-tri-2"></i><i class="dan-tips">单</i></span></dd>';

        tmpAllStopHtml = '<span class="row1 row1-1 j-dg-sale ggdg-all-stop" dg-sale="0" gg-sale="0">本场对阵不支持该玩法</span></dd>'

        jointArr(item, nextItem, 'bf_dg_sale', 'bf', tmpHtml1, tmpHtml2, tmpHtml3, tmpHtml4, tmpHtml5, tmpAllStopHtml, arr, i, len);


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

        tmpHtml1 = '<span class="co6-1 btnBox towLine dg-hint-nbot j-dg-hint-nbot j-dg-sale" dg-sale="1" gg-sale="1"><div class="line1"><em class="rq">' + rqspfNum + '</em>' + line + '</div><i class="icon icon-green-tri-2"></i><i class="dan-tips">单</i></span></dd>';
        tmpHtml2 = '<span class="co6-1 btnBox towLine dg-hint j-dg-hint j-dg-sale" dg-sale="1" gg-sale="1"><div class="line1"><em class="rq">' + rqspfNum + '</em>' + line + '</div><i class="icon icon-green-tri-2"></i><i class="dan-tips">单</i></span></dd>';
        tmpHtml3 = '<span class="co6-1 btnBox towLine j-dg-sale" dg-sale="0" gg-sale="1"><div class="line1"><em class="rq">' + rqspfNum + '</em>' + line + '</div></span></dd>';
        tmpHtml4 = '<span class="co6-1 btnBox towLine dg-hint-nbot j-dg-hint-nbot j-dg-sale" dg-sale="1" gg-sale="0"><div class="line1"><em class="rq">' + rqspfNum + '</em>' + line + '</div><i class="icon icon-green-tri-2"></i><i class="dan-tips">单</i></span></dd>';
        tmpHtml5 = '<span class="co6-1 btnBox towLine dg-hint j-dg-hint j-dg-sale" dg-sale="1" gg-sale="0"><div class="line1"><em class="rq">' + rqspfNum + '</em>' + line + '</div><i class="icon icon-green-tri-2"></i><i class="dan-tips">单</i></span></dd>';
        tmpAllStopHtml = '<span class="co6-1 btnBox towLine j-dg-sale ggdg-all-stop" dg-sale="0" gg-sale="0">本场对阵不支持该玩法</span></dd>';

        jointArr(item, nextItem, 'rqspf_dg_sale', 'rqspf', tmpHtml1, tmpHtml2, tmpHtml3, tmpHtml4, tmpHtml5, tmpAllStopHtml, arr, i, len);

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

        tmpHtml1 = '<span class="co6-1 btnBox towLine dg-hint-nbot j-dg-hint-nbot j-dg-sale" dg-sale="1" gg-sale="1"><div class="line1"><em class="rq">' + bjdcSpfRq + '</em>' + line + '</div><i class="icon icon-green-tri-2"></i><i class="dan-tips">单</i></span></dd>';
        tmpHtml2 = '<span class="co6-1 btnBox towLine dg-hint j-dg-hint j-dg-sale" dg-sale="1" gg-sale="1"><div class="line1"><em class="rq">' + bjdcSpfRq + '</em>' + line + '</div><i class="icon icon-green-tri-2"></i><i class="dan-tips">单</i></span></dd>';
        tmpHtml3 = '<span class="co6-1 btnBox towLine j-dg-sale" dg-sale="0" gg-sale="1"><div class="line1"><em class="rq">' + bjdcSpfRq + '</em>' + line + '</div></span></dd>';
        tmpHtml4 = '<span class="co6-1 btnBox towLine dg-hint-nbot j-dg-hint-nbot j-dg-sale" dg-sale="1" gg-sale="0"><div class="line1"><em class="rq">' + bjdcSpfRq + '</em>' + line + '</div><i class="icon icon-green-tri-2"></i><i class="dan-tips">单</i></span></dd>';
        tmpHtml5 = '<span class="co6-1 btnBox towLine dg-hint j-dg-hint j-dg-sale" dg-sale="1" gg-sale="0"><div class="line1"><em class="rq">' + bjdcSpfRq + '</em>' + line + '</div><i class="icon icon-green-tri-2"></i><i class="dan-tips">单</i></span></dd>';
        tmpAllStopHtml = '<span class="co6-1 btnBox towLine j-dg-sale ggdg-all-stop" dg-sale="0" gg-sale="0">本场对阵不支持该玩法</span></dd>';

        jointArr(item, nextItem, 'spf_dg_sale', 'spf', tmpHtml1, tmpHtml2, tmpHtml3, tmpHtml4, tmpHtml5, tmpAllStopHtml, arr, i, len);

      }

      if (tab === 'bqc') {

        /*arr.push('<span class="row2 row2-1">' + line + '</span></dd>');*/

        tmpHtml1 = '<span class="row2 row2-1 dg-hint-nbot j-dg-hint-nbot j-dg-sale" dg-sale="1" gg-sale="1">' + line + '<i class="icon icon-green-tri-1"></i></span></dd>';
        tmpHtml2 = '<span class="row2 row2-1 dg-hint j-dg-hint j-dg-sale" dg-sale="1" gg-sale="1">' + line + '<i class="icon icon-green-tri-1"></i></span></dd>';
        tmpHtml3 = '<span class="row2 row2-1 j-dg-sale" dg-sale="0" gg-sale="1">' + line + '</span></dd>';
        tmpHtml4 = '<span class="row2 row2-1 dg-hint-nbot j-dg-hint-nbot j-dg-sale" dg-sale="1" gg-sale="0">' + line + '<i class="icon icon-green-tri-1"></i></span></dd>';
        tmpHtml5 = '<span class="row2 row2-1 dg-hint j-dg-hint j-dg-sale" dg-sale="1" gg-sale="0">' + line + '<i class="icon icon-green-tri-1"></i></span></dd>';
        tmpAllStopHtml = '<span class="row2 row2-1 j-dg-sale ggdg-all-stop" dg-sale="0" gg-sale="0">本场对阵不支持该玩法</span></dd>';

        jointArr(item, nextItem, 'bqc_dg_sale', 'bqc', tmpHtml1, tmpHtml2, tmpHtml3, tmpHtml4, tmpHtml5, tmpAllStopHtml, arr, i, len);

      }

      if (tab === 'zjq') {

        /*arr.push('<span class="row3 row3-1">' + line + '</span></dd>');*/

        tmpHtml1 = '<span class="row3 row3-1 dg-hint-nbot j-dg-hint-nbot j-dg-sale" dg-sale="1" gg-sale="1">' + line + '<i class="icon icon-green-tri-1"></i></span></dd>';
        tmpHtml2 = '<span class="row3 row3-1 dg-hint j-dg-hint j-dg-sale" dg-sale="1" gg-sale="1">' + line + '<i class="icon icon-green-tri-1"></i></span></dd>';
        tmpHtml3 = '<span class="row3 row3-1 j-dg-sale" dg-sale="0" gg-sale="1">' + line + '</span></dd>';
        tmpHtml4 = '<span class="row3 row3-1 dg-hint-nbot j-dg-hint-nbot j-dg-sale" dg-sale="1" gg-sale="0">' + line + '<i class="icon icon-green-tri-1"></i></span></dd>';
        tmpHtml5 = '<span class="row3 row3-1 dg-hint j-dg-hint j-dg-sale" dg-sale="1" gg-sale="0">' + line + '<i class="icon icon-green-tri-1"></i></span></dd>';
        tmpAllStopHtml = '<span class="row3 row3-1 j-dg-sale ggdg-all-stop" dg-sale="0" gg-sale="0">本场对阵不支持该玩法</span></dd>';

        jointArr(item, nextItem, 'zjq_dg_sale', 'zjq', tmpHtml1, tmpHtml2, tmpHtml3, tmpHtml4, tmpHtml5, tmpAllStopHtml, arr, i, len);

      }

      if (tab === 'sxds') {
        arr.push('<span class="row5">' + line + '</span></dd>');
      }

    };

    return arr.join('');

  }

  function jointArr(item, nextItem, dgFlag, ggFlag, tmpHtml1, tmpHtml2, tmpHtml3, tmpHtml4, tmpHtml5, tmpAllStopHtml, arr, i, len) {
    var itemDgBool, nextItemDgBool, itemGgBool, nextItemGgBool;

    if (item[dgFlag]) {
      itemDgBool = !!Number(item[dgFlag]);
    }

    if (nextItem && nextItem[dgFlag]) {
      nextItemDgBool = !!Number(nextItem[dgFlag]);
    }

    if (item[ggFlag]) {
      itemGgBool = !!Number(item[ggFlag]);
    }

    if (nextItem && nextItem[ggFlag]) {
      nextItemGgBool = !!Number(nextItem[ggFlag]);
    }
    if (!itemDgBool && !itemGgBool) {

      //某一场对阵相同的玩法，过关、单场都停售，则前端不显示这场对阵
      arr.push(tmpAllStopHtml);

    } else if (itemGgBool && itemDgBool && nextItem && nextItemDgBool) {

      //过关、单关都不停售。有下一行，且下一行，单关不停售，过关不用管，不要底边框
      arr.push(tmpHtml1);

    } else if (itemGgBool && itemDgBool && nextItem && !nextItemDgBool) {

      //过关、单关都不停售。有下一行，且下一行，单关停售，过关不用管，要底边框
      arr.push(tmpHtml2);

    } else if (itemGgBool && itemDgBool && !nextItem) {

      //过关、单关都不停售。没有下一行，要底边框
      arr.push(tmpHtml2);

    } else if (itemGgBool && !itemDgBool) {

      //某一场对阵相同的玩法，过关不停售、单场停售，前端显示这场对阵，但选择单关投注时隐藏单关过关方式
      arr.push(tmpHtml3);

    } else if (!itemGgBool && itemDgBool && nextItem) {

      //某一场对阵相同的玩法，过关停售、单场不停售，前端显示这场对阵，但选择串关投注时隐藏串关过关方式；且不是最后一行，底边框要没有
      arr.push(tmpHtml4);

    } else if (!itemGgBool && itemDgBool && !nextItem) {

      //某一场对阵相同的玩法，过关停售、单场不停售，前端显示这场对阵，但选择串关投注时隐藏串关过关方式；且没有下一行，底边框要有
      arr.push(tmpHtml5);

    }

  }

  /**
   * 返回一列通用左侧html
   * @param  {Object} item 对阵数据对象
   * @return {String}      html
   */
  function getDataLeftCommon(item, dTime) {

    var isExpired = '';

    if (Config.lotyName === 'bjdc' && item.is_expired == 1) {
      isExpired = 'bjdc-expired';
    }

    var arr = [];
    var bjdcSpfStyle = 'isSpfShow';

    if (Number(item.rqspf_rangqiu_num) !== 0) {
      bjdcSpfStyle = 'isRqspfShow';
    }

    arr.push('<dd data-time="' + dTime + '" isstop="0" matchcode="' + item.match_key + '" matchnumcn="' + item.week + item.game_order + '" starttime="' + item.game_start_time + '" endtime="' + item.end_time + '" isdg="0,1,0,0,0" hostname="' + item.home_short + '" guestname="' + item.away_short + '" leaguename="' + item.league + '" class="j-data-dd ' + isExpired + ' ' + bjdcSpfStyle + '">');

    arr.push('<span class="co1"><i class="jtip" inf="' + item.week + item.game_order + '">' + item.week + item.game_order + '</i></span>');

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
  function createHhtzHtml(data, dTime) {

    if (!data) {
      return '';
    }

    var arr = [];
    var dataLeftCommon = [];
    var item = null;

    for (var i = 0, len = data.length; i < len; i++) {

      item = data[i];
      dataLeftCommon = getDataLeftCommon(item, dTime);
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

  function initDsDataBody() {
    var dataBodyHTML = '';

    for (var key in jczqData) {
      if (jczqData.hasOwnProperty(key)) {
        dataBodyHTML += createDsDataBody(jczqData[key], key);
      }
    }

    if (serverTime == 0) {
      $('.j-ds-databody').html(dataBodyHTML);
    } else {
      //$('#j-data-body .data-loadbox').html(Config.lotyCNName + ' 暂停销售');
    }

  }

  function createDsDataBody(data, d) {

    var time = APP.dateFormat(new Date(d * 1000), '%Y-%M-%d', true) + ' ' + data[0].week;
    var dataCount = data.length;

    var h = '';
    var bTime = '12:00';

    // head
    h += '<dl><dt>' + time + '(' + bTime + ' -- 次日' + bTime + ')<span class="j-match-size matchSize">' + dataCount + '</span>场比赛可投注<span class="cuspText fc-84 j-ds-databody-toggle pull-right" data-show="1"><span class="j-nav-text">隐藏</span><i class="icon show-icon"></i></span></dt>';

    h += createDsDateMain(data, d);

    // foot
    h += '</dl>'
    return h;

  }

  function createDsDateMain(data, dTime) {
    var arr = [];
    var tab = $('#j-dssc-nav li.active').find('a').attr('data-game');
    var item = null;
    var co3Html = '';
    var spArr = [];
    var isExpired = '';

    arr.push('<dd class="clearfix">');
    for (var i = 0, len = data.length; i < len; i++) {

      item = data[i];

      if (item.is_expired == 1) {
        isExpired = 'jczq-expired';
      }

      spArr = item.spf_gg_sp.split('|');

      if (tab === 'spf') {
        co3Html = '<em class="co3">（' + item.rqspf_rangqiu_num + '）' + item.end_time + '</em>';
      } else if (tab === 'rqspf') {
        co3Html = '<em class="co3">' + item.end_time + '</em>';
      }

      arr.push('<span class="game-span j-game-span ' + isExpired + '" sp3="' + spArr[0] + '" sp1="' + spArr[1] + '" sp0="' + spArr[2] + '" data-time="' + dTime + '" matchcode="' + item.match_key + '" matchnumcn="' + item.week + item.game_order + '" starttime="' + item.game_start_time + '" endtime="' + item.end_time + '" isdg="0,1,0,0,0" hostname="' + item.home_short + '" guestname="' + item.away_short + '" leaguename="' + item.league + '">');

      arr.push('<em class="co1" inf="' + item.week + item.game_order + '">' + item.week + item.game_order + '</em>');

      arr.push('<em class="co2">' + item.home_short + '</em>');

      arr.push(co3Html);

      arr.push('<em class="co3">' + item.away_short + '</em>');

      arr.push('</span>');

    }
    return arr.join('');

  }


  // 创建数据主体HTML
  function createDataBody(data, d) {

    var time = APP.dateFormat(new Date(d * 1000), '%Y-%M-%d', true) + ' ' + data[0].week;
    var dataCount = data.length;

    var h = '';
    var bTime = '12:00';

    if (Config.lotyName === 'bjdc') {
      bTime = '10:00';
    }

    // head
    h += '<dl><dt>' + time + '(' + bTime + ' -- 次日' + bTime + ')<span class="j-match-size matchSize">' + dataCount + '</span>场比赛可投注<span class="cuspText fc-84 j-dataBody-toggle pull-right" data-show="1"><span class="j-nav-text">隐藏</span><i class="icon show-icon"></i></span></dt>';
    if (BET && BET.tab && BET.tab === 'hhtz') {
      h += createHhtzHtml(data, d);
    } else {
      h += createDateMain(data, d);
    }

    // foot
    h += '</dl>'
    return h;
  }

  // Toggle Buy Type
  $('#j-vote-nav').on('click', 'a', function(event) {

    var type = $(this).attr('data-type');
    var tab = $(this).attr('data-game');
    var newClass = 'bettingBox clearfix ' + type;

    switch (type) {
      case 'onlyHhtz':
        $('.j-unSeleTips').text('请在左侧至少选择2场比赛');
        $('.j-dg-choose').hide();
        $('.j-mt-left').addClass('mt12');
        $('.j-mt-right').removeClass('mt35').addClass('mt12');
        break;
      default:
        $('.j-unSeleTips').text('请在左侧列表中选择投注比赛');
        $('.j-dg-choose').show();
        $('.j-dg-tips').find('input[type="checkbox"]').prop({
          'checked': true
        });
        $('.j-dg-itips').show();
        $('.j-mt-left').removeClass('mt12');
        $('.j-mt-right').removeClass('mt12').addClass('mt35');
        break;
    }

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

    if (Config.lotyName === 'bjdc') {

      var st = bjdc[BET.tab + 'StopStatus'];
      var bdMidStop = $('.j-bd-mid').eq(2);

      bjdc.stopShow = st;
      filterBjdc();

      if (st) {
        bdMidStop.attr('data-ac', 1);
        bdMidStop.removeClass('icon-bd').addClass('icon-bd2');
        $('#j-toggle-allmatch').attr('data-status', 0);
        $('#j-toggle-allmatch').text('隐藏全部场次');
      } else {
        bdMidStop.attr('data-ac', 0);
        bdMidStop.removeClass('icon-bd2').addClass('icon-bd');
        $('#j-toggle-allmatch').attr('data-status', 1);
        $('#j-toggle-allmatch').text('显示全部场次');
      }

      updateMidMatchUi();
    }

    $('#j-collect-body .j-data-dd').remove();
    updateAfterCollectUi();
  });

  //Toggle单式上传
  $('#j-dssc-nav').on('click', 'a', function(event) {
    var type = $(this).attr('data-type');
    var tab = $(this).attr('data-game');

    $('#j-dssc-nav .active').removeClass('active');
    $(this).parents('li').addClass('active');

    initDsDataBody();

    BET.clearBetData();

  });

  $('#j-hd-nav').on('click', 'a', function(event) {
    var t = $(this);
    BET.navType = t.attr('nav-type');
    t.siblings('a').removeClass('active');
    t.addClass('active');
    switch (BET.navType) {
      case 'dg':
        $('#j-vote-nav').find('a[data-type="onlyHhtz"]').hide();
        $('.j-unSeleTips').text('请在左侧列表中选择投注比赛');
        $('#j-vote-nav').find('a[data-type="onlySpf"]').click();
        $('#j-vote-nav').show(); //过关投注和单关的导航栏
        $('#j-left-box').show(); //过关投注和单关的left
        $('#j-right-box').show(); //过关投注和单关的right
        $('#j-dssc-nav').hide(); //单式上传的导航栏
        $('#j-ddsc-box').hide(); //单式上传box
        initDataBody();
        break;
      case 'ggtz':
        $('#j-vote-nav').find('a[data-type="onlyHhtz"]').show();
        $('#j-vote-nav').find('a[data-type="onlySpf"]').click();
        $('#j-vote-nav').show();
        $('#j-left-box').show();
        $('#j-right-box').show();
        $('#j-dssc-nav').hide();
        $('#j-ddsc-box').hide();
        initDataBody();
        break;
      case 'dssc':
        $('.j-unSeleTips').show();
        $('.j-unSeleTips').text('请在左侧至少选择2场比赛');
        $('#j-vote-nav').hide();
        $('#j-left-box').hide();
        $('#j-right-box').hide();
        $('#j-dssc-nav').show();
        $('#j-ddsc-box').show();
        $('.j-ds-databody .j-game-span').removeClass('active');
        initDsDataBody();
        break;
    }

    BET.clearBetData();

    BET.updateMidDsMatchUi();

  });

  $('#j-ddsc-box').on('click', '.j-upfile', function(event) {
    var btnType = $(this).attr('btn-type');
    switch (btnType) {
      case 'small':
        if (!BET.bunch.length) {
          showTipMask();
          return false;
        }
        break;
    }
  });

  $('#j-ddsc-box').on('click', '.j-dsljtz', function(event) {
    if (BET.match.length < 2) {
      APP.showTips('请在左侧至少选择2场比赛');
      return;
    }

    if (!BET.bunch.length) {
      showTipMask();
      return;
    }
    if ($('.j-file-name').text() == '') {
      APP.showTips('请上传文件！');
      return;
    }

    var xzccRightBox = $('#j-xzcc-right-box');
    var playGame = $('#j-dssc-nav li.active a').attr('data-game'); //玩法
    var beishu = BET.beishu; //倍数
    var content = [];
    var unikey = $.now();
    var chuan = [];
    var chuanNum = [];
    var data;
    var money = xzccRightBox.find('.j-totalMoney').text();
    var file_id;
    var type = '';
    Config.payMoney = money;

    $('.j-sc-choose input[type="radio"]').each(function() {
      var t = $(this);
      if (t.prop('checked')) {
        type = t.attr('data-type');
      }
    });

    xzccRightBox.find('.j-method-ls li.active').each(function() {
      var t = $(this);
      chuan.push(t.text());
      chuanNum.push(t.attr('data-method'));
    });
    var html = '<div class="frbox"><img src="http://static3.yuncai.com/front_images/fail.png" alt="success" class="icon"><div class="text"><p>投注金额：<strong class="fc-3 mlr5">' + xzccRightBox.find('.j-totalMoney').text() + '</strong>元，投注：<strong class="mlr5">' + xzccRightBox.find('.j-quick-bei').val() + '</strong>倍</p><p>过关方式：' + chuan.join(',') + '</p></div></div>';

    BET.zhushu = BET.upFileResData.data.length;
    BET.dsscBox.find('.j-gameZhu').text(BET.zhushu);
    data = BET.upFileResData.data;
    file_id = BET.upFileResData.file_id;

    content = BET.dsGetContent();

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



  /**
   * 购票函数
   * @param  {Object} obj      购彩参数
   * @param  {String} type     购票类型 自购,合买
   * @param  {String} lotyName 彩种类型
   * @return {null}
   */
  var buyTicket = function(obj, type, lotyName) {

    var u = 'jingcai';

    if (lotyName === 'bjdc') {
      u = 'bjdc';
      obj['qihaoId'] = _.escape($.trim($('#j-qihao-id').val()));
      obj['qihao'] = _.escape($.trim($('#j-qihao').val()));
    }

    obj.unikey = $.now();

    $.ajax({
        url: '/lottery/' + u + '/' + type + '/' + lotyName + '/' + BET.tab,
        type: 'POST',
        dataType: 'json',
        data: obj
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
  };

  /**
   * 底部提示切换
   * @return {null}
   *
   */
  var showTipMask = function() {
    var $rightBox;
    switch (BET.navType) {
      case 'dssc':
        $rightBox = $('#j-xzcc-right-box');
        break;
      default:
        $rightBox = $('#j-right-box');
        break;
    }
    var b = $rightBox.find('.j-game-method');
    var top = b[0].offsetTop;
    var m = $rightBox.find('.j-tipMark');
    var $noMethod = $('.j-no-method');
    $noMethod.show();
    $noMethod.css({
      fontSize: '12',
      textAlign: 'center'
    });
    m.css({
      display: 'block',
      width: b.width(),
      height: b.height(),
      top: top
    });

    var count = 0;
    var times = function() {
      m.fadeToggle('fast', function() {});
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
  var checkParams = function() {

    var matchLen = _.uniq(BET.match, 'matchcode').length;
    var navType = BET.navType;
    var upfile = $('#j-xzcc-right-box').find('.j-file-name').text();

    var ccType = '';
    $('.j-sc-choose input[type="radio"]').each(function() {
      var t = $(this);
      if (t.prop('checked')) {
        ccType = t.attr('data-type');
      }
    });
    if (ccType == '2') {
      return true;
    }


    if (matchLen > 15) {
      APP.showTips('您好，投注场次不得超过15场哦');
      return false;
    }
    if (!BET.isAgreen) {
      APP.showTips('请先阅读并同意《委托投注规则》后才能继续');
      return false;
    }
    if (matchLen < 1 && Config.lotyName === 'jczq' && navType != 'dssc') {
      APP.showTips('请在左侧至少选择1场比赛');
      return false;
    }

    if (matchLen < 2 && Config.lotyName === 'jczq' && navType == 'dssc') {
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
    if (navType == 'dssc' && ccType == '1' && !upfile) {
      APP.showTips('请上传文件！');
      return false;
    }

    return true;
  };

  // 初始化用户收藏 暂时不做
  function gameSeleListInit() {

    var start = store.get('startArr');

    if (start) {

      $('.j-gameSeleList li').each(function(index, el) {

        if (_.indexOf(start, $.trim($(this).text())) >= 0) {

          $(this).trigger('click');

        }

      });

      // $('.gameSelect dd').each(function(index, el) {
      //   if (_.indexOf(start, $(this).attr('leaguename')) < 0) {
      //     $(this).hide();
      //   } else {
      //     $(this).show();
      //   }
      // });

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
  $('#j-fqhmBtn').on('click', function(event) {

    var obj = BET.getSubmitParams();
    var c = null;
    var html = '';
    var bunch = obj.bunch.replace(/\_/g, '串');
    bunch = bunch.replace('1串1', '单关');
    var tr = $('#selectGamePool tbody tr');
    var t = '';
    $('.j-share-num').val(obj.zhushu * 2 * obj.beishu);
    tr.each(function(index, el) {
      var e = tr.eq(index);
      if (index % 2 == 0) {
        t += '<tr><td>' + e.find('.t1').html() + '</td><td>' + e.find('.t2').html() + '</td>';
      } else {
        t += '<td>' + e.find('.betList').html() + '</td></tr>';
      }
    });

    //Config.payMoney = 1;
    c = checkParams();
    if (c) {

      buy(function() {

        html = '<p><b>投注金额：</b>总计<span id="j-total-money" class="fc-3 mlr-8">' + obj.zhushu * 2 * obj.beishu + '</span>元,共<span id="j-total-zhu">' + obj.zhushu + '</span>注,投注<span id="j-total-bei">' + obj.beishu + '</span>倍</p><p><b>过关方式：</b><span id="j-total-bunch">' + bunch + '</span>,理论最高奖金<span id="j-lilu-award" class="fc-3 mlr-8">' + BET.maxBonus + '</span>元</p>';
        $('#j-tips-table').html(t);
        $('#j-modal-text').html(html);
        H.setHeMaiTotal();
        $('#ballModal').removeClass('dsHmModal');
        $('#ballModal').find('.j-botBtn').find('button[data-type="1"]').attr('id', 'j-hemai');

        $('#ballModal').modal('show');

      }, obj);

    }

  });

  // 单式合买
  $('.j-dsfqhm').on('click', function(event) {
    var obj = BET.getDsSubmitParams();
    var c = null;
    var html = '';
    var bunch = obj.bunch.replace(/\_/g, '串');
    bunch = bunch.replace('1串1', '单关');

    $('.j-share-num').val(obj.zhushu * 2 * obj.beishu);


    //Config.payMoney = 1;
    c = checkParams();
    if (c) {

      buy(function() {

        html = '<p><b>投注金额：</b>总计<span id="j-total-money" class="fc-3 mlr-8">' + obj.zhushu * 2 * obj.beishu + '</span>元,共<span id="j-total-zhu">' + obj.zhushu + '</span>注,投注<span id="j-total-bei">' + obj.beishu + '</span>倍</p><p><b>过关方式：</b><span id="j-total-bunch">' + bunch + '</span>,理论最高奖金<span id="j-lilu-award" class="fc-3 mlr-8">' + BET.maxBonus + '</span>元</p>';
        $('#j-modal-text').html(html);
        H.setHeMaiTotal();
        $('#ballModal').addClass('dsHmModal');
        $('#ballModal').find('.j-botBtn').find('button[data-type="1"]').addClass('j-dsHemai');

        $('#ballModal').modal('show');

      }, obj);

    }

  });

  // 单式确认合买
  $(document).on('click', '.j-dsHemai', function(event) {

    var obj = BET.getDsSubmitParams();
    var type = 'buy-upload-together';

    var ccType = '';
    $('.j-sc-choose input[type="radio"]').each(function() {
      var t = $(this);
      if (t.prop('checked')) {
        ccType = t.attr('data-type');
      }
    });

    obj.shareNum = $('#ballModal .j-share-num').val();
    obj.buyNum = Number($('#ballModal .j-rengou').val());
    obj.aegisNum = Number($('#ballModal .j-baodi-text').val());

    obj.tichengPercent = $('#ipt_extraPercent').val();
    obj.shareLevel = $('#ballModal .br-set.active').attr('data-set');
    obj.projectTitle = $('#ballModal .j-project-title').val();
    obj.projectText = $('#ballModal .br-textarea').val();
    obj.type = ccType;
    obj.file_id = BET.upFileResData.file_id;

    Config.payMoney = obj.zhushu * 2 * obj.beishu / obj.shareNum * (obj.buyNum + obj.aegisNum);

    buy(function() {
      $('#myModal').modal('hide');
      buyTicket(obj, type, Config.lotyName);
    }, obj, true);

  });



  // 确认合买
  $(document).on('click', '#j-hemai', function(event) {

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

    buy(function() {
      $('#myModal').modal('hide');
      buyTicket(obj, type, Config.lotyName);
    }, obj, true);

  });

  function buy(cb, params, isHemai) {

    var lessMoneyTips = '';
    lessMoneyTips += '<p>' + Config.lotyCNName + '</p>';

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

  }

  // 立即购买
  $('#j-ljtzBtn').on('click', function(event) {
    var obj = BET.getSubmitParams();
    var vote = {};
    var c = null;
    var type = 'buy-self';
    var tr = $('#selectGamePool tbody tr');
    var tbodyHtml = '';
    var bunch = obj.bunch.replace(/\_/g, '串');
    var danIsActive, t2Html;
    bunch = bunch.replace('1串1', '单关');
    tr.each(function(index, el) {
      var e = tr.eq(index);
      danIsActive = e.find('.j-dan') ? e.find('.j-dan').hasClass('active') : false;
      if (index % 2 == 0) {
        if (danIsActive) {
          t2Html = e.find('.t2').html();
        } else {
          t2Html = e.find('.t2-left').html() + e.find('.t2-right').html();
        }
        tbodyHtml += '<tr><td>' + e.find('.t1').html() + '</td><td>' + t2Html + '</td>';
      } else {
        tbodyHtml += '<td>' + e.find('.betList').html() + '</td></tr>';
      }
    });

    Config.payMoney = BET.zhushu * 2 * BET.beishu;

    vote.title = '投注信息确认';
    vote.confirmHtml = '<div class="ljtz-box"><div class="text"><p>投注金额：总计<span class="fc-3">' + Config.payMoney + '</span>元，共' + obj.zhushu + '注，投注' + obj.beishu + '倍</p><div class="ljtz-main" id="j-ljtz-box"><table class="table table-bordered"><thead><tr><th>场次</th><th class="gameTeam">主队 VS 客队</th><th style="width:150px;">投注内容</th></tr></thead><tbody>' + tbodyHtml + '</tbody></table></div><p>过关方式：' + bunch + ', 理论最高奖金：<span class="fc-3">' + BET.maxBonus + '</span>元</p><div class="btns"><button class="btn btn-danger" id="buyConfirm">确定</button><button class="btn btn-gray" data-dismiss="modal">取消</button></div></div></div>';

    c = checkParams();

    if (c) {

      buy(function() {

        APP.showTips({
          html: vote.confirmHtml,
          title: vote.title
        });

        $('#j-ljtz-box').mCustomScrollbar({
          theme: "light-3",
          mouseWheelPixels: 200
        });

        $('#buyConfirm').one('click', function(event) {

          buyTicket(obj, type, Config.lotyName);
        });

      }, obj);

    };

  });

});