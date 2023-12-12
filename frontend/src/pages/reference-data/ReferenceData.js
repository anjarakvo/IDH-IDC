import React, { useState } from "react";
import "./reference-data.scss";
import { ContentLayout, TableContent } from "../../components/layout";
import { EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const perPage = 10;
const defData = {
  current: 1,
  data: [],
  total: 0,
  total_page: 1,
};

const ReferenceData = () => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(defData);

  const columns = [
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      width: "35%",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.country.localeCompare(b.country),
    },
    {
      title: "Focus Crop",
      dataIndex: "crop",
      key: "crop",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.crop.localeCompare(b.crop),
    },
    {
      title: "Data Source",
      dataIndex: "source",
      key: "source",
    },
    {
      key: "action",
      width: "5%",
      align: "center",
      render: (text, record) => (
        <Link to={`/reference-data/${record.id}`}>
          <EditOutlined />
        </Link>
      ),
    },
  ];

  const onSearch = (value) => setSearch(value);

  return (
    <ContentLayout
      breadcrumbItems={[
        { title: "Home", href: "/welcome" },
        { title: "Reference Data", href: "/reference-data" },
      ]}
      title="Reference Data"
      wrapperId="reference-data"
    >
      <TableContent
        title="Reference Data"
        dataSource={data.data}
        columns={columns}
        searchProps={{
          placeholder: "Find Reference Data",
          style: { width: 350 },
          onSearch: onSearch,
        }}
        buttonProps={{
          text: "New Reference Data",
          to: "/reference-data/new",
        }}
        loading={loading}
        paginationProps={{
          current: currentPage,
          pageSize: perPage,
          total: data.total,
          onChange: (page) => setCurrentPage(page),
        }}
      />
    </ContentLayout>
  );
};

export default ReferenceData;
