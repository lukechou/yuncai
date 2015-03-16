require.config({
  paths: {
    jquery: '../lib/jquery',
    lodash: '../lib/lodash.compat.min',
    store: '../lib/store.min',
    bootstrap: '../lib/bootstrap.min',
    owl: '../lib/owl.carousel.min',
    slick: '../lib/slick.min',
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

require(['jquery', 'lodash', 'store', 'app', 'index', 'owl', 'bootstrap', 'slick'], function ($, _, store, APP, index) {

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
  $('#slick').slick({
    lazyLoad: 'ondemand',
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    speed: 400,
    infinite: true,
    arrows: true,
    dots: true,
    pauseOnHover: true,
    pauseOnDotsHover: true,
  });

  $('#slick .slick-dots li').on('mouseover', function (event) {
    var dotIndex = $(this).index();
    $('#slick')[0].slick.slickGoTo(dotIndex);
  });

  $('#slick').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
    if (nextSlide === 1) {
      var w = ($(window).width() - 985) / 2 + 265;
      $('.bn3-left').width(w);
    }
  });

  // 快捷投注类型切换
  $('#j-quick-buy-loty-type').on('click', 'a', function (event) {

    index.currLotyName = $(this).attr('data-seed');

    index.timer4lottery();
    $('#j-go-buy-page').attr('href', '/lottery/buy/' + index.currLotyName);

  });

  $('#j-quick-buy-loty-detail .btn-change').on('click', function (event) {
    index.hasCreate[$(this).parents('.tab-pane').attr('id')] = false;

  });

  $('#j-quick-buy-loty-detail .btn-red').on('click', function (event) {
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
    index.parameter.unikey = $.now();

    APP.checkLogin(2, {
      enoughMoney: function () {
        showBuyLotyConfirmMask();
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
          APP.showTips(data.retMsg);
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
    getModelBuy(true);
  });

  $('#j-buy-switch').on('click', 'span', function (event) {
    event.preventDefault();
    $('#j-buy-switch span').addClass('unactive');
    $(this).removeClass('unactive');

    if ($("#owl-demo").data('owlCarousel')) {
      $("#owl-demo").data('owlCarousel').destroy();
    }

    switch ($(this).attr('data-buy-type')) {
    case '0':
      $('#j-model-more').html('更多模型').attr('href', '/lottery/trade/model-index');
      $('#j-noproject-tips').html('当前期暂时还无人投注。亲，<a href="/lottery/trade/model-index" target="_blank" id="j-model-link">马上投注去</a>，您就是今天的彩胜第一人！');
      getModelBuy(false);
      $('#j-model-nav').addClass('hide');
      break;
    case '1':
      $('#j-model-more').html('更多合买').attr('href', '/lottery/project-center/jczq');
      $('#j-noproject-tips').html('当前暂无合买方案。亲，<a href="/lottery/buy/jczq" target="_blank" id="j-model-link">马上去发起</a>，您就是今天的彩胜第一发起人');
      getModelBuy(true);
      $('#j-model-nav').removeClass('hide');
      break;
    }
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
          buyNum: obj.buyNum,
          unikey: (new Date()).valueOf(),
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

  // 首页合买, 模型跟买
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

    if (t.attr('data-gm')) {

      var min = Number(t.attr('data-gm'));
      var maxBuy = 500000;

      if (isNaN(buyNum) || buyNum === '') {
        APP.showTips('请输入要投注的金额');
        return;
      }

      if (buyNum % 2 !== 0) {
        APP.showTips('请输入偶数的金额');
        return;
      }

      if (buyNum < min) {
        APP.showTips('亲,投注金额不能低于<span>' + min + '</span>元');
        return;
      }

      if (buyNum > maxBuy) {
        APP.showTips('亲,单次投注金额最大限制为 ' + maxBuy + ' 元');
        return;
      }

      obj = {
        project_issue: t.attr('data-qihao'),
        model_id: t.attr('data-modelid'),
        money: buyNum
      };

      var btnHTML = '';
      if (index.isSellStop) {
        btnHTML = '<button class="btn btn-danger btn-stop">确定</button>';
      } else {
        btnHTML = '<button class="btn btn-danger" id="buyConfirm">确定</button>';
      }

      var html = '<div class="m-detail-box"><p>您对模型编号<span class="mlr-8 fc-3">' + obj.model_id + '</span>投注<span class="mlr-8 fc-3">' + obj.money + '</span>元，请确认</p><div class="btns">' + btnHTML + '<button class="btn btn-gray" data-dismiss="modal">取消</button></div></div>';

      APP.checkLogin(buyNum, {
        enoughMoney: function () {

          APP.showTips({
            html: html
          });

          $('#buyConfirm').one('click', function (event) {
            $.ajax({
                url: '/lottery/trade/model-fast-buy',
                type: 'POST',
                dataType: 'json',
                data: obj,
              })
              .done(function (data) {
                if (data.retCode === 100000) {
                  APP.showTips("购买成功，预祝您中奖.");
                  APP.updateUserMoney();
                } else {
                  APP.showTips(data.retMsg);
                }
              })
              .fail(function () {
                APP.showTips("购彩火爆，服务器正在努力处理.");
              });
          });
        }

      });
    } else {
      //合买
      if (checkByNum(buyNum, maxNum)) {
        APP.checkLogin(buyNum, {
          enoughMoney: function () {
            submitHemai();
          }
        });
      }

    }

  });

  // 获取新选的合买信息
  function getModelBuy(isHemai) {
    var requestURI = isHemai ? '/lottery/project-center/' + index.modelLotyName + '/ajax' : '/lottery/trade/fetch-last-data';
    $.ajax({
        url: requestURI,
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
        var cnName = index.modelLoty[index.modelLotyName].cnName;
        var jczqIndex = [];
        var jczqCnNameObj = {
          'spf_gg': '胜平负',
          'rqspf_gg': '让球胜平负',
          'bf_gg': '比分',
          'zjq_gg': '总进球',
          'bqc_gg': '半全场',
        };
        var btnHTML = '';

        if (index.isSellStop) {
          btnHTML = '<button class="btn btn-danger btn-stop pull-right">确定</button>';
        }

        if (data.retCode === 100000) {
          dataItem = isHemai ? data.retData.data : data.retData;

          if (dataItem.length > 0) {

            for (var i = dataItem.length - 1; i >= 0; i--) {
              if (isHemai) {

                if (index.modelLotyName === 'jczq') {
                  jczqIndex = dataItem[i]['joinURI'].split('/');
                  cnName = jczqCnNameObj[jczqIndex[jczqIndex.length - 1]];
                }

                percent = (1 - (dataItem[i].lessNum / Number(dataItem[i].price))).toFixed(2) * 100;

                if (!index.isSellStop) {
                  btnHTML = '<button class="btn j-model-buy btn-red" data-id="' + dataItem[i].id + '" data-max="' + dataItem[i].price + '" data-url="' + dataItem[i].joinURI + '">确定</button>';
                }

                dataArr.push('<div class="item m-he-box"><div class="top"><img src="/front_images/index/index-hd.png" alt="head" class="head"><p>' + dataItem[i].username + '</p><p class="zj">累计中奖：<span>' + dataItem[i].totalMoney + '</span>元</p></div><div class="bottom"><div class="title">' + cnName + '<a href="' + dataItem[i].detailURI + '" class="link">详情</a></div><div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + percent + '%;"></div></div><div class="gen"><span class="gen-one">每份' + dataItem[i].unitPrice + '元</span><input type="text" class="j-input-place" data-max="' + dataItem[i].lessNum + '" data-place="剩余' + dataItem[i].lessNum + '份" value="剩余' + dataItem[i].lessNum + '份">' + btnHTML + '</div></div></div>');
              } else {

                if (!index.isSellStop) {
                  btnHTML = '<button data-qihao="' + dataItem[i].qihao + '" data-modelid="' + dataItem[i]['model_id'] + '" data-gm="' + dataItem[i].minMoney + '" class="btn submit j-model-buy btn-red pull-right">确定</button>';
                }

                dataArr.push('<div class="item m-he-box">\
                          <div class="top">\
                              <img src="/front_images/index/index-hd.png" alt="head" class="head">\
                              <p>' + dataItem[i].username + '</p>\
                              <p class="zj">\
                                  最近30天盈利金额：<span class="fs-24">' + dataItem[i].money + '</span>\
                                  元\
                              </p>\
                          </div>\
                          <div class="bottom">\
                              <div class="id">\
                                  <span>编号：[' + dataItem[i].model_id + ']</span>\
                                  <a href="/lottery/trade/model-detail?model_id=' + dataItem[i].model_id + '&status=1" class="first">查看详情</a>\
                              </div>\
                              <div class="gen gen-2">\
                                  投注\
                                  <input type="text" class="j-input-place" data-place="最低投注' + dataItem[i].minMoney + '" value="最低投注' + dataItem[i].minMoney + '" />\
                                  元' + btnHTML + '</div>\
                          </div>\
                      </div>');
              }
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
        }
      })
      .fail(function () {
        console.log("error");
      });

  }

  function runStartList(d) {

    var delay = 300;
    var html = '';
    var item = '';
    var ul = '';
    var width = $('#j-week-text').width();

    html += '<ul id="j-run-list">';

    for (var i = d.length - 1; i >= 0; i--) {
      item = d[i];
      html += '<li>' + item.username.slice(0, 3) + '...中奖<span>' + item.bonus_money + '元</span></li>';
    };

    html += '</ul>';

    $('#j-week-text').html(html);
    ul = $('#j-run-list');

    ul.width(d.length * width);
    setInterval(function () {
      ul.animate({
          marginLeft: -width
        },
        300,
        function () {
          var h = ul.find('li').first().clone();
          ul.find('li').first().remove();
          ul.css('marginLeft', 0).append(h);
        });
    }, 4000);

  }

  function showMask() {

    var imgArr = [];

    $('#j-first-mask img').each(function (index, el) {

      var newImg = new Image();
      var src = $(this).attr('data-src')
      newImg.src = src;
      imgArr.push(newImg);

      $(this).attr('src', src);
    });

    imgArr[1].onload = function () {
      $('#j-first-mask').show().addClass('animated');
      $('#j-mask-close').one('click', function (event) {
        $('#j-first-mask').remove();
      });
    };

  }

  function getMask(newMask) {

    if (!newMask) {
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

  $('#j-xz-buy').on('click', function (event) {
    $('#j-xz-modal').modal('show');
  });

  $('#j-xz-nav').on('click', 'li', function (event) {
    $('#j-xz-nav .active').removeClass('active');
    $(this).toggleClass('active');
    index.xz.randomNameIndex = $(this).index();
    index.xz.actLuckyNum = index.xz.childNum + index.xz.randomNameIndex;
    $('#j-num-list').removeClass('main-many');
    $('#j-num-list').html('');
    index.xz.buyCodes = null;
  });

  $('#j-xz-num').on('click', 'span', function (event) {
    $('#j-xz-num span.active').removeClass('active');
    $(this).toggleClass('active');
    index.xz.randomZhushu = Number(APP.filterStr($(this).html()));
  });

  function getXzNum(actNum, zhushu) {

    if (actNum < 10) {
      actNum = '0' + actNum;
    } else {
      actNum = String(actNum);
    }

    var returenArr = [];
    var oneNum = {};
    var redArr = [];
    var blueArr = [];
    for (var i = zhushu - 1; i >= 0; i--) {

      oneNum = {
        red: [],
        blue: []
      };

      redArr = index.seeds.ssq.redBall.concat();
      blueArr = index.seeds.ssq.blueBall.concat();

      if (index.xz.actLuckyNum > 16) {
        _.remove(redArr, function (num) {
          return num == actNum;
        });

        oneNum.red = _.sample(redArr, index.seeds.ssq.redTotal - 1);
        oneNum.blue = _.sample(blueArr, index.seeds.ssq.blueTotal);
        oneNum.red.push(actNum);
      } else {

        if (Math.random() > .8) {

          oneNum.red = _.sample(redArr, index.seeds.ssq.redTotal);
          oneNum.blue.push(actNum);

        } else {

          _.remove(redArr, function (num) {
            return num == actNum;
          });

          oneNum.red = _.sample(redArr, index.seeds.ssq.redTotal - 1);
          oneNum.blue = _.sample(blueArr, index.seeds.ssq.blueTotal);
          oneNum.red.push(actNum);

        }

      }
      oneNum.red.sort(function (a, b) {
        return a - b;
      });
      returenArr.push(oneNum);
    };

    return returenArr;
  }

  $('#j-xz-getNum').on('click', function (event) {

    var arr = getXzNum(index.xz.actLuckyNum, index.xz.randomZhushu);
    var html = '';
    var red = '';
    var isMany = (index.xz.randomZhushu == 1) ? 1 : 0;

    index.xz.buyCodes = arr;

    if (isMany) {
      $('#j-num-list').removeClass('main-many');
    } else {
      $('#j-num-list').addClass('main-many');
    }
    for (var i = arr.length - 1; i >= 0; i--) {

      red = '';
      html += '<div class="num-zhu-tiem">';

      for (var j = 0; j < arr[i].red.length; j++) {
        red += '<span>' + arr[i].red[j] + '</span>';
      };

      html += red;
      html += '<span class="blue">' + arr[i].blue[0] + '</span></div>';
    };

    $('#j-num-list').html(html);
  });

  $('#j-xz-ljtz').on('click', function (event) {

    var codes = index.xz.buyCodes || false;
    var buyCodes = [];
    if (codes && codes.length > 0) {

      for (var i = 0; i < codes.length; i++) {
        buyCodes.push(codes[i].red.join(',') + '|' + codes[i].blue[0]);
      };

      var params = {
        qihao: $('#ssq').find('.j-qihao').val(),
        qihaoId: $('#ssq').find('.j-qihao-id').val(),
        codes: buyCodes.join('$'),
        zhushu: codes.length,
        beishu: 1,
        unikey: $.now()
      };

      var btnHTML = '';

      if (index.isSellStop) {
        btnHTML = '<button class="btn btn-danger btn-stop">确定</button>';
      } else {
        btnHTML = '<button class="btn btn-danger" id="buyConfirm">确定</button>';
      }

      var html = '<div class="frbox"><img src="' + staticHostURI + '/front_images/fail.png" alt="success" class="icon"><div class="text"><p>双色球 第<span>' + params.qihao + '</span>期</p><p>共<span>' + params.zhushu + '</span>注, 投注<span>1</span>倍</p><p>本次需支付<span class="fc-3">' + params.zhushu * 2 + '.00</span>元</p><div class="btns">' + btnHTML + '<button class="btn btn-gray" data-dismiss="modal">取消</button></div></div></div>';

      APP.checkLogin(params.zhushu * 2, {
        enoughMoney: function () {
          APP.showTips({
            html: html
          });

          $('#buyConfirm').one('click', function (event) {
            $.ajax({
                url: '/lottery/digital/buy-self/ssq/0',
                type: 'POST',
                dataType: 'json',
                data: params,
              })
              .done(function (data) {
                if (data.retCode === 100000) {
                  $('#j-xz-modal').modal('hide');
                  APP.showTips("购买成功，预祝您中奖.");
                  index.hasCreate[index.currLotyName] = false;
                  APP.updateUserMoney();
                } else {
                  APP.showTips(data.retMsg);
                }
              })
              .fail(function () {
                APP.showTips("购彩火爆，服务器正在努力处理.");
              });
          });
        }
      });
    } else {
      APP.showTips('请先获取号码');
    }

  });

  $('#j-xz-reset').on('click', function (event) {
    $('#j-num-list').removeClass('main-many');
    $('#j-num-list').html('');
    index.xz.buyCodes = null;
  });

  function setLuckyBetting() {

    // 星座运程
    var fortune = {
      sxYCArr: {
        y0: ["运势渐入佳境，有一洗霉气之势。", "运势吉星拱照，积极向上多旺气。", "财运亨通，适宜进行大胆投资。", "运势良好，发展趋势倾向于乐观。", "财运较旺，易有正财和偏财的机会。", "运势较顺利，多做好长远的规划。", "整体运势强旺，工作得时得地。", "财运上财源广进，正财和偏财均得。", "求财宜守不宜攻，可免重大破耗。", "金钱压力较大，投资前请谨慎。"],
        y1: ["财运亨通，后期财运大增八方来财。", "运势有好转之兆，要积极进取。", "运势强劲一时无两，事事称心顺意。", "运势保持强劲势头，人际关系良好。", "财运稳定，可进行彩票合买。", "运势一般，对钱财机会要多斟别。", "财运上升，正偏财都有收益。", "有财来财去的倾象，开支有增加。", "运程反复不定，波折重重。", "财运下滑，收支难达到平衡。"],
        y2: ["事业茂盛，财源广进，名利双收。", "财源滚滚，正偏财均可谋。", "偏财运不错，有招财进宝的机遇。", "有财利可得，宜积极投资。", "运势很强，多努力就可赚到该得的。", "钱财平稳，贪心则有失财之象。", "财运不算旺，易现各种消耗的机会。", "财运平稳，凡事以求稳为主。", "财运下滑，收入难达到理想。", "财运比较好，不稳定，变数过多。"],
        y3: ["财运亨通，凡谋必遂。", "财运颇佳，但财富难聚。", "运势顺畅，财不请自来。", "财星庇佑，旺及正财及偏财。", "财运亨通，可尝试彩票投资。", "横财有利，是进行投资的好时机。", "运势低迷，提防财务危机。", "财运一般，横财相对低迷。", "财运差强人意，不利投资。", "运势吉凶交集，反复无常。"],
        y4: ["财运方面正财佳，收入颇丰。", "财运非常佳，财源大增。", "运势迅速回升，一洗灰暗颓气。", "吉星高照，开始迎来新气象。", "财运比较好，偶有小耗。", "小有横财，应见好就收。", "运势平稳向上，和气生财。", "财运起伏不定，正财较佳。", "财运稍逊，正财尚可。", "财运下滑，购彩娱乐为好。", "运势回升，趋向好的方面转变。"],
        y5: ["运势强盛，如草木逢春生机勃勃。", "财运起色较大，会有外财中奖之喜。", "运程大吉大利，多有外财收获。", "财运亨通，有心想事成、财源滚滚之喜。", "运程渐顺，平稳有余。", "财运上机会不错，适合投资。", "财运中平，可放心求财。", "运程迂回曲折，运势上多有飘忽不定。", "财星破耗，钱财易泄，运势较差。", "吉星坐镇，运势会渐入佳境。"],
        y6: ["财运闪耀，横财亨通。", "运势大有好转，事业运强盛。", "运势越来越好，柳暗花明又一村。", "财运不错，正财兴旺，横财低迷。", "运势迂回曲折，财运会有颇丰收获。", "财运非常旺，有中奖机会！", "财运尚可，正财收入比较丰厚。", "财运进出都比较大，学会理财。", "凶星破运，运势趋向平顺。", "财运平缓，则是损中有盈。"],
        y7: ["运势凌厉，各方面都有很好的表现。", "运势强盛，做事阻力较少。", "财运有所回落，正财尚可，偏财偏差。", "运势回升，发展顺畅势如破竹。", "财运非常出色，正财佳，有不错收入。", "横财较好，可适当进行短期投资。", "整体运势尚可，平稳向上发展。", "财运方面正财平常，横财有利。", "财运方面好坏参半，正财收入尚可。", "财运好转，正财横财皆佳，中奖几率大。", "运势有所改善，迈入新的发展。"],
        y8: ["财运大有起色，财源广进的最佳时候。", "福星高照，运势一反阻滞之态，急速好转。", "运势大吉，顺水行舟可满载而归。", "气势如虹，偏财有利，会有意外收获。", "运势略有起色，风雨过后仍有阴霾。", "财运尚可，适合正财，多稳定收入。", "运程反复不定，进展多现阻力。", "财运先旺后衰，守成为上。", "贵人照命，财运大有起色。", "运势低迷，静待机缘，养精蓄锐。", "凶星出现，运势有所回落。"],
        y9: ["运势如日中天，阴霾之气尽散。", "财运大吉，正财和偏财均有收获。", "旺运到来，可进行彩票投资。", "财运渐入佳境，收入颇丰。", "运势较一般，做事反复，有得有失。", "财运大有进益，投资定可获利。", "财运收入可观，可进行短期投资。", "财运尚可，正财横财都不错。", "运势暗淡，易有反复，凡事易遭遇阻滞。", "运势如日中天，付出会有良好回报。"],
        y10: ["运势吉凶参半，顺中带逆。", "吉星高照，仍可乘胜追击。", "财运较佳，可进行风险投资。", "财运非常旺，横财运不错。", "运势较大好转，有中奖机会。", "财运非常佳，财源大增。", "运气渐入佳境，偶有麻烦，也可顺利解决。", "财运利正财，横财亦有收获。", "财运有所好转，正财佳，收入丰厚。", "运势越来越好，诸多事可转危为安。"],
        y11: ["运势较为有利，循序渐进。", "运势低迷不振，遇阻则变，变则能通。", "财星入库，易收不易得。", "凶星趁虚而入，运势偏差。", "运程出现新转机，现气象万新之态。", "财运亨通，财星高照，多有收益。", "运势中平，要保持恒心和决心。", "财运先衰后旺，有财源广进之喜。", "吉星相护，运势乘胜而上。", "偏财较佳，适合进行风险性投入。", "运势畅旺，各方面运势进展势如破竹。"]
      },
      xzYCArr: {
        y0: ["财运开低走高，平缓逐步上扬。", "辛勤累积期待后期丰盛的回收。", "事业运很旺，有机会获得领导权。", "财运让人羡慕，积极运作得财顺。", "整体运势良好，有利于大胆投资。", "满脑子投资经，适合简单的投资。", "财运顺畅，彩票一族小有收获。", "有计划的消费可以达到收支平衡。", "财运一般，会因犹豫而错失好时机。", "自控能力增强，投资有出色表现。", "运势平缓，意外的财富需多打理。", "聚财需另辟蹊径，控财能力才会好。"],
        y1: ["运势有回升，人缘增财路。", "财运一般，借助他人另开局面。", "投资方面，有合伙出资的机会。", "事业小有突破，为自己而工作。", "小富由俭，投资可积累运势。", "预算开销增长，需谨慎花钱。", "不错的职场生活，会有不错的进展。", "金钱事务有结余，避免做大的花销。", "银行账户提升，注意保持合理投资。", "乐观和幸运在上升，月收入有可能增加。", "欣赏他人优点，也需看清自己实力。"],
        y2: ["运势尚可，辛勤工作会带来好运。", "投资目光敏锐，建议把握时机。", "运势由弱转强，继续努力发展。", "财运良好，存款有可能增多哟。", "有意想不到的变化，可能彩票中奖。", "运势继续好转，熟人情缘变旺。", "保持耐心和快乐，不要为钱所累。", "学会适当分利，建立稳固的攻守联盟。", "把投资放在新兴事物上，有创新与突破。", "财政平缓，留意一些积极的赚钱方法。", "挑战自身极限，可能发现新天地。"],
        y3: ["财运最佳，但不可以得意忘形噢。", "事业中的螃蟹，期待丰厚的回报。", "财政上会成功，尽量避免过度花销。", "收入会升高，事业可能进入新阶段。", "今天有好兆头，财务方面看涨。", "财务方面，相信自己的第六感。", "突然的能量，银行户头比预期的要多。", "财运达到顶峰，可能涨薪或有额外收都。", "钱来得巧去得快，花钱需谨慎。", "运势颇佳，因权获利的机会增多。", "投资方面，赌博心态愈演愈烈。"],
        y4: ["财务状况佳，要为长远作打算。", "取财务方面有突破，可以尝试买彩票。", "理财计划和预算，带来积极的影响。", "事业方面处在巅峰，可能有激烈的竞争。", "财运旺，金钱方面总体较积极。", "长期投资有利润，银行存款增长。", "收入比较缓慢，齐心协力能成就省钱大计。", "致富野心增加，投资眼光独到。", "跟人合伙财运上升，易有良好的收入。", "财运逐步平缓，失去利益迹象明显。"],
        y5: ["财运颇佳，财源滚滚来，可能中奖。", "事业处于上升趋势，可以期待更多薪水。", "有意外财运，可能是升职、奖金、礼物。", "财运方面，会激励自己管好自己的荷包。", "会有意外的收获和开支，看好你的财报。", "财务稳步上升，不要在钱的问题上太过草率。", "赚钱的机会不少，但花钱的也需要注意。", "生活会变得顺利，可能找到丢了的钱。", "能量过剩，主动和积极会让工作太急躁。", "买彩票可能会中，但是请避免大量投资。"],
        y6: ["正财偏财运都颇佳，收入存款稳步上升。", "运势强盛，横财较好，可适当短期投资。", "有更多金钱收入，可能是分红或者加薪。", "工作十分顺利，可能得到期待的结果。", "财运很好，和钱有关的都会符合心意。", "在金钱方面有收获，投资长线机会多。", "运势平稳，整个财务状况往良性方向调整。", "支出控制能力变弱，留意不要入不敷出。", "运势稍显低迷，但可能有贵人扶助。", "财运有所回落，正财尚可，横财偏差。"],
        y7: ["赚钱意欲拉升，正财收入水涨船高。", "运势平稳，偏财收入后期将有转机。", "人际运势蹿升，事业有望回报。", "财星高照，财源收入有所增长。", "恋爱男女，易在财务上起争执。", "财务疲于应付，好面子令钱袋受伤。", "自信满满，越战越勇，可绝地重生。", "知己知彼，可增加你的成功几率。", "支出投资方面，在情绪的操控之中。", '有强烈的"博一搏"的赌性。', "换个角度灵活看待，便有所得。"],
        y8: ["收入有所提高，钱要花在刀刃上。", "留心财务预算，会有惊人的领悟。", "工作方面，全速前进，切忌懈怠。", "财务状况有所提升，适宜投资。", "运势上升，大赚一笔也不是不可能的。", "认真管理钱财，必能有所斩获！", "运势颇佳，事业升职分红都有可能。", "运势低迷,预算失控，需金钱照料。", "财运不佳，入不敷出的状况可能出现。", "内心充满渴望，要坚定追求的勇气。"],
        y9: ["运势一般，收入靠广开财路，积小成多。", "财务支出意外花销不断，总体盈余不多。", "对苦干失去信心，期待巧妙省力的赚钱方式。", "运势回升，有机会参与新的获利模式。", "处在平衡的状态，银行存款数字看起来很美。", "工作中保持明智能带来颇有成效的结果。", "财运较好，金钱方面存在不错的收益。", "整体运势颇佳，现金流十分理想。", "精力达到顶峰状态，事业压力与释放感并存。", "凭勇气挑战，能积累战胜它的经验。"],
        y10: ["财务颇佳，将有一笔横财从天而降。", "财务喜人，可能会加薪，甚至会中彩票！", "运势回落，感情和金钱会有误解和混乱。", "以往开发的财源，有机会回收，获利丰厚。", "财运不佳，积极争取补助方可有所弥补。", "运势上升，长线投资机会在近期出现。", "重心转移至事业，可能会得到格外器重。", "财运十分令人看好，透过合作获得好运。", "争取曝光机会，才华与形象将获得赏识。", "整体财运非常好，偏财正财俱足。"],
        y11: ["赌运走高，彩票可一搏，记得小赌怡情。", "运势继续上行，偏财运走旺。", "投资可以运气一拼，要有输蚀的准备。", "眼光看得更长远，能制定长远目标。", "钱财如浮云，不费劲地飘到你手中。", "投资可提早布局，获利机会立竿见影。", "机运不错，要及时把握时机去冲刺挣钱。", "面临财务危机，要善加经营才会有财富的累积。", "运势回落，采取保守的理财方式。", "财运称得上较理想，横财也颇佳。", "运势非常旺盛，在收入或盈余方面较平衡。"]
      }
    };

    // set xz Arr
    initXzObj();

    // random Data
    var num = _.random(0, 11);

    // Create lucknum and xzYc on num and Date
    var luckyNum = index.xz.childNum + num;
    var xzYc = fortune.xzYCArr['y' + num][index.xz.yc];

    var compiled = _.template('<img src="../front_images/index/xz/xz-logo-<%=num%>.png" alt="<%=name%>"/><p><%=name%></p><p><%=date%></p>');

    $('#j-lucky-num').html(luckyNum);
    $('#j-xz-yc').html(xzYc);
    $('#j-xz-box').html(compiled({
      'num': num,
      'name': index.xz.fortuneArr[num].name,
      'date': index.xz.fortuneArr[num].date,
    }));

    index.xz.randomNameIndex = num;
    index.xz.actLuckyNum = luckyNum;
    $('#j-xz-nav li').eq(num).addClass('active');

  }

  function initXzObj() {

    index.xz = {
      randomZhushu: 1,
      randomNameIndex: 1,
      fortuneArr: [{
        name: '白羊座',
        date: '3.21-4.19'
      }, {
        name: '金牛座',
        date: '4.20-5.20'
      }, {
        name: '双子座',
        date: '5.21-6.21'
      }, {
        name: '巨蟹座',
        date: '6.22-7.22'
      }, {
        name: '狮子座',
        date: '7.23-8.22'
      }, {
        name: '处女座',
        date: '8.23-9.22'
      }, {
        name: '天秤座',
        date: '9.23-10.23'
      }, {
        name: '天蝎座',
        date: '10.24-11.22'
      }, {
        name: '射手座',
        date: '11.23-12.21'
      }, {
        name: '魔羯座',
        date: '12.22-1.19'
      }, {
        name: '水瓶座',
        date: '1.20-2.18'
      }, {
        name: '双鱼座',
        date: '2.19-3.20'
      }]
    };

    var date = new Date().getDate();

    if (date > 22) {
      index.xz.childNum = (date % 22);
    } else {
      index.xz.childNum = date;
    }

    if (date > 10) {
      index.xz.yc = (date % 10);
    } else {
      index.xz.yc = date;
    }

  }

  function pageInit() {

    // 检测弹出层 传入1个参数可更改用户store 弹出新的弹出层
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
    getModelBuy(false);
    index.init();

    // 幸运投注
    setLuckyBetting();

  }

  pageInit();

});