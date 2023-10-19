import React, { useState, useMemo, useEffect } from "react";
import "./user.scss";
import { useNavigate, useParams } from "react-router-dom";
import { ContentLayout } from "../../../components/layout";
import { Form, Input, Card, Row, Col, Button, Select, Spin } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  allUserRole,
  businessUnitRole,
  casePermission,
  businessUnitRequiredForRole,
} from "../../../store/static";
import upperFirst from "lodash/upperFirst";
import { UIState } from "../../../store";
import { api } from "../../../lib";

const transformToSelectOptions = (values) => {
  return values.map((x) => ({
    value: x,
    label: x
      .split("_")
      .map((y) => upperFirst(y))
      .join(" "),
  }));
};

const defFormListValue = {
  business_units: [{ business_unit: null, role: null }],
  cases: [{ case: null, permission: null }],
};

const UserForm = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [initValues, setInitValues] = useState({ ...defFormListValue });
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const organisationOptions = UIState.useState((s) => s.organisationOptions);
  const tagOptions = UIState.useState((s) => s.tagOptions);

  const businessUnitOptions = window.master.business_units?.map((x) => ({
    label: x.name,
    value: x.id,
  }));
  const roleOptions = transformToSelectOptions(allUserRole);
  const businessUnitRoleOptions = transformToSelectOptions(businessUnitRole);
  const casePermissionOptions = transformToSelectOptions(casePermission);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      api
        .get(`user/${userId}`)
        .then((res) => {
          setInitValues({ ...defFormListValue, ...res.data });
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId]);

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const onFinish = (values) => {
    setSubmitting(true);
    const { fullname, email, role, organisation, tags, business_units, cases } =
      values;
    const payload = new FormData();
    payload.append("fullname", fullname);
    payload.append("email", email);
    payload.append("role", role);
    payload.append("organisation", organisation);
    if (tags && tags?.length) {
      const tagVal = Array.isArray(tags) ? tags : [tags];
      payload.append("tags", JSON.stringify(tagVal));
    }
    if (
      business_units &&
      business_units?.filter((x) => x.business_unit && x.role)?.length
    ) {
      payload.append("business_units", JSON.stringify(business_units));
    }
    if (cases && cases?.filter((x) => x.case && x.permission)?.length) {
      payload.append("cases", JSON.stringify(cases));
    }
    if (userId) {
      payload.append("is_active", true);
    }
    const apiCall = userId
      ? api.put(`user/${userId}`, payload)
      : api.post("/user/register?invitation_id=true", payload);
    apiCall
      .then(() => {
        setTimeout(() => {
          form.resetFields();
          navigate("/admin/users");
        }, 500);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const isBusinessUnitRequired = useMemo(
    () => businessUnitRequiredForRole.includes(selectedRole),
    [selectedRole]
  );

  return (
    <ContentLayout
      breadcrumbItems={[
        { title: "Home", href: "/welcome" },
        { title: "Users", href: "/admin/users" },
        {
          title: `${userId ? "Edit" : "Add"} User`,
          href: `/admin/user/${userId ? userId : "new"}`,
        },
      ]}
      title={`${userId ? "Edit" : "Add"} User`}
      wrapperId="user"
    >
      {loading ? (
        <div className="loading-container">
          <Spin />
        </div>
      ) : (
        <Form
          form={form}
          name="user-form"
          layout="vertical"
          initialValues={initValues}
          onFinish={onFinish}
          className="user-form-container"
        >
          {/* User Information */}
          <Card title="User Information">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  label="Fullname"
                  name="fullname"
                  rules={[
                    {
                      required: true,
                      message: "Fullname is required",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      type: "email",
                      message: "The input is not valid Email",
                    },
                    {
                      required: true,
                      message: "Email is required",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Role"
                  name="role"
                  rules={[
                    {
                      required: true,
                      message: "Role is required",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    filterOption={filterOption}
                    options={roleOptions}
                    onChange={setSelectedRole}
                  />
                </Form.Item>
                <Form.Item
                  label="Organisation"
                  name="organisation"
                  rules={[
                    {
                      required: true,
                      message: "Organisation is required",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    filterOption={filterOption}
                    options={organisationOptions}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          {/* EOL User Information */}

          {/* Other Inputs */}
          <Card title="Tags">
            <Form.Item label="Tags" name="tags" required={false}>
              <Select
                showSearch
                mode="tags"
                optionFilterProp="children"
                filterOption={filterOption}
                options={tagOptions}
              />
            </Form.Item>
          </Card>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card title="Business Units">
                <Form.List name="business_units">
                  {(fields, { add, remove }) => {
                    return (
                      <>
                        {fields.map((field) => {
                          return (
                            <Form.Item
                              key={field.key}
                              required={isBusinessUnitRequired}
                            >
                              <Row gutter={[16, 16]} align="middle">
                                <Col span={10}>
                                  <Form.Item
                                    {...field}
                                    label="Business Unit"
                                    name={[field.name, "business_unit"]}
                                    rules={[
                                      {
                                        required: isBusinessUnitRequired,
                                        message: "Business Unit is required",
                                      },
                                    ]}
                                  >
                                    <Select
                                      showSearch
                                      allowClear
                                      optionFilterProp="children"
                                      filterOption={filterOption}
                                      options={businessUnitOptions}
                                    />
                                  </Form.Item>
                                </Col>
                                <Col span={10}>
                                  <Form.Item
                                    {...field}
                                    label="Business Unit Role"
                                    name={[field.name, "role"]}
                                    rules={[
                                      {
                                        required: isBusinessUnitRequired,
                                        message:
                                          "Business Unit Role is required",
                                      },
                                    ]}
                                  >
                                    <Select
                                      showSearch
                                      allowClear
                                      optionFilterProp="children"
                                      filterOption={filterOption}
                                      options={businessUnitRoleOptions}
                                    />
                                  </Form.Item>
                                </Col>
                                <Col span={4}>
                                  {fields.length > 1 ? (
                                    <MinusCircleOutlined
                                      onClick={() => remove(field.name)}
                                    />
                                  ) : (
                                    ""
                                  )}
                                </Col>
                              </Row>
                            </Form.Item>
                          );
                        })}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            style={{
                              width: "100%",
                            }}
                            icon={<PlusOutlined />}
                          >
                            Add Business Unit
                          </Button>
                        </Form.Item>
                      </>
                    );
                  }}
                </Form.List>
              </Card>
            </Col>

            <Col span={12}>
              <Card title="Cases">
                <Form.List name="cases">
                  {(fields, { add, remove } /*{ errors }*/) => {
                    return (
                      <>
                        {fields.map((field) => {
                          return (
                            <Form.Item key={field.key} required={false}>
                              <Row gutter={[16, 16]} align="middle">
                                <Col span={10}>
                                  <Form.Item
                                    {...field}
                                    label="Case"
                                    name={[field.name, "case"]}
                                  >
                                    <Select
                                      showSearch
                                      allowClear
                                      optionFilterProp="children"
                                      filterOption={filterOption}
                                      options={[]}
                                      disabled
                                    />
                                  </Form.Item>
                                </Col>
                                <Col span={10}>
                                  <Form.Item
                                    {...field}
                                    label="Permission"
                                    name={[field.name, "permission"]}
                                  >
                                    <Select
                                      showSearch
                                      allowClear
                                      optionFilterProp="children"
                                      filterOption={filterOption}
                                      options={casePermissionOptions}
                                      disabled
                                    />
                                  </Form.Item>
                                </Col>
                                <Col span={4}>
                                  {fields.length > 1 ? (
                                    <MinusCircleOutlined
                                      onClick={() => remove(field.name)}
                                    />
                                  ) : (
                                    ""
                                  )}
                                </Col>
                              </Row>
                            </Form.Item>
                          );
                        })}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            style={{
                              width: "100%",
                            }}
                            icon={<PlusOutlined />}
                          >
                            Add Cases
                          </Button>
                        </Form.Item>
                      </>
                    );
                  }}
                </Form.List>
              </Card>
            </Col>
          </Row>
          {/* EOL Other Inputs */}

          <Form.Item>
            <Button
              className="button button-submit button-secondary"
              htmlType="submit"
              style={{ width: "200px", float: "right" }}
              loading={submitting}
            >
              Save User
            </Button>
          </Form.Item>
        </Form>
      )}
    </ContentLayout>
  );
};

export default UserForm;
