require.config({paths:{jquery:"../lib/jquery",lodash:"../lib/lodash.compat.min",bootstrap:"../lib/bootstrap.min",store:"../lib/store.min",app:"../common/app",PAGE:"../account/newpager"},shim:{bootstrap:{deps:["jquery"],exports:"jquery"},PAGE:{deps:["jquery"],exports:"jquery"}}}),require(["jquery","lodash","app","store","bootstrap","PAGE"],function(t,e,a,i){"use strict";function n(e,i){t("#myModal").on("hidden.bs.modal",function(t){window.location.reload()}),t.ajax({url:"/user/follow/follow",type:"get",dataType:"json",data:e}).done(function(t){1e5==t.retCode?(a.showTips({text:"跟单成功！",type:1,onConfirm:function(){r=!0,window.name="set",window.location.reload()}}),i.parents(".j-dzgd-div").find('input[type="text"]').val("")):a.handRetCode(t.retCode,t.retMsg)}).fail(function(){a.onServiceFail()})}function s(t,e){if(""===t)return t;var a=parseInt(t,10);return isNaN(a)?a=1:(a=a>=1?a:1,a=a),a=a>e?e:a}function o(t,i){var n=1;return e.isNaN(t)&&(a.showTips("请输入整数购买份数"),n=0),(0>=t||a.isDecimal(t))&&(a.showTips("请输入整数购买份数"),n=0),t>i&&(a.showTips("超过最大可购买份额"),n=0),n}function d(){var e=document.referrer,a=e.substr(-18);a&&"/user/follow/index"==a&&(t("#j-nav li").removeClass("active"),t("#j-nav li:nth-child(3)").addClass("active"),t(".j-per-index,j-per-his").hide(),t(".j-per-dzgd").show())}function l(){window.name&&"set"==window.name&&(t("#j-nav li").removeClass("active"),t("#j-nav li:nth-child(3)").addClass("active"),t(".j-per-index,j-per-his").hide(),t(".j-per-dzgd").show()),window.name=""}{var r,c=new pager,p=new pager,h=new pager,g=new pager,u=new pager,m=new pager,f=(new pager,t(".uid").attr("val"));t(".login-uid").attr("val")}c.loadLaunchHemaiList=function(e){c.ajaxUrl="/user/profile/newest-hm-projects/"+f,c.pageElement=t(".j-launch-hemai-page-box"),c.initAjax(e),c.pageTable=t("#j-launch-hemai-table"),c.onSuccess=function(e){var a="",i="",n="";if(1e5==e.retCode){if(e.retData.data.length>0){i=e.retData.data;for(var s=1;s<=i.length;s++)switch(n=i[s-1],n.state){case 0:a+="<tr><td>"+n.lotyPlay+'</td><td class="j-mqi" jmqi="'+n.qihao+'">'+n.qihao+'</td><td class="j-mtotal">'+n.price+"</td><td>"+n.unitPrice+"</td><td>"+n.schedule+'%</td><td><input type="text" class="u-ci j-gou-count" placeholder="剩余'+n.lessNum+'份" data-max="'+n.lessNum+'" maxlength="'+n.lessNum.toString().split("").length+'"/></td><td class="td7"><button class="btn btn-s btn-c1 j-gou-btn" data-type="1" data-one="1.00" data-uri="'+n.joinURI+'" lotyplay="'+n.lotyPlay+'" pid="'+n.id+'">购买</button><a target="_blank" href="'+n.detailURI+'">详情</a></td></tr>';break;case 1:a+="<tr><td>"+n.lotyPlay+'</td><td class="j-mqi" jmqi="'+n.qihao+'">'+n.qihao+'</td><td class="j-mtotal">'+n.price+"</td><td>"+n.unitPrice+"</td><td>"+n.schedule+'%</td><td><span class="miss-tips">已撤单</span></td><td class="td7"><a target="_blank" href="'+n.detailURI+'">详情</a></td></tr>';break;case 2:a+="<tr><td>"+n.lotyPlay+'</td><td class="j-mqi" jmqi="'+n.qihao+'">'+n.qihao+'</td><td class="j-mtotal">'+n.price+"</td><td>"+n.unitPrice+"</td><td>"+n.schedule+'%</td><td><span class="miss-tips">已满员</span></td><td class="td7"><a target="_blank" href="'+n.detailURI+'">详情</a></td></tr>'}}else a='<tr><td colspan="7">当前没有发起合买</td></tr>';c.config.pageNum=Math.ceil(e.retData.size/c.config.pageSize),c.makePageHtml(),c.bindPageEvent(c.loadLaunchHemaiList)}else a='<tr><td colspan="7">'+e.retMsg+"</td></tr>";this.appendTable(a),1e5==e.retCode&&e.retData.size>5&&t("#j-launch-hemai-table tr:last").css({borderBottom:"1px solid #dfdfdf"})}},c.loadLaunchHemaiList({page:1,pageSize:5,pageElement:".j-launch-hemai-page-box"}),p.loadJoinHemaiList=function(e){p.ajaxUrl="/user/profile/newest-join-projects/"+f,p.pageElement=t(".j-join-hemai-page-box"),p.initAjax(e),p.pageTable=t("#j-join-hemai-table"),p.onSuccess=function(e){var a="",i="",n="";if(1e5==e.retCode){if(e.retData.data.length>0){i=e.retData.data;for(var s=1;s<=i.length;s++)switch(n=i[s-1],n.state){case 0:a+="<tr><td>"+n.lotyPlay+'</td><td class="j-mqi" jmqi="'+n.qihao+'"><a href="'+n.user_profile_url+'" target="_blank">'+n.username+'</a></td><td class="j-mtotal">'+n.price+"</td><td>"+n.unitPrice+"</td><td>"+n.schedule+'%</td><td><input type="text" class="u-ci j-gou-count" placeholder="剩余'+n.lessNum+'份" data-max="'+n.lessNum+'" maxlength="'+n.lessNum.toString().split("").length+'"/></td><td class="td7"><button class="btn btn-s btn-c1 j-gou-btn" data-type="1" data-one="1.00" data-uri="'+n.joinURI+'" lotyplay="'+n.lotyPlay+'" pid="'+n.id+'">购买</button><a target="_blank"  href="'+n.detailURI+'">详情</a></td></tr>';break;case 1:a+="<tr><td>"+n.lotyPlay+'</td><td class="j-mqi" jmqi="'+n.qihao+'"><a href="'+n.user_profile_url+'" target="_blank">'+n.username+'</a></td><td class="j-mtotal">'+n.price+"</td><td>"+n.unitPrice+"</td><td>"+n.schedule+'%</td><td><span class="miss-tips">已撤单</span></td><td class="td7"><a target="_blank"  href="'+n.detailURI+'">详情</a></td></tr>';break;case 2:a+="<tr><td>"+n.lotyPlay+'</td><td class="j-mqi" jmqi="'+n.qihao+'"><a href="'+n.user_profile_url+'" target="_blank">'+n.username+'</a></td><td class="j-mtotal">'+n.price+"</td><td>"+n.unitPrice+"</td><td>"+n.schedule+'%</td><td><span class="miss-tips">已满员</span></td><td class="td7"><a target="_blank"  href="'+n.detailURI+'">详情</a></td></tr>'}}else a='<tr><td colspan="7">当前没有参与投注</td></tr>';p.config.pageNum=Math.ceil(e.retData.size/p.config.pageSize),p.makePageHtml(),p.bindPageEvent(p.loadJoinHemaiList)}else a='<tr><td colspan="7">'+e.retMsg+"</td></tr>";this.appendTable(a),1e5==e.retCode&&e.retData.size>5&&t("#j-join-hemai-table tr:last").css({borderBottom:"1px solid #dfdfdf"})}},p.loadJoinHemaiList({page:1,pageSize:5,pageElement:".j-join-hemai-page-box"}),h.loadJoinHemaiList=function(e){h.ajaxUrl="/user/profile/newest-model/"+f,h.pageElement=t(".j-nowbuy-model-page-box"),h.initAjax(e),h.pageTable=t("#j-nowbuy-model-table"),h.onSuccess=function(a){var i="",n="",s="",o=5*(e.page-1)+1;if(1e5==a.retCode){if(a.retData.data.length>0){n=a.retData.data;for(var d=1;d<=n.length;d++,o++)s=n[d-1],i+="<tr><td>"+o+"</td><td>"+s.date_str+"</td><td>"+s.qihao+"</td><td>"+s.modelNo+"</td><td>"+s.money+"</td><td>"+s.status+'</td><td><a target="_blank" href="'+s.detail_url+'">详情</a></td></tr>'}else i='<tr><td colspan="7">无购买模型</td></tr>';h.config.pageNum=Math.ceil(a.retData.size/h.config.pageSize),h.makePageHtml(),h.bindPageEvent(h.loadJoinHemaiList)}else i='<tr><td colspan="7">'+a.retMsg+"</td></tr>";this.appendTable(i),1e5==a.retCode&&a.retData.size>5&&t("#j-nowbuy-model-table tr:last").css({borderBottom:"1px solid #dfdfdf"})}},h.loadJoinHemaiList({page:1,pageSize:5,pageElement:".j-nowbuy-model-page-box"}),g.loadRecentNewsList=function(e){g.ajaxUrl="/user/profile/newest-feed/"+f,g.pageElement=t(".j-recent-news-page-box"),g.initAjax(e),g.pageTable=t("#j-recent-news"),g.onSuccess=function(t){var e="",a="",i="",n='<i class="icon icon-tridown j-show-recent-news"></i>',s='<div class="j-more-recent-news"><table><thead><tr><th class="th1">彩种</th><th class="th2">期次</th><th class="th3">方案总额（元）</th><th class="th4">每份（元）</th><th class="th5">进度</th><th class="th6">认购份数</th><th class="th7">操作</th></tr></thead><tbody class="j-more-recent-news-table"></tbody></table></div>';if(1e5==t.retCode){if(t.retData.data.length>0){a=t.retData.data;for(var o=1;o<=a.length;o++)i=a[o-1],e+=i.show_detail?'<li><p lotyname="'+i.loty_name+'" projectno="'+i.project_no+'">'+i.feed+n+'<span class="date-str">'+i.date_str+"</span></p>"+s+"</li>":"<li><p>"+i.feed+'<span class="date-str">'+i.date_str+"</span></p></li>"}else e="<li><p>无最新动态</p></li>";g.config.pageNum=Math.ceil(t.retData.size/g.config.pageSize),g.makePageHtml(),g.bindPageEvent(g.loadRecentNewsList)}else e="<li><p>"+t.retMsg+"</p></li>";this.appendTable(e)}},g.loadRecentNewsList({page:1,pageSize:5,pageElement:".j-recent-news-page-box"}),u.loadHisShowList=function(e,a,i){u.ajaxUrl="/user/profile/history/"+f,a&&i?(u.pageElement=a,u.pageTable=i,e.pageElement=a.selector):(u.pageElement=t(".j-his-more-page-box"),u.pageTable=t(".j-his-more-table")),u.initAjax(e),u.onSuccess=function(t){var e="",a="",i="";if(1e5==t.retCode){if(t.retData.data.length>0){a=t.retData.data;for(var n=1;n<=a.length;n++)i=a[n-1],e+=i.detail_url?"<tr><td>"+i.create_time+'</td><td><a target="_blank" href="'+i.detail_url+'">'+i.title+"</a></td><td>"+i.type+"</td><td>"+i.project_price+"</td><td>"+i.bonus+"</td><td>"+i.join_num+"</td><td>"+i.state+"</td></tr>":"<tr><td>"+i.create_time+"</td><td></td><td>"+i.type+"</td><td>"+i.project_price+"</td><td>"+i.bonus+"</td><td>"+i.join_num+"</td><td>"+i.state+"</td></tr>"}else e='<tr><td colspan="7">无历史记录</td></tr>';u.config.pageNum=Math.ceil(t.retData.size/u.config.pageSize),u.makePageHtml(),u.bindPageEvent(u.loadHisShowList)}else u.config.pageNum=0,u.makePageHtml(),e='<tr><td colspan="7">'+t.retMsg+"</td></tr>";this.appendTable(e)},u.bindPageEvent=function(e){var a=this,i=a,n=null,s=[];t(a.config.pageElement).find(".next-page").on("click",function(t){n=this,s=u.bindPageEventCommon(i,n),a.config.page<a.config.pageNum&&(a.config.page+=1,e(a.config,s[0],s[1])),s=[]}),t(a.config.pageElement).find(".back-page").on("click",function(t){n=this,s=u.bindPageEventCommon(i,n),a.config.page-=1,a.config.page<=0&&(a.config.page=1),e(a.config,s[0],s[1]),s=[]}),t(a.config.pageElement).find(".j-pages-value").on("change",function(e){var a=t(this).siblings(".j-days").html(),i=parseInt(t(this).val());i=isNaN(i)?1:Math.ceil(i),i>a&&(i=a),1>i&&(i=1),t(this).val(i)}),t(a.config.pageElement).find(".j-pages-go").on("click",function(o){n=this,s=u.bindPageEventCommon(i,n),a.config.page=t(this).siblings(".j-pages-value").val()||1,e(a.config,s[0],s[1]),s=[]})},u.bindPageEventCommon=function(e,a){var i=0,n=null,s=t(a).parents(".j-his-more-tr").attr("lotyname");t(".per-his-table tbody tr.j-his-more-tr").each(function(e,a){var o=t(this).attr("lotyname");o===s&&(i=e,n=a)});var o=t(".per-his-table tbody tr.j-his-more-tr").eq(i).find(".j-his-more-page-box"),d=t(".per-his-table tbody tr.j-his-more-tr").eq(i).find(".j-his-more-table");e.config.page=t(".per-his-table tbody tr.j-his-more-tr").eq(i).find(".j-page").text(),e.config.pageNum=t(".per-his-table tbody tr.j-his-more-tr").eq(i).find(".j-days").text(),e.config.page=parseInt(e.config.page),e.config.pageNum=parseInt(e.config.pageNum),e.config.loty_name=s;var l=t(".per-his-table tbody tr.j-his-more-tr").eq(i).find(".j-check-bonus-record").val();e.config.type=l;var r=[];return r[0]=o,r[1]=d,r}},m.loadFollowUserList=function(e){m.ajaxUrl="/user/follow/follower",m.pageElement=t(".j-user-follow-list-page-box"),m.initAjax(e),m.pageTable=t("#j-user-follow-list-table"),m.onSuccess=function(t){var a="",i="",n="",s=10*(e.page-1)+1;if(1e5==t.retCode){if(t.retData.data.length>0){i=t.retData.data;for(var o=1;o<=i.length;o++,s++)n=i[o-1],a+="<tr><td>"+s+"</td><td>"+n.subscriber+"</td><td>"+e.cnloty_name+"</td><td>"+n.unitPrice+"</td><td>"+n.timing+"</td></tr>"}else a='<tr><td colspan="5">当前没有跟单用户</td></tr>';m.config.pageNum=Math.ceil(t.retData.size/m.config.pageSize),m.makePageHtml(),m.bindPageEvent(m.loadFollowUserList)}else m.config.pageNum=0,m.makePageHtml(),a='<tr><td colspan="5">'+t.retMsg+"</td></tr>";this.appendTable(a)}},t(".j-dingz-num").on("click",function(e){e.preventDefault();var i='<table class="dingz-list-table"><thead><th class="th1">顺序</th><th class="th2">认购人</th><th class="th3">彩种</th><th class="th4">每次认购</th><th class="th5">定制时间</th></thead><tbody id="j-user-follow-list-table"></tbody></table><div class="j-user-follow-list-page-box clearfix"></div>',n=t(this),s=(n.text(),n.parents("tr.dzgd-tr").find(".j-loty-name").text());a.showTips({title:t(".per-name").text()+" 跟单用户列表",text:"合买成功!",className:"follow-user-list",html:i}),m.loadFollowUserList({page:1,pageSize:10,pageElement:".j-user-follow-list-page-box",loty_name:n.parents("td").siblings(".j-loty-name").attr("loty-name"),leader_uid:f,cnloty_name:s})}),t(document).delegate(".j-undo","click",function(e){var i=t(this).parents(".dzgd-tr").find(".j-loty-name").attr("ldr-id"),n={follow_id:i};t.ajax({url:"/user/follow/un-follow",type:"get",dataType:"json",data:n}).done(function(){a.showTips("撤销成功！")}).fail(function(){a.showTips("撤销失败！")})}),t(".j-check-bonus-record").on("change",function(e){e.preventDefault();var a=t(this).val(),i=(t(this).parents("tr.j-his-more-tr"),0),n=null,s=t(this).parents(".j-his-more-tr").attr("lotyname");t(".per-his-table tbody tr.j-his-more-tr").each(function(e,a){var o=t(this).attr("lotyname");o===s&&(i=e,n=a)});var o=t(".per-his-table tbody tr.j-his-more-tr").eq(i).find(".j-his-more-page-box"),d=t(".per-his-table tbody tr.j-his-more-tr").eq(i).find(".j-his-more-table");switch(a){case"查看全部记录":u.loadHisShowList({loty_name:s,page:1,pageSize:5,pageElement:".j-his-more-page-box"},o,d);break;case"1":u.loadHisShowList({loty_name:s,page:1,pageSize:5,pageElement:".j-his-more-page-box",type:1},o,d);break;case"2":u.loadHisShowList({loty_name:s,page:1,pageSize:5,pageElement:".j-his-more-page-box",type:2},o,d)}}),t("#j-recent-news").on("click",".j-show-recent-news",function(e){e.preventDefault();var a=null,i=null;i=t(this).parents("li"),t(this).hasClass("icon-tridown")?(t(this).removeClass("icon-tridown").addClass("icon-triup"),i.find(".j-more-recent-news").show(),a=i.find(".j-more-recent-news-table"),j.loadMoreRecentNews(a)):(t(this).removeClass("icon-triup").addClass("icon-tridown"),i.find(".j-more-recent-news").hide())}),t(".j-his-more-details").click(function(e){var a=t(this).parent("td").parent("tr").next("tr.j-his-more-tr"),i=a.attr("lotyName"),n=t(this),s=(a.find("td").find("div").find("table").find("tbody"),a.find(".j-his-more-page-box")),o=a.find(".j-his-more-table"),d=n.parents(".his-tr").next(".j-his-more-tr").find(".j-check-bonus-record");"展开详情"==n.text()?(n.text("收起"),d.html('<option>查看全部记录</option><option value="1">查看中奖纪录</option><option value="2">查看未开奖记录</option>'),a.css({display:"table-row"}),u.loadHisShowList({loty_name:i,page:1,pageSize:5,pageElement:".j-his-more-page-box"},s,o)):"收起"==n.text()&&(n.text("展开详情"),d.html(),a.css({display:"none"}))}),t(".j-dz-btn").on("click",function(e){e.preventDefault();var a=t(this).parent("td").parent("tr").next("tr.j-dzgd-tr"),i=t(this),n=i.parents(".dzgd-tr").next(".j-dzgd-tr").find(".j-dzgd-choose"),s=a.find(".j-dzgd-gdje-content"),o=a.find(".j-dzgd-bfb-content");"立即定制"==i.text()?(i.text("收起定制设置"),n.html('<span><input type="radio" class="gdje" checked="checked"><label>按固定金额定制跟单</label></span><span><input type="radio" class="bfb"><label>按百分比定制跟单</label></span>'),a.css({display:"table-row"}),s.show(),o.hide()):"收起定制设置"==i.text()&&(i.text("立即定制"),n.html(),a.css({display:"none"}),o.show(),s.hide())}),t(document).delegate(".j-dzgd-choose span","click",function(e){var a=t(this),i=a.find('input[type="radio"]').attr("class");a.siblings("span").find('input[type="radio"]').removeAttr("checked"),a.find('input[type="radio"]').prop("checked",!0);var n=a.parents(".j-dzgd-choose").siblings(".j-dzgd-gdje-content"),s=a.parents(".j-dzgd-choose").siblings(".j-dzgd-bfb-content"),o='<span><input type="radio" checked="checked" class="wux-jiner"><label>&nbsp;无金额上限</label></span><span><input type="radio" class="set-up-jiner"><label>&nbsp;设置金额上限</label><span class="gray-tips">(超过上限时，仅购买上限)</span></span>',d=s.find(".j-jiner-choose"),l=s.find(".j-rengou-jiner"),r=s.find(".j-imme-follow");switch(i){case"gdje":n.show(),d.html(),s.hide();break;case"bfb":s.show(),d.html(o),l.hide(),n.hide(),r.attr("data-type",1)}}),t(document).delegate(".j-jiner-choose span","click",function(e){var a=t(this),i=a.find('input[type="radio"]').attr("class");a.siblings("span").find('input[type="radio"]').removeAttr("checked"),a.find('input[type="radio"]').prop("checked",!0);{var n=a.parents(".j-jiner-choose").next(".j-rengou-jiner"),s=a.parents(".j-jiner-choose").siblings(".ljgd-btn-div").find(".j-imme-follow");a.parents(".j-jiner-choose").siblings(".j-dzcs")}switch(i){case"wux-jiner":n.hide(),s.attr({"data-type":1});break;case"set-up-jiner":n.show(),s.attr({"data-type":2})}}),t(document).delegate(".j-checkbox","click",function(e){e.preventDefault();var a=t(this);a.hasClass("icon-cgou")?a.removeClass("icon-cgou").addClass("icon-cbox"):a.removeClass("icon-cbox").addClass("icon-cgou")}),t("#j-nav").on("click","a",function(e){e.preventDefault();var a=t(this).parents("li"),i=t(this).attr("data-pagetype");switch(a.addClass("active"),a.siblings("li").removeClass("active"),i){case"0":t(".j-per-index").show(),t(".j-per-index").siblings(".j-per-his,.j-per-dzgd,.j-per-model").hide();break;case"1":t(".j-per-his").show(),t(".j-per-his").siblings(".j-per-index,.j-per-dzgd,.j-per-model").hide();break;case"2":t(".j-per-dzgd").show(),t(".j-per-dzgd").siblings(".j-per-index,.j-per-his,.j-per-model").hide();break;case"3":t(".j-per-model").show(),t(".j-per-model").siblings(".j-per-index,.j-per-his,.j-per-dzgd").hide()}}),t(document).delegate(".j-imme-follow","click",function(e){e.preventDefault();var i=t(this),s=i.parents(".j-dzgd-tr").prev(".dzgd-tr").find(".j-loty-name").attr("leader-uid");s=void 0==s?f:s;var o,d,l,r,c,p=i.parents(".j-dzgd-tr").prev(".dzgd-tr").find(".j-loty-name").attr("loty-name"),h={},g=i.parents(".j-dzgd-tr").prev(".dzgd-tr").find(".j-loty-name").attr("ldr-id"),u=i.attr("data-type");if(!i.parents(".ljgd-p1").next(".ljgd-p2").find(".j-checkbox").hasClass("icon-cgou"))return void a.showTips("请先阅读并同意《委托投注规则》后才能继续");switch(u){case"0":if(o=i.parents(".input-div").find(".j-unit-price").val(),d=i.parents(".input-div").find(".j-max-buy-times").val(),!o&&!d)return void a.showTips("每次认购金额和定制次数不能为空");if(!o)return void a.showTips("每次认购金额不能为空");if(!d)return void a.showTips("定制次数不能为空");h={leader_id:s,loty_name:p,unit_price:o,max_buy_times:d,follow_id:g,data_type:u},c='<div class="frbox"><img src="http://static3.yuncai.com/front_images/fail.png" alt="success" class="icon"><div class="text"><p>每次认购金额：<span class="fc-3">'+o+'</span>元</p><p>定制次数：<span class="fc-3">'+d+"</span>次</p><p>确认按以上信息进行跟单吗？</p></div></div>";break;case"1":if(l=i.parents(".input-div").find(".j-unit-percentage").val(),d=i.parents(".input-div").find(".j-max-buy-times").val(),!l&&!d)return void a.showTips("每次认购比例和定制次数不能为空");if(!l)return void a.showTips("每次认购比例不能为空");if(!d)return void a.showTips("定制次数不能为空");h={leader_id:s,loty_name:p,unit_percentage:l,max_buy_times:d,follow_id:g,data_type:u},c='<div class="frbox"><img src="http://static3.yuncai.com/front_images/fail.png" alt="success" class="icon"><div class="text"><p>每次认购比例：<span class="fc-3">'+l+'</span>%</p><p>定制次数：<span class="fc-3">'+d+"</span>次</p><p>确认按以上信息进行跟单吗？</p></div></div>";break;case"2":if(l=i.parents(".input-div").find(".j-unit-percentage").val(),r=i.parents(".input-div").find(".j-max-price").val(),d=i.parents(".input-div").find(".j-max-buy-times").val(),!(l||r||d))return void a.showTips("每次认购比例、认购金额上限、定制次数不能为空");if(l&&!r&&!d)return void a.showTips("认购金额上限、定制次数不能为空");if(r&&!l&&!d)return void a.showTips("每次认购比例、定制次数不能为空");if(d&&!l&&!r)return void a.showTips("每次认购比例、认购金额上限不能为空");if(!l)return void a.showTips("每次认购比例不能为空");if(!r)return void a.showTips("认购金额上限不能为空");if(!d)return void a.showTips("定制次数不能为空");h={leader_id:s,loty_name:p,unit_percentage:l,max_price:r,max_buy_times:d,follow_id:g,data_type:u},c='<div class="frbox"><img src="http://static3.yuncai.com/front_images/fail.png" alt="success" class="icon"><div class="text"><p>每次认购比例：<span class="fc-3">'+l+'</span>%</p><p>认购金额上限：<span class="fc-3">'+r+'</span>元</p><p>定制次数：<span class="fc-3">'+d+"</span></p><p>确认按以上信息进行跟单吗？</p></div></div>"}a.checkLogin(null,{always:function(){a.showTips({text:c,type:2,onConfirm:function(){n(h,i)}})}},!0)}),t(document).delegate(".j-dzgd-gdje-content .j-unit-price","change",function(e){var a=t(this).attr("data-max"),i=t(this).val(),n=s(i,a);n=n>1e5?1e5:n,t(this).val(n)}),t(document).delegate(".j-dzgd-gdje-content .j-unit-price","keyup",function(e){var a=t(this).attr("data-max"),i=t(this).val(),n=s(i,a);n=n>1e5?1e5:n,t(this).val(n)}),t(document).delegate(".j-max-buy-times","change",function(e){var a=t(this).attr("data-max"),i=t(this).val(),n=s(i,a);n=n>999?999:n,t(this).val(n)}),t(document).delegate(".j-max-buy-times","keyup",function(e){var a=t(this).attr("data-max"),i=t(this).val(),n=s(i,a);n=n>999?999:n,t(this).val(n)}),t(document).delegate(".j-dzgd-bfb-content .j-unit-percentage","change",function(e){var a=t(this).attr("data-max"),i=t(this).val(),n=s(i,a);n=n>99?99:n,t(this).val(n)}),t(document).delegate(".j-dzgd-bfb-content .j-unit-percentage","keyup",function(e){var a=t(this).attr("data-max"),i=t(this).val(),n=s(i,a);n=n>99?99:n,t(this).val(n)}),t(document).delegate(".j-dzgd-bfb-content .j-max-price","change",function(e){var a=t(this).attr("data-max"),i=t(this).val(),n=s(i,a);n=n>1e5?1e5:n,t(this).val(n)}),t(document).delegate(".j-dzgd-bfb-content .j-max-price","keyup",function(e){var a=t(this).attr("data-max"),i=t(this).val(),n=s(i,a);n=n>1e5?1e5:n,t(this).val(n)}),t(".j-per-modelmore").click(function(e){t("#j-nav li:nth-child(2)").addClass("active"),t("#j-nav li:nth-child(2)").siblings("li").removeClass("active"),t(".j-per-his").show(),t(".j-per-his").siblings(".j-per-index,.j-per-dzgd,.j-per-model").hide()}),t("#j-launch-hemai-table,#j-join-hemai-table,#j-nowbuy-model-table").on("change",".j-gou-count",function(e){var a=t(this).attr("data-max"),i=t(this).val(),n=s(i,a);t(this).val(n)}),t("#j-launch-hemai-table,#j-join-hemai-table,#j-nowbuy-model-table").on("keyup",".j-gou-count",function(e){var a=t(this).attr("data-max"),i=t(this).val(),n=s(i,a);t(this).val(n)});var j={loadMoreRecentNews:function(e){var i=e.parents(".j-more-recent-news").siblings("p"),n=i.attr("lotyname"),o=i.attr("projectno");t.ajax({url:"/lottery/project-detail/ajax/"+n+"/"+o,type:"get",dataType:"json"}).done(function(a){var i="<tr><td>"+a.lotyPlay+'</td><td class="j-mqi" jmqi="'+a.qihao+'">'+a.qihao+'</td><td class="j-mtotal">'+a.price+"</td><td>"+a.unitPrice+"</td><td>"+a.schedule+'%</td><td><input type="text" class="u-ci j-gou-count" placeholder="剩余'+a.lessNum+'份" data-max="'+a.lessNum+'" maxlength="'+a.lessNum.toString().split("").length+'"/></td><td><button class="btn btn-s btn-c1 j-gou-btn" data-type="1" data-one="1.00" data-uri="'+a.joinURI+'" lotyplay="'+a.lotyPlay+'" pid="'+a.id+'">购买</button><a target="_blank" href="'+a.detailURI+'">详情</a></td></tr>';e.html(i),t(".j-more-recent-news-table").on("change",".j-gou-count",function(e){var a=t(this).attr("data-max"),i=t(this).val(),n=s(i,a);t(this).val(n)}),t(".j-more-recent-news-table").on("keyup",".j-gou-count",function(e){var a=t(this).attr("data-max"),i=t(this).val(),n=s(i,a);t(this).val(n)})}).fail(function(){a.showTips("服务器繁忙,请稍后再试!")})}};t(document).on("click",".j-gou-btn",function(){var i=this,n=t(this).parents("tr"),s=n.find(".j-gou-count"),d=t(this).attr("data-one"),l=Number(s.val()),r=Number(s.attr("data-max")),c={},p={},h="",g="",u=n.find(".j-mtotal").html(),m=n.find(".j-mqi").attr("jmqi"),f="",j={ssq:"双色球",dlt:"大乐透",jczq:"竞彩足球",pl3:"排列3",pl5:"排列5",fc3d:"福彩3D",qlc:"七乐彩",qxc:"七星彩",bjdc:"足球单场"},v=t(this).attr("data-uri"),y=v.split("/"),w=j[y[y.length-2]],x={bqc_gg:"半全场",spf_gg:"胜平负",rqspf_gg:"让球胜平负",zjq_gg:"总进球",bf_gg:"比分",hhtz_gg:"混合投注",zjq:"总进球",bf:"比分",sxds:"上下单双",spf:"胜平负",bqc:"半全场"},_=x[y[y.length-1]]||"";o(l,r)&&(c={byNum:l,joinURI:v,prjctId:t(i).attr("pid"),onSuccess:function(t){r-=l,s.attr({placeholder:"最多"+r,"data-max":r})}},m&&(f="第<span>"+m+"</span>期"),h=e.template('<div class="frbox"><img src="'+staticHostURI+'/front_images/fail.png" alt="success" class="icon"><div class="text"><p><%= lotyName%> '+f+_+'</p><p>方案总金额<span class="fc-3"><%= total %></span></p><p>您认购<span><%= pay %></span>份</p><p>共需支付<span class="fc-3"><%= payMoney %>.00</span>元</p><div class="btns"><button class="btn btn-danger" id="buyConfirm">确定</button><button class="btn btn-gray" data-dismiss="modal">取消</button></div></div></div>'),g=h({lotyName:w,total:u,pay:l,payMoney:l*d}),p={html:g},a.checkLogin(l*d,{enoughMoney:function(){a.showTips(p),t("#buyConfirm").one("click",function(t){b(c)})}}))});var b=function(e){t.ajax({url:e.joinURI,type:"get",dataType:"json",data:{pid:e.prjctId,buyNum:e.byNum,unikey:(new Date).valueOf()}}).done(function(i){1e5==i.retCode?(e.onSuccess&&e.onSuccess(),a.updateUserMoney(),a.showTips({text:"合买成功!",type:1,onConfirm:function(){window.location.reload()}}),t("body").on("click",".close",function(t){window.history.go(0)})):a.handRetCode(i.retCode,i.retMsg)}).fail(function(){a.onServiceFail()})};d(),l()});