require.config({
  paths: {
    jquery: '../lib/jquery',
    lodash: '../lib/lodash.compat.min',
    store: '../lib/store.min',
    bootstrap: '../lib/bootstrap.min',
    app: '../common/app',
    model: 'model',
    chart: 'chart',
    highcharts: 'highcharts',
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
    }
  }
});

require(['jquery', 'lodash', 'store', 'chart', 'app', 'model', 'bootstrap', 'tipsy'], function ($, _, store, chart, APP, model) {
  'use strict';

  var modelId = _.escape($.trim($('#j-module-id').val()));

  function init() {

    APP.bindInputPlace();
    APP.bindInputOnlyInt('.j-only-int');

    // 初始化 收藏模块
    model.init({
      modal: $('#collect'),
      starList: $('.td-star-level a'),
      starLevel: null,
      modelId: null,
      starComment: '',
      modelComment: '',
    });

    model.bindCollectEvent();

    // 初始化 图表
    chart.init({
      chartEl: $('#chart')
    });

    chart.getChartData(modelId);

    updateMainAuto();
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

          var h = '';
          var item = data.retData.data;
          var len = item.length;
          var ingLen = _.filter(item, function (n) {
            return n.auto_status === '0';
          }).length;

          $('#j-auto-count').html(len);
          $('#j-auto-go').html(ingLen);

          if (len > 0) {

            h = _.map(item, function (n, i) {

              var s = ['<td class="fc-7">进行中</td>', '<td>已完成</td>', '<td class="fc-3">已终止</td>', '<td class="fc-3">所有期执行完毕</td>', '<td class="fc-3">完成期数系统终止</td>', '<td class="fc-3">符合条件系统终止</td>'];

              var str = '<tr><td>' + n.id + '</td><td>' + APP.dateFormat(new Date(n.start_time * 1000), '%Y-%M-%d %h:%m:%s', true) + '</td><td>' + n.complete_issue + '/' + n.total_issue + '</td><td>' + n.project_money + '</td><td>' + n.total_bounty + '</td>' + s[n.auto_status] + '<td><a href="/lottery/model/autobuy/auto-buy-detail?model_id=' + modelId + '&rid=' + n.id + '" target="_blank">查看</a></td>';

              str += '<td></td></tr>'

              return str;

            }).join('');

          } else {

            $('#j-lookmore-link').hide();
            h += '<tr><td colspan="8">该模型您没有设置自动投注</td></tr>';

          }

          $('#j-auto-list').html(h);
          $('#j-main-auto').show();

          $('.j-icon-tips').tipsy({
            gravity: 'nw',
            html: true,
            opacity: 1
          });

        } else {
          // APP.showTips(data.retMsg);
        }
      });

  }

  init();

  //输入框
  var $fee = $('#j-money');
  //预计奖金
  var $prize = $('#j-prize');
  // 最小投注金额
  var minBuy = Number($('#j-minBuy').val());
  var maxBuy = 500000;
  //计算投注数，预计奖金
  var contentArr = []; //投注内容数组
  var numArr = []; //投注数数组
  var rRate = /[0-9]{0,}\.[0-9]{0,}/; //取内容数字
  var feeTimeout = null;
  var feeTimer = null; //存储setTimeout，用心清除

  var peiArr = [];
  var zhuArr = [];
  var buyArr = [];

  // 获取赔率
  $('#track_detail_list tr').each(function (index, el) {

    var a = [];
    var t = 0;
    $(this).find('.j-pei').each(function (i, el) {
      t = Number($(this).text());
      a.push(t);
    });
    peiArr.push(a);
  });

  //获取投注内容
  $('#track_detail_list .j-text').each(function (index, el) {
    var b = [];
    $(this).find('span').each(function (i, el) {
      var t = '';
      if ($(this).text() === '胜') t = 0;
      if ($(this).text() === '平') t = 1;
      if ($(this).text() === '负') t = 2;
      b.push(t);
    });
    zhuArr.push(b);
  });

  // init buyArr
  for (var i = zhuArr[0].length - 1; i >= 0; i--) {
    buyArr.push((peiArr[0][zhuArr[0][i]] * peiArr[1][zhuArr[1][i]]).toFixed(2));
  };

  for (var i = buyArr.length - 1; i >= 0; i--) {
    contentArr.push(buyArr[i]); //获取赔率，设置赔率数组
    numArr.push(0); //设置投注数数组
  };

  //setTimeout执行函数
  function feeKeyupFunction() {

    var val = Number($fee.val());

    if (val % 2 == 0 && val >= minBuy && val <= maxBuy && !(/\D|^0/.test(val))) {
      //初始注数为1，每个投注内容至少一注
      for (var a = 0; a < numArr.length; a++) {
        numArr[a] = 1;
      }
      var num = val / 2;
      //num-numArr.length，减掉以为每个投注内容分配的一注
      for (var i = 0; i < num - numArr.length; i++) {
        var index = 0; //记录下标
        var contentMax = contentArr[0] * (numArr[0] == 0 ? 1 : numArr[0]); //记录最小值
        //循环比较，记录最小值及其下标
        for (var j = 0; j < contentArr.length; j++) {
          var curMax = contentArr[j] * (numArr[j] == 0 ? 1 : numArr[j]);
          if (contentMax > curMax) {
            contentMax = curMax; //存储最小值
            index = j; //存储下标
          }
        }
        numArr[index] = parseInt(numArr[index]) + 1; //为最小值投注数+1
      }
      //输出相关值
      //输出最小值
      var minPrize = (numArr[0] * contentArr[0] * 2).toFixed(2);
      for (var n = 0; n < numArr.length; n++) {
        var curPrize = (numArr[n] * contentArr[n] * 2).toFixed(2);
        minPrize = minPrize < curPrize ? minPrize : curPrize;
      }
      $prize.html(minPrize);
    } else {
      $prize.html('--');
    }
  }

  //未到时间又有键盘事件就取消原来要执行的函数
  $fee.keyup(function () {
    if (feeTimer) {
      clearTimeout(feeTimer); //取消上次执行事件
    }
    feeTimeout = setTimeout(feeKeyupFunction, 300); //重新执行
  })

  //输入金额
  var defaultVal = $fee.val();
  $fee.focus(function () {
    if (defaultVal == $fee.val()) {
      $fee.val('').removeClass('gray');
    }
  });

  $fee.blur(function () {
    if ('' == $fee.val()) {
      $fee.val(defaultVal).addClass('gray');
    }
  });

  $('#j-buy').on('click', function (event) {
    event.preventDefault();

    window.Config = {};
    var money = Number($('#j-money').val());
    var obj = {
      project_issue: _.escape($.trim($('#j-issue').val())),
      model_id: _.escape($.trim($('#j-module-id').val())),
      money: money
    };

    var html = getConfirmHTML(obj);

    if (money < minBuy) {
      APP.showTips('亲,投注金额不能低于 ' + minBuy + ' 元');
      return;
    }
    if (money % 2 !== 0) {
      APP.showTips('请输入偶数的金额');
      return;
    }
    if (money > maxBuy) {
      APP.showTips('亲,单次投注金额最大限制为 500000 元');
      return;
    }

    Config.payMoney = money;

    var lessMoneyTips = '';

    lessMoneyTips += '<p>模型' + obj.model_id + '</p>';
    lessMoneyTips += '<p>本次需支付：<span class="fc-3 mlr5">' + money + '.00</span>元</p>';

    APP.checkLogin(money, {
      enoughMoney: function () {
        APP.showTips({
          title: '投注确认',
          html: html,
          callback: function () {
            $('#buyConfirm').unbind('click');
            $('#buyConfirm').on('click', function (event) {
              event.preventDefault();
              $.ajax({
                  url: '/lottery/trade/model-fast-buy',
                  type: 'post',
                  dataType: 'json',
                  data: obj,
                })
                .done(function (D) {
                  if (D.retCode === 100000) {
                    APP.showTips({
                      type: 1,
                      text: '\u8d2d\u4e70\u6210\u529f',
                      onConfirm: function () {
                        window.location.reload();
                      }
                    });
                  } else {
                    APP.handRetCode(D.retCode, D.retMsg);
                  }
                })
                .fail(function () {
                  APP.onServiceFail();
                });
            });
          }
        });
      },
      lessMoneyTips: lessMoneyTips
    });

  });

  function getConfirmHTML(o) {
    var html = '';
    html = '<div class="m-detail-box"><p>您对模型编号<span class="mlr-8 fc-3">' + o.model_id + '</span>投注<span class="mlr-8 fc-3">' + o.money + '</span>元，请确认</p><div class="btns"><button class="btn btn-danger" id="buyConfirm">确定</button><button class="btn btn-gray" data-dismiss="modal">取消</button></div></div>';
    return html;
  }

  var x = setInterval(function () {
    updateStopTime();
  }, 1000);

  function updateStopTime() {
    var now = $.now();
    var stop = new Date($('#j-stop-time').val() * 1000).getTime();
    var time = (stop - now) / 1000;
    var html = '';
    var d = '';
    var h = '';
    var m = '';
    var s = '';

    if (time > 0) {
      d = Math.floor(time / 60 / 60 / 24)
      h = (Math.floor(time / 60 / 60)) % 24;
      m = Math.floor(time / 60 % 60);
      s = Math.floor(time % 60);

      html = '本模型离当前投注截止还剩<span id="j-day">' + d + '</span>天<span id="j-hour">' + h + '</span>小时<span id="j-minute">' + m + '</span>分<span id="j-second">' + s + '</span>秒';
    } else {
      html = '本模型当期已截止投注';
      $('#j-stop-td').html('已截止');
      clearInterval(x);
      $('#j-ft-main').hide();
      $('#j-stop-box').removeClass('hide');
    }

    $('#j-time-tip').html(html);
  }

});