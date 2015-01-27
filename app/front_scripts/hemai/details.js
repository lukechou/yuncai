$(function () {

  // Bind  tab change event
  $('#j-tab').on('click', 'a', function (event) {
    if ($(this).attr('data-x') == 0) {
      $('#j-total-zhu').show()
    } else {
      $('#j-total-zhu').hide()
    }
  });

  // Bind Input Change Event
  $('#j-buy').on('change', function () {

    var buy = parseInt($(this).val())
    var buyMoney = $('#j-buy-total')
    var total = parseInt($('#j-total').html()) || 0
    var dan = parseInt($('#j-dan').html()) || 0
    var max = parseInt($('#j-max').html()) || 0

    if (isNaN(buy)) {
      $(this).val(max)
      buyMoney.html(max * dan)
      APP.showTips('请输入购买份数')
      return;
    }

    if (buy < max) {
      var buyPercent = Math.floor(buy / (total / dan) * 100)
      var newPercent = parseInt($('#j-pro-bar').html()) + buyPercent

      if (newPercent < 100) {
        $('#j-pro-bar').html(newPercent + '%').width(newPercent + '%')
        buyMoney.html(buy * dan)
      } else {
        APP.showTips('Some Things Error!')
      }

    } else {
      $(this).val(max)
      buyMoney.html(max * dan)
      APP.showTips('现在最多可以购买' + max + '份啊！')
    }

  });

  // 投注
  $('#buy-submit').on('click', function () {
    var isAgreen = $('#j-isAgreen')[0].checked
    if (isAgreen) {
      var buy = $('#j-buy').val()
      if (buy) {
        debugger
        // $.ajax({
        //   url: '/path/to/file',
        //   type: 'default GET (Other values: POST)',
        //   dataType: 'default: Intelligent Guess (Other values: xml, json, script, or html)',
        //   data: {param1: 'value1'},
        // })
        // .done(function() {
        //   console.log("success");
        // })
        // .fail(function() {
        //   console.log("error");
        // });
      } else {
        APP.showTips('请先填写需要购买份数!')
      }
    } else {
      APP.showTips('请先阅读委托投注规则,并同意！')
    }

  });

  $('#j-ttil').find('input:radio').on('change', function (event) {
    var type = $(this).val()
    var html = ''
    var table = $('#j-ttil').siblings('.table').find('tbody')
    debugger
    // $.ajax({
    //   url: '/path/to/file',
    //   type: 'default GET (Other values: POST)',
    //   dataType: 'default: Intelligent Guess (Other values: xml, json, script, or html)',
    //   data: {param1: 'value1'},
    // })
    // .done(function(data) {

    //   for (var i = 0; i < data.length; i++) {
    //     html += data[i];
    //     table(html)
    //   };
    //   console.log("success");
    // })
    // .fail(function() {
    //   console.log("error");
    // })
    // .always(function() {
    //   console.log("complete");
    // });

  });

});