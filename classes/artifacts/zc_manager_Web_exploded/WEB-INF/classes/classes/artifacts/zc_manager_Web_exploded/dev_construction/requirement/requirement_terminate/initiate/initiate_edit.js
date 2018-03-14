
//初始化事件
function terInitEdit(){
	var $page = getCurrentPageObj();//当前页
	initVlidate($page);//渲染必填项
	autoInitSelect($page);//初始化下拉选择
	initButtonEvent();//初始化按钮事件
	
/****************************************************************/	
	
	//按钮事件
	function initButtonEvent(){
		//需求 pop框 
		$page.find("[name='IU.REQ_CODE']").click(function(){
			var $reqPop = $page.find("[mod='reqTerminatePop']");
			var $REQ_ID = $page.find("[name='IU.REQ_ID']");
			var $REQ_CODE = $page.find("[name='IU.REQ_CODE']");
			var $REQ_NAME = $page.find("[name='IU.REQ_NAME']");
			var $SUB_REQ_ID = $page.find("[name='IU.SUB_REQ_ID']");
			var $SUB_REQ_CODE = $page.find("[name='IU.SUB_REQ_CODE']");
			var $SUB_REQ_NAME = $page.find("[name='IU.SUB_REQ_NAME']");
			var $REQ_TASK_STATE_NAME = $page.find("[name='IU.REQ_TASK_STATE_NAME']");
			var $REQ_PRODUCT_MANAGER = $page.find("[name='IU.REQ_PRODUCT_MANAGER']");
			var $PROJECT_MAN_ID = $page.find("[name='IU.PROJECT_MAN_ID']");
			reqPop($reqPop, {
				REQ_ID : $REQ_ID,
				REQ_CODE : $REQ_CODE,
				REQ_NAME : $REQ_NAME,
				SUB_REQ_ID : $SUB_REQ_ID,
				SUB_REQ_CODE : $SUB_REQ_CODE,
				SUB_REQ_NAME : $SUB_REQ_NAME,
				REQ_TASK_STATE_NAME : $REQ_TASK_STATE_NAME,
				REQ_PRODUCT_MANAGER : $REQ_PRODUCT_MANAGER,
				PROJECT_MAN_ID : $PROJECT_MAN_ID
			});
		});
		
		
		//需求点 pop框
		$page.find("[name='IU.SUB_REQ_CODE']").click(function(){
			var REQ_ID_VAL = $page.find("[name='IU.REQ_ID']").val();
			if(!REQ_ID_VAL){
				alert("请选择需求");
				return;
			}
			var $subPop = $page.find("[mod='subTerminatePop']");
			var $SUB_REQ_ID = $page.find("[name='IU.SUB_REQ_ID']");
			var $SUB_REQ_CODE = $page.find("[name='IU.SUB_REQ_CODE']");
			var $SUB_REQ_NAME = $page.find("[name='IU.SUB_REQ_NAME']");
			var $REQ_TASK_STATE_NAME = $page.find("[name='IU.REQ_TASK_STATE_NAME']");
			var $REQ_TASK_STATE = $page.find("[name='IU.REQ_TASK_STATE']");
			var $PROJECT_MAN_ID = $page.find("[name='IU.PROJECT_MAN_ID']");
			subPop($subPop, {
				SUB_REQ_ID : $SUB_REQ_ID,
				SUB_REQ_CODE : $SUB_REQ_CODE,
				SUB_REQ_NAME : $SUB_REQ_NAME,
				REQ_TASK_STATE_NAME : $REQ_TASK_STATE_NAME,
				REQ_TASK_STATE : $REQ_TASK_STATE,
				PROJECT_MAN_ID : $PROJECT_MAN_ID,
				REQ_ID : REQ_ID_VAL
			});
		});
		
		
		
		
		//提交按钮
		$page.find("[btn='saveti']").click(function(){
			var params = getPageParam("IU");
			var initExp = getCurrentPageObj().find("[name='IU.INITIATE_EXPLAIN']").attr("placeholder");
			if(params.INITIATE_EXPLAIN == initExp){
				params.INITIATE_EXPLAIN = '';
			}
			if(!vlidate($page,"",true)){
				alert("有必填项未填");
				return ;
			}
			
			var aaa=getCurrentPageObj().find("[name='IU.INITIATE_EXPLAIN']").val();
		    if(aaa.length>230){
		    	alert("终止描述至多可输入230汉字！");
		    	return;
		    }
			
			var sCall = getMillisecond();
			baseAjaxJsonp(dev_construction+"req_terminate/initiateApply.asp?SID=" + SID + "&call=" + sCall, params, function(data) {
				if(data && data.result=="true"){
					alert(data.msg);
					closeCurrPageTab();
				}else{
					alert(data.msg);
					closeCurrPageTab();
				}
			},sCall,false);
			
		});
		
	};
	
}

