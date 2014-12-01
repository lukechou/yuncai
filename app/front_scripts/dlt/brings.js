/*
 *
 * ModuleName: 大乐透
 * Date: 2014-11-25
 * Author: Raymond
 *
 */

$(function() {

  var qiuckSet = ''; // -常规 修改当前注
  var tuoDanSet = ''; // -拖胆 修改当前注

  // 绑定加减输入框事件
  $('.br-count-item').on('click', '.j-count', function(event) {
    event.preventDefault();
    /* Act on the event */
    var m = $(this).siblings('.btn-results'),
      c = $(this).attr('data-c'),
      r = m.attr('data-r');
    COMMON.updateCount(m, c);
    COMMON.setZhuTotal(r, $(this));
  });

  // 绑定加减总数输入框事件
  $('.btn-results').on('change', function(event) {
    var r = $(this).attr('data-r');
    var v = parseInt($(this).val());
    if (isNaN(v)) {
      $(this).val(1);
    } else {
      $(this).val(v);
    }
    COMMON.setZhuTotal(r, $(this));
  });

  /*
   *  快捷投注
   */

  // 添加到投注列表 or 修改投注号码
  $('.btn-add').on('click', function(event) {

    var p = $(this).parents('.br-gou').siblings('.layout_select'),
      a = parseInt($(this).attr('data-add')),
      h = $(this).hasClass('active'),
      total = $(this).parents('.br-gou').siblings('.m-num-title').find('.j-quick-hd-total').html();

    var html = '',
      rNums = [],
      bNums = [],
      tips = ['请先选择号码', '至少选择5个前区号码和2个后区号码', '您好，单个投注的金额应小于2万元，请返回重新选择'];

    var eRed = p.find('.ball_red .active'),
      eBlue = p.find('.ball_blue .active'),
      eGroup = p.find('.ball-group .active');


    if (parseInt(total) > 20000) {
      COMMON.showTips(tips[2]);
      return;
    }

    if (a == 1) {
      if (h) {
        eRed.each(function(index, el) {
          var e = el.getElementsByTagName('span')[0].innerHTML;
          rNums.push(e);
        });

        eBlue.each(function(index, el) {
          var e = el.getElementsByTagName('span')[0].innerHTML;
          bNums.push(e);
        });

        if (rNums.length >= 5 && bNums.length >= 2) {
          eGroup.removeClass();
          html = COMMON.getOneZhu(rNums, bNums, total);
          $(this).parents('.box-left').find('.br-zhu-l').append(html);
          COMMON.checkBallGroup($(this));
        } else {
          COMMON.showTips(tips[1]);
        }
      } else {
        COMMON.showTips(tips[0]);
      }
    }

    if (a == 0) {
      if (h) {
        eRed.each(function(index, el) {
          var e = el.getElementsByTagName('span')[0].innerHTML;
          rNums.push(e);
        });

        eBlue.each(function(index, el) {
          var e = el.getElementsByTagName('span')[0].innerHTML;
          bNums.push(e);
        });

        if (rNums.length >= 5 && bNums.length >= 2) {
          eGroup.removeClass();
          html = COMMON.getOneZhu(rNums, bNums, total, true);
          qiuckSet.html(html);
          COMMON.checkBallGroup($(this));
          $(this).attr('data-add', 1);
          $(this).find('span').html('添加到投注列表');
        } else {
          COMMON.showTips(tips[1]);
        }
      } else {
        COMMON.showTips(tips[0]);
      }
    }

    COMMON.updateTotalZhu($(this));

    console.log('添加到投注列表');
  });

  //选中当前列
  $('.j-br-zhu').on('click', '.br-zhu-item', function(event) {

    var r = [],
      b = [],
      el = $(this).parents('.br-gou').siblings('.layout_select'),
      list = COMMON.getItemNum($(this)),
      next = el.siblings('.m-num-title');

    if (event.target.tagName === 'A') {

      return;

    } else {

      // clear near item style
      $(this).siblings('.br-zhu-item').removeClass('active');
      $(this).addClass('active');

      // find the ball clear style and selected style
      COMMON.clearAllBallActive(el);
      qiuckSet = $(this);

      // get Item Num and Create Zhu Ball and Update Zhu Tips
      COMMON.createOneZhuBall(list.red, list.blue, el);
      COMMON.checkBallGroup(next);
    }

  });


  // 列表修改当前注
  $('.j-br-zhu').on('click', '.br-zhu-set', function(event) {

    var p = $(this).parents('.br-zhu-item'),
      p1 = $(this).parents('.br-zhu').find('.br-zhu-item'),
      list = COMMON.getItemNum(p),
      br = $(this).parents('.br-gou'),
      html = '修改投注号码',
      el = br.siblings('.layout_select'),
      next = el.siblings('.m-num-title');

    // toggle active
    p1.removeClass('active');
    p.addClass('active');

    // update add button
    br.find('.btn-add span').html(html);
    br.find('.btn-add').addClass('active').attr('data-add', 0);
    qiuckSet = p;

    // create ball and update zhu middle
    COMMON.createOneZhuBall(list.red, list.blue, el);
    COMMON.checkBallGroup(next);
    console.log('UpdateThisItem');

  });

  // 快捷投注 选球
  $('.ball-group').on('click', 'li', function(event) {
    $(this).toggleClass('active');
    COMMON.checkBallGroup($(this));
  });

  // 快捷投注 清空投注列表
  $('.clearredball').on('click', function(event) {
    $(this).parents('.area_select').siblings('.ball_red').find('.active').removeClass();
    COMMON.checkBallGroup($(this));
  });

  $('.clearblueball').on('click', function(event) {
    $(this).parents('.area_select').siblings('.ball_blue').find('.active').removeClass();
    COMMON.checkBallGroup($(this));
  });

  // 快捷投注随机选球
  $('.jxredball').on('click', function(event) {
    var v = $(this).siblings('.jxRedBall_Num').val();
    var sr = $(this).parents('.area_select').siblings('#ball_red');
    COMMON.randomNum(sr, 'red', v);
    COMMON.checkBallGroup($(this));
  });

  $('.jxblueball').on('click', function(event) {
    var v = $(this).siblings('.jxBlueBall_Num').val();
    var sb = $(this).parents('.area_select').siblings('#ball_blue');
    COMMON.randomNum(sb, 'blue', v);
    COMMON.checkBallGroup($(this));
  });

  // 删除当前注
  $('.j-br-zhu').on('click', '.br-zhu-del', function(event) {
    if (DEBUG) debugger;
    var c = $(this).parents('.br-zhu');
    $(this).parents('.br-zhu-item').remove();
    $('.btn-add').attr('data-add', 1);
    $('.btn-add').find('span').html('添加到投注列表');
    COMMON.updateTotalZhu(c);
  });

  // 机选一注
  $('.j-zhu-add1').on('click', function(event) {
    var html = COMMON.getManyZhu(1);
    $(this).parents('.br-zhu-r').siblings('.br-zhu-l').append(html);
    COMMON.updateTotalZhu($(this));
  });

  // 机选5注
  $('.j-zhu-add5').on('click', function(event) {
    var html = COMMON.getManyZhu(5);
    $(this).parents('.br-zhu-r').siblings('.br-zhu-l').append(html);
    COMMON.updateTotalZhu($(this));
  });

  // 机选10注
  $('.j-zhu-add10').on('click', function(event) {
    var html = COMMON.getManyZhu(10);
    $(this).parents('.br-zhu-r').siblings('.br-zhu-l').append(html);
    COMMON.updateTotalZhu($(this));
  });

  // 清空列表
  $('.j-zhu-clean').on('click', function(event) {
    if (DEBUG) debugger;
    $(this).parents('.br-zhu-r').siblings('.br-zhu-l').html('');
    COMMON.updateTotalZhu($(this));
  });

  /*
   *
   *拖胆投注
   *
   */

  // 拖胆投注 选号 红区
  $('.m-num-group-red').on('click', 'a', function(event) {

    var i = $(this).index(),
      parent = '.m-num-group-red',
      parentEl = $(this).parents(parent),
      min = parseInt(parentEl.attr('data-min')),
      max = parseInt(parentEl.attr('data-max')),
      dan = parentEl.attr('data-dan'),
      len = parentEl.find('.active').length;

    if (dan == 1) {
      if (len < max) {
        parentEl.siblings(parent).find('a').eq(i).removeClass('active');
        $(this).toggleClass('active');
      } else {
        if (len == max && $(this).hasClass('active')) {
          $(this).toggleClass('active');
        } else {
          COMMON.showTips('最多只能有4个胆码');
        }
      }
    } else {
      parentEl.siblings(parent).find('a').eq(i).removeClass('active');
      $(this).toggleClass('active');
    }

    DRAG.checkBallAear();
  });

  // 拖胆投注 选号 蓝区
  $('.m-num-group-blue').on('click', 'a', function(event) {

    var i = $(this).index(),
      parent = '.m-num-group-blue',
      parentEl = $(this).parents(parent),
      min = parseInt(parentEl.attr('data-min')),
      max = parseInt(parentEl.attr('data-max')),
      dan = parentEl.attr('data-dan'),
      len = parentEl.find('.active').length;

    if (dan == 1) {
      if (len < max) {
        parentEl.siblings(parent).find('a').eq(i).removeClass('active');
        $(this).toggleClass('active');
      } else {
        if (len == max && $(this).hasClass('active')) {
          $(this).toggleClass('active');
        } else {
          COMMON.showTips('最多只能有1个胆码');
        }
      }
    } else {
      parentEl.siblings(parent).find('a').eq(i).removeClass('active');
      $(this).toggleClass('active');
    }
    DRAG.checkBallAear();
  });

  // 拖胆随机选球
  $('.j-random-tuo').on('click', function(event) {
    var _this = $(this),
      g = '.m-num-group',
      tuo = _this.parents(g),
      dan = tuo.siblings(g),
      num = DRAG.getTuodanNum(dan),
      co = _this.attr('data-color'),
      len = tuo.find('.tuo-select').val();
    getRandomNums = DRAG.randomTuodanNum(num, co, len);
    DRAG.createOneTuodanBall(getRandomNums, tuo);
    DRAG.checkBallAear();
  });

  // 拖胆投注-清空选球区域
  $('.m-num-group').on('click', '.m-num-clean', function(event) {
    $(this).parents('.m-num-group').find('a.active').removeClass('active');
    DRAG.checkBallAear();
    COMMON.setZhuTotal(1, $(this));
  });


  // 拖胆注添加到列表
  $('#tuo-sub').on('click', function(event) {

    var html = '';
    var zhuHtml = '';
    var zhu = DRAG.getTuodanBallZhu();
    var brGou = $(this).parents('.br-gou');
    var tips = ['前区胆码至少选择一个', '您选的方案不足一注'];
    var type = $(this).attr('data-add');

    // is Select Ball Enough
    if (zhu.code === -1) COMMON.showTips(tips[0]);
    if (zhu.code === -2) COMMON.showTips(tips[1]);

    if (zhu.code > 0) {

      if (type == '1') {
        // create html insert to the list and update zhu
        html = DRAG.addOneTuoZhu(zhu.rDaned, zhu.rTuoed, zhu.bDaned, zhu.bTuoed, zhu.total * 2);
        brGou.find('.br-zhu-l').append(html);

        COMMON.updateTotalZhu($(this));
        COMMON.setZhuTotal(1, $(this));

        COMMON.clearAllBallActive($('.m-num-group'));
        DRAG.checkBallAear();

        console.log('添加一注到拖胆列表');
      } else {

        html = DRAG.addOneTuoZhu(zhu.rDaned, zhu.rTuoed, zhu.bDaned, zhu.bTuoed, zhu.total * 2, true);
        tuoDanSet.html(html);

        COMMON.updateTotalZhu($(this));
        COMMON.setZhuTotal(1, $(this));

        COMMON.clearAllBallActive($('.m-num-group'));
        DRAG.checkBallAear();

        $(this).attr('data-add', 1);
        $(this).find('span').html('添加到投注列表');

        console.log('修改拖胆列表一注');
      }

    }
  });

  // 删除当前注
  $('#j-tuo-zhu').on('click', '.br-zhu-del', function(event) {

    if (DEBUG) debugger;

    var c = $(this).parents('.br-zhu');
    $(this).parents('.br-zhu-item').remove();
    $('#tuo-sub').attr('data-add', 1);
    $('#tuo-sub').find('span').html('添加到投注列表');

    COMMON.updateTotalZhu(c);

    console.log('删除一注');
  });

  // 拖胆投注-修改选中注
  $('#j-tuo-zhu').on('click', '.br-zhu-set', function(event) {

    var p = $(this).parents('.br-zhu-item'),
      br = $(this).parents('.br-gou'),
      el = br.siblings('.layout_select'),
      list = DRAG.getOneListNums(p),
      next = $('#j-tuo-mintips'),
      n = ['rd', 'rt', 'dd', 'dt'],
      group = el.find('.m-num-group');;

    // clear near item style
    p.siblings('.br-zhu-item').removeClass('active');
    p.addClass('active');

    // update add button
    br.find('#tuo-sub').find('span').html('修改投注号码');
    br.find('#tuo-sub').addClass('active').attr('data-add', 0);
    tuoDanSet = p;

    // create ball and update zhu middle
    COMMON.clearAllBallActive(el);

    // select ball
    for (var i = 0; i < group.length; i++) {
      for (var j = 0; j < list[n[i]].length; j++) {
        ball = parseInt(list[n[i]][j]) - 1;
        group.eq(i).find('a').eq(ball).addClass('active');
      };
    };

    // check ball Aear
    DRAG.checkBallAear(next);

    console.log('选中待修改拖胆列表注');
  });

  //  拖胆投注-选中当前注
  $('#j-tuo-zhu').on('click', '.br-zhu-item', function(event) {

    var el = $(this).parents('.br-gou').siblings('.layout_select'),
      list = DRAG.getOneListNums($(this)),
      next = $('#j-tuo-mintips'),
      n = ['rd', 'rt', 'dd', 'dt'],
      group = el.find('.m-num-group');

    if (event.target.tagName === 'A') {
      return;
    } else {

      // clear near item style
      $(this).siblings('.br-zhu-item').removeClass('active');
      $(this).addClass('active');

      // find the ball clear style and selected style
      COMMON.clearAllBallActive(el);
      tuoDanSet = $(this);

      // get Item Num and Create Zhu Ball and Update Zhu Tips
      COMMON.clearAllBallActive(el);

      // select ball
      for (var i = 0; i < group.length; i++) {

        for (var j = 0; j < list[n[i]].length; j++) {
          ball = parseInt(list[n[i]][j]) - 1;
          group.eq(i).find('a').eq(ball).addClass('active');
        };

      };

      // clear ball Aear
      DRAG.checkBallAear(next);
      console.log('选中拖胆列表一注');
    }

  });

  /****************MANUAL****************/

  var sdNumberTips = '';
  var sdStatus = true;

  $('#sd_number').on('focus', function(event) {
    if (sdStatus) {
      sdNumberTips = $(this).val();
      $(this).val('');
      sdStatus = false;
    }
    $(this).addClass('focus');
  });

  $('#sd_number').on('keyup blur', function(event) {
    MANUAL.totalSdNums();
  });

  // 删除当前注
  $('#sd-list').on('click', '.br-zhu-del', function(event) {
    if (DEBUG) debugger;
    var c = $(this).parents('.br-zhu');
    $(this).parents('.br-zhu-item').remove();
    MANUAL.setSdTotal();
    console.log('MANUAL删除一注');
  });

  // 清空列表
  $('#j-sd-clean').on('click', function(event) {
    if (DEBUG) debugger;
    $(this).parents('.br-zhu-r').siblings('.br-zhu-l').html('');
    MANUAL.setSdTotal();
  });

  // 粘贴上传-添加到投注列表
  $('#sd_sub').on('click', function(event) {

    var str = $.trim($('#sd_number').val());
    var formatZhus = '';
    var l = '';
    var html = '';
    var tips = ['<h5>您好，请按照正确格式填写，例：</h5><p>格式1：01,02,03,04,05|10,11</p><p>格式2：01,02,03,04,05+10,11', '请输入投注号码'];

    if (!_.isEmpty(str)) {
      formatZhus = MANUAL.sdFormat(str);
    } else {
      COMMON.showTips(tips[1]);
    }

    if (formatZhus && formatZhus.code == 0) {
      COMMON.showTips(tips[0]);
    }

    for (var i = 0; i < formatZhus.good.length; i++) {
      l = MANUAL.relovStr(formatZhus.good[i]);
      html += MANUAL.getListHTML(l[0], l[1], 2);
    };

    $('#sd-list').append(html);
    MANUAL.setSdTotal();

    if (formatZhus.bad.length > 0) {
      $('#sd_number').val('');
      for (var i = 0; i < formatZhus.bad.length; i++) {
        if (formatZhus.bad[i]) {
          $('#sd_number').val($('#sd_number').val() + formatZhus.bad[i] + '\n');
        }
      };
    } else {
      $('#sd_number').val('');
    }

    MANUAL.totalSdNums();

    console.log('MANUAL向列表添加一注');
  });


  // 快捷投注 - 提交请求
  $('#qiuck-sub').on('click', function(event) {
    event.preventDefault();

    var lotyName = $('#lotyName').val();
    var playName = $('#playName').val();
    var unikey = $('#unikey').val();
    var zhushu = $('#j-qiucksub-zhu').html();
    var beishu = $('#j-qiucksub-bei').val();
    var qihaoId = $('#qihaoId').val();;
    var qihao = $('#qihao').val();;
    var codes = COMMON.formarFormSub($(this).parents('.br-tou').siblings('.br-gou').find('.br-zhu-item'));

    $.ajax({
        url: '/lottery/digital/buy-self/' + lotyName + '/' + playName,
        type: 'post',
        dataType: 'json',
        data: {
          unikey: unikey,
          zhushu: zhushu,
          beishu: beishu,
          qihaoId: qihaoId,
          qihao: qihao,
          codes: codes
        },
      })
      .done(function() {
        console.log("success");
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });

  });


});