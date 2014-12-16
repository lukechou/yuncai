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

    COMMON.setZhuTotal(r, $(this));
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

    COMMON.setZhuTotal(r, $(this));
  });

  /**
   * 快捷投注
   */
  // 快捷投注 选球
  $('.ball-group').on('click', 'li', function(event) {

    var redGroup = $(this).parents('.ball_red');
    var redGroupAc = redGroup.find('.active');

    if (redGroup[0]) {

      if (redGroupAc.length <= SEEDS[lotyName].redMax) {

        if (redGroupAc.length == SEEDS[lotyName].redMax) {
          if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            COMMON.checkBallGroup($(this));
          } else {
            APP.showTips('最多只能选择' + SEEDS[lotyName].redMax + '个红球')
            COMMON.checkBallGroup($(this));
          }
        } else {
          $(this).toggleClass('active');
          COMMON.checkBallGroup($(this));
          if (redGroup.find('.active').length == SEEDS[lotyName].redMax) {
            APP.showTips('已经达到最大投注个数')
          }
        }
      } else {
        APP.showTips('最多只能选择' + SEEDS[lotyName].redMax + '个红球')
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
    var box = $(this).parents('.box-left')
    var len = parseInt($(this).attr('data-zhu'));
    var html = COMMON.getManyZhu(len);
    var zhuTotal = parseInt(box.find('.br-zhu-item').length);

    if ((zhuTotal + len) <= Config.maxHang) {
      box.find('.br-zhu-l').append(html);
      COMMON.updateTotalZhu($(this));
    }else{
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
      max = SEEDS[lotyName].redDanMax,
      tuoMax = SEEDS[lotyName].redTuoMax,
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
      len = tuo.find('.tuo-select').val();

    getrandomNums = DRAG.randomTuodanNum(num, co, len);
    DRAG.createOneTuodanBall(getrandomNums, tuo);
    DRAG.checkBallAear();
  });

  // 拖胆投注-清空选球区域
  $('.m-num-group').on('click', '.m-num-clean', function(event) {
    $(this).parents('.m-num-group').find('a.active').removeClass('active');
    DRAG.checkBallAear();
    COMMON.setZhuTotal(1, $(this));
  });

  // 拖胆投注-删除当前注
  $('#j-tuo-zhu').on('click', '.br-zhu-del', function(event) {

    var c = $(this).parents('.br-zhu');
    $(this).parents('.br-zhu-item').remove();
    $('#tuo-sub').attr('data-add', 1);
    $('#tuo-sub').find('span').html('添加到投注列表');

    COMMON.updateTotalZhu(c);

    console.log('删除一注');
  });

  /**
   *Bind Other Tabs Toggle Event
   */
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
      box = $(this).parents('.box-left'),
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
    event.preventDefault();
    var box = $(this).parents('.box-left');
    var params = COMMON.getCommonParams(box);
    params.qishu = box.find('.j-quick-qi').val();

    if (COMMON.onSubmitInit(params)) {
      APP.showTips('请至少选择1注号码投注')
      return;
    } else {
      if (!box.find('.j-sub-agreed')[0].checked) {
        APP.showTips('请先阅读并同意《委托投注规则》后才能继续')
        return;
      }
      var requestURL = (params.qishu == 1) ? '/lottery/digital/buy-self/' + params.lotyName + '/' + params.playName : '/lottery/digital/buy-track/' + params.lotyName + '/' + params.playName;
      $.ajax({
          url: requestURL,
          type: 'post',
          dataType: 'json',
          data: params,
        })
        .done(function(data) {
          COMMON.onSubmitDone(data.retCode, data.retMsg)
        })
        .fail(function() {
          COMMON.onSubmitFail()
        });
    }
  });

  // 常规投注 - 提交请求
  $('#buy-submit').on('click', function(event) {
    event.preventDefault();
    var box = $(this).parents('.box-left');
    var params = COMMON.getCommonParams(box);

    if (COMMON.onSubmitInit(params)) {
      APP.showTips('请至少选择1注号码投注')
      return;
    } else {
      if (!box.find('.j-sub-agreed')[0].checked) {
        APP.showTips('请先阅读并同意《委托投注规则》后才能继续')
        return;
      }
      // 判断购买方式 2追买 3合买
      var buytype = parseInt(box.find('.j-br-type .active').attr('data-buytype'));
      var requestURL = '';
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
      if ((parseInt(params.rengouMoney) + parseInt(params.baodiText)) > (params.beishu * params.zhushu * 2)) {
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
          COMMON.onSubmitDone(data.retCode, data.retMsg)
        })
        .fail(function() {
          COMMON.onSubmitFail()
        });
    }
  });

  //拖胆上传
  $('#j-tuodan-sub').on('click', function(event) {
    event.preventDefault();
    var box = $(this).parents('.box-left');
    var params = COMMON.getCommonParams(box);
    params.codes = COMMON.tuodanFormarFormSub(box.find('.br-zhu-item'));
    if (COMMON.onSubmitInit(params)) {
      APP.showTips('请至少选择1注号码投注')
      return;
    } else {
      if (!box.find('.j-sub-agreed')[0].checked) {
        APP.showTips('请先阅读并同意《委托投注规则》后才能继续')
        return;
      }
      // 胆拖玩法类型 为2 固定
      params.playName = 2;
      // 判断购买方式 2追买 3合买
      var buytype = parseInt(box.find('.j-br-type .active').attr('data-buytype'));
      var requestURL = '';
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
      if ((parseInt(params.rengouMoney) + parseInt(params.baodiText)) > (params.beishu * params.zhushu * 2)) {
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
          COMMON.onSubmitDone(data.retCode, data.retMsg)
        })
        .fail(function() {
          COMMON.onSubmitFail()
        });
    }
  });

  //粘贴上传
  $('#j-upload-sub').on('click', function(event) {
    event.preventDefault();
    var box = $(this).parents('.box-left');
    var params = COMMON.getCommonParams(box);
    params.beishu = 1;

    if (COMMON.onSubmitInit(params)) {
      APP.showTips('请至少选择1注号码投注')
      return;
    } else {
      if (!box.find('.j-sub-agreed')[0].checked) {
        APP.showTips('请先阅读并同意《委托投注规则》后才能继续')
        return;
      }
      // 判断购买方式 2追买 3合买
      var buytype = parseInt(box.find('.j-br-type .active').attr('data-buytype'));
      var requestURL = '';
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
      if ((parseInt(params.rengouMoney) + parseInt(params.baodiText)) > (params.beishu * params.zhushu * 2)) {
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
          COMMON.onSubmitDone(data.retCode, data.retMsg)
        })
        .fail(function() {
          COMMON.onSubmitFail()
        });
    }
  });

  // 多期投注 - Submit
  $('#j-more-sub').on('click', function(event) {
    event.preventDefault();
    var box = $(this).parents('.tab-pane');
    var params = COMMON.getCommonParams(box);
    params.zhushu = $('#j-more-zhu').val();
    params.beishu = $('#j-more-bei').val();
    params.qishu = $('#j-more-qi').val();

    if (COMMON.onSubmitInit(params)) {
      APP.showTips('请至少选择1注号码投注')
      return;
    } else {
      if (!box.find('.j-sub-agreed')[0].checked) {
        APP.showTips('请先阅读并同意《委托投注规则》后才能继续')
        return;
      }
      $.ajax({
          url: '/lottery/digital/buy-rank/' + params.lotyName + '/' + params.playName,
          type: 'post',
          dataType: 'json',
          data: params,
        })
        .done(function(data) {
          COMMON.onSubmitDone(data.retCode, data.retMsg)
        })
        .fail(function() {
          COMMON.onSubmitFail()
        });
    }
  });

});


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