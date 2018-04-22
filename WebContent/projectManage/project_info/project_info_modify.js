/**
 * 字典初始化方法
 */
function initAddProjectInfoPage(){
	initSelect(getCurrentPageObj().find("#project_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_PROJECT_TYPE"});
}


 /**
  * 项目信息编辑
  */
(function(){
	 var obj=getCurrentPageObj().find("#projectInfoSave");
	 obj.unbind("click");
	 obj.click(function(){
		 if(vlidate(getCurrentPageObj(),"",false)){
			var projectJSON = new Array;
             var inputs = $("input[name^='MODP.']");
             var selects = $("select[name^='MODP.']");
			var param={};
             for(var i=0;i<inputs.length;i++){
                 param[$(inputs[i]).attr("name").substr(5)] = $(inputs[i]).val();
             }
             //下拉选
             for(var i=0;i<selects.length;i++){
                 param[$(selects[i]).attr("name").substr(5)] = $(selects[i]).val();
             }
             projectJSON.push(param);
			var projectJSON=JSON.stringify(projectJSON);
			baseAjax("ProjectInfo/modifyProjectInfo.asp",param,function(data){
				if(!data||!data.result||data.result=="false"){
					alert("保存失败!");
				}else if(!data||!data.result||data.result=="repeat"){
					alert("项目名称重复！");
				}else{
//					这个alert是重写过的，可以加回调函数
					alert("保存成功!",function(){
						$("#projectInfoTable").bootstrapTable('refresh');
						closeCurrPageTab();
					});
				}
			});
		 }
	 });
})();

initAddProjectInfoPage();
