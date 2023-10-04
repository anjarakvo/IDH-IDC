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
      <Card className="content-card-container">
        {hasBreadcrumb ? (
          <Breadcrumb testid="breadcrumb" items={breadcrumbItems} />
        ) : (
          ""
        )}
        {title ? (
          <div testid="title" className="title">
            {title}
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
