/*
 *
 *  QUEUE  组合计算 取得排列的数目
 *  BALLNUM  号码组
 *  SEEDS  彩种
 *  COMMON  通用组件
 *  ZHUI    追号模块
 *  Config    全局配置对象
 *
 */
var QUEUE = {};
var COMMON = {};
var MANUAL = {};
var DRAG = {};
var SEEDS = {};
var ZHUI = {};
var Config = {
  maxBeiShu: 9999,
  maxQiShu: 154,
  maxZhuShu: 100
};
var DEBUG = false;

var qiuckSet = ''; // -常规 修改当前注
var tuoDanSet = ''; // -拖胆 修改当前注

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
  blueMax: 12,
  redTotal: 5,
  blueTotal: 2,
};

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
/**
 * onSubmitDone 彩票购买提交成功回调事件
 * @type {[type]}
 */
COMMON.onSubmitDone = function(retCode, retMsg) {
  if (retCode == 100000) {
    APP.showTips('投注成功！')
  } else {
    APP.handRetCode(retCode, retMsg)
  }
}

COMMON.onSubmitFail = function(retCode, retMsg) {
  APP.showTips('服务器错误,投注失败!')
}

COMMON.onSubmitInit = function(params) {

  if (params.zhushu == 0) {
    return true;
  } else {
    return false;
  }
}

/**
 * [getCommonParams 购买彩票,获取要提交的参数]
 * @param  {} el [.box-left 对象]
 * @return {}    [彩票提交必须参数]
 */
COMMON.getCommonParams = function(el) {

  var params = {
    lotyName: $('#lotyName').val(),
    playName: $('#playName').val(),
    unikey: $('#unikey').val(),
    qihaoId: $('#qihaoId').val(),
    qihao: $('#qihao').val(),
    zhushu: el.find('.j-quick-zhu').html(),
    beishu: el.find('.j-quick-bei').val(),
    codes: COMMON.formarFormSub(el.find('.br-gou .br-zhu-item'))
  };
  return params;
}

/**
 * [showTips 拟态框]
 * @param  {String} h tips's HTML
 * @return {null}
 */
COMMON.showTips = function(h) {

  if (!$('#myModal')[0]) {
    var html = '<div class="friend-modal modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">友情提示</h4></div><div class="modal-body text-center fc-84" id="app-content"></div></div></div>';
    $('body').append(html)
  }

  $('#tip-content').html(h)
  $('#myModal').modal('show')
}

/**
 * [sortNum 号码排序]
 * @param  {Array} num Sort Array
 * @return {Array}
 */
COMMON.sortNum = function(num) {
  return num.sort(function(a, b) {
    return a - b;
  });
}

/**
 * [clearAllBallActive 清除所有球的选中状态]
 * @param  {Object} el Ball-Aear
 * @return {null}
 */
COMMON.clearAllBallActive = function(el) {
  el.find('.active').removeClass();
}

