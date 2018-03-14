var w=1;
var j=1;
/**
 * 字典初始化方法
 */
function initAddStaffInfoPage(){
	initVlidate($("#addStaffList"));
	initSelect(getCurrentPageObj().find("#staff_politics"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_STAFF_POLITICS"});
	initSelect(getCurrentPageObj().find("#staff_degree"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_STAFF_DEGREE"});
	initSelect(getCurrentPageObj().find("#staff_education"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_STAFF_EDUCATION"});
	initSelect(getCurrentPageObj().find("#staff_edu_nature"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_STAFF_EDU_NATURE"});
	initSelect(getCurrentPageObj().find("#staff_level"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_STAFF_LEVEL"});
	initSelect(getCurrentPageObj().find("#staff_post"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_STAFF_POST"});
}

/**
 * 初始化部门、处室树
 */
(function(){
	var obj=getCurrentPageObj().find("#staff_dept");
	obj.unbind("click");
	obj.click(function(){
		openSelectTreeDivToBody($(this),"addtreedept_id","SOrg/queryorgtreedeptlist.asp",30,function(node){
			getCurrentPageObj().find("#staff_dept").val(node.name);
			getCurrentPageObj().find("input[name='S.staff_dept']").val(node.id);
			//隐藏提示选择部门的div
			getCurrentPageObj().find("#staff_offices").parent().find("div").remove();
			//当重新选择部门时清空处室的值
			getCurrentPageObj().find("#staff_offices").val("");
		});
	});
})();
(function(){
	var obj1=getCurrentPageObj().find("#staff_offices");
	obj1.unbind("click");
	obj1.click(function(){
		var orgid=getCurrentPageObj().find("input[name='S.staff_dept']").val();
		if(orgid==""){
			//先删除之前append的div，再append
			obj1.parent().find("div").remove();
			obj1.parent().append('<div class="tag-content" >请先选择部门</div>');
			return;
		}
		openSelectTreeDivToBody($(this),"addtreeoffices_id","SOrg/queryorgtreeofficeslist.asp?suporg_code="+orgid+"",30,function(node){
			getCurrentPageObj().find("#staff_offices").val(node.name);
			getCurrentPageObj().find("input[name='S.staff_offices']").val(node.id);
			//隐藏提示选择处室的div
			getCurrentPageObj().find("input[name^='p_name']").parent().find("div").remove();
			//隐藏提示选择处室的div
			getCurrentPageObj().find("#staff_group").parent().find("div").remove();
			//选择处室后清空最后一行岗位的值
			getCurrentPageObj().find("#posi_add_table tr").last().find("td:eq(1) input").val("");
		});
	});
	
	var obj2=getCurrentPageObj().find("#staff_group");
	obj2.unbind("click");
	obj2.click(function(){
		var orgid=getCurrentPageObj().find("input[name='S.staff_offices']").val();
		if(orgid==""){
			//先删除之前append的div，再append
			obj2.parent().find("div").remove();
			obj2.parent().append('<div class="tag-content" >请先选择处室</div>');
			return;
		}
		openSelectTreeDivToBody($(this),"addtreegroup_id","SOrg/queryorgtreeofficeslist.asp?suporg_code="+orgid+"",30,function(node){
			getCurrentPageObj().find("#staff_group").val(node.name);
			getCurrentPageObj().find("input[name='S.staff_group']").val(node.id);
		});
	});
})();
/**
 * 政治面貌切换
 * 入党时间、党支部标签是否可编辑
 * @param temp
 */
function politics_add(temp){
	if($("#staff_politics").val()==04){//政治面貌为群众
		getCurrentPageObj().find("#staff_politics_st").attr("disabled",true);
		getCurrentPageObj().find("#politics_branch").attr("disabled",true);
		getCurrentPageObj().find("#staff_politics_st").val("");
		getCurrentPageObj().find("#politics_branch").val("");
	}else{
		getCurrentPageObj().find("#staff_politics_st").attr("disabled",false);
		getCurrentPageObj().find("#politics_branch").attr("disabled",false);
	};
}

/**
 * 页面按钮初始化
 */
 $(function(){
	 //岗位信息新增
	 $("#posi_add_add").click(function(){
		 var len1 = document.getElementById("posi_add_table").rows.length;
		 var tr="<tr><td><input type=\"hidden\" name=\"p_name"+(len1-1)+"\" /><input type=\"text\" validate=\"v.required\" id=\"p_name"+(len1-1)+"\" class=\"citic-ast\" placeholder=\"点击选择岗位\" readonly /></td>" +
         "<td><input type=\"text\" id=\"p_starttime"+(len1-1)+"\" name=\"p_starttime\" onClick=\"WdatePicker({})\" valititle=\"点击选择\" validate=\"v.required\"  onchange=\"TimeCompare()\" class=\"input\" readonly/></td>" +
         "<td><textarea id=\"p_memo"+(len1-1)+"\" name=\"p_memo\" class=\"citic-text-ast\"></textarea></td>" +
		 "<td><a name='delPosition' style='cursor: pointer;'>删除</a></td></tr>";
		 $("#posi_add_table").append(tr);
		 initVlidate($("#posi_add_table"));
		 (function(){
				var obj1=getCurrentPageObj().find("#p_name"+(len1-1));
				var obj2=getCurrentPageObj().find("input[name='p_name"+(len1-1)+"']");
				obj1.unbind("click");
				obj1.click(function(){
					var officeid=getCurrentPageObj().find("input[name='S.staff_offices']").val();
					if(officeid==""){
						//如果没有处室，查询部门下的岗位
						officeid=getCurrentPageObj().find("input[name='S.staff_dept']").val();
//						//先删除之前append的div，再append
//						obj1.parent().find("div").remove();
//						obj1.parent().append('<div class="tag-content">请先选择处室</div>');
//						return;
					}
					openSelectTreeDivToBody($(this),"addtreepost_id","SOrg/queryorgtreepostlist.asp?org_code="+officeid+"",30,function(node){
						obj1.val(node.name);
						obj2.val(node.id);
					});
				});
			})();
		w++;
		 $("a[name='delPosition']").click(function(){
			 $(this).parent().parent().remove();
		 });
    });
 });
 //动态的给元素绑定事件 [可在元素定义之前定义该函数 ]
 $(document).on("click","div[page^='menu']:visible input[name^='child_sex']",function(){
	 var obj=$(this);
	 getCurrentPageObj().find("input[name='"+obj.attr("name")+"']").parent().removeClass('checkd');
	 obj.parent("span").addClass('checkd');
 });
 
 /**
  * 员工信息新增
  */
(function(){
	 var obj=getCurrentPageObj().find("#staffInfoSave");
	 obj.unbind("click");
	 obj.click(function(){
		 //先隐藏提示选择部门的div
		 getCurrentPageObj().find("#staff_offices").parent().find("div").remove();
		 getCurrentPageObj().find("#staff_group").parent().find("div").remove();
		 getCurrentPageObj().find("input[id^='p_name']").parent().find("div").remove();
		 if(vlidate(getCurrentPageObj(),"",false)){
			var staffJSON = new Array;
			var childJSON = new Array;
			var posiJSON = new Array;
			var vals=getCurrentPageObj().find("[type!='radio'][name^='S.']");
			var param={};
			for(var i=0;i<vals.length;i++){
				var val=$(vals[i]);
				param[val.attr("name").substr(2)]=val.val();
			}
			param["staff_sex"]=getCurrentPageObj().find("[type='radio'][name='S.staff_sex']:checked").val();
			param["staff_wed"]=getCurrentPageObj().find("[type='radio'][name='S.staff_wed']:checked").val();
			staffJSON.push(param);
			var StaffJSON=JSON.stringify(staffJSON);
			//获取页数据
			for(var k=1;k<$("#child_add_table").find("tr").length;k++){
				var childdatarows = {};
				childdatarows["child_name"] = getCurrentPageObj().find("[type!='radio'][name='child_name"+(k-1)+"']").val();
				childdatarows["child_sex"]=getCurrentPageObj().find("[type='radio'][name='child_sex"+(k-1)+"']:checked").val();
				childdatarows["child_birthday"]=getCurrentPageObj().find("[type!='radio'][name='child_birthday"+(k-1)+"']").val();
				childJSON.push(childdatarows);
			}
			var ChildJSON=JSON.stringify(childJSON);
			for(var h=1;h<$("#posi_add_table").find("tr").length;h++){
				var posidatarows = {};
				posidatarows["p_name"]=getCurrentPageObj().find("input[name='p_name"+(h-1)+"']").val();
				posidatarows["p_starttime"]=getCurrentPageObj().find("#p_starttime"+(h-1)).val();
				posidatarows["p_memo"]=getCurrentPageObj().find("#p_memo"+(h-1)).val();
				posiJSON.push(posidatarows);
			}
			if(posiJSON==""){
				alert("请至少添加一条岗位信息！");
				return;
			}
			var PosiJSON=JSON.stringify(posiJSON);
			baseAjax("StaffInfo/addStaffInfo.asp",{'s':StaffJSON,'c':ChildJSON,'p':PosiJSON},function(data){
				if(!data||!data.result||data.result=="false"){
					alert("保存失败!");
				}else if(!data||!data.result||data.result=="repeat"){
					alert("行员编号已存在！");
				}else{
//					这个alert是重写过的，可以加回调函数
					alert("保存成功!",function(){
						$("#staffTableInfo").bootstrapTable('refresh');
						closeCurrPageTab();
					});
				}
			});
		 }
	 });
})();		 

initAddStaffInfoPage();
