import React, { useMemo } from "react";
import Chart from "../../../components/chart";
import { filter, range } from "lodash";
import { getFunctionDefaultValue } from "../components";

const getOptions = (
  {
    xAxis = { name: "", min: 0, max: 0 },
    yAxis = { name: "", min: 0, max: 0 },
  },
  currentIncomeIndicators = [],
  incomeQuestion = {}
) => {
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

  const dt = xAxisData
    .map((h) => {
      return yAxisData.map((d) => {
        const fixedIndicators = filter(
          currentIncomeIndicators,
          (x) => x.name === yAxis.name || x.name === xAxis.name
        );
        const modifiedIndicators = filter(
          currentIncomeIndicators,
          (x) => x.name !== yAxis.name && x.name !== xAxis.name
        ).map((m) => {
          if (m.name === yAxis.name) {
            return { ...m, value: d };
          }
          if (m.name === xAxis.name) {
            return { ...m, value: h };
          }
          return m;
        });
        const replaced = [...fixedIndicators, ...modifiedIndicators].map(
          (x) => ({ id: `c-${x.id}`, value: x.value })
        );
        const newTotalValue = getFunctionDefaultValue(
          incomeQuestion.question,
          "c",
          replaced
        );
        return [h, d, newTotalValue];
      });
    })
    .flatMap((x) => x);

  const options = {
    tooltip: {
      position: "top",
    },
    grid: {
      height: "50%",
      top: "10%",
    },
    xAxis: {
      name: xAxis.name,
      type: "category",
      data: xAxisData,
      splitArea: {
        show: true,
      },
    },
    yAxis: {
      name: yAxis.name,
      type: "category",
      data: yAxisData,
      splitArea: {
        show: true,
      },
    },
    visualMap: {
      min: 0,
      max: 10,
      calculable: true,
      orient: "horizontal",
      left: "center",
      bottom: "15%",
    },
    series: [
      {
        type: "heatmap",
        data: dt,
        label: {
          show: true,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  return options;
};

const ChartBinningHeatmap = ({ hidden, segment = {}, data = {} }) => {
  const binningData = useMemo(() => {
    const bins = Object.keys(data)
      .map((x) => {
        const [segmentId, name] = x.split("_");
        return { id: parseInt(segmentId), name, value: data[x] };
      })
      .filter((x) => x.id === segment.id && x.value);
    return {
      xAxis: {
        name: bins.find((b) => b.name === "x-axis-driver")?.value || "",
        min: bins.find((b) => b.name === "x-axis-min-value")?.value || 0,
        max: bins.find((b) => b.name === "x-axis-max-value")?.value || 0,
      },
      yAxis: {
        name: bins.find((b) => b.name === "y-axis-driver")?.value || "",
        min: bins.find((b) => b.name === "y-axis-min-value")?.value || 0,
        max: bins.find((b) => b.name === "y-axis-max-value")?.value || 0,
      },
    };
  }, [data, segment]);

  const currentIncomeIndicators = useMemo(() => {
    if (!segment?.answers) {
      return [];
    }
    const answers = segment.answers.filter(
      (s) => s.question.parent === 1 && s.name === "current" && s.commodityFocus
    );
    return answers.map((s) => ({
      qid: s.question.id,
      name: s.question.text,
      value: s.value,
    }));
  }, [segment]);

  const incomeQuestion = useMemo(() => {
    if (!segment?.answers) {
      return null;
    }
    return segment.answers.find(
      (s) =>
        s.question.parent === null && s.name === "current" && s.commodityFocus
    );
  }, [segment]);

  const chartData = useMemo(() => {
    return getOptions(binningData, currentIncomeIndicators, incomeQuestion);
  }, [binningData, currentIncomeIndicators, incomeQuestion]);

  return (
    <div style={{ display: hidden ? "none" : "" }}>
      <Chart wrapper={false} type="BAR" override={chartData} />
    </div>
  );
};
export default ChartBinningHeatmap;
