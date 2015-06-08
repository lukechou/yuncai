require.config({
  paths: {
    jquery: '../lib/jquery',
    zclip: '../lib/zclip',
    app: '../common/app',
    bootstrap: '../lib/bootstrap.min',
    datetimepicker: '../lib/bootstrap-datetimepicker.min'
  },
  shim: {
    zclip: {
      deps: ['jquery'],
      exports: 'jquery'
    },
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    },
    datetimepicker: {
      deps: ['jquery'],
      exports: 'jquery'
    }
  },

});

require(['jquery', 'app', 'zclip', 'bootstrap', 'datetimepicker'], function($, APP, ZeroClipboard) {

  function initClip() {

    var swfPath = staticHostURI + '/front_scripts/lib/ZeroClipboard.swf';
    var clipBtns = $(".j-nav-text");
    ZeroClipboard.config({
      swfPath: swfPath
    });

    var client = new ZeroClipboard($(".j-zclip"));
    client.on("ready", function(readyEvent) {

      client.on("beforecopy", function(event) {});

      client.on("aftercopy", function(event) {
        alert("复制成功!");
      });

    });

  }

  function pageInit() {

    // 表格展开隐藏
    $('#j-table').on('click', '.j-nav-text', function(event) {
      event.preventDefault();

      var t = $(this);
      var c = 'active';
      var f = t.hasClass(c) ? 1 : 0;
      var p = ['展开', '隐藏'];
      var i = t.siblings('.icon');
      var ia = [''];
      if (f) {
        t.parents('tbody').find('tr').show();
        t.removeClass(c)
      } else {
        t.parents('tbody').find('tr').hide();
        t.parents('tbody').find('.j-table-nav').show();
        t.addClass(c);
      }

      t.html(p[f]);

    });

    initClip();

    $.fn.datetimepicker.dates['zh-CN'] = {
      days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
      daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
      months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
      monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
      today: "今天",
      suffix: [],
      meridiem: ["上午", "下午"]
    };

    // 时间控件初始化
    $('#j-form-date').datetimepicker({
      language: 'zh-CN',
      weekStart: 1,
      todayBtn: 0,
      autoclose: 1,
      todayHighlight: 1,
      startView: 2,
      minView: 2,
      forceParse: 0,
      format: 'yyyy-mm-dd',
    }).on('changeDate', function(ev) {
      var date = $('#j-form-date').val();
      window.location.href = query + date;
    }).on('show', function() {
      $('.datetimepicker').css('top', '244px');
    });

    // 彩种类型跳转
    $('#j-lottery').on('change', function(event) {
      event.preventDefault();
      var u = $(this).val();

      window.location.href = u;
    });

    $('#j-more-list').on('click', function(event) {
      event.preventDefault();
      $('#j-list-body tr').show();
    });

  }

  pageInit();

});