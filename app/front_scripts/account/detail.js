$(function() {
  var tables = $('.tab-content .table');
  var pageSize = 10;

  $('.j-search').on('click', function() {

    var i = parseInt($(this).parents('.tab-pane').index());
    var days = $(this).parents('.tab-pane').find('.nearday').val() || 30;

    PAGE.loadDetailRecord({
      type: i,
      days: days,
      page: 1,
      pageSize: pageSize,
      innerHtmlObj: tables.eq(i - 1).find('tbody')
    });
  });

  $('#nav-tabs').on("click", ' a', function() {

    var i = parseInt($(this).attr('data-type'))
    var days = $('.tab-pane').eq(i).find('.nearday').val() || 30;

    PAGE.loadDetailRecord({
      days: days,
      type: i,
      page: 1,
      pageSize: pageSize,
      innerHtmlObj: tables.eq(i - 1).find('tbody')
    });
  });
});