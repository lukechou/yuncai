  $(function() {

    $('#j-gou').on('click', '.j-gou-btn', function() {
      var b = Number($(this).parents('tr').find('.j-gou-count').val());
      if (isNaN(b)) {
        APP.showTips('请输入整数购买份数!')
      } else {
        if (b<=0) {
          APP.showTips('请输入整数购买份数!')
        } else {
          b = Math.ceil(b);
          var data = {
            byNum: b,
            joinURI: $(this).parents('tr').find('.joinUrl').val(),
            prjctId: $(this).parents('tr').find('.pid').val(),
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