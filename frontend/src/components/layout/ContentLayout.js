import React from "react";
import { Breadcrumb, Card, Affix } from "antd";

const ContentLayout = ({
  children,
  wrapperId = "landing",
  breadcrumbItems = [],
  title = null,
  subTitle = null,
}) => {
  const hasBreadcrumb = breadcrumbItems.length;
  const renderCard = hasBreadcrumb || title;

  if (!renderCard) {
    return (
      <div className="content-wrapper" id={wrapperId}>
        {children}
      </div>
    );
  }

  return (
    <div>
      <Affix offsetTop={80}>
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
      </Affix>
      <div className="content-wrapper" id={wrapperId}>
        {children}
      </div>
    </div>
  );
};

export default ContentLayout;
