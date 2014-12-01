$(function() {

  // 省市联动
  $("#target").distpicker();

  // Save Info
  $('#infosave').on('click', function() {

    //数据过滤
    var sex = $('input[name=sex]:checked').val()
    var sheng = $('#info-sheng').val()
    var shi = $('#info-shi').val()
    var qq = $('#userqq').val()
    var sexStr = ['男','女','保密']

    var DATA = {
      sex: sex,
      sheng: sheng,
      shi: shi,
      qq: qq,
    };

    console.log(DATA.sex, DATA.sheng, DATA.shi, DATA.qq);

    // $.ajax({
    //   url: '/path/to/file',
    //   type: 'default GET (Other values: POST)',
    //   dataType: 'default: Intelligent Guess (Other values: xml, json, script, or html)',
    //   data: DATA,
    // })
    // .done(function() {
    //   console.log("success");
    // })
    // .fail(function() {
    //   console.log("error");
    // })
    // .always(function() {
    //   console.log("complete");
    // });

    // Ajax Success
    $('#saved-sex').html(sexStr[DATA.sex])
    $('#saved-address').html(DATA.sheng + ' ' + DATA.shi)
    $('#saved-qq').html(DATA.qq)

    $('#info-text1').hide()
    $('#info-text2').fadeIn()

  });

  // Back Update User Info
  $('#infoback').on('click', function() {

    $('#info-text1').fadeIn()
    $('#info-text2').hide()

  });

});