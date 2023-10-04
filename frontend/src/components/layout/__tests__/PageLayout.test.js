import { render, waitFor } from "@testing-library/react";
import PageLayout from "../PageLayout";

test("it renders correctly", async () => {
  const wrapper = render(
    <PageLayout>
      <h1>Hello world!</h1>
    </PageLayout>
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
