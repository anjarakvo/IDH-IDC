import React, { useState, useEffect, useMemo } from "react";
import { SegmentSelector } from "./";
import { getFunctionDefaultValue } from "../components";

const ChartBigImpact = ({ dashboardData }) => {
  const [selectedSegment, setSelectedSegment] = useState(null);

  useEffect(() => {
    if (dashboardData.length > 0) {
      setSelectedSegment(dashboardData[0].id);
    }
  }, [dashboardData]);

  const chartData = useMemo(() => {
    if (!dashboardData.length || !selectedSegment) {
      return [];
    }
    const currentSegmentData = dashboardData.find(
      (d) => d.id === selectedSegment
    );
    const focusCommodityData = currentSegmentData.answers.filter(
      (a) => a.commodityFocus
    );
    const driverQuestion = focusCommodityData.find(
      (a) => a.name === "current" && !a.parent
    );
    const indicators = driverQuestion.question.childrens;
    const currentValues = focusCommodityData.filter(
      (d) => d.name === "current"
    );
    const currentValuesArray = currentValues.reduce((c, d) => {
      return [...c, { id: `custom-${d.questionId}`, value: d.value || 0 }];
    }, []);
    // populate impact values for focus commodity
    const transformedData = indicators.map((ind) => {
      const feasibleValue = focusCommodityData.find(
        (fcd) => fcd.questionId === ind.id && fcd.name === "feasible"
      );
      if (feasibleValue) {
        const customValueId = `custom-${feasibleValue.questionId}`;
        const replacedCurrentValues = [
          ...currentValuesArray.filter((c) => c.id !== customValueId),
          {
            id: customValueId,
            value: feasibleValue.value || 0,
          },
        ];
        const newTotalValue = getFunctionDefaultValue(
          driverQuestion.question,
          "custom",
          replacedCurrentValues
        );
        const value =
          ((newTotalValue - currentSegmentData.total_current_focus_income) /
            currentSegmentData.total_current_focus_income) *
          100;
        return {
          name: ind.text,
          value: value,
        };
      }
      return {
        name: ind.text,
        value: 0,
      };
    });
    // add diversified value
    transformedData.push({
      name: "Diversified Income",
      value:
        (currentSegmentData.total_feasible_diversified_income /
          currentSegmentData.total_current_diversified_income) *
        100,
    });

    console.log(transformedData, dashboardData);
  }, [dashboardData, selectedSegment]);

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
