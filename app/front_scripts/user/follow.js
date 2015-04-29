require.config({
  paths: {
    jquery: '../lib/jquery',
    lodash: '../lib/lodash.compat.min',
    bootstrap: '../lib/bootstrap.min',
    store: '../lib/store.min',
    app: '../common/app',
    PAGE: '../account/newpager'
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    },
    PAGE: {
      deps: ['jquery'],
      exports: 'jquery'
    }
  }
});

require(['jquery', 'lodash', 'app', 'store', 'bootstrap', 'PAGE'], function($, _, APP, store) {
  'use strict';

  var PAGE7 = new pager(); //定制跟单详情

  // 定制跟单详情 分页函数
  PAGE7.loadDZFollowDetails = function(obj) {
    PAGE7.ajaxUrl = '/user/follow/my-followed'; // ajax url
    PAGE7.pageElement = $('.j-dzgd-detail-page-box'); // 分页dom
    PAGE7.initAjax(obj);
    PAGE7.pageTable = $('#j-dzgd-detail-table'); // 表格 dom

    var dzgdTr = '<tr class="j-dzgd-tr"><td colspan="6"><div class="j-dzgd-div"><div class="dzgd-choose j-dzgd-choose"></div><div class="dzgd-gdje-content j-dzgd-gdje-content"><dl class="tips"><dt class="clearfix"><i class="icon icon-tan"></i><span>跟单提示</span></dt><dd>1.系统根据每次认购金额自动认购发起人发起合买的相应份数，若认购金额小于每份金额则无法认购该方案。<div class="gray-tips">&nbsp;&nbsp;&nbsp;例：每次认购金额10元，合买方案每份3元，则自动认购3份，共计支付9元。以此类推。</div></dd><dd>2.每个彩种只能定制一次。</dd></dl><div class="input-div"><p><label class="l-title">每次认购金额：</label><input type="text" class="j-unit-price">&nbsp;元，至少认购1元</p><p><label class="l-title">定制次数：</label><input type="text" class="j-max-buy-times">&nbsp;次，最多为<strong>999</strong>次</p><div class="ljgd-btn-div clearfix"><p class="ljgd-p1"><button class="btn btn-red j-imme-follow" data-type="0">立即跟单</button></p><p class="ljgd-p2 clearfix"><i class="icon icon-cgou j-checkbox"></i><span class="gray-tips">&nbsp;我已经阅读并同意&nbsp;</span><a href="javascript:;" data-toggle="modal" data-target="#tradeModal">委托投注规则</a></p></div></div></div><div class="dzgd-bfb-content r-dzgd-bfb-content j-dzgd-bfb-content"><dl class="tips"><dt class="clearfix"><i class="icon icon-tan"></i><span>跟单提示</span></dt><dd>1.最低认购比例为1%。进行自动认购时，您的账户余额不能低于每次认购金额。</dd><dd>2.每次认购金额 = 方案金额 × 认购比例，并会根据方案每份金额进行适当调整。</dd></dl><div class="input-div"><p><label class="l-title">每次认购比例：</label><input type="text" class="j-unit-percentage">&nbsp;%，至少认购1%，发起人在本彩种的平均方案金额的1%约为<strong class="fc-3">725.00</strong>元</p><p class="jiner-p clearfix j-jiner-choose"></p><p class="j-rengou-jiner"><label class="l-title">认购金额上限：</label><input type="text" class="j-max-price">&nbsp;元</p><p class="j-dzcs"><label class="l-title">定制次数：</label><input type="text" class="j-max-buy-times">&nbsp;次，最多为<strong>999</strong>次</p><div class="ljgd-btn-div clearfix"><p class="ljgd-p1"><button class="btn btn-red j-imme-follow" data-type="1">立即跟单</button></p><p class="ljgd-p2 clearfix"><i class="icon icon-cgou j-checkbox"></i><span class="gray-tips">&nbsp;我已经阅读并同意&nbsp;</span><a href="javascript:;" data-toggle="modal" data-target="#tradeModal">委托投注规则</a></p></div></div></div></div></td></tr>';


    // ajax 成功回调
    PAGE7.onSuccess = function(data) {
      var htmlOutput = '';
      var detailData = '';
      var dataItem = '';
      if (data.retCode == 100000) {
        console.log(data);
        if (data.retData.data.length > 0) {
          detailData = data.retData.data;
          for (var i = 1; i <= detailData.length; i++) {
            dataItem = detailData[i - 1];
            switch (dataItem.follow_type) {
              case 1:
                htmlOutput += '<tr class="dzgd-tr"><td class="j-loty-name" loty-name="' + dataItem.loty_name + '" ldr-id="' + dataItem.ldr_id + '" leader-uid="' + dataItem.leader_uid + '" fid="' + dataItem.id + '" follow-type="' + dataItem.follow_type + '" follow-max-money="' + dataItem.follow_max_money + '">' + dataItem.loty_cnname + '</td><td class="leader-username"><a href="/user/profile/index/' + dataItem.leader_uid + '" target="_blank">' + dataItem.leader_username + '</a></td><td>' + dataItem.dateline + '</td><td><span class="fc-3">' + dataItem.follow_value + '</span>元</td><td class="j-cishu">' + dataItem.follow_times + '</td><td><button class="btn btn-sear btn-oper j-mod-dzgd">修改</button><a href="javascript:;" class="j-undo">撤销</a></td></tr>' + dzgdTr;
                break;
              case 2:
                htmlOutput += '<tr class="dzgd-tr"><td class="j-loty-name" loty-name="' + dataItem.loty_name + '" ldr-id="' + dataItem.ldr_id + '" leader-uid="' + dataItem.leader_uid + '" fid="' + dataItem.id + '" follow-type="' + dataItem.follow_type + '" follow-max-money="' + dataItem.follow_max_money + '">' + dataItem.loty_cnname + '</td><td class="leader-username"><a href="/user/profile/index/' + dataItem.leader_uid + '" target="_blank">' + dataItem.leader_username + '</a></td><td>' + dataItem.dateline + '</td><td><span class="fc-3">' + dataItem.follow_value + '</span>%</td><td class="j-cishu">' + dataItem.follow_times + '</td><td><button class="btn btn-sear btn-oper j-mod-dzgd">修改</button><a href="javascript:;" class="j-undo">撤销</a></td></tr>' + dzgdTr;
                break;
            }
          }
        } else {
          htmlOutput = '<tr><td colspan="6">当前没有跟单用户</td></tr>';
        }

        PAGE7.config.pageNum = Math.ceil(data.retData.size / PAGE7.config.pageSize); // 记录数赋值
        PAGE7.makePageHtml(); // 初始化分页组件
        PAGE7.bindPageEvent(PAGE7.loadDZFollowDetails); // 绑定分页组件事件
      } else {
        PAGE7.config.pageNum = 0;
        PAGE7.makePageHtml();
        htmlOutput = '<tr><td colspan="6">' + data.retMsg + '</td></tr>';
      }
      this.appendTable(htmlOutput); //初始化表格
    };
  };

  PAGE7.loadDZFollowDetails({
    page: 1, //第几页
    pageSize: 10, // 多少条1页
    pageElement: '.j-dzgd-detail-page-box'
  });

  $(document).delegate('.j-undo', 'click', function(event) {
    var _this = $(this);
    var followID = _this.parents('.dzgd-tr').find('.j-loty-name').attr('fid');
    var leaderUserName = _this.parents('.dzgd-tr').find('.leader-username').text();
    var DATA = {
      follow_id: followID
    };

    APP.showTips({
      text: '<div class="frbox"><div class="text"><p>确认撤销对' + leaderUserName + '的跟单吗？</p></div></div>',
      type: 2,
      className: 'undoModel',
      onConfirm: function() {
        undoFollow(DATA);
      }
    });

  });

  function undoFollow(DATA) {
    $.ajax({
        url: '/user/follow/un-follow',
        type: 'get',
        dataType: 'json',
        data: DATA
      })
      .done(function(data) {
        if (data.retCode == 100000) {
          APP.showTips({
            text: '撤销成功！'
          });
        } else {
          APP.showTips(data.retMsg);
        }
        PAGE7.loadDZFollowDetails({
          page: 1, //第几页
          pageSize: 10, // 多少条1页
          pageElement: '.j-dzgd-detail-page-box'
        });
      })
      .fail(function() {
        APP.showTips('撤销失败！');
      });
  }

  $(document).delegate('.j-mod-dzgd', 'click', function() {
    var targetTr = $(this).parent('td').parent('tr').next('tr.j-dzgd-tr');
    var _this = $(this);
    var newRadio = _this.parents('.dzgd-tr').next('.j-dzgd-tr').find('.j-dzgd-choose');
    var gdjeContent = targetTr.find('.j-dzgd-gdje-content');
    var bfbContent = targetTr.find('.j-dzgd-bfb-content');
    var jinerChoose = targetTr.find('.j-jiner-choose');
    var rengouJiner = targetTr.find('.j-rengou-jiner');
    var followType = _this.parents('td').siblings('.j-loty-name').attr('follow-type');
    var yuanBi = _this.parents('.dzgd-tr').find('.fc-3').text();
    var ciShu = _this.parents('td').siblings('.j-cishu').text();
    var followMaxMoney = parseInt(_this.parents('td').siblings('.j-loty-name').attr('follow-max-money'));
    if ('修改' == _this.text()) {
      _this.text('收起');
      switch (followType) {
        case '1':
          newRadio.html('<span><input type="radio" name="dzgd" id="gdje" checked="checked"><label for="gdje">按固定金额定制跟单</label></span><span><input type="radio" name="dzgd" id="bfb"><label for="bfb">按百分比定制跟单</label></span>');
          targetTr.css({
            display: 'table-row'
          });
          gdjeContent.show();
          gdjeContent.find('.j-unit-price').val(yuanBi);
          gdjeContent.find('.j-max-buy-times').val(ciShu);
          gdjeContent.find('.j-imme-follow').text('确认修改');
          bfbContent.hide();
          break;
        case '2':
          newRadio.html('<span><input type="radio" name="dzgd" id="gdje"><label for="gdje">按固定金额定制跟单</label></span><span><input type="radio" name="dzgd" id="bfb" checked="checked"><label for="bfb">按百分比定制跟单</label></span>');
          targetTr.css({
            display: 'table-row'
          });
          gdjeContent.hide();
          bfbContent.show();
          bfbContent.find('.j-unit-percentage').val(yuanBi);
          bfbContent.find('.j-max-buy-times').val(ciShu);
          switch(followMaxMoney){
            case 0 :
              jinerChoose.html('<span><input type="radio" name="jiner" checked="checked" id="wux-jiner"><label>&nbsp;无金额上限</label></span><span><input type="radio" name="jiner" id="set-up-jiner"><label>&nbsp;设置金额上限</label><span class="gray-tips">(超过上限时，仅购买上限)</span></span>');
              rengouJiner.hide();
            break;
            default:
            jinerChoose.html('<span><input type="radio" name="jiner" id="wux-jiner" /><label>&nbsp;无金额上限</label></span><span><input type="radio" name="jiner" id="set-up-jiner" checked="checked"/><label>&nbsp;设置金额上限</label><span class="gray-tips">(超过上限时，仅购买上限)</span></span>');
              rengouJiner.show();
              bfbContent.find('.j-max-price').val(followMaxMoney);
            break;
          }
          bfbContent.find('.j-imme-follow').text('确认修改');
          break;
      }
    } else if ('收起' == _this.text()) {
      _this.text('修改');
      newRadio.html();
      targetTr.css({
        display: 'none'
      });
      bfbContent.show();
      gdjeContent.hide();
    }
  });

  $(document).delegate('.j-dzgd-choose span', 'click', function(event) {
    var _this = $(this);
    var radioId = _this.find('input[type="radio"]').attr('id');
    _this.siblings('span').find('input[type="radio"]').removeAttr('checked')
    _this.find('input[type="radio"]').prop('checked', true);
    var gdjeContent = _this.parents('.j-dzgd-choose').siblings('.j-dzgd-gdje-content');
    var bfbContent = _this.parents('.j-dzgd-choose').siblings('.j-dzgd-bfb-content');
    var newRadio = '<span><input type="radio" name="jiner" checked="checked" id="wux-jiner"><label>&nbsp;无金额上限</label></span><span><input type="radio" name="jiner" id="set-up-jiner"><label>&nbsp;设置金额上限</label><span class="gray-tips">(超过上限时，仅购买上限)</span></span>';
    var pJinerChoose = bfbContent.find('.j-jiner-choose');
    var pRenGouChoose = bfbContent.find('.j-rengou-jiner');
    var submitBtn = bfbContent.find('.j-imme-follow');

    //重置input[type="text"]
    //gdjeContent.find('input[type="text"]').val("");
    //bfbContent.find('input[type="text"]').val("");

    switch (radioId) {
      case 'gdje':
        gdjeContent.show();
        pJinerChoose.html();
        bfbContent.hide();
        break;
      case 'bfb':
        bfbContent.show();
        pJinerChoose.html(newRadio);
        pRenGouChoose.hide();
        gdjeContent.hide();
        submitBtn.attr('data-type', 1);
        break;
    }
  });

  $(document).delegate('.j-jiner-choose span', 'click', function(event) {
    var _this = $(this);
    var radioId = _this.find('input[type="radio"]').attr('id');
    _this.siblings('span').find('input[type="radio"]').removeAttr('checked');
    _this.find('input[type="radio"]').prop('checked', true);
    var rengouJiner = _this.parents('.j-jiner-choose').next('.j-rengou-jiner');
    var submitBtn = _this.parents('.j-jiner-choose').siblings('.ljgd-btn-div').find('.j-imme-follow');

    var dzcs = _this.parents('.j-jiner-choose').siblings('.j-dzcs');
    //rengouJiner.find('input[type="text"]').val("");
    //dzcs.find('input[type="text"]').val("");

    switch (radioId) {
      case 'wux-jiner':
        rengouJiner.hide();
        submitBtn.attr({
          'data-type': 1
        });
        break;
      case 'set-up-jiner':
        rengouJiner.show();
        submitBtn.attr({
          'data-type': 2
        });
        break;
    }
  });

  $(document).delegate('.j-checkbox', 'click', function(event) {
    event.preventDefault();
    var _this = $(this);
    if (_this.hasClass('icon-cgou')) {
      _this.removeClass('icon-cgou').addClass('icon-cbox');
    } else {
      _this.removeClass('icon-cbox').addClass('icon-cgou');
    }
  });


  /**
   * 定制跟单某个人
   * POST kp2.yuncai.com/user/follow/follow
   *
   * leader_id 超级发起人id
   * loty_name 彩种名称
   * unit_price 单次跟买的金额
   * unit_percentage 单次跟买的比例
   * max_price 单次最大金额，仅比例跟单有效
   * max_buy_times 最大跟买次数
   */
  $(document).delegate('.j-imme-follow', 'click', function(event) {
    event.preventDefault();
    var _this = $(this);
    var leaderID = _this.parents('.j-dzgd-tr').prev('.dzgd-tr').find('.j-loty-name').attr('leader-uid');
    leaderID = (leaderID == undefined) ? uid : leaderID;
    var lotyName = _this.parents('.j-dzgd-tr').prev('.dzgd-tr').find('.j-loty-name').attr('loty-name');
    var unitPrice,
      maxBuyTimes,
      unitPercentage,
      maxPrice,
      DATA = {};
    var followID = _this.parents('.j-dzgd-tr').prev('.dzgd-tr').find('.j-loty-name').attr('ldr-id');

    var outhtml;

    var dataType = _this.attr('data-type'); //0-按固定金额定制跟单，1-按百分比定制跟单-无限金额上线，2-按百分比定制跟单-设置金额上线；

    if (!(_this.parents('.ljgd-p1').next('.ljgd-p2').find('.j-checkbox').hasClass('icon-cgou'))) {
      APP.showTips('请先阅读并同意《委托投注规则》后才能继续');
      return;
    }
    switch (dataType) {
      case '0':
        unitPrice = _this.parents('.input-div').find('.j-unit-price').val();
        maxBuyTimes = _this.parents('.input-div').find('.j-max-buy-times').val();
        if (!unitPrice && !maxBuyTimes) {
          APP.showTips('每次认购金额和定制次数不能为空');
          return;
        } else if (!unitPrice) {
          APP.showTips('每次认购金额不能为空');
          return;
        } else if (!maxBuyTimes) {
          APP.showTips('定制次数不能为空');
          return;
        }

        DATA = {
          leader_id: leaderID,
          loty_name: lotyName,
          unit_price: unitPrice,
          max_buy_times: maxBuyTimes,
          follow_id: followID,
          data_type: dataType
        };
        outhtml = '<div class="frbox"><img src="http://static3.yuncai.com/front_images/fail.png" alt="success" class="icon"><div class="text"><p>每次认购金额：<span class="fc-3">' + unitPrice + '</span>元</p><p>定制次数：<span class="fc-3">' + maxBuyTimes + '</span>次</p><p>确认按以上信息进行跟单吗？</p></div></div>';

        break;

      case '1':
        unitPercentage = _this.parents('.input-div').find('.j-unit-percentage').val();
        maxBuyTimes = _this.parents('.input-div').find('.j-max-buy-times').val();
        if (!unitPercentage && !maxBuyTimes) {
          APP.showTips('每次认购比例和定制次数不能为空');
          return;
        } else if (!unitPercentage) {
          APP.showTips('每次认购比例不能为空');
          return;
        } else if (!maxBuyTimes) {
          APP.showTips('定制次数不能为空');
          return;
        }

        DATA = {
          leader_id: leaderID,
          loty_name: lotyName,
          unit_percentage: unitPercentage,
          max_buy_times: maxBuyTimes,
          follow_id: followID,
          data_type: dataType
        };
        outhtml = '<div class="frbox"><img src="http://static3.yuncai.com/front_images/fail.png" alt="success" class="icon"><div class="text"><p>每次认购比例：<span class="fc-3">' + unitPercentage + '</span>%</p><p>定制次数：<span class="fc-3">' + maxBuyTimes + '</span>次</p><p>确认按以上信息进行跟单吗？</p></div></div>';

        break;

      case '2':
        unitPercentage = _this.parents('.input-div').find('.j-unit-percentage').val();
        maxPrice = _this.parents('.input-div').find('.j-max-price').val();
        maxBuyTimes = _this.parents('.input-div').find('.j-max-buy-times').val();
        if (!unitPercentage && !maxPrice && !maxBuyTimes) {
          APP.showTips('每次认购比例、认购金额上限、定制次数不能为空');
          return;
        } else if (unitPercentage && !maxPrice && !maxBuyTimes) {
          APP.showTips('认购金额上限、定制次数不能为空');
          return;
        } else if (maxPrice && !unitPercentage && !maxBuyTimes) {
          APP.showTips('每次认购比例、定制次数不能为空');
          return;
        } else if (maxBuyTimes && !unitPercentage && !maxPrice) {
          APP.showTips('每次认购比例、认购金额上限不能为空');
          return;
        } else if (!unitPercentage) {
          APP.showTips('每次认购比例不能为空');
          return;
        } else if (!maxPrice) {
          APP.showTips('认购金额上限不能为空');
          return;
        } else if (!maxBuyTimes) {
          APP.showTips('定制次数不能为空');
          return;
        }

        DATA = {
          leader_id: leaderID,
          loty_name: lotyName,
          unit_percentage: unitPercentage,
          max_price: maxPrice,
          max_buy_times: maxBuyTimes,
          follow_id: followID,
          data_type: dataType
        };
        outhtml = '<div class="frbox"><img src="http://static3.yuncai.com/front_images/fail.png" alt="success" class="icon"><div class="text"><p class="dzgd-tL">每次认购比例：<span class="fc-3">' + unitPercentage + '</span>%</p><p class="dzgd-tL">认购金额上限：<span class="fc-3">' + maxPrice + '</span>元</p><p class="dzgd-tL">定制次数：<span class="fc-3">' + maxBuyTimes + '</span>次</p><p class="dzgd-tL-bot">确认按以上信息进行跟单吗？</p></div></div>';
        break;
    }

    APP.onlyCheckLogin({
      checkLogin: function() {
        APP.showTips({
          text: outhtml,
          type: 2,
          onConfirm: function() {
            confirmFollow(DATA, _this);
          }
        });
      }
    });

  });


  function confirmFollow(DATA, _this) {
    $.ajax({
        url: '/user/follow/follow',
        type: 'get',
        dataType: 'json',
        data: DATA
      })
      .done(function(data) {
        if (data.retCode == 100000) {
          APP.showTips('修改跟单设置成功！');
          _this.parents('.j-dzgd-div').find('input[type="text"]').val('');
        } else {
          APP.handRetCode(data.retCode, data.retMsg);
        }
        PAGE7.loadDZFollowDetails({
          page: 1, //第几页
          pageSize: 10, // 多少条1页
          pageElement: '.j-dzgd-detail-page-box'
        });
        //window.location.reload();
      })
      .fail(function() {
        APP.onServiceFail();
      });
  }

  $(document).delegate('.j-dzgd-gdje-content .j-unit-price', 'change', function(event) {
    var max = $(this).attr('data-max');
    var v = $(this).val();

    var result = filterNum(v, max);
    result = result > 100000 ? 100000 : result;
    $(this).val(result);

  });
  $(document).delegate('.j-dzgd-gdje-content .j-unit-price', 'keyup', function(event) {
    var max = $(this).attr('data-max');
    var v = $(this).val();

    var result = filterNum(v, max);
    result = result > 100000 ? 100000 : result;
    $(this).val(result);

  });
  $(document).delegate('.j-max-buy-times', 'change', function(event) {
    var max = $(this).attr('data-max');
    var v = $(this).val();

    var result = filterNum(v, max);
    result = result > 999 ? 999 : result;
    $(this).val(result);

  });
  $(document).delegate('.j-max-buy-times', 'keyup', function(event) {
    var max = $(this).attr('data-max');
    var v = $(this).val();

    var result = filterNum(v, max);
    result = result > 999 ? 999 : result;

    $(this).val(result);

  });

  $(document).delegate('.j-dzgd-bfb-content .j-unit-percentage', 'change', function(event) {
    var max = $(this).attr('data-max');
    var v = $(this).val();

    var result = filterNum(v, max);
    result = result > 99 ? 99 : result;
    $(this).val(result);

  });
  $(document).delegate('.j-dzgd-bfb-content .j-unit-percentage', 'keyup', function(event) {
    var max = $(this).attr('data-max');
    var v = $(this).val();

    var result = filterNum(v, max);
    result = result > 99 ? 99 : result;

    $(this).val(result);

  });
  $(document).delegate('.j-dzgd-bfb-content .j-max-price', 'change', function(event) {
    var max = $(this).attr('data-max');
    var v = $(this).val();
    var result = filterNum(v, max);
    result = result > 100000 ? 100000 : result;
    $(this).val(result);
  });

  $(document).delegate('.j-dzgd-bfb-content .j-max-price', 'keyup', function(event) {
    var max = $(this).attr('data-max');
    var v = $(this).val();
    var result = filterNum(v, max);
    result = result > 100000 ? 100000 : result;
    $(this).val(result);
  });

  function filterNum(v, max) {

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
    n = n > max ? max : n;
    return n;
  }

});