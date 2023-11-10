import React, { useState, useMemo } from "react";
import { Row, Col, Alert, Button, Select, Card } from "antd";
import { Scenario } from "./";

const DashboardScenarioModeling = ({
  dashboardData,
  commodityList,
  questionGroups,
}) => {
  const [scenarioData, setScenarioData] = useState([
    { name: "Scenario 1", description: "" },
  ]);
  const [percentage, setPercentage] = useState(true);

  const segmentTabs = useMemo(
    () =>
      dashboardData.map((segment) => ({
        key: segment.id,
        tab: segment.name,
      })),
    [dashboardData]
  );

  const commodityQuestions = useMemo(() => {
    return commodityList.map((c) => ({
      ...c,
      ...questionGroups.find((qg) => qg.commodity_id === c.commodity),
    }));
  }, [commodityList, questionGroups]);

  const renameScenario = (index, newName) => {
    const newScenarioData = [...scenarioData];
    newScenarioData[index].name = newName;
    setScenarioData(newScenarioData);
  };

  const onDelete = (index) => {
    const newScenarioData = [...scenarioData];
    newScenarioData.splice(index, 1);
    setScenarioData(newScenarioData);
  };

  const onChangePercentage = (value) => {
    if (value === "percentage") {
      setPercentage(true);
    } else {
      setPercentage(false);
    }
  };

  return (
    <Row id="scenario-modeling">
      <Col span={24}>
        <Alert
          message="On this page you can define and save up to three scenarioData."
          type="success"
          className="alert-box"
        />
      </Col>
      <Col span={24}>
        <Card className="income-driver-dashboard">
          <Card.Grid
            style={{
              width: "100%",
            }}
            hoverable={false}
          >
            <Row>
              <Col span={12}>How do you want to report on change?</Col>
              <Col span={12}>
                <Select
                  size="small"
                  style={{ width: "100%", marginLeft: "10px" }}
                  options={[
                    { label: "Percentage", value: "percentage" },
                    { label: "Absolute", value: "absolute" },
                  ]}
                  onChange={onChangePercentage}
                />
              </Col>
            </Row>
          </Card.Grid>
        </Card>
      </Col>
      {scenarioData.map((scenarioItem, index) => (
        <Scenario
          key={index}
          index={index}
          scenarioItem={scenarioItem}
          renameScenario={renameScenario}
          onDelete={() => onDelete(index)}
          hideDelete={scenarioData.length === 1 && index === 0}
          dashboardData={dashboardData}
          commodityQuestions={commodityQuestions}
          segmentTabs={segmentTabs}
          percentage={percentage}
        />
      ))}
      <Col span={24}>
        <Button
          onClick={() =>
            setScenarioData([
              ...scenarioData,
              { name: `Scenario ${scenarioData.length + 1}` },
            ])
          }
          type="primary"
          style={{ width: "100%" }}
        >
          Add New Scenario
        </Button>
      </Col>
    </Row>
  );
};

export default DashboardScenarioModeling;
