require.config({paths:{jquery:"../lib/jquery",lodash:"../lib/lodash.compat.min",bootstrap:"../lib/bootstrap.min",store:"../lib/store.min",app:"../common/app",core:"../lib/core",PL3:"../lottery/pl3_core"},shim:{bootstrap:{deps:["jquery"],exports:"jquery"}}}),require(["jquery","lodash","store","app","PL3","bootstrap","core"],function(e,t,a,s,i){"use strict";function n(){1==e("#saleStatus").val()&&(s.showStopSellModal(i.G_BUY.lotyCNName),e("#buy-submit,#buy_button_proxy").html("暂停销售").removeClass("btn-red").addClass("btn-stop").attr("id","")),s.bindInputPlace(),i.G_BUY.init(),i.G_CHOOSE.init(),i.nav.init({bigEl:e("#j-hd-nav"),smallEl:e("#j-nav"),content:e("#j-content"),main:e("#j-box-main")})}function o(t){var a=i.nav.big,s=i.nav.small;"zx"===a&&"dt"===s&&(s="cgtz"),i.ballAear=e(".box-"+a+"-"+s+" .j_normal_choose_code"),"zx"===a&&"cgtz"===s?e(".j-jx-zhus").show():e(".j-jx-zhus").hide(),i.G_BUY.isManual="up"===s?!0:!1,"zx"===a&&("cgtz"===s&&(i.playName=10),"hz"===s&&(i.playName=12),"many"===s&&(i.playName=10),"up"===s&&(i.playName=10)),"zx3"===a&&("cgtz"===s&&(i.playName=20),"dt"===s&&(i.playName=21),"hz"===s&&(i.playName=22),"up"===s&&(i.playName=20)),"zx6"===a&&("cgtz"===s&&(i.playName=30),"dt"===s&&(i.playName=31),"hz"===s&&(i.playName=32),"up"===s&&(i.playName=30)),e("#buy-submit").attr("disabled","disabled"),i.nav.toggleTabs(),Y(),h(),c()}function u(e){return"undefined"==typeof i.G_CHOOSE.codes[0]&&(i.G_CHOOSE.codes[0]=[]),"undefined"==typeof i.G_CHOOSE.codes[0][e]&&(i.G_CHOOSE.codes[0][e]=[]),i.G_CHOOSE.codes[0][e].concat()}function r(t){var a=e("#choose_to_buy"),s="icon icon-arrow-a",i="icon icon-arrow-b";t?(a.find(".icon").removeClass().addClass(s),a.addClass("active")):(a.find(".icon").removeClass().addClass(i),a.removeClass("active"))}function l(){var e=i.nav.big,t=i.nav.small,a="",s=i.getBuyZhuListTitle();if(!(i.G_CHOOSE.zhushu<0)){for(var n=i.G_CHOOSE.codes[0].length-1;n>=0;n--)i.G_CHOOSE.codes[0][n]=i.G_CHOOSE.codes[0][n].sort(function(e,t){return e-t});for(var o in i.G_BUY.codes)i.G_BUY.codes[o].key==i.G_MODIFY_CODE_OBJ.codeKey&&(i.G_BUY.codes[o].value=i.G_CHOOSE.codes[0]);a+='<div class="br-zhu-item clearfix" databit="'+i.G_MODIFY_CODE_OBJ.codeKey+'"><b>['+s+']</b><div class="list">',"cgtz"===t&&(a+='<span data-c="0">'+i.G_CHOOSE.codes[0][0].join("")+"</span>","zx"===e&&(i.G_CHOOSE.codes[0][1].length>0&&(a+='<span data-c="0">'+i.G_CHOOSE.codes[0][1].join("")+"</span>"),i.G_CHOOSE.codes[0][1].length>0&&(a+='<span data-c="0">'+i.G_CHOOSE.codes[0][2].join("")+"</span>"))),"hz"===t&&(a+='<span data-c="0">'+i.G_CHOOSE.codes[0][0].join(" ")+"</span>"),"dt"===t&&(a+='<span data-c="0">('+i.G_CHOOSE.codes[0][0].join("")+")</span>",a+='<span data-c="0">'+i.G_CHOOSE.codes[0][1].join("")+"</span>"),a+='</div><div class="pull-right"><b><i class="money" data-m="1">'+i.G_CHOOSE.money+'</i>元</b><a href="javascript:;" class="br-zhu-set">修改</a><a href="javascript:;" class="br-zhu-del">删除</a></div></div>',i.G_MODIFY_CODE_OBJ.codeObj.replaceWith(a)}}function c(){switch(e("#buy_type").find(".icon-y2").removeClass("icon-y2"),e("#buy_type").find(".icon").each(function(t,a){e(this).parents('a[data-toggle="tab"]').attr("data-buytype")==i.G_BUY.buyType&&e(this).addClass("icon-y2")}),e("#buy_type").siblings(".tab-content").find(".tab-pane").each(function(t,a){t==i.G_BUY.buyType-1?e(this).addClass("active"):e(this).removeClass("active")}),i.G_BUY.trackData.issueMutipleMap={},e("#buy_mutiple_span").show(),i.G_BUY.partnerBuy.projectTitle=i.G_BUY.lotyCNName+"合买方案",i.G_BUY.partnerBuy.projectDescription=i.G_BUY.lotyCNName,i.G_BUY.mutiple=1,e("#project_mutiple").val(i.G_BUY.mutiple),i.G_BUY.buyType){case 1:e("#part_buy").val(1),e("#track_desc").addClass("hide"),_();break;case 2:e("#part_buy").val(1),e("#buy_mutiple_span").hide(),e("#track_desc").removeClass("hide"),b(10),_();break;case 3:_(),e("#track_desc").addClass("hide"),e("#share-num").val(i.G_BUY.money),h()}}function p(t,a,s,n,o,u,r){var l=i.G_BUY,c=r*a||0,p=(s+r)*a||0;0===t&&(a=0),l.partnerBuy.shareNum=t,l.partnerBuy.partBuyNum=s,l.partnerBuy.unitPrice=a,l.partnerBuy.commissionPercent=parseInt(e("#commission_percent").val()),l.partnerBuy.partAegisNum=r,e("#share-num").val(t),e(".j-unit-price").html(a),e("#part_buy").val(s),e("#part_buy_percent").html(o),e("#part_aegis_num").val(r),e("#part_aegis_percent").html(u),e("#buy_money_tips").html(s*a),e("#aegis_money_tips").html(c),e("#total_money_tips").html(p)}function h(){var t=i.G_BUY.money,a=e("#share-num").val()||t,s="",n="",o=e("#part_buy").val(),u="",r=1*e("#commission_percent").val()||0,l="",c="",h=parseInt(e("#part_aegis_num").val())||0,d=e("#has_part_aegis")[0].checked||!1;return a=Number(a.replace(/[^0-9]/g,"")),o=Number(o.replace(/[^0-9]/g,"")),i.G_BUY.hemaiTotalMoney!==t&&(i.G_BUY.hemaiTotalMoney=t,a=t),0>=t?void p(0,r,0,0,0,0,0):(t%a===0?s=t/a:(s=1,a=t),0>=o&&(o=1),o>a&&(o=a),r>o/a*100&&(o=Math.ceil(a*r*.01)),n=o*s,e("#has_part_aegis")[0]&&(d=e("#has_part_aegis")[0].checked),d?(e("#part_aegis_num")[0].disabled=!1,l=0===h?.8>o/a?Math.ceil(.2*a):a-o:a>h+o?.2>h/a?Math.ceil(.2*a)+o>a?a-o:Math.ceil(.2*a):h:a-o,c=(l/a*100).toFixed(2)):(e("#part_aegis_num")[0].disabled=!0,l=0,c="0.00"),u=0===t?0:(o/a*100).toFixed(2),void p(a,s,o,r,u,c,l))}function d(){var e="",t="",a="",s="",n="",o="",u=i.nav.big,r=i.nav.small,l=0;if(i.G_CHOOSE.zhushu=0,i.G_CHOOSE.money=0,0!==i.G_CHOOSE.codes.length){if("dt"===r?(n=i.G_CHOOSE.codes[0][0]||[],o=i.G_CHOOSE.codes[0][1]||[]):s=i.G_CHOOSE.codes[0][0]||[],"zx"===u&&"cgtz"===r)for(var c=0,p=i.G_CHOOSE.codes.length;p>c;c++)e=i.G_CHOOSE.codes[c][0]||[],t=i.G_CHOOSE.codes[c][1]||[],a=i.G_CHOOSE.codes[c][2]||[],e.length>0&&t.length>0&&a.length>0&&(l=i.getZhiXuanZhushu(e,t,a));"zx6"===u&&"cgtz"===r&&(l=i.getZuXuan6NormalZhushu(s)),"zx3"===u&&"cgtz"===r&&(l=i.getZuXuan3NormalZhushu(s)),"zx"===u&&"hz"===r&&(l=i.getZhiXuanHeZhiZhushu(s)),"zx3"===u&&"hz"===r&&(l=i.getZuXuan3HeZhiZhushu(s)),"zx6"===u&&"hz"===r&&(l=i.getZuXuan6HeZhiZhushu(s)),"zx3"===u&&"dt"===r&&(l=i.getZuXuan3DanTuoZhushu(n,o)),"zx6"===u&&"dt"===r&&(l=i.getZuXuan6DanTuoZhushu(n,o)),i.G_CHOOSE.zhushu+=l,i.G_CHOOSE.money+=2*l,m()}}function m(){i.G_CHOOSE.zhushu>0?(r(!0),i.chooseBuyBtn.removeAttr("disabled")):(r(!1),i.chooseBuyBtn.attr("disabled","disabled")),i.choose_zhushu.html(i.G_CHOOSE.zhushu),i.choose_money.html(i.G_CHOOSE.money)}function _(){var a=0;if(e("#code_list .money").each(function(s,i){var n=Number(t.escape(e.trim(e(this).html())));t.isNumber(n)&&(a+=n)}),a/=2,i.G_BUY.zhushu=a,i.G_BUY.money=2*a*i.G_BUY.mutiple,e("#buy_zhushu").html(i.G_BUY.zhushu),e("#project_price").html(i.G_BUY.money),e("#track_issue_num").html(0),e("#track_money").html(0),Object.size(i.G_BUY.trackData.issueMutipleMap)>0){var s=0;i.G_BUY.money=0;for(var n in i.G_BUY.trackData.issueMutipleMap){s++;var o=2*a*i.G_BUY.trackData.issueMutipleMap[n].mutiple;i.G_BUY.money+=o,e(".br-details").find("tbody .br-zhui-c").each(function(t,a){return e(this).attr("data-qihaoid")==n?void e(this).parents("tr").find(".j-money").html(o):void 0})}e("#track_issue_num").html(s),e("#track_money").html(i.G_BUY.money)}i.G_BUY.money>0?e("#buy-submit").removeAttr("disabled"):e("#buy-submit").attr("disabled","disabled")}function y(t){i.ballAear.find(".j-num-group a").removeClass("active");var a={};for(var s in i.G_BUY.codes)if(i.G_BUY.codes[s].key==t){a=i.G_BUY.codes[s].value.concat();break}i.G_CHOOSE.init(),i.G_CHOOSE.codes[0]=a;for(var n=i.ballAear.find(".j-row-code"),o=0;o<a.length;o++){var u=a[o],r=u.length;n.each(function(t,a){if(t==o)for(var s=0;r>s;s++)e(this).find(".j-num-group a").each(function(t){parseInt(e(this).html())==u[s]&&e(this).addClass("active")})})}d()}function b(t){var a="";e(".br-details thead .br-zhui-bei").val(1),e.ajax({url:"/lottery/digital/query-track-issue/"+i.G_BUY.lotyName+"?num="+t,type:"GET",dataType:"json"}).done(function(t){if(1e5==t.retCode)for(var s=0;s<t.retData.length;s++){var n=s+1,o=2*i.G_BUY.zhushu;i.G_BUY.trackData.issueMutipleMap[t.retData[s].id]={qihao:t.retData[s].qihao,mutiple:1},a+="<tr><td>"+n+'</td><td><input type="checkbox" class="br-zhui-c" data-qihaoid="'+t.retData[s].id+'"data-qi="'+t.retData[s].qihao+'" checked="">'+t.retData[s].qihao+'期</td><td><input type="text" class="br-input br-zhui-bei" value="1">倍</td><td><span class="j-money">'+o+"</span>元</td><td>"+t.retData[s].awardTime.slice(0,10)+'<span class="ml15">'+t.retData[s].awardTime.slice(10)+"</span></td></tr>"}else a='<tr><td colspan="5">系统繁忙， 请稍候再试</td></tr>';e("#track_issue_list").html(a),_()}).fail(function(){a='<tr><td colspan="5">系统繁忙， 请稍候再试</td></tr>',e("#track_issue_list").html(a)})}function v(){e("#buy_bet_num_proxy").html(i.G_BUY.proxyBuy.betNum),e("#buy_multiple_proxy").html(i.G_BUY.proxyBuy.multiple),e("#buy_issue_num_proxy").html(i.G_BUY.proxyBuy.issueSize),i.G_BUY.money=2*i.G_BUY.proxyBuy.betNum*i.G_BUY.proxyBuy.multiple*i.G_BUY.proxyBuy.issueSize,i.G_BUY.mutiple=i.G_BUY.proxyBuy.multiple,e("#buy_money_proxy").html(i.G_BUY.money),i.G_BUY.money>0?e("#buy_button_proxy").removeAttr("disabled"):e("#buy_button_proxy").attr("disabled","disabled")}function B(){var e=[],t=[],a=[],s=[],n=i.nav.small,o=i.nav.big,u=null,r=!0;if("cgtz"===n&&"zx"!==o&&(r=!1),"hz"===n&&(r=!1),r){for(var l=0;l<i.G_BUY.codes.length;l++){t=[];for(var c=0;c<i.G_BUY.codes[l].value.length;c++)t.push(i.G_BUY.codes[l].value[c].join(""));e.push(t.join(","))}u=e.join("$")}else{for(var l=i.G_BUY.codes.length-1;l>=0;l--)e.push(i.G_BUY.codes[l].value[0].join(","));u=e.join("$")}if("dt"===n){for(var l=i.G_BUY.codes.length-1;l>=0;l--)a=[],a.push(i.G_BUY.codes[l].value[0].join(",")),a.push(i.G_BUY.codes[l].value[1].join(",")),s.push(a.join("@"));u=s.join("$")}return u}function G(){var t="",a=B(),n="",o=[];if(i.G_BUY.payMoney=i.G_BUY.money,i.isAgreen===!1)return void s.showTips("请先阅读并同意《委托投注规则》后才能继续");var u={zhushu:i.G_BUY.zhushu,beishu:i.G_BUY.mutiple,codes:a,unikey:(new Date).valueOf()};switch(i.G_BUY.buyType){case 1:t="/lottery/digital/buy-self/"+i.G_BUY.lotyName+"/"+i.playName,u.qihaoId=i.G_BUY.qihaoId,u.qihao=i.G_BUY.qihao,n=f(1,i.G_BUY.lotyCNName,u.qihao,i.G_BUY.zhushu,i.G_BUY.mutiple,i.G_BUY.money,0,0,0,0);break;case 2:t="/lottery/digital/buy-track/"+i.G_BUY.lotyName+"/"+i.playName;for(var r in i.G_BUY.trackData.issueMutipleMap)o.push(r+"|"+i.G_BUY.trackData.issueMutipleMap[r].qihao+"|"+i.G_BUY.trackData.issueMutipleMap[r].mutiple);if(o.length<1)return void s.showTips("追号最少购买一期");e("#is_end_zhongjiang")[0].checked&&(i.G_BUY.trackData.trackStopMoney=e("#track_stop_money").val()),u.endminmoney=i.G_BUY.trackData.trackStopMoney,u.zhuihaoqihao=o,n=f(2,i.G_BUY.lotyCNName,0,0,0,0,0,0,o.length,i.G_BUY.money);break;case 3:if(t="/lottery/digital/buy-together/"+i.G_BUY.lotyName+"/"+i.playName,u.qihaoId=i.G_BUY.qihaoId,u.qihao=i.G_BUY.qihao,u.title=i.G_BUY.partnerBuy.projectTitle,u.textarea=i.G_BUY.partnerBuy.projectDescription,u.shareNum=i.G_BUY.partnerBuy.shareNum,u.buyNum=i.G_BUY.partnerBuy.partBuyNum,u.aegisNum=i.G_BUY.partnerBuy.partAegisNum,u.extraPercent=i.G_BUY.partnerBuy.commissionPercent,u.set=i.G_BUY.partnerBuy.shareLevel,u.buyNum<1)return void s.showTips("合买至少认购1份");var l=i.G_BUY.partnerBuy.unitPrice*u.buyNum,c=i.G_BUY.partnerBuy.unitPrice*u.aegisNum;i.G_BUY.payMoney=l+c,n=f(3,i.G_BUY.lotyCNName,u.qihao,u.zhushu,u.beishu,i.G_BUY.money,u.buyNum,u.aegisNum,0,0,i.G_BUY.payMoney);break;case 4:t="/lottery/digital/buy-rank/"+i.G_BUY.lotyName+"/"+i.playName,u.zhushu=i.G_BUY.proxyBuy.betNum,u.beishu=i.G_BUY.proxyBuy.multiple,u.qishu=i.G_BUY.proxyBuy.issueSize,i.G_BUY.payMoney=i.G_BUY.money=u.zhushu*u.beishu*u.qishu*2,n=f(2,i.G_BUY.lotyCNName,0,0,0,0,0,0,u.qishu,i.G_BUY.money)}var p="";switch(i.G_BUY.buyType){case 1:p+="<p>"+i.G_BUY.lotyCNName+' 第<span class="fc-3 mlr5">'+u.qihao+"</span>期</p>",p+='<p>共<span class="fc-3 mlr5">'+u.zhushu+'</span>注, 投注<span class="fc-3 mlr5">'+u.beishu+"</span>倍</p>";break;case 2:p+='<p>追号<span class="fc-3 mlr5">'+o.length+"</span>期</p>";break;case 3:p+="<p>"+i.G_BUY.lotyCNName+' 第<span class="fc-3 mlr5">'+u.qihao+"</span>期</p>",p+='<p>方案总金额<span class="fc-3 mlr5">'+i.G_BUY.money+".00</span>元</p>",p+='<p>您认购<span class="fc-3 mlr5">'+u.buyNum+'</span>份, 保底<span class="fc-3 mlr5">'+u.aegisNum+"</span>份</p>";break;case 4:p+='<p>多期投注：共<span class="fc-3 mlr5">'+u.zhushu+'</span>注，<span class="fc-3 mlr5">'+u.beishu+'</span>倍，<span class="fc-3 mlr5">'+u.qishu+"</span>期</p>"}p+='<p>本次需支付：<span class="fc-3 mlr5">'+i.G_BUY.payMoney+".00</span>元",s.checkLogin(i.G_BUY.payMoney,{enoughMoney:function(){s.showTips({html:n,title:"投注确认"}),e("#buyConfirm").one("click",function(a){e.ajax({url:t,type:"POST",dataType:"json",data:u}).done(function(e){return 1e5!==e.retCode?void s.handRetCode(e.retCode,e.retMsg):void U(e.retCode,e.retMsg,e.retData.projectNo,e.retData.trackId,i.G_BUY.payMoney,i.G_BUY.lotyName,i.G_BUY.lotyCNName)}).fail(function(){C(i.G_BUY.lotyName,i.G_BUY.lotyCNName)})})},lessMoneyTips:p})}function f(e,t,a,s,i,n,o,u,r,l,c){var p='<div class="frbox"><img src="'+staticHostURI+'/front_images/fail.png" alt="success" class="icon"><div class="text">';switch(e){case 1:p+="<p>"+t+" 第<span>"+a+"</span>期</p>\r\n                <p>共<span>"+s+"</span>注, 投注<span>"+i+'</span>倍</p>\r\n                <p>本次需支付<span class="fc-3">'+n.toFixed(2)+"</span>元</p>";break;case 2:p+="<p>追号<span>"+r+'</span>期</p>\r\n                <p>本次需支付<span class="fc-3">'+l+"</span>元</p>";case 4:break;case 3:p+=u>0?"<p>"+t+" 第<span>"+a+'</span>期</p>\r\n                  <p>方案总金额<span class="fc-3">'+n.toFixed(2)+"</span>元</p>\r\n                  <p>您认购<span>"+o+"</span>份, 保底<span>"+u+'</span>份</p>\r\n                  <p>共需支付<span class="fc-3">'+c.toFixed(2)+"</span>元</p>":"<p>"+t+" 第<span>"+a+'</span>期</p>\r\n                  <p>方案总金额<span class="fc-3">'+n.toFixed(2)+"</span>元</p>\r\n                  <p>您认购<span>"+o+'</span>份</p>\r\n                  <p>共需支付<span class="fc-3">'+c.toFixed(2)+"</span>元</p>"}return p+='<div class="btns"><button class="btn btn-danger" id="buyConfirm">确定</button><button class="btn btn-gray" data-dismiss="modal">取消</button></div></div></div>'}function g(){"up"===i.nav.small?i.chooseBuyBtn.attr("data-add","2"):i.chooseBuyBtn.attr("data-add","1"),r(!1),i.chooseBuyBtn.attr("disabled","disabled"),i.ballAear.find(".j-num-group a").removeClass("active"),e("#choose_to_buy_tip").html("添加到投注列表")}function Y(){g(),e("#sd_number").val(""),e("#buy-submit").attr("disabled","disabled"),e("#code_list").html(""),e("#sd-list").html(""),e("#project_mutiple").val(1),i.choose_zhushu.html(0),i.choose_money.html(0),i.G_CHOOSE.init(),d(),i.G_BUY.buyType=1,i.G_BUY.init(),_(),h()}function U(e,t,i,n,o,u,r){1e5==e?(a.set("lotyName",u),a.set("lotyCNName",r),a.set("payMoney",o),a.set("projectNo",i),a.set("trackId",n),window.location.href="/html/lottery/trade/success.html"):s.handRetCode(e,t)}function C(e,t){a.set("lotyName",e),a.set("lotyCNName",t),window.location.href="/html/lottery/trade/fail.html"}i.init({G_BUY:{lotyName:"",lotyCNName:"福彩3D",codes:[],zhushu:0,mutiple:1,money:0,payMoney:0,qihaoId:0,isManual:!1,qihao:0,partnerBuy:{projectTitle:"福彩3D合买方案",projectDescription:"福彩3D",shareNum:0,partBuyNum:0,partAegisNum:0,commissionPercent:0,unitPrice:0,shareLevel:1},rowIndex:0,buyType:1,trackData:{issueMutipleMap:{},trackStopMoney:0},proxyBuy:{betNum:2,mutiple:1,issueSize:10},init:function(){this.lotyName=e("#lotyName").val(),this.playName=e("#playName").val(),this.codes=[],this.zhushu=0,this.mutiple=1,this.money=0,this.isManual=!1,this.qihaoId=e("#qihaoId").val(),this.qihao=e("#qihao").val(),this.partnerBuy={projectTitle:"福彩3D合买方案",projectDescription:"福彩3D",shareNum:0,partBuyNum:0,partAegisNum:0,commissionPercent:0,unitPrice:0,shareLevel:1},this.rowIndex=0,this.proxyBuy={betNum:2,multiple:1,issueSize:10}}},G_CHOOSE:{codes:[],zhushu:0,money:0,init:function(){this.codes=[],this.zhushu=0,this.money=0}},G_MODIFY_CODE_OBJ:{codeKey:-1,codeObj:{}},chooseBuyBtn:e("#choose_to_buy"),choose_zhushu:e("#choose_zhushu"),choose_money:e("#choose_money"),ballAear:e(".box-zx-cgtz .j_normal_choose_code"),addMoney:0,playName:10}),i.nav=function(){var e={big:"zx",small:"cgtz",bigEl:null,smallEl:null,zx:["cgtz","hz","up","many"],zx6:["cgtz","hz","dt","up"],zx3:["cgtz","hz","dt","up"],init:function(e){var t=this;for(var a in e)e.hasOwnProperty(a)&&(t[a]=e[a])},reset:function(){var e=this;e.big="zx",e.small="cgtz",e.toggleTabs()},toggleTabs:function(){var e=this,a=t.indexOf(e[e.big],e.small),s="active";0>a&&(e.small="cgtz"),e.bigEl.find("a.active").removeClass(s),e.bigEl.find("a[data-type="+e.big+"]").addClass(s),e.smallEl.find("li.active").removeClass(s),e.smallEl.find("a[data-stype="+e.small+"]").parents("li").addClass(s),e.content.removeClass().addClass("j-box-"+e.big),e.main.removeClass().addClass("j-box-"+e.small)}};return e}(),n(),e("#j-touzhu-tips").on("click",function(t){e(this).toggleClass("active"),e("#j-touzhu-tipstext").toggle()}),e("#j-hd-nav").on("click","a",function(a){var n=e(this).attr("data-type");n&&(n=t.escape(n),i.G_BUY.codes.length>=1?s.showTips({title:"友情提示",text:"切换玩法将会清空您的号码",type:2,onConfirm:function(){e("#myModal").modal("hide"),e(".br-details").find("tbody .br-zhui-c").each(function(e,t){_this.parents("tr").find(".j-money").html(0)}),i.nav.big=n,o()}}):(i.nav.big=n,o()))}),e("#j-nav").on("click","a",function(a){{var n=e(this),u=t.escape(n.attr("data-stype"));n.parents("li")}i.G_BUY.codes.length>=1?s.showTips({title:"友情提示",text:"切换玩法将会清空您的号码",type:2,onConfirm:function(){e("#myModal").modal("hide"),e(".br-details").find("tbody .br-zhui-c").each(function(t,a){e(this).parents("tr").find(".j-money").html(0)}),i.nav.small=u,o(),"many"===u&&(i.G_BUY.buyType=4)}}):(i.nav.small=u,o()),"many"===u&&(i.G_BUY.buyType=4)}),e(".j-num-group").on("click","a",function(a){a.preventDefault();var n=e(this).parents(".j-row-code"),o=parseInt(n.attr("data-bit")),r=null,l=parseInt(s.filterStr(e(this).html())),c=e(this).hasClass("active"),p=i.nav.small,h=i.nav.big,m=null,_=n.attr("data-dt")||!1,y=null,b=1===o?0:1;if(r=u(o),m=i.G_CHOOSE.codes[0][o].length+1,"dt"===p&&_){if("zx3"===h&&m>1&&!c)return void s.showTips("最多只能选择1个胆码");if("zx6"===h&&m>2&&!c)return void s.showTips("最多只能选择2个胆码")}"dt"===p?(y=u(b),c?t.pull(r,l):(r.push(l),t.pull(y,l)),i.G_CHOOSE.codes[0][o]=r,i.G_CHOOSE.codes[0][o].sort(),i.G_CHOOSE.codes[0][b]=y,i.G_CHOOSE.codes[0][b]=y,e(this).toggleClass("active"),e(this).hasClass("active")&&n.siblings(".j-row-code").find("[data-num="+l+"]").removeClass("active")):(c?t.pull(r,l):r.push(l),i.G_CHOOSE.codes[0][o]=r,i.G_CHOOSE.codes[0][o].sort(),e(this).toggleClass("active")),d()}),e(".j-quick-method").on("click","span",function(a){var n=e(this).attr("data-type")||null,o=e(this).parents(".j-row-code"),u=parseInt(o.attr("data-bit")),r=null,l="dt"===i.nav.small,c=1===u?0:1,p=o.siblings(".j-row-code").find(".j-num-group a");return"undefined"==typeof i.G_CHOOSE.codes[0]&&(i.G_CHOOSE.codes[0]=[]),i.G_CHOOSE.codes[0][u]=[],n?(o.find(".j-num-group a").removeClass("active"),o.find(".j-num-group a").each(function(a){switch(r=parseInt(s.filterStr(e(this).html())),n){case"odd":a%2!=0&&(e(this).addClass("active"),i.G_CHOOSE.codes[0][u].push(r),l&&(p.eq(a).removeClass("active"),t.pull(i.G_CHOOSE.codes[0][c],r)));break;case"even":a%2==0&&(e(this).addClass("active"),i.G_CHOOSE.codes[0][u].push(r),l&&(p.eq(a).removeClass("active"),t.pull(i.G_CHOOSE.codes[0][c],r)));break;case"big":a>=5&&(e(this).addClass("active"),i.G_CHOOSE.codes[0][u].push(r),l&&(p.eq(a).removeClass("active"),t.pull(i.G_CHOOSE.codes[0][c],r)));break;case"small":4>=a&&(e(this).addClass("active"),i.G_CHOOSE.codes[0][u].push(r),l&&(p.eq(a).removeClass("active"),t.pull(i.G_CHOOSE.codes[0][c],r)));break;case"all":i.G_CHOOSE.codes[0][u].push(r),e(this).addClass("active"),l&&(p.removeClass("active"),t.pull(i.G_CHOOSE.codes[0][c],r))}}),"clean"===n&&(i.G_CHOOSE.codes[0][u].length=0),d(),void 0):void console.log("error")}),i.chooseBuyBtn.on("click",function(a){if(e(this).hasClass("active")){var n=!1,o=parseInt(i.chooseBuyBtn.attr("data-add")),u=e("#code_list .br-zhu-item").length,c=e("#sd_number").val().replace(/，/gi,",").split("\n"),p="",d=[],m=[],y=!0;switch(o){case 0:if(y=u+i.G_CHOOSE.codes.length-1>i.maxBuyCodeLength)return void s.showTips("您的投注号码多于"+i.maxBuyCodeLength+"行，请返回重新选择");l(),n=!0;break;case 1:if(y=u+i.G_CHOOSE.codes.length>i.maxBuyCodeLength)return void s.showTips("您的投注号码多于"+i.maxBuyCodeLength+"行，请返回重新选择");i.G_CHOOSE.money>0&&(i.addMoney=i.G_CHOOSE.money,n=i.makeChooseCodeHtml(i.G_CHOOSE.codes));break;case 2:if(y=u+c.length>i.maxBuyCodeLength)return void s.showTips("您的投注号码多于"+i.maxBuyCodeLength+"行，请返回重新选择");for(var b=0;b<c.length;b++)i.getIllegalCode(c[b])&&(p=i.getIllegalCode(c[b]),d.push(p),"zx3"===i.nav.big&&(i.addMoney=2*i.getZuXuan3NormalZhushu(p)),"zx6"===i.nav.big&&(i.addMoney=2*i.getZuXuan6NormalZhushu(p)),"zx"===i.nav.big&&(i.addMoney=2*i.getZxZhushu(p)),i.makeChooseCodeHtml([p]),m.push(c[b])),c[b]||t.pull(c,c[b]);for(var b=m.length-1;b>=0;b--)t.pull(c,m[b]);if(e("#sd_number").val(c.join("\n")),0===c.length&&(r(!1),i.chooseBuyBtn.attr("disabled","disabled")),0===d.length){var v="<h5>请按照正确的格式填写：</h5><p>单式：1,2,3</p><p>复式：01,234,35</p>";return"zx"!==i.nav.big&&(v="<h5>请按照正确的格式填写：</h5><p>单式：1,2,3</p><p>复式：0,1,2,3,4,5</p>"),void s.showTips(v)}return _(),i.choose_zhushu.html(0),i.choose_money.html(0),i.G_CHOOSE.init(),void h()}n&&(_(),i.choose_zhushu.html(0),i.choose_money.html(0),i.G_CHOOSE.init(),i.chooseBuyBtn.attr("data-add",1),r(!1),i.chooseBuyBtn.attr("disabled","disabled"),e("#sd_number").val(""),i.ballAear.find(".j-num-group a").removeClass("active"),e("#choose_to_buy_tip").html("添加到投注列表")),h()}}),e(".j-zhu-adds").on("click",function(t){t.preventDefault();var a=parseInt(e(this).attr("data-zhu")),n=null;return i.G_BUY.codes.length+a>i.maxBuyCodeLength?void s.showTips("您的投注号码多于"+i.maxBuyCodeLength+"行，请返回重新选择"):(n=i.produceZhixuanNormalCode(a),i.G_CHOOSE.zhushu=a,i.addMoney=2,i.makeChooseCodeHtml(n,!0),_(),h(),void i.G_CHOOSE.init())}),e(".br-zhu-l").on("click",".br-zhu-item",function(t){t.preventDefault(),i.G_BUY.isManual||"A"!=t.target.tagName&&"up"!==i.nav.small&&(y(e(this).attr("databit")),r(!0))}),e(".br-zhu-l").on("click",".br-zhu-del",function(a){var s=e(this).parents(".br-zhu-item").attr("dataBit");e(this).parents(".br-zhu-item")[0]==i.G_MODIFY_CODE_OBJ.codeObj[0]&&(i.chooseBuyBtn.attr("data-add",1),e("#choose_to_buy_tip").html("添加到投注列表")),t.remove(i.G_BUY.codes,function(e){return e.key==s}),e(this).parents(".br-zhu-item").remove(),_(),h()}),e(".br-zhu-l").on("click",".br-zhu-set",function(t){var a=e(this).parents(".br-zhu-item").attr("databit");y(a),r(!0),i.chooseBuyBtn.attr("data-add",0),e("#choose_to_buy_tip").html("修改投注号码"),i.G_MODIFY_CODE_OBJ={codeKey:a,codeObj:e(this).parents(".br-zhu-item")}}),e("#clean_buy_code").on("click",function(a){e("#code_list").html(""),e("#buy_zhushu").html(0),e("#project_price").html(0),i.G_BUY.init(),_(),i.G_BUY.mutiple=Number(t.escape(e("#project_mutiple").val()))||1,h()}),e("#decrease_mutiple").on("click",function(t){t.preventDefault();var a=e("#project_mutiple"),s=parseInt(a.val());s--,i.G_BUY.mutiple=s<i.minMultiple?i.minMultiple:s>i.maxMultiple?i.maxMultiple:s,a.val(i.G_BUY.mutiple),_(),h()}),e("#project_mutiple").on("change",function(t){t.preventDefault();var a=parseInt(e(this).val())||0;i.G_BUY.mutiple=a<i.minMultiple?i.minMultiple:a>i.maxMultiple?i.maxMultiple:a,e(this).val(i.G_BUY.mutiple),_(),h()}),e("#increase_mutiple").on("click",function(t){t.preventDefault();var a=e("#project_mutiple"),s=parseInt(a.val());s++,i.G_BUY.mutiple=s<i.minMultiple?i.minMultiple:s>i.maxMultiple?i.maxMultiple:s,a.val(i.G_BUY.mutiple),_(),h()}),e("#buy-submit,#buy_button_proxy").on("click",function(t){i.isAgreen=e(this).parents(".br-tou").find(".j-sub-agreed")[0].checked,G()}),e("#buy_type").on("click","a",function(t){t.preventDefault(),i.G_BUY.buyType=parseInt(e(this).attr("data-buytype")),c()}),e("#issue_size").on("change",function(t){t.preventDefault(),i.G_BUY.trackData.issueMutipleMap={},b(e(this).val())}),e(".br-details thead .br-zhui-c").on("change",function(t){var a=e(this)[0].checked;e(this).parents(".br-details").find("tbody .br-zhui-c").each(function(e,t){t.checked=a}),i.G_BUY.trackData.issueMutipleMap={},e(this).parents(".br-details").find("tbody .br-zhui-c").each(function(t,a){a.checked&&(i.G_BUY.trackData.issueMutipleMap[e(this).attr("data-qihaoid")]={qihao:e(this).attr("data-qi"),mutiple:e(this).parents("tr").find(".br-zhui-bei").val()})}),_()}),e(".br-details").on("change","tbody .br-zhui-c",function(t){t.preventDefault(),i.G_BUY.trackData.issueMutipleMap={},e(this).parents(".br-details").find("tbody .br-zhui-c").each(function(t,a){a.checked&&(i.G_BUY.trackData.issueMutipleMap[e(this).attr("data-qihaoid")]={qihao:e(this).attr("data-qi"),mutiple:e(this).parents("tr").find(".br-zhui-bei").val()})}),_()}),e(".br-details thead .br-zhui-bei").on("change",function(t){var a=parseInt(e(this).val())||1;isNaN(a)||1>a?a=1:(a=Math.ceil(a),a>9999&&(a=9999)),e(this).val(a);var s=e(this).parents(".br-details");s.find("tbody .br-zhui-bei").val(a),s.find("tbody .br-zhui-c").each(function(t,a){a.checked="checked",i.G_BUY.trackData.issueMutipleMap[e(this).attr("data-qihaoid")]={qihao:e(this).attr("data-qi"),mutiple:e(this).parents("tr").find(".br-zhui-bei").val()}}),_()}),e(".br-details tbody").on("change",".br-zhui-bei",function(t){var a=parseInt(e(this).val())||1,s=e(this).parents("tr"),n=s.find(".br-zhui-c");isNaN(a)||1>a?a=1:(a=Math.ceil(a),a>9999&&(a=9999)),e(this).val(a),n.attr("checked","checked"),i.G_BUY.trackData.issueMutipleMap[n.attr("data-qihaoid")]={qihao:n.attr("data-qi"),mutiple:s.find(".br-zhui-bei").val()},_()}),e("#share-num").on("change",function(e){h()}),e("#part_buy").on("change",function(e){h()}),e("#commission_percent").on("change",function(t){var a=parseInt(e(this).val())||0,s=Math.floor(e("#part_buy_percent").html());a>s&&(e("#part_buy").val(Math.ceil(e("#commission_percent").val()/100*(e("#share-num").val()||0))),h()),i.G_BUY.partnerBuy.commissionPercent=a}),e("#has_part_aegis").on("change",function(t){e(this)[0].checked?(e("#part_aegis_num").removeAttr("disabled"),h()):(e("#part_aegis_num").attr("disabled","disabled"),e("#part_aegis_num").val(0),e("#part_aegis_percent").html("0.00")),h()}),e("#part_aegis_num").on("change",function(e){h()}),e(".br-set-group").on("click","a",function(t){switch(e(this).parents(".br-set-group").find("a").removeClass("active"),e(this).toggleClass("active"),e(this).html()){case"截止后公开":i.G_BUY.partnerBuy.shareLevel=1;break;case"立即公开":i.G_BUY.partnerBuy.shareLevel=0;break;case"截止前对跟单人公开":i.G_BUY.partnerBuy.shareLevel=2}}),e("#title").on("change",function(t){var a=e(this).val(),s=a.length,n=20;i.G_BUY.partnerBuy.projectTitle=a,s>=n&&(projectDescLength=n,i.G_BUY.partnerBuy.projectTitle=a.substring(0,n),e(this).val(i.G_BUY.partnerBuy.projectTitle)),e("#title_font_size").html(s)}),e("#title").on("keyup",function(t){var a=e(this).val(),s=a.length,n=20;i.G_BUY.partnerBuy.projectTitle=a,s>=n&&(projectDescLength=n,i.G_BUY.partnerBuy.projectTitle=a.substring(0,n),e(this).val(i.G_BUY.partnerBuy.projectTitle)),e("#title_font_size").html(s)}),e("#desc").on("change",function(t){var a=e(this).val(),s=a.length,n=200;i.G_BUY.partnerBuy.projectDescription=a,s>=n&&(s=n,i.G_BUY.partnerBuy.projectDescription=a.substring(0,n),e(this).val(i.G_BUY.partnerBuy.projectDescription)),e("#desc_font_size").html(s)}),e("#desc").on("keyup",function(t){t.preventDefault();var a=e(this).val(),s=a.length;i.G_BUY.partnerBuy.projectDescription=a;var n=200;s>=n&&(s=n,i.G_BUY.partnerBuy.projectDescription=a.substring(0,n),e(this).val(i.G_BUY.partnerBuy.projectDescription)),e("#desc_font_size").html(s)}),e("#is_end_zhongjiang").on("change",function(t){e(this)[0].checked?e("#track_stop_money").removeAttr("disabled"):(e("#track_stop_money").attr("disabled","disabled"),e("#part_aegis_num").val(0))}),e("#track_stop_money").on("change",function(){var t=parseInt(e(this).val())||3e3;e(this).val(t)}),e("#j-textarea-mask").on("click",function(t){e(this).hide(),e("#sd_number").addClass("focus"),e("#sd_number")[0].focus()}),e("#sd_number").on("blur",function(t){t.preventDefault();var a=e.trim(e(this).val());""===a&&(e("#j-textarea-mask").show(),e("#choose_to_buy").removeClass("active"))}),e("#sd_number").on("keyup",function(t){var a=e(this).val().replace(/，/gi,",").split("\n");return 0===a.length?(i.choose_zhushu.html(0),i.choose_money.html(0),r(!1),i.chooseBuyBtn.attr("disabled","disabled"),void s.showTips("请输入投注号码")):(r(!0),i.chooseBuyBtn.removeAttr("disabled"),i.choose_zhushu.html(a.length),i.choose_money.html(2*a.length),void 0)}),e("#decrease_bet_num_proxy").on("click",function(t){t.preventDefault();var a=e("#bet_num_proxy"),s=parseInt(a.val());s--,i.G_BUY.proxyBuy.betNum=s<i.minBetNum?i.minBetNum:s>i.maxBetNum?i.maxBetNum:s,a.val(i.G_BUY.proxyBuy.betNum),v()}),e("#bet_num_proxy").on("change",function(){var t=parseInt(e(this).val())||0;i.G_BUY.proxyBuy.betNum=t<i.minBetNum?i.minBetNum:t>i.maxBetNum?i.maxBetNum:t,e(this).val(i.G_BUY.proxyBuy.betNum),v()}),e("#increase_bet_num_proxy").on("click",function(t){var a=e("#bet_num_proxy"),s=parseInt(a.val());s++,i.G_BUY.proxyBuy.betNum=s<i.minBetNum?i.minBetNum:s>i.maxBetNum?i.maxBetNum:s,a.val(i.G_BUY.proxyBuy.betNum),v()}),e("#decrease_mutiple_proxy").on("click",function(t){var a=e("#mutiple_proxy"),s=parseInt(a.val());s--,i.G_BUY.proxyBuy.multiple=s<i.minMultiple?i.minMultiple:s>i.maxMultiple?i.maxMultiple:s,a.val(i.G_BUY.proxyBuy.multiple),v()}),e("#mutiple_proxy").on("change",function(){var t=parseInt(e(this).val())||0;i.G_BUY.proxyBuy.multiple=t<i.minMultiple?i.minMultiple:t>i.maxMultiple?i.maxMultiple:t,e(this).val(i.G_BUY.proxyBuy.multiple),v()}),e("#increase_mutiple_proxy").on("click",function(t){var a=e("#mutiple_proxy"),s=parseInt(a.val());s++,i.G_BUY.proxyBuy.multiple=s<i.minMultiple?i.minMultiple:s>i.maxMultiple?i.maxMultiple:s,a.val(i.G_BUY.proxyBuy.multiple),v()}),e("#decrease_qihao_num_proxy").on("click",function(t){var a=e("#qihao_num_proxy"),s=parseInt(a.val());s--,i.G_BUY.proxyBuy.issueSize=s<i.minIssueNum?i.minIssueNum:s>i.maxIssueNum?i.maxIssueNum:s,a.val(i.G_BUY.proxyBuy.issueSize),v()}),e("#qihao_num_proxy").on("change",function(){var t=parseInt(e(this).val())||0;i.G_BUY.proxyBuy.issueSize=t<i.minIssueNum?i.minIssueNum:t>i.maxIssueNum?i.maxIssueNum:t,e(this).val(i.G_BUY.proxyBuy.issueSize),v()}),e("#increase_qihao_num_proxy").on("click",function(t){var a=e("#qihao_num_proxy"),s=parseInt(a.val());s++,i.G_BUY.proxyBuy.issueSize=s<i.minIssueNum?i.minIssueNum:s>i.maxIssueNum?i.maxIssueNum:s,a.val(i.G_BUY.proxyBuy.issueSize),v()}),i.G_BUY.hemaiTotalMoney=0});