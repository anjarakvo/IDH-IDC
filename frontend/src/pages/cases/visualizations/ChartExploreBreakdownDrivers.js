import React, { useState, useEffect, useMemo } from "react";
import { Row, Col } from "antd";
import uniqBy from "lodash/uniqBy";
import capitalize from "lodash/capitalize";
import { SegmentSelector, DriverDropdown } from "./";
import Chart from "../../../components/chart";
// import { getFunctionDefaultValue } from "../components";

const otherCommodities = ["secondary", "tertiary"];
const colors = ["#0098FF", "#FFC505", "#47D985", "#FF5D00", "#00625F"];

const ChartExploreBreakdownDrivers = ({ dashboardData }) => {
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);

  useEffect(() => {
    if (dashboardData.length > 0) {
      setSelectedSegment(dashboardData[0].id);
    }
  }, [dashboardData]);

  const currentSegmentData = useMemo(() => {
    if (!selectedSegment || !dashboardData.length) {
      return null;
    }
    return dashboardData.find(
      (d) => d.id === selectedSegment || d.currentSegment === selectedSegment
    );
  }, [selectedSegment, dashboardData]);

  const driverOptionsDropdown = useMemo(() => {
    if (!currentSegmentData) {
      return [];
    }
    const focusCommodityAnswers = currentSegmentData.answers.filter(
      (a) => a.commodityFocus && a.question.question_type !== "deversified"
    );
    const driverQuestions =
      uniqBy(
        focusCommodityAnswers.map((a) => a.question),
        "id"
      ).find((q) => !q.parent)?.childrens || [];
    const focusRes = driverQuestions.map((q) => ({
      label: q.text,
      type: "focus",
      value: q.id,
    }));
    // add secondary - tertiary value
    const additonalCommodities = otherCommodities
      .map((x) => {
        const commodity = currentSegmentData.answers.find(
          (a) =>
            a.commodityType === x && a.question.question_type !== "deversified"
        );
        if (!commodity) {
          return false;
        }
        return {
          label: `Total ${capitalize(x)} / Non Focus - ${
            commodity.commodityName
          }`,
          type: x,
          value: x,
        };
      })
      .filter((x) => x);
    // add diversified questions
    let diversifiedQuestions = currentSegmentData.answers
      .filter(
        (a) =>
          a.commodityType === "diversified" &&
          a.question.question_type === "diversified"
      )
      .flatMap((a) => a.question);
    diversifiedQuestions = uniqBy(diversifiedQuestions, "id").map((q) => ({
      label: q.text,
      value: q.id,
      type: "diversified",
    }));
    return [...focusRes, ...additonalCommodities, ...diversifiedQuestions];
  }, [currentSegmentData]);

  const chartType = useMemo(
    () => (selectedDriver ? "BAR" : "BARSTACK"),
    [selectedDriver]
  );

  const chartData = useMemo(() => {
    if (!currentSegmentData || !driverOptionsDropdown.length) {
      return [];
    }
    const res = ["current", "feasible"].map((x, xi) => {
      const title = `${capitalize(x)}\n${currentSegmentData.name}`;
      const stack = driverOptionsDropdown
        .filter((d) => {
          if (!selectedDriver) {
            return d;
          }
          return d.value === selectedDriver;
        })
        .map((d, di) => {
          let value = 0;
          // Calculate focus commodity
          if (d.type === "focus") {
            const answer = currentSegmentData.answers
              .filter((a) => a.commodityFocus && a.name === x)
              .find((a) => a.questionId === d.value);
            value = answer && answer.value ? answer.value : 0;
          }
          // Calculate others commodity
          if (
            otherCommodities.includes(d.value) &&
            otherCommodities.includes(d.type)
          ) {
            const nonFocusCommodity = currentSegmentData.answers.find(
              (a) =>
                a.name === x &&
                a.commodityType === d.type &&
                !a.question.parent &&
                a.question.question_type !== "diversified"
            );
            // const nonFocusAnswers = currentSegmentData.answers
            //   .filter((a) => a.name === x)
            //   .map((a) => ({
            //     id: `${a.name}-${a.commodityId}-${a.questionId}`,
            //     value: a.value,
            //   }));
            // const nonFocusTotalValue = getFunctionDefaultValue(
            //   nonFocusCommodity.question,
            //   `${x}-${nonFocusCommodity.commodityId}`,
            //   nonFocusAnswers
            // );
            value =
              nonFocusCommodity && nonFocusCommodity?.value
                ? nonFocusCommodity.value
                : 0;
          }
          // Calculate diversified
          if (d.type === "diversified") {
            const diversified = currentSegmentData.answers.find(
              (a) =>
                a.name === x &&
                a.commodityType === d.type &&
                a.questionId === d.value
            );
            value = diversified && diversified?.value ? diversified.value : 0;
          }
          return {
            name: d.label,
            title: d.label,
            value: value,
            total: value,
            order: di,
            color: colors[di],
          };
        });
      if (selectedDriver) {
        // normal bar chart
        return {
          name: title,
          value: stack[0].value,
          total: stack[0].total,
          color: colors[xi],
        };
      }
      // stack bar chart
      return {
        name: title,
        title: title,
        stack: stack,
      };
    });
    return res;
  }, [currentSegmentData, driverOptionsDropdown, selectedDriver]);

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
          <DriverDropdown
            options={driverOptionsDropdown}
            value={selectedDriver}
            onChange={setSelectedDriver}
          />
        </Col>
        <Col span={24}>
          <Chart
            wrapper={false}
            type={chartType}
            data={chartData}
            affix={true}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ChartExploreBreakdownDrivers;
