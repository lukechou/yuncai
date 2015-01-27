require.config({
  urlArgs: "bust=" + (new Date()).getTime(),
  paths: {
    jquery: '../lib/jquery',
    lodash: '../lib/lodash.compat.min',
    bootstrap: '../lib/bootstrap.min',
    owl: '../lib/owl.carousel.min',
    app: '../common/app',
    index: 'index'
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    },
    owl: {
      deps: ['jquery'],
      exports: 'jquery'
    },
  },

});

require(['jquery', 'lodash', 'app', 'index', 'owl', 'bootstrap'], function ($, _, APP, index) {

  index.seeds.ballNum = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35'];
  index.seeds.digitalBallNum = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  index.seeds.ssq = {
    redBall: index.seeds.ballNum.slice(1, 34),
    blueBall: index.seeds.ballNum.slice(1, 17),
    redTotal: 6,
    blueTotal: 1,
  };

  index.seeds.dlt = {
    redBall: index.seeds.ballNum.slice(1, 36),
    blueBall: index.seeds.ballNum.slice(1, 13),
    redTotal: 5,
    blueTotal: 2,
  };

  index.seeds.pl5 = {
    redBall: index.seeds.digitalBallNum.slice(0, 50),
    blueBall: index.seeds.digitalBallNum.slice(0, 0),
    redTotal: 5,
    blueTotal: 0,
  };

  $('#j-tou a').on('click', function (event) {
    if ($(this).attr('data-type') == 1) {
      $('#j-huan-one').fadeIn()
    } else {
      $('#j-huan-one').hide()
    }
  });

  // 单场决胜选择
  $('#j-d-tou').on('click', 'li', function (event) {
    $('#j-d-tou li').removeClass('active')
    $(this).addClass('active')
  });

  // 首页 头部轮播
  $("#owl-example").owlCarousel({
    navigation: false,
    slideSpeed: 300,
    paginationSpeed: 400,
    lazyLoad: true,
    singleItem: true
  });

  // 快捷投注类型切换
  $('#j-quick-buy-loty-type').on('click', 'a', function (event) {
    index.currLotyName = $(this).attr('data-seed');
    index.timer4lottery();
    $('#j-go-buy-page').attr('href', '/lottery/buy/' + index.currLotyName);
  });

  //
  $('.btn-change').on('click', function (event) {
    debugger
    index.hasCreate[$(this).parents('.tab-pane').attr('id')] = false;

  });

  $('.btn-tou').on('click', function (event) {
    var lotyName = $(this).parents('.tab-pane').attr('id');

    quickBuyLottery();
  });

  var quickBuyLottery = function () {
    var lotyDomObj = $('#j-quick-buy-loty-detail').find('#' + index.currLotyName);
    parameter = {};
    url = '/lottery/digital/buy-self/' + index.currLotyName + '/' + index.defaultPlayName[index.currLotyName];
    parameter.qihaoId = lotyDomObj.find('.j-qihao-id').val();
    parameter.qihao = lotyDomObj.find('.j-qihao').val();
    parameter.zhushu = 1;
    parameter.beishu = 1;
    parameter.codes = index.buyCodes[index.currLotyName];

    $.ajax({
        url: '/account/islogin',
        type: 'get',
        dataType: 'json',
      })
      .done(function (D) {
        if (D.retCode === 100000) {
          if (Number(D.retData.money.replace(/,/g, '')) >= 2) {
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: parameter,
              })
              .done(function (data) {
                if (data.retCode === 100000) {
                  APP.showTips("购买成功，预祝您中奖.");
                  index.hasCreate[index.currLotyName] = false;
                  APP.updateUserMoney();
                } else {
                  APP.showTips("购彩火爆，服务器正在努力处理.");
                }
              })
              .fail(function () {
                APP.showTips("购彩火爆，服务器正在努力处理.");
              });
          } else {
            APP.showTips('<div class="tipbox"><p>您的余额不足,购买失败！</p><p class="last"><a href="/account/top-up" class="btn btn-danger" target="_blank">立即充值</a></p></div>');
          }
        } else {
          APP.handRetCode(D.retCode, D.retMsg, quickBuyLottery);
        }
      });
  };

  $('#j-model-nav').on('click', 'li', function (event) {

    var t = $(this);
    $('#j-model-nav .active').removeClass('active');
    t.addClass('active');
    index.modelLotyName = t.attr('data-loty');
    getModelBuy();

  });

  var submitHemai = function (obj) {

    $.ajax({
        url: obj.joinURI,
        type: 'get',
        dataType: 'json',
        data: {
          pid: obj.prjctId,
          buyNum: obj.byNum
        },
      })
      .done(function (data) {
        if (data.retCode == 100000) {
          if (obj.onSuccess) {
            obj.onSuccess();
          }
          APP.updateUserMoney();
          APP.showTips({
            text: '合买成功!',
            type: 1,
            onConfirm: function () {
              window.location.reload();
            }
          });
          $('body').on('click', '.close', function (event) {
            window.history.go(0);
          });
        } else {
          APP.handRetCode(data.retCode, data.retMsg);
        }
      })
      .fail(function () {
        APP.onServiceFail();
      });

  };

  $('#owl-demo').on('click', '.j-model-buy', function (event) {

    var obj = {};
    var modelUrl = APP.filterStr($(this).attr('data-url'));
    var pid = APP.filterStr($(this).attr('data-id'));
    var buyNum = APP.filterStr($(this).siblings('.j-input-place').val());

    obj.modelBuyObj = {
      modelUrl: modelUrl,
      pid: pid,
      buyNum: buyNum,
    };

    submitHemai(obj);
  });

  function getModelBuy() {

    if ($("#owl-demo").data('owlCarousel')) {
      $("#owl-demo").data('owlCarousel').destroy();
    }

    $.ajax({
        url: '/lottery/project-center/' + index.modelLotyName + '/ajax',
        type: 'get',
        dataType: 'json',
        data: {
          status: 1,
          page: 1,
          pageSize: 10,
          qid: index.modelLoty[index.modelLotyName].id
        },
      })
      .done(function (data) {
        var html = '';
        var dataItem = '';
        var dataArr = [];
        var percent = null;

        if (data.retCode === 100000) {
          dataItem = data.retData.data;

          if (dataItem.length > 0) {
            for (var i = dataItem.length - 1; i >= 0; i--) {

              dataArr = [];
              percent = (dataItem[i].lessNum / Number(dataItem[i].price)).toFixed(2);

              dataArr.push('<div class="item m-he-box"><div class="top"><img src="/front_images/he-head.png" alt="head" class="head"><p>' + dataItem[i].username + '</p><p class="zj">累计中奖：<span>' + dataItem[i].totalMoney + '</span>元</p></div><div class="bottom"><div class="title">' + index.modelLoty[index.modelLotyName].cnName + '</div><div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + percent + '%;"></div></div><div class="gen">每份' + dataItem[i].unitPrice + '元<input type="text" class="j-input-place" data-place="剩余' + dataItem[i].lessNum + '份" value="剩余' + dataItem[i].lessNum + '份"><button class="btn j-model-buy" data-id="' + dataItem[i].id + '" data-url="' + dataItem[i].joinURI + '">确定</button><a href="' + dataItem[i].detailURI + '" class="link">详情</a></div></div></div>');

            };

            html += dataArr.join('');
            $('#j-model-tips').hide();
            $("#owl-demo").html(html);
            $("#owl-demo").owlCarousel({
              items: 3,
              navigation: true,
              navigationText: ["<i class='icon-chevron-left'></i>", "<i class='icon-chevron-right'></i>"]
            });
            APP.bindInputPlace();
          } else {
            $("#owl-demo").hide();
            onGetModelBuyError();
          }
        } else {
          onGetModelBuyError();
        }

      })
      .fail(function () {
        onGetModelBuyError();
      });

  }

  function onGetModelBuyError() {
    $('#j-model-tips').show();
    $('#j-model-loader').remove();
    $('#j-model-box').fadeIn();
  }

  function pageInit() {

    //依赖快速投注期号
    index.modelLotyName = 'jczq';
    index.modelLoty = {
      ssq: {
        cnName: '双色球',
        id: $('#ssq .j-qihao-id').val()
      },
      dlt: {
        cnName: '大乐透',
        id: $('#dlt .j-qihao-id').val()
      },
      jczq: {
        cnName: '竞彩足球',
        id: ''
      }
    };
    getModelBuy();
    index.init();

  }

  pageInit();

});