import React from "react";
import { Breadcrumb, Card } from "antd";

const ContentLayout = ({
  children,
  breadcrumbItems = [],
  title = null,
  subTitle = null,
}) => {
  const hasBreadcrumb = breadcrumbItems.length;
  const renderCard = hasBreadcrumb || title;

  if (!renderCard) {
    return <div className="content-wrapper">{children}</div>;
  }

  return (
    <div>
      <Card style={{ padding: "12px 0 8px 0" }}>
        {hasBreadcrumb ? (
          <Breadcrumb testid="breadcrumb" items={breadcrumbItems} />
        ) : (
          ""
        )}
        {title ? (
          <div testid="title" className="title">
            Page Title
          </div>
        ) : (
          ""
        )}
        {subTitle ? (
          <div testid="subTitle" className="subTitle">
            {subTitle}
          </div>
        ) : (
          ""
        )}
      </Card>
      <div className="content-wrapper">{children}</div>
    </div>
  );
};

export default ContentLayout;
