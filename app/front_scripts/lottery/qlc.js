require.config({
  paths: {
    jquery: '../lib/jquery',
    lodash: '../lib/lodash.compat.min',
    bootstrap: '../lib/bootstrap.min',
    store: '../lib/store.min',
    app: '../common/app',
    core: '../lib/core',
    QLC: '../lottery/qlc_core'
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    },
  }
});

require(['jquery', 'lodash', 'store', 'app', 'QLC', 'bootstrap', 'core'], function ($, _, store, APP, QLC) {
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
  var G_BUY = {
    lotyName: '',
    lotyCNName: '七乐彩',
    playName: '',
    codes: [],
    zhushu: 0,
    mutiple: 1,
    money: 0,
    qihaoId: 0,
    isManual: false,
    qihao: 0,
    partnerBuy: {
      projectTitle: '七乐彩合买方案',
      projectDescription: '七乐彩',
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
    init: function () {
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
        projectTitle: '七乐彩合买方案',
        projectDescription: '七乐彩',
        shareNum: 0,
        partBuyNum: 0,
        partAegisNum: 0,
        commissionPercent: 0,
        unitPrice: 0,
        shareLevel: 1,
      }, this.rowIndex = 0;
      this.proxyBuy = {
        betNum: 2,
        multiple: 1,
        issueSize: 10,
      };
    },
  };

  var G_CHOOSE = {
    codes: [],
    zhushu: 0,
    money: 0,
    init: function () {
      this.codes = [];
      this.zhushu = 0;
      this.money = 0;
    },
  };

  var G_MODIFY_CODE_OBJ = {
    codeKey: -1,
    codeObj: {},
  };

  function init() {
    G_BUY.init();
    G_CHOOSE.init();
  }

  $(document).ready(function () {
    init();

    $('#j-touzhu-tips').on('click', function (event) {

      $(this).toggleClass('active');
      $('#j-touzhu-tipstext').toggle();

    });

    if ($('#saleStatus').val() == 1) {
      APP.showStopSellModal('七乐彩');
      $('#buy-submit,#buy_button_proxy').html('暂停销售').removeClass('btn-red').addClass('btn-stop').attr('id', '');
    }
    $(".j-num-group").on('click', 'a', function (event) {
      event.preventDefault();
      /* Act on the event */
      var arr = null;
      var num = $(this).html();
      if (typeof G_CHOOSE.codes[0] === 'undefined') {
        G_CHOOSE.codes[0] = [];
      }
      arr = G_CHOOSE.codes[0].concat();
      if ($(this).hasClass('active')) {
        _.remove(arr, function (n) {
          return n == num;
        });
      } else {
        arr.push(num);
      }
      G_CHOOSE.codes[0] = arr;
      G_CHOOSE.codes[0].sort();
      $(this).toggleClass('active');
      calculateChooseCodes();
    });

    $('.jxredball').on('click', function (event) {
      event.preventDefault();
      /* Act on the event */
      G_CHOOSE.codes[0] = [];
      var codes = QLC.produceCodes($('#codeNum').val());
      $(this).parents('#home').find('.j-num-group a').removeClass('active');
      for (var i = 0, len = codes.length; i < len; i++) {
        $(this).parents('#home').find('.j-num-group a').each(function (index) {
          if ($(this).html() == codes[i]) {
            $(this).addClass('active');
            G_CHOOSE.codes[0].push($(this).html());
            return;
          }
        });
      }
      calculateChooseCodes();
    });
    $('.clearredball').on('click', function (event) {
      G_CHOOSE.codes[0] = [];
      event.preventDefault();
      $('#j_normal_choose_code').find('.j-num-group a').removeClass('active');
      calculateChooseCodes();
    });

    /**
     * 添加到投注列表按钮
     *
     * @param {[type]}
     *            event) { for (var i [description]
     * @return {[type]} [description]
     */
    $('#choose_to_buy').on('click', function (event) {

      if (!$(this).hasClass('active')) {
        return;
      }
      var bool = false;

      switch (parseInt($('#choose_to_buy').attr('data-add'))) {
      case 0:
        var firstBitCodes = G_CHOOSE.codes[0][0] || [];
        var secondBitCodes = G_CHOOSE.codes[0][1] || [];
        var thirdBitCodes = G_CHOOSE.codes[0][2] || [];
        var fourthBitCodes = G_CHOOSE.codes[0][3] || [];
        var fifthBitCodes = G_CHOOSE.codes[0][4] || [];
        if (!(firstBitCodes.length > 0 && secondBitCodes.length > 0 && thirdBitCodes.length > 0 && fourthBitCodes.length > 0 && fifthBitCodes.length > 0)) {
          return;
        }

        if (G_CHOOSE.money > QLC.maxOneBetMoney) {
          APP.showTips('您好，单个投注的金额应小于' + QLC.maxOneBetMoney + '元，请返回重新选择');
          return false;
        } else {
          for (var key in G_BUY.codes) {
            if (G_BUY.codes[key].key == G_MODIFY_CODE_OBJ.codeKey) {
              G_BUY.codes[key].value = G_CHOOSE.codes[0];
            }
          }
        }
        var html = '<div class="br-zhu-item clearfix" databit="' + G_MODIFY_CODE_OBJ.codeKey + '"><b>[常规投注]</b><div class="list">';
        for (var m = 0; m < G_CHOOSE.codes[0].length; m++) {
          html += '<span data-c="0">' + G_CHOOSE.codes[0][m] + '</span>';
        }
        html += '</div><div class="pull-right"><b><i class="money" data-m="1">' + G_CHOOSE.money + '</i>元</b><a href="javascript:;" class="br-zhu-set">修改</a><a href="javascript:;" class="br-zhu-del">删除</a></div></div>';
        G_MODIFY_CODE_OBJ.codeObj.replaceWith(html);
        bool = true;
        break;

      case 1:

        if (QLC.navPageType === 1) {
          // 注数检测
          var iptCodes = _.compact($('#sd_number').val().replace(/，/ig, ',').split("\n"));
          if (iptCodes.length > QLC.maxBuyCodeLength) {
            APP.showTips('您的投注号码多于' + QLC.maxBuyCodeLength + '行，请返回重新选择');
            return;
          }

          // 初始化 选择对象
          G_CHOOSE.init();

          // 投注合法化检测
          for (var i = 0; i < iptCodes.length; i++) {
            var validate = QLC.isIllegalCode(iptCodes[i], function (code, zhushu) {
              code.sort();
              G_CHOOSE.codes.push(code);
              G_CHOOSE.zhushu += zhushu;
              G_CHOOSE.money += zhushu * 2;
            });
            if (!validate) {
              APP.showTips(QLC.getLastErrorMsg());
              return;
            }
          }
        }

        for (var i = G_CHOOSE.codes.length - 1; i >= 0; i--) {
          if (!(G_CHOOSE.codes[i][0].length > 0 && G_CHOOSE.codes[i][1].length > 0 && G_CHOOSE.codes[i][2].length > 0 && G_CHOOSE.codes[i][3].length > 0 && G_CHOOSE.codes[i][4].length > 0)) {
            return;
          }
        }

        bool = makeChooseCodeHtml(G_CHOOSE.codes);
        break;
      }

      if (bool) {
        calculateBuyCodes();
        updateCreatePartProjectParame();
        $("#choose_zhushu").html(0);
        $("#choose_money").html(0);
        $("#sd_number").val('');
        // $('.j-num-group a.active').removeClass();
        $('#j_normal_choose_code').find('.j-num-group a').removeClass('active');
        G_CHOOSE.init();
        $('#choose_to_buy_tip').html('添加到投注列表');
        $('#choose_to_buy').attr('data-add', 1);
        $('#choose_to_buy').removeClass('active');
        $('#choose_to_buy').attr('disabled', 'disabled');
      }

    });

    /**
     * 机选按钮
     *
     * @param {[type]}
     *            event) { event.preventDefault(); var betNum [description]
     * @return {[type]} [description]
     */
    $('.j-zhu-adds').on('click', function (event) {
      event.preventDefault();
      /* Act on the event */
      var betNum = parseInt($(this).attr('data-zhu'));
      if (G_BUY.codes.length + betNum > QLC.maxBuyCodeLength) {
        APP.showTips('您的投注号码多于' + QLC.maxBuyCodeLength + '行，请返回重新选择');
        return;
      }
      for (var i = betNum - 1; i >= 0; i--) {
        var codes = QLC.produceOneBetCode();
        makeChooseCodeHtml([codes]);
      }
      calculateBuyCodes();
      // update together buy paramater
      updateCreatePartProjectParame();
    });

    /**
     * 单击事件
     *
     * @param {[type]}
     *            event) { event.preventDefault(); alert(1); } [description]
     * @return {[type]} [description]
     */
    $('.br-zhu-l').on('click', '.br-zhu-item', function (event) {
      event.preventDefault();
      if (G_BUY.isManual) {
        return;
      }
      if (event.target.tagName == "A") {
        return;
      }
      reflectChooseCode($(this).attr('databit'));
      $('#choose_to_buy').addClass('active');
    });

    /**
     * 删除投注号码
     *
     * @param {[type]}
     *            event) { var dataBit [description]
     * @return {[type]} [description]
     */
    $('.br-zhu-l').on('click', '.br-zhu-del', function (event) {
      // event.preventDefault();
      /* Act on the event */
      // alert($(this).parents('.br-zhu-item')[0] ==
      // G_MODIFY_CODE_OBJ.codeObj[0]);
      if ($(this).parents('.br-zhu-item')[0] == G_MODIFY_CODE_OBJ.codeObj[0]) {
        $('#choose_to_buy').attr('data-add', 1);
        $('#choose_to_buy_tip').html('添加到投注列表');
      }
      var dataBit = $(this).parents('.br-zhu-item').attr('dataBit');
      _.remove(G_BUY.codes, function (n) {
        return n.key == dataBit;
      });
      $(this).parents('.br-zhu-item').remove();
      calculateBuyCodes();
      updateCreatePartProjectParame();
    });

    /**
     * 修改投注号码
     *
     * @param {[type]}
     *            event) { var dataBit [description]
     * @return {[type]} [description]
     */
    $('.br-zhu-l').on('click', '.br-zhu-set', function (event) {
      // event.preventDefault();
      var objectKey = $(this).parents('.br-zhu-item').attr('databit');
      reflectChooseCode(objectKey);
      $('#choose_to_buy').addClass('active');
      $('#choose_to_buy').attr('data-add', 0);
      $('#choose_to_buy_tip').html('修改投注号码');
      G_MODIFY_CODE_OBJ = {
        codeKey: objectKey,
        codeObj: $(this).parents('.br-zhu-item')
      };
    });

    /**
     * 清空列表
     *
     * @param {[type]}
     *            event) { $("#code_list").html(''); G_BUY.init();
     *            calculateBuyCodes(); updateCreatePartProjectParame(); }
     *            [description]
     * @return {[type]} [description]
     */
    $('#clean_buy_code').on('click', function (event) {
      var buyType = G_BUY.buyType;

      $("#code_list").html('');

      G_BUY.init();
      calculateBuyCodes();
      G_BUY.mutiple = Number(_.escape($('#project_mutiple').val())) || 1;

      G_BUY.buyType = buyType;
      updateCreatePartProjectParame();
    });

    /**
     * 自降倍数
     *
     * @param {[type]}
     *            event) { event.preventDefault(); var mutipleObj [description]
     * @return {[type]} [description]
     */
    $('#decrease_mutiple').on('click', function (event) {
      event.preventDefault();
      /* Act on the event */
      var mutipleObj = $("#project_mutiple");
      var currentMultiple = parseInt(mutipleObj.val());
      currentMultiple--;
      // G_BUY.mutiple = (currentMutiple <= 0) ? 1 : currentMutiple;
      if (currentMultiple < QLC.minMultiple) {
        G_BUY.mutiple = QLC.minMultiple;
      } else if (currentMultiple > QLC.maxMultiple) {
        G_BUY.mutiple = QLC.maxMultiple;
      } else {
        G_BUY.mutiple = currentMultiple;
      }
      mutipleObj.val(G_BUY.mutiple);
      calculateBuyCodes();
      updateCreatePartProjectParame();
    });

    /**
     * 自降倍数
     *
     * @param {[type]}
     *            event) { event.preventDefault(); var mutipleObj [description]
     * @return {[type]} [description]
     */
    $('#project_mutiple').on('change', function (event) {
      event.preventDefault();
      /* Act on the event */
      var currentMultiple = parseInt($(this).val()) || 0;
      if (currentMultiple < QLC.minMultiple) {
        G_BUY.mutiple = QLC.minMultiple;
      } else if (currentMultiple > QLC.maxMultiple) {
        G_BUY.mutiple = QLC.maxMultiple;
      } else {
        G_BUY.mutiple = currentMultiple;
      }
      $(this).val(G_BUY.mutiple);
      calculateBuyCodes();
      updateCreatePartProjectParame();
    });

    /**
     * 自增倍数
     *
     * @param {[type]}
     *            event) { event.preventDefault(); var mutipleObj [description]
     * @return {[type]} [description]
     */
    $('#increase_mutiple').on('click', function (event) {
      event.preventDefault();
      /* Act on the event */
      var mutipleObj = $("#project_mutiple");
      var currentMultiple = parseInt(mutipleObj.val());
      currentMultiple++;
      // G_BUY.mutiple = (currentMutiple <= 0) ? 1 : currentMutiple;
      if (currentMultiple < QLC.minMultiple) {
        G_BUY.mutiple = QLC.minMultiple;
      } else if (currentMultiple > QLC.maxMultiple) {
        G_BUY.mutiple = QLC.maxMultiple;
      } else {
        G_BUY.mutiple = currentMultiple;
      }
      mutipleObj.val(G_BUY.mutiple);
      calculateBuyCodes();
      updateCreatePartProjectParame();
    });

    /**
     * 提交购买按钮
     *
     * @param {[type]}
     *            event) { event.preventDefault(); buy(); } [description]
     * @return {[type]} [description]
     */
    $('#buy-submit').on('click', function (event) {
      event.preventDefault();
      /* Act on the event */
      if ($(this).parents('.br-tou').find('.j-sub-agreed')[0].checked === false) {
        APP.showTips("请先阅读并同意《委托投注规则》后才能继续");
        return;
      }
      fnBuy();
    });

    $('#buy_button_proxy').on('click', function (event) {
      event.preventDefault();
      /* Act on the event */
      if ($(this).parents('.br-tou').find('.j-sub-agreed')[0].checked === false) {
        APP.showTips("请先阅读并同意《委托投注规则》后才能继续");
        return;
      }
      fnBuy();
    });

    /**
     * 切换购买方式
     *
     * @param {Object}
     *            event) { event.preventDefault();
     *            G_BUY.trackData.issueMutipleMap [description]
     * @return {[type]} [description]
     */
    $('#buy_type').on('click', 'a', function (event) {
      event.preventDefault();
      G_BUY.buyType = parseInt($(this).attr('data-buytype'));
      initBuyType();
    });

    function initBuyType() {
      $('#buy_type').find('.icon-y2').removeClass('icon-y2');
      $('#buy_type').find('.icon').each(function (index, el) {
        if ($(this).parents('a[data-toggle="tab"]').attr('data-buytype') == G_BUY.buyType) {
          $(this).addClass('icon-y2');
        }
      });
      $('#buy_type').siblings('.tab-content').find('.tab-pane').each(function (index, el) {
        if (index == G_BUY.buyType - 1) {
          $(this).addClass('active');
        } else {
          $(this).removeClass('active');
        }
      });
      G_BUY.trackData.issueMutipleMap = {}; // clean
      $('#buy_mutiple_span').show();
      G_BUY.partnerBuy = {
        projectTitle: '七乐彩合买方案',
        projectDescription: '七乐彩'
      }; // clean partner buy
      // G_BUY.buyType = parseInt($(this).attr('data-buytype'));
      G_BUY.mutiple = 1;
      $('#project_mutiple').val(G_BUY.mutiple);
      switch (G_BUY.buyType) {
      case 1: // 自购
        $('#track_desc').addClass('hide');
        calculateBuyCodes();
        break;

      case 2: // 追号
        $('#buy_mutiple_span').hide();
        $('#track_desc').removeClass('hide');
        queryTrackIssueList(10);
        calculateBuyCodes();
        break;
      case 3: // 合买
        calculateBuyCodes();
        $('#track_desc').addClass('hide');
        $("#share-num").val(G_BUY.money);
        updateCreatePartProjectParame();
        break;
      }
    }

    $('#issue_size').on('change', function (event) {
      event.preventDefault();
      G_BUY.trackData.issueMutipleMap = {}; // clean
      /* Act on the event */
      queryTrackIssueList($(this).val());
    });

    $('.br-details thead .br-zhui-c').on('change', function (event) {
      var checked = $(this)[0].checked;
      $(this).parents('.br-details').find('tbody .br-zhui-c').each(function (index, el) {
        el.checked = checked;
      });
      // ZHUI.setZhuiHaoTotal(Config.box);
      G_BUY.trackData.issueMutipleMap = {}; // clean
      $(this).parents('.br-details').find('tbody .br-zhui-c').each(function (index, el) {
        if (el.checked) {
          G_BUY.trackData.issueMutipleMap[$(this).attr('data-qihaoid')] = {
            qihao: $(this).attr('data-qi'),
            mutiple: $(this).parents('tr').find('.br-zhui-bei').val()
          };
        }
      });
      calculateBuyCodes();
    });

    // 追号总期的期数改变
    $('.br-details').on('change', 'tbody .br-zhui-c', function (event) {
      event.preventDefault();
      /* Act on the event */
      // ZHUI.setZhuiHaoTotal(Config.box);
      G_BUY.trackData.issueMutipleMap = {}; // clean
      $(this).parents('.br-details').find('tbody .br-zhui-c').each(function (index, el) {
        if (el.checked) {
          G_BUY.trackData.issueMutipleMap[$(this).attr('data-qihaoid')] = {
            qihao: $(this).attr('data-qi'),
            mutiple: $(this).parents('tr').find('.br-zhui-bei').val()
          };
        }
      });
      calculateBuyCodes();
    });

    // 追号总期的倍数改变
    $('.br-details thead .br-zhui-bei').on('change', function (event) {
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
      baseObj.find('tbody .br-zhui-c').each(function (index, el) {
        el.checked = 'checked';
        G_BUY.trackData.issueMutipleMap[$(this).attr('data-qihaoid')] = {
          qihao: $(this).attr('data-qi'),
          mutiple: $(this).parents('tr').find('.br-zhui-bei').val()
        };
      });
      calculateBuyCodes();
    });

    // 追号每期的倍数改变
    $('.br-details tbody').on('change', '.br-zhui-bei', function (event) {
      var val = parseInt($(this).val()) || 1;
      if (isNaN(val) || val < 1) {
        val = 1;
      } else {
        val = Math.ceil(val);
        (val > 9999) && (val = 9999);
      }
      $(this).val(val);
      var baseObj = $(this).parents('tr');
      var issueObj = baseObj.find('.br-zhui-c');
      issueObj.attr('checked', 'checked');
      G_BUY.trackData.issueMutipleMap[issueObj.attr('data-qihaoid')] = {
        qihao: issueObj.attr('data-qi'),
        mutiple: baseObj.find('.br-zhui-bei').val()
      };
      calculateBuyCodes();
    });

    // 我要分成多少份，最少一份，最多购买金额的数量
    $("#share-num").on('change', function (event) {
      event.preventDefault();
      updateCreatePartProjectParame();
    });

    // 我要认购的份数
    $("#part_buy").on('change', function (event) {
      event.preventDefault();
      updateCreatePartProjectParame();
    });

    // 我要提成比例
    $('#commission_percent').on('change', function (event) {
      event.preventDefault();
      var val = parseInt($(this).val()) || 0;
      var rengouPercent = Math.floor($('#part_buy_percent').html());
      if (val > rengouPercent) {
        $("#part_buy").val(Math.ceil($("#commission_percent").val() / 100 * ($('#share-num').val() || 0)));
        updateCreatePartProjectParame();
      }
      G_BUY.partnerBuy.commissionPercent = val;
    });

    // 是否保底
    $('#has_part_aegis').on('change', function (event) {
      event.preventDefault();
      updateCreatePartProjectParame();
    });

    // 保底金额修改
    $('#part_aegis_num').on('change', function (event) {
      event.preventDefault();
      updateCreatePartProjectParame();
    });

    // 方案保密设置
    $('.br-set-group').on('click', 'a', function (event) {
      event.preventDefault();
      /* Act on the event */
      $(this).parents('.br-set-group').find('a').removeClass('active');
      $(this).toggleClass('active');
      switch ($(this).html()) {
      case '截止后公开':
        G_BUY.partnerBuy.shareLevel = 1;
        break;
      case '立即公开':
        G_BUY.partnerBuy.shareLevel = 0;
        break;
      case '截止前对跟单人公开':
        G_BUY.partnerBuy.shareLevel = 2;
        break;
      }
    });

    /**
     * 方案标题
     *
     * @param {[type]}
     *            event) { event.preventDefault(); G_BUY.partnerBuy.projectTitle
     *            [description]
     * @return {[type]} [description]
     */
    $('#title').on('change', function (event) {
      event.preventDefault();
      /* Act on the event */
      var projectTitle = $(this).val();
      var projectTitleLength = projectTitle.length;
      G_BUY.partnerBuy.projectTitle = projectTitle;
      var max = 20;
      if (projectTitleLength >= max) {
        projectDescLength = max;
        G_BUY.partnerBuy.projectTitle = projectTitle.substring(0, max);
        $(this).val(G_BUY.partnerBuy.projectTitle);
      }
      $('#title_font_size').html(projectTitleLength);
    });
    $('#title').on('keyup', function (event) {
      event.preventDefault();
      /* Act on the event */
      var projectTitle = $(this).val();
      var projectTitleLength = projectTitle.length;
      G_BUY.partnerBuy.projectTitle = projectTitle;
      var max = 20;
      if (projectTitleLength >= max) {
        projectDescLength = max;
        G_BUY.partnerBuy.projectTitle = projectTitle.substring(0, max);
        $(this).val(G_BUY.partnerBuy.projectTitle);
      }
      $('#title_font_size').html(projectTitleLength);
    });

    /**
     * 方案描述
     *
     * @param {[type]}
     *            event) { event.preventDefault();
     *            G_BUY.partnerBuy.projectDescription [description]
     * @return {[type]} [description]
     */
    $('#desc').on('change', function (event) {
      event.preventDefault();
      /* Act on the event */
      var projectDesc = $(this).val();
      var projectDescLength = projectDesc.length;
      G_BUY.partnerBuy.projectDescription = projectDesc;
      var max = 200;
      if (projectDescLength >= max) {
        projectDescLength = max;
        G_BUY.partnerBuy.projectDescription = projectDesc.substring(0, max);
        $(this).val(G_BUY.partnerBuy.projectDescription);
      }
      $('#desc_font_size').html(projectDescLength);
    });
    $('#desc').on('keyup', function (event) {
      event.preventDefault();
      /* Act on the event */
      var projectDesc = $(this).val();
      var projectDescLength = projectDesc.length;
      G_BUY.partnerBuy.projectDescription = projectDesc;
      var max = 200;
      if (projectDescLength >= max) {
        projectDescLength = max;
        G_BUY.partnerBuy.projectDescription = projectDesc.substring(0, max);
        $(this).val(G_BUY.partnerBuy.projectDescription);
      }
      $('#desc_font_size').html(projectDescLength);
    });

    // br-type icon toggle
    $('#buy_type a[data-toggle="tab"]').on('click', function (e) {
      $(this).parents('#buy_type').find('.icon-y2').removeClass('icon-y2');
      $(this).find('.icon').addClass('icon-y2');
    });

    // 是否保底
    $('#is_end_zhongjiang').on('change', function (event) {
      event.preventDefault();
      /* Act on the event */
      if ($(this)[0].checked) {
        $('#track_stop_money').removeAttr('disabled');
        // updateCreatePartProjectParame();
      } else {
        $('#track_stop_money').attr('disabled', 'disabled');
        $('#part_aegis_num').val(0);
      }
    });
    $('#track_stop_money').on('change', function () {
      event.preventDefault();
      /* Act on the event */
      var trackStopMoney = parseInt($(this).val()) || 3000;
      $(this).val(trackStopMoney);
    });

    //手动输入Mask
    $('#j-textarea-mask').on('click', function (event) {

      $(this).hide();
      $('#sd_number').addClass('focus');
      $('#sd_number')[0].focus();

    });

    $('#sd_number').on('blur', function (event) {
      event.preventDefault();
      /* Act on the event */

      var val = $.trim($(this).val());
      if (val === '') {
        $('#j-textarea-mask').show();
        $('#choose_to_buy').removeClass('active');
      }

    });

    // 更新手动输入注数
    $('#sd_number').on('keyup blur', function (event) {

      var iptCodes = _.compact($(this).val().replace(/，/ig, ',').split("\n"));

      $('#choose_zhushu').html(iptCodes.length);
      $('#choose_money').html(iptCodes.length * 2);

      if (iptCodes.length) {

        $('#choose_to_buy').addClass('active');
        $('#choose_to_buy').removeAttr('disabled');
        G_BUY.isManual = true;

      } else {

        $('#choose_to_buy').removeClass('active');
        $('#choose_to_buy').attr('disabled', 'disabled');

      }

    });

    /**
     * 玩法type切换
     */
    $('#j-nav').on('click', 'a', function (event) {
      event.preventDefault();

      var _this = $(this);
      var pagetype = Number(_this.attr('data-pagetype'));
      var newTab = $(this).attr('href');
      var li = _this.parents('li');

      if (G_BUY.codes.length >= 1) {
        APP.showTips({
          title: '友情提示',
          text: '切换玩法将会清空您的号码',
          type: 2,
          onConfirm: function () {
            $('#myModal').modal('hide');
            // 清空追号数据
            $('.br-details').find('tbody .br-zhui-c').each(function (index, el) {
              _this.parents('tr').find('.j-money').html(0);
            });
            toggleTabs(newTab, li, pagetype);
            $('#choose_to_buy_tip').html('添加到投注列表');
            $('#choose_to_buy').attr('data-add', 1);
          }
        });
      } else {
        toggleTabs(newTab, li, pagetype);
      }
    });

    function toggleTabs(newTab, li, pagetype) {

      var oldTab = $('#j-nav li.active a').attr('href');

      QLC.navPageType = pagetype;

      $(oldTab).removeClass('active');
      $(newTab).addClass('active');
      li.addClass('active');
      li.siblings('.active').removeClass('active');
      $('#choose_to_buy').attr('data-add', '1');
      $('#j_normal_choose_code').find('.j-num-group a').removeClass('active');
      $('#sd_number').val('');
      G_BUY.init();
      G_CHOOSE.init();
      clean4CutBuyType();
      calculateChooseCodes();
      calculateBuyCodes();

      G_BUY.proxyBuy.betNum = $('#bet_num_proxy').val();
      G_BUY.proxyBuy.multiple = $('#mutiple_proxy').val();
      G_BUY.proxyBuy.issueSize = $('#qihao_num_proxy').val();

      $('#buy-submit').attr("disabled", "disabled");
      switch (pagetype) {
      case 0:
        G_BUY.buyType = 1;
        $("li.j-jx-zhus").show();
        $('#j-box-right').show();
        $('#j-box-bottom').show();
        $('#choose_to_buy').removeClass('active');
        $('#choose_to_buy').attr('disabled', 'disabled');
        $('#j-box-left').removeClass('multiphase-box');
        break;

      case 1:
        G_BUY.buyType = 1;
        $("li.j-jx-zhus").hide();
        // $('auto_produce').hide();
        $('#j-box-right').show();
        $('#j-box-bottom').show();
        $('#choose_to_buy').removeClass('active');
        $('#choose_to_buy').attr('disabled', 'disabled');
        $('#j-box-left').removeClass('multiphase-box');
        break;
      case 2:
        G_BUY.buyType = 4;
        calculateProxyBuy();
        $("li.j-jx-zhus").show();
        // $('#auto_produce').show();
        $('#j-box-right').hide();
        $('#j-box-bottom').hide();
        $('#j-box-left').addClass('multiphase-box');
        break;
      }

      initBuyType();
    }

    // ///////////////////////机选页面事件/////////////////////////////////////////
    // 修改注数
    $('#decrease_bet_num_proxy').on('click', function (event) {
      event.preventDefault();
      /* Act on the event */
      var betNumObj = $("#bet_num_proxy");
      var currentBetNum = parseInt(betNumObj.val());
      currentBetNum--;
      if (currentBetNum < QLC.minBetNum) {
        G_BUY.proxyBuy.betNum = QLC.minBetNum;
      } else if (currentBetNum > QLC.maxBetNum) {
        G_BUY.proxyBuy.betNum = QLC.maxBetNum;
      } else {
        G_BUY.proxyBuy.betNum = currentBetNum;
      }
      betNumObj.val(G_BUY.proxyBuy.betNum);
      calculateProxyBuy();
    });
    $('#bet_num_proxy').on('change', function () {
      // bet_num_proxy
      var currentBetNum = parseInt($(this).val()) || 0;
      if (currentBetNum < QLC.minBetNum) {
        G_BUY.proxyBuy.betNum = QLC.minBetNum;
      } else if (currentBetNum > QLC.maxBetNum) {
        G_BUY.proxyBuy.betNum = QLC.maxBetNum;
      } else {
        G_BUY.proxyBuy.betNum = currentBetNum;
      }
      $(this).val(G_BUY.proxyBuy.betNum);
      calculateProxyBuy();
    });
    $('#increase_bet_num_proxy').on('click', function (event) {
      event.preventDefault();
      /* Act on the event */
      var betNumObj = $("#bet_num_proxy");
      var currentBetNum = parseInt(betNumObj.val());
      currentBetNum++;
      if (currentBetNum < QLC.minBetNum) {
        G_BUY.proxyBuy.betNum = QLC.minBetNum;
      } else if (currentBetNum > QLC.maxBetNum) {
        G_BUY.proxyBuy.betNum = QLC.maxBetNum;
      } else {
        G_BUY.proxyBuy.betNum = currentBetNum;
      }
      betNumObj.val(G_BUY.proxyBuy.betNum);
      calculateProxyBuy();
    });

    // 修改倍数
    $('#decrease_mutiple_proxy').on('click', function (event) {
      event.preventDefault();
      /* Act on the event */
      var betMultipleObj = $("#mutiple_proxy");
      var currentMultipleNum = parseInt(betMultipleObj.val());
      currentMultipleNum--;
      if (currentMultipleNum < QLC.minMultiple) {
        G_BUY.proxyBuy.multiple = QLC.minMultiple;
      } else if (currentMultipleNum > QLC.maxMultiple) {
        G_BUY.proxyBuy.multiple = QLC.maxMultiple;
      } else {
        G_BUY.proxyBuy.multiple = currentMultipleNum;
      }
      betMultipleObj.val(G_BUY.proxyBuy.multiple);
      calculateProxyBuy();
    });
    $('#mutiple_proxy').on('change', function () {
      // mutiple_proxy
      var currentMultipleNum = parseInt($(this).val()) || 0;
      if (currentMultipleNum < QLC.minMultiple) {
        G_BUY.proxyBuy.multiple = QLC.minMultiple;
      } else if (currentMultipleNum > QLC.maxMultiple) {
        G_BUY.proxyBuy.multiple = QLC.maxMultiple;
      } else {
        G_BUY.proxyBuy.multiple = currentMultipleNum;
      }
      $(this).val(G_BUY.proxyBuy.multiple);
      calculateProxyBuy();
    });
    $('#increase_mutiple_proxy').on('click', function (event) {
      event.preventDefault();
      /* Act on the event */
      var betMultipleObj = $("#mutiple_proxy");
      var currentMultipleNum = parseInt(betMultipleObj.val());
      currentMultipleNum++;
      if (currentMultipleNum < QLC.minMultiple) {
        G_BUY.proxyBuy.multiple = QLC.minMultiple;
      } else if (currentMultipleNum > QLC.maxMultiple) {
        G_BUY.proxyBuy.multiple = QLC.maxMultiple;
      } else {
        G_BUY.proxyBuy.multiple = currentMultipleNum;
      }
      betMultipleObj.val(G_BUY.proxyBuy.multiple);
      calculateProxyBuy();
    });
    // 修改注数
    $('#decrease_qihao_num_proxy').on('click', function (event) {
      event.preventDefault();
      /* Act on the event */
      var betIssueNumObj = $("#qihao_num_proxy");
      var currentIssueNum = parseInt(betIssueNumObj.val());
      currentIssueNum--;
      if (currentIssueNum < QLC.minIssueNum) {
        G_BUY.proxyBuy.issueSize = QLC.minIssueNum;
      } else if (currentIssueNum > QLC.maxIssueNum) {
        G_BUY.proxyBuy.issueSize = QLC.maxIssueNum;
      } else {
        G_BUY.proxyBuy.issueSize = currentIssueNum;
      }
      betIssueNumObj.val(G_BUY.proxyBuy.issueSize);
      calculateProxyBuy();
    });
    $('#qihao_num_proxy').on('change', function () {
      // qihao_num_proxy
      var currentIssueNum = parseInt($(this).val()) || 0;
      if (currentIssueNum < QLC.minIssueNum) {
        G_BUY.proxyBuy.issueSize = QLC.minIssueNum;
      } else if (currentIssueNum > QLC.maxIssueNum) {
        G_BUY.proxyBuy.issueSize = QLC.maxIssueNum;
      } else {
        G_BUY.proxyBuy.issueSize = currentIssueNum;
      }
      $(this).val(G_BUY.proxyBuy.issueSize);
      calculateProxyBuy();
    });
    $('#increase_qihao_num_proxy').on('click', function (event) {
      event.preventDefault();
      /* Act on the event */
      var betIssueNumObj = $("#qihao_num_proxy");
      var currentIssueNum = parseInt(betIssueNumObj.val());
      currentIssueNum++;
      if (currentIssueNum < QLC.minIssueNum) {
        G_BUY.proxyBuy.issueSize = QLC.minIssueNum;
      } else if (currentIssueNum > QLC.maxIssueNum) {
        G_BUY.proxyBuy.issueSize = QLC.maxIssueNum;
      } else {
        G_BUY.proxyBuy.issueSize = currentIssueNum;
      }
      betIssueNumObj.val(G_BUY.proxyBuy.issueSize);
      calculateProxyBuy();
    });

    // ////////////////////////function/////////////////////////////////////////

    function updatePartView(copies, oneCopiesMoney, rengouCopies, ticheng, rengouPercent, baodiPercent, baodiCopies) {

      var baodiTips = baodiCopies * oneCopiesMoney || 0;
      var totalTips = (rengouCopies + baodiCopies) * oneCopiesMoney || 0;
      if (copies === 0) {
        oneCopiesMoney = 0;
      }

      // update partnerBuy
      // 分成多少份,购买的份数,单份金额,提成比例,保底份数
      G_BUY.partnerBuy.shareNum = copies;
      G_BUY.partnerBuy.partBuyNum = rengouCopies;
      G_BUY.partnerBuy.unitPrice = oneCopiesMoney;
      G_BUY.partnerBuy.commissionPercent = parseInt($('#commission_percent').val());
      G_BUY.partnerBuy.partAegisNum = baodiCopies;

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

    G_BUY.hemaiTotalMoney = 0;

    function updateCreatePartProjectParame() {
      var totalMoney = G_BUY.money;   // 总金额
      var $shareEl = $('#share-num');   //划分份数DOM
      var $partEl = $('#part_buy');     //认购份数DOM
      var $commissionEl = $('#commission_percent');  //提成比例DOM
      var $partAegisEl = $('#part_aegis_num');  //保底分数DOM
      var $hasPartEl = $('#has_part_aegis');  //是否保底checkbox DOM

      // 获取份数 shareNum
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

      // 是否保底 hasPartAegis
      var isBaodi = $hasPartEl[0].checked || false;

      copies = Number(copies.replace(/[^0-9]/g, ''));
      rengouCopies = Number(rengouCopies.replace(/[^0-9]/g, ''));

      if (G_BUY.hemaiTotalMoney !== totalMoney) {
        G_BUY.hemaiTotalMoney = totalMoney;
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

      if (rengouCopies / copies < .05) {
        rengouCopies = Math.ceil(copies * .05);
      }

      // 认购金额必须大于提成金额
      if (ticheng > (rengouCopies / copies * 100)) {
        rengouCopies = Math.ceil(copies * ticheng * 0.01);
      }
      rengouMoney = rengouCopies * oneCopiesMoney;

      // 是否保底
      if ($hasPartEl[0]) {
        isBaodi = $hasPartEl[0].checked;
      }

      // 设置保底份数
      if (isBaodi) {

        $partAegisEl[0].disabled = false;

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

    /**
     * 计算手选号码注数
     *
     * @return {[type]} [description]
     */
    function calculateChooseCodes() {
      G_CHOOSE.zhushu = 0;
      G_CHOOSE.money = 0;
      // 计算注数
      for (var i = 0, len = G_CHOOSE.codes.length; i < len; i++) {
        var zhushu = QLC.getNormalZhushu(G_CHOOSE.codes[i]);
        G_CHOOSE.zhushu += zhushu;
        G_CHOOSE.money += zhushu * 2;
      }
      if (G_CHOOSE.zhushu > 0) {
        $('#choose_to_buy').addClass('active');
        $('#choose_to_buy').removeAttr('disabled');
      } else {
        $('#choose_to_buy').removeClass('active');
        $('#choose_to_buy').attr('disabled', 'disabled');
      }
      $("#choose_zhushu").html(G_CHOOSE.zhushu);
      $("#choose_money").html(G_CHOOSE.money);
    }

    /**
     * 计算已选中的投注号码
     */
    function calculateBuyCodes() {

      var zhushu = 0;
      for (var i = G_BUY.codes.length - 1; i >= 0; i--) {
        zhushu += QLC.getNormalZhushu(G_BUY.codes[i].value);
      }
      G_BUY.zhushu = zhushu;
      G_BUY.money = 2 * zhushu * G_BUY.mutiple;
      $('#buy_zhushu').html(G_BUY.zhushu);
      $('#project_price').html(G_BUY.money);
      $('#track_issue_num').html(0);
      $('#track_money').html(0);
      if (Object.size(G_BUY.trackData.issueMutipleMap) > 0) {
        var trackIssueSize = 0;
        G_BUY.money = 0;
        for (var qihaoId in G_BUY.trackData.issueMutipleMap) {
          trackIssueSize++;
          var currentIssueMoney = 2 * zhushu * G_BUY.trackData.issueMutipleMap[qihaoId].mutiple;
          G_BUY.money += currentIssueMoney;
          $('.br-details').find('tbody .br-zhui-c').each(function (index, el) {
            if ($(this).attr('data-qihaoid') == qihaoId) {
              $(this).parents('tr').find('.j-money').html(currentIssueMoney);
              return;
            }
          });
        }
        $('#track_issue_num').html(trackIssueSize);
        $('#track_money').html(G_BUY.money);
      }

      if (G_BUY.money > 0) {
        $('#buy-submit').removeAttr("disabled");
      } else {
        $('#buy-submit').attr("disabled", "disabled");
      }
    }

    function makeChooseCodeHtml(codes) {
      var newCodes = codes;
      var html = '';
      if ((G_BUY.codes.length + G_CHOOSE.codes.length) > QLC.maxBuyCodeLength) {
        APP.showTips('您的投注号码多于' + QLC.maxBuyCodeLength + '行，请返回重新选择');
        return;
      }
      for (var i = 0; i < newCodes.length; i++) {
        G_BUY.rowIndex++;
        html += '<div class="br-zhu-item clearfix" dataBit=' + G_BUY.rowIndex + '><b>[常规投注]</b><div class="list">';
        for (var m = 0; m < newCodes[i].length; m++) {
          html += '<span data-c="0">' + newCodes[i][m] + '</span>';
        }
        var money = 2 * QLC.getNormalZhushu(newCodes[i]);
        if (money > QLC.maxOneBetMoney) {
          APP.showTips('您好，单个投注的金额应小于' + QLC.maxOneBetMoney + '元，请返回重新选择');
          return false;
        }
        var mdfBtn = (G_BUY.isManual) ? '' : '<a href="javascript:;" class="br-zhu-set">修改</a>';
        html += '</div><div class="pull-right"><b><i class="money" data-m="1">' + money + '</i>元</b>' + mdfBtn + '<a href="javascript:;" class="br-zhu-del">删除</a></div></div>';

        G_BUY.codes.push({
          key: G_BUY.rowIndex,
          value: newCodes[i]
        });
      }
      $("#code_list").append(html);
      return true;
    };

    function reflectChooseCode(buyIndex) {
      $('#home').find('.j-num-group a').removeClass('active');
      var codes = {};
      for (var index in G_BUY.codes) {
        if (G_BUY.codes[index].key == buyIndex) {
          codes = G_BUY.codes[index].value.concat();
          break;
        }
      }
      G_CHOOSE.init();
      G_CHOOSE.codes[0] = codes;
      for (var m = 0; m < codes.length; m++) {
        $('#home').find('.j-num-group a').each(function (index) {
          if (parseInt($(this).html()) == codes[m]) {
            $(this).addClass('active');
          }
        });
      }
      calculateChooseCodes();
    }

    /**
     * 切换购买方式清空数据
     *
     * @return {[type]} [description]
     */
    function clean4CutBuyType() {
      $(".br-zhu-l").html('');
      $('#sd-list').html('');
      G_BUY.init();
      calculateBuyCodes();
      updateCreatePartProjectParame();
    }

    /**
     * 读取追号期号集合
     *
     * @param {[type]}
     *            num [description]
     * @return {[type]} [description]
     */
    function queryTrackIssueList(num) {
      var html = '';
      $('.br-details thead .br-zhui-bei').val(1);
      $.ajax({
        url: '/lottery/digital/query-track-issue/' + G_BUY.lotyName + '?num=' + num,
        type: 'GET',
        dataType: 'json',
        // data: {param1: 'value1'},
      }).done(function (data) {
        if (data.retCode == 100000) {
          for (var i = 0; i < data.retData.length; i++) {
            var m = i + 1;
            var unitPrice = 2 * G_BUY.zhushu;
            G_BUY.trackData.issueMutipleMap[data.retData[i].id] = ({
              qihao: data.retData[i].qihao,
              mutiple: 1
            });
            html += '<tr><td>' + m + '</td><td><input type="checkbox" class="br-zhui-c" data-qihaoid="' + data.retData[i].id + '"data-qi="' + data.retData[i].qihao + '" checked="">' + data.retData[i].qihao + '期</td><td><input type="text" class="br-input br-zhui-bei" value="1">倍</td><td><span class="j-money">' + unitPrice + '</span>元</td><td>' + data.retData[i].awardTime.slice(0, 10) + '<span class="ml15">' + data.retData[i].awardTime.slice(10) + '</span></td></tr>';
          }
        } else {
          html = '<tr><td colspan="5">系统繁忙， 请稍候再试</td></tr>';
        }
        $('#track_issue_list').html(html);
        calculateBuyCodes();
      }).fail(function () {
        html = '<tr><td colspan="5">系统繁忙， 请稍候再试</td></tr>';
        $('#track_issue_list').html(html);
      });
    }

    /**
     * 机选计算
     *
     * @return {[type]} [description]
     */
    function calculateProxyBuy() {
      $('#buy_bet_num_proxy').html(G_BUY.proxyBuy.betNum);
      $('#buy_multiple_proxy').html(G_BUY.proxyBuy.multiple);
      $('#buy_issue_num_proxy').html(G_BUY.proxyBuy.issueSize);
      G_BUY.money = 2 * G_BUY.proxyBuy.betNum * G_BUY.proxyBuy.multiple * G_BUY.proxyBuy.issueSize;
      G_BUY.mutiple = G_BUY.proxyBuy.multiple;
      $('#buy_money_proxy').html(G_BUY.money);
      if (G_BUY.money > 0) {
        $('#buy_button_proxy').removeAttr("disabled");
      } else {
        $('#buy_button_proxy').attr("disabled", "disabled");
      }
    }

    var fnBuy = function () {
      var url = '';
      var codeArr = [];
      for (var i = 0; i < G_BUY.codes.length; i++) {
        codeArr.push(G_BUY.codes[i].value.join(','));
      }
      var parameter = {
        zhushu: G_BUY.zhushu,
        beishu: G_BUY.mutiple,
        codes: codeArr.join('$'),
        unikey: (new Date()).valueOf(),
      };
      var comfirmHtml = '';
      var costRealMoney = 0;
      switch (G_BUY.buyType) {
      case 1:
        url = '/lottery/digital/buy-self/' + G_BUY.lotyName + '/' + G_BUY.playName;
        parameter.qihaoId = G_BUY.qihaoId;
        parameter.qihao = G_BUY.qihao;
        costRealMoney = G_BUY.money;
        comfirmHtml = makeConfirmHtml(1, G_BUY.lotyCNName, parameter.qihao, G_BUY.zhushu, G_BUY.mutiple, G_BUY.money, 0, 0, 0, 0);
        break;

      case 2:
        url = '/lottery/digital/buy-track/' + G_BUY.lotyName + '/' + G_BUY.playName;
        var postIssueParameter = [];
        for (var qihaoId in G_BUY.trackData.issueMutipleMap) {
          postIssueParameter.push(qihaoId + '|' + G_BUY.trackData.issueMutipleMap[qihaoId].qihao + '|' + G_BUY.trackData.issueMutipleMap[qihaoId].mutiple);
        }
        if (postIssueParameter.length < 1) {
          APP.showTips("追号最少购买一期");
          return;
        }
        if ($('#is_end_zhongjiang')[0].checked) {
          G_BUY.trackData.trackStopMoney = $('#track_stop_money').val();
        }
        parameter.endminmoney = G_BUY.trackData.trackStopMoney;
        parameter.zhuihaoqihao = postIssueParameter;
        costRealMoney = G_BUY.money;
        comfirmHtml = makeConfirmHtml(2, G_BUY.lotyCNName, 0, 0, 0, 0, 0, 0, postIssueParameter.length, G_BUY.money);
        break;

      case 3:
        url = '/lottery/digital/buy-together/' + G_BUY.lotyName + '/' + G_BUY.playName;
        parameter.qihaoId = G_BUY.qihaoId;
        parameter.qihao = G_BUY.qihao;
        parameter.title = G_BUY.partnerBuy.projectTitle;
        parameter.textarea = G_BUY.partnerBuy.projectDescription;
        parameter.shareNum = G_BUY.partnerBuy.shareNum;
        parameter.buyNum = G_BUY.partnerBuy.partBuyNum;
        parameter.aegisNum = G_BUY.partnerBuy.partAegisNum;
        parameter.extraPercent = G_BUY.partnerBuy.commissionPercent;
        parameter.set = (typeof G_BUY.partnerBuy.shareLevel === 'undefined') ? 1 : G_BUY.partnerBuy.shareLevel;
        if (parameter.rengouMoney < 1) {
          APP.showTips("合买至少认购一元");
          return;
        }
        var buyMoney = G_BUY.partnerBuy.unitPrice * parameter.buyNum;
        var aegisMoney = G_BUY.partnerBuy.unitPrice * parameter.aegisNum;
        costRealMoney = buyMoney + aegisMoney;
        //                comfirmHtml = makeConfirmHtml(3, G_BUY.lotyCNName, parameter.qihao, parameter.zhushu, parameter.beishu, G_BUY.money, buyMoney, aegisMoney, 0, 0);
        comfirmHtml = makeConfirmHtml(3, G_BUY.lotyCNName, parameter.qihao, parameter.zhushu, parameter.beishu, G_BUY.money, parameter.buyNum, parameter.aegisNum, 0, 0, costRealMoney);
        break;

      case 4:
        url = '/lottery/digital/buy-rank/' + G_BUY.lotyName + '/' + G_BUY.playName;
        parameter.zhushu = G_BUY.proxyBuy.betNum;
        parameter.beishu = G_BUY.proxyBuy.multiple;
        parameter.qishu = G_BUY.proxyBuy.issueSize;
        costRealMoney = G_BUY.money;
        comfirmHtml = makeConfirmHtml(2, G_BUY.lotyCNName, 0, 0, 0, 0, 0, 0, parameter.qishu, G_BUY.money);
        break;
      }

      var lessMoneyTips = '';

      switch (G_BUY.buyType) {
      case 1:
        lessMoneyTips += '<p>' + G_BUY.lotyCNName + ' 第<span class="fc-3 mlr5">' + parameter.qihao + '</span>期</p>';
        lessMoneyTips += '<p>共<span class="fc-3 mlr5">' + parameter.zhushu + '</span>注, 投注<span class="fc-3 mlr5">' + parameter.beishu + '</span>倍</p>';
        break;
      case 2:
        lessMoneyTips += '<p>追号<span class="fc-3 mlr5">' + postIssueParameter.length + '</span>期</p>';
        break;
      case 3:
        lessMoneyTips += '<p>' + G_BUY.lotyCNName + ' 第<span class="fc-3 mlr5">' + parameter.qihao + '</span>期</p>';
        lessMoneyTips += '<p>方案总金额<span class="fc-3 mlr5">' + G_BUY.money + '.00</span>元</p>';
        lessMoneyTips += '<p>您认购<span class="fc-3 mlr5">' + parameter.buyNum + '</span>份, 保底<span class="fc-3 mlr5">' + parameter.aegisNum + '</span>份</p>';
        break;
      case 4:
        lessMoneyTips += '<p>多期投注：共<span class="fc-3 mlr5">' + parameter.zhushu + '</span>注，<span class="fc-3 mlr5">' + parameter.beishu + '</span>倍，<span class="fc-3 mlr5">' + parameter.qishu + '</span>期</p>';

        break;
      default:
        break;
      }

      lessMoneyTips += '<p>本次需支付：<span class="fc-3 mlr5">' + costRealMoney + '.00</span>元';

      APP.checkLogin(costRealMoney, {
        enoughMoney: function () {
          APP.showTips({
            html: comfirmHtml,
            title: '投注确认'
          });

          $('#buyConfirm').one('click', function (event) {

            $.ajax({
              url: url,
              type: 'POST',
              dataType: 'json',
              data: parameter,
            }).done(function (data) {
              if (data.retCode === 100000) {
                buySuccess(data.retCode, data.retMsg, data.retData.projectNo, data.retData.trackId, costRealMoney, G_BUY.lotyName, G_BUY.lotyCNName);
              } else {
                APP.showTips(data.retMsg);
                return;
              }
            }).fail(function () {
              buyFailure(G_BUY.lotyName, G_BUY.lotyCNName);
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

});