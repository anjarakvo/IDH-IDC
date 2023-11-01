import React, { useState } from "react";
import { Row, Col, Tabs } from "antd";
import {
  DashboardIncomeOverview,
  DashboardSensitivityAnalysis,
  DashboardScenarioModeling,
} from "./";

const IncomeDriverDashboard = () => {
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
              children: <DashboardIncomeOverview />,
            },
            {
              key: "sensitivity-analysis",
              label: "Sensitivity Analysis",
              children: <DashboardSensitivityAnalysis />,
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
