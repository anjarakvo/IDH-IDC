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

export const getColumnStackBarOptions = ({
  xAxis = { name: "", axisLabel: {} },
  yAxis = { name: "", min: 0, max: 0 },
  origin = [],
  series = [],
  showLabel = false,
  grid = {},
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
      top: grid?.top ? grid.top : 25,
      left: grid?.left ? grid.left : 50,
      right: grid?.right ? grid.right : 190,
      bottom: grid?.bottom ? grid.bottom : 25,
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
      s = {
        ...s,
        barMaxWidth: 50,
        emphasis: {
          focus: "series",
        },
      };
      if (s.type === "line") {
        return { ...incomeTargetChartOption, ...s };
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

export { default as ChartBigImpact } from "./ChartBigImpact";
export { default as ChartBinningHeatmap } from "./ChartBinningHeatmap";
export { default as ChartCurrentFeasible } from "./ChartCurrentFeasible";
export { default as ChartIncomeGap } from "./ChartIncomeGap";
export { default as ChartMonetaryContribution } from "./ChartMonetaryContribution";
export { default as SegmentSelector } from "./SegmentSelector";
export { default as ChartExploreBreakdownDrivers } from "./ChartExploreBreakdownDrivers";
export { default as DriverDropdown } from "./DriverDropdown";
export { default as ChartIncomeLevelPerCommodities } from "./ChartIncomeLevelPerCommodities";
export { default as ChartScenarioModeling } from "./ChartScenarioModeling";
export { default as ChartSensitivityAnalysisLine } from "./ChartSensitivityAnalysisLine";
