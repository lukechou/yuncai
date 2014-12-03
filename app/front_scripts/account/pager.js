 $(document).ready(function() {

   var tables = $('.table');
   loadMoneyRecord(30, 0, 0, tables.eq(0).find('tbody'));


   $('#nav-tabs').on("click", ' a', function() {
     var i = parseInt($(this).attr('data-type'))
     loadMoneyRecord(30, i, 0, tables.eq(i).find('tbody'));
   });



   function getPageParams() {
     var t = $('.nav-tabs').find('.active a').attr('data-type');
     var page = {
       type: t,
       days: $('.nearday')[t].value,
       pages: $('.j-pages-value')[t].value,
       maxpage: parseInt($('.j-days')[t].innerHTML),
     };
     return page;
   }

   $('.back-page').on('click', function(event) {
     event.preventDefault();
     var page = getPageParams();
     if (page.pages > 1) {
       page.pages--;
     } else {
       alert('已经是第一页了！！！')
       return;
     }
     $('.j-pages-value')[page.type].value = page.pages;
     loadMoneyRecord(page.days, page.type, page.pages, tables.eq(page.type).find('tbody'));
   });

   $('.next-page').on('click', function(event) {
     event.preventDefault();
     var page = getPageParams();
     if (page.pages < page.maxpage) {
       page.pages++;
     } else {
       alert('已经是最后一页了！！！')
       return;
     }
     $('.j-pages-value')[page.type].value = page.pages;
     loadMoneyRecord(page.days, page.type, page.pages, tables.eq(page.type).find('tbody'));
   });

   $(".j-pages-value").on('keydown', function(event) {

     var pages = event.which;
     var v = $(this).val();

     if (pages == 13) {
       if (isNaN(v) || v == '') {
         alert('请填入要跳转的页数！');
       } else {
         var page = getPageParams();
         loadMoneyRecord(page.days, page.type, page.pages, tables.eq(page.type).find('tbody'));
       }
     }

   });

   $(".j-pages-go").on('click', function(event) {

     var v = $('#j-pages-value').val();
     if (isNaN(v) || v == '') {
       alert('请填入要跳转的页数！');
     } else {
       var page = getPageParams();
       loadMoneyRecord(page.days, page.type, page.pages, tables.eq(page.type).find('tbody'));
     }

   });

   function loadMoneyRecord(num, type, page, innerHtmlObj) {
     var url = window.location.pathname + '/ajax';
     $.ajax({
         url: url,
         type: 'GET',
         dataType: 'json',
         data: {
           type: type,
           days: num,
           page: page,
         },
       })
       .done(function(data) {

         if (data.retCode == 100000) {
           var dataSize = data.retData.data.length;
           var html = "";
           if (dataSize > 0) {

             var detailData = data.retData.data;
             for (var i = 0; i < detailData.length; i++) {
               var projectDetailUrl = '<a href="#">查看详情</a>';
               var continueBuy = '<a href="#">继续投注</a>';
               dataItem = detailData[i];
               html += "<tr><td>" + dataItem.lotyCNName + "</td><td>" + dataItem.createTime + "元</td><td>" + dataItem.money + "</td><td>" + dataItem.status + "</td><td>" + projectDetailUrl + continueBuy + "</td></tr>";
             };
             // 中奖列表才有汇总功能
             if (type == 1) {
               $('#summary_bonus_sum').html(data.retData.summary.bonusSum);
               $('#summary_bonus_size').html(data.retData.summary.bonusSize);
             }

           } else {
             html = "<tr><td colspan='6'>没有数据</td></tr>";
           }
         } else {
           html = "<tr><td colspan='6'>" + data.retMsg + "</td></tr>";
         }
         innerHtmlObj.html(html);
       });

   };

 });