import React, { useState, useEffect, useMemo } from "react";
import { Row, Col } from "antd";
import uniqBy from "lodash/uniqBy";
import capitalize from "lodash/capitalize";
import { SegmentSelector, DriverDropdown } from "./";
import Chart from "../../../components/chart";

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
      (a) => a.commodityFocus
    );
    const driverQuestions =
      uniqBy(
        focusCommodityAnswers.map((a) => a.question),
        "id"
      ).find((q) => !q.parent)?.childrens || [];
    return driverQuestions.map((q) => ({
      label: q.text,
      value: q.id,
    }));
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
          const answer = currentSegmentData.answers
            .filter((a) => a.commodityFocus && a.name === x)
            .find((a) => a.questionId === d.value);
          return {
            name: d.label,
            title: d.label,
            value: answer.value || 0,
            total: answer.value || 0,
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
