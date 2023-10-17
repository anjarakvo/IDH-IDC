import React from "react";
import { ContentLayout } from "../../components/layout";
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
} from "antd";
import { StepForwardOutlined } from "@ant-design/icons";
import "./cases.scss";

const gridStyle = {
  width: "100%",
};

const onFinish = (values) => {
  console.info("Success:", values);
};
const onFinishFailed = (errorInfo) => {
  console.info("Failed:", errorInfo);
};

const CaseForm = () => {
  const tagOptions = [
    {
      label: "Indonesia",
      value: "Indonesia",
    },
    {
      label: "Malaysia",
      value: "Malaysia",
    },
    {
      label: "Singapore",
      value: "Singapore",
    },
    {
      label: "Thailand",
      value: "Thailand",
    },
    {
      label: "Vietnam",
      value: "Vietnam",
    },
  ];
  const reportingPeriod = [
    {
      label: "Per Season",
      value: "per-season",
    },
    {
      label: "Per Year",
      value: "per-year",
    },
  ];
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
          style={gridStyle}
          placeholder="Add Tags"
          allowClear
          options={tagOptions}
        />
      </Form.Item>

      <h3>Driver Details</h3>

      <Form.Item name="country" label="Select Country">
        <Select
          style={gridStyle}
          placeholder="Select Country"
          options={tagOptions}
        />
      </Form.Item>
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <Form.Item label="Select Commodity" name="commodity">
            <Select
              style={gridStyle}
              placeholder="Select Focus Commodity"
              options={tagOptions}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Select Currency" name="currency">
            <Select
              style={gridStyle}
              placeholder="Select Currency"
              options={tagOptions}
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Reporting Period" name="reporting">
        <Radio.Group
          options={reportingPeriod}
          optionType="button"
          buttonStyle="solid"
        />
      </Form.Item>

      <Form.Item
        label="Do you have secondary commodity to report on?"
        name="secondary"
      >
        <Radio.Group
          options={[
            {
              label: "Yes",
              value: "yes",
            },
            {
              label: "No",
              value: "no",
            },
          ]}
        />
      </Form.Item>
    </>
  );
};

const SecondaryForm = ({ index, indexLabel }) => {
  return (
    <>
      <Form.Item
        name={`${index}-commodity`}
        label={`Select ${indexLabel} Commodity`}
      >
        <Select
          mode="tags"
          style={gridStyle}
          placeholder={`Add your ${indexLabel} Commodity`}
          allowClear
          options={[
            {
              label: "Indonesia",
              value: "Indonesia",
            },
            {
              label: "Malaysia",
              value: "Malaysia",
            },
            {
              label: "Singapore",
              value: "Singapore",
            },
            {
              label: "Thailand",
              value: "Thailand",
            },
            {
              label: "Vietnam",
              value: "Vietnam",
            },
          ]}
        />
      </Form.Item>
      <Form.Item
        name={`${index}-breakdown`}
        label={`Data on income drivers available`}
      >
        <Radio.Group
          options={[
            {
              label: "Yes",
              value: "yes",
            },
            {
              label: "No",
              value: "no",
            },
          ]}
        />
      </Form.Item>
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <Form.Item label="Select Area Unit" name={`${index}-area-unit`}>
            <Select
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
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Select Measurement Unit"
            name={`${index}-measurement-unit`}
          >
            <Select
              style={gridStyle}
              placeholder="Select Measurement Unit"
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
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

const Case = () => {
  const [form] = Form.useForm();

  const onChange = (e) => {
    console.info(e.target.value || e.target.checked || e);
  };

  return (
    <ContentLayout
      breadcrumbItems={[
        { title: "Home", href: "/dashboard" },
        { title: "Cases", href: "/cases" },
        { title: "New" },
      ]}
      title="New Case"
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
        onChange={onChange}
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
                <Card title="Secondary Crops">
                  <SecondaryForm index={1} indexLabel="Secondary" />
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
