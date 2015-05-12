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
    var mname = _.escape($.trim($('#j-loty-name').val()));
    var html = '';
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

        template = _.template('<div class="frbox"><img src="' + staticHostURI + '/front_images/fail.png" alt="success" class="icon"><div class="text"><p><%= lotyName%> ' + midHtml + '</p><p>方案总金额<span class="fc-3"><%= total %></span></p><p>您认购<span><%= pay %></span>份</p><p>共需支付<span class="fc-3"><%= payMoney %>.00</span>元</p><div class="btns"><button class="btn btn-danger" id="buyConfirm">确定</button><button class="btn btn-gray" data-dismiss="modal">取消</button></div></div></div>');

        h = template({
          lotyName: mname,
          total: mtotal,
          pay: b,
          payMoney: b * onePrice
        });

        html = {
          html: h,
        };

        var payMoney = b * onePrice;
        var lessMoneyTips = '';
        lessMoneyTips += '<p>本次需支付：<span class="fc-3 mlr5">' + payMoney + '.00</span>元';

        APP.checkLogin(payMoney, {
          enoughMoney: function () {
            APP.showTips(html);
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

  PAGE.loadTicketRecord = function (obj) {
    PAGE.ajaxUrl = '/lottery/cp-detail/' + $('#j-strLotyName').val() + '/ajax';
    PAGE.pageElement = $('.j-page-box');
    PAGE.initAjax(obj);
    PAGE.onSuccess = function (data) {
      var htmlOutput = '';
      var nextPage = ((PAGE.config.page - 1) * 10 > 0) ? (PAGE.config.page - 1) * 10 : '';
      if (data.retCode == 100000) {
        for (var i = 0, len = data.retData.length; i < len; i++) {
          var lotyName = $('#j-strLotyName').val();
          if (lotyName == "model") {
            htmlOutput += '<tr>\
                            <td class="w180">' + (i + 1 + nextPage) + '</td>\
                            <td>' + data.retData[i].code + '</td>\
                            <td>' + data.retData[i].gg + '</td>\
                            <td>' + data.retData[i].multiple + '</td>\
                            <td>' + data.retData[i].money + '</td>\
                            <td>' + data.retData[i].status + '</td>\
                          </tr>';
          } else if( (lotyName == 'gdx') || (lotyName == 'dlc') || (lotyName == 'syy') ||(lotyName == 'xjx') ||
        		  (lotyName == 'lnx') || (lotyName == 'jxssc') || (lotyName == 'k3') ||(lotyName == 'jk3') ||
        		  (lotyName == 'hbk3') || (lotyName == 'klpk') || (lotyName == 'gkl') ){
        	  
        	  htmlOutput += '<tr>\
                  <td class="w180">' + (i + 1 + nextPage) + '</td>\
                  <td>' + data.retData[i].code + '</td>\
                  <td>' + data.retData[i].money / data.retData[i].multiple / 2 + '</td>\
                  <td>' + data.retData[i].multiple + '</td>\
                  <td>' + data.retData[i].money + '</td>\
                  <td>' + data.retData[i].status + '</td>\
                </tr>';
          }else {
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
        PAGE.config.pageNum = Math.ceil(data.total / obj.pageSize);
        PAGE.makePageHtml();
        PAGE.bindPageEvent(PAGE.loadTicketRecord);
      } else {
        htmlOutput = "<tr><td colspan='6'>" + data.retMsg + "</td></tr>";
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
      //$('#j-tab li:nth-child(2)').click(function(event) {
      //    $('#j-total-zhu').css({
      //        display: 'none'
      //    });
      //    $('#j-just-showmein').css({
      //        display: 'block'
      //    });
      //});
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

  // 底部tab切换
  $('#j-tab').on('click', 'a', function (event) {
    event.preventDefault();
    /* Act on the event */
    var tables = $('.tab-content .table');
    var index = parseInt($(this).attr('data-x'));
    switch (index) {
    case 1:
      switch ($('#j-project-status').val()) {
      case '已撤单':
        tables.eq(index).find('tbody').html('<tr><td colspan="7">您的方案已撤单，系统会自动将投注金退款到您的账户</td></tr>');
        break;

      case '待出票':
        tables.eq(index).find('tbody').html('<tr><td colspan="7">等待出票中...</td></tr>');
        break;

      default:
        // getNewPage
        PAGE.pageTable = tables.eq(index).find('tbody');
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