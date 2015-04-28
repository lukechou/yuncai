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

    /**
     * lotyCnName  彩种中文名
     * qihaoId  期号ID
     * qihao  期号
     * lotyName  彩种类型
     * lotyId  彩种Id-追号#依赖
     * playType  玩法类型: b0,b1,b2,b3,b4,b5,b6,b7
     * chooseMoney  选择号码金额
     * chooseZhushu  选择号码组合注数
     * buyArr  购买数组
     * playName  玩法中文名字
     * buyCodesType  组成购买参数时彩种对应参数头
     * beishu  购买倍数
     * trackData  选中的追号数据
     * buyType  购买类型 1-自购 2-合买
     * runTimer 当前期倒计时循环函数
     * kjStatus  开奖状态 0-页面初始化 1-已开奖 2-开奖中 3-开奖倒计时 4-等待开售
     *
     */
    var K3 = {
      lotyCnName: _.escape($('#j-lotyCnName').val()),
      qihaoId: _.escape($('#qihaoId').val()),
      qihao: _.escape($('#qihao').val()),
      lotyName: $('#j-lotyName').val(),
      lotyId: $('#j-track-lotyid').val(),
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
      runTimer: null,
      kjStatus: 0,
      currentKjStatus: null,
      runWaitTimer: null,
      waitEndTime: 0,
      waitStartTime: 0,
      alertQihao: null,
      waitSell: false,
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

  // 随机添加 N 注
  K3.addManyItem = function (count) {

    var _this = this;

    if (_.isNumber(count) && count > 0) {

      if ((_this.buyArr.length + count) > 100) {
        APP.showTips('您的投注号码多于100行，请返回重新选择');
        return;
      }

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
      s = _.sample(a[_this.playType], 3).sort(function (a, b) {
        return a - b;
      });
      break;
    case 'b6':
      s = _.sample(a[_this.playType], 2);
      s = s[0] + s[0] + '#' + s[1];
      break;
    case 'b7':
      s = _.sample(a[_this.playType], 2).sort(function (a, b) {
        return a - b;
      });
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

      obj.qihaoId = _this.qihaoId;
      obj.qihao = _this.qihao;
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
    var o = _this.getBuyArrTotalMoney();

    // 更新 trackData
    $('#track_issue_list').find('.br-zhui-c').each(function (index, el) {

      var t = $(this);
      tid = t.attr('data-qihaoid');
      bs = ~~t.parents('tr').find('.br-zhui-bei').val();
      qi = t.attr('data-qi');

      if (el.checked) {

        _this.trackData.push({
          tid: tid,
          bs: bs,
          qi: qi
        });

      }

      t.parents('tr').find('.j-money').html(o * bs);

    });

    m = _this.getTrackTotalMoney(o);

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

  // 追号总期的期数改变
  $('.br-details').on('change', 'thead .br-zhui-c', function (event) {
    event.preventDefault();

    if ($(this)[0].checked) {
      $('#track_issue_list .br-zhui-c').each(function (index, el) {
        $(this)[0].checked = true;
      });
    } else {
      $('#track_issue_list .br-zhui-c').removeAttr('checked');
    }

    K3.updateTrackList();

  });

  // 追号总期的倍数改变
  $('.br-details').on('change', 'thead .br-zhui-bei', function (event) {

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

    if (!$('.j-sub-agreed')[0].checked) {
      APP.showTips('请先阅读并同意《委托投注规则》后才能继续');
      return;
    } else if (K3.buyType === 2 && K3.trackData.length === 0) {
      APP.showTips('追号最少购买一期');
    } else {
      K3.buyLoty();
    }

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

    if (K3.buyArr.length >= 100) {
      APP.showTips('您的投注号码多于100行，请返回重新选择');
      return;
    }

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

  /**
   * 切换购买方式
   */

  $('#buy_type').on('click', 'li', function (event) {
    event.preventDefault();

    var me = $(this);
    $('#buy_type li .icon').removeClass('icon-y2');
    me.find('.icon').addClass('icon-y2');

    var a = me.find('a');
    var t = ~~a.attr('data-buytype');
    var l = a.attr('href');

    $('#buy_type').siblings('.tab-content').find('.tab-pane').removeClass('active');
    $(l).addClass('active');

    K3.onToggleBuyType(t);

    switch (t) {
    case 1:

      $('#track_desc').addClass('hide');
      $('#buy_mutiple_span').show();
      break;

    case 2:

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

  $('#j-kj-box').on('click', '.third-more', function (event) {
    event.preventDefault();
    showTodayNum();

    var top = $('#j-todaynum-table').offset().top;

    $("html, body").animate({
      scrollTop: top + 'px'
    }, 300);

  });

  $('#j-award-more').on('click', function (event) {
    event.preventDefault();
    if ($('#j-todaynum-table').hasClass('hide')) {
      showTodayNum();
    } else {
      hideTodayNum();
    }

  });

  function showTodayNum() {
    $('#j-award-more b').html('收起');
    $('#j-todaynum-table').removeClass('hide');
  }

  function hideTodayNum() {
    $('#j-award-more b').html('展开');
    $('#j-todaynum-table').addClass('hide');
  }

  pageInit();

  function pageInit() {

    var t = 10;

    getAllAwardRecord(); // 最新所有开奖公告
    loadNewestAward(); //最新中奖信息
    loadLastIssueList(); //最新中奖列表
    loadCurrentIssue(); //获取当前期
    K3.statu = 1;

    setInterval(function () {

      getAllAwardRecord();
      loadNewestAward();
      loadLastIssueList();

    }, t * 1000);

  }

  // 最新所有开奖公告
  function getAllAwardRecord() {

    var url = '/lottery/award/kuaipin/' + K3.lotyName;
    var tbody = $('#j-todaynum-table tbody');

    var tbodyQihao = tbody.attr('data-qihao');

    if (tbodyQihao && tbodyQihao === K3.qihao) {
      return;
    } else {

      $.ajax({
          url: url,
          type: 'GET',
          dataType: 'json',
          data: {
            t: 'ajx'
          },
        })
        .done(function (data) {

          var q = K3.qihao.slice(0, K3.qihao.length - 2);
          var max = ~~$('#j-maxqishu').val();

          var maxLen = 84;
          var groupIndex = 21;
          var a = [];
          var j = '';
          var dt = null;
          var html = '';
          var f = '';

          for (var i = 0; i < groupIndex; i++) {
            a.push([]);
          };

          for (var i = 1; i <= maxLen; i++) {

            dt = null;

            j = (i < 10) ? ('0' + i) : i;

            if (data[q + j]) {

              dt = data[q + j];
              dt.index = j;

            } else {

              dt = {
                index: j
              };

            }

            if (a[i % groupIndex]) {

              a[i % groupIndex].push(dt);

            } else {

              a[i % groupIndex] = [];
              a[i % groupIndex].push(dt);

            }

          }

          a[a.length] = a[0];

          for (var i = 1, len = a.length; i < len; i++) {

            html += '<tr>';

            for (var j = 0; j < a[i].length; j++) {

              f = a[i][j];

              html += '<td class="period">' + f.index + '</td>';

              if (f.code_str) {

                html += '<td class="awardTd">' + f.code_str + '</td>';

              } else {

                html += '<td>- -</td>';

              }

              if (f.hz_val) {

                html += '<td>' + f.hz_val + '</td>';

              } else {

                html += '<td></td>';

              }

              if (f.shape) {

                html += '<td>' + f.shape + '</td>';

              } else {

                html += '<td></td>';

              }

            };

            html += '</tr>';

          };

          tbody.html(html);
          tbody.attr('data-qihao', K3.qihao);

        });
    }

  }

  //  最新中奖信息
  function loadNewestAward() {

    $.ajax({
        url: '/lottery/issue/get-last-award-info',
        type: 'GET',
        dataType: 'json',
        data: {
          lotteryId: K3.lotyId
        }
      })
      .done(function (data) {

        if (data.retCode === 100000) {
          var html = '';
          for (var int = 0; int < data.retData.length; int++) {
            if (int > 5) break;
            html += "<tr>";
            html += "<td>" + data.retData[int].username + "</td>";
            html += "<td>" + data.retData[int].bonus_before_tax + "</td>";
            html += "</tr>";
          }
          $('#j-new-bonus-list').html((html == '') ? '<tr><td colspan="2">暂无相关中奖纪录</td></tr>' : html);
        } else {
          $('#j-new-bonus-list').html('<tr><td colspan="2">系统繁忙</td></tr>');
        }

      });
  }

  // 获取当前期参数
  function loadCurrentIssue() {

    var v = $('#issue_size').val();
    queryTrackIssueList(v);

    $.ajax({
        url: '/lottery/issue/get-cur-issue',
        type: 'GET',
        dataType: 'json',
        data: {
          lottery_id: K3.lotyId
        }
      })
      .done(function (data) {

        var item = data.retData[0];
        var lessSeconds = '';
        var stopSale = '';
        var max = ~~$('#j-maxqishu').val() || 100;
        var q = '';
        return;
        if (data.retCode === 100000) {

          stopSale = (0 === parseInt(item.sell_status, 10));

          // 判断是否停售
          if (stopSale) {

            APP.showStopSellModal(K3.lotyCnName);

            $('#buy-submit').html('暂停销售').removeClass('btn-red').addClass('btn-stop').attr('id', '');

            $('#j-less-seconds').html('<i class="icon icon-k302">--</i><i class="icon icon-k302">--</i>');

            return;

          }

          lessSeconds = Math.floor((item.company_sell_etime - item.sys_time));


          // update k3 qihao
          K3.qihao = item.issue_num;
          K3.qihaoId = item.id;
          q = (~~K3.qihao.slice(K3.qihao.length - 2)) - 1;

          $('#j-sell-qi').html(q);
          $('#j-less-qi').html(max - q);

          // 小于0 等待开售中
          if (lessSeconds < 0) {

            $('#j-second-hd').addClass('out')
            $('#j-less-seconds').html('<h6>等待开售中..</h6>');

            K3.waitSell = true;

            loadLastIssueList();

            // 10秒后 再次请求最新当前期
            callCurrentIssueNext(10);

          } else {

            timer(lessSeconds);

            K3.waitSell = false;

            // update mid area
            $('#j-second-hd').removeClass('out')
            $('#j-dq-qihao').html(K3.qihao);

          }

        }

      }).fail(function () {
        callCurrentIssueNext(10);
      });

  }

  // 获取最新期数列表，更新右侧开奖信息，开奖公告
  function loadLastIssueList() {

    $.ajax({
        url: '/lottery/issue/kuaipin/last-issue-n',
        type: 'GET',
        dataType: 'json',
        data: {
          loty_name: K3.lotyName,
          issue_num: 10
        }
      })
      .done(function (data) {

        var item = data.retData;
        var html = '';
        var html2 = '';
        var kjhmHtml = '';
        var kjHTML = '等待开奖';
        var arrKJHM = '';
        var lastData = item[0];
        var type = null;
        var lessTime = 0;

        if (data.retCode == 100000) {

          for (var i = 0, len = item.length; i < len; i++) {

            kjhmHtml = ('' == item[i]['kjhm']) ? '等待开奖' : '<span class="fc-3">' + item[i]['kjhm'] + '</span>';

            html += '<tr><td>' + item[i]['no'] + '期</td><td>' + kjhmHtml + '</td></tr>';

          };

          $('#j-last-issue-n').html(html);

          if (lastData['kjhm'] != '') {

            kjHTML = '';
            arrKJHM = lastData['kjhm'].split(' ');

            for (var i = 0, len = arrKJHM.length; i < len; i++) {
              kjHTML += '<span class="bg-3">' + arrKJHM[i] + '</span>';
            }

            html2 = '<p>' + K3.lotyCnName + ' 第<span class="fc-3 mlr5">' + lastData['no'] + '</span>期<span>开奖</span></p><p class="sub-content-num">' + kjHTML + '</p>';

          } else {
            html2 = '<p>' + K3.lotyCnName + ' 第<span class="fc-3 mlr5">' + lastData['no'] + '</span>期<span>开奖</span></p><p class="sub-content-num">' + kjHTML + '</p>';
          }

          $('#j-sub-content').html(html2);

          // 开奖状态判断
          if (lastData.kj_time <= lastData.server_time) {

            if (arrKJHM) {
              // 已开奖
              K3.currentKjStatus = 1;
            } else {
              // 开奖中
              K3.currentKjStatus = 2;
            }

            if (K3.waitSell) {
              // 等待开售
              K3.currentKjStatus = 4;
            }

          } else {
            // 倒计时
            K3.currentKjStatus = 3;
            lessTime = lastData.kj_time - lastData.server_time;
          }

          if (K3.kjStatus !== K3.currentKjStatus || K3.currentKjStatus === 4) {

            toggleKjbox({
              nums: arrKJHM,
              no: lastData['no'],
              lessTime: lessTime,
              item: item
            });

            K3.kjStatus = K3.currentKjStatus;

          }

        }
      });
  }

  function getNumsHz(nums) {

    var h = 0;

    if (nums && nums.length > 0) {

      for (var i = 0; i < nums.length; i++) {
        h += ~~(nums[i]);
      };

    } else {
      h = null;
    }

    return h;

  }

  function toggleKjbox(obj) {

    var hz = 0;
    var o = {};
    var xt = '';
    var html = '';
    var f = '';
    var beforeQi = null;

    if (!obj) {
      return;
    }

    if (!K3.currentKjStatus) {
      K3.currentKjStatus = 1;
    }

    hz = getNumsHz(obj.nums);
    xt = getNumsXt(obj.nums);

    o = {
      qihao: obj.no,
      nums: obj.nums,
      xt: xt,
      hz: hz
    };

    // 已开奖
    if (K3.currentKjStatus === 1) {

      html = _.template('<p class="third-hd"><b>第<span class="mlr5"><%= qihao%></span>开奖号码：<% _.forEach(nums, function(num) { %><span class="fc-3 mlr5"><%- num %></span><% }); %></b>形态：<%= xt%></p><div class="third-box clearfix"><ul class="pull-left third-hisnum"><% _.forEach(nums, function(num) { %><li ><%- num %></li><% }); %></ul><div class="pull-right third-histext"><h5><%= hz%></h5><span>和值</span></div></div><a href="javascript:;" class="third-more">更多开奖号码</a>');

      $('#j-kj-box').html(html(o));
      return;

    }

    // 开奖中
    if (K3.currentKjStatus === 2) {

      var rf = '<div class="num-group"><span class="num-1"></span><span class="num-2"></span><span class="num-3"></span><span class="num-4"></span><span class="num-5"></span><span class="num-6"></span></div>';

      html = _.template('<p class="third-hd"><b>第<span class="mlr5"><%= qihao%></span>开奖号码：</b><% _.forEach(nums, function(num) { %><span class="fc-3 mlr5"><%- num %></span><% }); %></p><div class="third-box clearfix"><ul class="pull-left third-hisnum" id="j-kjing-num"><li>' + rf + '</li><li>' + rf + '</li><li>' + rf + '</li></ul><div class="pull-right third-histext"><span class="third-kjing">开奖中</span></div></div><a href="javascript:;" class="third-more">更多开奖号码</a>');

      $('#j-kj-box').html(html(o));
      runNumsAnimate();
      return;
    }

    // 倒计时
    if (K3.currentKjStatus === 3) {

      beforeQi = obj.item[1];
      obj.nums = beforeQi.kjhm;
      hz = getNumsHz(obj.nums);
      xt = getNumsXt(obj.nums);

      o.hz = hz;
      o.xt = xt;
      o.nums = obj.nums;

      if (obj.nums) {
        f = '和值:</span> <b class="fc-3">' + o.hz + '</b>形态: ' + o.xt;
      } else {
        f = '<b class="fc-3">等待开奖</b>';
      }

      o.time = secondFormat(obj.lessTime).join(':');

      html = _.template('<p class="third-hd fs-12">第<span class="mlr5">' + beforeQi.no + '</span>期开奖号码：<% _.forEach(nums, function(num) { %><i class="mlr2 icon icon-k3num<%= num %>"></i><% }); %>' + f + '</p><div class="third-timer"><h5>第<b class="fc-3 mlr5"><%= qihao%></b>期等待开奖：</h5><p class="thired-timer-sp"><i class="icon icon-k303"></i><span id="j-wait-time"><%= time%></span></p><div class="progress"><div class="progress-box"><div class="progress-bar progress-bar-danger" id="progress-bar"><i class="before"></i><i class="after"></i><i class="mid mid-1"></i><i class="mid mid-2"></i><i class="mid mid-3"></i></div></div></div></div><a href="javascript:;" class="third-more">更多开奖号码</a>');

      K3.waitEndTime = obj.lessTime;
      K3.waitStartTime = obj.lessTime;

      runWaitTimeAnimate();
      $('#j-kj-box').html(html(o));
      return;
    }

    if (K3.currentKjStatus === 4) {

      beforeQi = obj.item[1];
      obj.nums = beforeQi.kjhm;
      hz = getNumsHz(obj.nums);
      xt = getNumsXt(obj.nums);

      o.hz = hz;
      o.xt = xt;
      o.nums = obj.nums;

      if (obj.nums) {
        f = '和值:</span> <b class="fc-3">' + o.hz + '</b>形态: ' + o.xt;
      } else {
        f = '<b class="fc-3">等待开奖</b>';
      }

      var d = '';
      var kjhmArr = obj.item[0].kjhm.split(' ');

      if (obj.item[0].kjhm) {

        for (var i = 0; i < kjhmArr.length; i++) {
          d += '<i class="mlr2 icon icon-k3num' + kjhmArr[i] + '"></i>';
        };

      } else {
        d = '等待开奖中..';
      }

      // 已开奖
      html = _.template('<p class="third-hd fs-12">第<span class="mlr5">' + beforeQi.no + '</span>期开奖号码：<% _.forEach(nums, function(num) { %><i class="mlr2 icon icon-k3num<%= num %>"></i><% }); %>' + f + '</p><div class="third-box clearfix"><p class="wait-p1">第<span class="fc-3 mlr5"><%= qihao%></span>期</p><p class="wait-p2 fs-yh">' + d + '</p></div><a href="javascript:;" class="third-more">更多开奖号码</a>');

      $('#j-kj-box').html(html(o));
      return;
    }

  }

  function runWaitTimeAnimate() {

    K3.runWaitTimer = setInterval(function () {

      K3.waitEndTime--;

      if (K3.waitEndTime > 0) {

        //时间数字
        $('#j-wait-time').html(secondFormat(K3.waitEndTime).join(':'));
        // 进度条
        $('.progress-bar').width((K3.waitEndTime / K3.waitStartTime) * 100 + '%');

      } else {

        // 清除倒计时, 获取最新期数列表
        clearInterval(K3.runWaitTimer);
        loadLastIssueList();

      }

    }, 1000);

  }

  function secondFormat(s) {

    var result = [];

    var h = ~~(s / 60 / 60)
    var f = ~~(s / 60 % 60);
    var m = s % 60;

    if (h < 10) {

      if (h <= 0) {
        h = null;
      } else {
        h = '0' + h;
      }
    }

    if (f < 10) {
      f = '0' + f;
    }

    if (m < 10) {

      m = '0' + m;
    }

    if (h) {
      result.push(h);
    }

    result.push(f, m);

    return result;
  }

  function updateTimer(s) {

    var h = secondFormat(s);

    var html = '';

    if (h.length === 3) {
      html = '<i class="icon icon-k302">' + h[0] + '</i><i class="icon icon-k302">' + h[1] + '</i></i><i class="icon icon-k302">' + h[2] + '</i>';
      $('#j-less-seconds').addClass('active').html(html);
    } else {
      html = '<i class="icon icon-k302">' + h[0] + '</i><i class="icon icon-k302">' + h[1] + '</i>';
      $('#j-less-seconds').removeClass('active').html(html);
    }

  }

  function timer(s) {

    s = s < 0 ? 0 : s;
    updateTimer(s);

    var now = ~~((new Date().getTime()) / 1000);
    var q = $('#j-dq-qihao').html();
    K3.nextTimer = now + s;

    K3.runTimer = setInterval(function () {

      var n = ~~((new Date().getTime()) / 1000);
      var j = K3.nextTimer - n;

      if (j > 0) {
        updateTimer(j);
      } else {

        updateTimer(0);

        if (K3.alertQihao !== q) {
          APP.showTips("您好，第 " + q + '期已截止，投注时请确认您选择的期号。');
          K3.alertQihao = q;
        }

        loadLastIssueList();

        if (K3.runTimer) {
          clearInterval(K3.runTimer);
        }

        loadCurrentIssue();

      }

    }, 1000);

  }

  function callCurrentIssueNext(t) {

    var time = null;

    if (t && _.isNumber(t) && t > 0) {
      time = 1000 * t;
    } else {
      time = 10000;
    }

    var f = setTimeout(function () {
      loadCurrentIssue();
    }, time);

  }

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

    html = '<tr><td colspan="5">系统繁忙， 请稍候再试</td></tr>';

    $('.br-details thead .br-zhui-bei').val(1);

    $.ajax({
      url: '/lottery/issue/get-issue-list?lottery_id=' + K3.lotyId + '&issue_size=' + num,
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

  function getNumsXt(nums) {

    var x = '';
    var h = 0;

    if (nums && nums.length > 0) {

      for (var i = 0; i < nums.length; i++) {
        h += ~~(nums[i]);
      };

      if (h % 2 === 0) {
        x += '<i class="icon icon-tips k3-bg4 mlr2">双</i>';
      } else {
        x += '<i class="icon icon-tips k3-bg3 mlr2">单</i>';
      }

      if (h > 10) {
        x += '<i class="icon icon-tips k3-bg1 mlr2">大</i>';
      } else {
        x += '<i class="icon icon-tips k3-bg2 mlr2">小</i>';
      }

    } else {

      x = null;

    }

    return x;
  }

  function runNumsAnimate() {

    //号码滚动动画
    var s = setInterval(function () {

      $('#j-kjing-num .num-group').each(function (index, el) {
        var g = $(this);

        g.animate({
            top: -69
          },
          100,
          function () {
            var h = g.find('span').first().clone();
            g.find('span').first().remove();
            g.css('top', 0).append(h);
          });

      });

    }, 100);

  }

});