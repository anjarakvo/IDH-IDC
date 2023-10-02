import React from "react";
import { Breadcrumb } from "antd";

const ContentLayout = ({ children, breadcrumbItems = [] }) => {
  const hasBreadcrumb = breadcrumbItems.length;
  return (
    <div>
      {hasBreadcrumb ? (
        <Breadcrumb style={{ margin: "16px 0" }} items={breadcrumbItems} />
      ) : (
        ""
      )}
      <div>{children}</div>
    </div>
  );
};

export default ContentLayout;
