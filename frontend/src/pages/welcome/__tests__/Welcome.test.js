import { render, act } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { PageLayout } from "../../../components/layout";
import Welcome from "../Welcome";
import { UserState } from "../../../store";

const organisation_detail = {
  id: 1,
  name: "Akvo",
};
const business_unit_detail = [
  {
    id: 1,
    name: "Meat Guy",
    role: "admin",
  },
];

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

  it("should render cases and explore studies card menu for all user role", () => {
    const { getByTestId, queryByTestId } = render(
      <Router>
        <PageLayout>
          <Welcome />
        </PageLayout>
      </Router>
    );

    act(() => {
      UserState.update((s) => {
        s.id = 1;
        s.fullname = "John Doe";
        s.email = "editor@akvo.com";
        s.role = "editor";
        s.active = true;
        s.organisation_detail = organisation_detail;
        s.business_unit_detail = business_unit_detail;
        s.tags_count = 2;
        s.cases_count = 1;
      });
    });

    expect(getByTestId("card-menu-cases")).toBeInTheDocument();
    expect(getByTestId("card-menu-cases-icon")).toBeInTheDocument();
    expect(getByTestId("card-menu-cases-name")).toBeInTheDocument();
    expect(getByTestId("card-menu-cases-description")).toBeInTheDocument();
    expect(getByTestId("card-menu-cases-button")).toBeInTheDocument();

    expect(getByTestId("card-menu-explore-studies")).toBeInTheDocument();
    expect(getByTestId("card-menu-explore-studies-icon")).toBeInTheDocument();
    expect(getByTestId("card-menu-explore-studies-name")).toBeInTheDocument();
    expect(
      getByTestId("card-menu-explore-studies-description")
    ).toBeInTheDocument();
    expect(getByTestId("card-menu-explore-studies-button")).toBeInTheDocument();

    expect(queryByTestId("card-menu-admin")).not.toBeInTheDocument();
  });

  it("should render admin card menu only for super admin and admin role", () => {
    const { getByTestId } = render(
      <Router>
        <PageLayout>
          <Welcome />
        </PageLayout>
      </Router>
    );

    act(() => {
      UserState.update((s) => {
        s.id = 1;
        s.fullname = "John Doe";
        s.email = "admin@akvo.com";
        s.role = "admin";
        s.active = true;
        s.organisation_detail = organisation_detail;
        s.business_unit_detail = business_unit_detail;
        s.tags_count = 2;
        s.cases_count = 1;
      });
    });

    expect(getByTestId("card-menu-cases")).toBeInTheDocument();
    expect(getByTestId("card-menu-cases-icon")).toBeInTheDocument();
    expect(getByTestId("card-menu-cases-name")).toBeInTheDocument();
    expect(getByTestId("card-menu-cases-description")).toBeInTheDocument();
    expect(getByTestId("card-menu-cases-button")).toBeInTheDocument();

    expect(getByTestId("card-menu-explore-studies")).toBeInTheDocument();
    expect(getByTestId("card-menu-explore-studies-icon")).toBeInTheDocument();
    expect(getByTestId("card-menu-explore-studies-name")).toBeInTheDocument();
    expect(
      getByTestId("card-menu-explore-studies-description")
    ).toBeInTheDocument();
    expect(getByTestId("card-menu-explore-studies-button")).toBeInTheDocument();

    expect(getByTestId("card-menu-admin")).toBeInTheDocument();
    expect(getByTestId("card-menu-admin-icon")).toBeInTheDocument();
    expect(getByTestId("card-menu-admin-name")).toBeInTheDocument();
    expect(getByTestId("card-menu-admin-description")).toBeInTheDocument();
    expect(getByTestId("card-menu-admin-button")).toBeInTheDocument();
  });

  it.todo("should go to about IDC page if About IDC menu clicked");
  it.todo("should go to cases page if Cases menu clicked");
  it.todo("should go to explore studies page if Explore Studies menu clicked");
  it.todo("should go to admin page if Admin menu clicked");
});
