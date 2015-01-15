$(function() {
  var tables = $('.tab-content .table');
  var pageSize = 10;

  $('.j-search').on('click', function() {

    var i = parseInt($(this).parents('.tab-pane').index()) | 0;
    var days = $(this).parents('.tab-pane').find('.nearday').val() || 30;

    PAGE.loadDetailRecord({
      type: i,
      days: days,
      tradeType:$('#tradeType').val(),
      page: 1,
      pageSize: pageSize,
      innerHtmlObj: tables.eq(i).find('tbody')
    });
  });

  $('#nav-tabs').on("click", ' a', function() {

    var i = parseInt($(this).attr('data-type')) | 0;
    var days = $('.tab-pane').eq(i).find('.nearday').val() || 30;

    PAGE.loadDetailRecord({
      days: days,
      tradeType:$('#tradeType').val(),
      type: i,
      page: 1,
      pageSize: pageSize,
      innerHtmlObj: tables.eq(i).find('tbody')
    });
  });
  
  // 全部明细
  PAGE.loadDetailRecord({
      type: 0,
      days: 30,
      tradeType:$('#tradeType').val(),
      page: 1,
      pageSize: pageSize,
      innerHtmlObj: tables.eq(0).find('tbody')
    });
});