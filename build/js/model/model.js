define(["jquery","app"],function(t,e){"use strict";var o=function(){function o(t){return this instanceof o?void 0:new o(t)}return o.prototype.init=function(e){for(var o in e)e.hasOwnProperty(o)&&(this[o]=e[o]);var a=this;a.starList.on("click",function(e){e.preventDefault();var o=a.starList.index(this),l=t(this).data("tip");t(this).hasClass("i-collect-star-g")?a.starList.slice(0,o+1).removeClass("i-collect-star-g").addClass("i-collect-star-y"):(0===o?o=1:l=t(this).prev(".i-collect-star-y").data("tip"),a.starList.slice(o,a.starList.length).removeClass("i-collect-star-y").addClass("i-collect-star-g")),t(".star-comment").val(""),a.starLevel=a.starList.filter(".i-collect-star-y").length})},o.prototype.controlStar=function(){var t=this,e="i-collect-star-y",o="i-collect-star-g";0!==t.starLevel?t.starList.slice(0,t.starLevel).removeClass(o).addClass(e):(t.starList.removeClass().addClass(o),t.starList.eq(0).removeClass(o).addClass(e))},o.prototype.setModelModal=function(){var e=this;e.controlStar(),t("#j-modal-id").html(e.modelId).attr("data-modalid",e.modelId),t("#j-star_comment").val(e.starComment),t("#j-model_comment").val(e.modelComment)},o.prototype.resetModelModal=function(){var e=this;e.userId=null,e.starLevel=0,e.starComment="",e.modelComment="",e.controlStar(),t("#j-star_comment").val(e.starComment),t("#j-model_comment").val(e.modelComment)},o.prototype.bindCollectEvent=function(){var o=this;t(".j-collect-show").on("click",function(a){a.preventDefault();var l=t(this).attr("data-modelid"),d=1==t(this).attr("data-modify")?!0:!1;return o.isModify=d,o.modelId=l,e.checkUserLoginStatus()?(t("#j-isModify").addClass("hide"),t("#j-modal-id").html(o.modelId).attr("data-modalid",o.modelId),o.resetModelModal(),o.modal.modal("show"),void(d&&t.ajax({url:"/lottery/trade/get-model-collect-data",type:"get",dataType:"json",data:{model_id:o.modelId}}).done(function(e){var a=e.retData.data;1e5===e.retCode&&(t("#j-isModify").removeClass("hide"),t("#j-collect-date").html(a.create_time),o.userId=a.user_id,o.starLevel=a.star_level,o.starComment=e.retData.star_comment[a.star_level],o.modelComment=a.model_comment,o.setModelModal())}).fail(function(){e.onServiceFail()}))):void e.showLoginBox()}),t("#j-collect-submit").on("click",function(e){var a={model_id:o.modelId,star_level:o.starLevel,star_comment:_.escape(t.trim(t("#j-star_comment").val())),model_comment:_.escape(t.trim(t("#j-model_comment").val()))};o.saveCollect(a)}),t(".j-collect-cancel").on("click",function(e){if(o.userId){var a={model_id:o.modelId,user_id:o.userId,t:t.now()};o.cancelCollect(a)}})},o.prototype.cancelCollect=function(o){var a=this;e.showTips({text:"是否取消该收藏?",type:2,onConfirm:function(){var l=o;t.ajax({url:"/lottery/trade/model-cancel-collect",type:"get",dataType:"json",data:l}).done(function(){a.onCollectCancel(l.model_id)}).fail(function(){e.onServiceFail()})}})},o.prototype.saveCollect=function(o){var a=this;t.ajax({url:"/lottery/trade/model-collect",type:"get",dataType:"json",data:o}).done(function(l){if(1e5===l.retCode){var d=t(".j-collect-show[data-modelid="+o.model_id+"]");d.hasClass("i-collect-star-y")||d.html("修改收藏").attr("data-modify",1),a.modal.on("hidden.bs.modal",function(t){a.isModify&&(l.retMsg="修改成功"),e.showTips({text:l.retMsg,type:1,onConfirm:function(){window.location.reload()}})}),a.modal.modal("hide")}else e.handRetCode(l.retCode,l.retMsg)}).fail(function(){e.onServiceFail()})},o.prototype.onCollectCancel=function(o){var a=this;a.isCollectPage?(t("#track_detail_list tr[data-modelid="+o+"]").remove(),t("#j-collect-table tbody .index").each(function(e,o){t(this).html(e+1)})):t(".j-collect-show[data-modelid="+o+"]").html("收藏").attr("data-modify",0),a.modal.modal("hide"),e.showTips({text:"成功删除该收藏"})},o}(),a=new o;return a});