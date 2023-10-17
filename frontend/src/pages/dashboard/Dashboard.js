import React from "react";
import { ContentLayout } from "../../components/layout";

const Dashboard = () => {
  return (
    <ContentLayout
      breadcrumbItems={[
        { title: "Home", href: "/dashboard" },
        { title: "Dashboard" },
      ]}
      title="Dashboard"
    ></ContentLayout>
  );
};

export default Dashboard;
