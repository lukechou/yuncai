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

require(['jquery', 'lodash', 'store', 'app', 'bootstrap'], function($, _, store, APP) {
  'use strict';

  var QUEUE = {};

  // 计算阶乘的函数
  QUEUE.a = function(n) {
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
  QUEUE.getACTotalNum = function(n, m, type) {
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
  var GKL = (function() {

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
     * modifyId  要修改的号码-ID
     * modifyStatu  购彩状态 0-选号  1-修改
     *
     */
    var GKL = {
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
        b0: '选一数投',
        b1: '选一红投',
        b2: '任选二',
        b3: '任选三',
        b4: '任选四',
        b5: '任选五',
        b6: '选二连组',
        b7: '选三前组',
      },
      buyCodesType: {
        b0: 'F1',
        b1: 'A1',
        b2: 'R2',
        b3: 'R3',
        b4: 'R4',
        b5: 'R5',
        b6: 'B2',
        b7: 'B3',
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
      modifyId: null,
      modifyStatu: 0,
      showStopControl: true,
      G_CHOOSE: null
    };

    return GKL;
  }());

  GKL.updateYilou = function() {

    var _this = this;

    $.ajax({
        url: '/statistics/issue/yilou',
        type: 'get',
        dataType: 'json',
        data: {
          lottery_id: _this.lotyId,
          issue: _this.qihao
        },
      })
      .done(function(data) {

        if (data.retCode === 100000) {

          var map = {
            b0: 1,
            b1: 2,
            b2: 3,
            b3: 4,
            b4: 5,
            b5: 6,
            b6: 7,
            b7: 8,
          };

          if (data.retData[map[_this.playType]]) {
            var y = data.retData[map[_this.playType]].split('|');
            y = _.map(y, function(r) {
              return Number(r);
            });
            var maxYl = _.max(y);
            var h = null;

            for (var i = 0; i < y.length; i++) {

              if (y[i] === maxYl) {
                h = '<span class="fc-3">' + y[i] + '</span>';
              } else {
                h = y[i];
              }

              $('.j-choose-' + _this.playType + ' .j-yilou-num').eq(i).html(h);
            };

          }

        }

      });

  };

  GKL.runYilou = function() {

    var _this = this;

    setInterval(function() {
      _this.updateYilou();
    }, 10000);

  };

  GKL.updateYilou();
  GKL.runYilou();

  GKL.reset = function() {

    var _this = this;

    _this.cleanNumBtn();
    _this.cleanBuyList();
    _this.buyArr = [];
    _this.chooseMoney = 0;
    _this.chooseZhushu = 0;
    _this.beishu = 1;

  };

  GKL.updateBottomUi = function() {

    var _this = this;
    var m = 0;

    m = _this.getBuyArrTotalMoney();

    $('#buy_zhushu').html(m / 2);
    $('#project_price').html(_this.beishu * m);

    _this.updateTrackList();
    //updateCreatePartProjectParame();

  };

  GKL.setNameStr = function(nums) {

    var result = '';

    if (nums && _.isArray(nums)) {
      for (var i = 0; i < nums.length; i++) {

        result += '<span>' + nums[i] + '</span>';
      }
    }

    return result;
  };

  GKL.createOneNote = function(o, isJx) {

    var _this = this;

    // 投注号码存储
    _this.saveNumsObj(o);

    var numNameArr = null;
    var obj = {
      title: _this.playName[o.playType],
      nums: o.nums,
      money: o.money,
      zid: o.zid,
      num: ''
    };

    obj.num = _this.setNameStr(obj.nums);

    var compiled = null;
    var html = null;

    if (_this.modifyStatu === 1 && !isJx) {

      // 修改号码
      compiled = _.template('<b>[<%= title%>]</b><div class="list"><%= num%></div><div class="pull-right"><b><i class="money"><%= money%></i>元</b><a href="javascript:;" class="br-zhu-up">修改</a><a href="javascript:;" class="br-zhu-del">删除</a></div>');

      html = compiled(obj);

      $('#code_list').find('[data-zid=' + _this.modifyId + ']').html(html);

    } else {

      compiled = _.template('<div data-zid="<%= zid%>" class="br-zhu-item clearfix"><b>[<%= title%>]</b><div class="list"><%= num%></div><div class="pull-right"><b><i class="money"><%= money%></i>元</b><a href="javascript:;" class="br-zhu-up">修改</a><a href="javascript:;" class="br-zhu-del">删除</a></div></div>');

      html = compiled(obj);

      $('#code_list').append(html);

    }
    // 更新底部金额部分
    _this.updateBottomUi();

  };

  // 随机添加 N 注
  GKL.addManyItem = function(count) {

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

  GKL.createOneItem = function() {

    var _this = this;

    var nums = [];
    var obj = null;
    var s = [];
    var sampleConut = 1;

    var allNums = ['01', '02', '03', '04', '05', '06', '07', '08', '09', 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

    var a = {};

    var a = {
      'b0': allNums.slice(0, 18),
      'b1': allNums.slice(18),
      'b2': allNums,
      'b3': allNums,
      'b4': allNums,
      'b5': allNums,
      'b6': allNums,
      'b7': allNums,
    };

    switch (_this.playType) {

      case 'b2':
        sampleConut = 2;
        break;
      case 'b3':
        sampleConut = 3;
        break;
      case 'b4':
        sampleConut = 4;
        break;
      case 'b5':
        sampleConut = 5;
        break;
      case 'b6':
        sampleConut = 2;
        break;
      case 'b7':
        sampleConut = 3;
        break;
      default:
        break;

    }

    if (a[_this.playType]) {

      s = _.sample(a[_this.playType], sampleConut).sort(function(a, b) {
        return a - b;
      });

    } else {
      return;
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

    _this.createOneNote(obj, true);

  };

  GKL.getObj = function() {
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
    activeNumEl.each(function(index, el) {
      arr.push($(this).attr('data-num'));
    });

    obj.nums = arr;
    obj.money = _this.chooseMoney;
    GKL.G_CHOOSE = obj;
    return obj;
  };

  GKL.updateBuyArr = function() {

    var _this = this;

    var obj = _this.getObj();

    //移除已存在选号
    _.remove(_this.buyArr, function(i) {
      return i.zid == _this.modifyId;
    });

    obj.zid = _this.modifyId;

    // 创建投注html并插入buybox
    _this.createOneNote(obj);

    // 清楚选中区选中状态
    _this.cleanNumBtn();

    // 更新修改状态机
    _this.modifyStatu = 0;

    _this.toggleChooseToBuyBtn();
  };

  GKL.getChooseToBuy = function() {

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
  GKL.saveNumsObj = function(obj) {

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

  GKL.cleanBuyList = function() {

    var _this = this;

    _this.buyArr = [];
    $('#code_list').html('');
    _this.updateBottomUi();

  };

  GKL.updateChooseToBuyBtn = function() {

    var _this = this;
    var c = 'active';

    if (_this.chooseMoney > 0) {
      $('#choose_to_buy').addClass(c).removeAttr('disabled');
    } else {
      $('#choose_to_buy').removeClass(c);
    }
  };

  GKL.setChooseParams = function() {

    var _this = this;

    var l = $('#j-area-' + _this.playType + ' .j-num-btn.active').length;
    var q = null;
    var b6Row = null;

    switch (_this.playType) {
      case 'b2':
        q = QUEUE.getACTotalNum(l, 2, 'C');
        _this.chooseZhushu = q;
        _this.chooseMoney = q * 2;
        break;
      case 'b3':
        q = QUEUE.getACTotalNum(l, 3, 'C');
        _this.chooseZhushu = q;
        _this.chooseMoney = q * 2;
        break;
      case 'b4':
        q = QUEUE.getACTotalNum(l, 4, 'C');
        _this.chooseZhushu = q;
        _this.chooseMoney = q * 2;
        break;
      case 'b5':
        q = QUEUE.getACTotalNum(l, 5, 'C');
        _this.chooseZhushu = q;
        _this.chooseMoney = q * 2;
        break;
      case 'b6':
        q = QUEUE.getACTotalNum(l, 2, 'C');
        _this.chooseZhushu = q;
        _this.chooseMoney = q * 2;
        break;
      case 'b7':
        q = QUEUE.getACTotalNum(l, 3, 'C');
        _this.chooseZhushu = q;
        _this.chooseMoney = q * 2;
        break;
      default:
        _this.chooseZhushu = l;
        _this.chooseMoney = l * 2;
        break;
    }

  };

  GKL.updateMidTotal = function() {

    var _this = this;

    _this.setChooseParams();

    $('#choose_zhushu').html(_this.chooseZhushu);
    $('#choose_money').html(_this.chooseMoney);

    _this.updateChooseToBuyBtn();

  };

  GKL.cleanNumBtn = function() {

    var _this = this;
    _this.chooseMoney = 0;
    _this.chooseZhushu = 0;

    $('#j-area-' + _this.playType + ' .j-num-btn').removeClass('active');
    _this.updateMidTotal();
  };

  GKL.updateHzBallList = function(r) {

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

  GKL.updateCardGroup = function(id) {

    var _this = this;

    _this.cleanNumBtn();

    // 更新修改id
    _this.modifyId = id;

    // 更新状态机
    _this.modifyStatu = 1;

    // 选中卡牌
    var c = _.find(_this.buyArr, function(i) {
      return i.zid == _this.modifyId;
    });

    for (var i = 0; i < c.nums.length; i++) {
      $('#j-area-' + _this.playType + ' [data-num=' + c.nums[i] + ']').addClass('active');
    };

    // 更改button状态
    _this.updateMidTotal();
    _this.toggleChooseToBuyBtn();

  };

  GKL.toggleChooseToBuyBtn = function() {

    var _this = this;

    var btnEl = $('#choose_to_buy_tip');

    //添加到投注列表
    if (_this.modifyStatu === 0) {

      btnEl.html('添加到投注列表');

    }

    //确认修改
    if (_this.modifyStatu === 1) {

      btnEl.html('确认修改');

    }

  };

  GKL.removeBuyList = function(zid) {

    var _this = this;

    _.remove(_this.buyArr, function(i) {
      return i.zid == zid;
    });

    _this.updateBottomUi();

  };

  GKL.togglePlayTab = function() {

    var _this = this;

    _this.cleanNumBtn();
    _this.cleanBuyList();

    // 移除修改状态
    _this.modifyStatu = 0;
    _this.toggleChooseToBuyBtn();

    GKL.updateYilou();

  };

  GKL.getBuyArrTotalMoney = function() {
    var _this = this;
    var m = 0;

    for (var i = 0; i < _this.buyArr.length; i++) {
      m += ~~(_this.buyArr[i].money);
    };

    return m;
  };

  GKL.buySuccess = function(data, obj, payMoney) {

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

  GKL.enoughMoneyCb = function(url, obj, payMoney) {

    var _this = this;

    $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        data: obj,
      })
      .done(function(data) {
        _this.buySuccess(data, obj, payMoney);
      });

  };

  GKL.getCodes = function() {

    var _this = this;
    var codes = [];
    var result = '';
    var bArr = [];

    for (var i = 0; i < _this.buyArr.length; i++) {

      codes.push(_this.buyCodesType[_this.playType] + '|' + _this.buyArr[i].nums.join(','));

      bArr = bArr.concat(_this.buyArr[i].nums);
    };

    result = codes.join('$');

    return result;

  };

  GKL.buyLoty = function() {

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

    // 购买类型判断 1-自购，2-追号 3-合买
    switch (_this.buyType) {
      case 1:
        obj.qihaoId = _this.qihaoId;
        obj.qihao = _this.qihao;
        payMoney = m * obj.beishu;

        text += '<p>' + _this.lotyCnName + ' 第<span>' + obj.qihao + '</span>期</p>';
        text += '<p>共<span>' + obj.zhushu + '</span>注, 投注<span>' + obj.beishu + '</span>倍</p>';
        text += '<p>本次需支付<span class="fc-3">' + payMoney + '.00</span>元</p></div>';
        break;
      case 2:
        endminmoney = $('#is_end_zhongjiang')[0].checked ? 1 : 0;

        buyTypeUrlStr = 'buy-track';

        obj.zhuihaoqihao = [];

        for (var i = 0, length1 = _this.trackData.length; i < length1; i++) {
          obj.zhuihaoqihao.push(_this.trackData[i].tid + '|' + _this.trackData[i].qi + '|' + _this.trackData[i].bs);
        }

        obj.endminmoney = endminmoney;
        payMoney = _this.getTrackTotalMoney(_this.getBuyArrTotalMoney());

        text += '<p>追号<span>' + _this.trackData.length + '</span>期</p><p>本次需支付<span class="fc-3">' + payMoney + '</span>元</p></div>';

        break;
      case 3:
        obj.qihaoId = _this.qihaoId;
        obj.qihao = _this.qihao;

        obj.title = _.escape($('#title').val());
        obj.textarea = _.escape($('#desc').val());
        obj.shareNum = Number($('#share-num').val());
        obj.buyNum = Number($('#part_buy').val());
        obj.aegisNum = Number($('#part_aegis_num').val());
        obj.extraPercent = $('#commission_percent').val();
        obj.set = _.escape($('.br-set-group .br-set.active').html());

        payMoney = m / obj.shareNum * (obj.buyNum + obj.aegisNum);

        text += '<p>' + _this.lotyCnName + ' 第<span>' + obj.qihao + '</span>期</p><p>方案总金额<span class="fc-3">' + m + '</span>元</p><p>您认购<span>' + obj.buyNum + '</span>份';

        if (obj.aegisNum > 0) {

          text += ', 保底<span>' + obj.aegisNum + '</span>份</p><p>共需支付<span class="fc-3">' + payMoney + '</span>元</p>';

        } else {

          text += '</p><p>共需支付<span class="fc-3">' + payMoney + '</span>元</p>';

        }

        break;
      default:
        break;
    }

    url = '/lottery/kuaipin/' + buyTypeUrlStr + '/' + _this.lotyName + '/' + _this.buyCodesType[_this.playType];

    var lessMoneyTips = '';

    if (_this.buyType === 2) {
      lessMoneyTips += '<p>追号<span class="fc-3 mlr5">' + obj.zhuihaoqihao.length + '</span>期</p>';
    } else {
      lessMoneyTips += '<p>' + _this.lotyCnName + ' 第<span class="fc-3 mlr5">' + _this.qihao + '</span>期</p>';
      lessMoneyTips += '<p>共<span class="fc-3 mlr5">' + obj.zhushu + '</span>注, 投注<span class="fc-3 mlr5">' + obj.beishu + '</span>倍</p>';
    }
    lessMoneyTips += '<p>本次需支付：<span class="fc-3 mlr5">' + payMoney + '.00</span>元';

    APP.checkLogin(payMoney, {

      enoughMoney: function() {

        APP.showTips({
          text: text,
          title: '投注确认',
          type: 2,
          onConfirm: function() {
            _this.enoughMoneyCb(url, obj, payMoney);
          }
        });
      },
      lessMoneyTips: lessMoneyTips

    });

  };

  GKL.onToggleBuyType = function(type) {

    var _this = this;

    _this.buyType = type;
    _this.beishu = 1;
    $('#project_mutiple').val(1);
    _this.updateBottomUi();

  };

  GKL.updateTrackList = function() {

    var _this = this;

    _this.trackData = [];

    var tid = null;
    var bs = null;
    var qi = null;
    var m = 0;
    var o = _this.getBuyArrTotalMoney();

    // 更新 trackData
    $('#track_issue_list').find('.br-zhui-c').each(function(index, el) {

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

  GKL.getTrackTotalMoney = function(o) {
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

      v = 1;

    } else {

      val = Math.ceil(val);
      (val > 9999) && (v = 9999);

    }

    return v;
  };

  // 追号总期的期数改变
  $('.br-details').on('change', 'tbody .br-zhui-c', function(event) {
    event.preventDefault();

    GKL.updateTrackList();

  });

  // 追号总期的期数改变
  $('.br-details').on('change', 'thead .br-zhui-c', function(event) {
    event.preventDefault();

    if ($(this)[0].checked) {
      $('#track_issue_list .br-zhui-c').each(function(index, el) {
        $(this)[0].checked = true;
      });
    } else {
      $('#track_issue_list .br-zhui-c').removeAttr('checked');
    }

    GKL.updateTrackList();

  });

  // 追号总期的倍数改变
  $('.br-details').on('change', 'thead .br-zhui-bei', function(event) {

    var val = parseInt($(this).val()) || 1;

    val = filterTrackNum(val);

    $(this).val(val);

    $('.br-details tbody .br-zhui-bei').val(val);

    GKL.updateTrackList();

  });

  // 追号每期的倍数改变
  $('.br-details tbody').on('change', '.br-zhui-bei', function(event) {

    var val = parseInt($(this).val()) || 1;

    val = filterTrackNum(val);

    $(this).val(val);

    GKL.updateTrackList();

  });

  // buy Loty
  $('#buy-submit').on('click', function(event) {
    event.preventDefault();

    if (!$('.j-sub-agreed')[0].checked) {
      APP.showTips('请先阅读并同意《委托投注规则》后才能继续');
      return;
    } else if (GKL.buyType === 2 && GKL.trackData.length === 0) {
      APP.showTips('追号最少购买一期');
    } else if (GKL.buyArr.length === 0) {
      APP.showTips('请至少选择1注号码投注');
    } else {
      GKL.buyLoty();
    }

  });

  $('#issue_size').on('change', function(event) {
    event.preventDefault();

    var v = ~~$(this).val();
    queryTrackIssueList(v);

  });

  $('#increase_mutiple').on('click', function(event) {

    var m = $('#project_mutiple');
    var u = m.val();
    var v = calculateBeishu(u, 1);

    updateBeishu(v);

  });

  $('#decrease_mutiple').on('click', function(event) {

    var m = $('#project_mutiple');
    var u = m.val();
    var v = calculateBeishu(u, 0);

    updateBeishu(v);

  });

  $('#project_mutiple').on('keyup change', function(event) {

    var t = $(this);
    var r = t.attr('data-r');
    var v = filterNum(t.val());
    v = v || 1;

    updateBeishu(v);

  });

  // 随机添加注数
  $('#j-box-left').on('click', '.j-zhu-adds', function(event) {
    event.preventDefault();
    var c = ~~($(this).attr('data-zhu'));
    GKL.addManyItem(c);
  });

  // 修改投注
  $('#j-box-left').on('click', '.br-zhu-up', function(event) {
    event.preventDefault();

    var p = $(this).parents('.br-zhu-item');
    var zid = Number(p.attr('data-zid'));

    GKL.updateCardGroup(zid);
    var obj = GKL.getObj();
    judgeAllNum(GKL.G_CHOOSE);

  });

  function judgeAllNum(G_CHOOSE) {
    var i, odd = 0,
      even = 0,
      big = 0,
      small = 0,
      all = 0,
      halfLen = 0,
      methodObj;
    switch (G_CHOOSE.playType) {
      case 'b0':
        halfLen = 9;
        break;
      case 'b1':
        halfLen = 0;
        break;
      default:
        halfLen = 10;
        break;
    }
    methodObj = $('.j-choose-' + G_CHOOSE.playType).find('.j-quick-method');
    if (G_CHOOSE.nums && G_CHOOSE.nums.length == halfLen) {
      for (i = 0; i < 10; i++) {
        if (G_CHOOSE.nums[i] % 2 == 1) {
          odd++;
        }
        if (G_CHOOSE.nums[i] % 2 == 0) {
          even++;
        }
        if (G_CHOOSE.nums[i] > halfLen) {
          big++;
        }
        if (G_CHOOSE.nums[i] <= halfLen) {
          small++;
        }
      }
      if (odd == halfLen) {
        methodObj.find('span').removeClass('active');
        methodObj.find('span[data-type="odd"]').addClass('active');
      }
      if (even == halfLen) {
        methodObj.find('span').removeClass('active');
        methodObj.find('span[data-type="even"]').addClass('active');
      }
      if (big == halfLen) {
        methodObj.find('span').removeClass('active');
        methodObj.find('span[data-type="big"]').addClass('active');
      }
      if (small == halfLen) {
        methodObj.find('span').removeClass('active');
        methodObj.find('span[data-type="small"]').addClass('active');
      }
    } else if (G_CHOOSE.nums && G_CHOOSE.nums.length == (halfLen * 2)) {
      methodObj.find('span').removeClass('active');
      methodObj.find('span[data-type="all"]').addClass('active');
    }
  }

  // del buy box list
  $('#j-box-left').on('click', '.br-zhu-del', function(event) {
    event.preventDefault();

    var p = $(this).parents('.br-zhu-item');
    var zid = Number(p.attr('data-zid'));
    GKL.removeBuyList(zid);
    p.remove();

    // 移除修改状态
    GKL.modifyStatu = 0;
    GKL.toggleChooseToBuyBtn();

  });

  // Toggle PlayTypeBox
  $('#j-nav').on('click', 'li', function(event) {
    event.preventDefault();

    var t = $(this);
    var type = t.attr('data-playtype');

    // toggle nav active
    $('#j-nav li').removeClass('active');
    t.addClass('active');

    $('.box-choose').removeClass('active');
    $('.j-choose-' + type).addClass('active');

    $('.j-quick-method span').removeClass('active');
    GKL.playType = type;
    GKL.togglePlayTab();

  });

  // choose Num
  $('#j-box-left').on('click', '.j-num-btn', function(event) {
    event.preventDefault();
    var _this = $(this);

    $(this).toggleClass('active');
    $(this).parents('.choose-bd').find('.j-quick-method').children('span').removeClass('active');

    GKL.updateMidTotal();
    var obj = GKL.getObj();
    judgeNum(obj, _this, GKL.playType);

  });

  function judgeNum(G_CHOOSE, numObj, playType) {
    var _this = numObj;
    var i, odd = 0,
      even = 0,
      big = 0,
      small = 0,
      all = 0,
      halfLen = 0;
    switch (playType) {
      case 'b0':
        halfLen = 9;
        break;
      case 'b1':
        halfLen = 0;
        break;
      default:
        halfLen = 10;
        break;
    }
    if (G_CHOOSE.nums && G_CHOOSE.nums.length == halfLen) {
      for (i = 0; i < 10; i++) {
        if (G_CHOOSE.nums[i] % 2 == 1) {
          odd++;
        }
        if (G_CHOOSE.nums[i] % 2 == 0) {
          even++;
        }
        if (G_CHOOSE.nums[i] > halfLen) {
          big++;
        }
        if (G_CHOOSE.nums[i] <= halfLen) {
          small++;
        }
      }
      if (odd == halfLen) {
        _this.parents('.choose-bd').find('span').removeClass('active');
        _this.parents('.choose-bd').find('span[data-type="odd"]').addClass('active');
      }
      if (even == halfLen) {
        _this.parents('.choose-bd').find('span').removeClass('active');
        _this.parents('.choose-bd').find('span[data-type="even"]').addClass('active');
      }
      if (big == halfLen) {
        _this.parents('.choose-bd').find('span').removeClass('active');
        _this.parents('.choose-bd').find('span[data-type="big"]').addClass('active');
      }
      if (small == halfLen) {
        _this.parents('.choose-bd').find('span').removeClass('active');
        _this.parents('.choose-bd').find('span[data-type="small"]').addClass('active');
      }
    } else if (G_CHOOSE.nums && G_CHOOSE.nums.length == (halfLen * 2)) {
      _this.parents('.choose-bd').find('span').removeClass('active');
      _this.parents('.choose-bd').find('span[data-type="all"]').addClass('active');
    }
  }

  // Choose to BuyBox
  $('#choose_to_buy').on('click', function(event) {
    event.preventDefault();

    if (GKL.buyArr.length >= 100) {
      APP.showTips('您的投注号码多于100行，请返回重新选择');
      return;
    }

    if (GKL.chooseZhushu > 10000) {
      APP.showTips('您好，单个投注的金额应小于2万元，请返回重新选择');
      return;
    }


    if ($(this).hasClass('active')) {

      if (GKL.modifyStatu === 1) {

        GKL.updateBuyArr();

      } else {
        GKL.getChooseToBuy();
      }

    } else {

      return;

    }
    $('.j-quick-method span').removeClass('active');

  });

  $('#clean_buy_code').on('click', function(event) {
    event.preventDefault();

    GKL.cleanBuyList();

    if (GKL.modifyStatu === 1) {
      // 有修改状态时
      GKL.modifyStatu = 0;
      GKL.toggleChooseToBuyBtn();
    }

  });

  /**
   * 切换购买方式
   */

  $('#buy_type').on('click', '.j-tog-tab', function(event) {
    event.preventDefault();

    var me = $(this);

    $('#buy_type li .icon').removeClass('icon-y2');
    me.find('.icon').addClass('icon-y2');

    var a = me.find('a');
    var t = ~~a.attr('data-buytype');
    var l = a.attr('href');

    $('#buy_type').siblings('.tab-content').find('.tab-pane').removeClass('active');
    $(l).addClass('active');

    GKL.onToggleBuyType(t);

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
      case 3:

        $('#track_desc').addClass('hide');
        $('#buy_mutiple_span').show();

        updateCreatePartProjectParame();
        break;
      default:
        break;
    }

  });

  // toggle buyLoty Tips Box
  $('#j-touzhu-tips').on('click', function(event) {

    $('#j-touzhu-tipstext').toggle();
    $(this).find('.icon').toggleClass('icon-bup').toggleClass('icon-bdown');

  });

  $('.j-quick-method').on('click', '[data-type]', function(event) {
    event.preventDefault();
    var _this = $(this);
    var toggleType = $(this).attr('data-type');
    var btnGroup = $('#j-area-' + GKL.playType + ' .j-num-btn');
    var btnLen = btnGroup.length;

    GKL.cleanNumBtn();

    if ('clean' != toggleType) {
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

    if (toggleType === 'all') {
      if (_this.hasClass('active')) {
        btnGroup.addClass('active');
      } else {
        btnGroup.removeClass('active');
      }
    }

    if (toggleType === 'odd') {

      if (_this.hasClass('active')) {

        btnGroup.each(function(index, el) {

          var n = Number($(this).attr('data-num'));

          if (_.isNumber(n) && n % 2 !== 0) {
            $(this).addClass('active');
          }
        });

      } else {

        btnGroup.removeClass('active');

      }
    }

    if (toggleType === 'even') {

      if (_this.hasClass('active')) {

        btnGroup.each(function(index, el) {

          var n = Number($(this).attr('data-num'));

          if (_.isNumber(n) && n % 2 === 0) {
            $(this).addClass('active');
          }
        });

      } else {
        btnGroup.removeClass('active');
      }
    }

    if (toggleType === 'big') {
      if (_this.hasClass('active')) {

        btnGroup.each(function(index, el) {

          var n = Number($(this).attr('data-num'));
          var midNum = 10;
          if (btnLen === 18) {
            midNum = 9;
          }
          if (_.isNumber(n) && n > midNum) {
            $(this).addClass('active');
          }
        });

      } else {
        btnGroup.removeClass('active');
      }
    }

    if (toggleType === 'small') {
      if (_this.hasClass('active')) {
        btnGroup.each(function(index, el) {

          var n = Number($(this).attr('data-num'));
          var midNum = 10;
          if (btnLen === 18) {
            midNum = 9;
          }
          if (_.isNumber(n) && n <= midNum) {
            $(this).addClass('active');
          }
        });
      } else {
        btnGroup.removeClass('active');
      }
    }

    GKL.updateMidTotal();

  });

  /* 合买 */

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

  });

  // 是否保底
  $('#has_part_aegis').on('change', function(event) {

    if ($(this)[0].checked) {

      $('#part_aegis_num').removeAttr('disabled');

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

  });

  $('.j-input-place').on('focus', function(event) {
    inputOnfocus($(this));
  });

  $('.j-input-place').on('blur', function(event) {
    inputOnblur($(this));
  });

  $('.j-input-place').on('keyup', function(event) {
    reSetStrsize($(this));
  });

  $('#is_end_zhongjiang').on('change', function(event) {

    if ($(this)[0].checked) {

      $('#track_stop_money').removeAttr('disabled');

    } else {

      $('#track_stop_money').attr('disabled', 'disabled');
      $('#part_aegis_num').val(0);

    }

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

  function updateCreatePartProjectParame() {

    // 总金额
    var totalMoney = GKL.getBuyArrTotalMoney();

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

  function updatePartView(copies, oneCopiesMoney, rengouCopies, ticheng, rengouPercent, baodiPercent, baodiCopies) {

    var gBuy = {};
    var baodiTips = baodiCopies * oneCopiesMoney || 0;
    var totalTips = (rengouCopies + baodiCopies) * oneCopiesMoney || 0;
    if (copies === 0) {
      oneCopiesMoney = 0;
    }

    // update partnerBuy
    // 分成多少份,购买的份数,单份金额,提成比例,保底份数
    gBuy.shareNum = copies;
    gBuy.partBuyNum = rengouCopies;
    gBuy.unitPrice = oneCopiesMoney;
    gBuy.commissionPercent = parseInt($('#commission_percent').val());
    gBuy.partAegisNum = baodiCopies;

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

  /* 合买 End */

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
    GKL.statu = 1;

    setInterval(function() {

      getAllAwardRecord();
      loadNewestAward();
      loadLastIssueList();

    }, t * 1000);

  }

  /* 倒计时 相关 Start */

  // 最新所有开奖公告
  function getAllAwardRecord() {

    var url = '/lottery/award/kuaipin/' + GKL.lotyName;
    var tbody = $('#j-todaynum-table tbody');

    var tbodyQihao = tbody.attr('data-qihao');

    if (tbodyQihao && tbodyQihao === GKL.qihao) {
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
        .done(function(data) {

          var q = GKL.qihao.slice(0, GKL.qihao.length - 2);
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
          tbody.attr('data-qihao', GKL.qihao);

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
          lotteryId: GKL.lotyId
        }
      })
      .done(function(data) {

        if (data.retCode === 100000) {
          var html = '';
          for (var int = 0; int < data.retData.length; int++) {
            if (int > 5) break;
            html += "<tr>";
            html += "<td class='zxzj-l'>" + data.retData[int].username + "</td>";
            html += "<td class='zxzj-r'>" + data.retData[int].bonus_before_tax + "</td>";
            html += "</tr>";
          }
          $('#j-new-bonus-list').html((html == '') ? '<tr><td colspan="2">暂无相关中奖纪录</td></tr>' : html);
        } else {
          $('#j-new-bonus-list').html('<tr><td colspan="2">系统繁忙</td></tr>');
        }

      });
  }

  function updateKjgg(kjNum, kjNo) {

    var kjHTML = '等待开奖';
    var arr = [];

    if (kjNum != '') {

      arr = kjNum.split(' ');
      arr = _.map(arr, function(r) {
        return '<span class="bg-3">' + r + '</span>';
      });

      kjHTML = arr.join('');
    }

    $('#j-last-issue-no').html(kjNo);
    $('#j-new-num').html(kjHTML);

  }

  function updateKjList(item) {

    var kjhmHtml = '';
    var html = '';
    for (var i = 0, len = item.length; i < len; i++) {

      if (item[i]['kjhm'] === '') {
        kjhmHtml = '等待开奖';
      } else {
        kjhmHtml = '<span class="fc-3">' + item[i]['kjhm'] + '</span>';
      }

      html += '<tr><td>' + item[i]['no'] + '</td><td>' + kjhmHtml + '</td></tr>';

    };

    $('#j-last-issue-n').html(html);

  }

  // 获取最新期数列表，更新右侧开奖信息，开奖公告
  function loadLastIssueList() {

    $.ajax({
        url: '/lottery/issue/kuaipin/last-issue-n',
        type: 'GET',
        dataType: 'json',
        data: {
          loty_name: GKL.lotyName,
          issue_num: 10
        }
      })
      .done(function(data) {

        var item = data.retData;
        var lastData = item[0];
        var type = null;
        var lessTime = 0;
        var xt = '';
        var arr = [];
        var kjNum = lastData['kjhm'];
        var kjNo = lastData['no'];

        if (data.retCode == 100000) {

          //更新开奖列表
          updateKjList(item);

          //更新开奖公告
          updateKjgg(kjNum, kjNo);

        }
      });
  }

  // 获取当前期参数
  function loadCurrentIssue() {

    var v = $('#issue_size').val();

    $.ajax({
        url: '/lottery/issue/get-cur-issue',
        type: 'GET',
        dataType: 'json',
        data: {
          lottery_id: GKL.lotyId
        }
      })
      .done(function(data) {

        var item = data.retData[0];
        var lessSeconds = '';
        var stopSale = '';
        var max = ~~$('#j-maxqishu').val() || 100;
        var q = '';
        lessSeconds = Math.floor((item.company_sell_etime - item.sys_time));

        if (data.retCode === 100000) {

          stopSale = (0 === parseInt(item.sell_status, 10));

          // 判断是否停售  showStopControl-控制Modal弹出
          if (stopSale) {

            if (GKL.showStopControl) {
              APP.showStopSellModal(GKL.lotyCnName);
              $('#buy-submit').html('暂停销售').removeClass('btn-red').addClass('btn-stop').attr('disabled', true);

              $('#j-less-info').html('暂停销售');
              GKL.showStopControl = false;
            }

            callCurrentIssueNext(10);

            return;

          } else {

            GKL.showStopControl = true;

            $('#buy-submit').html('立即投注').addClass('btn-red').removeClass('btn-stop').removeAttr('disabled');

          }

          // update loty Config
          if (GKL.qihao != item.issue_num) {
            GKL.qihao = item.issue_num;
            GKL.qihaoId = item.id;
          }

          // 小于0 等待开售中
          if (lessSeconds < 0) {

            $('#j-less-info').html('销售时间截止');

            GKL.waitSell = true;

            loadLastIssueList();

            // 10秒后 再次请求最新当前期
            callCurrentIssueNext(10);

          } else {

            timer(lessSeconds);

            GKL.waitSell = false;

            // update mid area
            $('#j-current-issue').html(GKL.qihao);
            $('.br-details thead .br-zhui-c')[0].checked = true;
            queryTrackIssueList(v);

          }

        }

      }).fail(function() {
        callCurrentIssueNext(10);
      });

  }

  /*  倒计时 End */

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

    h = _.map(h, function(r) {


      var a = String(r).split('');
      return '<span class="m-time-djs" >' + a[0] + '</span><span class="m-time-djs" >' + a[1] + '</span>';
    });

    if (h.length === 3) {
      html = h[0] + '<span>时</span>' + h[1] + '<span>分</span>' + h[2] + '<span>秒</span>';
    } else {
      html = h[0] + '<span>分</span>' + h[1] + '<span>秒</span>';
    }

    $('#j-less-info').html(html);

  }

  function timer(s) {

    s = s < 0 ? 0 : s;
    updateTimer(s);

    var now = ~~((new Date().getTime()) / 1000);
    var q = $('#j-current-issue').html();
    GKL.nextTimer = now + s;

    GKL.runTimer = setInterval(function() {

      var n = ~~((new Date().getTime()) / 1000);
      var j = GKL.nextTimer - n;

      if (j > 0) {
        updateTimer(j);
      } else {

        updateTimer(0);

        if (GKL.alertQihao !== q) {
          APP.showTips("您好，第 " + q + '期已截止，投注时请确认您选择的期号。');
          GKL.alertQihao = q;
        }

        loadLastIssueList();

        if (GKL.runTimer) {
          clearInterval(GKL.runTimer);
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

    var f = setTimeout(function() {
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
    n = n > 9999 ? 9999 : n;
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
    v = v > 9999 ? 9999 : v;

    return v;

  };

  function updateBeishu(v) {

    var m = $('#project_mutiple');

    GKL.beishu = v;
    m.val(v);
    GKL.updateBottomUi();

  }

  /**
   * 读取追号期号集合
   */
  function queryTrackIssueList(num) {

    var html = '';

    html = '<tr><td colspan="5">系统繁忙， 请稍候再试</td></tr>';

    $('.br-details thead .br-zhui-bei').val(1);

    $.ajax({
      url: '/lottery/issue/get-issue-list?lottery_id=' + GKL.lotyId + '&issue_size=' + num,
      type: 'GET',
      dataType: 'json',
    }).done(function(data) {

      var item = data.retData;

      if (data.retCode == 100000) {

        if (_.isArray(item) && item.length) {
          html = '';
        }

        for (var i = 0; i < item.length; i++) {

          var m = i + 1;

          var unitPrice = GKL.getBuyArrTotalMoney();

          html += '<tr><td>' + m + '</td><td><input type="checkbox" class="br-zhui-c" data-qihaoid="' + item[i][0] + '"data-qi="' + item[i][1] + '" checked="">' + item[i][1] + '期</td><td><input type="text" class="br-input br-zhui-bei" value="1">倍</td><td><span class="j-money">' + unitPrice + '</span>元</td><td><span class="ml15">' + item[i][2] + '</span></td></tr>';
        }

      }

      $('#track_issue_list').html(html);
      GKL.updateTrackList();

    }).fail(function() {

      $('#track_issue_list').html(html);
      GKL.updateTrackList();

    });

  };

});