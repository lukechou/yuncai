/**
 * 11选5的库文件
 */
var Core11x5={
    	digitalCodeConnector: ',',
    	errorMsg : '',
    	digitalDescMap : {0:'万位',1:'千位',2:'百位',3:'十位',4:'个位'},
    	playType : {R1:'R1',R2:'R2',R3:'R3',R4:'R4',R5:'R5',R6:'R6',R7:'R7',R8:'R8',Z2:'Z2',Z3:'Z3',Q2:'Q2',Q3:'Q3'},
    	playCNType : {R1:'前一直选',R2:'任选二',R3:'任选三',R4:'任选四',R5:'任选五',R6:'任选六',R7:'任选七',R8:'任选八',Z2:'前二组选',Z3:'前三组选',Q2:'前二直选',Q3:'前三直选'},
    	maxOneBetMoney : 20000,
    	maxBuyCodeLength : 100,
    	maxMultiple :  9999,
    	minMultiple : 1,
    	maxBetNum : 100,
    	minBetNum : 1,
    	maxIssueNum : 30,
    	minIssueNum : 1,
    	baseCode : ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'],
    	// 任选对象
    	RX:{
    		minCode :1,
    		maxCode : 11,
    		ONE:{
    		    oneBetCodeNum:1,
    		    codeRegex : /^([0-9]{1,10}[,]){0,10}([0-9]{1,10})$/,
    		},TWO:{
    		    oneBetCodeNum:2,
    		    codeRegex : /^([0-9]{1,10}[,]){1,10}([0-9]{1,10})$/,
            },THREE:{
                oneBetCodeNum:3,
                codeRegex : /^([0-9]{1,10}[,]){2,10}([0-9]{1,10})$/,
            },FOUR:{
                oneBetCodeNum:4,
                codeRegex : /^([0-9]{1,10}[,]){3,10}([0-9]{1,10})$/,
            },FIVE:{
                oneBetCodeNum:5,
                codeRegex : /^([0-9]{1,10}[,]){4,10}([0-9]{1,10})$/,
            },SIX:{
                oneBetCodeNum:6,
                codeRegex : /^([0-9]{1,10}[,]){5,10}([0-9]{1,10})$/,
            },SEVEN:{
                oneBetCodeNum:7,
                codeRegex : /^([0-9]{1,10}[,]){6,10}([0-9]{1,10})$/,
            },EIGHT:{
                oneBetCodeNum:8,
                codeRegex : /^([0-9]{1,10}[,]){7,10}([0-9]{1,10})$/,
            }
    	},
    	// 组二玩法
    	Z2:{
            minCode :1,
            maxCode :11,
            oneBetCodeNum:2,
            codeRegex : /^([0-9]{1,10}[,]){1,10}([0-9]{1,10})$/,
        },
        // 组三玩法
        Z3:{
            minCode :1,
            maxCode :11,
            oneBetCodeNum:3,
            codeRegex : /^([0-9]{1,10}[,]){2,10}([0-9]{1,10})$/,
        },
        // 前二玩法
        Q2:{
            minCode :1,
            maxCode :11,
            oneBetCodeNum:2,
            codeRegex : /^(((0[1-9]|1[01])\s){0,10}(0[1-9]|1[01])),(((0[1-9]|1[01])\s){0,10}(0[1-9]|1[01]))$/,
        },
        // 前三玩法
        Q3:{
            minCode :1,
            maxCode :11,
            oneBetCodeNum:3,
            codeRegex : /^(((0[1-9]|1[01])\s){0,10}(0[1-9]|1[01])),(((0[1-9]|1[01])\s){0,10}(0[1-9]|1[01])),(((0[1-9]|1[01])\s){0,10}(0[1-9]|1[01]))$/,
        },

    	/**
         * 获取最后一条错误提示信息
         *
         * @return {[type]} [description]
         */
    	getLastErrorMsg : function(){
    		return this.errorMsg;
    	},

    	getBetNum : function(playType, code) {
    	    switch(playType){
    	        case this.playType.R1:
    	            return Math.getCombineNum(code[0].length, this.RX.ONE.oneBetCodeNum);
    	        case this.playType.R2:
    	            return Math.getCombineNum(code[0].length, this.RX.TWO.oneBetCodeNum);
    	        case this.playType.R3:
    	            return Math.getCombineNum(code[0].length, this.RX.THREE.oneBetCodeNum);
    	        case this.playType.R4:
    	            return Math.getCombineNum(code[0].length, this.RX.FOUR.oneBetCodeNum);
    	        case this.playType.R5:
    	            return Math.getCombineNum(code[0].length, this.RX.FIVE.oneBetCodeNum);
    	        case this.playType.R6:
    	            return Math.getCombineNum(code[0].length, this.RX.SIX.oneBetCodeNum);
    	        case this.playType.R7:
    	            return Math.getCombineNum(code[0].length, this.RX.SEVEN.oneBetCodeNum);
    	        case this.playType.R8:
    	            return Math.getCombineNum(code[0].length, this.RX.EIGHT.oneBetCodeNum);
    	        case this.playType.Z2:
                    return Math.getCombineNum(code[0].length, this.Z2.oneBetCodeNum);
    	        case this.playType.Z3:
                    return Math.getCombineNum(code[0].length, this.Z3.oneBetCodeNum);
    	        case this.playType.Q2:
    	            if(code[0] && code[1]){
    	                return Math.getCombineNum(code[0].length, 1) * Math.getCombineNum(code[1].length, 1);
    	            }
                    return 0;
    	        case this.playType.Q3:
    	            if(code[0] && code[1] && code[2]){
    	                return Math.getCombineNum(code[0].length, 1) * Math.getCombineNum(code[1].length, 1) * Math.getCombineNum(code[2].length, 1);
                    }
                    return 0;
                default:
                    return false;
    	    }
    	},

    	/**
         * 机选几注
         */
    	produceCode: function(playType) {
    		switch(playType){
                case this.playType.R1:
                    var produceCodes = [];
                    produceCodes[0]=_.sample(this.baseCode, this.RX.ONE.oneBetCodeNum).sort();
                    return produceCodes;

                case this.playType.R2:
                    var produceCodes = [];
                    produceCodes[0]=_.sample(this.baseCode, this.RX.TWO.oneBetCodeNum).sort();
                    return produceCodes;

                case this.playType.R3:
                    var produceCodes = [];
                    produceCodes[0]=_.sample(this.baseCode, this.RX.THREE.oneBetCodeNum).sort();
                    return produceCodes;

                case this.playType.R4:
                    var produceCodes = [];
                    produceCodes[0]=_.sample(this.baseCode, this.RX.FOUR.oneBetCodeNum).sort();
                    return produceCodes;

                case this.playType.R5:
                    var produceCodes = [];
                    produceCodes[0]=_.sample(this.baseCode, this.RX.FIVE.oneBetCodeNum).sort();
                    return produceCodes;

                case this.playType.R6:
                    var produceCodes = [];
                    produceCodes[0]=_.sample(this.baseCode, this.RX.SIX.oneBetCodeNum).sort();
                    return produceCodes;

                case this.playType.R7:
                    var produceCodes = [];
                    produceCodes[0]=_.sample(this.baseCode, this.RX.SEVEN.oneBetCodeNum).sort();
                    return produceCodes;

                case this.playType.R8:
                    var produceCodes = [];
                    produceCodes[0]=_.sample(this.baseCode, this.RX.EIGHT.oneBetCodeNum).sort();
                    return produceCodes;

                case this.playType.Z2:
                    var produceCodes = [];
                    produceCodes[0]=_.sample(this.baseCode, this.RX.Z2.oneBetCodeNum).sort();
                    return produceCodes;

                case this.playType.Z3:
                    var produceCodes = [];
                    produceCodes[0] = _.sample(this.baseCode, this.RX.Z3.oneBetCodeNum).sort();
                    return produceCodes;

                case this.playType.Q2:
                    var produceCodes = [];
                    produceCodes[0] = _.sample(this.baseCode, this.RX.Q2.oneBetCodeNum).sort();
                    produceCodes[1] = _.sample(this.baseCode, this.RX.Q2.oneBetCodeNum).sort();
                    return produceCodes;

                case this.playType.Q3:
                    var produceCodes = [];
                    produceCodes[0] = _.sample(this.baseCode, this.RX.Q3.oneBetCodeNum).sort();
                    produceCodes[1] = _.sample(this.baseCode, this.RX.Q3.oneBetCodeNum).sort();
                    produceCodes[2] = _.sample(this.baseCode, this.RX.Q3.oneBetCodeNum).sort();
                    return produceCodes;

                default:
                    return false;
    		}
    	},

    	/**
         * 验证输入的内容是否合法
         *
         * @param {[type]}
         *            code [description]
         * @return {Boolean} [description]
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
