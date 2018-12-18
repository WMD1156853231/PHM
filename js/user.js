var myHttp='http://118.178.182.6/';
var config={
    userUrl: 'phm/api/member/'
}
var token         = 'b5cf498b70a176efeacbc5b07d88e0da76a7f4cb';
var patientItemId = 3448;

!function(){
    var questionCount        = null;
    var questionCurrentCount = null;
    var sheetNum             = 1;
    var totalNumber          = 5;     //题目下标
    // $.ajax({
    //     url: `${myHttp}${config.userUrl}check/detail/${patientItemId}?token=${token}`,
    //     // success: function(data){

    //     // }
    // }).then(function(data){
    //     questionCount        = data.data.questionCount;
    //     questionCurrentCount = data.data.questionCurrentCount;
    //     sheetIdList          = data.data.sheetIdList;
    //     console.log(sheetIdList)
        $.ajax({
            url        : `${myHttp}${config.userUrl}sheet/option/list?token=${token}`,
            type       : 'post',
            dataType   : "json",
            contentType: "application/json; charset=utf-8",
            data       : JSON.stringify({
                patientItemId: patientItemId,
                sheetId      : 9
            }),
            success:function(data){
                var totalResult = data.data.items.length;
                localStorage.setItem("sheet", JSON.stringify(data));
                $('#sheetName').html(data.data.sheetInfo.name);
                $('#nowNumber').html(totalResult);
                // 问题及选项
                $('.a-title p').html(data.data.items[sheetNum].description);
                var oUl              = $('.quizBox_ul');
                var oLihtml          = '';
                var oLiArr           = ['A','B','C','D','E','F','G','H','I'];        //自己定义数组，li标签前面的有序列表
                var optionList       = data.data.items[sheetNum].optionList;
                var optionListLength = data.data.items[sheetNum].optionList.length;  //获取题目长度
                var type             = data.data.items[sheetNum].type;
                for(var i=0;i<optionListLength;i++){
                    oLihtml += `<li><span >${oLiArr[i]}</span><b>${optionList[i].description}</b></li>`;
                }
                oUl.html(oLihtml);
                var divide  = 100/totalResult;  //每条答案对应的百分比
                var percent = sheetNum*divide;  //选择的答案总数对应的百分比
                //单选
                if(type==2){
                    $('#tips').html('单选题');
                    $('.quizBox_ul li').on('click',function(){
                        $('.quizBox_ul li span').addClass('active').siblings().removeClass("active");
                        var cOptionList = data.data.items[sheetNum].optionList;
                        for(var m = 0; m < cOptionList.length; m++){
                            cOptionList[m].selected = 0;
                        }
                        data.data.items[sheetNum].optionList.selected = 1;
                        $('.progress-bar').css('width',percent+'%');
                        totalNumber++
                        $('#totalNumber').html('/'+(totalNumber))
                    });
                }
                //多选
                if(type==1){
                    $('#tips').html('多选题');
                    $('.quizBox_ul li').on('click',function(){
                        if(!$(this).find('span').hasClass('active')){
                            $(this).find('span').addClass('active')
                        }else{
                            $(this).find('span').removeClass('active')
                        }
                        var cOptionList = data.data.items[sheetNum].optionList;
                        for(var m = 0; m < cOptionList.length; m++){
                            cOptionList[m].selected = 0;
                        }
                        data.data.items[sheetNum].optionList.selected = 1;
                        $('.quizBox_ul li').each(function(index){
                            if($('.quizBox_ul li span').hasClass('active')){
                                $('.progress-bar').css('width',percent+'%');
                                $('#totalNumber').html('/'+totalNumber);
                            }else if(!$('.quizBox_ul li span').hasClass('active') &&totalNumber-1==0){
                                $('.progress-bar').css('width',(sheetNum-1)*divide+'%');
                                $('#totalNumber').html('/'+totalNumber)
                            }else{
                                $('.progress-bar').css('width',(sheetNum-1)*divide+'%');
                                $('#totalNumber').html('/'+(totalNumber-1))
                            }
                        })

                    });

                }

                console.log(data)
            }
        })
    // })
}()