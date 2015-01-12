define(['jquery'], function($) {
	'use strict';
	var Yuncai = {};
	var Do = null;

	//Do.js没有加载的情况下，将Do作为执行函数
	Do = (typeof Do === "undefined") ? function(b) {
		setTimeout(b, 0)
	} : Do;

	/* 图表
	 * @param url 图表数据url
	 * @param id 容器id
	 * @param width 容器宽度
	 * @memberof Yuncai
	 * @name chart
	 */
	Yuncai.chart = function(option) {
		$.get(option.url, function(data) {
			var WIDTH = option.width || 980; //容器宽度
			var data = eval("(" + data + ")");
			var arr = []; //图表插件数组 arr = [{x:毫秒值, y:趋势值, marker:{...}}]
			var hiArr = []; //命中指数数组
			var wrtrendObj = data.wrtrend; //趋势数据对象
			var trendObj = data.trend; //趋势数据对象
			var hiObj = data.hi; //命中指数对象
			var hitObj = data.hit; //中奖数据对象
			var min = data.mintrend; //最小趋势值
			var max = data.maxtrend; //最大趋势值
			var minHi = data.minHI; //最大趋势值
			var avg = data.avg; //平均值博
			var maxh = data.maxh //命中指数最大值
			var minh = data.minh //命中指数最小值
			var maxw = data.maxw //周期值博最大值
			var minw = data.minw //周期值博最小值
			var mintrend = data.min;
			var maxtrend = data.max;
			var yMin = data.miny; //(min > minh) ? minh:min;
			var yMax = data.maxy; //(max > maxh) ? max:maxh;
			var nameRange = {
				'趋势指数': '(历史范围：' + minw + ' - ' + maxw + ')',
				'命中指数': '(历史范围：' + Number(minh * 100).toFixed(2) + ' - ' + Number(maxh * 100).toFixed(2) + ')'
			}
			var betResult = {
				'0': '<span style="color:#cccccc">未中</span>',
				'1': '<span style="color:yellow">命中</span>',
				'2': '<span style="color:#ff0033">取消</span>'
			}; //投注结果
			var markerColor = {
				'0': '#000000',
				'1': '#0066cc',
				'2': '#ff0033'
			}; //marker颜色值(0:未中， 1：中奖， 2：取消)
			var markerColor1 = {
				'0': '#000000',
				'1': 'yellow',
				'2': '#ff0033'
			}; //marker颜色值(0:未中， 1：中奖， 2：取消)
			var markerRadius = {
					'0': '0',
					'1': '3',
					'2': '3'
				} //marker radius大小(0:未中， 1：中奖， 2：取消)
			var markerSymbol = {
					'0': null, //'url(http://static2.yuncai.com/images/client/trade/line_red.png)' //不显示未中奖
					'1': 'circle', //url(http://static.365mao.com/images/client/trade/line_blue.png)
					'2': 'circle'
				} //symbol背景图(0:未中， 1：中奖， 2：取消) //url(http://static.365mao.com/images/client/trade/line_red.png)
			var markerSymbol1 = {
				'0': null,
				'1': 'diamond',
				'2': 'diamond'
			}
			var xLine = []; //竖线
			var cateArr = []; //x轴字段
			var second = 1291161600000; //起始2012-10-01，只要为毫秒的日期即可
			var labelObj = {}; //x轴字段对象
			var resultObj = {}; //显示投注情况
			var qszsObj = {};
			var mzzsObj = {};

			var yLabel = ((maxw - minw) > (maxh - minh)) ? (maxw - minw) : (maxh - minh);

			for (var k in trendObj) {
				var _obj = {}; //临时存储对象
				var _hiObj = {}; //命中指数临时存储
				var kVal = hitObj[k]; //日期键
				//var n=k.split("-");
				//_obj.x = Date.UTC(n[0],n[1]-1,n[2]); //获取毫秒
				_obj.x = second = second + 1000; //每次添加一秒
				_obj.y = Number(trendObj[k]);
				if (0 == kVal) {
					_obj.marker = null; //未中奖不输出marker
				} else {
					_obj.marker = {};
					_obj.marker.enabled = true;
					_obj.marker.fillColor = markerColor[kVal];
					_obj.marker.radius = markerRadius[kVal];
					_obj.marker.symbol = markerSymbol[kVal];
					_obj.marker.states = {};
					_obj.marker.states.hover = {};
					_obj.marker.states.hover.fillColor = markerColor[kVal];
				}
				arr.push(_obj);

				//命中指数
				_hiObj.x = second //每次添加一秒
				_hiObj.y = Number(hiObj[k]);
				if (0 == kVal) {
					_hiObj.marker = null; //未中奖不输出marker
				} else {
					_hiObj.marker = {};
					_hiObj.marker.enabled = true;
					_hiObj.marker.fillColor = markerColor1[kVal];
					_hiObj.marker.radius = markerRadius[kVal];
					_hiObj.marker.symbol = markerSymbol[kVal];
					_hiObj.marker.states = {};
					_hiObj.marker.states.hover = {};
					_hiObj.marker.states.hover.fillColor = markerColor1[kVal];
				}
				hiArr.push(_hiObj);

				//存储x轴竖线
				var _xObj = {};
				_xObj.value = _obj.x;
				_xObj.width = 0.7;
				_xObj.color = markerColor[kVal];
				_xObj.dashStyle = 'solid';
				_xObj.zIndex = 1;
				xLine.push(_xObj);

				//存储x轴字段
				//cateArr.push(k.replace(/\-/g, '').substring(2));
				labelObj[second + ''] = k.replace(/\-/g, '').substring(2); //存储x字段
				resultObj[second + ''] = betResult[kVal];
				qszsObj[second + ''] = wrtrendObj[k];
				mzzsObj[second + ''] = hiObj[k] * 100;
			}
			$('.j-avg').html(parseFloat(avg).toFixed(2)); //给描述节点添加数值
			//创建图表
			window.chart = new Highcharts.StockChart({
				chart: {
					renderTo: option.id, //容器id
					width: WIDTH, //宽度
					zoomType: 'x' //放大镜效果
				},
				//曲线颜色
				colors: [
					'#ff0033',
					'yellow'
				],
				//版权信息
				credits: {
					enabled: false
				},
				//按钮，输入框
				rangeSelector: {
					selected: 3, //默认选择范围，从0开始
					inputEnabled: false, //隐藏日期输入框
					labelStyle: {
						visibility: 'hidden',
						fontSize: 0
					},
					buttons: [{
						type: 'second', //按天数输出，每月为30天
						count: 90,
						text: '90'
					}, {
						type: 'second',
						count: 180,
						text: '180'
					}, {
						type: 'second',
						count: 360,
						text: '360'
					}, {
						type: 'all',
						text: 'All'
					}]
				},
				//标题
				title: {
					align: 'right',
					margin: -28,
					//text : '最小命中指数：'+minHi+'；最大趋势指数：'+max+'； 最小趋势指数：'+min,
					text: '平均值博（' + parseFloat(avg).toFixed(2) + '）',
					style: {
						fontSize: '12px',
						color: 'yellow'
					}
				},
				/*subtitle: {
					y: 14,
					x: 180,
					align: 'left',
					text: '<a target="_blank" href="/trade/super/newhistory?day=30&type=0&model_id='+option.modelId+'&project_issue='+option.projectIssue+'&t='+$.now()+'">查看历史数据</a>'

				},*/
				//缩略图
				navigator: {
					enabled: false,
					height: 16,
					xAxis: { //缩略图日期格式
						labels: {
							formatter: function() {
								//return ((new Date(this.value)).getFullYear()+'').substring(2)+((new Date(this.value)).getMonth()+1)+(new Date(this.value)).getDate();
								return labelObj[this.value]
							}
						}
					}
				},
				//曲线样式
				plotOptions: {
					line: {
						lineWidth: 1
					},
					series: {
						states: {
							hover: {
								enabled: true,
								lineWidth: 1
							}
						},
						//highstock,限制显示的点数，待升级（2.0后可以设为0关闭此参数，默认为1000）
						turboThreshold: 2000
					},
					zIndex: 1
				},
				//marker提示信息
				tooltip: {
					crosshairs: [true, true], //显示marker的x和y轴
					formatter: function() { //marker提示层
						//var s = '<b>期号：</b>'+ (Highcharts.dateFormat('%Y%m%d', this.x)).substring(2);
						var s = '<b>期　　号：</b>' + labelObj[this.x] + ' [' + resultObj[this.x] + ']';
						/*$.each(this.points, function(i, point) {
							s += '<br/><b>'+this.series.name+'：</b>'+ Number(point.y * 100).toFixed(2) +' '+ nameRange[this.series.name];
						});*/
						s += '<br/><b>趋势指数：</b><span style="color:#ff0033;">' + Number(qszsObj[this.x]).toFixed(2) + '</span> ' + nameRange['趋势指数'];
						s += '<br/><b>命中指数：</b><span style="color:yellow;">' + Number(mzzsObj[this.x]).toFixed(2) + '</span> ' + nameRange['命中指数'];
						return s;
					}
				},
				//x轴
				xAxis: {
					//type: 'datetime',
					//categories: cateArr,
					tickmarkPlacement: 'on',
					dateTimeLabelFormats: { //图表日期格式
						second: '%Y-%m-%d<br/>%H:%M:%S',
						minute: '%Y-%m-%d<br/>%H:%M',
						hour: '%Y-%m-%d<br/>%H:%M',
						day: '%Y<br/>%m-%d',
						week: '%Y<br/>%m-%d',
						month: '%Y-%m',
						year: '%Y'
					},
					labels: {
						formatter: function() {
							//return ((new Date(this.value)).getFullYear()+'').substring(2)+((new Date(this.value)).getMonth()+1)+(new Date(this.value)).getDate();
							return labelObj[this.value]
						}
					},
					plotLines: xLine
				},
				//y轴线，显示平均值博
				yAxis: {
					plotLines: [{
						value: avg,
						width: 0.7,
						color: 'yellow',
						dashStyle: 'solid',
						zIndex: 2,
						label: {

						}
					}],
					labels: {
						align: 'right',
						y: 5,
						x: -5
					},
					showLastLabel: true,
					tickPositions: [(Number(yMin) - 0.05).toFixed(2), (Number(yMin) + (yMax - yMin) / 3).toFixed(2), (Number(yMin) + (yMax - yMin) / 3 * 2).toFixed(2), (Number(yMax) + 0.05).toFixed(2)]
				},
				//图表数据
				series: [{
					name: '趋势指数',
					data: arr, //图表数据
					shadow: false,
					//节点信息
					tooltip: {
						//headerFormat : '<span style="font-size: 10px">{series.name}</span><br />', //头部输入格式
						valueDecimals: 2 //保留小数位
					}
				}, {
					name: '命中指数',
					data: hiArr, //图表数据
					shadow: false,
					//节点信息
					tooltip: {
						//headerFormat : '<span style="font-size: 10px">{series.name}</span><br />', //头部输入格式
						valueDecimals: 2 //保留小数位
					}
				}]
			});
		});
	}

	/* 图表
	 * @param url 图表数据url
	 * @param id 容器id
	 * @param width 容器宽度
	 * @memberof Yuncai
	 * @name chart
	 */
	Yuncai.historyChart = function(option, data) {

		var data = eval("(" + data + ")");
		if (!data) {
			return;
		}
		var followtrend = data[0];
		var followbounty = data[0];
		var followinfo = data[0];
		var second = 1291161600000;
		var labelObj = {};
		var followtrendT = {};
		var followtrendJ = {};
		var resultObj = [];
		var data1 = [];
		var yMin = parseFloat(data[2]);
		var yMax = parseFloat(data[1]);
		var chartTable = $('.chart-table');
		var tds1 = chartTable.find('.first td');
		var tds2 = chartTable.find('.last td');
		tds1.eq(1).text(followinfo['day_top']);
		tds1.eq(2).text(followinfo['all']);
		tds1.eq(3).text(followinfo['real_all']);
		//		if (followinfo['profit'].indexOf('-') !== -1) {
		//			tds1.eq(4).html('<span class="green">' + followinfo['profit'] + '</span>');
		//		} else {
		//			tds1.eq(4).html('<span class="red">' + followinfo['profit'] + '</span>');
		//		}
		//		if (followinfo['real_profit'].indexOf('-') !== -1) {
		//			tds1.eq(5).html('<span class="green">' + followinfo['real_profit'] + '</span>');
		//		} else {
		//			tds1.eq(5).html('<span class="red">' + followinfo['real_profit'] + '</span>');
		//		}

		//		tds2.eq(1).text(myinfo['day_top']);
		//		tds2.eq(2).text(myinfo['all']);
		//		tds2.eq(3).text(myinfo['real_all']);
		//		if (myinfo['profit'].indexOf('-') !== -1) {
		//			tds2.eq(4).html('<span class="green">' + myinfo['profit'] + '</span>');
		//		} else {
		//			tds2.eq(4).html('<span class="red">' + myinfo['profit'] + '</span>');
		//		}
		//		if (myinfo['real_profit'].indexOf('-') !== -1) {
		//			tds2.eq(5).html('<span class="green">' + myinfo['real_profit'] + '</span>');
		//		} else {
		//			tds2.eq(5).html('<span class="red">' + myinfo['real_profit'] + '</span>');
		//		}
		for (var name in followtrend) {
			var item1 = {};
			second = second + 1000;
			item1.x = second;
			item1.y = parseFloat(followtrend[name]);

			data1.push(item1);

			labelObj[second + ''] = name;
			followtrendT[second + ''] = followtrend[name];
			followtrendJ[second + ''] = followbounty[name];
			resultObj[second + ''] = followtrend[name];

		}
		var chart = new Highcharts.StockChart({
			chart: {
				renderTo: 'chart_box',
				plotBackgroundColor: '#fff', //图表内容区域颜色
				backgroundColor: '#feeecc', //图表颜色
				borderRadius: 0, //图表圆角
				spacingLeft: 0,
				spacingRight: 6,
				spacingBottom: 10,
				spacingTop: 6,
				plotBackgroundImage: 'http://static.360mao.com/website/images/client/trade/bg_chart_history.png'
					//				style: {background-repeat:'repeat'}
			},
			scrollbar: {
				enabled: false
			},
			rangeSelector: {
				enabled: false
			},
			navigator: {
				enabled: false
			},
			colors: [
				'#0158a7',
				'#ffa200'
			],
			title: {
				align: 'right',
				margin: 5,
				//text : '最小命中指数：'+minHi+'；最大趋势指数：'+max+'； 最小趋势指数：'+min,
				text: '历史最高盈利额：' + fmoney(yMax, 2) + '元，' + '  历史最低盈利额：' + fmoney(yMin, 2) + '元（负数表示亏损）',
				style: {
					fontSize: '12px',
					color: '#ff0000'
				}
			},
			xAxis: {
				//categories: cateArr,
				tickmarkPlacement: 'on',
				//minorTickColor: '#dce2d4',
				//minorTickInterval: 'auto',
				//minorGridLineDashStyle: 'dash',
				dateTimeLabelFormats: { //图表日期格式
					second: '%Y-%m-%d<br/>%H:%M:%S',
					minute: '%Y-%m-%d<br/>%H:%M',
					hour: '%Y-%m-%d<br/>%H:%M',
					day: '%Y<br/>%m-%d',
					week: '%Y<br/>%m-%d',
					month: '%Y-%m',
					year: '%Y'
				},
				lineWidth: 1,
				lineColor: '#afafaf',
				labels: {
					formatter: function() {
						if (labelObj[this.value + '']) {
							return labelObj[this.value];
						} else {
							return '';
						}

					}
				}
			},
			tooltip: {
				borderColor: '#BCBCBC',
				borderWidth: 1,
				shadow: false,
				crosshairs: [true, true], //显示marker的x和y轴
				formatter: function() { //marker提示层
					if (labelObj[this.x]) {
						var s = '<b>期　　号：</b>' + labelObj[this.x] + ' <br/><b>盈亏额：</b>' + fmoney(resultObj[this.x], 2) + '元';
						return s;
					} else {
						return false;
					}
				}
			},
			yAxis: {
				//				title: {
				//	                text:"单位：万"
				//	            },
				gridLineWidth: 0,
				//gridLineDashStyle: 'dash',
				//allowDecimals: false,
				//gridZIndex: 5,
				//gridLineColorL: '#d9decf',
				//minorTickColor: '#dce2d4',
				//minorTickInterval: 'auto',
				//minorGridLineDashStyle: 'dash',
				minPadding: 0,
				maxPadding: 0,
				labels: {
					align: 'right',
					y: 6,
					x: -9,
					formatter: function() {
						if ((yMin < -1000 && yMin >= -10000) || (yMax > 1000 && yMax <= 10000)) {
							return (this.value / 1000) + 'k';
						} else if (yMin < -10000 || yMax > 10000) {
							return (this.value / 10000) + 'w';
						} else {
							return this.value;
						}

					}
				},

				lineColor: '#afafaf',
				lineWidth: 1,
				showLastLabel: true,
				showFirstLabel: true,
				min: yMin,
				max: yMax
					//	    		tickPositions: [yMin,yMax]
			},
			credits: {
				enabled: false
			},
			series: [{
				data: data1,
				lineWidth: 1,
				shadow: false,
				states: {
					hover: {
						enabled: true,
						lineWidth: 1
					}
				}
			}]
		});
		//console.log(chart);
		//chart.series[1].hide();
		//setTimeout(function () {
		//chart.series[0].hide();
		//},4000);

		//chart.series[1].index = 0;
		$('.chart-top h3').css('margin-left', 624 - chart.plotWidth + 6 + 'px').css('visibility', 'visible');
		//chart.
		/*
		chart.rangeSelector.zoomText.hide();
		$.each(chart.rangeSelector.buttons, function () {
			this.hide();
		});
		*/
	}
	Yuncai.historyChartbf = function(option, data) {
		var WIDTH = option.width || 980; //容器宽度
		var data = eval("(" + data + ")");
		var arr = []; //图表插件数组 arr = [{x:毫秒值, y:趋势值, marker:{...}}]
		var hiArr = []; //命中指数数组
		var wrtrendObj = data[0]; //趋势数据对象
		var trendObj = data[0]; //趋势数据对象
		var min = parseFloat(data[2]); //最小趋势值
		var max = parseFloat(data[1]); //最大趋势值
		var avg = (Number((parseFloat(data[1]) + parseFloat(data[2])) / 2)).toFixed(2); //平均值博
		var mintrend = parseFloat(data[2]);
		var maxtrend = parseFloat(data[1]);
		var yMin = parseFloat(data[2]); //(min > minh) ? minh:min;
		var yMax = parseFloat(data[1]); //(max > maxh) ? max:maxh;
		var nameRange = {
			'余额': '(历史范围：' + min + ' - ' + max + ')'
		}
		var betResult = {
			'0': '<span style="color:#cccccc">未中</span>',
			'1': '<span style="color:yellow">命中</span>',
			'2': '<span style="color:#ff0033">取消</span>'
		}; //投注结果
		var markerColor = {
			'0': '#000000',
			'1': '#0066cc',
			'2': '#ff0033'
		}; //marker颜色值(0:未中， 1：中奖， 2：取消)
		var markerColor1 = {
			'0': '#000000',
			'1': 'yellow',
			'2': '#ff0033'
		}; //marker颜色值(0:未中， 1：中奖， 2：取消)
		var markerRadius = {
				'0': '0',
				'1': '3',
				'2': '3'
			} //marker radius大小(0:未中， 1：中奖， 2：取消)
		var markerSymbol = {
				'0': null, //'url(http://static2.yuncai.com/images/client/trade/line_red.png)' //不显示未中奖
				'1': 'circle', //url(http://static.365mao.com/images/client/trade/line_blue.png)
				'2': 'circle'
			} //symbol背景图(0:未中， 1：中奖， 2：取消) //url(http://static.365mao.com/images/client/trade/line_red.png)
		var markerSymbol1 = {
			'0': null,
			'1': 'diamond',
			'2': 'diamond'
		}
		var xLine = []; //竖线
		var cateArr = []; //x轴字段
		var second = 1291161600000; //起始2012-10-01，只要为毫秒的日期即可
		var labelObj = {}; //x轴字段对象
		var resultObj = {}; //显示投注情况
		var qszsObj = {};

		var yLabel = max - min;
		for (var k in trendObj) {
			var _obj = {}; //临时存储对象
			var _hiObj = {}; //命中指数临时存储
			var kVal = k; //日期键
			//var n=k.split("-");
			//_obj.x = Date.UTC(n[0],n[1]-1,n[2]); //获取毫秒
			_obj.x = second = second + 1000; //每次添加一秒
			_obj.y = Number(trendObj[k]);

			//不显示实心点
			_obj.marker = null;

			//--------------------------
			//显示实心点
			//--------------------------
			//				_obj.marker = {};
			//				_obj.marker.enabled = true;
			//				_obj.marker.fillColor = markerColor[kVal];
			//				_obj.marker.radius = markerRadius[kVal];
			//				_obj.marker.symbol = markerSymbol[kVal];
			//				_obj.marker.states = {};
			//				_obj.marker.states.hover = {};
			//				_obj.marker.states.hover.fillColor = markerColor[kVal];

			arr.push(_obj);

			//存储x轴竖线
			var _xObj = {};
			_xObj.value = _obj.x;
			_xObj.width = 0.7;
			_xObj.color = markerColor[kVal];
			_xObj.dashStyle = 'solid';
			_xObj.zIndex = 1;
			xLine.push(_xObj);
			//存储x轴字段
			//cateArr.push(k.replace(/\-/g, '').substring(2));
			labelObj[second + ''] = k; //存储x字段
			resultObj[second + ''] = trendObj[k];
			qszsObj[second + ''] = wrtrendObj[k];
			//				mzzsObj[second+''] = hiObj[k] * 100;
		}
		$('.j-avg').html(parseFloat(avg).toFixed(2)); //给描述节点添加数值
		//创建图表
		window.chart = new Highcharts.StockChart({
			chart: {
				renderTo: option.id, //容器id
				width: WIDTH, //宽度
				zoomType: 'x' //放大镜效果
			},
			//曲线颜色
			colors: [
				'#ff0033',
				'yellow'
			],
			//版权信息
			credits: {
				enabled: false
			},
			//按钮，输入框
			rangeSelector: {
				selected: 3, //默认选择范围，从0开始
				inputEnabled: false, //隐藏日期输入框
				labelStyle: {
					visibility: 'hidden',
					fontSize: 0
				},
				buttons: []
					//					buttons: [{
					//						type: 'second',//按天数输出，每月为30天
					//						count: 90,
					//						text: '90'
					//					},{
					//						type: 'second',
					//						count: 180,
					//						text: '180'
					//					}, {
					//						type: 'second',
					//						count: 360,
					//						text: '360'
					//					}, {
					//						type: 'all',
					//						text: 'All'
					//					}]
			},
			//标题
			title: {
				align: 'right',
				margin: -28,
				//text : '最小命中指数：'+minHi+'；最大趋势指数：'+max+'； 最小趋势指数：'+min,
				text: '历史最大余额：' + max + '  历史最小余额：' + min,
				style: {
					fontSize: '12px',
					color: 'yellow'
				}
			},
			/*subtitle: {
						y: 14,
						x: 180,
						align: 'left',
						text: '<a target="_blank" href="/trade/super/newhistory?day=30&type=0&model_id='+option.modelId+'&project_issue='+option.projectIssue+'&t='+$.now()+'">查看历史数据</a>'

					},*/
			//缩略图
			navigator: {
				enabled: false,
				height: 10,
				xAxis: { //缩略图日期格式
					labels: {
						formatter: function() {
							//return ((new Date(this.value)).getFullYear()+'').substring(2)+((new Date(this.value)).getMonth()+1)+(new Date(this.value)).getDate();
							return labelObj[this.value]
						}
					}
				}
			},
			//曲线样式
			plotOptions: {
				line: {
					lineWidth: 1
				},
				series: {
					states: {
						hover: {
							enabled: true,
							lineWidth: 1
						}
					}
				},
				zIndex: 1
			},
			//marker提示信息
			tooltip: {
				crosshairs: [true, true], //显示marker的x和y轴
				formatter: function() { //marker提示层
					//var s = '<b>期号：</b>'+ (Highcharts.dateFormat('%Y%m%d', this.x)).substring(2);
					var s = '<b>期号：</b>' + labelObj[this.x] + ' <br/>余额：' + fmoney(resultObj[this.x], 3) + '';
					/*$.each(this.points, function(i, point) {
								s += '<br/><b>'+this.series.name+'：</b>'+ Number(point.y * 100).toFixed(2) +' '+ nameRange[this.series.name];
							});*/
					//						s += '<br/><b>趋势指数：</b><span style="color:#ff0033;">'+ Number(qszsObj[this.x]).toFixed(2) +'</span> '+ nameRange['趋势指数'];
					//						s += '<br/><b>命中指数：</b><span style="color:yellow;">'+ Number(mzzsObj[this.x]).toFixed(2) +'</span> '+ nameRange['命中指数'];
					return s;
				}
			},
			//x轴
			xAxis: {
				//type: 'datetime',
				//categories: cateArr,
				tickmarkPlacement: 'on',
				dateTimeLabelFormats: { //图表日期格式
					second: '%Y-%m-%d<br/>%H:%M:%S',
					minute: '%Y-%m-%d<br/>%H:%M',
					hour: '%Y-%m-%d<br/>%H:%M',
					day: '%Y<br/>%m-%d',
					week: '%Y<br/>%m-%d',
					month: '%Y-%m',
					year: '%Y'
				},
				labels: {
					formatter: function() {
						//return ((new Date(this.value)).getFullYear()+'').substring(2)+((new Date(this.value)).getMonth()+1)+(new Date(this.value)).getDate();
						return labelObj[this.value]
					}
				},
				plotLines: xLine
			},
			//y轴线，显示平均值博
			yAxis: {
				//			    	plotLines: [{
				//			    		value: avg,
				//			    		width: 0.7,
				//			    		color: 'yellow',
				//			    		dashStyle: 'solid',
				//			    		zIndex:2,
				//			    		label: {
				//
				//			    		}
				//			    	}],

				labels: {
					align: 'right',
					y: 5,
					x: -5
				},
				minTickInterval: 1,
				showLastLabel: true,
				max: max,
				min: min
					//		    		tickPositions: [(Number(yMin)).toFixed(2), (Number(yMin)+(yMax-yMin)/3).toFixed(2), (Number(yMin)+(yMax-yMin)/3*2).toFixed(2), (Number(yMax)).toFixed(2)]
					//		           	tickPositions: [-600, -200, 100, 500]
			},
			//图表数据
			series: [{
				name: '趋势指数',
				data: arr, //图表数据
				shadow: false,
				//节点信息
				tooltip: {
					//headerFormat : '<span style="font-size: 10px">{series.name}</span><br />', //头部输入格式
					valueDecimals: 2 //保留小数位
				}
			}]
		});

	}

	Yuncai.followChart = function(option) {
		$.get(option.url, function(data) {
			if (data.error) {
				Yuncai.showTip(data.error);
				return;
			}
			var followtrend = data.followtrend;
			var followbounty = data.followbounty;
			var followinfo = data.followinfo;
			var myinfo = data.myinfo;
			var mytrend = data.mytrend;
			var mybounty = data.mybounty;
			var second = 1291161600000;
			var labelObj = {};
			var mytrendT = {};
			var mytrendJ = {};
			var followtrendT = {};
			var followtrendJ = {};
			var data1 = [];
			var data2 = [];
			var yMin = parseFloat(data.min);
			var yMax = parseFloat(data.max);
			var chartTable = $('.chart-table');
			var tds1 = chartTable.find('.first td');
			var tds2 = chartTable.find('.last td');
			tds1.eq(1).text(followinfo['day_top']);
			tds1.eq(2).text(followinfo['all']);
			tds1.eq(3).text(followinfo['real_all']);
			if (followinfo['profit'].indexOf('-') !== -1) {
				tds1.eq(4).html('<span class="green">' + followinfo['profit'] + '</span>');
			} else {
				tds1.eq(4).html('<span class="red">' + followinfo['profit'] + '</span>');
			}
			if (followinfo['real_profit'].indexOf('-') !== -1) {
				tds1.eq(5).html('<span class="green">' + followinfo['real_profit'] + '</span>');
			} else {
				tds1.eq(5).html('<span class="red">' + followinfo['real_profit'] + '</span>');
			}

			tds2.eq(1).text(myinfo['day_top']);
			tds2.eq(2).text(myinfo['all']);
			tds2.eq(3).text(myinfo['real_all']);
			if (myinfo['profit'].indexOf('-') !== -1) {
				tds2.eq(4).html('<span class="green">' + myinfo['profit'] + '</span>');
			} else {
				tds2.eq(4).html('<span class="red">' + myinfo['profit'] + '</span>');
			}
			if (myinfo['real_profit'].indexOf('-') !== -1) {
				tds2.eq(5).html('<span class="green">' + myinfo['real_profit'] + '</span>');
			} else {
				tds2.eq(5).html('<span class="red">' + myinfo['real_profit'] + '</span>');
			}
			for (var name in followtrend) {
				var item1 = {};
				var item2 = {};

				second = second + 1000;
				item1.x = second;
				item1.y = parseFloat(followtrend[name]);

				item2.x = second;
				item2.y = parseFloat(mytrend[name]);
				data1.push(item1);
				data2.push(item2);

				labelObj[second + ''] = name.replace(/\-/g, '').substring(2);
				mytrendT[second + ''] = mytrend[name];
				mytrendJ[second + ''] = mybounty[name];
				followtrendT[second + ''] = followtrend[name];
				followtrendJ[second + ''] = followbounty[name];

			}
			var chart = new Highcharts.StockChart({
				chart: {
					renderTo: 'chart_box',
					plotBackgroundColor: '#fff', //图表内容区域颜色
					backgroundColor: '#feeecc', //图表颜色
					borderRadius: 0, //图表圆角
					spacingLeft: 0,
					spacingRight: 6,
					spacingBottom: 0,
					spacingTop: 6,
					plotBackgroundImage: 'http://static.360mao.com/website/images/client/trade/bg_chart.png'
				},
				scrollbar: {
					enabled: false
				},
				rangeSelector: {
					enabled: false
				},
				navigator: {
					enabled: false
				},
				colors: [
					'#0158a7',
					'#ffa200'
				],
				xAxis: {
					//categories: cateArr,
					tickmarkPlacement: 'on',
					//minorTickColor: '#dce2d4',
					//minorTickInterval: 'auto',
					//minorGridLineDashStyle: 'dash',
					dateTimeLabelFormats: { //图表日期格式
						second: '%Y-%m-%d<br/>%H:%M:%S',
						minute: '%Y-%m-%d<br/>%H:%M',
						hour: '%Y-%m-%d<br/>%H:%M',
						day: '%Y<br/>%m-%d',
						week: '%Y<br/>%m-%d',
						month: '%Y-%m',
						year: '%Y'
					},
					lineWidth: 2,
					lineColor: '#afafaf',
					labels: {
						formatter: function() {
							if (labelObj[this.value + '']) {
								return labelObj[this.value];
							} else {
								return '';
							}

						}
					}
				},
				tooltip: {
					borderColor: '#BCBCBC',
					borderWidth: 1,
					shadow: false,
					crosshairs: [true, true], //显示marker的x和y轴
					formatter: function() { //marker提示层
						if (labelObj[this.x]) {
							var s = '<b>期号：</b>' + labelObj[this.x];
							s += '<br/><strong style="font-weight:bold;color:#0158a7;">被跟买人实盘：</strong><span style="color:#0158a7;">投注 ' + followtrendT[this.x] + ' 元</span>（奖金 <span style="color:red;">' + followtrendJ[this.x] + '</span> 元）';
							s += '<br/><strong style="font-weight:bold;color:#ffa200;">假如我跟买：</strong><span style="color:#ffa200;">投注 ' + mytrendT[this.x] + ' 元</span>（奖金 <span style="color:red;">' + mytrendJ[this.x] + '</span> 元）';
							return s;
						} else {
							return false;
						}
					}
				},
				yAxis: {
					gridLineWidth: 0,
					//gridLineDashStyle: 'dash',
					//allowDecimals: false,
					//gridZIndex: 5,
					//gridLineColorL: '#d9decf',
					//minorTickColor: '#dce2d4',
					//minorTickInterval: 'auto',
					//minorGridLineDashStyle: 'dash',
					minPadding: 0,
					maxPadding: 0,
					labels: {
						align: 'right',
						y: 6,
						x: -9,
						formatter: function() {
							return this.value;
						}
					},
					lineColor: '#afafaf',
					lineWidth: 1,
					showLastLabel: true,
					showFirstLabel: false,
					tickPositions: [0, yMin, Math.ceil((yMax - yMin) / 3) + yMin, Math.ceil((yMax - yMin) / 3 * 2) + yMin, yMax]
				},
				credits: {
					enabled: false
				},
				series: [{
					data: data1,
					lineWidth: 1,
					shadow: false,
					states: {
						hover: {
							enabled: true,
							lineWidth: 1
						}
					}
				}, {
					data: data2,
					lineWidth: 2,
					shadow: false,
					states: {
						hover: {
							enabled: true,
							lineWidth: 2
						}
					}
				}]
			});
			//console.log(chart);
			//chart.series[1].hide();
			//setTimeout(function () {
			//chart.series[0].hide();
			//},4000);

			//chart.series[1].index = 0;
			$('.chart-top h3').css('margin-left', 624 - chart.plotWidth + 6 + 'px').css('visibility', 'visible');
			//chart.
			/*
			chart.rangeSelector.zoomText.hide();
			$.each(chart.rangeSelector.buttons, function () {
				this.hide();
			});
			*/
		}, 'json');

	}
	return Yuncai;
});