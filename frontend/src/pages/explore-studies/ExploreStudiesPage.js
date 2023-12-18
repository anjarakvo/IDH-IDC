import React, { useMemo, useState, useCallback, useEffect } from "react";
import "./explore-studies-page.scss";
import { ContentLayout } from "../../components/layout";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Alert,
  Button,
  Card,
  Select,
  Input,
  Table,
  message,
} from "antd";
import { UserState, UIState } from "../../store";
import { adminRole } from "../../store/static";
import { SearchOutlined, EditOutlined } from "@ant-design/icons";
import { upperFirst } from "lodash";
import ReferenceDataForm from "./ReferenceDataForm";
import { api } from "../../lib";

const selectProps = {
  showSearch: true,
  allowClear: true,
  optionFilterProp: "label",
  style: {
    width: "100%",
  },
};

const perPage = 10;
const defData = {
  current: 1,
  data: [],
  total: 0,
  total_page: 1,
};

const ExploreStudiesPage = () => {
  const userRole = UserState.useState((s) => s.role);
  const tagOptions = UIState.useState((s) => s.tagOptions);

  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(defData);

  const countryOptions = window.master.countries;

  const isAdmin = useMemo(() => adminRole.includes(userRole), [userRole]);

  const columns = [
    {
      key: "country",
      title: "Country",
      dataIndex: "country",
    },
    {
      key: "commodity",
      title: "Commodity",
      dataIndex: "commodity",
    },
    {
      key: "confidence_level",
      title: "Confidence Level",
      dataIndex: "confidence_level",
      render: (value) => upperFirst(value),
    },
    {
      key: "source",
      title: "Source",
      dataIndex: "source",
      render: (value, row) => {
        if (!row?.link) {
          return value;
        }
        const url = row.link?.includes("https://")
          ? row.link
          : `https://${row.link}`;
        return (
          <a href={url} target="_blank" rel="noreferrer noopener">
            {row.source}
          </a>
        );
      },
    },
    {
      key: "action",
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <Link>
          <EditOutlined />
        </Link>
      ),
    },
  ];

  const fetchReferenceData = useCallback(() => {
    setLoading(true);
    let url = `reference_data?page=${currentPage}&limit=${perPage}`;
    api
      .get(url)
      .then((res) => {
        setData(res.data);
      })
      .catch((e) => {
        console.error(e.response);
        const { status } = e.response;
        if (status === 404) {
          setData(defData);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage]);

  useEffect(() => {
    fetchReferenceData();
  }, [fetchReferenceData, currentPage]);

  const onSave = ({ payload, setConfirmLoading, resetFields }) => {
    setConfirmLoading(true);
    api
      .post("reference_data", payload)
      .then(() => {
        messageApi.open({
          type: "success",
          content: "Reference Data saved successfully.",
        });
        resetFields();
      })
      .catch(() => {
        messageApi.open({
          type: "error",
          content: "Failed! Something went wrong.",
        });
      })
      .finally(() => {
        setTimeout(() => {
          setOpen(false);
          setConfirmLoading(false);
        }, 500);
      });
  };

  return (
    <ContentLayout
      breadcrumbItems={[
        { title: "Home", href: "/welcome" },
        { title: "Explore Studies" },
      ]}
      wrapperId="explore-studies-page"
    >
      {contextHolder}
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
                  <Button
                    className="button button-green-fill"
                    onClick={() => setOpen(true)}
                  >
                    {/* Open Form Modal */}
                    Add New Rerefence Data
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

        <Col span={24}>
          <Table
            rowKey="id"
            className="table-wrapper"
            dataSource={data.data}
            columns={columns}
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize: perPage,
              total: data.total,
              onChange: (page) => setCurrentPage(page),
            }}
          />
        </Col>
      </Row>

      {/* Form Modal */}
      <ReferenceDataForm open={open} setOpen={setOpen} onSave={onSave} />
    </ContentLayout>
  );
};

export default ExploreStudiesPage;
