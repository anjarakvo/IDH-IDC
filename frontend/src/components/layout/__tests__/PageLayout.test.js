import { render, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import PageLayout from "../PageLayout";

test("it renders correctly", async () => {
  const wrapper = render(
    <Router>
      <PageLayout>
        <h1>Hello world!</h1>
      </PageLayout>
    </Router>
  );
  waitFor(() => {
    expect(wrapper.getAllByTestId("layout-header")).toBeInTheDocument();
    expect(wrapper.getAllByTestId("logo-container")).toBeInTheDocument();
    expect(wrapper.getAllByTestId("menu-container")).toBeInTheDocument();
    expect(wrapper.getAllByTestId("layout-content")).toBeInTheDocument();
    expect(wrapper.getAllByTestId("layout-sider").toBeInTheDocument());
    expect(wrapper.getByText("Hello world!").toBeInTheDocument());
  });
});
