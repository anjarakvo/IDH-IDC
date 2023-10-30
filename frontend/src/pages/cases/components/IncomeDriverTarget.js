import React, { useState } from "react";
import { Card, Row, Col, Form, InputNumber, Select } from "antd";
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
  {
    value: 3,
    label: "East",
  },
  {
    value: 4,
    label: "West",
  },
];

const cpi = {
  id: 1,
  country: 1,
  region: 2,
  year: 2002,
  value: {
    usd: 2000,
    eur: 2000,
  },
  cpi: 4000,
};

const formStyle = { width: "100%" };

const IncomeDriverTarget = () => {
  const [form] = Form.useForm();
  const [householdSize, setHouseholdSize] = useState(0);
  const [incomeTarget, setIncomeTarget] = useState(0);

  const onValuesChange = (changedValues, allValues) => {
    const {
      household_adult = 0,
      household_children = 0,
      manual_target,
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
    if (changedValues.manual_target) {
      setIncomeTarget(manual_target);
    }
    if (changedValues.region) {
      // TODO: get from API
      setIncomeTarget(cpi.value.usd);
    }
  };

  return (
    <Card.Grid
      style={{
        width: "100%",
      }}
      hoverable={false}
    >
      <Form
        name={`drivers-income-target`}
        layout="vertical"
        form={form}
        onValuesChange={onValuesChange}
      >
        <Row gutter={[8, 8]}>
          <Col span={12}>
            <Form.Item label="Search Region" name="region">
              <Select style={formStyle} options={region} {...selectProps} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Target" name="manual_target">
              <InputNumber style={formStyle} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[8, 8]}>
          <Col span={12}>
            <Form.Item label="Number of Adult" name="household_adult">
              <InputNumber style={formStyle} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Number of Children" name="household_children">
              <InputNumber style={formStyle} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Row
        gutter={[8, 8]}
        style={{
          borderTop: "1px solid #e8e8e8",
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
    </Card.Grid>
  );
};

export default IncomeDriverTarget;
