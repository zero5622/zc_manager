//初始化序号
var addReportBRowNum = 1;
var addReportCRowNum = 1;
var addReportFDRowNum = 1;
//getCurrentPageObj().find("#bank_code_name").text($("#currentLoginNoOrg_name").val());
//新增月报信息
function initAddMoonReport(){
	/**
	 * 附件上传;
	 */
	getCurrentPageObj().find("#normalCheckFile").val(Math.uuid());
	getCurrentPageObj().find("#addCheckFileButton").click(function(){
		openFileUploadInfo('normalCheckFile','ADD_CHECKWORK',getCurrentPageObj().find("#normalCheckFile").val(),function(data){
			defaultShowFileInfo(getCurrentPageObj().find("#normalCheckFile").val(),getCurrentPageObj().find("#addCheckFileButton").parent(),data,true,"addCheckFileDiv");
		});
	});
	var params = {};
	$page("#save_reportm").click(function(){
		params['report_state'] = '01';
		asubmitMoonReport(params);
	});
	$page("#saveandcommit_reportm").click(function(){
		//baseAjax('moonReport/isRepeat.asp?period='+$("[name='UM.period']").val()+'&bank_code='+$("[name='UM.bank_code']").val(),null, function(data) {
			//if(data != undefined&&data!=null&&data.result=="true") {
//	    		alert("同期信息技术月报已新增，请勿重复新增！");
//	    		return;
//			}else{
				params['report_state']='02';
	    		asubmitMoonReport(params);
//			}
//		});
	});
	
	var obj=getCurrentPageObj().find("#reportC_impAdd");//变更导入 
	obj.unbind("click");//导入功能
	obj.click(function(){
		getCurrentPageObj().find("#modal_bankchange_import").modal("show");
	});
	obj=getCurrentPageObj().find("#import_change_button");
	obj.unbind("click");//导入功能
	obj.click(function(){
		var file_sttaffout=getCurrentPageObj().find('#change_file').val();
		if(file_sttaffout==null||file_sttaffout==''||file_sttaffout==undefined){
			alert("请选择要导入的附件！");
			return;
		}
		startLoading();
	    $.ajaxFileUpload({
		    url:"moonReport/impReportC.asp",
		    type:"post",
			secureuri:false,
			fileElementId:'change_file',
			data:'',
			dataType: 'json',
			success:function (msg){
				endLoading();
				getCurrentPageObj().find("#modal_bankchange_import").modal("hide");
				getCurrentPageObj().find("#bankchange_imp").val("");
				getCurrentPageObj().find("#change_file").val("");
				if(msg&&msg.result=="true"){
					alert("导入成功！",function(){
						baseAjax('moonReport/queryReportC.asp?period='+$("[name='UM.period']").val()+'&bank_code='+$("#currentLoginNoOrg_no").val(),null,function(data){
						if(data){
							var cmap = data["cmap"];
							if(cmap!=""){
								getCurrentPageObj().find("#reportCTableAdd tr:gt(0)").remove();
								addReportCRowNum = 1;
								for(var i=0;i<cmap.length;i++){
									var trStr="<tr id=\"reportC_"+addReportCRowNum+"\" >"+
									"<td class=\"reportCRow\"></td>"+
							 		"<td>"+
							 			"<input type=\"hidden\" name=\"UC.id_"+addReportCRowNum+"\"/>" +
							 			"<input type=\"text\" name=\"UC.change_name_"+addReportCRowNum+"\"/>"+
									"</td>"+
									"<td><input type=\"text\" name=\"UC.change_time_"+addReportCRowNum+"\" onClick=\"WdatePicker({})\"  class=\"citic-ast\" readonly=\"readonly\"/></td>"+
									"<td><textarea name=\"UC.change_sys_"+addReportCRowNum+"\" class=\"citic-text-ast\"></textarea></td>"+
									"<td><textarea name=\"UC.remark_"+addReportCRowNum+"\" class=\"citic-text-ast\"></textarea></td>"+
									"<td><a style=\"color:red;\" onclick=\"delreportCAdd('"+addReportCRowNum+"');\" name=\"reportC_add_del_"+addReportCRowNum+"\">删除</a></td>"+
							 		"</tr>";
									 //添加子信息行
									 getCurrentPageObj().find("#reportCTableAdd").append(trStr);
									 for(var phaseKey in cmap[i]){
										 var phaseKeyLow = phaseKey.toLowerCase();
										 //处理付款类型的下拉
										 if("change_type" == phaseKeyLow.toString() ||"is_affect" == phaseKeyLow.toString()){
//											 initSelect(getCurrentPageObj().find("select[name='UC.change_type_"+addReportCRowNum+"']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_REPORT_M_CHANGE_TYPE"},cmap[i]["CHANGE_TYPE"]);
//											 initSelect(getCurrentPageObj().find("select[name='UC.is_affect_"+addReportCRowNum+"']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"},cmap[i]["IS_AFFECT"]);
										 }else{
											 getCurrentPageObj().find("[name='UC."+phaseKeyLow+"_"+addReportCRowNum+"']").val(cmap[i][phaseKey]);
										 }
									 }
									 //序号自增
									 addReportCRowNum ++;
									 initVlidate(getCurrentPageObj().find("#reportCTableAdd"));
									 reOrder("reportCRow");
								}
							}
						}
					});
					});
//					getCurrentPageObj().find("#reportStaff_querytable").bootstrapTable("refresh");
				}else if(msg&&msg.error_info){
					alert("导入失败:"+msg.error_info);
				}else{
					alert("导入失败！");
				}
			},
			error: function (msg){
				endLoading();
				alert("导入失败！");
			}
	   });
	});
}

