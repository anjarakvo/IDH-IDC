import React, { useEffect, useState } from "react";
import { Row, Col, Tabs, Button, Space, message } from "antd";
import {
  DashboardIncomeOverview,
  DashboardSensitivityAnalysis,
  DashboardScenarioModeling,
} from "./";
import { api } from "../../../lib";
import { StepBackwardOutlined } from "@ant-design/icons";
import { isEmpty } from "lodash";

const IncomeDriverDashboard = ({
  commodityList,
  currentCaseId,
  dashboardData,
  questionGroups,
  setPage,
}) => {
  const [activeKey, setActiveKey] = useState("income-overview");
  const [visualizationData, setVisualizationData] = useState([]);
  const [binningData, setBinningData] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentCaseId) {
      api.get(`visualization/case/${currentCaseId}`).then((res) => {
        setVisualizationData(res.data);
      });
    }
  }, [currentCaseId]);

  const disableSaveButton = isEmpty(binningData);

  const handleSaveVisualization = () => {
    if (disableSaveButton) {
      return;
    }
    setSaving(true);
    let payloads = [];
    // Sensituvity analysis
    payloads = [
      {
        case: currentCaseId,
        tab: "sensitivity_analysis",
        config: binningData,
      },
    ];
    api
      .post("visualization", payloads)
      .then(() => {
        messageApi.open({
          type: "success",
          content: "Visualization Dashboard saved successfully.",
        });
      })
      .catch((e) => {
        console.error(e);
        messageApi.open({
          type: "error",
          content: "Failed! Something went wrong.",
        });
      })
      .finally(() => {
        setSaving(false);
      });
  };

  return (
    <Row gutter={[16, 16]}>
      {contextHolder}
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
                  binningData={binningData}
                  setBinningData={setBinningData}
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
                  loading={saving}
                  onClick={handleSaveVisualization}
                  disabled={disableSaveButton}
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
