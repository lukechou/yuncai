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

  // 返回顶部
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

  // 顶部导航 悬浮
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

  //页面初始化
  function pageInit() {
    var matchCount = [];
    // 停售检测
    if (serverTime == 1) {

      APP.showStopSellModal(Config.lotyCNName);
      $('#j-ljtzBtn,#j-fqhmBtn').addClass('btn-stop').html('暂停销售');
      $('#j-ljtzBtn').attr('id', '');
      $('#j-fqhmBtn').remove();
      $('#j-data-body .data-loadbox').html(Config.lotyCNName + ' 暂停销售');

    } else {

      // 初始化表单
      for (var prop in jczqData) {
        if (jczqData.hasOwnProperty(prop)) {
          matchCount.push(jczqData[prop]);
        }
      }

      if (matchCount.length) {
        initDataBody();
      } else {
        $('#j-data-body').html('<div class="data-loadbox">温馨提示：今天暂无比赛，去“<a href="/lottery/buy/jczq">竞彩足球</a>”看看吧</div>');
      }
    }

    scrollUp.init();
    scrollMenu.init();
  }

  pageInit();

  //Icon Tips
  $('.icon').tipsy({
    gravity: 's',
    html: true,
    opacity: 1
  });

  //UI 下拉框
  $('#poolStep1 .scrollMoni').mCustomScrollbar({
    theme: "light-3",
    mouseWheelPixels: 200
  });

  $('#j-ball-table').mCustomScrollbar({
    theme: "light-3",
    mouseWheelPixels: 200
  });

  //赛事筛选切换
  $('#j-show-option').hover(function() {
    $(this).addClass('hovered');
    $('#gameSeleList').show();

  }, function() {
    $(this).removeClass('hovered');
    $('#gameSeleList').hide();
  });

  // 收藏星星 点击事件
  $('#gameSeleList').on('click', 'li', function(event) {

    var isAllHide = false;
    var t = $(this);
    var matchTypeText = _.escape($.trim(t.text()));
    var ac = 'active';

    // 切换星星颜色,赛事筛选数据
    if (t.hasClass(ac)) {
      _.remove(BET.collect, function(chr) {
        return chr === matchTypeText;
      });
      t.removeClass(ac);
      updateAfterCollectUi(true);
    } else {
      BET.collect.push(matchTypeText);
      t.addClass(ac);
      updateAfterCollectUi(false);
    }

    $('.j-show-hhtz').removeClass('active');
    $('.j-bf-box').hide();

    return;

  });

  //普通过关,组合过关切换
  $('#j-gg-tab').on('click', 'li', function(event) {

    var t = $(this);
    var isZhBunch = Number(t.attr('data-bunch'));
    var tipsArr = ['请选择至少一场比赛进行投注', '请选择至少两场比赛进行投注'];
    if (!t.hasClass('active')) {
      BET.bunch = [];
      BET.setAllTotal();
    };

    $('#j-gg-tab li').removeClass('active');
    t.addClass('active');

    $('.j-unselect-tips').html(tipsArr[isZhBunch]);
    if (isZhBunch) {
      BET.bjdcPassWay = false;
      BET.setBjdcBox();
    } else {
      BET.bjdcPassWay = true;
      BET.setSecondBox();
    }

  });

  // 收藏确认按钮
  $('#j-match-collect').on('click', function(event) {

    var start = [];

    if ($('#gameSeleList .icon').hasClass('icon-cgou')) {

      $('#gameSeleList li.active').each(function(index, el) {
        start.push($.trim($(this).text()));
      });

      $('#gameSeleList').hide();

      setToggleBtn(start);

      store.set('jclqStartArr', start);

    } else {

      store.clear('jclqStartArr');

    }

  });

  // 是否记住收藏信息 暂时不做
  $('#gameSeleList').on('click', '.icon', function(event) {

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

  // Toggle Buy Type
  $('#j-vote-nav').on('click', 'a', function(event) {
    var matchCount = [];
    var type = $(this).attr('data-type');
    var gameTab = $(this).attr('data-game');
    var c = 'bettingBox clearfix ' + type;

    $('#j-vote-nav .active').removeClass('active');
    $(this).parents('li').addClass('active');

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

    BET.toggleNav(gameTab, c);

    for (var prop in jczqData) {
      if (jczqData.hasOwnProperty(prop)) {
        matchCount.push(jczqData[prop]);
      }
    }

    if (matchCount.length) {
      initDataBody();
    } else {
      $('#j-data-body').html('<div class="data-loadbox">温馨提示：今天暂无比赛，去“<a href="/lottery/buy/jczq">竞彩足球</a>”看看吧</div>');
    }

    $('#j-collect-body .j-data-dd').remove();
    updateAfterCollectUi();

  });

  /** Common Event Bind End */

  // 更新收藏后 界面
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
      var matchcode = t.attr('matchcode');
      var onCollectBody = t.parents('#j-collect-body').length;

      if (_.indexOf(start, t.attr('leaguename')) < 0) {

        dataBody.find('.j-data-dd[matchcode=' + matchcode + ']').show();
        dataBody.find('.j-bf-box[matchcode=' + matchcode + ']').show();

        // 混合投注 和 比分 额外处理
        if (BET.tab === 'hhtz') {

          if (t.find('.j-sp-btn.active').length > 0) {

            var matchcode = t.attr('matchcode');
            var bfNearBox = $('#j-data-body .j-data-dd[matchcode=' + matchcode + ']');
            bfNearBox.find('.j-show-hhtz').addClass('has');
            bfNearBox.find('.row1-1').removeClass('on');

          }

        }

      } else {

        // 收藏

        //不在收藏里的
        collectObj.push(t.clone());
        t.hide();

        // 混合投注处理
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

  //底部提示切换
  var showTipMask = function() {
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
    var times = function() {
      m.fadeToggle('fast', function() {});
      if (count > 5) {
        clearInterval(f);
      }
      count++
    };
    var f = setInterval(times, 100);
  };

  function setToggleBtn(start) {

    var t = $('.j-dataBody-toggle');

    if (start.length == 0) {
      t.html('展开').attr('data-show', 0);
    } else {
      t.html('隐藏').attr('data-show', 1);
    }

  }

  /*****************交易区相关 Start******************/

  function getSfButton(ggFlag, sp, dgFlag, itemDgBool, nextItemDgBool, itemGgBool, nextItemGgBool, nextItem) {
    var result = '';
    var spArr = sp.split('|');
    var titleArr = BET[BET.tab + 'SpValueArr'];
    var btnEvent = 'j-sp-btn';
    var emHtml = '';
    var tmpTopHtml1, tmpTopHtml2, tmpTopAllStopHtml;
    var tmpBotHtml1, tmpBotHtml2, tmpBotHtml3;

    if (spArr.length !== 2) {
      spArr = ['--', '--'];
      btnEvent = '';
    }

    for (var i = spArr.length - 1; i >= 0; i--) {

      emHtml = '<em index="' + i + '" data-item="' + titleArr[i] + '" gametype="' + BET.tab + '" sp="' + spArr[i] + '" class="' + btnEvent + ' sp-btn"><i class="cm-sp-l">' + titleArr[i] + '</i><i class="cm-sp-r">' + spArr[i] + '</i></em>';

      //过关、单关都不停售，top要边框
      //过关停售、单关不停售，top要边框
      tmpTopHtml1 = '<span class="row-sf row-dg-top j-dg-sale j-dg-hint-top" dg-sale="' + dgFlag + '" gg-sale="' + ggFlag + '">' + emHtml + '<s class="icon icon-green-tri-2"></s><s class="dan-tips">单</s></span>';

      //过关不停售、单关停售，top不用边框
      tmpTopHtml2 = '<span class="row-sf j-dg-sale" dg-sale="' + dgFlag + '" gg-sale="' + ggFlag + '">' + emHtml + '</span>';

      //过关、单关都停售，top不用边框
      tmpTopAllStopHtml = '<span class="row-sf row-dg-stop j-dg-sale" dg-sale="' + dgFlag + '" gg-sale="' + ggFlag + '">本场对阵不支持该玩法</span>';


      //过关、单关都不停售。有下一行，且下一行，单关不停售，过关不用管，不要底边框
      //过关停售、单场不停售，前端显示这场对阵，但选择串关投注时隐藏串关过关方式；且不是最后一行，底边框要没有
      tmpBotHtml1 = '<span class="row-sf row-dg-bot row-dg-nbot j-dg-hint-nbot j-dg-sale" dg-sale="' + dgFlag + '" gg-sale="' + ggFlag + '">' + emHtml + '</span>';

      //过关、单关都不停售。有下一行，且下一行，单关停售，过关不用管，要底边框
      //过关、单关都不停售。没有下一行，要底边框
      //过关停售、单场不停售，前端显示这场对阵，但选择串关投注时隐藏串关过关方式；且没有下一行，底边框要有
      tmpBotHtml2 = '<span class="row-sf row-dg-bot j-dg-sale j-dg-hint-bot" dg-sale="' + dgFlag + '" gg-sale="' + ggFlag + '">' + emHtml + '</span>';

      //过关不停售、单场停售，前端显示这场对阵，但选择单关投注时隐藏单关过关方式，不用边框
      tmpBotHtml3 = '<span class="row-sf j-dg-sale" dg-sale="' + dgFlag + '" gg-sale="' + ggFlag + '">' + emHtml + '</span>';

      //过关、单关都停售，为空
      result += joinResult(emHtml, tmpTopHtml1, tmpTopHtml2, tmpTopAllStopHtml, tmpBotHtml1, tmpBotHtml2, tmpBotHtml3, i, dgFlag, ggFlag, nextItem, nextItemDgBool);

    };

    return result;

  };

  function joinResult(emHtml, tmpTopHtml1, tmpTopHtml2, tmpTopAllStopHtml, tmpBotHtml1, tmpBotHtml2, tmpBotHtml3, i, dgFlag, ggFlag, nextItem, nextItemDgBool) {
    var result = '';
    if (i % 2 == 1) { //top的

      if (dgFlag == '1') {
        //过关、单关都不停售
        //过关停售、单关不停售
        result += tmpTopHtml1;

      } else if (ggFlag == '1' && dgFlag == '0') {
        //过关不停售、单关停售
        result += tmpTopHtml2;

      } else if (ggFlag == '0' && dgFlag == '0') {
        //过关、单关都停售
        result += tmpTopAllStopHtml;
      }

    } else { //bottom的

      /*
        bottom与top有所区别，因为要考虑底部边框问题，所以要判断有没有下一行：
        1.如果没有下一行，有单关就加单关边框，需要底边框，没有不用加
        2.如果有下一行，要判断下一行有没有单关，有单关，就不需要加底边框，没有，就加
        tmpBotHtml1 -- 有单关，没有底边框
        tmpBotHtml2 -- 有单关，有底边框
        tmpBotHtml3 -- 没有单关


        1.单关不停售
        2.过关不停售、单关停售
        3.过关、单关都停售
       */

      if (dgFlag == '1' && nextItem && nextItemDgBool) {
        //单关不停售，有下一行，且下一行有单关，不要底边框
        result += tmpBotHtml1;

      } else if ((dgFlag == '1' && nextItem && !nextItemDgBool) || (dgFlag == '1' && !nextItem)) {
        //单关不停售，有下一行，且下一行没有单关，要底边框
        //单关不停售，没有下一行，要底边框
        result += tmpBotHtml2;

      } else if (dgFlag == '0' && ggFlag == '1') {
        //过关不停售、单关停售
        result += tmpBotHtml3;

      } else if (dgFlag == '0' && ggFlag == '0') {
        //过关、单关都停售
        //result += tmpBotHtml3;
      }

    }

    return result;

  }


  function getRfsfButton(ggFlag, sp, rq, dgFlag, itemDgBool, nextItemDgBool, itemGgBool, nextItemGgBool, nextItem) {
    var result = '';
    var spArr = sp.split('|');
    var titleArr = BET[BET.tab + 'SpValueArr'];
    var rqColor = '';
    var btnEvent = 'j-sp-btn';
    var emHtml = '';
    var tmpTopHtml1, tmpTopHtml2, tmpTopAllStopHtml;
    var tmpBotHtml1, tmpBotHtml2, tmpBotHtml3;

    if (spArr.length !== 2) {
      spArr = ['--', '--'];
      btnEvent = '';
    }

    if (rq > 0) {
      rqColor = 'fc-3';
    } else {
      rqColor = 'fc-7';
    }

    result = '<em class="rq ' + rqColor + '">' + rq + '</em>';

    for (var i = spArr.length - 1; i >= 0; i--) {

      emHtml = '<em index="' + i + '" data-item="' + titleArr[i] + '" gametype="' + BET.tab + '" sp="' + spArr[i] + '" class="' + btnEvent + ' sp-btn"><i class="cm-sp-l">' + titleArr[i] + '</i><i class="cm-sp-r">' + spArr[i] + '</i></em>';

      tmpTopHtml1 = '<span class="row-rfsf row-dg-top j-dg-sale j-dg-hint-top" dg-sale="' + dgFlag + '" gg-sale="' + ggFlag + '">' + emHtml + '<s class="icon icon-green-tri-2"></s><s class="dan-tips">单</s></span>';

      tmpTopHtml2 = '<span class="row-rfsf j-dg-sale" dg-sale="' + dgFlag + '" gg-sale="' + ggFlag + '">' + emHtml + '<s class="icon icon-green-tri-2"></s><s class="dan-tips">单</s></span>';

      tmpTopAllStopHtml = '<span class="row-rfsf row-dg-stop j-dg-sale" dg-sale="' + dgFlag + '" gg-sale="' + ggFlag + '">本场对阵不支持该玩法</span>';

      tmpBotHtml1 = '<span class="row-rfsf row-dg-bot row-dg-nbot j-dg-hint-nbot j-dg-sale" dg-sale="' + dgFlag + '" gg-sale="' + ggFlag + '">' + emHtml + '</span>';

      tmpBotHtml2 = '<span class="row-rfsf row-dg-bot j-dg-sale j-dg-hint-bot" dg-sale="' + dgFlag + '" gg-sale="' + ggFlag + '">' + emHtml + '</span>';

      tmpBotHtml3 = '<span class="row-rfsf j-dg-sale" dg-sale="' + dgFlag + '" gg-sale="' + ggFlag + '">' + emHtml + '</span>';

      result += joinResult(emHtml, tmpTopHtml1, tmpTopHtml2, tmpTopAllStopHtml, tmpBotHtml1, tmpBotHtml2, tmpBotHtml3, i, dgFlag, ggFlag, nextItem, nextItemDgBool);

    };

    return result;

  };

  function getDxfButton(ggFlag, sp, zf, dgFlag, itemDgBool, nextItemDgBool, itemGgBool, nextItemGgBool, nextItem) {

    var result = '';
    var spArr = sp.split('|');
    var titleArr = BET[BET.tab + 'SpValueArr'];
    var btnEvent = 'j-sp-btn';
    var emHtml = '';
    var tmpTopHtml1, tmpTopHtml2, tmpTopAllStopHtml;
    var tmpBotHtml1, tmpBotHtml2, tmpBotHtml3;

    if (spArr.length !== 2) {
      spArr = ['--', '--'];
      btnEvent = '';
    }

    spArr.reverse();

    result = '<em class="dxf-yszf">' + zf + '</em>';

    for (var i = spArr.length - 1; i >= 0; i--) {

      emHtml = '<em index="' + i + '" data-item="' + titleArr[i] + '" gametype="' + BET.tab + '" sp="' + spArr[i] + '" class="' + btnEvent + ' sp-btn"><i class="cm-sp-l">' + titleArr[i] + '</i><i class="cm-sp-r">' + spArr[i] + '</i></em>';

      tmpTopHtml1 = '<span class="row-dxf row-dg-top j-dg-sale j-dg-hint-top" dg-sale="' + dgFlag + '" gg-sale="' + ggFlag + '">' + emHtml + '<s class="icon icon-green-tri-2"></s><s class="dan-tips">单</s></span>';

      tmpTopHtml2 = '<span class="row-dxf j-dg-sale" dg-sale="' + dgFlag + '" gg-sale="' + ggFlag + '">' + emHtml + '<s class="icon icon-green-tri-2"></s><s class="dan-tips">单</s></span>';

      tmpTopAllStopHtml = '<span class="row-dxf row-dg-stop j-dg-sale" dg-sale="' + dgFlag + '" gg-sale="' + ggFlag + '">本场对阵不支持该玩法</span>';

      tmpBotHtml1 = '<span class="row-dxf row-dg-bot row-dg-nbot j-dg-hint-nbot j-dg-sale" dg-sale="' + dgFlag + '" gg-sale="' + ggFlag + '">' + emHtml + '</span>';

      tmpBotHtml2 = '<span class="row-dxf row-dg-bot j-dg-sale j-dg-hint-bot" dg-sale="' + dgFlag + '" gg-sale="' + ggFlag + '">' + emHtml + '</span>';

      tmpBotHtml3 = '<span class="row-dxf j-dg-sale" dg-sale="' + dgFlag + '" gg-sale="' + ggFlag + '">' + emHtml + '</span>';

      result += joinResult(emHtml, tmpTopHtml1, tmpTopHtml2, tmpTopAllStopHtml, tmpBotHtml1, tmpBotHtml2, tmpBotHtml3, i, dgFlag, ggFlag, nextItem, nextItemDgBool);

    };

    return result;
  };

  function getSfcButton(ggFlag, sp, dgFlag, itemDgBool, nextItemDgBool, itemGgBool, nextItemGgBool, nextItem) {

    var result = '';
    var spArr = sp.split('|');
    var titleArr = BET[BET.tab + 'SpValueArr'];
    var spArrOne = spArr.slice(0, 6);
    var spArrTwo = spArr.slice(6);
    var btnEvent = 'j-sp-btn';
    var tmpTopHtml1, tmpTopHtml2, tmpTopAllStopHtml;
    var tmpBotHtml1, tmpBotHtml2, tmpBotHtml3;

    if (spArr.length !== 12) {
      spArr = ['--', '--'];
      btnEvent = '';
    }

    tmpTopHtml1 = '<span class="row-sfc row-dg-top row-sfc-top j-dg-sale j-dg-hint-top" dg-sale="' + dgFlag + '" gg-sale="' + ggFlag + '"><s class="icon icon-green-tri-1"></s><em class="first">客胜</em>';

    tmpTopHtml2 = '<span class="row-sfc j-dg-sale" dg-sale="' + dgFlag + '" gg-sale="' + ggFlag + '"><em class="first">客胜</em>';

    tmpTopAllStopHtml = '<span class="row-sfc row-dg-stop j-dg-sale" dg-sale="' + dgFlag + '" gg-sale="' + ggFlag + '">本场对阵不支持该玩法';



    if (dgFlag == '1') {
      //过关、单关都不停售
      //过关停售、单关不停售
      result += tmpTopHtml1;

    } else if (ggFlag == '1' && dgFlag == '0') {
      //过关不停售、单关停售
      result += tmpTopHtml2;

    } else if (ggFlag == '0' && dgFlag == '0') {
      //过关、单关都停售
      result += tmpTopAllStopHtml;
    }

    /*result += '<span class="row-sfc">';

    result += '<em class="first">客胜</em>';*/

    for (var i = 0; i < spArrTwo.length; i++) {

      if (ggFlag == '0' && dgFlag == '0') {

        break;

      } else {
        result += '<em index="' + (i + 6) + '" data-item="客胜' + titleArr[i] + '" gametype="' + BET.tab + '" sp="' + spArrTwo[i] + '" class="' + btnEvent + ' sp-btn sfc-sp-btn">' + spArrTwo[i] + '</em>';
      }

    };

    result += '</span>';

    tmpBotHtml1 = '<span class="row-sfc row-dg-bot row-sfc-bot row-dg-nbot j-dg-hint-nbot j-dg-sale" dg-sale="' + dgFlag + '" gg-sale="' + ggFlag + '"><em class="first">主胜</em>';

    tmpBotHtml2 = '<span class="row-sfc row-dg-bot row-sfc-bot j-dg-sale j-dg-hint-bot" dg-sale="' + dgFlag + '" gg-sale="' + ggFlag + '"><em class="first">主胜</em>';

    tmpBotHtml3 = '<span class="row-sfc j-dg-sale" dg-sale="' + dgFlag + '" gg-sale="' + ggFlag + '"><em class="first">主胜</em>';

    if (dgFlag == '1' && nextItem && nextItemDgBool) {
      //单关不停售，有下一行，且下一行有单关，不要底边框
      result += tmpBotHtml1;

    } else if ((dgFlag == '1' && nextItem && !nextItemDgBool) || (dgFlag == '1' && !nextItem)) {
      //单关不停售，有下一行，且下一行没有单关，要底边框
      //单关不停售，没有下一行，要底边框
      result += tmpBotHtml2;

    } else if (dgFlag == '0' && ggFlag == '1') {
      //过关不停售、单关停售
      result += tmpBotHtml3;

    } else if (dgFlag == '0' && ggFlag == '0') {
      //过关、单关都停售
      //result += tmpBotHtml3;
    }

    /*result += '<span class="row-sfc">';
    result += '<em class="first">主胜</em>';*/

    for (var i = 0; i < spArrOne.length; i++) {

      if (ggFlag == '0' && dgFlag == '0') {

        break;

      } else {

        result += '<em index="' + i + '" data-item="主胜' + titleArr[i] + '" gametype="' + BET.tab + '" sp="' + spArrOne[i] + '" class="' + btnEvent + ' sp-btn sfc-sp-btn">' + spArrOne[i] + '</em>';

      }

    };

    result += '</span>';

    return result;
  };

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
    var dgFlag, ggFlag, dgSale, ggSale;

    for (var i = 0, len = data.length; i < len; i++) {

      item = data[i];
      nextItem = null;
      if (i < len - 1) {
        nextItem = data[i + 1];
      }
      dgFlag = item[tab + '_dg_sale'];
      ggFlag = item[tab];
      dgSale = tab + '_dg_sale';
      ggSale = tab;

      if (item[dgSale]) {
        itemDgBool = !!Number(item[dgSale]);
      }

      if (nextItem && nextItem[dgSale]) {
        nextItemDgBool = !!Number(nextItem[dgSale]);
      }

      if (item[ggSale]) {
        itemGgBool = !!Number(item[ggSale]);
      }

      if (nextItem && nextItem[ggSale]) {
        nextItemGgBool = !!Number(nextItem[ggSale]);
      }

      dataLeftCommon = getDataLeftCommon(item, dTime);
      arr = arr.concat(dataLeftCommon);

      if (tab === 'sf') {

        //item[tab]是过关标识，item[tab + '_dg_sale']是指单关标识
        line = getSfButton(ggFlag, item[tab + '_sp'], dgFlag, itemDgBool, nextItemDgBool, itemGgBool, nextItemGgBool, nextItem);

      }

      if (tab === 'rfsf') {

        line = getRfsfButton(ggFlag, item[tab + '_sp'], item.rfsf_rangfen_num, dgFlag, itemDgBool, nextItemDgBool, itemGgBool, nextItemGgBool, nextItem);

      }

      if (tab === 'dxf') {

        line = getDxfButton(ggFlag, item[tab + '_sp'], item.dxf_reference, dgFlag, itemDgBool, nextItemDgBool, itemGgBool, nextItemGgBool, nextItem);

      }

      if (tab === 'sfc') {

        line = getSfcButton(ggFlag, item[tab + '_sp'], dgFlag, itemDgBool, nextItemDgBool, itemGgBool, nextItemGgBool, nextItem);

      }

      arr.push(line);

    };

    return arr.join('');

  }

  /**
   * 返回一列通用左侧html
   * @param  {Object} item 对阵数据对象
   * @return {String}      html
   */
  function getDataLeftCommon(item, dTime) {

    var isExpired = '';
    var arr = [];

    arr.push('<dd data-time="' + dTime + '" isstop="0" matchcode="' + item.match_key + '" matchnumcn="' + item.week + item.game_order + '" starttime="' + item.game_start_time + '" endtime="' + item.end_time + '" hostname="' + item.home_short + '" guestname="' + item.away_short + '" leaguename="' + item.league + '" class="j-data-dd">');

    arr.push('<span class="co1"><i class="jtip" inf="' + item.week + item.game_order + '">' + item.game_order + '</i></span>');

    arr.push('<span class="co2" style="background:' + item.league_color + ';">' + item.league + '</span>');

    arr.push('<span class="co3 gameTime"><i class="jtip">' + item.end_time + '</i></span>');

    arr.push('<span class="co4"><em class="guestTeam" title="' + item.away_short + '">客：' + item.away_short + '</em><em class="hostTeam" title="' + item.home_short + '">主：' + item.home_short + '</em></span>');

    return arr;

  }

  function getHhztBtnGp(item, titleArr, moreIndex, rf, zf) {

    var html = '';
    var hasSp = '';
    var l = '';
    var tab = ['sf', 'rfsf', 'dxf'];
    var leftTips = '';
    var typeClass = '';
    var rfClass = '';

    if (!moreIndex) {
      moreIndex = 0;
    }

    html += '<span class="row-hh">';

    for (var i = 0, len = item.length; i < len; i++) {

      if (item[i]) {

        hasSp = 'j-sp-btn';

      } else {

        item[i] = '--';
        hasSp = '';

      }

      if (i === (len - 1)) l = 'lastOne';

      leftTips = '';

      typeClass = 'hh-' + tab[i];

      if (tab[i] === 'sf') {
        if (moreIndex) {
          leftTips = '<i class="hh-sp-l">客胜</i>';
        } else {
          leftTips = '<i class="hh-sp-l">主胜</i>';
        }
      }

      if (tab[i] === 'rfsf') {

        if (rf > 0) {
          rfClass = 'fc-3';
        } else {
          rfClass = 'fc-7';
        }

        if (!moreIndex) {
          rf = (rf > 0) ? '+' + rf : rf;
          leftTips = '<strong class="hh-sp-l ' + rfClass + '">' + rf + '</strong>';
        }

      }

      if (tab[i] === 'dxf') {

        if (moreIndex) {
          leftTips = '<i class="hh-sp-l fc-84">小于' + zf + '</i>';
        } else {
          leftTips = '<i class="hh-sp-l fc-84">大于' + zf + '</i>';
        }

      }

      html += '<em index="' + (i + moreIndex) + '" data-item="' + titleArr[i] + '" gametype="' + tab[i] + '" sp="' + item[i] + '" class="' + l + ' ' + hasSp + ' sp-btn ' + typeClass + '">' + leftTips + '<b class="hh-sp-r">' + item[i] + '</b></em>';

    };

    html += '</span>';

    return html;
  }
  /**
   * 创建混合投注html
   * @param  {Object} item 对阵数据对象
   * @return {String}      html
   */
  function createHhtzBtnHtml(item) {

    var html = '';

    var sfArr = item['sf_sp'].split('|');
    var rfsfArr = item['rfsf_sp'].split('|');
    var dxfArr = item['dxf_sp'].split('|');

    var Title = [
      ['主胜', '让分主胜', '大分'],
      ['客胜', '让分客胜', '小分']
    ];
    var spArr = [
      [sfArr[0], rfsfArr[0], dxfArr[0]],
      [sfArr[1], rfsfArr[1], dxfArr[1]],
    ];
    var index = 0;

    for (var i = spArr.length - 1; i >= 0; i--) {

      index = (i > 0) ? i * 3 : 0;
      html += getHhztBtnGp(spArr[i], Title[i], index, item.rfsf_rangfen_num, item.dxf_reference);

    };

    html += '<em class="tg-data j-show-hhtz">胜分差' + BET.hhtzIconHtml + '</em></dd>';

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

  // 创建数据主体HTML
  function createDataBody(data, d) {

    var time = APP.dateFormat(new Date(d * 1000), '%Y-%M-%d', true) + ' ' + data[0].week;
    var dataCount = data.length;

    var h = '';
    var bTime = '12:00';

    h += '<dl><dt>' + time + '(' + bTime + ' -- 次日' + bTime + ')<span class="j-match-size matchSize">' + dataCount + '</span>场比赛可投注<span class="cuspText fc-84 j-dataBody-toggle pull-right" data-show="1"><span class="j-nav-text">隐藏</span><i class="icon show-icon"></i></span></dt>';

    if (BET.tab === 'hhtz') {

      h += createHhtzHtml(data, d);

    } else {

      h += createDateMain(data, d);

    }

    h += '</dl>';

    return h;
  }

  /*****************交易区相关 End******************/

  /*****************购买相关 Start******************/

  /**
   * 购票函数
   * @param  {Object} obj      购彩参数
   * @param  {String} type     购票类型 自购,合买
   * @param  {String} lotyName 彩种类型
   * @return {null}
   */
  var buyTicket = function(obj, type, lotyName) {

    var u = 'jingcai';

    obj.unikey = $.now();

    $.ajax({
        url: '/lottery/' + u + '/' + type + '/' + lotyName + '/' + BET.tab,
        type: 'post',
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
   * 弹出前对阵合法性检测
   * @return {Boolean} 是否合法
   */
  var checkParams = function() {

    var matchLen = _.uniq(BET.match, 'matchcode').length;

    if (matchLen > 15) {
      APP.showTips('您好，投注场次不得超过15场哦');
      return false;
    }

    if (!BET.isAgreen) {
      APP.showTips('请先阅读并同意《委托投注规则》后才能继续');
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
        t += '<td class="hm-main">' + e.find('.betList').html() + '</td></tr>';
      }
    });

    Config.payMoney = 1;
    c = checkParams();
    if (c) {

      buy(function() {

        html = '<p><b>投注金额：</b>总计<span id="j-total-money" class="fc-3 mlr-8">' + obj.zhushu * 2 * obj.beishu + '</span>元，共<span id="j-total-zhu">' + obj.zhushu + '</span>注，投注<span id="j-total-bei">' + obj.beishu + '</span>倍</p><p><b>过关方式：</b><span id="j-total-bunch">' + bunch + '</span>，理论最高奖金<span id="j-lilu-award" class="fc-3 mlr-8">' + BET.maxBonus + '</span>元</p>';
        $('#j-tips-table').html(t);
        $('#j-modal-text').html(html);
        H.setHeMaiTotal();
        $('#ballModal').modal('show');

      }, obj);

    }

  });

  // 确认合买
  $('#j-hemai').on('click', function(event) {

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

  // 立即购买
  $('#j-ljtzBtn').on('click', function(event) {

    var obj = BET.getSubmitParams();
    var vote = {};
    var c = null;
    var type = 'buy-self';
    var tr = $('#selectGamePool tbody tr');
    var tbodyHtml = '';
    var bunch = obj.bunch.replace(/\_/g, '串');
    bunch = bunch.replace('1串1', '单关');

    tr.each(function(index, el) {

      var e = tr.eq(index);

      if (index % 2 == 0) {

        tbodyHtml += '<tr><td>' + e.find('.t1').html() + '</td><td>' + e.find('.t2').html() + '</td>';

      } else {

        tbodyHtml += '<td class="ljtz-main">' + e.find('.betList').html() + '</td></tr>';

      }

    });

    Config.payMoney = BET.zhushu * 2 * BET.beishu;

    vote.title = '投注信息确认';
    vote.confirmHtml = '<div class="ljtz-box"><div class="text"><p>投注金额：总计<b class="fc-3 mlr5">' + Config.payMoney + '</b>元，共<b class="mlr5">' + obj.zhushu + '</b>注，投注<b class="mlr5">' + obj.beishu + '</b>倍</p><div class="ljtz-main" id="j-ljtz-box"><table class="table table-bordered m-table-middle"><thead><tr><th width="115">场次</th><th class="gameTeam" width="220">客队 VS 主队</th><th>投注内容</th></tr></thead><tbody>' + tbodyHtml + '</tbody></table></div><p>过关方式：' + bunch + '， 理论最高奖金：<b class="fc-3 mlr5">' + BET.maxBonus + '</b>元</p><div class="btns"><button class="btn btn-danger" id="buyConfirm">确定</button><button class="btn btn-gray" data-dismiss="modal">取消</button></div></div></div>';

    c = checkParams();

    if (c) {

      buy(function() {

        APP.showTips({
          html: vote.confirmHtml,
          title: vote.title,
          className: 'jclqbuy-modal'
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

  /*****************购买相关 End******************/

});