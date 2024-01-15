import React, { useState, useMemo } from "react";
import { Layout, Row, Col, Space, Image } from "antd";
import { useCookies } from "react-cookie";
import { UserState } from "../../store";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import Logo from "../../assets/images/logo.png";
import { adminRole, allUserRole } from "../../store/static";

const pagesWithNoSider = ["/", "/login", "/welcome", "/register"];
const pagesWithNoHeader = ["/login", "/register"];
const { Header, Content } = Layout;

const PageHeader = ({ isLoggedIn, signOut }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const userRole = UserState.useState((s) => s.role);

  const menus = [
    // {
    //   testid: "nav-menu-calculator",
    //   name: "Use the Calculator",
    //   path: "/use-calculator",
    //   role: allUserRole,
    // },
    {
      testid: "nav-menu-cases",
      name: "Cases Overview",
      path: "/cases",
      role: allUserRole,
    },
    {
      testid: "nav-menu-explore-studies",
      name: "Explore Studies",
      path: "/explore-studies",
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
        zIndex: 10,
        width: "100%",
      }}
      id="page-layout-header"
    >
      <Row justify="center" align="middle" style={{ width: "100%" }}>
        <Col span={4} align="start" style={{ width: "100%" }}>
          <Link to="/">
            <Image
              src={Logo}
              height={65}
              preview={false}
              data-testid="logo-image"
            />
          </Link>
        </Col>
        <Col span={20} align="end" testid="nav-container">
          <Space size="large" className="navigation-container">
            {/* <Link to={isLoggedIn ? "/welcome" : "/"}>About IDC</Link> */}
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
                  signOut();
                  setLoading(true);
                  setTimeout(() => {
                    setLoading(false);
                    navigate("/");
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

const PageLayout = ({ children, signOut }) => {
  const location = useLocation();
  const pathname = location?.pathname;
  const [cookies] = useCookies(["AUTH_TOKEN"]);
  const userId = UserState.useState((s) => s.id);
  const userActive = UserState.useState((s) => s.active);

  const authTokenAvailable = useMemo(() => {
    const res = cookies?.AUTH_TOKEN && cookies?.AUTH_TOKEN !== "undefined";
    return res;
  }, [cookies?.AUTH_TOKEN]);

  const isLoggedIn = useMemo(
    () => authTokenAvailable || (userId && userActive),
    [authTokenAvailable, userId, userActive]
  );

  const isResetPasswordPage =
    pathname.includes("invitation") || pathname.includes("reset-password");

  if (pagesWithNoSider.includes(pathname) || isResetPasswordPage) {
    return (
      <Layout>
        {!pagesWithNoHeader.includes(pathname) && !isResetPasswordPage ? (
          <PageHeader isLoggedIn={isLoggedIn} signOut={signOut} />
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
      <PageHeader isLoggedIn={isLoggedIn} signOut={signOut} />
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
