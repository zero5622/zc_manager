package com.yusys.projectManage.projectInfo.entity;

public class ProjectInfo {
    private String projectId;
    private String projectNo;
    private String projectName;
    private String projectType;
    private String projectStartTime;
    private String projectEndTime;
    private String projectPeriod;

    @Override
    public String toString() {
        return "ProjectInfo{" +
                "projectId='" + projectId + '\'' +
                ", projectNo='" + projectNo + '\'' +
                ", projectName='" + projectName + '\'' +
                ", projectType='" + projectType + '\'' +
                ", projectStartTime='" + projectStartTime + '\'' +
                ", projectEndTime='" + projectEndTime + '\'' +
                ", projectPeriod='" + projectPeriod + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ProjectInfo that = (ProjectInfo) o;

        if (!projectId.equals(that.projectId)) return false;
        if (!projectNo.equals(that.projectNo)) return false;
        if (!projectName.equals(that.projectName)) return false;
        if (!projectType.equals(that.projectType)) return false;
        if (!projectStartTime.equals(that.projectStartTime)) return false;
        if (!projectEndTime.equals(that.projectEndTime)) return false;
        return projectPeriod.equals(that.projectPeriod);
    }

    @Override
    public int hashCode() {
        int result = projectId.hashCode();
        result = 31 * result + projectNo.hashCode();
        result = 31 * result + projectName.hashCode();
        result = 31 * result + projectType.hashCode();
        result = 31 * result + projectStartTime.hashCode();
        result = 31 * result + projectEndTime.hashCode();
        result = 31 * result + projectPeriod.hashCode();
        return result;
    }

    public ProjectInfo(String projectId, String projectNo, String projectName, String projectType, String projectStartTime, String projectEndTime, String projectPeriod) {
        this.projectId = projectId;
        this.projectNo = projectNo;
        this.projectName = projectName;
        this.projectType = projectType;
        this.projectStartTime = projectStartTime;
        this.projectEndTime = projectEndTime;
        this.projectPeriod = projectPeriod;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getProjectNo() {
        return projectNo;
    }

    public void setProjectNo(String projectNo) {
        this.projectNo = projectNo;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectType() {
        return projectType;
    }

    public void setProjectType(String projectType) {
        this.projectType = projectType;
    }

    public String getProjectStartTime() {
        return projectStartTime;
    }

    public void setProjectStartTime(String projectStartTime) {
        this.projectStartTime = projectStartTime;
    }

    public String getProjectEndTime() {
        return projectEndTime;
    }

    public void setProjectEndTime(String projectEndTime) {
        this.projectEndTime = projectEndTime;
    }

    public String getProjectPeriod() {
        return projectPeriod;
    }

    public void setProjectPeriod(String projectPeriod) {
        this.projectPeriod = projectPeriod;
    }
}
