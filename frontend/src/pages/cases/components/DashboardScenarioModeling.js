import React, { useState, useMemo } from "react";
import {
  Row,
  Col,
  Space,
  Alert,
  Button,
  Select,
  Input,
  Card,
  Form,
  Popover,
} from "antd";
import {
  EditTwoTone,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  DeleteTwoTone,
} from "@ant-design/icons";

const ScenarioInput = () => {
  const [form] = Form.useForm();
  return (
    <Form form={form}>
      <Row>
        <Col span={24}>test</Col>
      </Row>
    </Form>
  );
};

const Scenario = ({
  index,
  scenarioItem,
  renameScenario,
  onDelete,
  hideDelete,
  commodityList,
  dashboardData,
}) => {
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(dashboardData[0].id);
  const [newName, setNewName] = useState(scenarioItem.name);
  const [confirmationModal, setConfimationModal] = useState(false);

  const segmentTabs = useMemo(
    () =>
      dashboardData.map((segment) => ({
        key: segment.id,
        tab: segment.name,
      })),
    [dashboardData]
  );

  const finishEditing = () => {
    renameScenario(index, newName);
    setEditing(false);
  };

  const cancelEditing = () => {
    setNewName(scenarioItem.name);
    setEditing(false);
  };

  const ButtonEdit = () => (
    <Button
      size="small"
      shape="circle"
      type="secondary"
      icon={
        editing ? (
          <CheckCircleTwoTone twoToneColor="#52c41a" />
        ) : (
          <EditTwoTone twoToneColor="" />
        )
      }
      onClick={editing ? finishEditing : () => setEditing(true)}
    />
  );

  const ButtonCancelEdit = () => (
    <Button
      size="small"
      shape="circle"
      type="secondary"
      icon={<CloseCircleTwoTone twoToneColor="#eb2f96" />}
      onClick={cancelEditing}
    />
  );

  const ButtonDelete = () => (
    <Popover
      content={
        <Space align="end">
          <Button type="primary" onClick={() => setConfimationModal(false)}>
            Close
          </Button>
          <Button onClick={onDelete} danger>
            Delete
          </Button>
        </Space>
      }
      title="Are you sure want to delete this segment?"
      trigger="click"
      open={confirmationModal}
      onOpenChange={(e) => setConfimationModal(e)}
    >
      <Button
        size="small"
        shape="circle"
        type="secondary"
        icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
      />
    </Popover>
  );

  const extra = !hideDelete ? (
    <Space>
      <ButtonEdit />
      {editing && <ButtonCancelEdit />}
      {!editing && <ButtonDelete />}
    </Space>
  ) : (
    <Space>
      <ButtonEdit />
      {editing && <ButtonCancelEdit />}
    </Space>
  );

  return (
    <Col span={24}>
      <Card
        className="income-driver-dashboard"
        title={
          <h3>
            {editing ? (
              <Input
                defaultValue={scenarioItem.name}
                onChange={(e) => setNewName(e.target.value)}
              />
            ) : (
              scenarioItem.name
            )}
          </h3>
        }
        extra={extra}
        tabList={segmentTabs}
        activeTabKey={activeTab}
        onTabChange={(key) => setActiveTab(key)}
      >
        <Card.Grid
          style={{
            width: "100%",
          }}
          hoverable={false}
        >
          <Row
            className="income-driver-content"
            align="middle"
            justify="space-evenly"
            gutter={[8, 8]}
          >
            {dashboardData.map((segment) => (
              <Col
                key={segment.id}
                span={12}
                style={{
                  display: activeTab === segment.id ? "" : "none",
                  borderRight: "1px solid #f0f0f0",
                }}
              >
                <ScenarioInput
                  segment={segment}
                  commodityList={commodityList}
                />
              </Col>
            ))}
            <Col span={12}>Charts</Col>
          </Row>
        </Card.Grid>
      </Card>
    </Col>
  );
};

const DashboardScenarioModeling = ({ dashboardData, commodityList }) => {
  const [scenarioData, setScenarioData] = useState([
    { name: "Scenario 1", description: "" },
  ]);

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
          commodityList={commodityList}
          dashboardData={dashboardData}
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
