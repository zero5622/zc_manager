package com.yusys.projectManage.projectInfo.web;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.projectManage.projectInfo.service.IProjectInfoService;
import org.springframework.http.HttpRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("ProjectInfo")
public class ProjectInfoController {

    @Resource
    IProjectInfoService iProjectInfoService;


    //乱码转换方法
    public void writeUTFJson(HttpServletResponse res,String json){
        ResponseUtils.jsonMessage(res, json);
    }

    @RequestMapping("modifyProjectInfo")
    public void modifyProjectInfo(HttpServletRequest req, HttpServletResponse res){
        writeUTFJson(res, JsonUtils.beanToJson(iProjectInfoService.modifyProjectInfo(req)));
    }

//    //根据整改编号删除整改信息
//    @RequestMapping("deleteProjectInfoByNo")
//    public void deleteProjectInfoByNum(HttpServletRequest req,HttpServletResponse res)	{
//        writeUTFJson(res,JsonUtils.beanToJson(iProjectInfoService.deleteProjectInfoByNo(req)));
//    }
//
//    //修改
//    @RequestMapping("updateProject")
//    public void updateProject(HttpServletRequest req,HttpServletResponse res){
//        try{
//            writeUTFJson(res,JsonUtils.beanToJson(iProjectInfoService.updateProject(req)));
//        }catch(Exception e){
//            e.printStackTrace();
//        }
//    }
    //查询一条 修改用
    @RequestMapping("findProjectById")
    public void findProjectById(String id,HttpServletResponse resp){
        ResponseUtils.jsonMessage(resp,JsonUtils.beanToJson(iProjectInfoService.findProjectById(id)));
    }
    //查询所有整改信息
    @RequestMapping("queryAllProjectInfo")
    public void queryAllProjectInfo(HttpServletRequest req,HttpServletResponse res){
        try {
            String str = JsonUtils.beanToJsonp(req,iProjectInfoService.queryAllProjectInfo(req));
            writeUTFJson(res,str);
        } catch (Exception e) {
            e.printStackTrace();
        }
//        ResponseUtils.jsonMessage(res,str);
    }
//    //查询一条
//    @RequestMapping("findProjectByNum")
//    public void findProjectByNum(HttpServletRequest req,HttpServletResponse resp){
//        ResponseUtils.jsonMessage(resp,JsonUtils.beanToJson(iProjectInfoService.findProjectByNum(req)));
//    }
//    //导入
//    @RequestMapping("importProjectInfo")
//    public void importAssTempl(HttpServletRequest req,HttpServletResponse res,MultipartFile file){
//        Map<String, String> amap=new HashMap<String, String>();
//        try {
//            ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(iProjectInfoService.importProjectTempl(getUserId(req),file,new int[]{22})));
//        } catch (RuntimeException e) {
//            amap.put("result","false");
//            amap.put("error_info",e.getMessage());
//        }
//        ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(amap));
//    }
//    //导出
//    @RequestMapping("exportProjectInfo")
//    public void exportInfoById(ModelMap modelMap, HttpServletRequest req, HttpServletResponse res){
//        iProjectExportService.exportProjectInfo(modelMap,req,getUserId(req),res);
//    }
//    @RequestMapping("exportProjectInfo2")
//    public void exportInfoById2(ModelMap modelMap,HttpServletRequest req,HttpServletResponse res){
//        iProjectExportByEasyPOIService.exportProjectInfo(modelMap,req,getUserId(req),res);
//    }
}
