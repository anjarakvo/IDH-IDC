import React from "react";
import "./welcome.scss";
import { Row, Col, Card, Button, Image } from "antd";
import IconCases from "../../assets/icons/icon-cases.png";
import IconExploreStudies from "../../assets/icons/icon-explore-studies.png";
import IconAdmin from "../../assets/icons/icon-admin.png";

const cardMenus = [
  {
    name: "Cases",
    description:
      "Data Entry is an important interactive way to retrieve information of objects since users will frequently add, change or delete information.",
    icon: IconCases,
    path: null,
    role: null,
  },
  {
    name: "Explore Studies",
    description:
      "Data Entry is an important interactive way to retrieve information of objects since users will frequently add, change or delete information.",
    icon: IconExploreStudies,
    path: null,
    role: null,
  },
  {
    name: "Admin",
    description:
      "Data Entry is an important interactive way to retrieve information of objects since users will frequently add, change or delete information.",
    icon: IconAdmin,
    path: null,
    role: ["super_admin", "admin"],
  },
];

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
        <Row className="card-menu-wrapper" gutter={[14, 14]}>
          {cardMenus.map((cm, cmi) => {
            return (
              <Col key={`card-menu-${cmi}`} span={24}>
                <Card className="card-container">
                  <Row
                    justify="center"
                    align="middle"
                    justifyContent="center"
                    className="card-content-wrapper"
                  >
                    <Col span={2} align="center" className="icon-wrapper">
                      <Image src={cm.icon} height={80} preview={false} />
                    </Col>
                    <Col span={20} className="text-wrapper">
                      <h4>{cm.name}</h4>
                      <p>{cm.description}</p>
                    </Col>
                    <Col span={2}>
                      <Button className="button-green">Explore</Button>
                    </Col>
                  </Row>
                </Card>
              </Col>
            );
          })}
        </Row>
        {/* EOL Card Menu */}
      </Col>
    </Row>
  );
};

export default Welcome;
