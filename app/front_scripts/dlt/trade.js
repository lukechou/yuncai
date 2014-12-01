/*
 *
 *  QUEUE  组合计算 取得排列的数目
 *  DEBUG
 *  BALLNUM  号码组
 *  SEEDS  彩种
 *  COMMON  通用组件
 *
 */
var QUEUE = {};
var COMMON = {};
var MANUAL = {};
var DRAG = {};
var SEEDS = {};
var DEBUG = false;
var BALLNUM = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35'];



var BALLDATA = {};
BALLDATA.red = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35'];
BALLDATA.blue = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

/**************QUEUE*************/
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
  }
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
}


/****************COMMON****************/
// 拟态框
COMMON.showTips = function(h) {
  $('#tip-content').html(h);
  $('#myModal').modal('show');
}

// 号码排序
COMMON.sortNum = function(num) {
  return num.sort(function(a, b) {
    return a - b;
  });
}

//  清除所有球的选中状态
COMMON.clearAllBallActive = function(el) {
  el.find('.active').removeClass();
}

// 页尾统计 加减输入框 change
COMMON.updateCount = function(m, c) {
  var v = parseInt(m.val());
  if (c == 1) {
    v++;
  } else {
    v--;
  }
  v = (v && v >= 1) ? v : 1;
  m.val(v);
  console.log('加减输入框CHANGE');
}


// 页尾统计 投注总额
COMMON.setZhuTotal = function(r, el) {
  // r:1 - 快捷投注
  // r:2 - 多期投注
  // e - 来源
  var p = el.parents('.br-gou'),
    m = [],
    total = 0;
  r = parseInt(r);

  switch (r) {
    case 1:
      {
        m.push(parseInt(p.find('.j-quick-zhu').html()));
        m.push(parseInt(p.find('.j-quick-bei').val()));
        m.push(parseInt(p.find('.j-quick-qi').val()));
        total = m[0] * m[1] * m[2] * 2;
        p.find('.j-quick-total').html(total);
      };
      break;
    case 2:
      {
        m.push(parseInt($('#j-more-zhu').val()));
        m.push(parseInt($('#j-more-bei').val()));
        m.push(parseInt($('#j-more-qi').val()));
        $('#j-more .j-more').each(function(index, el) {
          el.innerHTML = m[index];
        });
        total = m[0] * m[1] * m[2] * 2;
        $('#j-more-total').html(total);
      };
      break;
    default:
      console.log('Some things error!');
      return;
      break;
  }
  console.log('页尾统计更新');
}

// 更新统计注数
COMMON.updateTotalZhu = function(t) {

  var p = t.parents('.box-left');
  var s = 0;

  p.find('.money').each(function(index, el) {
    s += parseInt(el.innerHTML);
  });

  p.find('.j-quick-zhu').html(s / 2);

  COMMON.setZhuTotal(1, t);

  console.log('更新统计注数');
}

// 随机产生任意注 List HTML
COMMON.getManyZhu = function(len) {

  var html = '';
  for (var i = 0; i < len; i++) {
    var r = COMMON.sortNum(_.sample(BALLDATA.red, 5));
    var b = COMMON.sortNum(_.sample(BALLDATA.blue, 2));
    html += this.getOneZhu(r, b);
  }
  console.log('随机产生任意' + len + '注List HTML');
  return html;
}

// 返回一注 List HTML
COMMON.getOneZhu = function(r, b, m, h) {

  var li = '';
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
    li += '<div class="pull-right"><b><i class="money">' + m + '</i>元</b>';
  } else {
    li += '<div class="pull-right"><b><i class="money">2</i>元</b>';
  }

  li += '<a href="javascript:;" class="br-zhu-set">修改</a><a href="javascript:;" class="br-zhu-del">删除</a></div>';

  if (!h) {
    li += '</div>';
  }

  return li;
}

