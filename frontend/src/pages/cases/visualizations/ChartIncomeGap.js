import React, { useMemo } from "react";
import Chart from "../../../components/chart";

const ChartIncomeGap = ({ dashboardData, currentCase }) => {
  const chartData = useMemo(() => {
    return dashboardData.reduce((c, d) => {
      const target = d?.target || 0;
      const currentValue = target - d.total_current_income;
      const feasibleValue = target - d.total_feasible_income;
      console.log(d);
      return [
        ...c,
        {
          name: `Current\n${d.name}`,
          target: d.target,
          stack: [
            {
              name: "Diversified Income",
              title: "Diversified Income",
              value: d.total_current_diversified_income,
              total: d.total_current_diversified_income,
              color: "#49d985",
              order: 1,
            },
            {
              name: "Revenue Focus Commodity",
              title: "Revenue Focus Commodity",
              value: d.total_current_diversified_income,
              total: d.total_current_diversified_income,
              color: "#03625f",
              order: 2,
            },
          ],
        },
        {
          name: `Feasible\n${d.name}`,
          target: d.target,
          stack: [
            {
              name: "Diversified Income",
              title: "Diversified Income",
              value: d.total_feasible_diversified_income,
              total: d.total_feasible_diversified_income,
              color: "#49d985",
              order: 1,
            },
            {
              name: "Revenue Focus Commodity",
              title: "Revenue Focus Commodity",
              value: d.total_current_diversified_income,
              total: d.total_current_diversified_income,
              color: "#03625f",
              order: 2,
            },
          ],
        },
      ];
    }, []);
  }, [dashboardData]);

  return (
    <Chart
      wrapper={false}
      type="BARSTACK"
      data={chartData}
      affix={true}
      extra={{ axisTitle: { y: `Income Gap (${currentCase.currency})` } }}
    />
  );
};

export default ChartIncomeGap;