//新增月报信息
function asubmitMoonReport(params){
    if(!vlidate($("#reportMBaseTable"))||!vlidate($("#reportMTradeTable"))||!vlidate($("#reportMCorrTable"))){		
		return ;
	}
	var inputs = $("input[name^='UM.']");
	var textareas = $("textarea[name^='UM.']");
	//取值
	//输入框
	for(var i=0;i<inputs.length;i++){
		params[$(inputs[i]).attr("name").substr(3)] = $(inputs[i]).val();	 
	}
	//文本域
	for(var i=0;i<textareas.length;i++){
		params[$(textareas[i]).attr("name").substr(3)] = $(textareas[i]).val(); 
	}
	//保存并发送数据
	if(params["report_state"]=="02"){
		nconfirm("月报提交后不允许继续操作，确认提交吗？",function(){
			baseAjax("moonReport/addMoonReport.asp?",params, function(data) {
		    	if(data != undefined&&data!=null&&data.result=="true") {
		    		alert("提交成功！",function(){
		    			$("#moonreportTable").bootstrapTable('refresh');
		    			closeCurrPageTab();
		    		});
				}else if(data != undefined&&data!=null&&data.result=="repeat"){
					alert("同期信息技术月报已新增，请勿重复新增！");
				}else{
					alert("提交失败！");
				}
			});
		});
	}else{
		baseAjax("moonReport/addMoonReport.asp?",params, function(data) {
	    	if(data != undefined&&data!=null&&data.result=="true") {
	    		alert("保存成功！",function(){
	    			$("#moonreportTable").bootstrapTable('refresh');
//	    			closeCurrPageTab();
	    		});
			}else if(data != undefined&&data!=null&&data.result=="repeat"){
				alert("同期信息技术月报已新增，请勿重复新增！");
			}else{
				alert("保存失败！");
			}
		});
	}
}

