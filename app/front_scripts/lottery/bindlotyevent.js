'use strict';
// Bind loty Common Event
$(function() {

  /**
   *  Common Event
   */
  // 绑定加减输入框事件
  $('.br-count-item').on('click', '.j-count', function(event) {
    event.preventDefault();
    /* Act on the event */
    var m = $(this).siblings('.btn-results'),
      c = $(this).attr('data-c'),
      r = m.attr('data-r');
    COMMON.updateCount(m, c);

    if (m.hasClass('j-quick-bei')) {
      var z = parseInt(m.val()) || 1;
      if (z > Config.maxBeiShu) {
        m.val(Config.maxBeiShu)
      }
      if (z <= 0) {
        m.val(1)
      }
    }

    if (m.hasClass('j-quick-qi')) {
      var z = parseInt(m.val()) || 1;
      if (z > Config.maxQiShu) {
        m.val(Config.maxQiShu)
      }
      if (z <= 0) {
        m.val(1)
      }
    }

    if (m.hasClass('j-quick-zhu')) {
      var z = parseInt(m.val()) || 1;
      if (z > Config.maxZhuShu) {
        m.val(Config.maxZhuShu)
      }
      if (z <= 0) {
        m.val(1)
      }
    }

    COMMON.setZhuTotal();
  });

  // 绑定加减总数输入框事件
  $('.btn-results').on('change', function(event) {
    var r = $(this).attr('data-r');
    var v = parseInt($(this).val(), 10);

    if (isNaN(v)) {
      $(this).val(1);
    } else {
      v = (v >= 1) ? v : 1;
      $(this).val(v);
    }

    if ($(this).hasClass('j-quick-bei')) {
      var z = parseInt($(this).val()) || 1;
      if (z > Config.maxBeiShu) {
        $(this).val(Config.maxBeiShu)
      }
      if (z <= 0) {
        $(this).val(1)
      }
    }

    if ($(this).hasClass('j-quick-qi')) {
      var z = parseInt($(this).val()) || 1;
      if (z > Config.maxQiShu) {
        $(this).val(Config.maxQiShu)
      }
      if (z <= 0) {
        $(this).val(1)
      }
    }

    if ($(this).hasClass('j-quick-zhu')) {
      var z = parseInt($(this).val()) || 1;
      if (z > Config.maxZhuShu) {
        $(this).val(Config.maxZhuShu)
      }
      if (z <= 0) {
        $(this).val(1)
      }
    }

    COMMON.setZhuTotal();
  });

  $('.j-zj-check').on('change', function(event) {

    Config.isZhuiJia = $(this)[0]['checked'];
    DLT.updateZhuList(Config.box);

  });

  /**
   * 快捷投注
   */

  // 添加到投注列表 or 修改投注号码
  $('.btn-add').on('click', function(event) {

    var p = Config.box.find('.j-touz-area'),
      a = parseInt($(this).attr('data-add')),
      h = $(this).hasClass('active'),
      total = $(this).parents('.br-gou').siblings('.m-num-title').find('.j-quick-hd-total').html();

    var html = '',
      rNums = [],
      bNums = [],
      tips = ['请先选择号码', '至少选择' + SEEDS[Config.lotyName].redTotal + '个红球和' + SEEDS[Config.lotyName].blueTotal + '个蓝球', '您好，单个投注的金额应小于2万元，请返回重新选择'];

    var eRed = p.find('.ball_red .active'),
      eBlue = p.find('.ball_blue .active'),
      eGroup = p.find('.ball-group .active');

    if (parseInt(total) > 20000) {
      APP.showTips(tips[2]);
      return;
    }

    if (Config.box.find('.br-zhu-item').length >= Config.maxHang) {
      APP.showTips('您的投注号码多于100行，请返回重新选择');
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

        if (rNums.length >= SEEDS[Config.lotyName].redTotal && bNums.length >= SEEDS[Config.lotyName].blueTotal) {
          eGroup.removeClass();
          html = COMMON.getOneZhu(rNums, bNums, total);
          Config.box.find('.br-zhu-l').append(html);
          COMMON.checkBallGroup($(this));
        } else {
          APP.showTips(tips[1]);
        }
      } else {
        if (eGroup.length > 0) {
          APP.showTips(tips[1]);
        } else {
          APP.showTips(tips[0]);
        }
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

        if (rNums.length >= SEEDS[Config.lotyName].redTotal && bNums.length >= SEEDS[Config.lotyName].blueTotal) {
          eGroup.removeClass();
          html = COMMON.getOneZhu(rNums, bNums, total, true);
          qiuckSet.html(html);
          COMMON.checkBallGroup($(this));
          $(this).attr('data-add', 1);
          $(this).find('span').html('添加到投注列表');
        } else {
          APP.showTips(tips[1]);
        }
      } else {
        APP.showTips(tips[0]);
      }
    }

    COMMON.updateTotalZhu($(this));

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

  });

  // 快捷投注随机选球
  $('.jxredball').on('click', function(event) {
    var v = $(this).siblings('.jxRedBall_Num').val();
    var sr = $(this).parents('.area_select').siblings('#ball_red');
    COMMON.randomNum(sr, 'redBall', v);
    COMMON.checkBallGroup($(this));
  });

  $('.jxblueball').on('click', function(event) {
    var v = $(this).siblings('.jxBlueBall_Num').val();
    var sb = $(this).parents('.area_select').siblings('#ball_blue');
    COMMON.randomNum(sb, 'blueBall', v);
    COMMON.checkBallGroup($(this));
  });

  // 快捷投注 选球
  $('.ball-group').on('click', 'li', function(event) {

    var redGroup = $(this).parents('.ball_red');
    var redGroupAc = redGroup.find('.active');

    if (redGroup[0]) {

      if (redGroupAc.length <= SEEDS[Config.lotyName].redMax) {

        if (redGroupAc.length == SEEDS[Config.lotyName].redMax) {
          if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            COMMON.checkBallGroup($(this));
          } else {
            APP.showTips('最多只能选择' + SEEDS[Config.lotyName].redMax + '个红球');
            COMMON.checkBallGroup($(this));
          }
        } else {
          $(this).toggleClass('active');
          COMMON.checkBallGroup($(this));
          if (redGroup.find('.active').length == SEEDS[Config.lotyName].redMax) {
            APP.showTips('已经达到最大投注个数');
          }
        }
      } else {
        APP.showTips('最多只能选择' + SEEDS[Config.lotyName].redMax + '个红球');
      }

    } else {

      $(this).toggleClass('active');
      COMMON.checkBallGroup($(this));

    }

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

  // 删除当前注
  $('.j-br-zhu').on('click', '.br-zhu-del', function(event) {

    var c = $(this).parents('.br-zhu');
    $(this).parents('.br-zhu-item').remove();
    $('.btn-add').attr('data-add', 1);
    $('.btn-add').find('span').html('添加到投注列表');
    COMMON.updateTotalZhu(c);
  });

  // 机选N注
  $('.j-zhu-adds').on('click', function(event) {
    var box = Config.box;
    var len = parseInt($(this).attr('data-zhu'));
    var html = COMMON.getManyZhu(len);
    var zhuTotal = parseInt(box.find('.br-zhu-item').length);

    if ((zhuTotal + len) <= Config.maxHang) {
      box.find('.br-zhu-l').append(html);
      COMMON.updateTotalZhu($(this));
    } else {
      APP.showTips('您的投注号码多于100行，请返回重新选择');
      return;
    }

  });

  // 清空列表
  $('.j-zhu-clean').on('click', function(event) {

    $(this).parents('.br-zhu-r').siblings('.br-zhu-l').html('');
    COMMON.updateTotalZhu($(this));
  });

  /**
   * 拖胆投注
   */

  // 拖胆投注-选号红区
  $('.m-num-group-red').on('click', 'a', function(event) {

    var i = $(this).index(),
      parent = '.m-num-group-red',
      parentEl = $(this).parents(parent),
      max = SEEDS[Config.lotyName].redDanMax,
      tuoMax = SEEDS[Config.lotyName].redTuoMax,
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
          APP.showTips('最多只能有' + max + '个胆码');
        }
      }
    } else {
      if (len < tuoMax) {
        parentEl.siblings(parent).find('a').eq(i).removeClass('active');
        $(this).toggleClass('active');
      } else {
        if (len == tuoMax && $(this).hasClass('active')) {
          $(this).toggleClass('active');
        } else {
          APP.showTips('最多只能有' + tuoMax + '个拖码');
        }
      }
    }

    DRAG.checkBallAear();
  });

  // 拖胆投注-随机选球
  $('.j-random-tuo').on('click', function(event) {

    var _this = $(this),
      g = '.m-num-group',
      tuo = _this.parents(g),
      dan = tuo.siblings(g),
      num = DRAG.getTuodanNum(dan),
      co = _this.attr('data-color'),
      len = tuo.find('.tuo-select').val(),
      getrandomNums = '';

    getrandomNums = DRAG.randomTuodanNum(num, co, len);
    DRAG.createOneTuodanBall(getrandomNums, tuo);
    DRAG.checkBallAear();
  });

  // 拖胆投注-清空选球区域
  $('.m-num-group').on('click', '.m-num-clean', function(event) {
    $(this).parents('.m-num-group').find('a.active').removeClass('active');
    DRAG.checkBallAear();
    COMMON.setZhuTotal();
  });

  // 拖胆投注-删除当前注
  $('#j-tuo-zhu').on('click', '.br-zhu-del', function(event) {

    var c = $(this).parents('.br-zhu');
    $(this).parents('.br-zhu-item').remove();
    $('#tuo-sub').attr('data-add', 1);
    $('#tuo-sub').find('span').html('添加到投注列表');

    COMMON.updateTotalZhu(c);

  });

  // 拖胆注添加到列表
  $('#tuo-sub').on('click', function(event) {

    var html = '';
    var zhuHtml = '';
    var zhu = DRAG.getTuodanBallZhu();
    var brGou = $(this).parents('.br-gou');
    var tips = ['前区胆码至少选择一个', '您选的方案不足一注', '您好，单个投注的金额应小于2万元，请返回重新选择'];
    var type = $(this).attr('data-add');
    var money = DLT.getZhuiJiaStatus();

    if (zhu.total * 2 > 20000) {
      APP.showTips(tips[2]);
      return;
    }
    if (Config.box.find('.br-zhu-item').length >= Config.maxHang) {
      APP.showTips('您的投注号码多于100行，请返回重新选择');
      return;
    }

    // is Select Ball Enough
    if (zhu.code === -1) {
      APP.showTips(tips[0]);
      return;
    }
    if (zhu.code === -2) {
      APP.showTips(tips[1]);
      return;
    }

    if (zhu.code > 0) {

      if (type == '1') {
        // create html insert to the list and update zhu
        html = DRAG.addOneTuoZhu(zhu.rDaned, zhu.rTuoed, zhu.bDaned, zhu.bTuoed, zhu.total * money);
        brGou.find('.br-zhu-l').append(html);

        COMMON.updateTotalZhu($(this));
        COMMON.setZhuTotal();

        COMMON.clearAllBallActive($('.m-num-group'));
        DRAG.checkBallAear();
        return;
      } else {

        html = DRAG.addOneTuoZhu(zhu.rDaned, zhu.rTuoed, zhu.bDaned, zhu.bTuoed, zhu.total * money, true);
        tuoDanSet.html(html);

        COMMON.updateTotalZhu($(this));
        COMMON.setZhuTotal();

        COMMON.clearAllBallActive($('.m-num-group'));
        DRAG.checkBallAear();

        $(this).attr('data-add', 1);
        $(this).find('span').html('添加到投注列表');
        return;
      }

    }

  });

  // 拖胆投注-修改选中注
  $('#j-tuo-zhu').on('click', '.br-zhu-set', function(event) {

    var p = $(this).parents('.br-zhu-item'),
      br = $(this).parents('.br-gou'),
      el = br.siblings('.layout_select'),
      list = DRAG.getOneListNums(p),
      next = $('#j-tuo-mintips'),
      n = ['rd', 'rt', 'dd', 'dt'],
      group = el.find('.m-num-group'),
      ball = '';

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

  });

  // 拖胆投注 选号 蓝区
  $('.m-num-group-blue').on('click', 'a', function(event) {

    var i = $(this).index(),
      parent = '.m-num-group-blue',
      parentEl = $(this).parents(parent),
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
          if (lotyName == 'dlt') APP.showTips('最多只能有1个胆码');
        }
      }
    } else {
      parentEl.siblings(parent).find('a').eq(i).removeClass('active');
      $(this).toggleClass('active');
    }
    DRAG.checkBallAear();
  });

  //  拖胆投注-选中当前注
  $('#j-tuo-zhu').on('click', '.br-zhu-item', function(event) {

    var el = $(this).parents('.br-gou').siblings('.layout_select'),
      list = DRAG.getOneListNums($(this)),
      next = $('#j-tuo-mintips'),
      n = '',
      group = '',
      ball = '';

    if (lotyName == 'dlt') {
      n = ['rd', 'rt', 'dd', 'dt'],
        group = el.find('.m-num-group')
    }

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
      if (lotyName == 'dlt') {
        // select ball
        for (var i = 0; i < group.length; i++) {

          for (var j = 0; j < list[n[i]].length; j++) {
            ball = parseInt(list[n[i]][j]) - 1;
            group.eq(i).find('a').eq(ball).addClass('active');
          };

        };
      } else {
        // select ball
        for (var i = 0; i < list['rd'].length; i++) {
          ball = parseInt(list['rd'][i]) - 1;
          $('.m-num-group-red[data-dan="1"]').find('a').eq(ball).addClass('active');
        };
        for (var i = 0; i < list['rt'].length; i++) {
          ball = parseInt(list['rt'][i]) - 1;
          $('.m-num-group-red[data-dan="0"]').find('a').eq(ball).addClass('active');
        };
        for (var i = 0; i < list['dd'].length; i++) {
          ball = parseInt(list['dd'][i]) - 1;
          $('.m-num-group-blue[data-dan="0"]').find('a').eq(ball).addClass('active');
        };
      }

      // clear ball Aear
      DRAG.checkBallAear(next);
    }

  });
  /****************MANUAL****************/
  var sdNumberTips = '';
  var sdStatus = true;

  // 粘贴上传-添加到投注列表
  $('#sd_sub').on('click', function(event) {

    var str = $.trim($('#sd_number').val());
    var formatZhus = '';
    var l = '';
    var html = '';
    var money = DLT.getZhuiJiaStatus();
    var tips = ['<h5>您好，请按照正确格式填写，例：</h5><p>格式1：01,02,03,04,05,06+10</p>', '请输入投注号码'];

    if (lotyName == 'dlt') {
      tips[0] = '<h5>您好，请按照正确格式填写，例：</h5><p>格式1：01,02,03,04,05+10,11</p>';
    }

    var boxZhuLen = Config.box.find('.br-zhu-item').length;
    var addZhuLen = 0;

    if (Config.box.find('.br-zhu-item').length >= Config.maxHang) {
      APP.showTips('您的投注号码多于100行，请返回重新选择');
      return;
    }

    if (!_.isEmpty(str)) {
      formatZhus = MANUAL.sdFormat(str);
      addZhuLen = formatZhus.good.length;
      if ((boxZhuLen + addZhuLen) > Config.maxHang) {
        APP.showTips('您的投注号码多于100行，请返回重新选择');
        return;
      }
    } else {
      APP.showTips(tips[1]);
      return;
    }

    if (formatZhus && formatZhus.code == 0) {
      APP.showTips(tips[0]);
    }

    for (var i = 0; i < formatZhus.good.length; i++) {
      l = MANUAL.relovStr(formatZhus.good[i]);
      html += MANUAL.getListHTML(l[0], l[1], money);
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
    ZHUI.setHeMaiTotal(Config.box);
  });

  //手动输入Mask
  $('#j-textarea-mask').on('click', function(event) {
    $(this).hide()
    $('#sd_number')[0].focus()
  });

  // 手动输入获取输入框焦点
  $('#sd_number').on('focus', function(event) {
    if (sdStatus) {
      sdNumberTips = $(this).val();
      $(this).val('');
      sdStatus = false;
    }
    $(this).addClass('focus');
  });

  // 更新手动输入注数
  $('#sd_number').on('keyup blur', function(event) {
    MANUAL.totalSdNums();
  });

  // 删除当前注
  $('#sd-list').on('click', '.br-zhu-del', function(event) {
    var c = $(this).parents('.br-zhu');
    $(this).parents('.br-zhu-item').remove();
    MANUAL.setSdTotal();
  });

  // 清空列表
  $('#j-sd-clean').on('click', function(event) {
    $(this).parents('.br-zhu-r').siblings('.br-zhu-l').html('');
    MANUAL.setSdTotal();
  });

  /**
   *Bind Other Tabs Toggle Event
   */
  // Quick, senior toggle
  $('#j-brhd-group a').on('click', function(event) {

    if ($(this).hasClass('active')) {
      return;
    } else {
      $('#j-brhd-group .active').removeClass('active');
      var t = parseInt($(this).attr('data-t'));
      if (t) {
        $('#quick').addClass('hidden');
        $('#senior').removeClass('hidden');
        Config.box = $('#senior .box-left').eq(0);
      } else {
        $('#senior').addClass('hidden');
        $('#quick').removeClass('hidden');
        Config.box = $('#quick .box-left');
      }
      $(this).addClass('active');
      return;
    }
  });

  $('#senior .m-br-nav').on('click', 'a', function(event) {
    var i = $(this).parents('li').index();
    Config.box = $('#senior .box-left').eq(i);
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

  // br-type icon toggle
  $('.j-br-type a[data-toggle="tab"]').on('click', function(e) {
    var li = $(this).parents('li'),
      box = Config.box,
      qi = box.find('.j-qi-box'),
      he = box.find('.j-he-box'),
      buyType = parseInt(li.attr('data-buytype'));
    switch (buyType) {
      case 1:
        box.find('.j-bei-text').show()
        qi.addClass('hide');
        he.addClass('hide');
        break;
      case 2:
        box.find('.j-bei-text .j-quick-bei').val(1)
        COMMON.updateTotalZhu($(this))
        box.find('.j-bei-text').hide()
        qi.removeClass('hide');
        he.addClass('hide');
        break;
      case 3:
        box.find('.j-bei-text').show()
        he.removeClass('hide');
        qi.addClass('hide');
        break;
    }

    $(this).parents('.j-br-type').find('.icon-y2').removeClass('icon-y2');
    $(this).find('.icon').addClass('icon-y2');
  });

  // From Submit
  // 快捷投注 - 提交请求
  $('#qiuck-sub').on('click', function(event) {

    var box = Config.box;
    var vote = {};
    var params = {};
    var buytype = '';
    var requestURL = '';

    params = COMMON.getCommonParams();
    params.qishu = box.find('.j-quick-qi').val();

    requestURL = (params.qishu == 1) ? '/lottery/digital/buy-self/' + params.lotyName + '/' + params.playName : '/lottery/digital/buy-track/' + params.lotyName + '/' + params.playName;

    vote.isCheck = box.find('.j-sub-agreed')[0].checked;
    vote.callback = function() {
      $.ajax({
          url: requestURL,
          type: 'post',
          dataType: 'json',
          data: params,
        })
        .done(function(data) {
          COMMON.onSubmitDone(data.retCode, data.retMsg, data.retData.projectNo, data.retData.trackId);
        })
        .fail(function() {
          COMMON.onSubmitFail()
        });
    };

    vote.confirmHtml = {
      html: COMMON.getAlertHtml(params),
    };

    COMMON.onSubmitInit(params, vote);

  });


  // 常规投注 - 提交请求
  $('#buy-submit').on('click', function(event) {

    var box = Config.box;
    var vote = {};
    var params = {};
    var buytype = '';
    var requestURL = '';
    var money = DLT.getZhuiJiaStatus();

    params = COMMON.getCommonParams();

    // 判断购买方式 2追买 3合买
    buytype = parseInt(box.find('.j-br-type .active').attr('data-buytype'));

    switch (buytype) {
      case 2:
        if (box.find('.is_end_zhongjiang')[0].checked) {
          params.endminmoney = box.find('.end_min_money').val()
        }
        var q = [];
        var c = box.find('.br-details tbody .br-zhui-c:checked');
        for (var i = 0; i < c.length; i++) {
          q.push(c.eq(i).attr('data-qihaoid') + '|' + c.eq(i).attr('data-qi') + '|' + c.eq(i).parents('tr').find('.br-zhui-bei').val());
        };

        params.zhuihaoqihao = q;
        params.qishu = q.length;
        requestURL = '/lottery/digital/buy-track/' + params.lotyName + '/' + params.playName;
        break;

      case 3:
        params.rengouMoney = box.find('.j-rengou').val()
        params.extraPercent = box.find('.br-select').val()
        params.baodiText = box.find('.j-baodi-text').val()
        params.title = box.find('.j-project-title').val()
        params.textarea = box.find('.br-textarea').val()
        params.set = box.find('.br-set-group .active').html()
        requestURL = '/lottery/digital/buy-together/' + params.lotyName + '/' + params.playName;
        break;

      default:
        requestURL = '/lottery/digital/buy-self/' + params.lotyName + '/' + params.playName;
        break;
    }

    vote.isCheck = box.find('.j-sub-agreed')[0].checked;
    vote.callback = function() {
      if ((parseInt(params.rengouMoney) + parseInt(params.baodiText)) > (params.beishu * params.zhushu * money)) {
        APP.showTips('ERROR：认购金额和保底金额超过购买金额！');
        return;
      }
      $.ajax({
          url: requestURL,
          type: 'post',
          dataType: 'json',
          data: params,
        })
        .done(function(data) {
          COMMON.onSubmitDone(data.retCode, data.retMsg, data.retData.projectNo, data.retData.trackId);
        })
        .fail(function() {
          COMMON.onSubmitFail()
        });
    };

    vote.confirmHtml = {
      html: COMMON.getAlertHtml(params),
    };

    COMMON.onSubmitInit(params, vote);

  });

  //拖胆上传
  $('#j-tuodan-sub').on('click', function(event) {

    var box = Config.box;
    var vote = {};
    var params = {};
    var buytype = '';
    var requestURL = '';
    var money = DLT.getZhuiJiaStatus();

    params = COMMON.getCommonParams();
    params.codes = COMMON.tuodanFormarFormSub(box.find('.br-zhu-item'));
    // 胆拖玩法类型 为2 固定
    params.playName = 2;
    // 判断购买方式 2追买 3合买
    buytype = parseInt(box.find('.j-br-type .active').attr('data-buytype'));

    switch (buytype) {
      case 2:
        if (box.find('.is_end_zhongjiang')[0].checked) {
          params.endminmoney = box.find('.end_min_money').val();
        }
        var q = [];
        var c = box.find('.br-details tbody .br-zhui-c:checked');
        for (var i = 0; i < c.length; i++) {
          q.push(c.eq(i).attr('data-qihaoid') + '|' + c.eq(i).attr('data-qi') + '|' + c.eq(i).parents('tr').find('.br-zhui-bei').val());
        };
        params.zhuihaoqihao = q;
        params.qishu = q.length;
        requestURL = '/lottery/digital/buy-track/' + params.lotyName + '/' + params.playName;
        break;

      case 3:
        params.rengouMoney = box.find('.j-rengou').val();
        params.extraPercent = box.find('.br-select').val();
        params.baodiText = box.find('.j-baodi-text').val();
        params.title = box.find('.j-project-title').val();
        params.textarea = box.find('.br-textarea').val();
        params.set = box.find('.br-set-group .active').html();
        requestURL = '/lottery/digital/buy-together/' + params.lotyName + '/' + params.playName;
        break;

      default:
        requestURL = '/lottery/digital/buy-self/' + params.lotyName + '/' + params.playName;
        break;
    }

    vote.isCheck = box.find('.j-sub-agreed')[0].checked;
    vote.callback = function() {
      if ((parseInt(params.rengouMoney) + parseInt(params.baodiText)) > (params.beishu * params.zhushu * money)) {
        APP.showTips('ERROR：认购金额和保底金额超过购买金额！');
        return;
      }
      $.ajax({
          url: requestURL,
          type: 'post',
          dataType: 'json',
          data: params,
        })
        .done(function(data) {
          COMMON.onSubmitDone(data.retCode, data.retMsg, data.retData.projectNo, data.retData.trackId);
        })
        .fail(function() {
          COMMON.onSubmitFail()
        });
    };
    vote.confirmHtml = {
      html: COMMON.getAlertHtml(params),
    };

    COMMON.onSubmitInit(params, vote);

  });

  //粘贴上传
  $('#j-upload-sub').on('click', function(event) {

    var box = Config.box;
    var vote = {};
    var params = {};
    var buytype = '';
    var requestURL = '';
    var money = DLT.getZhuiJiaStatus();

    params = COMMON.getCommonParams();
    params.beishu = 1;

    // 判断购买方式 2追买 3合买
    var buytype = parseInt(box.find('.j-br-type .active').attr('data-buytype'));

    switch (buytype) {
      case 3:
        params.rengouMoney = box.find('.j-rengou').val();
        params.extraPercent = box.find('.br-select').val();
        params.baodiText = box.find('.j-baodi-text').val();
        params.title = box.find('.j-project-title').val();
        params.textarea = box.find('.br-textarea').val();
        requestURL = '/lottery/digital/buy-together/' + params.lotyName + '/' + params.playName;
        break;

      default:
        requestURL = '/lottery/digital/buy-self/' + params.lotyName + '/' + params.playName;
        break;
    }

    vote.isCheck = box.find('.j-sub-agreed')[0].checked;
    vote.callback = function() {

      if ((parseInt(params.rengouMoney) + parseInt(params.baodiText)) > (params.beishu * params.zhushu * money)) {
        APP.showTips('ERROR：认购金额和保底金额超过购买金额！');
        return;
      }

      $.ajax({
          url: requestURL,
          type: 'post',
          dataType: 'json',
          data: params,
        })
        .done(function(data) {
          COMMON.onSubmitDone(data.retCode, data.retMsg, data.retData.projectNo, data.retData.trackId);
        })
        .fail(function() {
          COMMON.onSubmitFail()
        });
    };
    vote.confirmHtml = {
      html: COMMON.getAlertHtml(params),
    };

    COMMON.onSubmitInit(params, vote);

  });


  // 多期投注 - Submit
  $('#j-more-sub').on('click', function(event) {

    var box = $(this).parents('.tab-pane');
    var vote = {};
    var params = {};

    params = COMMON.getCommonParams();
    params.zhushu = $('#j-more-zhu').val();
    params.beishu = $('#j-more-bei').val();
    params.qishu = $('#j-more-qi').val();

    vote.isCheck = box.find('.j-sub-agreed')[0].checked;
    vote.callback = function() {
      $.ajax({
          url: '/lottery/digital/buy-rank/' + params.lotyName + '/' + params.playName,
          type: 'post',
          dataType: 'json',
          data: params,
        })
        .done(function(data) {
          COMMON.onSubmitDone(data.retCode, data.retMsg, data.retData.projectNo, data.retData.trackId)
        })
        .fail(function() {
          COMMON.onSubmitFail()
        });
    };
    vote.confirmHtml = {
      html: COMMON.getAlertHtml(params),
    };

    COMMON.onSubmitInit(params, vote);

  });


  /**
   * Bind ZhuiHao And HeMai Module
   *
   */
  $('.zh_issue_num').on('change', function(event) {
    event.preventDefault();
    ZHUI.getNewHtml($(this));
  });
  $('.br-details').on('click', '.br-zhui-btn', function(event) {
    ZHUI.getNewHtml($(this));
  });
  $('.br-details').on('click', '.br-he-btn', function(event) {
    ZHUI.setHeMaiTotal(Config.box);
  });
  ZHUI.bindHeMaiEvent();
});