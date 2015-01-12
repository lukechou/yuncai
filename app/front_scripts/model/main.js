require.config({
  paths: {
    jquery: '../lib/jquery',
    lodash: '../lib/lodash.compat.min',
    store: '../lib/store.min',
    bootstrap: '../lib/bootstrap.min',
    app: '../common/app',
    model: 'model',
    chart: 'chart',
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    }
  }
});

require(['jquery', 'lodash', 'store', 'chart', 'app', 'model', 'bootstrap'], function($, _, store, chart, APP, model) {
  'use strict';

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

  /**
   * 彩票模型
   */
  var saveData = {}; //我的筛选数据
  var hadQuerySort = false; //是否已请求筛选

  /**
   * 提交检测
   */
  $('#detail-form').submit(function() {
    var val = $('.j-id-input').val();
    if ('' == val || '输入模型编号精确查找' == val) {
      APP.showTip('请输入模型编号再查询');
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
      type: 1,
      text: '【' + name + '】筛选条件已成功载入<br />您可以单击“按参数筛选”按钮查看筛选结果',
      callback: function(){

      }
    });

  });
  /**
   * Delete 筛选条件
   * @return null
   */
  $('#j-save-wrap').on('click', '.j-save-del', function(event) {
    var _this = $(this);
    var id = $(this).attr('data-id');
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
            if (saveData.hasOwnProperty(prop)) {
              if (saveData[prop]['search_id'] == id) saveData[prop] = null;
            }
          }
          APP.showTips({
            onlyConfirm: true,
            text: '恭喜你成功删除该筛选条件'
          });
        } else {
          APP.handRetCode(D.retCode, D.retMsg);
        }
      })
      .fail(function() {
        APP.onServiceFail();
      })
      .always(function() {
        console.log("complete");
      });

  });

  /**
   * 切换我的筛选框
   * @return null
   */

  $('.j-sort-btn').on('click', function(event) {

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
            saveData = D.retData[0];
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
        saveWrapHtml += '<li><a href="javascrip:;" class="j-save-name save-name show" data-name="' + k + '" title="' + k + '">' + k + '</a> <a href="javascrip:;" class="j-save-del i-close-gray" data-id="' + saveData[k].search_id + '"></a></li>'
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

    if (params.search_name == '') {
      APP.showTips({
        onlyConfirm: true,
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
            onlyConfirm: true,
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

  //显示曲线图
  // $('.j-show-chart').on('click', function(event) {
  //   event.preventDefault();

  //   var $this = $(this);

  //   var parentList = $(this).parents('.j-stretch-wrap');
  //   if ($this.hasClass('c')) {
  //     $this.removeClass('c');
  //   } else {
  //     parentList.find('tr').removeClass('c');
  //     $this.addClass('c');
  //   }
  //   var nextId = $(this).next().attr('id');

  //   $('#chart-tr').remove();
  //   if ('chart-tr' != nextId) {
  //     var modelId = $(this).find('.j-model-id').val();
  //     var projectIssue = $(this).find('.j-project-issue').val();
  //     $(this).after('<tr id="chart-tr"><td colspan="12" style="background:#000; height:240px;" class="relative">' + '<div class="chart-des">' + '<a href="/trade/super/newhistory?day=30&type=0&model_id=' + modelId + '&project_issue=' + projectIssue + '&t=' + $.now() + '#last" target="_blank" style="text-decoration:underline;">查看历史数据</a>' +
  //       '</div>' +
  //       '<div id="chart_box" class="list-chart-box" style=""><div class="i-loading-black-32"></div></div>' +
  //       '</td></tr>');
  //     Do('highstock-theme-gray', function() {
  //       var chartOption = {
  //         url: '/trade/super/getpicdata?model_id=' + modelId + '&t=' + $.now(),
  //         id: 'chart_box',
  //         width: 940
  //       }
  //       Yuncai.chart(chartOption);
  //     });
  //   }

  // });

});