import React from "react";
import Chart from "../../../components/chart";

const ChartScenarioModeling = ({ data = [], targetChartData = [] }) => {
  return (
    <div>
      <Chart
        wrapper={false}
        type="BARSTACK"
        data={data}
        targetData={targetChartData}
        loading={!data.length}
      />
    </div>
  );
};

export default ChartScenarioModeling;
