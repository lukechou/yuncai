define(['jquery', 'app'], function ($, APP) {
  'use strict';

  var model = (function () {

    function model(args) {
      // enforces new
      if (!(this instanceof model)) {
        return new model(args);
      }
    }

    model.prototype.init = function (args) {

      for (var prop in args) {
        if (args.hasOwnProperty(prop)) {
          this[prop] = args[prop];
        }
      }

      var _this = this;

      /**
       * Star Click Event
       * @return null
       */
      _this.starList.on('click', function (event) {
        event.preventDefault();
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

    };

    model.prototype.controlStar = function () {

      var _this = this;
      var stared = 'i-collect-star-y';
      var unStar = 'i-collect-star-g';
      if (_this.starLevel !== 0) {
        _this.starList.slice(0, _this.starLevel).removeClass(unStar).addClass(stared);
      } else {
        _this.starList.removeClass().addClass(unStar)
        _this.starList.eq(0).removeClass(unStar).addClass(stared);
      }

    };

    model.prototype.setModelModal = function () {

      var _this = this;
      _this.controlStar();
      $('#j-modal-id').html(_this.modelId).attr('data-modalid', _this.modelId);
      $('#j-star_comment').val(_this.starComment);
      $('#j-model_comment').val(_this.modelComment);

    };

    model.prototype.resetModelModal = function () {

      var _this = this;
      _this.userId = null;
      _this.starLevel = 0;
      _this.starComment = '';
      _this.modelComment = '';
      _this.controlStar();
      $('#j-star_comment').val(_this.starComment);
      $('#j-model_comment').val(_this.modelComment);

    };


    model.prototype.bindCollectEvent = function () {
      var _this = this;

      /**
       * 显示收藏提示框
       * @return null
       */
      $('.j-collect-show').on('click', function (event) {
        event.preventDefault();
        var modelId = $(this).attr('data-modelid');
        var isModify = $(this).attr('data-modify') == 1 ? true : false;
        _this.isModify = isModify;
        _this.modelId = modelId;

        if (!APP.checkUserLoginStatus()) {
          APP.showLoginBox();
          return;
        }

        $('#j-isModify').addClass('hide');
        $('#j-modal-id').html(_this.modelId).attr('data-modalid', _this.modelId);
        _this.resetModelModal();
        _this.modal.modal('show');

        if (isModify) {
          $.ajax({
              url: '/lottery/trade/get-model-collect-data',
              type: 'get',
              dataType: 'json',
              data: {
                model_id: _this.modelId
              },
            })
            .done(function (D) {
              var data = D.retData.data;
              if (D.retCode === 100000) {
                $('#j-isModify').removeClass('hide');
                $('#j-collect-date').html(data.create_time);
                _this.userId = data.user_id;
                _this.starLevel = data.star_level;
                _this.starComment = D.retData.star_comment[data.star_level];
                _this.modelComment = data.model_comment;
                _this.setModelModal();
              }
            })
            .fail(function () {
              APP.onServiceFail();
            });
        }

      });

      // collect save
      $('#j-collect-submit').on('click', function (event) {

        var obj = {
          model_id: _this.modelId,
          star_level: _this.starLevel,
          star_comment: _.escape($.trim($('#j-star_comment').val())),
          model_comment: _.escape($.trim($('#j-model_comment').val()))
        };
        _this.saveCollect(obj);

      });

      // collect cancel
      $('.j-collect-cancel').on('click', function (event) {
        if (!_this.userId) return;
        var obj = {
          model_id: _this.modelId,
          user_id: _this.userId,
          t: $.now()
        };
        _this.cancelCollect(obj);
      });

    };

    model.prototype.cancelCollect = function (obj) {
      var _this = this;

      APP.showTips({
        text: '是否取消该收藏?',
        type: 2,
        onConfirm: function () {
          var o = obj;
          $.ajax({
              url: '/lottery/trade/model-cancel-collect',
              type: 'get',
              dataType: 'json',
              data: o,
            })
            .done(function () {
              _this.onCollectCancel(o.model_id);
            })
            .fail(function () {
              APP.onServiceFail();
            });
        }
      });

    };

    model.prototype.saveCollect = function (obj) {
      var _this = this;
      $.ajax({
          url: '/lottery/trade/model-collect',
          type: 'get',
          dataType: 'json',
          data: obj,
        })
        .done(function (D) {
          if (D.retCode === 100000) {
            var el = $('.j-collect-show[data-modelid=' + obj.model_id + ']');
            if (!el.hasClass('i-collect-star-y')) {
              el.html('修改收藏').attr('data-modify', 1);
            }
            _this.modal.on('hidden.bs.modal', function (e) {
              if (_this.isModify) D.retMsg = '修改成功';
              APP.showTips({
                text: D.retMsg,
                type: 1,
                onConfirm: function () {
                  window.location.reload();
                }
              });
            });
            _this.modal.modal('hide');

          } else {
            APP.handRetCode(D.retCode, D.retMsg);
          }

        })
        .fail(function () {
          APP.onServiceFail();
        });
    };

    model.prototype.onCollectCancel = function (id) {
      var _this = this;
      if (_this.isCollectPage) {
        $('#track_detail_list tr[data-modelid=' + id + ']').remove();
        $('#j-collect-table tbody .index').each(function (index, el) {
          $(this).html(index + 1);
        });
      } else {
        $('.j-collect-show[data-modelid=' + id + ']').html('收藏').attr('data-modify', 0);
      }

      _this.modal.modal('hide');
      APP.showTips({
        text:'成功删除该收藏',
      });
    };

    return model;

  }());

  var m = new model();
  return m;

});