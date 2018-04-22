/**
 * 字典初始化方法
 */
function initStaffInfoPage(){
	initSelect(getCurrentPageObj().find("#staff_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_STAFF_STATE"});
	initSelect(getCurrentPageObj().find("#staff_level"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_STAFF_LEVEL"});
	initSelect(getCurrentPageObj().find("#staff_post"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_STAFF_POST"});
	initSelect(getCurrentPageObj().find("#staff_politics"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_STAFF_POLITICS"});
}

/**
 * 初始化部门、处室树
 */
(function(){
	var obj=getCurrentPageObj().find("#staff_dept");
	obj.unbind("click");
	obj.click(function(){
		openSelectTreeDivToBody($(this),"querytreedept_id","SOrg/queryorgtreedeptlist.asp",30,function(node){
			getCurrentPageObj().find("#staff_dept").val(node.name);
			getCurrentPageObj().find("input[name='staff_dept']").val(node.id);
			//隐藏提示选择部门的div
			getCurrentPageObj().find("#staff_offices").parent().find("div").remove();
		});
	});
})();
(function(){
	var obj1=getCurrentPageObj().find("#staff_offices");
	obj1.unbind("click");
	obj1.click(function(){
		var orgid=getCurrentPageObj().find("input[name='staff_dept']").val();
		if(orgid==""){
			//先删除之前append的div，再append
			obj1.parent().find("div").remove();
			obj1.parent().append('<div class="tag-content">请先选择部门</span>');
			return;
		}
		openSelectTreeDivToBody($(this),"querytreeoffices_id","SOrg/queryorgtreeofficeslist.asp?suporg_code="+orgid+"",30,function(node){
			getCurrentPageObj().find("#staff_offices").val(node.name);
			getCurrentPageObj().find("input[name='staff_offices']").val(node.id);
			//隐藏提示选择处室的div
			getCurrentPageObj().find("#staff_group").parent().find("div").remove();
		});
	});
	
	var obj2=getCurrentPageObj().find("#staff_group");
	obj2.unbind("click");
	obj2.click(function(){
		var orgid=getCurrentPageObj().find("input[name='staff_offices']").val();
		if(orgid==""){
			//先删除之前append的div，再append
			obj2.parent().find("div").remove();
			obj2.parent().append('<div class="tag-content" >请先选择处室</div>');
			return;
		}
		openSelectTreeDivToBody($(this),"querytreegroup_id","SOrg/queryorgtreeofficeslist.asp?suporg_code="+orgid+"",30,function(node){
			getCurrentPageObj().find("#staff_group").val(node.name);
			getCurrentPageObj().find("input[name='staff_group']").val(node.id);
		});
	});
})();

/**aa
 * 组装查询url 
 * @returns {String}
 */
function queryStaffInfoUrl(){
	var url="StaffInfo/queryallstaffinfo.asp?a=1";
	var fds=getCurrentPageObj().find("input[name]");
	for(var i=0;i<fds.length;i++){
		var obj=$(fds[i]);
		if($.trim(obj.val())!=""){
			url+='&'+obj.attr("name")+"="+escape(encodeURIComponent(obj.val()));
		}
	}
	return url;
}

/**
 * 获取查询参数
 * @returns {___anonymous51_52}
 */
function getSinfoParams(){
	var param={};
	var inputs=	$("#staffInfoList input");
	for(var i=0;i<inputs.length;i++){
		var obj=$(inputs[i]);
		if($.trim(obj.val())!=""){
			param[obj.attr("name")]=obj.val();
		}
	}
	var selects=$("#staffInfoList select");
	for(var i=0;i<selects.length;i++){
		var obj=$(selects[i]);
		if($.trim(obj.val())!=""){
			param[obj.attr("name")]=obj.val();
		}
	}
	return param;
}
var queryParams=function(params){
	var temp=getSinfoParams();
	 temp["limit"]=params.limit;
	 temp["offset"]=params.offset;
	return temp;
};

//查询列表显示table
function initStaffInfo() {
	autoInitSelect($("#staffInfoList"));
	$("#staffTableInfo").bootstrapTable(
			{
				url : 'StaffInfo/queryallstaffinfo3.asp',
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [5,10,20],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 10,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "staff_code", //每一行的唯一标识，一般为主键列
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
					field : 'STAFF_ID',
					title : '客户id',
					align : 'center',
					visible:false
				},{
					field : 'STAFF_NAME',
					title : '项目名称',
					align : "center"
				},{
					field : "STAFF_STATE",
					title : "评估日期",
					align : "center"
				}, {
					field : "STAFF_DEPT",
					title : "客户姓名",
					align : "center"
				}, {
					field : "STAFF_OFFICES",
					title : "客户年龄",
					align : "center",
                    width : "4%"
				}, {
					field : "STAFF_GROUP",
					title : "录入人姓名",
					align : "center",
				} ]
			});
};
/**
 * 初始化页面查询事件
 */
(function(){
	getCurrentPageObj().find("#reset").click(function(){
		getCurrentPageObj().find("#staffInfoList input").val("");
		var selects=$("#staffInfoList select");
		selects.val(" ");
		selects.select2();
	});
	//查询按钮事件
	getCurrentPageObj().find("#queryStaffInfo").unbind("click");
	getCurrentPageObj().find("#queryStaffInfo").click(function(){
		getCurrentPageObj().find("#staffTableInfo").bootstrapTable("refresh",{url:queryStaffInfoUrl()});
	});
	//新增行员信息
	getCurrentPageObj().find("#customInfoAdd").unbind("click");
	getCurrentPageObj().find("#customInfoAdd").click(function(){
		closeAndOpenInnerPageTab("customInfoAdd","新增康复服务信息","recoveryService/recoveryServiceInfo/recoveryServiceInfo_add.html",function(){});
	});
	//修改查询行员信息
	getCurrentPageObj().find("#staffInfoEdit").unbind("click");
	getCurrentPageObj().find("#staffInfoEdit").click(function(){
		var id = $("#staffTableInfo").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		var ids = $.map(id, function (row) {
			return row.STAFF_ID;                    
		});
		closeAndOpenInnerPageTab("staffInfoEdit","修改客户信息","resources/staffInfo/customInfo_update.html",function(){
			staffInfo_update(ids);
		});
	});
	//删除行员信息
	getCurrentPageObj().find("#staffInfoDel").unbind("click");
	getCurrentPageObj().find("#staffInfoDel").click(function(){
		var id = $("#staffTableInfo").bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {
			return row.STAFF_ID;                  
		});
		if(id.length!=1){
			alert("请选择一条数据进行删除!");
			return ;
		}
		nconfirm("确定要删除该行员信息吗？",function(){
			$("#staffTableInfo").bootstrapTable('remove', {
				field: 'staff_id',
				values: ids
			});
			var url="StaffInfo/delstaffinfo.asp?staff_id="+ids;
			$.ajax({
				type : "post",
				url : url,
				async :  true,
				data : "",
				dataType : "json",
				success : function(msg) {
					alert("删除成功！",function(){
						getCurrentPageObj().find("#staffTableInfo").bootstrapTable('refresh');
					});
				},
				error : function() {	
					alert("删除失败！");
				}
			});
		});
	});
	//员工离行信息登记
	getCurrentPageObj().find("#staffLeaRegi").unbind("click");
	getCurrentPageObj().find("#staffLeaRegi").click(function(){
		var id = $("#staffTableInfo").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行登记!");
			return ;
		}
//		var staffstate = $.map(id, function (row) {
//			return row.STAFF_STATE;                    
//		});
//		if(staffstate=='离职'){
//			alert("该行员已经处于离行状态！");
//			return ;
//		}
		var ids = $.map(id, function (row) {
			return row.STAFF_ID;                    
		});
		closeAndOpenInnerPageTab("staffLeaRegi","离行信息登记","resources/staffInfo/staffInfo_leave.html",function(){
			staffInfo_leave(ids);
		});
	});
	//考勤导入
//	getCurrentPageObj().find("#staffAttendImp").unbind("click");
//	getCurrentPageObj().find("#staffAttendImp").click(function(){
//		closeAndOpenInnerPageTab("staffAttendImp","考勤导入","resources/staffInfo/staffInfo_attendance.html",function(){});
//	});
	//行员信息导入
	getCurrentPageObj().find("#staffInfoImp").unbind("click");
	getCurrentPageObj().find("#staffInfoImp").click(function(){
		$("#staffInfo_import").modal("show");
	});
	
	getCurrentPageObj().find("#importStaff").unbind("click");
	getCurrentPageObj().find("#importStaff").click(function(){
		startLoading();
	    $.ajaxFileUpload({
		    url:"StaffInfo/importstaffinfo.asp",
		    type:"post",
			secureuri:false,
			fileElementId:'Stafffile',
			data:'',
			dataType: 'json',
			success:function (msg){
				endLoading();
				getCurrentPageObj().find("#Stafffile").val("");
				getCurrentPageObj().find("#stafffield").val("");
				$("#staffInfo_import").modal("hide");
				if(msg&&msg.result=="true"){
					alert("导入成功！",function(){
						getCurrentPageObj().find("#staffTableInfo").bootstrapTable("refresh");
					});
				}else if(msg&&msg.error_info){
					alert("导入失败："+msg.error_info);
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
})();

//时间比较
function hireTimeCompare(){
	WdatePicker({onpicked:function(){
		var check_starttime = getCurrentPageObj().find("#staff_hiredate_st").val();
		var check_endtime = getCurrentPageObj().find("#staff_hiredate_et").val();
		if(check_starttime!=""&&check_endtime!=""){
			if(check_starttime>check_endtime){
				alert('开始时间不能大于结束时间!',function(){
					getCurrentPageObj().find("#staff_hiredate_st").val("");
					getCurrentPageObj().find("#staff_hiredate_et").val("");
				});
			}
		}
	}});
}

initStaffInfo();
initStaffInfoPage();
