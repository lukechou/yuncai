require.config({
  paths: {
    jquery: '../lib/jquery',
    lodash: '../lib/lodash.compat.min',
    bootstrap: '../lib/bootstrap.min',
    store: '../lib/store.min',
    app: '../common/app',
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    },
  }
});

require(['jquery', 'lodash', 'store', 'app', 'bootstrap'], function ($, _, store, APP) {
  'use strict';

  var QUEUE = {};

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
  };

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
  };

  var K3 = (function () {

    var K3 = {
      lotyCnName: '快3',
      lotyName: $('#j-lotyName').val(),
      playType: 'b0',
      chooseMoney: 0,
      chooseZhushu: 0,
      buyArr: [],
      playName: {
        b0: '和值',
        b1: '三同号通选',
        b2: '三同号单选',
        b3: '三不同号',
        b4: '三连号通选',
        b5: '二同号复选',
        b6: '二同号单选',
        b7: '二不同号',
      },
      buyCodesType: {
        b0: 'HZ',
        b1: '3A',
        b2: '3B',
        b3: '3C',
        b4: '3D',
        b5: '2A',
        b6: '2B',
        b7: '2C',
      },
      beishu: 1,
      trackData: [],
      buyType: 1,
    };

    return K3;
  }());

  K3.reset = function () {

    var _this = this;

    _this.cleanNumBtn();
    _this.cleanBuyList();
    _this.buyArr = [];
    _this.chooseMoney = 0;
    _this.chooseZhushu = 0;
    _this.beishu = 1;

  };

  K3.updateBottomUi = function () {

    var _this = this;
    var m = 0;

    m = _this.getBuyArrTotalMoney();

    $('#buy_zhushu').html(m / 2);
    $('#project_price').html(_this.beishu * m);

    if (m > 0) {
      $('#buy-submit').removeAttr('disabled');
    } else {
      $('#buy-submit').attr('disabled', true);
    }

    _this.updateTrackList();

  };

  K3.createOneNote = function (o) {

    var _this = this;

    // 投注号码存储
    _this.saveNumsObj(o);

    var obj = {
      title: _this.playName[o.playType],
      nums: o.nums,
      money: o.money,
      zid: o.zid,
      num: ''
    };

    switch (_this.playType) {
    case 'b0':

      for (var i = 0; i < obj.nums.length; i++) {

        obj.num += '<span>' + obj.nums[i] + '</span>';

      };

      break;
    case 'b1':
      obj.num = '<span>三同号通选</span>';
      break;
    case 'b2':
      for (var i = 0; i < obj.nums.length; i++) {

        obj.num += '<span>' + obj.nums[i] + '</span>';

      };
      break;
    case 'b3':
      obj.num = '<span>' + o.nums + '</span>';
      break;
    case 'b4':
      obj.num = '<span>三连号通选</span>';
      break;
    case 'b5':
      obj.num = '<span>' + o.nums + '</span>';
      break;
    case 'b6':
      obj.num = '<span>' + o.nums + '</span>';
      break;
    case 'b7':
      for (var i = 0; i < obj.nums.length; i++) {

        obj.num += '<span>' + obj.nums[i] + '</span>';

      };
      break;
    default:
      break;
    }

    var compiled = _.template('<div data-zid="<%= zid%>" class="br-zhu-item clearfix"><b>[<%= title%>]</b><div class="list"><%= num%></div><div class="pull-right"><b><i class="money"><%= money%></i>元</b><a href="javascript:;" class="br-zhu-del">删除</a></div></div>');

    var html = compiled(obj);

    $('#code_list').append(html);

    // 更新底部金额部分
    _this.updateBottomUi();
  };

  K3.createHzAsBtn = function () {
    $('.j-as-btn.active').removeClass('active');
  };

  // 随机添加 N 注
  K3.addManyItem = function (count) {

    var _this = this;

    if (_.isNumber(count) && count > 0) {

      for (var i = 0; i < count; i++) {

        _this.createOneItem();

      };

    } else {
      return;
    }

  };

  K3.createOneItem = function () {

    var _this = this;

    var nums = [];
    var obj = null;
    var s = [];

    var a = {
      'b0': [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
      'b1': ['3A'],
      'b2': ['111', '222', '333', '444', '555', '666'],
      'b3': ['1', '2', '3', '4', '5', '6'],
      'b4': ['3D'],
      'b5': ['11*', '22*', '33*', '44*', '55*', '66*'],
      'b6': ['1', '2', '3', '4', '5', '6'],
      'b7': ['1', '2', '3', '4', '5', '6'],
    };

    switch (_this.playType) {

    case 'b3':
      s = _.sample(a[_this.playType], 3);
      break;
    case 'b6':
      s = _.sample(a[_this.playType], 2);
      s = s[0] + s[0] + '#' + s[1];
      break;
    case 'b7':
      s = _.sample(a[_this.playType], 2);
      break;
    default:
      s = _.sample(a[_this.playType], 1);
      break;

    }

    if (_.isArray(s)) {
      nums = s;
    } else {
      nums.push(s);
    };

    obj = {
      zid: _.uniqueId(),
      nums: nums,
      money: 2,
      playType: _this.playType,
    };

    _this.createOneNote(obj);

  };

  K3.getObj = function () {
    var _this = this;

    var activeNumEl = $('#j-area-' + _this.playType + ' .j-num-btn.active');
    var arr = [];

    var obj = {
      zid: _.uniqueId(),
      nums: null,
      money: null,
      playType: _this.playType,
    };

    // 获取投注号码
    activeNumEl.each(function (index, el) {
      arr.push($(this).attr('data-num'));
    });

    if (_this.playType === 'b6') {

      var b6Row = {
        e: [],
        f: []
      };

      $('#j-area-' + _this.playType + ' .j-num-btn.active').each(function (index, el) {

        var n = $(this).attr('data-num');

        if (n.length === 1) {
          b6Row.e.push(n);
        }

        if (n.length === 2) {
          b6Row.f.push(n);
        }

      });

      arr = [b6Row.f.join(',') + '#' + b6Row.e.join(',')];
    }

    obj.nums = arr;
    obj.money = _this.chooseMoney;

    return obj;
  };

  K3.getChooseToBuy = function () {

    var _this = this;

    var obj = _this.getObj();

    // 创建投注html并插入buybox
    _this.createOneNote(obj);

    // 清楚选中区选中状态
    _this.cleanNumBtn();

    if (_this.playType === 'b0') {
      _this.createHzAsBtn();
    }

  };

  // 保存投注号码信息
  // obj.nums  投注号码
  // obj.money 投注号码金额
  // obj.playType  投注玩法类型
  K3.saveNumsObj = function (obj) {

    var _this = this;

    if (!_.isArray(_this.buyArr)) {
      _this.buyArr = [];
    }

    _this.buyArr.push({
      zid: obj.zid,
      nums: obj.nums,
      money: obj.money,
      playType: obj.playType
    });

  };

  K3.cleanBuyList = function () {

    var _this = this;

    _this.buyArr = [];
    $('#code_list').html('');
    _this.updateBottomUi();

  };

  K3.updateChooseToBuyBtn = function () {

    var _this = this;
    var c = 'active';

    if (_this.chooseMoney > 0) {
      $('#choose_to_buy').addClass(c).removeAttr('disabled');
    } else {
      $('#choose_to_buy').removeClass(c);
    }
  };

  K3.setChooseParams = function () {

    var _this = this;

    var l = $('#j-area-' + _this.playType + ' .j-num-btn.active').length;
    var q = null;
    var b6Row = null;

    switch (_this.playType) {
    case 'b3':
      q = QUEUE.getACTotalNum(l, 3, 'C');
      _this.chooseZhushu = q;
      _this.chooseMoney = q * 2;
      break;
    case 'b6':

      b6Row = {
        e: [],
        f: []
      };

      $('#j-area-' + _this.playType + ' .j-num-btn.active').each(function (index, el) {

        var n = $(this).attr('data-num');

        if (n.length === 1) {
          b6Row.e.push(n);
        }

        if (n.length === 2) {
          b6Row.f.push(n);
        }

      });

      q = b6Row.e.length * b6Row.f.length;
      _this.chooseZhushu = q;
      _this.chooseMoney = q * 2;

      break;
    case 'b7':
      q = QUEUE.getACTotalNum(l, 2, 'C');
      _this.chooseZhushu = q;
      _this.chooseMoney = q * 2;
      break;
    default:
      _this.chooseZhushu = l;
      _this.chooseMoney = l * 2;
      break;
    }

  };

  K3.updateMidTotal = function () {

    var _this = this;

    _this.setChooseParams();

    $('#choose_zhushu').html(_this.chooseZhushu);
    $('#choose_money').html(_this.chooseMoney);

    _this.updateChooseToBuyBtn();

  };

  K3.cleanNumBtn = function () {

    var _this = this;
    _this.chooseMoney = 0;
    _this.chooseZhushu = 0;

    $('#j-area-' + _this.playType + ' .j-num-btn').removeClass('active');
    _this.updateMidTotal();
  };

  K3.updateHzBallList = function (r) {

    var _this = this;

    var a = [
      [0, 1, 2, 3, 4, 5, 6],
      [1, 3, 5, 7, 9, 11, 13],
      [0, 2, 4, 6, 8, 10, 12],
      [7, 8, 9, 10, 11, 12, 13]
    ];
    var n = null;
    var l = $('#j-area-' + _this.playType + ' .j-num-btn');
    var c = 'active';

    switch (r.length) {

    case 1:
      n = a[r];
      break;

    case 2:
      n = _.intersection(a[r[0]], a[r[1]]);
      break;

    default:
      break;

    }

    if (n) {

      _this.cleanNumBtn();

      for (var i = 0; i < n.length; i++) {
        l.eq(n[i]).addClass(c);
      };

      _this.updateMidTotal();

    }

  };

  K3.removeBuyList = function (zid) {

    var _this = this;

    _.remove(_this.buyArr, function (i) {
      return i.zid == zid;
    });
    _this.updateBottomUi();
  };

  K3.togglePlayTab = function () {

    var _this = this;

    _this.cleanNumBtn();
    _this.cleanBuyList();
  };

  K3.getBuyArrTotalMoney = function () {
    var _this = this;
    var m = 0;

    for (var i = 0; i < _this.buyArr.length; i++) {
      m += ~~(_this.buyArr[i].money);
    };

    return m;
  };

  K3.buySuccess = function (data, obj, payMoney) {

    var _this = this;

    if (data.retCode == 100000) {

      store.set('lotyName', _this.lotyName);
      store.set('lotyCNName', _this.lotyCnName);
      store.set('payMoney', payMoney);
      store.set('projectNo', data.retData.projectNo);
      store.set('trackId', data.retData.trackId);

      window.location.href = '/html/lottery/trade/success.html';

    } else {

      APP.handRetCode(data.retCode, data.retMsg);

    }
  };

  K3.enoughMoneyCb = function (url, obj, payMoney) {

    var _this = this;

    $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        data: obj,
      })
      .done(function (data) {
        _this.buySuccess(data, obj, payMoney);
      });

  };

  K3.getCodes = function () {

    var _this = this;
    var codes = [];
    var result = '';
    var bArr = [];

    for (var i = 0; i < _this.buyArr.length; i++) {

      codes.push(_this.buyCodesType[_this.playType] + '|' + _this.buyArr[i].nums.join(','));

      bArr = bArr.concat(_this.buyArr[i].nums);
    };

    if (_this.playType == 'b2') {

      codes = [];

      for (var i = 0; i < bArr.length; i++) {

        codes.push(_this.buyCodesType[_this.playType] + '|' + bArr[i]);

      };

    }

    result = codes.join('$');

    return result;

  };

  K3.buyLoty = function () {

    var _this = this;
    var url = '';
    var obj = {};
    var m = _this.getBuyArrTotalMoney();
    var t = _this.playName[_this.playType];
    var text = '';
    var payMoney = 0;
    var buyTypeUrlStr = 'buy-self';
    var endminmoney = 0;

    obj.zhushu = m / 2;
    obj.beishu = _this.beishu;
    obj.unikey = $.now();
    obj.codes = _this.getCodes();

    text += '<div class="frbox"><img src="http://static3.yuncai.com/front_images/fail.png" alt="success" class="icon"><div class="text">';

    // 购买类型判断 1-自购，2-追号
    if (_this.buyType == 1) {

      obj.qihaoId = _.escape($('#qihaoId').val());
      obj.qihao = _.escape($('#qihao').val());
      payMoney = m * obj.beishu;

      text += '<p>' + _this.lotyCnName + ' 第<span>' + obj.qihao + '</span>期</p>';
      text += '<p>共<span>' + obj.zhushu + '</span>注, 投注<span>' + obj.beishu + '</span>倍</p>';
      text += '<p>本次需支付<span class="fc-3">' + payMoney + '.00</span>元</p></div>';

    } else if (_this.buyType == 2) {

      endminmoney = $('#is_end_zhongjiang')[0].checked ? 1 : 0;

      buyTypeUrlStr = 'buy-track';

      obj.zhuihaoqihao = [];

      for (var i = 0, length1 = _this.trackData.length; i < length1; i++) {
        obj.zhuihaoqihao.push(_this.trackData[i].tid + '|' + _this.trackData[i].qi + '|' + _this.trackData[i].bs);
      }

      obj.endminmoney = endminmoney;
      payMoney = _this.getTrackTotalMoney(_this.getBuyArrTotalMoney());

      text += '<p>追号<span>' + _this.trackData.length + '</span>期</p><p>本次需支付<span class="fc-3">' + payMoney + '</span>元</p></div>';
    } else {

      return;

    }

    url = '/lottery/kuaipin/' + buyTypeUrlStr + '/' + _this.lotyName + '/' + _this.buyCodesType[_this.playType];

    APP.checkLogin(payMoney, {

      enoughMoney: function () {

        APP.showTips({
          text: text,
          title: '投注确认',
          type: 2,
          onConfirm: function () {
            _this.enoughMoneyCb(url, obj, payMoney);
          }
        });
      }

    });

  };

  K3.onToggleBuyType = function (type) {

    var _this = this;

    _this.buyType = type;
    _this.beishu = 1;
    $('#project_mutiple').val(1);
    _this.updateBottomUi();

  };

  K3.updateTrackList = function () {

    var _this = this;

    _this.trackData = [];

    var tid = null;
    var bs = null;
    var qi = null;
    var m = 0;

    // 更新 trackData
    $('.br-zhui').find('tbody .br-zhui-c').each(function (index, el) {

      tid = $(this).attr('data-qihaoid');
      bs = ~~$(this).parents('tr').find('.br-zhui-bei').val();
      qi = $(this).attr('data-qi');

      if (el.checked) {

        _this.trackData.push({
          tid: tid,
          bs: bs,
          qi: qi
        });

      }

    });

    var o = _this.getBuyArrTotalMoney();
    m = _this.getTrackTotalMoney(o);

    $('.br-zhui tbody .j-money').html(o);

    // update ui
    $('#track_issue_num').html(_this.trackData.length);
    $('#track_money').html(m);

  };

  K3.getTrackTotalMoney = function (o) {
    var _this = this;

    var r = 0;

    for (var i = 0; i < _this.trackData.length; i++) {

      r += o * _this.trackData[i].bs;

    };

    return r;

  };

  function filterTrackNum(val) {

    var v = val ? val : 1;

    if (isNaN(val) || val < 1) {
      val = 1;
    } else {
      val = Math.ceil(val);
      (val > 9999) && (val = 9999);
    }

    return v;
  };

  // 追号总期的期数改变
  $('.br-details').on('change', 'tbody .br-zhui-c', function (event) {
    event.preventDefault();

    K3.updateTrackList();

  });

  // 追号总期的倍数改变
  $('.br-details thead .br-zhui-bei').on('change', function (event) {

    var val = parseInt($(this).val()) || 1;

    val = filterTrackNum(val);

    $(this).val(val);

    $('.br-details tbody .br-zhui-bei').val(val);

    K3.updateTrackList();

  });

  // 追号每期的倍数改变
  $('.br-details tbody').on('change', '.br-zhui-bei', function (event) {

    var val = parseInt($(this).val()) || 1;

    val = filterTrackNum(val);

    $(this).val(val);

    K3.updateTrackList();

  });

  // buy Loty
  $('#buy-submit').on('click', function (event) {
    event.preventDefault();

    K3.buyLoty();

  });

  $('#issue_size').on('change', function (event) {
    event.preventDefault();

    var v = ~~$(this).val();
    queryTrackIssueList(v);

  });

  $('#increase_mutiple').on('click', function (event) {

    var m = $('#project_mutiple');
    var u = m.val();
    var v = calculateBeishu(u, 1);

    updateBeishu(v);

  });

  $('#decrease_mutiple').on('click', function (event) {

    var m = $('#project_mutiple');
    var u = m.val();
    var v = calculateBeishu(u, 0);

    updateBeishu(v);

  });

  $('#project_mutiple').on('keyup,change', function (event) {

    var t = $(this);
    var r = t.attr('data-r');
    var v = filterNum(t.val());
    v = v || 1;

    updateBeishu(v);

  });

  // 随机添加注数
  $('#j-box-left').on('click', '.j-zhu-adds', function (event) {
    event.preventDefault();
    var c = ~~($(this).attr('data-zhu'));
    K3.addManyItem(c);
  });

  // del buy box list
  $('#j-box-left').on('click', '.br-zhu-del', function (event) {
    event.preventDefault();

    var p = $(this).parents('.br-zhu-item');
    var zid = Number(p.attr('data-zid'));
    K3.removeBuyList(zid);
    p.remove();

  });

  // Toggle PlayTypeBox
  $('#j-nav').on('click', 'li', function (event) {
    event.preventDefault();

    var t = $(this);
    var type = t.attr('data-playtype');

    // toggle nav active
    $('#j-nav li').removeClass('active');
    t.addClass('active');

    $('.box-choose').removeClass('active');
    $('.j-choose-' + type).addClass('active');

    K3.playType = type;
    K3.togglePlayTab();

  });

  // choose Num
  $('#j-box-left').on('click', '.j-num-btn', function (event) {
    event.preventDefault();

    $(this).toggleClass('active');

    // b6-不同号复选控制
    if (K3.playType === 'b6') {

      var v = $(this).attr('data-num');
      var el = null;

      if (v.length === 1) {

        el = $('#j-area-' + K3.playType + ' .j-num-btn[data-num=' + v + v + ']');

      } else {

        el = $('#j-area-' + K3.playType + ' .j-num-btn[data-num=' + v.charAt(0) + ']');

      }

      if (el.hasClass('active')) {

        el.removeClass('active');

      }

    }

    K3.updateMidTotal();

  });

  // Choose to BuyBox
  $('#choose_to_buy').on('click', function (event) {
    event.preventDefault();

    if ($(this).hasClass('active')) {
      K3.getChooseToBuy();
    } else {
      return;
    }

  });

  $('#clean_buy_code').on('click', function (event) {
    event.preventDefault();
    K3.cleanBuyList();
  });

  // chooseMany Num
  $('#j-box-left').on('click', '.j-as-btn', function (event) {
    event.preventDefault();
    /* Act on the event */

    var t = $(this);
    var b = $('.j-as-btn');
    var xt = Number(t.attr('data-xt'));
    var xn = '';
    var c = 'active';
    var r = [];

    // toggle Button
    switch (xt) {
    case 0:
      xn = 3;
      break;
    case 1:
      xn = 2;
      break;
    case 2:
      xn = 1;
      break;
    case 3:
      xn = 0;
      break;
    default:
      break;
    }

    if (t.hasClass(c)) {

      t.removeClass(c);

    } else {

      t.addClass(c);

      if (b.eq(xn).hasClass(c)) {

        b.eq(xn).removeClass(c);

      }

    }

    // get active button
    $('.j-as-btn.' + c).each(function (index, el) {
      r.push(~~$(this).attr('data-xt'));
    });

    if (r.length) {
      K3.updateHzBallList(r);
    } else {
      K3.cleanNumBtn();
    }

  });

  /**
   * 切换购买方式
   */

  $('#buy_type').on('click', 'li', function (event) {
    event.preventDefault();

    $('#buy_type li .icon').removeClass('icon-y2');
    $(this).find('.icon').addClass('icon-y2');

    var t = ~~$(this).find('a').attr('data-buytype');

    K3.onToggleBuyType(t);

    switch (t) {
    case 1: // 自购

      $('#track_desc').addClass('hide');

      break;

    case 2: // 追号

      $('#buy_mutiple_span').hide();
      $('#track_desc').removeClass('hide');
      queryTrackIssueList(10);

      break;
    }

  });

  // toggle buyLoty Tips Box
  $('#j-touzhu-tips').on('click', function (event) {

    $('#j-touzhu-tipstext').toggle();
    $(this).find('.icon').toggleClass('icon-bup').toggleClass('icon-bdown');

  });

  function filterNum(v) {

    if (v === '') {
      return v;
    }

    var n = parseInt(v, 10);

    if (isNaN(n)) {
      n = 1;
    } else {
      n = (n >= 1) ? n : 1;
      n = n;
    }
    n = n > 99999 ? 99999 : n;
    return n;
  };

  function calculateBeishu(n, c) {

    var v = parseInt(n, 10);

    if (c == 1) {
      v++;
    } else {
      v--;
    }

    v = (v >= 1) ? v : 1;
    v = v > 99999 ? 99999 : v;

    return v;

  };

  function updateBeishu(v) {

    var m = $('#project_mutiple');

    K3.beishu = v;
    m.val(v);
    K3.updateBottomUi();

  }

  /**
   * 读取追号期号集合
   */
  function queryTrackIssueList(num) {

    var html = '';
    var lotyId = $('#j-track-lotyid').val();

    html = '<tr><td colspan="5">系统繁忙， 请稍候再试</td></tr>';

    $('.br-details thead .br-zhui-bei').val(1);

    $.ajax({
      url: '/lottery/issue/get-issue-list?lottery_id=' + lotyId + '&issue_size=' + num,
      type: 'GET',
      dataType: 'json',
    }).done(function (data) {

      var item = data.retData;

      if (data.retCode == 100000) {

        if (_.isArray(item) && item.length) {
          html = '';
        }

        for (var i = 0; i < item.length; i++) {

          var m = i + 1;

          var unitPrice = K3.getBuyArrTotalMoney();

          html += '<tr><td>' + m + '</td><td><input type="checkbox" class="br-zhui-c" data-qihaoid="' + item[i][0] + '"data-qi="' + item[i][1] + '" checked="">' + item[i][1] + '期</td><td><input type="text" class="br-input br-zhui-bei" value="1">倍</td><td><span class="j-money">' + unitPrice + '</span>元</td><td><span class="ml15">' + item[i][2] + '</span></td></tr>';
        }

      }

      $('#track_issue_list').html(html);
      K3.updateTrackList();

    }).fail(function () {

      $('#track_issue_list').html(html);
      K3.updateTrackList();

    });

  };

});