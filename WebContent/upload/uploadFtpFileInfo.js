

/**
 * 查询FTP附件
 * @param upload_div  上传div的jquery对象
 * @param tablefile  文件列表的jquery对象
 * @param path_id	路径编号
 * @param business_code 业务需求编号（req_code或req_task_code）
 * @param phase    阶段
 * @param module_flag 模块标识，字典项名称
 * @param is_param	是否自带路径参数（目前包括SYSTEM_NAME和VERSION_NAME）
 * @param is_dic	路径中是否需要包含字典名称（true包含）
 * @param paramObj	自带的路径参数
 */
function openFileFtpUpload(upload_div, tablefile, path_id, business_code, phase, module_flag, is_param, is_dic, param){
	upload_div.load("upload/uploadifyFtp.html", null, function(){
		//检测是否安装flash；
		//file_flash_check_result
		var flash;
		if(typeof window.ActiveXObject != "undefined"){
			try{
				flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
			} catch(e){
			}
		}else{
			flash =  navigator.plugins['Shockwave Flash'];
		}
		if(typeof flash == "undefined"){
			upload_div.find("#file_flash_check_result").show();
		} else {
			upload_div.find("#file_flash_check_result").hide();
		}
		var paramObj = new Object;
		if(is_param){
			var bc = business_code.split(",")[0];
			baseAjax("SFilePath/getSystemNameAndVersionName.asp?req_task_code="+bc, null, function(result){
				paramObj = result;
				var vname = paramObj["VERSIONS_NAME"];
				if(vname==null || vname=="" || vname==undefined || paramObj["VERSIONS_TYPE"]=='15'){
					paramObj.VERSIONS_NAME = "紧急需求";
				}
			}, false);
		} else {
			paramObj = param;
		}
		upload_div.find("#modal").modal('show');
		upload_div.find("input[name=MODULE_FLAG]").val(module_flag);
		upload_div.find("select[name=FILE_TYPE]").attr("diccode", module_flag);
		upload_div.find("input[name=BUSINESS_CODE]").val(business_code);
		upload_div.find("input[name=PATH_ID]").val(path_id);
		autoInitSelect(upload_div.find("#sit_fileupload_div"));
		//初始化验证
		initVlidate(upload_div);
		if(business_code==null||business_code==""){
			alert("缺失相关业务编号");
			return ;
		}
		var beforeFun = null;
		if(typeof(paramObj.beforeUpload)!="undefined"&&typeof(paramObj.beforeUpload)=="function"){
			beforeUpload = paramObj.beforeUpload;
		}
		var afterFun = null;
		if(typeof(paramObj.afterUpload)!="undefined"&&typeof(paramObj.afterUpload)=="function"){
			afterFun = paramObj.afterUpload;
		}
		
		var uploadObj = initFtpUpload(upload_div, tablefile, business_code, phase, paramObj, is_dic,beforeFun, afterFun, flash);
		
		var upload_file_start = upload_div.find("#upload_file_start");
		upload_file_start.click(function(){
			startLoading();
			if(!vlidate(upload_div,"",true)){
				endLoading();
				return;
			}
			var aaa=getCurrentPageObj().find("#descrText").val();
		    if(aaa.length>250){
		    	alert("审批意见至多可输入250汉字！");
		    	return;
		    }
			
			var DESCR_str = upload_div.find("#descrText").val();
			if(!/^(.|\n){0,660}$/.test(DESCR_str)){
				alert("请输入660字以内的任意字符！",function(){
					endLoading();
				});
				return;
			}
		    
			uploadObj.uploadify('upload', '*');
		});
		
		var upload_file_reset = upload_div.find("#upload_file_reset");
		upload_file_reset.click(function(){
			uploadObj.uploadify('cancel');
			upload_div.find("select[name=FILE_TYPE]").val(" ");
			upload_div.find("select[name=FILE_TYPE]").select2();
			upload_div.find("input[name=FILE_VERSION]").val("");
			upload_div.find("textarea[name=DESCR]").val("");
		});
	});
}


