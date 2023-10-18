import React from "react";
import { ContentLayout } from "../../../components/layout";

const UserForm = () => {
  return (
    <ContentLayout
      breadcrumbItems={[
        { title: "Home", href: "/welcome" },
        { title: "Users", href: "/admin/users" },
        { title: "Add User", href: "/admin/user/new" },
      ]}
      title="Add User"
      wrapperId="user"
    >
      <h1>User Form</h1>
    </ContentLayout>
  );
};

export default UserForm;
