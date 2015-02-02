require.config({
  paths: {
    jquery: '../lib/jquery',
    lodash: '../lib/lodash.compat.min',
    store: '../lib/store.min',
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

require(['jquery', 'lodash', 'store', 'app', 'index', 'owl', 'bootstrap'], function ($, _, store, APP, index) {

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
    slideSpeed: 200,
    paginationSpeed: 400,
    lazyLoad: true,
    singleItem: true,
    autoPlay: 4000
  });

  // 快捷投注类型切换
  $('#j-quick-buy-loty-type').on('click', 'a', function (event) {
    index.currLotyName = $(this).attr('data-seed');
    index.timer4lottery();
    $('#j-go-buy-page').attr('href', '/lottery/buy/' + index.currLotyName);

  });

  $('.btn-change').on('click', function (event) {
    index.hasCreate[$(this).parents('.tab-pane').attr('id')] = false;

  });

  $('.btn-tou').on('click', function (event) {
    var lotyName = $(this).parents('.tab-pane').attr('id');
    quickBuyLottery();
  });

  var quickBuyLottery = function () {

    index.parameter = {};

    var lotyDomObj = $('#j-quick-buy-loty-detail').find('#' + index.currLotyName);

    index.url = '/lottery/digital/buy-self/' + index.currLotyName + '/' + index.defaultPlayName[index.currLotyName];

    index.parameter.qihaoId = lotyDomObj.find('.j-qihao-id').val();
    index.parameter.qihao = lotyDomObj.find('.j-qihao').val();
    index.parameter.zhushu = 1;
    index.parameter.beishu = 1;
    index.parameter.codes = index.buyCodes[index.currLotyName];

    $.ajax({
        url: '/account/islogin',
        type: 'get',
        dataType: 'json',
      })
      .done(function (D) {
        if (D.retCode === 100000) {
          if (Number(D.retData.money.replace(/,/g, '')) >= 2) {
            showBuyLotyConfirmMask();
          } else {
            APP.showTips({
              html: '<div class="tipbox"><p>您的余额不足,购买失败！</p><p class="last"><a href="/account/top-up" class="btn btn-danger" target="_blank">立即充值</a></p></div>'
            });
          }
        } else {
          APP.handRetCode(D.retCode, D.retMsg, quickBuyLottery);
        }
      });

  };

  function showBuyLotyConfirmMask() {

    var h, template, qihao = '',
      cName = '';

    switch (index.currLotyName) {
    case 'ssq':
      cName = '双色球';
      break;
    case 'dlt':
      cName = '大乐透';
      break;
    case 'pl5':
      cName = '排列5';
      break;
    }

    qihao = '第' + index.parameter.qihao + '期';

    template = _.template('<div class="frbox"><img src="<%= url %>/front_images/fail.png" alt="success" class="icon"><div class="text"><p><%= lotyName%><span><%=qihao%></span></p><p>共<span>1</span>注, 投注<span>1</span>倍</p><p>本次需支付<span class="fc-3">2</span>元</p></div>');

    h = template({
      lotyName: cName,
      url: staticHostURI,
      qihao: qihao
    });

    APP.showTips({
      text: h,
      type: 2,
      onConfirm: function () {
        sendQuickBuyAjax();
      }
    });

  }

  function sendQuickBuyAjax() {

    $.ajax({
        url: index.url,
        type: 'POST',
        dataType: 'json',
        data: index.parameter,
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

  }

  // 合买选项卡切换
  $('#j-model-nav').on('click', 'li', function (event) {

    var t = $(this);
    $('#j-model-nav .active').removeClass('active');
    t.addClass('active');
    index.modelLotyName = t.attr('data-loty');
    $('#j-model-more').attr('href', '/lottery/project-center/' + index.modelLotyName);
    $('#j-model-link').attr('href', '/lottery/buy/' + index.modelLotyName);

    if ($("#owl-demo").data('owlCarousel')) {
      $("#owl-demo").data('owlCarousel').destroy();
    }

    getModelBuy();

  });

  var submitHemai = function () {
    var h, template, qihao = '';

    if (index.modelLotyName !== 'jczq') {
      qihao = '第' + $('#' + index.modelLotyName).find('.j-qihao').val() + '期';
    }

    template = _.template('<div class="frbox"><img src="<%= url %>/front_images/fail.png" alt="success" class="icon"><div class="text"><p><%= lotyName%><span><%=qihao%></span></p><p>方案总金额<span class="fc-3"><%= total %></span>元</p><p>您认购<span class="fc-3"><%= pay %>.00</span>元</p><p>共需支付<span class="fc-3"><%= pay %>.00</span>元</p></div>');

    h = template({
      lotyName: index.modelLoty[index.modelLotyName].cnName,
      total: index.modelBuyParams.total,
      pay: index.modelBuyParams.buyNum,
      url: staticHostURI,
      qihao: qihao
    });

    APP.showTips({
      text: h,
      type: 2,
      onConfirm: function () {
        sendHemaiAjax();
      }
    });
  };

  var sendHemaiAjax = function () {
    var obj = null;
    if (index.modelBuyParams) {
      obj = index.modelBuyParams;
    } else {
      return;
    }
    $.ajax({
        url: obj.joinURI,
        type: 'get',
        dataType: 'json',
        data: {
          pid: obj.pid,
          buyNum: obj.buyNum
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
            window.location.reload();
          });
        } else {
          APP.handRetCode(data.retCode, data.retMsg, submitHemai);
        }
      })
      .fail(function () {
        APP.onServiceFail();
      });
  };

  function checkByNum(num, max) {
    var c = 1;
    if (_.isNaN(num)) {
      APP.showTips('请输入整数购买份数');
      c = 0;
    }
    if (num > max) {
      APP.showTips('超过最大可购买份额');
      c = 0;
    }
    if (!num || num === 0) {
      APP.showTips('请输入整数购买份数');
      c = 0;
    }
    return c;
  }

  //首页合买
  $('#owl-demo').on('click', '.j-model-buy', function (event) {

    var obj = {};
    var t = $(this);
    var joinURI = APP.filterStr(t.attr('data-url'));
    var pid = APP.filterStr(t.attr('data-id'));
    var buyNum = Number(APP.filterStr(t.siblings('.j-input-place').val()));
    var maxNum = Number(APP.filterStr(t.siblings('.j-input-place').attr('data-max')));
    var maxPrice = APP.filterStr(t.attr('data-max'));
    index.modelBuyParams = {
      joinURI: joinURI,
      pid: pid,
      buyNum: buyNum,
      total: maxPrice
    };

    if (checkByNum(buyNum, maxNum)) {
      $.ajax({
          url: '/account/islogin',
          type: 'get',
          dataType: 'json',
        })
        .done(function (D) {
          if (D.retCode === 100000) {
            if (Number(D.retData.money.replace(/,/g, '')) >= buyNum) {
              submitHemai();
            } else {
              APP.showTips({
                html: '<div class="tipbox"><p>您的余额不足,购买失败！</p><p class="last"><a href="/account/top-up" class="btn btn-danger" target="_blank">立即充值</a></p></div>'
              });
            }
          } else {
            APP.handRetCode(D.retCode, D.retMsg, quickBuyLottery);
          }
        });
    }

  });

  // 获取新选的合买信息
  function getModelBuy() {

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

              percent = (1 - (dataItem[i].lessNum / Number(dataItem[i].price))).toFixed(2) * 100;

              dataArr.push('<div class="item m-he-box"><div class="top"><img src="/front_images/index-hd.png" alt="head" class="head"><p>' + dataItem[i].username + '</p><p class="zj">累计中奖：<span>' + dataItem[i].totalMoney + '</span>元</p></div><div class="bottom"><div class="title">' + index.modelLoty[index.modelLotyName].cnName + '</div><div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + percent + '%;"></div></div><div class="gen">每份' + dataItem[i].unitPrice + '元<input type="text" class="j-input-place" data-max="' + dataItem[i].lessNum + '" data-place="剩余' + dataItem[i].lessNum + '份" value="剩余' + dataItem[i].lessNum + '份"><button class="btn j-model-buy" data-id="' + dataItem[i].id + '" data-max="' + dataItem[i].price + '" data-url="' + dataItem[i].joinURI + '">确定</button><a href="' + dataItem[i].detailURI + '" class="link">详情</a></div></div></div>');

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
            APP.bindInputOnlyInt('.j-input-place');
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

  function getWeekStart() {

    $.ajax({
        url: '/account/total-prize',
        type: 'get',
        dataType: 'json',
      })
      .done(function (data) {
        if (data.retCode === 100000) {
          $('#j-week-total').html(data.retData.totalPrize);
        }
      })
      .fail(function () {
        console.log("error");
      });

    $.ajax({
        url: '/account/prize-star',
        type: 'get',
        dataType: 'json',
      })
      .done(function (data) {
        if (data.retCode === 100000) {
          $('#j-week-start').html(data.retData[0].username);
        }
      })
      .fail(function () {
        console.log("error");
      });

    $.ajax({
        url: '/account/prize-list',
        type: 'get',
        dataType: 'json',
      })
      .done(function (data) {
        if (data.retCode === 100000) {
          runStartList(data.retData);
          setInterval(function () {
            runStartList()
          }, 3000);
        }
      })
      .fail(function () {
        console.log("error");
      });

  }

  function runStartList(d) {

    if (d) {
      index.startList = d;
    }

    var html = index.startList[index.startIndex].username.slice(0, 3) + '...中奖<span>' + index.startList[index.startIndex].bonus_money + '</span>元';
    $('#j-week-text').html(html);

    if (index.startIndex < index.startList.length - 1) {
      index.startIndex++;
    } else {
      index.startIndex = 0;
    }

  }

  function showMask() {

    var html = '<div class="m-mask pullDown" id="j-first-mask"><div class="m-mask-bg"></div><div class="m-mask-main"><img src="../front_images/index/mask-close.png" alt="close" class="m-mask-close" id="j-mask-close"><img src="../front_images/index/mask-main.png" alt="mask-main"></div></div>';
    $('body').append(html);
    $('#j-first-mask').addClass('animated');
    $('#j-mask-close').one('click', function (event) {
      $('#j-first-mask').remove();
    });

  }

  function getMask(newMask) {

    if(!newMask){
      newMask = 'lock';
    }

    var backVar = 'lock';
    var f = store.get('firstVisit');

    if (f) {

      if (f === newMask) {
        return;
      } else {
        store.set('firstVisit', newMask);
        showMask();
      }

    } else {
      store.set('firstVisit', 'lock');
      showMask();
    }

  }

  function pageInit() {
    getMask();
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

    index.startIndex = 0;

    getWeekStart();
    index.modelLotyCName = '竞彩足球';
    getModelBuy();
    index.init();

  }

  pageInit();

});