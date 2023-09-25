import { render, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";

test("it renders correctly", async () => {
  const { getByTestId } = render(
    <Router>
      <App />
    </Router>
  );
  waitFor(() => {
    expect(getByTestId("hello")).toBeInTheDocument();
  });
});
