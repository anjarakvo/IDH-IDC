import React, { useState } from "react";
import "./login.scss";
import { Link } from "react-router-dom";
import { ContentLayout } from "../../components/layout";
import {
  Row,
  Col,
  Button,
  Form,
  Input,
  Typography,
  Image,
  Select,
  message,
} from "antd";
import { api } from "../../lib";
import { UIState } from "../../store";
import ImageRight from "../../assets/images/login-right-img.png";
import LogoWhite from "../../assets/images/logo-white.png";

const Register = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const organisationOptions = UIState.useState((s) => s.organisationOptions);
  const businessUnitOptions = window.master.business_units?.map((x) => ({
    label: x.name,
    value: x.id,
  }));

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

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
      .post("user/register", payload)
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
        <Col span={12} align="start" className="login-form-wrapper">
          <Image
            src={LogoWhite}
            height={55}
            preview={false}
            data-testid="logo-image"
          />
          <Col span={24} align="center" className="login-form">
            <div className="page-title-container">
              <Typography.Title>
                Income Driver <br />
                <span style={{ color: "#47d985" }}>Calculator</span>
              </Typography.Title>
            </div>
            <h2>Registration</h2>
            <Form
              form={form}
              name="form-registration"
              className="form-login"
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                name="fullname"
                rules={[
                  {
                    required: true,
                    message: "Please input your fullname!",
                  },
                ]}
              >
                <Input data-testid="input-fullname" placeholder="Fullname" />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[
                  {
                    type: "email",
                    message: "The input is not valid Email",
                  },
                  {
                    required: true,
                    message: "Please input your email!",
                  },
                ]}
              >
                <Input data-testid="input-email" placeholder="Email" />
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
              <Form.Item
                name="organisation"
                rules={[
                  {
                    required: true,
                    message: "Please select your Organisation!",
                  },
                ]}
              >
                <Select
                  data-testid="input-organisation"
                  placeholder="Organisation"
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  filterOption={filterOption}
                  options={organisationOptions}
                />
              </Form.Item>
              <Form.Item
                name="business_units"
                rules={[
                  {
                    required: true,
                    message: "Please select your Business Unit!",
                  },
                ]}
              >
                <Select
                  data-testid="input-business-unit"
                  placeholder="Business Units"
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  filterOption={filterOption}
                  options={businessUnitOptions}
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
                  Register
                </Button>
              </Form.Item>
              <Form.Item noStyle>
                <p>
                  Already have an account? <Link to="/login">Login here.</Link>
                </p>
              </Form.Item>
            </Form>
          </Col>
        </Col>
        <Col
          span={12}
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

export default Register;
