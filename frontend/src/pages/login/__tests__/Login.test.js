import { render, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { PageLayout } from "../../../components/layout";
import Login from "../Login";
import { api } from "../../../lib";

jest.mock("../../../lib/api");

describe("Login page", () => {
  it("should have email & password input and login button", () => {
    const { getByTestId } = render(
      <Router>
        <PageLayout>
          <Login />
        </PageLayout>
      </Router>
    );
    expect(getByTestId("input-email")).toBeInTheDocument();
    expect(getByTestId("input-password")).toBeInTheDocument();
    expect(getByTestId("button-login")).toBeInTheDocument();
  });

  it("should validate email & password input", async () => {
    const { getByTestId, getByText } = render(
      <Router>
        <PageLayout>
          <Login />
        </PageLayout>
      </Router>
    );
    // const emailInput = getByTestId("input-email")
    // const pwdInput = getByTestId("input-password")
    const loginBtn = getByTestId("button-login");
    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(getByText("Please input your email!")).toBeInTheDocument();
      expect(getByText("Please input your password!")).toBeInTheDocument();
    });
  });

  it("should call /login endpoint when login button pressed", async () => {
    const { getByTestId, queryByText } = render(
      <Router>
        <PageLayout>
          <Login />
        </PageLayout>
      </Router>
    );

    const emailInput = getByTestId("input-email");
    const pwdInput = getByTestId("input-password");
    const loginBtn = getByTestId("button-login");

    fireEvent.change(emailInput, {
      target: { value: "test@test.com" },
    });
    fireEvent.change(pwdInput, {
      target: { value: "test" },
    });
    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(queryByText("Please input your email!")).not.toBeInTheDocument();
      expect(
        queryByText("Please input your password!")
      ).not.toBeInTheDocument();
      expect(api.post).toHaveBeenCalled();
    });
  });
});
