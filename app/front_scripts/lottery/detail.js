require.config({
  paths: {
    jquery: '../lib/jquery',
    lodash: '../lib/lodash.compat.min',
    bootstrap: '../lib/bootstrap.min',
    store: '../lib/store.min',
    app: '../common/app',
    pager: '../account/pager',
    tipsy: '../lib/jquery.tipsy',
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    },
    tipsy: {
      deps: ['jquery'],
      exports: 'jquery'
    },
  }
});

require(['jquery', 'lodash', 'store', 'app', 'pager', 'bootstrap', 'tipsy'], function ($, _, store, APP) {

  'use strict';

  /***
      @Config  Request必须参数  必要
      @PageTable 数据展示表格Element 必要
      @ajaxUrl Request-Data-Url 必要
      @initAjax 发送Ajax 请求 必要
      @onSuccess 数据请求成功后回到函数,主要用于组织返回数据的HTML 必要
      @onFail  数据请求失败回调 可选
      @makePageHtml  组织分页栏HTML 默认
      @bindPageEvent  绑定分页事件 默认
      @Config.pageNum 分页页数 默认
     ***/

  var pager = (function () {
    'use strict';

    function pager(args) {
      // enforces new
      if (!(this instanceof pager)) {
        return new pager(args);
      }

    }

    pager.prototype = {
      ajaxUrl: '',
      config: {
        pageNum: 0,
      },
      pageElement: null,
      pageTable: null,
      pageNext: 'j-next-page',
      pageBack: 'j-next-page',
      pageValue: 'j-next-page',
      pageGo: 'j-pages-go',
      onSuccess: null,
    };

    pager.prototype.bindPageEvent = function (callback) {

      var _this = this;

      if (!_this.pageElement) {
        return;
      }

      _this.pageElement.find('.next-page').on('click', function (event) {

        _this.config.page = parseInt(_this.config.page);
        if (_this.config.page < _this.config.pageNum) {
          _this.config.page += 1;
          callback(_this.config);
        }

      });

      _this.pageElement.find('.back-page').on('click', function (event) {

        _this.config.page = parseInt(_this.config.page);
        _this.config.page -= 1;
        if (_this.config.page <= 0) {
          _this.config.page = 1;
        }
        callback(_this.config);

      });

      _this.pageElement.find('.j-pages-value').on('change', function (event) {

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

      _this.pageElement.find('.j-pages-go').on('click', function (event) {
        _this.config.page = $(this).siblings('.j-pages-value').val() || 1;
        callback(_this.config);
      });

    };

    pager.prototype.appendTable = function (html) {
      this.pageTable.html(html);
    };

    pager.prototype.makePageHtml = function (pageHtmlNode) {

      if (this.pageElement || !pageHtmlNode) {
        pageHtmlNode = this.pageElement;
      }

      if (this.config.pageNum <= 1) {
        pageHtmlNode.html('');
        return;
      }

      pageHtmlNode.html('<div class="pull-right pages">' + '<span class="j-page">' + this.config.page + '</span>/<span class="j-days">' + this.config.pageNum + '</span>页<a href="javascript:;" class="back-page" >上一页</a><a href="javascript:;" class="next-page">下一页</a><input type="text" value="' + this.config.page + '" class="govalue j-pages-value"><button class="btn j-pages-go" type="button">Go</button>页</div>').show();

    };

    pager.prototype.initAjax = function (obj) {

      var _this = this;
      _this.config = obj;
      $.ajax({
          url: _this.ajaxUrl,
          type: 'get',
          dataType: 'json',
          data: _this.config,
        })
        .done(function (data) {
          _this.onSuccess(data);
        })
        .fail(function () {
          _this.onFail();
        });
    };

    pager.prototype.onFail = function () {

      //APP.showTips('服务器繁忙,请稍后再试!');

    };

    return pager;
  }());

  var cancelPage = new pager();

  var Detail = (function () {
    'use strict';

    var Detail = {
      qihao: $('#j-qihao').val(),
      lotyName: $('#j-strLotyName').val(),
      lotyCNName: $('#j-loty-name').val(),
      projectStatu: $('#j-project-status').val(),
      colCount: 7
    };

    return Detail;
  }());

  var rHd = $('.right-hd');

  if (rHd.length) {
    $('.left-hd').height(rHd[0].clientHeight);
  }

  var HeMai = {
    max: $('#j-max').html(),
    dan: $('#j-dan').html(),
    total: $('#j-total').html(),
  };

  var buy = {
    buyTotal: $('#j-buy'),
    buyMoney: $('#j-buy-total')
  };

  function updateBuyMoneyTotal() {
    var x = parseInt(buy.buyTotal.val());
    var y = parseInt(HeMai.dan);
    $('#j-buy-total').html(x * y);
  }

  function checkBuyTotal() {
    var v = parseInt(buy.buyTotal.val());
    var results = true;
    if (!buy.buyTotal.val()) {
      APP.showTips('购买份数不能为空！');
      return false;
    }
    if (isNaN(v)) {
      buy.buyTotal.val(HeMai.max);
      updateBuyMoneyTotal();
      APP.showTips('请输入购买份数');
      return false;
    }
    if (APP.isDecimal(buy.buyTotal.val())) {
      APP.showTips('购买份数不能为小数');
      return false;
    }
    if (v > HeMai.max) {
      APP.showTips('现在最多可以购买' + HeMai.max + '份啊！');
      return false;
    }
    return results;
  }

  $('body').on('click', '#hemaiRefresh', function (event) {
    window.location.reload();
  });

  $('#j-buy').on('keyup', function (event) {
    $(this).val($(this).val().replace(/\D|^0/g, ''));
    updateBuyMoneyTotal();
  });

  $('#j-buy').on('change', function () {
    var v = parseInt(buy.buyTotal.val());
    if (isNaN(v)) {
      buy.buyTotal.val(HeMai.max);
    }
    if (APP.isDecimal(buy.buyTotal.val())) {
      buy.buyTotal.val(HeMai.max);
    }
    if (v > HeMai.max) {
      buy.buyTotal.val(HeMai.max);
    }
    updateBuyMoneyTotal();
  });

  $('#buy-submit').on('click', function () {

    var isAgreen = $('#j-isAgreen')[0].checked;
    var template = '';
    var h = '';
    var b = parseInt(buy.buyTotal.val());
    var onePrice = Number(HeMai.dan);
    var mtotal = $('#j-total').html();
    var mid = $('#j-qihao').val();
    var midHtml = '';
    var v = '';
    var max = '';
    var percent = '';
    var data = '';
    var appendHtml = '';
    var date = '';

    if (!isAgreen) {
      APP.showTips('请先阅读并同意《委托投注规则》后才能继续');
    } else {
      if (checkBuyTotal()) {

        data = {
          byNum: b,
          joinURI: $('#j-joinURI').val(),
          prjctId: $('#j-projectId').val(),
          onSuccess: function () {

            v = parseInt(buy.buyTotal.val());
            max = parseInt(HeMai.max);
            percent = (100 - ((max - v) * HeMai.dan / HeMai.total * 100)).toFixed(2);

            if (percent == 100) {

              $('#j-buy')[0].disabled = true;
              $('#buy-submit')[0].disabled = true;

              buy.buyTotal.val('').attr('placeholder', '剩余0份');
              $('#j-pro-bar').html('100%').width('100%');

              buy.buyMoney.html(0);
              HeMai = null;
              buy = null;

            } else {

              $('#j-max').html(max - v);
              $('#j-pro-bar').html(percent + '%').width(percent + '%');

              buy.buyTotal.val('').attr('placeholder', '剩余' + (max - v) + '份');
              buy.buyMoney.html(0);
              HeMai.max = max - v;

            }

            date = new Date();
            appendHtml = '<tr><td>' + ($('#messages tbody tr').length + 1) + '</td><td>' + $('#myname').html() + '</td><td>' + b + '</td><td>' + b + '</td><td>0.00</td><td>' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '</td></tr>';
            $('#messages tbody').append(appendHtml);

          }
        };

        if (Detail.lotyName === 'r9' || Detail.lotyName === 'sfc') {

          midHtml = '第' + Detail.qihao + '期';

        }

        template = _.template('<div class="frbox"><img src="' + staticHostURI + '/front_images/fail.png" alt="success" class="icon"><div class="text"><p><%= lotyName%> ' + midHtml + '</p><p>方案总金额<span class="fc-3"><%= total %></span></p><p>您认购<span><%= pay %></span>份</p><p>共需支付<span class="fc-3"><%= payMoney %>.00</span>元</p><div class="btns"><button class="btn btn-danger" id="buyConfirm">确定</button><button class="btn btn-gray" data-dismiss="modal">取消</button></div></div></div>');

        h = template({
          lotyName: Detail.lotyCNName,
          total: mtotal,
          pay: b,
          payMoney: b * onePrice
        });

        var payMoney = b * onePrice;
        var lessMoneyTips = '';
        lessMoneyTips += '<p>本次需支付：<span class="fc-3 mlr5">' + payMoney + '.00</span>元';

        APP.checkLogin(payMoney, {
          enoughMoney: function () {
            APP.showTips({
              html: h,
            });
            $('#buyConfirm').one('click', function (event) {
              submitHemai(data);
            });
          },
          lessMoneyTips: lessMoneyTips
        });

      }
    }

  });

  var submitHemai = function (obj) {

    $.ajax({
        url: obj.joinURI,
        type: 'get',
        dataType: 'json',
        data: {
          pid: obj.prjctId,
          buyNum: obj.byNum,
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

  function getSfcR9Html(data) {

    var item = null;
    var tdDataArr = [];
    var result = '';
    var cancelStr = '';
    var cancelHtml = '';

    for (var i = 0; i < data.length; i++) {

      item = data[i];

      tdDataArr = [];
      tdDataArr = tdDataArr.concat(item.code);

      if (item.money / item.multiple / 2 === 1) {
        tdDataArr.push('单式')
      } else {
        tdDataArr.push('复式')
      }

      tdDataArr.push(item.money / item.multiple / 2);
      tdDataArr.push(item.multiple);

      result += '<tr><td> 选号</td>';

      for (var j = 0; j < tdDataArr.length; j++) {
        result += '<td>' + tdDataArr[j] + '</td>';
      };

      result += '</tr>';

    };

    return result;
  }

  PAGE.loadTicketRecord = function (obj) {

    PAGE.ajaxUrl = '/lottery/cp-detail/' + Detail.lotyName + '/ajax';
    PAGE.pageElement = $('.j-page-box');
    PAGE.initAjax(obj);

    PAGE.onSuccess = function (data) {

      var htmlOutput = '';
      var nextPage = ((PAGE.config.page - 1) * 10 > 0) ? (PAGE.config.page - 1) * 10 : '';
      var lotyName = Detail.lotyName;
      var item = null;

      if (data.retCode == 100000) {

        for (var i = 0, len = data.retData.length; i < len; i++) {

          item = data.retData[i];

          if (lotyName == "model") {

            htmlOutput += '<tr>\
                            <td class="w180">' + (i + 1 + nextPage) + '</td>\
                            <td>' + data.retData[i].code + '</td>\
                            <td>' + data.retData[i].gg + '</td>\
                            <td>' + data.retData[i].multiple + '</td>\
                            <td>' + data.retData[i].money + '</td>\
                            <td>' + data.retData[i].status + '</td>\
                          </tr>';

          } else if ((lotyName == 'gdx') || (lotyName == 'dlc') || (lotyName == 'syy') || (lotyName == 'xjx') ||
            (lotyName == 'lnx') || (lotyName == 'jxssc') || (lotyName == 'k3') || (lotyName == 'jk3') ||
            (lotyName == 'hbk3') || (lotyName == 'klpk') || (lotyName == 'gkl')) {

            htmlOutput += '<tr>\
                  <td class="w180">' + (i + 1 + nextPage) + '</td>\
                  <td>' + data.retData[i].code + '</td>\
                  <td>' + data.retData[i].money / data.retData[i].multiple / 2 + '</td>\
                  <td>' + data.retData[i].multiple + '</td>\
                  <td>' + data.retData[i].money + '</td>\
                  <td>' + data.retData[i].status + '</td>\
                </tr>';

          } else {
            htmlOutput += '<tr>\
                            <td class="w180">' + (i + 1 + nextPage) + '</td>\
                            <td>' + data.retData[i].code + '</td>\
                            <td>' + data.retData[i].gg + '</td>\
                            <td>' + data.retData[i].money / data.retData[i].multiple / 2 + '</td>\
                            <td>' + data.retData[i].multiple + '</td>\
                            <td>' + data.retData[i].money + '</td>\
                            <td>' + data.retData[i].status + '</td>\
                          </tr>';
          }

        };

        if (lotyName === 'sfc' || lotyName === 'r9') {

          htmlOutput = getSfcR9Html(data.retData);

        }

        PAGE.config.pageNum = Math.ceil(data.total / obj.pageSize);
        PAGE.makePageHtml();
        PAGE.bindPageEvent(PAGE.loadTicketRecord);

      } else {

        htmlOutput = '<tr><td colspan="' + Detail.colCount + '">' + data.retMsg + '</td></tr>';

      }

      this.appendTable(htmlOutput);

    };
    PAGE.onFail = function () {
      return;
    };
  };

  // 撤销按钮
  function checkCancelBtn() {
    var pattn = /(\d*.\d*)%$/;
    var bar_val = $("#j-pro-bar").text().replace(/\ /g, '').replace(/\n/g, '');
    if (bar_val) {
      bar_val = pattn.exec(bar_val)[1];
      if (bar_val > 70) {
        $(".j-hm-cxfa").css({
          display: 'none'
        });
        $(".j-hm-tips").css({
          display: 'none'
        });
      }
    }

    $(".j-hm-cxfa").click(function (event) {
      APP.showTips({
        title: '撤单确认',
        text: '<div class="hm-cdqr1"><i class="icon icon-fail"></i>您是否确认撤销本次合买方案？<dvi>',
        type: 2,
        onConfirm: function () {
          $.ajax({
              url: cancelURI,
              type: 'get',
              dataType: 'json'
            })
            .done(function (data) {
              if (data.retCode == 100000) {
                APP.showTips({
                  title: '撤单确认',
                  text: '<div class="hm-cdqr2"><i class="icon icon-dui"></i><div class="cdqr2-div1">已撤销本次合买方案</div><div class="cdqr2-div2">投注金额将自动返还到您的账户上</div></div>',
                  type: 1,
                  onConfirm: function () {
                    $('#myModal').modal('hide');
                    window.location.reload();
                  }
                });
              } else {
                APP.handRetCode(data.retCode, data.retMsg);
              }
            })
            .fail(function () {
              APP.onServiceFail();
            });
        }
      });
    });

    $('.j-hm-tips').tipsy({
      gravity: 'nw',
      html: true,
      opacity: 1
    });
  }

  checkCancelBtn();

  //撤销订单
  function checkCancelOrder() {
    $('#j-tab li:nth-child(1)').click(function (event) {
      $('#j-total-zhu').css({
        display: 'block'
      });
      $('#j-just-showmein').css({
        display: 'none'
      });
    });

    $('#j-tab li').on('click', function (event) {
      var selctVal = $(this).find('a').html();
      $('#j-just-showmein').hide();
      $('#j-total-zhu').hide();
      if (selctVal == '参与用户') {
        $('#j-just-showmein').show();
      } else if (selctVal == "选号详情") {
        $('#j-total-zhu').show();
      }
    })

    if ($('#myname').text() != $('.j-user-details td:nth-child(2)').text()) {
      $('.j-co-opertd a').remove();
    }

    $('.j-cancalorder-oper').on('click', function (event) {
      var orderId = $(this).parents('tr').attr('data-id');
      APP.showTips({
        title: '撤单确认',
        text: '<div class="hm-cdqr1"><i class="icon icon-fail"></i>您是否确认撤销该合买订单？ <dvi>',
        type: 2,
        onConfirm: function () {
          $.ajax({
              url: cancelOrderURI + orderId,
              type: 'get',
              dataType: 'json'
            })
            .done(function (data) {
              if (data.retCode == 100000) {
                APP.showTips({
                  title: '撤单确认',
                  text: '<div class="hm-cdqr2"><i class="icon icon-dui"></i><div class="cdqr2-div1">已撤销该合买订单</div><div class="cdqr2-div2">投注金额将自动返还到您的账户上</div></div>',
                  type: 1,
                  onConfirm: function () {
                    $('#myModal').modal('hide');
                    window.location.reload();
                  }
                });
              } else {
                APP.handRetCode(data.retCode, data.retMsg);
              }
            })
            .fail(function () {
              APP.onServiceFail();
            });
        }
      });
    });
    $('#j-ck').on('click', function (event) {
      var selected = ($('#j-ck').is(':checked'));
      $('.j-user-details').each(function (index) {
        if (selected && ($(this).attr('data-uid') != $('#j-login-uid').val())) {
          $(this).hide();
        } else {
          $(this).show();
        }
      });
    });
  }
  checkCancelOrder();

  //追号详情 投注号码
  /**
   * sum 计算字符个数
   * @return {null}
   */
  function touzhuNum() {

    var len = $('.j-tou-ls-box2').children('div').length;
    var sum = 0;

    if (len > 4) {

      $('.j-tzhm-more').css({
        display: 'block'
      });

      for (var i = 5; i <= len; i++) {
        $('.j-tou-ls-box2 div:nth-child(' + i + ')').css({
          display: 'none'
        });
      };

    }

    $('.j-tzhm-more').on('click', function (event) {

      APP.showTips({
        title: '投注号码',
        text: '<div class="tzhm-popdiv">' + $('#j-code-html').val() + '</div>'
      });

    });

  }

  touzhuNum();

  // 任九 胜负彩 部分撤单 获取 撤单分页

  cancelPage.loadCancelList = function (obj) {

    var _this = cancelPage;

    _this.ajaxUrl = '/lottery/cp-detail/' + Detail.lotyName + '/ajax'

    _this.pageElement = $('#j-pager-box');
    _this.config.pageElement = '#j-pager-box';
    _this.pageTable = $('#j-cancel');
    _this.initAjax(obj);

    _this.onSuccess = function (data) {

      var D = null;
      var item = null;
      var tdDataArr = [];
      var cancelStr = '';
      var cancelHtml = '';

      if (data.retCode === 100000) {

        D = data.retData;

        for (var i = 0; i < D.length; i++) {

          item = D[i];

          tdDataArr = [];
          tdDataArr = tdDataArr.concat(item.code);

          if (item.money / item.multiple / 2 === 1) {
            tdDataArr.push('单式')
          } else {
            tdDataArr.push('复式')
          }

          tdDataArr.push(item.money / item.multiple / 2);
          tdDataArr.push(item.multiple);

          cancelStr += '<tr><td> 选号</td>';

          for (var j = 0; j < tdDataArr.length; j++) {
            cancelStr += '<td>' + tdDataArr[j] + '</td>';
          };

          cancelStr += '</tr>';

        };

        cancelHtml = '<div class="ttil mid-ttil"><b>出票状态：已撤单</b></div><table class="table d-table-one"><thead><tr><th>场次</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th><th>玩法</th><th>注数</th><th>倍数</th></tr></thead>' + cancelStr + '</table>';

        _this.config.pageNum = Math.ceil(data.total / obj.pageSize);
        _this.makePageHtml();
        _this.bindPageEvent(_this.loadCancelList);
        _this.appendTable(cancelHtml);

      }
    }
  };

  // 底部tab切换
  $('#j-tab').on('click', 'a', function (event) {
    event.preventDefault();

    var tables = $('.tab-content .table');
    var index = parseInt($(this).attr('data-x'));
    var tbody = tables.eq(index).find('tbody');

    var colCount = 0;
    colCount = tables.eq(index).find('thead th').length;
    if (!colCount) {
      colCount = 7;
    }

    Detail.colCount = colCount;

    switch (index) {

    case 1:

      switch (Detail.projectStatu) {

      case '已撤单':
        tbody.html('<tr><td colspan="' + colCount + '">您的方案已撤单，系统会自动将投注金退款到您的账户</td></tr>');
        break;

      case '待出票':
        tbody.html('<tr><td colspan="' + colCount + '">等待出票中...</td></tr>');
        break;
      case '部分撤单':

        if (Detail.lotyName === 'sfc' || Detail.lotyName === 'r9') {

          //撤单-分页模块
          cancelPage.loadCancelList({
            project_no: $('#j-projectNo').val(),
            page: 1,
            pageSize: 10,
            type: 5
          });

          // Success-分页模块
          PAGE.pageTable = tbody;
          PAGE.loadTicketRecord({
            project_no: $('#j-projectNo').val(),
            page: 1,
            pageSize: 10,
            type: 4
          });

        } else {

          // 获取 出票详情-分页模块
          PAGE.pageTable = tbody;
          PAGE.loadTicketRecord({
            project_no: $('#j-projectNo').val(),
            page: 1,
            pageSize: 10,
          });

        }

        break;
      default:

        // 获取 出票详情-分页模块
        PAGE.pageTable = tbody;
        PAGE.loadTicketRecord({
          project_no: $('#j-projectNo').val(),
          page: 1,
          pageSize: 10,
        });
        break;
      }
    }
  });

  $('.j-cancel-project').on('click', function (event) {
    var requestURI = $(this).attr('data-c');
    APP.showTips({
      text: "您是否确认撤销本次合买方案？",
      type: 2,
      onConfirm: function () {
        $.ajax({
            url: requestURI,
            type: 'get',
            dataType: 'json'
          })
          .done(function (data) {
            if (data.retCode == 100000) {
              var html = '<div class="tipbox">' +
                '<p>已撤销本次合买方案</p>' +
                '<p>投注金额将自动返还到您的账户上</p>' +
                '</div>' +
                '<div class="m-btns">' +
                '<button class="btn btn-danger" id="j-modal-confirm">确认</button>' +
                '<button class="btn btn-gray ml15" data-dismiss="modal">取消</button>' +
                '</div>';
              APP.showTips({
                html: html,
                onConfirm: function () {
                  window.location.reload();
                }
              });
            } else {
              //APP.handRetCode(data.retCode, data.retMsg);
              APP.showTips({
                text: data.retMsg,
                type: 1,
                onConfirm: function () {
                  window.location.reload();
                }
              });
            }
          })
          .fail(function () {
            APP.onServiceFail();
          });
      }
    });
  });

  $('.j-cancel-select-project').on('click', function (event) {
    var projectIds = [];
    $('input[name="ids"]:checked').each(function () {
      projectIds.push($(this).val())
    });
    if (projectIds.length < 1) {
      APP.showTips({
        text: "请选择要取消的追号方案",
        type: 0
      });
      return;
    }
    var requestURI = $(this).attr('data-c');
    APP.showTips({
      text: "是否取消所选期次追号？",
      type: 2,
      ensuretext: '确认取消',
      canceltext: '继续追号',
      onConfirm: function () {
        $.ajax({
            url: cancelURI + projectIds.join(','),
            type: 'get',
            dataType: 'json'
          })
          .done(function (data) {
            if (data.retCode == 100000) {
              APP.showTips({
                text: '取消追号成功',
                type: 1,
                onConfirm: function () {
                  window.location.reload();
                }
              });
            } else {
              APP.handRetCode(data.retCode, data.retMsg);
            }
          })
          .fail(function () {
            APP.onServiceFail();
          });
      }
    });
  });
});