//初始化故障信息
function initReportBAdd(){
	//新增按钮方法
	getCurrentPageObj().find("#reportB_add").click(function(){
		 var trStr="<tr id=\"reportB_"+addReportBRowNum+"\" >"+
		 	"<td class=\"reportBRow\"></td>"+
	 		"<td>"+
	 			"<input type=\"hidden\" name=\"UB.id_"+addReportBRowNum+"\"/>" +
	 			"<input type=\"text\" name=\"UB.event_name_"+addReportBRowNum+"\" validate=\"v.required\"/>"+
			"</td>"+
			"<td><input type=\"text\" name=\"UB.occur_time_"+addReportBRowNum+"\" validate=\"v.required\"/></td>"+
			"<td><input type=\"text\" name=\"UB.solve_time_"+addReportBRowNum+"\" validate=\"v.required\"/></td>"+
			"<td><textarea name=\"UB.break_sys_"+addReportBRowNum+"\" class=\"citic-text-ast\" validate=\"v.required\"></textarea></td>"+
			"<td><textarea name=\"UB.affect_sys_"+addReportBRowNum+"\" class=\"citic-text-ast\" validate=\"v.required\"></textarea></td>"+
			"<td><select name=\"UB.reason_type_"+addReportBRowNum+"\" class=\"citic-sele-ast\" validate=\"v.required\"></select></td>"+
			"<td><select name=\"UB.event_level_"+addReportBRowNum+"\" class=\"citic-sele-ast\" validate=\"v.required\"></select></td>"+
			"<td><textarea name=\"UB.remark_"+addReportBRowNum+"\" class=\"citic-text-ast\" validate=\"v.required\"></textarea></td>"+
			"<td><a style=\"color:red;\" onclick=\"delreportBAdd('"+addReportBRowNum+"','reportBRow');\" name=\"reportB_add_del_"+addReportBRowNum+"\">删除</a></td>"+
	 		"</tr>";
		 //添加子信息行
		 getCurrentPageObj().find("#reportBTableAdd").append(trStr);
		 //添加下拉
		 initSelect(getCurrentPageObj().find("select[name='UB.reason_type_"+addReportBRowNum+"']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_REPORT_M_REASON_TYPE"});
		 initSelect(getCurrentPageObj().find("select[name='UB.event_level_"+addReportBRowNum+"']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_REPORT_B_EVENT_LEVEL"});
		 initVlidate(getCurrentPageObj().find("#reportBTableAdd"));
		 //序号自增
		 addReportBRowNum ++;
		 reOrder("reportBRow");
	 });
}

//增加故障信息
function saveReportBAdd(){
	$("#save_reportb").click(function(){
		if(!vlidate($("#reportBTableAdd"))||!vlidate($("#reportBDTableAdd"))){		
			return ;
		}
		var inputs = $("input[name^='UB.']");
		var selects = $("select[name^='UB.']");
		var texts = $("textarea[name^='UB.']");
		
		//取值
		var params = {};
		for(var i=0;i<inputs.length;i++){
			params[$(inputs[i]).attr("name").substr(3)] = $(inputs[i]).val(); 
		}
		for(var i=0;i<selects.length;i++){
			params[$(selects[i]).attr("name").substr(3)] = $(selects[i]).val(); 
		}
		for(var i=0;i<texts.length;i++){
			params[$(texts[i]).attr("name").substr(3)] = $(texts[i]).val(); 
		}
		var rowNumList = [];
		var rowNums = $("input[name^='UB.id_']");
		for(var i=0;i<rowNums.length;i++){
			rowNumList.push($(rowNums[i]).attr("name").substr(6)); 
		}
		var delRowNums = $("input[name^='UB.delete_reportb_id_']");
		for(var i = 0;i<delRowNums.length;i++){
			rowNumList.push($(delRowNums[i]).attr("name").substr(21));
		}
		params.row_nums = rowNumList;
		var bank_code = $("[name='UM.bank_code']").val();
		var period = $("[name='UM.period']").val();
//		params.row_nums = $.param(rowNumList,true);
		params["bank_code"] = bank_code;
		params["period"] = period;
		params["addReportBRowNum"] = $("#reportBTableAdd tr").length-1;
		baseAjax2("moonReport/addReportB.asp",params, function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				if(undefined!=data.reportBIds&&null!=data.reportBIds){
					for(var i = 0;i<data.reportBIds.length;i++){
						$("input[name^='UB.id_']").eq(i).val(data.reportBIds[i]);
					}
				}
				alert("保存成功");
			}else{
				alert("保存失败");
			}
		});		
	});
}

function baseAjax2(url, param, callback, async) {
	$.ajax({
		type : "post",
		url : url,
		async : async == undefined ? true : false,
		data : param,
		dataType : "json",
		success : function(data) {
			if(("object"== typeof data&&data["logintimeout"]==true&&isloginTip==false)){
        		isloginTip=true;
        		nconfirm("登录超时,请重新登录!",function(){
        			window.parent.toLoginPage();
        		});
        		return;
        	}
			callback(data);
		},
		traditional:true,
		error : function() {
			callback();
		}
	});
}

