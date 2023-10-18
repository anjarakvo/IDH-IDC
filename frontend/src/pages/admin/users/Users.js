import React from "react";
import { ContentLayout, TableContent } from "../../../components/layout";
import { Link } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import upperFirst from "lodash/upperFirst";

const Users = () => {
  const dataSource = [
    {
      id: 1,
      organisation: 1,
      email: "galih@akvo.org",
      fullname: "Galih Pratama",
      role: "super_admin",
      active: true,
      tags_count: 0,
      cases_count: 0,
    },
  ];

  const columns = [
    {
      title: "Fullname",
      dataIndex: "fullname",
      key: "fullname",
      width: "10%",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.fullname.localeCompare(b.fullname),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "User Role",
      dataIndex: "role",
      key: "role",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.role.localeCompare(b.role),
      render: (text) =>
        text
          .split("_")
          .map((x) => upperFirst(x))
          .join(" "),
    },
    {
      key: "action",
      width: "5%",
      align: "center",
      render: (text, record) => (
        <Link to={`/admin/user/${record.key}`}>
          <EditOutlined />
        </Link>
      ),
    },
  ];
  const onSearch = (value) => console.info(value);

  return (
    <ContentLayout
      breadcrumbItems={[
        { title: "Home", href: "/welcome" },
        { title: "Users", href: "/admin/users" },
      ]}
      title="Users"
    >
      <TableContent
        dataSource={dataSource}
        columns={columns}
        searchProps={{
          placeholder: "Find User",
          style: { width: 200 },
          onSearch: onSearch,
        }}
        buttonProps={{
          text: "Add User",
          to: "/admin/user/new",
        }}
        loading={false}
      />
    </ContentLayout>
  );
};

export default Users;
