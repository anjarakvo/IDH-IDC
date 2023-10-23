import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Radio,
  Row,
  Col,
  Card,
  Switch,
  Button,
  Space,
  message,
  DatePicker,
} from "antd";
import { StepForwardOutlined } from "@ant-design/icons";
import {
  AreaUnitFields,
  commodityOptions,
  countryOptions,
  currencyOptions,
  reportingPeriod,
  selectProps,
  yesNoOptions,
} from "./";
import { api } from "../../../lib";
import { UIState } from "../../../store";
import isEmpty from "lodash/isEmpty";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

const CaseForm = ({ setCaseTitle }) => {
  const tagOptions = UIState.useState((s) => s.tagOptions);

  return (
    <>
      <h3>General Information</h3>
      <Form.Item
        label="Name of Case"
        name="name"
        rules={[
          {
            required: true,
            message: "Name of Case is required",
          },
        ]}
        onChange={(e) => setCaseTitle(e.target.value)}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Case Description"
        name="description"
        rules={[
          {
            required: true,
            message: "Case Description is required",
          },
        ]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item
        name="tags"
        label="Tags"
        rules={[
          {
            required: true,
            message: "Select at least one tag",
          },
        ]}
      >
        <Select
          mode="multiple"
          placeholder="Add Tags"
          options={tagOptions}
          {...selectProps}
        />
      </Form.Item>

      <Form.Item
        name="year"
        label="Year"
        rules={[
          {
            required: true,
            message: "Select year",
          },
        ]}
      >
        <DatePicker picker="year" />
      </Form.Item>

      <h3>Driver Details</h3>

      <Form.Item
        name="country"
        label="Select Country"
        rules={[
          {
            required: true,
            message: "Country is required",
          },
        ]}
      >
        <Select
          placeholder="Select Country"
          options={countryOptions}
          {...selectProps}
        />
      </Form.Item>
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <Form.Item
            label="Select Commodity"
            name="focus_commodity"
            rules={[
              {
                required: true,
                message: "Commodity is required",
              },
            ]}
          >
            <Select
              placeholder="Select Focus Commodity"
              options={commodityOptions}
              {...selectProps}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Select Currency"
            name="currency"
            rules={[
              {
                required: true,
                message: "Currency is required",
              },
            ]}
          >
            <Select
              placeholder="Select Currency"
              options={currencyOptions}
              {...selectProps}
            />
          </Form.Item>
        </Col>
      </Row>
      <AreaUnitFields disabled={false} />
      <Form.Item
        label="Reporting Period"
        name="reporting_period"
        rules={[
          {
            required: true,
            message: "Reporting Period is required",
          },
        ]}
      >
        <Radio.Group
          options={reportingPeriod}
          optionType="button"
          buttonStyle="solid"
        />
      </Form.Item>
    </>
  );
};

const SecondaryForm = ({ index, indexLabel, disabled }) => {
  return (
    <>
      <Form.Item
        name={`${index}-commodity`}
        label={`Select ${indexLabel} Commodity`}
        rules={[
          {
            required: !disabled,
            message: "Commodity is required",
          },
        ]}
      >
        <Select
          placeholder={`Add your ${indexLabel} Commodity`}
          disabled={disabled}
          options={commodityOptions}
          {...selectProps}
        />
      </Form.Item>
      <Form.Item
        name={`${index}-breakdown`}
        label={`Data on income drivers available`}
        rules={[
          {
            required: !disabled,
            message: "Please select yes or no",
          },
        ]}
      >
        <Radio.Group disabled={disabled} options={yesNoOptions} />
      </Form.Item>
      <AreaUnitFields disabled={disabled} index={index} />
    </>
  );
};

const CaseProfile = ({
  setCaseTitle,
  setPage,
  formData,
  setFormData,
  finished,
  setFinished,
  commodityList,
  setCommodityList,
  currentCaseId,
  setCurrentCaseId,
  initialOtherCommodityTypes,
}) => {
  const [form] = Form.useForm();
  const [secondary, setSecondary] = useState(commodityList.length > 2);
  const [tertiary, setTertiary] = useState(commodityList.length > 3);
  const [isSaving, setIsSaving] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { caseId } = useParams();

  useEffect(() => {
    // initial case profile value
    if (!isEmpty(formData)) {
      const completed = finished.filter((item) => item !== "Case Profile");
      if (initialOtherCommodityTypes?.includes("secondary")) {
        setSecondary(true);
      }
      if (initialOtherCommodityTypes?.includes("tertiary")) {
        setTertiary(true);
      }
      setFinished([...completed, "Case Profile"]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const onFinish = (values) => {
    setIsSaving(true);
    setFormData(values);
    const completed = finished.filter((item) => item !== "Case Profile");

    let other_commodities = [];
    const initial_commodities = {
      commodity: values.focus_commodity,
      breakdown: true,
      currency: values.currency,
      area_size_unit: values.area_size_unit,
      volume_measurement_unit: values.volume_measurement_unit,
    };
    let commodities = [initial_commodities];
    if (secondary) {
      commodities = [
        ...commodities,
        {
          commodity: values["1-commodity"],
          breakdown: values["1-breakdown"] ? true : false,
          currency: values.currency,
          area_size_unit: values["1-area_size_unit"],
          volume_measurement_unit: values["1-volume_measurement_unit"],
        },
      ];
      other_commodities = [
        ...other_commodities,
        {
          commodity: values["1-commodity"],
          breakdown: values["1-breakdown"] ? true : false,
          commodity_type: "secondary",
          area_size_unit: values["1-area_size_unit"],
          volume_measurement_unit: values["1-volume_measurement_unit"],
        },
      ];
    }
    if (tertiary) {
      commodities = [
        ...commodities,
        {
          commodity: values["2-commodity"],
          breakdown: values["2-breakdown"] ? true : false,
          currency: values.currency,
          area_size_unit: values["2-area_size_unit"],
          volume_measurement_unit: values["2-volume_measurement_unit"],
        },
      ];
      other_commodities = [
        ...other_commodities,
        {
          commodity: values["2-commodity"],
          breakdown: values["2-breakdown"] ? true : false,
          commodity_type: "tertiary",
          area_size_unit: values["2-area_size_unit"],
          volume_measurement_unit: values["2-volume_measurement_unit"],
        },
      ];
    }
    // diversified_commodities
    commodities = [...commodities, initial_commodities];
    const payload = {
      name: values.name,
      description: values.description,
      country: values.country,
      focus_commodity: values.focus_commodity,
      year: dayjs(values.year).year(),
      currency: values.currency,
      area_size_unit: values.area_size_unit,
      volume_measurement_unit: values.volume_measurement_unit,
      reporting_period: values.reporting_period,
      multiple_commodities: secondary || tertiary,
      // need to handle below value correctly
      cost_of_production_unit: "cost_of_production_unit",
      segmentation: true,
      living_income_study: null,
      logo: null,
      private: false,
      other_commodities: other_commodities,
      tags: values.tags || null,
    };

    setCommodityList(commodities);

    const apiCall =
      currentCaseId || caseId
        ? api.put(`case/${caseId}`, payload)
        : api.post("case", payload);
    apiCall
      .then((res) => {
        setCurrentCaseId(res?.data?.id);
        setFinished([...completed, "Case Profile"]);
        setPage("Income Driver Data Entry");
      })
      .catch((e) => {
        console.error(e);
        messageApi.open({
          type: "error",
          content: "Failed to save case profile.",
        });
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const onFinishFailed = () => {
    setFinished(finished.filter((item) => item !== "Case Profile"));
  };

  return (
    <Form
      form={form}
      name="basic"
      layout="vertical"
      initialValues={formData}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      {contextHolder}
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="Case Details">
            <CaseForm setCaseTitle={setCaseTitle} />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="Secondary Commodity"
            extra={<Switch checked={secondary} onChange={setSecondary} />}
            style={{
              marginBottom: "16px",
              backgroundColor: !secondary ? "#f5f5f5" : "white",
            }}
          >
            <SecondaryForm
              index={1}
              indexLabel="Secondary"
              disabled={!secondary}
            />
          </Card>
          <Card
            title="Teritary Commodity"
            extra={
              <Switch
                checked={tertiary}
                onChange={setTertiary}
                disabled={!secondary}
              />
            }
            style={{
              backgroundColor: !tertiary ? "#f5f5f5" : "white",
            }}
          >
            <SecondaryForm
              index={2}
              indexLabel="Teritary"
              disabled={!tertiary}
            />
          </Card>
          <Row>
            <Col span={12}>
              <Button className="button button-submit button-secondary">
                Cancel
              </Button>
            </Col>
            <Col
              span={12}
              style={{
                justifyContent: "flex-end",
                display: "grid",
              }}
            >
              <Space size={[8, 16]} wrap>
                <Button
                  htmlType="submit"
                  className="button button-submit button-secondary"
                  loading={isSaving}
                >
                  Save
                </Button>
                <Button
                  htmlType="submit"
                  className="button button-submit button-secondary"
                  loading={isSaving}
                >
                  Next
                  <StepForwardOutlined />
                </Button>
              </Space>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};

export default CaseProfile;
