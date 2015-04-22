/**
 * 江西时时彩的库文件
 */
var CoreJxssc = {
    digitalCodeConnector: ',',
    errorMsg: '',
    digitalDescMap: {
        0: '万位',
        1: '千位',
        2: '百位',
        3: '十位',
        4: '个位'
    },
    playType: {
        '5XZX': '5XZX',
        '5XTX': '5XTX',
        '4XZX': '4XZX',
        '3XZX': '3XZX',
        '3XZ3': '3XZ3',
        '3XZ6': '3XZ6',
        '2XZX': '2XZX',
        '2XZXHZ': '2XZXHZ',
        '2XZ2': '2XZ2',
        '2XTXHZ': '2XTXHZ',
        '1XZX': '1XZX',
        'DXSD': 'DXSD',
        'R1': 'R1',
        'R2': 'R2'
    },
    playCNType: {
        '5XZX': '五星直选',
        '5XTX': '五星通选',
        '4XZX': '四星直选',
        '3XZX': '三星直选',
        '3XZ3': '三星组三',
        '3XZ6': '三星组六',
        '2XZX': '二星直选',
        '2XZXHZ': '二星直选和值',
        '2XZ2': '二星组选',
        '2XTXHZ': '二星组选和值',
        '1XZX': '一星',
        'DXSD': '大小双单',
        'R1': '任选一',
        'R2': '任选二'
    },
    maxOneBetMoney: 20000,
    maxBuyCodeLength: 100,
    maxMultiple: 9999,
    minMultiple: 1,
    maxBetNum: 100,
    minBetNum: 1,
    maxIssueNum: 30,
    minIssueNum: 1,
    baseCode: ['0','1', '2', '3', '4', '5', '6', '7', '8', '9'],
    hzbaseCode: ['0','1', '2', '3', '4', '5', '6', '7', '8', '9','10','11','12','13','14','15','16','17','18'],
    baseDXSDCode: ['1', '2', '4', '5'],
    baseDigitalValue: [0, 1, 2, 3, 4],

    // 任选对象
    '5XZX': {
        minCode: 1,
        maxCode: 9,
        oneBetCodeNum: 1,
        codeRegex: /^(([0-9]){1,10},){4}([0-9]){1,10}$/,
    },
    '5XTX': {
        minCode: 1,
        maxCode: 9,
        oneBetCodeNum: 1,
        codeRegex: /^(([0-9]){1,10},){4}([0-9]){1,10}$/,
    },
    '4XZX': {
        minCode: 1,
        maxCode: 9,
        oneBetCodeNum: 1,
        codeRegex: /^(([0-9]){1,10},){3}([0-9]){1,10}$/,
    },
    '3XZX': {
        minCode: 1,
        maxCode: 9,
        oneBetCodeNum: 1,
        codeRegex: /^(([0-9]){1,10},){2}([0-9]){1,10}$/,
    },
    '3XZ3': {
        minCode: 1,
        maxCode: 9,
        oneBetCodeNum: 1,
        codeRegex: /^(([0-9])[,]){1,9}([0-9])$/,
    },
    '3XZ6': {
        minCode: 1,
        maxCode: 9,
        oneBetCodeNum: 1,
        codeRegex: /^(([0-9])[,]){2,9}([0-9])$/,
    },
    '2XZX': {
        minCode: 1,
        maxCode: 9,
        oneBetCodeNum: 2,
        codeRegex: /^(([0-9]){1,10},){1}([0-9]){1,10}$/,
    },
    '2XZXHZ': {
        minCode: 1,
        maxCode: 9,
        oneBetCodeNum: 1,
        codeRegex: /^(([0-9]|1[0-8]),){0,18}([0-9]|1[0-8]){1}$/,
    },
    '2XZ2': {
        minCode: 1,
        maxCode: 9,
        oneBetCodeNum: 1,
        codeRegex: /^(([0-9])[,]){1,9}([0-9])$/,
    },
    '2XTXHZ': {
        minCode: 1,
        maxCode: 9,
        oneBetCodeNum: 1,
        codeRegex: /^(([0-9]|1[0-8]),){0,18}([0-9]|1[0-8]){1}$/,
    },
    '1XZX': {
        minCode: 1,
        maxCode: 9,
        oneBetCodeNum: 1,
        codeRegex: /^(([0-9]){1,10}){0}([0-9]){1,10}$/,
    },
    'DXSD': {
        minCode: 1,
        maxCode: 9,
        oneBetCodeNum: 1,
        codeRegex: /^((1|2|4|5){1,4}[,]){1}((1|2|4|5){1,4})$/,
    },
    'R1': {
        minCode: 1,
        maxCode: 9,
        oneBetCodeNum: 1,
        codeRegex: /^((-|([0-9]{1,10})),){0,4}((-|[0-9]{1,10}))$/,
    },
    'R2': {
        minCode: 1,
        maxCode: 9,
        oneBetCodeNum: 1,
        codeRegex: /^((-|([0-9]{1,10})),){0,4}((-|[0-9]{1,10}))$/,
    },

    /**
     * 获取最后一条错误提示信息
     *
     * @return {[type]} [description]
     */
    getLastErrorMsg: function() {
        return this.errorMsg;
    },

    getBetNum: function(playType, code) {
        switch (playType) {
            case this.playType['5XZX']:
                if (code.length != 5) {
                    return 0;
                }
                return code[0].length * code[1].length * code[2].length * code[3].length * code[4].length;
            case this.playType['5XTX']:
                if (code.length != 5) {
                    return 0;
                }
                return code[0].length * code[1].length * code[2].length * code[3].length * code[4].length;
            case this.playType['4XZX']:
                if (code.length != 4) {
                    return 0;
                }
                return code[0].length * code[1].length * code[2].length * code[3].length;
            case this.playType['3XZX']:
                if (code.length != 3) {
                    return 0;
                }
                return code[0].length * code[1].length * code[2].length;
            case this.playType['3XZ3']:
                if ((code.length != 1)) {
                    return 0;
                }
                return 2 * YC.Unit.getCombineNum(code[0].length, 2);

            case this.playType['3XZ6']:
                if ((code.length != 1)) {
                    return 0;
                }
                //alert(YC.Unit.getCombineNum(code[0].length, 3));
                return YC.Unit.getCombineNum(code[0].length, 3);

            case this.playType['2XZX']:
                if ((code.length != 2)) {
                    return 0;
                }
                return code[0].length * code[1].length;

            case this.playType['2XZXHZ']:
                if ((code.length != 1)) {
                    return 0;
                }
                var mapCodeBetNum = {
                    '0': 1,
                    '1': 2,
                    '2': 3,
                    '3': 4,
                    '4': 5,
                    '5': 6,
                    '6': 7,
                    '7': 8,
                    '8': 9,
                    '9': 10,
                    '10': 9,
                    '11': 8,
                    '12': 7,
                    '13': 6,
                    '14': 5,
                    '15': 4,
                    '16': 3,
                    '17': 2,
                    '18': 1
                };
                var totalBetNum = 0;
                for (var index = 0; index < code[0].length; index++) {
                    totalBetNum += mapCodeBetNum[code[0][index]];
                }
                return totalBetNum;

            case this.playType['2XZ2']:
                if ((code.length == 0)) {
                    return 0;
                }
                return YC.Unit.getCombineNum(code[0].length, 2);

            case this.playType['2XTXHZ']:
                if ((code.length == 0)) {
                    return 0;
                }
                var mapCodeBetNum = {
                    '0': 1,
                    '1': 1,
                    '2': 2,
                    '3': 2,
                    '4': 3,
                    '5': 3,
                    '6': 4,
                    '7': 4,
                    '8': 5,
                    '9': 5,
                    '10': 5,
                    '11': 4,
                    '12': 4,
                    '13': 3,
                    '14': 3,
                    '15': 2,
                    '16': 2,
                    '17': 1,
                    '18': 1
                };
                var totalBetNum = 0;
                for (var index = 0; index < code[0].length; index++) {
                    totalBetNum += mapCodeBetNum[code[0][index]];
                }
                return totalBetNum;

            case this.playType['1XZX']:
                if ((code.length == 0)) {
                    return 0;
                }
                return code[0].length;

            case this.playType['DXSD']:
                if (code.length != 2) {
                    return 0;
                }
                return code[0].length * code[1].length;

            case this.playType['R1']:
                if (code.length < 1) {
                    return 0;
                }
                var WanWeiSize = (code[0]) ? code[0].length : 0;
                var QianWeiSize = (code[1]) ? code[1].length : 0;
                var BaiWeiSize = (code[2]) ? code[2].length : 0;
                var ShiWeiSize = (code[3]) ? code[3].length : 0;
                var GeWeiSize = (code[4]) ? code[4].length : 0;
                return WanWeiSize + QianWeiSize + BaiWeiSize + ShiWeiSize + GeWeiSize;

            case this.playType['R2']:
                if (code.length < 2) {
                    return 0;
                }
                var WanWeiSize = 0,
                    QianWeiSize = 0,
                    BaiWeiSize = 0,
                    ShiWeiSize = 0,
                    GeWeiSize = 0;
                var arrKey = [];
                (code[0]) && arrKey.push(0);
                (code[1]) && arrKey.push(1);
                (code[2]) && arrKey.push(2);
                (code[3]) && arrKey.push(3);
                (code[4]) && arrKey.push(4);
                var arrCombineds = YC.Unit.explodeCombined(arrKey, 2);
                var iTotalBetNum = 0;
                for (var i = arrCombineds.length - 1; i >= 0; i--) {
                    var iUnitNum = 1;
                    for (var m = arrCombineds[i].length - 1; m >= 0; m--) {
                        iUnitNum *= code[arrCombineds[i][m]].length;
                    };
                    iTotalBetNum += iUnitNum;
                };
                return iTotalBetNum;

            default:
                return false;
        }
    },

    /**
     * 机选几注
     */
    produceCode: function(playType) {
        var produceCodes = [];
        var produceCodes2 = [[]];//定义二位数组，用于存储三星组三等只有一行号码可选，但是又要选择多个号码的情况
        var tmp = [];
        switch (playType) {
            case this.playType['5XZX']:
                produceCodes[0] = _.sample(this.baseCode, 1);
                produceCodes[1] = _.sample(this.baseCode, 1);
                produceCodes[2] = _.sample(this.baseCode, 1);
                produceCodes[3] = _.sample(this.baseCode, 1);
                produceCodes[4] = _.sample(this.baseCode, 1);
                return produceCodes;

            case this.playType['5XTX']:
                produceCodes[0] = _.sample(this.baseCode, 1);
                produceCodes[1] = _.sample(this.baseCode, 1);
                produceCodes[2] = _.sample(this.baseCode, 1);
                produceCodes[3] = _.sample(this.baseCode, 1);
                produceCodes[4] = _.sample(this.baseCode, 1);
                return produceCodes;

            case this.playType['4XZX']:
                produceCodes[0] = _.sample(this.baseCode, 1);
                produceCodes[1] = _.sample(this.baseCode, 1);
                produceCodes[2] = _.sample(this.baseCode, 1);
                produceCodes[3] = _.sample(this.baseCode, 1);
                return produceCodes;

            case this.playType['3XZX']:
                produceCodes[0] = _.sample(this.baseCode, 1);
                produceCodes[1] = _.sample(this.baseCode, 1);
                produceCodes[2] = _.sample(this.baseCode, 1);
                return produceCodes;

            case this.playType['3XZ3']:
                //return false;
                tmp = _.sample(this.baseCode, 2);
                produceCodes2[0][0] = tmp[0];
                produceCodes2[0][1] = tmp[1];
                produceCodes2[0].sort();
                return produceCodes2;

            case this.playType['3XZ6']:
                tmp = _.sample(this.baseCode, 3);
                produceCodes2[0][0] = tmp[0];
                produceCodes2[0][1] = tmp[1];
                produceCodes2[0][2] = tmp[2];
                produceCodes2[0].sort();
                return produceCodes2;

            case this.playType['2XZX']:
                produceCodes[0] = _.sample(this.baseCode, 1);
                produceCodes[1] = _.sample(this.baseCode, 1);
                return produceCodes;

            case this.playType['2XZXHZ']:
                //return false;
                produceCodes[0] = _.sample(this.hzbaseCode, 1);
                return produceCodes;

            case this.playType['2XZ2']:
                tmp = _.sample(this.baseCode, 2);
                produceCodes2[0][0] = tmp[0];
                produceCodes2[0][1] = tmp[1];
                produceCodes2[0].sort();
                return produceCodes2;

            case this.playType['2XTXHZ']:
                //return false;
                produceCodes[0] = _.sample(this.hzbaseCode, 1);
                return produceCodes;

            case this.playType['1XZX']:
                produceCodes[0] = _.sample(this.baseCode, 1);
                return produceCodes;

            case this.playType['DXSD']:
                produceCodes[0] = _.sample(this.baseDXSDCode, 1);
                produceCodes[1] = _.sample(this.baseDXSDCode, 1);
                for (var i = 0; i < 2; i++) {
                    switch(produceCodes[i]["0"]){//大用 2 表示,小用 1 表示,单用 5 表示,双用 4 表示
                        case '2' :
                            produceCodes[i]["0"] = '大';
                        break;
                        case '1' :
                            produceCodes[i]["0"] = '小';
                        break;
                        case '5' :
                            produceCodes[i]["0"] = '单';
                        break;
                        case '4' :
                            produceCodes[i]["0"] = '双';
                        break;
                    }
                };
                return produceCodes;

            case this.playType['R1']:
                var arrNewDigitalClone = this.baseDigitalValue.concat();
                var index = _.sample(arrNewDigitalClone, 1);
                var arrNewDataClone = this.baseCode.concat();
                produceCodes[index] = _.sample(arrNewDataClone, 1);
                return produceCodes;

            case this.playType['R2']:
                // first
                var arrNewDigitalClone = this.baseDigitalValue.concat();
                var firstIndex = _.sample(arrNewDigitalClone, 1);
                _.remove(arrNewDigitalClone, function(currentCode) {
                    return firstIndex == currentCode;
                });
                var arrNewDataClone = this.baseCode.concat();
                produceCodes[firstIndex] = _.sample(arrNewDataClone, 1);
                // second
                arrNewDataClone = this.baseCode.concat();
                var secondIndex = _.sample(arrNewDigitalClone, 1);;
                produceCodes[secondIndex] = _.sample(arrNewDataClone, 1);
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
    isIllegalCode: function(code, callback) {
        return false;
    }
};
