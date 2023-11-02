import React, { useState, useEffect } from "react";
import { Row, Col, Form, InputNumber, Select, Switch } from "antd";
import { selectProps } from "./";
import { api } from "../../../lib";
import isEmpty from "lodash/isEmpty";

const formStyle = { width: "100%" };

const IncomeDriverTarget = ({
  segment,
  currentCase,
  formValues,
  setFormValues,
  segmentItem,
  totalCurrentIncome,
}) => {
  const [form] = Form.useForm();
  const [householdSize, setHouseholdSize] = useState(0);
  const [benchmark, setBenchmark] = useState(null);
  const [incomeTarget, setIncomeTarget] = useState(0);
  const [disableTarget, setDisableTarget] = useState(true);
  const [regionOptions, setRegionOptions] = useState([]);
  const [loadingRegionOptions, setLoadingRegionOptions] = useState(false);
  const currentSegmentId = segmentItem?.currentSegmentId || null;
  const [regionOptionStatus, setRegionOptionStatus] = useState(null);

  // load initial target& hh size
  useEffect(() => {
    if (!isEmpty(segmentItem) && currentSegmentId) {
      setIncomeTarget(segmentItem?.target || 0);
      if (!segmentItem?.region) {
        form.setFieldsValue({
          manual_target: true,
          target: segmentItem?.target || null,
        });
        setDisableTarget(false);
      }
      form.setFieldsValue({ region: segmentItem?.region || null });
      form.setFieldsValue({
        household_adult: segmentItem?.adult || null,
      });
      form.setFieldsValue({
        household_children: segmentItem?.child || null,
      });
      calculateHouseholdSize(segmentItem?.adult || 0, segmentItem?.child || 0);
    }
  }, [segmentItem, currentSegmentId, form]);

  // call region api
  useEffect(() => {
    if (currentCase?.country) {
      setLoadingRegionOptions(true);
      api
        .get(`region/options?country_id=${currentCase.country}`)
        .then((res) => {
          setRegionOptionStatus(200);
          setRegionOptions(res.data);
        })
        .catch((e) => {
          const { status } = e.response;
          setRegionOptionStatus(status);
        })
        .finally(() => {
          setLoadingRegionOptions(false);
        });
    }
  }, [currentCase?.country]);

  const updateFormValues = (value) => {
    const updatedFv = formValues.map((fv) => {
      if (fv.key === segment) {
        return {
          ...fv,
          ...value,
        };
      }
      return fv;
    });
    setFormValues(updatedFv);
  };

  const handleOnChangeHouseholdAdult = (value) => {
    updateFormValues({ adult: value });
  };

  const handleOnChangeHouseholdChild = (value) => {
    updateFormValues({ child: value });
  };

  const calculateHouseholdSize = (household_adult, household_children) => {
    // OECD average household size
    // first adult = 1, next adult 0.5
    // 1 child = 0.3
    const adult_size =
      household_adult === 1 ? 1 : 1 + (household_adult - 1) * 0.5;
    const children_size = household_children * 0.3;
    const size = adult_size + children_size;
    setHouseholdSize(size);
  };

  const onValuesChange = (changedValues, allValues) => {
    const {
      household_adult = 0,
      household_children = 0,
      target,
      region,
    } = allValues;
    const regionData = { region: region };
    if (household_adult || household_children) {
      calculateHouseholdSize(household_adult, household_children);
    }
    // eslint-disable-next-line no-undefined
    if (changedValues.manual_target !== undefined) {
      setDisableTarget(!changedValues.manual_target);
      if (changedValues.manual_target && target) {
        form.setFieldsValue({ region: null });
        setIncomeTarget(target);
        updateFormValues({ region: null, target: target });
      }
      if (!changedValues.manual_target) {
        form.setFieldsValue({ target: null });
        setIncomeTarget(segmentItem?.target || 0);
        updateFormValues({ region: null, target: 0 });
      }
    }
    if (changedValues.target && !disableTarget) {
      setIncomeTarget(target);
      updateFormValues({ ...regionData, target: target });
    }
    if (changedValues.region && disableTarget) {
      // get from API
      if (currentCase?.country && currentCase?.year && region) {
        let url = `country_region_benchmark?country_id=${currentCase.country}`;
        url = `${url}&region_id=${region}&year=${currentCase.year}`;
        api.get(url).then((res) => {
          const { data } = res;
          setBenchmark(data);
          if (data?.cpi) {
            setIncomeTarget(data.cpi);
            setHouseholdSize(data.household_size);
            updateFormValues({
              ...regionData,
              target: data.cpi,
              benchmark: data,
            });
          } else {
            setIncomeTarget(data.value.usd);
            setHouseholdSize(data.household_size);
            updateFormValues({
              ...regionData,
              target: data.value.usd,
              benchmark: data,
            });
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
            <Switch checked={!disableTarget} />
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
      {/* region options notif */}
      {regionOptionStatus === 404 && (
        <Row
          style={{
            borderBottom: "1px solid #e8e8e8",
            marginBottom: "12px",
            color: "red",
          }}
        >
          <Col span={24}>
            A benchmark for the county is not available; please switch to manual
            target.
          </Col>
        </Row>
      )}
      <Row gutter={[8, 8]} style={{ display: !disableTarget ? "none" : "" }}>
        <Col span={8}>
          <Form.Item label="Region" name="region">
            <Select
              style={formStyle}
              options={regionOptions}
              disabled={!disableTarget}
              loading={loadingRegionOptions}
              placeholder={
                regionOptionStatus === 404
                  ? "Region not available"
                  : "Select or Type Region"
              }
              {...selectProps}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Number of Average Adult in Household"
            name="household_adult"
          >
            <InputNumber
              style={formStyle}
              onChange={handleOnChangeHouseholdAdult}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Number of Average Children in Household"
            name="household_children"
          >
            <InputNumber
              style={formStyle}
              onChange={handleOnChangeHouseholdChild}
            />
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
        <Col span={8}>
          <p>Living Income Target</p>
          <h2>{incomeTarget.toFixed(2)} USD</h2>
        </Col>
        <Col span={16}>
          <p>Calculated Living Income</p>
          <h2>
            {totalCurrentIncome} {currentCase.currency}
          </h2>
        </Col>
      </Row>
    </Form>
  );
};

export default IncomeDriverTarget;
