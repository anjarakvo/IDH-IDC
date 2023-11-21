import React, { useRef } from "react";
import { Row, Col, Card } from "antd";
import {
  ChartCurrentFeasible,
  ChartIncomeGap,
  ChartBigImpact,
  ChartMonetaryContribution,
  ChartExploreBreakdownDrivers,
  ChartIncomeLevelPerCommodities,
} from "../visualizations";
import { SaveAsImageButton } from "../../../components/utils";

const DashboardIncomeOverview = ({ dashboardData }) => {
  const elCurrentFeasibleChart = useRef();
  const elIncomeGap = useRef();

  return (
    <Row>
      <Col span={24}>
        <Card className="income-driver-dashboard">
          <Card.Grid
            style={{
              width: "100%",
            }}
            hoverable={false}
          >
            <Row className="income-driver-content" gutter={[16, 16]}>
              <Col span={12} ref={elCurrentFeasibleChart}>
                <h2>
                  What are the current and feasible income levels for the
                  different segments?
                </h2>
                <p>
                  This graph shows you the actual household income components,
                  and the income target per segment
                </p>
                <SaveAsImageButton
                  elementRef={elCurrentFeasibleChart}
                  filename="What are the current and feasible income levels for the
                  different segments?"
                />
                <ChartCurrentFeasible dashboardData={dashboardData} />
              </Col>
              <Col span={12} ref={elIncomeGap}>
                <h2>How big is the income gap?</h2>
                <p>
                  This graph shows you the actual household income components,
                  and the income target per segment
                </p>
                <SaveAsImageButton
                  elementRef={elIncomeGap}
                  filename="How big is the income gap?"
                />
                <ChartIncomeGap dashboardData={dashboardData} />
              </Col>
            </Row>
          </Card.Grid>
        </Card>
        <Card className="income-driver-dashboard">
          <Card.Grid
            style={{
              width: "100%",
            }}
            hoverable={false}
          >
            <Row className="income-driver-content" gutter={[16, 16]}>
              <Col span={12}>
                <h2>Which drivers have the biggest impact on income?</h2>
                <p>
                  This ranking shows the elasticity of the driver and to which
                  the driver can influence income.
                </p>
                <ChartBigImpact dashboardData={dashboardData} />
              </Col>
              <Col span={12}>
                <h2>Explore the breakdown of drivers</h2>
                <p>
                  Select the driver for which you want to breakdown to be
                  visualised.
                </p>
                <ChartExploreBreakdownDrivers dashboardData={dashboardData} />
              </Col>
            </Row>
          </Card.Grid>
        </Card>
        <Card className="income-driver-dashboard">
          <Card.Grid
            style={{
              width: "100%",
            }}
            hoverable={false}
          >
            <Row className="income-driver-content">
              <Col span={24}>
                <h2>Monetary contribution of each driver to income.</h2>
                <ChartMonetaryContribution dashboardData={dashboardData} />
              </Col>
            </Row>
          </Card.Grid>
        </Card>
        <Card className="income-driver-dashboard">
          <Card.Grid
            style={{
              width: "100%",
            }}
            hoverable={false}
          >
            <Row className="income-driver-content">
              <Col span={24}>
                <h2>
                  <i>For landscape studies</i>
                </h2>
                <h2>
                  What are the income levels for the different commodities in
                  each segment?
                </h2>
                <p>
                  If you have data for different commodities, this graph
                  compares the income levels.
                </p>
                <ChartIncomeLevelPerCommodities dashboardData={dashboardData} />
              </Col>
            </Row>
          </Card.Grid>
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardIncomeOverview;
