import React, { useState } from "react";
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
} from "antd";
import { StepForwardOutlined } from "@ant-design/icons";
import {
  AreaUnitFields,
  commodityOptions,
  countryOptions,
  currencyOptions,
  reportingPeriod,
  selectProps,
  tagOptions,
  yesNoOptions,
} from "./";

const CaseForm = ({ setCaseTitle }) => {
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
        rules={[
          {
            required: true,
            message: "Select at least one tag",
          },
        ]}
      >
        <Select
          mode="tags"
          placeholder="Add Tags"
          options={tagOptions}
          {...selectProps}
        />
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
}) => {
  const [form] = Form.useForm();
  const [secondary, setSecondary] = useState(false);
  const [tertiary, setTertiary] = useState(false);

  const onFinish = (values) => {
    setFormData(values);
    setPage("Income Driver Data Entry");
    const completed = finished.filter((item) => item !== "Case Profile");
    setFinished([...completed, "Case Profile"]);
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
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="Case Details">
            <CaseForm setCaseTitle={setCaseTitle} />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="Secondary Commodity"
            extra={<Switch onChange={setSecondary} />}
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
            extra={<Switch onChange={setTertiary} disabled={!secondary} />}
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
                >
                  Save
                </Button>
                <Button
                  htmlType="submit"
                  className="button button-submit button-secondary"
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
