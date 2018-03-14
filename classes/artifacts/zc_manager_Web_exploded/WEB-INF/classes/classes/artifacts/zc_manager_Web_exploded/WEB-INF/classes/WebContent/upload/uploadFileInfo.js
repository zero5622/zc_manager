/**
 * 打开文件上传
 */
function openFileUploadInfo(id,path_id,file_id,callback) {
	if(openFileUploadInfo.isOpen==false){
		$("#fileUpload"+id+'_'+file_id).modal("show");
		return;
	}
	openFileUploadInfo.isOpen=false;
	$("#myModalFileUpload").remove();
	var fileUpload=
		'<div id="fileUpload'+id+'_'+file_id+'" class="modal hide fade" style="top:249px;" tabindex="-1" role="dialog">'+
		'	<div class="modal-header">'+
		'		<button type="button" class="close" data-dismiss="modal"'+
		'			aria-hidden="true">×</button>'+
		'		<h3 id="myModalLabel">附件上传</h3>'+
		'	</div>'+
		'	<iframe src="upload/uploadify/fileUpload.jsp?path_id='+path_id+'&file_id='+file_id+'" style="height: 250px; width: 99.5%;">'+
		'	</iframe>'+
		'</div>';
		$("body").append(fileUpload);
		$("#fileUpload"+id+"_"+file_id).modal("show");
		if(callback!=undefined){
			$("#fileUpload"+id+"_"+file_id).on("hidden.bs.modal",function(){
				findFileInfo(file_id,callback);
				//callback();
			});
		}
		openFileUploadInfo.isOpen=true;
}
/**
 * 查询附件
 * @param file_id
 */
function findFileInfo(file_id,callback){
	baseAjax("sfile/findFileInfo.asp",{file_id:file_id},function(data){
		if(callback!=undefined){
			callback(data);
		}
	});
}
/**
isViewImage.put(".png", "png");
		isViewImage.put(".jpg", "jpg");
		isViewImage.put(".jpeg", "jpeg");
		isViewImage.put(".bmp", "bmp");
		isViewImage.put(".gif", "gif");
 */

var isImage={".png": "png",".jpg": "jpg",".jpeg": "jpeg",".bmp": "bmp",".gif": "gif"};
/**
 * 字符串转点点点
 * @param str
 * @param length
 */
function strToPoint(str,length){
	if(str==undefined){
		return "";
	}else if(str.length<=length) {
		return str;
	}else if(str.length>length) {
		return str.substring(0,length-3)+"...";
	}
}
/**
 * 默认的显示附件的函数
 * @param obj
 * @param data
 * @param divId 必填  区分不同页面所要显示的多附件列表div
 */
function defaultShowFileInfo(file_id,obj,data,isdel,divId){
	if(isdel==undefined)isdel=false;
	if(typeof data =="object"&&typeof obj=="object"){
		obj.find("div[class^=fileInfo]").remove();
		obj.find("div.moreFileInfo").remove();
		obj.find("br").remove();
		obj.append("<div class='fileInfo130' style='width:160px;float:left;'></div>");
		var fileInfo=obj.find("div.fileInfo130");
		if(data.total<=0||!data.rows){
			return;
		}
		
		var hrefView="prefile/filePreView.jsp?p_=";
		
		for(var i=0;i<1;i++){
			if(isImage[data.rows[i]["FILE_TYPE"]]){
				hrefView="sfile/filePreView.asp?id=";
			}
			fileInfo.append("<div class='fileInfo' style='text-align: left;float:left;padding-left:4px;'><a title='"+data.rows[i]["FILE_NAME"]+"' href='sfile/fileDownLoad.asp?id="+data.rows[i]["ID"]+"'>"
					+strToPoint(data.rows[i]["FILE_NAME"],9)+"</a></div>"+
					(data.rows[i]["IS_VIEW"]!=undefined?"<a target='_blank' title='点击预览' href='"+hrefView+data.rows[i]["ID"]+"'><img src='images/prefile.png' style='margin-top:10px;'></a>":"")+
					(isdel?"<img src='images/ltee_close_h.png' fileId='"+data.rows[i]["ID"]+"' title='删除附件'>":""));
		}
		
		if(data.total>1){
			obj.append("<div class='fileInfo' style='width:40px;float:left;'>&nbsp;<a>更多..</a></div><br>");
			$("#"+divId).remove();
			$("body:eq(0)").append("<div id='"+divId+"' class='moreFileInfo' style='display:none;position: absolute;border: 1px #ffc0cb solid;background-color: white;'></div");
			initMoreFileInfo(obj,divId);
			fileInfo=$("[id='"+divId+"'].moreFileInfo");
		}
		hrefView="prefile/filePreView.jsp?p_=";
		
		for(var i=1;i<data.total;i++){
			if(isImage[data.rows[i]["FILE_TYPE"]]){
				hrefView="sfile/filePreView.asp?id=";
			}
			fileInfo.append("<div class='fileInfo150' style='width:160px;'><div class='fileInfo' style='width:130px;float:left;'>"+
					"<a title='"+data.rows[i]["FILE_NAME"]+"' href='sfile/fileDownLoad.asp?id="+data.rows[i]["ID"]+"'>"+strToPoint(data.rows[i]["FILE_NAME"],9)+"</a></div>"+
					(data.rows[i]["IS_VIEW"]!=undefined?"<a target='_blank' title='点击预览' href='"+hrefView+data.rows[i]["ID"]+"'><img src='images/prefile.png' style='margin-top:10px;'></a>":"")+
					(isdel?"<img src='images/ltee_close_h.png' fileId='"+data.rows[i]["ID"]+"' title='删除附件'>":""));
		}
		initDelFileInfo(file_id,obj,defaultShowFileInfo);
	}
}
/**
 * 更多附件
 * @param obj
 */
