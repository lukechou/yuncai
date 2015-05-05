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

require(['jquery', 'lodash', 'store', 'app', 'bootstrap', 'tipsy'], function ($, _, store, APP) {
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
  var moneyTotal = 0; //总额比例
  var percentTotal = 0; //比例总额
  var rInt = /^-?[0-9]{1,}$/; //整数正则
  var ar = null;
  /*
   *
   * data  模型自动投注列表数据
   * rid  当前rid
   */
  var Model = {
    data: null,
    rid: null,
    pageIndex: 0,
    maxPage: 0,
    pageSize: 10
  };
  var $body = $('#j-auto-list');

  var AUTO = {
    timer: null,
    autoType: null
  };

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

    if (AUTO.autoType) {
      AUTO.viewObj = $body.find('.j-view');
    }
    percentTotal = AUTO.addVal;
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

  //修改当期投注金额
  function countCurFn($obj, val) {

    var curValM = null;
    var preValM = null;
    var m = null;
    var curVal = null;
    var preVal = null;
    var percentVal = null;
    var curNum = null;
    var curMoney = null;
    var preMoney = null;
    var addMoney = null;

    $obj.val(val);

    //检查是否超出范围
    for (var i = 0; i < AUTO.curInput.length; i++) {

      curValM = AUTO.curInput.eq(i).val();

      if (i > 0) {

        preValM = AUTO.curInput.eq(i - 1).val();
        m = parseInt((curValM / preValM - 1) * 100, 10);

        if (m > PERCENT_MAX || m < PERCENT_MIN) {
          APP.showTips('在投注金额范围内，需满足投注增加比例的范围' + PERCENT_MIN + '%-' + PERCENT_MAX + '%');
          $obj.val($obj.data('val'));
          return false;
        }

      }
    }

    $obj.data('val', val); //存储data

    for (var i = 0; i < AUTO.curInput.length; i++) {

      curVal = AUTO.curInput.eq(i).val();

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
        preVal = AUTO.curInput.eq(i - 1).val();
        percentVal = parseInt((curVal / preVal - 1) * 100, 10)
        AUTO.numObj.eq(i).val(percentVal).data('val', percentVal);
      }

      curNum = AUTO.numObj.eq(i).val();
      AUTO.viewObj.eq(i).text(curNum + '%');
      curMoney = parseInt(curVal);

      if (0 < i) {
        preMoney = parseInt(AUTO.addMoneyObj.eq(i - 1).text(), 10);
        AUTO.addMoneyObj.eq(i).text(parseInt(curMoney) + preMoney);
        $('#j-count-total').text(parseInt(curMoney) + preMoney);

        percentTotal = parseInt(curMoney) + preMoney;
      } else {
        AUTO.addMoneyObj.eq(i).text(curMoney);
      }

      addMoney = AUTO.addMoneyObj.eq(i).text();
    }

  }

  // 间隔比例-表格重绘 $num:比例节点，val：当前要计算的值
  function countMoneyFn($num, val) {

    var index = AUTO.numObj.index($num);
    var curRate = val / 100 + 1;
    var newCurRate = null;
    var $numObj = null;

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
        var curNum = Number(AUTO.numObj.eq(i).val()); //当前循环节点值
      }

      var bl = rInt.test(curNum);
      if (!bl) {
        curNum = 0;
        $numObj.eq(i).val(0)
      }
      AUTO.viewObj.eq(i).text(curNum + '%');
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
      AUTO.numObj.eq(i).text(curNum);
      AUTO.numObj.eq(i).val(curNum);
      //当期投注金额（元）
      AUTO.curMoneyObj.eq(i).text(curMoney); //修改当前期金额
      AUTO.curInput.eq(i).val(curMoney).data('val', curMoney); //修改当前期input金额
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
      //--------------------------------------
      //数据重新填充
      //--------------------------------------
    }
  }

  // 固定收益-表格重绘 $num:比例节点，val：当前要计算的值
  function countPercentFn($num, val) {

    var val = val || 0;
    var curVal = null;
    var preVal = null;

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

      curVal = parseInt(AUTO.numObj.eq(i).val(), 10);

      AUTO.viewObj.eq(i).text(curVal);

      if (i > 0) {

        preVal = parseInt(AUTO.addMoneyObj.eq(i - 1).text(), 10);
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

  // 表格计算事件
  // 修改比例-添加比例
  $body.on('click', '.j-add', function (event) {

    event.preventDefault();

    var $num = $(this).siblings('.j-num');
    var oVal = parseInt($num.val());

    if (!AUTO.autoType) {

      oVal++;
      if (oVal < PERCENT_MIN || oVal > PERCENT_MAX) {
        APP.showTips('投注增加比例范围为' + PERCENT_MIN + '%-' + PERCENT_MIN + '%');
        return;
      }

    }

    if (AUTO.timer) {

      clearTimeout(AUTO.timer);

    }

    AUTO.timer = setTimeout(function () {

      if (AUTO.autoType) {
        oVal += 2;
        countPercentFn($num, oVal);
      } else {
        countMoneyFn($num, oVal);
      }

    }, 100);

  });

  // 修改比例-减少比例
  $body.on('click', '.j-reduce', function (event) {
    event.preventDefault();

    var $num = $(this).siblings('.j-num');
    var oVal = parseInt($num.val());

    if (!AUTO.autoType) {

      oVal--;

      if (oVal < PERCENT_MIN || oVal > PERCENT_MAX) {
        APP.showTips('投注增加比例范围为' + PERCENT_MIN + '%-' + PERCENT_MIN + '%');
        return;
      }

    }

    if (AUTO.timer) {

      clearTimeout(AUTO.timer);

    }

    AUTO.timer = setTimeout(function () {

      if (AUTO.autoType) {

        oVal -= 2;
        countPercentFn($num, oVal);

      } else {

        countMoneyFn($num, oVal);

      }

    }, 100);
  });

  // 修改比例-手动输入
  $body.on('keyup', '.j-num', function (event) {
    event.preventDefault();

    var $num = $(this);
    var oVal = parseInt($num.val());
    if (oVal == '-') return;

    if (AUTO.timer) {
      clearTimeout(AUTO.timer);
    }

    AUTO.timer = setTimeout(function () {

      if (AUTO.autoType) {
        countPercentFn($num, oVal);
      } else {
        countMoneyFn($num, oVal);
      }

    }, 100);

  });

  // 修改比例-失去焦点
  $body.on('blur', '.j-num', function (event) {
    event.preventDefault();

    if (AUTO.autoType === 0) {

      var $num = $(this);
      var oVal = $num.val();

      if (oVal < PERCENT_MIN || oVal > PERCENT_MAX || !rInt.test(oVal)) {
        APP.showTips('投注增加比例范围为' + PERCENT_MIN + '%-' + PERCENT_MIN + '%');
        $num.val($num.data('val'));
        return;
      }

    }

  });

  // 修改金额-添加
  $body.on('click', '.j-add-m', function (event) {
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

    AUTO.mTimer = setTimeout(function () {
      countCurFn(curInputEl, oVal);
    }, 100);

  });

  // 修改金额-减少
  $body.on('click', '.j-reduce-m', function (event) {
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

    AUTO.mTimer = setTimeout(function () {
      countCurFn(curInputEl, oVal)
    }, 100);

  });

  // 修改金额-手动输入
  $body.on('keyup', '.j-cur-input', function (event) {
    event.preventDefault();

    var $this = $(this);
    var oVal = $this.val();
    var curValM = null;
    var preValM = null;
    var m = null;

    if (oVal < BET_MIN) return;

    if (!rInt.test(oVal)) {
      return;
    }

    $this.val(oVal);

    for (var i = 0; i < AUTO.curInput.length; i++) {
      curValM = AUTO.curInput.eq(i).val();
      if (i > 0) {
        preValM = AUTO.curInput.eq(i - 1).val();
        m = parseInt((curValM / preValM - 1) * 100, 10);
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

    AUTO.mTimer = setTimeout(function () {
      countCurFn($this, oVal)
    }, 100);
    if (oVal > 30) {
      checkCurMoney($this);
    }

  });

  $body.on('blur', '.j-cur-input', function (event) {
    event.preventDefault();

    var $this = $(this);
    checkCurMoney($this);

  });

  $('#j-auto-list').on('click', '.j-modify', function (event) {
    event.preventDefault();

    $('.j-edit').removeClass('hide');
    $('.j-view').addClass('hide');

    $('#j-text-stop').addClass('hide');
    $('.auto-stop-nav').removeClass('hide');

    $('#j-percent-edit-wrap').addClass('hide');
    $('.j-stop-issue').addClass('hide');

    $('.j-modify-bottom').removeClass('hide');
  });

  $('#j-filter-statu').on('change', function (event) {
    event.preventDefault();
    var v = $(this).val();

    if (v === 'all') {
      $('#j-auto-list tr').show();
    } else {

      $('#j-auto-list tr').hide();
      $('#j-auto-list tr[data-statu=' + v + ']').show();

    }

  });

  function pageInit() {

    updateMainAuto();

  }

  function createTrHtml(item) {

    var h = '';
    var r = _.find(Model.data, function (n) {
      return n.id === Model.rid
    });
    var stopTips = ['盈利以后自动终止', '完成所有期数后终止'];
    var arr = [];
    var info = item.autobuyInfo;

    ar = item.modelInfo.ar;

    h += '<tr class="tr-modify j-tr-modify"><td colspan="9" class="list-box"><p class="text-left">总投注<span class="mlr5">' + r.total_issue + '</span>期，已投注<span class="fc-3 mlr5">' + info.complete_issue + '</span>期，累计投注<span class="fc-3 mlr5">' + r.project_money + '</span>元，累积奖金<span class="fc-3 mlr5">' + r.total_bounty + '</span>元</p>';

    h += '<p class="text-left text-fen"><span>投注资金分配详情:</span>';

    if (info.auto_status == 0 && info.total_issue > 1) {
      h += '<span id="j-percent-edit-wrap"><a href="javascript:;" class="j-modify">修改投注分配</a> <i class="icon icon-warm ps-t2 j-icon-tips" original-title="可自行修改投注增加比例或者档期投注金额,系统将按照您修改后的投注分配进行投注"></i></span><button class="btn btn-sear j-stop-issue">手动终止自动投注</button>';
    }

    h += '</p>';

    h += '<table class="table m-table-one box-table"><thead><tr><th>期数</th>';

    if (info.auto_type == 0) {
      h += '<th>投注增加比例</th><th>当前投注金额（元）</th>';
    } else {
      h += '<th>当前投注金额（元）</th>';
    }

    h += '<th>累计投注金额（元）</th><th>当期预计奖金（元）</th><th>投注期号</th><th>当期命中情况</th></tr></thead><tbody id="j-data-body">';

    arr = _.map(item.autobuyIssueList, function (n, i) {

      var nh = '';

      var rate = Number(n.current_rate).toFixed(0);
      var money = Number(n.current_money).toFixed(0);

      nh += '<tr>';

      if (n.project_issue || n.issue_num == 1) {
        nh += '<td class="j-issue-num">' + n.issue_num + '</td>';
      } else {
        nh += '<td class="j-issue-num" data-issuenum="' + n.issue_num + '">' + n.issue_num + '</td>';
      }

      AUTO.autoType = ~~info.auto_type;

      if (info.auto_type == 0) {

        /*间隔比例*/

        // 已开奖和第一个比例不能修改
        if (n.project_issue || n.issue_num == 1) {

          // 比例
          nh += '<td>';
          nh += '<span class="j-view j-rate-view">' + rate + '%</span>';
          nh += '<span class="j-edit hide">' + rate + '%</span>';
          nh += '<input maxlength="6" class="j-num edit-num" type="hidden" name="current_rate" value="' + rate + '">';
          nh += '</td>';

        } else {

          // 比例

          nh += '<td><span class="j-view j-rate-view">' + rate + '%</span>';
          nh += '<span class="edit-wrap-w j-edit hide clearfix"><span class="edit-wrap clearfix">';
          nh += '<a href="javascript:;" class="i-reduce j-reduce">-</a>';
          nh += '<input maxLength="6" data-val="' + rate + '" class="j-num edit-num"  title="范围为 -100%-1000%"  type="text" name="current_rate" value="' + rate + '">';
          nh += '<a href="javascript:;" class="i-add j-add">+</a>';
          nh += '</span>%</span></td>';

        }

        // 存在期号 不可修改
        if (n.project_issue || n.issue_num == 1) {

          // 投注金额
          nh += '<td>';
          nh += '<span class="j-view j-cur-money">' + money + '</span>';
          nh += '<span class="j-edit hide">' + money + '</span>';
          nh += '<input maxlength="6" class="j-cur-input edit-num" type="hidden" name="current_money" value="' + money + '">';
          nh += '</td>';

        } else {

          //投注金额

          nh += '<td><span class="j-view j-cur-money">' + money + '</span>';
          nh += '<span class="edit-wrap-w j-edit hide clearfix"><span class="edit-wrap clearfix">';
          nh += '<a href="javascript:;" class="i-reduce j-reduce-m">-</a>';
          nh += '<input data-val="' + money + '" class="j-cur-input edit-num" type="text" name="current_money" value="' + money + '">';
          nh += '<a href="javascript:;" class="i-add j-add-m">+</a>';
          nh += '</span></span></td>';

        }

      } else {

        /*固定收益*/
        // 存在期号 不可修改
        if (n.project_issue || n.issue_num == 1) {

          nh += '<td>';
          nh += '<span class="j-view j-cur-money">' + money + '</span>';
          nh += '<span class="j-edit hide">' + money + '</span>';
          nh += '<input maxlength="6" class="j-num edit-num" type="hidden" name="current_money" value="' + money + '">';
          nh += '</td>';

        } else {

          nh += '<td><span class="j-view">' + money + '</span>';
          nh += '<span class="j-edit edit-wrap clearfix hide">';
          nh += '<a href="javascript:;" class="i-reduce j-reduce">-</a>';
          nh += '<input class="j-num edit-num" data-val="' + money + '" type="text" name="current_money" value="' + money + '">';
          nh += '<a href="javascript:;" class="i-add j-add">+</a>';
          nh += '</span></td>';

        }

      }

      // 累计奖金
      nh += '<td class="j-add-money">' + Number(n.total_money).toFixed(0) + '</td>';

      // 预计奖金
      nh += '<td class="j-bounty-money">' + Number(n.yu_bounty_money).toFixed(2) + '</td>';

      nh += '<td>' + n.project_issue + '</td>';

      nh += '<td>' + n.mz + '</td>';

      nh += '</tr>';
      return nh;

    });

    h += arr.join('');

    h += '</tbody></table><p class="text-left text-stop" id="j-text-stop">终止自动投注的条件：<span class="fc-3">' + stopTips[info.stop_type] + '</span></p><p class="auto-stop-nav text-left hide">'

    if (info.stop_type == 1) {
      h += '请选择终止自动投注的条件：<input type="radio" name="autostop" checked="checked" value="1">完成所有期数后终止<input type="radio" name="autostop" value="0">盈利以后自动终止';
    } else {
      h += '请选择终止自动投注的条件：<input type="radio" name="autostop"  value="1">完成所有期数后终止<input type="radio" name="autostop" checked="checked" value="0">盈利以后自动终止';
    }

    h += '</p></td></tr>';

    if (info.auto_status == 0 && info.total_issue > 1) {
      h += '<tr class="j-modify-bottom modify-bottom hide"><td colspan="9"><button class="btn btn-red" id="j-modify-confirm">确认修改</button><button class="btn btn-gray" id="j-modify-cancel">取消修改</button></td></tr>';
    }

    return h;

  }

  $body.on('click', '.j-stop-issue', function (event) {
    event.preventDefault();

    var f = _.find(Model.data, function (n) {
      return n.id === Model.rid;
    });

    APP.showTips({
      text: '<div class="fs-12"><p>您对彩票模型' + modelId + '设置了自动投注，</p><p>总投注' + f.total_issue + '期，已投注<span class="fc-3 mlr5">' + f.complete_issue + '</span>期，累计投注额<span class="fc-3 mlr5">' + f.project_money + '</span>，累计奖金<span class="fc-3">' + f.total_bounty + '</span>元</p></div><div class="fs-12"><p>确认要终止该模型的自动投注吗？</p><p>终止后未进行的投注系统将不再执行自动投注</p></div>',
      type: 2,
      onConfirm: function () {

        $.ajax({
            url: '/lottery/model/autobuy/cancel',
            type: 'get',
            dataType: 'json',
            data: {
              model_id: modelId,
              auto_id: Model.rid
            },
          })
          .done(function (data) {

            if (data.retCode === 100000) {

              $('#myModal').modal('hide');
              APP.showTips({
                text: '已取消自动投注',
                type: 1,
                onConfirm: function () {
                  window.location.href = '/lottery/model/autobuy/auto-buy-detail?model_id=' + modelId;
                }
              });

            } else {

              APP.showTips(data.retMsg);

            }

          });
      }
    });

  });

  $body.on('click', '#j-modify-cancel', function (event) {
    event.preventDefault();

    initTable({
      rid: Model.rid
    });

  });

  $body.on('click', '#j-modify-confirm', function (event) {
    event.preventDefault();

    createBuyModal();

  });

  function getBodyHtml() {

    var data = {};
    var b = $('#j-data-body');
    var issueNumObj = b.find('.j-issue-num');
    var moneyObj = b.find('.j-add-money');
    var bountyObj = b.find('.j-bounty-money');
    var html = '';

    $body.find('input[name]').each(function () {

      var name = $(this).attr('name') + '';

      if (name === 'autostop') {
        return;
      }

      if (name.length !== 0) {
        if (!data[name]) {
          data[name] = [];
        }
        data[name].push($(this).val());
      }

    });

    if (data['current_rate']) {

      $.each(issueNumObj, function (index, val) {
        html += '<tr>';
        html += '<td class="w150">' + $(this).html() + '</td>';
        html += '<td class="w150">' + data['current_rate'][index] + '</td>';
        html += '<td class="w150">' + data['current_money'][index] + '</td>';
        html += '<td class="w150">' + moneyObj.eq(index).html() + '</td>';
        html += '<td>' + bountyObj.eq(index).html() + '</td>';
        html += '</tr>';
      });

    } else {

      $.each(issueNumObj, function (index, val) {
        html += '<tr>';
        html += '<td class="w200">' + $(this).html() + '</td>';
        html += '<td>' + data['current_money'][index] + '</td>';
        html += '<td class="w200">' + moneyObj.eq(index).html() + '</td>';
        html += '<td class="w200">' + bountyObj.eq(index).html() + '</td>';
        html += '</tr>';
      });

    }

    return html;
  }

  function createBuyModal() {

    var item = _.find(Model.data, function (n) {
      return n.id == Model.rid;
    });
    var autoType = ~~item['auto_type'];

    var len = $('[name=current_money]').length;
    var total = $('.j-add-money').last().html();
    var bodyHtml = getBodyHtml();
    var headHtml = '';
    var stopType = clearVal($('[name="autostop"]:checked').val());
    var titleHtml = '您对模型<span class="mlr5">' + modelId + '</span> 设置了' + len + '期的自动投注 总投注金额为<span class="mlr5 fc-3">' + total + '</span>元（<span class="fc-84">系统会按期自动投注</span>）';

    var stopHtml = '';

    if (stopType) {
      stopHtml = '完成所有期数后终止';
    } else {
      stopHtml = '盈利以后自动终止';
    }

    if (autoType == 1) {

      headHtml = '<tr><th class="w200">期数</th><th>当期投注金额(元)</th><th class="w200">累计投注金额(元)</th><th class="w200">当前预计奖金(元)</th></tr>';

    } else {

      headHtml = '<tr><th class="w150">期数</th><th class="w150">投注增加比例</th><th class="w150">当期投注金额(元)</th><th class="w150">累计投注金额(元)</th><th>当前预计奖金(元)</th></tr>';

    }

    $('#j-modal-title').html(titleHtml);
    $('#j-modal-thead').html(headHtml);
    $('#j-modal-tbody').html(bodyHtml);
    $('#autoModal .text-stop').removeClass('hide');
    $('#j-moal-stop').html(stopHtml);
    $('#autoModal').modal('show');

  }

  $('#j-auto-buy').on('click', function (event) {
    event.preventDefault();
    updateIssue();
  });

  function updateIssue() {

    var item = _.find(Model.data, function (n) {
      return n.id == Model.rid;
    });

    if (item.auto_type == 1) {

      var totalVal = $('#j-total').val();

      if (0 >= totalVal) {
        APP.showTips('请先修改资金分配，再进行确认修改！');
        return;
      }

    }

    var issueNum = [];
    var stopType = clearVal($('[name="autostop"]:checked').val());

    $('[data-issuenum]').each(function (index, el) {
      issueNum.push($(this).attr('data-issuenum'));
    });

    var data = {
      auto_id: Model.rid,
      model_id: modelId,
      stop_type: stopType,
      issue_num: issueNum
    };

    $body.find('input[name]').each(function () {

      var name = $(this).attr('name') + '';

      if (name === 'autostop') {
        return;
      }

      if (name.length !== 0) {
        if (!data[name]) {
          data[name] = [];
        }
        data[name].push($(this).val());
      }

    });

    if (data['current_money']) {
      data['current_money'] = data['current_money'].slice(1);
    }

    if (data['current_rate']) {
      data['current_rate'] = data['current_rate'].slice(1);
    }

    var stopHtml = '';
    var s = clearVal($('[name="autostop"]:checked').val());

    if (s) {
      stopHtml = '完成所有期数后终止';
    } else {
      stopHtml = '盈利以后自动终止';
    }

    $.ajax({
        url: '/lottery/model/autobuy/update',
        type: 'post',
        dataType: 'json',
        data: data,
      })
      .done(function (data) {
        if (data.retCode === 100000) {
          $('#autoModal').modal('hide');
          APP.showTips('<p>自动投注修改成功</p><p>投注模型：' + modelId + '，系统会在' + stopHtml + '。</p>');
          initTable({
            rid: Model.rid
          });
        } else {
          APP.showTips(data.retMsg);
        }
      });
  }

  function getNewIssue(rid) {

    if (Model.rid) {

      $.ajax({
          url: '/lottery/model/autobuy/detail/ajx',
          type: 'get',
          dataType: 'json',
          data: {
            model_id: modelId,
            auto_id: Model.rid,
            t: $.now()
          },
        })
        .done(function (data) {

          if (data.retCode == 100000) {

            var html = createTrHtml(data.retData);

            $('#j-auto-list .j-tr-modify').remove();
            $('#j-auto-list .j-modify-bottom').remove();
            $('#j-auto-list tr[data-rid=' + Model.rid + ']').after(html);
            afterTableUpdate();
            bindIconTips();

          } else {
            APP.showTips(data.retMsg);
          }
        });

    }

  }

  $('#j-auto-list').on('click', '.j-toggle-issue', function (event) {
    event.preventDefault();

    var _this = $(this);

    APP.onlyCheckLogin({
      checkLogin: function () {
        if (_this.hasClass('active')) {

          _this.html('查看').removeClass('active');
          $('#j-auto-list .j-tr-modify').remove();
          $('#j-auto-list .j-modify-bottom').remove();
          Model.rid = null;

        } else {

          var rid = _this.parents('tr').attr('data-rid');
          Model.rid = rid;
          getNewIssue();

          $('.j-toggle-issue').html('查看').removeClass('active');
          _this.html('收起').addClass('active');
        }
      }
    });

  });

  /**
   * 重绘表格
   * @param  {Number} page 第几页
   * @param  {String} rid  要打开的rid
   */
  function initTable(obj) {

    var page = null;
    var rid = null;

    if (obj) {
      page = obj.page;
      rid = obj.rid;
    }

    if (rid) {
      page = getRidPageIndex(rid);
    }

    var item = Model.data;
    var h = '';
    var len = item.length;
    var ingLen = _.filter(item, function (n) {
      return n.auto_status === '0';
    }).length;

    if (len === 0) {
      $('#j-auto-go').html(0);
      $('#j-auto-list').html('<tr><td colspan="9">该模型您没有设置自动投注</td></tr>');
      $('#j-no-set').remove();
      return;
    }

    // 数据分组
    var group = _.chunk(item, Model.pageSize);
    Model.maxPage = Math.ceil(len / Model.pageSize);

    if (page) {
      Model.pageIndex = page;
    } else {
      Model.pageIndex = 0;
    }

    h = _.map(group[Model.pageIndex], function (n, i) {

      var s = ['<td class="fc-7">进行中</td>', '<td>已完成</td>', '<td class="fc-3">已终止</td>', '<td class="fc-3">所有期执行完毕</td>', '<td class="fc-3">完成期数系统终止</td>', '<td class="fc-3">符合条件系统终止</td>'];

      var str = '<tr data-rid="' + n.id + '" data-statu="' + n.auto_status + '"><td>' + (i + 1) + '</td><td>' + APP.dateFormat(new Date(n.start_time * 1000), '%Y-%M-%d %h:%m:%s', true) + '</td><td>' + n.complete_issue + '/' + n.total_issue + '</td><td>' + n.project_money + '</td><td>' + n.profit_money + '</td><td>' + n.profit_rate + '%</td>' + s[n.auto_status] + '<td><a href="javascript:;" class="j-toggle-issue">查看</a></td><td></td></tr>';

      // '<td class="j-icon-tips" original-title="该自动投注由<span class=\'fc-3 mlr5\'>Raymond</span>计划生成">计划生成</td>';

      return str;

    }).join('');

    // 组成分页组件
    if (Model.maxPage > 1) {
      createPageNav();
    }

    // 更新页面
    updateTable(ingLen, h);

    // 打开对应 rid 查看详情
    if (rid) {
      $('#j-auto-list tr[data-rid=' + rid + ']').find('.j-toggle-issue').trigger('click');
    } else {
      return;
    }

  }

  $('#j-page-box').on('click', '#j-back-page', function (event) {
    event.preventDefault();

    Model.pageIndex--;

    if (Model.pageIndex < 0) {
      Model.pageIndex = 0;
    }

    initTable({
      page: Model.pageIndex
    });
  });

  $('#j-page-box').on('click', '#j-next-page', function (event) {
    event.preventDefault();

    Model.pageIndex++;

    if (Model.pageIndex >= Model.maxPage) {
      Model.pageIndex--;
    }

    initTable({
      page: Model.pageIndex
    });
  });

  $('#j-page-box').on('click', '#j-pages-go', function (event) {
    event.preventDefault();

    var v = ~~$('#j-pages-value').val();

    if (1 <= v && v <= Model.maxPage && v !== (Model.pageIndex + 1)) {
      Model.pageIndex = v - 1;
      initTable({
        page: Model.pageIndex
      });
    } else {
      return;
    }

  });

  function updateTable(i, h) {
    $('#j-auto-go').html(i, h);
    $('#j-auto-list').html(h);
    bindIconTips();
  }

  function createPageNav() {

    var h = '<div class="pull-right pages">' + (Model.pageIndex + 1) + '/<span class="j-days">' + Model.maxPage + '</span>页<a href="javascript:;" id="j-back-page" class="mlr5">上一页</a><a href="javascript:;" id="j-next-page" class="mlr5">下一页</a><input type="text" value="1" class="govalue" id="j-pages-value"><button class="btn" id="j-pages-go" type="button">Go</button>页</div>';

    $('#j-page-box').html(h);

  }

  function getRidPageIndex(rid) {

    var index = null;

    index = _.indexOf(_.map(Model.data, 'id'), rid);

    return Math.floor(index / Model.pageSize);
  }

  function updateMainAuto() {

    $.ajax({
        url: '/lottery/model/autobuy/auto-buy-list',
        type: 'get',
        dataType: 'json',
        data: {
          model_id: modelId,
        },
      })
      .done(function (data) {

        if (data.retCode === 100000) {
          Model.data = data.retData;

          var rid = '';
          rid = APP.parseQueryString()['rid'] || null;

          if (rid) {

            initTable({
              rid: rid
            });

          } else {

            initTable();

          }

        } else {
          APP.showTips(data.retMsg);
        }
      });

  }

  function bindIconTips() {

    $('.j-icon-tips').tipsy({
      gravity: 'nw',
      html: true,
      opacity: 1
    });

  }

  function clearVal(v) {
    return ~~(_.escape($.trim(v)));
  }

  pageInit();

});