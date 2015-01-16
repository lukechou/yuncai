require.config({
  urlArgs: "bust=" + (new Date()).getTime(),
  paths: {
    jquery: '../lib/jquery',
    lodash: '../lib/lodash.compat.min',
    store: '../lib/store.min',
    bootstrap: '../lib/bootstrap.min',
    tipsy: '../lib/jquery.tipsy',
    app: '../common/app',
    model: 'model',
    chart: 'chart',
    highcharts: 'highcharts'
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    },
    tipsy: {
      deps: ['jquery'],
      exports: 'jquery'
    }
  }
});

require(['jquery', 'lodash', 'store', 'chart', 'app', 'model', 'bootstrap', 'tipsy'], function($, _, store, chart, APP, model) {
  'use strict';

  /**
   * 彩票模型
   */
  var saveData = {}; //我的筛选数据
  var hadQuerySort = false; //是否已请求筛选

  /**
   * 筛选条件输入限制
   */
  $('.j-less').on('keyup paste', function(event) {
    event.preventDefault();
    $(this).val($(this).val().replace(/[^0-9.]/g, ''));
  });

  $('.j-bao').on('keyup paste', function(event) {
    event.preventDefault();
    var t = $(this);
    t.val(t.val().replace(/[^0-9.]/g, ''));
    var v = t.val();
    if (v < 2) {
      t.val(2)
    }
    if (v > 5) {
      t.val(5)
    }
  });



  /**
   * 提交检测
   */
  $('#detail-form').submit(function() {
    var el = $('#j-input-id');
    var val = el.val();
    var tips = el.attr('data-place');
    if ('' == val || tips == val) {
      APP.showTips('请输入模型编号再查询');
      return false;
    }
  });

  /**
   * 我的筛选
   */

  /**
   * Login Link Event
   * @return null
   */
  $('#j-loginbox-show').on('click', function(event) {
    APP.showLoginBox();
  });

  /**
   * Save 筛选条件
   * @return null
   */
  $('.j-save-btn').on('click', function(event) {

    if (!APP.checkUserLoginStatus()) {
      APP.showLoginBox();
    } else {
      saveCollect();
    }

  });

  $('body').on('click', function(event) {
    if ($('.j-sort-btn').hasClass('on')) {
      $('.j-sort-btn').removeClass('on');
      $('.j-sort-box').addClass('hide');
    }
  });
  /**
   * Delete 填充表单
   * @return null
   */
  $('#j-save-wrap').on('click', '.j-save-name', function(event) {

    var _this = $(this);
    $('#j-save-wrap li').removeClass('cur');
    _this.parents('li').addClass('cur');

    var name = $.trim($(this).attr('data-name'));
    var saveDataItem = saveData[name];

    $('.j-qszs-1').val(saveDataItem['qszs'][0]);
    $('.j-qszs-2').val(saveDataItem['qszs'][1]);
    $('.j-cszs-1').val(saveDataItem['cszs'][0]);
    $('.j-cszs-2').val(saveDataItem['cszs'][1]);
    $('.j-mzzs-1').val(saveDataItem['mzzs'][0]);
    $('.j-mzzs-2').val(saveDataItem['mzzs'][1]);
    $('.j-pjhb-1').val(saveDataItem['pjhb'][0]);
    $('.j-pjhb-2').val(saveDataItem['pjhb'][1]);
    $('.j-slyl-1').val(saveDataItem['slyl'][0]);
    $('.j-slyl-2').val(saveDataItem['slyl'][1]);
    $('.j-dqyl-1').val(saveDataItem['dqyl'][0]);
    $('.j-dqyl-2').val(saveDataItem['dqyl'][1]);
    $('.j-save-input').val(name);

    var $tssxSelect = $('.j-tssx');
    var $tssxOptions = $tssxSelect.find('option');
    for (var j = 0; j < $tssxOptions.length; j++) {
      if (saveDataItem['tssx'] == $tssxOptions.eq(j).val()) {
        $tssxOptions.eq(j).attr({
          'selected': true
        })
      } else {
        $tssxOptions.eq(j).attr({
          'selected': false
        })
      }
    }

    var $pxfsSelect = $('.j-pxfs');
    var $pxfsOptions = $pxfsSelect.find('option');
    for (var j = 0; j < $pxfsOptions.length; j++) {
      if (saveDataItem['pxfs'] == $pxfsOptions.eq(j).val()) {
        $pxfsOptions.eq(j).attr({
          'selected': true
        })
      } else {
        $pxfsOptions.eq(j).attr({
          'selected': false
        })
      }
    }

    APP.showTips({
      text: '【' + name + '】筛选条件已成功载入<br />您可以单击“按参数筛选”按钮查看筛选结果',
    });

  });
  /**
   * Delete 筛选条件
   * @return null
   */
  $('#j-save-wrap').on('click', '.j-save-del', function(event) {

    var _this = $(this);
    var id = $(this).attr('data-id');
    var t = '确定删除此筛选条件？';

    APP.showTips({
      title: '删除确认',
      text: t,
      type: 2,
      onConfirm: function() {
          $.ajax({
              url: '/lottery/model/cancel-search',
              type: 'post',
              dataType: 'json',
              data: {
                search_id: id
              },
            })
            .done(function(D) {
              if (D.retCode === 100000) {
                _this.parents('li').remove();
                for (var prop in saveData) {
                  if (saveData.hasOwnProperty(prop) && saveData[prop]) {
                    if (saveData[prop]['search_id'] == id) saveData[prop] = null;
                  }
                }
                APP.showTips({
                  text: '恭喜你成功删除该筛选条件'
                });
              } else {
                APP.handRetCode(D.retCode, D.retMsg);
              }
            })
            .fail(function() {
              APP.onServiceFail();
            });
      }
    });

  });

  /**
   * 切换我的筛选框
   * @return null
   */
  $('.j-sort-box').on('click', function(event) {
    event.stopPropagation();
  });
  $('.j-sort-btn').on('click', function(event) {
    event.stopPropagation();
    $('.j-sort-box').toggleClass('hide');
    $(this).toggleClass('on');

    if (!hadQuerySort && APP.checkUserLoginStatus()) {

      $.ajax({
          url: '/lottery/model/get-my-search',
          type: 'get',
          dataType: 'json',
          data: {
            't': $.now()
          }
        })
        .done(function(D) {
          if (D.retCode === 100000) {
            hadQuerySort = true; //标记为已请求
            if(D.retData[0]){
              saveData = D.retData[0];
            }
            createShaiLiHtml();
          } else {
            APP.handRetCode(D.retCode, D.retMsg);
          }
        })
        .fail(function() {
          APP.onServiceFail();
        });
    } else {
      createShaiLiHtml();
    }

  });

  function createShaiLiHtml() {
    var saveWrapHtml = '',
      k;
    for (k in saveData) {
      k = _.escape($.trim(k));
      if (saveData[k]) {
        saveWrapHtml += '<li><a href="javascrip:;" class="j-save-name save-name show" data-name="' + k + '" title="' + k + '">' + k + '</a> <a href="javascript:;" class="j-save-del i-close-gray" data-id="' + saveData[k].search_id + '"></a></li>'
      }
    }
    $('#j-save-wrap').html(saveWrapHtml);
    $('#j-load-tips').remove();
  }

  function saveCollect() {

    var params = {};
    params.search_name = _.escape($.trim($('.j-save-input').val()));
    params.sort_type = _.escape($.trim($('.j-pxfs').val()));
    params.special = _.escape($.trim($('.j-tssx').val()));
    params.HI1 = _.escape($.trim($('.j-mzzs-1').val()));
    params.HI2 = _.escape($.trim($('.j-mzzs-2').val()));
    params.GI1 = _.escape($.trim($('.j-cszs-1').val()));
    params.GI2 = _.escape($.trim($('.j-cszs-2').val()));
    params.TI1 = _.escape($.trim($('.j-qszs-1').val()));
    params.TI2 = _.escape($.trim($('.j-qszs-2').val()));
    params.AR1 = _.escape($.trim($('.j-pjhb-1').val()));
    params.AR2 = _.escape($.trim($('.j-pjhb-2').val()));
    params.lastOD1 = _.escape($.trim($('.j-slyl-1').val()));
    params.lastOD2 = _.escape($.trim($('.j-slyl-2').val()));
    params.thisOD1 = _.escape($.trim($('.j-dqyl-1').val()));
    params.thisOD2 = _.escape($.trim($('.j-dqyl-2').val()));

    var arr = _.keys(saveData);

    if (_.indexOf(arr, params.search_name) >= 0) {
      if (saveData[params.search_name]) {
        APP.showTips('您已经保存过条件为备注名：' + params.search_name);
        return;
      }
    }

    if (params.search_name == '') {
      APP.showTips({
        text: '请输入长度为1~15个字符的备注名'
      });
    } else {
      querySave(params);
    }

  }

  function querySave(params) {

    params.t = $.now();
    $.ajax({
        url: '/lottery/model/add-search',
        type: 'post',
        dataType: 'json',
        data: params,
      })
      .done(function(D) {
        if (D.retCode === 100000) {

          saveData[params.search_name] = {
            'qszs': [params.TI1, params.TI2],
            'cszs': [params.GI1, params.GI2],
            'mzzs': [params.HI1, params.HI2],
            'pjhb': [params.AR1, params.AR2],
            'slyl': [params.lastOD1, params.lastOD2],
            'dqyl': [params.thisOD1, params.thisOD2],
            'pxfs': params.sort_type,
            'tssx': params.special,
            'search_id': D.retData.search_id
          };
          APP.showTips({
            text: D.retMsg
          });

          $('#j-save-wrap').prepend('<li class="clearfix"><a href="javascrip:;" class="j-save-name save-name show" data-name="' + params.search_name + '" title="' + params.search_name + '">' + params.search_name + '</a> <a href="javascrip:;" class="j-save-del i-close-gray" data-id="' + D.retData.search_id + '"></a></li>');
        } else {
          APP.handRetCode(D.retCode, D.retMsg);
        }

      })
      .fail(function() {
        APP.onServiceFail();
      });
  }

  // 显示曲线图
  $('#track_detail_list').on('click', '.j-show-chart', function(event) {

    if (event.target.tagName !== 'A') {
      var a = 'active';
      var id = $(this).attr('data-modelId');
      var colspan = $(this).find('td').length;
      var chartHTML = '<div class="chart-box"><a href="/lottery/model/history-data" class="his-link" title="查看历史数据">查看历史数据</a><div class="chart-loading" id="j-chart-loder"><img src="' + Config.staticHostURI + '/front_images/loader.gif" alt="Logding.."/></div><div class="chart" id="chart"></div></div>';
      var tr = '<tr id="chart-tr"><td colspan="' + colspan + '" style="padding:0;">' + chartHTML + '</td></tr>';

      if (!id) return;
      if (!$(this).hasClass(a)) {
        $('.j-show-chart').removeClass(a);
        $(this).addClass(a);
        $('#chart-tr').remove();
        $(this).after(tr);

        chart.init({
          chartEl: $('#chart')
        });
        chart.getChartData(id);
      }
    }

  });

  function setTableThLink() {
    var query = APP.parseQueryString();
    var iconList = $('.result-table thead th .icon');
    var i = 1;
    var order = query.order || false;
    var type = query.type || '';
    var newType = '';
    var newUrl = null;

    if (order) {
      $('.result-table thead th a').each(function(index, el) {

        var href = $(this).attr('href');
        if (href.indexOf(order) >= 0) {
          if (type) {
            newType = (type === 'desc') ? 'asc' : 'desc';
          } else {
            newType = 'desc';
          }
          newUrl = href.replace(type, newType);
          i = index;

          $(this).attr('href', newUrl);
        }
      });

    }
    iconList.eq(i).removeClass('icon-m4')
    if (type === 'desc') {
      iconList.eq(i).addClass('icon-m5')
    } else {
      iconList.eq(i).addClass('icon-m6')
    }

  }

  function modelInit() {
    APP.bindInputPlace();

    model.init({
      modal: $('#collect'),
      starList: $('.td-star-level a'),
      starLevel: null,
      modelId: null,
      starComment: '',
      modelComment: ''
    });

    model.bindCollectEvent();

    $('.data-tip').tipsy({
      fade: true,
      gravity: 's',
      html: true,
      opacity: 1
    });
  }

  function checkMorning() {
    // 早上无数据提示
    var page = $('#j-load-page').val();
    var tip = $('#j-load-tip').val();
    var issue = $('#j-load-issue').val();

    if (page == 1 && tip == 1) {
      APP.showTips({
        title: '温馨提示',
        text: '预计今天10：30左右公布' + issue + '期的彩票模型数据。'
      })
    }
  }

  function init() {

    modelInit();

    setTableThLink();

    checkMorning();
  }

  init();
});