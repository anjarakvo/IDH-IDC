import React, { useState } from "react";
import { Row, Col, Form, InputNumber, Select, Switch } from "antd";
import { selectProps } from "./";

const region = [
  {
    value: 1,
    label: "North",
  },
  {
    value: 2,
    label: "South",
  },
];

const cpi = [
  {
    id: 1,
    country: 1,
    region: 1,
    year: 2002,
    value: {
      usd: 2000,
      eur: 2000,
    },
    cpi: 3000,
  },
  {
    id: 2,
    country: 1,
    region: 2,
    year: 2002,
    value: {
      usd: 3000,
      eur: 3000,
    },
    cpi: 4000,
  },
];

const formStyle = { width: "100%" };

const IncomeDriverTarget = () => {
  const [form] = Form.useForm();
  const [householdSize, setHouseholdSize] = useState(0);
  const [incomeTarget, setIncomeTarget] = useState(0);
  const [disableTarget, setDisableTarget] = useState(true);

  const onValuesChange = (changedValues, allValues) => {
    const {
      household_adult = 0,
      household_children = 0,
      target,
      region,
    } = allValues;
    if (household_adult || household_children) {
      // OECD average household size
      // first adult = 1, next adult 0.5
      // 1 child = 0.3
      const adult_size =
        household_adult === 1 ? 1 : 1 + (household_adult - 1) * 0.5;
      const children_size = household_children * 0.3;
      const size = adult_size + children_size;
      setHouseholdSize(size);
    }
    const cpiValue = cpi.find((item) => item.region === region);
    // eslint-disable-next-line no-undefined
    if (changedValues.manual_target !== undefined) {
      setDisableTarget(!changedValues.manual_target);
      if (changedValues.manual_target && target) {
        setIncomeTarget(target);
      }
      if (!changedValues.manual_target && cpiValue) {
        setIncomeTarget(cpiValue.value.usd);
      }
    }
    if (changedValues.target && !disableTarget) {
      setIncomeTarget(target);
    }
    if (changedValues.region && disableTarget) {
      // TODO: get from API
      setIncomeTarget(cpiValue.value.usd);
    }
  };

  return (
    <Form
      name={`drivers-income-target`}
      layout="vertical"
      form={form}
      onValuesChange={onValuesChange}
    >
      <Row gutter={[8, 8]}>
        <Col span={12}>
          <Form.Item label="Manual Target" name="manual_target">
            <Switch defaultChecked={!disableTarget} />
          </Form.Item>
        </Col>
        <Col
          span={12}
          style={{
            display: disableTarget ? "none" : "",
          }}
        >
          <Form.Item label="Target" name="target">
            <InputNumber style={formStyle} disabled={disableTarget} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[8, 8]} style={{ display: !disableTarget ? "none" : "" }}>
        <Col span={12}>
          <Form.Item label="Search Region" name="region">
            <Select
              style={formStyle}
              options={region}
              disabled={!disableTarget}
              {...selectProps}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Number of Adult" name="household_adult">
            <InputNumber style={formStyle} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Number of Children" name="household_children">
            <InputNumber style={formStyle} />
          </Form.Item>
        </Col>
      </Row>
      <Row
        gutter={[8, 8]}
        style={{
          borderTop: "1px solid #e8e8e8",
          display: !disableTarget ? "none" : "",
        }}
      >
        <Col span={12}>
          <p>Living Income Target</p>
          <h2>{incomeTarget}</h2>
        </Col>
        <Col span={12}>
          <p>Household Size</p>
          <h2>{householdSize}</h2>
        </Col>
      </Row>
    </Form>
  );
};

export default IncomeDriverTarget;
