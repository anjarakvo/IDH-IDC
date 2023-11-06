import React, { useMemo } from "react";
import Chart from "../../../components/chart";

const ChartIncomeGap = ({ dashboardData }) => {
  const chartData = useMemo(() => {
    return dashboardData.reduce((c, d) => {
      return [
        ...c,
        {
          name: `Current\n${d.name}`,
          value: d.total_current_income,
          total: d.total_current_income,
          color: "#854634",
        },
        {
          name: `Feasible\n${d.name}`,
          value: d.total_feasible_income,
          color: "#ff6c19",
        },
      ];
    }, []);
  }, [dashboardData]);

  return <Chart wrapper={false} type="BAR" data={chartData} affix={true} />;
};

export default ChartIncomeGap;
