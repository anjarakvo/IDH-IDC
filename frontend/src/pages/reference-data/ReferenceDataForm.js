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

const selectProps = {
  showSearch: true,
  allowClear: true,
  optionFilterProp: "label",
  style: {
    width: "100%",
  },
};

const ReferenceDataForm = () => {
  const navigate = useNavigate();
  const { referenceDataId } = useParams();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [initValues, setInitValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

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
        <Form
          form={form}
          name="reference-form"
          layout="vertical"
          initialValues={initValues}
          // onFinish={onFinish}
          className="reference-form-container"
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card>
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

                <Form.Item
                  label="Focus Crop"
                  name="focus_crop"
                  rules={[
                    {
                      required: true,
                      message: "Focus crop is required",
                    },
                  ]}
                >
                  <Select {...selectProps} options={[]} />
                </Form.Item>

                <Form.Item label="Data Source" name="data_source">
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Weight Unit"
                  name="weight_unit"
                  rules={[
                    {
                      required: true,
                      message: "Weight unit is required",
                    },
                  ]}
                >
                  <Select {...selectProps} options={[]} />
                </Form.Item>

                <Form.Item
                  label="Area Unit"
                  name="area_unit"
                  rules={[
                    {
                      required: true,
                      message: "Area unit is required",
                    },
                  ]}
                >
                  <Select {...selectProps} options={[]} />
                </Form.Item>

                <Form.Item
                  label="Area Unit"
                  name="area_unit"
                  rules={[
                    {
                      required: true,
                      message: "Area unit is required",
                    },
                  ]}
                >
                  <Select {...selectProps} options={[]} />
                </Form.Item>

                <Form.Item
                  label="Area"
                  name="area"
                  rules={[
                    {
                      required: true,
                      message: "Area is required",
                    },
                  ]}
                >
                  <InputNumber />
                </Form.Item>

                <Form.Item
                  label="Volume"
                  name="volume"
                  rules={[
                    {
                      required: true,
                      message: "Volume is required",
                    },
                  ]}
                >
                  <InputNumber />
                </Form.Item>

                <Form.Item
                  label="Price"
                  name="price"
                  rules={[
                    {
                      required: true,
                      message: "Price is required",
                    },
                  ]}
                >
                  <InputNumber />
                </Form.Item>

                <Form.Item
                  label="Cost of Production"
                  name="cost_of_production"
                  rules={[
                    {
                      required: true,
                      message: "Cost of production is required",
                    },
                  ]}
                >
                  <InputNumber />
                </Form.Item>

                <Form.Item
                  label="Diversified Income"
                  name="diversified_income"
                  rules={[
                    {
                      required: true,
                      message: "Diversified income is required",
                    },
                  ]}
                >
                  <InputNumber />
                </Form.Item>

                <Form.Item label="Notes about the data" name="notes">
                  <Input.TextArea rows={4} />
                </Form.Item>
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
      )}
    </ContentLayout>
  );
};

export default ReferenceDataForm;