//初始化变更信息
function initReportCAdd(){
	//新增按钮方法
	getCurrentPageObj().find("#reportC_add").click(function(){
		 var trStr="<tr id=\"reportC_"+addReportCRowNum+"\" >"+
		 	"<td class=\"reportCRow\"></td>"+
	 		"<td>"+
	 			"<input type=\"hidden\" name=\"UC.id_"+addReportCRowNum+"\"/>" +
	 			"<input type=\"text\" name=\"UC.change_name_"+addReportCRowNum+"\" validate=\"v.required\"/>"+
			"</td>"+
			"<td><input type=\"text\" name=\"UC.change_time_"+addReportCRowNum+"\" onClick=\"WdatePicker({})\"  class=\"citic-ast\" readonly=\"readonly\" validate=\"v.required\"/></td>"+
			"<td><textarea name=\"UC.change_sys_"+addReportCRowNum+"\" class=\"citic-text-ast\" validate=\"v.required\"></textarea></td>"+
			"<td><textarea name=\"UC.remark_"+addReportCRowNum+"\" class=\"citic-text-ast\" validate=\"v.required\"></textarea></td>"+
			"<td><a style=\"color:red;\" onclick=\"delreportCAdd('"+addReportCRowNum+"','reportCRow');\" name=\"reportC_add_del_"+addReportCRowNum+"\">删除</a></td>"+
	 		"</tr>";
		 //添加子信息行
		 getCurrentPageObj().find("#reportCTableAdd").append(trStr);
		 //添加下拉 (变更类型，是否产生影响去掉)
//		 initSelect(getCurrentPageObj().find("select[name='UC.change_type_"+addReportCRowNum+"']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_REPORT_M_CHANGE_TYPE"});
//		 initSelect(getCurrentPageObj().find("select[name='UC.is_affect_"+addReportCRowNum+"']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"});
		 initVlidate(getCurrentPageObj().find("#reportCTableAdd"));
		 //序号自增
		 addReportCRowNum ++;
		 reOrder("reportCRow");
	 });
}

//增加变更信息
function saveReportCAdd(){
	$("#save_reportc").click(function(){
		if(!vlidate($("#reportCTableAdd"))||!vlidate($("#reportCDTableAdd"))){		
			return ;
		}
		var inputs = $("input[name^='UC.']");
		var selects = $("select[name^='UC.']");
		var texts = $("textarea[name^='UC.']");
		//取值
		var params = {};
		for(var i=0;i<inputs.length;i++){
			params[$(inputs[i]).attr("name").substr(3)] = $(inputs[i]).val(); 
		}
		for(var i=0;i<selects.length;i++){
			params[$(selects[i]).attr("name").substr(3)] = $(selects[i]).val(); 
		}
		for(var i=0;i<texts.length;i++){
			params[$(texts[i]).attr("name").substr(3)] = $(texts[i]).val(); 
		}
		var rowNumList = [];
		var rowNums = $("input[name^='UC.id_']");
		for(var i=0;i<rowNums.length;i++){
			rowNumList.push($(rowNums[i]).attr("name").substr(6)); 
		}
		var delRowNums = $("input[name^='UC.delete_reportc_id_']");
		for(var i = 0;i<delRowNums.length;i++){
			rowNumList.push($(delRowNums[i]).attr("name").substr(21));
		}
		params.row_nums = rowNumList;
		var bank_code = $("[name='UM.bank_code']").val();
		var period = $("[name='UM.period']").val();
		params["bank_code"] = bank_code;
		params["period"] = period;
		params["addReportCRowNum"] = $("#reportCTableAdd tr").length-1;
		baseAjax2("moonReport/addReportC.asp",params, function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				if(undefined!=data.reportCIds&&null!=data.reportCIds){
					for(var i = 0;i<data.reportCIds.length;i++){
						$("input[name^='UC.id']").eq(i).val(data.reportCIds[i]);
					}
				}
				
				alert("保存成功");
			}else{
				alert("保存失败");
			}
		});		
	});
}

