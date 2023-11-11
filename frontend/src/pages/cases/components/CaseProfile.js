import React, { useState, useEffect, useMemo } from "react";
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
import uniqBy from "lodash/uniqBy";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

const CaseForm = ({
  setCaseTitle,
  selectedCountry,
  setSelectedCountry,
  filteredCurrencyOptions,
}) => {
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
        label="Country"
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
          onChange={setSelectedCountry}
        />
      </Form.Item>
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <Form.Item
            label="Commodity"
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
            label="Currency"
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
              options={filteredCurrencyOptions}
              {...selectProps}
              disabled={!selectedCountry}
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
        label={`${indexLabel} Commodity`}
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
  setCurrentCase,
}) => {
  const [form] = Form.useForm();
  const [secondary, setSecondary] = useState(commodityList.length > 2);
  const [tertiary, setTertiary] = useState(commodityList.length > 3);
  const [isSaving, setIsSaving] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { caseId } = useParams();
  const [selectedCountry, setSelectedCountry] = useState(null);

  const filteredCurrencyOptions = useMemo(() => {
    if (!selectedCountry) {
      return uniqBy(currencyOptions, "value");
    }
    const countryCurrency = currencyOptions.find(
      (co) => co.country === selectedCountry
    );
    // set default currency value
    form.setFieldsValue({ currency: countryCurrency.value });
    // TODO: Wrong format when store to db
    let additonalCurrencies = currencyOptions.filter((co) =>
      ["eur", "usd"].includes(co.value.toLowerCase())
    );
    additonalCurrencies = uniqBy(additonalCurrencies, "value");
    return [countryCurrency, ...additonalCurrencies];
  }, [selectedCountry, form]);

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
      if (formData?.country) {
        setSelectedCountry(formData.country);
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
      commodity_type: "focus",
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
          commodity_type: "secondary",
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
          commodity_type: "tertiary",
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
    commodities = [
      ...commodities,
      {
        ...initial_commodities,
        commodity_type: "diversified",
        commodity: null,
      },
    ];
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

    const paramCaseId = caseId ? caseId : currentCaseId;
    const apiCall =
      currentCaseId || caseId
        ? api.put(`case/${paramCaseId}`, payload)
        : api.post("case", payload);
    apiCall
      .then((res) => {
        const { data } = res;
        setCurrentCaseId(data?.id);
        setCurrentCase(data);
        const transformCommodities = commodities.map((cm) => {
          const findCm = data.case_commodities.find(
            (dcm) => dcm.commodity_type === cm.commodity_type
          );
          return {
            ...cm,
            case_commodity: findCm.id,
          };
        });
        setTimeout(() => {
          setCommodityList(transformCommodities);
          setFinished([...completed, "Case Profile"]);
        }, 500);
        setPage("Income Driver Data Entry");
      })
      .catch((e) => {
        console.error(e);
        messageApi.open({
          type: "error",
          content: "Failed to save case profile.",
        });
        setFinished(completed);
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
            <CaseForm
              setCaseTitle={setCaseTitle}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              filteredCurrencyOptions={filteredCurrencyOptions}
            />
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
