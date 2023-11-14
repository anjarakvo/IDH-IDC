import React, { useMemo } from "react";
import Chart from "../../../components/chart";

const ChartIncomeGap = ({ dashboardData }) => {
  const chartData = useMemo(() => {
    return dashboardData.reduce((c, d) => {
      const target = d?.target || 0;
      return [
        ...c,
        {
          name: `Current\n${d.name}`,
          value: target - d.total_current_income,
          total: target - d.total_current_income,
          color: "#854634",
        },
        {
          name: `Feasible\n${d.name}`,
          value: target - d.total_feasible_income,
          total: target - d.total_feasible_income,
          color: "#ff6c19",
        },
      ];
    }, []);
  }, [dashboardData]);

  return <Chart wrapper={false} type="BAR" data={chartData} affix={true} />;
};

export default ChartIncomeGap;