//初始化性能信息
function initReportFAdd(){
	//新增按钮方法
	getCurrentPageObj().find("#reportFD_add").click(function(){
		 var trStr="<tr id=\"reportFD_"+addReportFDRowNum+"\" >"+
		 	"<td class=\"reportFDRow\"></td>"+
	 		"<td>"+
	 			"<input type=\"hidden\" name=\"UFD.id_"+addReportFDRowNum+"\"/>" +
	 			"<input type=\"text\" name=\"UFD.line_name_"+addReportFDRowNum+"\" validate=\"v.required\"/>"+
			"</td>"+
			"<td><input type=\"text\" name=\"UFD.purpose_"+addReportFDRowNum+"\" validate=\"v.required\"/></td>"+
			"<td><input type=\"text\" name=\"UFD.use_per_"+addReportFDRowNum+"\" validate=\"v.required\"/></td>"+
			"<td><input type=\"text\" name=\"UFD.take_action_"+addReportFDRowNum+"\" validate=\"v.required\"/></td>"+
			"<td><a style=\"color:red;\" onclick=\"delreportFDAdd('"+addReportFDRowNum+"','reportFDRow');\" name=\"reportC_add_del_"+addReportFDRowNum+"\">删除</a></td>"+
	 		"</tr>";
		 //添加子信息行
		 getCurrentPageObj().find("#reportFDTableAdd").append(trStr);
		 initVlidate(getCurrentPageObj().find("#reportFDTableAdd"));
		 //序号自增
		 addReportFDRowNum ++;
		 reOrder("reportFDRow");
	 });
}

//增加性能信息
function saveReportFAdd(){
	$("#save_reportf").click(function(){
		
		if(!vlidate($("#reportFSBaseTable"))||!vlidate($("#reportFIBaseTable"))||!vlidate($("#reportFRCorrTable"))||!vlidate($("#reportFDTableAdd"))){		
			return ;
		}
		var inputs = $("input[name^='UF.']");
		var inputfds = $("input[name^='UFD.']");
		//取值
		var params = {};
		for(var i=0;i<inputs.length;i++){
			params[$(inputs[i]).attr("name").substr(3)] = $(inputs[i]).val(); 
		}
		for(var i=0;i<inputfds.length;i++){
			params[$(inputfds[i]).attr("name").substr(4)] = $(inputfds[i]).val(); 
		}
		var rowNumList = [];
		var rowNums = $("input[name^='UFD.id_']");
		for(var i=0;i<rowNums.length;i++){
			rowNumList.push($(rowNums[i]).attr("name").substr(7)); 
		}
		var delRowNums = $("input[name^='UFD.delete_reportfd_id_']");
		for(var i = 0;i<delRowNums.length;i++){
			rowNumList.push($(delRowNums[i]).attr("name").substr(23));
		}
		params.row_nums = rowNumList;
		var bank_code = $("[name='UM.bank_code']").val();
		var period = $("[name='UM.period']").val();
		params["bank_code"] = bank_code;
		params["period"] = period;
		params["addReportFDRowNum"] = $("#reportFDTableAdd tr").length-1;
		baseAjax2("moonReport/addReportF.asp",params, function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				if(undefined!=data.reportFDIds&&null!=data.reportFDIds){
					for(var i = 0;i<data.reportFDIds.length;i++){
						$("input[name^='UFD.id_']").eq(i).val(data.reportFDIds[i]);
					}
				}
				
				alert("保存成功");
			}else if(data != undefined&&data!=null&&data.result=="repeat"){
				alert("同期性能信息已提交，请勿重复提交！");
			}else{
				alert("保存失败");
			}
		});		
	});
}


//初始化分行信息技术部人员清单
function initReportStaff(){
	var period = $("[name='UM.period']").val();
	var bank_code = $("#currentLoginNoOrg_no").val();
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#reportSBaseTable").bootstrapTable(
			{
				//请求后台的URL（*）
				url : 'moonReport/queryReportSByPerAndBcode.asp?period='+period+'&bank_code='+bank_code,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				//pagination : true, //是否显示分页（*）
				pageList : [5,10,20],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 10,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "id", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'ID',
					title : 'id',
					align : "center",
					visible:false
				},{
					field : 'STAFF_HIREDATE',
					title : '入行时间',
					align : "center"
				},{
					field : 'STAFF_HIRETYPE',
					title : '调入渠道',
					align : "center"
				},{
					field : 'FINANCIAL_YEAR',
					title : '从事金融行业年限(年)',
					align : "center",
				},{
					field : 'TECHNICAL_TITLE',
					title : '高级专业技术职称名称',
					align : "center"
				}, {
					field : "IS_KEY_JOB_NAME",
					title : "是否关键岗位",
					align : "center",
					formatter : function(value, row, index){
						if(value=="00"){
							return "是";
						}else{
							return "否";
						}
					}
				}, {
					field : "STAFF_PHONE",
					title : "办公电话",
					align : "center"
				}, {
					field : "STAFF_CELL",
					title : "手机",
					align : "center"
				}, {
					field : "STAFF_EMAIL",
					title : "邮箱",
					align : "center"
				}, {
					field : "IS_LEAVE_NAME",
					title : "是否已调离",
					align : "center",
					formatter : function(value, row, index){
						if(value=="00"){
							return "是";
						}else{
							return "否";
						}
					}
				}, {
					field : "LEAVE_TIME",
					title : "调离时间",
					align : "center",
				}, {
					field : "LEAVE_WAY",
					title : "调离人员去向",
					align : "center"
				} ]
			});
}

