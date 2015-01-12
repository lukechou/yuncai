define(['jquery'], function($) {
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

			Graph.prototype.createChart = function() {
				var _this = this;
				//创建图表
				window.chart = new Highcharts.StockChart({
					chart: {
						renderTo: _this.chartEl, //容器id
						width: _this.width, //宽度
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
						text: '平均值博（' + parseFloat(_this.avg).toFixed(2) + '）',
						style: {
							fontSize: '12px',
							color: 'yellow'
						}
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
							turboThreshold: 2000
						},
						zIndex: 1
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
						tickPositions: [(Number(yMin) - 0.05).toFixed(2), (Number(yMin) + (yMax - yMin) / 3).toFixed(2), (Number(yMin) + (yMax - yMin) / 3 * 2).toFixed(2), (Number(yMax) + 0.05).toFixed(2)]
					},
					//图表数据
					series: [{
						name: '趋势指数',
						data: arr, //图表数据
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
				});
			};

			Graph.prototype.getChartData = function() {
				var _this = this;
				$.ajax(option.url, function(data) {

					//图表插件数组 arr = [{x:毫秒值, y:趋势值, marker:{...}}]
					var arr = [];
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

					//给描述节点添加数值
					$('.j-avg').html(parseFloat(_this.avg).toFixed(2));

				});
			};

			return Graph;
	}());

var c = new Graph({
	width: 985,
	chartEl: $('#chart'),
});

return c;
});