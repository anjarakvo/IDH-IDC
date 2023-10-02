import React from "react";
import { Card } from "antd";
import { ContentLayout } from "../../components/layout";

const Home = () => {
  return (
    <ContentLayout
      breadcrumbItems={[{ title: "Home" }]}
      title="HomePage"
      subTitle="Lorem ipsum sit dolor"
    >
      <Card>Test1</Card>
      <Card>Test2</Card>
    </ContentLayout>
  );
};

export default Home;
