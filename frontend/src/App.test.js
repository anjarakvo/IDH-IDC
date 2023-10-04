import { render, waitFor, act } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Cookies } from "react-cookie";
import App from "./App";
import { api } from "./lib";
import { UserState } from "./store";

jest.mock("./lib/api");

const mockUserData = {
  id: null,
  fullname: null,
  email: null,
  active: false,
  organisation_detail: {
    id: null,
    name: null,
  },
};

describe("App", () => {
  test("it renders correctly", async () => {
    api.get.mockResolvedValue({
      data: mockUserData,
    });

    const { getByTestId } = render(
      <Router>
        <App />
      </Router>
    );

    waitFor(() => {
      expect(getByTestId("page-layout")).toBeInTheDocument();
    });
  });

  it("should call /user/me API to fetch user detail if AUTH_TOKEN defined", async () => {
    const cookies = new Cookies();
    act(() => {
      cookies.set("AUTH_TOKEN", "yourAuthToken");
      UserState.update((s) => {
        s.id = 1;
        s.active = true;
      });
    });

    api.get.mockResolvedValue({
      data: mockUserData,
    });

    render(
      <Router>
        <App />
      </Router>
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("user/me");
    });
  });
});
