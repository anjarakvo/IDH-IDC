import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { PageLayout } from "../../../components/layout";
import Landing from "../Landing";

describe("Landing page", () => {
  it("should render page header with about us and login nav", () => {
    const wrapper = render(
      <Router>
        <PageLayout>
          <Landing />
        </PageLayout>
      </Router>
    );

    expect(wrapper.getByTestId("logo-container")).toBeInTheDocument();
    expect(wrapper.getByText("About Us")).toBeInTheDocument();
    expect(wrapper.getByText("Sign in")).toBeInTheDocument();
  });

  it.todo(
    "should render jumbotron image with title, subtitle, and learn more button"
  );
  it.todo("should render first section");
  it.todo("should render second section");
  it.todo("should render third section");
  it.todo("should render disclaimer section");
});
