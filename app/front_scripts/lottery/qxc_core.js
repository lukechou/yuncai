/**
 * 排列5的库文件
 */
var QXC={
	digitalCodeConnector: ',',
	errorMsg : '',
	digitalDescMap : {0:'第一位',1:'第二位',2:'第三位',3:'第四位',4:'第五位',5:'第六位',6:'第七位'},
	maxOneBetMoney : 20000,
	maxBuyCodeLength : 100,
	maxMultiple :  9999,
	minMultiple : 1,
	maxBetNum : 100,
	minBetNum : 1,
	maxIssueNum : 30,
	minIssueNum : 1,
	// 直选对象
	ZhiXuanNormal:{
		minCode :0,
		maxCode :9,
		oneBetCodeNum:7,
		codeRegex : /^([0-9]{1,10}[,]){6}([0-9]{1,10})$/,
	},

	/**
	 * 获取最后一条错误提示信息
	 * @return {[type]} [description]
	 */
	getLastErrorMsg : function(){
		return this.errorMsg;
	},

	/**
	 * 获取直选注数
	 * @param  {[type]} firstCodes  [description]
	 * @param  {[type]} secondCodes [description]
	 * @param  {[type]} thirdCodes  [description]
	 * @param  {[type]} fourthCodes [description]
	 * @param  {[type]} fifthCodes  [description]
	 * @param  {[type]} sixCodes    [description]
	 * @param  {[type]} sevenCodes  [description]
	 * @return {[type]}             [description]
	 */
	getZhiXuanZhushu : function(firstCodes, secondCodes, thirdCodes, fourthCodes, fifthCodes, sixCodes, sevenCodes) {
		var first = Math.getCombineNum(firstCodes.length, 1, 'C');
		var second = Math.getCombineNum(secondCodes.length, 1, 'C');
		var third = Math.getCombineNum(thirdCodes.length, 1, 'C');
		var fourth = Math.getCombineNum(fourthCodes.length, 1, 'C');
		var fifth = Math.getCombineNum(fifthCodes.length, 1, 'C');
		var sixth = Math.getCombineNum(sixCodes.length, 1, 'C');
		var seven = Math.getCombineNum(sevenCodes.length, 1, 'C');
		return first * second * third * fourth * fifth * sixth * seven;
	},

	/**
	 * 机选几注
	 * @param  {[type]}   betNum   [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	produceCode: function(callback) {
        var produceCodes = [];
        for (var m = this.ZhiXuanNormal.oneBetCodeNum-1; m >= 0;) {
            produceCodes[m]=[];
            var currentCode = Math.getRandomInt(this.ZhiXuanNormal.minCode,this.ZhiXuanNormal.maxCode);
//            currentCode = currentCode.toString();
            if($.inArray(currentCode, produceCodes[m]) < 0){
                produceCodes[m].push(currentCode);
                m--;
            }
        }

		callback(produceCodes);//.sort()
		return;
	},

	/**
	 * 验证输入的内容是否合法
	 * @param  {[type]}  code [description]
	 * @return {Boolean}      [description]
	 */
	isIllegalCode: function(code, callback){
		if(!this.ZhiXuanNormal.codeRegex.test(code)){
			this.errorMsg = "投注号码格式错误, 参考格式:12,34,56,78,90,78,90或者12，34，56，78，90,78,90";
			return false;
		}
		var returnZhushu = 0;
		var returnCodes = [];
		var allDigitalCodes = code.split(this.digitalCodeConnector);
		for (var m = 0; m < allDigitalCodes.length; m++) {
			var digitalCodes = allDigitalCodes[m].split('');
			var hash = {};
			digitalCodes.sort();
			returnCodes[m] = digitalCodes;
			for (var n = 0; n < digitalCodes.length; n++) {
				if(hash[digitalCodes[n]]) {
			  	 	this.errorMsg = this.digitalDescMap[m] + "重复投注了:" + digitalCodes[n];
			  	 	return false;
			  	}
			  	hash[digitalCodes[n]] = true;
			}
		}
		returnZhushu += this.getZhiXuanZhushu(allDigitalCodes[0].split(''),allDigitalCodes[1].split(''),allDigitalCodes[2].split(''),allDigitalCodes[3].split(''),allDigitalCodes[4].split(''),allDigitalCodes[5].split(''),allDigitalCodes[6].split(''));
		callback(returnCodes, returnZhushu);
		return true;
	}
};
