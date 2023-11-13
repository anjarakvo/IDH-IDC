import React, { useState, useMemo, useEffect } from "react";
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
import { getFunctionDefaultValue } from "./";
import { ChartScenarioModeling } from "../visualizations";

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

  const currentIncrease = useMemo(() => {
    if (percentage) {
      return form.getFieldValue(`absolute-${case_commodity}-${id}`) || "-";
    }
    return form.getFieldValue(`percentage-${case_commodity}-${id}`) || "-";
  }, [form, case_commodity, id, percentage]);

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
                addonAfter={qtype === "percentage" ? "%" : ""}
              />
            </Form.Item>
          ))}
        </Col>
        <Col span={5} align="right">
          {answer?.value?.toFixed(2) || ""}
        </Col>
        <Col span={5} align="right">
          {percentage ? currentIncrease : `${currentIncrease} %`}
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

const ScenarioInput = ({
  segment,
  commodityQuestions,
  percentage,
  setScenarioValues,
  scenarioValue,
}) => {
  const [form] = Form.useForm();

  const scenarioIncrease = useMemo(() => {
    if (scenarioValue?.value) {
      const { value: absoluteValue } = scenarioValue;
      const { total_current_income: totalIncome } = segment;
      return {
        totalPercentage: ((absoluteValue / totalIncome) * 100).toFixed(2),
        totalAbsolute: absoluteValue.toFixed(2),
      };
    }
    return {
      totalPercentage: 0,
      totalAbsolute: 0,
    };
  }, [scenarioValue, segment]);

  const onValuesChange = (changedValues, allValues) => {
    const objectId = Object.keys(changedValues)[0];
    const [, case_commodity, id] = objectId.split("-");
    const segmentAnswer = segment.answers.find(
      (s) =>
        s.questionId === parseInt(id) &&
        s.caseCommodityId === parseInt(case_commodity) &&
        s.name === "current"
    );

    const parentQuestion = segment.answers.find(
      (s) =>
        s.questionId === segmentAnswer.question.parent &&
        s.caseCommodityId === parseInt(case_commodity) &&
        s.name === "current"
    );

    const currentValue = segmentAnswer?.value || 0;
    const value = parseFloat(changedValues[objectId]);
    const newFieldsValue = {};

    let absoluteIncrease = 0;
    if (percentage) {
      const absoluteValue = (currentValue * value) / 100;
      absoluteIncrease = (absoluteValue + currentValue).toFixed(2);
      newFieldsValue[`absolute-${case_commodity}-${id}`] = absoluteIncrease;
    } else {
      absoluteIncrease = value;
      const percentageValue = (value - currentValue) / currentValue;
      const percentageIncrease = (percentageValue * 100).toFixed(2);
      newFieldsValue[`percentage-${case_commodity}-${id}`] = percentageIncrease;
    }

    if (parentQuestion) {
      const allObjectValues = Object.keys(allValues).reduce((acc, key) => {
        const [type, , id] = key.split("-");
        acc.push({
          id: `${type}-${id}`,
          value: allValues[key] || absoluteIncrease,
        });
        return acc;
      }, []);
      const newParentAnswerAbsoluteValue = getFunctionDefaultValue(
        parentQuestion.question,
        "absolute",
        allObjectValues
      );
      newFieldsValue[
        `absolute-${case_commodity}-${parentQuestion.question.id}`
      ] = newParentAnswerAbsoluteValue.toFixed(2);
      const newParentAnswerPercentageValue = parentQuestion?.value
        ? ((newParentAnswerAbsoluteValue - parentQuestion.value) /
            parentQuestion.value) *
          100
        : 0;
      newFieldsValue[
        `percentage-${case_commodity}-${parentQuestion.question.id}`
      ] = newParentAnswerPercentageValue.toFixed(2);
    }

    const allParentQuestions = segment.answers.filter(
      (s) => s.question.parent === null && s.name === "current"
    );
    const allNewValues = { ...allValues, ...newFieldsValue };

    const totalValues = allParentQuestions.reduce((acc, p) => {
      const questionId = `absolute-${p.caseCommodityId}-${p.question.id}`;
      const value = allNewValues[questionId];
      if (value) {
        acc += parseFloat(value);
      }
      return acc;
    }, 0);

    setScenarioValues((prev) => {
      return [
        ...prev.filter((p) => p.segmentId !== segment.id),
        {
          segmentId: segment.id,
          name: segment.name,
          value: totalValues,
        },
      ];
    });
    form.setFieldsValue(allNewValues);
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
      <Row gutter={[8, 8]} align="middle" justify="space-between">
        <Col span={9}>
          <h4>Total Income</h4>
        </Col>
        <Col span={5} align="center">
          <h4>
            {percentage
              ? `${scenarioIncrease.totalPercentage}%`
              : scenarioIncrease?.totalAbsolute}
          </h4>
        </Col>
        <Col span={5} align="right">
          <h4>{segment.total_current_income}</h4>
        </Col>
        <Col span={5} align="right">
          <h4>
            {percentage
              ? scenarioIncrease?.totalAbsolute
              : `${scenarioIncrease.totalPercentage}%`}
          </h4>
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
  const [scenarioValues, setScenarioValues] = useState([]);

  const finishEditing = () => {
    renameScenario(index, newName);
    setEditing(false);
  };

  const cancelEditing = () => {
    setNewName(scenarioItem.name);
    setEditing(false);
  };

  useEffect(() => {
    if (dashboardData.length > 0) {
      const scenarioInitialData = dashboardData.map((segment) => ({
        segmentId: segment.id,
        name: segment.name,
      }));
      setScenarioValues(scenarioInitialData);
    }
  }, [dashboardData]);

  const chartData = useMemo(() => {
    const data = dashboardData.map((segment) => ({
      name: segment.name,
      title: segment.name,
      stack: [
        {
          name: "Current Income",
          title: "Current Income",
          order: 1,
          total: segment.total_current_income,
          value: segment.total_current_income,
          color: "#3b78d8",
        },
        {
          name: "Scenario Income",
          title: "Scenario Income",
          order: 2,
          total:
            scenarioValues.find((s) => s.segmentId === segment.id)?.value ||
            0 - segment.total_current_income,
          value:
            scenarioValues.find((s) => s.segmentId === segment.id)?.value ||
            0 - segment.total_current_income,
          color: "#c9daf8",
        },
      ],
    }));
    return data;
  }, [dashboardData, scenarioValues]);

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
                  setScenarioValues={setScenarioValues}
                  scenarioValue={scenarioValues.find(
                    (s) => s.segmentId === segment.id
                  )}
                />
              </Col>
            ))}
            <Col span={12}>
              <ChartScenarioModeling data={chartData || []} />
            </Col>
          </Row>
        </Card.Grid>
      </Card>
    </Col>
  );
};

export default Scenario;
