var w=1;
var x=1;

/**
 * 字典初始化方法
 */
function initUpdateStaffInfoPage(){
	initVlidate($("#updateStaffList"));
	initSelect(getCurrentPageObj().find("#STAFF_POLITICS"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_STAFF_POLITICS"});
	initSelect(getCurrentPageObj().find("#STAFF_DEGREE"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_STAFF_DEGREE"});
	initSelect(getCurrentPageObj().find("#STAFF_EDUCATION"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_STAFF_EDUCATION"});
	initSelect(getCurrentPageObj().find("#STAFF_EDU_NATURE"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_STAFF_EDU_NATURE"});
	initSelect(getCurrentPageObj().find("#STAFF_LEVEL"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_STAFF_LEVEL"});
	initSelect(getCurrentPageObj().find("#STAFF_POST"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_STAFF_POST"});
}

/**
 * 初始化部门、处室树
 */
(function(){
	var obj=getCurrentPageObj().find("#STAFF_DEPT");
	obj.unbind("click");
	obj.click(function(){
		openSelectTreeDivToBody($(this),"uptreedept_id","SOrg/queryorgtreedeptlist.asp",30,function(node){
			getCurrentPageObj().find("#STAFF_DEPT").val(node.name);
			getCurrentPageObj().find("input[name='STAFF_DEPT']").val(node.id);
			//隐藏提示选择部门的div
			getCurrentPageObj().find("#STAFF_OFFICES").parent().find("div").remove();
			//当重新选择部门时清空处室的值
			getCurrentPageObj().find("#STAFF_OFFICES").val("");
		});
	});
})();
(function(){
	var obj1=getCurrentPageObj().find("#STAFF_OFFICES");
	obj1.unbind("click");
	obj1.click(function(){
		var orgid=getCurrentPageObj().find("input[name='STAFF_DEPT']").val();
		if(orgid==""){
			//先删除之前append的div，再append
			obj1.parent().find("div").remove();
			obj1.parent().append('<div class="tag-content" >请先选择部门</div>');
			return;
		}
		openSelectTreeDivToBody($(this),"uptreeoffices_id","SOrg/queryorgtreeofficeslist.asp?suporg_code="+orgid+"",30,function(node){
			getCurrentPageObj().find("#STAFF_OFFICES").val(node.name);
			getCurrentPageObj().find("input[name='STAFF_OFFICES']").val(node.id);
			//隐藏提示选择处室的div
			getCurrentPageObj().find("input[name^='p_name']").parent().find("div").remove();
			getCurrentPageObj().find("#STAFF_GROUP").parent().find("div").remove();
		});
	});
	
	var obj2=getCurrentPageObj().find("#STAFF_GROUP");
	obj2.unbind("click");
	obj2.click(function(){
		var orgid=getCurrentPageObj().find("input[name='STAFF_OFFICES']").val();
		if(orgid==""){
			//先删除之前append的div，再append
			obj2.parent().find("div").remove();
			obj2.parent().append('<div class="tag-content" >请先选择处室</div>');
			return;
		}
		openSelectTreeDivToBody($(this),"addtreegroup_id","SOrg/queryorgtreeofficeslist.asp?suporg_code="+orgid+"",30,function(node){
			getCurrentPageObj().find("#STAFF_GROUP").val(node.name);
			getCurrentPageObj().find("input[name='STAFF_GROUP']").val(node.id);
		});
	});
})();

/**
 * 页面按钮初始化
 */
 $(function(){
	//岗位信息新增
	 $("#posi_update_add").click(function(){
		 var len1 = document.getElementById("posi_update_table").rows.length;
		 var tr="<tr><td><input type=\"hidden\" name=\"p_name"+(len1-1)+"\" /><input type=\"text\" id=\"P_NAME"+(len1-1)+"\" validate=\"v.required\" class=\"citic-ast\" placeholder=\"点击选择岗位\" readonly/></td>" +
         "<td><input type=\"text\" id=\"P_STARTTIME"+(len1-1)+"\" name=\"p_starttime"+(len1-1)+"\" onClick=\"WdatePicker({})\" valititle=\"点击选择\"  onchange=\"TimeCompare()\" class=\"input\" validate=\"v.required\" readonly/></td>" +
         "<td><textarea id=\"P_MEMO"+(len1-1)+"\" name=\"p_memo"+(len1-1)+"\" class=\"citic-text-ast\"></textarea></td>" +
		 "<td><a name='delPosition' style='cursor: pointer;'>删除</a></td></tr>";
		 getCurrentPageObj().find("#posi_update_table").append(tr);
		 initVlidate($("#posi_update_table"));
		 (function(){
				var obj1=getCurrentPageObj().find("#P_NAME"+(len1-1));
				var obj2=getCurrentPageObj().find("input[name='p_name"+(len1-1)+"']");
				obj1.unbind("click");
				obj1.click(function(){
					var officeid=getCurrentPageObj().find("input[name='STAFF_OFFICES']").val();
					if(officeid==""){
						//如果没有处室，查询部门下的岗位
						officeid=getCurrentPageObj().find("input[name='STAFF_DEPT']").val();
						//先删除之前append的div，再append
//						obj1.parent().find("div").remove();
//						obj1.parent().append('<div class="tag-content" >请先选择处室</div>');
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
	 $("#child_update_add").click(function(){
		 var len = document.getElementById("child_update_table").rows.length;
		 var tr="<tr><td><input type=\"text\" id=\"child_name"+(len-1)+"\" name=\"child_name"+(len-1)+"\"/></td>" +
 		 "<td><div class=\"ecitic-radio-all\" id=\"child_sex"+(len-1)+"\"><div class=\"ecitic-radio ecitic-radio-inline\" ><span><input type=\"radio\" value=\"01\" name=\"child_sex"+(len-1)+"\" /></span><label>男</label></div>" +
 		 "<div class=\"ecitic-radio ecitic-radio-inline\"><span><input type=\"radio\" value=\"02\" name=\"child_sex"+(len-1)+"\" /></span><label>女</label></div></div></td>" +
         "<td><input type=\"text\" id=\"child_birthday"+(len-1)+"\" name=\"child_birthday"+(len-1)+"\" onClick=\"WdatePicker({})\" valititle=\"点击选择\"  onchange=\"TimeCompare()\" class=\"input\" readonly/></td>" +
         "<td><a name='delChild' style='cursor: pointer;'>删除</a></td></tr>";
		 getCurrentPageObj().find("#child_update_table").append(tr);
		 $("a[name='delChild']").click(function(){
			 $(this).parent().parent().remove();
		 });
    });
 });
 
 //动态的给元素绑定事件 [可在元素定义之前定义该函数 ]
 $(document).on("click","div[page^='menu']:visible input[name^='child_sex']",function(){
	 var obj=$(this);
	 getCurrentPageObj().find("input[name='"+obj.attr("name")+"']").parent("span").removeClass('checkd');
	 obj.parent("span").addClass('checkd');
 });

/**
 * 员工信息修改
 */
 (function(){
	 var obj=getCurrentPageObj().find("#staffInfoUpdate");
	 obj.unbind("click");
	 obj.click(function(){
		 if(vlidate(getCurrentPageObj(),"",false)){
			var staffJSON = new Array;
			var childJSON = new Array;
			var posiJSON = new Array;
			var vals1=getCurrentPageObj().find("[type!='radio'][name^='STAFF']");
			var vals2=getCurrentPageObj().find("[type!='radio'][name^='EC']");
			var param={};
			for(var i=0;i<vals1.length;i++){
				var val=$(vals1[i]);
				param[val.attr("name").toLowerCase()]=val.val();
			}
			for(var i=0;i<vals2.length;i++){
				var val=$(vals2[i]);
				param[val.attr("name").toLowerCase()]=val.val();
			}
			param["staff_sex"]=getCurrentPageObj().find("[type='radio'][name='STAFF_SEX']:checked").val();
			param["staff_wed"]=getCurrentPageObj().find("[type='radio'][name='STAFF_WED']:checked").val();
			param["politics_branch"]=getCurrentPageObj().find("[type!='radio'][name='POLITICS_BRANCH']").val();
			param["identity_card"]=getCurrentPageObj().find("[type!='radio'][name='IDENTITY_CARD']").val();
			param["financial_year"]=getCurrentPageObj().find("[type!='radio'][name='FINANCIAL_YEAR']").val();
			param["start_worktime"]=getCurrentPageObj().find("[type!='radio'][name='START_WORKTIME']").val();
			staffJSON.push(param);
			//获取页数据
			for(var k=1;k<$("#child_update_table").find("tr").length;k++){
				var childdatarows = {};
				childdatarows["child_id"] = getCurrentPageObj().find("[type!='radio'][name='child_id"+(k-1)+"']").val();
				childdatarows["child_name"] = getCurrentPageObj().find("[type!='radio'][name='child_name"+(k-1)+"']").val();
				childdatarows["child_sex"]=GetRadioValue("child_sex"+(k-1));
				childdatarows["child_birthday"]= getCurrentPageObj().find("[type!='radio'][name='child_birthday"+(k-1)+"']").val();
				childJSON.push(childdatarows);
			}
			for(var h=1;h<$("#posi_update_table").find("tr").length;h++){
				var posidatarows = {};
				posidatarows["p_id"]=getCurrentPageObj().find("[type!='radio'][name='p_id"+(h-1)+"']").val();
				posidatarows["p_name"]=getCurrentPageObj().find("[type!='radio'][name='p_name"+(h-1)+"']").val();
				posidatarows["p_starttime"]=getCurrentPageObj().find("[type!='radio'][name='p_starttime"+(h-1)+"']").val();
				posidatarows["p_memo"]=getCurrentPageObj().find("[type!='radio'][name='p_memo"+(h-1)+"']").val();
				posiJSON.push(posidatarows);
			}
			if(posiJSON==""){
				alert("请至少添加一条岗位信息！");
				return;
			}
			var StaffJSON=JSON.stringify(staffJSON);
			var ChildJSON=JSON.stringify(childJSON);
			var PosiJSON=JSON.stringify(posiJSON);
			baseAjax("StaffInfo/updateStaffInfo.asp",{'s':StaffJSON,'c':ChildJSON,'p':PosiJSON},function(data){
				if(!data||!data.result||data.result=="false"){
					alert("修改失败!");
				}else{
					alert("修改成功!",function(){
						$("#staffTableInfo").bootstrapTable('refresh');
						closeCurrPageTab();
					});
				}
			});
		 }
	 });	 	
})();	
/**
 * 获取单选按钮的值
 * @param RadioName
 * @returns
 */
 function GetRadioValue(RadioName){
    var obj;
    obj=document.getElementsByName(RadioName);
    if(obj!=null){
        var i;
        for(i=0;i<obj.length;i++){
            if(obj[i].checked){
                return obj[i].value;
            }
        }
    }
    return null;
}

//修改页面赋值
function staffInfo_update(param){
	var p=param;
	baseAjax('StaffInfo/querystaffinfobyid.asp?&staff_id='+p,null,function(msg){
		//子女信息动态表赋值
		if(msg.child!=""){
			for(var i=0;i<msg.child.length;i++){
				var tr="<tr><td><input type=\"text\" id=\"CHILD_NAME"+i+"\" name=\"child_name"+i+"\" /></td>" +
				 "<td><div class=\"ecitic-radio-all\" id=\"CHILD_SEX"+i+"\"><div class=\"ecitic-radio ecitic-radio-inline\"><span><input type=\"radio\" value=\"01\" name=\"child_sex"+i+"\" /></span><label>男</label></div>" +
		 		 "<div class=\"ecitic-radio ecitic-radio-inline\"><span><input type=\"radio\" value=\"02\" name=\"child_sex"+i+"\" /></span><label>女</label></div></div></td>" +
				"<td><input type=\"text\" id=\"CHILD_BIRTHDAY"+i+"\" name=\"child_birthday"+i+"\" onClick=\"WdatePicker({})\" valititle=\"点击选择\"  onchange=\"TimeCompare()\" class=\"input\" readonly /></td>" +
				"<td><a name='delChild' style='cursor: pointer;'>删除</a></td></tr>";
				getCurrentPageObj().find("#child_update_table").append(tr);
				/*getCurrentPageObj().find("#CHILD_ID"+i).val(msg.child[i]["CHILD_ID"]);*/
				getCurrentPageObj().find("#CHILD_NAME"+i).val(msg.child[i]["CHILD_NAME"]);
				//单选框赋值
				getCurrentPageObj().find("input[name='child_sex"+i+"'][value='"+msg.child[i]["CHILD_SEX"]+"']").click();
				getCurrentPageObj().find("#CHILD_BIRTHDAY"+i).val(msg.child[i]["CHILD_BIRTHDAY"]);
				$("a[name='delChild']").click(function(){
					$(this).parent().parent().remove();
				});
			}
		}
		//岗位动态表赋值
		if(msg.posi!=""){
			for(var j=0;j<msg.posi.length;j++){
				var tr="<tr><td><input type=\"hidden\" name=\"p_name"+j+"\" /><input type=\"text\" id=\"P_NAME"+j+"\" validate=\"v.required\" class=\"citic-ast\" readonly/></td>" +
				"<td><input type=\"text\" id=\"P_STARTTIME"+j+"\" name=\"p_starttime"+j+"\" onClick=\"WdatePicker({})\" valititle=\"点击选择\"  onchange=\"TimeCompare()\" class=\"input\" validate=\"v.required\" readonly /></td>" +
				"<td><textarea id=\"P_MEMO"+j+"\" name=\"p_memo"+j+"\" class=\"citic-text-ast\"></textarea></td>" +
				"<td><a name='delPosi' style='cursor: pointer;'>删除</a></td></tr>";
				getCurrentPageObj().find("#posi_update_table").append(tr);
				initVlidate($("#posi_update_table"));
				/*getCurrentPageObj().find("#P_ID"+j).val(msg.posi[j]["P_ID"]);*/
				getCurrentPageObj().find("#P_NAME"+j).val(msg.posi[j]["P_NAME"]);
				getCurrentPageObj().find("input[name='p_name"+j+"']").val(msg.posi[j]["NAME_CODE"]);
				getCurrentPageObj().find("#P_STARTTIME"+j).val(msg.posi[j]["P_STARTTIME"]);
				getCurrentPageObj().find("#P_MEMO"+j).val(msg.posi[j]["P_MEMO"]);
				(function(){
					var obj1=getCurrentPageObj().find("#P_NAME"+j);
					var obj2=getCurrentPageObj().find("input[name='p_name"+j+"']");
					obj1.unbind("click");
					obj1.click(function(){
						var officeid=getCurrentPageObj().find("input[name='STAFF_OFFICES']").val();
						if(officeid==""){
							//先删除之前append的div，再append
//							obj1.parent().find("div").remove();
//							obj1.parent().append('<div class="tag-content" >请先选择处室</div>');
							return;
						}
						openSelectTreeDivToBody($(this),"updatetreepost_id","SOrg/queryorgtreepostlist.asp?org_code="+officeid+"",30,function(node){
							obj1.val(node.name);
							obj2.val(node.id);
						});
					});
				})();
				$("a[name='delPosi']").click(function(){
					 $(this).parent().parent().remove();
				});
			}
		}
		if(msg.sta.STAFF_PICTURE !=null && msg.sta.STAFF_PICTURE !=""){
			showupdatePicture(msg.sta.STAFF_PICTURE);
		}
		getCurrentPageObj().find("#updateStaffList").setform(msg.sta);
		getCurrentPageObj().find("input[name='STAFF_SEX'][value='"+msg.sta.STAFF_SEX+"']").click();
		getCurrentPageObj().find("input[name='STAFF_WED'][value='"+msg.sta.STAFF_WED+"']").click();
		getCurrentPageObj().find("#STAFF_DEPT").val(msg.sta.STAFF_DEPT);
		getCurrentPageObj().find("#STAFF_OFFICES").val(msg.sta.STAFF_OFFICES);
		getCurrentPageObj().find("#STAFF_GROUP").val(msg.sta.STAFF_GROUP);
		getCurrentPageObj().find("input[name='STAFF_DEPT']").val(msg.sta["DEPT_CODE"]);
		getCurrentPageObj().find("input[name='STAFF_OFFICES']").val(msg.sta["OFFICES_CODE"]);
		getCurrentPageObj().find("input[name='STAFF_GROUP']").val(msg.sta["GROUP_CODE"]);
		if(msg.sta.STAFF_POLITICS=='04'){//政治面貌为群众
			getCurrentPageObj().find("#STAFF_POLITICS_ST").attr("disabled",true);
			getCurrentPageObj().find("#POLITICS_BRANCH").attr("disabled",true);
		}else{
			getCurrentPageObj().find("#STAFF_POLITICS_ST").attr("disabled",false);
			getCurrentPageObj().find("#POLITICS_BRANCH").attr("disabled",false);
		}
	});
}

/**
 * 政治面貌切换
 * 入党时间、党支部标签是否可编辑
 * @param temp
 */
function politics_update(temp){
	if($("#STAFF_POLITICS").val()=='04'){//政治面貌为群众
		getCurrentPageObj().find("#STAFF_POLITICS_ST").attr("disabled",true);
		getCurrentPageObj().find("#POLITICS_BRANCH").attr("disabled",true);
		getCurrentPageObj().find("#STAFF_POLITICS_ST").val("");
		getCurrentPageObj().find("#POLITICS_BRANCH").val("");
	}else{
		getCurrentPageObj().find("#STAFF_POLITICS_ST").attr("disabled",false);
		getCurrentPageObj().find("#POLITICS_BRANCH").attr("disabled",false);
	};
}
/**
 * 头像上传 
 */
function uploadPictureupdateEvent(){
	var fileObj=getCurrentPageObj().find("#updatePic");
	fileObj.unbind("click");
	fileObj.click(function(){
		fileObj.unbind("click");
		var old_val=$(this).val();
		var int=setInterval(function(){
			if(old_val!=getCurrentPageObj().find("#updatePic").val()){
				clearInterval(int);
				$.ajaxFileUpload({
				    url:"image/uploadImage.asp?path_id=UPLOAD_IMG",
				    type:"post",
					secureuri:false,
					fileElementId:'updatePic',
					data:'',
					dataType: 'json',
					success:function (msg){
						uploadPictureupdateEvent();
						showupdatePicture(msg.file_id);
						getCurrentPageObj().find("input[name='STAFF_PICTURE']").val(msg.file_id);
					},
					error: function (msg){
						uploadPictureupdateEvent();
					}
			   });
			}
		},300);
	});
	
	var picture_delete=getCurrentPageObj().find(".picture-delete");
	picture_delete.unbind("click");
	picture_delete.click(function(){//删除工位全景图
		nconfirm("确定删除？",function(){
			baseAjax("image/deleteImg.asp",{path_id:"UPLOAD_IMG",file_id:getCurrentPageObj().find("input[name='STAFF_PICTURE']").val()},function(data){
				if(data&&data.result=="true"){
					removeUpdateImgSuccess();
				}else{
					alert("删除失败!");
				}
			});
		});
	});
}
uploadPictureupdateEvent();

/**
 * 头像删除成功
 */
function removeUpdateImgSuccess(){
	getCurrentPageObj().find("#STAFF_PICTURE").addClass("whide");
	getCurrentPageObj().find(".uploadPicture-btns").removeClass("whide");
	getCurrentPageObj().find(".picture-delete").hide();
	//getCurrentPageObj().find("#STAFF_PICTURE").parent().css({width:0});
	getCurrentPageObj().find("#STAFF_PICTURE").hide();
}
/**
 * 显示头像
 * @param file_id
 */
function showupdatePicture(file_id){
	getCurrentPageObj().find(".picture-delete").show();
	getCurrentPageObj().find("#STAFF_PICTURE").show();
	getCurrentPageObj().find("#STAFF_PICTURE").attr("src","image/imageFileViewToPage.asp?path_id=UPLOAD_IMG&file_id="+file_id);
}
/**
 * 头像加载成功
 */
function loadupatePicture(ths){
	getCurrentPageObj().find("#STAFF_PICTURE").removeClass("whide");
	getCurrentPageObj().find(".uploadPicture-btns").addClass("whide");
	getCurrentPageObj().find(".picture-delete").removeClass("whide");
	//getCurrentPageObj().find(ths).parent().css({width:ths.naturalWidth}); 表示真实图片宽度
}
initUpdateStaffInfoPage();
