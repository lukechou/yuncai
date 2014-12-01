$(function() {

  $('#br-type a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
    $('#br-type .icon-y2').removeClass('icon-y2');
    $(this).find('.icon').addClass('icon-y2');
  });

  $('.m-num-group').on('click', 'a', function(event) {
    event.preventDefault();
    /* Act on the event */
    $(this).toggleClass('active');
  });

  $('.m-num-group').on('click', '.m-num-clean', function(event) {
    event.preventDefault();
    /* Act on the event */
    $(this).parents('.m-num-group').find('a.active').removeClass('active');
  });

  // Brings-count-item Module
  $('.br-count-item').on('click', '.j-count', function(event) {
    event.preventDefault();
    /* Act on the event */
    var m = $(this).siblings('.btn-results'),
      c = $(this).attr('data-c'),
      r = m.attr('data-r');
    updateCount(m, c, r);
  });

  $('.br-count-item .btn-results').on('change', function(event) {
    event.preventDefault();
    /* Act on the event */
    var r = $(this).attr('data-r');
    updateCountResults(r);
  });

  function updateCount(m, c, r) {
    var v = parseInt(m.val());
    if (c == 1) {
      v++;
    } else {
      v--;
    }
    v = (v && v >= 1) ? v : 1;
    m.val(v);
    updateCountResults(r);
  }

  function updateCountResults(r) {
    alert('Update View Results!');
  }



});