var SERVER_BASE_URL = "http://118.178.182.6:8080/yingfeite/";
//var SERVER_BASE_URL = "http://192.168.31.100/zkshare/";

//url: api/web/login
//dataMap: {username:admin, password: admin}
//successHandle ： function(data)
//failHandle: function(data)

function postJson(url, dataMap, successHandle, failHandle){
	$.ajax({
		type: "POST",
		url: SERVER_BASE_URL + url,
		async:true,
		data: JSON.stringify(dataMap),
		dataType:'json',
		contentType: "application/json;charset=UTF-8",
		cache: false,
		success: function(item){
			var code = item.code;
			console.log("here is sucess function....");
			if(code == 200){
				successHandle(item.data);
			}else{
				if(failHandle != null){
					failHandle(item);
				}else{
					alert(item.msg);
				}
			}
		},
		error: function(data){
			bootbox.alert(data);
		}
	});
}

function getJson(url, dataMap, successHandle, failHandle){
	$.ajax({
		type: "GET",
		url: SERVER_BASE_URL + url,
		dataType:'json',
		contentType: "application/json;charset=UTF-8",
		cache: false,
		success: function(item){
			var code = item.code;
			if(code == 200){
				successHandle(item.data);
			}else{
				if(failHandle != null){
					failHandle(item);
				}else{
					alert(item.msg);
				}
			}
		},
		error: function(data){
			alert(data);
		}
	});
}


function postJsonWithItem(url, dataMap, successHandle, failHandle){
	$.ajax({
		type: "POST",
		url: SERVER_BASE_URL + url,
		data: JSON.stringify(dataMap),
		dataType:'json',
		contentType: "application/json;charset=UTF-8",
		cache: false,
		success: function(item){
			var code = item.code;
			console.log("here is sucess function....");
			if(code == 200 ||code == 616 ||code == 602||code == 614){
				successHandle(item);
			}else{
				if(failHandle != null){
					failHandle(item);
				}else{
					alert(item.msg);
				}
			}
		},
		error: function(data){
			bootbox.alert(data);
		}
	});
}

//newPostJson
function newPostJson(url, dataMap, successHandle, failHandle){
	$.ajax({
		type: "POST",
		url: SERVER_BASE_URL + url,
		data: JSON.stringify(dataMap),
		dataType:'json',
		contentType: "application/json;charset=UTF-8",
		cache: false,
		success: function(item){
			var code = item.code;
			console.log("here is sucess function....");
			if(code == 200){
				successHandle(item);
			}else{
				if(failHandle != null){
					failHandle(item);
				}else{
					alert(item.msg);
				}
			}
		},
		error: function(data){
			bootbox.alert(data);
		}
	});
}
