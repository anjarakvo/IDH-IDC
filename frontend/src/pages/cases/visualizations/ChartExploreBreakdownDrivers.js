import React, { useState, useEffect, useMemo } from "react";
import { Row, Col } from "antd";
import uniqBy from "lodash/uniqBy";
import capitalize from "lodash/capitalize";
import { SegmentSelector, DriverDropdown, getColumnStackBarOptions } from "./";
import Chart from "../../../components/chart";

const otherCommodities = ["secondary", "tertiary"];
const currentColors = ["#1b726f", "#81e4ab", "#fecb21", "#4eb8ff", "#ff8f4e"];
const feasibleColors = ["#9cc2c1", "#ddf8e9", "#ffeeb8", "#doecff", "#ffe1do"];

const ChartExploreBreakdownDrivers = ({
  dashboardData,
  currentCase,
  showLabel = false,
}) => {
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [axisTitle, setAxisTitle] = useState(currentCase.currency);

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
      (a) => a.commodityFocus && a.question.question_type !== "diversified"
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
      childrens: q.childrens.map((q) => ({ ...q, type: "focus" })),
    }));
    // add secondary - tertiary value
    const additonalCommodities = otherCommodities
      .map((x) => {
        const commodity = currentSegmentData.answers.find(
          (a) =>
            a.commodityType === x && a.question.question_type !== "diversified"
        );
        if (!commodity) {
          return false;
        }
        return {
          text: `Total ${capitalize(x)} / Non Focus - ${
            commodity.commodityName
          }`,
          type: x,
          id: x,
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
      ...q,
      type: "diversified",
    }));
    const diversifiedRes = [
      {
        label: "Diversified Income",
        type: "diversified",
        value: "diversified",
        childrens: [...additonalCommodities, ...diversifiedQuestions],
      },
    ];
    return [...focusRes, ...diversifiedRes];
  }, [currentSegmentData]);

  useEffect(() => {
    if (driverOptionsDropdown.length > 0) {
      setSelectedDriver("diversified");
    }
  }, [driverOptionsDropdown]);

  const handleOnChangeDriverDropdown = (value) => {
    setSelectedDriver(value);
    if (value === "diversified") {
      setAxisTitle(currentCase.currency);
      return;
    }
    if (currentSegmentData) {
      const questions = currentSegmentData.answers.find(
        (a) => a.isTotalCurrentFocusIncome
      ).question?.childrens;
      const currentQuestion = questions.find((q) => q.id === value);
      const { unit } = currentQuestion;
      const unitName = unit
        .split(" ")
        .map((x) => currentCase?.[x])
        .filter((x) => x)
        .join(" / ");
      setAxisTitle(unitName);
    }
  };

  const chartData = useMemo(() => {
    if (!currentSegmentData || !driverOptionsDropdown.length) {
      return [];
    }
    const res = ["current", "feasible"]
      .map((x) => {
        const colors = x === "current" ? currentColors : feasibleColors;
        const title = `${capitalize(x)}\n${currentSegmentData.name}`;
        let stack = [];
        if (!selectedDriver) {
          stack = driverOptionsDropdown.map((d, di) => {
            let value = 0;
            // Calculate focus commodity
            if (d.type === "focus") {
              const answer = currentSegmentData.answers
                .filter((a) => a.commodityFocus && a.name === x)
                .find((a) => a.questionId === d.value);
              value = answer && answer.value ? answer.value : 0;
            }
            // diversified
            if (d.type === "diversified" && d.value === "diversified") {
              value =
                currentSegmentData?.[`total_${x}_diversified_income`] || 0;
            }
            value = value ? parseFloat(value.toFixed(2)) : value;
            return {
              name: `${capitalize(x)} ${d.label}`,
              title: `${capitalize(x)} ${d.label}`,
              value: value,
              total: value,
              order: di,
              color: colors[di],
              stack: x,
            };
          });
        }
        if (selectedDriver) {
          const findDriver = driverOptionsDropdown.find(
            (d) => d.value === selectedDriver
          );
          if (findDriver.type === "focus") {
            stack = findDriver.childrens.map((d, di) => {
              const answer = currentSegmentData.answers
                .filter((a) => a.commodityFocus && a.name === x)
                .find((a) => a.questionId === d.id);
              const value =
                answer && answer.value
                  ? parseFloat(answer.value.toFixed(2))
                  : 0;
              return {
                name: `${capitalize(x)} ${d.text}`,
                title: `${capitalize(x)} ${d.text}`,
                value: value,
                total: value,
                order: di,
                color: colors[di],
                stack: x,
              };
            });
            // childrens doesn't have value / answers
            const check = stack.filter((x) => x.value);
            if (!check.length) {
              const parentAnswer = currentSegmentData.answers
                .filter((a) => a.commodityFocus && a.name === x)
                .find((a) => a.questionId === findDriver.value);
              const value =
                parentAnswer && parentAnswer.value
                  ? parseFloat(parentAnswer.value.toFixed(2))
                  : 0;
              stack = [
                {
                  name: `${capitalize(x)} ${findDriver.label}`,
                  title: `${capitalize(x)} ${findDriver.label}`,
                  value: value,
                  total: value,
                  order: 0,
                  color: colors[0],
                  stack: x,
                },
              ];
            }
          }
          if (findDriver.type === "diversified") {
            stack = findDriver.childrens.map((d, di) => {
              let value = 0;
              // Calculate others commodity
              if (otherCommodities.includes(d.type)) {
                const nonFocusCommodity = currentSegmentData.answers.find(
                  (a) =>
                    a.name === x &&
                    a.commodityType === d.type &&
                    !a.question.parent &&
                    a.question.question_type !== "diversified"
                );
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
                    a.questionId === d.id
                );
                value =
                  diversified && diversified?.value
                    ? parseFloat(diversified.value.toFixed(2))
                    : 0;
              }
              return {
                name: `${capitalize(x)} ${d.text}`,
                title: `${capitalize(x)} ${d.text}`,
                value: value,
                total: value,
                order: di,
                color: colors[di],
                stack: x,
              };
            });
          }
        }
        // stack bar chart
        return {
          segment: currentSegmentData.name,
          name: title,
          title: title,
          stack: stack,
        };
      })
      .flatMap((x) => x.stack)
      .reduce((c, d) => {
        // transform into column bar chart
        return [
          ...c,
          {
            name: d.name,
            type: "bar",
            stack: d.stack,
            color: d.color,
            data: [d.value],
          },
        ];
      }, []);
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
            onChange={handleOnChangeDriverDropdown}
          />
        </Col>
        <Col span={24}>
          <Chart
            wrapper={false}
            type={"BAR"}
            loading={!chartData.length || !currentSegmentData}
            override={getColumnStackBarOptions({
              series: chartData,
              origin: currentSegmentData ? [currentSegmentData] : [],
              yAxis: { name: axisTitle },
              grid: { right: 285, left: 70, bottom: 20 },
              showLabel: showLabel,
            })}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ChartExploreBreakdownDrivers;
