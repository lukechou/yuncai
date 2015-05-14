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
     * modifyId  要修改的号码-ID
     * modifyStatu  购彩状态 0-选号  1-修改
     *
     */
    var K3 = {
      lotyCnName: _.escape($('#j-lotyCnName').val()),
      qihaoId: _.escape($('#qihaoId').val()),
      qihao: _.escape($('#qihao').val()),
      lotyName: $('#j-lotyName').val(),
      lotyId: $('#j-track-lotyid').val(),
      playType: 'b1',
      chooseMoney: 0,
      chooseZhushu: 0,
      buyArr: [],
      playName: {
        b0: '包选',
        b1: '同花',
        b2: '顺子',
        b3: '同花顺',
        b4: '豹子',
        b5: '对子',
        b6: '任选一',
        b7: '任选二',
        b8: '任选三',
        b9: '任选四',
        b10: '任选五',
        b11: '任选六',
      },
      buyCodesType: {
        b0: 'BX',
        b1: 'TH',
        b2: 'SZ',
        b3: 'THS',
        b4: 'BZ',
        b5: 'DZ',
        b6: 'R1',
        b7: 'R2',
        b8: 'R3',
        b9: 'R4',
        b10: 'R5',
        b11: 'R6',
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
      showStopControl: true
    };

    return K3;
  }());

  K3.updateYilou = function () {

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
      .done(function (data) {

        if (data.retCode === 100000) {

          var map = {
            b1: 8,
            b2: 10,
            b3: 11,
            b4: 9,
            b5: 7,
            b6: 1,
            b7: 2,
            b8: 3,
            b9: 4,
            b10: 5,
            b11: 6,
          };

          if (data.retData[map[_this.playType]]) {
            var y = data.retData[map[_this.playType]].split('|');
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

  K3.runYilou = function () {

    var _this = this;

    setInterval(function () {
      _this.updateYilou();
    }, 10000);

  };

  K3.updateYilou();
  K3.runYilou();

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

    _this.updateTrackList();
    //updateCreatePartProjectParame();

  };

  K3.setNameStr = function (nums, numNameArr) {

    var result = '';

    if (numNameArr) {
      for (var i = 0; i < nums.length; i++) {

        result += '<span>' + numNameArr[nums[i]] + '</span>';

      };
    } else {

      for (var i = 0; i < nums.length; i++) {

        result += '<span>' + nums[i] + '</span>';
      }
    }

    return result;
  };

  K3.createOneNote = function (o, isJx) {

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

    switch (_this.playType) {
    case 'b0':
      numNameArr = {
        '01': '同花包选',
        '02': '顺子包选',
        '03': '同花顺包选',
        '04': '豹子包选',
        '05': '同花包选',
      };
      break;
    case 'b1':

      numNameArr = {
        '01': '黑桃',
        '02': '红心',
        '03': '梅花',
        '04': '方块',
        'BX': '同花包选',
      };

      break;
    case 'b2':
      numNameArr = {
        '01': 'A23',
        '02': '234',
        '03': '345',
        '04': '456',
        '05': '567',
        '06': '678',
        '07': '789',
        '08': '8910',
        '09': '910J',
        '10': '10JQ',
        '11': 'JQK',
        '12': 'QKA',
        'BX': '顺子包选'
      };
      break;
    case 'b3':

      numNameArr = {
        '01': '黑桃顺子',
        '02': '红心顺子',
        '03': '梅花顺子',
        '04': '方块顺子',
        'BX': '同花顺包选',
      };

      break;
    case 'b4':
      numNameArr = {
        '01': 'AAA',
        '02': '222',
        '03': '333',
        '04': '444',
        '05': '555',
        '06': '666',
        '07': '777',
        '08': '888',
        '09': '999',
        '10': '101010',
        '11': 'JJJ',
        '12': 'QQQ',
        '13': 'KKK',
        'BX': '豹子包选'
      };
      break;
    case 'b5':
      numNameArr = {
        '01': 'AA',
        '02': '22',
        '03': '33',
        '04': '44',
        '05': '55',
        '06': '66',
        '07': '77',
        '08': '88',
        '09': '99',
        '10': '1010',
        '11': 'JJ',
        '12': 'QQ',
        '13': 'KK',
        'BX': '对子包选'
      };
      break;
    default:

      numNameArr = {
        '01': 'A',
        '02': '2',
        '03': '3',
        '04': '4',
        '05': '5',
        '06': '6',
        '07': '7',
        '08': '8',
        '09': '9',
        '10': '10',
        '11': 'J',
        '12': 'Q',
        '13': 'K',
      };
      break;
    }

    obj.num = _this.setNameStr(obj.nums, numNameArr);

    var compiled = null;
    var html = null;

    if (_this.modifyStatu === 1 && !isJx) {

      // 修改号码
      compiled = _.template('<b>[<%= title%>]</b><div class="list"><%= num%></div><div class="pull-right"><b class="moneytext"><i class="money"><%= money%></i>元</b><a href="javascript:;" class="br-zhu-up">修改</a><a href="javascript:;" class="br-zhu-del">删除</a></div>');

      html = compiled(obj);

      $('#code_list').find('[data-zid=' + _this.modifyId + ']').html(html);

    } else {

      compiled = _.template('<div data-zid="<%= zid%>" class="br-zhu-item clearfix"><b>[<%= title%>]</b><div class="list"><%= num%></div><div class="pull-right"><b class="moneytext"><i class="money"><%= money%></i>元</b><a href="javascript:;" class="br-zhu-up">修改</a><a href="javascript:;" class="br-zhu-del">删除</a></div></div>');

      html = compiled(obj);

      $('#code_list').append(html);

    }
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
    var sampleConut = 1;

    var a = {
      'b0': ['01', '02', '03', '04', '05'],
      'b1': ['01', '02', '03', '04'],
      'b2': ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
      'b3': ['01', '02', '03', '04'],
      'b4': ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13'],
      'b5': ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13'],
      'b6': ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13'],
    };

    switch (_this.playType) {

    case 'b7':
      sampleConut = 2;
      break;
    case 'b8':
      sampleConut = 3;
      break;
    case 'b9':
      sampleConut = 4;
      break;
    case 'b10':
      sampleConut = 5;
      break;
    case 'b11':
      sampleConut = 6;
      break;
    default:
      break;

    }

    if (a[_this.playType]) {

      s = _.sample(a[_this.playType], sampleConut).sort(function (a, b) {
        return a - b;
      });

    } else {

      s = _.sample(a['b6'], sampleConut).sort(function (a, b) {
        return a - b;
      });

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

    obj.nums = arr;
    obj.money = _this.chooseMoney;

    return obj;
  };

  K3.updateBuyArr = function () {

    var _this = this;

    var obj = _this.getObj();

    //移除已存在选号
    _.remove(_this.buyArr, function (i) {
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
    case 'b7':
      q = QUEUE.getACTotalNum(l, 2, 'C');
      _this.chooseZhushu = q;
      _this.chooseMoney = q * 2;
      break;
    case 'b8':
      q = QUEUE.getACTotalNum(l, 3, 'C');
      _this.chooseZhushu = q;
      _this.chooseMoney = q * 2;
      break;
    case 'b9':
      q = QUEUE.getACTotalNum(l, 4, 'C');
      _this.chooseZhushu = q;
      _this.chooseMoney = q * 2;
      break;
    case 'b10':
      q = QUEUE.getACTotalNum(l, 5, 'C');
      _this.chooseZhushu = q;
      _this.chooseMoney = q * 2;
      break;
    case 'b11':
      q = QUEUE.getACTotalNum(l, 6, 'C');
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

  K3.updateCardGroup = function (id) {

    var _this = this;

    _this.cleanNumBtn();

    // 更新修改id
    _this.modifyId = id;

    // 更新状态机
    _this.modifyStatu = 1;

    // 选中卡牌
    var c = _.find(_this.buyArr, function (i) {
      return i.zid == _this.modifyId;
    });

    for (var i = 0; i < c.nums.length; i++) {
      $('#j-area-' + _this.playType + ' [data-num=' + c.nums[i] + ']').addClass('active');
    };

    // 更改button状态
    _this.updateMidTotal();
    _this.toggleChooseToBuyBtn();

  };

  K3.toggleChooseToBuyBtn = function () {

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

    // 移除修改状态
    _this.modifyStatu = 0;
    _this.toggleChooseToBuyBtn();

    K3.updateYilou();

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

      enoughMoney: function () {

        APP.showTips({
          text: text,
          title: '投注确认',
          type: 2,
          onConfirm: function () {
            _this.enoughMoneyCb(url, obj, payMoney);
          }
        });
      },
      lessMoneyTips: lessMoneyTips

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

      v = 1;

    } else {

      val = Math.ceil(val);
      (val > 9999) && (v = 9999);

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
    debugger
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
    } else if (K3.buyArr.length === 0) {
      APP.showTips('请至少选择1注号码投注');
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

  $('#project_mutiple').on('keyup change', function (event) {

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

  // 修改投注
  $('#j-box-left').on('click', '.br-zhu-up', function (event) {
    event.preventDefault();

    var p = $(this).parents('.br-zhu-item');
    var zid = Number(p.attr('data-zid'));

    K3.updateCardGroup(zid);

  });

  // del buy box list
  $('#j-box-left').on('click', '.br-zhu-del', function (event) {
    event.preventDefault();

    var p = $(this).parents('.br-zhu-item');
    var zid = Number(p.attr('data-zid'));
    K3.removeBuyList(zid);
    p.remove();

    // 移除修改状态
    K3.modifyStatu = 0;
    K3.toggleChooseToBuyBtn();

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

      if (K3.modifyStatu === 1) {

        K3.updateBuyArr();

      } else {
        K3.getChooseToBuy();
      }

    } else {

      return;

    }

  });

  $('#clean_buy_code').on('click', function (event) {
    event.preventDefault();

    K3.cleanBuyList();

    if (K3.modifyStatu === 1) {
      // 有修改状态时
      K3.modifyStatu = 0;
      K3.toggleChooseToBuyBtn();
    }

  });

  /**
   * 切换购买方式
   */

  $('#buy_type').on('click', '.j-tog-tab', function (event) {
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

  /* 选号区按钮 */
  $('#j-content').on('click', '.j-random', function (event) {
    event.preventDefault();

    K3.cleanNumBtn();

    var b = $('#j-area-' + K3.playType + ' .j-num-btn');
    var l = b.length;
    var f = [];
    var count = 1;
    var index = null;

    switch (K3.playType) {
    case 'b7':
      count = 2;
      break;
    case 'b8':
      count = 3;
      break;
    case 'b9':
      count = 4;
      break;
    case 'b10':
      count = 5;
      break;
    case 'b11':
      count = 6;
      break;
    default:
      break;
    }

    for (var i = 0; i < l; i++) {
      f.push(i);
    };

    index = _.sample(f, count);

    if (count === 1) {
      b.eq(index).addClass('active');
    } else {
      for (var i = 0; i < index.length; i++) {
        b.eq(index[i]).addClass('active');
      };
    }

    K3.updateMidTotal();

    // animate
    // $('#j-mask-main').html();
    // $('#j-first-mask').show().addClass('animated');

  });

  $('#j-content').on('click', '.j-all', function (event) {
    event.preventDefault();

    $('#j-area-' + K3.playType + ' .j-num-btn').addClass('active');
    K3.updateMidTotal();

  });

  $('#j-content').on('click', '.j-clear', function (event) {
    event.preventDefault();
    K3.cleanNumBtn();
  });

  /* 合买 */

  // 我要分成多少份，最少一份，最多购买金额的数量
  $("#share-num").on('change', function (event) {
    updateCreatePartProjectParame();
  });

  // 我要认购的份数
  $("#part_buy").on('change', function (event) {
    updateCreatePartProjectParame();
  });

  // 我要提成比例
  $('#commission_percent').on('change', function (event) {

    var val = parseInt($(this).val()) || 0;

    var rengouPercent = Math.floor($('#part_buy_percent').html());

    if (val > rengouPercent) {

      $("#part_buy").val(Math.ceil($("#commission_percent").val() / 100 * ($('#share-num').val() || 0)));

      updateCreatePartProjectParame();

    }

  });

  // 是否保底
  $('#has_part_aegis').on('change', function (event) {

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
  $('#part_aegis_num').on('change', function (event) {

    updateCreatePartProjectParame();

  });

  // 方案保密设置
  $('.br-set-group').on('click', 'a', function (event) {

    $(this).parents('.br-set-group').find('a').removeClass('active');

    $(this).toggleClass('active');

  });

  $('.j-input-place').on('focus', function (event) {
    inputOnfocus($(this));
  });

  $('.j-input-place').on('blur', function (event) {
    inputOnblur($(this));
  });

  $('.j-input-place').on('keyup', function (event) {
    reSetStrsize($(this));
  });

  $('#is_end_zhongjiang').on('change', function (event) {

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
    var totalMoney = K3.getBuyArrTotalMoney();

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

        if (data.retCode === 100000) {

          stopSale = (0 === parseInt(item.sell_status, 10));

          // 判断是否停售
          if (stopSale) {

            if (K3.showStopControl) {
              APP.showStopSellModal(K3.lotyCnName);
              $('#buy-submit').html('暂停销售').removeClass('btn-red').addClass('btn-stop').attr('disabled', true);

              $('#j-less-seconds').html('<i class="icon icon-k302">--</i><i class="icon icon-k302">--</i>');
              K3.showStopControl = false;
            }

            callCurrentIssueNext(10);

            return;

          } else {

            K3.showStopControl = true;

            $('#buy-submit').html('立即投注').addClass('btn-red').removeClass('btn-stop').removeAttr('disabled');

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
            $('.br-details thead .br-zhui-c')[0].checked = true;
            queryTrackIssueList(v);

          }

        }

      }).fail(function () {
        callCurrentIssueNext(10);
      });

  }

  function getOneCard(c, index) {

    var f = '';

    if (index || index == 0) {
      f = 'm-card-' + index;
    }

    if (c && c.length === 3) {

      var h = '<span class="m-card ' + f + ' card-' + c.slice(0, 1) + '"><i class="iconfont icon-h' + c.slice(0, 1) + ' m-card-flow"></i><i class="iconfont icon-n' + c.slice(1) + ' m-card-num"></i></span>';
      return h;
    } else {

      return '';

    }

  }

  function formatCard(card) {

    var html = '';

    if (_.isArray(card)) {

      for (var i = 0; i < card.length; i++) {

        html += getOneCard(card[i], i);
      }

    } else {

      html = getOneCard(card);

    }

    return html;
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
        var xt = '';
        var arr = [];

        if (data.retCode == 100000) {

          for (var i = 0, len = item.length; i < len; i++) {

            if (item[i]['kjhm'] === '') {
              kjhmHtml = '等待开奖';
              xt = '';
            } else {
              arr = item[i]['kjhm'].split(' ');
              kjhmHtml = formatCard(arr);
              xt = getNumsXt(arr);
            }

            html += '<tr><td class="ctr1">' + item[i]['no'] + '</td><td>' + kjhmHtml + '</td><td class="ctr2">' + xt + '</td></tr>';

          };

          $('#j-last-issue-n').html(html);

          if (lastData['kjhm'] != '') {

            kjHTML = '';
            arrKJHM = lastData['kjhm'].split(' ');

            kjHTML += formatCard(arrKJHM);
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
    var xtText = '';

    if (!obj) {
      return;
    }

    if (!K3.currentKjStatus) {
      K3.currentKjStatus = 1;
    }

    xt = getNumsXt(obj.nums);

    o = {
      qihao: obj.no,
      nums: obj.nums,
      xt: xt,
    };

    // 已开奖
    if (K3.currentKjStatus === 1) {

      if (_.isArray(xt)) {
        xtText = xt.join(' ');
      }

      html = _.template('<p class="third-hd"><b>第<span class="mlr5 fc-3"><%= qihao%></span>开奖牌<span class="ml-10">牌型：<span class="fc-3 mlr5">' + xtText + '</span></b></p><div class="third-box clearfix card-big-group">' + formatCard(o.nums) + '</div>');

      $('#j-kj-box').html(html(o));
      return;

    }

    // 开奖中
    if (K3.currentKjStatus === 2) {

      var rf = '<div class="num-group"><span class="card"></span></div>';

      html = _.template('<p class="third-hd"><b>第<span class="mlr5 fc-3"><%= qihao%></span>开奖中：</b><% _.forEach(nums, function(num) { %><span class="fc-3 mlr5"><%- num %></span><% }); %></p><div class="third-box clearfix"><ul class="pull-left third-hisnum" id="j-kjing-num"><li class="kj-num-first">' + rf + '</li><li>' + rf + '</li><li>' + rf + '</li></ul></div>');

      $('#j-kj-box').html(html(o));

      return;
    }

    // 倒计时
    if (K3.currentKjStatus === 3) {

      beforeQi = obj.item[1];
      obj.nums = beforeQi.kjhm;
      xt = getNumsXt(obj.nums);

      o.xt = xt;
      o.nums = obj.nums;

      if (obj.nums) {
        f = formatCard(o.nums.split(' '));
      } else {
        f = '<b>等待开奖</b>';
      }

      o.time = secondFormat(obj.lessTime).join(':');

      html = _.template('<p class="third-hd fs-12">第<span class="mlr5">' + beforeQi.no + '</span>期开奖号码：' + f + '</p><div class="third-timer"><h5>第<b class="mlr5 fc-3"><%= qihao%></b>期等待开奖：</h5><p class="thired-timer-sp"><i class="icon icon-k303"></i><span id="j-wait-time"><%= time%></span></p></div>');

      K3.waitEndTime = obj.lessTime;
      K3.waitStartTime = obj.lessTime;

      runWaitTimeAnimate();
      $('#j-kj-box').html(html(o));

      return;
    }

    if (K3.currentKjStatus === 4) {

      beforeQi = obj.item[1];
      obj.nums = beforeQi.kjhm;
      xt = getNumsXt(obj.nums);

      o.xt = xt;
      o.nums = obj.nums;

      if (obj.nums) {
        f = '<br>形态: ' + o.xt;
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
      html = _.template('<p class="third-hd fs-12">第<span class="mlr5">' + beforeQi.no + '</span>期开奖号码：' + formatCard(o.nums.split(' ')) + ' ' + f + '</p><div class="third-box clearfix"><p class="wait-p1">第<span class="fc-3 mlr5"><%= qihao%></span>期</p><p class="wait-p2 fs-yh">' + d + '</p></div>');

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

    var x = [];
    var c = '';

    if (nums && nums.length > 0) {

      var n0 = Number(nums[0].slice(1));
      var n1 = Number(nums[1].slice(1));
      var n2 = Number(nums[2].slice(1));
      var nArr = [n0, n1, n2];

      nArr.sort(function (a, b) {
        return a - b;
      });

      if (nums[0].slice(0, 1) === nums[1].slice(0, 1) && nums[1].slice(0, 1) === nums[2].slice(0, 1)) {

        x.push('同花');

        if ((nArr[0] + nArr[2]) === (nArr[1] * 2) && (nArr[0] + 1) === nArr[1]) {
          x = [];
          x.push('同花顺');
        }

      } else {
        if ((nArr[0] + nArr[2]) === (nArr[1] * 2) && (nArr[0] + 1) === nArr[1]) {
          x.push('顺子');
        }
      }

      if (nArr[0] === nArr[1] && nArr[1] === nArr[2]) {

        x.push('豹子');

      } else {

        if (nArr[0] === nArr[1] || nArr[1] === nArr[2] || nArr[0] == nArr[2]) {

          x.push('对子');

        }

      }

    } else {

      x = '';

    }

    return x;
  }

});