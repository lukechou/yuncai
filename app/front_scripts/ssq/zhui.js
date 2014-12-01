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
     $('.j-br-type .icon-y2').removeClass('icon-y2');
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
   $('.br-details').on('click', '.br-zhui-btn', function(event) {

     // Ajax 获取 期数

     // $.ajax({
     //   url: 'http://kp2.yuncai.com/lottery/digital/query-track-issue/dlt',
     //   type: 'get',
     //   dataType: 'json',
     //   data: {num: 10},
     // })
     // .done(function(data) {
     //   console.log(data);
     //   console.log("success");
     // })
     // .fail(function() {
     //   console.log("error");
     // })
     // .always(function() {
     //   console.log("complete");
     // });

     var data = {
       "retCode": 100000,
       "retMsg": "",
       "retData": [{
         "id": "18",
         "qihao": "14140",
         "awardTime": "2014-11-2920:45"
       }, {
         "id": "19",
         "qihao": "14141",
         "awardTime": "2014-12-0120:45"
       }, {
         "id": "20",
         "qihao": "14142",
         "awardTime": "2014-12-0320:45"
       }, {
         "id": "21",
         "qihao": "14143",
         "awardTime": "2014-12-0620:45"
       }, {
         "id": "22",
         "qihao": "14144",
         "awardTime": "2014-12-0820:45"
       }, {
         "id": "23",
         "qihao": "14145",
         "awardTime": "2014-12-1020:45"
       }, {
         "id": "24",
         "qihao": "14146",
         "awardTime": "2014-12-1320:45"
       }, {
         "id": "25",
         "qihao": "14147",
         "awardTime": "2014-12-1520:45"
       }, {
         "id": "26",
         "qihao": "14148",
         "awardTime": "2014-12-1720:45"
       }, {
         "id": "27",
         "qihao": "14149",
         "awardTime": "2014-12-2020:45"
       }]
     };
     if (data) {
       var html = ''
       for (var i = 0; i < data.retData.length; i++) {
         html += '<tr><td>' + i + '</td><td><input type="checkbox" class="br-zhui-c">' + data.retData[i]['qihao'] + '期</td><td><input type="text" class="br-input br-zhui-bei">倍</td><td>10元</td><td>' + data.retData[i]['awardTime'] + '</td></tr>';
       };
       var zhui = $(this).parents('.br-details').find('.br-zhui');
       zhui.find('.br-zhui-list tbody').html(html);
       ZHUI.bindZhuiHaoEvent();
       ZHUI.setZhuiHaoTotal($(this));
     }

   });

   ZHUI.bindHeMaiEvent();
 });