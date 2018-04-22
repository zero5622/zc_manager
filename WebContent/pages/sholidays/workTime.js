/**
 * 
 */
$(document).ready(function(){
	//路径
	var url="workTime/query.asp";
	var params={"serNo":"workTimeCfg"};
	baseAjax(url, params, function(data) {
		getCurrentPageObj().find("#am_work_up_time").val(data.am_work_up_time);
		getCurrentPageObj().find("#serNo").val(data.serNo);
		getCurrentPageObj().find("#am_work_down_time").val(data.am_work_down_time);
		getCurrentPageObj().find("#pm_work_up_time").val(data.pm_work_up_time);
		getCurrentPageObj().find("#pm_work_down_time").val(data.pm_work_down_time);
		getCurrentPageObj().find("#ot_start_time").val(data.ot_start_time);
		getCurrentPageObj().find("#ot_end_time").val(data.ot_end_time);
		getCurrentPageObj().find("input[type='radio'][value='"+data.is_allow+"']").attr("checked","checked");
		getCurrentPageObj().find("#deadline").val(data.deadline);
		//$("#workTimeForm").setform(data);//主键
	});
	
	
	$("#workTimeSaveBtn").click(function(){
		//路径
		/*var url="workTime/insert.asp";
		//上午开始上班时间
		var serNo=$("#serNo").val();
		var am_work_up_time=$("#am_work_up_time").val();
		//上午结束上班时间
		var am_work_down_time=$("#am_work_down_time").val();
		//
		var pm_work_up_time=$("#pm_work_up_time").val();
		
		var pm_work_down_time=$("#pm_work_down_time").val();
		
		var ot_start_time=$("#ot_start_time").val();
		
		var ot_end_time=$("#ot_end_time").val();
		
		var params={"serNo":serNo,"am_work_up_time":am_work_up_time,"am_work_down_time":am_work_down_time,"pm_work_up_time":pm_work_up_time,"pm_work_down_time":pm_work_down_time,"ot_start_time":ot_start_time,"ot_end_time":ot_end_time};
		baseAjax(url, params, function(data) {
			$("#serNo").val(data.serNo);//主键
			alert("保存成功");
		});*/
		saveWorkTime();
		
	});
	
	
	$("#workTerminalSaveBtn").click(function(){
	/*	var url="workTime/insert.asp";
		var is_allow=$("input[type='radio']:checked").val();
		var deadline=$("#deadline").val();
		var params={"serNo":serNo,"is_allow":is_allow,"deadline":deadline};
		baseAjax(url, params, function(data) {
			$("#serNo").val(data.serNo);//主键
			alert("保存成功");
		});*/
		saveWorkTime();
	});
	
});

function saveWorkTime(callback){
	var url="workTime/insert.asp";
	//上午开始上班时间
	var serNo=$("#serNo").val();
	var am_work_up_time=$("#am_work_up_time").val();
	//上午结束上班时间
	var am_work_down_time=$("#am_work_down_time").val();
	//
	var pm_work_up_time=$("#pm_work_up_time").val();
	
	var pm_work_down_time=$("#pm_work_down_time").val();
	
	var ot_start_time=$("#ot_start_time").val();
	
	var ot_end_time=$("#ot_end_time").val();
	
	var is_allow=$("input[type='radio']:checked").val();
	
	var deadline=$("#deadline").val();
	
	var params={"serNo":serNo,"am_work_up_time":am_work_up_time,"am_work_down_time":am_work_down_time,"pm_work_up_time":pm_work_up_time,"pm_work_down_time":pm_work_down_time,"ot_start_time":ot_start_time,"ot_end_time":ot_end_time,"is_allow":is_allow,"deadline":deadline};
	
	baseAjax(url, params, function(data) {
		$("#serNo").val(data.serNo);//主键
		alert("保存成功");
		callback;
	});
}