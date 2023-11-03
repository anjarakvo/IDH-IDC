import React from "react";
import { Col, Card } from "antd";
import ReactECharts from "echarts-for-react";
import { Bar, BarStack } from "./options";
import { Easing } from "./options/common";

export const generateOptions = (
  { type, data, chartTitle, percentage, extra },
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
}) => {
  const chartTitle = wrapper ? {} : { title: title, subTitle: subTitle };
  const option = generateOptions(
    {
      type: type,
      data: data,
      chartTitle: chartTitle,
      percentage: percentage,
      extra: extra,
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
  if (wrapper) {
    return (
      <Col
        sm={24}
        md={span * 2}
        lg={span}
        style={{ height: height, ...styles }}
      >
        <Card
          title={<h3 className="segment-group">{title}</h3>}
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
