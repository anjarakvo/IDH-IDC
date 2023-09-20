import { render, waitFor } from "@testing-library/react";
import App from "./App";

test("it renders correctly", async () => {
  const { getByTestId } = render(<App />);
  waitFor(() => {
    expect(getByTestId("hello")).toBeInTheDocument();
  });
});