function initMoreFileInfo(obj,divId){//contains('John')
	obj.find("div.fileInfo a:contains('更多..')").unbind("click");
	obj.find("div.fileInfo a:contains('更多..')").click(function(){
		var offset=$(this).offset();
		var more_f=$("[id='"+divId+"'].moreFileInfo");
		more_f.css({top:offset.top+33,left:offset.left-250});
		more_f.toggle("normal");
	});
}
/**
 * 附件显示及隐藏控制
 */
(function(){
	var ishow=true;
	$(document).on("click","div.fileInfo a:contains('更多..')",function(){
		ishow=false;
	});
	$(document).on("click",".moreFileInfo",function(){
		ishow=false;
	});
	$(document).on("click","body:eq(0)",function(){
		if(ishow){
			$(".moreFileInfo").hide();
		}
		ishow=true;
	});
})();
/**
 * 删除附件
 * @param file_id
 * @param obj
 * @param callback
 */
function initDelFileInfo(file_id,obj,callback){
	obj.find("img[fileId]").unbind("click");
	obj.find("img[fileId]").click(function(){
		delFileInfo($(this).attr("fileId"),function(data){
			if(data["result"]=="false"){
				alert(data["message"]);
			}
			findFileInfo(file_id,function(data){
				obj.data("newFile",data);
				callback(file_id,obj,data,true);
				obj.find("div.fileInfo a:contains('更多..')").click();
			});
		});
	});
}
/**
 * 删除附件
 * @param id
 */
function delFileInfo(id,callback){
	baseAjax("sfile/delFileInfo.asp",{id:id},function(data){
		if(callback!=undefined){
			callback(data);
		}
	});
}
/**
 * 展示附件信息
 * @param fid 文件id
 * @param #objId 展示对象id
 */
function viewFileInfo(fid,objId,divId){
	if(fid==undefined||fid==""){
		return;
	}
	findFileInfo(fid,function(data){
		if(data.rows.length>0){
			defaultShowFileInfo(fid,$(objId),data,false,divId);
		}else{
		}
	});
}
/**
 * 展示附件信息
 * @param fid 文件id
 * @param #objId 展示对象id
 */
function viewFileInfoObj(fid,obj,divId){
	if(fid==undefined||fid==""){
		return;
	}
	findFileInfo(fid,function(data){
		if(data.rows.length>0){
			defaultShowFileInfo(fid,obj,data,false,divId);
		}else{
		}
	});
}
/**
 * 展示带关闭按钮的附件信息
 * @param fid 文件id
 * @param #objId 展示对象id
 */
function viewFileInfoClose(fid,objId,divId){
	findFileInfo(fid,function(data){
		defaultShowFileInfo(fid,$(objId),data,true,divId);
	});
}
/**
 * 展示带关闭按钮的附件信息
 * @param fid 文件id
 * @param #objId 展示对象id
 */
function viewFileInfoCloseByObj(fid,obj,divId){
	findFileInfo(fid,function(data){
		obj.data("oldFile",data);obj.data("newFile",data);
		defaultShowFileInfo(fid,obj,data,true,divId);
	});
}