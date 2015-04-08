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

  var BET_MIN = 30; //最小投注
  var BET_MAX = 500000; //最大投注
  var PERCENT_MIN = -99 //最小投注比例
  var PERCENT_MAX = 1000 //最大投注比例
  var INTERVAL_MIN = 0; //最小间隔
  var INTERVAL_MAX = 10; //最大间隔
  var NUM_MIN = 1; //最小期数
  var NUM_MAX = 50; //最大期数
  var percentTotal = 0; //比例总额
  var moneyTotal = 0; //总额比例
  var $issue = $('#j-issue'); //期数

  // 后台输出 直接拿老彩胜测试数据
  var moneyArr = [
    [1, 30],
    [2, 74],
    [3, 136],
    [4, 226],
    [5, 356],
    [6, 544],
    [7, 816],
    [8, 1210],
    [9, 1778],
    [10, 2600],
    [11, 3786],
    [12, 5500],
    [13, 7974],
    [14, 11548],
    [15, 16712],
    [16, 24170],
    [17, 34942],
    [18, 50502],
    [19, 72978],
    [20, 105444],
    [21, 152340],
    [22, 220078],
    [23, 317922],
    [24, 459254]
  ];

  var moneyIssueMin = moneyArr[0][0]; //总额投注最小期数
  var moneyIssueMax = moneyArr[moneyArr.length - 1][0]; //总额投注最大期数
  var $first = $('#j-first'); //初始投注
  var $space = $('#j-space'); //间隔期数
  var $rate = $('#j-rate'); //增加比例
  var $total = $('#j-total'); //投注总额
  var $body = $('#j-data-body');
  var $modifyBtn = $('#j-modify');
  var countMoneyBl = false; //总额投注是否已点击过分配计算
  var countPercentBl = false; //比例投注是否已点击过分配计算
  var rNum = /\D/; //是否有非数字
  var totalMoneyMin = 0; //总额投注最小金额
  var percentTip = '(<span class="red">范围：1-50期</span>)'; //比例期数提示
  var enterKeyCount = 0;
  var autoType = 0;

  // 无数据 提示
  var noDateTips = '<tr><td colspan="4" class="empty-tip">请填写参数并执行投注分配</td></tr>';

  // 初始化 提示悬浮
  $('.j-icon-tips').tipsy({
    gravity: 'nw',
    html: true,
    opacity: 1
  });

  $('[name="autotype"]').on('change', function (event) {
    event.preventDefault();

    var v = $(this).val();
    autoType = ~~v;

  });

  //期数改变投注额提示
  $issue.keyup(function () {

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

  ///////////////////////////////////////////////////////////////////////

  //绑定分配事件
  $('#j-count').on('click', function (event) {
    event.preventDefault();

    if (autoType === 0) {

      // 获取各种参数
      countPercentBl = true;
      var issueVal = $issue.val();
      var totalVal = $total.val();
      var firstVal = $first.val();
      var spaceVal = parseInt($space.val(), 10);
      var rateVal = $rate.val();

    }

  });

  //$num:比例节点，val：当前要计算的值
  var countFn = function ($num, val) {
    if (!rInt.test(val)) {
      Yuncai.showTip('投注增加比例必须为整数');
      val = 0;
    }
    var index = $numObj.index($num);
    var curRate = val / 100 + 1;
    if (index == 0) { //第一期用初始投注额
      var curMoney = Math.round(curRate * $curMoneyObj.eq(index).text());
    } else { //其它用上期投注额
      var curMoney = Math.round(curRate * $curMoneyObj.eq(index - 1).text());
    }
    //奇数加1
    if (curMoney % 2 != 0) {
      curMoney++;
    }

    //循环输出表格数据
    for (var i = 0; i < $viewObj.length; i++) {
      var changeRate = 0;
      var change = 0;
      if (i == index) {
        var curNum = val; //当前循环节点值
      } else {
        var curNum = $numObj.eq(i).val(); //当前循环节点值
      }

      var bl = rInt.test(curNum);
      if (!bl) {
        curNum = 0;
        $numObj.eq(i).val(0)
      }
      $viewObj.eq(i).text(curNum + '%');
      var curRate = curNum / 100 + 1; //当前应增加的比例
      if (i == 0) { //第一期用初始投注额
        var curMoney = Math.round(curRate * $curMoneyObj.eq(i).text());
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
        Yuncai.showTip('投注增加比例范围为-99%-1000%');
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
        Yuncai.showTip('在投注增加比例范围内，需满足投注金额的范围30-500000元');
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
      $numObj.eq(i).text(curNum);
      $numObj.eq(i).val(curNum);
      //当期投注金额（元）
      $curMoneyObj.eq(i).text(curMoney); //修改当前期金额
      $curInput.eq(i).val(curMoney).data('val', curMoney); //修改当前期input金额
      //累计投注金额
      if (0 < i) { //非第一期时累加上一期的金额
        var preMoney = parseInt($addMoneyObj.eq(i - 1).text(), 10);
        $addMoneyObj.eq(i).text(parseInt(curMoney) + preMoney);
        $('.j-count-total').text(parseInt(curMoney) + preMoney);
        percentTotal = parseInt(curMoney) + preMoney;
      } else { //第一期时不必累加
        $addMoneyObj.eq(i).text(curMoney)
      }
      var addMoney = $addMoneyObj.eq(i).text();
      //--------------------------------------
      //数据重新填充
      //--------------------------------------
    }
  };

  //手动输入
  $('.j-num').keyup(function () {

    var $num = $(this);
    var oVal = $num.val();

    if (oVal == '-') return;

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(function () {
      countFn($num, oVal)
    }, 100);

  }).blur(function () {

    var $num = $(this);
    var oVal = $num.val();

    if (oVal < PERCENT_MIN || oVal > PERCENT_MAX || !rInt.test(oVal)) {
      Yuncai.showTip('投注增加比例范围为-100%-1000%');
      $num.val($num.data('val'));
      return;
    }

  });

  //绑定添加比例
  $('.j-add', '.j-percent-table').click(function (e) {
    e.preventDefault();

    var $num = $(this).siblings('.j-num');

    var oVal = parseInt($num.val()) + 1;

    if (oVal < PERCENT_MIN || oVal > PERCENT_MAX) {
      Yuncai.showTip('投注增加比例范围为-99%-1000%');
      return;
    }

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(function () {
      countFn($num, oVal)
    }, 100);

  });

  //绑定减少比例
  $('.j-reduce', '.j-percent-table').click(function (e) {
    e.preventDefault();

    var $num = $(this).siblings('.j-num');

    var oVal = parseInt($num.val()) - 1;

    if (oVal < PERCENT_MIN || oVal > PERCENT_MAX) {
      Yuncai.showTip('投注增加比例范围为-99%-1000%');
      return;
    }

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(function () {
      countFn($num, oVal)
    }, 100);

  });

  //修改当期投注金额
  function countCurFn($obj, val) {

    $obj.val(val);

    //检查是否超出范围
    for (var i = 0; i < $curInput.length; i++) {

      var curValM = $curInput.eq(i).val();

      if (i > 0) {

        var preValM = $curInput.eq(i - 1).val();
        var m = parseInt((curValM / preValM - 1) * 100, 10);

        if (m > PERCENT_MAX || m < PERCENT_MIN) {

          APP.showTip('在投注金额范围内，需满足投注增加比例的范围' + PERCENT_MIN + '%-' + PERCENT_MAX + '%');

          $obj.val($obj.data('val'));

          return false;
        }

      }

    }
  }



});