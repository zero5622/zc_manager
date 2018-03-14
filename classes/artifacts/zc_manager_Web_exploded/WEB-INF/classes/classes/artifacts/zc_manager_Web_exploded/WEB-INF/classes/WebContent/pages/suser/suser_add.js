var gcp = getCurrentPageObj();

//按钮方法
function initAddUserButtonEvent(){

	/*var ib = gcp.find("#Ais_banker");
	gcp.find("#adduser_table").find('tr:eq(4)').find('td:eq(2)').hide();
	gcp.find("#adduser_table").find('tr:eq(4)').find('td:eq(3)').hide();
	ib.change(function(){
		var is_banker = ib.val();
		if(is_banker == '00'){
			gcp.find("#adduser_table").find('tr:eq(4)').find('td:eq(2)').show();
			gcp.find("#adduser_table").find('tr:eq(4)').find('td:eq(3)').show();
		}else if(is_banker == '01'){
			gcp.find("#adduser_table").find('tr:eq(4)').find('td:eq(2)').hide();
			gcp.find("#adduser_table").find('tr:eq(4)').find('td:eq(3)').hide();
		};
	});*/
	gcp.find("#addSUser").click(function(){
		if(!vlidate(gcp.find("#adduser_from"))){
			return ;
		}
		var inputs = gcp.find("input[name^='U.']");
		var texts = gcp.find("textarea[name^='U.']");
		var select = gcp.find("select[name^='U.']");
		var params = {};
		for (var i = 0; i < inputs.length; i++) {
			var obj = $(inputs[i]);
			params[obj.attr("name").substr(2)] = obj.val();
		}
		for (var i = 0; i < texts.length; i++) {
			var obj = $(texts[i]);
			params[obj.attr("name").substr(2)] = obj.val();
		}
		for(var i = 0; i < select.length; i++){
			var obj = $(select[i]);
			params[obj.attr("name").substr(2)] = obj.val();
		}
		baseAjax("SUser/insertnewuser.asp",params, function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				gcp.find("#queryUser").click();
				alert("添加成功");
				closePageTab("user_manger");
				closePageTab("add_user");
				closeAndOpenInnerPageTab("user_manger","用户管理","pages/suser/suser_queryList.html");
			}else{
				alert(data.msg);
			}
		});
	});
	//授权机构模态框
	gcp.find("#Aorg_no_name").click(function(){
		openSOrgPop("addUserOrg",{name:gcp.find("#Aorg_no_name"),no:gcp.find("#Aorg_no_code")});
		//openSOrgPop("addUserOrg",{name:$("#Aorg_no_name"),no:$("#Aorg_no_code")});
		/*$('#myModal_org').modal('show');
		var userParam = {"name":$("#Aorg_no_name"),"no":$("#Aorg_no_code")};
		orgPop("#pop_orgTable",'SOrg/findAllOrgById.asp',userParam);*/
	});	
}

//下拉框方法
function initSUserType(){
	//初始化数据,用户状态
	initSelect(gcp.find("#Astate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_USERSTATE"});
	//初始化数据,用户岗位
	initSelect(gcp.find("#Auser_post"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_USERPOST"});
	//初始化数据,用户等级
	initSelect(gcp.find("#Auser_level"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_USERLEVEL"});
	//初始化数据,是否行员
	initSelect(gcp.find("#Ais_banker"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"}," ");
}

//验证登录名
function keyUp(){
	 var login_name=document.getElementById("work_no").value;
	 baseAjax("SUser/queryloginname.asp?login_name="+login_name,login_name, function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				gcp.find("#work_no").parent().append("<div class='tag-content' id='tishi'>该登录名已存在</div>");
			}else{
				gcp.find("#work_no").siblings("#tishi").remove();
			}
		});
}

//$("#orgDivPop").load("pages/sorg/sorgPop.html");
initAddUserButtonEvent();
initSUserType();
