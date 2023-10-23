import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Space,
  Card,
  Tabs,
  Button,
  InputNumber,
  Form,
  Switch,
} from "antd";
import {
  PlusCircleFilled,
  DeleteTwoTone,
  InfoCircleFilled,
  CaretRightOutlined,
  CaretDownOutlined,
  CaretUpFilled,
  CaretDownFilled,
} from "@ant-design/icons";
import { api } from "../../../lib";

const indentSize = 37.5;

const Questions = ({
  id,
  question_type,
  text,
  unit,
  units,
  form,
  refresh,
  childrens,
  indent = 0,
}) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [feasibleValue, setFeasibleValue] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [collapsed, setCollapsed] = useState(question_type !== "aggregator");
  const [disabled, setDisabled] = useState(childrens.length > 0);

  const unitName = unit
    .split("/")
    .map((u) => u.trim())
    .map((u) => units?.[u])
    .join(" / ");

  useEffect(() => {
    if (currentValue && feasibleValue) {
      const percent = (feasibleValue / currentValue - 1) * 100;
      setPercentage(percent);
    }
  }, [currentValue, feasibleValue, setPercentage]);

  useEffect(() => {
    const current = form.getFieldValue(`current-${id}`);
    const feasible = form.getFieldValue(`feasible-${id}`);
    if (current && feasible) {
      setCurrentValue(current);
      setFeasibleValue(feasible);
    }
  }, [form, refresh]);

  return (
    <>
      <Row
        gutter={[16, 16]}
        style={{ borderBottom: "1px solid #f0f0f0" }}
        align="middle"
      >
        <Col
          span={12}
          style={{
            paddingLeft: indent,
          }}
        >
          <Space size="small">
            {childrens.length > 0 && question_type !== "aggregator" && (
              <Button
                type="link"
                onClick={() => setCollapsed(!collapsed)}
                icon={
                  collapsed ? (
                    <CaretRightOutlined color="black" />
                  ) : (
                    <CaretDownOutlined color="black" />
                  )
                }
              />
            )}
            <h4>
              {text} <small>({unitName})</small>
            </h4>
          </Space>
        </Col>
        <Col span={2}>
          {childrens.length > 0 ? (
            <Switch size="small" onChange={() => setDisabled(!disabled)} />
          ) : null}
        </Col>
        <Col span={4}>
          <Form.Item name={`current-${id}`} className="current-feasible-field">
            <InputNumber
              style={{ width: "100%" }}
              disabled={disabled}
              onChange={setCurrentValue}
            />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item name={`feasible-${id}`} className="current-feasible-field">
            <InputNumber
              style={{ width: "100%" }}
              disabled={disabled}
              onChange={setFeasibleValue}
            />
          </Form.Item>
        </Col>
        <Col span={2}>
          <Space>
            {percentage === 0 ? null : percentage > 0 ? (
              <CaretUpFilled className="ceret-up" />
            ) : (
              <CaretDownFilled className="ceret-down" />
            )}
            <div
              className={
                percentage === 0
                  ? ""
                  : percentage > 0
                  ? "ceret-up"
                  : "ceret-down"
              }
            >
              {feasibleValue < currentValue
                ? -percentage.toFixed(0)
                : percentage.toFixed(0)}
              %
            </div>
          </Space>
        </Col>
      </Row>
      {!collapsed
        ? childrens.map((child) => (
            <Questions
              key={child.id}
              units={units}
              form={form}
              refresh={refresh}
              {...child}
              indent={indent + indentSize}
            />
          ))
        : null}
    </>
  );
};

