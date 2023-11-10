import React, { useState, useMemo } from "react";
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
  segment,
  percentage,
  unit,
  form,
}) => {
  const { commodity_name, commodity_type, case_commodity, currency } =
    commodity;
  const [absoluteIncrease, setAbsoluteIncrease] = useState(0);
  const [percentageIncrease, setPercentageIncrease] = useState(0);

  const unitName = useMemo(() => {
    return unit
      .split("/")
      .map((u) => u.trim())
      .map((u) => commodity?.[u])
      .join(" / ");
  }, [unit, commodity]);

  const answer = useMemo(() => {
    return segment.answers.find(
      (s) =>
        s.question.id === id &&
        s.caseCommodityId === case_commodity &&
        s.name === "current"
    );
  }, [segment, id, case_commodity]);

  const onChange = (value) => {
    const currentValue = answer?.value || 0;
    if (percentage) {
      const absoluteValue = (currentValue * value) / 100;
      setPercentageIncrease(value.toFixed(2));
      const absoluteIncrease = (absoluteValue + currentValue).toFixed(2);
      setAbsoluteIncrease(absoluteIncrease);
      form.setFieldsValue({
        [`absolute-${case_commodity}-${id}`]: absoluteIncrease,
      });
    } else {
      const percentageValue = (value - currentValue) / currentValue;
      setAbsoluteIncrease(value);
      const percentageIncrease = (percentageValue * 100).toFixed(2);
      setPercentageIncrease(percentageIncrease);
      form.setFieldsValue({
        [`percentage-${case_commodity}-${id}`]: percentageIncrease,
      });
    }
  };

  return (
    <>
      <Row
        gutter={[8, 8]}
        align="middle"
        justify="space-between"
        display={
          question_type === "aggregator" && commodity_type === "focus"
            ? "none"
            : ""
        }
      >
        <Col span={9}>
          {!parent && question_type === "aggregator" ? (
            <h4>
              Total Income from {commodity_name} <small>({currency})</small>
            </h4>
          ) : (
            <h4>
              {text} <small>({unitName})</small>
            </h4>
          )}
        </Col>
        <Col span={5}>
          {["absolute", "percentage"].map((qtype) => (
            <Form.Item
              key={`${qtype}-${case_commodity}-${id}`}
              name={`${qtype}-${case_commodity}-${id}`}
              className="scenario-field-item"
              style={{
                display:
                  qtype !== "percentage" && percentage
                    ? "none"
                    : qtype === "percentage" && !percentage
                    ? "none"
                    : "",
              }}
            >
              <InputNumber
                style={{
                  width: "100%",
                }}
                onChange={onChange}
                addonAfter={qtype === "percentage" ? "%" : ""}
              />
            </Form.Item>
          ))}
        </Col>
        <Col span={5} align="right">
          {answer?.value?.toFixed(1) || ""}
        </Col>
        <Col span={5} align="right">
          {percentage ? absoluteIncrease : `${percentageIncrease}%`}
        </Col>
      </Row>
      {!parent && commodity_type === "focus"
        ? childrens.map((child) => (
            <Question
              key={`scenario-${segment.id}-${case_commodity}-${child.id}`}
              commodity={commodity}
              percentage={percentage}
              segment={segment}
              form={form}
              {...child}
            />
          ))
        : null}
    </>
  );
};

const ScenarioInput = ({ segment, commodityQuestions, percentage }) => {
  const [form] = Form.useForm();

  const onValuesChange = (changedValues, allValues) => {
    console.info(changedValues, allValues);
  };

  return (
    <Form form={form} onValuesChange={onValuesChange} layout="vertical">
      <Row gutter={[8, 8]} align="middle" justify="space-between">
        <Col span={9}>
          <h4>Commodity</h4>
        </Col>
        <Col span={5} align="center">
          <h4>New Value</h4>
        </Col>
        <Col span={5} align="right">
          <h4>Current</h4>
        </Col>
        <Col span={5} align="right">
          <h4>Increase</h4>
        </Col>
      </Row>
      {commodityQuestions.map((c) => (
        <div key={c.commodity_id}>
          <Divider />
          {c.questions.map((question) => (
            <Question
              key={`scenario-${segment.id}-${c.case_commodity}-${question.id}`}
              form={form}
              segment={segment}
              commodity={c}
              percentage={percentage}
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
  percentage,
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
                  percentage={percentage}
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
