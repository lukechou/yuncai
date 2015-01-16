'use strict';
$(function() {

  var rHd = $('.right-hd');
  if (rHd.length) {
    $('.left-hd').height(rHd[0].clientHeight);
  }

  var HeMai = {
    max: $('#j-max').html(),
    dan: $('#j-dan').html(),
    total: $('#j-total').html(),
  };

  var buy = {
    buyTotal: $('#j-buy'),
    buyMoney: $('#j-buy-total')
  };

  function updateBuyMoneyTotal() {
    var x = parseInt(buy.buyTotal.val());
    var y = parseInt(HeMai.dan);
    $('#j-buy-total').html(x * y);
  }

  function checkBuyTotal() {
    var v = parseInt(buy.buyTotal.val());
    var results = true;

    if (!buy.buyTotal.val()) {
      APP.showTips('购买份数不能为空！');
      return false;
    }

    if (isNaN(v)) {
      buy.buyTotal.val(HeMai.max);
      updateBuyMoneyTotal();
      APP.showTips('请输入购买份数');
      return false;
    }

    if (APP.isDecimal(buy.buyTotal.val())) {
      APP.showTips('购买份数不能为小数');
      return false;
    }

    if (v > HeMai.max) {
      APP.showTips('现在最多可以购买' + HeMai.max + '份啊！');
      return false;
    }
    return results;
  }

  $('body').on('click', '#hemaiRefresh', function(event) {
    window.location.reload();
  });

  $('#j-buy').on('keyup', function(event) {
    $(this).val($(this).val().replace(/\D|^0/g, ''));
    updateBuyMoneyTotal();
  });

  $('#j-buy').on('change', function() {
    var v = parseInt(buy.buyTotal.val());

    if (isNaN(v)) {
      buy.buyTotal.val(HeMai.max);
    }

    if (APP.isDecimal(buy.buyTotal.val())) {
      buy.buyTotal.val(HeMai.max);
    }

    if (v > HeMai.max) {
      buy.buyTotal.val(HeMai.max);
    }

    updateBuyMoneyTotal();

  });

  $('#buy-submit').on('click', function() {
    var isAgreen = $('#j-isAgreen')[0].checked;
    var template = '';
    var h = '';
    var b = parseInt(buy.buyTotal.val());
    var mtotal = $('#j-total').html();
    var mid = $('#j-qihao').val();
    var midHtml = '';
    var mname = $('#j-lotyName').html();
    var html = '';
    var v = '';
    var max = '';
    var percent = '';
    var data = '';
    var appendHtml = '';
    var date = '';

    if (!isAgreen) {
      APP.showTips('请先阅读并同意《委托投注规则》后才能继续');
    } else {
      if (checkBuyTotal()) {

        data = {
          byNum: b,
          joinURI: $('#j-joinURI').val(),
          prjctId: $('#j-projectId').val(),
          onSuccess: function() {

            v = parseInt(buy.buyTotal.val());
            max = parseInt(HeMai.max);
            percent = (100 - ((max - v) * HeMai.dan / HeMai.total * 100)).toFixed(2);

            if (percent == 100) {
              $('#j-buy')[0].disabled = true;
              $('#buy-submit')[0].disabled = true;
              buy.buyTotal.val('').attr('placeholder', '剩余0份');
              $('#j-pro-bar').html('100%').width('100%');
              buy.buyMoney.html(0);
              HeMai = null;
              buy = null;
            } else {
              $('#j-max').html(max - v);
              $('#j-pro-bar').html(percent + '%').width(percent + '%');
              buy.buyTotal.val('').attr('placeholder', '剩余' + (max - v) + '份');
              buy.buyMoney.html(0);
              HeMai.max = max - v;
            }
            date = new Date();
            appendHtml = '<tr><td>' + ($('#messages tbody tr').length + 1) + '</td><td>' + $('#myname').html() + '</td><td>' + b + '</td><td>' + b + '</td><td>0.00</td><td>' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '</td></tr>';
            $('#messages tbody').append(appendHtml);

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
        APP.onSubmitConfirm(APP.submitHemai, data, html);
      }
    }

  })
});