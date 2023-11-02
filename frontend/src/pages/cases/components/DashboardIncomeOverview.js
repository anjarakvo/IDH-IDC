import React, { useMemo } from "react";
import { Row, Col, Card } from "antd";
import Chart from "../../../components/chart";

const CurrentFeasibleChart = ({ dashboardData = [] }) => {
  const chartData = useMemo(() => {
    return dashboardData.reduce((c, d) => {
      return [
        ...c,
        {
          name: `Current ${d.name}`,
          title: `Current ${d.name}`,
          stack: [
            {
              name: "Cost of Production",
              title: "Cost of Production",
              value: d.total_current_cost,
              total: d.total_current_cost,
              order: 1,
              color: "#ff5d00",
            },
            {
              name: "Focus Crop Revenue",
              title: "Focus Crop Revenue",
              value: d.total_current_focus_income,
              total: d.total_current_focus_income,
              color: "#47d985",
              order: 2,
            },
            {
              name: "Diversified Income",
              title: "Diversified Income",
              value: d.total_current_diversified_income,
              total: d.total_current_diversified_income,
              color: "#fdc305",
              order: 3,
            },
          ],
        },
        {
          name: `Feasible ${d.name}`,
          title: `Feasible ${d.name}`,
          stack: [
            {
              name: "Cost of Production",
              title: "Cost of Production",
              value: d.total_feasible_cost,
              total: d.total_feasible_cost,
              order: 1,
            },
            {
              name: "Focus Crop Revenue",
              title: "Focus Crop Revenue",
              value: d.total_feasible_focus_income,
              total: d.total_feasible_focus_income,
              order: 2,
            },
            {
              name: "Diversified Income",
              title: "Diversified Income",
              value: d.total_feasible_diversified_income,
              total: d.total_feasible_diversified_income,
              order: 3,
            },
          ],
        },
      ];
    }, []);
  }, [dashboardData]);

  return (
    <Chart title="" span={24} type="BARSTACK" data={chartData} affix={true} />
  );
};

const IncomeGapChart = ({ dashboardData }) => {
  const chartData = useMemo(() => {
    return dashboardData.reduce((c, d) => {
      return [
        ...c,
        {
          name: `Current ${d.name}`,
          value: d.total_current_income,
          total: d.total_current_income,
          color: "#854634",
        },
        {
          name: `Feasible ${d.name}`,
          value: d.total_feasible_income,
          color: "#ff6c19",
        },
      ];
    }, []);
  }, [dashboardData]);

  return <Chart title="" span={24} type="BAR" data={chartData} affix={true} />;
};

const DashboardIncomeOverview = ({ dashboardData }) => {
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
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <h2>
                  What are the current and feasible income levels for the
                  different segments?
                </h2>
                <p>
                  This graph shows you the actual household income components,
                  and the income target per segment
                </p>
                <CurrentFeasibleChart dashboardData={dashboardData} />
              </Col>
              <Col span={11}>
                <h2>How big is the income gap?</h2>
                <p>
                  This graph shows you the actual household income components,
                  and the income target per segment
                </p>
                <IncomeGapChart dashboardData={dashboardData} />
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
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <h2>Which drivers have the biggest impact on income?</h2>
                <p>
                  This ranking shows the elasticity of the driver and to which
                  the driver can influence income.
                </p>
              </Col>
              <Col span={12}>
                <h2>Explore the breakdown of drivers</h2>
                <p>
                  Select the driver for which you want to breakdown to be
                  visualised.
                </p>
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
            <Row gutter={[16, 16]}>
              <Col span={12} className="information-box">
                <h2>Information Box</h2>
              </Col>
              <Col span={12}>
                <h2>Monetary contribution of each driver to income.</h2>
                Chart here
              </Col>
            </Row>
          </Card.Grid>
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardIncomeOverview;
