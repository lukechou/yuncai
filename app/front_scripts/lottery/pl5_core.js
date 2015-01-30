/**
 * 排列5的库文件
 */
var PL5={
	digitalCodeConnector: ',',
	errorMsg : '',
	digitalDescMap : {0:'万位',1:'千位',2:'百位',3:'十位',4:'个位'},
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
		oneBetCodeNum:5,
		codeRegex : /^([0-9]{1,10}[,]){4}([0-9]{1,10})$/,
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
	 * @param  {[type]} myriabCodes   [description]
	 * @param  {[type]} thousandCodes [description]
	 * @param  {[type]} hundredCodes  [description]
	 * @param  {[type]} tenCodes      [description]
	 * @param  {[type]} digitalCodes  [description]
	 * @return {[type]}               [description]
	 */
	getZhiXuanZhushu : function(myriabCodes, thousandCodes, hundredCodes, tenCodes, digitalCodes) {
		var myriabNum = Math.getCombineNum(myriabCodes.length, 1);
		var thousandNum = Math.getCombineNum(thousandCodes.length, 1);
		var hundredNum = Math.getCombineNum(hundredCodes.length, 1);
		var tenNum = Math.getCombineNum(tenCodes.length, 1);
		var digitalNum = Math.getCombineNum(digitalCodes.length, 1);
		return myriabNum * thousandNum * hundredNum * tenNum * digitalNum;
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
            var currentCode = Math.getRandomInt(this.ZhiXuanNormal.minCode, this.ZhiXuanNormal.maxCode);
//            currentCode = currentCode.toString();
            if($.inArray(currentCode, produceCodes[m]) < 0){
                produceCodes[m].push(currentCode);
                m--;
            }
        }
        callback(produceCodes);
        return;
	},

	/**
	 * 验证输入的内容是否合法
	 * @param  {[type]}  code [description]
	 * @return {Boolean}      [description]
	 */
	isIllegalCode: function(code, callback){
		if(!this.ZhiXuanNormal.codeRegex.test(code)){
			this.errorMsg = "投注号码格式错误, 参考格式:12,34,56,78,90或者12，34，56，78，90";
			return false;
		}
		var returnZhushu = 0;
		var returnCodes = [];
		var allDigitalCodes = code.split(this.digitalCodeConnector);
		for (var m = 0; m < allDigitalCodes.length; m++) {
			var digitalCodes = allDigitalCodes[m].split('');
			var hash = {};
			returnCodes[m] = digitalCodes;
			for (var n = 0; n < digitalCodes.length; n++) {
				if(hash[digitalCodes[n]]) {
			  	 	this.errorMsg = this.digitalDescMap[m] + "重复投注了:" + digitalCodes[n];
			  	 	return false;
			  	}
			  	hash[digitalCodes[n]] = true;
			}
		}
		returnZhushu += this.getZhiXuanZhushu(allDigitalCodes[0].split(''),allDigitalCodes[1].split(''),allDigitalCodes[2].split(''),allDigitalCodes[3].split(''),allDigitalCodes[4].split(''));
		callback(returnCodes, returnZhushu);
		return true;
	}
};
