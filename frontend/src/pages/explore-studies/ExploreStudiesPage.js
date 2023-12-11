import React, { useMemo } from "react";
import "./explore-studies-page.scss";
import { ContentLayout } from "../../components/layout";
import { Row, Col, Alert, Button, Card, Select, Input } from "antd";
import { UserState, UIState } from "../../store";
import { adminRole } from "../../store/static";
import { SearchOutlined } from "@ant-design/icons";

const selectProps = {
  showSearch: true,
  allowClear: true,
  optionFilterProp: "label",
  style: {
    width: "100%",
  },
};

const ExploreStudiesPage = () => {
  const userRole = UserState.useState((s) => s.role);
  const tagOptions = UIState.useState((s) => s.tagOptions);

  const countryOptions = window.master.countries;

  const isAdmin = useMemo(() => adminRole.includes(userRole), [userRole]);

  return (
    <ContentLayout
      breadcrumbItems={[
        { title: "Home", href: "/welcome" },
        { title: "Explore Studies" },
      ]}
      wrapperId="explore-studies-page"
    >
      <Row gutter={[24, 24]} className="explore-content-wrapper">
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
                {isAdmin ? (
                  <Button className="button button-green-fill">
                    Create a new Cases
                  </Button>
                ) : null}
              </div>
            }
          />
        </Col>
        <Col span={24}>
          <Card title="Cases" className="info-card-wrapper">
            <Row gutter={[16, 16]} className="explore-filter-wrapper">
              <Col span={24}>
                <Row gutter={[16, 16]} justify="space-between" align="bottom">
                  <Col span={8}>
                    <div className="filter-label">Country</div>
                    <Select
                      {...selectProps}
                      options={countryOptions}
                      placeholder="Select a Country"
                    />
                  </Col>
                  <Col span={8}>
                    <div className="filter-label">Map View</div>
                    <Select
                      {...selectProps}
                      options={[]}
                      placeholder="Select map view"
                    />
                  </Col>
                  <Col span={8}>
                    <Input prefix={<SearchOutlined />} placeholder="Search" />
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row gutter={[16, 16]} justify="space-between" align="bottom">
                  <Col span={22}>
                    <div className="filter-label">Tags</div>
                    <Select
                      {...selectProps}
                      mode="multiple"
                      options={tagOptions}
                      placeholder="Select tags"
                    />
                  </Col>
                  <Col span={2}>
                    <Button className="search-button">Search</Button>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <div className="map-container"></div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </ContentLayout>
  );
};

export default ExploreStudiesPage;
