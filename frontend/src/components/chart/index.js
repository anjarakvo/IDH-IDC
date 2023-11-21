import React, { useRef } from "react";
import { Col, Card, Row } from "antd";
import ReactECharts from "echarts-for-react";
import { Bar, BarStack, ColumnBar } from "./options";
import { Easing } from "./options/common";
import { SaveAsImageButton } from "../utils";

export const generateOptions = (
  { type, data, chartTitle, percentage, extra, targetData },
  series,
  legend,
  horizontal,
  highlighted,
  axis,
  grid
) => {
  switch (type) {
    case "BARSTACK":
      return BarStack({
        data: data,
        percentage: percentage,
        chartTitle: chartTitle,
        extra: extra,
        horizontal: horizontal,
        highlighted: highlighted,
        targetData: targetData,
      });
    case "COLUMN-BAR":
      return ColumnBar({
        data: data,
        percentage: percentage,
        chartTitle: chartTitle,
        extra: extra,
        horizontal: horizontal,
        highlighted: highlighted,
      });
    default:
      return Bar({
        data: data,
        percentage: percentage,
        chartTitle: chartTitle,
        extra: extra,
        horizontal: horizontal,
        grid: grid,
      });
  }
};

const loadingStyle = {
  text: "Loading",
  color: "#1890ff",
  textColor: "rgba(0,0,0,.85)",
  maskColor: "rgba(255, 255, 255, 1)",
  zlevel: 0,
  fontSize: "1.17em",
  showSpinner: true,
  spinnerRadius: 10,
  lineWidth: 5,
  fontWeight: "500",
  fontStyle: "normal",
  fontFamily: "Poppins",
};

const Chart = ({
  type,
  percentage = false,
  title = "",
  subTitle = "",
  height = 450,
  span = 12,
  data,
  extra = {},
  wrapper = true,
  axis = null,
  horizontal = false,
  styles = {},
  series,
  legend,
  callbacks = null,
  highlighted,
  loading = false,
  loadingOption = loadingStyle,
  grid = {},
  override = false,
  affix = false,
  targetData = [], // to show income target symbol
}) => {
  const elementRef = useRef();

  const chartTitle = wrapper ? {} : { title: title, subTitle: subTitle };
  const option = generateOptions(
    {
      type: type,
      data: data,
      chartTitle: chartTitle,
      percentage: percentage,
      extra: extra,
      targetData: targetData,
    },
    series,
    legend,
    horizontal,
    highlighted,
    axis,
    grid
  );
  const onEvents = {
    click: (e) => {
      if (callbacks?.onClick) {
        callbacks.onClick(e.data?.cbParam);
      }
    },
  };
  let chartOptions = {
    option: option,
    notMerge: true,
    style: { height: height - 50, width: "100%" },
    onEvents: onEvents,
    showLoading: loading,
    loadingOption: loadingOption,
  };
  if (override) {
    chartOptions = {
      ...chartOptions,
      option: { ...override, ...Easing },
    };
  }
  const affixStyle = affix
    ? {
        position: "fixed",
        right: 0,
        width: "100%",
        paddingRight: "5rem",
      }
    : {};
  if (wrapper) {
    return (
      <Col
        sm={24}
        md={span * 2}
        lg={span}
        style={{ height: height, ...styles, ...affixStyle }}
      >
        <Card
          ref={elementRef}
          title={
            <Row style={{ width: "100%" }} align="middle">
              <Col span={14}>
                <h3 className="segment-group chart-title">{title}</h3>
              </Col>
              <Col span={10} align="end" style={{ float: "right" }}>
                <SaveAsImageButton elementRef={elementRef} filename={title} />
              </Col>
            </Row>
          }
          className="chart-container"
        >
          <ReactECharts {...chartOptions} />
        </Card>
      </Col>
    );
  }
  return <ReactECharts {...chartOptions} />;
};

export default Chart;
