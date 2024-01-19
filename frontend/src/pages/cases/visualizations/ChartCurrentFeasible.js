import React, { useMemo } from "react";
import Chart from "../../../components/chart";
import {
  incomeTargetChartOption,
  Legend,
  Color,
  TextStyle,
  thousandFormatter,
  AxisShortLabelFormatter,
  backgroundColor,
  Easing,
  LabelStyle,
} from "../../../components/chart/options/common";

const seriesTmp = [
  {
    key: "total_current_revenue_focus_commodity",
    name: "Current Revenue\nFocus Commodity",
    type: "bar",
    stack: "current",
    color: "#4f9290",
  },
  {
    key: "total_feasible_revenue_focus_commodity",
    name: "Feasible Revenue\nFocus Commodity",
    type: "bar",
    stack: "feasible",
    color: "#61adaa",
  },
  {
    key: "total_current_diversified_income",
    name: "Current Diversified Income",
    type: "bar",
    stack: "current",
    color: "#48d985",
  },
  {
    key: "total_feasible_diversified_income",
    name: "Feasible Diversified Income",
    type: "bar",
    stack: "feasible",
    color: "#a5ecc3",
  },
  {
    key: "total_current_focus_commodity_cost_of_production",
    name: "Current Focus Commodity\nCosts of Production",
    type: "bar",
    stack: "current",
    color: "#ff010e",
  },
  {
    key: "total_feasible_focus_commodity_cost_of_production",
    name: "Feasible Focus Commodity\nCosts of Production",
    type: "bar",
    stack: "feasible",
    color: "#ff8289",
  },
  {
    key: "total_current_income",
    name: "Nett Current Income",
    type: "line",
    symbol: "diamond",
    symbolSize: 15,
    color: "#000",
  },
  {
    key: "total_feasible_income",
    name: "Nett Feasible Income",
    type: "line",
    symbol: "circle",
    symbolSize: 12,
    color: "#787d87",
  },
];

const getOptions = ({
  xAxis = { name: "", axisLabel: {} },
  yAxis = { name: "", min: 0, max: 0 },
  origin = [],
  series = [],
  showLabel = false,
}) => {
  const legends = series.map((x) => x.name);
  const xAxisData = origin.map((x) => x.name);

  const options = {
    legend: {
      ...Legend,
      data: legends,
      top: 15,
      left: "right",
      orient: "vertical",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params) {
        let res = "<div>";
        res += "<b>" + params[0].axisValueLabel + "</b>";
        res += "<ul style='list-style-type: none; margin: 0; padding: 0;'>";
        params.forEach((param) => {
          res += "<li>";
          res += "<span>";
          res += param.marker;
          res += param.seriesName;
          res += "</span>";
          res +=
            "<b style='float: right; margin-left: 12px;'>" +
            thousandFormatter(param.value) +
            "</b>";
          res += "</li>";
        });
        res += "</ul>";
        res += "</div>";
        return res;
      },
      backgroundColor: "#ffffff",
      ...TextStyle,
    },
    grid: {
      top: 25,
      left: 50,
      right: 190,
      bottom: 25,
      show: true,
      containLabel: true,
      label: {
        color: "#222",
        ...TextStyle,
      },
    },
    xAxis: {
      ...xAxis,
      nameTextStyle: { ...TextStyle },
      nameLocation: "middle",
      nameGap: 50,
      boundaryGap: true,
      type: "category",
      data: xAxisData,
      axisLabel: {
        width: 100,
        interval: 0,
        overflow: "break",
        ...TextStyle,
        color: "#4b4b4e",
        formatter: AxisShortLabelFormatter?.formatter,
        ...xAxis.axisLabel,
      },
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: {
      ...yAxis,
      type: "value",
      nameTextStyle: { ...TextStyle },
      nameLocation: "middle",
      nameGap: 75,
      axisLabel: {
        formatter: (e) => thousandFormatter(e),
        ...TextStyle,
        color: "#9292ab",
      },
    },
    series: series.map((s) => {
      if (s.type === "line") {
        return s;
      }
      return {
        ...s,
        label: {
          ...LabelStyle.label,
          show: showLabel,
          position: "right",
        },
      };
    }),
    ...Color,
    ...backgroundColor,
    ...Easing,
  };
  return options;
};

const ChartCurrentFeasible = ({
  dashboardData = [],
  currentCase,
  showLabel = false,
}) => {
  const chartData = useMemo(() => {
    return seriesTmp.map((tmp) => {
      const data = dashboardData.map((d) => {
        return {
          name: d.name,
          value: d?.[tmp.key] ? Math.round(d[tmp.key]) : 0,
        };
      });
      let res = {
        ...tmp,
        emphasis: {
          focus: "series",
        },
        data: data,
      };
      if (tmp.type === "line") {
        res = {
          ...incomeTargetChartOption,
          ...res,
        };
      }
      return res;
    });
  }, [dashboardData]);

  return (
    <Chart
      wrapper={false}
      type="BAR"
      loading={!chartData.length}
      override={getOptions({
        series: chartData,
        origin: dashboardData,
        yAxis: { name: `Income (${currentCase.currency})` },
        xAxis:
          dashboardData?.length > 2
            ? { axisLabel: { rotate: 45, margin: 20 } }
            : {},
        showLabel: showLabel,
      })}
    />
  );
};

export default ChartCurrentFeasible;
