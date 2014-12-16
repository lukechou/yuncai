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
        APP.showTips('请输入购买份数')
        return false;
      }

      if (FILTER.isDecimal(buy.buyTotal.val())) {
        APP.showTips('购买份数不能为小数')
        return false;
      }

      if (v > HeMai.max) {
        APP.showTips('现在最多可以购买' + HeMai.max + '份啊！');
        return false;
      }
      return results;
    }

    $('#j-buy').on('change', function() {
      var v = parseInt(buy.buyTotal.val());

      if (isNaN(v)) {
        return;
      }

      if (FILTER.isDecimal(buy.buyTotal.val())) {
        return;
      }
      if (v > HeMai.max) {
        return;
      }

      updateBuyMoneyTotal();

    });

    $('#buy-submit').on('click', function() {
      var isAgreen = $('#j-isAgreen')[0].checked;
      if (!isAgreen) {
        APP.showTips('请先阅读并同意《委托投注规则》后才能继续')
      } else {
        if (checkBuyTotal()) {
          var data = {
            byNum: buy.buyTotal.val(),
            joinURI: $('#j-joinURI').val(),
            prjctId: $('#j-projectId').val(),
            onSuccess: function() {

              var v = parseInt(buy.buyTotal.val());
              var max = parseInt(HeMai.max);
              var percent = (100 - ((max - v) * HeMai.dan / HeMai.total * 100)).toFixed(2);

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

              APP.showTips('充值成功!')
            }
          };
          APP.submitHemai(data);
        }
      }

    })