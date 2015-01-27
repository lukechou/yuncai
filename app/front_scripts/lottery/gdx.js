require.config({
	urlArgs: "bust=" + (new Date()).getTime(),
	paths: {
		jquery: '../lib/jquery',
		lodash: '../lib/lodash.compat.min',
		bootstrap: '../lib/bootstrap.min',
		store: '../lib/store.min',
		app: '../common/app',
		core: '../lib/core',
		gdx: 'gdx_core'
	},
	shim: {
		bootstrap: {
			deps: ['jquery'],
			exports: 'jquery'
		},
	}
});

require(['jquery', 'lodash', 'store', 'app', 'gdx', 'bootstrap', 'core'], function ($, _, store, APP, gdx) {

	'use strict';

	/*
	 * 顶部TAB 切换
	 * big 大类 zx直选 zx6直选6 zx3直选3
	 * small 小类 cgtz常规投注 upload粘贴上传 many多期投注 he和值 dt胆拖
	 * @author: Raymond
	 */
	var nav = (function () {
		'use strict';

		var nav = {
			big: 'gdx',
			small: '1',
			bigEl: null,
			smallEl: null,
			init: function (args) {
				var _this = this;
				for (var prop in args) {
					if (args.hasOwnProperty(prop)) {
						_this[prop] = args[prop];
					}
				}
			},
			reset: function () {
				var _this = this;
				_this.big = 'gdx';
				_this.small = '1';
				_this.toggleTabs();
			},
			toggleTabs: function () {

				var _this = this;
				var a = 'active';

				_this.bigEl.find('a.active').removeClass(a);
				_this.bigEl.find('a[data-type=' + _this.big + ']').addClass(a);
				_this.smallEl.find('li.active').removeClass(a);
				_this.smallEl.find('a[data-stype=' + _this.small + ']').parents('li').addClass(a);
				_this.content.removeClass().addClass('j-box-' + _this.big);
				_this.main.removeClass().addClass('j-box-' + _this.small);

			}

		};

		return nav;

	}());

	function pageInit() {

		nav.init({
			bigEl: $('#j-hd-nav'),
			smallEl: $('#j-nav'),
			content: $('#j-content'),
			main: $('#j-box-main')
		});

	}

	pageInit();

	/**
	 * 玩法切换 - 小类
	 *
	 */
	$('#j-nav').on('click', 'a', function (event) {

		var _this = $(this);
		var type = _.escape(_this.attr('data-stype'));
		var li = _this.parents('li');

		if (false) {
			APP.showTips({
				title: '友情提示',
				text: '切换玩法将会清空您的号码',
				type: 2,
				onConfirm: function () {
					$('#myModal').modal('hide');
					$('.br-details').find('tbody .br-zhui-c').each(function (index, el) {
						_this.parents('tr').find('.j-money').html(0);
					});
					nav.small = type;
					smallToggleTabs();
				}
			});
		} else {
			nav.small = type;
			smallToggleTabs();
		}

	});

	function smallToggleTabs(box) {

		$('#buy-submit').attr("disabled", "disabled");

		nav.toggleTabs();

	}

});