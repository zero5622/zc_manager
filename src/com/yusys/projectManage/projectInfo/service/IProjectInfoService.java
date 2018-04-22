package com.yusys.projectManage.projectInfo.service;

import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

public interface IProjectInfoService {
    //新增修改
    public Map<String, String> modifyProjectInfo(HttpServletRequest req);
    //删除
//    public Map<String, String> deleteProjectInfoByNum(HttpServletRequest req);
//    //修改
//    public Map<String, String> updateProject(HttpServletRequest req);
    //查询一条整改信息 修改用
    public Map<String, Object> findProjectById(String id);
    //查询所有项目信息
    public Map<String, Object> queryAllProjectInfo(HttpServletRequest req);
//    //根据Project_num修改整改信息
//    public Map<String, String> updateProjectInfoByNum(HttpServletRequest req);
//    //查询一条整改信息
//    public ProjectInfo findProjectByNum(HttpServletRequest req);
}
