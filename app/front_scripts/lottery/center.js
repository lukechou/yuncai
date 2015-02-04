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

require(['jquery', 'lodash', 'store', 'app', 'bootstrap', 'pager'], function ($, _, store, APP) {

  'use strict';

  var submitHemai = function (obj) {

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
      .done(function (data) {
        if (data.retCode == 100000) {
          if (obj.onSuccess) {
            obj.onSuccess();
          }
          APP.updateUserMoney();
          APP.showTips({
            text: '合买成功!',
            type: 1,
            onConfirm: function () {
              window.location.reload();
            }
          });
          $('body').on('click', '.close', function (event) {
            window.history.go(0);
          });
        } else {
          APP.handRetCode(data.retCode, data.retMsg);
        }
      })
      .fail(function () {
        APP.onServiceFail();
      });

  };

  $('#j-gou').on('click', '.j-gou-btn', function () {

    var tr = $(this).parents('tr');
    var count = tr.find('.j-gou-count');
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
    };
    var mname = lotyNameObj[lotyName];

    if (checkByNum(b, max)) {
      data = {
        byNum: b,
        joinURI: tr.find('.joinUrl').val(),
        prjctId: tr.find('.pid').val(),
        onSuccess: function (d) {
          max = max - b;
          count.attr({
            'placeholder': '最多' + max,
            'data-max': max
          });
        }
      };
      if (mid) midHtml = '第<span>' + mid + '</span>期';

      template = _.template('<div class="frbox"><img src="' + staticHostURI + '/front_images/fail.png" alt="success" class="icon"><div class="text"><p><%= lotyName%> ' + midHtml + '</p><p>方案总金额<span class="fc-3"><%= total %></span></p><p>您认购<span><%= pay %>.00</span>元</p><p>共需支付<span class="fc-3"><%= pay %>.00</span>元</p><div class="btns"><button class="btn btn-danger" id="buyConfirm">确定</button><button class="btn btn-gray" data-dismiss="modal">取消</button></div></div></div>');
      h = template({
        lotyName: mname,
        total: mtotal,
        pay: b
      });
      html = {
        html: h,
      };
      APP.checkLogin(b, {
        enoughMoney: function () {
          APP.showTips(html);
          $('#buyConfirm').one('click', function (event) {
            submitHemai(data);
          });
        }
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

  $('body').on('click', '#hemaiRefresh', function (event) {
    window.location.reload();
  });

  $('#projectList').on('change', '.j-gou-count', function (event) {
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

  // Init Table
  PAGE.loadPrjctLst({
    qid: $('#qid').val(),
    status: '',
    tc: '',
    aegis: '',
    username: '',
    pageSize: 10,
    innerHtmlObj: $('.m-pager'),
    page: 1
  });

  $('#searchBtn').on('click', function (event) {
    event.preventDefault(); /* Act on the event */
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
      innerHtmlObj: $('.m-pager'),
      page: 1
    };
    PAGE.loadPrjctLst(obj);
  });

});