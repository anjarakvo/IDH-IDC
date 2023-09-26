import { render, waitFor } from "@testing-library/react";
import ContentLayout from "../ContentLayout";

test("it renders correctly", async () => {
  const wrapper = render(
    <ContentLayout breadcrumbItems={[{ title: "Breadcrumb" }]}>
      <h1>Hello world!</h1>
    </ContentLayout>
  );
  waitFor(() => {
    expect(wrapper.getByText("Breadcrumb").toBeInTheDocument());
    expect(wrapper.getByText("Hello world!").toBeInTheDocument());
  });
});
