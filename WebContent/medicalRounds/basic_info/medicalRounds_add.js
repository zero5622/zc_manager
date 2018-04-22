/**
 * 字典初始化方法
 */
function initModifyMedicalRoundsPage(){
    initSelect(getCurrentPageObj().find("#custom_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_CUSTOM_TYPE"});
    initSelect(getCurrentPageObj().find("#disabled_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_DISABLED_TYPE"});
    initSelect(getCurrentPageObj().find("#custom_selfcare"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_CUSTOM_SELFCARE"});
    initSelect(getCurrentPageObj().find("#custom_jobState"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_CUSTOM_JOBSTATE"});
    initSelect(getCurrentPageObj().find("#custom_homeType"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_CUSTOM_HOMETYPE"});
    initSelect(getCurrentPageObj().find("#custom_medicalPay"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_CUSTOM_MEDICALPAY"});
    initSelect(getCurrentPageObj().find("#custom_foodHabit"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_CUSTOM_FOODHABIT"});
    initSelect(getCurrentPageObj().find("#custom_blood"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_CUSTOM_BLOOD"});
    initSelect(getCurrentPageObj().find("#custom_livingWith"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_CUSTOM_LIVINGWITH"});
    initSelect(getCurrentPageObj().find("#custom_income"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_CUSTOM_INCOME"});
    initSelect(getCurrentPageObj().find("#custom_livingSitu"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_CUSTOM_LIVINGSITU"});
}


/**
 * 项目信息编辑
 */
(function(){
    var obj=getCurrentPageObj().find("#customInfoSave");
    obj.unbind("click");
    obj.click(function(){
        debugger;
        if(/*vlidate(getCurrentPageObj(),"",false)*/true){
            var projectJSON = new Array;
            var inputs = $("input[name^='MODMR.']");
            var selects = $("select[name^='MODMR.']");
            var checkboxes = $("input:checkbox[name^='MODMR.']:checked")/*.each(function() {$(this).val();})*/;
            var param={};
            for(var i=0;i<inputs.length;i++){
                if("custom_disease"==$(inputs[i]).attr("name").substr(6)){
                    continue;
                }else{
                    param[$(inputs[i]).attr("name").substr(6)] = $(inputs[i]).val();
                }
            }
            //下拉选
            for(var i=0;i<selects.length;i++){
                param[$(selects[i]).attr("name").substr(6)] = $(selects[i]).val();
            }
            for(var i=0;i<checkboxes.length;i++){
                if(i==0){
                    param[$(checkboxes[i]).attr("name").substr(6)] = $(checkboxes[i]).val()+",";
                }else if(i==checkboxes.length-1){
                    param[$(checkboxes[i]).attr("name").substr(6)] += $(checkboxes[i]).val();
                }else {
                    param[$(checkboxes[i]).attr("name").substr(6)] += $(checkboxes[i]).val()+",";
                }
            }
            projectJSON.push(param);
            var projectJSON=JSON.stringify(projectJSON);
            debugger;
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

initModifyMedicalRoundsPage();
