import React, { useState } from "react";
import { Row, Col, Card, Tabs } from "antd";
import { PlusCircleFilled } from "@ant-design/icons";

const DataFields = () => {
  return (
    <Row>
      <Col span={12}>
        <Card title="Segment Inputs">Test</Card>
      </Col>
      <Col span={12}></Col>
    </Row>
  );
};

const IncomeDriverDataEntry = () => {
  const [activeKey, setActiveKey] = useState("1");
  const [items, setItems] = useState([
    {
      key: "1",
      label: "Segment 1",
      children: <DataFields />,
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
  const onChange = (activeKey) => {
    if (activeKey === "add") {
      const newKey = items.length;
      const newItems = [...items];
      newItems.splice(newItems.length - 1, 0, {
        key: newKey.toString(),
        label: `Segment ${newKey}`,
        children: <DataFields />,
      });
      setItems(newItems);
      setActiveKey(newKey.toString());
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
