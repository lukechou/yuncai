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
      }
    };

    return K3;
  }());

  K3.updateBottomUi = function () {

  };

  K3.createOneNote = function (o) {

    var _this = this;

    // 组织html 添加到 列表
    var obj = {
      title: _this.playName[o.playType],
      nums: o.nums,
      money: o.money,
      zid: o.zid
    };

    var compiled = _.template('<div data-zid="<%= zid%>" class="br-zhu-item clearfix"><b>[<%= title%>]</b><div class="list"><% _.forEach(nums, function(num) { %><span><%- num %></span><% }); %></div><div class="pull-right"><b><i class="money"><%= money%></i>元</b><a href="javascript:;" class="br-zhu-del">删除</a></div></div>');

    var html = compiled(obj);

    $('#code_list').append(html);

    // 更新底部金额部分

    // 清楚选中区选中状态
    _this.cleanNumBtn();

    if (_this.playType === 'b0') {
      _this.createHzAsBtn();
    }

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

    var a = {
      'b0': [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
    };
    var nums = [];
    var s = _.sample(a[_this.playType]);

    if (_.isArray(s)) {
      nums = s;
    } else {
      nums.push(s);
    };

    var obj = {
      zid: _.uniqueId(),
      nums: nums,
      money: 2,
      playType: _this.playType,
    };

    // 投注号码存储
    _this.saveNumsObj(obj);

    // 创建投注html并插入buybox
    _this.createOneNote(obj);

  };

  K3.getChooseToBuy = function () {

    var _this = this;

    var activeNumEl = $('#j-area-' + _this.playType + ' .j-num-btn.active');
    var arr = [];

    var obj = {
      zid: _.uniqueId(),
      nums: null,
      money: null,
      playType: null,
    };

    // 获取投注号码

    // 和值
    activeNumEl.each(function (index, el) {
      arr.push(~~($(this).attr('data-num')));
    });

    obj.nums = arr;
    obj.money = _this.chooseMoney;
    obj.playType = _this.playType;

    // 投注号码存储
    _this.saveNumsObj(obj);

    // 创建投注html并插入buybox
    _this.createOneNote(obj);

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

  K3.updateMidTotal = function () {

    var _this = this;

    if (_this.playType === 'b0') {

      var l = $('#j-area-' + _this.playType + ' .j-num-btn.active').length;

      _this.chooseZhushu = l;
      _this.chooseMoney = l * 2;

    }

    $('#choose_zhushu').html(_this.chooseZhushu);
    $('#choose_money').html(_this.chooseMoney);

    K3.updateChooseToBuyBtn();

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

  };

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

  $('#buy_type').on('click', 'li', function (event) {
    event.preventDefault();
    $('#buy_type li .icon').removeClass('icon-y2');

    $(this).find('.icon').addClass('icon-y2');
  });

  // toggle buyLoty Tips Box
  $('#j-touzhu-tips').on('click', function (event) {

    $('#j-touzhu-tipstext').toggle();
    $(this).find('.icon').toggleClass('icon-bup').toggleClass('icon-bdown');

  });

});