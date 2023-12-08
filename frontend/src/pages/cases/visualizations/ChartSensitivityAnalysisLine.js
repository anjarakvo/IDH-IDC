import React, { useMemo } from "react";
import { thousandFormatter } from "../../../components/chart/options/common";
import { getFunctionDefaultValue } from "../components";
import { range } from "lodash";

/**
 * NOTE
 * Target = 9001,
 * Diversified = 9002
 */
const yAxisCalculation = {
  "#2": "#9001 - #9002 + #5  / (#4 * #3)", // area
  "#3": "#9001 - #9002 + #5  / (#4 * #2)", // volume
  "#4": "#9001 - #9002 + #5  / (#3 * #2)", // price
  "#5": "#9001 - #9002 - (#2 * #4 * #3)", // CoP
  "#9002": "#9001 + #5 - (#2 * #4 * #3)", // diversified
};

const getOptions = ({
  xAxis = { name: "", min: 0, max: 0 },
  yAxis = { name: "", min: 0, max: 0 },
  answers = [],
  binCharts = [],
  min = 0,
  max = 0,
  diversified = 0,
  target = 0,
  // origin = [],
}) => {
  const xAxisData = [
    ...range(xAxis.min, xAxis.max, (xAxis.max - xAxis.min) / 4).map((x) =>
      x.toFixed(2)
    ),
    xAxis.max.toFixed(2),
  ];
  const yAxisData = [
    ...range(yAxis.min, yAxis.max, (yAxis.max - yAxis.min) / 4).map((x) =>
      x.toFixed(2)
    ),
    yAxis.max.toFixed(2),
  ];

  const yAxisId =
    yAxis.name === "Diversified"
      ? 9002
      : answers.find((a) => a.name === yAxis.name)?.qid;
  const yAxisDefaultValue = { default_value: yAxisCalculation[`#${yAxisId}`] };

  const series = binCharts.map((b) => {
    const bId =
      b.binName === "Diversified"
        ? 9002
        : answers.find((a) => a.name === b.binName)?.qid;
    const dt = xAxisData
      .map((h) => {
        let newValues = answers
          .filter((m) => m.name !== b.binName)
          .map((m) => {
            if (m.name === xAxis.name) {
              return { ...m, value: h };
            }
            return m;
          })
          .map((x) => ({
            id: `c-${x.qid}`,
            value: x.value,
          }));
        newValues = [
          ...newValues,
          {
            id: "c-9001",
            value: target,
          },
          {
            id: "c-9002",
            value: diversified,
          },
          {
            id: `c-${bId}`,
            value: b.binValue,
          },
        ];
        console.log(newValues);
        const newYAxisValue = getFunctionDefaultValue(
          yAxisDefaultValue,
          "c",
          newValues
        );
        return newYAxisValue.toFixed(2);
      })
      .flatMap((x) => x);
    return {
      type: "line",
      smooth: true,
      stack: yAxis.name,
      data: dt,
      label: {
        show: true,
        color: "#fff",
        padding: 5,
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    };
  });

  const options = {
    tooltip: {
      position: "top",
      formatter: (params) => {
        const value = params.value[2];
        const x = params.value[0];
        const y = params.value[1];
        let text = `<span style="color: #000;">${value}</span><br>`;
        text += `<span>${xAxis.name}: ${x}</span><br>`;
        text += `<span>${yAxis.name}: ${y}</span><br>`;
        return text;
      },
    },
    grid: {
      // height: "50%",
      top: "10%",
    },
    xAxis: {
      name: `${xAxis.name} (${xAxis.unitName})`,
      nameLocation: "middle",
      nameGap: 40,
      type: "category",
      data: xAxisData,
      splitArea: {
        show: true,
      },
      axisLabel: {
        formatter: (e) => thousandFormatter(e),
      },
    },
    yAxis: {
      name: `${yAxis.name} (${yAxis?.unitName})`,
      type: "category",
      data: yAxisData,
      splitArea: {
        show: true,
      },
      axisLabel: {
        formatter: (e) => thousandFormatter(e),
      },
    },
    visualMap: {
      min: min,
      max: max,
      calculable: true,
      orient: "horizontal",
      left: "center",
      show: false,
      bottom: "15%",
      color: ["#007800", "#ffffff"],
    },
    series: series,
  };
  return options;
};

const ChartSensitivityAnalysisLine = ({ data, segment, origin }) => {
  const binningData = useMemo(() => {
    if (!segment?.id) {
      return {};
    }
    const bins = Object.keys(data)
      .map((x) => {
        const [segmentId, name] = x.split("_");
        return { id: parseInt(segmentId), name, value: data[x] };
      })
      .filter((x) => x.id === segment.id && x.value);
    const answers = segment.answers.filter(
      (s) => s.question.parent === 1 && s.name === "current" && s.commodityFocus
    );
    const binCharts = bins.filter(
      (b) => b.name.startsWith("binning-value") && b.value
    );
    const binName =
      bins.find((b) => b.name === "binning-driver-name")?.value || false;
    const xAxisName = bins.find((b) => b.name === "x-axis-driver")?.value || "";
    const yAxisName = bins.find((b) => b.name === "y-axis-driver")?.value || "";

    return {
      binCharts: binName
        ? binCharts.map((b) => ({
            binName: binName,
            binValue: b.value,
            unitName: origin.find((or) => or.name === binName)?.unitName,
          }))
        : [],
      xAxis: {
        name: xAxisName,
        min: bins.find((b) => b.name === "x-axis-min-value")?.value || 0,
        max: bins.find((b) => b.name === "x-axis-max-value")?.value || 0,
        unitName: origin.find((or) => or.name === xAxisName)?.unitName,
      },
      yAxis: {
        name: yAxisName,
        min: bins.find((b) => b.name === "y-axis-min-value")?.value || 0,
        max: bins.find((b) => b.name === "y-axis-max-value")?.value || 0,
        unitName: origin.find((or) => or.name === yAxisName)?.unitName,
      },
      answers: answers.map((s) => ({
        qid: s.question.id,
        name: s.question.text,
        value: s.value,
      })),
      incomeQuestion: segment.answers.find(
        (s) =>
          s.question.parent === null && s.name === "current" && s.commodityFocus
      ),
      min: segment.total_current_income,
      max: segment.total_feasible_income,
      diversified: segment.total_current_diversified_income,
      diversified_feasible: segment.total_feasible_diversified_income,
      target: segment.target,
    };
  }, [data, segment, origin]);
  console.log(binningData);
  console.log("OPTIONS", getOptions({ ...binningData, origin: origin }));

  return <div>ChartSensitivityAnalysisLine</div>;
};

export default ChartSensitivityAnalysisLine;
