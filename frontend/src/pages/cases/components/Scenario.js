import React, { useState } from "react";
import {
  Card,
  Col,
  Row,
  Input,
  InputNumber,
  Divider,
  Button,
  Space,
  Form,
  Popover,
} from "antd";
import {
  EditTwoTone,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  DeleteTwoTone,
} from "@ant-design/icons";

const Question = ({
  id,
  parent,
  question_type,
  text,
  commodity,
  childrens,
}) => {
  const { commodity_name, id: commodity_id, commodity_type } = commodity;
  return (
    <>
      <Row
        gutter={[8, 8]}
        align="middle"
        display={
          question_type === "aggregator" && commodity_type === "focus"
            ? "none"
            : ""
        }
      >
        <Col span={12}>
          {!parent && question_type === "aggregator"
            ? `Total Income from ${commodity_name}`
            : text}
        </Col>
        <Col span={6}>
          <Form.Item
            name={`${commodity_id}-${id}`}
            className="scenario-field-item"
          >
            <InputNumber
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
        </Col>
        <Col span={6}>xx %</Col>
      </Row>
      {!parent && commodity_type === "focus"
        ? childrens.map((child) => (
            <Question
              key={`${commodity_id}-${child.id}`}
              commodity={commodity}
              {...child}
            />
          ))
        : null}
    </>
  );
};

const ScenarioInput = ({ commodityQuestions }) => {
  const [form] = Form.useForm();

  const onValuesChange = (changedValues, allValues) => {
    console.info(changedValues, allValues);
  };

  return (
    <Form form={form} onValuesChange={onValuesChange} layout="vertical">
      {commodityQuestions.map((c) => (
        <div key={c.commodity_id}>
          <Divider />
          {c.questions.map((question, index) => (
            <Question
              key={`${c.commodity_id}-${c.id}`}
              commodity={c}
              index={index}
              {...question}
            />
          ))}
        </div>
      ))}
    </Form>
  );
};

const Scenario = ({
  index,
  scenarioItem,
  renameScenario,
  onDelete,
  hideDelete,
  dashboardData,
  commodityQuestions,
  segmentTabs,
}) => {
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(dashboardData[0].id);
  const [newName, setNewName] = useState(scenarioItem.name);
  const [confirmationModal, setConfimationModal] = useState(false);

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
                  commodityQuestions={commodityQuestions}
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

export default Scenario;
