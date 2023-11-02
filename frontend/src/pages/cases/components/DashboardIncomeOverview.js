import React, { useEffect, useState, useMemo } from "react";
import { Row, Col, Card, Radio } from "antd";
import Chart from "../../../components/chart";

const SegmentSelector = ({
  dashboardData,
  selectedSegment,
  setSelectedSegment,
}) => {
  return (
    <Radio.Group
      value={selectedSegment}
      onChange={(e) => {
        setSelectedSegment(e.target.value);
      }}
    >
      {dashboardData.map((d) => (
        <Radio.Button key={d.id} value={d.id}>
          {d.name}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
};

const CurrentFeasibleChart = ({ dashboardData = [] }) => {
  const chartData = useMemo(() => {
    return dashboardData.reduce((c, d) => {
      return [
        ...c,
        {
          name: `Current\n${d.name}`,
          title: `Current\n${d.name}`,
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
          name: `Feasible\n${d.name}`,
          title: `Feasible\n${d.name}`,
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
    <Chart wrapper={false} type="BARSTACK" data={chartData} affix={true} />
  );
};

const IncomeGapChart = ({ dashboardData }) => {
  const chartData = useMemo(() => {
    return dashboardData.reduce((c, d) => {
      return [
        ...c,
        {
          name: `Current\n${d.name}`,
          value: d.total_current_income,
          total: d.total_current_income,
          color: "#854634",
        },
        {
          name: `Feasible\n${d.name}`,
          value: d.total_feasible_income,
          color: "#ff6c19",
        },
      ];
    }, []);
  }, [dashboardData]);

  return <Chart wrapper={false} type="BAR" data={chartData} affix={true} />;
};

const BigImpactChart = ({ dashboardData }) => {
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

const MonetaryContributionChart = ({ dashboardData }) => {
  const [selectedSegment, setSelectedSegment] = useState(null);

  useEffect(() => {
    if (dashboardData.length > 0) {
      setSelectedSegment(dashboardData[0].id);
    }
  }, [dashboardData]);

  const chartData = useMemo(() => {
    const data = dashboardData.find((d) => d.id === selectedSegment);
    if (!data) {
      return {};
    }
    const dataSeries = data.answers.filter(
      (d) => d.question.parent === 1 && d.commodityFocus
    );

    const indicators = dataSeries
      .filter((d) => d.name === "current")
      .map((d) => d.question.text);

    const additionalData = indicators
      .map((d) => {
        const feasibleValue = dataSeries.find(
          (dd) => dd.name === "feasible" && dd.question.text === d
        );
        if (feasibleValue) {
          if (feasibleValue.question.text.toLowerCase().includes("cost")) {
            return -feasibleValue.value || 0;
          }
          return feasibleValue?.value || 0;
        }
        return 0;
      })
      .reduce((c, u) => {
        if (c.length === 0) {
          return [u];
        }
        return [...c, c[c.length - 1] + u];
      }, []);

    const increasingData = additionalData.map(
      (d) => d + data.total_current_focus_income
    );

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: function (params) {
          var tar = params[1];
          return tar.name + "<br/>" + tar.seriesName + " : " + tar.value;
        },
      },
      xAxis: {
        type: "category",
        splitLine: { show: false },
        data: ["Current\nIncome", ...indicators, "Feasible"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Placeholder",
          type: "bar",
          stack: "Total",
          itemStyle: {
            borderColor: "transparent",
            color: "transparent",
          },
          emphasis: {
            itemStyle: {
              borderColor: "transparent",
              color: "transparent",
            },
          },
          data: [0, ...increasingData, 0],
        },
        {
          name: "Life Cost",
          type: "bar",
          stack: "Total",
          label: {
            show: true,
            position: "inside",
          },
          data: [
            data.total_current_focus_income,
            ...additionalData,
            data.total_feasible_focus_income,
          ],
        },
      ],
    };
  }, [dashboardData, selectedSegment]);

  return (
    <div>
      <SegmentSelector
        dashboardData={dashboardData}
        selectedSegment={selectedSegment}
        setSelectedSegment={setSelectedSegment}
      />
      <Chart wrapper={false} type="BAR" override={chartData} />
    </div>
  );
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
            <Row className="income-driver-content">
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
              <Col span={12}>
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
            <Row className="income-driver-content">
              <Col span={12}>
                <h2>Which drivers have the biggest impact on income?</h2>
                <p>
                  This ranking shows the elasticity of the driver and to which
                  the driver can influence income.
                </p>
                <BigImpactChart dashboardData={dashboardData} />
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
            <Row className="income-driver-content">
              <Col span={24}>
                <h2>Monetary contribution of each driver to income.</h2>
                <MonetaryContributionChart dashboardData={dashboardData} />
              </Col>
            </Row>
          </Card.Grid>
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardIncomeOverview;
