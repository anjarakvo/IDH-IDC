import React, { useRef, useState } from "react";
import { Row, Col, Card, Space } from "antd";
import {
  ChartCurrentFeasible,
  ChartIncomeGap,
  ChartBigImpact,
  ChartMonetaryContribution,
  ChartExploreBreakdownDrivers,
  ChartIncomeLevelPerCommodities,
} from "../visualizations";
import { SaveAsImageButton, ShowLabelButton } from "../../../components/utils";

const DashboardIncomeOverview = ({ dashboardData, currentCase }) => {
  const elCurrentFeasibleChart = useRef(null);
  const elIncomeGap = useRef(null);
  const elBigImpact = useRef(null);
  const elExploreBreakdownDrivers = useRef(null);
  const elMonetaryContribution = useRef(null);
  const elIncomeLevelPerCommodities = useRef(null);

  const [showLabelChartCurrentFeasible, setShowLabelChartCurrentFeasible] =
    useState(false);
  const [showLabelChartIncomeGap, setShowLabelChartIncomeGap] = useState(false);
  const [showLabelChartBigImpact, setShowLabelChartBigImpact] = useState(false);

  return (
    <Row
      id="income-overview-chart"
      gutter={[24, 64]}
      className="income-driver-dashboard"
    >
      <Col span={24}>
        <Row
          className="income-driver-content"
          gutter={[24, 24]}
          ref={elCurrentFeasibleChart}
        >
          <Col span={16}>
            <Card
              className="chart-card-wrapper"
              title="Current and feasible income"
              extra={
                <Space align="center">
                  <ShowLabelButton
                    showLabel={showLabelChartCurrentFeasible}
                    setShowLabel={setShowLabelChartCurrentFeasible}
                    type="ghost-white"
                  />
                  <SaveAsImageButton
                    elementRef={elCurrentFeasibleChart}
                    filename="What are the current and feasible income levels for the
                  different segments?"
                    type="ghost-white"
                  />
                </Space>
              }
            >
              <ChartCurrentFeasible
                dashboardData={dashboardData}
                currentCase={currentCase}
                showLabel={showLabelChartCurrentFeasible}
              />
            </Card>
          </Col>
          <Col span={8} className="income-overview-chart-wrapper">
            <h2>
              What are the current and feasible income levels for the different
              segments?
            </h2>
            <p>
              This graph shows you the actual household income components, and
              the income target per segment
            </p>
          </Col>
        </Row>
      </Col>

      <Col span={24}>
        <Row
          className="income-driver-content"
          gutter={[24, 24]}
          ref={elIncomeGap}
        >
          <Col span={8} className="income-overview-chart-wrapper">
            <h2>How big is the income gap?</h2>
            <p>
              This graph shows you the actual household income components, and
              the income target per segment
            </p>
          </Col>
          <Col span={16}>
            <Card
              className="chart-card-wrapper"
              title="Income Gap"
              extra={
                <Space align="center">
                  <ShowLabelButton
                    showLabel={showLabelChartIncomeGap}
                    setShowLabel={setShowLabelChartIncomeGap}
                    type="ghost-white"
                  />
                  <SaveAsImageButton
                    elementRef={elIncomeGap}
                    filename="How big is the income gap?"
                    type="ghost-white"
                  />
                </Space>
              }
            >
              <ChartIncomeGap
                dashboardData={dashboardData}
                currentCase={currentCase}
                showLabel={showLabelChartIncomeGap}
              />
            </Card>
          </Col>
        </Row>
      </Col>

      <Col span={24}>
        <Row
          className="income-driver-content"
          gutter={[24, 24]}
          ref={elBigImpact}
        >
          <Col span={16}>
            <Card
              className="chart-card-wrapper has-segments-button"
              title="Biggest Impact on Income"
              extra={
                <Space align="center">
                  <ShowLabelButton
                    showLabel={showLabelChartBigImpact}
                    setShowLabel={setShowLabelChartBigImpact}
                    type="ghost-white"
                  />
                  <SaveAsImageButton
                    elementRef={elBigImpact}
                    filename="Which drivers have the biggest impact on income?"
                    type="ghost-white"
                  />
                </Space>
              }
            >
              <ChartBigImpact
                dashboardData={dashboardData}
                showLabel={showLabelChartBigImpact}
              />
            </Card>
          </Col>
          <Col span={8} className="income-overview-chart-wrapper">
            <h2>Which drivers have the biggest impact on income?</h2>
            <p>
              This ranking shows the elasticity of the driver and to which the
              driver can influence income.
            </p>
          </Col>
        </Row>
      </Col>

      <Col span={24}>
        <Row
          className="income-driver-content"
          gutter={[24, 24]}
          ref={elExploreBreakdownDrivers}
        >
          <Col span={8} className="income-overview-chart-wrapper">
            <h2>Explore the breakdown of drivers</h2>
            <p>
              Select the driver for which you want to breakdown to be
              visualised.
            </p>
          </Col>
          <Col span={16}>
            <Card
              className="chart-card-wrapper has-segments-button"
              title="The breakdown of drivers"
              extra={
                <SaveAsImageButton
                  elementRef={elExploreBreakdownDrivers}
                  filename="Explore the breakdown of drivers"
                  type="ghost-white"
                />
              }
            >
              <ChartExploreBreakdownDrivers
                dashboardData={dashboardData}
                currentCase={currentCase}
              />
            </Card>
          </Col>
        </Row>
      </Col>

      <Col span={24}>
        <Row
          className="income-driver-content"
          gutter={[24, 24]}
          ref={elMonetaryContribution}
        >
          <Col span={16}>
            <Card
              className="chart-card-wrapper has-segments-button"
              title="Monetary contribution of each driver to income"
              extra={
                <SaveAsImageButton
                  elementRef={elMonetaryContribution}
                  filename="Monetary contribution of each driver to income"
                  type="ghost-white"
                />
              }
            >
              <ChartMonetaryContribution
                dashboardData={dashboardData}
                currentCase={currentCase}
              />
            </Card>
          </Col>
          <Col span={8} className="income-overview-chart-wrapper">
            <h2>Monetary contribution of each driver to income.</h2>
          </Col>
        </Row>
      </Col>

      <Col span={24}>
        <Row
          className="income-driver-content"
          gutter={[24, 24]}
          ref={elIncomeLevelPerCommodities}
        >
          <Col span={8} className="income-overview-chart-wrapper">
            <h2>
              <i>For landscape studies</i>
            </h2>
            <h2>
              What are the income levels for the different commodities in each
              segment?
            </h2>
            <p>
              If you have data for different commodities, this graph compares
              the income levels.
            </p>
          </Col>
          <Col span={16}>
            <Card
              className="chart-card-wrapper has-segments-button"
              title="Income levels for different commodities"
              extra={
                <SaveAsImageButton
                  elementRef={elIncomeLevelPerCommodities}
                  filename="What are the income levels for the different commodities in
                  each segment?"
                  type="ghost-white"
                />
              }
            >
              <ChartIncomeLevelPerCommodities
                dashboardData={dashboardData}
                currentCase={currentCase}
              />
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default DashboardIncomeOverview;
