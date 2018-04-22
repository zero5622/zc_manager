package com.yusys.projectManage.projectInfo.dao;

import com.yusys.projectManage.projectInfo.entity.ProjectInfo;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public interface ProjectInfoDao {
    //新增项目信息
    public void addProjectInfo(Map<String,String> map);
    //根据项目编号Project_id查询
    public Map<String,String> queryProjectByProjcetId(String project_id);
    //删除
    public void deleteProjectInfoByNum(Map<String, String> map);
    //修改
    public void updateProjectInfo(Map<String,String> map);
    //查询一条整改信息 修改用
    public ProjectInfo findProjectByNum2(String Project_num);
    //查询所有
    public List<Map<String, Object>> queryAllProjectInfo(Map<String, Object> map) throws SQLException;
    //根据Project_num修改整改信息
    public void updateProjectInfoByNum(Map<String, String> map);
    //查询一条整改信息
    public ProjectInfo findProjectByNum(String Project_num);
}
