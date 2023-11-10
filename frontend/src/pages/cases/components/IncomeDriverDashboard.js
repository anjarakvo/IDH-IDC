import React, { useEffect, useState } from "react";
import { Row, Col, Tabs } from "antd";
import {
  DashboardIncomeOverview,
  DashboardSensitivityAnalysis,
  DashboardScenarioModeling,
} from "./";
import { api } from "../../../lib";

const IncomeDriverDashboard = ({
  commodityList,
  currentCaseId,
  dashboardData,
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
              children: <DashboardScenarioModeling />,
            },
          ]}
        />
      </Col>
    </Row>
  );
};

export default IncomeDriverDashboard;
