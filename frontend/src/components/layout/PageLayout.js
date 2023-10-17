import React, { useState } from "react";
import { Layout, Row, Col, Space } from "antd";
import { useCookies } from "react-cookie";
import { UserState } from "../../store";
import { Link, useLocation } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;

const PageHeader = ({ isLoggedIn }) => {
  const [loading, setLoading] = useState(false);
  const [, , removeCookie] = useCookies(["AUTH_TOKEN"]);

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
        <Col span={6} align="start">
          <Link to="/">
            <div data-testid="logo-container" className="logo" />
          </Link>
        </Col>
        <Col span={18} align="end" testid="nav-container">
          <Space size="large" className="navigation-container">
            <Link to="/about">About IDC</Link>
            {isLoggedIn ? <Link to="/cases">Cases</Link> : ""}
            <Link to="/explore">Explore Studies</Link>
            {isLoggedIn ? <Link to="/admin">Admin</Link> : ""}
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

  if (pathname === "/" || pathname === "/login") {
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
