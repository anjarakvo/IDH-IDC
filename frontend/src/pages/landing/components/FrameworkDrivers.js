import React from "react";
import "./landingcomp.scss";
import { Row, Col, Image, Collapse, Space } from "antd";
import { DriverCalculationStroke } from "../../../lib/icon";
import LoginRightImage from "../../../assets/images/login-right-img.png";
import LandAreaIcon from "../../../assets/icons/land.png";
import VolumeIcon from "../../../assets/icons/volume.png";
import PriceIcon from "../../../assets/icons/price.png";
import CostProductionIcon from "../../../assets/icons/cost-of-production.png";
import DiversifiedIncomeIcon from "../../../assets/icons/diversified-income.png";
import HouseholdIncomeIcon from "../../../assets/icons/hh-income.png";

const FrameworkDrivers = () => {
  const items = [
    {
      key: "1",
      label: "Land",
      children: <p>The size of the land used to grow the crops.</p>,
    },
    {
      key: "2",
      label: "Volume",
      children: (
        <p>
          The volume of produce available for commercial sale, taking into
          account both yield and potential losses.
        </p>
      ),
    },
    {
      key: "3",
      label: "Price",
      children: (
        <p>
          The farmgate price for the produce which may also include a price
          premiums.
        </p>
      ),
    },
    {
      key: "4",
      label: "Cost of Production",
      children: (
        <p>
          The costs of production for producing the primary Crop which covers
          all can cover several types of costs, such as costs for labour, inputs
          or equipment.
        </p>
      ),
    },
    {
      key: "5",
      label: "Diversified Income",
      children: (
        <p>
          The majority of farmer households also earn an income from other
          sources than the primary commodity. This can be income from other
          crops, livestock, income earned from off-farm labour or non-farm non
          labour sources (e.g. remittances, government transfers).
        </p>
      ),
    },
  ];

  return (
    <Row
      id="framework-drivers"
      data-testid="framework-drivers-wrapper"
      justify="center"
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
              <Image src={LandAreaIcon} preview={false} />
            </div>
            <div className="driver-label">Land</div>
          </Space>
          <div className="math-symbol">x</div>
          <Space direction="vertical" align="center">
            <div className="driver-icon-wrapper volume-icon">
              <Image src={VolumeIcon} preview={false} />
            </div>
            <div className="driver-label">Volume</div>
          </Space>
          <div className="math-symbol">x</div>
          <Space direction="vertical" align="center">
            <div className="driver-icon-wrapper price-icon">
              <Image src={PriceIcon} preview={false} />
            </div>
            <div className="driver-label">Price</div>
          </Space>
          <div className="math-symbol">-</div>
          <Space direction="vertical" align="center">
            <div className="driver-icon-wrapper cost-production-icon">
              <Image src={CostProductionIcon} preview={false} />
            </div>
            <div className="driver-label">Cost of production</div>
          </Space>
          <div className="math-symbol">+</div>
          <Space direction="vertical" align="center">
            <div className="driver-icon-wrapper diversified-income-icon">
              <Image src={DiversifiedIncomeIcon} preview={false} />
            </div>
            <div className="driver-label">Diversified income</div>
          </Space>
          <div className="math-symbol">=</div>
          <Space direction="vertical" align="center">
            <div className="driver-icon-wrapper household-income-icon">
              <Image src={HouseholdIncomeIcon} preview={false} />
            </div>
            <div className="driver-label">Household Income</div>
          </Space>
        </Space>
        <div className="driver-calculation-stroke">
          <Space direction="vertical" align="center">
            <DriverCalculationStroke />
            <div className="driver-label">Primary Crop</div>
          </Space>
        </div>
      </div>
    </Row>
  );
};

export default FrameworkDrivers;