/**
 * 查询FTP附件
 * @param upload_div  上传div的jquery对象
 * @param tablefile  文件列表的jquery对象
 * @param business_code	业务编号相关id
 * @param phase		阶段代码
 * @param paramObj	路径需要用到的一些跟业务相关的参数
 * @param startUpload	开始上传前执行的函数
 * @param uploadSuccess	上传完成后执行的函数
 */
function initFtpUpload(upload_div, tablefile, business_code, phase, paramObj, is_dic,startUpload,uploadSuccess){
	var formData = new Object();
	$("#file_test").attr("id","file_test"+business_code);
	var $upload = null;
	if(business_code.indexOf('\,')>=0){
		$upload = $(document.getElementById("file_test"+business_code));
	} else {
		$upload = $("#file_test"+business_code);
	}
	
	if(typeof window.ActiveXObject != "undefined"){
	}else{
		upload_div.find("#modal").on('hide',function(){
			$upload.uploadify("destroy");
		});
	}
	
	
	
	var last_file = null;
	$upload.uploadify({
		'buttonText' : '选择文件',
		'buttonClass' : 'btn btn-ecitic btn_ftp',
		'height' : 30,
		'swf' : 'upload/uploadify/uploadify.swf',
		'uploader' : 'sfile/uploadFTPFile.asp',
		//'fileSizeLimit' : '10485760B',
		'width' : 120,
		'auto' : false,
		'formData': formData,
		'onSelect' : function(file) {
			if(file.size>52428800){
				alert("文件超过上传大小");
				return ;
			}
			if(last_file!=null){
				$upload.uploadify('cancel', last_file.id);
			}
			last_file=file;
			upload_div.find("input[name=file_name]").val(file.name);
			$upload.uploadify('settings','buttonText',"重新选择文件");
        },
        'onCancel' : function(file) {
        	if(file.id==last_file.id){
        		upload_div.find("input[name=file_name]").val("");
        		$upload.uploadify('settings','buttonText',"选择文件");
        	}
        },
		'onUploadStart' : function(file) {
			formData.FILE_ID = Math.uuid();
			formData.BUSINESS_CODE = business_code;
			formData.PHASE = phase;
			formData.FILE_NAME = upload_div.find("input[name=file_name]").val();
			formData.DESCR = upload_div.find("textarea[name=DESCR]").val();
			formData.FILE_VERSION = upload_div.find("input[name=FILE_VERSION]").val();
			formData.FILE_TYPE = upload_div.find("select[name=FILE_TYPE]").val();
			formData.PATH_ID = upload_div.find("input[name=PATH_ID]").val();
			formData.MODULE_FLAG = upload_div.find("input[name=MODULE_FLAG]").val();
			formData.BUSINESS_CODE = upload_div.find("input[name=BUSINESS_CODE]").val();
			if(paramObj!=null&&typeof(paramObj)=="object"){
				for(var i in paramObj){
					formData[i] = paramObj[i];
				}
			}
			if(is_dic){
				formData.DIC_NAME = upload_div.find("select[name=FILE_TYPE]").select2("data")[0].text;
				formData.is_dic = is_dic;
			} else {
				formData.is_dic = false;
			}
			var is_exit_name = "true";
			//baseAjax("sfile/verifyFileRecordExit.asp", {filename: formData.FILE_NAME, path_id:formData.PATH_ID, is_dic:is_dic, 'paramObj': JSON.stringify(formData)}, function(result){
			baseAjax("sfile/verifyFileRecordExit.asp", {filename: formData.FILE_NAME, path_id:formData.PATH_ID, 'paramObj': JSON.stringify(paramObj)}, function(result){
				is_exit_name = result.result;
			}, false);
			$upload.uploadify('settings','formData', formData);
			if(is_exit_name=="false"){
				alert("该文件名已存在,请先删除同名文件或更改文件名再上传");
				$upload.uploadify('cancel');
				return false;
			}
			if(startUpload!=undefined&&startUpload!=null){
				startUpload();
			}
		},
		'fileObjName' : 'file',
		'onUploadSuccess' : function(file, data, response) {
			var result = $.parseJSON(data);
			if (data != null && result.result == "true") {
				upload_div.find("#modal").modal('hide');
				var upload_file = "";
				if(business_code.indexOf('\,')>=0){
					var uploadVal = upload_div.attr("success_file");
					upload_file += (typeof(uploadVal)=="undefined"?"":(uploadVal+",")) + formData.FILE_ID;
					upload_div.attr("success_file", upload_file);
				}
				if(tablefile!=null){
					findFtpFileInfo(tablefile, business_code, phase, upload_file);
					endLoading();
				}
				if(uploadSuccess!=undefined&&uploadSuccess!=null){
					uploadSuccess();
					endLoading();
				}
			} else {
				alert("上传失败!",function(){
					endLoading();
				});
			}
		}
	});
	return $upload;
}

