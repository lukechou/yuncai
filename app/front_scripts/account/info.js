$(function() {

  // 省市联动
//  $("#target").distpicker();

  // Save Info
  $('#infosave').on('click', function() {

    //数据过滤
    var sex = $('input[name=sex]:checked').val()
//    var sheng = $('#info-sheng').val()
//    var shi = $('#info-shi').val()
    var address = $('#address').val();
    var qq = $('#userqq').val();
    var sexStr = ['女','男','保密'];
    if(!qq.match(/[1-9][0-9]{5,9}/)){
      APP.showTips('QQ号码不合法！')
      return;
    }
    var DATA = {
      sex: sex,
      address: address,
//      shi: shi,
      qq: qq,
    };

     $.ajax({
       url: '/account/info/ajax',
       type: 'get',
       dataType: 'json',
       data: DATA,
     })
     .done(function(data) {
    	 console.log("success");
    	 if(data.retCode==100000){
		    $('#saved-sex').html(sexStr[DATA.sex]);
		    $('#saved-address').html(address);
		    $('#saved-qq').html(DATA.qq);
		    $('#info-text1').hide();
		    $('#info-text2').fadeIn();
    	 }else{
    		 console.log(data.retMsg);
    	 }
     })
     .fail(function() {
       console.log("error");
     })
     .always(function() {
       console.log("complete");
     });
  });

  // Back Update User Info
  $('#infoback').on('click', function() {

    $('#info-text1').fadeIn()
    $('#info-text2').hide()

  });

});