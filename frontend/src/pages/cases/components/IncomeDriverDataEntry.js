import React, { useState, useEffect } from "react";
import { Row, Col, Card, Tabs, Button, InputNumber, Form } from "antd";
import {
  PlusCircleFilled,
  DeleteTwoTone,
  InfoCircleFilled,
} from "@ant-design/icons";
import { api } from "../../../lib";

const Questions = ({ id, text, childrens, indent = 0 }) => {
  return (
    <>
      <Row
        gutter={[16, 16]}
        style={{ borderBottom: "1px solid #f0f0f0" }}
        align="middle"
      >
        <Col span={12}>
          <h4
            style={{
              paddingLeft: indent,
              paddingRight: indent,
            }}
          >
            {text}
          </h4>
        </Col>
        <Col span={6}>
          <Form.Item
            name={`current-${id}`}
            rules={[{ required: true }]}
            className="current-feasible-field"
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name={`feasible-${id}`} className="current-feasible-field">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>
      {childrens.map((child) => (
        <Questions key={child.id} {...child} indent={indent + 20} />
      ))}
    </>
  );
};

const IncomeDriversForm = ({ group, groupIndex }) => {
  const [form] = Form.useForm();
  return (
    <Card.Grid style={{ width: "100%" }} hoverable={false}>
      <h3>
        {groupIndex === 0 ? "Focus Commodity:" : ""} {group.commodity_name}
      </h3>
      {!groupIndex && (
        <Row
          gutter={[16, 16]}
          style={{ borderBottom: "1px solid #f0f0f0" }}
          align="middle"
        >
          <Col span={12}></Col>
          <Col span={6}>
            <h4>Current</h4>
          </Col>
          <Col span={6}>
            <h4>Feasible</h4>
          </Col>
        </Row>
      )}
      <Form name={`drivers-income-${groupIndex}`} layout="vertical" form={form}>
        {group.questions.map((question) => (
          <Questions key={question.id} {...question} />
        ))}
      </Form>
    </Card.Grid>
  );
};

const DataFields = ({ segment, onDelete, questionGroups }) => {
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
              key={groupIndex}
            />
          ))}
        </Card>
      </Col>
      <Col span={8}></Col>
    </Row>
  );
};

const IncomeDriverDataEntry = ({ commodityList }) => {
  const [activeKey, setActiveKey] = useState("1");
  const [questionGroups, setQuestionGroups] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (commodityList.length === 0) {
      return;
    }
    api.post("/questions", commodityList).then((res) => {
      setQuestionGroups(res.data);
      setItems([
        {
          key: "1",
          label: "Segment 1",
          children: <DataFields segment={1} questionGroups={res.data} />,
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
  }, [commodityList, setItems, setQuestionGroups]);

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
