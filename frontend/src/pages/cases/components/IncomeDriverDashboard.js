import React, { useEffect, useState } from "react";
import { Row, Col, Tabs, Button, Space } from "antd";
import {
  DashboardIncomeOverview,
  DashboardSensitivityAnalysis,
  DashboardScenarioModeling,
} from "./";
import { api } from "../../../lib";
import { StepBackwardOutlined } from "@ant-design/icons";

const IncomeDriverDashboard = ({
  commodityList,
  currentCaseId,
  dashboardData,
  questionGroups,
  setPage,
}) => {
  const [activeKey, setActiveKey] = useState("income-overview");
  const [visualizationData, setVisualizationData] = useState([]);

  useEffect(() => {
    if (currentCaseId) {
      api.get(`visualization/case/${currentCaseId}`).then((res) => {
        setVisualizationData(res.data);
      });
    }
  }, [currentCaseId]);

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Tabs
          onChange={setActiveKey}
          activeKey={activeKey}
          items={[
            {
              key: "income-overview",
              label: "Income Overview",
              children: (
                <DashboardIncomeOverview
                  currentCaseId={currentCaseId}
                  commodityList={commodityList}
                  dashboardData={dashboardData}
                />
              ),
            },
            {
              key: "sensitivity-analysis",
              label: "Sensitivity Analysis",
              children: (
                <DashboardSensitivityAnalysis
                  currentCaseId={currentCaseId}
                  commodityList={commodityList}
                  dashboardData={dashboardData}
                  visualizationData={visualizationData}
                />
              ),
            },
            {
              key: "scenario-modeling",
              label: "Scenario Modeling",
              children: (
                <DashboardScenarioModeling
                  currentCaseId={currentCaseId}
                  commodityList={commodityList}
                  dashboardData={dashboardData}
                  questionGroups={questionGroups}
                />
              ),
            },
          ]}
        />
      </Col>
      {/* Button */}
      <Col span={24}>
        <Row>
          <Col span={12}>
            <Button
              className="button button-submit button-secondary"
              onClick={() => setPage("Income Driver Data Entry")}
            >
              <StepBackwardOutlined />
              Previous
            </Button>
          </Col>
          {activeKey !== "income-overview" ? (
            <Col
              span={12}
              style={{
                justifyContent: "flex-end",
                display: "grid",
              }}
            >
              <Space size={[8, 16]} wrap>
                <Button
                  htmlType="submit"
                  className="button button-submit button-secondary"
                  // loading={isSaving}
                  // onClick={handleSave}
                >
                  Save
                </Button>
              </Space>
            </Col>
          ) : null}
        </Row>
      </Col>
    </Row>
  );
};

export default IncomeDriverDashboard;
