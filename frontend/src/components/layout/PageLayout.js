import React from "react";
import { Layout, Menu } from "antd";
import { useCookies } from "react-cookie";
// import { UserState } from "../../store";

const { Header, Content } = Layout;

const PageHeader = () => {
  const [cookies] = useCookies(["AUTH_TOKEN"]);
  // const { id: userId, active: userActive } = UserState.useState((s) => s);
  const authTokenAvailable =
    cookies?.AUTH_TOKEN && cookies?.AUTH_TOKEN !== "undefined";

  if (!authTokenAvailable) {
    return "";
  }

  return (
    <Header
      testid="layout-header"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div testid="logo-container" className="logo" />
      <Menu
        testid="menu-container"
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["2"]}
        items={new Array(3).fill(null).map((_, index) => ({
          key: String(index + 1),
          label: `nav ${index + 1}`,
        }))}
      />
    </Header>
  );
};

const PageLayout = ({ children }) => {
  return (
    <Layout>
      <PageHeader />
      <Content testid="layout-content" className="content-container">
        {children}
      </Content>
    </Layout>
  );
};

export default PageLayout;
