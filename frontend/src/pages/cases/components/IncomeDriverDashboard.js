import React, { useState } from "react";
import { Row, Col, Tabs } from "antd";
import {
  DashboardIncomeOverview,
  DashboardSensitivityAnalysis,
  DashboardScenarioModeling,
} from "./";

const IncomeDriverDashboard = ({
  commodityList,
  currentCaseId,
  dashboardData,
}) => {
  const [activeKey, setActiveKey] = useState("income-overview");

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
                />
              ),
            },
          ]}
        />
      </Col>
    </Row>
  );
};

export default IncomeDriverDashboard;
