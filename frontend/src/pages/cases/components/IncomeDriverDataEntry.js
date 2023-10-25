import React, { useState, useEffect } from "react";
import { Row, Col, Space, Card, Tabs, Button, Input, Popover } from "antd";
import {
  PlusCircleFilled,
  DeleteTwoTone,
  InfoCircleFilled,
  CheckCircleTwoTone,
  EditTwoTone,
  CloseCircleTwoTone,
} from "@ant-design/icons";
import { IncomeDriverForm } from "./";
import { api } from "../../../lib";

const DataFields = ({
  segment,
  segmentLabel,
  onDelete,
  questionGroups,
  commodityList,
  renameItem,
}) => {
  const [confimationModal, setConfimationModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(segmentLabel);

  const finishEditing = () => {
    renameItem(segment, newName);
    setEditing(false);
  };
  const cancelEditing = () => {
    setNewName(segmentLabel);
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
      open={confimationModal}
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

  const extra = onDelete ? (
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
    <Row>
      <Col span={16}>
        <Card
          title={
            <h3>
              {editing ? (
                <Input
                  defaultValue={segmentLabel}
                  onChange={(e) => setNewName(e.target.value)}
                />
              ) : (
                segmentLabel
              )}
            </h3>
          }
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
            <IncomeDriverForm
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
  }, [commodityList, setQuestionGroups, currentCaseId]);

  const onDelete = (segmentKey) => {
    const newItems = items.filter((item) => item.key !== segmentKey);
    setItems(newItems);
    const newActiveKey = segmentKey - 1;
    setActiveKey(newActiveKey.toString());
  };

  const renameItem = (activeKey, newLabel) => {
    const newItem = items.map((item, itemIndex) => {
      if (item.key === activeKey.toString()) {
        item.label = newLabel;
        item.children = (
          <DataFields
            segment={activeKey}
            segmentLabel={newLabel}
            questionGroups={questionGroups}
            onDelete={itemIndex ? onDelete(activeKey) : false}
            commodityList={commodityList}
            renameItem={renameItem}
          />
        );
      }
      return item;
    });
    setItems(newItem);
    setActiveKey(activeKey.toString());
  };

  const onChange = (activeKey) => {
    if (activeKey === "add") {
      const newKey = items.length;
      const newItems = [...items];
      newItems.splice(newItems.length - 1, 0, {
        key: newKey.toString(),
        label: `Segment ${newKey}`,
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
        <Tabs
          onChange={onChange}
          activeKey={activeKey}
          items={items.map((item, itemIndex) => ({
            ...item,
            children:
              item.key === "add" ? null : (
                <DataFields
                  segment={item.key}
                  segmentLabel={item.label}
                  onDelete={itemIndex ? () => onDelete(item.key) : false}
                  questionGroups={questionGroups}
                  commodityList={commodityList}
                  renameItem={renameItem}
                />
              ),
          }))}
        />
      </Col>
    </Row>
  );
};

export default IncomeDriverDataEntry;
