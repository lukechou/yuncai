var G_BUY = {
lotyName : '',
lotyCNName : '七星彩',
playName : '',
codes : [],
zhushu : 0,
mutiple : 1,
money : 0,
qihaoId : 0,
isManual : false,
qihao : 0,
partnerBuy : {
projectTitle : '七星彩合买方案', // 方案标题
projectDescription : '七星彩', // 方案标题
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
    this.codes = [];
    this.zhushu = 0;
    this.mutiple = 1;
    this.money = 0;
    this.isManual = false;
    this.qihaoId = $('#qihaoId').val();
    this.qihao = $('#qihao').val();
    this.partnerBuy = {
    projectTitle : '七星彩合买方案', // 方案标题
    projectDescription : '七星彩', // 方案标题
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
// firstBitCodes, secondBitCodes, thirdBitCodes, fourthBitCodes, fifthBitCodes
$(document).ready(function() {
    init();
    $(".j-num-group").on('click', 'a', function(event) {
        event.preventDefault();
        /* Act on the event */
        var dataBit = parseInt($(this).parents('.j-row-code').attr('data-bit'));
        var arr = null;
        var num = $(this).html();
        if (typeof G_CHOOSE.codes[0] === 'undefined') {
            G_CHOOSE.codes[0] = [];
        }
        if (typeof G_CHOOSE.codes[0][dataBit] === 'undefined') {
            G_CHOOSE.codes[0][dataBit] = [];
        }
        arr = G_CHOOSE.codes[0][dataBit].concat();
        if ($(this).hasClass('active')) {
            // 删除元素,依赖：Lo-Dash.js库
            _.remove(arr, function(n){
                return n == num;
            });
        } else {
            arr.push(num);
        }
        G_CHOOSE.codes[0][dataBit] = arr;
        G_CHOOSE.codes[0][dataBit].sort();
        $(this).toggleClass('active');
        calculateChooseCodes();
    });

    /**
     * 自助选号action
     * 
     * @param {[type]}
     *            event) { event.preventDefault();
     *            $(this).toggleClass('active'); var dataBit [description]
     * @return {[type]} [description]
     */
    $('.j-quick-method').on('click', 'span', function(event) {
        event.preventDefault();
        /* Act on the event */
        $(this).toggleClass('active');
        var dataBit = parseInt($(this).parents('.j-row-code').attr('data-bit'));
        if (typeof G_CHOOSE.codes[0] === 'undefined') {
            G_CHOOSE.codes[0] = [];
        }
        G_CHOOSE.codes[0][dataBit] = [];
        switch ($(this).attr('data-type')) {
            // 奇数
            case 'odd':
                $(this).parents('.j-row-code').find('.j-num-group a').each(function(index) {
                    $(this).removeClass('active');
                    if (index % 2 != 0) {
                        $(this).toggleClass('active');
                        G_CHOOSE.codes[0][dataBit].push(parseInt($(this).html()));
                    }
                });
                break;

            // 偶数
            case 'even':
                $(this).parents('.j-row-code').find('.j-num-group a').each(function(index) {
                    $(this).removeClass('active');
                    if (index % 2 == 0) {
                        $(this).toggleClass('active');
                        G_CHOOSE.codes[0][dataBit].push(parseInt($(this).html()));
                    }
                });
                break;

            // 大数
            case 'big':
                $(this).parents('.j-row-code').find('.j-num-group a').each(function(index) {
                    $(this).removeClass('active');
                    if (index >= 5) {
                        $(this).toggleClass('active');
                        G_CHOOSE.codes[0][dataBit].push(parseInt($(this).html()));
                    }
                });
                break;

            // 小数
            case 'small':
                $(this).parents('.j-row-code').find('.j-num-group a').each(function(index) {
                    $(this).removeClass('active');
                    if (index <= 4) {
                        $(this).toggleClass('active');
                        G_CHOOSE.codes[0][dataBit].push(parseInt($(this).html()));
                    }
                });
                break;

            // 全部
            case 'all':
                $(this).parents('.j-row-code').find('.j-num-group a').each(function(index) {
                    $(this).addClass('active');
                    G_CHOOSE.codes[0][dataBit].push(parseInt($(this).html()));
                });
                break;

            // 清除
            case 'clean':
                G_CHOOSE.codes[0][dataBit].length = 0;
                $(this).parents('.j-row-code').find('.j-num-group a').each(function(index) {
                    $(this).removeClass('active');
                });
                break;
        }
        calculateChooseCodes();
    });

    /**
     * 添加到投注列表按钮
     * 
     * @param {[type]}
     *            event) { for (var i [description]
     * @return {[type]} [description]
     */
    $('#choose_to_buy').on('click', function(event) {
        var bool = false;
        switch (parseInt($('#choose_to_buy').attr('data-add'))) {
            case 0:
                var firstBitCodes = G_CHOOSE.codes[0][0] || [];
                var secondBitCodes = G_CHOOSE.codes[0][1] || [];
                var thirdBitCodes = G_CHOOSE.codes[0][2] || [];
                var fourthBitCodes = G_CHOOSE.codes[0][3] || [];
                var fifthBitCodes = G_CHOOSE.codes[0][4] || [];
                var sixthBitCodes = G_CHOOSE.codes[0][5] || [];
                var sevenBitCodes = G_CHOOSE.codes[0][6] || [];
                if (!(firstBitCodes.length > 0 && secondBitCodes.length > 0 && thirdBitCodes.length > 0 && fourthBitCodes.length > 0 && fifthBitCodes.length > 0 && sixthBitCodes.length > 0 && sevenBitCodes.length > 0)) {
                    return;
                }

                if (G_CHOOSE.money > QXC.maxOneBetMoney) {
                    APP.showTips('您好，单个投注的金额应小于' + QXC.maxOneBetMoney + '元，请返回重新选择');
                    return false;
                } else {
                    for ( var key in G_BUY.codes) {
                        if (G_BUY.codes[key].key == G_MODIFY_CODE_OBJ.codeKey) {
                            G_BUY.codes[key].value = G_CHOOSE.codes[0];
                        }
                    }
                }
                var html = '<div class="br-zhu-item clearfix" databit="' + G_MODIFY_CODE_OBJ.codeKey + '"><b>[常规投注]</b><div class="list"><span data-c="0">' + G_CHOOSE.codes[0][0].join('') + '</span><span data-c="0">' + G_CHOOSE.codes[0][1].join('') + '</span><span data-c="0">' + G_CHOOSE.codes[0][2].join('') + '</span><span data-c="0">' + G_CHOOSE.codes[0][3].join('') + '</span><span data-c="0">' + G_CHOOSE.codes[0][4].join('') + '</span><span data-c="0">' + G_CHOOSE.codes[0][5].join('') + '</span><span data-c="0">' + G_CHOOSE.codes[0][6].join('') + '</span></div><div class="pull-right"><b><i class="money" data-m="1">' + G_CHOOSE.money + '</i>元</b><a href="javascript:;" class="br-zhu-set">修改</a><a href="javascript:;" class="br-zhu-del">删除</a></div></div>';
                G_MODIFY_CODE_OBJ.codeObj.replaceWith(html);
                bool = true;
                break;

            case 1:
                for ( var i = G_CHOOSE.codes.length - 1; i >= 0; i--) {
                    if (!(G_CHOOSE.codes[i][0].length > 0 && G_CHOOSE.codes[i][1].length > 0 && G_CHOOSE.codes[i][2].length > 0 && G_CHOOSE.codes[i][3].length > 0 && G_CHOOSE.codes[i][4].length > 0)) {
                        return;
                    }
                }
                bool = makeChooseCodeHtml(G_CHOOSE.codes);
                break;
        }
        if (bool) {
            calculateBuyCodes();
            $("#choose_zhushu").html(0);
            $("#choose_money").html(0);
            $("#sd_number").val('');
            // $('.j-num-group a.active').removeClass();
            $('#j_normal_choose_code').find('.j-num-group a').removeClass('active');
            G_CHOOSE.init();
            $('#choose_to_buy_tip').html('添加到投注列表');
            $('#choose_to_buy').attr('data-add', 1);
            $('#choose_to_buy').removeClass('active');
            $('#choose_to_buy').attr('disabled', 'disabled');
        }

    });

    /**
     * 机选按钮
     * 
     * @param {[type]}
     *            event) { event.preventDefault(); var betNum [description]
     * @return {[type]} [description]
     */
    $('.j-zhu-adds').on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        var betNum = parseInt($(this).attr('data-zhu'));
        if (G_BUY.codes.length + betNum > QXC.maxBuyCodeLength) {
            APP.showTips('您的投注号码多于' + QXC.maxBuyCodeLength + '行，请返回重新选择');
            return;
        }
        for ( var i = betNum - 1; i >= 0; i--) {
            QXC.produceCode(function(codes) {
                makeChooseCodeHtml([ codes ]);
            });
        }
        calculateBuyCodes();
        // update together buy paramater
        updateCreatePartProjectParame();
    });

    /**
     * 单击事件
     * 
     * @param {[type]}
     *            event) { event.preventDefault(); alert(1); } [description]
     * @return {[type]} [description]
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
     * 
     * @param {[type]}
     *            event) { var dataBit [description]
     * @return {[type]} [description]
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
        updateCreatePartProjectParame();
    });

    /**
     * 修改投注号码
     * 
     * @param {[type]}
     *            event) { var dataBit [description]
     * @return {[type]} [description]
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
     * 
     * @param {[type]}
     *            event) { $("#code_list").html(''); G_BUY.init();
     *            calculateBuyCodes(); updateCreatePartProjectParame(); }
     *            [description]
     * @return {[type]} [description]
     */
    $('#clean_buy_code').on('click', function(event) {
        // event.preventDefault();
        // clean html
        $("#code_list").html('');
        var buyType = G_BUY.buyType;
        G_BUY.init();
        calculateBuyCodes();
        G_BUY.buyType = buyType;
        updateCreatePartProjectParame();
    });

    /**
     * 自降倍数
     * 
     * @param {[type]}
     *            event) { event.preventDefault(); var mutipleObj [description]
     * @return {[type]} [description]
     */
    $('#decrease_mutiple').on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        var mutipleObj = $("#project_mutiple");
        var currentMultiple = parseInt(mutipleObj.val());
        currentMultiple--;
        // G_BUY.mutiple = (currentMutiple <= 0) ? 1 : currentMutiple;
        if (currentMultiple < QXC.minMultiple) {
            G_BUY.mutiple = QXC.minMultiple;
        } else if (currentMultiple > QXC.maxMultiple) {
            G_BUY.mutiple = QXC.maxMultiple;
        } else {
            G_BUY.mutiple = currentMultiple;
        }
        mutipleObj.val(G_BUY.mutiple);
        calculateBuyCodes();
        updateCreatePartProjectParame();
    });

    /**
     * 自降倍数
     * 
     * @param {[type]}
     *            event) { event.preventDefault(); var mutipleObj [description]
     * @return {[type]} [description]
     */
    $('#project_mutiple').on('change', function(event) {
        event.preventDefault();
        /* Act on the event */
        var currentMultiple = parseInt($(this).val()) || 0;
        if (currentMultiple < QXC.minMultiple) {
            G_BUY.mutiple = QXC.minMultiple;
        } else if (currentMultiple > QXC.maxMultiple) {
            G_BUY.mutiple = QXC.maxMultiple;
        } else {
            G_BUY.mutiple = currentMultiple;
        }
        $(this).val(G_BUY.mutiple);
        calculateBuyCodes();
        updateCreatePartProjectParame();
    });

    /**
     * 自增倍数
     * 
     * @param {[type]}
     *            event) { event.preventDefault(); var mutipleObj [description]
     * @return {[type]} [description]
     */
    $('#increase_mutiple').on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        var mutipleObj = $("#project_mutiple");
        var currentMultiple = parseInt(mutipleObj.val());
        currentMultiple++;
        // G_BUY.mutiple = (currentMutiple <= 0) ? 1 : currentMutiple;
        if (currentMultiple < QXC.minMultiple) {
            G_BUY.mutiple = QXC.minMultiple;
        } else if (currentMultiple > QXC.maxMultiple) {
            G_BUY.mutiple = QXC.maxMultiple;
        } else {
            G_BUY.mutiple = currentMultiple;
        }
        mutipleObj.val(G_BUY.mutiple);
        calculateBuyCodes();
        updateCreatePartProjectParame();
    });

    /**
     * 提交购买按钮
     * 
     * @param {[type]}
     *            event) { event.preventDefault(); buy(); } [description]
     * @return {[type]} [description]
     */
    $('#buy-submit').on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        if ($(this).parents('.br-tou').find('.j-sub-agreed')[0].checked === false) {
            APP.showTips("请先阅读并同意《委托投注规则》后才能继续");
            return;
        }
        buy();
    });

    $('#buy_button_proxy').on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        if ($(this).parents('.br-tou').find('.j-sub-agreed')[0].checked === false) {
            APP.showTips("请先阅读并同意《委托投注规则》后才能继续");
            return;
        }
        buy();
    });

    /**
     * 切换购买方式
     * 
     * @param {Object}
     *            event) { event.preventDefault();
     *            G_BUY.trackData.issueMutipleMap [description]
     * @return {[type]} [description]
     */
    $('#buy_type').on('click', 'a', function(event) {
        event.preventDefault();
        /* Act on the event */
        G_BUY.trackData.issueMutipleMap = {}; // clean
        $('#buy_mutiple_span').show();
        G_BUY.partnerBuy = {
        projectTitle : '七星彩合买方案',
        projectDescription : '七星彩'
        }; // clean partner buy
        G_BUY.buyType = parseInt($(this).attr('data-buytype'));
        G_BUY.mutiple =1;
        $('#project_mutiple').val(G_BUY.mutiple);
        switch (G_BUY.buyType) {
            case 1: // 自购
                $('#track_desc').addClass('hide');
                calculateBuyCodes();
                break;

            case 2: // 追号
                $('#buy_mutiple_span').hide();
                $('#track_desc').removeClass('hide');
                queryTrackIssueList(10);
                calculateBuyCodes();
                break;

            case 3: // 合买
                $('#track_desc').addClass('hide');
                calculateBuyCodes();
                updateCreatePartProjectParame();
                break;
        }
    });

    $('#issue_size').on('change', function(event) {
        event.preventDefault();
        /* Act on the event */
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
    });

    // 我要认购的份数
    $("#part_buy").on('change', function(event) {
        event.preventDefault();
        var val = parseInt($(this).val()) || 1;
        if (isNaN(val) || val < 1) {
            val = 1;
        } else {
            val = Math.ceil(val);
            (val > G_BUY.money) && (val = G_BUY.money);
        }
        $(this).val(val);
        updateCreatePartProjectParame();
    });

    // 我要提成比例
    $('#commission_percent').on('change', function(event) {
        event.preventDefault();
        var val = parseInt($(this).val()) || 0;
        var rengouPercent = Math.floor($('#part_buy_percent').html());
        if (val > rengouPercent) {
            $("#part_buy").val(Math.ceil($("#commission_percent").val() / 100 * G_BUY.money));
            updateCreatePartProjectParame();
            // $(this).val(rengouPercent);
        }
        // (val > G_BUY.money) && (val = G_BUY.money);
    });

    // 是否保底
    $('#has_part_aegis').on('change', function(event) {
        event.preventDefault();
        /* Act on the event */
        if ($(this)[0].checked) {
            $('#part_aegis_money').removeAttr('disabled');
        } else {
            $('#part_aegis_money').attr('disabled', 'disabled');
            $('#part_aegis_money').val(0);
            $('#part_aegis_percent').html('0.00');
        }
        updateCreatePartProjectParame();
    });

    // 保底金额修改
    $('#part_aegis_money').on('change', function(event) {
        event.preventDefault();
        /* Act on the event */
        var _aegisMoney = parseInt($(this).val()) || 0;
        $(this).val(_aegisMoney);
        updateCreatePartProjectParame();
    });

    // 方案保密设置
    $('.br-set-group').on('click', 'a', function(event) {
        event.preventDefault();
        /* Act on the event */
        $(this).parents('.br-set-group').find('a').removeClass('active');
        $(this).toggleClass('active');
        switch ($(this).html()) {
            case '截止后公开':
                G_BUY.partnerBuy.shareLevel = 1;
                break;
            case '立即公开':
                G_BUY.partnerBuy.shareLevel = 0;
                break;
            case '截止前对跟单人公开':
                G_BUY.partnerBuy.shareLevel = 2;
                break;
        }
    });

    /**
     * 方案标题
     * 
     * @param {[type]}
     *            event) { event.preventDefault(); G_BUY.partnerBuy.projectTitle
     *            [description]
     * @return {[type]} [description]
     */
    $('#title').on('change', function(event) {
        event.preventDefault();
        /* Act on the event */
        var projectTitle = $(this).val();
        var projectTitleLength = projectTitle.length;
        G_BUY.partnerBuy.projectTitle = projectTitle;
        var max = 20;
        if (projectTitleLength >= max) {
            projectDescLength = max;
            G_BUY.partnerBuy.projectTitle = projectTitle.substring(0, max);
            $(this).val(G_BUY.partnerBuy.projectTitle);
        }
        $('#title_font_size').html(projectTitleLength);
    });
    $('#title').on('keyup', function(event) {
        event.preventDefault();
        /* Act on the event */
        var projectTitle = $(this).val();
        var projectTitleLength = projectTitle.length;
        G_BUY.partnerBuy.projectTitle = projectTitle;
        var max = 20;
        if (projectTitleLength >= max) {
            projectDescLength = max;
            G_BUY.partnerBuy.projectTitle = projectTitle.substring(0, max);
            $(this).val(G_BUY.partnerBuy.projectTitle);
        }
        $('#title_font_size').html(projectTitleLength);
    });

    /**
     * 方案描述
     * 
     * @param {[type]}
     *            event) { event.preventDefault();
     *            G_BUY.partnerBuy.projectDescription [description]
     * @return {[type]} [description]
     */
    $('#desc').on('change', function(event) {
        event.preventDefault();
        /* Act on the event */
        var projectDesc = $(this).val();
        var projectDescLength = projectDesc.length;
        G_BUY.partnerBuy.projectDescription = projectDesc;
        var max = 200;
        if (projectDescLength >= max) {
            projectDescLength = max;
            G_BUY.partnerBuy.projectDescription = projectDesc.substring(0, max);
            $(this).val(G_BUY.partnerBuy.projectDescription);
        }
        $('#desc_font_size').html(projectDescLength);
    });
    $('#desc').on('keyup', function(event) {
        event.preventDefault();
        /* Act on the event */
        var projectDesc = $(this).val();
        var projectDescLength = projectDesc.length;
        G_BUY.partnerBuy.projectDescription = projectDesc;
        var max = 200;
        if (projectDescLength >= max) {
            projectDescLength = max;
            G_BUY.partnerBuy.projectDescription = projectDesc.substring(0, max);
            $(this).val(G_BUY.partnerBuy.projectDescription);
        }
        $('#desc_font_size').html(projectDescLength);
    });

    // br-type icon toggle
    $('#buy_type a[data-toggle="tab"]').on('click', function(e) {
        $(this).parents('#buy_type').find('.icon-y2').removeClass('icon-y2');
        $(this).find('.icon').addClass('icon-y2');
    });

    // 是否保底
    $('#is_end_zhongjiang').on('change', function(event) {
        event.preventDefault();
        /* Act on the event */
        if ($(this)[0].checked) {
            $('#track_stop_money').removeAttr('disabled');
            // updateCreatePartProjectParame();
        } else {
            $('#track_stop_money').attr('disabled', 'disabled');
            $('#part_aegis_money').val(0);
        }
    });
    $('#track_stop_money').on('change', function() {
        event.preventDefault();
        /* Act on the event */
        var trackStopMoney = parseInt($(this).val()) || 3000;
        $(this).val(trackStopMoney);
    });

    // 手动输入Mask
    $('#j-textarea-mask').on('click', function(event) {
        $(this).hide();
        // $('#sd_number')[0].focus();
        $('#sd_number').addClass('focus');
    });

    // 更新手动输入注数
    $('#sd_number').on('blur', function(event) {
        var iptCodes = _.compact($(this).val().replace(/，/ig, ',').split("\n"));
        if (iptCodes == '') {
            $('#choose_zhushu').html(0);
            $('#choose_money').html(0);
            $('#choose_to_buy').removeClass('active');
            $('#choose_to_buy').attr('disabled', 'disabled');
            return;
        }
        if (iptCodes.length > QXC.maxBuyCodeLength) {
            APP.showTips('您的投注号码多于' + QXC.maxBuyCodeLength + '行，请返回重新选择');
            return;
        }
        G_CHOOSE.init();
        for ( var i = 0; i < iptCodes.length; i++) {
            var validate = QXC.isIllegalCode(iptCodes[i], function(code, zhushu) {
                G_CHOOSE.codes.push(code);
                G_CHOOSE.zhushu += zhushu;
                G_CHOOSE.money += zhushu * 2;
            });
            if (!validate) {
                APP.showTips("第" + (i + 1) + "行：" + QXC.getLastErrorMsg());
                return;
            }
        }
        if (G_CHOOSE.zhushu > 0) {
            $('#choose_to_buy').addClass('active');
            $('#choose_to_buy').removeAttr('disabled');
            G_BUY.isManual = true;
        } else {
            $('#choose_to_buy').removeClass('active');
            $('#choose_to_buy').attr('disabled', 'disabled');
        }
        $('#choose_zhushu').html(G_CHOOSE.zhushu);
        $('#choose_money').html(G_CHOOSE.money);
    });

    /**
     * 玩法type切换
     */
    $('#j-nav').on('click', 'a', function(event) {
        event.preventDefault();
        var _this = $(this);
        var pagetype = Number(_this.attr('data-pagetype'));
        var newTab = $(this).attr('href');
        var li = _this.parents('li');

        if (G_BUY.codes.length >= 1) {
            APP.showTips({
            title : '友情提示',
            text : '切换玩法将会清空您的号码',
            type : 2,
            onConfirm : function() {
                $('#myModal').modal('hide');
                // 清空追号数据
                $('.br-details').find('tbody .br-zhui-c').each(function(index, el) {
                    _this.parents('tr').find('.j-money').html(0);
                });
                toggleTabs(newTab, li, pagetype);
                $('#choose_to_buy_tip').html('添加到投注列表');
                $('#choose_to_buy').attr('data-add', 1);
            }
            });
        } else {
            toggleTabs(newTab, li, pagetype);
        }

    });

    function toggleTabs(newTab, li, pagetype) {

        var oldTab = $('#j-nav li.active a').attr('href');

        $(oldTab).removeClass('active');
        $(newTab).addClass('active');
        li.addClass('active');
        li.siblings('.active').removeClass('active');
        $('#choose_to_buy').attr('data-add', '1');
        $('#j_normal_choose_code').find('.j-num-group a').removeClass('active');
        $('#sd_number').val('');
        G_BUY.init();
        G_CHOOSE.init();
        clean4CutBuyType();
        calculateChooseCodes();
        calculateBuyCodes();
        $('#buy-submit').attr("disabled", "disabled");
        switch (pagetype) {
            case 0:
                $("li[name='auto_produce']").show();
                // $('#auto_produce').show();
                $('#j-box-right').show();
                $('#j-box-bottom').show();
                $('#choose_to_buy').removeClass('active');
                $('#choose_to_buy').attr('disabled', 'disabled');
                $('#j-box-left').removeClass('multiphase-box');
                break;
            case 1:
                $("li[name='auto_produce']").hide();
                // $('auto_produce').hide();
                $('#j-box-right').show();
                $('#j-box-bottom').show();
                $('#choose_to_buy').removeClass('active');
                $('#choose_to_buy').attr('disabled', 'disabled');
                $('#j-box-left').removeClass('multiphase-box');
                break;
            case 2:
                G_BUY.buyType = 4;
                calculateProxyBuy();
                $("li[name='auto_produce']").show();
                // $('#auto_produce').show();
                $('#j-box-right').hide();
                $('#j-box-bottom').hide();
                $('#j-box-left').addClass('multiphase-box');
                break;
        }
    }

    // ///////////////////////机选页面事件/////////////////////////////////////////
    // 修改注数
    $('#decrease_bet_num_proxy').on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        var betNumObj = $("#bet_num_proxy");
        var currentBetNum = parseInt(betNumObj.val());
        currentBetNum--;
        if (currentBetNum < QXC.minBetNum) {
            G_BUY.proxyBuy.betNum = QXC.minBetNum;
        } else if (currentBetNum > QXC.maxBetNum) {
            G_BUY.proxyBuy.betNum = QXC.maxBetNum;
        } else {
            G_BUY.proxyBuy.betNum = currentBetNum;
        }
        betNumObj.val(G_BUY.proxyBuy.betNum);
        calculateProxyBuy();
    });
    $('#bet_num_proxy').on('change', function() {
        // bet_num_proxy
        var currentBetNum = parseInt($(this).val()) || 0;
        if (currentBetNum < QXC.minBetNum) {
            G_BUY.proxyBuy.betNum = QXC.minBetNum;
        } else if (currentBetNum > QXC.maxBetNum) {
            G_BUY.proxyBuy.betNum = QXC.maxBetNum;
        } else {
            G_BUY.proxyBuy.betNum = currentBetNum;
        }
        $(this).val(G_BUY.proxyBuy.betNum);
        calculateProxyBuy();
    });
    $('#increase_bet_num_proxy').on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        var betNumObj = $("#bet_num_proxy");
        var currentBetNum = parseInt(betNumObj.val());
        currentBetNum++;
        if (currentBetNum < QXC.minBetNum) {
            G_BUY.proxyBuy.betNum = QXC.minBetNum;
        } else if (currentBetNum > QXC.maxBetNum) {
            G_BUY.proxyBuy.betNum = QXC.maxBetNum;
        } else {
            G_BUY.proxyBuy.betNum = currentBetNum;
        }
        betNumObj.val(G_BUY.proxyBuy.betNum);
        calculateProxyBuy();
    });

    // 修改倍数
    $('#decrease_mutiple_proxy').on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        var betMultipleObj = $("#mutiple_proxy");
        var currentMultipleNum = parseInt(betMultipleObj.val());
        currentMultipleNum--;
        if (currentMultipleNum < QXC.minMultiple) {
            G_BUY.proxyBuy.multiple = QXC.minMultiple;
        } else if (currentMultipleNum > QXC.maxMultiple) {
            G_BUY.proxyBuy.multiple = QXC.maxMultiple;
        } else {
            G_BUY.proxyBuy.multiple = currentMultipleNum;
        }
        betMultipleObj.val(G_BUY.proxyBuy.multiple);
        calculateProxyBuy();
    });
    $('#mutiple_proxy').on('change', function() {
        // mutiple_proxy
        var currentMultipleNum = parseInt($(this).val()) || 0;
        if (currentMultipleNum < QXC.minMultiple) {
            G_BUY.proxyBuy.multiple = QXC.minMultiple;
        } else if (currentMultipleNum > QXC.maxMultiple) {
            G_BUY.proxyBuy.multiple = QXC.maxMultiple;
        } else {
            G_BUY.proxyBuy.multiple = currentMultipleNum;
        }
        $(this).val(G_BUY.proxyBuy.multiple);
        calculateProxyBuy();
    });
    $('#increase_mutiple_proxy').on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        var betMultipleObj = $("#mutiple_proxy");
        var currentMultipleNum = parseInt(betMultipleObj.val());
        currentMultipleNum++;
        if (currentMultipleNum < QXC.minMultiple) {
            G_BUY.proxyBuy.multiple = QXC.minMultiple;
        } else if (currentMultipleNum > QXC.maxMultiple) {
            G_BUY.proxyBuy.multiple = QXC.maxMultiple;
        } else {
            G_BUY.proxyBuy.multiple = currentMultipleNum;
        }
        betMultipleObj.val(G_BUY.proxyBuy.multiple);
        calculateProxyBuy();
    });
    // 修改注数
    $('#decrease_qihao_num_proxy').on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        var betIssueNumObj = $("#qihao_num_proxy");
        var currentIssueNum = parseInt(betIssueNumObj.val());
        currentIssueNum--;
        if (currentIssueNum < QXC.minIssueNum) {
            G_BUY.proxyBuy.issueSize = QXC.minIssueNum;
        } else if (currentIssueNum > QXC.maxIssueNum) {
            G_BUY.proxyBuy.issueSize = QXC.maxIssueNum;
        } else {
            G_BUY.proxyBuy.issueSize = currentIssueNum;
        }
        betIssueNumObj.val(G_BUY.proxyBuy.issueSize);
        calculateProxyBuy();
    });
    $('#qihao_num_proxy').on('change', function() {
        // qihao_num_proxy
        var currentIssueNum = parseInt($(this).val()) || 0;
        if (currentIssueNum < QXC.minIssueNum) {
            G_BUY.proxyBuy.issueSize = QXC.minIssueNum;
        } else if (currentIssueNum > QXC.maxIssueNum) {
            G_BUY.proxyBuy.issueSize = QXC.maxIssueNum;
        } else {
            G_BUY.proxyBuy.issueSize = currentIssueNum;
        }
        $(this).val(G_BUY.proxyBuy.issueSize);
        calculateProxyBuy();
    });
    $('#increase_qihao_num_proxy').on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        var betIssueNumObj = $("#qihao_num_proxy");
        var currentIssueNum = parseInt(betIssueNumObj.val());
        currentIssueNum++;
        if (currentIssueNum < QXC.minIssueNum) {
            G_BUY.proxyBuy.issueSize = QXC.minIssueNum;
        } else if (currentIssueNum > QXC.maxIssueNum) {
            G_BUY.proxyBuy.issueSize = QXC.maxIssueNum;
        } else {
            G_BUY.proxyBuy.issueSize = currentIssueNum;
        }
        betIssueNumObj.val(G_BUY.proxyBuy.issueSize);
        calculateProxyBuy();
    });

    // ////////////////////////function/////////////////////////////////////////

    function updateCreatePartProjectParame() {

        switch (G_BUY.buyType) {
            case 1: // 自购
                break;

            case 2: // 追号
                break;

            case 3: // 合买
                if (G_BUY.money > 0) {
                    G_BUY.partnerBuy.partBuyMoney = parseInt($('#part_buy').val());
                    var partBuyPercent = G_BUY.partnerBuy.partBuyMoney / G_BUY.money * 100;
                    $('#part_buy_percent').html(partBuyPercent.toFixed(2));
                    // change 提成比例
                    $('#commission_percent').val(function(index, value) {
                        return ($(this).val() > 0 && $(this).val() > partBuyPercent) ? Math.floor(partBuyPercent) : $(this).val();
                    });
                    // global commission percent
                    G_BUY.partnerBuy.commissionPercent = parseInt($('#commission_percent').val());
                    var minBaodiMoney = Math.ceil(G_BUY.money * 0.2);
                    var lessPartBuyMoney = G_BUY.money - G_BUY.partnerBuy.partBuyMoney;
                    $('#part_aegis_money').val(function(index, value) {
                        if ($('#has_part_aegis')[0].checked && $(this).val() < minBaodiMoney) {
                            return minBaodiMoney;
                        }
                        return $(this).val() > lessPartBuyMoney ? lessPartBuyMoney : $(this).val();
                    });
                    var aegisMoney = parseInt($('#part_aegis_money').val());
                    G_BUY.partnerBuy.partAegisMoney = aegisMoney;
                    $('#part_aegis_percent').html((aegisMoney / G_BUY.money * 100).toFixed(2));
                    $('#buy_money_tips').html(G_BUY.partnerBuy.partBuyMoney);
                    $('#aegis_money_tips').html(aegisMoney);
                    $('#total_money_tips').html(aegisMoney + G_BUY.partnerBuy.partBuyMoney);
                } else {
                    $('#part_buy_percent').html(0);
                    $('#buy_money_tips').html(0);
                    $('#aegis_money_tips').html(0);
                    $('#total_money_tips').html(0);
                }
                break;
        }

    }

    /**
     * 计算手选号码注数
     * 
     * @return {[type]} [description]
     */
    function calculateChooseCodes() {
        G_CHOOSE.zhushu = 0;
        G_CHOOSE.money = 0;
        // 计算注数
        for ( var i = 0, len = G_CHOOSE.codes.length; i < len; i++) {
            var firstBitCodes = G_CHOOSE.codes[i][0] || [];
            var secondBitCodes = G_CHOOSE.codes[i][1] || [];
            var thirdBitCodes = G_CHOOSE.codes[i][2] || [];
            var fourthBitCodes = G_CHOOSE.codes[i][3] || [];
            var fifthBitCodes = G_CHOOSE.codes[i][4] || [];
            var sixthBitCodes = G_CHOOSE.codes[i][5] || [];
            var sevenBitCodes = G_CHOOSE.codes[i][6] || [];

            if (firstBitCodes.length > 0 && secondBitCodes.length > 0 && thirdBitCodes.length > 0 && fourthBitCodes.length > 0 && fifthBitCodes.length > 0 && sixthBitCodes.length > 0 && sevenBitCodes.length > 0) {
                var zhushu = QXC.getZhiXuanZhushu(firstBitCodes, secondBitCodes, thirdBitCodes, fourthBitCodes, fifthBitCodes, sixthBitCodes, sevenBitCodes);
                G_CHOOSE.zhushu += zhushu;
                G_CHOOSE.money += zhushu * 2;
            }
        }
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
            zhushu += QXC.getZhiXuanZhushu(G_BUY.codes[i].value[0], G_BUY.codes[i].value[1], G_BUY.codes[i].value[2], G_BUY.codes[i].value[3], G_BUY.codes[i].value[4], G_BUY.codes[i].value[5], G_BUY.codes[i].value[6]);
        }
        ;
        G_BUY.zhushu = zhushu;
        G_BUY.money = 2 * zhushu * G_BUY.mutiple;
        $('#buy_zhushu').html(G_BUY.zhushu);
        $('#project_price').html(G_BUY.money);
        $('#track_issue_num').html(0);
        $('#track_money').html(0);
        if (Object.size(G_BUY.trackData.issueMutipleMap) > 0) {
            var trackIssueSize = 0;
            G_BUY.money = 0;
            for ( var qihaoId in G_BUY.trackData.issueMutipleMap) {
                trackIssueSize++;
                var currentIssueMoney = 2 * zhushu * G_BUY.trackData.issueMutipleMap[qihaoId].mutiple;
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

    function makeChooseCodeHtml(codes) {
        var newCodes = codes;
        var html = '';
        var totalMoney = 0;
        for ( var i = 0; i < newCodes.length; i++) {
            G_BUY.rowIndex++;
            html += '<div class="br-zhu-item clearfix" dataBit=' + G_BUY.rowIndex + '><b>[常规投注]</b><div class="list">';
            for ( var m = 0; m < newCodes[i].length; m++) {
                html += '<span data-c="0">' + newCodes[i][m].join('') + '</span>';
            }
            ;
            var money = 2 * QXC.getZhiXuanZhushu(newCodes[i][0], newCodes[i][1], newCodes[i][2], newCodes[i][3], newCodes[i][4], newCodes[i][5], newCodes[i][6]);
            totalMoney += money;
            var mdfBtn = (G_BUY.isManual) ? '' : '<a href="javascript:;" class="br-zhu-set">修改</a>';
            html += '</div><div class="pull-right"><b><i class="money" data-m="1">' + money + '</i>元</b>' + mdfBtn + '<a href="javascript:;" class="br-zhu-del">删除</a></div></div>';
            G_BUY.codes.push({
            key : G_BUY.rowIndex,
            value : newCodes[i]
            });
        }
        if (totalMoney > QXC.maxOneBetMoney) {
            APP.showTips('您好，单个投注的金额应小于' + QXC.maxOneBetMoney + '元，请返回重新选择');
            return false;
        }
        if (G_BUY.codes.length > QXC.maxBuyCodeLength) {
            APP.showTips('您的投注号码多于' + QXC.maxBuyCodeLength + '行，请返回重新选择');
            return;
        }
        $("#code_list").append(html);
        return true;
    }
    ;

    function reflectChooseCode(buyIndex) {
        $('#j_normal_choose_code').find('.j-num-group a').removeClass('active');
        var codes = {};
        for ( var index in G_BUY.codes) {
            if (G_BUY.codes[index].key == buyIndex) {
                codes = G_BUY.codes[index].value.concat();
                break;
            }
        }
        G_CHOOSE.init();
        G_CHOOSE.codes[0] = codes;
        var baseobj = $('#j_normal_choose_code').find('.j-row-code');
        for ( var i = 0; i < QXC.ZhiXuanNormal.oneBetCodeNum; i++) {
            var placeArr = codes[i];
            var len = placeArr.length;
            baseobj.each(function(index, el) {
                if (index == i) {
                    // alert(index);
                    for ( var m = 0; m < len; m++) {
                        $(this).find('.j-num-group a').each(function(index) {
                            if (parseInt($(this).html()) == placeArr[m]) {
                                $(this).addClass('active');
                            }
                        });
                    }
                }
            });
        }

        calculateChooseCodes();
    }

    /**
     * 切换购买方式清空数据
     * 
     * @return {[type]} [description]
     */
    function clean4CutBuyType() {
        $(".br-zhu-l").html('');
        $('#sd-list').html('');
        G_BUY.init();
        calculateBuyCodes();
        updateCreatePartProjectParame();
    }

    /**
     * 读取追号期号集合
     * 
     * @param {[type]}
     *            num [description]
     * @return {[type]} [description]
     */
    function queryTrackIssueList(num) {
        var html = '';
        $('.br-details thead .br-zhui-bei').val(1);
        $.ajax({
        url : '/lottery/digital/query-track-issue/' + G_BUY.lotyName + '?num=' + num,
        type : 'GET',
        dataType : 'json',
        // data: {param1: 'value1'},
        }).done(function(data) {
            if (data.retCode == 100000) {
                for ( var i = 0; i < data.retData.length; i++) {
                    var m = i + 1;
                    var unitPrice = 2 * G_BUY.zhushu;
                    G_BUY.trackData.issueMutipleMap[data.retData[i].id] = ({
                    qihao : data.retData[i].qihao,
                    mutiple : 1
                    });
                    html += '<tr><td>' + m + '</td><td><input type="checkbox" class="br-zhui-c" data-qihaoid="' + data.retData[i].id + '"data-qi="' + data.retData[i].qihao + '" checked="">' + data.retData[i].qihao + '期</td><td><input type="text" class="br-input br-zhui-bei" value="1">倍</td><td><span class="j-money">' + unitPrice + '</span>元</td><td>' + data.retData[i].awardTime.slice(0, 10) + '<span class="ml15">' + data.retData[i].awardTime.slice(10) + '</span></td></tr>';
                }
                ;
                //
            } else {
                html = '<tr><td colspan="5">系统繁忙， 请稍候再试</td></tr>';
            }
            $('#track_issue_list').html(html);
            calculateBuyCodes();
        }).fail(function() {
            html = '<tr><td colspan="5">系统繁忙， 请稍候再试</td></tr>';
            $('#track_issue_list').html(html);
        });
    }
    ;

    /**
     * 机选计算
     * 
     * @return {[type]} [description]
     */
    function calculateProxyBuy() {
        $('#buy_bet_num_proxy').html(G_BUY.proxyBuy.betNum);
        $('#buy_multiple_proxy').html(G_BUY.proxyBuy.multiple);
        $('#buy_issue_num_proxy').html(G_BUY.proxyBuy.issueSize);
        G_BUY.money = 2 * G_BUY.proxyBuy.betNum * G_BUY.proxyBuy.multiple * G_BUY.proxyBuy.issueSize;
        G_BUY.mutiple = G_BUY.proxyBuy.multiple;
        $('#buy_money_proxy').html(G_BUY.money);
        if (G_BUY.money > 0) {
            $('#buy_button_proxy').removeAttr("disabled");
        } else {
            $('#buy_button_proxy').attr("disabled", "disabled");
        }
    }

    
    var buy = function() {
        var url = '';
        var codeArr = [];
        for ( var i = 0; i < G_BUY.codes.length; i++) {
            var unitCodeArr = [];
            for ( var m = 0; m < G_BUY.codes[i].value.length; m++) {
                unitCodeArr.push(G_BUY.codes[i].value[m].join(''));
            }
            ;
            codeArr.push(unitCodeArr.join(','));
        }
        ;
        var parameter = {
            zhushu : G_BUY.zhushu,
            beishu : G_BUY.mutiple,
            codes : codeArr.join('$')
        };
        var comfirmHtml = '';
        switch (G_BUY.buyType) {
            case 1:
                url = '/lottery/digital/buy-self/' + G_BUY.lotyName + '/' + G_BUY.playName;
                parameter.qihaoId = G_BUY.qihaoId;
                parameter.qihao = G_BUY.qihao;
                comfirmHtml = makeConfirmHtml(1, G_BUY.lotyCNName, parameter.qihao, G_BUY.zhushu, G_BUY.mutiple, G_BUY.money, 0, 0, 0, 0);
                break;

            case 2:
                url = '/lottery/digital/buy-track/' + G_BUY.lotyName + '/' + G_BUY.playName;
                var postIssueParameter = [];
                for ( var qihaoId in G_BUY.trackData.issueMutipleMap) {
                    postIssueParameter.push(qihaoId + '|' + G_BUY.trackData.issueMutipleMap[qihaoId].qihao + '|' + G_BUY.trackData.issueMutipleMap[qihaoId].mutiple);
                }
                if (postIssueParameter.length < 1) {
                    APP.showTips("追号最少购买一期");
                    return;
                }
                if ($('#is_end_zhongjiang')[0].checked) {
                    G_BUY.trackData.trackStopMoney = $('#track_stop_money').val();
                }
                parameter.endminmoney = G_BUY.trackData.trackStopMoney;
                parameter.zhuihaoqihao = postIssueParameter;
                // function makeConfirmHtml(buyType, LotyCNName, issueNum,
                // betNum, mutiple, projectPrice, buyPrice, aegisPrice,
                // trackSize, trackMoney){
                comfirmHtml = makeConfirmHtml(2, G_BUY.lotyCNName, 0, 0, 0, 0, 0, 0, postIssueParameter.length, G_BUY.money);
                break;

            case 3:
                url = '/lottery/digital/buy-together/' + G_BUY.lotyName + '/' + G_BUY.playName;
                parameter.qihaoId = G_BUY.qihaoId;
                parameter.qihao = G_BUY.qihao;
                parameter.title = G_BUY.partnerBuy.projectTitle;
                parameter.textarea = G_BUY.partnerBuy.projectDescription;
                parameter.rengouMoney = G_BUY.partnerBuy.partBuyMoney;
                parameter.baodiText = G_BUY.partnerBuy.partAegisMoney;
                parameter.extraPercent = G_BUY.partnerBuy.commissionPercent;
                parameter.set = G_BUY.partnerBuy.shareLevel || 1;
                if (parameter.rengouMoney < 1) {
                    APP.showTips("合买至少认购一元");
                    return;
                }
                // function makeConfirmHtml(buyType, LotyCNName, issueNum,
                // betNum, mutiple, projectPrice, buyPrice, aegisPrice,
                // trackSize, trackMoney){
                comfirmHtml = makeConfirmHtml(3, G_BUY.lotyCNName, parameter.qihao, parameter.zhushu, parameter.beishu, G_BUY.money, parameter.rengouMoney, parameter.baodiText, 0, 0);
                break;

            case 4:
                url = '/lottery/digital/buy-rank/' + G_BUY.lotyName + '/' + G_BUY.playName;
                parameter.zhushu = G_BUY.proxyBuy.betNum;
                parameter.beishu = G_BUY.proxyBuy.multiple;
                parameter.qishu = G_BUY.proxyBuy.issueSize;
                comfirmHtml = makeConfirmHtml(2, G_BUY.lotyCNName, 0, 0, 0, 0, 0, 0, parameter.qishu, G_BUY.money);
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
                    $('#buyConfirm').on('click', function(event) {
                        $.ajax({
                            url : url,
                            type : 'POST',
                            dataType : 'json',
                            data : parameter,
                        }).done(function(data) {
                            buySuccess(data.retCode, data.retMsg, data.retData.projectNo, data.retData.trackId, G_BUY.money, G_BUY.lotyName, G_BUY.lotyCNName);
                        }).fail(function() {
                            buyFailure(G_BUY.lotyName, G_BUY.lotyCNName);
                        });
                    });
                } else {
                    APP.showTips('<div class="tipbox"><p>您的余额不足,购买失败！</p><p class="last"><a href="/account/top-up" class="btn btn-danger" target="_blank">立即充值</a></p></div>');
                }
            } else {
                APP.handRetCode(D.retCode, D.retMsg, buy);
            }
        });
    }
    ;

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
            store.clear();
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
        store.clear();
        store.set('lotyName', lotyName);
        store.set('lotyCNName', lotyCNName);
        window.location.href = '/html/lottery/trade/fail.html';
    }
});