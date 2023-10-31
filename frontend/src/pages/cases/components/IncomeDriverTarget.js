import React, { useState, useEffect } from "react";
import { Row, Col, Form, InputNumber, Select, Switch } from "antd";
import { selectProps } from "./";
import { api } from "../../../lib";

const formStyle = { width: "100%" };

const IncomeDriverTarget = ({ segment, currentCase }) => {
  const [form] = Form.useForm();
  const [householdSize, setHouseholdSize] = useState(0);
  const [incomeTarget, setIncomeTarget] = useState(0);
  const [disableTarget, setDisableTarget] = useState(true);
  const [regionOptions, setRegionOptions] = useState([]);
  const [loadingRegionOptions, setLoadingRegionOptions] = useState(false);

  useEffect(() => {
    if (currentCase?.country) {
      setLoadingRegionOptions(true);
      api
        .get(`region/options?country_id=${currentCase.country}`)
        .then((res) => {
          setRegionOptions(res.data);
        })
        .finally(() => {
          setLoadingRegionOptions(false);
        });
    }
  }, [currentCase?.country]);

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
    // eslint-disable-next-line no-undefined
    if (changedValues.manual_target !== undefined) {
      setDisableTarget(!changedValues.manual_target);
      if (changedValues.manual_target && target) {
        setIncomeTarget(target);
      }
      if (!changedValues.manual_target) {
        form.setFieldsValue({ region: [] });
        setIncomeTarget(0);
      }
    }
    if (changedValues.target && !disableTarget) {
      setIncomeTarget(target);
    }
    if (changedValues.region && disableTarget) {
      // TODO: get from API
      if (currentCase?.country && currentCase?.year && region) {
        let url = `country_region_benchmark?country_id=${currentCase.country}`;
        url = `${url}&region_id=${region}&year=${currentCase.year}`;
        api.get(url).then((res) => {
          const { data } = res;
          if (data?.cpi) {
            setIncomeTarget(data.cpi);
          } else {
            setIncomeTarget(data.value.usd);
          }
        });
      }
    }
  };

  return (
    <Form
      name={`drivers-income-target-${segment}`}
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
              options={regionOptions}
              disabled={!disableTarget}
              loading={loadingRegionOptions}
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
          <h2>{incomeTarget.toFixed(2)}</h2>
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
