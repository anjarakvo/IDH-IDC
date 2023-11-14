import React, { useEffect, useState } from "react";
import { ContentLayout, TableContent } from "../../components/layout";
import { Link } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import { api } from "../../lib";
import { UIState, UserState } from "../../store";
import { Select } from "antd";
import { selectProps } from "./components";
import { isEmpty } from "lodash";

const perPage = 10;
const defData = {
  current: 1,
  data: [],
  total: 0,
  total_page: 1,
};
const filterProps = {
  ...selectProps,
  style: { width: window.innerHeight * 0.225 },
};

const Cases = () => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState(null);
  const [data, setData] = useState(defData);
  const [country, setCountry] = useState(null);
  const [commodity, setCommodity] = useState(null);
  const [tags, setTags] = useState([]);

  const tagOptions = UIState.useState((s) => s.tagOptions);
  const userID = UserState.useState((s) => s.id);

  useEffect(() => {
    if (userID) {
      setLoading(true);
      let url = `case?page=${currentPage}&limit=${perPage}`;
      if (search) {
        url = `${url}&search=${search}`;
      }
      if (country) {
        url = `${url}&country=${country}`;
      }
      if (commodity) {
        url = `${url}&focus_commodity=${commodity}`;
      }
      if (!isEmpty(tags)) {
        const tagQuery = tags.join("&tags=");
        url = `${url}&tags=${tagQuery}`;
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
  }, [currentPage, search, userID, commodity, country, tags]);

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
        const tags = record.tags
          .map((tag_id) => {
            const findTag = tagOptions.find((x) => x.value === tag_id);
            return findTag?.label || null;
          })
          .filter((x) => x);
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

  const countryOptions = window.master.countries;
  const commodityOptios = window.master.commodity_categories
    .flatMap((c) => c.commodities)
    .map((c) => ({ label: c.name, value: c.id }));

  const otherFilters = [
    <Select
      {...filterProps}
      key="1"
      options={countryOptions}
      placeholder="Filter by Country"
      value={country}
      onChange={setCountry}
    />,
    <Select
      {...filterProps}
      key="2"
      options={commodityOptios}
      placeholder="Filter by Focus Commodity"
      value={commodity}
      onChange={setCommodity}
    />,
    <Select
      {...filterProps}
      key="3"
      options={tagOptions}
      placeholder="Filter by Tags"
      mode="multiple"
      value={tags}
      onChange={setTags}
    />,
  ];

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
          style: { width: 300 },
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
        otherFilters={otherFilters}
      />
    </ContentLayout>
  );
};

export default Cases;
