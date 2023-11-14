import React, { useMemo, useState } from "react";
import Chart from "../../../components/chart";
import { range } from "lodash";
import { getFunctionDefaultValue } from "../components";
import { Space } from "antd";

const getOptions = ({
  xAxis = { name: "", min: 0, max: 0 },
  yAxis = { name: "", min: 0, max: 0 },
  binName = "",
  binValue = 0,
  answers = [],
  incomeQuestion = {},
  min = 0,
  max = 0,
  diversified = 0,
  target = 0,
  origin = [],
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

  const dt = xAxisData
    .map((h) => {
      return yAxisData.map((d) => {
        const newValues = answers
          .map((m) => {
            if (m.name === binName) {
              return { ...m, value: binValue };
            }
            if (m.name === yAxis.name) {
              return { ...m, value: d };
            }
            if (m.name === xAxis.name) {
              return { ...m, value: h };
            }
            return m;
          })
          .map((x) => ({
            id: `c-${x.qid}`,
            value: x.value,
          }));
        const newTotalValue = getFunctionDefaultValue(
          incomeQuestion.question,
          "c",
          newValues
        );
        return [h, d, (newTotalValue + diversified).toFixed(2)];
      });
    })
    .flatMap((x) => x);

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
      min: min,
      max: max,
      calculable: true,
      orient: "horizontal",
      left: "center",
      show: false,
      bottom: "15%",
      color: ["#007800", "#ffffff"],
    },
    series: [
      {
        type: "heatmap",
        data: dt,
        /*
        markLine: {
          lineStyle: {
            type: "solid",
          },
          data: [
            { xAxis: xAxis.min, yAxis: 0 },
            { xAxis: xAxis.max, yAxis: 0 },
            { xAxis: 0, yAxis: yAxis.min },
            { xAxis: 0, yAxis: yAxis.max },
          ],
        },
        */
        label: {
          show: true,
          color: "#fff",
          padding: 5,
          formatter: (params) => {
            const binRange = origin.find((x) => x.name === binName);
            const isOutRange =
              binRange.current > binRange.feasible
                ? binValue > binRange.current || binValue < binRange.feasible
                : binValue < binRange.current || binValue > binRange.feasible;
            if (isOutRange) {
              return `{out|${params.value[2]}}`;
            }
            const value = params.value[2];
            const xAxisRange = origin.find((x) => x.name === xAxis.name);
            const inX =
              xAxisRange?.current < xAxisRange?.feasible
                ? params.value[0] >= xAxisRange?.current &&
                  params.value[0] <= xAxisRange?.feasible
                : params.value[0] <= xAxisRange?.current &&
                  params.value[0] >= xAxisRange?.feasible;
            const yAxisRange = origin.find((x) => x.name === yAxis.name);
            const inY =
              yAxisRange?.current < yAxisRange?.feasible
                ? params.value[1] >= yAxisRange?.current &&
                  params.value[1] <= yAxisRange?.feasible
                : params.value[1] <= yAxisRange?.current &&
                  params.value[1] >= yAxisRange?.feasible;
            if (!inX || !inY) {
              return `{out|${value}}`;
            }
            return value >= target ? `{up|${value}}` : `{down|${value}}`;
          },
          rich: {
            up: {
              color: "#fff",
              backgroundColor: "green",
              padding: 5,
            },
            out: {
              color: "#fff",
              backgroundColor: "gray",
              padding: 5,
            },
            down: {
              color: "#fff",
              backgroundColor: "red",
              padding: 5,
            },
          },
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

const legends = [
  {
    color: "#F50902",
    text: "Income target not reached",
  },
  {
    color: "#808080",
    text: "Income target reached outside feasible values",
  },
  {
    color: "#218400",
    text: "Income target reached within feasible values",
  },
];

const ChartBinningHeatmap = ({ segment, data, origin }) => {
  const [label, setLabel] = useState(null);

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
    // label
    const label = `The following tables represent income levels for levels of ${xAxisName}
      and ${yAxisName}, for a each ${binName ? binName : ""} bin.`;
    setLabel(label);

    return {
      binCharts: binName
        ? binCharts.map((b) => ({
            binName: binName,
            binValue: b.value,
          }))
        : [],
      xAxis: {
        name: xAxisName,
        min: bins.find((b) => b.name === "x-axis-min-value")?.value || 0,
        max: bins.find((b) => b.name === "x-axis-max-value")?.value || 0,
      },
      yAxis: {
        name: yAxisName,
        min: bins.find((b) => b.name === "y-axis-min-value")?.value || 0,
        max: bins.find((b) => b.name === "y-axis-max-value")?.value || 0,
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
      target: segment.target,
    };
  }, [data, segment]);

  return (
    <div>
      {binningData.binCharts?.length ? (
        <Space direction="vertical">
          <div>{label}</div>
          <div style={{ float: "right" }}>
            <Space direction="vertical">
              {legends.map((l, li) => (
                <Space key={li}>
                  <div
                    style={{ backgroundColor: l.color, width: 16, height: 16 }}
                  />
                  <div>{l.text}</div>
                </Space>
              ))}
            </Space>
          </div>
        </Space>
      ) : (
        ""
      )}
      {binningData.binCharts.map((b, key) => (
        <div key={key}>
          <h3>
            Income Levels for {b.binName} : {b.binValue}
          </h3>
          <Chart
            height={350}
            wrapper={false}
            type="BAR"
            override={getOptions({ ...binningData, ...b, origin: origin })}
          />
        </div>
      ))}
    </div>
  );
};
export default ChartBinningHeatmap;
