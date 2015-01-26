$(function() {
    $('#choseCai').unbind();
    $('#hdMask').show();
    $('#choseCai a').toggleClass('on');

    $('#j-tou a').on('click', function(event) {
        if ($(this).attr('data-type') == 1) {
            $('#j-huan-one').fadeIn()
        } else {
            $('#j-huan-one').hide()
        }
    });

    // 单场决胜选择
    $('#j-d-tou').on('click', 'li', function(event) {
        $('#j-d-tou li').removeClass('active')
        $(this).addClass('active')
    });
    // 首页 头部轮播
    $("#owl-example").owlCarousel({
        navigation : false,
        slideSpeed : 300,
        paginationSpeed : 400,
        lazyLoad : true,
        singleItem : true
    });

    // 模型跟买轮播
    $("#owl-demo").owlCarousel({
        items : 3,
        navigation : true,
        navigationText : [ "<i class='icon-chevron-left'></i>", "<i class='icon-chevron-right'></i>" ]
    });

    function isLogined() {
        var html = '';
        $.ajax({
        url : '/account/islogin',
        type : 'get',
        dataType : 'json',
        }).done(function(data) {
            if (data.retCode === 100000) {
                html = '<span>欢迎来到彩胜网&nbsp;!&nbsp;&nbsp;&nbsp;&nbsp;<img src="'+staticHostURI+'/front_images/bor.png" alt="bor"></span>' + data.retData.username + '       账户余额:<span id="userMoney">' + data.retData.money + '</span>元<a href="/account/top-up" class="active">充值</a><img src="http://static3.yuncai.com/front_images/bor.png" alt="bor"><a href="/account/logout">退出</a><img src="http://static3.yuncai.com/front_images/bor.png" alt="bor"><a href="/account/index" class="last">我的账户</a><img src="http://static3.yuncai.com/front_images/top-down.png" alt="bor">';
                $('#hd-top').html(html);
            }
        });
    }
    isLogined();
});
