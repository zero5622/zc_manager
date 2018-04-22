package com.yusys.projectManage.projectInfo.service;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.RequestUtils;
import com.yusys.projectManage.projectInfo.dao.ProjectInfoDao;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
@Service("projectInfoService")
@Transactional
public class ProjectInfoService implements IProjectInfoService{

    @Resource
    private ProjectInfoDao projectInfoDao;

    @Override
    public Map<String, String> modifyProjectInfo(HttpServletRequest req) {
        Map<String, String> resultMap=new HashMap<String, String>();
        String project_id = RequestUtils.getParamValue(req, "project_id");
        if(null==project_id||"".equals(project_id)){
            project_id = UUID.randomUUID().toString().replace("-", "");
        }

        String project_no = RequestUtils.getParamValue(req, "project_no");
        //必填参数列表
        String[] must=new String[]{"project_name","project_type","project_no"};
        //非必填的参数列表
        String[] nomust = new String[] { "project_start_time","project_end_time","project_period" };

        Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
        pmap.put("project_id", project_id);
        try {
            pmap.put("state","00");
            pmap.put("opt_person", "0");
            pmap.put("opt_time", DateTimeUtils.getFormatCurrentDate()+"");
            if(null!=projectInfoDao.queryProjectByProjcetId(project_id)){
               projectInfoDao.updateProjectInfo(pmap);
            }else{
               projectInfoDao.addProjectInfo(pmap);
            }
        } catch(Exception e) {
            e.printStackTrace();
            resultMap.put("result", "false");
            return resultMap;
        }
        resultMap.put("result", "true");
        return resultMap;
    }

    @Override
    public Map<String, Object> findProjectById(String id) {
        Map<String, Object> pmap=new HashMap<String, Object>();
        //
        if(id!=null && !"".equals(id)){
            pmap.put("id","%"+id+"%");
        }
        List<Map<String, Object>> m = null;
        try {
            m = projectInfoDao.queryAllProjectInfo(pmap);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return m.get(0);
    }

    @Override
    public Map<String, Object> queryAllProjectInfo(HttpServletRequest req) {
        Map<String, Object> retmap=new HashMap<String, Object>();
        Map<String, Object> pmap=new HashMap<String, Object>();
        String id = RequestUtils.getParamValue(req, "id");
        String project_no = RequestUtils.getParamValue(req, "project_no");
        String project_name = RequestUtils.getParamValue(req, "project_name");
        String project_type = RequestUtils.getParamValue(req, "project_type");
        String project_start_time = RequestUtils.getParamValue(req, "project_start_time");
        String project_end_time = RequestUtils.getParamValue(req, "project_end_time");
        //转码
        if(!"".equals(project_no)&&project_no!=null){
            try {
                project_no = URLDecoder.decode(project_no,"UTF-8");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }
        if(!"".equals(project_name)&&project_name!=null){
            try {
                project_name = URLDecoder.decode(project_name,"UTF-8");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }
        if(!"".equals(project_type)&&project_type!=null){
            try {
                project_type = URLDecoder.decode(project_type,"UTF-8");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }
        if(!"".equals(project_start_time)&&project_start_time!=null){
            try {
                project_start_time = URLDecoder.decode(project_start_time,"UTF-8");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }
        //
        if(id!=null && !"".equals(id)){
            pmap.put("id","%"+id+"%");
        }
        if(project_no!=null && !"".equals(project_no)){
            pmap.put("project_no","%"+project_no+"%");
        }
        if(project_name!=null && !"".equals(project_name)){
            pmap.put("project_name","%"+project_name+"%");
        }
        if(project_type!=null && !"".equals(project_type)){
            pmap.put("project_type","%"+project_type+"%");
        }
        if(project_start_time!=null && !"".equals(project_start_time)){
            pmap.put("project_start_time","%"+project_start_time+"%");
        }
        if(project_end_time!=null && !"".equals(project_end_time)){
            pmap.put("project_end_time","%"+project_end_time+"%");
        }
        String limit = RequestUtils.getParamValue(req, "limit");
        String offset = RequestUtils.getParamValue(req, "offset");
        pmap.put("limit",limit);
        pmap.put("offset",offset);
        List<Map<String, Object>> m = null;
        try {
            m = projectInfoDao.queryAllProjectInfo(pmap);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        retmap.put("rows", m);
        retmap.put("total", pmap.get("total"));
        return retmap;
    }
}
