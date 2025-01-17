import React, { useState, useEffect, useMemo } from "react";
import { Row, Col } from "antd";
import { SegmentSelector } from "./";
import { getFunctionDefaultValue } from "../components";
import { orderBy } from "lodash";
import Chart from "../../../components/chart";
import {
  AxisShortLabelFormatter,
  Legend,
  TextStyle,
  Easing,
} from "../../../components/chart/options/common";

const legendColors = ["#F9BC05", "#82b2b2", "#03625f"];

const ChartBigImpact = ({ dashboardData, showLabel = false }) => {
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
    const indicators =
      driverQuestion && driverQuestion?.question?.childrens
        ? driverQuestion.question.childrens
        : [];
    const currentValues = focusCommodityData.filter(
      (d) => d.name === "current"
    );
    const feasibleValues = focusCommodityData.filter(
      (d) => d.name === "feasible"
    );
    const currentValuesArray = currentValues.reduce((c, d) => {
      return [...c, { id: `current-${d.questionId}`, value: d.value || 0 }];
    }, []);
    const feasibleValuesArray = feasibleValues.reduce((c, d) => {
      return [...c, { id: `feasible-${d.questionId}`, value: d.value || 0 }];
    }, []);

    const feasiblePerCurrentTotalIncome =
      (currentSegmentData.total_feasible_income /
        currentSegmentData.total_current_income) *
      100;

    // populate impact values for focus commodity
    let transformedData = indicators.map((ind) => {
      const currentValue = focusCommodityData.find(
        (fcd) => fcd.questionId === ind.id && fcd.name === "current"
      );
      const feasibleValue = focusCommodityData.find(
        (fcd) => fcd.questionId === ind.id && fcd.name === "feasible"
      );
      const currentValueTemp = currentValue?.value || 0;
      const feasibleValueTemp = feasibleValue?.value || 0;
      const possibleValue =
        ((feasibleValueTemp - currentValueTemp) / currentValueTemp) * 100;

      if (currentValue && feasibleValue) {
        // Income value
        const customValueId = `current-${feasibleValue.questionId}`;
        const replacedCurrentValues = [
          ...currentValuesArray.filter((c) => c.id !== customValueId),
          {
            id: customValueId,
            value: feasibleValue.value || 0,
          },
        ];
        const newTotalValue =
          getFunctionDefaultValue(
            driverQuestion.question,
            "current",
            replacedCurrentValues
          ) + currentSegmentData.total_current_diversified_income;
        const incomeValue =
          ((newTotalValue - currentSegmentData.total_current_income) /
            currentSegmentData.total_current_income) *
          100;
        // EOL Income value

        // Additional value
        const additionalValueId = `feasible-${currentValue.questionId}`;
        const replacedFeasibleValues = [
          ...feasibleValuesArray.filter((c) => c.id !== additionalValueId),
          {
            id: additionalValueId,
            value: currentValue.value || 0,
          },
        ];
        const newAdditionalTotalValue =
          getFunctionDefaultValue(
            driverQuestion.question,
            "feasible",
            replacedFeasibleValues
          ) + currentSegmentData.total_feasible_diversified_income;
        const incomeIncreaseFeasible =
          (newAdditionalTotalValue / currentSegmentData.total_current_income) *
          100;
        const additionalValue =
          feasiblePerCurrentTotalIncome - incomeIncreaseFeasible;
        // EOL Income value
        return {
          id: ind.id,
          name: ind.text,
          income: incomeValue || 0,
          possible: possibleValue || 0,
          additional: additionalValue || 0,
        };
      }

      return {
        id: ind.id,
        name: ind.text,
        income: 0,
        possible: possibleValue,
        additional: 0,
      };
    });
    // add diversified value
    if (transformedData.length) {
      const newDiversifiedValue =
        currentSegmentData.total_current_focus_income +
        currentSegmentData.total_feasible_diversified_income;
      const newAdditionalDiversifiedValue =
        currentSegmentData.total_feasible_focus_income +
        currentSegmentData.total_current_diversified_income;
      const diversifiedIncreaseFeasible =
        (newAdditionalDiversifiedValue /
          currentSegmentData.total_current_income) *
        100;
      const additionalDiversifiedValue =
        feasiblePerCurrentTotalIncome - diversifiedIncreaseFeasible;
      transformedData.push({
        id: 9002,
        name: "Diversified Income",
        income:
          ((currentSegmentData.total_current_income - newDiversifiedValue) /
            currentSegmentData.total_current_income) *
            100 || 0,
        possible:
          ((currentSegmentData.total_feasible_diversified_income -
            currentSegmentData.total_current_diversified_income) /
            currentSegmentData.total_current_diversified_income) *
            100 || 0,
        additional: additionalDiversifiedValue || 0,
      });
    }
    // reorder
    transformedData = orderBy(transformedData, ["id"], ["asc"]);
    const finalData = ["possible", "income", "additional"].map((x, xi) => {
      let title = "";
      if (x === "possible") {
        title = "Change in income driver value (%)";
      }
      if (x === "income") {
        title =
          "Resulting change in farmers' income if all other income drivers stay the same (%)";
      }
      if (x === "additional") {
        title =
          "Additional change in farmers' income if all other income drivers are at feasible levels (%)";
      }
      const data = transformedData.map((d) => ({
        name: d.name,
        value: d[x].toFixed(2),
        label: {
          position: d[x] < 0 ? "insideBottom" : "insideTop",
        },
      }));
      return {
        name: title,
        data: data,
        color: legendColors[xi],
      };
    });
    return {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        ...TextStyle,
      },
      legend: {
        ...Legend,
        data: finalData.map((x) => x.name),
        top: 5,
        left: "center",
      },
      grid: {
        show: true,
        containLabel: true,
        left: 55,
        right: 50,
        top: 75,
        bottom: 20,
        label: {
          color: "#222",
          ...TextStyle,
        },
      },
      yAxis: {
        type: "value",
        name: "Change (%)",
        nameTextStyle: { ...TextStyle },
        nameLocation: "middle",
        nameGap: 50,
        axisLabel: {
          ...TextStyle,
          color: "#9292ab",
        },
      },
      xAxis: {
        type: "category",
        splitLine: { show: false },
        data: transformedData.map((d) => d.name),
        axisLabel: {
          width: 90,
          overflow: "break",
          interval: 0,
          ...TextStyle,
          color: "#4b4b4e",
          formatter: AxisShortLabelFormatter?.formatter,
        },
        axisTick: {
          alignWithLabel: true,
        },
      },
      series: finalData.map((d) => {
        return {
          ...d,
          type: "bar",
          label: {
            show: showLabel,
            position: "left",
            verticalAlign: "middle",
            color: "#fff",
            padding: 2,
            backgroundColor: "rgba(0,0,0,.3)",
            formatter: function (params) {
              return params.value + "%";
            },
          },
        };
      }),
      ...Easing,
    };
  }, [dashboardData, selectedSegment, showLabel]);

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <SegmentSelector
            dashboardData={dashboardData}
            selectedSegment={selectedSegment}
            setSelectedSegment={setSelectedSegment}
          />
        </Col>
        <Col span={24}>
          <Chart wrapper={false} type="BAR" override={chartData} />
        </Col>
      </Row>
    </div>
  );
};

export default ChartBigImpact;
