import React, { useState } from "react";
import "./login.scss";
import { useNavigate } from "react-router-dom";
import { ContentLayout } from "../../components/layout";
import { Row, Col, Button, Form, Input, Divider, Typography } from "antd";
import { useCookies } from "react-cookie";
import { api } from "../../lib";
import { UserState } from "../../store";

const env = window?.__ENV__;
const client_id = env?.client_id || "test";
const client_secret = env?.client_secret || "test";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["AUTH_TOKEN"]);

  const onFinish = (values) => {
    setLoading(true);
    const { email, password } = values;
    const payload = new FormData();
    payload.append("grant_type", "password");
    payload.append("username", email);
    payload.append("password", password);
    payload.append("scope", "openid email");
    payload.append("client_id", client_id);
    payload.append("client_secret", client_secret);

    api
      .post("user/login", payload)
      .then((res) => {
        const { data } = res;
        removeCookie("AUTH_TOKEN");
        setCookie("AUTH_TOKEN", data?.access_token);
        api.setToken(cookies?.AUTH_TOKEN);
        UserState.update((s) => {
          s.id = data.id;
          s.fullname = data.fullname;
          s.email = data.email;
          s.active = data.active;
          s.organisation_detail = data.organisation_detail;
        });
        setTimeout(() => {
          navigate("/");
        }, 100);
      })
      .catch(() => {
        console.info("error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ContentLayout>
      <Row align="center" className="login-container">
        <Col span={8} align="center">
          <div className="page-title-container">
            <Typography.Title>Income Driver Calculator</Typography.Title>
            <Typography.Title level={3}>
              Welcome to the income driver calculator version 2.0
            </Typography.Title>
          </div>
          <h4>Get Started</h4>
          <Divider />
          <Form
            name="form-login"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input data-testid="input-email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password data-testid="input-password" />
            </Form.Item>
            <Form.Item>
              <Button
                data-testid="button-login"
                type="primary"
                htmlType="submit"
                block
                loading={loading}
              >
                Sign in
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </ContentLayout>
  );
};

export default Login;
