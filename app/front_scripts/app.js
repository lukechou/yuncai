$(function() {

  // 选择彩种
  $('#choseCai').hover(function() {
    /* Stuff to do when the mouse enters the element */
    toggleMask($(this));
  }, function() {
    /* Stuff to do when the mouse leaves the element */
    toggleMask($(this));
  });

  function toggleMask(m) {
    m.find('#hdMask').toggle();
    m.find('a').toggleClass('on');
  }

});