import React from "react";
import { ContentLayout } from "../../../components/layout";

const Users = () => {
  return (
    <ContentLayout
      breadcrumbItems={[
        { title: "Home", href: "/welcome" },
        { title: "Users", href: "/admin/users" },
      ]}
      title="Users"
    >
      Users
    </ContentLayout>
  );
};

export default Users;
