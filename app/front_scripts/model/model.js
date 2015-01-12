define(['jquery', 'app'], function($, APP) {
  'use strict';

  var model = (function() {

    function model(args) {
      // enforces new
      if (!(this instanceof model)) {
        return new model(args);
      }
    }

    model.prototype.init = function(args) {
      for (var prop in args) {
        if (args.hasOwnProperty(prop)) {
          this[prop] = args[prop];
        }
      }
    };

    model.prototype.controlStar = function() {

      var _this = this;

      if (_this.starLevel !== 0) {
        _this.starList.slice(0, _this.starLevel).removeClass('i-collect-star-g').addClass('i-collect-star-y');
      } else {
        _this.starList.eq(0).removeClass('i-collect-star-g').addClass('i-collect-star-y');
      }

    };

    model.prototype.showModelModal = function() {

      var _this = this;

      _this.controlStar();
      $('#j-modal-id').html(_this.modelId).attr('data-modalid', _this.modelId);
      $('#j-star_comment').val(_this.starComment);
      $('#j-model_comment').val(_this.modelComment);
      _this.modal.modal('show');

    };

    model.prototype.bindCollectEvent = function() {
      var _this = this;

      /**
       * Star Click Event
       * @return null
       */
      _this.starList.on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        var index = _this.starList.index(this);
        var dataTip = $(this).data('tip');

        if ($(this).hasClass('i-collect-star-g')) {
          _this.starList.slice(0, (index + 1)).removeClass('i-collect-star-g').addClass('i-collect-star-y');

        } else {
          if (index === 0) {
            index = 1;
          } else {
            dataTip = $(this).prev('.i-collect-star-y').data('tip');
          }
          _this.starList.slice(index, _this.starList.length).removeClass('i-collect-star-y').addClass('i-collect-star-g');
        }
        $('.star-comment').val('');
        _this.starLevel = _this.starList.filter('.i-collect-star-y').length;
      });

      /**
       * 显示收藏提示框
       * @return null
       */
      $('.j-collect-show').on('click', function(event) {

        var modelId = $(this).attr('data-modelid');
        var isModify = $(this).attr('data-modify') == 1 ? true : false;
        _this.modelId = modelId;

        if (!APP.checkUserLoginStatus()) {
          APP.showLoginBox();
          return;
        }

        if (isModify) {
          $.ajax({
              url: '/lottery/trade/get-model-collect-data',
              type: 'get',
              dataType: 'json',
              data: {
                model_id: _this.modelId
              },
            })
            .done(function(D) {
              if (D.retCode === 100000) {
                $('#j-isModify').removeClass('hide');
                $('#j-collect-date').html(D.retData.data.create_time);
                _this.userId = D.retData.data.user_id;
                _this.starLevel = D.retData.data.star_level;
                _this.starComment = D.retData.data.star_comment;
                _this.modelComment = D.retData.data.model_comment;
                _this.showModelModal();
              }

            })
            .fail(function() {
              APP.onServerFail();
            });
        } else {
          $('#j-isModify').addClass('hide');
          _this.userId = null;
          _this.starLevel = 1;
          _this.starComment = '';
          _this.modelComment = '';
          _this.showModelModal();
        }

      });

      // collect save
      $('#j-collect-submit').on('click', function(event) {

        var obj = {
          model_id: _this.modelId,
          star_level: _this.starLevel,
          star_comment: _.escape($.trim($('#j-star_comment').val())),
          model_comment: _.escape($.trim($('#j-model_comment').val()))
        };

        $.ajax({
            url: '/lottery/trade/model-collect',
            type: 'get',
            dataType: 'json',
            data: obj,
          })
          .done(function(D) {
            if (D.retCode === 100000) {
              $('.j-collect-show[data-modelid=' + obj.model_id + ']').html('修改收藏').attr('data-modify', 1);
              _this.modal.modal('hide');
              APP.showTips({
                onlyConfirm: true,
                text: D.retMsg
              });
            } else {
              APP.handRetCode(D.retCode, D.retMsg);
            }

          })
          .fail(function() {
            APP.onServerFail();
          });

      });

      // collect cancel
      $('.j-collect-cancel').on('click', function(event) {
        if (!_this.userId) return;

        var obj = {
          model_id: _this.modelId,
          user_id: _this.userId,
          t: $.now()
        };

        $.ajax({
            url: '/lottery/trade/model-cancel-collect',
            type: 'get',
            dataType: 'json',
            data: obj,
          })
          .done(function() {
            $('.j-collect-show[data-modelid=' + obj.model_id + ']').html('收藏').attr('data-modify', 0);
            _this.modal.modal('hide');
          })
          .fail(function() {
            APP.onServerFail();
          });

      });

    };

    return model;

  }());

  var m = new model();
  return m;

});