import React from "react";
import { Layout, Menu, Breadcrumb } from "antd";

const { Header, Content } = Layout;

const PageLayout = ({ children }) => {
  return (
    <Layout>
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
        <div testid="logo-container" className="demo-logo" />
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
      <Content
        testid="layout-content"
        className="site-layout"
        style={{ padding: "0 50px" }}
      >
        <Breadcrumb
          style={{ margin: "16px 0" }}
          items={[
            {
              title: "Home",
            },
          ]}
        />
        <div style={{ padding: 24, minHeight: 380, background: "#fff" }}>
          {children}
        </div>
      </Content>
    </Layout>
  );
};

export default PageLayout;
