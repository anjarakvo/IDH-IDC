import React, { useState } from "react";
import "./reference-data.scss";
import { useNavigate, useParams } from "react-router-dom";
import { ContentLayout } from "../../components/layout";
import {
  Form,
  Input,
  Card,
  Row,
  Col,
  Button,
  Select,
  Spin,
  message,
  InputNumber,
} from "antd";
import { areaUnitOptions, volumeUnitOptions } from "../../store/static";

const selectProps = {
  showSearch: true,
  allowClear: true,
  optionFilterProp: "label",
  style: {
    width: "100%",
  },
};

const confidenceLevelOptions = [
  {
    label: "High",
    value: "high",
  },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

const rangeOptions = [
  { label: "Low value", value: "low value" },
  { label: "Median value", value: "median value" },
  {
    label: "High value",
    value: "high value",
  },
];

const typeOptions = [
  { label: "Mean", value: "mean" },
  { label: "Median", value: "median" },
  { label: "Maximum", value: "maximum" },
  { label: "Minimum", value: "minimum" },
];

const ReferenceDataForm = () => {
  const navigate = useNavigate();
  const { referenceDataId } = useParams();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [initValues, setInitValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [copUnitOptions, setCopUnitOptions] = useState([]);

  const onChange = (_, allValues) => {
    const currency = allValues?.currency || "currency";
    const areaUnit = allValues?.area_size_unit || "area_size_unit";
    const volumeUnit =
      allValues?.volume_measurement_unit || "volume_measurement_unit";
    setCopUnitOptions([
      {
        label: `${currency} / ${areaUnit}`,
        value: `${currency} / ${areaUnit}`,
      },
      {
        label: `${currency} / ${volumeUnit}`,
        value: `${currency} / ${volumeUnit}`,
      },
    ]);
  };

  return (
    <ContentLayout
      breadcrumbItems={[
        { title: "Home", href: "/welcome" },
        { title: "Reference Data", href: "/reference-data" },
        {
          title: `${referenceDataId ? "Edit" : "Add"} Reference Data`,
          href: `/reference-data/${referenceDataId ? referenceDataId : "new"}`,
        },
      ]}
      title="Reference Data"
      wrapperId="reference-data"
    >
      {contextHolder}
      {loading ? (
        <div className="loading-container">
          <Spin />
        </div>
      ) : (
        <Card
          title="Reference Data Details"
          className="reference-form-container"
        >
          <Form
            form={form}
            name="reference-form"
            layout="vertical"
            initialValues={initValues}
            // onFinish={onFinish}
            onValuesChange={onChange}
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="General">
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Form.Item
                        label="Country"
                        name="country"
                        rules={[
                          {
                            required: true,
                            message: "Country is required",
                          },
                        ]}
                      >
                        <Select {...selectProps} options={[]} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Region"
                        name="region"
                        rules={[
                          {
                            required: true,
                            message: "Region is required",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Form.Item
                        label="Currency"
                        name="currency"
                        rules={[
                          {
                            required: true,
                            message: "Currency is required",
                          },
                        ]}
                      >
                        <Select {...selectProps} options={[]} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Crop"
                        name="crop"
                        rules={[
                          {
                            required: true,
                            message: "Crop is required",
                          },
                        ]}
                      >
                        <Select {...selectProps} options={[]} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Form.Item
                        label="Year"
                        name="year"
                        rules={[
                          {
                            required: true,
                            message: "Year is required",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Source"
                        name="source"
                        rules={[
                          {
                            required: true,
                            message: "Source is required",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        label="Link"
                        name="link"
                        rules={[
                          {
                            required: true,
                            message: "Link for source is required",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item label="Notes" name="notes">
                        <Input.TextArea rows={4} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>

              <Col span={24}>
                <Card title="Details about the data">
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <Form.Item
                        label="Confidence Level"
                        name="confidence_level"
                      >
                        <Select
                          {...selectProps}
                          options={confidenceLevelOptions}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="Range" name="range">
                        <Select {...selectProps} options={rangeOptions} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="Type" name="type">
                        <Select {...selectProps} options={typeOptions} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <Form.Item label="Area Unit" name="area_size_unit">
                        <Select {...selectProps} options={areaUnitOptions} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="Weight Measurement Unit"
                        name="volume_measurement_unit"
                      >
                        <Select {...selectProps} options={volumeUnitOptions} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="Cost of Production Unit"
                        name="cost_of_production_unit"
                      >
                        <Select {...selectProps} options={copUnitOptions} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>

              <Col span={24}>
                <Card title="Drivers Value">
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <Form.Item label="Area" name="area">
                        <InputNumber />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="Volume" name="volume">
                        <InputNumber />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="Price" name="price">
                        <InputNumber />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Form.Item
                        label="Cost of Production"
                        name="cost_of_production"
                      >
                        <InputNumber />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Diversified" name="diversified">
                        <InputNumber />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>

                <Form.Item>
                  <Button
                    className="button button-submit button-secondary"
                    htmlType="submit"
                    style={{ width: "200px", float: "left" }}
                    loading={submitting}
                  >
                    Save
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      )}
    </ContentLayout>
  );
};

export default ReferenceDataForm;