/**
 * 查询FTP附件
 * @param tablefile  文件列表的jquery对象
 * @param business_code	相关业务的id
 */
function findFtpFileInfo(tablefile, business_code, phase, file_ids){
	var fileList = null;
	if(business_code.indexOf('\,')>=0){
		baseAjax("sfile/queryFTPFileByID.asp",{file_ids:file_ids},function(data){
			tablefile.bootstrapTable("load",data);
			fileList = data;
		},false);
	} else {
		baseAjax("sfile/queryFTPFileByBusinessCode.asp",{business_code:business_code, phase:phase},function(data){
			tablefile.bootstrapTable("load",data);
			fileList = data;
		},false);
	}
	
	return fileList;
}

/**
 * 删除FTP附件
 * @param tablefile  文件列表的jquery对象
 * @param file_id	管理的附件id
 */
function delFtpFile(tablefile, business_code, phase, upload_div,delSuccess,disabledId){
	startLoading(disabledId);
	var rows = tablefile.bootstrapTable("getSelections");
	if(rows.length>0){
		var ids = "";
		for(var i in rows){
			ids += "," + rows[i].ID;
		}
		baseAjax("sfile/delFTPFile.asp", {ids:ids.substring(1)}, function(result){
			if(result.result=="true"){
				alert("删除成功！",function(){
					var fileListData = null;
					if(business_code.indexOf('\,')>=0){
						fileListData = findFtpFileInfo(tablefile, business_code, phase, upload_div.attr("success_file"));
					} else {
						fileListData = findFtpFileInfo(tablefile, business_code, phase);
					}
					tablefile.bootstrapTable("load",fileListData);
					
					if(typeof(delSuccess)!="undefined"&&typeof(delSuccess)=="function"){
						delSuccess();
					}
					endLoading(disabledId);
				});
			} else {
				alert("删除失败！",function(){
					endLoading(disabledId);
				});
			}
		}, true);
	} else {
		alert("请选择数据！",function(){
			endLoading(disabledId);
		});
	}
}


/**
 * 初始化附件列表
 * @param tablefile  文件列表的jquery对象
 * @param viewDiv	查看div的jquery对象
 * @param business_code	业务编号
 * @param phase		阶段
 */
