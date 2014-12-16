$(document).ready(function() {
  var tables = $('.tab-content .table');
  var type = 0;

  if(APP.getUrlPara('type')!=""){
    type = APP.getUrlPara('type');
    if(isNaN(type)) type = 0;
    if (type<0) type = 0;
    if (type>=tables.length) type = 0;
  }

  $('#nav-tabs li:eq('+type+') a').tab('show');
  PAGE.loadOrderRecord({
    type: type,
    days: 30,
    page: 1,
    pageSize: 10,
    innerHtmlObj: tables.eq(type).find('tbody')
  });

  $('.nearday').on('change', function() {

    var i = parseInt($(this).parents('.tab-pane').index());
    var days = $(this).val() || 30;

    PAGE.loadOrderRecord({
      type: i,
      days: days,
      page: 1,
      pageSize: 10,
      innerHtmlObj: tables.eq(i).find('tbody')
    });
  });

  $('#nav-tabs').on("click", ' a', function() {

    var i = parseInt($(this).attr('data-type'));
    var days = $('.tab-pane').eq(i).find('.nearday').val() || 30;

    PAGE.loadOrderRecord({
      type: i,
      days: days,
      page: 1,
      pageSize: 10,
      innerHtmlObj: tables.eq(i).find('tbody')
    });
  });
});