import React, { useState } from "react";
import { ContentLayout } from "../../components/layout";
import {
  AreaUnitFields,
  selectProps,
  tagOptions,
  countryOptions,
  commodityOptions,
  currencyOptions,
  reportingPeriod,
  yesNoOptions,
} from "./components";
import {
  Row,
  Col,
  Space,
  Form,
  Input,
  Button,
  Timeline,
  Card,
  Select,
  Radio,
  Switch,
} from "antd";
import { StepForwardOutlined } from "@ant-design/icons";
import "./cases.scss";

const onFinish = (values) => {
  console.info("Success:", values);
};
const onFinishFailed = (errorInfo) => {
  console.info("Failed:", errorInfo);
};

const CaseForm = () => {
  return (
    <>
      <h3>General Information</h3>
      <Form.Item
        label="Name of Case"
        name="name"
        rules={[
          {
            required: true,
            message: "Name of Case is required!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Case Description"
        name="description"
        rules={[
          {
            required: true,
            message: "Case Description is required!",
          },
        ]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item name="tags">
        <Select
          mode="tags"
          placeholder="Add Tags"
          options={tagOptions}
          {...selectProps}
        />
      </Form.Item>

      <h3>Driver Details</h3>

      <Form.Item name="country" label="Select Country">
        <Select
          placeholder="Select Country"
          options={countryOptions}
          {...selectProps}
        />
      </Form.Item>
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <Form.Item label="Select Commodity" name="focus_commodity">
            <Select
              placeholder="Select Focus Commodity"
              options={commodityOptions}
              {...selectProps}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Select Currency" name="currency">
            <Select
              placeholder="Select Currency"
              options={currencyOptions}
              {...selectProps}
            />
          </Form.Item>
        </Col>
      </Row>
      <AreaUnitFields disabled={false} />
      <Form.Item label="Reporting Period" name="reporting_period">
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
      >
        <Radio.Group disabled={disabled} options={yesNoOptions} />
      </Form.Item>
      <AreaUnitFields disabled={disabled} index={index} />
    </>
  );
};

const Case = () => {
  const [form] = Form.useForm();
  const [secondary, setSecondary] = useState(false);
  const [tertiary, setTertiary] = useState(false);
  const [caseTitle, setCaseTitle] = useState("New Case");

  const onValuesChange = (changedValues) => {
    if (changedValues.name) {
      setCaseTitle(changedValues.name);
    }
    if (
      changedValues.name === "" ||
      changedValues.name === undefined || // eslint-disable-line
      changedValues.name === null
    ) {
      setCaseTitle("New Case");
    }
  };

  return (
    <ContentLayout
      breadcrumbItems={[
        { title: "Home", href: "/dashboard" },
        { title: "Cases", href: "/cases" },
        { title: caseTitle },
      ]}
      title={caseTitle}
      wrapperId="case"
    >
      <Form
        form={form}
        name="basic"
        layout="vertical"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onValuesChange={onValuesChange}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Row gutter={[16, 16]} className="case-content">
          <Col flex="200px">
            <Timeline
              items={[
                {
                  color: "#26605f",
                  children: (
                    <span style={{ color: "#26605f", fontWeight: "bold" }}>
                      Case Profile
                    </span>
                  ),
                },
                {
                  children: "Income Driver Data Entry",
                },
                {
                  children: "Income Driver Dashboard",
                },
              ]}
            />
          </Col>
          <Col flex="auto">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="Case Details">
                  <CaseForm />
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  title="Secondary Commodities"
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
                  title="Teritary Commodities"
                  extra={
                    <Switch onChange={setTertiary} disabled={!secondary} />
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
          </Col>
        </Row>
      </Form>
    </ContentLayout>
  );
};

export default Case;
