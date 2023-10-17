import { render, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { PageLayout } from "../../../components/layout";
import Welcome from "../Welcome";

describe("Welcome page", () => {
  it.todo("should render navigation menu for non admin user");
  it.todo("should render navigation menu for admin user");

  it("should render welcome title and subtitle", () => {
    const { getByTestId } = render(
      <Router>
        <PageLayout>
          <Welcome />
        </PageLayout>
      </Router>
    );
    expect(getByTestId("page-title")).toBeInTheDocument();
    expect(getByTestId("page-subtitle")).toBeInTheDocument();
  });

  it.todo(
    "should render cases and explore studies card menu for all user role"
  );
  it.todo("should render admin card menu only for super admin and admin role");
  it.todo("should go to about IDC page if About IDC menu clicked");
  it.todo("should go to cases page if Cases menu clicked");
  it.todo("should go to explore studies page if Explore Studies menu clicked");
  it.todo("should go to admin page if Admin menu clicked");
});
