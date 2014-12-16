var BALLDATA = {};
var BALLNUM = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35'];
BALLDATA.red = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35'];
BALLDATA.blue = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];


// 页尾统计 投注总额
COMMON.setZhuTotal = function(r, el) {
  // r:1 - 快捷投注
  // r:2 - 多期投注
  // e - 来源
  var p = el.parents('.box-left'),
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
  ZHUI.setZhuiHaoTotal(p);
  ZHUI.setHeMaiTotal(p);
}

// 拖胆列表注数格式化 for 表单提交
COMMON.tuodanFormarFormSub = function(items) {

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

    if(blueDan.length == 0){
      list.push( redDan.join(',') + '@' + redTuo.join(',') + '|' + blueTuo.join(','));
    }else{
      list.push( redDan.join(',') + '@' + redTuo.join(',') + '|' + blueDan.join(',') + '@' + blueTuo.join(','));
    }

  };
  return list.join('$');
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

//常规 中间提示更新
COMMON.updateQuickZhu = function(a, b, c, d, p) {
  p.find('.j-quick-hd-qnum').html(a);
  p.find('.j-quick-hd-hnum').html(b);
  p.find('.j-quick-hd-zhu').html(c);
  p.find('.j-quick-hd-total').html(d);
}

/**************MANUAL**************/

// 返回一注List HTML
MANUAL.getListHTML = function(r, b, m, h) {

  var li = '';

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

/*****************DRAG***************/

// 拖胆随机获得拖码区 多个号码
DRAG.randomTuodanNum = function(num, co, len) {


  var n = BALLDATA[co].concat();
  for (var i = 0; i < num.length; i++) {
    n = _.without(n, num[i]);
  };
  return _.sample(n, len);
}

// 获取选中球 和 选中球生成的注数
DRAG.getTuodanBallZhu = function() {

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

  var li = '';
  if (!h) {
    li += '<div class="br-zhu-item clearfix">';
  }

  li += '<b>[快捷投注]</b><div class="list">';

  if(rd.length>0) li +='(';
  for (var i = 0; i < rd.length; i++) {
    li += '<span data-s="0">' + rd[i].innerHTML + '</span>';
  };
  if(rd.length>0) li +=')';

  for (var i = 0; i < rt.length; i++) {
    li += '<span data-s="1">' + rt[i].innerHTML + '</span>';
  };

  if(bd.length>0) li +='<span class="fc-5">(</span>';
  for (var i = 0; i < bd.length; i++) {
    li += '<span class="fc-5" data-s="2">' + bd[i].innerHTML + '</span>';
  };
  if(bd.length>0) li +='<span class="fc-5">)</span>';

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

  $('#numtuo1').html(zhu.rDans + zhu.rTuos);
  $('#numtuo2').html(zhu.rDans);
  $('#numtuo3').html(zhu.rTuos);
  $('#numtuo4').html(zhu.bDans + zhu.bTuos);
  $('#numtuo5').html(zhu.bDans);
  $('#numtuo6').html(zhu.bTuos);
  $('#numtuo7').html(zhu.total);
  $('#numtuo8').html(zhu.total * 2);
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

