import React, { useState } from "react";
import { Breadcrumb, Card, Tabs, Affix } from "antd";
import { adminRole } from "../../store/static";
import { UserState } from "../../store";
import { useNavigate } from "react-router-dom";

const tabItems = [
  {
    key: "/admin/users",
    label: "Manage Users",
    value: "user",
  },
  {
    key: "/admin/cases",
    label: "Manage Cases",
    value: "case",
  },
  {
    key: "/admin/tags",
    label: "Manage Tags",
    value: "tag",
  },
];

const ContentLayout = ({
  children,
  wrapperId = "landing",
  breadcrumbItems = [],
  title = null,
  subTitle = null,
}) => {
  const navigate = useNavigate();
  const hasBreadcrumb = breadcrumbItems.length;
  const renderCard = hasBreadcrumb || title;
  const userRole = UserState.useState((s) => s.role);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const handleOnClickTab = (key) => {
    setCurrentPath(key);
    navigate(key);
  };

  const activeTabMenu = tabItems.find(x => currentPath.includes(x.value));

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
        <Card className="content-card-container" bordered={false}>
          {hasBreadcrumb ? (
            <Breadcrumb
              data-testid="breadcrumb"
              items={breadcrumbItems.map((x) => ({ key: x.href, ...x }))}
            />
          ) : (
            ""
          )}
          {title ? (
            <div data-testid="title" className="title">
              {title}
            </div>
          ) : (
            ""
          )}
          {subTitle ? (
            <div data-testid="subTitle" className="subTitle">
              {subTitle}
            </div>
          ) : (
            ""
          )}
        </Card>
        {currentPath.includes("/admin/") && adminRole.includes(userRole) ? (
          <Tabs
            data-testid="admin-tabs-menu"
            activeKey={activeTabMenu.key}
            items={tabItems}
            tabBarGutter={48}
            onChange={handleOnClickTab}
            className="admin-tab-menu-container"
          />
        ) : (
          ""
        )}
      </Affix>
      <div className="content-wrapper" id={wrapperId}>
        {children}
      </div>
    </div>
  );
};

export default ContentLayout;