function getFtpFileList(tablefile, viewDiv, business_code, phase){
	//var typeArr = ["doc","docx","docm","xls","xlsm","xlsx","ppt","pptx","pptm","jpg","png","jpeg","bmp","txt"]; 
	viewDiv.load("upload/uploadifyFtpView.html",function(){
		var view_modal = viewDiv.find("#modalView");
		tablefile.bootstrapTable('destroy').bootstrapTable({
			url:"sfile/queryFTPFileByBusinessCode.asp?business_code="+business_code+"&phase="+phase,
			method : 'get', //请求方式（*）   
			striped : false, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, //是否启用排序
			sortOrder : "asc", //排序方式
			dataType : 'json',
	 		clickToSelect : true, //是否启用点击选中行
			uniqueId : "ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			singleSelect: false,
			onAll: function(name,args) {
				tablefile.find("span[name=view_file]").click(function(){
					var index = $(this).attr("index");
					var rowObj = tablefile.bootstrapTable('getData')[index];
					var spans = view_modal.find("span");
					for(var i=0; i<spans.length; i++){
						var span_name = $(spans[i]).attr("name");
						$(spans[i]).html(rowObj[span_name]);
					}
					view_modal.modal('show');
				});		
			},
			onLoadSuccess:function(data){
				gaveInfo();
				/*tablefile.find("span[name=view_file]").click(function(){
					var index = $(this).attr("index");
					var rowObj = tablefile.bootstrapTable('getData')[index];
					var spans = view_modal.find("span");
					for(var i=0; i<spans.length; i++){
						var span_name = $(spans[i]).attr("name");
						$(spans[i]).html(rowObj[span_name]);
					}
					view_modal.modal('show');
				});*/
			 },
			 columns : [ {
				 field: 'middle',
			 checkbox: true,
			 rowspan: 2,
			 align: 'center',
			 valign: 'middle'
			 }, {
				 field : 'FILE_ID',
				 title : '序号',
				 align : "center",
				 formatter: function (value, row, index) {
					 return index+1;
				 }
			 }, {
				 field : 'FILE_NAME',
				 title : '文档名称',
				 width : 250,
				 align : "center"
			 }, {
				 field : 'MODULE_FLAG_NAME',
				 title : '文档类型',
				 align : "center"
			 }, {
				 field : "OPT_PERSON_NAME",
				 title : "上传人",
				 align : "center"
			 }/*, {
				 field : "FILE_VERSION",
				 title : "版本号",
				 align : "center"
			 }*/, {
				 field : "OPT_TIME",
				 width : 200,
				 title : "上传时间",
				 align : "center"
			 }, {
				 field : "DID",
				 title : "操作",
				 align : "center",
				 formatter: function (value, row, index) {
					 /*var arr = row.FILE_NAME.split(".");
					 var type = arr[arr.length-1];
					 if($.inArray(type, typeArr) == '-1'){
						 return '<span class="hover-view" name="view_file" index="'+index+'">查看</span>|'
						 +'<span class="hover-view" name="download_file" index="'+index+'">'
						 +'<a class="hover-view" name="testDL" onclick="verifyFileExit('+row.ID+')">下载<a/></span>';
					 }else{
						 return '<span class="hover-view" name="view_file" index="'+index+'">查看</span>|'
						 +'<span class="hover-view"><a class="hover-view" target="_blank" href="prefile/filePreView.jsp?ftp_id='+row.ID+'">预览</a></span>|'
						 +'<span class="hover-view" name="download_file" index="'+index+'">'
						 +'<a class="hover-view" name="testDL" onclick="verifyFileExit('+row.ID+')">下载<a/></span>';
					 }*/
					  /*'<span class="hover-view" name="view_file" index="'+index+'">查看</span>|'*/
					  return '<span class="hover-view" name="download_file" index="'+index+'">'
					 	+'<a class="hover-view" name="testDL" onclick="verifyFileExit('+row.ID+')">下载<a/></span>';
				 }
			 }]
		});
	});
}


/**
 * 下载初始化附件列表
 * @param file_id	管理的附件id
 */
function verifyFileExit(file_id){
	baseAjax("sfile/verifyFileExit.asp", {id:file_id}, function(result){
		if(result.result){
			location.href="sfile/downloadFTPFile.asp?id="+file_id;
		} else {
			alert(result.msg);
		}
	});
}

/**
 * 获取文件列表数据，而不初始化一个表格
 * @param 
 * 
 */
function getFtpFileListByBc(business_code_arr, phase){
	var result = null;
	baseAjax('sfile/findFileInfoByBusinessCodes.asp', {business_code:"'"+business_code_arr.join("','")+"'", phase:phase}, function(data){
		result = data;
	}, false);
	return result;
}

/**
 * 通过文件id删除文件
 * @param file_id
 */
function deleteFTPFileById(file_id){
	baseAjax("sfile/delFTPFile.asp", {ids:file_id}, function(result){
		if(result.result=="true"){
		} else {
			deleteFTPFileById(file_id);
		}
	}, true);
}

function ftpFileInfoDetailModel(viewDiv, row){
	viewDiv.load("upload/uploadifyFtpView.html",function(){
		var view_modal = viewDiv.find("#modalView");
		var spans = view_modal.find("span");
		for(var i=0; i<spans.length; i++){
			var span_name = $(spans[i]).attr("name");
			$(spans[i]).html(row[span_name]);
		}
		view_modal.modal('show');
	});
}