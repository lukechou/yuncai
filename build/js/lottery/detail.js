require.config({paths:{jquery:"../lib/jquery",lodash:"../lib/lodash.compat.min",bootstrap:"../lib/bootstrap.min",store:"../lib/store.min",app:"../common/app",pager:"../account/pager",tipsy:"../lib/jquery.tipsy"},shim:{bootstrap:{deps:["jquery"],exports:"jquery"},tipsy:{deps:["jquery"],exports:"jquery"}}}),require(["jquery","lodash","store","app","pager","bootstrap","tipsy"],function(t,a,e,n){"use strict";function o(){var a=parseInt(p.buyTotal.val()),e=parseInt(r.dan);t("#j-buy-total").html(a*e)}function i(){var t=parseInt(p.buyTotal.val()),a=!0;return p.buyTotal.val()?isNaN(t)?(p.buyTotal.val(r.max),o(),n.showTips("请输入购买份数"),!1):n.isDecimal(p.buyTotal.val())?(n.showTips("购买份数不能为小数"),!1):t>r.max?(n.showTips("现在最多可以购买"+r.max+"份啊！"),!1):a:(n.showTips("购买份数不能为空！"),!1)}function s(){var a=/(\d*.\d*)%$/,e=t("#j-pro-bar").text().replace(/\ /g,"").replace(/\n/g,"");e&&(e=a.exec(e)[1],e>70&&(t(".j-hm-cxfa").css({display:"none"}),t(".j-hm-tips").css({display:"none"}))),t(".j-hm-cxfa").click(function(a){n.showTips({title:"撤单确认",text:'<div class="hm-cdqr1"><i class="icon icon-fail"></i>您是否确认撤销本次合买方案？<dvi>',type:2,onConfirm:function(){t.ajax({url:cancelURI,type:"get",dataType:"json"}).done(function(a){1e5==a.retCode?n.showTips({title:"撤单确认",text:'<div class="hm-cdqr2"><i class="icon icon-dui"></i><div class="cdqr2-div1">已撤销本次合买方案</div><div class="cdqr2-div2">投注金额将自动返还到您的账户上</div></div>',type:1,onConfirm:function(){t("#myModal").modal("hide"),window.location.reload()}}):n.handRetCode(a.retCode,a.retMsg)}).fail(function(){n.onServiceFail()})}})}),t(".j-hm-tips").tipsy({gravity:"nw",html:!0,opacity:1})}function l(){t("#j-tab li:nth-child(1)").click(function(a){t("#j-total-zhu").css({display:"block"}),t("#j-just-showmein").css({display:"none"})}),t("#j-tab li").on("click",function(a){var e=t(this).find("a").html();t("#j-just-showmein").hide(),t("#j-total-zhu").hide(),"参与用户"==e?t("#j-just-showmein").show():"选号详情"==e&&t("#j-total-zhu").show()}),t("#myname").text()!=t(".j-user-details td:nth-child(2)").text()&&t(".j-co-opertd a").remove(),t(".j-cancalorder-oper").on("click",function(a){var e=t(this).parents("tr").attr("data-id");n.showTips({title:"撤单确认",text:'<div class="hm-cdqr1"><i class="icon icon-fail"></i>您是否确认撤销该合买订单？ <dvi>',type:2,onConfirm:function(){t.ajax({url:cancelOrderURI+e,type:"get",dataType:"json"}).done(function(a){1e5==a.retCode?n.showTips({title:"撤单确认",text:'<div class="hm-cdqr2"><i class="icon icon-dui"></i><div class="cdqr2-div1">已撤销该合买订单</div><div class="cdqr2-div2">投注金额将自动返还到您的账户上</div></div>',type:1,onConfirm:function(){t("#myModal").modal("hide"),window.location.reload()}}):n.handRetCode(a.retCode,a.retMsg)}).fail(function(){n.onServiceFail()})}})}),t("#j-ck").on("click",function(a){var e=t("#j-ck").is(":checked");t(".j-user-details").each(function(a){e&&t(this).attr("data-uid")!=t("#j-login-uid").val()?t(this).hide():t(this).show()})})}function d(){var a=t(".j-tou-ls-box2").children("div").length;if(a>4){t(".j-tzhm-more").css({display:"block"});for(var e=5;a>=e;e++)t(".j-tou-ls-box2 div:nth-child("+e+")").css({display:"none"})}t(".j-tzhm-more").on("click",function(a){n.showTips({title:"投注号码",text:'<div class="tzhm-popdiv">'+t("#j-code-html").val()+"</div>"})})}var c=t(".right-hd");c.length&&t(".left-hd").height(c[0].clientHeight);var r={max:t("#j-max").html(),dan:t("#j-dan").html(),total:t("#j-total").html()},p={buyTotal:t("#j-buy"),buyMoney:t("#j-buy-total")};t("body").on("click","#hemaiRefresh",function(t){window.location.reload()}),t("#j-buy").on("keyup",function(a){t(this).val(t(this).val().replace(/\D|^0/g,"")),o()}),t("#j-buy").on("change",function(){var t=parseInt(p.buyTotal.val());isNaN(t)&&p.buyTotal.val(r.max),n.isDecimal(p.buyTotal.val())&&p.buyTotal.val(r.max),t>r.max&&p.buyTotal.val(r.max),o()}),t("#buy-submit").on("click",function(){var e=t("#j-isAgreen")[0].checked,o="",s="",l=parseInt(p.buyTotal.val()),d=Number(r.dan),c=t("#j-total").html(),h=(t("#j-qihao").val(),""),m=a.escape(t.trim(t("#j-loty-name").val())),y="",f="",v="",b="",j="",g="",x="";if(e){if(i()){j={byNum:l,joinURI:t("#j-joinURI").val(),prjctId:t("#j-projectId").val(),onSuccess:function(){f=parseInt(p.buyTotal.val()),v=parseInt(r.max),b=(100-(v-f)*r.dan/r.total*100).toFixed(2),100==b?(t("#j-buy")[0].disabled=!0,t("#buy-submit")[0].disabled=!0,p.buyTotal.val("").attr("placeholder","剩余0份"),t("#j-pro-bar").html("100%").width("100%"),p.buyMoney.html(0),r=null,p=null):(t("#j-max").html(v-f),t("#j-pro-bar").html(b+"%").width(b+"%"),p.buyTotal.val("").attr("placeholder","剩余"+(v-f)+"份"),p.buyMoney.html(0),r.max=v-f),x=new Date,g="<tr><td>"+(t("#messages tbody tr").length+1)+"</td><td>"+t("#myname").html()+"</td><td>"+l+"</td><td>"+l+"</td><td>0.00</td><td>"+x.getFullYear()+"-"+(x.getMonth()+1)+"-"+x.getDate()+" "+x.getHours()+":"+x.getMinutes()+":"+x.getSeconds()+"</td></tr>",t("#messages tbody").append(g)}},o=a.template('<div class="frbox"><img src="'+staticHostURI+'/front_images/fail.png" alt="success" class="icon"><div class="text"><p><%= lotyName%> '+h+'</p><p>方案总金额<span class="fc-3"><%= total %></span></p><p>您认购<span><%= pay %></span>份</p><p>共需支付<span class="fc-3"><%= payMoney %>.00</span>元</p><div class="btns"><button class="btn btn-danger" id="buyConfirm">确定</button><button class="btn btn-gray" data-dismiss="modal">取消</button></div></div></div>'),s=o({lotyName:m,total:c,pay:l,payMoney:l*d}),y={html:s};var w=l*d,T="";T+='<p>本次需支付：<span class="fc-3 mlr5">'+w+".00</span>元",n.checkLogin(w,{enoughMoney:function(){n.showTips(y),t("#buyConfirm").one("click",function(t){u(j)})},lessMoneyTips:T})}}else n.showTips("请先阅读并同意《委托投注规则》后才能继续")});var u=function(a){t.ajax({url:a.joinURI,type:"get",dataType:"json",data:{pid:a.prjctId,buyNum:a.byNum,unikey:(new Date).valueOf()}}).done(function(e){1e5==e.retCode?(a.onSuccess&&a.onSuccess(),n.updateUserMoney(),n.showTips({text:"合买成功!",type:1,onConfirm:function(){window.location.reload()}}),t("body").on("click",".close",function(t){window.history.go(0)})):n.handRetCode(e.retCode,e.retMsg)}).fail(function(){n.onServiceFail()})};PAGE.loadTicketRecord=function(a){PAGE.ajaxUrl="/lottery/cp-detail/"+t("#j-strLotyName").val()+"/ajax",PAGE.pageElement=t(".j-page-box"),PAGE.initAjax(a),PAGE.onSuccess=function(e){var n="",o=10*(PAGE.config.page-1)>0?10*(PAGE.config.page-1):"";if(1e5==e.retCode){for(var i=0,s=e.retData.length;s>i;i++){var l=t("#j-strLotyName").val();n+="model"==l?'<tr>\r\n                            <td class="w180">'+(i+1+o)+"</td>\r\n                            <td>"+e.retData[i].code+"</td>\r\n                            <td>"+e.retData[i].gg+"</td>\r\n                            <td>"+e.retData[i].multiple+"</td>\r\n                            <td>"+e.retData[i].money+"</td>\r\n                            <td>"+e.retData[i].status+"</td>\r\n                          </tr>":"gdx"==l||"dlc"==l||"syy"==l||"xjx"==l||"lnx"==l||"jxssc"==l||"k3"==l||"jk3"==l||"hbk3"==l||"klpk"==l||"gkl"==l?'<tr>\r\n                  <td class="w180">'+(i+1+o)+"</td>\r\n                  <td>"+e.retData[i].code+"</td>\r\n                  <td>"+e.retData[i].money/e.retData[i].multiple/2+"</td>\r\n                  <td>"+e.retData[i].multiple+"</td>\r\n                  <td>"+e.retData[i].money+"</td>\r\n                  <td>"+e.retData[i].status+"</td>\r\n                </tr>":'<tr>\r\n                            <td class="w180">'+(i+1+o)+"</td>\r\n                            <td>"+e.retData[i].code+"</td>\r\n                            <td>"+e.retData[i].gg+"</td>\r\n                            <td>"+e.retData[i].money/e.retData[i].multiple/2+"</td>\r\n                            <td>"+e.retData[i].multiple+"</td>\r\n                            <td>"+e.retData[i].money+"</td>\r\n                            <td>"+e.retData[i].status+"</td>\r\n                          </tr>"}PAGE.config.pageNum=Math.ceil(e.total/a.pageSize),PAGE.makePageHtml(),PAGE.bindPageEvent(PAGE.loadTicketRecord)}else n="<tr><td colspan='6'>"+e.retMsg+"</td></tr>";this.appendTable(n)},PAGE.onFail=function(){}},s(),l(),d(),t("#j-tab").on("click","a",function(a){a.preventDefault();var e=t(".tab-content .table"),n=parseInt(t(this).attr("data-x"));switch(n){case 1:switch(t("#j-project-status").val()){case"已撤单":e.eq(n).find("tbody").html('<tr><td colspan="7">您的方案已撤单，系统会自动将投注金退款到您的账户</td></tr>');break;case"待出票":e.eq(n).find("tbody").html('<tr><td colspan="7">等待出票中...</td></tr>');break;default:PAGE.pageTable=e.eq(n).find("tbody"),PAGE.loadTicketRecord({project_no:t("#j-projectNo").val(),page:1,pageSize:10})}}}),t(".j-cancel-project").on("click",function(a){var e=t(this).attr("data-c");n.showTips({text:"您是否确认撤销本次合买方案？",type:2,onConfirm:function(){t.ajax({url:e,type:"get",dataType:"json"}).done(function(t){if(1e5==t.retCode){var a='<div class="tipbox"><p>已撤销本次合买方案</p><p>投注金额将自动返还到您的账户上</p></div><div class="m-btns"><button class="btn btn-danger" id="j-modal-confirm">确认</button><button class="btn btn-gray ml15" data-dismiss="modal">取消</button></div>';n.showTips({html:a,onConfirm:function(){window.location.reload()}})}else n.showTips({text:t.retMsg,type:1,onConfirm:function(){window.location.reload()}})}).fail(function(){n.onServiceFail()})}})}),t(".j-cancel-select-project").on("click",function(a){var e=[];if(t('input[name="ids"]:checked').each(function(){e.push(t(this).val())}),e.length<1)return void n.showTips({text:"请选择要取消的追号方案",type:0});t(this).attr("data-c");n.showTips({text:"是否取消所选期次追号？",type:2,ensuretext:"确认取消",canceltext:"继续追号",onConfirm:function(){t.ajax({url:cancelURI+e.join(","),type:"get",dataType:"json"}).done(function(t){1e5==t.retCode?n.showTips({text:"取消追号成功",type:1,onConfirm:function(){window.location.reload()}}):n.handRetCode(t.retCode,t.retMsg)}).fail(function(){n.onServiceFail()})}})})});