import React from "react";
import "./landing.scss";
import { Row, Col, Card, Image, Collapse, Space } from "antd";
import { Link } from "react-router-dom";
import {
  LandingInfoHelpIcon,
  LandingInfoEstimateIcon,
  LandingInfoDriversIcon,
  LandAreaIcon,
  VolumeIcon,
  PriceIcon,
  CostProductionIcon,
  DiversifiedIncomeIcon,
  HouseholdIncomeIcon,
  DriverCalculationStroke,
} from "../../lib/icon";
import IncomeDriverFrameworkImg from "../../assets/images/income-driver-framework.jpeg";
import LoginRightImage from "../../assets/images/login-right-img.png";

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

const TheFrameworkDrivers = () => {
  const items = [
    {
      key: "1",
      label: "Land Area",
      children: (
        <p>
          Each of these drivers may have a significant influence on household
          income, and they are often interconnected.
        </p>
      ),
    },
    {
      key: "2",
      label: "Volume",
      children: <p>Lorem</p>,
    },
    {
      key: "3",
      label: "Price",
      children: (
        <p>
          The price per unit of the focus commodity, which may also include a
          price premium.
        </p>
      ),
    },
    {
      key: "4",
      label: "Cost of Production",
      children: <p>Lorem</p>,
    },
    {
      key: "5",
      label: "Diversified Income",
      children: (
        <p>
          The majority of farmer’ households also earn an income from other
          sources than the focus commodity. This can be income from other crops,
          livestock, income earned from off-farm labour or non-farm non labour
          sources (e.g. remittances, government transfers).
        </p>
      ),
    },
  ];

  return (
    <Row
      data-testid="framework-drivers-wrapper"
      justify="center"
      className="framework-drivers-wrapper"
    >
      <Col span={12} className="text-wrapper">
        <h2 data-testid="framework-drivers-title">
          The framework consists of five drivers
        </h2>
        <Collapse accordion items={items} bordered={false} ghost />
      </Col>
      <Col
        span={12}
        data-testid="framework-drivers-image"
        className="image-wrapper"
      >
        <Image className="image" src={LoginRightImage} preview={false} />
      </Col>
      <div className="framework-drivers-calculation-wrapper">
        <Space align="center" size={[20, 20]}>
          <Space direction="vertical" align="center">
            <div className="driver-icon-wrapper land-area-icon">
              <LandAreaIcon />
            </div>
            <div className="driver-label">Land area</div>
          </Space>
          <div className="math-symbol">x</div>
          <Space direction="vertical" align="center">
            <div className="driver-icon-wrapper volume-icon">
              <VolumeIcon />
            </div>
            <div className="driver-label">Volume</div>
          </Space>
          <div className="math-symbol">x</div>
          <Space direction="vertical" align="center">
            <div className="driver-icon-wrapper price-icon">
              <PriceIcon />
            </div>
            <div className="driver-label">Price</div>
          </Space>
          <div className="math-symbol">-</div>
          <Space direction="vertical" align="center">
            <div className="driver-icon-wrapper cost-production-icon">
              <CostProductionIcon />
            </div>
            <div className="driver-label">Cost of production</div>
          </Space>
          <div className="math-symbol">+</div>
          <Space direction="vertical" align="center">
            <div className="driver-icon-wrapper diversified-income-icon">
              <DiversifiedIncomeIcon />
            </div>
            <div className="driver-label">Diversified income</div>
          </Space>
          <div className="math-symbol">=</div>
          <Space direction="vertical" align="center">
            <div className="driver-icon-wrapper household-income-icon">
              <HouseholdIncomeIcon />
            </div>
            <div className="driver-label">Household Income</div>
          </Space>
        </Space>
        <div className="driver-calculation-stroke">
          <DriverCalculationStroke />
        </div>
      </div>
    </Row>
  );
};

const Landing = () => {
  return (
    <div className="landing-container" id="landing">
      <Jumbotron />
      <InformationCard />
      <IncomeDriverFramework />
      <TheFrameworkDrivers />

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
