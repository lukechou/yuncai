require.config({
    paths: {
        jquery: '../lib/jquery',
        bootstrap: '../lib/bootstrap.min',
        scroll: '../lib/jquery.mCustomScrollbar.concat.min',
        lodash: '../lib/lodash.compat.min',
        betting: 'betting',
        app: 'app'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        scroll: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    }
});

require(['jquery', 'lodash', 'betting', 'app', 'bootstrap', 'scroll'], function($, _, BET, A) {
    'use strict';

    BET.init();

    $("#poolStep1 .scrollMoni").mCustomScrollbar({
        theme: "light",
    });

    $('#fqhmBtn').on('click', function(event) {
        var obj = BET.getSubmitParams();
        var html ='';
        var bunch = obj.bunch.replace(/\_/g,'串');
        var t = $('#selectGamePool').html();
        var tableHtml = '<table class="table table-bordered"><tbody><tr><th>场次</th><th class="gameTeam" colspan="2">主队 VS 客队</th></tr></tbody>'+t+'</table>';
        // Confirm Buy
        Config.payMoney = obj.zhushu * 2;


        html = '<p>投注金额：总计<span id="j-total-money">'+obj.zhushu * 2+'</span>元,共<span id="j-total-zhu">'+obj.zhushu+'</span>注,投注<span id="j-total-bei">'+obj.beishu+'</span>倍</p><p>过关方式：<span id="j-total-bunch">'+bunch+'</span>,理论最高奖金<span id="j-lilu-award">'+BET.maxBonus+'</span>元</p>'+tableHtml+'<div class="br-together"><p class="clearfix"><span class="title"><span class="fc-3">*</span>我要认购</span><input type="text" class="br-input w70 j-rengou" value="1"><span class="fc-3d">元,所占比例</span><span class="fc-3 j-rengou-percentage">2.50</span><span class="fc-3">%</span></p><p class="clearfix"><span class="title">我要提成</span><select id="ipt_extraPercent" class="br-select"><option selected="selected" value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select>%<span>提成比例不能高于认购比例.</span></p><p class="clearfix"><span class="title">我要保底</span><input type="checkbox" class="j-baodi-check"><span>最低保底为方案20%<input type="text" class="br-input w50 j-baodi-text" value="0" disabled="">元, 所占比例<span class="fc-3"><span class="j-baodi-percent">0.00</span>%</span>保底资金会冻结, 截止后最大限度促成方案.</span></p><p class="clearfix"><span class="title">方案设置</span><span class="br-set-group"><a href="javascript:;" class="br-set active">截止后公开</a><a href="javascript:;" class="br-set">立即公开</a><a href="javascript:;" class="br-set">截止前对跟单人公开</a></span></p><p class="clearfix"><span class="title">方案标题</span><input type="text" data-text="中奖福地，合买必中！" data-size="20" value="中奖福地，合买必中！" class="br-input j-project-title"><span>已输入<span class="j-btext-total">7</span>个字,最多20个</span></p><p class="clearfix m0"><span class="title">方案描述</span><textarea class="br-textarea" data-text="来参与我的合买，一起中大奖吧！" data-size="200" rows="3" cols="60">来参与我的合买，一起中大奖吧！</textarea><span class="br-textarea-tips">已输入<span class="j-btext-total">3</span>个字,最多200个</span></p></div>';
        $('#j-modal-text').html(html);
        $('#ballModal').modal('show');
        // $.ajax({
        //         url: '/lottery/jingcai/buy-self/jczq/' + BET.tab + '_gg',
        //         type: 'POST',
        //         dataType: 'json',
        //         data: obj
        //     })
        //     .done(function(data) {
        //         if (data.retCode == 100000) {
        //             window.location.href = '/html/lottery/trade/success.html';
        //         } else {
        //             A.handRetCode(data.retCode, data.retMsg);
        //         }
        //     })
        //     .fail(function() {
        //         A.showTips(A.getConfirmHtml('服务器繁忙,请稍后再试!'));
        //     });

    });


    $('#ljtzBtn').on('click', function(event) {

        var obj = BET.getSubmitParams();
        var vote = {};


        // Confirm Buy
        Config.payMoney = BET.zhushu * 2;

        vote.confirmHtml = '<div class="frbox"><img src="' + Config.staticHostURI + '/front_images/fail.png" alt="success" class="icon"><div class="text"><p>共需支付<span class="fc-3">' + Config.payMoney + '</span>元</p><div class="btns"><button class="btn btn-danger" id="buyConfirm">确定</button><button class="btn btn-gray" data-dismiss="modal">取消</button></div></div></div>';

        vote.callback = function() {
            $.ajax({
                    url: '/lottery/jingcai/buy-self/jczq/' + BET.tab + '_gg',
                    type: 'POST',
                    dataType: 'json',
                    data: obj
                })
                .done(function(data) {
                    if (data.retCode == 100000) {
                        window.location.href = '/html/lottery/trade/success.html';
                    } else {
                        A.handRetCode(data.retCode, data.retMsg);
                    }
                })
                .fail(function() {
                    A.showTips(A.getConfirmHtml('服务器繁忙,请稍后再试!'));
                });

        };

        A.onSubmitInit(vote);

    });

});