// 页尾统计 加减输入框 change
COMMON.updateCount = function(m, c) {
  var v = parseInt(m.val(), 10);
  if (c == 1) {
    v++;
  } else {
    v--;
  }
  v = (v >= 1) ? v : 1;
  m.val(v);
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

// 检测 选球区
COMMON.checkBallGroup = function(g) {

  // check select ball for toggle add button status
  var p = g.parents('.box-left');
  var rLen = parseInt(p.find('.ball_red li.active').length),
    bLen = parseInt(p.find('.ball_blue li.active').length),
    x = 0,
    y = 0,
    t = 0;

  if (rLen >= SEEDS[lotyName].redTotal && bLen >= SEEDS[lotyName].blueTotal) {
    x = QUEUE.getACTotalNum(rLen, SEEDS[lotyName].redTotal, 'C');
    y = QUEUE.getACTotalNum(bLen, SEEDS[lotyName].blueTotal, 'C');
    t = x * y;
    p.find('.btn-add').addClass('active');
  } else {
    p.find('.btn-add').removeClass('active');
  }

  COMMON.updateQuickZhu(rLen, bLen, t, t * 2, p);
}

/************** DRAG **************/
//拖胆获取一个区域选中的号码
DRAG.getTuodanNum = function(item) {
  var arr = [];
  item.find('a.active').each(function(index, el) {
    arr.push(el.innerHTML);
  });
  return arr;
}

// 选中一个区域部分球
DRAG.createOneTuodanBall = function(nums, el) {
  COMMON.clearAllBallActive(el);

  for (var i = 0; i < nums.length; i++) {
    rnum = parseInt(nums[i]) - 1;
    el.find('a').eq(rnum).addClass('active');
  };
}

// 检测拖胆选球区
DRAG.checkBallAear = function() {

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

/************** MANUAL **************/
// MANUAL 设置上方 注数 金额 统计
MANUAL.totalSdNums = function() {

  var str = $.trim($('#sd_number').val());
  var l = 0;
  if (str !== '') {
    l = str.split(/\n/g).length;
  }
  $('#sd-tip-zhu').html(l);
  $('#sd-tip-total').html(l * 2);
  if(l){
    $('#sd_sub').addClass('active')
  }else{
    $('#sd_sub').removeClass('active')
  }

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

// 检测手动输入注
MANUAL.checkSdZhu = function(str, typeNums, len) {

  var nums = str.split(',')

  if (nums.length == len && _.uniq(nums).length == len) {
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

        if (MANUAL.checkSdZhu(l[0], SEEDS[lotyName].redBall, SEEDS[lotyName].redTotal) && MANUAL.checkSdZhu(l[1], SEEDS[lotyName].blueBall, SEEDS[lotyName].blueTotal)) {

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
ZHUI.getNewHtml = function(el) {
  // Ajax 获取 期数
  var num = parseInt(el.parents('.box-left').find('.zh_issue_num').val());
  num = (num < 10) ? 10 : num;
  $.ajax({
      url: '/lottery/digital/query-track-issue/' + lotyName,
      type: 'get',
      dataType: 'json',
      data: {
        num: num
      },
    })
    .done(function(data) {
      if (data) {
        var html = ''
        var DATA = data.retData;
        for (var i = 0; i < DATA.length; i++) {
          html += '<tr><td>' + (i+1) + '</td><td><input type="checkbox" class="br-zhui-c" data-qihaoId="' + DATA[i]['id'] + '" data-qi="' + DATA[i]['qihao'] + '" checked>' + DATA[i]['qihao'] + '期</td><td><input type="text" class="br-input br-zhui-bei" value="1">倍</td><td><span class="j-money">10</span>元</td><td>' + DATA[i]['awardTime'].slice(0,10)+'<span class="ml15">'+DATA[i]['awardTime'].slice(10) + '</span></td></tr>';
        };
        var zhui = el.parents('.br-details').find('.br-zhui');
        zhui.find('.br-zhui-list tbody').html(html);
        ZHUI.bindZhuiHaoEvent();
        ZHUI.setZhuiHaoTotal(el.parents('.box-left'));
      }
      console.log("success");
    })
    .fail(function() {
      console.log("error");
    });
};

// 更新合买 总金额
ZHUI.setHeMaiTotal = function(box) {
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

  if (box.find('.j-baodi-check')[0].checked && (m != 0)) {
    box.find('.j-baodi-text')[0].disabled = false;
    b = parseInt(box.find('.j-baodi-text').val()) || 0
    if (b == 0) {
      if( (rengouMoney/m) < 0.8 ){
        baodiMoney = Math.ceil(m * 0.2);
        baodiPercent = (baodiMoney / m * 100).toFixed(2);
      }else{
        baodiMoney = m - rengouMoney
        baodiPercent = (baodiMoney / m * 100).toFixed(2)
      }
    } else {
      if ((b + rengouMoney) < m) {
        if ((b / m) < 0.2) {
          if((Math.ceil(m * 0.2)+rengouMoney)>m){
            baodiMoney = m - rengouMoney
            baodiPercent = (baodiMoney / m * 100).toFixed(2)
          }else{
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
    box.find('.j-baodi-text')[0].disabled = true;
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
ZHUI.bindZhuiHaoEvent = function() {
  $('.br-details thead .br-zhui-c').on('change', function(event) {
    var checked = $(this)[0].checked;
    $(this).parents('.br-details').find('tbody .br-zhui-c').each(function(index, el) {
      el.checked = checked;
    });
    ZHUI.setZhuiHaoTotal($(this).parents('.box-left'));
  });
  $('.br-details tbody .br-zhui-c').on('change', function(event) {
    ZHUI.setZhuiHaoTotal($(this).parents('.box-left'));
  });

  $('.br-details thead .br-zhui-bei').on('change', function(event) {

    var val = parseInt($(this).val())||1;
    if(isNaN(val)){
      val = 1
    }else{
      if(val <1){
        val =1;
      }else{
        val = Math.ceil(val);
      }
    }
    if(val>9999){
      val = 9999;
    }
    $(this).val(val);
    $(this).parents('.br-details').find('tbody .br-zhui-bei').val(val);
    ZHUI.setZhuiHaoTotal($(this).parents('.box-left'));
  });


  $('.br-details tbody .br-zhui-bei').on('change', function(event) {
    var val = parseInt($(this).val())||1;
    if(isNaN(val)){
      val = 1
    }else{
      if(val <1){
        val =1;
      }else{
        val = Math.ceil(val);
      }
    }
    if(val>9999){
      val = 9999;
    }
    $(this).val(val);
    ZHUI.setZhuiHaoTotal($(this).parents('.box-left'));
  });

  $('.br-details .end_min_money').on('change', function(event) {
    var val = parseInt($(this).val())||1;
    if(isNaN(val)){
      val = 1
    }else{
      if(val <1){
        val =1;
      }else{
        val = Math.ceil(val);
      }
    }
    $(this).val(val);
  });

};

// 绑定合买相关事件
ZHUI.bindHeMaiEvent = function() {
  $('.j-rengou').on('change', function(event) {
    ZHUI.setHeMaiTotal($(this).parents('.box-left'));
  });
  $('.br-select').on('change', function(event) {
    ZHUI.setHeMaiTotal($(this).parents('.box-left'));
  });
  $('.j-baodi-check').on('change', function(event) {
    ZHUI.setHeMaiTotal($(this).parents('.box-left'));
  });
  $('.j-baodi-text').on('change', function(event) {
    ZHUI.setHeMaiTotal($(this).parents('.box-left'));
  });

  $('.br-textarea').on('focus', function(event) {
    if($(this).attr('data-r')==0){
      $(this).parents('.box-left').find('.j-btext-total').html(0)
      $(this).val('')
      $(this).attr('data-r', 1)
    }
  });
  $('.br-textarea').on('keypress', function(event) {

    var len = $(this).val().length
    var size = parseInt($(this).attr('data-size'))||20;

    if(len<=size){
     $(this).parents('.box-left').find('.j-btext-total').html(len)
    }else{
     $(this).val($(this).val().slice(0,(size-1)))
     $(this).parents('.box-left').find('.j-btext-total').html(size)
    }

  });

  $('.j-project-title').on('focus', function(event) {

    if($(this).attr('data-r')==0){
      $(this).parents('.box-left').find('.j-ctext-total').html(0)
      $(this).val('')
      $(this).attr('data-r', 1)
    }

  });

  $('.j-project-title').on('keypress', function(event) {

    var len = $(this).val().length
    var size = parseInt($(this).attr('data-size'))||20;

    if(len<=size){
     $(this).parents('.box-left').find('.j-ctext-total').html(len)
    }else{
     $(this).val($(this).val().slice(0,(size-1)))
     $(this).parents('.box-left').find('.j-ctext-total').html(size)
    }

  });
};

// 更新追号 总金额
ZHUI.setZhuiHaoTotal = function(box) {

  // 更新金额
  var m = box.find('.j-quick-total').html() * 1;
  box.find('.br-details tbody .br-zhui-bei').each(function(index, el) {
    box.find('.br-details tbody .j-money')[index].innerHTML = el.value * m;
  });
  var checkedList = box.find('.br-details tbody .br-zhui-c:checked')
  var money = 0;
  box.find('.br-details tbody .br-zhui-c:checked').parents('tr').find('.j-money').each(function(index, el) {
    money += parseInt(el.innerHTML);
  });
  //更新 购买期数 和 追期购买总金额
  box.find('.j-qi-count').html(checkedList.length)
  box.find('.j-qi-money').html(money)
};