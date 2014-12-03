/********** 追号模块 **************/
var ZHUI = {};

ZHUI.getNewHtml = function(el) {
  // Ajax 获取 期数
  var num = parseInt(el.parents('.box-left').find('.zh_issue_num').val());
  num = (num < 10) ? 10 : num;
  $.ajax({
      url: 'http://kp2.yuncai.com/lottery/digital/query-track-issue/dlt',
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
          html += '<tr><td>' + i + '</td><td><input type="checkbox" class="br-zhui-c" data-qihaoId="' + DATA[i]['id'] + '" data-qi="' + DATA[i]['qihao'] + '" checked>' + DATA[i]['qihao'] + '期</td><td><input type="text" class="br-input br-zhui-bei" value="1">倍</td><td><span class="j-money">10</span>元</td><td>' + DATA[i]['awardTime'] + '</td></tr>';
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
    var val = $(this).val();
    $(this).parents('.br-details').find('tbody .br-zhui-bei').val(val);
    ZHUI.setZhuiHaoTotal($(this).parents('.box-left'));
  });
  $('.br-details tbody .br-zhui-bei').on('change', function(event) {
    ZHUI.setZhuiHaoTotal($(this).parents('.box-left'));
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
};
// 更新合买 总金额
ZHUI.setHeMaiTotal = function(box) {
    debugger
    // 获取购买金额
    var m = box.find('.j-quick-total').html() * 1;
    //认购金额
    var rengouMoney = box.find('.j-rengou').val() * 1 || 1;
    //我要提成
    var ticheng = box.find('.br-select').val() * 1 || 0;
    // 对比 认购百分比 和 我要提成
    if (ticheng < (rengouMoney / m * 100)) {} else {
      rengouMoney = Math.ceil(ticheng * 0.01 * m);
    }
    //我要保底金额
    var baodiMoney = '';
    var baodiPercent = '';
    var b = '';

    if (box.find('.j-baodi-check')[0].checked && m != 0) {
      b = parseInt(box.find('.j-baodi-text').val()) | 0
      if (b == 0) {
        baodiMoney = Math.ceil(m * 0.2);
        baodiPercent = (baodiMoney / m * 100).toFixed(2);
      } else {
        if ((b + rengouMoney) < m) {
          baodiMoney = b
          baodiPercent = (baodiMoney / m * 100).toFixed(2)
        } else {
          baodiMoney = m - rengouMoney
          baodiPercent = (baodiMoney / m * 100).toFixed(2)
        }
      }
    } else {
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
    debugger
  }
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

/**
 * Bind ZhuiHao And HeMai Module
 *
 */
$(function() {
  $('.zh_issue_num').on('change', function(event) {
    event.preventDefault();
    ZHUI.getNewHtml($(this));
  });
  $('.br-details').on('click', '.br-zhui-btn', function(event) {
    ZHUI.getNewHtml($(this));
  });
  $('.br-details').on('click', '.br-he-btn', function(event) {
    ZHUI.setHeMaiTotal($(this).parents('.box-left'));
  });
  ZHUI.bindHeMaiEvent();
});

/****************Bind Other Tabs Toggle Event ****************/
$(function() {
  // Quick, senior toggle
  $('#br-hd-group a').on('click', function(event) {
    event.preventDefault(); /* Act on the event */
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
    var li = $(this).parents('li'),
      qi = $(this).parents('.box-left').find('.j-qi-box'),
      he = $(this).parents('.box-left').find('.j-he-box'),
      buyType = parseInt(li.attr('data-buytype'));

    switch (buyType) {
      case 1:
        qi.addClass('hide');
        he.addClass('hide');
        break;
      case 2:
        qi.removeClass('hide');
        he.addClass('hide');
        break;
      case 3:
        he.removeClass('hide');
        qi.addClass('hide');
        break;
    }
    $(this).parents('.j-br-type').find('.icon-y2').removeClass('icon-y2');
    $(this).find('.icon').addClass('icon-y2');
  });
  // 方案设置
  $('.br-set-group').on('click', '.br-set', function(event) {
    event.preventDefault(); /* Act on the event */
    $(this).siblings('.active').removeClass('active');
    $(this).addClass('active');
  });
  // 右侧栏选项框
  $('.tab-cut').on('mouseover', 'li', function(event) {
    event.preventDefault(); /* Act on the event */
    $('#lr_tab li.on').removeClass('on');
    $(this).addClass('on');
    var c = $('#lr_content .tab-con');
    c.hide();
    c.eq($(this).index()).show();
  });


  // 快捷投注 - 提交请求
  $('#qiuck-sub').on('click', function(event) {
    event.preventDefault();
    var box = $(this).parents('.box-left');
    var params = COMMON.getCommonParams(box);
    params.qishu = box.find('.j-quick-qi').val();
    debugger;
    $.ajax({
        url: '/lottery/digital/buy-self/' + params.lotyName + '/' + params.playName,
        type: 'post',
        dataType: 'json',
        data: params,
      })
      .done(function() {
        APP.showTips('投注成功！');
      })
      .fail(function() {
        APP.showTips('投注失败！');
      });
  });
  // 常规投注 - 提交请求
  $('#buy-submit').on('click', function(event) {
    event.preventDefault();
    var box = $(this).parents('.box-left');
    var params = COMMON.getCommonParams(box);

    // 判断购买方式 2追买 3合买
    var buytype = parseInt(box.find('.j-br-type .active').attr('data-buytype'));
    switch (buytype) {
      case 2:
        if (box.find('.is_end_zhongjiang')[0].checked) {
          params.endminmoney = box.find('.end_min_money').val()
        }
        var q = []
        var c = box.find('.br-details tbody .br-zhui-c:checked')
        for (var i = 0; i < c.length; i++) {
          q.push(c.eq(i).attr('data-qihaoid') + '|' + c.eq(i).attr('data-qi') + '|' + c.eq(i).parents('tr').find('.br-zhui-bei').val());
        };
        params.zhuihaoqihao = q
        break;
      case 3:
        params.rengouMoney = box.find('.j-rengou').val()
        params.extraPercent = box.find('.br-select').val()
        params.baodiText = box.find('.j-baodi-text').val()
        params.title = box.find('.j-project-title').val()
        params.textarea = box.find('.br-textarea').val()
        params.set = box.find('.br-set-group .active').html()
        break;
      default:
        break;
    }
    debugger;
    $.ajax({
        url: '/lottery/digital/buy-self/' + params.lotyName + '/' + params.playName,
        type: 'post',
        dataType: 'json',
        data: params,
      })
      .done(function() {
        APP.showTips('投注成功！');
      })
      .fail(function() {
        APP.showTips('投注失败！');
      });
  });

  //拖胆上传
  $('#j-tuodan-sub').on('click', function(event) {
    event.preventDefault();
    var box = $(this).parents('.box-left');
    var params = COMMON.getCommonParams(box);
    params.codes = COMMON.tuodanFormarFormSub(box.find('.br-zhu-item'))
    // 判断购买方式 2追买 3合买
    var buytype = parseInt(box.find('.j-br-type .active').attr('data-buytype'));
    switch (buytype) {
      case 2:
        if (box.find('.is_end_zhongjiang')[0].checked) {
          params.endminmoney = box.find('.end_min_money').val()
        }
        var q = []
        var c = box.find('.br-details tbody .br-zhui-c:checked')
        for (var i = 0; i < c.length; i++) {
          q.push(c.eq(i).attr('data-qihaoid') + '|' + c.eq(i).attr('data-qi') + '|' + c.eq(i).parents('tr').find('.br-zhui-bei').val());
        };
        params.zhuihaoqihao = q
        break;
      case 3:
        params.rengouMoney = box.find('.j-rengou').val()
        params.extraPercent = box.find('.br-select').val()
        params.baodiText = box.find('.j-baodi-text').val()
        params.title = box.find('.j-project-title').val()
        params.textarea = box.find('.br-textarea').val()
        params.set = box.find('.br-set-group .active').html()
        break;
      default:
        break;
    }

    debugger
    $.ajax({
        url: '/path/to/file',
        type: 'post',
        dataType: 'json',
        data: params,
      })
      .done(function() {
        APP.showTips('投注成功！');
      })
      .fail(function() {
        APP.showTips('投注失败！');
      });
  });

  //粘贴上传
  $('#j-upload-sub').on('click', function(event) {
    event.preventDefault();
    var box = $(this).parents('.box-left');
    var params = COMMON.getCommonParams(box);
    params.beishu = 1;
    // 判断购买方式 2追买 3合买
    var buytype = parseInt(box.find('.j-br-type .active').attr('data-buytype'));
    switch (buytype) {
      case 3:
        params.rengouMoney = box.find('.j-rengou').val()
        params.extraPercent = box.find('.br-select').val()
        params.baodiText = box.find('.j-baodi-text').val()
        params.title = box.find('.j-project-title').val()
        params.textarea = box.find('.br-textarea').val()
        break;
      default:
        break;
    }

    debugger
    $.ajax({
        url: '/path/to/file',
        type: 'post',
        dataType: 'json',
        data: params,
      })
      .done(function() {
        APP.showTips('投注成功！');
      })
      .fail(function() {
        APP.showTips('投注失败！');
      });
  });


  // 多期投注 - Submit
  $('#j-more-sub').on('click', function(event) {
    event.preventDefault();
    var box = $(this).parents('.box-left');
    var params = COMMON.getCommonParams(box);
    params.zhushu = $('#j-more-zhu').val();
    params.beishu = $('#j-more-bei').val();
    params.qishu = $('#j-more-qi').val();

    debugger
    $.ajax({
        url: '/path/to/file',
        type: 'post',
        dataType: 'json',
        data: params,
      })
      .done(function() {
        APP.showTips('投注成功！');
      })
      .fail(function() {
        APP.showTips('投注失败！');
      });

  });
});