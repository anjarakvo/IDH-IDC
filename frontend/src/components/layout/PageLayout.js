import React from "react";
import { Layout, Menu, Row, Col, Space } from "antd";
import { useCookies } from "react-cookie";
import { FolderOpenOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { UserState } from "../../store";
import { Link, useLocation } from "react-router-dom";

const pagesWithNoSider = ["/", "/login", "/welcome"];
const { Header, Content, Sider } = Layout;

const PageHeader = ({ isLoggedIn }) => {
  const location = useLocation();
  const pathname = location?.pathname;

  return (
    <Header
      testid="layout-header"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
      }}
    >
      <Row justify="center" align="middle" style={{ width: "100%" }}>
        <Col span={14} align="start">
          <div data-testid="logo-container" className="logo" />
          {/* {isLoggedIn ? (
            <div className="title">
              <h3>Explore Cases</h3>
            </div>
          ) : (
            ""
          )} */}
        </Col>
        <Col span={10} align="end" testid="nav-container">
          {!isLoggedIn || pathname === "/" ? (
            <Space size="large" className="navigation-container">
              <Link>About Us</Link>
              <Link className="nav-sign-in" to="/login">
                Sign in
              </Link>
            </Space>
          ) : (
            ""
          )}
        </Col>
      </Row>
    </Header>
  );
};

const PageSider = () => {
  const sideMenuItems = [
    {
      key: `project`,
      icon: <FolderOpenOutlined />,
      label: "Project",
      // children: new Array(4).fill(null).map((_, j) => {
      //   const subKey = index * 4 + j + 1;
      //   return {
      //     key: subKey,
      //     label: `option${subKey}`,
      //   };
      // }),
    },
    {
      key: `inputs`,
      icon: <CheckCircleOutlined />,
      label: "Inputs",
    },
    {
      key: `outputs`,
      icon: <CheckCircleOutlined />,
      label: "Outputs",
    },
  ];

  return (
    <Sider testid="layout-sider" width={235}>
      <Menu
        testid="menu-container"
        mode="inline"
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        style={{ height: "100%", borderRight: 0 }}
        items={sideMenuItems}
      />
    </Sider>
  );
};

const PageLayout = ({ children }) => {
  const [cookies] = useCookies(["AUTH_TOKEN"]);
  const { id: userId, active: userActive } = UserState.useState((s) => s);
  const authTokenAvailable =
    cookies?.AUTH_TOKEN && cookies?.AUTH_TOKEN !== "undefined";
  const isLoggedIn = authTokenAvailable || (userId && userActive);
  const location = useLocation();
  const pathname = location?.pathname;

  if (pagesWithNoSider.includes(pathname)) {
    return (
      <Layout>
        {pathname !== "/login" ? <PageHeader isLoggedIn={isLoggedIn} /> : ""}
        <Content testid="layout-content" className="content-container">
          {children}
        </Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader isLoggedIn={isLoggedIn} />
      <Layout>
        <PageSider />
        <Layout>
          <Content testid="layout-content" className="content-container">
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default PageLayout;
