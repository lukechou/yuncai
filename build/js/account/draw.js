$(function(){var e=function(){"use strict";var e={moneyEl:$("#j-tiqu-money"),max:Number($("#j-max-money").html()),min:10,less:5e4};return e}();$("#j-bind-sub").on("click",function(a){a.preventDefault();var t=e.moneyEl.val();if(e.max<e.min&&t!=e.max&&t!=e.max)return t=e.max,e.moneyEl.val(e.max),void APP.showTips("账户余额小于10元，提款需一次性提清");if(e.max>=e.min){if(t<e.min&&t!=e.max)return void APP.showTips("每次提款金额需大于等于"+e.min+"元!");if(t>e.max)return APP.showTips("超出最大可提取金额"),void e.moneyEl.val(e.max>e.less?e.less:e.max);if(t>e.less)return APP.showTips("提现金额每笔不可超过50000元"),void e.moneyEl.val(e.less)}return isNaN(t)||0==t?(APP.showTips("请先输入正确金额"),void e.moneyEl.val(10)):(t=Number(t).toFixed(2),e.moneyEl.val(t),$(".getmoney").html(t),$("#j-bind-form").hide(),$("#j-confirm").fadeIn(),$("#j-tips-box").hide(),void 0)}),$("#j-confirm-sub").on("click",function(e){e.preventDefault();var a=$("#j-tiqu-money").val();$("#j-confirm").hide(),$("#j-next").fadeIn(),$.ajax({url:"/account/draw/ajax",type:"get",dataType:"json",data:{money:a}}).done(function(e){1e5==e.retCode?($("#j-confirm").hide(),$("#j-next").fadeIn(),$("#drawTime").html(e.retData.time),$("#drawBank").html($("#bankName").html()),$("#drawMoney").html(e.retData.drawMoney),$("#drawRealMoney").html(e.retData.drawRealMoney),APP.updateUserMoney()):APP.showTips(e.retMsg)}).fail(function(){APP.onServiceFail()})}),$("#findTKRecord").on("click",function(e){e.preventDefault(),PAGE.getDrawRecord({type:$("#days").val(),status:$("#status").val(),page:1,pageSize:10,innerHtmlObj:$("#tkRecordList")})}),$("#j-draw-nav").on("click","a",function(){1==$(this).attr("data-cord")&&PAGE.getDrawRecord({type:$("#days").val(),status:$("#status").val(),page:1,pageSize:10,innerHtmlObj:$("#tkRecordList")})}),$("#tkRecordList").on("click",".j-cancel",function(){var e=$(this),a=$(this).attr("data-id");$.ajax({url:"/account/draw/cancel/ajax",type:"get",dataType:"json",data:{id:a}}).done(function(a){1e5==a.retCode?(APP.showTips(a.retMsg),e.parents("tr").find(".j-status").html("提款取消"),e.remove(),APP.updateUserMoney()):APP.handRetCode(a.retCode,a.retMsg)}).fail(function(){APP.onServiceFail()})})});