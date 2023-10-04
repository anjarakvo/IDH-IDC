import { render, waitFor } from "@testing-library/react";
import ContentLayout from "../ContentLayout";

describe("ContentLayout", () => {
  it("should render correctly", async () => {
    const wrapper = render(
      <ContentLayout
        breadcrumbItems={[{ title: "Breadcrumb" }]}
        title="Title"
        subTitle="Lorem ipsum sit dolor..."
      >
        <h1>Hello world!</h1>
      </ContentLayout>
    );
    waitFor(() => {
      expect(wrapper.getByText("Breadcrumb").toBeInTheDocument());
      expect(wrapper.getByText("Title").toBeInTheDocument());
      expect(wrapper.getByText("Lorem ipsum sit dolor...").toBeInTheDocument());
      expect(wrapper.getByText("Hello world!").toBeInTheDocument());
    });
  });

  it("should not render breadcrumb if not defined", () => {
    const wrapper = render(
      <ContentLayout title="Title" subTitle="Lorem ipsum sit dolor...">
        <h1>Hello world!</h1>
      </ContentLayout>
    );
    waitFor(() => {
      expect(wrapper.getByTestId("breadcrumb").not.toBeInTheDocument());
      expect(wrapper.getByTestId("title").toBeInTheDocument());
      expect(wrapper.getByTestId("subTitle").toBeInTheDocument());
    });
  });

  it("should not render title & subTitle if not defined", () => {
    const wrapper = render(
      <ContentLayout breadcrumbItems={[{ title: "Breadcrumb" }]}>
        <h1>Hello world!</h1>
      </ContentLayout>
    );
    waitFor(() => {
      expect(wrapper.getByTestId("breadcrumb").toBeInTheDocument());
      expect(wrapper.getByTestId("title").not.toBeInTheDocument());
      expect(wrapper.getByTestId("subTitle").not.toBeInTheDocument());
    });
  });

  it("should not render page title section if breadcrumb, title and subTitle not defined", () => {
    const wrapper = render(
      <ContentLayout>
        <h1>Hello world!</h1>
      </ContentLayout>
    );
    waitFor(() => {
      expect(wrapper.getByTestId("breadcrumb").not.toBeInTheDocument());
      expect(wrapper.getByTestId("title").not.toBeInTheDocument());
      expect(wrapper.getByTestId("subTitle").not.toBeInTheDocument());
    });
  });
});
