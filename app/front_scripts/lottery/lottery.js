'use strict';

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
  'use strict';

  var Config = {
    maxBeiShu: 9999,
    maxZhuShu: 100,
    maxHang: 100,
    maxQiShu: 154,
    lotyName: lotyName,
    payMoney: 0,
    isZhuiJia: 0,
    box: $('#quick .box-left'),
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
  blueMax: 12,
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
  blueMax: 12,
  redDanMax: 4,
  redTuoMax: 17,
  redTotal: 5,
  blueTotal: 2,
};

TEMPLATE = {
  frbox: '<div class="frbox"><img src="' + staticHostURI + '/front_images/fail.png" alt="success" class="icon"><div class="text"><p><%= lotyName%> 第<span><%= qihao%></span>期</p><p>共<span><%= zs %></span>注, 投注<span><%= bs %></span>倍</p><p>本次需支付<span class="fc-3"><%= total %>.00</span>元</p><div class="btns"><button class="btn btn-danger" id="buyConfirm">确定</button><button class="btn btn-gray" data-dismiss="modal">取消</button></div></div></div>',
  zhbox: '<div class="frbox"><img src="' + staticHostURI + '/front_images/fail.png" alt="success" class="icon"><div class="text"><p>追号<span><%= qs %></span>期</p><p>本次需支付<span class="fc-3"><%= total %>.00</span>元</p><div class="btns"><button class="btn btn-danger" id="buyConfirm">确定</button><button class="btn btn-gray" data-dismiss="modal">取消</button></div></div></div>',
  rgbox: '<div class="frbox"><img src="' + staticHostURI + '/front_images/fail.png" alt="success" class="icon"><div class="text"><p><%= lotyName%> 第<span><%= qihao%></span>期</p><p>方案总金额<span class="fc-3"><%= total %>.00</span>元</p><p>您认购<span><%= rengou %>.00</span>元</p><p>共需支付<span class="fc-3"><%= rengou %>.00</span>元</p><div class="btns"><button class="btn btn-danger" id="buyConfirm">确定</button><button class="btn btn-gray" data-dismiss="modal">取消</button></div></div></div>',
  bdbox: '<div class="frbox"><img src="' + staticHostURI + '/front_images/fail.png" alt="success" class="icon"><div class="text"><p><%= lotyName%> 第<span><%= qihao%></span>期</p><p>方案总金额<span class="fc-3"><%= total %>.00</span>元</p><p>您认购<span><%= rengou %>.00</span>元, 保底<span><%= baodi %>.00</span>元</p><p>共需支付<span class="fc-3"><%= pay %>.00</span>元</p><div class="btns"><button class="btn btn-danger" id="buyConfirm">确定</button><button class="btn btn-gray" data-dismiss="modal">取消</button></div></div></div>'
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

  // isZhui = (Config.box.find('.j-br-type .active').attr('data-buytype') == 2) ? true : false;

  if (isZhui) {

    box = TEMPLATE.zhbox;
    payMoney = o.zhushu * Money * o.beishu * o.qishu;
    obj = {
      qs: o.qishu,
      total: payMoney
    };

  } else {
    if (o.rengouMoney) {
      if (o.baodiText != 0) {

        box = TEMPLATE.bdbox;
        payMoney = Number(o.rengouMoney) + Number(o.baodiText);
        obj = {
          lotyName: lotyName,
          qihao: o.qihao,
          rengou: o.rengouMoney,
          baodi: o.baodiText,
          total: o.zhushu * Money * o.beishu,
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
    store.clear();
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

// 彩票购买提交 初始化
COMMON.onSubmitInit = function (params, vote) {
  var c = this.checkParamsStatus(params, vote);

  if (c) {
    $.ajax({
        url: '/account/islogin',
        type: 'get',
        dataType: 'json',
      })
      .done(function (D) {
        if (D.retCode === 100000) {
          if (Number(D.retData.money.replace(/,/g, '')) >= Config.payMoney) {
            APP.showTips(vote.confirmHtml);
            $('#buyConfirm').one('click', function (event) {
              vote.callback();
            });
          } else {
            APP.showTips({
              html: '<div class="tipbox"><p>您的余额不足,购买失败！</p><div class="m-one-btn"><a href="/account/top-up" class="btn btn-danger" target="_blank">立即充值</a></div></div>'
            });
          }
        } else {
          APP.handRetCode(D.retCode, D.retMsg);
        }
      });
  }

};

/**
 * [getCommonParams 购买彩票,获取要提交的参数]
 * @param  {} el [.box-left 对象]
 * @return {}    [彩票提交必须参数]
 */
COMMON.getCommonParams = function () {

  var params = (function () {
    'use strict';
    var box = Config.box;
    var params = {
      lotyName: $('#lotyName').val(),
      playName: $('#playName').val(),
//      unikey: $('#unikey').val(),
      qihaoId: $('#qihaoId').val(),
      qihao: $('#qihao').val(),
      zhushu: box.find('.j-quick-zhu').html(),
      beishu: box.find('.j-quick-bei').val(),
      qishu: 1,
      codes: COMMON.formarFormSub(box.find('.br-gou .br-zhu-item')),
      unikey: (new Date()).valueOf(),//Math.floor(Math.random() * 100000),
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
}

/**
 * [clearAllBallActive 清除所有球的选中状态]
 * @param  {Object} el Ball-Aear
 * @return {null}
 */
COMMON.clearAllBallActive = function (el) {
  el.find('.active').removeClass();
}

// 随机选取N个球
COMMON.randomNum = function (el, type, l) {
  var len = parseInt(l);
  var arr = _.sample(SEEDS[Config.lotyName][type], len);
  el.find('.active').removeClass();
  for (var i = 0; i < arr.length; i++) {
    el.find('li').eq(arr[i] - 1).addClass('active');
  };
}

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
  } else {
    console.log('Miss Element!');
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

  if (_.isUndefined(Config.box.find('#j-more-sub')[0])) {
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
    ZHUI.setHeMaiTotal(p);
  }
}

// 检测 选球区
COMMON.checkBallGroup = function () {

  // check select ball for toggle add button status
  var p = Config.box;
  var m = DLT.getZhuiJiaStatus();
  var rLen = parseInt(p.find('.ball_red li.active').length),
    bLen = parseInt(p.find('.ball_blue li.active').length),
    x = 0,
    y = 0,
    t = 0;

  if (rLen >= SEEDS[Config.lotyName].redTotal && bLen >= SEEDS[Config.lotyName].blueTotal) {
    x = QUEUE.getACTotalNum(rLen, SEEDS[Config.lotyName].redTotal, 'C');
    y = QUEUE.getACTotalNum(bLen, SEEDS[Config.lotyName].blueTotal, 'C');
    t = x * y;
    p.find('.btn-add').addClass('active');
  } else {
    p.find('.btn-add').removeClass('active');
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
    el.find('.ball_red li').eq(rnum).addClass('active');
  };

  for (var i = 0; i < b.length; i++) {
    bnum = parseInt(b[i]) - 1;
    el.find('.ball_blue li').eq(bnum).addClass('active');
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

// 检测拖胆选球区
DRAG.checkBallAear = function () {

  // 获取 选球区状态
  var zhu = DRAG.getTuodanBallZhu();

  if (zhu.total) {
    $('#tuo-sub').addClass('active');
  } else {
    $('#tuo-sub').removeClass('active');
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
    $('#sd_sub').addClass('active')
  } else {
    $('#sd_sub').removeClass('active')
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

// 检测手动输入注
MANUAL.checkSdZhu = function (str, typeNums, len) {

  var nums = str.split(',')

  if (nums.length == len && _.uniq(nums).length == len) {
    for (var i = 0; i < nums.length; i++) {
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
}

// 格式化 手动上传号码
MANUAL.sdFormat = function (str) {

  var zhus = {};
  var l = '';

  zhus.code = 0;
  zhus.good = [];
  zhus.bad = [];

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
        l = zhus.all[i].split(/\|/g)
      }

      if (l.length == 2) {

        if (MANUAL.checkSdZhu(l[0], SEEDS[Config.lotyName].redBall, SEEDS[Config.lotyName].redTotal) && MANUAL.checkSdZhu(l[1], SEEDS[Config.lotyName].blueBall, SEEDS[Config.lotyName].blueTotal)) {

          zhus.good.push(zhus.all[i]);

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

// 更新合买 总金额
ZHUI.setHeMaiTotal = function (box) {
  // 获取购买金额
  var m = box.find('.j-quick-total').html() * 1;
  //认购金额
  var rengouMoney = box.find('.j-rengou').val() * 1 || 1;
  //我要提成
  var ticheng = box.find('.br-select').val() * 1 || 0;

  if (rengouMoney > m) {
    rengouMoney = m
  } else {
    if (rengouMoney <= 0) {
      rengouMoney = m
    }
  }

  // 对比 认购百分比 和 我要提成
  if (ticheng < (rengouMoney / m * 100)) {} else {
    rengouMoney = Math.ceil(ticheng * 0.01 * m);
  }

  //我要保底金额
  var baodiMoney = '';
  var baodiPercent = '';
  var b = '';
  var isBaodi = false;

  if (box.find('.j-baodi-check')[0]) {
    isBaodi = box.find('.j-baodi-check')[0].checked;
  } else {
    isBaodi = false;
  }

  if (isBaodi && (m != 0)) {
    box.find('.j-baodi-text')[0].disabled = false;
    b = parseInt(box.find('.j-baodi-text').val()) || 0
    if (b == 0) {
      if ((rengouMoney / m) < 0.8) {
        baodiMoney = Math.ceil(m * 0.2);
        baodiPercent = (baodiMoney / m * 100).toFixed(2);
      } else {
        baodiMoney = m - rengouMoney
        baodiPercent = (baodiMoney / m * 100).toFixed(2)
      }
    } else {
      if ((b + rengouMoney) < m) {
        if ((b / m) < 0.2) {
          if ((Math.ceil(m * 0.2) + rengouMoney) > m) {
            baodiMoney = m - rengouMoney
            baodiPercent = (baodiMoney / m * 100).toFixed(2)
          } else {
            baodiMoney = Math.ceil(m * 0.2);
            baodiPercent = (baodiMoney / m * 100).toFixed(2);
          }

        } else {
          baodiMoney = b
          baodiPercent = (baodiMoney / m * 100).toFixed(2)
        }
      } else {
        baodiMoney = m - rengouMoney
        baodiPercent = (baodiMoney / m * 100).toFixed(2)
      }
    }
  } else {
    if (box.find('.j-baodi-text')[0]) {
      box.find('.j-baodi-text')[0].disabled = true;
    }
    baodiMoney = 0
    baodiPercent = '0.00'
  }

  box.find('.j-rengou').val(rengouMoney);
  box.find('.br-select').val(ticheng);
  if (m === 0) {
    box.find('.j-rengou-percentage').html(0)
  } else {
    box.find('.j-rengou-percentage').html((rengouMoney / m * 100).toFixed(2));
  }

  //如果要保底 更新保底金额
  box.find('.j-baodi-text').val(baodiMoney)
  box.find('.j-baodi-percent').html(baodiPercent)
  box.find('.j-rengou-tip').html(rengouMoney)
  box.find('.j-baidi-tip').html(baodiMoney)
  box.find('.j-totalm-tip').html(rengouMoney + baodiMoney)
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
ZHUI.bindHeMaiEvent = function () {
  $('.j-rengou').on('change', function (event) {
    ZHUI.setHeMaiTotal(Config.box);
  });
  $('.br-select').on('change', function (event) {
    ZHUI.setHeMaiTotal(Config.box);
  });
  $('.j-baodi-check').on('change', function (event) {
    ZHUI.setHeMaiTotal(Config.box);
  });
  $('.j-baodi-text').on('change', function (event) {
    ZHUI.setHeMaiTotal(Config.box);
  });

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

  $('.br-textarea').on('focus', function (event) {
    inputOnfocus($(this));
  });

  $('.j-project-title').on('focus', function (event) {
    inputOnfocus($(this));
  });

  $('.br-textarea').on('blur', function (event) {
    inputOnblur($(this));
  });

  $('.j-project-title').on('blur', function (event) {
    inputOnblur($(this));
  });

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

  $('.br-textarea').on('keyup', function (event) {
    reSetStrsize($(this));
  });

  $('.j-project-title').on('keyup', function (event) {
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

  if (Config.box.find('#j-upload-sub')[0]) {
    MANUAL.setSdTotal();
    MANUAL.totalSdNums();
  }

  if (Config.box.find('#j-tuodan-sub')[0]) {
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