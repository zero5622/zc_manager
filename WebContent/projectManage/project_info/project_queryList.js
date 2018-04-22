/**
 * 字典初始化方法
 */
function initProjectInfoPage(project_type){
    initSelect(getCurrentPageObj().find("#project_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_PROJECT_TYPE"},project_type);
}
//查询
getCurrentPageObj().find("#queryStaffInfo").click(function(){
    var project_no = $.trim(getCurrentPageObj().find("#project_no").val());
    var project_name = $.trim(getCurrentPageObj().find("#project_name").val());
    var project_type = $.trim(getCurrentPageObj().find("#project_type").val());
    var project_start_time = $.trim(getCurrentPageObj().find("#project_start_time").val());
    var project_start_time = $.trim(getCurrentPageObj().find("#project_start_time").val());
    getCurrentPageObj().find('#projectInfoList').bootstrapTable('refresh',{url:'ProjectInfo/queryAllProjectInfo.asp?project_no='+escape(encodeURIComponent(project_no))
    +'&project_name='+escape(encodeURIComponent(project_name))
    +'&project_type='+escape(encodeURIComponent(project_type))
    +'&project_start_time='+escape(encodeURIComponent(project_start_time))
    +'&project_start_time='+escape(encodeURIComponent(project_start_time))});
});
//重置按钮
getCurrentPageObj().find("#reset").unbind("click");
getCurrentPageObj().find("#reset").click(function(){
    getCurrentPageObj().find("#projectQueryData input").val("");
    var selects=$("#projectQueryData select");
    selects.val(" ");
    selects.select2();
});

//查询列表显示table
function initProjectInfo() {
    var queryParams=function(params){
        var temp={};
        temp["limit"]=params.limit;
        temp["offset"]=params.offset;
        return temp;
    };
	$("#projectInfoList").bootstrapTable(
			{
				url : 'ProjectInfo/queryAllProjectInfo.asp',
                method : 'get', //请求方式（*）
                striped : false, //是否显示行间隔色
                cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
                sortable : true, //是否启用排序
                sortOrder : "asc", //排序方式
                queryParams : queryParams,//传递参数（*）
                sidePagination : 'server', //分页方式：client客户端分页，server服务端分页（*）
                pagination : true, //是否显示分页（*）
                pageList : [5,10,20],//每页的记录行数（*）
                pageNumber : 1, //初始化加载第一页，默认第一页
                pageSize : 10,//可供选择的每页的行数（*）
                clickToSelect : true, //是否启用点击选中行
                uniqueId : "project_no", //每一行的唯一标识，一般为主键列
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
                    field: 'id',
                    visible:false
                },{
                    field : 'Number',
                    title : '序号',
                    align : "center",
                    //sortable: true,
                    width : "5%",
                    formatter: function (value, row, index) {
                        return index+1;
                    }
                },{
                    field : 'project_no',
                    title : '项目编号',
                    align : "center"
                },{
					field : 'project_name',
					title : '项目名称',
					align : "center"
				},{
					field : "project_start_time",
					title : "开始时间",
					align : "center"
				}, {
					field : "project_end_time",
					title : "结束时间",
					align : "center"
				}, {
					field : "project_type_name",
					title : "项目类型",
					align : "center"
				}, {
					field : "OPT_PERSON",
					title : "录入人姓名",
					align : "center"
				} ]
			});
};
/**
 * 初始化页面查询事件
 */
(function(){

	//新增项目信息
	getCurrentPageObj().find("#projectInfoAdd").unbind("click");
	getCurrentPageObj().find("#projectInfoAdd").click(function(){
		closeAndOpenInnerPageTab("projectInfoAdd","录入项目信息","projectManage/project_info/project_info_modify.html",function(){});
	});

    getCurrentPageObj().find("#wuliao").unbind("click");
    getCurrentPageObj().find("#wuliao").click(function(){
        closeAndOpenInnerPageTab("wuliao","物料信息","projectManage/project_info/project_info_add.html",function(){});
    });


})();

//修改
getCurrentPageObj().find("#projectInfoModify").unbind("click");
getCurrentPageObj().find("#projectInfoModify").click(function(){
    var num = $("#projectInfoList").bootstrapTable('getSelections');
    if(num.length!=1){
        alert("请选择一条数据进行修改!");
        return ;
    }
    closeAndOpenInnerPageTab("projectInfoModify","修改项目信息","projectManage/project_info/project_info_modify.html",function(){
        baseAjax('ProjectInfo/findProjectById.asp',{'id':num[0].project_id},function(msg){//初始化
            if(msg){//
                for(var k in msg){
                    getCurrentPageObj().find("input[name='MODP." + k + "']").val(msg[k]);
                    getCurrentPageObj().find("select[name^='MODP." + k + "']").val(msg[k]);
                    getCurrentPageObj().find("textarea[name='MODP." + k + "']").val(msg[k]);
                }
                initProjectInfoPage(msg.project_type);
            }
        },1);
    });
});

initProjectInfo();
initProjectInfoPage();
