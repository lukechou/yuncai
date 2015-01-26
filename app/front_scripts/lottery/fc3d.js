require.config({
	urlArgs: "bust=" + (new Date()).getTime(),
	paths: {
		jquery: '../lib/jquery',
		lodash: '../lib/lodash.compat.min',
		bootstrap: '../lib/bootstrap.min',
		store: '../lib/store.min',
		app: '../common/app',
		core: '../lib/core',
		PL3: '../lottery/fc3d_core'
	},
	shim: {
		bootstrap: {
			deps: ['jquery'],
			exports: 'jquery'
		},
	}
});

require(['jquery', 'lodash', 'store', 'app', 'PL3', 'bootstrap', 'core'], function ($, _, store, APP, PL3) {

	'use strict';

	PL3.init({
		G_BUY: {
			lotyName: '',
			lotyCNName: '福彩3D',
			codes: [],
			zhushu: 0,
			mutiple: 1,
			money: 0,
			payMoney: 0,
			qihaoId: 0,
			isManual: false,
			qihao: 0,
			partnerBuy: {
				projectTitle: '福彩3D合买方案', // 方案标题
				projectDescription: '福彩3D', // 方案标题
				partBuyMoney: 0, // 合买认购金额
				partAegisMoney: 0, // 合买认购金额
				commissionPercent: 0, // 合买提成
				shareLevel: 1, // 0，立即公开。 1，期号截止公开。 2，跟担人公开。 3，不公开
			}, // 合买
			rowIndex: 0,
			buyType: 1, // 1:自购, 2:追号, 3:合买, 4:多期机选
			trackData: {
				issueMutipleMap: {}, // qihaoID:期号id : object(qihao:期号, multiple:倍数)
				trackStopMoney: 0, // 中奖急停金额
			},
			proxyBuy: {
				betNum: 2,
				mutiple: 1,
				issueSize: 10,
			},
			init: function () {
				this.lotyName = $('#lotyName').val();
				this.playName = $('#playName').val();
				this.codes = [];
				this.zhushu = 0;
				this.mutiple = 1;
				this.money = 0;
				this.isManual = false;
				this.qihaoId = $('#qihaoId').val();
				this.qihao = $('#qihao').val();
				this.partnerBuy = {
						projectTitle: '福彩3D合买方案', // 方案标题
						projectDescription: '福彩3D', // 方案标题
						partBuyMoney: 0, // 合买认购金额
						partAegisMoney: 0, // 合买认购金额
						commissionPercent: 0, // 合买提成
						shareLevel: 1, // 0，立即公开。 1，期号截止公开。 2，跟担人公开。 3，不公开
					},
					this.rowIndex = 0;
				this.buyType = 1; // 1, 自购。 2， 追号， 3合买
				//		this.trackData = {
				//			issueMutipleMap: {}, // qihaoID:期号id : object(qihao:期号, multiple:倍数)
				//			trackStopMoney: 0 // 中奖急停金额
				//		};
				this.proxyBuy = {
					betNum: 2,
					multiple: 1,
					issueSize: 10,
				};
			},
		},
		G_CHOOSE: {
			codes: [],
			zhushu: 0,
			money: 0,
			init: function () {
				this.codes = [];
				this.zhushu = 0;
				this.money = 0;
			},
		},
		G_MODIFY_CODE_OBJ: {
			codeKey: -1,
			codeObj: {},
		},
		chooseBuyBtn: $('#choose_to_buy'),
		choose_zhushu: $("#choose_zhushu"),
		choose_money: $("#choose_money"),
		ballAear: $('.box-zx-cgtz .j_normal_choose_code'),
		addMoney: 0,
		playName: 10,
	});

	/*
	 * 顶部TAB 切换
	 * big 大类 zx直选 zx6直选6 zx3直选3
	 * small 小类 cgtz常规投注 upload粘贴上传 many多期投注 he和值 dt胆拖
	 * @author: Raymond
	 */
	PL3.nav = (function () {
		'use strict';

		var nav = {
			big: 'zx',
			small: 'cgtz',
			bigEl: null,
			smallEl: null,
			zx: ['cgtz', 'hz', 'up', 'many'],
			zx6: ['cgtz', 'hz', 'dt', 'up'],
			zx3: ['cgtz', 'hz', 'dt', 'up'],
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
				_this.big = 'zx';
				_this.small = 'cgtz';
				_this.toggleTabs();
			},
			toggleTabs: function () {

				var _this = this;
				var smallIndex = _.indexOf(_this[_this.big], _this.small);
				var a = 'active';

				if (smallIndex < 0) {
					_this.small = 'cgtz';
				}

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

	$(document).ready(function () {

		function pageInit() {
			APP.bindInputPlace();
			PL3.G_BUY.init();
			PL3.G_CHOOSE.init();

			PL3.nav.init({
				bigEl: $('#j-hd-nav'),
				smallEl: $('#j-nav'),
				content: $('#j-content'),
				main: $('#j-box-main')
			});
		}

		pageInit();

		/**
		 * 玩法切换 - 大类
		 *
		 */
		$('#j-hd-nav').on('click', 'a', function (event) {

			var type = $(this).attr('data-type');
			type = type ? _.escape(type) : null;

			if (PL3.G_BUY.codes.length >= 1) {
				APP.showTips({
					title: '友情提示',
					text: '切换玩法将会清空您的号码',
					type: 2,
					onConfirm: function () {
						$('#myModal').modal('hide');
						$('.br-details').find('tbody .br-zhui-c').each(function (index, el) {
							_this.parents('tr').find('.j-money').html(0);
						});
						PL3.nav.big = type;
						smallToggleTabs();
					}
				});
			} else {
				PL3.nav.big = type;
				smallToggleTabs();
			}

		});

		/**
		 * 玩法切换 - 小类
		 *
		 */
		$('#j-nav').on('click', 'a', function (event) {

			var _this = $(this);
			var type = _.escape(_this.attr('data-stype'));
			var li = _this.parents('li');

			if (PL3.G_BUY.codes.length >= 1) {
				APP.showTips({
					title: '友情提示',
					text: '切换玩法将会清空您的号码',
					type: 2,
					onConfirm: function () {
						$('#myModal').modal('hide');
						$('.br-details').find('tbody .br-zhui-c').each(function (index, el) {
							_this.parents('tr').find('.j-money').html(0);
						});
						PL3.nav.small = type;
						smallToggleTabs();
					}
				});
			} else {
				PL3.nav.small = type;
				smallToggleTabs();
			}

			if (type === 'many') {
				PL3.G_BUY.buyType = 4;
			}

		});

		function smallToggleTabs(box) {

			var b = PL3.nav.big;
			var s = PL3.nav.small;

			PL3.ballAear = $('.box-' + b + '-' + s + ' .j_normal_choose_code');

			if (b === 'zx' && s === 'cgtz') {
				$('.j-jx-zhus').show();
			} else {
				$('.j-jx-zhus').hide();
			}

			if (s === 'up') {
				PL3.G_BUY.isManual = true;
			} else {
				PL3.G_BUY.isManual = false;
			}

			if (b === 'zx') {
				if (s === 'cgtz') PL3.playName = 10;
				if (s === 'hz') PL3.playName = 12;
				if (s === 'many') PL3.playName = 10;
			}

			if (b === 'zx3') {
				if (s === 'cgtz') PL3.playName = 20;
				if (s === 'dt') PL3.playName = 21;
				if (s === 'hz') PL3.playName = 22;
			}

			if (b === 'zx6') {
				if (s === 'cgtz') PL3.playName = 30;
				if (s === 'dt') PL3.playName = 31;
				if (s === 'hz') PL3.playName = 32;
			}

			$('#buy-submit').attr("disabled", "disabled");

			PL3.nav.toggleTabs();
			clean4CutBuyType();

		}

		/**
		 * 选球
		 *
		 * @return null
		 */
		$(".j-num-group").on('click', 'a', function (event) {
			event.preventDefault();

			var row = $(this).parents('.j-row-code');
			var dataBit = parseInt(row.attr('data-bit'));
			var arr = null;
			var num = parseInt(APP.filterStr($(this).html()));
			var ballState = $(this).hasClass('active');

			// 胆拖判断变量
			var s = PL3.nav.small;
			var b = PL3.nav.big;
			var codesLen = null;
			var isDt = row.attr('data-dt') || false;
			var arr2 = null;
			var dataBit2 = dataBit === 1 ? 0 : 1;

			arr = getChooseCodes(dataBit);

			codesLen = PL3.G_CHOOSE.codes[0][dataBit].length + 1;

			// 胆拖判断 阻止选号
			if (s === 'dt' && isDt) {

				if (b === 'zx3' && codesLen > 1 && !ballState) {
					APP.showTips('最多只能选择1个胆码');
					return;
				}

				if (b === 'zx6' && codesLen > 2 && !ballState) {
					APP.showTips('最多只能选择2个胆码');
					return;
				}

			}

			//切换选球状态
			if (s === 'dt') {
				arr2 = getChooseCodes(dataBit2);

				if (ballState) {
					_.pull(arr, num);
					arr2.push(num);
				} else {
					arr.push(num);
					_.pull(arr2, num);
				}

				PL3.G_CHOOSE.codes[0][dataBit] = arr;
				PL3.G_CHOOSE.codes[0][dataBit].sort();
				PL3.G_CHOOSE.codes[0][dataBit2] = arr2;
				PL3.G_CHOOSE.codes[0][dataBit2] = arr2;

				$(this).toggleClass('active');
				if ($(this).hasClass('active')) {
					row.siblings('.j-row-code').find('[data-num=' + num + ']').removeClass('active')
				}
			} else {

				if (ballState) {
					_.pull(arr, num);
				} else {
					arr.push(num);
				}

				PL3.G_CHOOSE.codes[0][dataBit] = arr;
				PL3.G_CHOOSE.codes[0][dataBit].sort();
				$(this).toggleClass('active');

			}

			calculateChooseCodes();

		});

		function getChooseCodes(dataBit) {
			if (typeof PL3.G_CHOOSE.codes[0] === 'undefined') {
				PL3.G_CHOOSE.codes[0] = [];
			}

			if (typeof PL3.G_CHOOSE.codes[0][dataBit] === 'undefined') {
				PL3.G_CHOOSE.codes[0][dataBit] = [];
			}
			return PL3.G_CHOOSE.codes[0][dataBit].concat();
		}

		/**
		 * 自助选号 右侧按钮
		 *
		 * @return null
		 */
		$('.j-quick-method').on('click', 'span', function (event) {

			var type = $(this).attr('data-type') || null;
			var row = $(this).parents('.j-row-code');
			var dataBit = parseInt(row.attr('data-bit'));
			var num = null;

			// On Dantuo
			var isDt = PL3.nav.small === 'dt';
			var dataBit2 = dataBit === 1 ? 0 : 1;
			var dtRow = row.siblings('.j-row-code').find('.j-num-group a');

			if (typeof PL3.G_CHOOSE.codes[0] === 'undefined') {
				PL3.G_CHOOSE.codes[0] = [];
			}
			PL3.G_CHOOSE.codes[0][dataBit] = [];

			if (type) {

				row.find('.j-num-group a').removeClass('active');

				row.find('.j-num-group a').each(function (index) {

					num = parseInt(APP.filterStr($(this).html()));

					// odd-奇数 even-偶数 big-大数 small-小数 all-全部 clean-清除
					switch (type) {

					case 'odd':

						if (index % 2 != 0) {
							$(this).addClass('active');
							PL3.G_CHOOSE.codes[0][dataBit].push(num);
							if (isDt) {
								dtRow.eq(index).removeClass('active');
								_.pull(PL3.G_CHOOSE.codes[0][dataBit2], num);
							}
						}

						break;
					case 'even':

						if (index % 2 == 0) {
							$(this).addClass('active');
							PL3.G_CHOOSE.codes[0][dataBit].push(num);
							if (isDt) {
								dtRow.eq(index).removeClass('active');
								_.pull(PL3.G_CHOOSE.codes[0][dataBit2], num);
							}
						}
						break;
					case 'big':

						if (index >= 5) {
							$(this).addClass('active');
							PL3.G_CHOOSE.codes[0][dataBit].push(num);
							if (isDt) {
								dtRow.eq(index).removeClass('active');
								_.pull(PL3.G_CHOOSE.codes[0][dataBit2], num);
							}
						}
						break;
					case 'small':

						if (index <= 4) {
							$(this).addClass('active');
							PL3.G_CHOOSE.codes[0][dataBit].push(num);
							if (isDt) {
								dtRow.eq(index).removeClass('active');
								_.pull(PL3.G_CHOOSE.codes[0][dataBit2], num);
							}
						}

						break;
					case 'all':

						PL3.G_CHOOSE.codes[0][dataBit].push(num);
						$(this).addClass('active');
						if (isDt) {
							dtRow.removeClass('active');
							_.pull(PL3.G_CHOOSE.codes[0][dataBit2], num);
						}
						break;

					}
				});
				//清除
				if (type === 'clean') {
					PL3.G_CHOOSE.codes[0][dataBit].length = 0;
				}

				calculateChooseCodes();
			} else {
				console.log('error');
				return;
			}

		});

		/**
		 * 添加到投注列表按钮
		 * @param  Add to List
		 * // 0-修改  1-添加 2-粘贴上传添加到列表
		 * @return null
		 */
		PL3.chooseBuyBtn.on('click', function (event) {

			var bool = false;
			var type = parseInt(PL3.chooseBuyBtn.attr('data-add'));
			var iptCodes = $('#sd_number').val().replace(/，/ig, ',').split("\n");
			var validata = '';
			var uploadArr = [];
			var removeArr = [];

			switch (type) {
			case 0:
				updateZhuMain();
				bool = true;
				break;
			case 1:
				if (PL3.G_CHOOSE.money > 0) {
					PL3.addMoney = PL3.G_CHOOSE.money;
					bool = PL3.makeChooseCodeHtml(PL3.G_CHOOSE.codes);
				}
				break;
			case 2:

				if (iptCodes.length > PL3.maxBuyCodeLength) {
					APP.showTips('您的投注号码多于' + PL3.maxBuyCodeLength + '行，请返回重新选择');
					return;
				}

				for (var i = 0; i < iptCodes.length; i++) {

					if (PL3.getIllegalCode(iptCodes[i])) {

						validata = PL3.getIllegalCode(iptCodes[i]);
						uploadArr.push(validata);
						PL3.addMoney = PL3.getZxZhushu(validata) * 2;
						PL3.makeChooseCodeHtml([validata]);
						removeArr.push(iptCodes[i]);
					}

					if (!iptCodes[i]) {
						_.pull(iptCodes, iptCodes[i]);
					}

				}

				for (var i = removeArr.length - 1; i >= 0; i--) {
					_.pull(iptCodes, removeArr[i]);
				};

				$('#sd_number').val(iptCodes.join('\n'));

				if (uploadArr.length === 0) {
					APP.showTips('<h5>您好，请按照正确格式填写，例：</h5><p>格式：5,8,9</p>');
					return;
				} else {
					calculateBuyCodes();
					PL3.choose_zhushu.html(0);
					PL3.choose_money.html(0);
					PL3.G_CHOOSE.init();
					return;
				}

				break;
			}

			if (bool) {

				calculateBuyCodes();
				PL3.choose_zhushu.html(0);
				PL3.choose_money.html(0);
				PL3.G_CHOOSE.init();
				PL3.chooseBuyBtn.attr('data-add', 1);
				PL3.chooseBuyBtn.removeClass('active');
				PL3.chooseBuyBtn.attr('disabled', 'disabled');

				$("#sd_number").val('');
				PL3.ballAear.find('.j-num-group a').removeClass('active');
				$('#choose_to_buy_tip').html('添加到投注列表');

			}

		});

		function updateZhuMain() {

			var hundredCodes = PL3.G_CHOOSE.codes[0][0] || [];
			var tenCodes = PL3.G_CHOOSE.codes[0][1] || [];
			var digitalCodes = PL3.G_CHOOSE.codes[0][2] || [];
			var b = PL3.nav.big;
			var s = PL3.nav.small;
			var html = '';
			if (PL3.G_CHOOSE.zhushu < 0) {
				return;
			}

			if (PL3.G_CHOOSE.money > PL3.maxOneBetMoney) {
				APP.showTips('您好，单个投注的金额应小于' + PL3.maxOneBetMoney + '元，请返回重新选择');
				return false;
			} else {
				for (var key in PL3.G_BUY.codes) {
					if (PL3.G_BUY.codes[key].key == PL3.G_MODIFY_CODE_OBJ.codeKey) {
						PL3.G_BUY.codes[key].value = PL3.G_CHOOSE.codes[0];
					}
				}
			}

			html += '<div class="br-zhu-item clearfix" databit="' + PL3.G_MODIFY_CODE_OBJ.codeKey + '"><b>[常规投注]</b><div class="list">';

			html += '<span data-c="0">' + PL3.G_CHOOSE.codes[0][0].join('') + '</span>';

			if (tenCodes.length > 0) {
				html += '<span data-c="0">' + PL3.G_CHOOSE.codes[0][1].join('') + '</span>';
			}

			if (digitalCodes.length > 0) {
				html += '<span data-c="0">' + PL3.G_CHOOSE.codes[0][2].join('') + '</span>';
			}

			html += '</div><div class="pull-right"><b><i class="money" data-m="1">' + PL3.G_CHOOSE.money + '</i>元</b><a href="javascript:;" class="br-zhu-set">修改</a><a href="javascript:;" class="br-zhu-del">删除</a></div></div>';
			PL3.G_MODIFY_CODE_OBJ.codeObj.replaceWith(html);
		}

		/**
		 * 机选按钮
		 *
		 * @return null
		 */
		$('.j-zhu-adds').on('click', function (event) {
			event.preventDefault();

			var betNum = parseInt($(this).attr('data-zhu'));
			var getCodes = null;

			if (PL3.G_BUY.codes.length + betNum > PL3.maxBuyCodeLength) {
				APP.showTips('您的投注号码多于' + PL3.maxBuyCodeLength + '行，请返回重新选择');
				return;
			}

			getCodes = PL3.produceZhixuanNormalCode(betNum);
			PL3.G_CHOOSE.zhushu = betNum;
			PL3.addMoney = 2;

			PL3.makeChooseCodeHtml(getCodes, true);
			calculateBuyCodes();
			updateCreatePartProjectParame();
			PL3.G_CHOOSE.init();

		});

		/**
		 * 单击事件
		 *
		 * @return null
		 */
		$('.br-zhu-l').on('click', '.br-zhu-item', function (event) {
			event.preventDefault();

			if (PL3.G_BUY.isManual) {
				return;
			}

			if (event.target.tagName == "A") {
				return;
			}

			reflectChooseCode($(this).attr('databit'));
			PL3.chooseBuyBtn.addClass('active');

		});

		/**
		 * 删除投注号码
		 * @param  {[type]} event) {						var   dataBit [description]
		 * @return {[type]}        [description]
		 */
		$('.br-zhu-l').on('click', '.br-zhu-del', function (event) {

			var dataBit = $(this).parents('.br-zhu-item').attr('dataBit');

			if ($(this).parents('.br-zhu-item')[0] == PL3.G_MODIFY_CODE_OBJ.codeObj[0]) {
				PL3.chooseBuyBtn.attr('data-add', 1);
				$('#choose_to_buy_tip').html('添加到投注列表');
			}

			_.remove(PL3.G_BUY.codes, function (n) {
				return n.key == dataBit;
			});

			$(this).parents('.br-zhu-item').remove();

			calculateBuyCodes();

		});

		/**
		 * 修改投注号码
		 * @param  {[type]} event) {						var   dataBit [description]
		 * @return {[type]}        [description]
		 */
		$('.br-zhu-l').on('click', '.br-zhu-set', function (event) {

			var objectKey = $(this).parents('.br-zhu-item').attr('databit');

			reflectChooseCode(objectKey);
			PL3.chooseBuyBtn.addClass('active');
			PL3.chooseBuyBtn.attr('data-add', 0);

			$('#choose_to_buy_tip').html('修改投注号码');

			PL3.G_MODIFY_CODE_OBJ = {
				codeKey: objectKey,
				codeObj: $(this).parents('.br-zhu-item')
			};

		});

		/**
		 * 清空列表
		 * @return null
		 */
		$('#clean_buy_code').on('click', function (event) {

			$("#code_list").html('');
			$('#buy_zhushu').html(0);
			$('#project_price').html(0);
			PL3.G_BUY.init();
			calculateBuyCodes();
			updateCreatePartProjectParame();

		});
		/**
		 * 自降倍数
		 * @return null
		 */
		$('#decrease_mutiple').on('click', function (event) {
			event.preventDefault();
			var mutipleObj = $("#project_mutiple");
			var currentMultiple = parseInt(mutipleObj.val());
			currentMultiple--;
			if (currentMultiple < PL3.minMultiple) {
				PL3.G_BUY.mutiple = PL3.minMultiple;
			} else if (currentMultiple > PL3.maxMultiple) {
				PL3.G_BUY.mutiple = PL3.maxMultiple;
			} else {
				PL3.G_BUY.mutiple = currentMultiple;
			}
			mutipleObj.val(PL3.G_BUY.mutiple);
			calculateBuyCodes();
			updateCreatePartProjectParame();
		});
		/**
		 * 自降倍数
		 * @return null
		 */
		$('#project_mutiple').on('change', function (event) {
			event.preventDefault();

			/* Act on the event */
			var currentMultiple = parseInt($(this).val()) || 0;
			if (currentMultiple < PL3.minMultiple) {
				PL3.G_BUY.mutiple = PL3.minMultiple;
			} else if (currentMultiple > PL3.maxMultiple) {
				PL3.G_BUY.mutiple = PL3.maxMultiple;
			} else {
				PL3.G_BUY.mutiple = currentMultiple;
			}
			$(this).val(PL3.G_BUY.mutiple);
			calculateBuyCodes();
			updateCreatePartProjectParame();
		});
		/**
		 * 自增倍数
		 * @return null
		 */
		$('#increase_mutiple').on('click', function (event) {
			event.preventDefault();
			/* Act on the event */
			var mutipleObj = $("#project_mutiple");
			var currentMultiple = parseInt(mutipleObj.val());
			currentMultiple++;
			// PL3.G_BUY.mutiple = (currentMutiple <= 0) ? 1 : currentMutiple;
			if (currentMultiple < PL3.minMultiple) {
				PL3.G_BUY.mutiple = PL3.minMultiple;
			} else if (currentMultiple > PL3.maxMultiple) {
				PL3.G_BUY.mutiple = PL3.maxMultiple;
			} else {
				PL3.G_BUY.mutiple = currentMultiple;
			}
			mutipleObj.val(PL3.G_BUY.mutiple);
			calculateBuyCodes();
			updateCreatePartProjectParame();
		});
		/**
		 * 提交购买按钮
		 * @return null
		 */
		$('#buy-submit').on('click', function (event) {
			event.preventDefault();
			var isAgreen = $(this).parents('.br-tou').find('.j-sub-agreed')[0].checked;
			buy(isAgreen);
		});
		$('#buy_button_proxy').on('click', function (event) {
			event.preventDefault();
			var isAgreen = $(this).parents('.br-tou').find('.j-sub-agreed')[0].checked;
			buy(isAgreen);
		});

		/**
		 * 切换购买方式
		 * @return null
		 */
		$('#buy_type').on('click', 'a', function (event) {
			event.preventDefault();

			// 切换 ICON
			$(this).parents('#buy_type').find('.icon-y2').removeClass('icon-y2');
			$(this).find('.icon').addClass('icon-y2');

			PL3.G_BUY.trackData.issueMutipleMap = {}; // clean

			$('#buy_mutiple_span').show();

			PL3.G_BUY.partnerBuy.projectTitle = '福彩3D合买方案';
			PL3.G_BUY.partnerBuy.projectDescription = '福彩3D';

			// clean partner buy
			PL3.G_BUY.buyType = parseInt($(this).attr('data-buytype'));
			PL3.G_BUY.mutiple = 1;
			$('#project_mutiple').val(PL3.G_BUY.mutiple);

			// 1自购 2追号 3合买
			switch (PL3.G_BUY.buyType) {
			case 1:
				$('#track_desc').addClass('hide');
				calculateBuyCodes();
				break;
			case 2:
				$('#buy_mutiple_span').hide();
				$('#track_desc').removeClass('hide');
				queryTrackIssueList(10);
				calculateBuyCodes();
				break;
			case 3:
				calculateBuyCodes();
				$('#track_desc').addClass('hide');
				updateCreatePartProjectParame();
				break;
			}

		});

		// 追号期数切换
		$('#issue_size').on('change', function (event) {
			event.preventDefault();
			queryTrackIssueList($(this).val());
		});

		// 追号头部 倍数 修改
		$('.br-details thead .br-zhui-c').on('change', function (event) {

			var checked = $(this)[0].checked;

			$(this).parents('.br-details').find('tbody .br-zhui-c').each(function (index, el) {
				el.checked = checked;
			});

			PL3.G_BUY.trackData.issueMutipleMap = {};

			$(this).parents('.br-details').find('tbody .br-zhui-c').each(function (index, el) {
				if (el.checked) {
					PL3.G_BUY.trackData.issueMutipleMap[$(this).attr('data-qihaoid')] = {
						qihao: $(this).attr('data-qi'),
						mutiple: $(this).parents('tr').find('.br-zhui-bei').val()
					};
				}
			});

			calculateBuyCodes();
		});

		// 追号总期的期数改变
		$('.br-details').on('change', 'tbody .br-zhui-c', function (event) {
			event.preventDefault();

			PL3.G_BUY.trackData.issueMutipleMap = {}; // clean
			$(this).parents('.br-details').find('tbody .br-zhui-c').each(function (index, el) {
				if (el.checked) {
					PL3.G_BUY.trackData.issueMutipleMap[$(this).attr('data-qihaoid')] = {
						qihao: $(this).attr('data-qi'),
						mutiple: $(this).parents('tr').find('.br-zhui-bei').val()
					};
				}
			});

			calculateBuyCodes();
		});

		// 追号总期的倍数改变
		$('.br-details thead .br-zhui-bei').on('change', function (event) {

			var val = parseInt($(this).val()) || 1;
			if (isNaN(val) || val < 1) {
				val = 1;
			} else {
				val = Math.ceil(val);
				(val > 9999) && (val = 9999);
			}
			$(this).val(val);

			var baseObj = $(this).parents('.br-details');
			baseObj.find('tbody .br-zhui-bei').val(val);
			baseObj.find('tbody .br-zhui-c').each(function (index, el) {
				el.checked = 'checked';
				PL3.G_BUY.trackData.issueMutipleMap[$(this).attr('data-qihaoid')] = {
					qihao: $(this).attr('data-qi'),
					mutiple: $(this).parents('tr').find('.br-zhui-bei').val()
				};
			});

			calculateBuyCodes();
		});

		// 追号每期的倍数改变
		$('.br-details tbody').on('change', '.br-zhui-bei', function (event) {

			var val = parseInt($(this).val()) || 1;
			var baseObj = $(this).parents('tr');
			var issueObj = baseObj.find('.br-zhui-c');

			if (isNaN(val) || val < 1) {
				val = 1;
			} else {
				val = Math.ceil(val);
				(val > 9999) && (val = 9999);
			}
			$(this).val(val);

			issueObj.attr('checked', 'checked');

			PL3.G_BUY.trackData.issueMutipleMap[issueObj.attr('data-qihaoid')] = {
				qihao: issueObj.attr('data-qi'),
				mutiple: baseObj.find('.br-zhui-bei').val()
			};

			calculateBuyCodes();
		});

		// 我要认购的份数
		$("#part_buy").on('change', function (event) {

			var val = parseInt($(this).val()) || 1;

			if (isNaN(val) || val < 1) {
				val = 1;
			} else {
				val = Math.ceil(val);
				(val > PL3.G_BUY.money) && (val = PL3.G_BUY.money);
			}
			$(this).val(val);

			updateCreatePartProjectParame();
		});

		// 我要提成比例
		$('#commission_percent').on('change', function (event) {

			var val = parseInt($(this).val()) || 0;
			var rengouPercent = Math.floor($('#part_buy_percent').html());

			if (val > rengouPercent) {
				$("#part_buy").val(Math.ceil($("#commission_percent").val() / 100 * PL3.G_BUY.money));
				updateCreatePartProjectParame();
			}

		});

		// 是否保底
		$('#has_part_aegis').on('change', function (event) {

			if ($(this)[0].checked) {
				$('#part_aegis_money').removeAttr('disabled');
				updateCreatePartProjectParame();
			} else {
				$('#part_aegis_money').attr('disabled', 'disabled');
				$('#part_aegis_money').val(0);
				$('#part_aegis_percent').html('0.00');
			}

		});

		// 保底金额修改
		$('#part_aegis_money').on('change', function (event) {

			var _aegisMoney = parseInt($(this).val()) || 0;
			$(this).val(_aegisMoney);
			updateCreatePartProjectParame();

		});

		// 方案保密设置
		$('.br-set-group').on('click', 'a', function (event) {

			$(this).parents('.br-set-group').find('a').removeClass('active');
			$(this).toggleClass('active');

			switch ($(this).html()) {
			case '截止后公开':
				PL3.G_BUY.partnerBuy.shareLevel = 1;
				break;
			case '立即公开':
				PL3.G_BUY.partnerBuy.shareLevel = 0;
				break;
			case '截止前对跟单人公开':
				PL3.G_BUY.partnerBuy.shareLevel = 2;
				break;
			}

		});

		/**
		 * 方案标题
		 * @param  {[type]} event) {		event.preventDefault();				PL3.G_BUY.partnerBuy.projectTitle [description]
		 * @return {[type]}        [description]
		 */
		$('#title').on('change', function (event) {

			var projectTitle = $(this).val();
			var projectTitleLength = projectTitle.length;
			var max = 20;

			PL3.G_BUY.partnerBuy.projectTitle = projectTitle;

			if (projectTitleLength >= max) {
				projectDescLength = max;
				PL3.G_BUY.partnerBuy.projectTitle = projectTitle.substring(0, max);
				$(this).val(PL3.G_BUY.partnerBuy.projectTitle);
			}
			$('#title_font_size').html(projectTitleLength);
		});

		$('#title').on('keyup', function (event) {

			var projectTitle = $(this).val();
			var projectTitleLength = projectTitle.length;
			var max = 20;

			PL3.G_BUY.partnerBuy.projectTitle = projectTitle;

			if (projectTitleLength >= max) {
				projectDescLength = max;
				PL3.G_BUY.partnerBuy.projectTitle = projectTitle.substring(0, max);
				$(this).val(PL3.G_BUY.partnerBuy.projectTitle);
			}
			$('#title_font_size').html(projectTitleLength);

		});

		/**
		 * 方案描述
		 * @param  {[type]} event) {		event.preventDefault();				PL3.G_BUY.partnerBuy.projectDescription [description]
		 * @return {[type]}        [description]
		 */
		$('#desc').on('change', function (event) {

			var projectDesc = $(this).val();
			var projectDescLength = projectDesc.length;
			var max = 200;

			PL3.G_BUY.partnerBuy.projectDescription = projectDesc;

			if (projectDescLength >= max) {
				projectDescLength = max;
				PL3.G_BUY.partnerBuy.projectDescription = projectDesc.substring(0, max);
				$(this).val(PL3.G_BUY.partnerBuy.projectDescription);
			}
			$('#desc_font_size').html(projectDescLength);
		});

		$('#desc').on('keyup', function (event) {
			event.preventDefault();
			/* Act on the event */
			var projectDesc = $(this).val();
			var projectDescLength = projectDesc.length;
			PL3.G_BUY.partnerBuy.projectDescription = projectDesc;
			var max = 200;
			if (projectDescLength >= max) {
				projectDescLength = max;
				PL3.G_BUY.partnerBuy.projectDescription = projectDesc.substring(0, max);
				$(this).val(PL3.G_BUY.partnerBuy.projectDescription);
			}
			$('#desc_font_size').html(projectDescLength);
		});

		// 是否保底
		$('#is_end_zhongjiang').on('change', function (event) {

			if ($(this)[0].checked) {
				$('#track_stop_money').removeAttr('disabled');
			} else {
				$('#track_stop_money').attr('disabled', 'disabled');
				$('#part_aegis_money').val(0);
			}

		});

		$('#track_stop_money').on('change', function () {

			var trackStopMoney = parseInt($(this).val()) || 3000;
			$(this).val(trackStopMoney);

		});

		//手动输入Mask
		$('#j-textarea-mask').on('click', function (event) {

			$(this).hide();
			$('#sd_number').addClass('focus');
			$('#sd_number')[0].focus();
		});

		// 更新手动输入注数
		$('#sd_number').on('keyup', function (event) {

			var iptCodes = $(this).val().replace(/，/ig, ',').split("\n");

			if (iptCodes.length === 0) {
				PL3.choose_zhushu.html(0);
				PL3.choose_money.html(0);
				PL3.chooseBuyBtn.removeClass('active');
				PL3.chooseBuyBtn.attr('disabled', 'disabled');
				APP.showTips('请输入投注号码');
				return;
			} else {
				PL3.chooseBuyBtn.addClass('active');
				PL3.chooseBuyBtn.removeAttr('disabled');
				PL3.choose_zhushu.html(iptCodes.length);
				PL3.choose_money.html(iptCodes.length * 2);
			}

		});

		/**
		 * 机选页面事件
		 */
		// 修改注数
		$('#decrease_bet_num_proxy').on('click', function (event) {
			event.preventDefault();
			/* Act on the event */
			var betNumObj = $("#bet_num_proxy");
			var currentBetNum = parseInt(betNumObj.val());
			currentBetNum--;
			if (currentBetNum < PL3.minBetNum) {
				PL3.G_BUY.proxyBuy.betNum = PL3.minBetNum;
			} else if (currentBetNum > PL3.maxBetNum) {
				PL3.G_BUY.proxyBuy.betNum = PL3.maxBetNum;
			} else {
				PL3.G_BUY.proxyBuy.betNum = currentBetNum;
			}
			betNumObj.val(PL3.G_BUY.proxyBuy.betNum);
			calculateProxyBuy();
		});

		$('#bet_num_proxy').on('change', function () {

			var currentBetNum = parseInt($(this).val()) || 0;

			if (currentBetNum < PL3.minBetNum) {
				PL3.G_BUY.proxyBuy.betNum = PL3.minBetNum;
			} else if (currentBetNum > PL3.maxBetNum) {
				PL3.G_BUY.proxyBuy.betNum = PL3.maxBetNum;
			} else {
				PL3.G_BUY.proxyBuy.betNum = currentBetNum;
			}

			$(this).val(PL3.G_BUY.proxyBuy.betNum);
			calculateProxyBuy();

		});

		$('#increase_bet_num_proxy').on('click', function (event) {

			var betNumObj = $("#bet_num_proxy");
			var currentBetNum = parseInt(betNumObj.val());

			currentBetNum++;

			if (currentBetNum < PL3.minBetNum) {
				PL3.G_BUY.proxyBuy.betNum = PL3.minBetNum;
			} else if (currentBetNum > PL3.maxBetNum) {
				PL3.G_BUY.proxyBuy.betNum = PL3.maxBetNum;
			} else {
				PL3.G_BUY.proxyBuy.betNum = currentBetNum;
			}

			betNumObj.val(PL3.G_BUY.proxyBuy.betNum);
			calculateProxyBuy();

		});

		// 修改倍数
		$('#decrease_mutiple_proxy').on('click', function (event) {

			var betMultipleObj = $("#mutiple_proxy");
			var currentMultipleNum = parseInt(betMultipleObj.val());

			currentMultipleNum--;

			if (currentMultipleNum < PL3.minMultiple) {
				PL3.G_BUY.proxyBuy.multiple = PL3.minMultiple;
			} else if (currentMultipleNum > PL3.maxMultiple) {
				PL3.G_BUY.proxyBuy.multiple = PL3.maxMultiple;
			} else {
				PL3.G_BUY.proxyBuy.multiple = currentMultipleNum;
			}

			betMultipleObj.val(PL3.G_BUY.proxyBuy.multiple);
			calculateProxyBuy();

		});

		$('#mutiple_proxy').on('change', function () {

			var currentMultipleNum = parseInt($(this).val()) || 0;

			if (currentMultipleNum < PL3.minMultiple) {
				PL3.G_BUY.proxyBuy.multiple = PL3.minMultiple;
			} else if (currentMultipleNum > PL3.maxMultiple) {
				PL3.G_BUY.proxyBuy.multiple = PL3.maxMultiple;
			} else {
				PL3.G_BUY.proxyBuy.multiple = currentMultipleNum;
			}

			$(this).val(PL3.G_BUY.proxyBuy.multiple);
			calculateProxyBuy();
		});

		$('#increase_mutiple_proxy').on('click', function (event) {

			var betMultipleObj = $("#mutiple_proxy");
			var currentMultipleNum = parseInt(betMultipleObj.val());

			currentMultipleNum++;
			if (currentMultipleNum < PL3.minMultiple) {
				PL3.G_BUY.proxyBuy.multiple = PL3.minMultiple;
			} else if (currentMultipleNum > PL3.maxMultiple) {
				PL3.G_BUY.proxyBuy.multiple = PL3.maxMultiple;
			} else {
				PL3.G_BUY.proxyBuy.multiple = currentMultipleNum;
			}

			betMultipleObj.val(PL3.G_BUY.proxyBuy.multiple);
			calculateProxyBuy();

		});

		// 修改注数
		$('#decrease_qihao_num_proxy').on('click', function (event) {

			var betIssueNumObj = $("#qihao_num_proxy");
			var currentIssueNum = parseInt(betIssueNumObj.val());

			currentIssueNum--;

			if (currentIssueNum < PL3.minIssueNum) {
				PL3.G_BUY.proxyBuy.issueSize = PL3.minIssueNum;
			} else if (currentIssueNum > PL3.maxIssueNum) {
				PL3.G_BUY.proxyBuy.issueSize = PL3.maxIssueNum;
			} else {
				PL3.G_BUY.proxyBuy.issueSize = currentIssueNum;
			}

			betIssueNumObj.val(PL3.G_BUY.proxyBuy.issueSize);
			calculateProxyBuy();

		});

		$('#qihao_num_proxy').on('change', function () {

			var currentIssueNum = parseInt($(this).val()) || 0;

			if (currentIssueNum < PL3.minIssueNum) {
				PL3.G_BUY.proxyBuy.issueSize = PL3.minIssueNum;
			} else if (currentIssueNum > PL3.maxIssueNum) {
				PL3.G_BUY.proxyBuy.issueSize = PL3.maxIssueNum;
			} else {
				PL3.G_BUY.proxyBuy.issueSize = currentIssueNum;
			}

			$(this).val(PL3.G_BUY.proxyBuy.issueSize);
			calculateProxyBuy();

		});

		$('#increase_qihao_num_proxy').on('click', function (event) {

			var betIssueNumObj = $("#qihao_num_proxy");
			var currentIssueNum = parseInt(betIssueNumObj.val());

			currentIssueNum++;
			if (currentIssueNum < PL3.minIssueNum) {
				PL3.G_BUY.proxyBuy.issueSize = PL3.minIssueNum;
			} else if (currentIssueNum > PL3.maxIssueNum) {
				PL3.G_BUY.proxyBuy.issueSize = PL3.maxIssueNum;
			} else {
				PL3.G_BUY.proxyBuy.issueSize = currentIssueNum;
			}

			betIssueNumObj.val(PL3.G_BUY.proxyBuy.issueSize);
			calculateProxyBuy();

		});

		//////////////////////////function/////////////////////////////////////////

		/**
		 * 更新购买类型 自购1 追号2 合买3
		 * @return null
		 */
		function updateCreatePartProjectParame() {
			switch (PL3.G_BUY.buyType) {
			case 1:
				break;
			case 2:
				break;
			case 3:

				if (PL3.G_BUY.money > 0) {

					PL3.G_BUY.partnerBuy.partBuyMoney = parseInt($('#part_buy').val());

					var partBuyPercent = PL3.G_BUY.partnerBuy.partBuyMoney / PL3.G_BUY.money * 100;

					$('#part_buy_percent').html(partBuyPercent.toFixed(2));

					$('#commission_percent').val(function (index, value) {
						return ($(this).val() > 0 && $(this).val() > partBuyPercent) ? Math.floor(partBuyPercent) : $(this).val();
					});

					PL3.G_BUY.partnerBuy.commissionPercent = parseInt($('#commission_percent').val());

					var minBaodiMoney = Math.ceil(PL3.G_BUY.money * 0.2);
					var lessPartBuyMoney = PL3.G_BUY.money - PL3.G_BUY.partnerBuy.partBuyMoney;

					$('#part_aegis_money').val(function (index, value) {
						if ($('#has_part_aegis')[0].checked && $(this).val() < minBaodiMoney) {
							return minBaodiMoney;
						}
						return $(this).val() > lessPartBuyMoney ? lessPartBuyMoney : $(this).val();
					});

					var aegisMoney = parseInt($('#part_aegis_money').val());

					PL3.G_BUY.partnerBuy.partAegisMoney = aegisMoney;

					$('#part_aegis_percent').html((aegisMoney / PL3.G_BUY.money * 100).toFixed(2));
					$('#buy_money_tips').html(PL3.G_BUY.partnerBuy.partBuyMoney);
					$('#aegis_money_tips').html(aegisMoney);
					$('#total_money_tips').html(aegisMoney + PL3.G_BUY.partnerBuy.partBuyMoney);

				} else {

					$('#part_buy_percent').html(0);
					$('#buy_money_tips').html(0);
					$('#aegis_money_tips').html(0);
					$('#total_money_tips').html(0);

				}
				break;
			}
		}

		/**
		 * 计算手选号码注数
		 * 更新CHOOSE注数，金额
		 * 更新添加按钮Active状态，更新注数，金额 html
		 * @return {[type]} [description]
		 */
		function calculateChooseCodes() {
			// 投注号码 只有 直选常规投注的时候才 使用 tenCodes,digitalCodes
			// 只有 拖胆区时才使用dan,tuo
			// 除了胆拖和直选常规投注其他都用normal 作为 投注数组以获取 投注注数
			var hundredCodes = '';
			var tenCodes = '';
			var digitalCodes = '';
			var normal = '';
			var dan = '';
			var tuo = '';

			// 类型
			var b = PL3.nav.big;
			var s = PL3.nav.small;
			var zhushu = 0;

			PL3.G_CHOOSE.zhushu = 0;
			PL3.G_CHOOSE.money = 0;

			if (PL3.G_CHOOSE.codes.length === 0) {
				return;
			} else {

				if (s === 'dt') {
					dan = PL3.G_CHOOSE.codes[0][0] || [];
					tuo = PL3.G_CHOOSE.codes[0][1] || [];
				} else {
					normal = PL3.G_CHOOSE.codes[0][0] || [];
				}

			}
			// PL3--直选--常规投注
			if (b === 'zx' && s === 'cgtz') {
				for (var i = 0, len = PL3.G_CHOOSE.codes.length; i < len; i++) {
					hundredCodes = PL3.G_CHOOSE.codes[i][0] || [];
					tenCodes = PL3.G_CHOOSE.codes[i][1] || [];
					digitalCodes = PL3.G_CHOOSE.codes[i][2] || [];
					if (hundredCodes.length > 0 && tenCodes.length > 0 && digitalCodes.length > 0) {
						zhushu = PL3.getZhiXuanZhushu(hundredCodes, tenCodes, digitalCodes);
					}
				}
			}

			// PL3--直选6--常规投注
			if (b === 'zx6' && s === 'cgtz') {
				zhushu = PL3.getZuXuan6NormalZhushu(normal);
			}

			// PL3--直选3--常规投注
			if (b === 'zx3' && s === 'cgtz') {
				zhushu = PL3.getZuXuan3NormalZhushu(normal);
			}

			// PL3--直选--和值
			if (b === 'zx' && s === 'hz') {
				zhushu = PL3.getZhiXuanHeZhiZhushu(normal);
			}

			// PL3--直选3--和值
			if (b === 'zx3' && s === 'hz') {
				zhushu = PL3.getZuXuan3HeZhiZhushu(normal);
			}

			// PL3--直选6--和值
			if (b === 'zx6' && s === 'hz') {
				zhushu = PL3.getZuXuan6HeZhiZhushu(normal);
			}

			// PL3--直选3--胆拖
			if (b === 'zx3' && s === 'dt') {
				zhushu = PL3.getZuXuan3DanTuoZhushu(dan, tuo);
			}

			// PL3--直选6--胆拖
			if (b === 'zx6' && s === 'dt') {
				zhushu = PL3.getZuXuan6DanTuoZhushu(dan, tuo);
			}

			PL3.G_CHOOSE.zhushu += zhushu;
			PL3.G_CHOOSE.money += zhushu * 2;

			onCalculateChooseCodesEnd();

		}

		function onCalculateChooseCodesEnd() {

			if (PL3.G_CHOOSE.zhushu > 0) {
				PL3.chooseBuyBtn.addClass('active');
				PL3.chooseBuyBtn.removeAttr('disabled');
			} else {
				PL3.chooseBuyBtn.removeClass('active');
				PL3.chooseBuyBtn.attr('disabled', 'disabled');
			}

			PL3.choose_zhushu.html(PL3.G_CHOOSE.zhushu);
			PL3.choose_money.html(PL3.G_CHOOSE.money);

		}

		/**
		 * 计算已选中的投注号码
		 */
		function calculateBuyCodes() {

			var zhushu = 0;

			$('#code_list .money').each(function (index, el) {
				var m = Number(_.escape($.trim($(this).html())));
				if (_.isNumber(m)) {
					zhushu += m;
				} else {
					return;
				}
			});

			zhushu = zhushu / 2;

			PL3.G_BUY.zhushu = zhushu;
			PL3.G_BUY.money = 2 * zhushu * PL3.G_BUY.mutiple;

			$('#buy_zhushu').html(PL3.G_BUY.zhushu);
			$('#project_price').html(PL3.G_BUY.money);
			$('#track_issue_num').html(0);
			$('#track_money').html(0);

			// 检测购买注数 是否满足条件
			if (Object.size(PL3.G_BUY.trackData.issueMutipleMap) > 0) {

				var trackIssueSize = 0;
				PL3.G_BUY.money = 0;

				for (var qihaoId in PL3.G_BUY.trackData.issueMutipleMap) {
					trackIssueSize++;
					var currentIssueMoney = 2 * zhushu * PL3.G_BUY.trackData.issueMutipleMap[qihaoId].mutiple;
					PL3.G_BUY.money += currentIssueMoney;
					$('.br-details').find('tbody .br-zhui-c').each(function (index, el) {
						if ($(this).attr('data-qihaoid') == qihaoId) {
							$(this).parents('tr').find('.j-money').html(currentIssueMoney);
							return;
						}
					});
				}

				$('#track_issue_num').html(trackIssueSize);
				$('#track_money').html(PL3.G_BUY.money);

			}

			// 切换 购买按钮样式
			if (PL3.G_BUY.money > 0) {
				$('#buy-submit').removeAttr("disabled");
			} else {
				$('#buy-submit').attr("disabled", "disabled");
			}

		}

		function reflectChooseCode(buyIndex) {

			PL3.ballAear.find('.j-num-group a').removeClass('active');

			var codes = {};
			for (var index in PL3.G_BUY.codes) {
				if (PL3.G_BUY.codes[index].key == buyIndex) {
					codes = PL3.G_BUY.codes[index].value.concat();
					break;
				}
			}

			PL3.G_CHOOSE.init();
			PL3.G_CHOOSE.codes[0] = codes;

			var baseobj = PL3.ballAear.find('.j-row-code');

			for (var i = 0; i < codes.length; i++) {
				var placeArr = codes[i];
				var len = placeArr.length;
				baseobj.each(function (index, el) {
					if (index == i) {
						// alert(index);
						for (var m = 0; m < len; m++) {
							$(this).find('.j-num-group a').each(function (index) {
								if (parseInt($(this).html()) == placeArr[m]) {
									$(this).addClass('active');
								}
							});
						}
					}
				});
			}

			calculateChooseCodes();

		}

		/**
		 * 读取追号期号集合
		 * @param  {[type]} num [description]
		 * @return {[type]}     [description]
		 */
		function queryTrackIssueList(num) {
			var html = '';
			$('.br-details thead .br-zhui-bei').val(1);
			$.ajax({
					url: '/lottery/digital/query-track-issue/' + PL3.G_BUY.lotyName + '?num=' + num,
					type: 'GET',
					dataType: 'json',
					// data: {param1: 'value1'},
				})
				.done(function (data) {
					if (data.retCode == 100000) {
						for (var i = 0; i < data.retData.length; i++) {
							var m = i + 1;
							var unitPrice = 2 * PL3.G_BUY.zhushu;
							PL3.G_BUY.trackData.issueMutipleMap[data.retData[i].id] = ({
								qihao: data.retData[i].qihao,
								mutiple: 1
							});
							html += '<tr><td>' + m + '</td><td><input type="checkbox" class="br-zhui-c" data-qihaoid="' + data.retData[i].id + '"data-qi="' + data.retData[i].qihao + '" checked="">' + data.retData[i].qihao + '期</td><td><input type="text" class="br-input br-zhui-bei" value="1">倍</td><td><span class="j-money">' + unitPrice + '</span>元</td><td>' + data.retData[i].awardTime.slice(0, 10) + '<span class="ml15">' + data.retData[i].awardTime.slice(10) + '</span></td></tr>';
						};
						//
					} else {
						html = '<tr><td colspan="5">系统繁忙， 请稍候再试</td></tr>';
					}
					$('#track_issue_list').html(html);
					calculateBuyCodes();
				})
				.fail(function () {
					html = '<tr><td colspan="5">系统繁忙， 请稍候再试</td></tr>';
					$('#track_issue_list').html(html);
				});
		};

		/**
		 * 机选计算
		 *
		 * @return {[type]} [description]
		 */
		function calculateProxyBuy() {

			$('#buy_bet_num_proxy').html(PL3.G_BUY.proxyBuy.betNum);
			$('#buy_multiple_proxy').html(PL3.G_BUY.proxyBuy.multiple);
			$('#buy_issue_num_proxy').html(PL3.G_BUY.proxyBuy.issueSize);

			PL3.G_BUY.money = 2 * PL3.G_BUY.proxyBuy.betNum * PL3.G_BUY.proxyBuy.multiple * PL3.G_BUY.proxyBuy.issueSize;
			PL3.G_BUY.mutiple = PL3.G_BUY.proxyBuy.multiple;

			$('#buy_money_proxy').html(PL3.G_BUY.money);
			if (PL3.G_BUY.money > 0) {
				$('#buy_button_proxy').removeAttr("disabled");
			} else {
				$('#buy_button_proxy').attr("disabled", "disabled");
			}

		}

		/**
		 * 投注前格式化 投注号码
		 * @return {String} 投注号码
		 */
		function getFormatBuyCodes() {

			var codeArr = [];
			var unitCodeArr = [];
			var dantuoArr = [];
			var s = PL3.nav.small;
			var b = PL3.nav.big;
			var returnCodes = null;

			var isMore = true;

			if (s === 'cgtz' && b !== 'zx') {
				isMore = false;
			}

			if (s === 'hz') {
				isMore = false;
			}

			if (isMore) {
				for (var i = 0; i < PL3.G_BUY.codes.length; i++) {
					unitCodeArr = [];
					for (var m = 0; m < PL3.G_BUY.codes[i].value.length; m++) {
						unitCodeArr.push(PL3.G_BUY.codes[i].value[m].join(''));
					};
					codeArr.push(unitCodeArr.join(','));
				};
				returnCodes = codeArr.join('$');
			} else {
				codeArr.push(PL3.G_BUY.codes[0].value[0].join(','));
				returnCodes = codeArr.join('$');
			}

			if(s==='dt'){
				dantuoArr.push(PL3.G_BUY.codes[0].value[0].join(','));
				dantuoArr.push(PL3.G_BUY.codes[0].value[1].join(','));
				returnCodes = dantuoArr.join('@');
			}

			return returnCodes;
		}

		/**
		 * 购买
		 * @param  {Boolean} isAgreen 是否同意投注规则
		 * @return {null}
		 */
		function buy(isAgreen) {

			var url = '';
			var codeArr = getFormatBuyCodes();
			var comfirmHtml = '';
			var postIssueParameter = [];

			PL3.G_BUY.payMoney = PL3.G_BUY.money;

			if (isAgreen === false) {
				APP.showTips("请先阅读并同意《委托投注规则》后才能继续");
				return;
			}

			var parameter = {
				zhushu: PL3.G_BUY.zhushu,
				beishu: PL3.G_BUY.mutiple,
				codes: codeArr,
				time: $.now(),
			};

			switch (PL3.G_BUY.buyType) {
			case 1:
				url = '/lottery/digital/buy-self/' + PL3.G_BUY.lotyName + '/' + PL3.playName;
				parameter.qihaoId = PL3.G_BUY.qihaoId;
				parameter.qihao = PL3.G_BUY.qihao;
				comfirmHtml = makeConfirmHtml(1, PL3.G_BUY.lotyCNName, parameter.qihao, PL3.G_BUY.zhushu, PL3.G_BUY.mutiple, PL3.G_BUY.money, 0, 0, 0, 0);
				break;
			case 2:
				url = '/lottery/digital/buy-track/' + PL3.G_BUY.lotyName + '/' + PL3.playName;

				for (var qihaoId in PL3.G_BUY.trackData.issueMutipleMap) {
					postIssueParameter.push(qihaoId + '|' + PL3.G_BUY.trackData.issueMutipleMap[qihaoId].qihao + '|' + PL3.G_BUY.trackData.issueMutipleMap[qihaoId].mutiple);
				}
				if (postIssueParameter.length < 1) {
					APP.showTips("追号最少购买一期");
					return;
				}
				if ($('#is_end_zhongjiang')[0].checked) {
					PL3.G_BUY.trackData.trackStopMoney = $('#track_stop_money').val();
				}
				parameter.endminmoney = PL3.G_BUY.trackData.trackStopMoney;
				parameter.zhuihaoqihao = postIssueParameter;
				comfirmHtml = makeConfirmHtml(2, PL3.G_BUY.lotyCNName, 0, 0, 0, 0, 0, 0, postIssueParameter.length, PL3.G_BUY.money);
				break;
			case 3:

				url = '/lottery/digital/buy-together/' + PL3.G_BUY.lotyName + '/' + PL3.playName;

				parameter.qihaoId = PL3.G_BUY.qihaoId;
				parameter.qihao = PL3.G_BUY.qihao;
				parameter.title = PL3.G_BUY.partnerBuy.projectTitle;
				parameter.textarea = PL3.G_BUY.partnerBuy.projectDescription;
				parameter.rengouMoney = PL3.G_BUY.partnerBuy.partBuyMoney;
				parameter.baodiText = PL3.G_BUY.partnerBuy.partAegisMoney;
				parameter.extraPercent = PL3.G_BUY.partnerBuy.commissionPercent;
				parameter.set = PL3.G_BUY.partnerBuy.shareLevel;

				PL3.G_BUY.payMoney = parameter.rengouMoney + parameter.baodiText;

				if (parameter.rengouMoney < 1) {
					APP.showTips("合买至少认购一元");
					return;
				}

				comfirmHtml = makeConfirmHtml(3, PL3.G_BUY.lotyCNName, parameter.qihao, parameter.zhushu, parameter.beishu, PL3.G_BUY.money, parameter.rengouMoney, parameter.baodiText, 0, 0);

				break;
			case 4:

				url = '/lottery/digital/buy-rank/' + PL3.G_BUY.lotyName + '/' + PL3.playName;

				parameter.zhushu = PL3.G_BUY.proxyBuy.betNum;
				parameter.beishu = PL3.G_BUY.proxyBuy.multiple;
				parameter.qishu = PL3.G_BUY.proxyBuy.issueSize;
				PL3.G_BUY.payMoney = PL3.G_BUY.money = parameter.zhushu*parameter.beishu*parameter.qishu
				comfirmHtml = makeConfirmHtml(2, PL3.G_BUY.lotyCNName, 0, 0, 0, 0, 0, 0, parameter.qishu, PL3.G_BUY.money);

				break;
			}

			$.ajax({
					url: '/account/islogin',
					type: 'get',
					dataType: 'json',
				})
				.done(function (D) {
					if (D.retCode === 100000) {
						if (Number(D.retData.money.replace(/,/g, '')) >= PL3.G_BUY.payMoney) {
							APP.showTips({
								html: comfirmHtml,
								title: '投注确认'
							});
							$('#buyConfirm').on('click', function (event) {
								$.ajax({
										url: url,
										type: 'POST',
										dataType: 'json',
										data: parameter,
									})
									.done(function (data) {
										buySuccess(data.retCode, data.retMsg, data.retData.projectNo, data.retData.trackId, PL3.G_BUY.payMoney, PL3.G_BUY.lotyName, PL3.G_BUY.lotyCNName);
									})
									.fail(function () {
										buyFailure(PL3.G_BUY.lotyName, PL3.G_BUY.lotyCNName);
									});
							});
						} else {
							APP.showTips('<div class="tipbox"><p>您的余额不足,购买失败！</p><p class="last"><a href="/account/top-up" class="btn btn-danger" target="_blank">立即充值</a></p></div>');
						}
					} else {
						APP.handRetCode(D.retCode, D.retMsg);
					}
				});
		};

		function makeConfirmHtml(buyType, LotyCNName, issueNum, betNum, mutiple, projectPrice, buyPrice, aegisPrice, trackSize, trackMoney) {
			var commHtml = '<div class="frbox"><img src="' + staticHostURI + '/front_images/fail.png" alt="success" class="icon"><div class="text">';
			switch (buyType) {
			case 1: // 自购
				commHtml += '<p>' + LotyCNName + ' 第<span>' + issueNum + '</span>期</p><p>共<span>' + betNum + '</span>注, 投注<span>' + mutiple + '</span>倍</p><p>本次需支付<span class="fc-3">' + projectPrice.toFixed(2) + '</span>元</p>';
				break;
			case 2: // 追号
				commHtml += '<p>追号<span>' + trackSize + '</span>期</p><p>本次需支付<span class="fc-3">' + trackMoney + '</span>元</p>';
			case 4: // 机选
				break;
			case 3: // 合买
				if (aegisPrice > 0) {
					commHtml += '<p>' + LotyCNName + ' 第<span>' + issueNum + '</span>期</p><p>方案总金额<span class="fc-3">' + projectPrice.toFixed(2) + '</span>元</p><p>您认购<span>' + buyPrice.toFixed(2) + '</span>元, 保底<span>' + aegisPrice.toFixed(2) + '</span>元</p><p>共需支付<span class="fc-3">' + (buyPrice + aegisPrice).toFixed(2) + '</span>元</p>';
				} else {
					commHtml += '<p>' + LotyCNName + ' 第<span>' + issueNum + '</span>期</p><p>方案总金额<span class="fc-3">' + projectPrice.toFixed(2) + '</span>元</p><p>您认购<span>' + buyPrice.toFixed(2) + '</span>元</p><p>共需支付<span class="fc-3">' + (buyPrice + aegisPrice).toFixed(2) + '</span>元</p>';
				}
				break;
			}
			commHtml += '<div class="btns"><button class="btn btn-danger" id="buyConfirm">确定</button><button class="btn btn-gray" data-dismiss="modal">取消</button></div></div></div>';
			return commHtml;
		}

		/**
		 * 切换购买方式清空数据
		 * @return {[type]} [description]
		 */
		function clean4CutBuyType() {

			var s = PL3.nav.small;
			if (s === 'up') {
				$('#choose_to_buy').attr('data-add', '2');
			} else {
				$('#choose_to_buy').attr('data-add', '1');
			}

			PL3.ballAear.find('.j-num-group a').removeClass('active');
			$('#sd_number').val('');
			$('#buy-submit').attr("disabled", "disabled");
			$(".br-zhu-l").html('');
			$('#sd-list').html('');
			$('#project_mutiple').val(1);
			PL3.choose_zhushu.html(0);
			PL3.choose_money.html(0);

			PL3.G_CHOOSE.init();
			calculateChooseCodes();
			PL3.G_BUY.init();
			calculateBuyCodes();
			updateCreatePartProjectParame();

		}

		function buySuccess(retCode, retMsg, projectNo, trackId, buyMoney, lotyName, lotyCNName) {
			if (retCode == 100000) {
				debugger
				store.clear();
				store.set('lotyName', lotyName);
				store.set('lotyCNName', lotyCNName);
				store.set('payMoney', buyMoney);
				store.set('projectNo', projectNo);
				store.set('trackId', trackId);
				window.location.href = '/html/lottery/trade/success.html';
			} else {
				APP.handRetCode(retCode, retMsg);
			}
		}

		function buyFailure(lotyName, lotyCNName) {
			store.clear();
			store.set('lotyName', lotyName);
			store.set('lotyCNName', lotyCNName);
			window.location.href = '/html/lottery/trade/fail.html';
		}
	});

});