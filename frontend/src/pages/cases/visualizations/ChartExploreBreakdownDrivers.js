import React, { useState, useEffect, useMemo } from "react";
import { Row, Col } from "antd";
import uniqBy from "lodash/uniqBy";
import { SegmentSelector, DriverDropdown } from "./";

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

  const chartData = useMemo(() => {
    if (!currentSegmentData || !driverOptionsDropdown.length) {
      return [];
    }
    const res = currentSegmentData.answers
      .filter((a) => a.commodityFocus)
      .map((a) => {
        const currentStack = driverOptionsDropdown.map((d) => {
          return {
            name: d.label,
            title: d.label,
            value: 0,
            total: 0,
            order: 1,
            color: "#ff5d00",
          };
        });
        return (
          {
            name: `Current\n${currentSegmentData.name}`,
            title: `Current\n${currentSegmentData.name}`,
            stack: currentStack,
          },
          {
            name: `Feasible\n${currentSegmentData.name}`,
            title: `Feasible\n${currentSegmentData.name}`,
            stack: [],
          }
        );
      });
    console.log(currentSegmentData, driverOptionsDropdown);
  }, [currentSegmentData, driverOptionsDropdown]);

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
      </Row>
    </div>
  );
};

export default ChartExploreBreakdownDrivers;
