 /****************Bind Other Tabs Toggle Event****************/
 $(function() {

   // Quick, senior toggle
   $('#br-hd-group a').on('click', function(event) {
     event.preventDefault();
     /* Act on the event */
     if ($(this).hasClass('active')) {
       return;
     } else {
       $('#br-hd-group .active').removeClass('active');

       var t = parseInt($(this).attr('data-t'));
       if (t) {
         $('#quick').addClass('hidden');
         $('#senior').removeClass('hidden');
       } else {
         $('#senior').addClass('hidden');
         $('#quick').removeClass('hidden');
       }

       $(this).addClass('active');
       return;
     }
   });

   // br-type icon toggle
   $('.j-br-type a[data-toggle="tab"]').on('click', function(e) {

     var li = $(this).parents('li');
     var qi = $(this).parents('.box-left').find('.j-qi-box');

     if (li.attr('data-buytype') == 2) {
       qi.removeClass('hide');
     } else {
       qi.addClass('hide');
     }

     $(this).parents('.j-br-type').find('.icon-y2').removeClass('icon-y2');
     $(this).find('.icon').addClass('icon-y2');

   });

   // 方案设置
   $('.br-set-group').on('click', '.br-set', function(event) {

     event.preventDefault();
     /* Act on the event */
     $(this).siblings('.active').removeClass('active');
     $(this).addClass('active');

   });

   // 右侧栏选项框
   $('.tab-cut').on('mouseover', 'li', function(event) {
     event.preventDefault();
     /* Act on the event */
     $('#lr_tab li.on').removeClass('on');
     $(this).addClass('on');
     var c = $('#lr_content .tab-con');
     c.hide();
     c.eq($(this).index()).show();
   });


   // 追号模块
   $('.zh_issue_num').on('change', function(event) {
     event.preventDefault();
     ZHUI.getNewHtml($(this));
   });

   $('.br-details').on('click', '.br-zhui-btn', function(event) {
     ZHUI.getNewHtml($(this));
   });

   ZHUI.bindHeMaiEvent();

   // 快捷投注 - 提交请求
   $('#qiuck-sub').on('click', function(event) {
     event.preventDefault();
     var box = $(this).parents('.box-left');
     var params = COMMON.getCommonParams(box);
     debugger;
     $.ajax({
         url: '/lottery/digital/buy-self/' + lotyName + '/' + playName,
         type: 'post',
         dataType: 'json',
         data: params,
       })
       .done(function() {
         COMMON.showTips('投注成功')
         console.log("success");
       })
       .fail(function() {
         COMMON.showTips('失败成功')
         console.log("error");
       })
       .always(function() {
         console.log("complete");
       });
   });

   // 常规投注 - 提交请求
   $('#buy-submit').on('click', function(event) {
     event.preventDefault();
     var box = $(this).parents('.box-left');
     var params = COMMON.getCommonParams(box);

     // 判断购买方式 2追买 3合买
     var buytype = parseInt(box.find('.j-br-type .active').attr('data-buytype'));
     switch (buytype) {
       case 2:

         break;
       case 3:

         params.rengouMoney = box.find('.j-rengou').val()
         params.extraPercent = box.find('.br-select').val()
         params.baodiText = box.find('.j-baodi-text').val()
         params.title = box.find('.j-project-title').val()
         params.textarea = box.find('.br-textarea').val()
         params
         break;
       default:
         break;
     }
     debugger;
     $.ajax({
         url: '/lottery/digital/buy-self/' + lotyName + '/' + playName,
         type: 'post',
         dataType: 'json',
         data: params,
       })
       .done(function() {
         COMMON.showTips('投注成功')
         console.log("success");
       })
       .fail(function() {
         COMMON.showTips('投注失败')
         console.log("error");
       })
       .always(function() {
         console.log("complete");
       });
   });



 });