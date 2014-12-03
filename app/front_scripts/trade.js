// 拟态框
function showTips(h) {
  $('#tip-content').html(h);
  $('#myModal').modal('show');
}

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


});