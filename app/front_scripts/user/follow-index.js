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

require(['jquery', 'app', 'store', 'lodash', 'PAGE', 'bootstrap'], function($, APP, store, _) {
  'use strict';

  var PAGE1 = new pager(); //定制跟单详情

  // 定制跟单首页 分页函数
  PAGE1.loadDZFollow = function(obj) {
    PAGE1.ajaxUrl = '/user/follow/query-follow-leader/ajx'; // ajax url
    PAGE1.pageElement = $('.j-dzgd-index-page-box'); // 分页dom
    PAGE1.initAjax(obj);
    PAGE1.pageTable = $('.j-dzgd-index-table'); // 表格 dom

    // ajax 成功回调
    PAGE1.onSuccess = function(data) {
      var htmlOutput = '';
      var detailData = '';
      var dataItem = '';
      var j = 20 * (obj.page - 1) + 1;
      console.log(data);
      if (data.retCode == 100000) {
        if (data.retData.data.length > 0) {
          detailData = data.retData.data;
          for (var i = 1; i <= detailData.length; i++, j++) {
            dataItem = detailData[i - 1];
            if(dataItem.followed){
              if(dataItem.follow_type==1){
                htmlOutput += '<tr><td>' + j + '</td><td class="td2 j-user-name" csm-where="' + dataItem.csm_where + '" follow-id="' + dataItem.id + '" uid="' + dataItem.uid + '" loty-name="' + dataItem.loty_name + '"><a target="_blank" href="/user/profile/index/' + dataItem.uid + '">' + dataItem.username + '</a></td><td class="td3">' + dataItem.loty_cnname + '</td><td class="td5"><span class="td5span">' + dataItem.bonus_30day + '</span>元</td><td class="td6">' + dataItem.bonus_total + '元</td><td class="td7">' + dataItem.follower_num + '</td><td class="td8">' + dataItem.follow_value + '元</td><td class="td9">' + dataItem.follow_times + '次</td>' + '<td class="td10"><button class="btn-gray" disabled>已定制</button><a class="btn-sear j-high-level" target="_blank" href="/account/customizegd">修改</a></td></tr>';
              }else if(dataItem.follow_type==2){
                htmlOutput += '<tr><td>' + j + '</td><td class="td2 j-user-name" csm-where="' + dataItem.csm_where + '" follow-id="' + dataItem.id + '" uid="' + dataItem.uid + '" loty-name="' + dataItem.loty_name + '"><a target="_blank" href="/user/profile/index/' + dataItem.uid + '">' + dataItem.username + '</a></td><td class="td3">' + dataItem.loty_cnname + '</td><td class="td5"><span class="td5span">' + dataItem.bonus_30day + '</span>元</td><td class="td6">' + dataItem.bonus_total + '元</td><td class="td7">' + dataItem.follower_num + '</td><td class="td8">' + dataItem.follow_value + '%</td><td class="td9">' + dataItem.follow_times + '次</td>' + '<td class="td10"><button class="btn-gray" disabled>已定制</button><a class="btn-sear j-high-level" target="_blank" href="/account/customizegd">修改</a></td></tr>';
              }
            }else{
              htmlOutput += '<tr><td>' + j + '</td><td class="td2 j-user-name" csm-where="' + dataItem.csm_where + '" follow-id="' + dataItem.id + '" uid="' + dataItem.uid + '" loty-name="' + dataItem.loty_name + '"><a target="_blank" href="/user/profile/index/' + dataItem.uid + '">' + dataItem.username + '</a></td><td class="td3">' + dataItem.loty_cnname + '</td><td class="td5"><span class="td5span">' + dataItem.bonus_30day + '</span>元</td><td class="td6">' + dataItem.bonus_total + '元</td><td class="td7">' + dataItem.follower_num + '</td><td class="td8"><input type="text" placeholder="最少1" class="min-yuan j-min-yuan"/>元</td><td class="td9"><input type="text" placeholder="最多999" class="min-ci j-min-ci"/>次</td>' + '<td class="td10"><button class="btn-red j-dz-btn">定制</button><a class="btn-white j-high-level" target="_blank" href="/user/profile/index/' + 　dataItem.uid + '">高级</a></td></tr>';
            }

          }
        } else {
          htmlOutput = '<tr><td colspan="6">当前没有跟单用户</td></tr>';
        }

        PAGE1.config.pageNum = Math.ceil(data.retData.size / PAGE1.config.pageSize); // 记录数赋值
        PAGE1.makePageHtml(); // 初始化分页组件
        PAGE1.bindPageEvent(PAGE1.loadDZFollow); // 绑定分页组件事件
      } else {
        PAGE1.config.pageNum = 0;
        PAGE1.makePageHtml();
        htmlOutput = '<tr><td colspan="10">' + data.retMsg + '</td></tr>';
      }
      this.appendTable(htmlOutput); //初始化表格
    };
  };

  PAGE1.loadDZFollow({
    page: 1, //第几页
    pageSize: 20, // 多少条1页
    pageElement: '.j-dzgd-index-page-box',
    sort_type: 2
  });

  $('.m-dzgd-nav ul li a').on('click', function(event) {
    var _this = $(this);
    var lotyName = _this.attr('loty-name');
    _this.parents('.m-dzgd-nav').find('a').removeClass('active');
    _this.addClass('active');
    var DATA = {
      sort_type: 2,
      loty_name: lotyName,
      page: 1,
      pageSize: 20,
      pageElement: '.j-dzgd-index-page-box'
    };
    PAGE1.loadDZFollow(DATA);
  });

  $('.j-btn-sear').on('click', function(event) {
    var userName = $('.j-search-input').val();
    var DATA = {
      username: userName,
      page: 1,
      pageSize: 20,
      pageElement: '.j-dzgd-index-page-box',
      sort_type : 2
    };
    if (!userName) {
      var DATA = {
        page: 1,
        pageSize: 20,
        pageElement: '.j-dzgd-index-page-box',
        sort_type : 2
      };
    }
    $('.m-dzgd-nav').find('a').removeClass('active');
    $('.j-30-bonus').removeClass('icon-down').removeClass('icon-up-active').addClass('icon-down-active');
    $('.j-total-bonus').removeClass('icon-down-active').removeClass('icon-up-active').addClass('icon-down');
    $('.j-already-dz').removeClass('icon-down-active').removeClass('icon-up-active').addClass('icon-down');
    PAGE1.loadDZFollow(DATA);
  });
  $(document).delegate('.j-dz-btn', 'click', function(event) {
    var _this = $(this);
    var leaderID = _this.parents('td').siblings('.j-user-name').attr('uid');
    var lotyName = _this.parents('td').siblings('.j-user-name').attr('loty-name');
    var unitPrice = _this.parents('td').siblings('.td8').find('.j-min-yuan').val();
    var maxBuyTimes = _this.parents('td').siblings('.td9').find('.j-min-ci').val();
    var followID = _this.parents('td').siblings('.j-user-name').attr('follow-id');
    var DATA, outhtml;

    if (!unitPrice && !maxBuyTimes) {
      APP.showTips('每次认购金额和定制次数不能为空');
      return;
    } else if (!unitPrice) {
      APP.showTips('每次认购金额不能为空');
      return;
    } else if (!maxBuyTimes) {
      APP.showTips('定制次数不能为空');
      return;
    }


    DATA = {
      leader_id: leaderID,
      loty_name: lotyName,
      unit_price: unitPrice,
      max_buy_times: maxBuyTimes,
      follow_id: followID,
      data_type: '0'
    };
    outhtml = '<div class="frbox"><img src="http://static3.yuncai.com/front_images/fail.png" alt="success" class="icon"><div class="text"><p>每次认购金额：<span class="fc-3">' + unitPrice + '</span>元</p><p>定制次数：<span class="fc-3">' + maxBuyTimes + '</span>次</p><p>确认按以上信息进行跟单吗？</p></div></div>';

    APP.checkLogin(null, {
      always: function(){
        APP.showTips({
        text: outhtml,
        type: 2,
        onConfirm: function() {
          confirmFollow(DATA, _this);
        }
      })
      }
    }, true);


  });

  function confirmFollow(DATA, _this) {
    $.ajax({
        url: '/user/follow/follow',
        type: 'get',
        dataType: 'json',
        data: DATA
      })
      .done(function(data) {
        if (data.retCode == 100000) {
          APP.showTips('定制成功！');
          var lotyName;
          $('.m-dzgd-nav a').each(function(index, el) {
            if ($(this).hasClass('active')) {
              lotyName = $(this).attr('loty-name');
            }
          });

          if (lotyName) {
            DATA = {
              loty_name: lotyName,
              page: 1,
              pageSize: 20,
              pageElement: '.j-dzgd-index-page-box',
              sort_type : 2
            };
          } else {
            DATA = {
              page: 1,
              pageSize: 20,
              pageElement: '.j-dzgd-index-page-box',
              sort_type : 2
            };
          }
          PAGE1.loadDZFollow(DATA);
        } else {
          APP.handRetCode(data.retCode, data.retMsg);
        }
      })
      .fail(function() {
        APP.onServiceFail();
      });
  }

  $(document).delegate('.j-min-yuan', 'change', function(event) {
    var v = $(this).val();

    var result = filterNum(v, 100000);
    $(this).val(result);

  });
  $(document).delegate('.j-min-yuan', 'keyup', function(event) {
    var v = $(this).val();

    var result = filterNum(v, 100000);

    $(this).val(result);

  });
  $(document).delegate('.j-min-ci', 'change', function(event) {
    var v = $(this).val();

    var result = filterNum(v, 999);
    $(this).val(result);

  });
  $(document).delegate('.j-min-ci', 'keyup', function(event) {
    var v = $(this).val();

    var result = filterNum(v, 999);

    $(this).val(result);

  });
  $(document).delegate('.j-high-level', 'click', function(event) {
    setTimeout(function(){
      $('#j-nav li:nth-child(3)').click();
    }, 3000);
  });

  $(document).delegate('.j-30-bonus', 'click', function(event) {
    var _this = $(this);
    var lotyName, DATA, sortType;

    $('.m-dzgd-nav a').each(function(index, el) {
      if ($(this).hasClass('active')) {
        lotyName = $(this).attr('loty-name');
      }
    });
    if (_this.hasClass('icon-down-active')) {
      _this.removeClass('icon-down-active').addClass('icon-up-active');
      sortType = 1;
    } else if (_this.hasClass('icon-up-active')) {
      _this.removeClass('icon-up-active').addClass('icon-down-active');
      sortType = 2;
    } else if (_this.hasClass('icon-down')) {
      _this.removeClass('icon-down').addClass('icon-up-active');
      _this.parents('th').siblings('.th6').find('i').removeClass('icon-down-active').removeClass('icon-up-active').addClass('icon-down');
      _this.parents('th').siblings('.th7').find('i').removeClass('icon-down-active').removeClass('icon-up-active').addClass('icon-down');
      sortType = 1;
    }
    if (!!lotyName) {
      DATA = {
        loty_name: lotyName,
        page: 1,
        pageSize: 20,
        pageElement: '.j-dzgd-index-page-box',
        sort_type: sortType
      };
    }else{
      DATA = {
        page: 1,
        pageSize: 20,
        pageElement: '.j-dzgd-index-page-box',
        sort_type: sortType
      };
    }
    PAGE1.loadDZFollow(DATA);
  });

  $(document).delegate('.j-total-bonus', 'click', function(event) {
    var _this = $(this);
    var lotyName, DATA, sortType;

    $('.m-dzgd-nav a').each(function(index, el) {
      if ($(this).hasClass('active')) {
        lotyName = $(this).attr('loty-name');
      }
    });
    if (_this.hasClass('icon-down-active')) {
      _this.removeClass('icon-down-active').addClass('icon-up-active');
      sortType = 3;
    } else if (_this.hasClass('icon-up-active')) {
      _this.removeClass('icon-up-active').addClass('icon-down-active');
      sortType = 4;
    } else if (_this.hasClass('icon-down')) {
      _this.removeClass('icon-down').addClass('icon-up-active');
      _this.parents('th').siblings('.th5').find('i').removeClass('icon-down-active').removeClass('icon-up-active').addClass('icon-down');
      _this.parents('th').siblings('.th7').find('i').removeClass('icon-down-active').removeClass('icon-up-active').addClass('icon-down');
      sortType = 3;
    }
    if (!!lotyName) {
      DATA = {
        loty_name: lotyName,
        page: 1,
        pageSize: 20,
        pageElement: '.j-dzgd-index-page-box',
        sort_type: sortType
      };
    }else{
      DATA = {
        page: 1,
        pageSize: 20,
        pageElement: '.j-dzgd-index-page-box',
        sort_type: sortType
      };
    }
    PAGE1.loadDZFollow(DATA);
  });

  $(document).delegate('.j-already-dz', 'click', function(event) {
    var _this = $(this);
    var lotyName, DATA, sortType;

    $('.m-dzgd-nav a').each(function(index, el) {
      if ($(this).hasClass('active')) {
        lotyName = $(this).attr('loty-name');
      }
    });
    if (_this.hasClass('icon-down-active')) {
      _this.removeClass('icon-down-active').addClass('icon-up-active');
      sortType = 5;
    } else if (_this.hasClass('icon-up-active')) {
      _this.removeClass('icon-up-active').addClass('icon-down-active');
      sortType = 6;
    } else if (_this.hasClass('icon-down')) {
      _this.removeClass('icon-down').addClass('icon-up-active');
      _this.parents('th').siblings('.th5').find('i').removeClass('icon-down-active').removeClass('icon-up-active').addClass('icon-down');
      _this.parents('th').siblings('.th6').find('i').removeClass('icon-down-active').removeClass('icon-up-active').addClass('icon-down');
      sortType = 5;
    }
    if (!!lotyName) {
      DATA = {
        loty_name: lotyName,
        page: 1,
        pageSize: 20,
        pageElement: '.j-dzgd-index-page-box',
        sort_type: sortType
      };
    }else{
      DATA = {
        page: 1,
        pageSize: 20,
        pageElement: '.j-dzgd-index-page-box',
        sort_type: sortType
      };
    }
    PAGE1.loadDZFollow(DATA);
  });



  function filterNum(v, max) {
    if (v === '') {
      return v;
    }

    var n = parseInt(v, 10);

    if (isNaN(n)) {
      n = 1;
    } else {
      n = (n >= 1) ? n : 1;
      n = n;
    }
    n = n > max ? max : n;
    return n;
  }



});