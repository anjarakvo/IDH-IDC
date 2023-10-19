import React, { useState } from "react";
import { Layout, Row, Col, Space, Image } from "antd";
import { useCookies } from "react-cookie";
import { UserState } from "../../store";
import { Link, useLocation } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import LogoWhite from "../../assets/images/logo-white.png";
import { adminRole, allUserRole } from "../../store/static";

const pagesWithNoSider = ["/", "/login", "/welcome", "/register"];
const pagesWithNoHeader = ["/login", "/register"];
const { Header, Content } = Layout;

const PageHeader = ({ isLoggedIn }) => {
  const [loading, setLoading] = useState(false);
  const [, , removeCookie] = useCookies(["AUTH_TOKEN"]);
  const userRole = UserState.useState((s) => s.role);

  const menus = [
    {
      testid: "nav-menu-cases",
      name: "Cases",
      path: "/cases",
      role: allUserRole,
    },
    {
      testid: "nav-menu-explore-studies",
      name: "Explore Studies",
      path: "/explore",
      role: allUserRole,
    },
    {
      testid: "nav-menu-admin",
      name: "Admin",
      path: "/admin/users",
      role: adminRole,
    },
  ];

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
        <Col span={6} align="start" style={{ width: "100%" }}>
          <Link to="/">
            <Image
              src={LogoWhite}
              height={65}
              preview={false}
              data-testid="logo-image"
            />
          </Link>
        </Col>
        <Col span={18} align="end" testid="nav-container">
          <Space size="large" className="navigation-container">
            <Link to="/about">About IDC</Link>
            {isLoggedIn
              ? menus
                  .filter((x) => x.role.includes(userRole))
                  .map((x, xi) => (
                    <Link
                      key={`nav-menu-${xi}`}
                      data-testid={x.testid}
                      to={x.path}
                    >
                      {x.name}
                    </Link>
                  ))
              : ""}
            {!isLoggedIn ? (
              <Link className="nav-sign-in" to="/login">
                {" "}
                Sign in
              </Link>
            ) : (
              <Link
                className="nav-sign-in"
                onClick={() => {
                  removeCookie("AUTH_TOKEN");
                  setLoading(true);
                  setTimeout(() => {
                    window.location.reload();
                    setLoading(false);
                  }, 300);
                }}
              >
                {loading ? (
                  <Space>
                    <LoadingOutlined />
                    Sign out
                  </Space>
                ) : (
                  "Sign out"
                )}
              </Link>
            )}
          </Space>
        </Col>
      </Row>
    </Header>
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
        {!pagesWithNoHeader.includes(pathname) ? (
          <PageHeader isLoggedIn={isLoggedIn} />
        ) : (
          ""
        )}
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