//初始化信息科技人员专业高级资质持证情况
function initReportSD(){
	var period = $("[name='UM.period']").val();
	var bank_code = $("#currentLoginNoOrg_no").val();
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#reportSDBaseTable").bootstrapTable(
			{
				//请求后台的URL（*）
				url : 'moonReport/queryReportSDByPerAndBcode.asp?period='+period+'&bank_code='+bank_code,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				//pagination : true, //是否显示分页（*）
				pageList : [5,10],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 5,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "id", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				onLoadSuccess:function(data){
				},
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'ID',
					title : 'ID',
					align : "center",
					visible:false
				},{
					field : 'BANK_NAME',
					title : '分行名称',
					align : "center"
				},{
					field : 'STAFF_NAME',
					title : '人员姓名',
					align : "center"
				},{
					field : 'TECH_NAME',
					title : '资质',
					align : "center"
				},{
					field : 'CATE_NAME',
					title : '类别',
					align : "center"
				},{
					field : 'REMARK',
					title : '备注',
					align : "center"
				}]
			});
}

//初始化外包人员情况
function initReportStaffOut(){
	var period = $("[name='UM.period']").val();
	var bank_code = $("#currentLoginNoOrg_no").val();
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#reportSOBaseTable").bootstrapTable(
			{
				//请求后台的URL（*）
				url : 'moonReport/queryReportSOByPerAndBcode.asp?period='+period+'&bank_code='+bank_code,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				//pagination : true, //是否显示分页（*）
				pageList : [5,10],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 5,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "id", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				onLoadSuccess:function(data){
				},
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'STAFF_TYPE_NAME',
					title : '类型',
					align : "center"
				},{
					field : 'COUNTNUM',
					title : '人数',
					align : "center"
				},{
					field : 'STAFF_CO',
					title : '所属厂商名称',
					align : "center",
				}]
			});
}

//初始化外包合同情况
function initReportCon(){
	var period = $("[name='UM.period']").val();
	var bank_code = $("#currentLoginNoOrg_no").val();
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#reportCOBaseTable").bootstrapTable(
			{
				//请求后台的URL（*）
				url : 'moonReport/queryReportCOByPerAndBcode.asp?period='+period+'&bank_code='+bank_code,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				//pagination : true, //是否显示分页（*）
				pageList : [5,10],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 5,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "id", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'ID',
					title : 'ID',
					align : "center",
					visible:false
				},{
					field : 'SERVICE_TYPE_NAME',
					title : '服务类型',
					align : "center"
				},{
					field : 'SERVICE_REMARK',
					title : '如服务类型为“其它”，请具体说明',
					align : "center",
				},{
					field : "WORK_METHOD_NAME",
					title : "实施方法",
					align : "center"
				},{
					field : "AFFECT_TYPE_NAME",
					title : "影响业务类型",
					align : "center"
				},{
					field : "START_TIME",
					title : "起始时间",
					align : "center"
				},{
					field : "PLAN_END_TIME",
					title : "计划完成时间",
					align : "center"
				},{
					field : "CONTRACT_STATE_NAME",
					title : "执行情况",
					align : "center"
				},{
					field : "END_TIME",
					title : "如为“已完成”，请说明完成时间",
					align : "center"
				},{
					field : "WORK_COUNT",
					title : "工作总量",
					align : "center"
				},{
					field : "WORK_MONEY",
					title : "金额(万元)",
					align : "center"
				},{
					field : "IS_STOP_NAME",
					title : "是否发生服务中断或异常退出",
					align : "center"
				},{
					field : "CO_CODE",
					title : "服务提供商组织机构代码",
					align : "center"
				},{
					field : "CO_NAME",
					title : "服务提供商名称",
					align : "center"
				},{
					field : "CO_NATIONAL",
					title : "服务提供商国别",
					align : "center"
				}]

			});
}

