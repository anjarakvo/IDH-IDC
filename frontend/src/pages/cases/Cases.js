import React from "react";
import { ContentLayout } from "../../components/layout";

const Cases = () => {
  return (
    <ContentLayout
      breadcrumbItems={[
        { title: "Home", href: "/dashboard" },
        { title: "Cases", href: "/cases" },
      ]}
      title="Cases"
    ></ContentLayout>
  );
};

export default Cases;
