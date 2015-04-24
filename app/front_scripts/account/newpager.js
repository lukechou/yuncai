  /***
    @Config  Request必须参数  必要
    @PageTable 数据展示表格Element 必要
    @ajaxUrl Request-Data-Url 必要
    @initAjax 发送Ajax 请求 必要
    @onSuccess 数据请求成功后回到函数,主要用于组织返回数据的HTML 必要
    @onFail  数据请求失败回调 可选
    @makePageHtml  组织分页栏HTML 默认
    @bindPageEvent  绑定分页事件 默认
    @Config.pageNum 分页页数 默认
   ***/


var pager = (function() {
  'use strict';

  function pager(args) {
    // enforces new
    if (!(this instanceof pager)) {
      return new pager(args);
    }

  }

  pager.prototype = {
    ajaxUrl: '',
    config: {
      pageNum: 0,
    },
    pageElement: null,
    pageTable: null,
    pageNext: 'j-next-page',
    pageBack: 'j-next-page',
    pageValue: 'j-next-page',
    pageGo: 'j-pages-go',
    onSuccess: null,
  };


  pager.prototype.bindPageEvent = function(callback) {

    var _this = this;
    $(_this.config.pageElement).find('.next-page').on('click', function (event) {
        _this.config.page = parseInt(_this.config.page);
        if (_this.config.page < _this.config.pageNum) {
          _this.config.page += 1;
          callback(_this.config);
        }
      });


      $(_this.config.pageElement).find('.back-page').on('click', function (event) {
        _this.config.page = parseInt(_this.config.page);
        _this.config.page -= 1;
        if (_this.config.page <= 0) {
          _this.config.page = 1;
        }
        callback(_this.config);
      });



      $(_this.config.pageElement).find('.j-pages-value').on('change', function (event) {

        var max = $(this).siblings('.j-days').html();
        var go = parseInt($(this).val());

        if (isNaN(go)) {
          go = 1;
        } else {
          go = Math.ceil(go);
        }

        if (max < go) {
          go = max;
        }
        if (go < 1) {
          go = 1;
        }
        $(this).val(go);
      });

      $(_this.config.pageElement).find('.j-pages-go').on('click', function (event) {
        _this.config.page = $(this).siblings('.j-pages-value').val() || 1;
        callback(_this.config);
      });

    };


    pager.prototype.appendTable=function(html) {
      this.pageTable.html(html);
    };

    pager.prototype.makePageHtml=function(pageHtmlNode) {

      if (this.pageElement || !pageHtmlNode) {
        pageHtmlNode = this.pageElement;
      }

      if (this.config.pageNum <= 1) {
        pageHtmlNode.html('');
        return;
      }

      pageHtmlNode.html('<div class="pull-right pages">' + '<span class="j-page">' +this.config.page + '</span>/<span class="j-days">' + this.config.pageNum + '</span>页<a href="javascript:;" class="back-page" >上一页</a><a href="javascript:;" class="next-page">下一页</a><input type="text" value="' + this.config.page + '" class="govalue j-pages-value"><button class="btn j-pages-go" type="button">Go</button>页</div>');

    };

    pager.prototype.initAjax=function(obj) {

      var _this = this;
      _this.config = obj;
      $.ajax({
          url:_this.ajaxUrl,
          type: 'get',
          dataType: 'json',
          data: _this.config,
        })
        .done(function(data) {
          _this.onSuccess(data);
        })
        .fail(function() {
          _this.onFail();
        });
    };


    pager.prototype.onFail=function() {

      //APP.showTips('服务器繁忙,请稍后再试!');

    };

  return pager;
}());














