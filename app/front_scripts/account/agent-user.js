/**
 * 下级管理
 *
 */

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

  var date = new Date();
  var today = formatDate(date);
  var startDay = formatDate(new Date(date - 7 * 24 * 60 * 60 * 1000));


  function formatDate(date) {

    return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');

  }

   function filterNum(v) {

    var reNum = '';

    // '/\D|^0/g'

    reNum = v.replace(/[^0-9.]/g, '');

    return reNum;

    };

  function bindValEvent(){

    $('.j-proxy-val,.j-rebate-val').on('keyup', function(event) {

      var v = filterNum($(this).val());

      $(this).val(v);

    });

    $('.j-proxy-val,.j-rebate-val').on('change', function(event) {

      var v = Number(filterNum($(this).val()));
      var a = '';
      var s = '';

      if(v){

        if(APP.isDecimal(v)){

          var a = v.toFixed(1) + '';

          v = v.toFixed(1);

          s = a.split('.');

          if(s[1]==5 || s[1]==0){

          }else{

            v = s[0];

          }

        }

      }

      $(this).val(v);


    });

  }

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
    startDate: '2012-01-01',
    endDate: today
  });

  $('#j-datetime-start').val(startDay);
  $('#j-datetime-end').val(today);

  // 分页模块
  function craeteOutputHTML(res) {

    var html = '';
    var data = res.data;
    var selfData = res.self_data;
    var identity = '';
    var item = '';
    var isFillProxy = '';
    var isParentProxyType = '';

    if (res.size <= 0) {
      html = "<tr><td colspan='8'>没有数据</td></tr>";
      return html;
    }
    if(!(selfData === undefined))
    {
        if(selfData.used_limit == selfData.proxy_limit){

          isFillProxy = true;

        }else{

          isFillProxy = false;

        }

        if(selfData.proxy_type > 4)
        {
          isParentProxyType = true;
        }else{
          isParentProxyType = false;
        }

    }

    for (var i = 0; i < data.length; i++) {

      item = data[i];

      identity = (item.identity == 1) ? '下级' : '自己';

      html += '<tr>';
      html += '<td>' + (i + 1) + '</td><td>' + item['create_time'] + '</td><td>' + item['username'] + '</td><td>' + identity + '</td>';

      html += '<td><span class="j-proxy-view">' + item['used_limit'] + '/' + item['proxy_limit'] + '</span><span class="j-proxy-edit proxy-edit hide">' + item['used_limit'] + '/<input type="type" value="' + item['proxy_limit'] + '" class="j-proxy-val point"></span></td>';

      html += '<td>' + item['total_money'] + '</td>';

      html += '<td><span class="j-rebate-view fc-3">' + item['rebate'] + '%</span><span class="j-rebate-edit hide"><input type="text" value="' + item['rebate'] + '" class="j-rebate-val point"></span></td>';

      if (item.identity == 1) {

        html += '<td data-url="' + item['rebate_url'] + '" data-id="' + item['id'] + '" data-uid="' + item['uid'] + '">';

        if(item['rebate']==0 && isFillProxy){

          html += '<a href="javascript:;" class="agent-point dis" >修改返点</a>';

        }else{

          html += '<a href="javascript:;" class="agent-point j-agent-rebase" >修改返点</a>';

        }



        if(item['rebate'] == 0 || ( isParentProxyType &&  (item['proxy_type'] > 5)  ) ){

          html += '<a href="javascript:;" class="agent-point dis">返点代理限额</a>';

        }else{

          html += '<a href="javascript:;" class="agent-point j-agent-proxy" data-url="' + item['change_proxy_limit_url'] + '">返点代理限额</a>';

        }

        html +='<a class="btn btn-red hide j-btn-confirm" href="javascript:;">确认</a> <a class="btn btn-cancel hide j-btn-cancel" href="javascript:;">取消</a></td>';

      } else {

        html += '<td></td>';

      }

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
        PAGE.config.pageNum = Math.ceil(data.totalRecord / obj.pageSize);
        PAGE.makePageHtml();
        PAGE.bindPageEvent(PAGE.loadOrderRecord);

      } else {

        htmlOutput = "<tr><td colspan='8'>" + data.retMsg + "</td></tr>";

      }

      this.appendTable(htmlOutput);
      bindValEvent();
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

      var LotyName = APP.getUrlPara('lotyname');

      if(LotyName){

        if($('#j-type [data-loty='+LotyName+']').length){
          $('#j-type').val(LotyName);
        }

      }



      PAGE.pageTable = $(_this.tbody);

      // 默认参数
      _this.lotyname = $('#j-type').val();
      _this.timeStart = formatDate(new Date(date - 7 * 24 * 60 * 60 * 1000));
      _this.timeEnd = today;

      // 获取数据，事件绑定
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

        var start = getDateTime(_this.timeStart);
        var end = getDateTime(_this.timeEnd);
        var step = end - start;

        if (start && end) {

          if (step < 0) {

            APP.showTips('起始时间不得大于结束时间');
            return;

          } else {

            if (step > 30 * 24 * 60 * 60 * 1000) {
              APP.showTips('最多查询跨度为30天');
            } else {
              _this.getPage();
            }

          }

        } else {

          _this.getPage();

        }



      });

      // 修改返点
      $(_this.tbody).on('click', '.j-agent-rebase', function(event) {
        event.preventDefault();

        var td = $(this).parent('td');
        td.find('.btn').removeClass('hide');
        td.find('.agent-point').addClass('hide');
        td.attr('data-method', 0);

        $(this).parents('tr').find('.j-rebate-view').addClass('hide');
        $(this).parents('tr').find('.j-rebate-edit').removeClass('hide');

      });

      // 修改返点代理限额
      $(_this.tbody).on('click', '.j-agent-proxy', function(event) {
        event.preventDefault();

        var td = $(this).parent('td');
        td.find('.btn').removeClass('hide');
        td.find('.agent-point').addClass('hide');
        td.attr('data-method', 1);

        $(this).parents('tr').find('.j-proxy-view').addClass('hide');
        $(this).parents('tr').find('.j-proxy-edit').removeClass('hide');

      });

      // 确认修改
      $(_this.tbody).on('click', '.j-btn-confirm', function(event) {
        event.preventDefault();

        var rebateId = '';
        var rebate = '';
        var uid = '';
        var proxyLimit = '';
        var td = $(this).parents('td');
        var method = td.attr('data-method');
        var tr = $(this).parents('tr');

        rebateId = td.attr('data-id');
        rebate = tr.find('.j-rebate-val').val();

        uid = td.attr('data-uid');
        proxyLimit = tr.find('.j-proxy-val').val();

        if (method == 0) {
          _this.updateRebate(rebateId, rebate, tr, uid);
        }

        if (method == 1) {
          _this.updateProxy(uid, proxyLimit, tr);
        }

      });

      $(_this.tbody).on('click', '.j-btn-cancel', function(event) {
        event.preventDefault();

        var td = $(this).parents('td');

        td.parents('tr').find('.btn').addClass('hide');
        td.parents('tr').find('.j-rebate-edit,.j-proxy-edit').addClass('hide');
        td.parents('tr').find('.j-rebate-view,.j-proxy-view,.j-agent-proxy,.j-agent-rebase').removeClass('hide');

      });

    };

    //修改代理限额
    AgentUser.prototype.updateProxy = function(uid, proxy_limit, tr) {

      var _this = this;

      $.ajax({
          url: '/account/my-agent-user/change_limit/ajax',
          type: 'get',
          dataType: 'json',
          data: {
            uid: uid,
            proxy_limit: proxy_limit,
            lotyname:_this.lotyname
          },
        })
        .done(function(data) {
          if (data.retCode == 100000) {

            APP.showTips({
              text: '成功修改返点限额。',
              type: 1,
              onConfirm: function() {

                window.location.href = '?lotyname='+_this.lotyname;

              }
            });

            $('body').on('click', '.close', function(event) {

              window.location.href = '?lotyname='+_this.lotyname;

            });

          } else {

            APP.showTips(data.retMsg);

          }
        })
        .fail(function() {
          APP.onServiceFail();
        })

    };

    // 修改返点
    AgentUser.prototype.updateRebate = function(rebateId, rebate, tr, uid) {

      var _this = this;

      $.ajax({
          url: '/account/my-agent-user/change_rebate/ajax',
          type: 'get',
          dataType: 'json',
          data: {
            rebate_id: rebateId,
            rebate: rebate,
            uid: uid,
            lotyname: _this.lotyname
          },
        })
        .done(function(data) {

          if (data.retCode == 100000) {

            APP.showTips({
              text: '成功修改返点。',
              type: 1,
              onConfirm: function() {
                window.location.href = '?lotyname='+_this.lotyname;
              }
            });

            $('body').on('click', '.close', function(event) {

              window.location.href = '?lotyname='+_this.lotyname;

            });

          } else {

            APP.showTips(data.retMsg);

          }
        })
        .fail(function() {

          APP.onServiceFail();

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

  function getDateTime(str) {

    var t = '';
    var s = '';

    s = str.split('-');

    if (s.length === 3) {
      t = new Date(s[0], s[1], s[2]).getTime();
    } else {
      t = null;
    }

    return t;
  }

  var agent = new AgentUser();

});
