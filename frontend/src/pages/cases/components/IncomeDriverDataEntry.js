import React, { useState } from "react";
import { Row, Col, Card, Tabs, Button } from "antd";
import { PlusCircleFilled, DeleteOutlined } from "@ant-design/icons";

const DataFields = ({ segment, onDelete }) => {
  const extra = onDelete ? (
    <Button size="small" icon={<DeleteOutlined />} onClick={onDelete} />
  ) : null;
  return (
    <Row>
      <Col span={12}>
        <Card title="Segment Inputs" extra={extra}>
          Segment {segment}
        </Card>
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
      children: <DataFields segment={1} />,
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

  console.log(items);

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
          <DataFields segment={newKey} onDelete={() => onDelete(newKey)} />
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
