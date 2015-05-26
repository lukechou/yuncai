require.config({
  paths: {
    jquery: '../lib/jquery',
    lodash: '../lib/lodash.compat.min',
    bootstrap: '../lib/bootstrap.min',
    store: '../lib/store.min',
    app: '../common/app',
    core: '../lib/core',
    PL3: '../lottery/pl3_core'
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    },
  }
});

require(['jquery', 'lodash', 'store', 'app', 'PL3', 'bootstrap', 'core'], function($, _, store, APP, PL3) {
  'use strict';

  /**
   * [G_BUY description]
   * zhushu  注数
   * money  金额
   * qihaoId  期号Id
   * qihao  期号
   * codes  投注号码集合
   * trackData  追号投注对象
   * proxyBuy  多期投注
   * partnerBuy-projectTitle  方案标题
   * partnerBuy-projectDescription  方案描述
   * partnerBuy-shareNum  分成多少份
   * partnerBuy-partBuyNum  合买认购份数
   * partnerBuy-partAegisNum  合买保底份数
   * partnerBuy-commissionPercent 合买提成
   * partnerBuy-unitPrice 单价
   * partnerBuy-shareLevel  // 0，立即公开。 1，期号截止公开。 2，跟担人公开。 3，不公开
   * buyType  1:自购, 2:追号, 3:合买, 4:多期机选
   * issueMutipleMap  qihaoID:期号id : object(qihao:期号, multiple:倍数)
   * trackStopMoney  中奖急停金额
   */
  PL3.init({
    G_BUY: {
      lotyName: '',
      lotyCNName: '排列3',
      codes: [],
      zhushu: 0,
      mutiple: 1,
      money: 0,
      payMoney: 0,
      qihaoId: 0,
      isManual: false,
      qihao: 0,
      partnerBuy: {
        projectTitle: '排列3合买方案',
        projectDescription: '排列3',
        shareNum: 0,
        partBuyNum: 0,
        partAegisNum: 0,
        commissionPercent: 0,
        unitPrice: 0,
        shareLevel: 1,
      },
      rowIndex: 0,
      buyType: 1,
      trackData: {
        issueMutipleMap: {},
        trackStopMoney: 0,
      },
      proxyBuy: {
        betNum: 2,
        mutiple: 1,
        issueSize: 10,
      },
      init: function() {
        this.lotyName = $('#lotyName').val();
        this.playName = $('#playName').val();
        this.codes = [];
        this.zhushu = 0;
        this.mutiple = 1;
        this.money = 0;
        this.isManual = false;
        this.qihaoId = $('#qihaoId').val();
        this.qihao = $('#qihao').val();
        this.partnerBuy = {
            projectTitle: '排列3合买方案',
            projectDescription: '排列3',
            shareNum: 0,
            partBuyNum: 0,
            partAegisNum: 0,
            commissionPercent: 0,
            unitPrice: 0,
            shareLevel: 1,
          },
          this.rowIndex = 0;
        this.proxyBuy = {
          betNum: 2,
          multiple: 1,
          issueSize: 10,
        };
      },
    },
    G_CHOOSE: {
      codes: [],
      zhushu: 0,
      money: 0,
      init: function() {
        this.codes = [];
        this.zhushu = 0;
        this.money = 0;
      },
    },
    G_MODIFY_CODE_OBJ: {
      codeKey: -1,
      codeObj: {},
    },
    chooseBuyBtn: $('#choose_to_buy'),
    choose_zhushu: $("#choose_zhushu"),
    choose_money: $("#choose_money"),
    ballAear: $('.box-zx-cgtz .j_normal_choose_code'),
    addMoney: 0,
    playName: 10,
  });

  /*
   * 顶部TAB 切换
   * big 大类 zx直选 zx6直选6 zx3直选3
   * small 小类 cgtz常规投注 upload粘贴上传 many多期投注 he和值 dt胆拖
   * @author: Raymond
   */
  PL3.nav = (function() {
    'use strict';

    var nav = {
      big: 'zx',
      small: 'cgtz',
      bigEl: null,
      smallEl: null,
      zx: ['cgtz', 'hz', 'up', 'many'],
      zx6: ['cgtz', 'hz', 'dt', 'up'],
      zx3: ['cgtz', 'hz', 'dt', 'up'],
      init: function(args) {
        var _this = this;
        for (var prop in args) {
          if (args.hasOwnProperty(prop)) {
            _this[prop] = args[prop];
          }
        }
      },
      reset: function() {
        var _this = this;
        _this.big = 'zx';
        _this.small = 'cgtz';
        _this.toggleTabs();
      },
      toggleTabs: function() {

        var _this = this;
        var smallIndex = _.indexOf(_this[_this.big], _this.small);
        var a = 'active';

        if (smallIndex < 0) {
          _this.small = 'cgtz';
        }

        _this.bigEl.find('a.active').removeClass(a);
        _this.bigEl.find('a[data-type=' + _this.big + ']').addClass(a);
        _this.smallEl.find('li.active').removeClass(a);
        _this.smallEl.find('a[data-stype=' + _this.small + ']').parents('li').addClass(a);

        _this.content.removeClass().addClass('j-box-' + _this.big);
        _this.main.removeClass().addClass('j-box-' + _this.small);

      }

    };

    return nav;

  }());

  /**
   *  Page Init
   *  1.停售检测
   *  2.绑定Input占位事件
   *  3.G_BUY 初始化
   *  4.G_CHOOSE 初始化
   *  5.玩法切换
   * @return null
   */
  function pageInit() {

    if ($('#saleStatus').val() == 1) {
      APP.showStopSellModal(PL3.G_BUY.lotyCNName);
      $('#buy-submit,#buy_button_proxy').html('暂停销售').removeClass('btn-red').addClass('btn-stop').attr('id', '');
    }

    APP.bindInputPlace();
    PL3.G_BUY.init();
    PL3.G_CHOOSE.init();

    PL3.nav.init({
      bigEl: $('#j-hd-nav'),
      smallEl: $('#j-nav'),
      content: $('#j-content'),
      main: $('#j-box-main')
    });
  }

  pageInit();

  $('#j-touzhu-tips').on('click', function(event) {

    $(this).toggleClass('active');
    $('#j-touzhu-tipstext').toggle();

  });

  /**
   * 玩法切换 - 大类
   *
   */
  $('#j-hd-nav').on('click', 'a', function(event) {

    var type = $(this).attr('data-type');
    $('.j-quick-method span').removeClass('active');

    if (type) {
      type = _.escape(type);
    } else {
      return;
    }

    if (PL3.G_BUY.codes.length >= 1) {
      APP.showTips({
        title: '友情提示',
        text: '切换玩法将会清空您的号码',
        type: 2,
        onConfirm: function() {
          $('#myModal').modal('hide');
          $('.br-details').find('tbody .br-zhui-c').each(function(index, el) {
            _this.parents('tr').find('.j-money').html(0);
          });
          PL3.nav.big = type;
          smallToggleTabs();
        }
      });
    } else {
      PL3.nav.big = type;
      smallToggleTabs();
    }

  });

  /**
   * 玩法切换 - 小类
   *
   */
  $('#j-nav').on('click', 'a', function(event) {

    var _this = $(this);
    var type = _.escape(_this.attr('data-stype'));
    var li = _this.parents('li');
    $('.j-quick-method span').removeClass('active');

    if (PL3.G_BUY.codes.length >= 1) {
      APP.showTips({
        title: '友情提示',
        text: '切换玩法将会清空您的号码',
        type: 2,
        onConfirm: function() {
          $('#myModal').modal('hide');
          $('.br-details').find('tbody .br-zhui-c').each(function(index, el) {
            $(this).parents('tr').find('.j-money').html(0);
          });
          PL3.nav.small = type;
          smallToggleTabs();
          if (type === 'many') {
            PL3.G_BUY.buyType = 4;
          }
        }
      });
    } else {
      PL3.nav.small = type;
      smallToggleTabs();
    }

    if (type === 'many') {
      PL3.G_BUY.buyType = 4;
    }

  });

  function smallToggleTabs(box) {

    var b = PL3.nav.big;
    var s = PL3.nav.small;
    if (b === 'zx' && s === 'dt') {
      s = 'cgtz';
    }
    PL3.ballAear = $('.box-' + b + '-' + s + ' .j_normal_choose_code');

    if (b === 'zx' && s === 'cgtz') {
      $('.j-jx-zhus').show();
    } else {
      $('.j-jx-zhus').hide();
    }

    if (s === 'up') {
      PL3.G_BUY.isManual = true;
    } else {
      PL3.G_BUY.isManual = false;
    }

    if (b === 'zx') {
      if (s === 'cgtz') PL3.playName = 10;
      if (s === 'hz') PL3.playName = 12;
      if (s === 'many') PL3.playName = 10;
      if (s === 'up') PL3.playName = 10;
    }

    if (b === 'zx3') {
      if (s === 'cgtz') PL3.playName = 20;
      if (s === 'dt') PL3.playName = 21;
      if (s === 'hz') PL3.playName = 22;
      if (s === 'up') PL3.playName = 20;
    }

    if (b === 'zx6') {
      if (s === 'cgtz') PL3.playName = 30;
      if (s === 'dt') PL3.playName = 31;
      if (s === 'hz') PL3.playName = 32;
      if (s === 'up') PL3.playName = 30;
    }

    $('#buy-submit').attr("disabled", "disabled");

    PL3.nav.toggleTabs();
    clean4CutBuyType();
    updateCreatePartProjectParame();
    initBuyType();
  }

  /**
   * 选球
   *
   * @return null
   */
  $(".j-num-group").on('click', 'a', function(event) {
    event.preventDefault();
    var _this = $(this);
    var row = $(this).parents('.j-row-code');
    var dataBit = parseInt(row.attr('data-bit'));
    var arr = null;
    var num = parseInt(APP.filterStr($(this).html()));
    var ballState = $(this).hasClass('active');

    // 胆拖判断变量
    var s = PL3.nav.small;
    var b = PL3.nav.big;
    var codesLen = null;
    var isDt = row.attr('data-dt') || false;
    var arr2 = null;
    var dataBit2 = dataBit === 1 ? 0 : 1;

    $(this).parents('.j-row-code').find('.j-quick-method').children('span').removeClass('active');

    arr = getChooseCodes(dataBit);

    codesLen = PL3.G_CHOOSE.codes[0][dataBit].length + 1;

    // 胆拖判断 阻止选号
    if (s === 'dt' && isDt) {

      if (b === 'zx3' && codesLen > 1 && !ballState) {
        APP.showTips('最多只能选择1个胆码');
        return;
      }

      if (b === 'zx6' && codesLen > 2 && !ballState) {
        APP.showTips('最多只能选择2个胆码');
        return;
      }

    }

    //切换选球状态
    if (s === 'dt') {
      arr2 = getChooseCodes(dataBit2);

      if (ballState) {
        _.pull(arr, num);
      } else {
        arr.push(num);
        _.pull(arr2, num);
      }

      PL3.G_CHOOSE.codes[0][dataBit] = arr;
      PL3.G_CHOOSE.codes[0][dataBit2] = arr2;
      PL3.G_CHOOSE.codes[0][dataBit2] = arr2;

      $(this).toggleClass('active');
      if ($(this).hasClass('active')) {
        if (row.siblings('.j-row-code').find('[data-num=' + num + ']').hasClass('active')) {
          row.siblings('.j-row-code').find('[data-num=' + num + ']').removeClass('active');
          row.siblings('.j-row-code').find('.j-quick-method span').removeClass('active');
        }
      }

      judgeNum(PL3.G_CHOOSE, _this, dataBit, 'dt');

    } else {

      if (ballState) {
        _.pull(arr, num);
      } else {
        arr.push(num);
      }

      PL3.G_CHOOSE.codes[0][dataBit] = arr;
      $(this).toggleClass('active');

      judgeNum(PL3.G_CHOOSE, _this, dataBit);

    }
    calculateChooseCodes();

  });

  function judgeNum(G_CHOOSE, numObj, dataBit, isDt) {
    var _this = numObj;
    var i, odd = 0,
      even = 0,
      big = 0,
      small = 0,
      all = 0;
    _this.parents('.j-row-code').find('span').removeClass('active');
    if (isDt) {
      dataBit = 1;
      _this.parents('.j-row-code').find('span').removeClass('active');
      _this.parents('.j-row-code').siblings('.j-row-code').find('span').removeClass('active');
    }

    if (G_CHOOSE.codes[0][dataBit] && G_CHOOSE.codes[0][dataBit].length == 5) {
      for (i = 0; i < 5; i++) {
        if (G_CHOOSE.codes[0][dataBit][i] % 2 == 1) {
          odd++;
        }
        if (G_CHOOSE.codes[0][dataBit][i] % 2 == 0) {
          even++;
        }
        if (G_CHOOSE.codes[0][dataBit][i] > 4) {
          big++;
        }
        if (G_CHOOSE.codes[0][dataBit][i] <= 4) {
          small++;
        }
      }
      if (odd == 5) {
        _this.parents('.j-row-code').find('span[data-type="odd"]').addClass('active');
      }
      if (even == 5) {
        _this.parents('.j-row-code').find('span[data-type="even"]').addClass('active');
      }
      if (big == 5) {
        _this.parents('.j-row-code').find('span[data-type="big"]').addClass('active');
      }
      if (small == 5) {
        _this.parents('.j-row-code').find('span[data-type="small"]').addClass('active');
      }
    } else if (G_CHOOSE.codes[0][dataBit] && G_CHOOSE.codes[0][dataBit].length == 10) {
      _this.parents('.j-row-code').find('span[data-type="all"]').addClass('active');
    }
  }

  function getChooseCodes(dataBit) {
    if (typeof PL3.G_CHOOSE.codes[0] === 'undefined') {
      PL3.G_CHOOSE.codes[0] = [];
    }

    if (typeof PL3.G_CHOOSE.codes[0][dataBit] === 'undefined') {
      PL3.G_CHOOSE.codes[0][dataBit] = [];
    }
    return PL3.G_CHOOSE.codes[0][dataBit].concat();
  }

  /**
   * 自助选号 右侧按钮
   *
   * @return null
   */
  $('.j-quick-method').on('click', 'span', function(event) {
    var _this = $(this);
    var type = $(this).attr('data-type') || null;
    var row = $(this).parents('.j-row-code');
    var dataBit = parseInt(row.attr('data-bit'));
    var num = null;

    // On Dantuo
    var isDt = PL3.nav.small === 'dt';
    var dataBit2 = dataBit === 1 ? 0 : 1;
    var dtRow = row.siblings('.j-row-code').find('.j-num-group a');

    if (typeof PL3.G_CHOOSE.codes[0] === 'undefined') {
      PL3.G_CHOOSE.codes[0] = [];
    }
    PL3.G_CHOOSE.codes[0][dataBit] = [];

    if (type) {
      if ('clean' != type) {
        if (_this.hasClass('active')) {
          _this.removeClass('active');
          _this.siblings('span').removeClass('active');
        } else {
          _this.addClass('active');
          _this.siblings('span').removeClass('active');
        }
      } else {
        _this.siblings('span').removeClass('active');
      }
    }

    if (type) {

      row.find('.j-num-group a').removeClass('active');

      row.find('.j-num-group a').each(function(index) {

        num = parseInt(APP.filterStr($(this).html()));

        // odd-奇数 even-偶数 big-大数 small-小数 all-全部 clean-清除
        switch (type) {

          case 'odd':
            $(this).removeClass('active');
            if (_this.hasClass('active')) {
              if (index % 2 != 0) {
                $(this).addClass('active');
                PL3.G_CHOOSE.codes[0][dataBit].push(num);
                if (isDt) {
                  dtRow.eq(index).removeClass('active');
                  _.pull(PL3.G_CHOOSE.codes[0][dataBit2], num);
                }
              }
            } else {
              $(this).removeClass('active');
            }
            /*if (index % 2 != 0) {
              $(this).addClass('active');
              PL3.G_CHOOSE.codes[0][dataBit].push(num);

              if (isDt) {
                dtRow.eq(index).removeClass('active');
                _.pull(PL3.G_CHOOSE.codes[0][dataBit2], num);
              }
            }*/
            break;
          case 'even':
            $(this).removeClass('active');
            if (_this.hasClass('active')) {
              if (index % 2 == 0) {
                $(this).addClass('active');
                PL3.G_CHOOSE.codes[0][dataBit].push(num);
                if (isDt) {
                  dtRow.eq(index).removeClass('active');
                  _.pull(PL3.G_CHOOSE.codes[0][dataBit2], num);
                }
              }
            } else {
              $(this).removeClass('active');
            }
            /*if (index % 2 == 0) {
              $(this).addClass('active');
              PL3.G_CHOOSE.codes[0][dataBit].push(num);
              if (isDt) {
                dtRow.eq(index).removeClass('active');
                _.pull(PL3.G_CHOOSE.codes[0][dataBit2], num);
              }
            }*/
            break;
          case 'big':
            $(this).removeClass('active');
            if (_this.hasClass('active')) {
              if (index >= 5) {
                $(this).addClass('active');
                PL3.G_CHOOSE.codes[0][dataBit].push(num);
                if (isDt) {
                  dtRow.eq(index).removeClass('active');
                  _.pull(PL3.G_CHOOSE.codes[0][dataBit2], num);
                }
              }
            } else {
              $(this).removeClass('active');
            }
            /*if (index >= 5) {
              $(this).addClass('active');
              PL3.G_CHOOSE.codes[0][dataBit].push(num);
              if (isDt) {
                dtRow.eq(index).removeClass('active');
                _.pull(PL3.G_CHOOSE.codes[0][dataBit2], num);
              }
            }*/
            break;
          case 'small':
            $(this).removeClass('active');
            if (_this.hasClass('active')) {
              if (index <= 4) {
                $(this).addClass('active');
                PL3.G_CHOOSE.codes[0][dataBit].push(num);
                if (isDt) {
                  dtRow.eq(index).removeClass('active');
                  _.pull(PL3.G_CHOOSE.codes[0][dataBit2], num);
                }
              }
            } else {
              $(this).removeClass('active');
            }
            /*if (index <= 4) {
              $(this).addClass('active');
              PL3.G_CHOOSE.codes[0][dataBit].push(num);
              if (isDt) {
                dtRow.eq(index).removeClass('active');
                _.pull(PL3.G_CHOOSE.codes[0][dataBit2], num);
              }
            }*/
            break;
          case 'all':
            if (_this.hasClass('active')) {
              $(this).addClass('active');
              PL3.G_CHOOSE.codes[0][dataBit].push(num);
              if (isDt) {
                dtRow.removeClass('active');
                _.pull(PL3.G_CHOOSE.codes[0][dataBit2], num);
              }
            } else {
              $(this).removeClass('active');
            }
            /*PL3.G_CHOOSE.codes[0][dataBit].push(num);
            $(this).addClass('active');
            if (isDt) {
              dtRow.removeClass('active');
              _.pull(PL3.G_CHOOSE.codes[0][dataBit2], num);
            }*/
            break;
        }
      });
      //清除
      if (type === 'clean') {
        PL3.G_CHOOSE.codes[0][dataBit].length = 0;
      }
      calculateChooseCodes();
    } else {
      console.log('error');
      return;
    }

  });

  /**
   * 添加到投注列表按钮
   * @param  Add to List
   * // 0-修改  1-添加 2-粘贴上传添加到列表
   * @return null
   */
  PL3.chooseBuyBtn.on('click', function(event) {

    if (!$(this).hasClass('active')) {
      return;
    }

    var bool = false;
    var type = parseInt(PL3.chooseBuyBtn.attr('data-add'));
    var buyBoxCodesLen = $("#code_list .br-zhu-item").length;
    var iptCodes = $('#sd_number').val().replace(/，/ig, ',').split("\n");
    var validata = '';
    var uploadArr = [];
    var removeArr = [];

    var isOverMaxLen = true;

    switch (type) {
      case 0:

        isOverMaxLen = ((buyBoxCodesLen + PL3.G_CHOOSE.codes.length - 1) > PL3.maxBuyCodeLength);
        if (isOverMaxLen) {
          APP.showTips('您的投注号码多于' + PL3.maxBuyCodeLength + '行，请返回重新选择');
          return;
        }

        updateZhuMain();
        bool = true;
        break;
      case 1:
        isOverMaxLen = ((buyBoxCodesLen + PL3.G_CHOOSE.codes.length) > PL3.maxBuyCodeLength);
        if (isOverMaxLen) {
          APP.showTips('您的投注号码多于' + PL3.maxBuyCodeLength + '行，请返回重新选择');
          return;
        }
        if (PL3.G_CHOOSE.money > 0) {
          PL3.addMoney = PL3.G_CHOOSE.money;
          bool = PL3.makeChooseCodeHtml(PL3.G_CHOOSE.codes);
        }
        break;
      case 2:
        isOverMaxLen = ((buyBoxCodesLen + iptCodes.length) > PL3.maxBuyCodeLength);

        if (isOverMaxLen) {
          APP.showTips('您的投注号码多于' + PL3.maxBuyCodeLength + '行，请返回重新选择');
          return;
        }
        for (var i = 0; i < iptCodes.length; i++) {

          if (PL3.getIllegalCode(iptCodes[i])) {

            validata = PL3.getIllegalCode(iptCodes[i]);
            uploadArr.push(validata);

            if (PL3.nav.big === 'zx3') {
              PL3.addMoney = PL3.getZuXuan3NormalZhushu(validata) * 2;
            }

            if (PL3.nav.big === 'zx6') {
              PL3.addMoney = PL3.getZuXuan6NormalZhushu(validata) * 2;
            }

            if (PL3.nav.big === 'zx') {
              PL3.addMoney = PL3.getZxZhushu(validata) * 2;
            }

            PL3.makeChooseCodeHtml([validata]);
            removeArr.push(iptCodes[i]);
          }

          if (!iptCodes[i]) {
            _.pull(iptCodes, iptCodes[i]);
          }

        }

        for (var i = removeArr.length - 1; i >= 0; i--) {
          _.pull(iptCodes, removeArr[i]);
        };

        $('#sd_number').val(iptCodes.join('\n'));
        if (iptCodes.length === 0) {
          updateAddBtn(false);
          PL3.chooseBuyBtn.attr('disabled', 'disabled');
        }
        if (uploadArr.length === 0) {
          var uploadErrorTips = '<h5>请按照正确的格式填写：</h5><p>单式：1,2,3</p><p>复式：01,234,35</p>';
          if (PL3.nav.big !== 'zx') {
            uploadErrorTips = '<h5>请按照正确的格式填写：</h5><p>单式：1,2,3</p><p>复式：0,1,2,3,4,5</p>';
          }
          APP.showTips(uploadErrorTips);
          return;
        } else {
          calculateBuyCodes();
          PL3.choose_zhushu.html(0);
          PL3.choose_money.html(0);
          PL3.G_CHOOSE.init();
          updateCreatePartProjectParame();
          return;
        }

        break;
    }

    if (bool) {

      calculateBuyCodes();
      PL3.choose_zhushu.html(0);
      PL3.choose_money.html(0);
      PL3.G_CHOOSE.init();
      PL3.chooseBuyBtn.attr('data-add', 1);
      updateAddBtn(false);
      PL3.chooseBuyBtn.attr('disabled', 'disabled');

      $("#sd_number").val('');
      PL3.ballAear.find('.j-num-group a').removeClass('active');
      $('#choose_to_buy_tip').html('添加到投注列表');

    }

    updateCreatePartProjectParame();
  });

  /*
   * 更新 添加按钮状态
   * @ active Boolean
   */
  function updateAddBtn(active) {

    var btn = $('#choose_to_buy');

    if (active) {
      btn.addClass('active');
    } else {
      btn.removeClass('active');
    }

  };

  function updateZhuMain() {

    var b = PL3.nav.big;
    var s = PL3.nav.small;
    var html = '';
    var title = PL3.getBuyZhuListTitle();

    if (PL3.G_CHOOSE.zhushu < 0) {
      return;
    }

    for (var i = PL3.G_CHOOSE.codes[0].length - 1; i >= 0; i--) {
      PL3.G_CHOOSE.codes[0][i] = PL3.G_CHOOSE.codes[0][i].sort(function(a, b) {
        return a - b;
      });
    };

    for (var key in PL3.G_BUY.codes) {
      if (PL3.G_BUY.codes[key].key == PL3.G_MODIFY_CODE_OBJ.codeKey) {
        PL3.G_BUY.codes[key].value = PL3.G_CHOOSE.codes[0];
      }
    }

    html += '<div class="br-zhu-item clearfix" databit="' + PL3.G_MODIFY_CODE_OBJ.codeKey + '"><b>[' + title + ']</b><div class="list">';

    if (s === 'cgtz') {

      html += '<span data-c="0">' + PL3.G_CHOOSE.codes[0][0].join('') + '</span>';

      if (b === 'zx') {
        if (PL3.G_CHOOSE.codes[0][1].length > 0) {
          html += '<span data-c="0">' + PL3.G_CHOOSE.codes[0][1].join('') + '</span>';
        }

        if (PL3.G_CHOOSE.codes[0][1].length > 0) {
          html += '<span data-c="0">' + PL3.G_CHOOSE.codes[0][2].join('') + '</span>';
        }
      }
    }

    if (s === 'hz') {
      html += '<span data-c="0">' + PL3.G_CHOOSE.codes[0][0].join(' ') + '</span>';
    }

    if (s === 'dt') {
      html += '<span data-c="0">(' + PL3.G_CHOOSE.codes[0][0].join('') + ')</span>';
      html += '<span data-c="0">' + PL3.G_CHOOSE.codes[0][1].join('') + '</span>';
    }

    html += '</div><div class="pull-right"><b><i class="money" data-m="1">' + PL3.G_CHOOSE.money + '</i>元</b><a href="javascript:;" class="br-zhu-set">修改</a><a href="javascript:;" class="br-zhu-del">删除</a></div></div>';

    PL3.G_MODIFY_CODE_OBJ.codeObj.replaceWith(html);

  }

  /**
   * 机选按钮
   *
   * @return null
   */
  $('.j-zhu-adds').on('click', function(event) {
    event.preventDefault();

    var betNum = parseInt($(this).attr('data-zhu'));
    var getCodes = null;

    if (PL3.G_BUY.codes.length + betNum > PL3.maxBuyCodeLength) {
      APP.showTips('您的投注号码多于' + PL3.maxBuyCodeLength + '行，请返回重新选择');
      return;
    }

    getCodes = PL3.produceZhixuanNormalCode(betNum);
    PL3.G_CHOOSE.zhushu = betNum;
    PL3.addMoney = 2;

    PL3.makeChooseCodeHtml(getCodes, true);
    calculateBuyCodes();
    updateCreatePartProjectParame();
    //PL3.G_CHOOSE.init();

  });

  /**
   * 单击事件
   *
   * @return null
   */
  $('.br-zhu-l').on('click', '.br-zhu-item', function(event) {
    event.preventDefault();

    if (PL3.G_BUY.isManual) {
      return;
    }

    if (event.target.tagName == "A") {
      return;
    }

    if (PL3.nav.small !== 'up') {
      reflectChooseCode($(this).attr('databit'));
      updateAddBtn(true);
    }

  });

  /**
   * 删除投注号码
   * @param  {[type]} event) {                        var   dataBit [description]
   * @return {[type]}        [description]
   */
  $('.br-zhu-l').on('click', '.br-zhu-del', function(event) {

    var dataBit = $(this).parents('.br-zhu-item').attr('dataBit');

    if ($(this).parents('.br-zhu-item')[0] == PL3.G_MODIFY_CODE_OBJ.codeObj[0]) {
      PL3.chooseBuyBtn.attr('data-add', 1);
      $('#choose_to_buy_tip').html('添加到投注列表');
    }

    _.remove(PL3.G_BUY.codes, function(n) {
      return n.key == dataBit;
    });

    $(this).parents('.br-zhu-item').remove();

    calculateBuyCodes();
    updateCreatePartProjectParame();
  });

  /**
   * 修改投注号码
   * @param  {[type]} event) {                        var   dataBit [description]
   * @return {[type]}        [description]
   */
  $('.br-zhu-l').on('click', '.br-zhu-set', function(event) {

    var objectKey = $(this).parents('.br-zhu-item').attr('databit');

    reflectChooseCode(objectKey);
    updateAddBtn(true);
    PL3.chooseBuyBtn.attr('data-add', 0);

    $('#choose_to_buy_tip').html('修改投注号码');

    PL3.G_MODIFY_CODE_OBJ = {
      codeKey: objectKey,
      codeObj: $(this).parents('.br-zhu-item')
    };

  });

  /**
   * 清空列表
   * @return null
   */
  $('#clean_buy_code').on('click', function(event) {

    $("#code_list").html('');
    $('#buy_zhushu').html(0);
    $('#project_price').html(0);

    PL3.G_BUY.init();
    calculateBuyCodes();
    PL3.G_BUY.mutiple = Number(_.escape($('#project_mutiple').val())) || 1;

    updateCreatePartProjectParame();

  });
  /**
   * 自降倍数
   * @return null
   */
  $('#decrease_mutiple').on('click', function(event) {
    event.preventDefault();
    var mutipleObj = $("#project_mutiple");
    var currentMultiple = parseInt(mutipleObj.val());
    currentMultiple--;
    if (currentMultiple < PL3.minMultiple) {
      PL3.G_BUY.mutiple = PL3.minMultiple;
    } else if (currentMultiple > PL3.maxMultiple) {
      PL3.G_BUY.mutiple = PL3.maxMultiple;
    } else {
      PL3.G_BUY.mutiple = currentMultiple;
    }
    mutipleObj.val(PL3.G_BUY.mutiple);
    calculateBuyCodes();
    updateCreatePartProjectParame();
  });
  /**
   * 自降倍数
   * @return null
   */
  $('#project_mutiple').on('change', function(event) {
    event.preventDefault();

    /* Act on the event */
    var currentMultiple = parseInt($(this).val()) || 0;
    if (currentMultiple < PL3.minMultiple) {
      PL3.G_BUY.mutiple = PL3.minMultiple;
    } else if (currentMultiple > PL3.maxMultiple) {
      PL3.G_BUY.mutiple = PL3.maxMultiple;
    } else {
      PL3.G_BUY.mutiple = currentMultiple;
    }
    $(this).val(PL3.G_BUY.mutiple);
    calculateBuyCodes();
    updateCreatePartProjectParame();
  });
  /**
   * 自增倍数
   * @return null
   */
  $('#increase_mutiple').on('click', function(event) {
    event.preventDefault();
    /* Act on the event */
    var mutipleObj = $("#project_mutiple");
    var currentMultiple = parseInt(mutipleObj.val());
    currentMultiple++;
    // PL3.G_BUY.mutiple = (currentMutiple <= 0) ? 1 : currentMutiple;
    if (currentMultiple < PL3.minMultiple) {
      PL3.G_BUY.mutiple = PL3.minMultiple;
    } else if (currentMultiple > PL3.maxMultiple) {
      PL3.G_BUY.mutiple = PL3.maxMultiple;
    } else {
      PL3.G_BUY.mutiple = currentMultiple;
    }
    mutipleObj.val(PL3.G_BUY.mutiple);
    calculateBuyCodes();
    updateCreatePartProjectParame();
  });

  /**
   * 提交购买按钮
   * @return null
   */
  $('#buy-submit,#buy_button_proxy').on('click', function(event) {
    PL3.isAgreen = $(this).parents('.br-tou').find('.j-sub-agreed')[0].checked;
    buy();
  });

  /**
   * 切换购买方式
   * @return null
   */
  $('#buy_type').on('click', 'a', function(event) {
    event.preventDefault();
    PL3.G_BUY.buyType = parseInt($(this).attr('data-buytype'));
    initBuyType();
  });

  function initBuyType() {
    $('#buy_type').find('.icon-y2').removeClass('icon-y2');
    $('#buy_type').find('.icon').each(function(index, el) {
      if ($(this).parents('a[data-toggle="tab"]').attr('data-buytype') == PL3.G_BUY.buyType) {
        $(this).addClass('icon-y2');
      }
    });
    $('#buy_type').siblings('.tab-content').find('.tab-pane').each(function(index, el) {
      if (index == PL3.G_BUY.buyType - 1) {
        $(this).addClass('active');
      } else {
        $(this).removeClass('active');
      }
    });
    PL3.G_BUY.trackData.issueMutipleMap = {}; // clean
    $('#buy_mutiple_span').show();
    PL3.G_BUY.partnerBuy.projectTitle = PL3.G_BUY.lotyCNName + '合买方案';
    PL3.G_BUY.partnerBuy.projectDescription = PL3.G_BUY.lotyCNName;
    PL3.G_BUY.mutiple = 1;
    $('#project_mutiple').val(PL3.G_BUY.mutiple);
    switch (PL3.G_BUY.buyType) {
      case 1: // 自购
        $('#part_buy').val(1);
        $('#track_desc').addClass('hide');
        calculateBuyCodes();
        break;
      case 2: // 追号
        $('#part_buy').val(1);
        $('#buy_mutiple_span').hide();
        $('#track_desc').removeClass('hide');
        queryTrackIssueList(10);
        calculateBuyCodes();
        break;
      case 3: // 合买
        calculateBuyCodes();
        $('#track_desc').addClass('hide');
        $("#share-num").val(PL3.G_BUY.money);
        updateCreatePartProjectParame();
        break;
    }
  }

  // 追号期数切换
  $('#issue_size').on('change', function(event) {
    event.preventDefault();
    PL3.G_BUY.trackData.issueMutipleMap = {}; // clean
    queryTrackIssueList($(this).val());
  });

  // 追号头部 倍数 修改
  $('.br-details thead .br-zhui-c').on('change', function(event) {

    var checked = $(this)[0].checked;

    $(this).parents('.br-details').find('tbody .br-zhui-c').each(function(index, el) {
      el.checked = checked;
    });

    PL3.G_BUY.trackData.issueMutipleMap = {};

    $(this).parents('.br-details').find('tbody .br-zhui-c').each(function(index, el) {
      if (el.checked) {
        PL3.G_BUY.trackData.issueMutipleMap[$(this).attr('data-qihaoid')] = {
          qihao: $(this).attr('data-qi'),
          mutiple: $(this).parents('tr').find('.br-zhui-bei').val()
        };
      }
    });

    calculateBuyCodes();
  });

  // 追号总期的期数改变
  $('.br-details').on('change', 'tbody .br-zhui-c', function(event) {
    event.preventDefault();

    PL3.G_BUY.trackData.issueMutipleMap = {}; // clean
    $(this).parents('.br-details').find('tbody .br-zhui-c').each(function(index, el) {
      if (el.checked) {
        PL3.G_BUY.trackData.issueMutipleMap[$(this).attr('data-qihaoid')] = {
          qihao: $(this).attr('data-qi'),
          mutiple: $(this).parents('tr').find('.br-zhui-bei').val()
        };
      }
    });

    calculateBuyCodes();
  });

  // 追号总期的倍数改变
  $('.br-details thead .br-zhui-bei').on('change', function(event) {

    var val = parseInt($(this).val()) || 1;
    if (isNaN(val) || val < 1) {
      val = 1;
    } else {
      val = Math.ceil(val);
      (val > 9999) && (val = 9999);
    }
    $(this).val(val);

    var baseObj = $(this).parents('.br-details');
    baseObj.find('tbody .br-zhui-bei').val(val);
    baseObj.find('tbody .br-zhui-c').each(function(index, el) {
      el.checked = 'checked';
      PL3.G_BUY.trackData.issueMutipleMap[$(this).attr('data-qihaoid')] = {
        qihao: $(this).attr('data-qi'),
        mutiple: $(this).parents('tr').find('.br-zhui-bei').val()
      };
    });

    calculateBuyCodes();
  });

  // 追号每期的倍数改变
  $('.br-details tbody').on('change', '.br-zhui-bei', function(event) {

    var val = parseInt($(this).val()) || 1;
    var baseObj = $(this).parents('tr');
    var issueObj = baseObj.find('.br-zhui-c');

    if (isNaN(val) || val < 1) {
      val = 1;
    } else {
      val = Math.ceil(val);
      (val > 9999) && (val = 9999);
    }
    $(this).val(val);

    issueObj.attr('checked', 'checked');

    PL3.G_BUY.trackData.issueMutipleMap[issueObj.attr('data-qihaoid')] = {
      qihao: issueObj.attr('data-qi'),
      mutiple: baseObj.find('.br-zhui-bei').val()
    };

    calculateBuyCodes();
  });

  // 我要分成多少份，最少一份，最多购买金额的数量
  $("#share-num").on('change', function(event) {
    updateCreatePartProjectParame();
  });

  // 我要认购的份数
  $("#part_buy").on('change', function(event) {
    updateCreatePartProjectParame();
  });

  // 我要提成比例
  $('#commission_percent').on('change', function(event) {
    var val = parseInt($(this).val()) || 0;
    var rengouPercent = Math.floor($('#part_buy_percent').html());
    if (val > rengouPercent) {
      $("#part_buy").val(Math.ceil($("#commission_percent").val() / 100 * ($('#share-num').val() || 0)));
      updateCreatePartProjectParame();
    }
    PL3.G_BUY.partnerBuy.commissionPercent = val;
  });

  // 是否保底
  $('#has_part_aegis').on('change', function(event) {
    if ($(this)[0].checked) {
      $('#part_aegis_num').removeAttr('disabled');
      updateCreatePartProjectParame();
    } else {
      $('#part_aegis_num').attr('disabled', 'disabled');
      $('#part_aegis_num').val(0);
      $('#part_aegis_percent').html('0.00');
    }
    updateCreatePartProjectParame();
  });

  // 保底金额修改
  $('#part_aegis_num').on('change', function(event) {
    updateCreatePartProjectParame();
  });

  // 方案保密设置
  $('.br-set-group').on('click', 'a', function(event) {

    $(this).parents('.br-set-group').find('a').removeClass('active');
    $(this).toggleClass('active');

    switch ($(this).html()) {
      case '截止后公开':
        PL3.G_BUY.partnerBuy.shareLevel = 1;
        break;
      case '立即公开':
        PL3.G_BUY.partnerBuy.shareLevel = 0;
        break;
      case '截止前对跟单人公开':
        PL3.G_BUY.partnerBuy.shareLevel = 2;
        break;
    }

  });

  /**
   * 方案标题
   * @param  {[type]} event) {        event.preventDefault();             PL3.G_BUY.partnerBuy.projectTitle [description]
   * @return {[type]}        [description]
   */
  $('#title').on('change', function(event) {

    var projectTitle = $(this).val();
    var projectTitleLength = projectTitle.length;
    var max = 20;

    PL3.G_BUY.partnerBuy.projectTitle = projectTitle;

    if (projectTitleLength >= max) {
      projectDescLength = max;
      PL3.G_BUY.partnerBuy.projectTitle = projectTitle.substring(0, max);
      $(this).val(PL3.G_BUY.partnerBuy.projectTitle);
    }
    $('#title_font_size').html(projectTitleLength);
  });

  $('#title').on('keyup', function(event) {

    var projectTitle = $(this).val();
    var projectTitleLength = projectTitle.length;
    var max = 20;

    PL3.G_BUY.partnerBuy.projectTitle = projectTitle;

    if (projectTitleLength >= max) {
      projectDescLength = max;
      PL3.G_BUY.partnerBuy.projectTitle = projectTitle.substring(0, max);
      $(this).val(PL3.G_BUY.partnerBuy.projectTitle);
    }
    $('#title_font_size').html(projectTitleLength);

  });

  /**
   * 方案描述
   * @param  {[type]} event) {        event.preventDefault();             PL3.G_BUY.partnerBuy.projectDescription [description]
   * @return {[type]}        [description]
   */
  $('#desc').on('change', function(event) {

    var projectDesc = $(this).val();
    var projectDescLength = projectDesc.length;
    var max = 200;

    PL3.G_BUY.partnerBuy.projectDescription = projectDesc;

    if (projectDescLength >= max) {
      projectDescLength = max;
      PL3.G_BUY.partnerBuy.projectDescription = projectDesc.substring(0, max);
      $(this).val(PL3.G_BUY.partnerBuy.projectDescription);
    }
    $('#desc_font_size').html(projectDescLength);
  });

  $('#desc').on('keyup', function(event) {
    event.preventDefault();
    /* Act on the event */
    var projectDesc = $(this).val();
    var projectDescLength = projectDesc.length;
    PL3.G_BUY.partnerBuy.projectDescription = projectDesc;
    var max = 200;
    if (projectDescLength >= max) {
      projectDescLength = max;
      PL3.G_BUY.partnerBuy.projectDescription = projectDesc.substring(0, max);
      $(this).val(PL3.G_BUY.partnerBuy.projectDescription);
    }
    $('#desc_font_size').html(projectDescLength);
  });

  // 是否保底
  $('#is_end_zhongjiang').on('change', function(event) {

    if ($(this)[0].checked) {
      $('#track_stop_money').removeAttr('disabled');
    } else {
      $('#track_stop_money').attr('disabled', 'disabled');
      $('#part_aegis_num').val(0);
    }

  });

  $('#track_stop_money').on('change', function() {

    var trackStopMoney = parseInt($(this).val()) || 3000;
    $(this).val(trackStopMoney);

  });

  //手动输入Mask
  $('#j-textarea-mask').on('click', function(event) {

    $(this).hide();
    $('#sd_number').addClass('focus');
    $('#sd_number')[0].focus();

  });

  $('#sd_number').on('blur', function(event) {
    event.preventDefault();
    /* Act on the event */

    var val = $.trim($(this).val());
    if (val === '') {
      $('#j-textarea-mask').show();
      $('#choose_to_buy').removeClass('active');
    }

  });

  // 更新手动输入注数
  $('#sd_number').on('keyup', function(event) {

    var iptCodes = $(this).val().replace(/，/ig, ',').split("\n");

    if (iptCodes.length === 0) {
      PL3.choose_zhushu.html(0);
      PL3.choose_money.html(0);
      updateAddBtn(false);
      PL3.chooseBuyBtn.attr('disabled', 'disabled');
      APP.showTips('请输入投注号码');
      return;
    } else {
      updateAddBtn(true);
      PL3.chooseBuyBtn.removeAttr('disabled');
      PL3.choose_zhushu.html(iptCodes.length);
      PL3.choose_money.html(iptCodes.length * 2);
    }

  });

  /**
   * 机选页面事件
   */
  // 修改注数
  $('#decrease_bet_num_proxy').on('click', function(event) {
    event.preventDefault();
    /* Act on the event */
    var betNumObj = $("#bet_num_proxy");
    var currentBetNum = parseInt(betNumObj.val());
    currentBetNum--;
    if (currentBetNum < PL3.minBetNum) {
      PL3.G_BUY.proxyBuy.betNum = PL3.minBetNum;
    } else if (currentBetNum > PL3.maxBetNum) {
      PL3.G_BUY.proxyBuy.betNum = PL3.maxBetNum;
    } else {
      PL3.G_BUY.proxyBuy.betNum = currentBetNum;
    }
    betNumObj.val(PL3.G_BUY.proxyBuy.betNum);
    calculateProxyBuy();
  });

  $('#bet_num_proxy').on('change', function() {

    var currentBetNum = parseInt($(this).val()) || 0;

    if (currentBetNum < PL3.minBetNum) {
      PL3.G_BUY.proxyBuy.betNum = PL3.minBetNum;
    } else if (currentBetNum > PL3.maxBetNum) {
      PL3.G_BUY.proxyBuy.betNum = PL3.maxBetNum;
    } else {
      PL3.G_BUY.proxyBuy.betNum = currentBetNum;
    }

    $(this).val(PL3.G_BUY.proxyBuy.betNum);
    calculateProxyBuy();

  });

  $('#increase_bet_num_proxy').on('click', function(event) {

    var betNumObj = $("#bet_num_proxy");
    var currentBetNum = parseInt(betNumObj.val());

    currentBetNum++;

    if (currentBetNum < PL3.minBetNum) {
      PL3.G_BUY.proxyBuy.betNum = PL3.minBetNum;
    } else if (currentBetNum > PL3.maxBetNum) {
      PL3.G_BUY.proxyBuy.betNum = PL3.maxBetNum;
    } else {
      PL3.G_BUY.proxyBuy.betNum = currentBetNum;
    }

    betNumObj.val(PL3.G_BUY.proxyBuy.betNum);
    calculateProxyBuy();

  });

  // 修改倍数
  $('#decrease_mutiple_proxy').on('click', function(event) {

    var betMultipleObj = $("#mutiple_proxy");
    var currentMultipleNum = parseInt(betMultipleObj.val());

    currentMultipleNum--;

    if (currentMultipleNum < PL3.minMultiple) {
      PL3.G_BUY.proxyBuy.multiple = PL3.minMultiple;
    } else if (currentMultipleNum > PL3.maxMultiple) {
      PL3.G_BUY.proxyBuy.multiple = PL3.maxMultiple;
    } else {
      PL3.G_BUY.proxyBuy.multiple = currentMultipleNum;
    }

    betMultipleObj.val(PL3.G_BUY.proxyBuy.multiple);
    calculateProxyBuy();

  });

  $('#mutiple_proxy').on('change', function() {

    var currentMultipleNum = parseInt($(this).val()) || 0;

    if (currentMultipleNum < PL3.minMultiple) {
      PL3.G_BUY.proxyBuy.multiple = PL3.minMultiple;
    } else if (currentMultipleNum > PL3.maxMultiple) {
      PL3.G_BUY.proxyBuy.multiple = PL3.maxMultiple;
    } else {
      PL3.G_BUY.proxyBuy.multiple = currentMultipleNum;
    }

    $(this).val(PL3.G_BUY.proxyBuy.multiple);
    calculateProxyBuy();
  });

  $('#increase_mutiple_proxy').on('click', function(event) {

    var betMultipleObj = $("#mutiple_proxy");
    var currentMultipleNum = parseInt(betMultipleObj.val());

    currentMultipleNum++;
    if (currentMultipleNum < PL3.minMultiple) {
      PL3.G_BUY.proxyBuy.multiple = PL3.minMultiple;
    } else if (currentMultipleNum > PL3.maxMultiple) {
      PL3.G_BUY.proxyBuy.multiple = PL3.maxMultiple;
    } else {
      PL3.G_BUY.proxyBuy.multiple = currentMultipleNum;
    }

    betMultipleObj.val(PL3.G_BUY.proxyBuy.multiple);
    calculateProxyBuy();

  });

  // 修改注数
  $('#decrease_qihao_num_proxy').on('click', function(event) {

    var betIssueNumObj = $("#qihao_num_proxy");
    var currentIssueNum = parseInt(betIssueNumObj.val());

    currentIssueNum--;

    if (currentIssueNum < PL3.minIssueNum) {
      PL3.G_BUY.proxyBuy.issueSize = PL3.minIssueNum;
    } else if (currentIssueNum > PL3.maxIssueNum) {
      PL3.G_BUY.proxyBuy.issueSize = PL3.maxIssueNum;
    } else {
      PL3.G_BUY.proxyBuy.issueSize = currentIssueNum;
    }

    betIssueNumObj.val(PL3.G_BUY.proxyBuy.issueSize);
    calculateProxyBuy();

  });

  $('#qihao_num_proxy').on('change', function() {

    var currentIssueNum = parseInt($(this).val()) || 0;

    if (currentIssueNum < PL3.minIssueNum) {
      PL3.G_BUY.proxyBuy.issueSize = PL3.minIssueNum;
    } else if (currentIssueNum > PL3.maxIssueNum) {
      PL3.G_BUY.proxyBuy.issueSize = PL3.maxIssueNum;
    } else {
      PL3.G_BUY.proxyBuy.issueSize = currentIssueNum;
    }

    $(this).val(PL3.G_BUY.proxyBuy.issueSize);
    calculateProxyBuy();

  });

  $('#increase_qihao_num_proxy').on('click', function(event) {

    var betIssueNumObj = $("#qihao_num_proxy");
    var currentIssueNum = parseInt(betIssueNumObj.val());

    currentIssueNum++;
    if (currentIssueNum < PL3.minIssueNum) {
      PL3.G_BUY.proxyBuy.issueSize = PL3.minIssueNum;
    } else if (currentIssueNum > PL3.maxIssueNum) {
      PL3.G_BUY.proxyBuy.issueSize = PL3.maxIssueNum;
    } else {
      PL3.G_BUY.proxyBuy.issueSize = currentIssueNum;
    }

    betIssueNumObj.val(PL3.G_BUY.proxyBuy.issueSize);
    calculateProxyBuy();

  });

  //////////////////////////function/////////////////////////////////////////

  function updatePartView(copies, oneCopiesMoney, rengouCopies, ticheng, rengouPercent, baodiPercent, baodiCopies) {

    var gBuy = PL3.G_BUY;
    var baodiTips = baodiCopies * oneCopiesMoney || 0;
    var totalTips = (rengouCopies + baodiCopies) * oneCopiesMoney || 0;
    if (copies === 0) {
      oneCopiesMoney = 0;
    }

    // update partnerBuy
    // 分成多少份,购买的份数,单份金额,提成比例,保底份数
    gBuy.partnerBuy.shareNum = copies;
    gBuy.partnerBuy.partBuyNum = rengouCopies;
    gBuy.partnerBuy.unitPrice = oneCopiesMoney;
    gBuy.partnerBuy.commissionPercent = parseInt($('#commission_percent').val());
    gBuy.partnerBuy.partAegisNum = baodiCopies;

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

  PL3.G_BUY.hemaiTotalMoney = 0;

  function updateCreatePartProjectParame() {

    // 总金额
    var totalMoney = PL3.G_BUY.money;

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

    if (PL3.G_BUY.hemaiTotalMoney !== totalMoney) {
      PL3.G_BUY.hemaiTotalMoney = totalMoney;
      copies = totalMoney;
    }

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

  /**
   * 计算手选号码注数
   * 更新CHOOSE注数，金额
   * 更新添加按钮Active状态，更新注数，金额 html
   * @return {[type]} [description]
   */
  function calculateChooseCodes() {
    // 投注号码 只有 直选常规投注的时候才 使用 tenCodes,digitalCodes
    // 只有 拖胆区时才使用dan,tuo
    // 除了胆拖和直选常规投注其他都用normal 作为 投注数组以获取 投注注数

    var hundredCodes = '';
    var tenCodes = '';
    var digitalCodes = '';
    var normal = '';
    var dan = '';
    var tuo = '';

    // 类型
    var b = PL3.nav.big;
    var s = PL3.nav.small;
    var zhushu = 0;

    PL3.G_CHOOSE.zhushu = 0;
    PL3.G_CHOOSE.money = 0;

    if (PL3.G_CHOOSE.codes.length === 0) {
      return;
    } else {

      if (s === 'dt') {
        dan = PL3.G_CHOOSE.codes[0][0] || [];
        tuo = PL3.G_CHOOSE.codes[0][1] || [];
      } else {
        normal = PL3.G_CHOOSE.codes[0][0] || [];
      }

    }
    // PL3--直选--常规投注
    if (b === 'zx' && s === 'cgtz') {
      for (var i = 0, len = PL3.G_CHOOSE.codes.length; i < len; i++) {
        hundredCodes = PL3.G_CHOOSE.codes[i][0] || [];
        tenCodes = PL3.G_CHOOSE.codes[i][1] || [];
        digitalCodes = PL3.G_CHOOSE.codes[i][2] || [];
        if (hundredCodes.length > 0 && tenCodes.length > 0 && digitalCodes.length > 0) {
          zhushu = PL3.getZhiXuanZhushu(hundredCodes, tenCodes, digitalCodes);
        }
      }
    }

    // PL3--直选6--常规投注
    if (b === 'zx6' && s === 'cgtz') {
      zhushu = PL3.getZuXuan6NormalZhushu(normal);
    }

    // PL3--直选3--常规投注
    if (b === 'zx3' && s === 'cgtz') {
      zhushu = PL3.getZuXuan3NormalZhushu(normal);
    }

    // PL3--直选--和值
    if (b === 'zx' && s === 'hz') {
      zhushu = PL3.getZhiXuanHeZhiZhushu(normal);
    }

    // PL3--直选3--和值
    if (b === 'zx3' && s === 'hz') {
      zhushu = PL3.getZuXuan3HeZhiZhushu(normal);
    }

    // PL3--直选6--和值
    if (b === 'zx6' && s === 'hz') {
      zhushu = PL3.getZuXuan6HeZhiZhushu(normal);
    }

    // PL3--直选3--胆拖
    if (b === 'zx3' && s === 'dt') {
      zhushu = PL3.getZuXuan3DanTuoZhushu(dan, tuo);
    }

    // PL3--直选6--胆拖
    if (b === 'zx6' && s === 'dt') {
      zhushu = PL3.getZuXuan6DanTuoZhushu(dan, tuo);
    }

    PL3.G_CHOOSE.zhushu += zhushu;
    PL3.G_CHOOSE.money += zhushu * 2;

    onCalculateChooseCodesEnd();

  }

  function onCalculateChooseCodesEnd() {

    if (PL3.G_CHOOSE.zhushu > 0) {
      updateAddBtn(true);
      PL3.chooseBuyBtn.removeAttr('disabled');
    } else {
      updateAddBtn(false);
      PL3.chooseBuyBtn.attr('disabled', 'disabled');
    }

    PL3.choose_zhushu.html(PL3.G_CHOOSE.zhushu);
    PL3.choose_money.html(PL3.G_CHOOSE.money);

  }

  /**
   * 计算已选中的投注号码
   */
  function calculateBuyCodes() {

    var zhushu = 0;

    $('#code_list .money').each(function(index, el) {
      var m = Number(_.escape($.trim($(this).html())));
      if (_.isNumber(m)) {
        zhushu += m;
      } else {
        return;
      }
    });

    zhushu = zhushu / 2;

    PL3.G_BUY.zhushu = zhushu;
    PL3.G_BUY.money = 2 * zhushu * PL3.G_BUY.mutiple;

    $('#buy_zhushu').html(PL3.G_BUY.zhushu);
    $('#project_price').html(PL3.G_BUY.money);
    $('#track_issue_num').html(0);
    $('#track_money').html(0);

    // 检测购买注数 是否满足条件
    if (Object.size(PL3.G_BUY.trackData.issueMutipleMap) > 0) {

      var trackIssueSize = 0;
      PL3.G_BUY.money = 0;

      for (var qihaoId in PL3.G_BUY.trackData.issueMutipleMap) {
        trackIssueSize++;
        var currentIssueMoney = 2 * zhushu * PL3.G_BUY.trackData.issueMutipleMap[qihaoId].mutiple;
        PL3.G_BUY.money += currentIssueMoney;
        $('.br-details').find('tbody .br-zhui-c').each(function(index, el) {
          if ($(this).attr('data-qihaoid') == qihaoId) {
            $(this).parents('tr').find('.j-money').html(currentIssueMoney);
            return;
          }
        });
      }

      $('#track_issue_num').html(trackIssueSize);
      $('#track_money').html(PL3.G_BUY.money);

    }

    // 切换 购买按钮样式
    if (PL3.G_BUY.money > 0) {
      $('#buy-submit').removeAttr("disabled");
    } else {
      $('#buy-submit').attr("disabled", "disabled");
    }

  }

  function reflectChooseCode(buyIndex) {

    PL3.ballAear.find('.j-num-group a').removeClass('active');

    var codes = {};
    for (var index in PL3.G_BUY.codes) {
      if (PL3.G_BUY.codes[index].key == buyIndex) {
        codes = PL3.G_BUY.codes[index].value.concat();
        break;
      }
    }

    PL3.G_CHOOSE.init();
    PL3.G_CHOOSE.codes[0] = codes;

    var baseobj = PL3.ballAear.find('.j-row-code');

    for (var i = 0; i < codes.length; i++) {
      var placeArr = codes[i];
      var len = placeArr.length;
      baseobj.each(function(index, el) {
        if (index == i) {
          // alert(index);
          for (var m = 0; m < len; m++) {
            $(this).find('.j-num-group a').each(function(index) {
              if (parseInt($(this).html()) == placeArr[m]) {
                $(this).addClass('active');
              }
            });
          }
        }
      });
    }

    calculateChooseCodes();

  }

  /**
   * 读取追号期号集合
   * @param  {[type]} num [description]
   * @return {[type]}     [description]
   */
  function queryTrackIssueList(num) {
    var html = '';
    $('.br-details thead .br-zhui-bei').val(1);
    $.ajax({
        url: '/lottery/digital/query-track-issue/' + PL3.G_BUY.lotyName + '?num=' + num,
        type: 'GET',
        dataType: 'json',
        // data: {param1: 'value1'},
      })
      .done(function(data) {
        if (data.retCode == 100000) {
          for (var i = 0; i < data.retData.length; i++) {
            var m = i + 1;
            var unitPrice = 2 * PL3.G_BUY.zhushu;
            PL3.G_BUY.trackData.issueMutipleMap[data.retData[i].id] = ({
              qihao: data.retData[i].qihao,
              mutiple: 1
            });
            html += '<tr><td>' + m + '</td><td><input type="checkbox" class="br-zhui-c" data-qihaoid="' + data.retData[i].id + '"data-qi="' + data.retData[i].qihao + '" checked="">' + data.retData[i].qihao + '期</td><td><input type="text" class="br-input br-zhui-bei" value="1">倍</td><td><span class="j-money">' + unitPrice + '</span>元</td><td>' + data.retData[i].awardTime.slice(0, 10) + '<span class="ml15">' + data.retData[i].awardTime.slice(10) + '</span></td></tr>';
          };
          //
        } else {
          html = '<tr><td colspan="5">系统繁忙， 请稍候再试</td></tr>';
        }
        $('#track_issue_list').html(html);
        calculateBuyCodes();
      })
      .fail(function() {
        html = '<tr><td colspan="5">系统繁忙， 请稍候再试</td></tr>';
        $('#track_issue_list').html(html);
      });
  };

  /**
   * 机选计算
   *
   * @return {[type]} [description]
   */
  function calculateProxyBuy() {

    $('#buy_bet_num_proxy').html(PL3.G_BUY.proxyBuy.betNum);
    $('#buy_multiple_proxy').html(PL3.G_BUY.proxyBuy.multiple);
    $('#buy_issue_num_proxy').html(PL3.G_BUY.proxyBuy.issueSize);

    PL3.G_BUY.money = 2 * PL3.G_BUY.proxyBuy.betNum * PL3.G_BUY.proxyBuy.multiple * PL3.G_BUY.proxyBuy.issueSize;
    PL3.G_BUY.mutiple = PL3.G_BUY.proxyBuy.multiple;

    $('#buy_money_proxy').html(PL3.G_BUY.money);
    if (PL3.G_BUY.money > 0) {
      $('#buy_button_proxy').removeAttr("disabled");
    } else {
      $('#buy_button_proxy').attr("disabled", "disabled");
    }

  }

  /**
   * 投注前格式化 投注号码
   * @return {String} 投注号码
   */
  function getFormatBuyCodes() {

    var codeArr = [];
    var unitCodeArr = [];
    var dantuoArr = [];
    var dantuoArrTotal = [];
    var s = PL3.nav.small;
    var b = PL3.nav.big;
    var returnCodes = null;

    var isMore = true;

    if (s === 'cgtz' && b !== 'zx') {
      isMore = false;
    }

    if (s === 'hz') {
      isMore = false;
    }

    if (isMore) {
      for (var i = 0; i < PL3.G_BUY.codes.length; i++) {
        unitCodeArr = [];
        for (var m = 0; m < PL3.G_BUY.codes[i].value.length; m++) {
          unitCodeArr.push(PL3.G_BUY.codes[i].value[m].join(''));
        };
        codeArr.push(unitCodeArr.join(','));
      };
      returnCodes = codeArr.join('$');
    } else {

      for (var i = PL3.G_BUY.codes.length - 1; i >= 0; i--) {
        codeArr.push(PL3.G_BUY.codes[i].value[0].join(','));
      };
      returnCodes = codeArr.join('$');

    }

    if (s === 'dt') {

      for (var i = PL3.G_BUY.codes.length - 1; i >= 0; i--) {
        dantuoArr = [];
        dantuoArr.push(PL3.G_BUY.codes[i].value[0].join(','));
        dantuoArr.push(PL3.G_BUY.codes[i].value[1].join(','));
        dantuoArrTotal.push(dantuoArr.join('@'));
      };

      returnCodes = dantuoArrTotal.join('$');
    }

    return returnCodes;
  }

  /**
   * 购买 loty
   * 1-自购,2-合买,3-追号,4-多期投注
   * @retrn {null}
   */
  function buy() {

    var url = '';
    var codeArr = getFormatBuyCodes();
    var comfirmHtml = '';
    var postIssueParameter = [];

    PL3.G_BUY.payMoney = PL3.G_BUY.money;

    if (PL3.isAgreen === false) {
      APP.showTips("请先阅读并同意《委托投注规则》后才能继续");
      return;
    }

    var parameter = {
      zhushu: PL3.G_BUY.zhushu,
      beishu: PL3.G_BUY.mutiple,
      codes: codeArr,
      unikey: (new Date()).valueOf(),
    };

    switch (PL3.G_BUY.buyType) {
      case 1:
        url = '/lottery/digital/buy-self/' + PL3.G_BUY.lotyName + '/' + PL3.playName;
        parameter.qihaoId = PL3.G_BUY.qihaoId;
        parameter.qihao = PL3.G_BUY.qihao;
        comfirmHtml = makeConfirmHtml(1, PL3.G_BUY.lotyCNName, parameter.qihao, PL3.G_BUY.zhushu, PL3.G_BUY.mutiple, PL3.G_BUY.money, 0, 0, 0, 0);
        break;
      case 2:
        url = '/lottery/digital/buy-track/' + PL3.G_BUY.lotyName + '/' + PL3.playName;

        for (var qihaoId in PL3.G_BUY.trackData.issueMutipleMap) {
          postIssueParameter.push(qihaoId + '|' + PL3.G_BUY.trackData.issueMutipleMap[qihaoId].qihao + '|' + PL3.G_BUY.trackData.issueMutipleMap[qihaoId].mutiple);
        }
        if (postIssueParameter.length < 1) {
          APP.showTips("追号最少购买一期");
          return;
        }
        if ($('#is_end_zhongjiang')[0].checked) {
          PL3.G_BUY.trackData.trackStopMoney = $('#track_stop_money').val();
        }
        parameter.endminmoney = PL3.G_BUY.trackData.trackStopMoney;
        parameter.zhuihaoqihao = postIssueParameter;
        comfirmHtml = makeConfirmHtml(2, PL3.G_BUY.lotyCNName, 0, 0, 0, 0, 0, 0, postIssueParameter.length, PL3.G_BUY.money);
        break;
      case 3:
        url = '/lottery/digital/buy-together/' + PL3.G_BUY.lotyName + '/' + PL3.playName;
        parameter.qihaoId = PL3.G_BUY.qihaoId;
        parameter.qihao = PL3.G_BUY.qihao;
        parameter.title = PL3.G_BUY.partnerBuy.projectTitle;
        parameter.textarea = PL3.G_BUY.partnerBuy.projectDescription;
        parameter.shareNum = PL3.G_BUY.partnerBuy.shareNum;
        parameter.buyNum = PL3.G_BUY.partnerBuy.partBuyNum;
        parameter.aegisNum = PL3.G_BUY.partnerBuy.partAegisNum;
        parameter.extraPercent = PL3.G_BUY.partnerBuy.commissionPercent;
        parameter.set = PL3.G_BUY.partnerBuy.shareLevel;
        if (parameter.buyNum < 1) {
          APP.showTips("合买至少认购1份");
          return;
        }
        var buyMoney = PL3.G_BUY.partnerBuy.unitPrice * parameter.buyNum;
        var aegisMoney = PL3.G_BUY.partnerBuy.unitPrice * parameter.aegisNum;
        PL3.G_BUY.payMoney = buyMoney + aegisMoney;
        comfirmHtml = makeConfirmHtml(3, PL3.G_BUY.lotyCNName, parameter.qihao, parameter.zhushu, parameter.beishu, PL3.G_BUY.money, parameter.buyNum, parameter.aegisNum, 0, 0, PL3.G_BUY.payMoney);
        break;

      case 4:
        url = '/lottery/digital/buy-rank/' + PL3.G_BUY.lotyName + '/' + PL3.playName;
        parameter.zhushu = PL3.G_BUY.proxyBuy.betNum;
        parameter.beishu = PL3.G_BUY.proxyBuy.multiple;
        parameter.qishu = PL3.G_BUY.proxyBuy.issueSize;
        PL3.G_BUY.payMoney = PL3.G_BUY.money = parameter.zhushu * parameter.beishu * parameter.qishu * 2;
        comfirmHtml = makeConfirmHtml(2, PL3.G_BUY.lotyCNName, 0, 0, 0, 0, 0, 0, parameter.qishu, PL3.G_BUY.money);
        break;
    }

    var lessMoneyTips = '';

    switch (PL3.G_BUY.buyType) {
      case 1:
        lessMoneyTips += '<p>' + PL3.G_BUY.lotyCNName + ' 第<span class="fc-3 mlr5">' + parameter.qihao + '</span>期</p>';
        lessMoneyTips += '<p>共<span class="fc-3 mlr5">' + parameter.zhushu + '</span>注, 投注<span class="fc-3 mlr5">' + parameter.beishu + '</span>倍</p>';
        break;
      case 2:
        lessMoneyTips += '<p>追号<span class="fc-3 mlr5">' + postIssueParameter.length + '</span>期</p>';
        break;
      case 3:
        lessMoneyTips += '<p>' + PL3.G_BUY.lotyCNName + ' 第<span class="fc-3 mlr5">' + parameter.qihao + '</span>期</p>';
        lessMoneyTips += '<p>方案总金额<span class="fc-3 mlr5">' + PL3.G_BUY.money + '.00</span>元</p>';
        lessMoneyTips += '<p>您认购<span class="fc-3 mlr5">' + parameter.buyNum + '</span>份, 保底<span class="fc-3 mlr5">' + parameter.aegisNum + '</span>份</p>';
        break;
      case 4:
        lessMoneyTips += '<p>多期投注：共<span class="fc-3 mlr5">' + parameter.zhushu + '</span>注，<span class="fc-3 mlr5">' + parameter.beishu + '</span>倍，<span class="fc-3 mlr5">' + parameter.qishu + '</span>期</p>';

        break;
      default:
        break;
    }

    lessMoneyTips += '<p>本次需支付：<span class="fc-3 mlr5">' + PL3.G_BUY.payMoney + '.00</span>元';

    APP.checkLogin(PL3.G_BUY.payMoney, {
      enoughMoney: function() {
        APP.showTips({
          html: comfirmHtml,
          title: '投注确认'
        });
        $('#buyConfirm').one('click', function(event) {
          $.ajax({
              url: url,
              type: 'POST',
              dataType: 'json',
              data: parameter,
            })
            .done(function(data) {
              if (data.retCode === 100000) {
                buySuccess(data.retCode, data.retMsg, data.retData.projectNo, data.retData.trackId, PL3.G_BUY.payMoney, PL3.G_BUY.lotyName, PL3.G_BUY.lotyCNName);
              } else {
                APP.handRetCode(data.retCode, data.retMsg);
                return;
              }
            })
            .fail(function() {
              buyFailure(PL3.G_BUY.lotyName, PL3.G_BUY.lotyCNName);
            });
        });
      },
      lessMoneyTips: lessMoneyTips
    });

  };

  function makeConfirmHtml(buyType, LotyCNName, issueNum, betNum, mutiple, projectPrice, buyNum, aegisNum, trackSize, trackMoney, buyPrice) {
    var commHtml = '<div class="frbox"><img src="' + staticHostURI + '/front_images/fail.png" alt="success" class="icon"><div class="text">';
    switch (buyType) {
      case 1: // 自购
        commHtml +=
          '<p>' + LotyCNName + ' 第<span>' + issueNum + '</span>期</p>\
                <p>共<span>' + betNum + '</span>注, 投注<span>' + mutiple + '</span>倍</p>\
                <p>本次需支付<span class="fc-3">' + projectPrice.toFixed(2) + '</span>元</p>';
        break;
      case 2: // 追号
        commHtml +=
          '<p>追号<span>' + trackSize + '</span>期</p>\
                <p>本次需支付<span class="fc-3">' + trackMoney + '</span>元</p>';
      case 4: // 机选
        break;
      case 3: // 合买
        if (aegisNum > 0) {
          commHtml +=
            '<p>' + LotyCNName + ' 第<span>' + issueNum + '</span>期</p>\
                  <p>方案总金额<span class="fc-3">' + projectPrice.toFixed(2) + '</span>元</p>\
                  <p>您认购<span>' + buyNum + '</span>份, 保底<span>' + aegisNum + '</span>份</p>\
                  <p>共需支付<span class="fc-3">' + buyPrice.toFixed(2) + '</span>元</p>';
        } else {
          commHtml +=
            '<p>' + LotyCNName + ' 第<span>' + issueNum + '</span>期</p>\
                  <p>方案总金额<span class="fc-3">' + projectPrice.toFixed(2) + '</span>元</p>\
                  <p>您认购<span>' + buyNum + '</span>份</p>\
                  <p>共需支付<span class="fc-3">' + buyPrice.toFixed(2) + '</span>元</p>';
        }
        break;
    }
    commHtml += '<div class="btns"><button class="btn btn-danger" id="buyConfirm">确定</button><button class="btn btn-gray" data-dismiss="modal">取消</button></div></div></div>';
    return commHtml;
  }

  function resetChooseBuyBtn() {

    if (PL3.nav.small === 'up') {
      PL3.chooseBuyBtn.attr('data-add', '2');
    } else {
      PL3.chooseBuyBtn.attr('data-add', '1');
    }
    updateAddBtn(false);
    PL3.chooseBuyBtn.attr("disabled", "disabled");
    PL3.ballAear.find('.j-num-group a').removeClass('active');
    $('#choose_to_buy_tip').html('添加到投注列表');
  }

  /**
   * 切换购买方式清空数据
   * @return {[type]} [description]
   */
  function clean4CutBuyType() {

    resetChooseBuyBtn();
    $('#sd_number').val('');
    $('#buy-submit').attr("disabled", "disabled");
    $(".br-zhu-l").html('');
    $('#sd-list').html('');
    $('#project_mutiple').val(1);
    PL3.choose_zhushu.html(0);
    PL3.choose_money.html(0);

    PL3.G_CHOOSE.init();
    calculateChooseCodes();
    PL3.G_BUY.buyType = 1;
    PL3.G_BUY.init();
    calculateBuyCodes();
    updateCreatePartProjectParame();

  }

  function buySuccess(retCode, retMsg, projectNo, trackId, buyMoney, lotyName, lotyCNName) {
    if (retCode == 100000) {

      store.set('lotyName', lotyName);
      store.set('lotyCNName', lotyCNName);
      store.set('payMoney', buyMoney);
      store.set('projectNo', projectNo);
      store.set('trackId', trackId);
      window.location.href = '/html/lottery/trade/success.html';
    } else {
      APP.handRetCode(retCode, retMsg);
    }
  }

  function buyFailure(lotyName, lotyCNName) {

    store.set('lotyName', lotyName);
    store.set('lotyCNName', lotyCNName);
    window.location.href = '/html/lottery/trade/fail.html';
  }

});