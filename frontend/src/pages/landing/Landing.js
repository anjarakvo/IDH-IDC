import React from "react";
import "./landing.scss";
import { Row, Col, Card, Image } from "antd";
import { Link } from "react-router-dom";
import {
  LandingInfoHelpIcon,
  LandingInfoEstimateIcon,
  LandingInfoDriversIcon,
} from "../../lib/icon";
import IncomeDriverFrameworkImg from "../../assets/images/income-driver-framework.jpeg";
import {
  Jumbotron,
  GetStarted,
  ExploreStudies,
  FooterDisclaimer,
  FrameworkDrivers,
} from "./components";

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
      <br />
      <Link
        data-testid="button-learn-more-2"
        className="button button-secondary"
      >
        Learn More
      </Link>
    </Col>
  </Row>
);

const CompareIncomeTarget = () => (
  <Row
    data-testid="compare-income-target-wrapper"
    justify="center"
    className="compare-income-target-wrapper"
  >
    <Col span={24} align="center">
      <p>Income Target</p>
      <h2>Compare to an income target</h2>
      <p>
        This tool allows you to compare the actual income with an income target.{" "}
        <br />
        Two ways are offered to set this target
      </p>
    </Col>
    <Col span={24}>
      <Row
        justify="space-evenly"
        align="center"
        className="compare-income-target-info-card-wrapper"
      >
        <Col span={8}>
          <Card className="compare-income-target-card info-first">
            <h3>Better Income Target</h3>
            <p>
              If you have a specific income goal in mind, you can set the target
              value yourself. Simply enter your desired income level in this
              option.
            </p>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="compare-income-target-card info-second">
            <h3>Set Your Own Target</h3>
            <p>
              If there is no living income benchmark available, or if you have a
              specific income target in mind, you can set the target value
              yourself. Simply enter your desired income level in this option.
            </p>
          </Card>
        </Col>
      </Row>
    </Col>
  </Row>
);

const Landing = () => {
  return (
    <div className="landing-container" id="landing">
      <Jumbotron />
      <InformationCard />
      <IncomeDriverFramework />
      <FrameworkDrivers />
      <CompareIncomeTarget />
      <GetStarted />
      <ExploreStudies />
      <FooterDisclaimer />
    </div>
  );
};

export default Landing;
