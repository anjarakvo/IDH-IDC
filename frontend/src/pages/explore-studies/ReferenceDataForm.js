import React, { useState } from "react";
import "./explore-studies-page.scss";
import {
  Form,
  Input,
  Card,
  Row,
  Col,
  Select,
  Spin,
  message,
  InputNumber,
  Modal,
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

const ReferenceDataForm = ({
  open = false,
  setOpen,
  referenceDataId = null,
}) => {
  const [form] = Form.useForm();
  const [initValues, setInitValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [confirmLoading, setConfirmLoading] = useState(false);

  const [areaUnitName, setAreaUnitName] = useState(null);
  const [volumeUnitName, setVolumeUnitName] = useState(null);
  const [currencyUnitName, setCurrencyUnitName] = useState(null);
  const [copUnitName, setCopUnitName] = useState(null);

  const commodityOptions = window?.master?.commodity_categories?.flatMap((ct) =>
    ct.commodities.map((c) => ({
      label: c.name,
      value: c.id,
      category: ct.name,
    }))
  );

  const currencyOptions = window?.master?.currencies;

  const onChange = (_, allValues) => {
    const { commodity, currency, area_size_unit, volume_measurement_unit } =
      allValues;

    setCurrencyUnitName(currency);
    setAreaUnitName(area_size_unit);

    // handle CoP unit
    const findCommodityCategory = commodityOptions.find(
      (co) => co.value === commodity
    )?.category;

    if (findCommodityCategory?.toLowerCase() === "crop") {
      if (currency && area_size_unit) {
        setCopUnitName(`${currency} / ${area_size_unit}`);
      } else {
        setCopUnitName(null);
      }
    }

    if (
      ["aquaculture", "livestock"].includes(
        findCommodityCategory?.toLowerCase()
      )
    ) {
      if (currency && volume_measurement_unit) {
        setCopUnitName(`${currency} / ${volume_measurement_unit}`);
      } else {
        setCopUnitName(null);
      }
    }
    // EOL handle CoP unit

    // handle Volume unit
    if (area_size_unit && volume_measurement_unit) {
      setVolumeUnitName(`${volume_measurement_unit} / ${area_size_unit}`);
    } else {
      setVolumeUnitName(null);
    }
    // EOL handle Volume unit
  };

  const handleOk = () => {
    form.submit();
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Modal
      title="Reference Data Details"
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      width="90%"
      okText="Save"
      keyboard={false}
      destroyOnClose={true}
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
          onValuesChange={onChange}
          className="reference-form-container"
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
                      <Select {...selectProps} options={currencyOptions} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Commodity"
                      name="commodity"
                      rules={[
                        {
                          required: true,
                          message: "Commodity is required",
                        },
                      ]}
                    >
                      <Select {...selectProps} options={commodityOptions} />
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
                    <Form.Item label="Confidence Level" name="confidence_level">
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
                  <Col span={12}>
                    <Form.Item label="Area Unit" name="area_size_unit">
                      <Select {...selectProps} options={areaUnitOptions} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Weight Measurement Unit"
                      name="volume_measurement_unit"
                    >
                      <Select {...selectProps} options={volumeUnitOptions} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col span={24}>
              <Card title="Drivers Value">
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Form.Item
                      label={areaUnitName ? `Area (${areaUnitName})` : "Area"}
                      name="area"
                    >
                      <InputNumber />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label={
                        volumeUnitName ? `Volume (${volumeUnitName})` : "Volume"
                      }
                      name="volume"
                    >
                      <InputNumber />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label={
                        currencyUnitName
                          ? `Price (${currencyUnitName})`
                          : "Price"
                      }
                      name="price"
                    >
                      <InputNumber />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item
                      label={
                        copUnitName
                          ? `Cost of Production (${copUnitName})`
                          : "Cost of Production"
                      }
                      name="cost_of_production"
                    >
                      <InputNumber />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={
                        currencyUnitName
                          ? `Diversified Income (${currencyUnitName})`
                          : "Diversified Income"
                      }
                      name="diversified_income"
                    >
                      <InputNumber />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Form>
      )}
    </Modal>
  );
};

export default ReferenceDataForm;
