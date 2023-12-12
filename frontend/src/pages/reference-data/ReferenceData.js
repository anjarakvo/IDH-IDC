import React from "react";
import "./reference-data.scss";
import { ContentLayout } from "../../components/layout";

const ReferenceData = () => {
  return (
    <ContentLayout
      breadcrumbItems={[
        { title: "Home", href: "/welcome" },
        { title: "Reference Data", href: "/reference-data" },
      ]}
      title="Reference Data"
      wrapperId="reference-data"
    >
      ReferenceData
    </ContentLayout>
  );
};

export default ReferenceData;
