require.config({
  paths: {
    jquery: '../lib/jquery',
    lodash: '../lib/lodash.compat.min',
    bootstrap: '../lib/bootstrap.min',
    store: '../lib/store.min',
    app: '../common/app',
    lottery: 'lottery',
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    },
    lottery: {
      deps: ['jquery', 'app', 'store'],
      exports: 'lottery'
    },

  }
});

require(['jquery', 'lodash', 'store', 'app', 'bootstrap'], function ($, _, store, APP) {

  'use strict';

  if ($('#saleStatus').val() == 1) {
    APP.showStopSellModal(($('#lotyName').val() == 'ssq') ? '双色球' : '大乐透');
    $('#qiuck-sub,#buy-submit,#j-tuodan-sub,#j-upload-sub,#j-more-sub').html('暂停销售').removeClass('btn-red').addClass('btn-stop').attr('id', '');
  }
  $('#j-touzhu-tips').on('click', function (event) {

    $(this).toggleClass('active');
    $('#j-touzhu-tipstext').toggle();

  });

  /*
   *
   *  QUEUE  组合计算 取得排列的数目 Module
   *  SEEDS  SEEDS  Object
   *  COMMON  Common Module
   *  ZHUI    追号  Module
   *  MANUAL  多期投注 Module
   *  TEMPLATE  Alert Object
   *  Config    全局配置  Object
   *  DLT  大乐透追加投注 Module
   *
   */
  var QUEUE = {};
  var COMMON = {};
  var MANUAL = {};
  var DRAG = {};
  var SEEDS = {};
  var ZHUI = {};
  var TEMPLATE = {};
  var DLT = {};

  var qiuckSet = ''; // -常规 修改当前注
  var tuoDanSet = ''; // -拖胆 修改当前注

  var Config = (function () {

    var Config = {
      maxBeiShu: 9999,
      maxZhuShu: 100,
      maxHang: 100,
      maxQiShu: 154,
      playType: 'cgtz',
      lotyName: lotyName,
      payMoney: 0,
      isZhuiJia: 0,
      box: $('#senior .box-left').eq(0),
      init: function () {
        var q = this.maxQiShu;
        q = Number($('#maxqishu').val());
        this.maxQiShu = q = (q == 0) ? 154 : q;
        if (q < 10) {
          $('#j-more-qi').val(q);
          $('#j-more .j-more').eq(2).html(q);
          $('#j-more-total').html(2 * 2 * q);
        }
      }
    };

    return Config;

  }());

  Config.init();

  SEEDS.ballNum = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35'];

  //双色球 6 + 1
  SEEDS.ssq = {
    redBall: SEEDS.ballNum.slice(0, 33),
    blueBall: SEEDS.ballNum.slice(0, 16),
    redMax: 16,
    blueMax: 16,
    redDanMax: 5,
    redTuoMax: 20,
    redTotal: 6,
    blueTotal: 1,
  };

  //大乐透 5 + 2
  SEEDS.dlt = {
    redBall: SEEDS.ballNum.slice(0, 35),
    blueBall: SEEDS.ballNum.slice(0, 12),
    redMax: 18,
    blueMax: 16,
    redDanMax: 4,
    redTuoMax: 17,
    redTotal: 5,
    blueTotal: 2,
  };

  TEMPLATE = {
    frbox: '<div class="frbox"><img src="' + staticHostURI + '/front_images/fail.png" alt="success" class="icon"><div class="text"><p><%= lotyName%> 第<span><%= qihao%></span>期</p><p>共<span><%= zs %></span>注, 投注<span><%= bs %></span>倍</p><p>本次需支付<span class="fc-3"><%= total %>.00</span>元</p><div class="btns"><button class="btn btn-danger" id="buyConfirm">确定</button><button class="btn btn-gray" data-dismiss="modal">取消</button></div></div></div>',
    zhbox: '<div class="frbox"><img src="' + staticHostURI + '/front_images/fail.png" alt="success" class="icon"><div class="text"><p>追号<span><%= qs %></span>期</p><p>本次需支付<span class="fc-3"><%= total %>.00</span>元</p><div class="btns"><button class="btn btn-danger" id="buyConfirm">确定</button><button class="btn btn-gray" data-dismiss="modal">取消</button></div></div></div>',
    rgbox: '<div class="frbox"><img src="' + staticHostURI + '/front_images/fail.png" alt="success" class="icon"><div class="text"><p><%= lotyName%> 第<span><%= qihao%></span>期</p><p>方案总金额<span class="fc-3"><%= total %>.00</span>元</p><p>您认购<span><%= rengou %></span>份</p><p>共需支付<span class="fc-3"><%= rengou %>.00</span>元</p><div class="btns"><button class="btn btn-danger" id="buyConfirm">确定</button><button class="btn btn-gray" data-dismiss="modal">取消</button></div></div></div>',
    bdbox: '<div class="frbox"><img src="' + staticHostURI + '/front_images/fail.png" alt="success" class="icon"><div class="text"><p><%= lotyName%> 第<span><%= qihao%></span>期</p><p>方案总金额<span class="fc-3"><%= total %>.00</span>元</p><p>您认购<span><%= rengou %></span>份, 保底<span><%= baodi %></span>份</p><p>共需支付<span class="fc-3"><%= pay %>.00</span>元</p><div class="btns"><button class="btn btn-danger" id="buyConfirm">确定</button><button class="btn btn-gra2y" data-dismiss="modal">取消</button></div></div></div>'
  };

  /**************QUEUE*************/
  // 计算阶乘的函数
  QUEUE.a = function (n) {
    try {
      if (n == 1 || n == 2) {
        return n;
      } else {
        return n * QUEUE.a(n - 1);
      }
    } catch (e) {
      alert(e);
    }
  }

  //计算排列组合的可能数目
  QUEUE.getACTotalNum = function (n, m, type) {
    if (n == m) {
      return 1;
    } else if (n < m) {
      return 0;
    } else {
      m = 2 * m > n ? (n - m) : m;
      var Anm = QUEUE.a(n) / QUEUE.a(n - m);
      if (type === 'A') {
        return Anm;
      } else if (type === 'C') {
        return Anm / QUEUE.a(m);
      } else {
        return 0;
      }
    }
  }

  /****************COMMON****************/
  // 获取弹出框 HTML
  COMMON.getAlertHtml = function (o) {

    var template = '';
    var html = '';
    var lotyName = (o.lotyName == 'ssq') ? '双色球' : '大乐透';
    var isZhui = false;
    var m = 0;
    var box = '';
    var obj = {};
    var payMoney = '';
    var Money = DLT.getZhuiJiaStatus();
    var isMost = (o.zhuihaoqihao) ? true : false;

    isZhui = (o.qishu == 1) ? false : true;

    if (isZhui) {

      box = TEMPLATE.zhbox;
      payMoney = o.zhushu * Money * o.beishu * o.qishu;
      obj = {
        qs: o.qishu,
        total: payMoney
      };

    } else {
      if (o.shareNum) {
        if (o.baodiText != 0) {

          box = TEMPLATE.bdbox;
          var totalMoney = o.zhushu * Money * o.beishu;

          payMoney = (totalMoney / o.shareNum) * (o.buyNum + o.aegisNum);
          obj = {
            lotyName: lotyName,
            qihao: o.qihao,
            rengou: o.buyNum,
            baodi: o.aegisNum,
            total: totalMoney,
            pay: payMoney
          };

        } else {

          box = TEMPLATE.rgbox;
          payMoney = o.rengouMoney;
          obj = {
            lotyName: lotyName,
            qihao: o.qihao,
            rengou: o.rengouMoney,
            total: o.zhushu * Money * o.beishu
          };

        }
      } else {
        box = TEMPLATE.frbox;
        payMoney = o.zhushu * Money * o.beishu;
        obj = {
          lotyName: lotyName,
          zs: o.zhushu,
          bs: o.beishu,
          qihao: o.qihao,
          total: payMoney
        };
      }
    }

    if (isMost) {
      box = TEMPLATE.zhbox;
      for (var i = 0; i < o.zhuihaoqihao.length; i++) {
        m += Number(o.zhuihaoqihao[i].split('|')[2]);
      };
      payMoney = o.zhushu * Money * m;
      obj = {
        qs: o.qishu,
        total: payMoney
      };
    }

    Config.lotyName = o.lotyName;
    Config.payMoney = payMoney;
    template = _.template(box);
    html = template(obj);

    return html;
  }

  /**
   * onSubmitDone 彩票购买提交成功回调事件
   * @type {[type]}
   */
  COMMON.onSubmitDone = function (retCode, retMsg, projectNo, trackId) {

    if (retCode == 100000) {
      var lotyCNName = (Config.lotyName == 'ssq') ? '双色球' : '大乐透';

      store.set('lotyName', Config.lotyName);
      store.set('lotyCNName', lotyCNName);
      store.set('payMoney', Config.payMoney);
      store.set('projectNo', projectNo);
      store.set('trackId', trackId);
      window.location.href = '/html/lottery/trade/success.html';
    } else {
      APP.handRetCode(retCode, retMsg);
    }
  };

  COMMON.onSubmitFail = function (retCode, retMsg) {
    store.set('lotyName', Config.lotyName);
    window.location.href = '/html/lottery/trade/fail.html';
  };

  COMMON.checkParamsStatus = function (p, v) {
    var c = 1;

    if (p.zhushu == 0) {
      APP.showTips('请至少选择1注号码投注');
      c = 0;
    }

    if (!v.isCheck) {
      APP.showTips('请先阅读并同意《委托投注规则》后才能继续');
      c = 0;
    }

    if (p.zhuihaoqihao) {
      if (p.zhuihaoqihao == 0) {
        APP.showTips('请至少选择1注号码投注');
        c = 0;
      }
    }

    return c;

  };

  /**
   * [getCommonParams 购买彩票,获取要提交的参数]
   * @param  {} el [.box-left 对象]
   * @return {}    [彩票提交必须参数]
   */
  COMMON.getCommonParams = function () {

    var params = (function () {
      var box = Config.box;
      var params = {
        lotyName: $('#lotyName').val(),
        playName: $('#playName').val(),
        qihaoId: $('#qihaoId').val(),
        qihao: $('#qihao').val(),
        zhushu: box.find('.j-quick-zhu').html(),
        beishu: box.find('.j-quick-bei').val(),
        qishu: 1,
        codes: COMMON.formarFormSub(box.find('.br-gou .br-zhu-item')),
        unikey: (new Date()).valueOf(), //Math.floor(Math.random() * 100000),
      };
      if (Config.box.find('.j-zj-check')[0]) {
        params.isZhuiJia = Config.box.find('.j-zj-check')[0].checked;
      }
      return params;

    }());

    return params;
  };

  /**
   * [sortNum 号码排序]
   * @param  {Array} num Sort Array
   * @return {Array}
   */
  COMMON.sortNum = function (num) {
    return num.sort(function (a, b) {
      return a - b;
    });
  };

  /**
   * [clearAllBallActive 清除所有球的选中状态]
   * @param  {Object} el Ball-Aear
   * @return {null}
   */
  COMMON.clearAllBallActive = function (el) {

    el.find('.active').removeClass('active');

  };

  // 随机选取N个球
  COMMON.randomNum = function (el, type, l) {

    var len = parseInt(l);
    var arr = _.sample(SEEDS[Config.lotyName][type], len);

    el.find('.active').removeClass('active');

    for (var i = 0; i < arr.length; i++) {
      el.find('li').eq(arr[i] - 1).addClass('active');
    };

  };

  // 页尾统计 加减输入框 change
  COMMON.updateCount = function (m, c) {
    var v = parseInt(m.val(), 10);
    if (c == 1) {
      v++;
    } else {
      v--;
    }
    v = (v >= 1) ? v : 1;
    m.val(v);
  }

  // 随机产生任意注 List HTML
  COMMON.getManyZhu = function (len) {

    var html = '';
    for (var i = 0; i < len; i++) {
      var rNums = COMMON.sortNum(_.sample(SEEDS[Config.lotyName].redBall, SEEDS[Config.lotyName].redTotal));
      var bNums = COMMON.sortNum(_.sample(SEEDS[Config.lotyName].blueBall, SEEDS[Config.lotyName].blueTotal));
      html += this.getOneZhu(rNums, bNums);
    }

    return html;
  }

  // 更新统计注数
  COMMON.updateTotalZhu = function (t) {

    var p = Config.box;
    var s = 0;

    p.find('.money').each(function (index, el) {
      s += parseInt(el.attributes['data-m'].value);
    });

    p.find('.j-quick-zhu').html(s);

    COMMON.setZhuTotal();
  }

  COMMON.getBoxLeft = function (el) {
    if (el[0]) {
      if (el.hasClass('.box-left')) {
        return el;
      } else {
        return el.parents('.box-left');
      }
    }
  }

  /**
   * 页尾统计 投注总额
   * @param {[Number]} r  [判断快捷投注 还是 多期投注]
   * @param {[DOM]} el [当前box]
   */
  COMMON.setZhuTotal = function () {

    var p = Config.box;
    var money = DLT.getZhuiJiaStatus();
    var isSenior = $('#quick').hasClass('hidden');
    var m = [];
    var total = 0;

    if (Config.playType !== 'dqtz') {

      m.push(parseInt(p.find('.j-quick-zhu').html()));
      m.push(parseInt(p.find('.j-quick-bei').val()));
      m.push(parseInt(p.find('.j-quick-qi').val()));
      total = m[0] * m[1] * m[2] * money;
      p.find('.j-quick-total').html(total);

    } else {

      m.push(parseInt($('#j-more-zhu').val()));
      m.push(parseInt($('#j-more-bei').val()));
      m.push(parseInt($('#j-more-qi').val()));
      $('#j-more .j-more').each(function (index, el) {
        el.innerHTML = m[index];
      });
      total = m[0] * m[1] * m[2] * money;
      $('#j-more-total').html(total);

    }

    if (isSenior) {
      ZHUI.setZhuiHaoTotal(p);
      ZHUI.setHeMaiTotal();
    }
  }

  // 检测 选球区
  COMMON.checkBallGroup = function () {

    // check select ball for toggle add button status
    var p = Config.box;
    var m = DLT.getZhuiJiaStatus();
    var rLen = parseInt(p.find('.j-ball-red .active').length),
      bLen = parseInt(p.find('.j-ball-blue .active').length),
      x = 0,
      y = 0,
      t = 0;

    if (rLen >= SEEDS[Config.lotyName].redTotal && bLen >= SEEDS[Config.lotyName].blueTotal) {
      x = QUEUE.getACTotalNum(rLen, SEEDS[Config.lotyName].redTotal, 'C');
      y = QUEUE.getACTotalNum(bLen, SEEDS[Config.lotyName].blueTotal, 'C');
      t = x * y;

      COMMON.updateAddBtn(true);
    } else {
      COMMON.updateAddBtn(false);
    }

    COMMON.updateQuickZhu(rLen, bLen, t, t * m, p);
  }

  // 返回一注 List HTML
  COMMON.getOneZhu = function (r, b, m, h) {

    var li = '';
    var money = DLT.getZhuiJiaStatus();
    m = m / money;

    if (!h) {
      li += '<div class="br-zhu-item clearfix">';
    }

    li += '<b>[快捷投注]</b><div class="list">';

    for (var i = 0; i < r.length; i++) {
      li += '<span data-c="0">' + r[i] + '</span>';
    };
    for (var i = 0; i < b.length; i++) {
      li += '<span class="fc-5" data-c="1">' + b[i] + '</span>';
    };

    li += '</div>';

    if (m) {
      li += '<div class="pull-right"><b><i class="money" data-m="' + m + '">' + (m * money) + '</i>元</b>';
    } else {
      li += '<div class="pull-right"><b><i class="money" data-m="1">' + money + '</i>元</b>';
    }

    li += '<a href="javascript:;" class="br-zhu-set">修改</a><a href="javascript:;" class="br-zhu-del">删除</a></div>';

    if (!h) {
      li += '</div>';
    }

    return li;
  }

  // 常规 添加一注的球样式
  COMMON.createOneZhuBall = function (r, b, el) {

    var rnum = 0,
      bnum = 0;

    COMMON.clearAllBallActive(el);
    for (var i = 0; i < r.length; i++) {
      rnum = parseInt(r[i]) - 1;
      el.find('.j-ball-red li').eq(rnum).addClass('active');
    };

    for (var i = 0; i < b.length; i++) {
      bnum = parseInt(b[i]) - 1;
      el.find('.j-ball-blue li').eq(bnum).addClass('active');
    };

    COMMON.checkBallGroup($(this));
  }

  // 列表注数格式化 for 表单提交
  COMMON.formarFormSub = function (items) {

    var list = [];

    for (var i = 0; i < items.length; i++) {

      var redArr = [],
        blueArr = [],
        itemsList = items.eq(i);

      for (var j = 0; j < itemsList.find('span').length; j++) {

        var html = itemsList.find('span').eq(j).html();

        if (itemsList.find('span').eq(j).attr('data-c') == 1) {

          blueArr.push(html);

        } else {

          redArr.push(html);

        }
      };

      list.push(redArr.join(',') + '|' + blueArr.join(','));

    };
    return list.join('$');
  }

  //常规 中间提示更新
  COMMON.updateQuickZhu = function (a, b, c, d, p) {
    p.find('.j-quick-hd-qnum').html(a);
    p.find('.j-quick-hd-hnum').html(b);
    p.find('.j-quick-hd-zhu').html(c);
    p.find('.j-quick-hd-total').html(d);
  }

  // 从列表获取一注号码
  COMMON.getItemNum = function (item) {

    var arr = {
      red: [],
      blue: []
    };
    item.find('span').each(function (index, el) {
      if (el.className) {
        arr.blue.push(el.innerHTML);
      } else {
        arr.red.push(el.innerHTML);
      }
    });
    return arr;
  }

  // 拖胆列表注数格式化 for 表单提交
  COMMON.tuodanFormarFormSub = function (items) {

    var list = [];
    for (var i = 0; i < items.length; i++) {

      var redDan = [],
        blueDan = [],
        redTuo = [],
        blueTuo = [],
        itemsList = items.eq(i),
        ball = itemsList.find('span');

      for (var j = 0; j < ball.length; j++) {

        var html = ball.eq(j).html()
        var type = parseInt(ball.eq(j).attr('data-s'))
        switch (type) {
        case 0:
          redDan.push(html)
          break;
        case 1:
          redTuo.push(html)
          break;
        case 2:
          blueDan.push(html)
          break;
        case 3:
          blueTuo.push(html)
          break;
        }
      };
      if (lotyName == 'dlt') {
        if (blueDan.length == 0) {
          list.push(redDan.join(',') + '@' + redTuo.join(',') + '|' + blueTuo.join(','));
        } else {
          list.push(redDan.join(',') + '@' + redTuo.join(',') + '|' + blueDan.join(',') + '@' + blueTuo.join(','));
        }
      } else {
        list.push(redDan.join(',') + '@' + redTuo.join(',') + '|' + blueTuo.join(','));
      }

    };
    return list.join('$');
  }

  /************** DRAG **************/
  //拖胆获取一个区域选中的号码
  DRAG.getTuodanNum = function (item) {
    var arr = [];
    item.find('a.active').each(function (index, el) {
      arr.push(el.innerHTML);
    });
    return arr;
  }

  // 选中一个区域部分球
  DRAG.createOneTuodanBall = function (nums, el) {
    var rnum = '';
    COMMON.clearAllBallActive(el);

    for (var i = 0; i < nums.length; i++) {
      rnum = parseInt(nums[i]) - 1;
      el.find('a').eq(rnum).addClass('active');
    };
  }

  /*
   * 更新 添加按钮状态
   * @ active Boolean
   * @ text String Span text
   */
  COMMON.updateAddBtn = function (active, text) {

    var btn = Config.box.find('.j-add-btn,.j-add-btn-2');

    if (active) {
      btn.addClass('active');
    } else {
      btn.removeClass('active');
    }

    if (text) {
      btn.find('span').html(text);
    }

  };

  // 检测拖胆选球区
  DRAG.checkBallAear = function () {

    // 获取 选球区状态
    var zhu = DRAG.getTuodanBallZhu();

    if (zhu.total) {
      COMMON.updateAddBtn(true);
    } else {
      COMMON.updateAddBtn(false);
    }

    // 更新Tips View
    DRAG.updateTuoTips(zhu);

  }

  // 拖胆随机获得拖码区 多个号码
  DRAG.randomTuodanNum = function (num, co, len) {
    // 已选号码
    // 区域颜色
    var n = SEEDS[Config.lotyName][co + 'Ball'].concat();
    for (var i = 0; i < num.length; i++) {
      n = _.without(n, num[i]);
    };
    return _.sample(n, len);
  }

  // 获取选中球 和 选中球生成的注数
  DRAG.getTuodanBallZhu = function () {

    // get all param
    var arr = {},
      x = 0,
      y = 0;
    arr.rDan = $('.m-num-group-red[data-dan="1"]');
    arr.rTuo = $('.m-num-group-red[data-dan="0"]');
    arr.bDan = $('.m-num-group-blue[data-dan="1"]');
    arr.bTuo = $('.m-num-group-blue[data-dan="0"]');
    arr.rDaned = arr.rDan.find('.active');
    arr.rTuoed = arr.rTuo.find('.active');
    arr.bDaned = arr.bDan.find('.active');
    arr.bTuoed = arr.bTuo.find('.active');

    arr.rDans = arr.rDan.find('.active').length;
    arr.rTuos = arr.rTuo.find('.active').length;
    arr.bDans = arr.bDan.find('.active').length;
    arr.bTuos = arr.bTuo.find('.active').length;

    arr.code = 0;
    arr.total = 0;

    var r = arr.rDans + arr.rTuos,
      b = arr.bDans + arr.bTuos;

    // total zhu
    if (arr.rDans == 0) {
      arr.code = -1;
    } else {
      if (r >= SEEDS[Config.lotyName].redTotal && b >= SEEDS[Config.lotyName].blueTotal) {
        x = QUEUE.getACTotalNum(arr.rTuos, SEEDS[Config.lotyName].redTotal - arr.rDans, 'C');
        if (lotyName == 'dlt') {
          if (arr.bDans == 1) {
            y = arr.bTuos;
          } else {
            y = QUEUE.getACTotalNum(arr.bTuos, 2, 'C')
          }
        } else {
          y = arr.bTuos;
        }
        arr.total = x * y;
        arr.code = 1;
      } else {
        arr.code = -2;
      }
    }

    return arr;
  }

  // 返回一注List HTML
  DRAG.addOneTuoZhu = function (rd, rt, bd, bt, m, h) {

    var li = '';
    var money = DLT.getZhuiJiaStatus();
    m = m / money;
    if (!h) {
      li += '<div class="br-zhu-item clearfix">';
    }

    li += '<b>[快捷投注]</b><div class="list">';

    if (rd.length > 0) li += '(';
    for (var i = 0; i < rd.length; i++) {
      li += '<span data-s="0">' + rd[i].innerHTML + '</span>';
    };
    if (rd.length > 0) li += ')';

    for (var i = 0; i < rt.length; i++) {
      li += '<span data-s="1">' + rt[i].innerHTML + '</span>';
    };

    if (bd.length > 0) li += '<span class="fc-5">(</span>';
    for (var i = 0; i < bd.length; i++) {
      li += '<span class="fc-5" data-s="2">' + bd[i].innerHTML + '</span>';
    };
    if (bd.length > 0) li += '<span class="fc-5">)</span>';

    for (var i = 0; i < bt.length; i++) {
      li += '<span class="fc-5" data-s="3">' + bt[i].innerHTML + '</span>';
    };

    li += '</div>';

    if (m) {
      li += '<div class="pull-right"><b><i class="money" data-m="' + m + '">' + (money * m) + '</i>元</b>';
    } else {
      li += '<div class="pull-right"><b><i class="money" data-m="' + m + '">' + money + '</i>元</b>';
    }

    li += '<a href="javascript:;" class="br-zhu-set">修改</a><a href="javascript:;" class="br-zhu-del">删除</a></div>';

    if (!h) {
      li += '</div>';
    }

    return li;
  }

  // 更新投注中间提示
  DRAG.updateTuoTips = function (zhu) {
    var html = '';
    var money = DLT.getZhuiJiaStatus();
    if (lotyName == 'dlt') {
      html = '您选择了<span id="numtuo1">' + (zhu.rDans + zhu.rTuos) + '</span>个红球（<span id="numtuo2">' + zhu.rDans + '</span>个胆码，<span id="numtuo3">' + zhu.rTuos + '</span>个拖码），<span id="numtuo4">' + (zhu.bDans + zhu.bTuos) + '</span>个蓝球（<span id="numtuo5">' + zhu.bDans + '</span>个胆码，<span id="numtuo6">' + zhu.bTuos + '</span>个拖码）， 共 <span id = "numtuo7"> ' + zhu.total + ' </span>注，共<span class="fc-3" id="numtuo8">' + (zhu.total * money) + '</span > 元 ';
    } else {
      html = '您选择了<span id="numtuo1">' + (zhu.rDans + zhu.rTuos) + '</span>个红球（<span id="numtuo2">' + zhu.rDans + '</span>个胆码，<span id="numtuo3">' + zhu.rTuos + '</span>个拖码），<span id="numtuo4">' + zhu.bTuos + '</span>个蓝球（<span id="numtuo5">0</span>个胆码，<span id="numtuo6">0</span>个拖码）， 共 <span id = "numtuo7"> ' + zhu.total + ' </span>注，共<span class="fc-3" id="numtuo8">' + (zhu.total * money) + '</span > 元 ';
    }
    $('#j-tuo-mintips').html(html);

  }

  // 从列表一项获取一注号码
  DRAG.getOneListNums = function (el) {

    var arr = {
      rd: [],
      rt: [],
      dd: [],
      dt: []
    };
    var n = '';
    if (lotyName == 'dlt') {
      n = ['rd', 'rt', 'dd', 'dt'];
    } else {
      n = ['rd', 'rt', 'dt', 'dd'];
    }

    for (var i = 0; i < 4; i++) {
      el.find('span[data-s="' + i + '"]').each(function (index, el) {
        arr[n[i]].push(el.innerHTML);
      });
    };

    return arr;
  }

  /************** MANUAL **************/
  // MANUAL 设置上方 注数 金额 统计
  MANUAL.totalSdNums = function () {

    var str = $.trim($('#sd_number').val());
    var l = 0;
    var m = DLT.getZhuiJiaStatus();

    if (str !== '') {
      l = str.split(/\n/g).length;
    }

    $('#sd-tip-zhu').html(l);
    $('#sd-tip-total').html(l * m);
    if (l) {
      COMMON.updateAddBtn(true);
    } else {
      COMMON.updateAddBtn(false);
    }

  }

  // 返回一注List HTML
  MANUAL.getListHTML = function (r, b, m, h) {

    var li = '';
    var money = DLT.getZhuiJiaStatus();
    m = m / money;
    r = COMMON.sortNum(r);
    b = COMMON.sortNum(b);

    if (!h) {
      li += '<div class="br-zhu-item clearfix">';
    }

    li += '<b>[单式上传]</b><div class="list">';

    for (var i = 0; i < r.length; i++) {
      li += '<span data-c="0">' + r[i] + '</span>';
    };

    for (var i = 0; i < b.length; i++) {
      li += '<span data-c="1" class="fc-5">' + b[i] + '</span>';
    };

    li += '</div>';

    if (m) {
      li += '<div class="pull-right"><b><i class="money" data-m="' + m + '">' + (m * money) + '</i>元</b>';
    } else {
      li += '<div class="pull-right"><b><i class="money" data-m="' + m + '">' + money + '</i>元</b>';
    }

    li += '<a href="javascript:;" class="br-zhu-del">删除</a></div>';

    if (!h) {
      li += '</div>';
    }

    return li;
  }

  // MANUAL 设置下方 注数 金额 统计
  MANUAL.setSdTotal = function () {

    var t = 0;
    var money = DLT.getZhuiJiaStatus();
    $('#sd-list').find('.money').each(function (index, el) {
      t += parseInt(el.innerHTML);
    });

    $('#sd-tip-zhu2').html(t / money);
    $('#sd-tip-total2').html(t);
  }

  // MANUAL 字符串分解 成红球 篮球
  MANUAL.relovStr = function (str) {

    var l = '';
    var arr = [];
    if (str.indexOf('+') >= 0) {
      l = str.split(/\+/g);
    } else {
      l = str.split(/\|/g);
    }

    arr.push(_.uniq(l[0].split(',')));
    arr.push(_.uniq(l[1].split(',')));
    return arr;
  }

  /**
   * 检测手动输入单式
   * @param  {String} str      单式字符串
   * @param  {Number} type 选球类型
   * @return {Boolean}          是否正常单式或复式
   */
  MANUAL.checkSdZhu = function (str, type) {

    // 球形数组,复式最大长度,单式最小长度
    var typeNums = '';
    var maxLen = '';
    var minLen = '';

    if (type) {
      typeNums = SEEDS[Config.lotyName].blueBall;
      maxLen = SEEDS[Config.lotyName].blueMax;
      minLen = SEEDS[Config.lotyName].blueTotal;
    } else {
      typeNums = SEEDS[Config.lotyName].redBall;
      maxLen = SEEDS[Config.lotyName].redMax;
      minLen = SEEDS[Config.lotyName].redTotal;
    }

    var nums = str.split(',');
    var numsLen = nums.length;

    // 是否符合 选球数范围, 是否重复
    if (minLen <= numsLen && maxLen >= numsLen && _.uniq(nums).length == numsLen) {

      for (var i = 0; i < nums.length; i++) {

        // 是否在选球数组
        if (!_.find(typeNums, function (num) {
            return num == nums[i];
          })) {

          return false;

        }

      };
      return true;

    } else {

      return false;

    }

  };

  // 格式化 手动上传号码
  MANUAL.sdFormat = function (str) {

    var zhus = {};
    var l = '';
    var rLen = 0;
    var bLen = 0;
    var money = 0;
    var x = 0;
    var y = 0;
    var m = DLT.getZhuiJiaStatus();

    zhus.code = 0;
    zhus.good = [];
    zhus.bad = [];
    zhus.moneyArr = [];
    zhus.overMaxMoney = false;
    zhus.all = str.split(/\n/g);

    // 数组分组
    // 是否存在 分隔符 + 或 |
    // 是否分成2组
    // 是否去重 检测选球个数
    for (var i = 0; i < zhus.all.length; i++) {

      if (zhus.all[i].indexOf('+') >= 0 || zhus.all[i].indexOf('|') >= 0) {

        if (zhus.all[i].indexOf('+') >= 0) {
          l = zhus.all[i].split(/\+/g);
        } else {
          l = zhus.all[i].split(/\|/g);
        }

        if (l.length == 2) {

          if (MANUAL.checkSdZhu(l[0], 0) && MANUAL.checkSdZhu(l[1], 1)) {

            rLen = l[0].split(',').length;
            bLen = l[1].split(',').length;

            // 计算复式金额
            x = QUEUE.getACTotalNum(rLen, SEEDS[Config.lotyName].redTotal, 'C');
            y = QUEUE.getACTotalNum(bLen, SEEDS[Config.lotyName].blueTotal, 'C');

            money = x * y * m;

            if (money > 20000) {

              zhus.bad.push(zhus.all[i]);
              zhus.overMaxMoney = true;

            } else {

              zhus.good.push(zhus.all[i]);
              zhus.moneyArr.push(money);

            }

          } else {

            zhus.bad.push(zhus.all[i]);
          }

        } else {

          zhus.bad.push(zhus.all[i]);

        }

      } else {
        zhus.bad.push(zhus.all[i]);
      }

    }

    if (zhus.bad.length == 0) {
      zhus.code = 1;
    }

    return zhus;
  }

  /**
   * 追号 && 合买模块
   */
  ZHUI.getNewHtml = function (el) {

    // Ajax 获取 期数
    var num = parseInt(Config.box.find('.zh_issue_num').val());
    num = (num < 10) ? 10 : num;
    $.ajax({
        url: '/lottery/digital/query-track-issue/' + lotyName,
        type: 'get',
        dataType: 'json',
        data: {
          num: num
        },
      })
      .done(function (data) {
        if (data) {
          var html = ''
          var DATA = data.retData;
          for (var i = 0; i < DATA.length; i++) {
            html += '<tr><td>' + (i + 1) + '</td><td><input type="checkbox" class="br-zhui-c" data-qihaoId="' + DATA[i]['id'] + '" data-qi="' + DATA[i]['qihao'] + '" checked>' + DATA[i]['qihao'] + '期</td><td><input type="text" class="br-input br-zhui-bei" value="1">倍</td><td><span class="j-money">10</span>元</td><td>' + DATA[i]['awardTime'].slice(0, 10) + '<span class="ml15">' + DATA[i]['awardTime'].slice(10) + '</span></td></tr>';
          };
          var zhui = el.parents('.br-details').find('.br-zhui');
          zhui.find('.br-zhui-list tbody').html(html);
          ZHUI.bindZhuiHaoEvent();
          ZHUI.setZhuiHaoTotal(Config.box);
        }
      })
      .fail(function () {
        APP.onServiceFail();
      });
  };

  ZHUI.updateHemai = function (copies, oneCopiesMoney, rengouCopies, ticheng, rengouPercent, baodiPercent, baodiCopies) {

    var box = Config.box;
    var baodiTips = baodiCopies * oneCopiesMoney || 0;
    var totalTips = (rengouCopies + baodiCopies) * oneCopiesMoney || 0;
    if (copies === 0) {
      oneCopiesMoney = 0;
    }
    // 更新份数,每份金额,认购份数,提成百分比,认购百分比
    box.find('.j-share-num').val(copies);
    box.find('.j-unit-price').html(oneCopiesMoney);
    box.find('.j-rengou').val(rengouCopies);
    box.find('.j-rengou-percentage').html(rengouPercent);

    // 保底份数,保底百分比,认购
    box.find('.j-baodi-text').val(baodiCopies);
    box.find('.j-baodi-percent').html(baodiPercent);
    box.find('.j-rengou-tip').html(rengouCopies * oneCopiesMoney);

    box.find('.j-baidi-tip').html(baodiTips);
    box.find('.j-totalm-tip').html(totalTips);

  };

  // 合买总金额
  Config.hemaiTotalMoney = 0;

  // 更新合买 总金额
  ZHUI.setHeMaiTotal = function () {

    var box = Config.box;

    if (Config.playType === 'dqtz') return;
    // 总金额
    var totalMoney = box.find('.j-quick-total').html() * 1;

    // 获取份数
    var copies = box.find('.j-share-num').val() || 0;

    // 单份金额
    var oneCopiesMoney = '';

    // 认购金额
    var rengouMoney = '';

    // 认购份数
    var rengouCopies = box.find('.j-rengou').val();

    // 认购百分比
    var rengouPercent = '';

    // 提成
    var ticheng = box.find('.br-select').val() * 1 || 0;

    // 保底金额 b-用户输入保底份数
    var baodiCopies = '';
    var baodiPercent = '';
    var b = parseInt(box.find('.j-baodi-text').val()) || 0;
    var isBaodi = false;

    copies = Number(copies.replace(/[^0-9]/g, ''));
    rengouCopies = Number(rengouCopies.replace(/[^0-9]/g, ''));

    if (Config.hemaiTotalMoney !== totalMoney) {
      Config.hemaiTotalMoney = totalMoney;
      copies = totalMoney;
    }

    // 无购买总金额
    if (totalMoney === 0) {
      ZHUI.updateHemai(0, ticheng, 0, 0, 0, 0, 0);
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
    if (box.find('.j-baodi-check')[0]) {
      isBaodi = box.find('.j-baodi-check')[0].checked;
    }

    // 设置保底份数
    if (isBaodi) {

      box.find('.j-baodi-text')[0].disabled = false;

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
      box.find('.j-baodi-text')[0].disabled = true;
      baodiCopies = 0;
      baodiPercent = '0.00';
    }

    if (totalMoney === 0) {
      rengouPercent = 0;
    } else {
      rengouPercent = (rengouCopies / copies * 100).toFixed(2);
    }

    ZHUI.updateHemai(copies, oneCopiesMoney, rengouCopies, ticheng, rengouPercent, baodiPercent, baodiCopies);
  };

  // 给AJAX 返回的HTML添加时间 检测 追号总金额
  ZHUI.bindZhuiHaoEvent = function () {
    $('.br-details thead .br-zhui-c').on('change', function (event) {
      var checked = $(this)[0].checked;
      $(this).parents('.br-details').find('tbody .br-zhui-c').each(function (index, el) {
        el.checked = checked;
      });
      ZHUI.setZhuiHaoTotal(Config.box);
    });
    $('.br-details tbody .br-zhui-c').on('change', function (event) {
      ZHUI.setZhuiHaoTotal(Config.box);
    });

    $('.br-details thead .br-zhui-bei').on('change', function (event) {

      var val = parseInt($(this).val()) || 1;
      if (isNaN(val)) {
        val = 1
      } else {
        if (val < 1) {
          val = 1;
        } else {
          val = Math.ceil(val);
        }
      }
      if (val > 9999) {
        val = 9999;
      }
      $(this).val(val);
      $(this).parents('.br-details').find('tbody .br-zhui-bei').val(val);
      ZHUI.setZhuiHaoTotal(Config.box);
    });

    $('.br-details tbody .br-zhui-bei').on('change', function (event) {
      var val = parseInt($(this).val()) || 1;
      if (isNaN(val)) {
        val = 1
      } else {
        if (val < 1) {
          val = 1;
        } else {
          val = Math.ceil(val);
        }
      }
      if (val > 9999) {
        val = 9999;
      }
      $(this).val(val);
      ZHUI.setZhuiHaoTotal(Config.box);
    });

    $('.br-details .end_min_money').on('change', function (event) {
      var val = parseInt($(this).val()) || 1;
      if (isNaN(val)) {
        val = 1
      } else {
        if (val < 1) {
          val = 1;
        } else {
          val = Math.ceil(val);
        }
      }
      $(this).val(val);
    });

  };

  // 绑定合买相关事件
  function inputOnfocus(el) {
    if ($.trim(el.val()) == el.attr('data-text')) {
      el.parents('p').find('.j-btext-total').html(0)
      el.val('')
    }
  }

  function inputOnblur(el) {
    var text = el.attr('data-text');
    if ($.trim(el.val()) == '') {
      el.val(text);
      el.parents('p').find('.j-btext-total').html(text.length)
    }
  }

  function reSetStrsize(t) {

    var len = t.val().length;
    var size = parseInt(t.attr('data-size'));

    if (len <= size) {
      t.parents('p').find('.j-btext-total').html(len)
    } else {
      t.val(t.val().slice(0, (size - 1)))
      t.parents('p').find('.j-btext-total').html(size)
    }
  }

  ZHUI.bindHeMaiEvent = function () {

    $('.j-rengou,.j-share-num,.br-select,.j-baodi-check,.j-baodi-text').on('change', function (event) {
      ZHUI.setHeMaiTotal();
    });

    $('.br-textarea,.j-project-title').on('focus', function (event) {
      inputOnfocus($(this));
    });

    $('.br-textarea,.j-project-title').on('blur', function (event) {
      inputOnblur($(this));
    });

    $('.br-textarea,.j-project-title').on('keyup', function (event) {
      reSetStrsize($(this));
    });

  };

  // Update 追号 Each Money, Total Money, Buy QiShu, BuyTotal
  ZHUI.setZhuiHaoTotal = function (box) {

    var m = box.find('.j-quick-total').html() * 1;
    box.find('.br-details tbody .br-zhui-bei').each(function (index, el) {
      box.find('.br-details tbody .j-money')[index].innerHTML = el.value * m;
    });
    var checkedList = box.find('.br-details tbody .br-zhui-c:checked')
    var money = 0;
    box.find('.br-details tbody .br-zhui-c:checked').parents('tr').find('.j-money').each(function (index, el) {
      money += parseInt(el.innerHTML);
    });

    box.find('.j-qi-count').html(checkedList.length)
    box.find('.j-qi-money').html(money)
  };

  /* DLT ZHUI JIA*/
  DLT.updateZhuList = function (box) {

    var m = Config.isZhuiJia;
    var money = DLT.getZhuiJiaStatus();
    var f = 0;

    Config.box.find('.br-zhu-l .money').each(function (index, el) {
      f = el['attributes']['data-m'].value;
      el.innerHTML = money * f;
    });

    COMMON.checkBallGroup(Config.box);
    COMMON.setZhuTotal();

    if (Config.playType === "ztsc") {
      MANUAL.setSdTotal();
      MANUAL.totalSdNums();
    }

    if (Config.playType === "tdtz") {
      DRAG.checkBallAear();
    }

  }

  DLT.getZhuiJiaStatus = function () {
    if (Config.box.find('.j-zj-check')[0]) {
      Config.isZhuiJia = Config.box.find('.j-zj-check')[0].checked;
    } else {
      Config.isZhuiJia = false;
    }
    if (Config.isZhuiJia) {
      return 3;
    } else {
      return 2;
    }

  }

  /**
   *  Common Event
   */
  // 绑定加减输入框事件
  $('.br-count-item').on('click', '.j-count', function (event) {
    event.preventDefault();
    /* Act on the event */
    var m = $(this).siblings('.btn-results'),
      c = $(this).attr('data-c'),
      r = m.attr('data-r');
    COMMON.updateCount(m, c);

    if (m.hasClass('j-quick-bei')) {
      var z = parseInt(m.val()) || 1;
      if (z > Config.maxBeiShu) {
        m.val(Config.maxBeiShu)
      }
      if (z <= 0) {
        m.val(1)
      }
    }

    if (m.hasClass('j-quick-qi')) {
      var z = parseInt(m.val()) || 1;
      if (z > Config.maxQiShu) {
        m.val(Config.maxQiShu)
      }
      if (z <= 0) {
        m.val(1)
      }
    }

    if (m.hasClass('j-quick-zhu')) {
      var z = parseInt(m.val()) || 1;
      if (z > Config.maxZhuShu) {
        m.val(Config.maxZhuShu)
      }
      if (z <= 0) {
        m.val(1)
      }
    }

    COMMON.setZhuTotal();
  });

  // 绑定加减总数输入框事件
  $('.btn-results').on('change', function (event) {
    var r = $(this).attr('data-r');
    var v = parseInt($(this).val(), 10);

    if (isNaN(v)) {
      $(this).val(1);
    } else {
      v = (v >= 1) ? v : 1;
      $(this).val(v);
    }

    if ($(this).hasClass('j-quick-bei')) {
      var z = parseInt($(this).val()) || 1;
      if (z > Config.maxBeiShu) {
        $(this).val(Config.maxBeiShu)
      }
      if (z <= 0) {
        $(this).val(1)
      }
    }

    if ($(this).hasClass('j-quick-qi')) {
      var z = parseInt($(this).val()) || 1;
      if (z > Config.maxQiShu) {
        $(this).val(Config.maxQiShu)
      }
      if (z <= 0) {
        $(this).val(1)
      }
    }

    if ($(this).hasClass('j-quick-zhu')) {
      var z = parseInt($(this).val()) || 1;
      if (z > Config.maxZhuShu) {
        $(this).val(Config.maxZhuShu)
      }
      if (z <= 0) {
        $(this).val(1)
      }
    }

    COMMON.setZhuTotal();
  });

  $('.j-zj-check').on('change', function (event) {

    Config.isZhuiJia = $(this)[0]['checked'];
    DLT.updateZhuList(Config.box);
    ZHUI.setHeMaiTotal();
  });

  /**
   * 快捷投注
   */

  // 添加到投注列表 or 修改投注号码
  $('.j-add-btn').on('click', function (event) {

    var a = parseInt($(this).attr('data-add')),
      h = $(this).hasClass('active'),
      total = $(this).parents('.br-gou').siblings('.m-num-title').find('.j-quick-hd-total').html();

    var html = '',
      rNums = [],
      bNums = [],
      tips = ['请先选择号码', '至少选择' + SEEDS[Config.lotyName].redTotal + '个红球和' + SEEDS[Config.lotyName].blueTotal + '个蓝球', '您好，单个投注的金额应小于2万元，请返回重新选择'];

    var eRed = Config.box.find('.j-ball-red .active'),
      eBlue = Config.box.find('.j-ball-blue .active'),
      eGroup = Config.box.find('.j-layout-select .active');

    if (parseInt(total) > 20000) {
      APP.showTips(tips[2]);
      return;
    }

    if (Config.box.find('.br-zhu-item').length >= Config.maxHang) {
      APP.showTips('您的投注号码多于100行，请返回重新选择');
      return;
    }

    if (a == 1) {
      if (h) {
        eRed.each(function (index, el) {

          var e = $.trim($(this).text());
          rNums.push(e);

        });

        eBlue.each(function (index, el) {

          var e = $.trim($(this).text());
          bNums.push(e);

        });

        if (rNums.length >= SEEDS[Config.lotyName].redTotal && bNums.length >= SEEDS[Config.lotyName].blueTotal) {
          eGroup.removeClass('active');
          html = COMMON.getOneZhu(rNums, bNums, total);
          Config.box.find('.br-zhu-l').append(html);
          COMMON.checkBallGroup($(this));
        } else {
          APP.showTips(tips[1]);
        }
      } else {
        if (eGroup.length > 0) {
          APP.showTips(tips[1]);
        } else {
          APP.showTips(tips[0]);
        }
      }
    }

    if (a == 0) {
      if (h) {
        eRed.each(function (index, el) {
          var e = el.getElementsByTagName('span')[0].innerHTML;
          rNums.push(e);
        });

        eBlue.each(function (index, el) {
          var e = el.getElementsByTagName('span')[0].innerHTML;
          bNums.push(e);
        });

        if (rNums.length >= SEEDS[Config.lotyName].redTotal && bNums.length >= SEEDS[Config.lotyName].blueTotal) {
          eGroup.removeClass('active');
          html = COMMON.getOneZhu(rNums, bNums, total, true);
          qiuckSet.html(html);
          COMMON.checkBallGroup($(this));
          $(this).attr('data-add', 1);
          $(this).find('span').html('添加到投注列表');
        } else {
          APP.showTips(tips[1]);
        }
      } else {
        APP.showTips(tips[0]);
      }
    }

    COMMON.updateTotalZhu($(this));

  });

  //选中当前列
  $('.j-br-zhu').on('click', '.br-zhu-item', function (event) {

    var r = [],
      b = [],
      el = $(this).parents('.br-gou').siblings('.layout_select'),
      list = COMMON.getItemNum($(this)),
      next = el.siblings('.m-num-title');

    if (event.target.tagName === 'A') {

      return;

    } else {

      // clear near item style
      $(this).siblings('.br-zhu-item').removeClass('active');
      $(this).addClass('active');

      // find the ball clear style and selected style
      COMMON.clearAllBallActive(el);
      qiuckSet = $(this);

      // get Item Num and Create Zhu Ball and Update Zhu Tips
      COMMON.createOneZhuBall(list.red, list.blue, el);
      COMMON.checkBallGroup(next);
    }

  });

  // 列表修改当前注
  $('.j-br-zhu').on('click', '.br-zhu-set', function (event) {

    var p = $(this).parents('.br-zhu-item'),
      p1 = $(this).parents('.br-zhu').find('.br-zhu-item'),
      list = COMMON.getItemNum(p),
      br = $(this).parents('.br-gou'),
      html = '修改投注号码',
      el = br.siblings('.layout_select'),
      next = el.siblings('.m-num-title');

    // toggle active
    p1.removeClass('active');
    p.addClass('active');

    // update add button
    COMMON.updateAddBtn(true, html);
    Config.box.find('.j-add-btn').addClass('active').attr('data-add', 0);
    qiuckSet = p;

    // create ball and update zhu middle
    COMMON.createOneZhuBall(list.red, list.blue, el);
    COMMON.checkBallGroup(next);

  });

  // 快捷投注随机选球
  $('.jxredball').on('click', function (event) {

    var v = Config.box.find('.jxRedBall_Num').val();
    var sr = Config.box.find('.j-ball-red');
    COMMON.randomNum(sr, 'redBall', v);
    COMMON.checkBallGroup($(this));

  });

  $('.jxblueball').on('click', function (event) {

    var v = Config.box.find('.jxBlueBall_Num').val();
    var sb = Config.box.find('.j-ball-blue');

    COMMON.randomNum(sb, 'blueBall', v);
    COMMON.checkBallGroup($(this));

  });

  // 快捷投注 选球
  $('.ball-group').on('click', 'li', function (event) {

    var redGroup = Config.box.find('.j-ball-red');
    var redGroupAc = redGroup.find('.active');

    if ($(this).parents('.j-ball-red').length) {

      if (redGroupAc.length <= SEEDS[Config.lotyName].redMax) {

        if (redGroupAc.length == SEEDS[Config.lotyName].redMax) {

          if ($(this).hasClass('active')) {

            $(this).removeClass('active');
            COMMON.checkBallGroup($(this));

          } else {

            APP.showTips('最多只能选择' + SEEDS[Config.lotyName].redMax + '个红球');
            COMMON.checkBallGroup($(this));

          }
        } else {

          $(this).toggleClass('active');
          COMMON.checkBallGroup($(this));

          if (redGroup.find('.active').length == SEEDS[Config.lotyName].redMax) {
            APP.showTips('已经达到最大投注个数');
          }
        }

      } else {

        APP.showTips('最多只能选择' + SEEDS[Config.lotyName].redMax + '个红球');
      }

    } else {

      $(this).toggleClass('active');
      COMMON.checkBallGroup($(this));

    }

  });

  // 快捷投注 清空投注列表
  $('.clearredball').on('click', function (event) {
    Config.box.find('.j-ball-red .active').removeClass('active');
    COMMON.checkBallGroup($(this));
  });

  $('.clearblueball').on('click', function (event) {
    Config.box.find('.j-ball-blue .active').removeClass('active');
    COMMON.checkBallGroup($(this));
  });

  // 删除当前注
  $('.j-br-zhu').on('click', '.br-zhu-del', function (event) {

    var c = $(this).parents('.br-zhu');
    $(this).parents('.br-zhu-item').remove();
    $('.j-add-btn').attr('data-add', 1);
    $('.j-add-btn').find('span').html('添加到投注列表');
    COMMON.updateTotalZhu(c);
  });

  // 机选N注
  $('.j-zhu-adds').on('click', function (event) {
    var box = Config.box;
    var len = parseInt($(this).attr('data-zhu'));
    var html = COMMON.getManyZhu(len);
    var zhuTotal = parseInt(box.find('.br-zhu-item').length);

    if ((zhuTotal + len) <= Config.maxHang) {
      box.find('.br-zhu-l').append(html);
      COMMON.updateTotalZhu($(this));
    } else {
      APP.showTips('您的投注号码多于100行，请返回重新选择');
      return;
    }

  });

  // 清空列表
  $('.j-zhu-clean').on('click', function (event) {

    $(this).parents('.br-zhu-r').siblings('.br-zhu-l').html('');
    COMMON.updateTotalZhu($(this));
  });

  /**
   * 拖胆投注
   */

  // 拖胆投注-选号红区
  $('.m-num-group-red').on('click', 'a', function (event) {

    var i = $(this).index(),
      parent = '.m-num-group-red',
      parentEl = $(this).parents(parent),
      max = SEEDS[Config.lotyName].redDanMax,
      tuoMax = SEEDS[Config.lotyName].redTuoMax,
      dan = parentEl.attr('data-dan'),
      len = parentEl.find('.active').length;

    if (dan == 1) {
      if (len < max) {
        parentEl.siblings(parent).find('a').eq(i).removeClass('active');
        $(this).toggleClass('active');
      } else {
        if (len == max && $(this).hasClass('active')) {
          $(this).toggleClass('active');
        } else {
          APP.showTips('最多只能有' + max + '个胆码');
        }
      }
    } else {
      if (len < tuoMax) {
        parentEl.siblings(parent).find('a').eq(i).removeClass('active');
        $(this).toggleClass('active');
      } else {
        if (len == tuoMax && $(this).hasClass('active')) {
          $(this).toggleClass('active');
        } else {
          APP.showTips('最多只能有' + tuoMax + '个拖码');
        }
      }
    }

    DRAG.checkBallAear();
  });

  // 拖胆投注-随机选球
  $('.j-random-tuo').on('click', function (event) {

    var _this = $(this),
      g = '.m-num-group',
      tuo = _this.parents(g),
      dan = tuo.siblings(g),
      num = DRAG.getTuodanNum(dan),
      co = _this.attr('data-color'),
      len = tuo.find('.tuo-select').val(),
      getrandomNums = '';

    getrandomNums = DRAG.randomTuodanNum(num, co, len);
    DRAG.createOneTuodanBall(getrandomNums, tuo);
    DRAG.checkBallAear();
  });

  // 拖胆投注-清空选球区域
  $('.m-num-group').on('click', '.m-num-clean', function (event) {
    $(this).parents('.m-num-group').find('a.active').removeClass('active');
    DRAG.checkBallAear();
    COMMON.setZhuTotal();
  });

  // 拖胆投注-删除当前注
  $('#j-tuo-zhu').on('click', '.br-zhu-del', function (event) {

    var c = $(this).parents('.br-zhu');
    $(this).parents('.br-zhu-item').remove();
    $('#tuo-sub').attr('data-add', 1);
    $('#tuo-sub').find('span').html('添加到投注列表');

    COMMON.updateTotalZhu(c);

  });

  // 拖胆注添加到列表
  $('#tuo-sub').on('click', function (event) {

    var html = '';
    var zhuHtml = '';
    var zhu = DRAG.getTuodanBallZhu();
    var brGou = $(this).parents('.br-gou');
    var tips = ['前区胆码至少选择一个', '您选的方案不足一注', '您好，单个投注的金额应小于2万元，请返回重新选择'];
    var type = $(this).attr('data-add');
    var money = DLT.getZhuiJiaStatus();

    if (zhu.total * 2 > 20000) {
      APP.showTips(tips[2]);
      return;
    }
    if (Config.box.find('.br-zhu-item').length >= Config.maxHang) {
      APP.showTips('您的投注号码多于100行，请返回重新选择');
      return;
    }

    // is Select Ball Enough
    if (zhu.code === -1) {
      APP.showTips(tips[0]);
      return;
    }
    if (zhu.code === -2) {
      APP.showTips(tips[1]);
      return;
    }

    if (zhu.code > 0) {

      if (type == '1') {
        // create html insert to the list and update zhu
        html = DRAG.addOneTuoZhu(zhu.rDaned, zhu.rTuoed, zhu.bDaned, zhu.bTuoed, zhu.total * money);
        brGou.find('.br-zhu-l').append(html);

        COMMON.updateTotalZhu($(this));
        COMMON.setZhuTotal();

        COMMON.clearAllBallActive($('.m-num-group'));
        DRAG.checkBallAear();
        return;
      } else {

        html = DRAG.addOneTuoZhu(zhu.rDaned, zhu.rTuoed, zhu.bDaned, zhu.bTuoed, zhu.total * money, true);
        tuoDanSet.html(html);

        COMMON.updateTotalZhu($(this));
        COMMON.setZhuTotal();

        COMMON.clearAllBallActive($('.m-num-group'));
        DRAG.checkBallAear();

        $(this).attr('data-add', 1);
        $(this).find('span').html('添加到投注列表');
        return;
      }

    }

  });

  // 拖胆投注-修改选中注
  $('#j-tuo-zhu').on('click', '.br-zhu-set', function (event) {

    var p = $(this).parents('.br-zhu-item'),
      br = $(this).parents('.br-gou'),
      el = Config.box,
      list = DRAG.getOneListNums(p),
      next = $('#j-tuo-mintips'),
      n = ['rd', 'rt', 'dd', 'dt'],
      group = Config.box.find('.m-num-group'),
      ball = '';

    // clear near item style
    p.siblings('.br-zhu-item').removeClass('active');
    p.addClass('active');

    // update add button
    br.find('#tuo-sub').find('span').html('修改投注号码');
    br.find('#tuo-sub').addClass('active').attr('data-add', 0);
    tuoDanSet = p;

    // create ball and update zhu middle
    COMMON.clearAllBallActive(group);

    // select ball
    for (var i = 0; i < group.length; i++) {
      for (var j = 0; j < list[n[i]].length; j++) {
        ball = parseInt(list[n[i]][j]) - 1;
        group.eq(i).find('a').eq(ball).addClass('active');
      };
    };

    // check ball Aear
    DRAG.checkBallAear(next);

  });

  // 拖胆投注 选号 蓝区
  $('.m-num-group-blue').on('click', 'a', function (event) {

    var i = $(this).index(),
      parent = '.m-num-group-blue',
      parentEl = $(this).parents(parent),
      max = parseInt(parentEl.attr('data-max')),
      dan = parentEl.attr('data-dan'),
      len = parentEl.find('.active').length;

    if (dan == 1) {
      if (len < max) {
        parentEl.siblings(parent).find('a').eq(i).removeClass('active');
        $(this).toggleClass('active');
      } else {
        if (len == max && $(this).hasClass('active')) {
          $(this).toggleClass('active');
        } else {
          if (lotyName == 'dlt') APP.showTips('最多只能有1个胆码');
        }
      }
    } else {
      parentEl.siblings(parent).find('a').eq(i).removeClass('active');
      $(this).toggleClass('active');
    }
    DRAG.checkBallAear();
  });

  //  拖胆投注-选中当前注
  $('#j-tuo-zhu').on('click', '.br-zhu-item', function (event) {

    var el = $(this).parents('.br-gou').siblings('.layout_select,.dt_layout_select'),
      list = DRAG.getOneListNums($(this)),
      next = $('#j-tuo-mintips'),
      n = '',
      group = '',
      ball = '';

    if (lotyName == 'dlt') {
      n = ['rd', 'rt', 'dd', 'dt'],
        group = el.find('.m-num-group')
    }

    if (event.target.tagName === 'A') {
      return;
    } else {

      // clear near item style
      $(this).siblings('.br-zhu-item').removeClass('active');
      $(this).addClass('active');

      // find the ball clear style and selected style
      COMMON.clearAllBallActive(el);
      tuoDanSet = $(this);

      // get Item Num and Create Zhu Ball and Update Zhu Tips
      COMMON.clearAllBallActive(el);
      if (lotyName == 'dlt') {
        // select ball
        for (var i = 0; i < group.length; i++) {

          for (var j = 0; j < list[n[i]].length; j++) {
            ball = parseInt(list[n[i]][j]) - 1;
            group.eq(i).find('a').eq(ball).addClass('active');
          };

        };
      } else {
        // select ball
        for (var i = 0; i < list['rd'].length; i++) {
          ball = parseInt(list['rd'][i]) - 1;
          $('.m-num-group-red[data-dan="1"]').find('a').eq(ball).addClass('active');
        };
        for (var i = 0; i < list['rt'].length; i++) {
          ball = parseInt(list['rt'][i]) - 1;
          $('.m-num-group-red[data-dan="0"]').find('a').eq(ball).addClass('active');
        };
        for (var i = 0; i < list['dd'].length; i++) {
          ball = parseInt(list['dd'][i]) - 1;
          $('.m-num-group-blue[data-dan="0"]').find('a').eq(ball).addClass('active');
        };
      }

      // clear ball Aear
      DRAG.checkBallAear(next);
    }

  });
  /****************MANUAL****************/
  var sdNumberTips = '';
  var sdStatus = true;

  $('#sd_number').on('blur', function (event) {
    event.preventDefault();
    /* Act on the event */

    var val = $.trim($(this).val());
    if (val === '') {
      $('#j-textarea-mask').show();
    }

  });

  // 粘贴上传-添加到投注列表
  $('#sd_sub').on('click', function (event) {

    var t = $(this);
    var str = $.trim($('#sd_number').val());
    var formatZhus = '';
    var l = '';
    var html = '';
    var tips = ['<h5>请按照正确的格式填写：</h5><p>单式：01,02,03,04,05,06+01</p><p>复式：01,02,03,04,05,06,07,08+01,02</p>', '请输入投注号码', '您的投注号码多于' + Config.maxHang + '行，请返回重新选择', '您好，单个投注的金额应小于2万元，请返回重新选择'];
    var boxZhuLen = Config.box.find('.br-zhu-item').length;
    var addZhuLen = 0;
    var money = DLT.getZhuiJiaStatus();

    if (!t.hasClass('active')) {
      return;
    }

    if (lotyName == 'dlt') {
      tips[0] = '<h5>请按照正确的格式填写：</h5><p>单式：01,02,03,04,05+01,02</p><p>复式：01,02,03,04,05,06,07+01,02,03</p>';
    }

    if (Config.box.find('.br-zhu-item').length >= Config.maxHang) {
      APP.showTips(tips[2]);
      return;
    }

    // 输入为空判断
    if (_.isEmpty(str)) {

      APP.showTips(tips[1]);
      return;

    } else {

      formatZhus = MANUAL.sdFormat(str);
      addZhuLen = formatZhus.good.length;

      if (formatZhus.overMaxMoney) {
        APP.showTips(tips[3]);
        return;
      }

      if ((boxZhuLen + addZhuLen) > Config.maxHang) {
        APP.showTips(tips[2]);
        return;
      }

    }

    // 格式化正常注数
    if (formatZhus && formatZhus.code == 0) {
      APP.showTips(tips[0]);
    }

    // 构造html
    for (var i = 0; i < formatZhus.good.length; i++) {
      l = MANUAL.relovStr(formatZhus.good[i]);
      html += MANUAL.getListHTML(l[0], l[1], formatZhus.moneyArr[i]);
    };

    $('#sd-list').append(html);

    // 更新总额
    MANUAL.setSdTotal();

    // 非法单式处理
    if (formatZhus.bad.length > 0) {

      $('#sd_number').val('');
      for (var i = 0; i < formatZhus.bad.length; i++) {
        if (formatZhus.bad[i]) {
          $('#sd_number').val($('#sd_number').val() + formatZhus.bad[i] + '\n');
        }
      };

    } else {

      $('#sd_number').val('');

    }

    // 更新选项
    MANUAL.totalSdNums();
    ZHUI.setHeMaiTotal();

  });

  //手动输入Mask
  $('#j-textarea-mask').on('click', function (event) {
    $(this).hide()
    $('#sd_number')[0].focus();
  });

  // 手动输入获取输入框焦点
  $('#sd_number').on('focus', function (event) {
    if (sdStatus) {
      sdNumberTips = $(this).val();
      $(this).val('');
      sdStatus = false;
    }
    $(this).addClass('focus');
  });

  // 更新手动输入注数
  $('#sd_number').on('keyup blur', function (event) {
    MANUAL.totalSdNums();
  });

  // 删除当前注
  $('#sd-list').on('click', '.br-zhu-del', function (event) {
    var c = $(this).parents('.br-zhu');
    $(this).parents('.br-zhu-item').remove();
    MANUAL.setSdTotal();
    ZHUI.setHeMaiTotal();
  });

  // 清空列表
  $('#j-sd-clean').on('click', function (event) {
    $(this).parents('.br-zhu-r').siblings('.br-zhu-l').html('');
    MANUAL.setSdTotal();
    ZHUI.setHeMaiTotal();
  });

  /**
   *Bind Other Tabs Toggle Event
   */
  // Quick, senior toggle
  $('#j-brhd-group a').on('click', function (event) {

    if ($(this).hasClass('active')) {

      return;

    } else {

      $('#j-brhd-group .active').removeClass('active');

      var t = parseInt($(this).attr('data-t'));

      if (t) {

        $('#quick').addClass('hidden');
        $('#senior').removeClass('hidden');
        Config.box = $('#senior .box-left').eq(0);

      } else {

        $('#senior').addClass('hidden');
        $('#quick').removeClass('hidden');
        Config.box = $('#quick .box-left');

      }

      $(this).addClass('active');
      return;

    }

  });


  // Senior Lottery Tabs Toggle
  $('#j-nav-tabs').on('click', 'a', function (event) {
    var i = $(this).parents('li').index();
    Config.box = $('#senior .box-left').eq(i);
    Config.playType = $(this).attr('data-playtype');
  });

  // 方案设置
  $('.br-set-group').on('click', '.br-set', function (event) {
    event.preventDefault(); /* Act on the event */
    $(this).siblings('.active').removeClass('active');
    $(this).addClass('active');
  });

  // 右侧栏选项框
  $('.tab-cut').on('mouseover', 'li', function (event) {
    event.preventDefault(); /* Act on the event */
    $('#lr_tab li.on').removeClass('on');
    $(this).addClass('on');
    var c = $('#lr_content .tab-con');
    c.hide();
    c.eq($(this).index()).show();
  });

  // br-type icon toggle
  $('.j-br-type a[data-toggle="tab"]').on('click', function (e) {

    var li = $(this).parents('li'),
      box = Config.box,
      qi = box.find('.j-qi-box'),
      he = box.find('.j-he-box'),
      buyType = parseInt(li.attr('data-buytype'));

    switch (buyType) {
    case 1:
      box.find('.j-bei-text').show();
      qi.addClass('hide');
      he.addClass('hide');
      break;
    case 2:
      box.find('.j-bei-text .j-quick-bei').val(1)
      COMMON.updateTotalZhu($(this))
      box.find('.j-bei-text').hide();
      qi.removeClass('hide');
      he.addClass('hide');
      break;
    case 3:
      box.find('.j-share-num').val(box.find('.j-quick-total').html());
      box.find('.j-bei-text').show();
      he.removeClass('hide');
      qi.addClass('hide');
      ZHUI.setHeMaiTotal();
      break;
    }

    $(this).parents('.j-br-type').find('.icon-y2').removeClass('icon-y2');
    $(this).find('.icon').addClass('icon-y2');
  });

  // From Submit
  // 快捷投注 - 提交请求
  $('#qiuck-sub').on('click', function (event) {

    var box = Config.box;
    var vote = {};
    var params = {};
    var buytype = '';
    var requestURL = '';

    params = COMMON.getCommonParams();
    params.qishu = box.find('.j-quick-qi').val();

    requestURL = (params.qishu == 1) ? '/lottery/digital/buy-self/' + params.lotyName + '/' + params.playName : '/lottery/digital/buy-track/' + params.lotyName + '/' + params.playName;

    vote.isCheck = box.find('.j-sub-agreed')[0].checked;

    vote.callback = function () {
      $.ajax({
          url: requestURL,
          type: 'post',
          dataType: 'json',
          data: params,
        })
        .done(function (data) {
          if (data.retCode === 100000) {
            COMMON.onSubmitDone(data.retCode, data.retMsg, data.retData.projectNo, data.retData.trackId);
          } else {
            APP.handRetCode(data.retCode, data.retMsg);
            return;
          }
        })
        .fail(function () {
          COMMON.onSubmitFail();
        });
    };

    vote.confirmHtml = {
      html: COMMON.getAlertHtml(params),
    };

    var c = COMMON.checkParamsStatus(params, vote);
    if (!c) return false;

    APP.checkLogin(Config.payMoney, {
      enoughMoney: function () {
        APP.showTips(vote.confirmHtml);
        $('#buyConfirm').one('click', function (event) {
          vote.callback();
        });
      }
    });

  });

  COMMON.getMoreAjaxParams = function (type) {

    var box = Config.box;
    var params = {};

    if (type === 3) {
      params.shareNum = Number(box.find('.j-share-num').val());
      params.buyNum = Number(box.find('.j-rengou').val());
      params.aegisNum = Number(box.find('.j-baodi-text').val());
      params.extraPercent = box.find('.br-select').val()

      params.title = box.find('.j-project-title').val()
      params.textarea = box.find('.br-textarea').val()
      params.set = box.find('.br-set-group .active').html()
    }

    return params;

  };

  // 常规投注 - 提交请求
  $('#buy-submit').on('click', function (event) {

    var box = Config.box;
    var vote = {};
    var params = {};
    var buytype = '';
    var requestURL = '';
    var money = DLT.getZhuiJiaStatus();
    var moreParams = '';
    var buyUrlType = ['buy-self', 'buy-track', 'buy-together'];

    params = COMMON.getCommonParams();

    // 判断购买方式 2追买 3合买
    buytype = parseInt(box.find('.j-br-type .active').attr('data-buytype'));

    moreParams = COMMON.getMoreAjaxParams(buytype, params.playName);

    for (var prop in moreParams) {
      if (moreParams.hasOwnProperty(prop)) {
        params[prop] = moreParams[prop];
      }
    }

    if (buytype === 2) {

      if (box.find('.is_end_zhongjiang')[0].checked) {
        params.endminmoney = box.find('.end_min_money').val()
      }

      var q = [];
      var c = box.find('.br-details tbody .br-zhui-c:checked');
      for (var i = 0; i < c.length; i++) {
        q.push(c.eq(i).attr('data-qihaoid') + '|' + c.eq(i).attr('data-qi') + '|' + c.eq(i).parents('tr').find('.br-zhui-bei').val());
      };

      params.zhuihaoqihao = q;
      params.qishu = q.length;

    }

    requestURL = '/lottery/digital/' + buyUrlType[buytype - 1] + '/' + params.lotyName + '/' + params.playName;

    vote.isCheck = box.find('.j-sub-agreed')[0].checked;

    vote.callback = function () {

      if ((params.buyNum + params.aegisNum) > params.shareNum) {

        APP.showTips('ERROR：认购金额和保底金额超过购买金额！');
        return;

      }
      $.ajax({
          url: requestURL,
          type: 'post',
          dataType: 'json',
          data: params,
        })
        .done(function (data) {
          if (data.retCode === 100000) {
            COMMON.onSubmitDone(data.retCode, data.retMsg, data.retData.projectNo, data.retData.trackId);
          } else {
            APP.handRetCode(data.retCode, data.retMsg);
            return;
          }
        })
        .fail(function () {
          COMMON.onSubmitFail()
        });
    };

    vote.confirmHtml = {
      html: COMMON.getAlertHtml(params),
    };

    var c = COMMON.checkParamsStatus(params, vote);
    if (!c) return false;

    APP.checkLogin(Config.payMoney, {
      enoughMoney: function () {
        APP.showTips(vote.confirmHtml);
        $('#buyConfirm').one('click', function (event) {
          vote.callback();
        });
      }
    });

  });

  //拖胆上传
  $('#j-tuodan-sub').on('click', function (event) {

    var box = Config.box;
    var vote = {};
    var params = {};
    var buytype = '';
    var requestURL = '';
    var money = DLT.getZhuiJiaStatus();
    var moreParams = '';
    var buyUrlType = ['buy-self', 'buy-track', 'buy-together'];

    params = COMMON.getCommonParams();
    params.codes = COMMON.tuodanFormarFormSub(box.find('.br-zhu-item'));
    // 胆拖玩法类型 为2 固定
    params.playName = 2;
    // 判断购买方式 2追买 3合买
    buytype = parseInt(box.find('.j-br-type .active').attr('data-buytype'));

    moreParams = COMMON.getMoreAjaxParams(buytype, params.playName);

    for (var prop in moreParams) {
      if (moreParams.hasOwnProperty(prop)) {
        params[prop] = moreParams[prop];
      }
    }

    if (buytype === 2) {
      if (box.find('.is_end_zhongjiang')[0].checked) {
        params.endminmoney = box.find('.end_min_money').val();
      }
      var q = [];
      var c = box.find('.br-details tbody .br-zhui-c:checked');
      for (var i = 0; i < c.length; i++) {
        q.push(c.eq(i).attr('data-qihaoid') + '|' + c.eq(i).attr('data-qi') + '|' + c.eq(i).parents('tr').find('.br-zhui-bei').val());
      };
      params.zhuihaoqihao = q;
      params.qishu = q.length;
    }

    requestURL = '/lottery/digital/' + buyUrlType[buytype - 1] + '/' + params.lotyName + '/' + params.playName;

    vote.isCheck = box.find('.j-sub-agreed')[0].checked;
    vote.callback = function () {
      if ((params.buyNum + params.aegisNum) > params.shareNum) {
        APP.showTips('ERROR：认购金额和保底金额超过购买金额！');
        return;
      }
      $.ajax({
          url: requestURL,
          type: 'post',
          dataType: 'json',
          data: params,
        })
        .done(function (data) {
          if (data.retCode === 100000) {
            COMMON.onSubmitDone(data.retCode, data.retMsg, data.retData.projectNo, data.retData.trackId);
          } else {
            APP.handRetCode(data.retCode, data.retMsg);
            return;
          }
        })
        .fail(function () {
          COMMON.onSubmitFail()
        });
    };
    vote.confirmHtml = {
      html: COMMON.getAlertHtml(params),
    };

    var c = COMMON.checkParamsStatus(params, vote);
    if (!c) return false;

    APP.checkLogin(Config.payMoney, {
      enoughMoney: function () {
        APP.showTips(vote.confirmHtml);
        $('#buyConfirm').one('click', function (event) {
          vote.callback();
        });
      }
    });

  });

  //粘贴上传
  $('#j-upload-sub').on('click', function (event) {

    var box = Config.box;
    var vote = {};
    var params = {};
    var buytype = '';
    var requestURL = '';
    var money = DLT.getZhuiJiaStatus();
    var moreParams = '';
    var buyUrlType = ['buy-self', 'buy-track', 'buy-together'];

    params = COMMON.getCommonParams();
    params.beishu = 1;

    // 判断购买方式 2追买 3合买
    var buytype = parseInt(box.find('.j-br-type .active').attr('data-buytype'));

    moreParams = COMMON.getMoreAjaxParams(buytype, params.playName);

    for (var prop in moreParams) {
      if (moreParams.hasOwnProperty(prop)) {
        params[prop] = moreParams[prop];
      }
    }

    requestURL = '/lottery/digital/' + buyUrlType[buytype - 1] + '/' + params.lotyName + '/' + params.playName;

    vote.isCheck = box.find('.j-sub-agreed')[0].checked;
    vote.callback = function () {
      if ((params.buyNum + params.aegisNum) > params.shareNum) {
        APP.showTips('ERROR：认购金额和保底金额超过购买金额！');
        return;
      }

      $.ajax({
          url: requestURL,
          type: 'post',
          dataType: 'json',
          data: params,
        })
        .done(function (data) {
          if (data.retCode === 100000) {
            COMMON.onSubmitDone(data.retCode, data.retMsg, data.retData.projectNo, data.retData.trackId);
          } else {
            APP.handRetCode(data.retCode, data.retMsg);
            return;
          }
        })
        .fail(function () {
          COMMON.onSubmitFail()
        });
    };
    vote.confirmHtml = {
      html: COMMON.getAlertHtml(params),
    };

    var c = COMMON.checkParamsStatus(params, vote);
    if (!c) return false;

    APP.checkLogin(Config.payMoney, {
      enoughMoney: function () {
        APP.showTips(vote.confirmHtml);
        $('#buyConfirm').one('click', function (event) {
          vote.callback();
        });
      }
    });

  });

  // 多期投注 - Submit
  $('#j-more-sub').on('click', function (event) {

    var box = $(this).parents('.tab-pane');
    var vote = {};
    var params = {};

    params = COMMON.getCommonParams();
    params.zhushu = $('#j-more-zhu').val();
    params.beishu = $('#j-more-bei').val();
    params.qishu = $('#j-more-qi').val();

    vote.isCheck = box.find('.j-sub-agreed')[0].checked;
    vote.callback = function () {
      $.ajax({
          url: '/lottery/digital/buy-rank/' + params.lotyName + '/' + params.playName,
          type: 'post',
          dataType: 'json',
          data: params,
        })
        .done(function (data) {
          if (data.retCode === 100000) {
            COMMON.onSubmitDone(data.retCode, data.retMsg, data.retData.projectNo, data.retData.trackId);
          } else {
            APP.handRetCode(data.retCode, data.retMsg);
            return;
          }
        })
        .fail(function () {
          COMMON.onSubmitFail()
        });
    };
    vote.confirmHtml = {
      html: COMMON.getAlertHtml(params),
    };

    var c = COMMON.checkParamsStatus(params, vote);
    if (!c) return false;

    APP.checkLogin(Config.payMoney, {
      enoughMoney: function () {
        APP.showTips(vote.confirmHtml);
        $('#buyConfirm').one('click', function (event) {
          vote.callback();
        });
      }
    });

  });

  /**
   * Bind ZhuiHao And HeMai Module
   *
   */
  $('.zh_issue_num').on('change', function (event) {
    event.preventDefault();
    ZHUI.getNewHtml($(this));
  });
  $('.br-details').on('click', '.br-zhui-btn', function (event) {
    ZHUI.getNewHtml($(this));
  });
  $('.br-details').on('click', '.br-he-btn', function (event) {
    ZHUI.setHeMaiTotal();
  });
  ZHUI.bindHeMaiEvent();

  // function initRightBox(){
  //   var leftHeight = $('.box-left').height();
  //   var rightTop = $('.box-right').css('marginTop').slice(0,2);
  //   $('.box-right').height(leftHeight-rightTop);
  // }

  // initRightBox();

});