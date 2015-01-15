define(['jquery', 'app', 'highcharts'], function($, APP) {
	'use strict';
	//https://github.com/highslide-software/highcharts.com/
	var Graph = (function() {

		function Graph(args) {
			// enforces new
			if (!(this instanceof Graph)) {
				return new Graph(args);
			}
			// constructor body
		}

		Graph.prototype = {
			width: 945
		};

		Graph.prototype.init = function(args) {
			for (var prop in args) {
				if (args.hasOwnProperty(prop)) {
					this[prop] = args[prop];
				}
			}
		};

		Graph.prototype.createChart = function() {
			var _this = this;

			_this.config = {
				chart: {
					renderTo: _this.chartEl, //容器id
					width: _this.width, //宽度
					zoomType: 'x', //放大镜效果
				},
				//缩略图
				navigator: {
					enabled: false,
					height: 16,
					xAxis: { //缩略图日期格式
						labels: {
							formatter: function() {
								return _this.labelObj[this.value]
							}
						}
					}
				},
				//marker提示信息
				tooltip: {
					crosshairs: [true, true], //显示marker的x和y轴
					formatter: function() { //marker提示层
						var s = '<b>期　　号：</b>' + _this.labelObj[this.x] + ' [' + _this.resultObj[this.x] + ']';
						s += '<br/><b>趋势指数：</b><span style="color:#ff0033;">' + Number(_this.qszsObj[this.x]).toFixed(2) + '</span> ' + _this.nameRange['趋势指数'];
						s += '<br/><b>命中指数：</b><span style="color:yellow;">' + Number(_this.mzzsObj[this.x]).toFixed(2) + '</span> ' + _this.nameRange['命中指数'];
						return s;
					}
				},
				//x轴
				xAxis: {
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
							return _this.labelObj[this.value]
						}
					},
					plotLines: _this.xLine
				},
				//y轴线，显示平均值博
				yAxis: {
					plotLines: [{
						value: _this.avg,
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
					tickPositions: [(Number(_this.yMin) - 0.05).toFixed(2), (Number(_this.yMin) + (_this.yMax - _this.yMin) / 3).toFixed(2), (Number(_this.yMin) + (_this.yMax - _this.yMin) / 3 * 2).toFixed(2), (Number(_this.yMax) + 0.05).toFixed(2)]
				},
				//图表数据
				series: [{
					name: '趋势指数',
					data: _this.arr, //图表数据
					shadow: false,
					//节点信息
					tooltip: {
						valueDecimals: 2 //保留小数位
					}
				}, {
					name: '命中指数',
					data: _this.hiArr, //图表数据
					shadow: false,
					//节点信息
					tooltip: {
						valueDecimals: 2 //保留小数位
					}
				}]
			};

			//曲线样式
			_this.config.plotOptions = {
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
					turboThreshold: 2000
				},
				zIndex: 1
			};

			//版权信息
			_this.config.credits = {
				enabled: false
			};

			//按钮，输入框
			_this.config.rangeSelector = {
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
			};

			//标题
			_this.config.title = {
				align: 'right',
				margin: -28,
				text: '平均值博（' + parseFloat(_this.avg).toFixed(2) + '）',
				style: {
					fontSize: '12px',
					color: '#f0f009'
				}
			};

			// 图表样式
			Highcharts.theme = {
				colors: ["#FF0000", "#f0f009"],
				chart: {
					backgroundColor: '#041226',
					style: {
						fontFamily: "'Unica One', sans-serif"
					},
					plotBorderColor: '#606063'
				},
				title: {
					style: {
						color: '#E0E0E3',
						textTransform: 'uppercase',
						fontSize: '20px'
					}
				},
				subtitle: {
					style: {
						color: '#E0E0E3',
						textTransform: 'uppercase'
					}
				},
				// x轴样式
				xAxis: {
					gridLineColor: '#707073',
					labels: {
						style: {
							color: '#E0E0E3'
						}
					},
					lineColor: '#707073',
					minorGridLineColor: '#505053',
					tickColor: '#707073',
					title: {
						style: {
							color: '#A0A0A3'

						}
					}
				},
				// y轴样式
				yAxis: {
					gridLineColor: '#707073',
					align: 'left',
					labels: {
						style: {
							color: '#E0E0E3'
						}
					},
					lineColor: '#707073',
					minorGridLineColor: '#505053',
					tickColor: '#707073',
					tickWidth: 1,
					title: {
						style: {
							color: '#f22'
						}
					}
				},
				legend: {
					itemStyle: {
						color: '#ccc'
					},
					itemHoverStyle: {
						color: '#fff'
					},
					itemHiddenStyle: {
						color: '#333'
					}
				},
				labels: {
					style: {
						color: '#707073'
					}
				},

				// Hover 弹出层样式
				tooltip: {
					backgroundColor: 'rgba(0, 0, 0, 0.50)',
					borderWidth: 0,
					style: {
						color: '#fff'
					}
				},
				plotOptions: {
					series: {
						dataLabels: {
							color: '#B0B0B3'
						},
						marker: {
							lineColor: '#333'
						}
					},
					boxplot: {
						fillColor: '#505053'
					},
					candlestick: {
						lineColor: '#fff'
					},
					errorbar: {
						color: '#fff'
					}
				},

				toolbar: {
					itemStyle: {
						color: '#ccc'
					}
				},

				navigation: {
					buttonOptions: {
						symbolStroke: '#DDDDDD',
						theme: {
							fill: '#505053'
						}
					}
				},

				// 右上角button
				rangeSelector: {
					buttonTheme: {
						fill: '#adadad',
						stroke: '#000',
						style: {
							color: '#3d3d3d'
						},
						states: {
							hover: {
								fill: '#f5f5f5',
								stroke: '#000',
								style: {
									color: '#3d3d3d'
								}
							},
							select: {
								fill: '#f13c38',
								stroke: '#000',
								style: {
									color: '#fff'
								}
							}
						}
					},
					inputBoxBorderColor: '#505053',
					inputStyle: {
						backgroundColor: '#333',
						color: 'silver'
					},
					labelStyle: {
						color: 'silver'
					}
				},

				navigator: {
					handles: {
						backgroundColor: '#666',
						borderColor: '#AAA'
					},
					outlineColor: '#CCC',
					maskFill: 'rgba(255,255,255,0.1)',
					series: {
						color: '#7798BF',
						lineColor: '#A6C7ED'
					},
					xAxis: {
						gridLineColor: '#505053'
					}
				},

				// 滚动条样式
				scrollbar: {
					barBackgroundColor: '#0354a2',
					barBorderColor: '#04285a',
					buttonArrowColor: '#CCC',
					buttonBackgroundColor: '#0355a5',
					buttonBorderColor: '#0355a5',
					rifleColor: '#FFF',
					trackBackgroundColor: '#01183d',
					trackBorderColor: '#01183d'
				},

				// special colors for some of the demo examples
				legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
				background2: '#505053',
				dataLabelsColor: '#B0B0B3',
				textColor: '#C0C0C0',
				contrastTextColor: '#F0F0F3',
				maskColor: 'rgba(255,255,255,0.3)'
			};

			// Apply the theme
			var highchartsOptions = Highcharts.setOptions(Highcharts.theme);

			// //创建图表
			_this.chartEl.highcharts('StockChart', _this.config);
			$('#j-chart-loder').remove();
			_this.chartEl.fadeIn();
		};

		Graph.prototype.getChartData = function(id) {
			var _this = this;

			var obj = {
				model_id: id,
				t: $.now()
			};

			$.ajax({
					url: '/lottery/trade/fetch-icon-data',
					type: 'GET',
					dataType: 'json',
					data: obj,
				})
				.done(function(D) {
					var data = D.retData;
					//图表插件数组 arr = [{x:毫秒值, y:趋势值, marker:{...}}]
					var wrtrendObj = data.wrtrend; //趋势数据对象
					var trendObj = data.trend; //趋势数据对象
					var hiObj = data.hi; //命中指数对象
					var hitObj = data.hit; //中奖数据对象
					var min = data.mintrend; //最小趋势值
					var max = data.maxtrend; //最大趋势值
					var minHi = data.minHI; //最大趋势值

					var maxh = data.maxh //命中指数最大值
					var minh = data.minh //命中指数最小值
					var maxw = data.maxw //周期值博最大值
					var minw = data.minw //周期值博最小值
					var mintrend = data.min;
					var maxtrend = data.max;
					//投注结果
					var betResult = {
						'0': '<span style="color:#cccccc">未中</span>',
						'1': '<span style="color:yellow">命中</span>',
						'2': '<span style="color:#ff0033">取消</span>'
					};
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
					}; //marker radius大小(0:未中， 1：中奖， 2：取消)
					var markerSymbol = {
						'0': null, //'url(http://static2.yuncai.com/images/client/trade/line_red.png)' //不显示未中奖
						'1': 'circle', //url(http://static.365mao.com/images/client/trade/line_blue.png)
						'2': 'circle'
					}; //symbol背景图(0:未中， 1：中奖， 2：取消) //url(http://static.365mao.com/images/client/trade/line_red.png)
					var markerSymbol1 = {
						'0': null,
						'1': 'diamond',
						'2': 'diamond'
					};
					var cateArr = []; //x轴字段
					var second = 1291161600000; //起始2012-10-01，只要为毫秒的日期即可
					var yLabel = ((maxw - minw) > (maxh - minh)) ? (maxw - minw) : (maxh - minh);

					_this.arr = [];
					_this.avg = data.avg; //平均值博
					_this.hiArr = []; //命中指数数组
					_this.yMin = data.miny; //(min > minh) ? minh:min;
					_this.yMax = data.maxy; //(max > maxh) ? max:maxh;
					_this.nameRange = {
						'趋势指数': '(历史范围：' + minw + ' - ' + maxw + ')',
						'命中指数': '(历史范围：' + Number(minh * 100).toFixed(2) + ' - ' + Number(maxh * 100).toFixed(2) + ')'
					};
					_this.xLine = []; //竖线
					_this.qszsObj = {};
					_this.mzzsObj = {};
					_this.labelObj = {}; //x轴字段对象
					_this.resultObj = {}; //显示投注情况

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
						_this.arr.push(_obj);

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

						_this.hiArr.push(_hiObj);

						//存储x轴竖线
						var _xObj = {};
						_xObj.value = _obj.x;
						_xObj.width = 0.7;
						_xObj.color = markerColor[kVal];
						_xObj.dashStyle = 'solid';
						_xObj.zIndex = 1;
						_this.xLine.push(_xObj);

						//存储x轴字段
						_this.labelObj[second + ''] = k.replace(/\-/g, '').substring(2);
						_this.resultObj[second + ''] = betResult[kVal];
						_this.qszsObj[second + ''] = wrtrendObj[k];
						_this.mzzsObj[second + ''] = hiObj[k] * 100;
					}
					_this.createChart();
					console.log("success");
				})
				.fail(function() {
					APP.onServiceFail();
					console.log("error");
				});

		};

		return Graph;
	}());

	var g = new Graph();

	return g;
});