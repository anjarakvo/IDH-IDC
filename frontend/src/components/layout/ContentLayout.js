import React from "react";
import { Breadcrumb } from "antd";

const ContentLayout = ({ children, breadcrumbItems = [{ title: null }] }) => {
  return (
    <div>
      <Breadcrumb style={{ margin: "16px 0" }} items={breadcrumbItems} />
      <div style={{ padding: 24, minHeight: 380, background: "#fff" }}>
        {children}
      </div>
    </div>
  );
};

export default ContentLayout;
