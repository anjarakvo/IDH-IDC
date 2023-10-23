import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Space,
  Card,
  Tabs,
  Button,
  Input,
  InputNumber,
  Form,
  Switch,
  Popover,
} from "antd";
import {
  PlusCircleFilled,
  DeleteTwoTone,
  InfoCircleFilled,
  CaretRightOutlined,
  CaretDownOutlined,
  CaretUpFilled,
  CaretDownFilled,
  CheckCircleTwoTone,
  EditTwoTone,
  CloseCircleTwoTone,
} from "@ant-design/icons";
import { flatten } from "./";
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
  }, [form, refresh, id]);

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
            paddingLeft: indent
              ? childrens.length > 0 && question_type !== "aggregator"
                ? indent - 40
                : indent
              : 10,
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
            <InputNumber style={{ width: "100%" }} disabled={disabled} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item name={`feasible-${id}`} className="current-feasible-field">
            <InputNumber style={{ width: "100%" }} disabled={disabled} />
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

  const flattenQuestionList = flatten(group.questions);

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
    if (parentQuestion.parent) {
      onValuesChange({ [parentQuestionId]: allChildrensValues }, currentValues);
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
          paddingLeft: !groupIndex ? 24 : 54,
          backgroundColor: groupIndex ? "#dddddd" : "",
        }}
      >
        {groupIndex === 0
          ? "Focus Commodity:"
          : group.commodity_id === null
          ? "Other "
          : ""}{" "}
        {group.commodity_name}
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
