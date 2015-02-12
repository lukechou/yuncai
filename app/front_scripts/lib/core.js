/**
 * 获取指定min与min之间的随机数
 *
 * @param int
 *            min 最小随机数
 * @param int
 *            max 最大随机数
 * @return int 生成的随机数
 *
 */
Math.getRandomInt = function(min, max) {
	var c = max - min + 1;
	return Math.floor(Math.random() * c + min);
	// return Math.floor(Math.random() * (max - min)) + min;
};

/**
 * 获取组合数
 *
 * @param int
 *            totalNum 总数
 * @param int
 *            selectNum 选取的个数
 * @return int 总的组合数
 */
Math.getCombineNum = function(totalNum, selectNum) {
	var maxs = 1, mins = 1;
	if ((totalNum <= 0) || (totalNum < selectNum))
		return 0;
	for ( var i = totalNum - selectNum + 1; i < totalNum + 1; i++) {
		maxs = maxs * i;
	}
	for ( var i = 1; i < selectNum + 1; i++) {
		mins = mins * i;
	}
	return maxs / mins;
};

/**
 *
 * var myArray = new Object(); myArray["firstname"] = "Gareth";
 * myArray["lastname"] = "Simpson"; myArray["age"] = 21;
 *
 * Object.size(myArray) = 3;
 *
 * @param {[type]}
 *            obj [description]
 * @return {[type]} [description]
 */
Object.size = function(obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key))
			size++;
	}
	return size;
};

// array
Array.prototype.max = function() {
	return Math.max.apply({}, this);
};

Array.prototype.min = function() {
	return Math.min.apply({}, this);
};

var YC = {}; // 云彩基类
YC.Unit = {}; // 工具类


YC.Unit.explodeCombined = function(numArr, concreteArrLen){
    var iArrSize = numArr.length;
    var iSizeOfCombinations = Math.pow(2, iArrSize);
    var arrRtn = [];
    for(var i = 0; i < iSizeOfCombinations; i++)
    {
        var arrUnitRtn = [];
        for(var j = 0; j < iArrSize; j++)
        {
            if(Math.pow(2, j) & i)
            {
                arrUnitRtn.push(numArr[j]);
            }
        }
        arrRtn.push(arrUnitRtn);
    }
    if(concreteArrLen){
        var arrNewRtn = [];
        for (var i = arrRtn.length - 1; i >= 0; i--) {
            if(arrRtn[i].length == concreteArrLen){
                arrNewRtn.push(arrRtn[i]);
            }
        };
        arrRtn = arrNewRtn;
    }
    return arrRtn;
};

YC.Unit.getCombineNum = function(totalNum, selectNum) {
    var maxs = 1, mins = 1;
    if ((totalNum <= 0) || (totalNum < selectNum))
        return 0;
    for ( var i = totalNum - selectNum + 1; i < totalNum + 1; i++) {
        maxs = maxs * i;
    }
    for ( var i = 1; i < selectNum + 1; i++) {
        mins = mins * i;
    }
    return maxs / mins;
};

// 10, 7 => 5
// 10, 9 => 10
// 10, 6 => 5

/**
 * 最大公约数
 */
YC.Unit.getMaxDivisor = function(a, b) {
    return (a % b) ? this.getMaxDivisor(b, a % b) : b;
}
/**
 * 获取最大整除数
 * @param  {[type]} a [description]
 * @param  {[type]} b [description]
 * @return {[type]}   [description]
 */
YC.Unit.getMaxDivisible = function(a, b) {
    if(a <= b){
        return a;
    }
    var iMaxDivisibleNo = 0;
    for (var i = 1; i <= a; i++) {
        if(a % i===0){
            if(i > b){
                return ((b - iMaxDivisibleNo) > (a - b)) ? a : iMaxDivisibleNo;
            }
            iMaxDivisibleNo = i;
        }
    }
}
YC.Unit.getReasonableNo = function(maxNo, iptNo){
    if(maxNo <= iptNo){
        return maxNo;
    }
    if(iptNo <= 1) {
        return iptNo;
    }
    var iMaxDivisor = this.getMaxDivisor(maxNo, iptNo);
    if((maxNo - iptNo) > (iptNo-iMaxDivisor)){
        return iMaxDivisor;
    }
    return maxNo;
}
