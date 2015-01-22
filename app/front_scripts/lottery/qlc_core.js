/**
 * 七乐彩的库文件
 */
var QLC = {
    digitalCodeConnector : ',',
    errorMsg : '',
    // digitalDescMap : {0:'第一位',1:'第二位',2:'第三位',3:'第四位',4:'第五位',5:'第六位',6:'第七位'},
    maxOneBetMoney : 20000,
    maxBuyCodeLength : 100,
    maxMultiple : 9999,
    minMultiple : 1,
    maxBetNum : 100,
    minBetNum : 1,
    maxIssueNum : 30,
    minIssueNum : 1,
    Normal : {
        minCode : 1,
        maxCode : 30,
        oneBetCodeNum : 7,
        codeRegex : /^((0[1-9]|[1-2][0-9]|30)[,]){6,14}(0[1-9]|[1-2][0-9]|30)$/,
    },

    /**
     * 获取最后一条错误提示信息
     *
     * @return {[type]} [description]
     */
    getLastErrorMsg : function() {
        return this.errorMsg;
    },

    /**
     * 获取直选注数
     */
    getNormalZhushu : function(codes) {
        return Math.getCombineNum(codes.length, 7, 'C');
    },

    /**
     * 机选几注
     *
     * @param {[type]}
     *            betNum [description]
     * @param {Function}
     *            callback [description]
     * @return {[type]} [description]
     */
    produceOneBetCode : function() {
        return this.produceCodes(this.Normal.oneBetCodeNum);
    },

    /**
     * 机选几注
     *
     * @param {[type]}
     *            betNum [description]
     * @param {Function}
     *            callback [description]
     * @return {[type]} [description]
     */
    produceCodes : function(codeNum) {
        var produceCodes = [];
        for ( var m = codeNum - 1; m >= 0; ) {
            var currentCode = Math.getRandomInt(this.Normal.minCode, this.Normal.maxCode);
            currentCode = currentCode < 10 ? ('0'+currentCode).toString(): currentCode.toString();
            if($.inArray(currentCode, produceCodes) < 0){
                m--;
                produceCodes.push(currentCode);
            }
        }
        return produceCodes;
    },

    /**
     * 验证输入的内容是否合法
     *
     * @param {[type]}
     *            code [description]
     * @return {Boolean} [description]
     */
    isIllegalCode : function(code, callback) {
        if (!this.Normal.codeRegex.test(code)) {
            this.errorMsg = "投注号码格式错误, 参考格式:01,02,03,04,05,06,07,08";
            return false;
        }
        var returnZhushu = 0;
        var allDigitalCodes = code.split(this.digitalCodeConnector);
        var hash = {};
        for ( var m = 0; m < allDigitalCodes.length; m++) {
            if (hash[allDigitalCodes[m]]) {
                this.errorMsg = "重复投注了:" + allDigitalCodes[m];
                return false;
            }
            hash[allDigitalCodes[m]] = true;
        }
        returnZhushu += this.getNormalZhushu(allDigitalCodes);
        callback(allDigitalCodes, returnZhushu);
        return true;
    }
};
