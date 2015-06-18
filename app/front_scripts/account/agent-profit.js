require.config({
  paths: {
    jquery: '../lib/jquery',
    bootstrap: '../lib/bootstrap.min',
    app: '../common/app',
    PAGE: 'pager',
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    },
    PAGE: {
      deps: ['jquery'],
      exports: 'jquery'
    }
  },
});

require(['jquery', 'app', 'PAGE', 'bootstrap'], function($, APP) {

  'use strict';


  // 分页模块
  function craeteOutputHTML(res) {

    var html = '';
    var data = res.data;
    var identity = '';
    var item = '';


    if (res.size <= 0) {

      html = "<tr><td colspan='5'>没有数据</td></tr>";
      $('.j-page-box').hide();
      return html;
    }

    for (var i = 0; i < data.length; i++) {

      item = data[i];

      html += '<tr>';
      html += '<td>' + item['loty_cnname'] + '</td><td>' + item['create_time'] + '</td><td>' + item['username'] + '</td><td>' + item['buy_price'] + '</td><td>' + item['rebate_money'] + '</td>';

      html += '</tr>';

    };

    return html;
  }

  PAGE.loadAgentUser = function(obj) {

    PAGE.ajaxUrl = '/account/my-agent-profit/ajax';
    PAGE.pageElement = $('.j-page-box');
    PAGE.initAjax(obj);

    PAGE.onSuccess = function(data) {

      var htmlOutput = '';

      if (data.retCode == 100000) {

        htmlOutput = craeteOutputHTML(data.retData);
        PAGE.config.pageNum = Math.ceil(data.totalRecord / obj.pageSize);
        PAGE.makePageHtml();
        PAGE.bindPageEvent(PAGE.loadAgentUser);

      } else {

        htmlOutput = "<tr><td colspan='8'>" + data.retMsg + "</td></tr>";
        $('.j-page-box').hide();

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
      days: 30,
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

        _this.days = $('#j-nearday').val();
        _this.username = APP.filterStr($('#j-username').val());

        _this.getPage();

      });

    };

    AgentUser.prototype.getPage = function() {

      var _this = this;

      PAGE.loadAgentUser({
        username: _this.username,
        lotyname: _this.lotyname,
        days: _this.days,
        page: _this.page,
        pageSize: _this.pageSize,
      });

    };

    return AgentUser;
  }());

  var agent = new AgentUser();

});