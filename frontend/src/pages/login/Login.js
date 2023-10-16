import React, { useState } from "react";
import "./login.scss";
import { useNavigate } from "react-router-dom";
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
} from "antd";
import { useCookies } from "react-cookie";
import { api } from "../../lib";
import { UserState } from "../../store";
import ImageRight from "../../assets/images/login-right-img.png";

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
          s.role = data.role;
          s.active = data.active;
          s.organisation_detail = data.organisation_detail;
          s.business_unit_detail = data.business_unit_detail;
          s.tags_count = data.tags_count;
          s.cases_count = data.cases_count;
        });
        setTimeout(() => {
          navigate("/dashboard");
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
        <Col span={10} align="start" className="login-form-wrapper">
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
            className="form-login"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input
                size="large"
                data-testid="input-email"
                placeholder="Email"
              />
            </Form.Item>
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
                size="large"
                data-testid="input-password"
                placeholder="Password (6 digits at least, case sensitive)"
              />
            </Form.Item>
            <Form.Item>
              <Button
                data-testid="button-login"
                className="button-login"
                size="large"
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
        <Col
          span={14}
          align="end"
          data-testid="login-image-wrapper"
          className="login-image-wrapper"
        >
          <Image
            height={800}
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

export default Login;
