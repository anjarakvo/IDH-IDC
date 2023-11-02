import React, { useState } from "react";
import "./login.scss";
import { ContentLayout } from "../../components/layout";
import {
  Row,
  Col,
  Button,
  Form,
  Input,
  Divider,
  Typography,
  Image,
  message,
} from "antd";
import { api } from "../../lib";
import ImageRight from "../../assets/images/login-right-img.png";

const ResetPassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = (values) => {
    setLoading(true);
    const { fullname, email, password, organisation, business_units } = values;
    const businessUnitValues = business_units.map((x) => ({
      business_unit: x,
      role: "member",
    }));

    const payload = new FormData();
    payload.append("fullname", fullname);
    payload.append("email", email);
    payload.append("password", password);
    payload.append("organisation", organisation);
    payload.append("business_units", JSON.stringify(businessUnitValues));

    api
      .post("user/ResetPassword", payload)
      .then(() => {
        form.resetFields();
        messageApi.open({
          type: "success",
          content:
            "Registration complete. You can log in once it's approved by an admin.",
        });
      })
      .catch(() => {
        messageApi.open({
          type: "error",
          content: "Registration failed. Please contact your admin.",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ContentLayout wrapperId="login">
      {contextHolder}
      <Row align="middle" className="login-container">
        <Col span={10} align="start" className="login-form-wrapper">
          <div className="page-title-container">
            <Typography.Title>Income Driver Calculator</Typography.Title>
          </div>
          <h3>Set Password</h3>
          <Divider />
          <Form
            form={form}
            name="form-reset-password"
            className="form-login"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password
                data-testid="input-password"
                placeholder="Password (6 digits at least, case sensitive)"
              />
            </Form.Item>
            <Form.Item
              name="confirm"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "Confirm Password that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                data-testid="input-confirm-password"
                placeholder="Confirm Password"
              />
            </Form.Item>
            <Form.Item>
              <Button
                data-testid="button-login"
                className="button-login"
                type="primary"
                htmlType="submit"
                block
                loading={loading}
              >
                Save Password
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col
          span={14}
          align="end"
          data-testid="login-image-wrapper"
          className="login-image-wrapper"
        >
          <Image
            src={ImageRight}
            preview={false}
            className="login-image"
            data-testid="login-image"
          />
        </Col>
      </Row>
    </ContentLayout>
  );
};

export default ResetPassword;