const IncomeDriversForm = ({ group, groupIndex, commodity }) => {
  const [form] = Form.useForm();
  const [refresh, setRefresh] = useState(false);

  const flattenQuestionList = group.questions.reduce((acc, question) => {
    acc.push(question);
    if (question.childrens.length > 0) {
      acc = [...acc, ...question.childrens];
      acc = acc.reduce((acc, q) => {
        if (q.childrens.length > 0) {
          acc = [...acc, ...q.childrens];
        }
        return acc;
      }, []);
    }
    return acc;
  }, []);

  const onValuesChange = (value, currentValues) => {
    const id = Object.keys(value)[0];
    const dataType = id.split("-")[0];
    const questionId = id.split("-")[1];
    const question = flattenQuestionList.find(
      (q) => q.id === parseInt(questionId)
    );
    const parentQuestion = flattenQuestionList.find(
      (q) => q.id === question.parent
    );
    const allChildrens = flattenQuestionList.filter(
      (q) => q.parent === question.parent
    );
    const allChildrensIds = allChildrens.map((q) => `${dataType}-${q.id}`);
    const allChildrensValues = allChildrensIds.reduce((acc, id) => {
      const value = currentValues?.[id];
      if (value) {
        acc = acc + value;
      }
      return acc;
    }, 0);
    const parentQuestionId = `${dataType}-${question.parent}`;
    if (parentQuestion) {
      form.setFieldsValue({
        [parentQuestionId]: allChildrensValues,
      });
    }
    setRefresh(!refresh);
  };

  return (
    <Card.Grid
      style={{
        width: "100%",
        backgroundColor: groupIndex ? "#ececec" : "",
      }}
      hoverable={false}
    >
      {groupIndex === 1 && <h3>Diversified Income</h3>}
      <h3
        style={{
          paddingLeft: !groupIndex ? 24 : 48,
          backgroundColor: groupIndex ? "#f0f0f0" : "",
        }}
      >
        {groupIndex === 0 ? "Focus Commodity:" : ""} {group.commodity_name}
      </h3>
      {!groupIndex && (
        <Row
          gutter={[16, 16]}
          style={{ borderBottom: "1px solid #f0f0f0" }}
          align="middle"
        >
          <Col span={14}></Col>
          <Col span={5}>
            <h4>Current</h4>
          </Col>
          <Col span={5}>
            <h4>Feasible</h4>
          </Col>
        </Row>
      )}
      <Form
        name={`drivers-income-${groupIndex}`}
        layout="vertical"
        form={form}
        onValuesChange={onValuesChange}
      >
        {group.questions.map((question) => (
          <Questions
            key={question.id}
            indent={!groupIndex ? 0 : indentSize}
            units={commodity}
            form={form}
            refresh={refresh}
            {...question}
          />
        ))}
      </Form>
    </Card.Grid>
  );
};

const DataFields = ({ segment, onDelete, questionGroups, commodityList }) => {
  const extra = onDelete ? (
    <Button
      size="small"
      shape="circle"
      type="secondary"
      icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
      onClick={onDelete}
    />
  ) : null;
  return (
    <Row>
      <Col span={16}>
        <Card
          title={`Segment-${segment}`}
          extra={extra}
          className="segment-group"
        >
          <h3>
            Income Drivers
            <small>
              <InfoCircleFilled />
            </small>
          </h3>
          {questionGroups.map((group, groupIndex) => (
            <IncomeDriversForm
              group={group}
              groupIndex={groupIndex}
              commodity={commodityList[groupIndex]}
              key={groupIndex}
            />
          ))}
        </Card>
      </Col>
      <Col span={8}></Col>
    </Row>
  );
};

const IncomeDriverDataEntry = ({ commodityList, currentCaseId }) => {
  const [activeKey, setActiveKey] = useState("1");
  const [questionGroups, setQuestionGroups] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (commodityList.length === 0 && !currentCaseId) {
      return;
    }
    api.get(`/questions/${currentCaseId}`).then((res) => {
      setQuestionGroups(res.data);
      setItems([
        {
          key: "1",
          label: "Segment 1",
          children: (
            <DataFields
              segment={1}
              questionGroups={res.data}
              commodityList={commodityList}
            />
          ),
        },
        {
          key: "add",
          label: (
            <span>
              <PlusCircleFilled /> Add Segment
            </span>
          ),
        },
      ]);
    });
  }, [commodityList, setItems, setQuestionGroups, currentCaseId]);

  const onDelete = (segmentKey) => {
    const newItems = items.filter((item) => item.key !== segmentKey);
    setItems(newItems);
    const newActiveKey = segmentKey - 1;
    setActiveKey(newActiveKey.toString());
  };

  const onChange = (activeKey) => {
    if (activeKey === "add") {
      const newKey = items.length;
      const newItems = [...items];
      newItems.splice(newItems.length - 1, 0, {
        key: newKey.toString(),
        label: `Segment ${newKey}`,
        children: (
          <DataFields
            segment={newKey}
            onDelete={() => onDelete(newKey)}
            questionGroups={questionGroups}
            commodityList={commodityList}
          />
        ),
      });
      setItems(newItems);
      setActiveKey(newKey.toString());
      // remove add tab after 5 segments
      if (newKey === 5) {
        newItems.splice(newItems.length - 1, 1);
        setItems(newItems);
      }
    } else {
      setActiveKey(activeKey);
    }
  };
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Tabs activeKey={activeKey} items={items} onChange={onChange} />
      </Col>
    </Row>
  );
};

export default IncomeDriverDataEntry;
