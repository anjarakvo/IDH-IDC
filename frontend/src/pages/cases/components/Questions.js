import React, { useEffect, useState } from "react";
import { Button, Col, Form, InputNumber, Row, Space, Switch } from "antd";
import {
  CaretDownFilled,
  CaretDownOutlined,
  CaretRightOutlined,
  CaretUpFilled,
} from "@ant-design/icons";
import { indentSize } from "./";

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

export default Questions;