// 常规 添加一注的球样式
COMMON.createOneZhuBall = function(r, b, el) {

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


// 随机选取N个球
COMMON.randomNum = function(el, type, l) {
  var len = parseInt(l);
  var arr = _.sample(BALLDATA[type], len);
  el.find('.active').removeClass();
  for (var i = 0; i < arr.length; i++) {
    el.find('li').eq(arr[i] - 1).addClass('active');
  };
}

// 从列表获取一注号码
COMMON.getItemNum = function(item) {
  if (DEBUG) debugger;
  var arr = {
    red: [],
    blue: []
  };
  item.find('span').each(function(index, el) {
    if (el.className) {
      arr.blue.push(el.innerHTML);
    } else {
      arr.red.push(el.innerHTML);
    }
  });
  return arr;
}

// 列表注数格式化 for 表单提交
COMMON.formarFormSub = function(items) {

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

// 检测 选球区
COMMON.checkBallGroup = function(g) {

  if (DEBUG) debugger;

  // check select ball for toggle add button status
  var p = g.parents('.box-left');
  var rLen = parseInt(p.find('.ball_red li.active').length),
    bLen = parseInt(p.find('.ball_blue li.active').length),
    x = 0,
    y = 0,
    t = 0;

  if (rLen > 0 || bLen > 0) {
    p.find('.btn-add').addClass('active');
  } else {
    p.find('.btn-add').removeClass('active');
  }
  if (rLen >= 5 && bLen >= 2) {
    x = QUEUE.getACTotalNum(rLen, 5, 'C');
    y = QUEUE.getACTotalNum(bLen, 2, 'C');
    t = x * y;
  }

  COMMON.updateQuickZhu(rLen, bLen, t, t * 2, p);
}

//常规 中间提示更新
COMMON.updateQuickZhu = function(a, b, c, d, p) {
  p.find('.j-quick-hd-qnum').html(a);
  p.find('.j-quick-hd-hnum').html(b);
  p.find('.j-quick-hd-zhu').html(c);
  p.find('.j-quick-hd-total').html(d);
}


/**************MANUAL**************/
// MANUAL 设置上方 注数 金额 统计
MANUAL.totalSdNums = function() {

  var str = $.trim($('#sd_number').val());
  var l = 0;
  if (str !== '') {
    l = str.split(/\n/g).length;
  }
  $('#sd-tip-zhu').html(l);
  $('#sd-tip-total').html(l * 2);
}

// MANUAL 设置下方 注数 金额 统计
MANUAL.setSdTotal = function() {
  var t = 0;
  $('#sd-list').find('.money').each(function(index, el) {
    t += parseInt(el.innerHTML);
  });
  $('#sd-tip-zhu2').html(t / 2);
  $('#sd-tip-total2').html(t);
}

// MANUAL 字符串分解 成红球 篮球
MANUAL.relovStr = function(str) {

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

// 返回一注List HTML
MANUAL.getListHTML = function(r, b, m, h) {

  var li = '';

  if (!h) {
    li += '<div class="br-zhu-item clearfix">';
  }

  li += '<b>[单式上传]</b><div class="list">';

  for (var i = 0; i < r.length; i++) {
    li += '<span>' + r[i] + '</span>';
  };

  for (var i = 0; i < b.length; i++) {
    li += '<span class="fc-5">' + b[i] + '</span>';
  };

  li += '</div>';

  if (m) {
    li += '<div class="pull-right"><b><i class="money">' + m + '</i>元</b>';
  } else {
    li += '<div class="pull-right"><b><i class="money">2</i>元</b>';
  }

  li += '<a href="javascript:;" class="br-zhu-del">删除</a></div>';

  if (!h) {
    li += '</div>';
  }

  return li;
}

// 检测手动输入注
MANUAL.checkSdZhu = function(nums, typeNums, len) {
  if (nums.length == len) {
    for (var i = 0; i < nums.length; i++) {
      if (!_.find(typeNums, function(num) {
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
MANUAL.sdFormat = function(str) {

  var type = [5, 2],
    l1 = '',
    l2 = '';
  var zhus = {};
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

        l1 = _.uniq(l[0].split(','));
        l2 = _.uniq(l[1].split(','));

        if (MANUAL.checkSdZhu(l1, BALLDATA.red, type[0]) && MANUAL.checkSdZhu(l2, BALLDATA.red, type[1])) {

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



/*****************DRAG***************/
//拖胆获取一个区域选中的号码
DRAG.getTuodanNum = function(item) {
  if (DEBUG) debugger;
  var arr = [];
  item.find('a.active').each(function(index, el) {
    arr.push(el.innerHTML);
  });
  return arr;
}

// 拖胆随机获得拖码区 多个号码
DRAG.randomTuodanNum = function(num, co, len) {
  if (DEBUG) debugger;

  var n = BALLDATA[co].concat();
  for (var i = 0; i < num.length; i++) {
    n = _.without(n, num[i]);
  };
  return _.sample(n, len);
}

// 选中一个区域部分球
DRAG.createOneTuodanBall = function(nums, el) {
  if (DEBUG) debugger;
  COMMON.clearAllBallActive(el);

  for (var i = 0; i < nums.length; i++) {
    rnum = parseInt(nums[i]) - 1;
    el.find('a').eq(rnum).addClass('active');
  };
}

// 获取选中球 和 选中球生成的注数
DRAG.getTuodanBallZhu = function() {
  if (DEBUG) debugger;
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


  //console.log(rDan, bDan, rTuo, bTuo, min);

  // total zhu
  if (arr.rDans == 0) {
    arr.code = -1;
  } else {
    if (r >= 5 && b >= 2) {
      x = QUEUE.getACTotalNum(arr.rTuos, 5 - arr.rDans, 'C');
      if (arr.bDans == 1) {
        y = arr.bTuos;
      } else {
        y = QUEUE.getACTotalNum(arr.bTuos, 2, 'C')
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
DRAG.addOneTuoZhu = function(rd, rt, bd, bt, m, h) {
  if (DEBUG) debugger;
  var li = '';
  if (!h) {
    li += '<div class="br-zhu-item clearfix">';
  }

  li += '<b>[快捷投注]</b><div class="list">';

  for (var i = 0; i < rd.length; i++) {
    li += '<span data-s="0">' + rd[i].innerHTML + '</span>';
  };

  for (var i = 0; i < rt.length; i++) {
    li += '<span data-s="1">' + rt[i].innerHTML + '</span>';
  };

  for (var i = 0; i < bd.length; i++) {
    li += '<span class="fc-5" data-s="2">' + bd[i].innerHTML + '</span>';
  };
  for (var i = 0; i < bt.length; i++) {
    li += '<span class="fc-5" data-s="3">' + bt[i].innerHTML + '</span>';
  };

  li += '</div>';

  if (m) {
    li += '<div class="pull-right"><b><i class="money">' + m + '</i>元</b>';
  } else {
    li += '<div class="pull-right"><b><i class="money">2</i>元</b>';
  }

  li += '<a href="javascript:;" class="br-zhu-set">修改</a><a href="javascript:;" class="br-zhu-del">删除</a></div>';

  if (!h) {
    li += '</div>';
  }

  return li;
}

// 更新投注中间提示
DRAG.updateTuoTips = function(zhu) {
  if (DEBUG) debugger;
  $('#numtuo1').html(zhu.rDans + zhu.rTuos);
  $('#numtuo2').html(zhu.rDans);
  $('#numtuo3').html(zhu.rTuos);
  $('#numtuo4').html(zhu.bDans + zhu.bTuos);
  $('#numtuo5').html(zhu.bDans);
  $('#numtuo6').html(zhu.bTuos);
  $('#numtuo7').html(zhu.total);
  $('#numtuo8').html(zhu.total * 2);
}

// 检测拖胆选球区
DRAG.checkBallAear = function() {
  if (DEBUG) debugger;

  // 获取 选球区状态
  var zhu = DRAG.getTuodanBallZhu();

  if (zhu.rDans > 0 || zhu.bDans > 0 || zhu.rTuos > 0 || zhu.bTuos > 0) {
    $('#tuo-sub').addClass('active');
  } else {
    $('#tuo-sub').removeClass('active');
  }

  // 更新Tips View
  DRAG.updateTuoTips(zhu);

}

// 从列表一项获取一注号码
DRAG.getOneListNums = function(el) {

  var arr = {
    rd: [],
    rt: [],
    dd: [],
    dt: []
  };
  var n = ['rd', 'rt', 'dd', 'dt'];

  for (var i = 0; i < 4; i++) {
    el.find('span[data-s="' + i + '"]').each(function(index, el) {
      arr[n[i]].push(el.innerHTML);
    });
  };

  return arr;
}



/****************Bind Other Tabs Toggle Event****************/
$(function() {

  // Quick, senior toggle
  $('#br-hd-group a').on('click', function(event) {
    event.preventDefault();
    /* Act on the event */
    if ($(this).hasClass('active')) {
      return;
    } else {
      $('#br-hd-group .active').removeClass('active');

      var t = parseInt($(this).attr('data-t'));
      if (t) {
        $('#quick').addClass('hidden');
        $('#senior').removeClass('hidden');
      } else {
        $('#senior').addClass('hidden');
        $('#quick').removeClass('hidden');
      }

      $(this).addClass('active');
      return;
    }
  });

  // br-type icon toggle
  $('.j-br-type a[data-toggle="tab"]').on('click', function(e) {
    $('.j-br-type .icon-y2').removeClass('icon-y2');
    $(this).find('.icon').addClass('icon-y2');
  });

  // 方案设置
  $('.br-set-group').on('click', '.br-set', function(event) {
    event.preventDefault();
    /* Act on the event */
    $(this).siblings('.active').removeClass('active');
    $(this).addClass('active');
  });

  // 右侧栏选项框
  $('.tab-cut').on('mouseover', 'li', function(event) {
    event.preventDefault();
    /* Act on the event */
    $('#lr_tab li.on').removeClass('on');
    $(this).addClass('on');
    var c = $('#lr_content .tab-con');
    c.hide();
    c.eq($(this).index()).show();
  });


});