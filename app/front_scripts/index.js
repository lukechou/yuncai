$(function() {

  var SEEDS = {};
  SEEDS.ballNum = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35'];

  SEEDS.ssq = {
    redBall: SEEDS.ballNum.slice(0, 33),
    blueBall: SEEDS.ballNum.slice(0, 16),
    redTotal: 6,
    blueTotal: 1,
  };

  SEEDS.dlt = {
    redBall: SEEDS.ballNum.slice(0, 35),
    blueBall: SEEDS.ballNum.slice(0, 12),
    redTotal: 5,
    blueTotal: 2,
  };

  function getOneZhuHtml(t) {
      var type = 0;
      if (t) {
        type = t
      } else {
        type = $('#j-q-type .active').attr('data-seed')
      }
      var redGroup = _.sample(SEEDS[type].redBall, SEEDS[type].redTotal)
      var blueGroup = _.sample(SEEDS[type].blueBall, SEEDS[type].blueTotal)
      var html = ''
      for (var i = 0; i < redGroup.length; i++) {
        html += '<li>' + redGroup[i] + '</li>'
      };
      for (var i = 0; i < blueGroup.length; i++) {
        html += '<li class="blue">' + blueGroup[i] + '</li>'
      };
      return html;
    }
    //快速投注

  $('.tou-ls')[0].innerHTML = getOneZhuHtml('ssq')
  $('.tou-ls')[1].innerHTML = getOneZhuHtml('dlt')

  $('#j-q-tou').on('click', '.btn-change', function(event) {

    var el = $(this).parents('.tou-hd').find('.tou-ls')
    el.html(getOneZhuHtml())
  });

  //快速投注 投注
  $('#j-q-tou').on('click', '.btn-tou', function(event) {
    debugger
    //
    $.ajax({
        url: '/path/to/file',
        type: 'default GET (Other values: POST)',
        dataType: 'default: Intelligent Guess (Other values: xml, json, script, or html)',
        data: {
          param1: 'value1'
        },
      })
      .done(function() {
        console.log("success");
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });

  });


  //  页面开始 随机产生 Lucky Number
  $('#luckyNum').html(_.sample(SEEDS.ballNum, 1));


  // 截止时间计算
  var Time = {
    hour: $('#endHour'),
    minutes: $('#endMinutes'),
    seconds: $('#endSeconds'),
  }

  function countEndTime() {
    var endTime = new Date('2014-12-04 20:45').getTime()
    var now = new Date().getTime()
    var d = Math.floor((endTime - now) / 1000)
    Time.hour.html(Math.floor(d / 60 / 60))
    Time.minutes.html(Math.floor(d / 60 % 60))
    Time.seconds.html(d % 60)
  }
  countEndTime()
  setInterval(function() {
    countEndTime()
  }, 1000)


  $('#j-tou a').on('click', function(event) {
    if ($(this).attr('data-type') == 1) {
      $('#j-huan-one').fadeIn()
    } else {
      $('#j-huan-one').hide()
    }
  });

  //单场决胜选择
  $('#j-d-tou').on('click', 'li', function(event) {
    $('#j-d-tou li').removeClass('active')
    $(this).addClass('active')
  });
  // 首页 头部轮播
  $("#owl-example").owlCarousel({
    navigation: false,
    slideSpeed: 300,
    paginationSpeed: 400,
    singleItem: true
  });

  //模型跟买轮播
  $("#owl-demo").owlCarousel({
    items: 3,
    navigation: true,
    navigationText: [
      "<i class='icon-chevron-left'></i>", "<i class='icon-chevron-right'></i>"
    ]
  });
});