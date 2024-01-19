import React, { useMemo } from "react";
import Chart from "../../../components/chart";
import { getColumnStackBarOptions } from ".";

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
      return {
        ...tmp,
        data: data,
      };
    });
  }, [dashboardData]);

  return (
    <Chart
      wrapper={false}
      type="BAR"
      loading={!chartData.length}
      override={getColumnStackBarOptions({
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
