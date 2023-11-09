import React from "react";
import { Row, Col, Alert, Card } from "antd";

const DashboardScenarioModeling = () => {
  return (
    <Row id="scenario-modeling">
      <Col span={24}>
        <Alert
          message="On this page you can define and save up to three scenarios."
          type="success"
          className="alert-box"
        />
      </Col>
      <Col span={24}>
        <Card className="income-driver-dashboard">
          <Card.Grid
            style={{
              width: "100%",
            }}
            hoverable={false}
          >
            <Row
              className="income-driver-content"
              align="middle"
              justify="space-evenly"
              gutter={[8, 8]}
            >
              <Col span={12}>
                <h2>New Scenario</h2>
                <p>Scenario Description</p>
              </Col>
              <Col span={12}>
                <p>
                  <b>Scenario 1</b>
                </p>
              </Col>
            </Row>
          </Card.Grid>
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardScenarioModeling;
