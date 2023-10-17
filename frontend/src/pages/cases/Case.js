import React, { useState } from "react";
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
  Modal,
  Radio,
} from "antd";
import { StepForwardOutlined } from "@ant-design/icons";
import "./cases.scss";

const commodityCategories = window.master?.commodity_categories || [];
const commodities = commodityCategories
  ? commodityCategories.reduce(
      (acc, category) => [...acc, ...category.commodities],
      []
    )
  : [];
const commodityOptions = commodities.map((commodity) => ({
  label: commodity.name,
  value: commodity.id,
}));

const currencyOptions = window.master?.currencies || [];
const countryOptions = window.master?.countries || [];

const selectProps = {
  showSearch: true,
  allowClear: true,
  optionFilterProp: "label",
  style: {
    width: "100%",
  },
};

const yesNoOptions = [
  {
    label: "Yes",
    value: "yes",
  },
  {
    label: "No",
    value: "no",
  },
];

const tagOptions = [
  {
    label: "Smallholder",
    value: "smallholder",
  },
  {
    label: "Large Scale",
    value: "large-scale",
  },
  {
    label: "Plantation",
    value: "plantation",
  },
  {
    label: "Processing",
    value: "processing",
  },
  {
    label: "Trading",
    value: "trading",
  },
  {
    label: "Retail",
    value: "retail",
  },
  {
    label: "Other",
    value: "other",
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
          <Form.Item label="Select Commodity" name="commodity">
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
        <Radio.Group options={yesNoOptions} />
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
          mode="tags"
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
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <Form.Item label="Select Area Unit" name={`${index}-area-unit`}>
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
            name={`${index}-measurement-unit`}
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
    </>
  );
};

const Case = () => {
  const [form] = Form.useForm();
  const [secondary, setSecondary] = useState(false);
  const [modalSecondaryShow, setModalSecondaryShow] = useState(false);

  const handleDeleteSecondary = () => {
    const secondaryValues = Object.keys(form.getFieldsValue()).filter((key) =>
      key.startsWith("1-")
    );
    secondaryValues.forEach((key) => {
      form.setFieldsValue({
        [key]: undefined, // eslint-disable-line no-undefined
      });
    });
    setSecondary(false);
    setModalSecondaryShow(false);
  };

  const handleRestoreSecondary = () => {
    form.setFieldsValue({
      secondary: "yes",
    });
    setSecondary(true);
    setModalSecondaryShow(false);
  };

  const onChange = (e) => {
    if (e?.secondary === "yes") {
      setSecondary(true);
    }
    if (e?.secondary === "no") {
      const secondaryValues = Object.keys(form.getFieldsValue()).filter(
        (key) =>
          key.startsWith("1-") && form.getFieldsValue()[key] !== undefined // eslint-disable-line no-undefined
      );
      if (secondaryValues.length > 0) {
        setModalSecondaryShow(true);
      } else {
        setSecondary(false);
      }
    }
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
        onValuesChange={onChange}
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
                <Card title="Secondary Commodities">
                  <SecondaryForm
                    index={1}
                    indexLabel="Secondary"
                    disabled={!secondary}
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
      <Modal
        title="Warning"
        open={modalSecondaryShow}
        onOk={handleDeleteSecondary}
        onCancel={handleRestoreSecondary}
      >
        You have added secondary commodity. Do you want to remove it?
      </Modal>
    </ContentLayout>
  );
};

export default Case;
