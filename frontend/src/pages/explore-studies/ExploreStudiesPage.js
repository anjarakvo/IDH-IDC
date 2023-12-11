import React from "react";
import "./explore-studies-page.scss";
import { ContentLayout } from "../../components/layout";
import { Row, Col, Alert, Button } from "antd";

const ExploreStudiesPage = () => {
  return (
    <ContentLayout
      breadcrumbItems={[
        { title: "Home", href: "/welcome" },
        { title: "Explore Studies" },
      ]}
      wrapperId="explore-studies-page"
    >
      <Row gutter={[16, 16]} className="explore-content-wrapper">
        <Col span={24}>
          <Alert
            className="explore-info-wrapper"
            type="success"
            message={
              <div className="explore-info-content">
                <h2>Explore Studies for Insights</h2>
                <p>
                  To make the data entry process more informed and efficient, we
                  recommend visiting the &quot;Explore Studies&quot; section.
                  Here, you can access valuable insights into feasible levels of
                  income drivers for your selected country and sector.
                </p>
                <Button className="button button-green-fill">
                  Create a new Cases
                </Button>
              </div>
            }
          />
        </Col>
      </Row>
    </ContentLayout>
  );
};

export default ExploreStudiesPage;
