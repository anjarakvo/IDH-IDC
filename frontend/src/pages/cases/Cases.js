import React, { useEffect, useState } from "react";
import { ContentLayout, TableContent } from "../../components/layout";
import { Link } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import { api } from "../../lib";
import { UIState, UserState } from "../../store";

const perPage = 10;
const defData = {
  current: 1,
  data: [],
  total: 0,
  total_page: 1,
};

const Cases = () => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState(null);
  const [data, setData] = useState(defData);
  const tagOptions = UIState.useState((s) => s.tagOptions);
  const userID = UserState.useState((s) => s.id);

  useEffect(() => {
    if (userID) {
      setLoading(true);
      let url = `case?page=${currentPage}&limit=${perPage}`;
      if (search) {
        url = `${url}&search=${search}`;
      }
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
    }
  }, [currentPage, search, userID]);

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
      dataIndex: "name",
      key: "case",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Tags",
      key: "tags",
      render: (record) => {
        const tags = record.tags.map((tag_id) => {
          const findTag = tagOptions.find((x) => x.value === tag_id);
          return findTag.label;
        });
        if (!tags.length) {
          return "-";
        }
        return tags.join(", ");
      },
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.year - b.year,
    },
    {
      key: "action",
      width: "5%",
      align: "center",
      render: (text, record) => (
        <Link to={`/cases/${record.id}`}>
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
        { title: "Cases", href: "/cases" },
      ]}
      title="Cases"
    >
      <TableContent
        title="All Cases"
        dataSource={data.data}
        columns={columns}
        searchProps={{
          placeholder: "Find Case",
          style: { width: 400 },
          onSearch: onSearch,
        }}
        buttonProps={{
          text: "New Case",
          to: "/cases/new",
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

export default Cases;
