import React from "react";
import Chart from "../../../components/chart";

const ChartScenarioModeling = ({ data = [] }) => {
  return (
    <div>
      <Chart
        wrapper={false}
        type="BARSTACK"
        data={data}
        loading={!data.length}
      />
    </div>
  );
};

export default ChartScenarioModeling;
