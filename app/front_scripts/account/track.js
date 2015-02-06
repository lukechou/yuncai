$(function() {
  'use strict';

  PAGE.loadTrackList = function(obj) {

    PAGE.ajaxUrl = '/account/track/ajax';
    PAGE.pageElement = $('.j-page-box');
    PAGE.initAjax(obj);
    PAGE.pageTable = $('#track_detail_list');

    PAGE.onSuccess = function(data) {

      var htmlOutput = '';
      var detailData = '';
      var show = '';
      var dataItem = '';

      // Create Records HTML
      if (data.retCode == 100000) {
        if (data.retData.data.length > 0) {
          detailData = data.retData.data;
          for (var i = 1; i <= detailData.length; i++) {
            dataItem = detailData[i - 1];
            if (dataItem.show == 1) {
              show = '<a href="' + dataItem.detailURI + '">查看详细</a><a href="' + dataItem.buyURI + '" class="ml8">继续投注</a>';
            }else{
              show = '';
            }
            htmlOutput += '<tr><td>' + dataItem.lotyCNName + '</td><td>' + dataItem.price + '</td><td>' + dataItem.lessIssueNum + '</td><td>' + dataItem.finishIssueNum + '</td><td>' + dataItem.status + '</td><td>' + show + '</td></tr>';
          }

          PAGE.config.pageNum = data.retData.pageSize;
          PAGE.makePageHtml();
          PAGE.bindPageEvent(PAGE.loadTrackList);
        } else {
          htmlOutput = '<tr><td colspan="7">无相关追号纪录</td></tr>';
        }
      } else {
        htmlOutput = '<tr><td colspan="7">' + data.retMsg + '</td></tr>';
      }
      this.appendTable(htmlOutput);
    };

  };

  var track = (function() {

    var track = {
      page: 1,
      pageSize: 10,
      init: function() {
        this.makeLotyChoose('1');
        PAGE.loadTrackList({
          days: 30,
          lotyType: 1,
          lotyName: '',
          page: track.page,
          pageSize: track.pageSize,
        });
      },
      makeLotyChoose: function(type) {
        switch (type) {
          case '1':
            $("#j-all").html('<option value="">全部</option><option value="ssq">双色球</option><option value="dlt">大乐透</option><option value="pl5">排列5</option><option value="pl3">排列3</option><option value="qxc">七星彩</option><option value="qlc">七乐彩</option><option value="fc3d">福彩3D</option>');
            break;
          case '2':
            $("#j-all").html('<option value="">全部</option><option value="gdx">粤11选5</option><option value="dlc">江西11选5</option><option value="syy">十一运夺金</option><option value="xjx">新疆11选5</option><option value="k3">江苏快3</option><option value="jk3">吉林快3</option><option value="hbk3">湖北快3</option><option value="jxssc">江西时时彩</option><option value="gkl">广东快乐十分</option><option value="klpk">快乐扑克3</option>');
            break;
        }
      }
    };

    return track;

  }());

  track.init();

  // Toggle lotyType
  $("#j-seeds").on('change', function(event) {

    track.makeLotyChoose($(this).val());

  });

  // Search New Pages
  $('#search').on('click', function(event) {

    PAGE.loadTrackList({
      days: $('#j-nearday').val(),
      lotyType: $('#j-seeds').val(),
      lotyName: $('#j-all').val(),
      page: track.page,
      pageSize: track.pageSize
    });

  });



});