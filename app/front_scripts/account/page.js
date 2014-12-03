 $(function() {

   function getNewPages(pages) {
     $.ajax({
         url: '/path/to/file',
         type: 'get',
         dataType: 'json',
         data: pages,
       })
       .done(function(data) {
         console.log("success");
       })
       .fail(function() {
         console.log("error");
       })
       .always(function() {
         console.log("complete");
       });
   }

   $("#j-pages-value").on('keydown', function(event) {

     var pages = event.which;
     var v = $(this).val();

     if (pages == 13) {
       if (isNaN(v) || v == '') {
         alert('请填入要跳转的页数！');
       } else {
         getNewPages(v);
       }
     }

   });

   $("#j-pages-go").on('click', function(event) {

     var v = $('#j-pages-value').val();
     if (isNaN(v) || v == '') {
       alert('请填入要跳转的页数！');
     } else {
       getNewPages(v);
     }

   });



 });