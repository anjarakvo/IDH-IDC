import React from "react";
import "./welcome.scss";
import { Row, Col } from "antd";

const Welcome = () => {
  return (
    <Row className="welcome-container">
      <div className="right-clip-path-wrapper" />
      <Col span={24} className="welcome-content-wrapper">
        {/* Page Title */}
        <h1 data-testid="page-title" className="page-title">
          Welcome to the IDC
        </h1>
        <h3 data-testid="page-subtitle" className="page-subtitle">
          The income driver calculator version 2.0 is an analytics tool that
          uses both Living Income and Better Income to generate scenarios based
          off changes in different income dirvers.
        </h3>
        {/* EOL Page Title */}

        {/* Card Menu */}
        <Row className="card-menu-wrapper">
          <Col span={24}>1</Col>
          <Col span={24}>2</Col>
          <Col span={24}>3</Col>
        </Row>
        {/* EOL Card Menu */}
      </Col>
    </Row>
  );
};

export default Welcome;
