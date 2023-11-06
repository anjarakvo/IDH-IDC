import React, { useState, useEffect } from "react";
import { SegmentSelector } from "./";

const ChartBigImpact = ({ dashboardData }) => {
  const [selectedSegment, setSelectedSegment] = useState(null);

  useEffect(() => {
    if (dashboardData.length > 0) {
      setSelectedSegment(dashboardData[0].id);
    }
  }, [dashboardData]);

  return (
    <div>
      <SegmentSelector
        dashboardData={dashboardData}
        selectedSegment={selectedSegment}
        setSelectedSegment={setSelectedSegment}
      />
    </div>
  );
};

export default ChartBigImpact;
