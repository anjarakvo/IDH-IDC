import React from "react";
import { Row, Col, Card } from "antd";

const DashboardIncomeOverview = () => {
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
            <Row>
              <Col span={12}>
                <h2>
                  What are the current and feasible income levels for the
                  different segments?
                </h2>
                <p>
                  This graph shows you the actual household income components,
                  and the income target per segment
                </p>
              </Col>
              <Col span={12}>
                <h2>How big is the income gap?</h2>
                <p>
                  This graph shows you the actual household income components,
                  and the income target per segment
                </p>
                <Row>
                  <Col span={12}>Chart here</Col>
                  <Col span={12}>
                    <div className="information-box">
                      <h3>Income Overview</h3>
                      <p>
                        Nigeria has a population of approximately 201 million[1]
                        and an almost equal distribution between urban (51%)[2]
                        and rural (49%)[3] population. The agricultural sector
                        accounts for 35% of total employment[4] and represents
                        22% of the national GDP.
                      </p>
                    </div>
                  </Col>
                </Row>
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
            <Row gutter={[8, 8]}>
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
            <Row gutter={[8, 8]}>
              <Col span={12}>
                <div className="information-box">
                  <h3>Income Overview</h3>
                  <p>
                    Nigeria has a population of approximately 201 million[1] and
                    an almost equal distribution between urban (51%)[2] and
                    rural (49%)[3] population. The agricultural sector accounts
                    for 35% of total employment[4] and represents 22% of the
                    national GDP.
                  </p>
                </div>
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