//初始化制度建设情况
function initReportR(){
	var period = $("[name='UM.period']").val();
	var bank_code = $("#currentLoginNoOrg_no").val();
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#reportRBaseTable").bootstrapTable(
			{
				//请求后台的URL（*）
				url : 'moonReport/queryReportRByPerAndBcode.asp?period='+period+'&bank_code='+bank_code,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				//pagination : true, //是否显示分页（*）
				pageList : [5,10],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 5,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "id", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'ID',
					title : 'ID',
					align : "center",
					visible:false
				},{
					field : 'BANK_CODE_NAME',
					title : '分行名称',
					align : "center"
				},{
					field : 'REGIME_NAME',
					title : '制度名称',
					align : "center",
				},{
					field : "REGIME_TYPE_NAME",
					title : "类别",
					align : "center"
				},{
					field : "REGIME_LEVEL_NAME",
					title : "层级",
					align : "center"
				},{
					field : "VER_DATE",
					title : "版本日期",
					align : "center"
				}]
			});
}

initVlidate($("#reportM"));
initVlidate($("#reportB"));
initVlidate($("#reportC"));
initVlidate($("#reportF"));
initAddMoonReport();
initReportBAdd();
saveReportBAdd();
initReportCAdd();
saveReportCAdd();
initReportFAdd();
saveReportFAdd();

//故障信息删除
function delreportBAdd(row,cla){
	var delePhaseObj = getCurrentPageObj().find("[name='UB.id_"+row+"']");
	if(delePhaseObj){
		var delPhaseCode = delePhaseObj.val();
		//添加删除的编号隐藏域
		getCurrentPageObj().find("#reportBTableAdd").append("<tr> <input type=\"hidden\" name=\"UB.delete_reportb_id_"+row+"\" value=\""+delPhaseCode+"\" /></tr>");
	}
	getCurrentPageObj().find("#reportB_"+row).remove();
	reOrder(cla);
}
//变更信息删除
function delreportCAdd(row,cla){
	var delePhaseObj = getCurrentPageObj().find("[name='UC.id_"+row+"']");
	var delePhaseObj2 = getCurrentPageObj().find("[name='UC.change_name_"+row+"']");
	if(delePhaseObj){
		var delPhaseCode = delePhaseObj.val();
		var delPhaseName = delePhaseObj2.val();
		//添加删除的编号隐藏域
		getCurrentPageObj().find("#reportCTableAdd").append("<tr><input type=\"hidden\" name=\"UC.delete_reportc_id_"+row+"\" value=\""+delPhaseCode+"\" /></tr>");
		getCurrentPageObj().find("#reportCTableAdd").append("<input type=\"hidden\" name=\"UC.delete_reportc_name_"+row+"\" value=\""+delPhaseName+"\" /></tr>");
	}
	getCurrentPageObj().find("#reportC_"+row).remove();
	reOrder(cla);
}
//性能信息删除
function delreportFDAdd(row,cla){
	var delePhaseObj = getCurrentPageObj().find("[name='UFD.id_"+row+"']");
	if(delePhaseObj){
		var delPhaseCode = delePhaseObj.val();
		//添加删除的编号隐藏域
		getCurrentPageObj().find("#reportFDTableAdd").append("<tr><input type=\"hidden\" name=\"UFD.delete_reportfd_id_"+row+"\" value=\""+delPhaseCode+"\" /></tr>");
	}
	getCurrentPageObj().find("#reportFD_"+row).remove();
	reOrder(cla);
}

//删除行后重新排序
function reOrder(cla){
	 var rownumJiazds = getCurrentPageObj().find("."+cla);
	 for(var i=0;i<rownumJiazds.length;i++){
		 $(rownumJiazds[i]).html(i+1);
	 }
}
