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
