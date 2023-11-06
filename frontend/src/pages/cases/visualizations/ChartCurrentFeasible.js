import React, { useMemo } from "react";
import Chart from "../../../components/chart";

const ChartCurrentFeasible = ({ dashboardData = [] }) => {
  const chartData = useMemo(() => {
    return dashboardData.reduce((c, d) => {
      return [
        ...c,
        {
          name: `Current\n${d.name}`,
          title: `Current\n${d.name}`,
          stack: [
            {
              name: "Cost of Production",
              title: "Cost of Production",
              value: d.total_current_cost,
              total: d.total_current_cost,
              order: 1,
              color: "#ff5d00",
            },
            {
              name: "Focus Crop Revenue",
              title: "Focus Crop Revenue",
              value: d.total_current_focus_income,
              total: d.total_current_focus_income,
              color: "#47d985",
              order: 2,
            },
            {
              name: "Diversified Income",
              title: "Diversified Income",
              value: d.total_current_diversified_income,
              total: d.total_current_diversified_income,
              color: "#fdc305",
              order: 3,
            },
          ],
        },
        {
          name: `Feasible\n${d.name}`,
          title: `Feasible\n${d.name}`,
          stack: [
            {
              name: "Cost of Production",
              title: "Cost of Production",
              value: d.total_feasible_cost,
              total: d.total_feasible_cost,
              order: 1,
            },
            {
              name: "Focus Crop Revenue",
              title: "Focus Crop Revenue",
              value: d.total_feasible_focus_income,
              total: d.total_feasible_focus_income,
              order: 2,
            },
            {
              name: "Diversified Income",
              title: "Diversified Income",
              value: d.total_feasible_diversified_income,
              total: d.total_feasible_diversified_income,
              order: 3,
            },
          ],
        },
      ];
    }, []);
  }, [dashboardData]);

  return (
    <Chart wrapper={false} type="BARSTACK" data={chartData} affix={true} />
  );
};

export default ChartCurrentFeasible;
