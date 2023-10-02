import React from "react";
import "./home.scss";
import { Card, Row, Col, Space, Select, Table } from "antd";
import { FullscreenOutlined } from "@ant-design/icons";
import { ContentLayout } from "../../components/layout";

const columns = [
  {
    title: "Country",
    dataIndex: "country",
  },
  {
    title: "Crop",
    dataIndex: "crop",
  },
  {
    title: "Source",
    dataIndex: "source",
  },
  {
    title: "Year",
    dataIndex: "year",
  },
  {
    title: <FullscreenOutlined />,
    width: "3%",
    render: () => <FullscreenOutlined />,
  },
];

const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    country: "Kenya",
    crop: "Coffee",
    source: "SDM",
    year: "2021-02-05 08:28:36",
  });
}

const Home = () => {
  return (
    <ContentLayout
      breadcrumbItems={[{ title: "Home" }, { title: "Explore Cases" }]}
      title="Explore Cases"
    >
      <Card className="home-card-container">
        <Row gutter={[12, 12]}>
          <Col span={12}>
            <Space>
              <div>Crop</div>
              <Select data-testid="crop-selector" options={[]} />
            </Space>
          </Col>
          <Col span={12}>
            <Space>
              <div>Country</div>
              <Select data-testid="country-selector" options={[]} />
            </Space>
          </Col>
        </Row>
      </Card>
      <Card className="home-card-container">
        <Table data-testid="data-table" columns={columns} dataSource={data} />
      </Card>
    </ContentLayout>
  );
};

export default Home;
