import React from "react";
import { Layout, Menu } from "antd";
import { useCookies } from "react-cookie";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { UserState } from "../../store";

const { Header, Content, Sider } = Layout;

const PageHeader = () => {
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
      <div className="title">
        <h3>Project Title</h3>
      </div>
    </Header>
  );
};

const PageLayout = ({ children }) => {
  const [cookies] = useCookies(["AUTH_TOKEN"]);
  const { id: userId, active: userActive } = UserState.useState((s) => s);
  const authTokenAvailable =
    cookies?.AUTH_TOKEN && cookies?.AUTH_TOKEN !== "undefined";

  const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
    (icon, index) => {
      const key = String(index + 1);
      return {
        key: `sub${key}`,
        icon: React.createElement(icon),
        label: `subnav ${key}`,
        children: new Array(4).fill(null).map((_, j) => {
          const subKey = index * 4 + j + 1;
          return {
            key: subKey,
            label: `option${subKey}`,
          };
        }),
      };
    }
  );

  if (!authTokenAvailable || !(userId && userActive)) {
    return (
      <Layout>
        <Content testid="layout-content" className="content-container">
          {children}
        </Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader />
      <Layout>
        <Sider testid="layout-sider" width={235}>
          <Menu
            testid="menu-container"
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 }}
            items={items2}
          />
        </Sider>
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
