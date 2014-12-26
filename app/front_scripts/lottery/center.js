'use strict';
$(function() {
  $('#j-gou').on('click', '.j-gou-btn', function() {
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
    var mname = (lotyName == 'ssq') ? '双色球' : '大乐透';
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
      template = _.template('<div class="frbox"><img src="//static3.yuncai.com/front_images/fail.png" alt="success" class="icon"><div class="text"><p><%= lotyName%> 第<span><%= id%></span>期</p><p>方案总金额<span class="fc-3"><%= total %></span></p><p>您认购<span><%= pay %>.00</span>元</p><p>共需支付<span class="fc-3"><%= pay %>.00</span>元</p><div class="btns"><button class="btn btn-danger" id="buyConfirm">确定</button><button class="btn btn-gray" data-dismiss="modal">取消</button></div></div></div>');
      h = template({
        lotyName: mname,
        id: mid,
        total: mtotal,
        pay: b
      });
      html = {
        html: h,
      };
      APP.onSubmitConfirm(APP.submitHemai, data, html);
    }
  });

  function checkByNum(num, max) {
    var c = 1;
    if (_.isNaN(num)) {
      APP.showTips(APP.getConfirmHtml('请输入整数购买份数'));
      c = 0;
    }
    if (num <= 0 || FILTER.isDecimal(num)) {
      APP.showTips(APP.getConfirmHtml('请输入整数购买份数'));
      c = 0;
    }
    if (num > max) {
      APP.showTips(APP.getConfirmHtml('超过最大可购买份额'));
      c = 0;
    }
    return c;
  }

  $('body').on('click', '#hemaiRefresh', function(event) {
    window.history.go(0);
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

  // Init Table
  PAGE.loadPrjctLst({
    qid: $('#qid').val(),
    status: '',
    tc: '',
    aegis: '',
    username: '',
    pageSize: 10,
    innerHtmlObj: $('.m-pager'),
    page: 0
  });

  $('#searchBtn').on('click', function(event) {
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
      page: 0
    };
    PAGE.loadPrjctLst(obj);
  });

});