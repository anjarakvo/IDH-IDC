import { render, waitFor, act } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Users from "../Users";

global.window.location = {
  ancestorOrigins: null,
  hash: null,
  host: "dummy.com",
  port: "80",
  protocol: "http:",
  hostname: "dummy.com",
  href: "http://dummy.com?page=1&name=testing",
  origin: "http://dummy.com",
  pathname: "/admin/users",
  search: null,
  assign: null,
  reload: null,
  replace: null,
};

describe("Users page", () => {
  it("should render page title, breadcrumbs, and admin tabs menu", async () => {
    const wrapper = render(
      <Router>
        <Users />
      </Router>
    );
    waitFor(() => {
      expect(wrapper.getByTestId("breadcrumb").toBeInTheDocument());
      expect(wrapper.getByTestId("title").not.toBeInTheDocument());
      expect(wrapper.getByTestId("subTitle").not.toBeInTheDocument());
      expect(wrapper.getByTestId("admin-tabs-menu").not.toBeInTheDocument());
    });
  });

  it.todo("should render user list table content");
  it.todo("should filter user list by search value");
  it.todo("should go to add new user page if Add User button clicked");
  it.todo("should go to edit user page if edit icon clicked");
});
