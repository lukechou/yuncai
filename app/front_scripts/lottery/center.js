/* 合买大厅 */
require.config({
  paths: {
    jquery: '../lib/jquery',
    lodash: '../lib/lodash.compat.min',
    bootstrap: '../lib/bootstrap.min',
    store: '../lib/store.min',
    app: '../common/app',
    pager: '../account/pager'
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    },
  }
});

require(['jquery', 'lodash', 'store', 'app', 'bootstrap', 'pager'], function($, _, store, APP) {

  'use strict';

  // 合买大厅分页
  PAGE.loadPrjctLst = function(obj) {
    var path = window.location.pathname.replace(/\/*$/, '');
    PAGE.ajaxUrl = path + '/ajax';
    PAGE.pageElement = $('#j-page-area');
    PAGE.initAjax(obj);

    PAGE.onSuccess = function(data) {

      var htmlOutput = '';
      var htmlStatu = '';
      var htmlUse = '';
      var dataItem = '';

      if (data.retCode != 100000) {
        APP.showTips(data.retMsg);
      }
      if (data.retData && data.retData.data.length > 0) {
        var detailData = data.retData.data;
        for (var i = 1; i <= detailData.length; i++) {
          dataItem = detailData[i - 1];
          switch (obj.status) {
            case '2':
              htmlStatu = '<span class="miss-tips">已满员</span>';
              htmlUse =
                '<a class="miss-dan" href="' + dataItem.detailURI + '">详情</a>\
                <input type="hidden" name="joinUrl" class="joinUrl" value="' + dataItem.joinURI + '" />\
                <input type="hidden" name="pid" class="pid" value="' + dataItem.id + '" />';
              break;
            case '3':
              htmlStatu = '<span class="miss-tips">已撤单</span>';
              htmlUse =
                '<a class="miss-dan" href="' + dataItem.detailURI + '">详情</a>\
                <input type="hidden" name="joinUrl" class="joinUrl" value="' + dataItem.joinURI + '" />\
                <input type="hidden" name="pid" class="pid" value="' + dataItem.id + '" />';
              break;
            default:
              htmlStatu = '<input type="text" class="text-left u-ci w50 j-gou-count" placeholder="剩余' + dataItem.lessNum + '份" data-max="' + dataItem.lessNum + '" maxlength="' + dataItem.lessNum.toString().split('').length + '">';
              htmlUse = '<button data-type="1" data-one="' + dataItem.unitPrice + '" class="text-left btn btn-s btn-c1 j-gou-btn">购买</button><a href="' + dataItem.detailURI + '">详情</a><input type="hidden" name="joinUrl" class="joinUrl" value="' + dataItem.joinURI + '" /><input type="hidden" name="pid" class="pid" value="' + dataItem.id + '" />';
              break;
          }
          htmlOutput +=
            '<tr>\
                  <td>' + i + '</td>\
                  <td><a class="username" href="' + dataItem.user_profile_url + '">' + dataItem.username + '</a></td>\
                  <td>' + dataItem.schedule + ' %</td>\
                  <td class="tb-4 fc-3 j-mtotal">' + dataItem.price + '元</td>\
                  <td class="text-left">' + dataItem.unitPrice + '元</td><td>' + htmlStatu + htmlUse + '</td></tr>';
        }
      } else {
        htmlOutput = '<td colspan="6" style="height:50px">暂无相关记录</td>';
      }

      PAGE.config.pageNum = Math.ceil(data.retData.totalRecord / obj.pageSize);
      PAGE.makePageHtml();
      PAGE.bindPageEvent(PAGE.loadPrjctLst);

      if (data.retData.totalRecord > obj.pageSize) {
        $('#j-page-line').show();
        $('#j-page-area').show();
      }

      this.appendTable(htmlOutput);

      // for ie8 table odd hack
      $("tbody tr:nth-child(odd) td").css("background", "#f1f1f1");
    };

    PAGE.onFail = function() {
      return;
    };
  };

  var submitHemai = function(obj) {

    $.ajax({
        url: obj.joinURI,
        type: 'get',
        dataType: 'json',
        data: {
          pid: obj.prjctId,
          buyNum: obj.byNum,
          unikey: (new Date()).valueOf()
        },
      })
      .done(function(data) {
        if (data.retCode == 100000) {
          if (obj.onSuccess) {
            obj.onSuccess();
          }
          APP.updateUserMoney();
          APP.showTips({
            text: '合买成功!',
            type: 1,
            onConfirm: function() {
              window.location.reload();
            }
          });
          $('body').on('click', '.close', function(event) {
            window.history.go(0);
          });
        } else {
          APP.handRetCode(data.retCode, data.retMsg);
        }
      })
      .fail(function() {
        APP.onServiceFail();
      });

  };

  $('#j-gou').on('click', '.j-gou-btn', function() {

    var tr = $(this).parents('tr');
    var count = tr.find('.j-gou-count');
    var onePrice = $(this).attr('data-one');
    var b = Number(count.val());
    var max = Number(count.attr('data-max'));
    var data = {};
    var html = {};
    var template = '';
    var h = '';
    var mtotal = tr.find('.j-mtotal').html();
    var mid = $('#j-mqi').html();
    var midHtml = '';
    var lotyNameObj = {
      ssq: '双色球',
      dlt: '大乐透',
      jczq: '竞彩足球',
      pl3: '排列3',
      pl5: '排列5',
      fc3d: '福彩3D',
      qlc: '七乐彩',
      qxc: '七星彩',
      bjdc: '足球单场',
      sfc: '胜负彩',
      r9: '任选九',
      jclq: '竞彩篮球'
    };
    var mname = lotyNameObj[lotyName];
    var tabIndex = tr.find('.joinUrl').val().split('/');
    var tab = {
      'bqc_gg': '半全场',
      'spf_gg': '胜平负',
      'rqspf_gg': '让球胜平负',
      'zjq_gg': '总进球',
      'bf_gg': '比分',
      'hhtz_gg': '混合投注',
      'zjq': '总进球',
      'bf': '比分',
      'sxds': '上下单双',
      'spf': '胜平负',
      'bqc': '半全场',
      sf: '胜负',
      rfsf: '让分胜负',
      hhtz: '混合投注',
      sfc: '胜分差',
      dxf: '大小分',
    };

    var tabHtml = tab[tabIndex[tabIndex.length - 1]] || '';

    if (checkByNum(b, max)) {
      data = {
        byNum: b,
        joinURI: tr.find('.joinUrl').val(),
        prjctId: tr.find('.pid').val(),
        onSuccess: function(d) {
          max = max - b;
          count.attr({
            'placeholder': '最多' + max,
            'data-max': max
          });
        }
      };

      if (mid) midHtml = '第<span>' + mid + '</span>期';

      template = _.template('<div class="frbox"><img src="' + staticHostURI + '/front_images/fail.png" alt="success" class="icon"><div class="text"><p><%= lotyName%> ' + midHtml + tabHtml + '</p><p>方案总金额<span class="fc-3"><%= total %></span></p><p>您认购<span><%= pay %></span>份</p><p>共需支付<span class="fc-3"><%= payMoney %>.00</span>元</p><div class="btns"><button class="btn btn-danger" id="buyConfirm">确定</button><button class="btn btn-gray" data-dismiss="modal">取消</button></div></div></div>');

      h = template({
        lotyName: mname,
        total: mtotal,
        pay: b,
        payMoney: b * onePrice
      });

      html = {
        html: h,
      };

      var payMoney = b * onePrice;
      var lessMoneyTips = '';
      lessMoneyTips += '<p>本次需支付：<span class="fc-3 mlr5">' + payMoney + '.00</span>元';


      APP.checkLogin(payMoney, {
        enoughMoney: function() {
          APP.showTips(html);
          $('#buyConfirm').one('click', function(event) {
            submitHemai(data);
          });
        },
        lessMoneyTips: lessMoneyTips
      });
    }
  });

  function checkByNum(num, max) {
    var c = 1;
    if (_.isNaN(num)) {
      APP.showTips('请输入整数购买份数');
      c = 0;
    }
    if (num <= 0 || APP.isDecimal(num)) {
      APP.showTips('请输入整数购买份数');
      c = 0;
    }
    if (num > max) {
      APP.showTips('超过最大可购买份额');
      c = 0;
    }
    return c;
  }

  $('body').on('click', '#hemaiRefresh', function(event) {
    window.location.reload();
  });

  $('#projectList').on('change', '.j-gou-count', function(event) {
    var max = $(this).attr('data-max');
    var v = Number($(this).val());

    if (isNaN(v)) {
      $(this).val(max);
    } else {
      if (v > max) {
        $(this).val(max);
      }
    }

  });

  $('#searchBtn').on('click', function(event) {
    event.preventDefault(); /* Act on the event */

    // icon icon-down-active
    var status = $('#status').val();
    var tc = $('#tc').val();
    var aegis = $('#aegis').val();
    var username = $('#username').val();
    var obj = {
      qid: $('#qid').val(),
      status: status,
      tc: tc,
      aegis: aegis,
      username: username,
      pageSize: 10,
      page: 1
    };
    PAGE.loadPrjctLst(obj);
  });

  $('.j-sort-schedule').on('click', function(event) {
    event.preventDefault();
    /* Act on the event */
    var sortType = 1;
    if ($(this).hasClass('icon-down') || $(this).hasClass('icon-down-active')) {
      initIcon();
      $(this).removeClass();
      $(this).addClass('icon icon-up-active j-sort-schedule');
      sortType = 2;
    } else {
      initIcon();
      $(this).removeClass();
      $(this).addClass('icon icon-down-active j-sort-schedule');
    }
    PAGE.loadPrjctLst({
      qid: $('#qid').val(),
      status: '',
      tc: '',
      aegis: '',
      username: '',
      pageSize: 10,
      sort: sortType,
      page: 1
    });
  });

  $('.j-sort-project-price').on('click', function(event) {
    event.preventDefault();
    /* Act on the event */
    var sortType = 3;
    if ($(this).hasClass('icon-down') || $(this).hasClass('icon-down-active')) {
      initIcon();
      $(this).removeClass();
      $(this).addClass('icon icon-up-active j-sort-project-price');
      sortType = 4;
    } else {
      initIcon();
      $(this).removeClass();
      $(this).addClass('icon icon-down-active j-sort-project-price');
    }
    PAGE.loadPrjctLst({
      qid: $('#qid').val(),
      status: '',
      tc: '',
      aegis: '',
      username: '',
      pageSize: 10,
      sort: sortType,
      page: 1
    });
  });

  $('.j-sort-unit-price').on('click', function(event) {
    event.preventDefault();
    /* Act on the event */
    var sortType = 5;
    if ($(this).hasClass('icon-down') || $(this).hasClass('icon-down-active')) {
      initIcon();
      $(this).removeClass();
      $(this).addClass('icon icon-up-active j-sort-unit-price');
      sortType = 6;
    } else {
      initIcon();
      $(this).removeClass();
      $(this).addClass('icon icon-down-active j-sort-unit-price');
    }
    PAGE.loadPrjctLst({
      qid: $('#qid').val(),
      status: '',
      tc: '',
      aegis: '',
      username: '',
      pageSize: 10,
      sort: sortType,
      page: 1
    });
  });

  function initIcon() {
    var objSchedule = $('.j-sort-schedule');
    var objProjectPrice = $('.j-sort-project-price');
    var objUnitPrice = $('.j-sort-unit-price');
    objSchedule.removeClass();
    objSchedule.addClass('icon icon-down j-sort-schedule');
    objProjectPrice.removeClass();
    objProjectPrice.addClass('icon icon-down j-sort-project-price');
    objUnitPrice.removeClass();
    objUnitPrice.addClass('icon icon-down j-sort-unit-price');
  }

  function pageOnLoad() {

    // Init Table
    PAGE.pageTable = $('#projectList');
    PAGE.loadPrjctLst({
      qid: $('#qid').val(),
      status: '',
      tc: '',
      aegis: '',
      username: '',
      pageSize: 10,
      page: 1
    });

    footFixed();
    $(window).on('resize', function(event) {
      //footFixed();
    });

  }

  function footFixed() {

    var f = $('.ft');
    var a = $(window).height();
    var b = f.height();
    var c = f[0].offsetTop;
    var d = a - b - c;

    if (d > 0) {
      f.css('marginTop', d);
    } else {
      f.css('marginTop', 0);
    }

  }

  pageOnLoad();

});