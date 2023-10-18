import React from "react";
import { Form, Select, Row, Col } from "antd";
import { selectProps } from "./";

const AreaUnitFields = ({ disabled = true, index = 0 }) => {
  return (
    <Row gutter={[12, 12]}>
      <Col span={12}>
        <Form.Item
          label="Select Area Unit"
          name={index ? `${index}-area_size_unit` : "area_size_unit"}
        >
          <Select
            disabled={disabled}
            placeholder="Select Area Unit"
            options={[
              {
                label: "Hectares",
                value: "hectares",
              },
              {
                label: "Acres",
                value: "acres",
              },
            ]}
            {...selectProps}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Select Measurement Unit"
          name={
            index
              ? `${index}-volume_measurement_unit`
              : "volume_measurement_unit"
          }
        >
          <Select
            placeholder="Select Measurement Unit"
            disabled={disabled}
            options={[
              {
                label: "Kilograms",
                value: "kilograms",
              },
              {
                label: "Grams",
                value: "grams",
              },
              {
                label: "Litres",
                value: "litres",
              },
              {
                label: "Kilolitres",
                value: "kilolitres",
              },
              {
                label: "Barrels",
                value: "barrels",
              },
              {
                label: "Cubic Metres",
                value: "cubic-metres",
              },
              {
                label: "Cubic Feet",
                value: "cubic-feet",
              },
              {
                label: "Cubic Yards",
                value: "cubic-yards",
              },
              {
                label: "Bags",
                value: "bags",
              },
              {
                label: "Tons",
                value: "tons",
              },
            ]}
            {...selectProps}
          />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default AreaUnitFields;
