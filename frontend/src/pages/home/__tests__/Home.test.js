import { render, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { PageLayout } from "../../../components/layout";
import Home from "../Home";

describe("Home page", () => {
  it("should render correctly", async () => {
    const wrapper = render(
      <Router>
        <PageLayout>
          <Home />
        </PageLayout>
      </Router>
    );

    await waitFor(() => {
      expect(wrapper.getByTestId("crop-selector")).toBeInTheDocument();
      expect(wrapper.getByTestId("country-selector")).toBeInTheDocument();
      expect(wrapper.getByTestId("data-table")).toBeInTheDocument();
    });
  });
});
