var G_LOTY_CNNAME_MAP = {'gdx':'粤11选5', 'dlc':'赣11选5', 'syy':'十一运夺金', 'xjx':'新疆11选5'}
var G_BUY = {
    lotyName : '',
    lotyId : 1, // 快频接口需要
    lotyCNName : '',
    playName : '',
    codes : [],
    zhushu : 0,
    mutiple : 1,
    money : 0,
    qihaoId : 0,
    isManual : false,
    qihao : 0,
    partnerBuy : {
        projectTitle : '11选5合买方案', // 方案标题
        projectDescription : '11选5', // 方案标题
        partBuyMoney : 0, // 合买认购金额
        partAegisMoney : 0, // 合买认购金额
        commissionPercent : 0, // 合买提成
        shareLevel : 1, // 0，立即公开。 1，期号截止公开。 2，跟担人公开。 3，不公开
    }, // 合买
    rowIndex : 0,
    buyType : 1, // 1:自购, 2:追号, 3:合买, 4:多期机选
    trackData : {
        issueMutipleMap : {}, // qihaoID:期号id : object(qihao:期号, multiple:倍数)
        trackStopMoney : 0, // 中奖急停金额
    },
    proxyBuy : {
        betNum : 2,
        mutiple : 1,
        issueSize : 10,
    },

    init : function() {
        this.lotyName = $('#lotyName').val();
        this.playName = $('#playName').val();
        this.lotyCNName = G_LOTY_CNNAME_MAP[this.lotyName];
        this.codes = [];
        this.zhushu = 0;
        this.mutiple = 1;
        this.money = 0;
        this.isManual = false;
//        this.qihaoId = 0;//$('#qihaoId').val();
//        this.qihao = 0;//$('#qihao').val();
        this.partnerBuy = {
            projectTitle : '11选5合买方案', // 方案标题
            projectDescription : '11选5', // 方案标题
            partBuyMoney : 0, // 合买认购金额
            partAegisMoney : 0, // 合买认购金额
            commissionPercent : 0, // 合买提成
            shareLevel : 1, // 0，立即公开。 1，期号截止公开。 2，跟担人公开。 3，不公开
        }, this.rowIndex = 0;
        this.buyType = 1; // 1, 自购。 2， 追号， 3合买
        // this.trackData = {
        // issueMutipleMap: {}, // qihaoID:期号id : object(qihao:期号, multiple:倍数)
        // trackStopMoney: 0 // 中奖急停金额
        // };
        this.proxyBuy = {
            betNum : 2,
            multiple : 1,
            issueSize : 10,
        };
    },
};

var G_CHOOSE = {
    codes : [],
    zhushu : 0,
    money : 0,
    playType : 'R1',
    init : function() {
        this.codes = [];
        this.zhushu = 0;
        this.money = 0;
    },
};

var G_MODIFY_CODE_OBJ = {
    codeKey : -1,
    codeObj : {},
};

