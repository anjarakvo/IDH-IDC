import React, { useState, useMemo } from "react";
import { Layout, Row, Col, Space, Image } from "antd";
import { useCookies } from "react-cookie";
import { UserState } from "../../store";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import LogoWhite from "../../assets/images/logo-white.png";
import { adminRole, allUserRole } from "../../store/static";

const pagesWithNoSider = ["/", "/login", "/welcome"];
const { Header, Content } = Layout;

const PageHeader = ({ isLoggedIn }) => {
  const navigate = useNavigate();
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
                  UserState.update((s) => {
                    s.id = 0;
                    s.fullname = null;
                    s.email = null;
                    s.role = null;
                    s.active = false;
                    s.organisation_detail = {
                      id: 0,
                      name: null,
                    };
                    s.business_unit_detail = [
                      {
                        id: 0,
                        name: null,
                        role: null,
                      },
                    ];
                    s.tags_count = 0;
                    s.cases_count = 0;
                  });
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

const PageLayout = ({ children }) => {
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
