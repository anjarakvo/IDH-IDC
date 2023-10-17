import React from "react";
import { ContentLayout, TableContent } from "../../components/layout";
import { Link } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";

const Cases = () => {
  const dataSource = [
    {
      key: "1",
      country: "China",
      case: "Case 1",
      tags: "Tag 1",
      date: "2020",
    },
    {
      key: "2",
      country: "Indonesia",
      case: "Case 2",
      tags: "Tag 2",
      date: "2021",
    },
  ];

  const columns = [
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      width: "10%",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.country.localeCompare(b.country),
    },
    {
      title: "Case Name",
      dataIndex: "case",
      key: "case",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.case.localeCompare(b.case),
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
    },
    {
      title: "Year",
      dataIndex: "date",
      key: "date",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.date - b.date,
    },
    {
      key: "action",
      render: (text, record) => (
        <Link to={`/cases/${record.key}`}>
          <EditOutlined />
        </Link>
      ),
    },
  ];
  const onSearch = (value) => console.info(value);

  return (
    <ContentLayout
      breadcrumbItems={[
        { title: "Home", href: "/dashboard" },
        { title: "Cases", href: "/cases" },
      ]}
      title="Cases"
    >
      <TableContent
        dataSource={dataSource}
        columns={columns}
        searchProps={{
          placeholder: "Cases",
          style: { width: 200 },
          onSearch: onSearch,
        }}
        buttonProps={{
          text: "New Case",
          to: "/cases/new",
        }}
        loading={false}
      />
    </ContentLayout>
  );
};

export default Cases;
