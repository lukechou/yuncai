require.config({
  paths: {
    jquery: '../lib/jquery',
    lodash: '../lib/lodash.compat.min',
    store: '../lib/store.min',
    bootstrap: '../lib/bootstrap.min',
    app: '../common/app',
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

require(['jquery', 'lodash', 'store', 'app', 'bootstrap', 'tipsy'], function($, _, store, APP) {
  'use strict';

  // Config-Constant
  var BET_MIN = 30; //最小投注
  var BET_MAX = 500000; //最大投注
  var INTERVAL_MIN = 0; //最小间隔
  var INTERVAL_MAX = 10; //最大间隔
  var NUM_MIN = 1; //最小期数
  var NUM_MAX = 50; //最大期数
  var PERCENT_MIN = -100; //最小比例
  var PERCENT_MAX = 1000; //最大比例

  var modelId = $('#j-module-id').val();

  var percentTotal = 0; //比例总额
  var moneyTotal = 0; //总额比例
  var moneyIssueMin = moneyArr[0][0]; //总额投注最小期数
  var moneyIssueMax = moneyArr[moneyArr.length - 1][0]; //总额投注最大期数
  var $issue = $('#j-issue'); //期数
  var $first = $('#j-first'); //初始投注
  var $space = $('#j-space'); //间隔期数
  var $rate = $('#j-rate'); //增加比例
  var $total = $('#j-total'); //投注总额
  var $body = $('#j-data-body'); // 表格主体
  var $modifyBtn = $('#j-modify'); // 修改分配按钮
  var countMoneyBl = false; //总额投注是否已点击过分配计算
  var countPercentBl = false; //比例投注是否已点击过分配计算
  var rNum = /\D/; //是否有非数字
  var totalMoneyMin = 0; //总额投注最小金额
  var percentTip = '(<span class="fc-3">范围：1-50期</span>)'; //比例期数提示
  var autoType = 0; //投注类型 0-间隔投注  1-固定投注
  var rInt = /^-?[0-9]{1,}$/; //整数正则

  // AUTO 对象
  var AUTO = {
    changedfrom: false,
  };

  // 表格计算事件
  // 修改比例-添加比例
  $body.on('click', '.j-add', function(event) {
    event.preventDefault();

    var $num = $(this).siblings('.j-num');
    var oVal = parseInt($num.val());

    if (!autoType) {

      oVal++;
      if (oVal < PERCENT_MIN || oVal > PERCENT_MAX) {
        APP.showTips('投注增加比例范围为' + PERCENT_MIN + '%-' + PERCENT_MAX + '%');
        return;
      }

    }

    if (AUTO.timer) {
      clearTimeout(AUTO.timer);
    }

    AUTO.timer = setTimeout(function() {
      if (autoType) {
        oVal += 2;
        countPercentFn($num, oVal);
      } else {
        countMoneyFn($num, oVal);
      }

    }, 100);

  });

  // 修改比例-减少比例
  $body.on('click', '.j-reduce', function(event) {
    event.preventDefault();

    var $num = $(this).siblings('.j-num');
    var oVal = parseInt($num.val());

    if (!autoType) {

      oVal--;
      if (oVal < PERCENT_MIN || oVal > PERCENT_MAX) {
        APP.showTips('投注增加比例范围为' + PERCENT_MIN + '%-' + PERCENT_MAX + '%');
        return;
      }

    }

    if (AUTO.timer) {
      clearTimeout(AUTO.timer);
    }

    AUTO.timer = setTimeout(function() {

      if (autoType) {
        oVal -= 2;
        countPercentFn($num, oVal);
      } else {
        countMoneyFn($num, oVal);
      }

    }, 100);
  });

  // 修改比例-手动输入
  $body.on('keyup', '.j-num', function(event) {
    event.preventDefault();

    var $num = $(this);
    var oVal = parseInt($num.val(), 10);

    if ($num.val() == '-') return;

    if (oVal == -0) {

      $num.val(0);
      oVal = 0;

    }

    if (isNaN(oVal)) {
      $(this).val($(this).val().replace(/[^0-9.-]/g, ''));
      oVal = $num.val();
    }

    if (AUTO.timer) {
      clearTimeout(AUTO.timer);
    }

    AUTO.timer = setTimeout(function() {

      if (autoType) {
        countPercentFn($num, oVal);
      } else {
        countMoneyFn($num, oVal);
      }

    }, 200);

  });

  // 修改比例-失去焦点
  $body.on('blur', '.j-num', function(event) {
    event.preventDefault();

    if (autoType === 0) {

      var $num = $(this);
      var oVal = $num.val();

      if (oVal < PERCENT_MIN || oVal > PERCENT_MAX || !rInt.test(oVal)) {
        APP.showTips('投注增加比例范围为' + PERCENT_MIN + '%-' + PERCENT_MAX + '%');
        $num.val($num.data('val'));
        return;
      }

    }

  });

  // 修改金额-添加
  $body.on('click', '.j-add-m', function(event) {
    event.preventDefault();

    var curInputEl = $(this).siblings('.j-cur-input');
    var oVal = parseInt(curInputEl.val()) + 2;

    if (oVal < BET_MIN) {

      APP.showTips('投注金额范围为' + BET_MIN + '-' + BET_MAX + '元');
      return;

    } else if (oVal > BET_MAX) {

      APP.showTips('投注金额范围为' + BET_MIN + '-' + BET_MAX + '元');
      return;

    }

    if (AUTO.mTimer) {
      clearTimeout(AUTO.mTimer);
    }

    AUTO.mTimer = setTimeout(function() {
      countCurFn(curInputEl, oVal);
    }, 100);

  });

  // 修改金额-减少
  $body.on('click', '.j-reduce-m', function(event) {
    event.preventDefault();

    var curInputEl = $(this).siblings('.j-cur-input');
    var oVal = parseInt(curInputEl.val()) - 2;

    if (oVal < BET_MIN) {
      APP.showTips('投注金额范围为' + BET_MIN + '-' + BET_MAX + '元');
      return;
    } else if (oVal > BET_MAX) {
      APP.showTips('投注金额范围为' + BET_MIN + '-' + BET_MAX + '元');
      return;
    }

    if (AUTO.mTimer) {
      clearTimeout(AUTO.mTimer);
    }

    AUTO.mTimer = setTimeout(function() {
      countCurFn(curInputEl, oVal)
    }, 100);

  });

  // 修改金额-手动输入
  $body.on('keyup', '.j-cur-input', function(event) {
    event.preventDefault();

    var $this = $(this);
    var oVal = $this.val();

    $(this).val($(this).val().replace(/[^0-9]/g, ''));

    if (oVal < BET_MIN) return;

    if (!rInt.test(oVal)) {
      return;
    }

    $this.val(oVal);

    for (var i = 0; i < AUTO.curInput.length; i++) {
      var curValM = AUTO.curInput.eq(i).val();
      if (i > 0) {
        var preValM = AUTO.curInput.eq(i - 1).val();
        var m = parseInt((curValM / preValM - 1) * 100, 10);
        if (m > 1000 || m < -100) {
          return false;
        }
      }
    }

    if (oVal % 2 != 0) {
      oVal++;
    }

    if (AUTO.mTimer) {
      clearTimeout(AUTO.mTimer);
    }

    AUTO.mTimer = setTimeout(function() {
      countCurFn($this, oVal)
    }, 100);
    if (oVal > 30) {
      checkCurMoney($this);
    }

  });

  $body.on('blur', '.j-cur-input', function(event) {
    event.preventDefault();

    $(this).val($(this).val().replace(/[^0-9]/g, ''));

    var $this = $(this);
    checkCurMoney($this);

  });

  //////////////////////////////
  //////////////////////////////
  //////////////////////////////
  //////////////////////////////
  /////////////////////////////////
  //////////////////////////////
  /////////////////////////////////
  //////////////////////////////

  //修改当期投注金额
  function countCurFn($obj, val) {

    $obj.val(val);

    //检查是否超出范围
    for (var i = 0; i < AUTO.curInput.length; i++) {

      var curValM = AUTO.curInput.eq(i).val();

      if (i > 0) {

        var preValM = AUTO.curInput.eq(i - 1).val();
        var m = parseInt((curValM / preValM - 1) * 100, 10);

        if (m > PERCENT_MAX || m < PERCENT_MIN) {
          APP.showTips('在投注金额范围内，需满足投注增加比例的范围' + PERCENT_MIN + '%-' + PERCENT_MAX + '%');
          $obj.val($obj.data('val'));
          return false;
        }

      }
    }

    $obj.data('val', val); //存储data

    for (var i = 0; i < AUTO.curInput.length; i++) {

      var curVal = AUTO.curInput.eq(i).val();

      if (curVal < BET_MIN) {

        APP.showTips('投注金额范围为' + BET_MIN + '-' + BET_MAX + '元');
        curVal = BET_MIN;

      } else if (curVal > BET_MAX) {

        APP.showTips('投注金额范围为' + BET_MIN + '-' + BET_MAX + '元');
        curVal = BET_MAX;

      }

      AUTO.curInput.eq(i).text(curVal);
      AUTO.curInput.eq(i).val(curVal);
      AUTO.curMoneyObj.eq(i).html(curVal);

      if (i > 0) {
        var preVal = AUTO.curInput.eq(i - 1).val();
        var percentVal = parseInt((curVal / preVal - 1) * 100, 10)
        AUTO.numObj.eq(i).val(percentVal).data('val', percentVal);
      }

      var curNum = AUTO.numObj.eq(i).val();
      AUTO.viewObj.eq(i).text(curNum + '%');
      var curMoney = parseInt(curVal);

      if (0 < i) {
        var preMoney = parseInt(AUTO.addMoneyObj.eq(i - 1).text(), 10);
        AUTO.addMoneyObj.eq(i).text(parseInt(curMoney) + preMoney);
        $('#j-count-total').text(parseInt(curMoney) + preMoney);
        percentTotal = parseInt(curMoney) + preMoney;
      } else {
        AUTO.addMoneyObj.eq(i).text(curMoney);
      }

      var addMoney = AUTO.addMoneyObj.eq(i).text();
      AUTO.bountyMoneyObj.eq(i).text((parseInt(curVal) * ar).toFixed(2));
    }

  }

  function checkCurMoney($this) {

    var oVal = $this.val();

    if (oVal < BET_MIN) {

      APP.showTips('投注金额范围为' + BET_MIN + '-' + BET_MAX + '元');
      $this.val(BET_MIN);
      return;

    } else if (oVal > BET_MAX) {

      APP.showTips('投注金额范围为' + BET_MIN + '-' + BET_MAX + '元');
      $this.val(BET_MAX);
      return;

    } else if (!rInt.test(oVal)) {

      APP.showTips('请输入整数');
      $this.val($this.data('val'));
      return;

    }

    for (var i = 0; i < AUTO.curInput.length; i++) {

      var curValM = AUTO.curInput.eq(i).val();
      if (i > 0) {

        var preValM = AUTO.curInput.eq(i - 1).val();
        var m = parseInt((curValM / preValM - 1) * 100, 10);

        if (m > PERCENT_MAX || m < PERCENT_MIN) {
          APP.showTips('在投注金额范围内，需满足投注增加比例的范围' + PERCENT_MIN + '%-' + PERCENT_MAX + '%');
          $this.val($this.data('val'));
          return false;
        }

      }

    }

  }

  //////////////////////////////
  //////////////////////////////
  //////////////////////////////
  //////////////////////////////
  /////////////////////////////////
  //////////////////////////////
  /////////////////////////////////
  //////////////////////////////
  function pageInit() {

    // 初始化 提示悬浮
    $('.j-icon-tips').tipsy({
      gravity: 's',
      opacity: 1
    });

    $('#j-first,#j-space,#j-rate').tipsy({
      trigger: 'focus',
      gravity: 's',
      opacity: 1
    });

    //投注类型切换
    $('[name="autotype"]').on('change', function(event) {
      event.preventDefault();

      var v = $(this).val();
      var jIssue = $('#j-issue');
      var tabCount = 4;

      autoType = ~~v;

      jIssue.trigger('keyup').trigger('focus');

      if (autoType === 1) {
        tabCount = 4;
      } else {
        tabCount = 5;
      }

      countMoneyBl = autoType;
      countPercentBl = !autoType;

      $('#j-percent-edit-wrap').addClass('hide');
      $body.html('<tr><td colspan="' + tabCount + '" class="empty-tip">请填写参数并执行投注分配</td></tr>');

      AUTO.changedfrom = false;

    });

    //期数获焦提示
    $issue.focus(function() {

      if (1 == autoType) {

        if (1 == moneyIssueMax) { //是否多于2期

          $('#j-money-issue-tip').html('（<span class="fc-3">范围：' + moneyIssueMin + '期</span>）');

        } else {

          $('#j-money-issue-tip').html('（<span class="fc-3">范围：' + moneyIssueMin + '-' + moneyIssueMax + '期</span>）');

        }

      } else {

        $('#j-money-issue-tip').html(percentTip);

      }

    });

    //期数改变投注额提示
    $issue.keyup(function() {

      if (autoType === 1) {

        var val = $(this).val();

        totalMoneyMin = 0;

        for (var i = 0; i < moneyArr.length; i++) {

          if (moneyArr[i][0] == val) {
            totalMoneyMin = moneyArr[i][1];
          }

        }

        if (totalMoneyMin) {

          if (totalMoneyMin >= 1000) {

            var strTotal = totalMoneyMin + '';
            strTotal = strTotal.replace(/(\d\d\d)$/, ',$1');

          } else {

            strTotal = totalMoneyMin;

          }

          $('#j-money-total-tip').removeClass('hide').html('（<span class="fc-3">范围：' + strTotal + '-500,000 元</span>）');

          $('.j-total').val(totalMoneyMin);

        } else {

          $('#j-money-total-tip').addClass('hide');

        }

      } else {

        $('#j-money-total-tip').addClass('hide');

      }

    });

  }

  pageInit();

  function updateBottomTips() {

    $('#j-count-result').removeClass('hide');
    $('#j-count-total').text(AUTO.addVal);
    $('#j-count-issue').text(AUTO.issueVal);
  }

  function createMoneyTableHtml(data) {

    var html = '';

    for (var k in data) {
      if (data.hasOwnProperty(k)) {

        html += '<tr>';

        html += '<td class="w200">' + k + '<input type="hidden" name="issue_num[]" value="' + k + '"></td>';

        html += '<td><span class="j-view">' + data[k].bet_money + '</span>';
        html += '<span class="j-edit edit-wrap clearfix hide">';
        html += '<a href="javascript:;" class="i-reduce j-reduce">-</a>';
        html += '<input class="j-num edit-num" data-val="' + data[k].bet_money + '" type="text" name="current_money[]" value="' + data[k].bet_money + '">';
        html += '<a href="javascript:;" class="i-add j-add">+</a>';
        html += '</span></td>';

        html += '<td class="w200"><span class="j-add-money">' + data[k].add_money + '</span></td>';
        html += '<td class="w200"><span class="j-bounty-money">' + data[k].bounty_money + '</span></td>';
        html += '</tr>';
      }
    }

    return html;
  }

  function toggleEditEl() {

    if (1 < AUTO.issueVal) {
      $('#j-percent-edit-wrap').removeClass('hide');
    } else {
      $('#j-percent-edit-wrap').addClass('hide');
    }

  }

  function toggleTheadEl() {

    var a = ~~autoType;
    var s = ['#j-percent-thead', '#j-money-thead'];
    var b = ~~(!a);

    $(s[a]).removeClass('hide');
    $(s[b]).addClass('hide');

  }

  function clearVal(v) {
    return ~~(_.escape($.trim(v)));
  }

  function getRateHtml() {

    var html = '';
    var issueVal = AUTO.issueVal;
    var rateVal = AUTO.rateVal;
    var firstVal = AUTO.firstVal;
    var curVal = AUTO.curVal;
    var spaceVal = AUTO.spaceVal;

    var curRate = parseInt(rateVal, 10);
    var bountyVal = 0;
    var newRate = 1; //投注比例
    spaceVal += 1; //间隔期从1开始计算

    for (var i = 0; i < issueVal; i++) {

      if ((i != 0 && i % spaceVal == 0) || (i != 0 && spaceVal == 0)) {
        //是否为间隔期数
        curRate = parseInt(rateVal, 10); //为间隔期数显示增加比例值
        newRate *= (curRate / 100 + 1); //每次间隔乘以增加比例
      } else {
        curRate = 0; //不为间隔期数显示增加比例为0
      }
      curVal = Math.round(firstVal * newRate); //当期投注金额
      if (curVal % 2 != 0) {
        curVal++;
      }

      AUTO.addVal += curVal; //累计投注金额

      bountyVal = (parseFloat(curVal * ar)).toFixed(2); //当期预计奖金

      html += '<tr>';
      html += '<td class="w80">' + (i + 1) + '<input type="hidden" name="issue_num[]" value="' + (i + 1) + '"></td>';

      if (i == 0) {

        //第一个比例不能修改
        html += '<td class="w1"><span class="j-view j-rate-view">' + curRate + '%</span><span class="j-edit hide">' + curRate + '%</span>';
        html += '<input maxLength="6" class="j-num edit-num" type="hidden" name="current_rate[]" value="' + curRate + '">';
        html += '</td>';

      } else {

        html += '<td class="w1"><span class="j-view j-rate-view">' + curRate + '%</span>';
        html += '<span class="edit-wrap-w j-edit hide clearfix"><span class="edit-wrap clearfix">';
        html += '<a href="javascript:;" class="i-reduce j-reduce">-</a>';
        html += '<input maxLength="6" data-val="' + curRate + '" class="j-num edit-num"  title="范围为 -100%-1000%"  type="text" name="current_rate[]" value="' + curRate + '">';
        html += '<a href="javascript:;" class="i-add j-add">+</a>';
        html += '</span> %</span></td>';

      }

      html += '<td class="w1"><span class="j-view j-cur-money">' + curVal + '</span>';
      html += '<span class="edit-wrap-w j-edit hide clearfix"><span class="edit-wrap clearfix">';
      html += '<a href="javascript:;" class="i-reduce j-reduce-m">-</a>';
      html += '<input data-val="' + curVal + '" class="j-cur-input edit-num" title="范围为 30-500000 元" type="text" name="current_money[]" value="' + curVal + '">';
      html += '<a href="javascript:;" class="i-add j-add-m">+</a>';
      html += '</span></span></td>';

      // 累计投注金额,当前预计金额
      html += '<td class="w200"><span class="j-add-money">' + AUTO.addVal + '</span></td>';
      html += '<td class="w200"><span class="j-bounty-money">' + bountyVal + '</span></td>';
      html += '</tr>';
    }

    return html;
  }

  function checkMoneyParamsStatus() {

    var issueVal = clearVal($('#j-issue').val());
    var totalVal = clearVal($('#j-total').val());

    if (moneyIssueMin > issueVal || moneyIssueMax < issueVal || rNum.test(issueVal) || issueVal == '') {

      APP.showTips('期数不能小于' + moneyIssueMin + '或大于' + moneyIssueMax);
      return false;

    }

    if (totalVal < totalMoneyMin || totalVal > BET_MAX || rNum.test(totalVal) || totalVal == '' || totalVal % 2 != 0) {

      APP.showTips('投注总额不能小于' + totalMoneyMin + '或大于' + BET_MAX + '偶数整数');
      return false;

    }

    return true;
  }

  function checkParamsStatus() {

    var issueVal = $issue.val();
    var totalVal = $total.val();
    var firstVal = $first.val();
    var spaceVal = parseInt($space.val(), 10);
    var rateVal = $rate.val();

    if (issueVal === '' || issueVal < NUM_MIN || issueVal > NUM_MAX || rNum.test(issueVal)) {
      APP.showTips('期数不得小于1或大于50的整数');
      return false;
    }

    if (firstVal === '' || firstVal < BET_MIN || firstVal > BET_MAX || rNum.test(firstVal) || firstVal % 2 != 0) {
      APP.showTips('每期的首期投注范围为30-500000的偶数，请重新设置');
      return false;
    }

    if (spaceVal < INTERVAL_MIN || spaceVal > INTERVAL_MAX || rNum.test(spaceVal) || spaceVal === '') {
      APP.showTips('每期的间隔期数范围为0-10，请重新设置');
      return false;
    }

    if (rNum.test(rateVal) || PERCENT_MIN > rateVal || PERCENT_MAX < rateVal || rateVal === '') {
      APP.showTips('每期的增加比例范围为0%-1000%，请重新设置');
      return false;
    }

    return true;
  }

  function updateTable(html) {

    $body.html(html);
    afterTableUpdate();

  }

  function ajaxFenPei() {

    AUTO.addVal = AUTO.totalVal;

    $.ajax({
        url: '/lottery/model/autobuy/analyse-fixed-profit/ajx',
        type: 'get',
        dataType: 'json',
        data: {
          't': $.now(),
          'total_issue': AUTO.issueVal,
          'model_id': modelId,
          'total_money': AUTO.totalVal
        },
      })
      .done(function(json) {

        if (json.retCode === 100000) {

          var html = '';

          html = createMoneyTableHtml(json.retData);

          if (!html) {
            return;
          }

          // 切换表格头
          toggleTheadEl();

          // 更新表格
          updateTable(html);

          moneyTotal = AUTO.totalVal;

          // 模型自动投注 box 底部提示
          updateBottomTips();

          return;

        } else {

          APP.showTips(json.retMsg);
          return;

        }
      });

  }

  function afterTableUpdate() {

    AUTO.viewObj = $body.find('.j-rate-view');
    AUTO.numObj = $body.find('.j-num');
    AUTO.curMoneyObj = $body.find('.j-cur-money');
    AUTO.curInput = $body.find('.j-cur-input');
    AUTO.addMoneyBtn = $body.find('.j-add-m');
    AUTO.reduceMoneyBtn = $body.find('.j-reduce-m');
    AUTO.addMoneyObj = $body.find('.j-add-money');
    AUTO.bountyMoneyObj = $body.find('.j-bounty-money');
    AUTO.addObj = $body.find('.j-add');
    AUTO.reduceObj = $body.find('.j-reduce');
    AUTO.preVal = 0;
    AUTO.timer = null; //增减时间器
    AUTO.mTimer = null; //金额增减时间器

    if (autoType) {
      AUTO.viewObj = $body.find('.j-view');
    }

  }

  function updateAutoParams() {

    AUTO.issueVal = clearVal($('#j-issue').val());
    AUTO.firstVal = clearVal($('#j-first').val());
    AUTO.spaceVal = clearVal($('#j-space').val());
    AUTO.rateVal = clearVal($('#j-rate').val());

    if (autoType) {
      AUTO.totalVal = clearVal($('#j-total').val());
    } else {
      AUTO.totalVal = clearVal($('#j-count-total').html());
    }

  }

  function createBuyModal() {

    var bodyHtml = $('#j-data-body').html();
    var headHtml = '';
    var titleHtml = '您对模型<span class="mlr5">' + modelId + '</span> 设置了' + AUTO.issueVal + '期的自动投注 总投注金额为<b class="mlr5 fc-3">' + AUTO.totalVal + '</b>元（<span class="fc-84">系统会按期自动投注</span>）';
    var stopHtml = '';

    if (clearVal($('[name="autostop"]:checked').val())) {
      stopHtml = '完成所有期数后终止';
    } else {
      stopHtml = '盈利以后自动终止';
    }

    if (autoType) {
      headHtml = '<tr><th class="w200">期数</th><th>当期投注金额(元)</th><th class="w200">累计投注金额(元)</th><th class="w200">当前预计奖金(元)</th></tr>';
    } else {
      headHtml = '<tr><th>期数</th><th>投注增加比例</th><th>当期投注金额(元)</th><th>累计投注金额(元)</th><th>当前预计奖金(元)</th></tr>';
    }

    $('#j-modal-title').html(titleHtml);
    $('#j-modal-thead').html(headHtml);
    $('#j-modal-tbody').html(bodyHtml);
    $('#j-moal-stop').html(stopHtml);
    $('#autoModal').modal('show');

  }

  // 投注
  $('#j-auto-buy').on('click', function(event) {
    event.preventDefault();

    /*
     * total_issue  自动投注期数
     * model_id  模型id
     * total_money  总金额
     * stop_type 终止自动投注条件 1-完成所有期数后终止 2-盈利以后自动终止
     * first_money  首期投注金额
     * space_issue  间隔期数
     * space_rate  间隔增加比例
     * auto_type 投注类型
     * issue_num  []
     * current_rate  []
     * current_money  []
     *
     */
    var stopHtml = '';

    if (clearVal($('[name="autostop"]:checked').val())) {
      stopHtml = '完成所有期数后终止';
    } else {
      stopHtml = '盈利以后自动终止';
    }

    var data = {
      total_issue: AUTO.issueVal,
      model_id: modelId,
      total_money: AUTO.totalVal,
      stop_type: clearVal($('[name="autostop"]:checked').val()),
      first_money: AUTO.firstVal,
      space_issue: AUTO.spaceVal,
      space_rate: AUTO.rateVal,
      auto_type: autoType,
    };

    $('#j-data-body').find('input[name]').each(function() {
      var name = $(this).attr('name') + '';
      if (name.length !== 0) {
        if (!data[name]) {
          data[name] = [];
        }
        data[name].push($(this).val());
      }
    });

    $('#autoModal').modal('hide');

    autoBuy(data);

  });

  function autoBuy(data) {

    var payMoney = null;
    if (autoType) {
      payMoney = Number($('#j-data-body .j-num').eq(0).val());
    } else {
      payMoney = AUTO.firstVal;
    }

    var lessMoneyTips = '<p>当前账户余额不足支付自动投注的首期金额</p><p>首期投注金额：<span class="fc-3">' + payMoney + '.00</span>元</p>';

    APP.checkLogin(payMoney, {
      enoughMoney: function(m) {

        $.ajax({
            url: '/lottery/model/autobuy/buy',
            type: 'post',
            dataType: 'json',
            data: data,
          })
          .done(function(data) {

            if (data.retCode === 100000) {
              // APP.showTips('<p>自动投注设置成功</p><p>投注模型：' + modelId + '，系统会在' + stopHtml + '。</p>');
              window.location.href = '/lottery/model/autobuy/auto-buy-detail?model_id=' + modelId;
            } else {
              APP.showTips(data.retMsg);
            }

          });

      },
      lessMoneyTips: lessMoneyTips
    });
  }

  $('.j-inp-num').on('keyup paste', function(event) {
    event.preventDefault();
    $(this).val($(this).val().replace(/[^0-9]/g, ''));
  });

  // 确认自动投注

  $('#j-count-confirm').on('click', function(event) {
    event.preventDefault();

    if (!AUTO.changedfrom) {
      APP.showTips('请先点击计算自动投注分配！');
      return false;
    }

    APP.checkLogin(null, {
      always: function() {

        var ajaxDataObj = {};

        updateAutoParams();

        if (autoType === 0) {

          AUTO.status = checkParamsStatus();

          if (AUTO.status) {
            //判断金额范围
            var curMoneyObj = $('.j-view');

            for (var i = 0; i < curMoneyObj.length; i++) {
              var val = curMoneyObj.eq(i).text();
              if (val < BET_MIN || val > BET_MAX) {
                APP.showTips('当期投注不能小于30或大于500000');
                return false;
              }
            }

            $('.j-edit').addClass('hide');
            $('.j-view').removeClass('hide');
            createBuyModal();

          } else {
            return;
          }

        }

        if (autoType === 1) {

          AUTO.status = checkMoneyParamsStatus();

          if (AUTO.status) {

            //判断金额范围
            var curMoneyObj = $('.j-cur-money');

            for (var i = 0; i < curMoneyObj.length; i++) {
              var val = curMoneyObj.eq(i).text();
              if (val < BET_MIN || val > BET_MAX) {
                APP.showTips('当期投注不能小于30或大于500000');
                return false;
              }
            }

            $('.j-edit').addClass('hide');
            $('.j-view').removeClass('hide');

            createBuyModal();

          } else {
            return;
          }

        }
      }
    }, true);

  });

  //切换投注分配
  $modifyBtn.on('click', function(event) {
    event.preventDefault();

    $('.j-edit').removeClass('hide');
    $('.j-view').addClass('hide');

  });

  /*
   * 绑定分配事件
   * autoType  自动投注类型 0-间隔比例型 1-固定收益型
   */
  $('#j-count').on('click', function(event) {
    event.preventDefault();

    AUTO.changedfrom = true;

    // Get All Params
    updateAutoParams();
    var html = '';

    if (autoType === 0) {

      countPercentBl = true;
      AUTO.status = checkParamsStatus();

      if (AUTO.status) {

        // 切换修改提示
        toggleEditEl();

        // 切换表格头
        toggleTheadEl();

        AUTO.curVal = parseInt(AUTO.firstVal, 10);
        AUTO.addVal = 0;

        //当期投注不大于最大投注额
        if (AUTO.curVal > BET_MAX) {
          APP.showTips('当期投注金额不能大于' + BET_MAX);
          return false;
        }

        //比例总额
        percentTotal = AUTO.addVal;

        // 创建表格
        html = getRateHtml();
        updateTable(html);

        // 模型自动投注 box 底部提示
        updateBottomTips();

      }

      return;

    }

    if (autoType === 1) {

      //按总额
      countMoneyBl = true;
      AUTO.status = checkMoneyParamsStatus();

      if (AUTO.status) {

        // 切换修改提示
        toggleEditEl();

        ajaxFenPei();

      }

      return;
    }

  });

  // 间隔比例-表格重绘 $num:比例节点，val：当前要计算的值
  function countMoneyFn($num, val) {

    var index = AUTO.numObj.index($num);
    var curRate = val / 100 + 1;
    var newCurRate = null;

    if (!rInt.test(val)) {
      APP.showTips('投注增加比例必须为整数');
      val = 0;
    }

    if (index == 0) { //第一期用初始投注额
      var curMoney = Math.round(curRate * AUTO.curMoneyObj.eq(index).text());
    } else { //其它用上期投注额
      var curMoney = Math.round(curRate * AUTO.curMoneyObj.eq(index - 1).text());
    }
    //奇数加1
    if (curMoney % 2 != 0) {
      curMoney++;
    }

    //循环输出表格数据
    for (var i = 0; i < AUTO.viewObj.length; i++) {
      var changeRate = 0;
      var change = 0;
      if (i == index) {
        var curNum = val; //当前循环节点值
      } else {
        var curNum = AUTO.numObj.eq(i).val(); //当前循环节点值
      }

      var bl = rInt.test(curNum);
      if (!bl) {
        curNum = 0;
        $numObj.eq(i).val(0)
      }

      var curRate = curNum / 100 + 1; //当前应增加的比例
      if (i == 0) { //第一期用初始投注额
        var curMoney = Math.round(curRate * AUTO.curMoneyObj.eq(i).text());
      } else { //其它用上期投注额
        var curMoney = Math.round(curRate * curMoney);
      }
      //奇数加1
      if (curMoney % 2 != 0) {
        curMoney++;
      }

      //--------------------------------------
      //先判断比例范围
      //--------------------------------------
      if (curNum < PERCENT_MIN) {
        curNum = PERCENT_MIN;
        changeRate = 1;
      } else if (curNum > PERCENT_MAX) {
        curNum = PERCENT_MAX;
        changeRate = 1;
      }
      if (changeRate == 1 && i > 0) {
        APP.showTips('投注增加比例范围为-99%-1000%');
        newCurRate = curNum / 100 + 1;
        curMoney = Math.round(newCurRate * prevcurMoney);
        if (curMoney % 2 != 0) {
          curMoney++;
        }
      }

      //--------------------------------------
      //先判断比例范围
      //--------------------------------------

      //--------------------------------------
      //判断当前期金额是否在范围内，不在需要调整金额和比例
      //--------------------------------------
      if (curMoney < BET_MIN) {
        curMoney = BET_MIN;
        change = 1;
      } else if (curMoney > BET_MAX) {
        curMoney = BET_MAX;
        change = 1;
      }

      //change == 1 需要重新计算当前期的金额和比例
      if (change == 1 && i > 0) {
        APP.showTips('在投注增加比例范围内，需满足投注金额的范围30-500000元');
        curNum = Math.ceil((curMoney - prevcurMoney) * 100 / prevcurMoney);
      }

      var prevcurNum = curNum; //上一期的比例
      var prevcurMoney = curMoney; //上一期的金额
      //--------------------------------------
      //判断当前期金额是否在范围内，不在需要调整金额和比例
      //--------------------------------------

      //--------------------------------------
      //数据重新填充
      //--------------------------------------

      //投注增加比例
      AUTO.viewObj.eq(i).text(curNum + '%');
      AUTO.numObj.eq(i).text(curNum);
      AUTO.numObj.eq(i).val(curNum);

      //当期投注金额（元）
      //修改当前期金额
      AUTO.curMoneyObj.eq(i).text(curMoney);
      //修改当前期input金额
      AUTO.curInput.eq(i).val(curMoney).data('val', curMoney);

      //累计投注金额
      if (0 < i) { //非第一期时累加上一期的金额
        var preMoney = parseInt(AUTO.addMoneyObj.eq(i - 1).text(), 10);
        AUTO.addMoneyObj.eq(i).text(parseInt(curMoney) + preMoney);
        $('#j-count-total').text(parseInt(curMoney) + preMoney);
        percentTotal = parseInt(curMoney) + preMoney;
      } else { //第一期时不必累加
        AUTO.addMoneyObj.eq(i).text(curMoney)
      }
      var addMoney = AUTO.addMoneyObj.eq(i).text();
      AUTO.bountyMoneyObj.eq(i).text((parseInt(curMoney) * ar).toFixed(2));

      //--------------------------------------
      //数据重新填充
      //--------------------------------------
    }
  }

  // 固定收益-表格重绘 $num:比例节点，val：当前要计算的值
  function countPercentFn($num, val) {

    var val = val || 0;

    if (val < 30) {

      APP.showTips('当期投注金额最低为30元');
      if ($num.data('val')) {
        $num.val($num.data('val'));
      }
      return;

    } else if (val > 500000) {

      APP.showTips('当期投注金额最高为500,000元');

      if ($num.data('val')) {
        $num.val($num.data('val'));
      }

      return;

    } else {

      $num.data('val', val);

    }

    $num.val(val);

    for (var i = 0; i < AUTO.viewObj.length; i++) {

      var curVal = parseInt(AUTO.numObj.eq(i).val(), 10);
      AUTO.viewObj.eq(i).text(curVal);

      if (i > 0) {
        var preVal = parseInt(AUTO.addMoneyObj.eq(i - 1).text(), 10);
        AUTO.addMoneyObj.eq(i).text(curVal + preVal);
        moneyTotal = curVal + preVal;
        $('#j-count-total').text(curVal + preVal);
        $('#j-total').val(curVal + preVal);
      } else {
        AUTO.addMoneyObj.eq(i).text(curVal);
      }

      AUTO.bountyMoneyObj.eq(i).text((parseInt(curVal) * ar).toFixed(2));

    }

  }

});