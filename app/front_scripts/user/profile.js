require.config({
  paths: {
    jquery: '../lib/jquery',
    lodash: '../lib/lodash.compat.min',
    bootstrap: '../lib/bootstrap.min',
    store: '../lib/store.min',
    app: '../common/app',
    PAGE: '../account/newpager'
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
  }
});

require(['jquery', 'lodash', 'app', 'store', 'bootstrap', 'PAGE'], function($, _, APP, store) {
  'use strict';

  var PAGE1 = new pager(); //当前发起的合买 分页对象
  var PAGE2 = new pager(); //当前参与的合买 分页对象
  var PAGE3 = new pager(); //当前购买的模型 分页对象
  var PAGE4 = new pager(); //最新动态 分页对象
  var PAGE5 = new pager(); //历史记录展开详情 分页对象
  var uid = $('.uid').attr('val');

  // 当前发起合买 分页函数
  PAGE1.loadLaunchHemaiList = function(obj) {
    PAGE1.ajaxUrl = '/user/profile/newest-hm-projects/' + uid; // ajax url
    PAGE1.pageElement = $('.j-launch-hemai-page-box'); // 分页dom
    PAGE1.initAjax(obj);
    PAGE1.pageTable = $('#j-launch-hemai-table'); // 表格 dom

    // ajax 成功回调
    PAGE1.onSuccess = function(data) {
      var htmlOutput = '';
      var detailData = '';
      var dataItem = '';

      if (data.retCode == 100000) {
        if (data.retData.data.length > 0) {
          detailData = data.retData.data;
          for (var i = 1; i <= detailData.length; i++) {
            dataItem = detailData[i - 1];
            htmlOutput += '<tr><td>' + dataItem.lotyPlay + '</td><td>' + dataItem.qihao + '</td><td>' + dataItem.price + '</td><td>' + dataItem.unitPrice + '</td><td>' + dataItem.schedule + '%</td><td><input type="text" class="u-ci" placeholder="' + '剩余' + dataItem.lessNum + '份"/>' + '</td><td><a class="btn btn-s btn-c1" href="' + dataItem.joinURI + '">购买</a><a target="_blank" href="' + dataItem.detailURI + '">详情</a></td></tr>';
          }
        } else {
          htmlOutput = '<tr><td colspan="7">当前没有发起合买</td></tr>';
        }

        PAGE1.config.pageNum = Math.ceil(data.retData.size / PAGE1.config.pageSize); // 记录数赋值
        PAGE1.makePageHtml(); // 初始化分页组件
        PAGE1.bindPageEvent(PAGE1.loadLaunchHemaiList); // 绑定分页组件事件
      } else {
        htmlOutput = '<tr><td colspan="7">' + data.retMsg + '</td></tr>';
      }
      this.appendTable(htmlOutput); //初始化表格

    };
  };
  // 页面初始化 第一次调用 分页组件
  PAGE1.loadLaunchHemaiList({
    page: 1, //第几页
    pageSize: 5, // 多少条1页
    pageElement: '.j-launch-hemai-page-box'
  });


  // 当前参与的投注 分页函数
  PAGE2.loadJoinHemaiList = function(obj) {
    PAGE2.ajaxUrl = '/user/profile/newest-join-projects/' + uid; // ajax url
    PAGE2.pageElement = $('.j-join-hemai-page-box'); // 分页dom
    PAGE2.initAjax(obj);
    PAGE2.pageTable = $('#j-join-hemai-table'); // 表格 dom

    // ajax 成功回调
    PAGE2.onSuccess = function(data) {
      var htmlOutput = '';
      var detailData = '';
      var dataItem = '';
      if (data.retCode == 100000) {
        if (data.retData.data.length > 0) {
          detailData = data.retData.data;
          for (var i = 1; i <= detailData.length; i++) {
            dataItem = detailData[i - 1];
            htmlOutput += '<tr><td>' + dataItem.lotyPlay + '</td><td><a href="' + dataItem.user_profile_url + '" target="_blank">' + dataItem.username + '</a></td><td>' + dataItem.price + '</td><td>' + dataItem.unitPrice + '</td><td>' + dataItem.schedule + '%</td><td><input type="text" class="u-ci" placeholder="' + '剩余' + dataItem.lessNum + '份"/>' + '</td><td><a class="btn btn-s btn-c1" href="' + dataItem.joinURI + '">购买</a><a target="_blank"  href="' + dataItem.detailURI + '">详情</a></td></tr>';
          }
        } else {
          htmlOutput = '<tr><td colspan="7">当前没有参与投注</td></tr>';
        }

        PAGE2.config.pageNum = Math.ceil(data.retData.size / PAGE2.config.pageSize); // 记录数赋值
        PAGE2.makePageHtml(); // 初始化分页组件
        PAGE2.bindPageEvent(PAGE2.loadJoinHemaiList); // 绑定分页组件事件
      } else {
        htmlOutput = '<tr><td colspan="7">' + data.retMsg + '</td></tr>';
      }
      this.appendTable(htmlOutput); //初始化表格

    };
  };
  // 页面初始化 第一次调用 分页组件
  PAGE2.loadJoinHemaiList({
    page: 1, //第几页
    pageSize: 5, // 多少条1页
    pageElement: '.j-join-hemai-page-box'
  });


  // 当前购买的模型 分页函数
  PAGE3.loadJoinHemaiList = function(obj) {
    PAGE3.ajaxUrl = '/user/profile/newest-model/' + uid; // ajax url
    PAGE3.pageElement = $('.j-nowbuy-model-page-box'); // 分页dom
    PAGE3.initAjax(obj);
    PAGE3.pageTable = $('#j-nowbuy-model-table'); // 表格 dom
    // ajax 成功回调
    PAGE3.onSuccess = function(data) {
      var htmlOutput = '';
      var detailData = '';
      var dataItem = '';
      if (data.retCode == 100000) {
        if (data.retData.data.length > 0) {
          detailData = data.retData.data;
          for (var i = 1; i <= detailData.length; i++) {
            dataItem = detailData[i - 1];
            htmlOutput += '<tr><td>' + dataItem.modelNo + '</td><td>' + dataItem.date_str + '</td><td>' + dataItem.qihao + '</td><td>' + dataItem.modelNo + '</td><td>' + dataItem.money + '%</td><td>' + dataItem.status + '</td><td>' + '<a target="_blank" href="' + dataItem.detail_url + '">详情</a></td></tr>';
          }
        } else {
          htmlOutput = '<tr><td colspan="7">无购买模型</td></tr>';
        }

        PAGE3.config.pageNum = Math.ceil(data.retData.size / PAGE3.config.pageSize); // 记录数赋值
        PAGE3.makePageHtml(); // 初始化分页组件
        PAGE3.bindPageEvent(PAGE3.loadJoinHemaiList); // 绑定分页组件事件

      } else {
        htmlOutput = '<tr><td colspan="7">' + data.retMsg + '</td></tr>';
      }
      this.appendTable(htmlOutput); //初始化表格

    };
  };
  // 页面初始化 第一次调用 分页组件
  PAGE3.loadJoinHemaiList({
    page: 1, //第几页
    pageSize: 5, // 多少条1页
    pageElement: '.j-nowbuy-model-page-box'
  });


  // 最新动态 分页函数
  PAGE4.loadRecentNewsList = function(obj) {
    PAGE4.ajaxUrl = '/user/profile/newest-feed/' + uid; // ajax url
    PAGE4.pageElement = $('.j-recent-news-page-box'); // 分页dom
    PAGE4.initAjax(obj);
    PAGE4.pageTable = $('#j-recent-news'); // 表格 dom
    // ajax 成功回调
    PAGE4.onSuccess = function(data) {
      var htmlOutput = '';
      var detailData = '';
      var dataItem = '';
      var iDom = '<i class="icon icon-tridown j-show-recent-news"></i>';
      var jMoreRecentNewsDom = '<div class="j-more-recent-news"><table><thead><tr><th class="th1">彩种</th><th class="th2">期次</th><th class="th3">方案总额（元）</th><th class="th4">每份（元）</th><th class="th5">进度</th><th class="th6">认购份数</th><th class="th7">操作</th></tr></thead><tbody class="j-more-recent-news-table"></tbody></table></div>';
      if (data.retCode == 100000) {
        if (data.retData.data.length > 0) {
          detailData = data.retData.data;
          for (var i = 1; i <= detailData.length; i++) {
            dataItem = detailData[i - 1];
            if (dataItem.show_detail) {
              htmlOutput += ('<li><p lotyname="' + dataItem.loty_name + '" projectno="' + dataItem.project_no + '">' + dataItem.feed + ' -- ' + dataItem.date_str + iDom + '</p>' + jMoreRecentNewsDom + '</li>');
            } else {
              htmlOutput += ('<li><p>' + dataItem.feed + ' -- ' + dataItem.date_str + '</p></li>');
            }
          }
        } else {
          htmlOutput = '<li><p>无最新动态</p></li>';
        }

        PAGE4.config.pageNum = Math.ceil(data.retData.size / PAGE4.config.pageSize); // 记录数赋值
        PAGE4.makePageHtml(); // 初始化分页组件
        PAGE4.bindPageEvent(PAGE4.loadRecentNewsList); // 绑定分页组件事件

      } else {
        htmlOutput = '<li><p>' + data.retMsg + '</p></li>';
      }
      this.appendTable(htmlOutput); //初始化表格

    };
  };
  // 页面初始化 第一次调用 分页组件
  PAGE4.loadRecentNewsList({
    page: 1, //第几页
    pageSize: 5, // 多少条1页
    pageElement: '.j-recent-news-page-box'
  });


  // 历史记录展开详情 分页函数
  PAGE5.loadHisShowList = function(obj, newPageElement, newPageTable) {
    PAGE5.ajaxUrl = '/user/profile/history/' + uid; // ajax url
    if (newPageElement && newPageTable) {
      PAGE5.pageElement = newPageElement; // 分页dom
      PAGE5.pageTable = newPageTable; // 表格 dom
      obj.pageElement = newPageElement.selector;
    } else {
      PAGE5.pageElement = $('.j-his-more-page-box'); // 分页dom
      PAGE5.pageTable = $('.j-his-more-table'); // 表格 dom
    }

    PAGE5.initAjax(obj);

    // ajax 成功回调
    PAGE5.onSuccess = function(data) {
      var htmlOutput = '';
      var detailData = '';
      var dataItem = '';
      if (data.retCode == 100000) {
        if (data.retData.data.length > 0) {
          detailData = data.retData.data;
          for (var i = 1; i <= detailData.length; i++) {
            dataItem = detailData[i - 1];
            if (dataItem.detail_url) {
              htmlOutput += '<tr><td>' + dataItem.create_time + '</td><td><a target="_blank" href="' + dataItem.detail_url + '">' + dataItem.title + '</a></td><td>' + dataItem.type + '</td><td>' + dataItem.project_price + '</td><td>' + dataItem.bonus + '</td><td>' + dataItem.join_num + '</td><td>' + dataItem.state + '</td></tr>';
            } else {
              htmlOutput += '<tr><td>' + dataItem.create_time + '</td><td></td><td>' + dataItem.type + '</td><td>' + dataItem.project_price + '</td><td>' + dataItem.bonus + '</td><td>' + dataItem.join_num + '</td><td>' + dataItem.state + '</td></tr>';
            }
          }
        } else {
          htmlOutput = '<tr><td colspan="7">无历史记录</td></tr>';
        }

        PAGE5.config.pageNum = Math.ceil(data.retData.size / PAGE5.config.pageSize); // 记录数赋值
        PAGE5.makePageHtml(); // 初始化分页组件
        PAGE5.bindPageEvent(PAGE5.loadHisShowList); // 绑定分页组件事件

      } else {
        PAGE5.config.pageNum = 0;
        PAGE5.makePageHtml();
        htmlOutput = '<tr><td colspan="7">' + data.retMsg + '</td></tr>';
      }


      this.appendTable(htmlOutput); //初始化表格
    };
    //重写分页绑定函数
    PAGE5.bindPageEvent = function(callback) {
      var _this = this;
      var pagerObj = _this;
      var clickObj = null;
      var newp = [];
      $(_this.config.pageElement).find('.next-page').on('click', function(event) {
        clickObj = this;
        newp = PAGE5.bindPageEventCommon(pagerObj, clickObj);

        if (_this.config.page < _this.config.pageNum) {
          _this.config.page += 1;
          callback(_this.config, newp[0], newp[1]);
        }

        newp = [];
      });


      $(_this.config.pageElement).find('.back-page').on('click', function(event) {
        clickObj = this;
        newp = PAGE5.bindPageEventCommon(pagerObj, clickObj);

        _this.config.page -= 1;

        if (_this.config.page <= 0) {
          _this.config.page = 1;
        }
        callback(_this.config, newp[0], newp[1]);

        newp = [];
      });

      $(_this.config.pageElement).find('.j-pages-value').on('change', function(event) {

        var max = $(this).siblings('.j-days').html();
        var go = parseInt($(this).val());

        if (isNaN(go)) {
          go = 1;
        } else {
          go = Math.ceil(go);
        }

        if (max < go) {
          go = max;
        }
        if (go < 1) {
          go = 1;
        }
        $(this).val(go);
      });


      $(_this.config.pageElement).find('.j-pages-go').on('click', function(event) {
        clickObj = this;
        newp = PAGE5.bindPageEventCommon(pagerObj, clickObj);

        _this.config.page = $(this).siblings('.j-pages-value').val() || 1;
        callback(_this.config, newp[0], newp[1]);

        newp = [];
      });
    }

    PAGE5.bindPageEventCommon = function(pagerObj, clickObj) {
      var i = 0; //存放标记，标记第几个tr
      var trObj = null;
      var _thisTrlotyName = $(clickObj).parents('.j-his-more-tr').attr('lotyname'); //当前点击的下一页的父节点tr的lotyName,这是作为标识

      //找到该父节点是第几个tr，并且标记要更新的是第几个tr
      $('.per-his-table tbody tr.j-his-more-tr').each(function(index, el) {
        var trLotyName = $(this).attr('lotyname'); //遍历到的tr的lotyname
        if (trLotyName === _thisTrlotyName) {
          i = index;
          trObj = el;
        }
      });

      var newPageElement = $('.per-his-table tbody tr.j-his-more-tr').eq(i).find('.j-his-more-page-box');
      var newPageTable = $('.per-his-table tbody tr.j-his-more-tr').eq(i).find('.j-his-more-table'); // 表格 dom
      pagerObj.config.page = $('.per-his-table tbody tr.j-his-more-tr').eq(i).find('.j-page').text();
      pagerObj.config.pageNum = $('.per-his-table tbody tr.j-his-more-tr').eq(i).find('.j-days').text();
      pagerObj.config.page = parseInt(pagerObj.config.page);
      pagerObj.config.pageNum = parseInt(pagerObj.config.pageNum);
      pagerObj.config.loty_name = _thisTrlotyName;
      var typeVal = $('.per-his-table tbody tr.j-his-more-tr').eq(i).find('.j-check-bonus-record').val();
      pagerObj.config.type = typeVal;

      var newp = [];
      newp[0] = newPageElement;
      newp[1] = newPageTable;
      return newp;
    }
  };

  $('.j-check-bonus-record').on('change', function(event) {
    event.preventDefault();
    var type = $(this).val();
    var target = $(this).parents('tr.j-his-more-tr');

    var i = 0; //存放标记，标记第几个tr
    var trObj = null;
    var _thisTrlotyName = $(this).parents('.j-his-more-tr').attr('lotyname');
    //找到该父节点是第几个tr，并且标记要更新的是第几个tr
    $('.per-his-table tbody tr.j-his-more-tr').each(function(index, el) {
      var trLotyName = $(this).attr('lotyname'); //遍历到的tr的lotyname
      if (trLotyName === _thisTrlotyName) {
        i = index;
        trObj = el;
      }
    });

    var newPageElement = $('.per-his-table tbody tr.j-his-more-tr').eq(i).find('.j-his-more-page-box');
    var newPageTable = $('.per-his-table tbody tr.j-his-more-tr').eq(i).find('.j-his-more-table');

    switch (type) {
      case '查看全部记录': //0表示查看全部记录
        PAGE5.loadHisShowList({
          loty_name: _thisTrlotyName,
          page: 1, //第几页
          pageSize: 5, // 多少条1页
          pageElement: '.j-his-more-page-box'
        }, newPageElement, newPageTable);
        break;
      case '1': //1表示查看中奖记录
        PAGE5.loadHisShowList({
          loty_name: _thisTrlotyName,
          page: 1, //第几页
          pageSize: 5, // 多少条1页
          pageElement: '.j-his-more-page-box',
          type: 1
        }, newPageElement, newPageTable);
        break;
      case '2': //1表示查看未结算记录
        PAGE5.loadHisShowList({
          loty_name: _thisTrlotyName,
          page: 1, //第几页
          pageSize: 5, // 多少条1页
          pageElement: '.j-his-more-page-box',
          type: 2
        }, newPageElement, newPageTable);
        break;
    }


  });

  $('#j-recent-news').on('click', '.j-show-recent-news', function(event) {
    event.preventDefault();
    var tbody = null;
    var liParents = null;

    liParents = $(this).parents('li');

    if ($(this).hasClass('icon-tridown')) {
      $(this).removeClass('icon-tridown').addClass('icon-triup');
      liParents.find('.j-more-recent-news').show();
      tbody = liParents.find('.j-more-recent-news-table');
      ajaxLoadData.loadMoreRecentNews(tbody);
    } else {
      $(this).removeClass('icon-triup').addClass('icon-tridown');
      liParents.find('.j-more-recent-news').hide();
    }
  });

  $('.j-his-more-details').click(function(event) {
    var target = $(this).parent('td').parent('tr').next('tr.j-his-more-tr');
    var lotyName = target.attr('lotyName');
    var _this = $(this);
    var tbody = target.find('td').find('div').find('table').find('tbody');
    var newPageElement = target.find('.j-his-more-page-box');
    var newPageTable = target.find('.j-his-more-table'); // 表格 dom
    var newSelect = _this.parents('.his-tr').next('.j-his-more-tr').find('.j-check-bonus-record');
    if ('展开详情' == _this.text()) {
      _this.text('收起');
      newSelect.html('<option>查看全部记录</option><option value="1">查看中奖纪录</option><option value="2">查看未结算记录</option>');
      target.css({
        display: 'table-row'
      });
      PAGE5.loadHisShowList({
        loty_name: lotyName,
        page: 1, //第几页
        pageSize: 5, // 多少条1页
        pageElement: '.j-his-more-page-box'
      }, newPageElement, newPageTable);

    } else if ('收起' == _this.text()) {
      _this.text('展开详情');
      newSelect.html();
      target.css({
        display: 'none'
      });
    }
  });

  $('#j-nav').on('click', 'a', function(event) {
    event.preventDefault();
    var objCurrentSelect = $(this).parents('li');
    var pagetype = $(this).attr('data-pagetype');
    objCurrentSelect.addClass('active');
    objCurrentSelect.siblings('li').removeClass('active');
    switch (pagetype) {
      case '0':
        $('.j-per-index').show();
        $('.j-per-index').siblings('.j-per-his,.j-per-dzgd,.j-per-model').hide();
        break;
      case '1':
        $('.j-per-his').show();
        $('.j-per-his').siblings('.j-per-index,.j-per-dzgd,.j-per-model').hide();
        break;
      case '2':
        $('.j-per-dzgd').show();
        $('.j-per-dzgd').siblings('.j-per-index,.j-per-his,.j-per-model').hide();
        break;
      case '3':
        $('.j-per-model').show();
        $('.j-per-model').siblings('.j-per-index,.j-per-his,.j-per-dzgd').hide();
        break;
    }
  });

  //模型的“更多”则自动跳转至“历史记录-模型投注-查看全部记录”
  $('.j-per-modelmore').click(function(event) {
    $('#j-nav li:nth-child(2)').addClass('active');
    $('#j-nav li:nth-child(2)').siblings('li').removeClass('active');
    $('.j-per-his').show();
    $('.j-per-his').siblings('.j-per-index,.j-per-dzgd,.j-per-model').hide();
    //还要进行数据加载
  });

  var ajaxLoadData = {
    loadMoreRecentNews: function(tbody) {
      var pObj = tbody.parents('.j-more-recent-news').siblings('p');
      var lotyName = pObj.attr('lotyname');
      var projectNo = pObj.attr('projectno');
      $.ajax({
          url: '/lottery/project-detail/ajax/' + lotyName + '/' + projectNo,
          type: 'get',
          dataType: 'json'
        })
        .done(function(data) {
          var trHtml = '<tr><td>' + data.lotyPlay + '</td><td>' + data.qihao + '</td><td>' + data.price + '</td><td>' + data.unitPrice +
            '</td><td>' + data.schedule + '%</td><td><input type="text" class="u-ci" placeholder="' + '剩余' + data.lessNum + '份"/>' +
            '</td><td><a class="btn btn-s btn-c1" href="' + data.joinURI +
            '">购买</a>    <a target="_blank" href="' + data.detailURI + '">详情</a></td></tr>';
          tbody.html(trHtml);
        })
        .fail(function() {
          APP.showTips('服务器繁忙,请稍后再试!');
        });
    }
  };
});