function init() {
    G_BUY.init();
    G_CHOOSE.init();
}
// myriabCodes, thousandCodes, hundredCodes, tenCodes, digitalCodes
$(document).ready(function() {
    init();
    var lessSeconds = 0;
    var stopSale = false;
    timer4Sale();
    loadCurrentIssue();
    function loadCurrentIssue(){
        $.ajax({
            url: '/lottery/issue/get-cur-issue?lottery_id='+lotyId,
            type: 'GET',
            dataType: 'json',
        })
        .done(function(data) {
            if(data.retCode === 100000){
                lessSeconds = Math.floor((data.retData[0].company_sell_etime - data.retData[0].sys_time));
                stopSale = (0===parseInt(data.retData[0].sell_status, 0));
                G_BUY.qihao = data.retData[0].issue_num;
                G_BUY.qihaoId = data.retData[0].id;
            }
        });
        loadNewestAward();
        loadYiLou();
        loadLastIssueList();
    }

    function loadLastIssueList(){
        // http://kp2.yuncai.com/lottery/issue/kuaipin/last-issue-n?loty_name=gdx&issue_num=5
        $.ajax({
            url: '/lottery/issue/kuaipin/last-issue-n?loty_name='+G_BUY.lotyName+'&issue_num=10',
            type: 'GET',
            dataType: 'json',
        })
        .done(function(data) {
            if(data.retCode==100000){
                // data
                var html = '';
                for (var i = 0, len=data.retData.length; i < len; i++) {
                    var kjhmHtml = ('' == data.retData[i]['kjhm']) ? '等待开奖' : '<span class="fc-3">'+data.retData[i]['kjhm']+'</span>';
                    html += '<tr><td>'+data.retData[i]['no']+'期</td><td>'+kjhmHtml+'</td></tr>';
                };
                $('#j-last-issue-n').html(html);
            }
        })
    }

    function loadNewestAward(){
        $.ajax({
            url: '/lottery/issue/get-last-award-info?lotteryId='+lotyId,
            type: 'GET',
            dataType: 'json',
        })
        .done(function(data) {
            if(data.retCode === 100000){
                var html = '';
                for ( var int = 0; int < data.retData.length; int++) {
                    if(int > 5) break;
                    html += "<tr>";
                    html += "<td>" + data.retData[int].username + "</td>";
                    html += "<td>" + data.retData[int].bonus_before_tax + "</td>";
                    html += "</tr>";
                }
                $('#j-new-bonus-list').html((html=='') ? '<tr><td colspan="2">暂无相关中奖纪录</td></tr>' : html);
            }else{
                $('#j-new-bonus-list').html('<tr><td colspan="2">系统繁忙</td></tr>');
            }
        })
        .fail(function() {
            console.log("error");
        });
    }

    function loadYiLou(){
        $.ajax({
            url: '/statistics/issue/yilou?lottery_id='+lotyId + '&issue=' + G_BUY.qihao,
            type: 'GET',
            dataType: 'json',
        })
        .done(function(data) {
            if(data.retCode === 100000){
                // 前一 // "1": "24|8|0|5|19|3|7|2|30|12|1",
                var arrQ1 = data.retData['1'].split('|');
                console.log(arrQ1);
                var max = _.max(arrQ1, function(chr){return parseInt(chr);});
                $('.j-row-q1').find('.j-yilou').each(function(index, el) {
                    console.log(arrQ1[index]);
                    var html = (max == arrQ1[index]) ? ('<b style="color:red;">'+arrQ1[index]+'</b>') : arrQ1[index];
                    $(this).html(html);
                });
                // 任选 // "2": "0|0|0|0|1|3|1|2|0|1|1",
                var arrRX = data.retData['2'].split('|');
                var max = _.max(arrRX, function(chr){return parseInt(chr);});
                $('.j-row-rx').each(function(index, el) {
                    $(this).find('.j-yilou').each(function(index2, el) {
                        $(this).html((max == arrRX[index2]) ? ('<b style="color:red;">'+arrRX[index2]+'</b>') : arrRX[index2]);
                    });
                });
                // 前二组选 // "9": "0|8|0|4|3|3|2|2|1|12|1",
                var arrQ2ZUX = data.retData['9'].split('|');
                var max = _.max(arrQ2ZUX, function(chr){return parseInt(chr);});
                $('.j-row-z2').find('.j-yilou').each(function(index, el) {
                    $(this).html((max == arrQ2ZUX[index]) ? '<b style="color:red;">'+arrQ2ZUX[index]+'</b>' : arrQ2ZUX[index]);
                });
                // 前三组选 // "10": "0|0|0|4|3|3|2|2|1|1|1",
                var arrQ3ZUX = data.retData['10'].split('|');
                var max = _.max(arrQ3ZUX, function(chr){return parseInt(chr);});
                $('.j-row-z3').find('.j-yilou').each(function(index, el) {
                    $(this).html((max == arrQ3ZUX[index]) ? '<b style="color:red;">'+arrQ3ZUX[index]+'</b>' : arrQ3ZUX[index]);
                });
                // 前三直选 // "12": "24|8|0|5|19|3|7|2|30|12|1$0|24|10|4|3|8|2|6|1|13|5$3|0|26|38|7|13|11|8|5|1|2",
                var arrQ2ZHX = data.retData['11'].split('$');;
                $('.j-row-zx2').each(function(index, el) {
                    var arrQ2DigitalZHX = arrQ2ZHX[index].split('|');
                    var max = _.max(arrQ2DigitalZHX, function(chr){return parseInt(chr);});
                    $(this).find('.data-bit-'+index).find('.j-yilou').each(function(index2, el) {
                        $(this).html((max == arrQ2DigitalZHX[index2]) ? '<b style="color:red;">'+arrQ2DigitalZHX[index2]+"</b>" : arrQ2DigitalZHX[index2]);
                    });
                });
                // 前三直选 // "12": "24|8|0|5|19|3|7|2|30|12|1$0|24|10|4|3|8|2|6|1|13|5$3|0|26|38|7|13|11|8|5|1|2",
                var arrQ3ZHX = data.retData['12'].split('$');;
                $('.j-row-zx3').each(function(index, el) {
                    var arrQ3DigitalZHX = arrQ3ZHX[index].split('|');
                    var max = _.max(arrQ3DigitalZHX, function(chr){return parseInt(chr);});
                    $(this).find('.data-bit-'+index).find('.j-yilou').each(function(index2, el) {
                        $(this).html((max == arrQ3DigitalZHX[index2]) ? '<b style="color:red;">'+arrQ3DigitalZHX[index2]+"</b>" : arrQ3DigitalZHX[index2]);
                    });
                });
            }
        })
    }

    function timer4Sale(){
        $('#j-current-issue').html(G_BUY.qihao);
        if(stopSale){
            $('#j-less-info').html('停止销售');
        }else if(lessSeconds > 0){
            var minute = Math.floor(lessSeconds / 60 % 60);
            minute = (minute < 10) ? '0' + minute : minute;
            var seconds = lessSeconds % 60;
            seconds = (seconds < 10) ? '0' + seconds : seconds;
            $('#j-less-info').html('<span id="j-less-minute">'+minute+'</span>分<span id="j-less-second">'+seconds+'</span>秒');
        }else{
            $('#j-less-info').html('销售时间截止');
            if(G_BUY.qihao){
                APP.showTips("您好，第 "+G_BUY.qihao+" 期已截止，投注时请确认您选择的期号。");
            }
            loadCurrentIssue();
            if(G_BUY.buyType == 2){
                queryTrackIssueList($('#issue_size').val());
            }
        }
    }
    timer4Sale();
    setInterval(function() {
        timer4Sale();
        if(((lessSeconds--) % 60) === 0){
            loadCurrentIssue();
        }
    }, 1000);

    $(".j-num-group").on('click', 'a', function(event) {
        event.preventDefault();
        /* Act on the event */
        var dataBit = parseInt($(this).parents('.j-row-code').attr('data-bit'));
        var arr = null;
        var num = $(this).html();
        if (!G_CHOOSE.codes[dataBit]) {
           G_CHOOSE.codes[dataBit] = [];
        }
        arr = G_CHOOSE.codes[dataBit].concat();
        if ($(this).hasClass('active')) {
            // 删除元素,依赖：Lo-Dash.js库
            _.remove(arr, function(n) {
                return n == num;
            });
        } else {
            // 判断其他位是否有选择该号码，如果有则删除之
            cleanAnotherBitData(num, dataBit);
            arr.push(num);
        }
        G_CHOOSE.codes[dataBit] = arr;
        G_CHOOSE.codes[dataBit].sort();
        $(this).toggleClass('active');
        calculateChooseCodes();
        displayChooseInfo();
    });

    /**
     * 自助选号action
     */
    $('.j-quick-method').on('click', 'span', function(event) {
        event.preventDefault();
        /* Act on the event */
        $(this).toggleClass('active');
        var dataBit = parseInt($(this).parents('.j-row-code').attr('data-bit'));
        G_CHOOSE.codes[dataBit] = [];
        switch ($(this).attr('data-type')) {
            // 奇数
            case 'odd':
                $(this).parents('.j-row-code').find('.j-num-group a').each(function(index) {
                    $(this).removeClass('active');
                    if (index % 2 == 0) {
                        $(this).toggleClass('active');
                        cleanAnotherBitData($(this).html(), dataBit);
                        G_CHOOSE.codes[dataBit].push($(this).html());
                    }
                });
                break;
            // 偶数
            case 'even':
                $(this).parents('.j-row-code').find('.j-num-group a').each(function(index) {
                    $(this).removeClass('active');
                    if (index % 2 != 0) {
                        cleanAnotherBitData($(this).html(), dataBit);
                        $(this).toggleClass('active');
                        G_CHOOSE.codes[dataBit].push($(this).html());
                    }
                });
                break;
            // 大数
            case 'big':
                $(this).parents('.j-row-code').find('.j-num-group a').each(function(index) {
                    $(this).removeClass('active');
                    if (index > 5) {
                        cleanAnotherBitData($(this).html(), dataBit);
                        $(this).toggleClass('active');
                        G_CHOOSE.codes[dataBit].push($(this).html());
                    }
                });
                break;
            // 小数
            case 'small':
                $(this).parents('.j-row-code').find('.j-num-group a').each(function(index) {
                    $(this).removeClass('active');
                    if (index <=5) {
                        cleanAnotherBitData($(this).html(), dataBit);
                        $(this).toggleClass('active');
                        G_CHOOSE.codes[dataBit].push($(this).html());
                    }
                });
                break;
            // 全部
            case 'all':
                $(this).parents('.j-row-code').find('.j-num-group a').each(function(index) {
                    cleanAnotherBitData($(this).html(), dataBit);
                    $(this).addClass('active');
                    G_CHOOSE.codes[dataBit].push($(this).html());
                });
                break;

            // 清除
            case 'clean':
                G_CHOOSE.codes[dataBit].length = 0;
                $(this).parents('.j-row-code').find('.j-num-group a').each(function(index) {
                    $(this).removeClass('active');
                });
                break;
        }
        calculateChooseCodes();
        displayChooseInfo();
    });

    /**
     * 添加到投注列表按钮
     */
    $('#choose_to_buy').on('click', function(event) {
        var bool = false;
        if(G_CHOOSE.zhushu < 1){
            return;
        }
        switch (parseInt($('#choose_to_buy').attr('data-add'))) {
            case 0:
                if (G_CHOOSE.money > Core11x5.maxOneBetMoney) {
                    APP.showTips('您好，单个投注的金额应小于' + Core11x5.maxOneBetMoney + '元，请返回重新选择');
                    return false;
                } else {
                    for ( var key in G_BUY.codes) {
                        if (G_BUY.codes[key].key == G_MODIFY_CODE_OBJ.codeKey) {
                            G_BUY.codes[key].value = G_CHOOSE.codes;
                        }
                    }
                }
                var html = '';
                switch(G_CHOOSE.playType){
                    case Core11x5.playType.R1:
                    case Core11x5.playType.R2:
                    case Core11x5.playType.R3:
                    case Core11x5.playType.R4:
                    case Core11x5.playType.R5:
                    case Core11x5.playType.R6:
                    case Core11x5.playType.R7:
                    case Core11x5.playType.R8:
                    case Core11x5.playType.Z2:
                    case Core11x5.playType.Z3:
                        html = '<div class="br-zhu-item clearfix" databit="' + G_MODIFY_CODE_OBJ.codeKey + '">';
                        html += '<b>['+Core11x5.playCNType[G_CHOOSE.playType]+']</b>';
                        html += '<span data-c="0">' + G_CHOOSE.codes[0].join(' ') + '</span>';
                        html += '<div class="pull-right">';
                        html += '<b><i class="money" data-m="1">' + G_CHOOSE.money + '</i>元</b>';
                        html += '<a href="javascript:;" class="br-zhu-set">修改</a><a href="javascript:;" class="br-zhu-del">删除</a></div></div>';
                        break;

                    case Core11x5.playType.Q2:
                        html = '<div class="br-zhu-item clearfix" databit="' + G_MODIFY_CODE_OBJ.codeKey + '">';
                        html += '<b>['+Core11x5.playCNType[G_CHOOSE.playType]+']</b>';
                        html += '<span data-c="0">' + G_CHOOSE.codes[0].join(' ') + ',' + G_CHOOSE.codes[1].join(' ') + '</span>';
                        html += '<div class="pull-right">';
                        html += '<b><i class="money" data-m="1">' + G_CHOOSE.money + '</i>元</b>';
                        html += '<a href="javascript:;" class="br-zhu-set">修改</a><a href="javascript:;" class="br-zhu-del">删除</a></div></div>';
                        break;

                    case Core11x5.playType.Q3:
                        html = '<div class="br-zhu-item clearfix" databit="' + G_MODIFY_CODE_OBJ.codeKey + '">';
                        html += '<b>['+Core11x5.playCNType[G_CHOOSE.playType]+']</b>';
                        html += '<span data-c="0">' + G_CHOOSE.codes[0].join(' ') + ',' + G_CHOOSE.codes[1].join(' ') + ',' + G_CHOOSE.codes[2].join(' ')  + '</span>';
                        html += '<div class="pull-right">';
                        html += '<b><i class="money" data-m="1">' + G_CHOOSE.money + '</i>元</b>';
                        html += '<a href="javascript:;" class="br-zhu-set">修改</a><a href="javascript:;" class="br-zhu-del">删除</a></div></div>';
                        break;

                    default:
                        return false;
                }
                G_MODIFY_CODE_OBJ.codeObj.replaceWith(html);
                bool = true;
                break;

            case 1:
                switch(G_CHOOSE.playType){
                    case Core11x5.playType.R1:
                    case Core11x5.playType.R2:
                    case Core11x5.playType.R3:
                    case Core11x5.playType.R4:
                    case Core11x5.playType.R5:
                    case Core11x5.playType.R6:
                    case Core11x5.playType.R7:
                    case Core11x5.playType.R8:
                    case Core11x5.playType.Z2:
                    case Core11x5.playType.Z3:
                        bool = makeChooseCodeHtml(G_CHOOSE.playType, G_CHOOSE.codes);
                        break;

                    case Core11x5.playType.Q2:
                    case Core11x5.playType.Q3:
                        bool = makeChooseCodeHtml(G_CHOOSE.playType, G_CHOOSE.codes);
                        break;

                    default:
                        return false;
                }
                break;
        }
        if (bool) {
            calculateBuyCodes();
            displayBuyInfo();
            $("#choose_zhushu").html(0);
            $("#choose_money").html(0);
            $("#sd_number").val('');
            $('.j-num-group a.active').removeClass();
            G_CHOOSE.init();
            $('#choose_to_buy_tip').html('添加到投注列表');
            $('#choose_to_buy').attr('data-add', 1);
            $('#choose_to_buy').removeClass('active');
            $('#choose_to_buy').attr('disabled', 'disabled');
        }

    });

    /**
     * 机选按钮
     */
    $('.j-zhu-adds').on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        var betNum = parseInt($(this).attr('data-zhu'));
        if (G_BUY.codes.length + betNum > Core11x5.maxBuyCodeLength) {
            APP.showTips('您的投注号码多于' + Core11x5.maxBuyCodeLength + '行，请返回重新选择');
            return;
        }
        for ( var i = betNum - 1; i >= 0; i--) {
            var produceCode = Core11x5.produceCode(G_CHOOSE.playType);
            if(false === produceCode){
                return;
            }
//            G_CHOOSE.zhushu = 1;
//            G_CHOOSE.money = 2;
            makeChooseCodeHtml(G_CHOOSE.playType, produceCode);
        }
        calculateBuyCodes();
        displayBuyInfo();
//        calculateChooseCodes();
        displayChooseInfo();
    });

    /**
     * 单击事件
     */
    $('.br-zhu-l').on('click', '.br-zhu-item', function(event) {
        event.preventDefault();
        if (G_BUY.isManual) {
            return;
        }
        if (event.target.tagName == "A") {
            return;
        }
        reflectChooseCode($(this).attr('databit'));
        $('#choose_to_buy').addClass('active');
    });

    /**
     * 删除投注号码
     */
    $('.br-zhu-l').on('click', '.br-zhu-del', function(event) {
        // event.preventDefault();
        /* Act on the event */
        // alert($(this).parents('.br-zhu-item')[0] ==
        // G_MODIFY_CODE_OBJ.codeObj[0]);
        if ($(this).parents('.br-zhu-item')[0] == G_MODIFY_CODE_OBJ.codeObj[0]) {
            $('#choose_to_buy').attr('data-add', 1);
            $('#choose_to_buy_tip').html('添加到投注列表');
        }
        var dataBit = $(this).parents('.br-zhu-item').attr('dataBit');
        _.remove(G_BUY.codes, function(n) {
            return n.key == dataBit;
        });
        $(this).parents('.br-zhu-item').remove();
        calculateBuyCodes();
        displayBuyInfo();
    });

    /**
     * 修改投注号码
     */
    $('.br-zhu-l').on('click', '.br-zhu-set', function(event) {
        // event.preventDefault();
        var objectKey = $(this).parents('.br-zhu-item').attr('databit');
        reflectChooseCode(objectKey);
        $('#choose_to_buy').addClass('active');
        $('#choose_to_buy').attr('data-add', 0);
        $('#choose_to_buy_tip').html('修改投注号码');
        G_MODIFY_CODE_OBJ = {
        codeKey : objectKey,
        codeObj : $(this).parents('.br-zhu-item')
        };
    });

    /**
     * 清空列表
     */
    $('#clean_buy_code').on('click', function(event) {
        // event.preventDefault();
        // clean html
        $("#code_list").html('');
        var buyType = G_BUY.buyType;
        G_BUY.init();
        calculateBuyCodes();
        displayBuyInfo();
        G_BUY.buyType = buyType;
    });

    /**
     * 自降倍数
     */
    $('#decrease_mutiple').on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        var mutipleObj = $("#project_mutiple");
        var currentMultiple = parseInt(mutipleObj.val());
        currentMultiple--;
        // G_BUY.mutiple = (currentMutiple <= 0) ? 1 : currentMutiple;
        if (currentMultiple < Core11x5.minMultiple) {
            G_BUY.mutiple = Core11x5.minMultiple;
        } else if (currentMultiple > Core11x5.maxMultiple) {
            G_BUY.mutiple = Core11x5.maxMultiple;
        } else {
            G_BUY.mutiple = currentMultiple;
        }
        mutipleObj.val(G_BUY.mutiple);
        calculateBuyCodes();
        displayBuyInfo();
    });

    /**
     * 自降倍数
     */
    $('#project_mutiple').on('change', function(event) {
        event.preventDefault();
        /* Act on the event */
        var currentMultiple = parseInt($(this).val()) || 0;
        if (currentMultiple < Core11x5.minMultiple) {
            G_BUY.mutiple = Core11x5.minMultiple;
        } else if (currentMultiple > Core11x5.maxMultiple) {
            G_BUY.mutiple = Core11x5.maxMultiple;
        } else {
            G_BUY.mutiple = currentMultiple;
        }
        $(this).val(G_BUY.mutiple);
        calculateBuyCodes();
        displayBuyInfo();
    });

    /**
     * 自增倍数
     */
    $('#increase_mutiple').on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        var mutipleObj = $("#project_mutiple");
        var currentMultiple = parseInt(mutipleObj.val());
        currentMultiple++;
        // G_BUY.mutiple = (currentMutiple <= 0) ? 1 : currentMutiple;
        if (currentMultiple < Core11x5.minMultiple) {
            G_BUY.mutiple = Core11x5.minMultiple;
        } else if (currentMultiple > Core11x5.maxMultiple) {
            G_BUY.mutiple = Core11x5.maxMultiple;
        } else {
            G_BUY.mutiple = currentMultiple;
        }
        mutipleObj.val(G_BUY.mutiple);
        calculateBuyCodes();
        displayBuyInfo();
    });

    /**
     * 提交购买按钮
     */
    $('#buy-submit').on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        if ($(this).parents('.br-tou').find('.j-sub-agreed')[0].checked === false) {
            APP.showTips("请先阅读并同意《委托投注规则》后才能继续");
            return;
        }
        fnBuy();
    });

    /**
     * 切换购买方式
     */
    $('#buy_type').on('click', 'a', function(event) {
        event.preventDefault();
        /* Act on the event */
        G_BUY.trackData.issueMutipleMap = {}; // clean
        $('#buy_mutiple_span').show();
        G_BUY.partnerBuy = {
            projectTitle : '11选5合买方案',
            projectDescription : '11选5'
        }; // clean partner buy
        G_BUY.buyType = parseInt($(this).attr('data-buytype'));
        G_BUY.mutiple = 1;
        $('#project_mutiple').val(G_BUY.mutiple);
        switch (G_BUY.buyType) {
            case 1: // 自购
                $('#track_desc').addClass('hide');
//                calculateBuyCodes();
//                displayBuyInfo();
                break;

            case 2: // 追号
                $('#buy_mutiple_span').hide();
                $('#track_desc').removeClass('hide');
                queryTrackIssueList(10);
//                calculateBuyCodes();
//                displayBuyInfo();
                break;
        }
        calculateBuyCodes();
        displayBuyInfo();
    });

    $('#issue_size').on('change', function(event) {
        event.preventDefault();
        /* Act on the event */
        G_BUY.trackData.issueMutipleMap = {}; // clean
        queryTrackIssueList($(this).val());
    });

    $('.br-details thead .br-zhui-c').on('change', function(event) {
        var checked = $(this)[0].checked;
        $(this).parents('.br-details').find('tbody .br-zhui-c').each(function(index, el) {
            el.checked = checked;
        });
        // ZHUI.setZhuiHaoTotal(Config.box);
        G_BUY.trackData.issueMutipleMap = {}; // clean
        $(this).parents('.br-details').find('tbody .br-zhui-c').each(function(index, el) {
            if (el.checked) {
                G_BUY.trackData.issueMutipleMap[$(this).attr('data-qihaoid')] = {
                        qihao : $(this).attr('data-qi'),
                        mutiple : $(this).parents('tr').find('.br-zhui-bei').val()
                };
            }
        });
        calculateBuyCodes();
        displayBuyInfo();
    });

    // 追号总期的期数改变
    $('.br-details').on('change', 'tbody .br-zhui-c', function(event) {
        event.preventDefault();
        /* Act on the event */
        // ZHUI.setZhuiHaoTotal(Config.box);
        G_BUY.trackData.issueMutipleMap = {}; // clean
        $(this).parents('.br-details').find('tbody .br-zhui-c').each(function(index, el) {
            if (el.checked) {
                G_BUY.trackData.issueMutipleMap[$(this).attr('data-qihaoid')] = {
                    qihao : $(this).attr('data-qi'),
                    mutiple : $(this).parents('tr').find('.br-zhui-bei').val()
                };
            }
        });
        calculateBuyCodes();
        displayBuyInfo();
    });

    // 追号总期的倍数改变
    $('.br-details thead .br-zhui-bei').on('change', function(event) {
        var val = parseInt($(this).val()) || 1;
        if (isNaN(val) || val < 1) {
            val = 1;
        } else {
            val = Math.ceil(val);
            (val > 9999) && (val = 9999);
        }
        $(this).val(val);
        var baseObj = $(this).parents('.br-details');
        baseObj.find('tbody .br-zhui-bei').val(val);
        baseObj.find('tbody .br-zhui-c').each(function(index, el) {
            el.checked = 'checked';
            G_BUY.trackData.issueMutipleMap[$(this).attr('data-qihaoid')] = {
                qihao : $(this).attr('data-qi'),
                mutiple : $(this).parents('tr').find('.br-zhui-bei').val()
            };
        });
        calculateBuyCodes();
        displayBuyInfo();
    });

    // 追号每期的倍数改变
    $('.br-details tbody').on('change', '.br-zhui-bei', function(event) {
        var val = parseInt($(this).val()) || 1;
        if (isNaN(val) || val < 1) {
            val = 1;
        } else {
            val = Math.ceil(val);
            (val > 9999) && (val = 9999);
        }
        $(this).val(val);
        var baseObj = $(this).parents('tr');
        var issueObj = baseObj.find('.br-zhui-c');
        issueObj.attr('checked', 'checked');
        G_BUY.trackData.issueMutipleMap[issueObj.attr('data-qihaoid')] = {
            qihao : issueObj.attr('data-qi'),
            mutiple : baseObj.find('.br-zhui-bei').val()
        };
        calculateBuyCodes();
        displayBuyInfo();
    });

    // br-type icon toggle
    $('#buy_type a[data-toggle="tab"]').on('click', function(e) {
        $(this).parents('#buy_type').find('.icon-y2').removeClass('icon-y2');
        $(this).find('.icon').addClass('icon-y2');
    });

    $('#track_stop_money').on('change', function() {
        event.preventDefault();
        /* Act on the event */
        var trackStopMoney = parseInt($(this).val()) || 3000;
        $(this).val(trackStopMoney);
    });

    /**
     * 玩法type切换
     */
    $('#j-nav').on('click', 'a', function(event) {
        event.preventDefault();
        // 1, 获取选中的li
        var objCurrentSelect = $(this).parents('li');
        objCurrentSelect.addClass('active');
        // 2, 灰掉其他所有的li
        objCurrentSelect.siblings().removeClass('active');
        // 更新当前玩法类型
        // 3, 显示当前tab所对应的选号区
        G_CHOOSE.playType = $(this).attr('data-playtype');
        var objCurrentSelectCodeArea = $("#j-box-left .j-choose-code-" + G_CHOOSE.playType);
        objCurrentSelectCodeArea.show();
        objCurrentSelectCodeArea.siblings().hide();

        G_BUY.init();
        G_CHOOSE.init();
        clean4CutBuyType();
        calculateChooseCodes();
        displayChooseInfo();
        calculateBuyCodes();
        displayBuyInfo();

        $("#choose_zhushu").html(0);
        $("#choose_money").html(0);
        $("#sd_number").val('');
        $('#choose_to_buy_tip').html('添加到投注列表');
        $('#choose_to_buy').attr('data-add', 1);
        $('#choose_to_buy').removeClass('active');
        $('#choose_to_buy').attr('disabled', 'disabled');
        $('#choose_to_buy').attr('data-add', '1');
        $('.j-num-group a.active').removeClass();
        $('#buy-submit').attr("disabled", "disabled");
        $("li[name='auto_produce']").show();
        $('#j-box-right').show();
        $('#j-box-bottom').show();
        $('#j-box-left').removeClass('multiphase-box');
    });

    // ////////////////////////function/////////////////////////////////////////
    function cleanAnotherBitData(currentCode, currentDataBit) {
        var objCurrentSelectCodeArea = $("#j-box-left .j-choose-code-" + G_CHOOSE.playType);
        for (var i = 2; i >= 0; i--) {
            if(i!=currentDataBit){
                objCurrentSelectCodeArea.find('.j-row-code[data-bit='+i+']').each(function(index, el) {
                    if(G_CHOOSE.codes[i]){
                        // 判断其他位是否有选择该号码，如果有则删除之
                        if($.inArray(currentCode, G_CHOOSE.codes[i]) >=0){
                            // 删除元素,依赖：Lo-Dash.js库
                            _.remove(G_CHOOSE.codes[i], function(n) {
                                return n == currentCode;
                            });
                            // 移除按钮的active事件
                            $(this).find('.j-num-group a.active').each(function(index, el) {
                                if($(this).html() === currentCode) {
                                    $(this).removeClass('active');
                                }
                            });
                        }
                    }
                });
            }
        };
    }

    /**
     * 计算手选号码注数
     */
    function calculateChooseCodes() {
        G_CHOOSE.zhushu = 0;
        G_CHOOSE.money = 0;
        var zhushu = Core11x5.getBetNum(G_CHOOSE.playType, G_CHOOSE.codes);
        G_CHOOSE.zhushu += zhushu;
        G_CHOOSE.money += zhushu * 2;
    }

    /**
     * 显示选择号码的相关信息
     */
    function displayChooseInfo(){
        if (G_CHOOSE.zhushu > 0) {
            $('#choose_to_buy').addClass('active');
            $('#choose_to_buy').removeAttr('disabled');
        } else {
            $('#choose_to_buy').removeClass('active');
            $('#choose_to_buy').attr('disabled', 'disabled');
        }
        $("#choose_zhushu").html(G_CHOOSE.zhushu);
        $("#choose_money").html(G_CHOOSE.money);
    }

    /**
     * 计算已选中的投注号码
     */
    function calculateBuyCodes() {
        var zhushu = 0;
        for ( var i = G_BUY.codes.length - 1; i >= 0; i--) {
            zhushu += Core11x5.getBetNum(G_BUY.codes[i].playType, G_BUY.codes[i].value);
        }
        G_BUY.zhushu = zhushu;
        G_BUY.money = 2 * zhushu * G_BUY.mutiple;
    }

    /**
     * 显示投注的相关信息
     */
    function displayBuyInfo(){
        $('#buy_zhushu').html(G_BUY.zhushu);
        $('#project_price').html(G_BUY.money);
        $('#track_issue_num').html(0);
        $('#track_money').html(0);
        if (Object.size(G_BUY.trackData.issueMutipleMap) > 0) {
            var trackIssueSize = 0;
            G_BUY.money = 0;
            for ( var qihaoId in G_BUY.trackData.issueMutipleMap) {
                trackIssueSize++;
                var currentIssueMoney = 2 * G_BUY.zhushu * G_BUY.trackData.issueMutipleMap[qihaoId].mutiple;
                G_BUY.money += currentIssueMoney;
                $('.br-details').find('tbody .br-zhui-c').each(function(index, el) {
                    if ($(this).attr('data-qihaoid') == qihaoId) {
                        $(this).parents('tr').find('.j-money').html(currentIssueMoney);
                        return;
                    }
                });
            }
            $('#track_issue_num').html(trackIssueSize);
            $('#track_money').html(G_BUY.money);
        }
        if (G_BUY.money > 0) {
            $('#buy-submit').removeAttr("disabled");
        } else {
            $('#buy-submit').attr("disabled", "disabled");
        }
    }

    /**
     * 插入投注列表
     * RX, Z3, Z2 => [codes]
     * Q2 => [0=>[codes], 1=>[codes]]
     * Q3 => [0=>[codes], 1=>[codes], 2=>[codes]]
     */
    function makeChooseCodeHtml(playType, codes) {
        if (G_CHOOSE.money > Core11x5.maxOneBetMoney) {
            APP.showTips('您好，单个投注的金额应小于' + Core11x5.maxOneBetMoney + '元，请返回重新选择');
            return false;
        }
        if ((G_BUY.codes.length + G_CHOOSE.codes.length) > Core11x5.maxBuyCodeLength) {
            APP.showTips('您的投注号码多于' + Core11x5.maxBuyCodeLength + '行，请返回重新选择');
            return false;
        }
        var newCodes = codes;
        var html = '';
        G_BUY.rowIndex++;

        switch(playType){

            case Core11x5.playType.R1:
            case Core11x5.playType.R2:
            case Core11x5.playType.R3:
            case Core11x5.playType.R4:
            case Core11x5.playType.R5:
            case Core11x5.playType.R6:
            case Core11x5.playType.R7:
            case Core11x5.playType.R8:
            case Core11x5.playType.Z2:
            case Core11x5.playType.Z3:
                var money = 2 * Core11x5.getBetNum(playType, newCodes);
                html += '<div class="br-zhu-item clearfix" dataBit=' + G_BUY.rowIndex + '>';
                html += '<b>['+Core11x5.playCNType[playType]+']</b>';
                html += '<div class="list">';
                html += '<span data-c="0">' + newCodes[0].join(' ') + '</span>';
                html += '</div>';
                html += '<div class="pull-right"><b><i class="money" data-m="1">' + money + '</i>元</b><a href="javascript:;" class="br-zhu-set">修改</a><a href="javascript:;" class="br-zhu-del">删除</a></div></div>';
                break;

            case Core11x5.playType.Q2:
                var money = 2 * Core11x5.getBetNum(playType, newCodes);
                html += '<div class="br-zhu-item clearfix" dataBit=' + G_BUY.rowIndex + '>';
                html += '<b>['+Core11x5.playCNType[playType]+']</b>';
                html += '<div class="list">';
                html += '<span data-c="0">' + newCodes[0].join(' ') + ',' + newCodes[1].join(' ') + '</span>';
                html += '</div>';
                html += '<div class="pull-right"><b><i class="money" data-m="1">' + money + '</i>元</b><a href="javascript:;" class="br-zhu-set">修改</a><a href="javascript:;" class="br-zhu-del">删除</a></div></div>';
                break;

            case Core11x5.playType.Q3:
                var money = 2 * Core11x5.getBetNum(playType, newCodes);
                html += '<div class="br-zhu-item clearfix" dataBit=' + G_BUY.rowIndex + '>';
                html += '<b>['+Core11x5.playCNType[playType]+']</b>';
                html += '<div class="list">';
                html += '<span data-c="0">' + newCodes[0].join(' ') + ',' + newCodes[1].join(' ') + ',' + newCodes[2].join(' ') + '</span>';
                html += '</div>';
                html += '<div class="pull-right"><b><i class="money" data-m="1">' + money + '</i>元</b><a href="javascript:;" class="br-zhu-set">修改</a><a href="javascript:;" class="br-zhu-del">删除</a></div></div>';
                break;

            default:
                return false;
        }
        G_BUY.codes.push({
            key : G_BUY.rowIndex,
            value : newCodes,
            playType : playType,
        });
        $("#code_list").append(html);
        return true;
    }

    function reflectChooseCode(buyIndex) {
//        $('#j_normal_choose_code').find('.j-num-group a').removeClass('active');
        $('.j-num-group a.active').removeClass();
        var codes = {};
        for ( var index in G_BUY.codes) {
            if (G_BUY.codes[index].key == buyIndex) {
                codes = G_BUY.codes[index];
                break;
            }
        }
        G_CHOOSE.init();
        for(var i = 0; i < codes.value.length; i++) {
            G_CHOOSE.codes[i] = [];
            $('.j-choose-code-'+codes.playType).find('.j-row-code[data-bit=' + i + '] a').each(function(index) {
                for ( var m = 0; m < codes.value[i].length; m++) {
                    if ($(this).html() == codes.value[i][m]) {
                        $(this).addClass('active');
                        G_CHOOSE.codes[i].push(codes.value[i][m]);
                    }
                }
            });
        }
        calculateChooseCodes();
        displayChooseInfo();
    }

    /**
     * 切换购买方式清空数据
     */
    function clean4CutBuyType() {
        $(".br-zhu-l").html('');
        $('#sd-list').html('');
        G_BUY.init();
        calculateBuyCodes();
        displayBuyInfo();
    }

    /**
     * 读取追号期号集合
     */
    function queryTrackIssueList(num) {
        var html = '';
        G_BUY.trackData.issueMutipleMap = {}; // clean
        $('.br-details thead .br-zhui-bei').val(1);
        $.ajax({
            url : '/lottery/issue/get-issue-list?lottery_id=' + lotyId + '&issue_size=' + num,
            type : 'GET',
            dataType : 'json',
        }).done(function(data) {
            if (data.retCode == 100000) {
                for ( var i = 0; i < data.retData.length; i++) {
                    var m = i + 1;
                    var unitPrice = 2 * G_BUY.zhushu;
                    G_BUY.trackData.issueMutipleMap[data.retData[i][0]] = ({
                    qihao : data.retData[i][1],
                    mutiple : 1
                    });
                    html += '<tr><td>' + m + '</td><td><input type="checkbox" class="br-zhui-c" data-qihaoid="' + data.retData[i][0] + '"data-qi="' + data.retData[i][1] + '" checked="">' + data.retData[i][1] + '期</td><td><input type="text" class="br-input br-zhui-bei" value="1">倍</td><td><span class="j-money">' + unitPrice + '</span>元</td><td><span class="ml15">' + data.retData[i][2] + '</span></td></tr>';
                }
            } else {
                html = '<tr><td colspan="5">系统繁忙， 请稍候再试</td></tr>';
            }
            $('#track_issue_list').html(html);
            calculateBuyCodes();
            displayBuyInfo();
        }).fail(function() {
            html = '<tr><td colspan="5">系统繁忙， 请稍候再试</td></tr>';
            $('#track_issue_list').html(html);
        });
    }

    var fnBuy = function() {
        var url = '';
        var codeArr = [];
        var playType = '';
        for ( var i = 0; i < G_BUY.codes.length; i++) {
            playType = G_BUY.codes[i].playType; // 如果多个玩法， 则需要修改
            switch (G_BUY.codes[i].playType) {
                case Core11x5.playType.R1:
                case Core11x5.playType.R2:
                case Core11x5.playType.R3:
                case Core11x5.playType.R4:
                case Core11x5.playType.R5:
                case Core11x5.playType.R6:
                case Core11x5.playType.R7:
                case Core11x5.playType.R8:
                case Core11x5.playType.Z2:
                case Core11x5.playType.Z3:
                    codeArr.push(G_BUY.codes[i].playType + '|' + G_BUY.codes[i].value[0].join(' '));
                    break;

                case Core11x5.playType.Q2:
                    // 第一位, 第二位
                    codeArr.push(G_BUY.codes[i].playType + '|' + G_BUY.codes[i].value[0].join(' ') + ',' + G_BUY.codes[i].value[1].join(' '));
                    break;

                case Core11x5.playType.Q3:
                    codeArr.push(G_BUY.codes[i].playType + '|' + G_BUY.codes[i].value[0].join(' ') + ',' + G_BUY.codes[i].value[1].join(' ') + ',' + G_BUY.codes[i].value[2].join(' '));
                    break;

                default:
                    return;
            }
        }
        var parameter = {
            zhushu : G_BUY.zhushu,
            beishu : G_BUY.mutiple,
            codes : codeArr.join('$'),
            unikey: (new Date()).valueOf(),
        };

        var comfirmHtml = '';
        switch (G_BUY.buyType) {
            case 1:
                url = '/lottery/kuaipin/buy-self/' + G_BUY.lotyName + '/' + playType;
                parameter.qihaoId = G_BUY.qihaoId;
                parameter.qihao = G_BUY.qihao;
                comfirmHtml = makeConfirmHtml(1, G_BUY.lotyCNName, parameter.qihao, G_BUY.zhushu, G_BUY.mutiple, G_BUY.money, 0, 0, 0, 0);
                break;

            case 2:
                url = '/lottery/kuaipin/buy-track/' + G_BUY.lotyName + '/' + playType;
                var postIssueParameter = [];
                for ( var qihaoId in G_BUY.trackData.issueMutipleMap) {
                    postIssueParameter.push(qihaoId + '|' + G_BUY.trackData.issueMutipleMap[qihaoId].qihao + '|' + G_BUY.trackData.issueMutipleMap[qihaoId].mutiple);
                }
                if (postIssueParameter.length < 1) {
                    APP.showTips("追号最少购买一期");
                    return;
                }
                parameter.endminmoney = ($('#is_end_zhongjiang')[0].checked) ? 1 : 0; //$('#track_stop_money').val(); // 1表示中奖即停，0表示非
                parameter.zhuihaoqihao = postIssueParameter;
                costRealMoney = G_BUY.money;
                comfirmHtml = makeConfirmHtml(2, G_BUY.lotyCNName, 0, 0, 0, 0, 0, 0, postIssueParameter.length, G_BUY.money);
                break;
        }

        $.ajax({
            url : '/account/islogin',
            type : 'get',
            dataType : 'json',
        }).done(function(D) {
            if (D.retCode === 100000) {
                if (Number(D.retData.money.replace(/,/g, '')) >= G_BUY.money) {
                    APP.showTips({
                    html : comfirmHtml,
                    title : '投注确认'
                    });
                    $('#buyConfirm').one('click', function(event) {
                        $.ajax({
                            url : url,
                            type : 'POST',
                            dataType : 'json',
                            data : parameter,
                        }).done(function(data) {
                            if(data.retCode === 100000){
                                buySuccess(data.retCode, data.retMsg, data.retData.projectNo, data.retData.trackId, G_BUY.money, G_BUY.lotyName, G_BUY.lotyCNName);
                            }else{
                                APP.showTips(data.retMsg);
                                return;
                            }
                        }).fail(function() {
                            buyFailure(G_BUY.lotyName, G_BUY.lotyCNName);
                        });
                    });
                } else {
                    APP.showTips({
                        html: '<div class="tipbox"><p>您的余额不足,购买失败！</p><p class="last"><a href="/account/top-up" class="btn btn-danger" target="_blank">立即充值</a></p></div>'
                    });
                }
            } else {
                APP.handRetCode(D.retCode, D.retMsg, fnBuy);
            }
        });
    }

    function makeConfirmHtml(buyType, LotyCNName, issueNum, betNum, mutiple, projectPrice, buyPrice, aegisPrice, trackSize, trackMoney) {
        var commHtml = '<div class="frbox"><img src="' + staticHostURI + '/front_images/fail.png" alt="success" class="icon"><div class="text">';
        switch (buyType) {
            case 1: // 自购
                commHtml += '<p>' + LotyCNName + ' 第<span>' + issueNum + '</span>期</p><p>共<span>' + betNum + '</span>注, 投注<span>' + mutiple + '</span>倍</p><p>本次需支付<span class="fc-3">' + projectPrice.toFixed(2) + '</span>元</p>';
                break;

            case 2: // 追号
                commHtml += '<p>追号<span>' + trackSize + '</span>期</p><p>本次需支付<span class="fc-3">' + trackMoney + '</span>元</p>';
            case 4: // 机选
                break;

            case 3: // 合买
                if (aegisPrice > 0) {
                    commHtml += '<p>' + LotyCNName + ' 第<span>' + issueNum + '</span>期</p><p>方案总金额<span class="fc-3">' + projectPrice.toFixed(2) + '</span>元</p><p>您认购<span>' + buyPrice.toFixed(2) + '</span>元, 保底<span>' + aegisPrice.toFixed(2) + '</span>元</p><p>共需支付<span class="fc-3">' + (buyPrice + aegisPrice).toFixed(2) + '</span>元</p>';
                } else {
                    commHtml += '<p>' + LotyCNName + ' 第<span>' + issueNum + '</span>期</p><p>方案总金额<span class="fc-3">' + projectPrice.toFixed(2) + '</span>元</p><p>您认购<span>' + buyPrice.toFixed(2) + '</span>元</p><p>共需支付<span class="fc-3">' + (buyPrice + aegisPrice).toFixed(2) + '</span>元</p>';
                }
                break;
        }
        commHtml += '<div class="btns"><button class="btn btn-danger" id="buyConfirm">确定</button><button class="btn btn-gray" data-dismiss="modal">取消</button></div></div></div>';
        return commHtml;
    }

    function buySuccess(retCode, retMsg, projectNo, trackId, buyMoney, lotyName, lotyCNName) {
        if (retCode == 100000) {

            store.set('lotyName', lotyName);
            store.set('lotyCNName', lotyCNName);
            store.set('payMoney', buyMoney);
            store.set('projectNo', projectNo);
            store.set('trackId', trackId);
            window.location.href = '/html/lottery/trade/success.html';
        } else {
            APP.handRetCode(retCode, retMsg);
        }
    }

    function buyFailure(lotyName, lotyCNName) {

        store.set('lotyName', lotyName);
        store.set('lotyCNName', lotyCNName);
        window.location.href = '/html/lottery/trade/fail.html';
    }
});
