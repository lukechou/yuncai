$(function () {

  /**
   * Create Td HTML
   * @param  {Array} arr
   * @return {String}
   */
  function craeteTdHTML(arr) {
    var html = '';
    for (var i = arr.length - 1; i >= 0; i--) {
      arr[i] = '<span>' + arr[i] + '</span>';
    };
    html = arr.join('');
    return html;
  }

  function craeteTdHTML2(tznr, sg) {

    var html = '';
    var s = sg.join();

    for (var i = tznr.length - 1; i >= 0; i--) {
      if (tznr[i].join() == s) {
        tznr[i] = '<span class="fc-3">' + tznr[i] + '</span>';
      } else {
        tznr[i] = '<span>' + tznr[i] + '</span>';
      }
    };

    html = tznr.join('');
    return html;
  }

  function getDetail(modelId) {

    $.ajax({
        url: '/lottery/trade/view-detail',
        type: 'get',
        dataType: 'json',
        data: {
          order_no: modelId
        },
      })
      .done(function (data) {

        if (data.retCode == 100000) {
          var dataItem = data.retData[0];
          var html = '<td colspan="7"><div class="look-box"><table class="table m-mn-table m-table-border m-table-middle"><thead><tr><th>赛事编号</th><th>对阵</th><th>赛果</th><th>投注内容</th><th>投注注数</th><th>投注金额（元）</th><th>奖金（元）</th></tr></thead><tbody><tr>';

          html += '<td>' + craeteTdHTML(dataItem.ssbh) + '</td>';
          html += '<td>' + craeteTdHTML(dataItem.dz) + '</td>';
          html += '<td class="fc-3">' + dataItem.sg + '</td>';
          html += '<td>' + craeteTdHTML2(dataItem.tzNr, dataItem.sg) + '</td>';
          html += '<td>' + craeteTdHTML(dataItem.tzZs) + '</td>';
          html += '<td>' + craeteTdHTML(dataItem.tzJe) + '</td>';
          html += '<td class="fc-3">' + dataItem.bonus + '</td>';
          html += '</tr></tbody></table></div></td>';
          $('.j-look[data-no=' + modelId + ']').html(html);

        } else {
          APP.handRetCode(data.retCode, data.retMsg);
        }
      })
      .fail(function () {
        APP.onServiceFail();
      });
  }

  // Read Model Record Detail
  $('#j-table-main').on('click', '.j-history-more', function (event) {
    event.preventDefault();

    var _this = $(this);
    var TR = _this.parents('tr');
    var no = $(this).attr('data-order');

    if (TR.hasClass('on')) {
      $('.j-look[data-no=' + no + ']').remove();
      _this.html('查看详情');
      TR.removeClass('on');
    } else {
      TR.addClass('on');
      _this.html('收起');
      TR.after('<tr class="h-look j-look" data-no="' + no + '"><td colspan="7">正在加载..</td></tr>');
      getDetail(no);
    }

  });

});