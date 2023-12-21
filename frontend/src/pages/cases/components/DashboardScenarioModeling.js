import React, { useMemo, useState } from "react";
import { Row, Col, Alert, Select, Tabs } from "antd";
import { Scenario } from "./";
import { orderBy } from "lodash";
import { PlusCircleFilled } from "@ant-design/icons";

const addScenarioButton = {
  key: "add",
  name: (
    <span>
      <PlusCircleFilled /> Add Scenario
    </span>
  ),
  description: null,
  scenarioValues: [],
};

const DashboardScenarioModeling = ({
  dashboardData,
  commodityList,
  questionGroups,
  percentage,
  setPercentage,
  scenarioData,
  setScenarioData,
  enableEditCase,
}) => {
  const [activeKey, setActiveKey] = useState(1);

  const segmentTabs = useMemo(
    () =>
      dashboardData.map((segment) => ({
        key: segment.id,
        tab: segment.name,
      })),
    [dashboardData]
  );

  const scenarioDataWithAddButton = useMemo(() => {
    if (enableEditCase) {
      return [...orderBy(scenarioData, "key"), addScenarioButton];
    }
    return orderBy(scenarioData, "key");
  }, [enableEditCase, scenarioData]);

  const commodityQuestions = useMemo(() => {
    return commodityList.map((c) => ({
      ...c,
      ...questionGroups.find((qg) => qg.commodity_id === c.commodity),
    }));
  }, [commodityList, questionGroups]);

  const renameScenario = (index, newName, newDescription) => {
    const newScenarioData = [...scenarioData];
    newScenarioData[index].name = newName;
    newScenarioData[index].description = newDescription;
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

  const onChangeTab = (key) => {
    if (key === "add") {
      setScenarioData((prev) => {
        return [
          ...prev,
          {
            key: prev.length + 1,
            name: `Scenario ${prev.length + 1}`,
            description: null,
            scenarioValues: [],
          },
        ];
      });
      setActiveKey(scenarioDataWithAddButton.length);
    } else {
      setActiveKey(key);
    }
  };

  return (
    <Row id="scenario-modeling">
      <Col span={24}>
        <Alert
          message={
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
                  value={percentage ? "percentage" : "absolute"}
                />
              </Col>
            </Row>
          }
          type="success"
          className="alert-box"
        />
      </Col>

      <Col span={24}>
        <Tabs
          onChange={onChangeTab}
          activeKey={activeKey}
          items={scenarioDataWithAddButton.map((scenarioItem, index) => ({
            ...scenarioItem,
            label: scenarioItem.name,
            children:
              scenarioItem.key === "add" ? null : (
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
                  setScenarioData={setScenarioData}
                  currentScenarioValues={
                    scenarioData.find((d) => d.key === scenarioItem.key)
                      ?.scenarioValues || {}
                  }
                  enableEditCase={enableEditCase}
                />
              ),
          }))}
        />
      </Col>
    </Row>
  );
};

export default DashboardScenarioModeling;
