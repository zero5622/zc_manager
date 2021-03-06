;initSendProduceConfirmListLayout();
function initSendProduceConfirmListLayout(){
	/**
	 * 定义常用页签内变量
	 */
	var sendProduceApply_queryList_call = getMillisecond()+'2';
	var currTab = getCurrentPageObj();
	
	/**
	 * 字典初始化方法
	 */
	initSelect(getCurrentPageObj().find("#change_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_CHANGE_TYPE"});
	initSelect(getCurrentPageObj().find("#data_root_status"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_DATA_ROOT_STATUS"});
	/**
	 * 获取查询参数
	 * @returns 
	 */
	function getSendProduceQueryParam(){
		var param={};
		var queryCondition = currTab.find("#queryCondition [name]");
		for(var i=0;i<queryCondition.length;i++){
			var obj=$(queryCondition[i]);
			if($.trim(obj.val())!=""){
				param[obj.attr("name")]=obj.val();
			}
		}
		return param;
	}
	/**
	 * 组装查询url 
	 * @returns {String}
	 */
	function uatSendProduceUrl(){
		var url = dev_construction+'sendProduceConfirm/queryAllSendProInfo.asp?call='+sendProduceApply_queryList_call+'&SID='+SID;
		/*var queryCondition = currTab.find("#queryCondition [name]");
		for(var i=0; i<queryCondition.length; i++){
			var obj=$(queryCondition[i]);
			if($.trim(obj.val())!=""){
				url+='&'+obj.attr("name")+"="+escape(encodeURIComponent(obj.val()));
			}
			console.log(i);
		}
		console.log(queryCondition)*/
		return url;
	}

	//初始化列表
	var queryParams=function(params){
		var temp = getSendProduceQueryParam();
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		return temp;
	};
	currTab.find("#sendProduceTable").bootstrapTable({
		url : dev_construction+'sendProduceConfirm/queryAllSendProInfo.asp?call='+sendProduceApply_queryList_call+'&SID='+SID,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "sub_req_id", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback: sendProduceApply_queryList_call,
		onLoadSuccess:function(data){
			gaveInfo();
		},
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
			field : 'AUDIT_NO',
			title : '投产单编号',
			align : 'center',
			width :"180"
		},{
			field : 'SYSTEM_NAME',
			title : '应用名称',
			align : "center",
			width :"150"
		},{
			field : 'VERSIONS_NAME',
			title : '版本名称',
			align : "center",
			width :"180"
		},{
			field : 'CHANGE_TYPE',
			title : '变更类别',
			align : "center",
			width :"100",
			formatter: function (value, row, index) {
				if(row.IS_INSTANCY=='00'){
					return "紧急变更";
				}else{
					return value;
				}
			}
		},{
			field : "PLAN_DATE",
			title : "计划投产日期",
			align : "center",
			width :"120"
		}, {
			field : "IS_INSTANCY_NAME",
			title : "是否紧急投产",
			align : "center",
			width :"120"
		/*}, {
			field : "PAKAGE_TYPE",
			title : "投产包类型",
			align : "center"*/
		}, {
			field : "APPLY_PERSON",
			title : "申请人",
			align : "center",
			width :"100"
		}, {
			field : "CREATE_APPLY_DATE",
			title : "提交投产时间",
			align : "center",
			width : "110"
		}, {
			field : "CURRENT_DISPOSE_MAN",
			title : "当前处理人",
			align : "center",
			width :"100"
		}, {
			field : "APPROVE_STATUS_NAME",
			title : "投产审批状态",
			align : "center",
			width :"100",
		}]
	});

	//初始化页面按钮事件
	//重置按钮
	currTab.find("#reset").click(function(){
		currTab.find("#queryCondition input").val("");
		var selects = currTab.find("#queryCondition select");
		selects.val(" ");
		selects.select2();
	});
	
	//查询按钮事件
	currTab.find("#query").unbind("click");
	currTab.find("#query").click(function(){
		currTab.find("#sendProduceTable").bootstrapTable("refresh",{url:uatSendProduceUrl()});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#query").click();});
	//投产确认 
	getCurrentPageObj().find("#confirm").click(function(){
		var selections = getCurrentPageObj().find("#sendProduceTable").bootstrapTable('getSelections');
		if(selections.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		var ids = $.map(selections, function(row) {
			return row.AUDIT_NO;
		});
		var produce_confirm = $.map(selections, function(row) {
			return row.DATA_ROOT_STATUS;
		});
		if(produce_confirm[0] == "02") {
			alert("该投产单已确认！");
			return;
		}
		var row = selections[0];
		var is_instancy = row.IS_INSTANCY;
		if(is_instancy == '00'){//00:紧急投产，01:一般投产
			closeAndOpenInnerPageTab("sendProduceConfirm_update","投产确认页面","dev_construction/send_produce/sendproduceapply/instancy/instancySendProduce_confirm.html",function(){
				initInstancySendProInfoConfirm(ids[0]);
			});
		}else{
			closeAndOpenInnerPageTab("sendProduceConfirm_update","投产确认页面","dev_construction/send_produce/sendproduceconfirm/sendProduceConfirm_update.html",function(){
				initSendProInfoConfirm(ids[0],selections[0].FILE_ID);
			});
		}
	});
	
	//查看详情
	currTab.find("#detail").click(function(){
		var selections = currTab.find("#sendProduceTable").bootstrapTable('getSelections');
		if(selections.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		var row = selections[0];
		var is_instancy = row.IS_INSTANCY;
		if(is_instancy != '00'){//00:紧急投产，01:一般投产
			closeAndOpenInnerPageTab("sendProduceApply_detail","投产信息查看页面","dev_construction/send_produce/sendproduceapply/sendProduceApply_detail.html",function(){
				initSendProInfoDetail(row);
				/*initTitle(row["INSTANCE_ID"]);
				initReqApprovalDetailInfo(row["INSTANCE_ID"]);*/
			});
		}else{
			closeAndOpenInnerPageTab("sendProduceApply_detail","投产信息查看页面","dev_construction/send_produce/sendproduceapply/instancy/instancySendProduce_detail.html",function(){
				initInstancySendProInfoDetail(row);
				//initTitle(row["INSTANCE_ID"]);
				//initAFApprovalInfo(row["INSTANCE_ID"],'0');
			});
		}
	});
	
}	