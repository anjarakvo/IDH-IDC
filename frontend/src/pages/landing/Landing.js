import React from "react";
import "./landing.scss";
import { Row, Col, Space, Card, Image } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  LandingInfoHelpIcon,
  LandingInfoEstimateIcon,
  LandingInfoDriversIcon,
} from "../../lib/icon";
import IncomeDriverFrameworkImg from "../../assets/images/income-driver-framework.jpeg";

const Jumbotron = () => (
  <Row
    data-testid="jumbotron-wrapper"
    justify="center"
    className="jumbotron-wrapper"
  >
    <Col span={24}>
      <h1 data-testid="jumbotron-title">
        Welcome to the income driver calculator
      </h1>
      <h3 data-testid="jumbotron-subtitle">
        IDH is working to secure better income for smallholder farmers in
        several sectors and landscapes.
      </h3>
      <Link data-testid="button-learn-more" className="button button-yellow">
        Sign in to calculator
      </Link>
    </Col>
  </Row>
);

const InformationCard = () => (
  <Row
    data-testid="info-card-wrapper"
    justify="space-evenly"
    align="center"
    className="info-card-row"
  >
    <Col sm={24} md={7} align="top">
      <Card className="info-card-wrapper info-first">
        <div className="info-card-icon">
          <LandingInfoHelpIcon />
        </div>
        <h3>Helps you to calculate farmer income</h3>
        <p>
          Helps you to calculate actual and feasible household income by taking
          into account various income drivers
        </p>
      </Card>
    </Col>
    <Col sm={24} md={7} align="top">
      <Card className="info-card-wrapper info-second">
        <div className="info-card-icon">
          <LandingInfoEstimateIcon />
        </div>
        <h3>Estimate the income gap</h3>
        <p>
          It helps you to estimate the income gap, compare household income with
          a living income benchmark or better income target
        </p>
      </Card>
    </Col>
    <Col sm={24} md={7} align="top">
      <Card className="info-card-wrapper info-third">
        <div className="info-card-icon">
          <LandingInfoDriversIcon />
        </div>
        <h3>Understand drivers of income</h3>
        <p>
          Helps you to understand the drivers and constraints of income and how
          they can be leveraged to close the income gap
        </p>
      </Card>
    </Col>
  </Row>
);

const IncomeDriverFramework = () => (
  <Row
    data-testid="income-driver-framework-wrapper"
    justify="center"
    className="income-driver-framework-wrapper"
  >
    <Col span={12}>
      <Image src={IncomeDriverFrameworkImg} preview={false} width="100%" />
    </Col>
    <Col span={12} className="income-driver-framework-text-wrapper">
      <h2 data-testid="income-driver-framework-left-text">
        Income driver framework
      </h2>
      <p data-testid="income-driver-framework-right-text">
        Understanding income isn&apos;t just about looking at the end number.
        This tool follows a sector-agnostic approach to assess and support the
        design of effective interventions to improve household incomes towards
        the broader goal of closing living income gaps.
      </p>
      <Link
        data-testid="button-learn-more-2"
        className="button button-secondary"
      >
        Learn More
      </Link>
    </Col>
  </Row>
);

const Landing = () => {
  return (
    <div className="landing-container" id="landing">
      <Jumbotron />
      <InformationCard />
      <IncomeDriverFramework />
      <Row
        data-testid="second-section-wrapper"
        justify="center"
        className="second-section-wrapper"
      >
        <Col span={12} className="text-wrapper">
          <h2 data-testid="second-section-title">
            The Income Driver Calculator
          </h2>
          <p data-testid="second-section-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            erat tellus, luctus id leo id, laoreet rhoncus dui. Curabitur
            mattis, leo quis lobortis eleifend, ligula lectus pellentesque nisl,
            sit amet elementum purus felis vel tortor. Vestibulum lacinia
            sollicitudin euismod. Morbi rhoncus vel nisl tristique sodales.
          </p>
          <div className="text-with-icon-wrapper">
            <Space>
              <p>
                <CheckCircleOutlined /> Qualitative data
              </p>
              <p>
                <CheckCircleOutlined /> Report generation and visualizations
              </p>
            </Space>
          </div>
          <Link
            data-testid="button-use-the-calculator"
            className="button button-use-the-calculator"
          >
            Use the Calculator
          </Link>
        </Col>
        <Col
          span={12}
          data-testid="second-section-image"
          className="image-wrapper"
        >
          <div className="image-clip-path-wrapper" />
          <div className="image-farmer-wrapper" />
        </Col>
      </Row>
      <Row
        data-testid="third-section-wrapper"
        justify="center"
        className="third-section-wrapper"
      >
        <Col span={24} align="center">
          <h2 data-testid="third-section-title">Where we work</h2>
          <p data-testid="third-section-subtitle">
            IDH Operates in differnt landscapes and sectors in over 40 countries
            worldwide.
          </p>
          <div data-testid="map" className="map-container"></div>
        </Col>
      </Row>
      <Row
        data-testid="disclaimer-section-wrapper"
        justify="center"
        className="disclaimer-section-wrapper"
      >
        <Col span={24}>
          <h2 data-testid="disclaimer-section-title">Disclaimer</h2>
          <p data-testid="disclaimer-section-description">
            The data published on this website is provided by IDH as a public
            service to promote transparency, accountability, and informed
            decision-making. However, all data is provided &quot;as is&quot;
            without any warranty, representation, or guarantee of any kind,
            including but not limited to its content, accuracy, timeliness,
            completeness, or fitness for a particular purpose.
            <br />
            <br />
            IDH does not make any implied warranties and shall not be liable for
            any errors, omissions, or inaccuracies in the data provided,
            regardless of the cause, nor for any decision made or action taken
            or not taken by anyone using or relying on such data.
            <br />
            <br />
            For our own analyses, insights and recommendations based on this
            data, please refer to our Insights Explorer.
          </p>
        </Col>
      </Row>
    </div>
  );
};

export default Landing;
