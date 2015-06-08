require.config({
  paths: {
    jquery: '../lib/jquery',
    bootstrap: '../lib/bootstrap.min',
    app: '../common/app',
    PAGE: 'pager',
    datetimepicker: '../lib/bootstrap-datetimepicker.min'
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    },
    PAGE: {
      deps: ['jquery'],
      exports: 'jquery'
    },
    datetimepicker: {
      deps: ['jquery'],
      exports: 'jquery'
    }
  },
});

require(['jquery', 'app', 'PAGE', 'bootstrap', 'datetimepicker'], function($, APP) {

  'use strict';

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
  $('#j-datetime-start,#j-datetime-end').datetimepicker({
    language: 'zh-CN',
    weekStart: 1,
    todayBtn: 0,
    autoclose: 1,
    todayHighlight: 1,
    startView: 2,
    minView: 2,
    forceParse: 0,
    format: 'yyyy-mm-dd',
  });

  // 分页模块
  function craeteOutputHTML(res) {

    var html = '';
    var data = res.data;
    var identity = '';
    var item = '';


    if (res.size <= 0) {
      html = "<tr><td colspan='8'>没有数据</td></tr>";
      return html;
    }

    for (var i = 0; i < data.length; i++) {

      item = data[i];
      identity = (item.identity == 1) ? '下级' : '自己';

      html += '<tr>';
      html += '<td>' + (i + 1) + '</td><td>' + item['create_time'] + '</td><td>' + item['username'] + '</td><td>' + identity + '</td><td>' + item['limit'] + '</td><td>' + item['total_money'] + '</td>';

      html += '<td><input type="text" value="' + item['rebate'] + '%" class="point clean j-rebate-val" disabled></td><td data-url="' + item['rebate_url'] + '"><a href="javascript:;" class="agent-point j-agent-rebase" >修改返点</a><a href="javascript:;" class="agent-point j-agent-proxy" data-url="' + item['change_proxy_limit_url'] + '">返点代理限额</a><a class="btn btn-red hide j-btn-confirm" href="javascript:;">确认</a> <a class="btn btn-cancel hide j-btn-cancel" href="javascript:;">取消</a></td>';

      html += '</tr>';

    };

    return html;
  }

  PAGE.loadAgentUser = function(obj) {

    PAGE.ajaxUrl = '/account/my-agent-user/ajax';
    PAGE.pageElement = $('.j-page-box');
    PAGE.initAjax(obj);

    PAGE.onSuccess = function(data) {

      var htmlOutput = '';

      if (data.retCode == 100000) {

        htmlOutput = craeteOutputHTML(data.retData);
        PAGE.config.pageNum = Math.ceil(data.retData.size / obj.pageSize);
        PAGE.makePageHtml();
        PAGE.bindPageEvent(PAGE.loadOrderRecord);

      } else {

        htmlOutput = "<tr><td colspan='8'>" + data.retMsg + "</td></tr>";

      }

      this.appendTable(htmlOutput);

    };

    PAGE.onFail = function() {
      return;
    };

  };

  // 页面初始化
  var AgentUser = (function() {
    'use strict';

    function AgentUser(args) {

      // enforces new
      if (!(this instanceof AgentUser)) {
        return new AgentUser(args);
      }

      for (var prop in args) {
        if (args.hasOwnProperty(prop)) {
          this[prop] = args[prop];
        }
      }

      this.init();
    }

    AgentUser.prototype = {
      page: 1,
      pageSize: 10,
      lotyname: '',
      username: '',
      timeStart: '',
      timeEnd: '',
      tbody: '#j-agentuser-data',
    };

    AgentUser.prototype.init = function(args) {

      var _this = this;

      PAGE.pageTable = $(_this.tbody);

      _this.lotyname = 'jclq';

      _this.getPage();

      _this.bindEvent();

    };

    AgentUser.prototype.bindEvent = function() {

      var _this = this;

      $('#j-agent-search').on('click', function(event) {
        event.preventDefault();

        _this.lotyname = $('#j-type').val();
        _this.timeStart = $('#j-datetime-start').val();
        _this.timeEnd = $('#j-datetime-end').val();
        _this.username = APP.filterStr($('#j-username').val());

        _this.getPage();

      });

      $(_this.tbody).on('click', '.j-agent-rebase', function(event) {
        event.preventDefault();

        var td = $(this).parent('td');
        td.find('.btn').removeClass('hide');
        td.find('.j-agent-rebase,.j-agent-proxy').addClass('hide');
        td.attr('data-method', 0);
        $(this).parents('tr').find('.j-rebate-val').removeClass('clean').removeAttr('disabled');

      });

      $(_this.tbody).on('click', '.j-agent-proxy', function(event) {
        event.preventDefault();

        var td = $(this).parent('td');
        td.find('.btn').removeClass('hide');
        td.find('.j-agent-rebase,.j-agent-proxy').addClass('hide');
        td.attr('data-method', 1);

      });

      $(_this.tbody).on('click', '.j-btn-confirm', function(event) {
        event.preventDefault();
        debugger
      });

      $(_this.tbody).on('click', '.j-btn-cancel', function(event) {
        event.preventDefault();

        var td = $(this).parents('td');

        td.find('.j-rebate-val').addClass('clean').attr('disabled', true);
        td.find('.btn').addClass('hide');
        td.find('.j-agent-rebase,.j-agent-proxy').removeClass('hide');

      });

    };

    AgentUser.prototype.getPage = function() {

      var _this = this;

      PAGE.loadAgentUser({
        username: _this.username,
        lotyname: _this.lotyname,
        starttime: _this.timeStart,
        endtime: _this.timeEnd,
        page: _this.page,
        pageSize: _this.pageSize,
      });

    };

    return AgentUser;
  }());

  var agent = new AgentUser();

});