import { render, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "../../../components/layout";
import NotFound from "../NotFound";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("NotFound page", () => {
  it("should render NotFound page correctly", () => {
    const { getByText } = render(
      <Router>
        <PageLayout>
          <NotFound />
        </PageLayout>
      </Router>
    );
    expect(getByText("404")).toBeInTheDocument();
    expect(
      getByText("Sorry, the page you visited does not exist.")
    ).toBeInTheDocument();
    expect(getByText("Back Home")).toBeInTheDocument();
  });

  it("should back to home when Back Home button clicked", async () => {
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);

    const { getByTestId } = render(
      <Router>
        <PageLayout>
          <NotFound />
        </PageLayout>
      </Router>
    );
    const btnBack = getByTestId("btn-back-home");
    expect(btnBack).toBeInTheDocument();
    fireEvent.click(btnBack);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/");
    });
  });
});
