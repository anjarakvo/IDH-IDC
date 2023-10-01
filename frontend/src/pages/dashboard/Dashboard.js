import React from "react";
import { ContentLayout } from "../../components/layout";

const Dashboard = () => {
  return (
    <ContentLayout breadcrumbItems={[{ title: "Dashboard" }]}>
      <h1>Dashboard</h1>
    </ContentLayout>
  );
};

export default Dashboard;
