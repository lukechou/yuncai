  $(function() {

    $('#j-gou').on('click', '.j-gou-btn', function() {

      var count = $(this).parents('tr').find('.j-gou-count');
      var b = Number(count.val());
      var max = Number(count.attr('data-max'));

      if (_.isNaN(b)) {
        APP.showTips('请输入整数购买份数!')
      } else {

        if (b <= 0 || FILTER.isDecimal(b)) {
          APP.showTips('请输入整数购买份数!')
        } else {

          var data = {
            byNum: b,
            joinURI: $(this).parents('tr').find('.joinUrl').val(),
            prjctId: $(this).parents('tr').find('.pid').val(),
            onSuccess: function(d) {
              max = max - b;
              count.attr({
                'placeholder': '最多' + max,
                'data-max': max
              });
            }
          };

          APP.submitHemai(data);
        }

      }

    });

    $('#searchBtn').on('click', function(event) {
      event.preventDefault();
      /* Act on the event */
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

  });