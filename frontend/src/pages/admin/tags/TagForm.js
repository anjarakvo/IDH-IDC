import React, { useEffect, useState } from "react";
import "./tag.scss";
import { useNavigate, useParams } from "react-router-dom";
import { ContentLayout } from "../../../components/layout";
import { Form, Input, Card, Button, Spin, message } from "antd";
import { api } from "../../../lib";

const TagForm = () => {
  const navigate = useNavigate();
  const { tagId } = useParams();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [initValues, setInitValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = (values) => {
    setSubmitting(true);
    const { name, description } = values;
    const payload = {
      name: name,
      description: description,
    };
    const apiCall = tagId
      ? api.put(`tag/${tagId}`, payload)
      : api.post("tag", payload);
    apiCall
      .then(() => {
        messageApi.open({
          type: "success",
          content: "Tag saved successfully.",
        });
        setTimeout(() => {
          form.resetFields();
          navigate("/admin/tags");
        }, 500);
      })
      .catch((e) => {
        console.error(e);
        messageApi.open({
          type: "error",
          content: "Failed! Something went wrong.",
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <ContentLayout
      breadcrumbItems={[
        { title: "Home", href: "/welcome" },
        { title: "Tags", href: "/admin/tags" },
        {
          title: `${tagId ? "Edit" : "Add"} Tag`,
          href: `/admin/tad/${tagId ? tagId : "new"}`,
        },
      ]}
      title={`${tagId ? "Edit" : "Add"} Tag`}
      wrapperId="tag"
    >
      {contextHolder}
      {loading ? (
        <div className="loading-container">
          <Spin />
        </div>
      ) : (
        <Form
          form={form}
          name="tag-form"
          layout="vertical"
          initialValues={initValues}
          onFinish={onFinish}
          className="tag-form-container"
        >
          <Card>
            <Form.Item
              label="Tag"
              name="name"
              rules={[{ required: true, message: "Tag is required" }]}
            >
              <Input style={{ width: "75%" }} />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input.TextArea rows={5} />
            </Form.Item>
          </Card>
          <Form.Item>
            <Button
              className="button button-submit button-secondary"
              htmlType="submit"
              style={{ width: "200px", float: "left" }}
              loading={submitting}
            >
              Save Tag
            </Button>
          </Form.Item>
        </Form>
      )}
    </ContentLayout>
  );
};

export default TagForm;
