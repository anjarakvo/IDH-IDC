import React from "react";
import { ContentLayout } from "../../components/layout";

const Home = () => {
  return (
    <ContentLayout breadcrumbItems={[{ title: "Home" }]}>
      <h1>Home</h1>
    </ContentLayout>
  );
};

export default Home;
