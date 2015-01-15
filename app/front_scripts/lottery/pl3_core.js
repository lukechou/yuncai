var PL3={
	property:{
		ZhiXuanNormal:{
			minCode :0,
			maxCode :9,
			oneBetCodeDigitalNum:3, // 需要三位组成
			unitDigtalNum:1, // 每位一个数
		},
		ZhixuanHeZhi:{
			minCode :0,
			maxCode :27,
			oneBetCodeNum:1,
		},
		ZhiXuan3Normal:{
			minCode :0,
			maxCode :9,
			oneBetCodeNum:2,
		},
		Zhixuan3HeZhi:{
			minCode :1,
			maxCode :26,
			oneBetCodeNum:1,
		},
		ZhiXuan6Normal:{
			minCode :0,
			maxCode :9,
			oneBetCodeNum:3,
		},
		Zhixuan6HeZhi:{
			minCode :3,
			maxCode :24,
			oneBetCodeNum:1,
		},
	}
};

/**
 * 直选
 * @param  {[type]} hundredCodes  [description]
 * @param  {[type]} tenCodes      [description]
 * @param  {[type]} digitalCodes  [description]
 * @return {[type]}               [description]
 */
PL3.property.getZhiXuanZhushu = function(hundredCodes, tenCodes, digitalCodes) {
	var hundredNum = Math.getCombineNum(hundredCodes.length, 1, 'C');
	var tenNum = Math.getCombineNum(tenCodes.length, 1, 'C');
	var digitalNum = Math.getCombineNum(digitalCodes.length, 1, 'C');
	return hundredNum * tenNum * digitalNum;
}

/**
 * 获取直选合值的注数
 * @param  {[type]} codes [description]
 * @return {[type]}      [description]
 */
PL3.property.getZhiXuanHeZhiZhushu = function(codes) {
	var hezhiZhushuMap = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 63, 69, 73, 75, 75, 73, 69, 63, 55, 45, 36, 28, 21, 15, 10, 6, 3, 1];
	var zhushu = 0;
	for (var i = codes.length - 1; i >= 0; i--) {
		zhushu += hezhiZhushuMap[codes[i]]|0;
	};
	return zhushu;
}

/**
 * 获取组选3常规投注的注数
 * @param  {[type]} codes [description]
 * @return {[type]}      [description]
 */
PL3.property.getZuXuan3NormalZhushu = function(codes) {
	return 2 * Math.getCombineNum(codes.length, PL3.property.ZhiXuan3Normal.oneBetCodeNum);
}

/**
 * 获取组选3合值投注的注数
 * @param  {[type]} codes [description]
 * @return {[type]}      [description]
 */
PL3.property.getZuXuan3HeZhiZhushu = function(codes) {
	var hezhiZhushuMap = [1, 2, 1, 3, 3, 3, 4, 5, 4, 5, 5, 4, 5, 5, 4, 5, 5, 4, 5, 4, 3, 3, 3, 1, 2, 1];
	var zhushu = 0;
	for (var i = codes.length - 1; i >= 0; i--) {
		zhushu += hezhiZhushuMap[codes[i]-1]|0;
	};
	return zhushu;
}

/**
 * 获取组选3胆托投注的注数
 * @param  {[type]} codes [description]
 * @return {[type]}      [description]
 */
PL3.property.getZuXuan3DanTuoZhushu = function(danCodes, tuoCodes) {
	return Math.getCombineNum(tuoCodes.length, PL3.property.ZhiXuan3Normal.oneBetCodeNum - danCodes.length);
}

/**
 * 获取组选6常规投注的注数
 * @param  {[type]} codes [description]
 * @return {[type]}      [description]
 */
PL3.property.getZuXuan6NormalZhushu = function(codes) {
	return 2 * Math.getCombineNum(codes.length, PL3.property.ZhiXuan6Normal.oneBetCodeNum);
}


/**
 * 获取组选6合值的注数
 * @param  {[type]} codes [description]
 * @return {[type]}      [description]
 */
PL3.property.getZuXuan6HeZhiZhushu = function(codes) {
	var hezhiZhushuMap = [1, 1, 2, 3, 4, 5, 7, 8, 9, 10, 10, 10, 10, 9, 8, 7, 5, 4, 3, 2, 1, 1];
	var zhushu = 0;
	for (var i = codes.length - 1; i >= 0; i--) {
		zhushu += hezhiZhushuMap[codes[i]-3]|0;
	};
	return zhushu;
}

/**
 * 获取组选3胆托投注的注数
 * @param  {[type]} codes [description]
 * @return {[type]}      [description]
 */
PL3.property.getZuXuan3DanTuoZhushu = function(danCodes, tuoCodes) {
	return Math.getCombineNum(tuoCodes.length, PL3.property.ZhiXuan6Normal.oneBetCodeNum - danCodes.length);
}

/**
 * 生成直选常规投注号码
 * @param  {[type]} betNum [description]
 * @return {[type]}        [description]
 */
PL3.property.produceZhixuanNormalCode = function(betNum) {
	var produceCodes = [];
	for (var i = betNum; i > 0; i--) {
		produceCodes[i]=[];
		for (var i = PL3.property.ZhiXuanNormal.oneBetCodeDigitalNum; i > 0; i--) {
			produceCodes[i].push(getRandomInt(PL3.property.ZhiXuanNormal.minCode, PL3.property.ZhiXuanNormal.maxCode));
		}
	};
	return produceCodes;
}
