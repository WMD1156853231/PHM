var myHttp='http://118.178.182.6/';
var config={
    userUrl: 'phm/api/member/'
}
var token = '79e1d3325ab14a333880583b7bdf4dfc6fb70d7a';
//添加cookie
function setCookie(name, value) {
    var Days = 30;
    var exp  = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
}
setCookie('token',token);
//获取cookie
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)){
        return unescape(arr[2]);
    }
    else{
        return null;
    }
}
var token         = getCookie('token');  //从cookie中获取token值
var patientItemId = 3448;                //用户检测id
!function(){
    var questionCount        = null;
    var questionCurrentCount = null;
    var number               = 0;     //题目下标
    var totalNumber          = 1;     //第几条
    //获取套餐题目信息
    $.ajax({
        url: `${myHttp}${config.userUrl}check/detail/${patientItemId}?token=${token}`,
    }).then(function(data){
        questionCount        = data.data.questionCount;
        questionCurrentCount = data.data.questionCurrentCount;
        sheetList            = data.data;
        console.log(sheetList)
        localStorage.setItem("sheetListInfo", JSON.stringify(sheetList));
    })
    //获取题目
    $.ajax({
        url        : `${myHttp}${config.userUrl}check/question/list?token=${token}`,
        type       : 'post',
        dataType   : "json",
        contentType: "application/json; charset=utf-8",
        data       : JSON.stringify({
            patientItemId: patientItemId,
            sheetId      : 9
        }),
        success:function(data){
            console.log(data)
            var sheetId = data.data.sheetInfo.id;
            localStorage.setItem("sheet"+sheetId, JSON.stringify(data));
        }
    })
    //从缓存中获取单个题目跟答案
    function sheetQuestion(sheetId){
        var oneSheetInfo = {};
            oneSheetInfo = JSON.parse(localStorage.getItem("sheet"+sheetId));
        var items        = oneSheetInfo.data.items;
        var totalResult  = items.length;
        $('#sheetName').html(oneSheetInfo.data.sheetInfo.name);
        $('#nowNumber').html(totalResult);
        // 问题及选项
        $('.a-title p').html(items[number].description);
        var oUl              = $('.quizBox_ul');
        var oLihtml          = '';
        var oLiArr           = ['A','B','C','D','E','F','G','H','I'];  //自己定义数组，span标签前面的有序列表
        var optionList       = items[number].optionList;
        var optionListLength = items[number].optionList.length;        //获取题目长度
        var type             = items[number].type;                     //单选多选
        var totalResult      = items.length;
        for(var i=0;i<optionListLength;i++){
            oLihtml += `<li><span data-select="">${oLiArr[i]}</span><b>${optionList[i].description}</b></li>`;
        }
        oUl.html(oLihtml);
        var divide  = 100/totalResult;    //每条答案对应的百分比
        var percent = (number+1)*divide;  //选择的答案总数对应的百分比
        //单选
        if(type==2){
            $('#tips').html('单选题');
            $('.quizBox_ul li').on('click',function(){
                $('.quizBox_ul li span').addClass('active').attr('data-select','true');
                $(this).siblings().find('span').removeClass("active").attr('data-select','false');
                var cOptionList = items[number].optionList;
                for(var m = 0; m < cOptionList.length; m++){
                    cOptionList[m].selected = 0;
                }
                items[number].optionList.selected = 1;
                $('.progress-bar').css('width',percent+'%');
                totalNumber++;
                number++;
                if(number==totalResult-1){
                    sheetQuestion(sheetId,number-1);
                    $('#totalNumber').html('/'+(totalNumber));

                    if($(this).eq(6).find('span').hasClass('active')){
                        console.log(1)
                        $('#btnNext').hide();
                        $('#btnSubmit').show();
                    }
                }else if(number<totalResult){
                    sheetQuestion(sheetId,number);
                    $('#totalNumber').html('/'+(totalNumber));
                }else{
                    return;
                }
                goback(number)
            });
            //单选下一题
            $('#btnNext').on('click',function(){
                if($('.quizBox_ul').find('.active').length==0){
                    alert('请选择答案')
                }
            })
        }
        //多选
        if(type==1){
            $('#tips').html('多选题');
            $('.quizBox_ul li').on('click',function(){
                if(!$(this).find('span').hasClass('active')){
                    $(this).find('span').addClass('active').attr('data-select','true');
                }else{
                    $(this).find('span').removeClass('active').attr('data-select','false');
                }
                var cOptionList = items[number].optionList;
                for(var m = 0; m < cOptionList.length; m++){
                    cOptionList[m].selected = 0;
                }
                items[number].optionList.selected = 1;
                $('.quizBox_ul li').each(function(){
                    if($('.quizBox_ul li span').hasClass('active')){
                        $('.progress-bar').css('width',percent+'%');
                        $('#totalNumber').html('/'+totalNumber);
                    }else if(!$('.quizBox_ul li span').hasClass('active') &&totalNumber-1==0){
                        $('.progress-bar').css('width',(number-1)*divide+'%');
                        $('#totalNumber').html('/'+totalNumber)
                    }else{
                        $('.progress-bar').css('width',(number-1)*divide+'%');
                        $('#totalNumber').html('/'+(totalNumber-1))
                    }
                })
            });
            //多选下一题
            $('#btnNext').on('click',function(){
                if($('.quizBox_ul').find('.active').length>0){
                    number++;
                    totalNumber++;
                    sheetQuestion(sheetId,number);
                    $('#totalNumber').html('/'+(totalNumber));
                }
                console.log(number)
                if($('.quizBox_ul').find('.active').length>0){
                    $('#btnNext').hide();
                    $('#btnSubmit').show();
                }

            })
        }

        //上一题
        function goback(number){
            $('.operation .pro_que').on('click',function(){
                number--;
                console.log(number)
                if(number<=0){
                    sheetQuestion(sheetId,0);
                }else{
                    sheetQuestion(sheetId,number);
                }
            })
        }
    }
    sheetQuestion(9);
}()