define(['jquery'], function ($) {
  'use strict';
  var index = (function () {

    function index(args) {
      // enforces new
      if (!(this instanceof index)) {
        return new index(args);
      }
      // consindetructor body
    }

    index.prototype = {
      systemTime: 0,
      currLotyName: 'ssq',
      hasCreate: {
        'ssq': false,
        'dlt': false,
        'pl5': false
      },
      defaultPlayName: {
        'ssq': 0,
        'dlt': 0,
        'pl5': 10
      },
      buyCodes: {
        'ssq': '',
        'dlt': '',
        'pl5': ''
      },
      seeds: {}
    };

    index.prototype.init = function (args) {

      var _this = this;

      // 购彩列表
      $('#choseCai').unbind();
      $('#hdMask').show();
      $('#choseCai a').toggleClass('on');

      _this.getQuickStopTime();
      _this.updateHeadUserInfo();

      var i = setInterval(function () {
        _this.timer4lottery();
        _this.systemTime++;
      }, 1000);

      _this.timer4lottery();

    };

    index.prototype.timer4lottery = function () {

      var _this = this;

      var lotyDomObj = $('#j-quick-buy-loty-detail').find('#' + _this.currLotyName);

      var issueSellEndTime, diffTime, hours, day, hour, minute, seconds, redGroup, blueGroup, num;
      var rightHTML = '';

      if (_this.systemTime > 0) {

        issueSellEndTime = Number(lotyDomObj.find('.j-qihao-sell-endtime').val());

        diffTime = Math.floor((issueSellEndTime - _this.systemTime));

        if (diffTime > 0) {

          hours = diffTime / 60 / 60;
          day = Math.floor(hours / 24);
          hour = Math.floor(hours % 24);
          minute = Math.floor(diffTime / 60 % 60);
          seconds = diffTime % 60;

          if (day > 0) {
            rightHTML += '<span class="j-day">' + day + '</span>天';
          }

          if (!(day === 0 && hour === 0)) {
            rightHTML += '<span class="j-hour">' + hour + '</span>小时';
          }

          if (!(day === 0 && hour === 0 && minute === 0)) {
            rightHTML += '<span class="j-minute">' + minute + '</span>分';
          }

          rightHTML += '<span class="j-second">' + seconds + '</span>秒后截止</span>';

        } else {

          rightHTML = '销售时间截止';

        }
        $('.pull-right').html(rightHTML);
      }

      if (false === _this.hasCreate[_this.currLotyName]) {

        redGroup = _.sample(_this.seeds[_this.currLotyName].redBall, _this.seeds[_this.currLotyName].redTotal);
        blueGroup = _.sample(_this.seeds[_this.currLotyName].blueBall, _this.seeds[_this.currLotyName].blueTotal);

        if(_this.currLotyName!=='pl5'){
          redGroup.sort();
          blueGroup.sort();
        }
        num = 0;

        switch (_this.currLotyName) {
        case 'ssq':
          _this.buyCodes[_this.currLotyName] = redGroup.join(',') + '|' + blueGroup.join(',');
          break;
        case 'dlt':
          _this.buyCodes[_this.currLotyName] = redGroup.join(',') + '|' + blueGroup.join(',');
          break;
        case 'pl5':
          _this.buyCodes[_this.currLotyName] = redGroup.join(',');
          break;
        }

        lotyDomObj.find('.tou-ls li').each(function (index, el) {

          $(this).html((redGroup.length > index) ? redGroup[index] : blueGroup[index - redGroup.length]);

        });

        _this.hasCreate[_this.currLotyName] = true;

      }

    };

    index.prototype.getQuickStopTime = function () {

      var _this = this;
      $.ajax({
          url: '/system',
          type: 'GET',
          dataType: 'json',
        })
        .done(function (data) {
          if (data.retCode == 100000) {
            _this.systemTime = data.retData.sys_time;
          } else {
            console.log(data.retMsg)
          }
        });

    };

    index.prototype.updateHeadUserInfo = function () {

      var html = '';
      $.ajax({
        url: '/account/islogin',
        type: 'get',
        dataType: 'json',
      }).done(function (data) {
        if (data.retCode === 100000) {
          html = '<span>欢迎来到彩胜网&nbsp;!&nbsp;&nbsp;&nbsp;&nbsp;<img src="' + staticHostURI + '/front_images/bor.png" alt="bor"/></span>' + data.retData.username + '       账户余额:<span id="userMoney">' + data.retData.money + '</span>元<a href="/account/top-up" class="active">充值</a><img src="' + staticHostURI + '/front_images/bor.png" alt="bor"/><a href="/account/logout">退出</a><img src="' + staticHostURI + '/front_images/bor.png" alt="bor"/><a href="/account/index" class="last">我的账户</a>';
          $('#hd-top').html(html);
        }
      });

    };

    return index;

  }());

  var i = new index();
  return i;
});