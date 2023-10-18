import React from "react";
import "./welcome.scss";
import { Row, Col, Card, Button, Image } from "antd";
import IconCases from "../../assets/icons/icon-cases.svg";
import IconExploreStudies from "../../assets/icons/icon-explore-studies.svg";
import IconAdmin from "../../assets/icons/icon-admin.svg";
import { UserState } from "../../store";
import { useNavigate } from "react-router-dom";

const adminRole = ["super_admin", "admin"];
const allUserRole = [...adminRole, "editor", "viewer", "user"];

const cardMenus = [
  {
    testid: "card-menu-cases",
    name: "Cases",
    description:
      "Data Entry is an important interactive way to retrieve information of objects since users will frequently add, change or delete information.",
    icon: IconCases,
    path: "/cases",
    role: allUserRole,
  },
  {
    testid: "card-menu-explore-studies",
    name: "Explore Studies",
    description:
      "Data Entry is an important interactive way to retrieve information of objects since users will frequently add, change or delete information.",
    icon: IconExploreStudies,
    path: "/explore",
    role: allUserRole,
  },
  {
    testid: "card-menu-admin",
    name: "Admin",
    description:
      "Data Entry is an important interactive way to retrieve information of objects since users will frequently add, change or delete information.",
    icon: IconAdmin,
    path: "/admin",
    role: adminRole,
  },
];

const Welcome = () => {
  const navigate = useNavigate();
  const userRole = UserState.useState((s) => s.role);

  const handleOnClickButtonExplore = (val) => {
    navigate(val.path);
  };

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
          off changes in different income drivers.
        </h3>
        {/* EOL Page Title */}

        {/* Card Menu */}
        <Row className="card-menu-wrapper" gutter={[14, 14]}>
          {cardMenus
            .filter((cm) => cm.role.includes(userRole))
            .map((cm, cmi) => {
              return (
                <Col key={`card-menu-${cmi}`} span={24} data-testid={cm.testid}>
                  <Card className="card-container">
                    <Row
                      justify="center"
                      align="middle"
                      className="card-content-wrapper"
                    >
                      <Col span={2} align="center" className="icon-wrapper">
                        <Image
                          src={cm.icon}
                          preview={false}
                          data-testid={`${cm.testid}-icon`}
                        />
                      </Col>
                      <Col span={16} className="text-wrapper">
                        <h4 data-testid={`${cm.testid}-name`}>{cm.name}</h4>
                        <p data-testid={`${cm.testid}-description`}>
                          {cm.description}
                        </p>
                      </Col>
                      <Col span={6} className="button-wrapper" align="end">
                        <Button
                          data-testid={`${cm.testid}-button`}
                          className="button-green"
                          style={{ float: "right", marginRight: 20 }}
                          onClick={() => handleOnClickButtonExplore(cm)}
                        >
                          Explore
                        </Button>
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
