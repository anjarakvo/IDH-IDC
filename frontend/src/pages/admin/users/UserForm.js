import React, { useState, useMemo, useEffect } from "react";
import "./user.scss";
import { useNavigate, useParams } from "react-router-dom";
import { ContentLayout } from "../../../components/layout";
import {
  Form,
  Input,
  Card,
  Row,
  Col,
  Button,
  Select,
  Spin,
  message,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  allUserRole,
  nonAdminRole,
  adminRole,
  casePermission,
  businessUnitRequiredForRole,
} from "../../../store/static";
import upperFirst from "lodash/upperFirst";
import { UIState, UserState } from "../../../store";
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
  business_units: [{ business_unit: null }],
  cases: [{ case: null, permission: null }],
};

const useRolerWithBusinessUnitFieldByDefault = ["admin"];
const useRolerWithRadioButtonField = ["editor", "viewer"];
const userRoleWithTagsCasesFieldByDefault = ["user"];

const UserForm = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [form] = Form.useForm();
  const userRole = UserState.useState((s) => s.role);
  const [submitting, setSubmitting] = useState(false);
  const [initValues, setInitValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const organisationOptions = UIState.useState((s) => s.organisationOptions);
  const tagOptions = UIState.useState((s) => s.tagOptions);

  const businessUnitOptions = window.master.business_units?.map((x) => ({
    label: x.name,
    value: x.id,
  }));
  const roleOptions = transformToSelectOptions(
    userRole === "super_admin" ? allUserRole : nonAdminRole
  );
  const casePermissionOptions = transformToSelectOptions(casePermission);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      api
        .get(`user/${userId}`)
        .then((res) => {
          const { data } = res;
          setSelectedRole(data?.role || null);
          setInitValues({
            ...data,
            cases: data?.cases?.length ? data.cases : defFormListValue.cases,
            business_units: data?.business_units?.length
              ? data.business_units
              : defFormListValue.business_units,
          });
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
          }, 500);
        });
    } else {
      setInitValues(defFormListValue);
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
      business_units?.filter((x) => x.business_unit)?.length
    ) {
      const businessUnitsVal = business_units.map((bu) => ({
        ...bu,
        role: adminRole.includes(role) ? "admin" : "member",
      }));
      payload.append("business_units", JSON.stringify(businessUnitsVal));
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
        messageApi.open({
          type: "success",
          content: "User saved successfully.",
        });
        setTimeout(() => {
          form.resetFields();
          navigate("/admin/users");
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
      {contextHolder}
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
          <Row gutter={[16, 16]}>
            {/* User Information */}
            <Col span={12}>
              <Card title="User Information">
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
              </Card>
            </Col>
            {/* EOL User Information */}
            {/* Other Inputs */}
            <Col span={12}>
              {/* Business Unit Selector */}
              {useRolerWithBusinessUnitFieldByDefault.includes(selectedRole) ? (
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
                                  <Col span={20}>
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
              ) : (
                ""
              )}
              {/* Tags */}
              {userRoleWithTagsCasesFieldByDefault.includes(selectedRole) ? (
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
              ) : (
                ""
              )}
              {/* Cases Selector */}
              {userRoleWithTagsCasesFieldByDefault.includes(selectedRole) ? (
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
              ) : (
                ""
              )}
            </Col>
            {/* EOL Other Inputs */}
          </Row>

          <Form.Item>
            <Button
              className="button button-submit button-secondary"
              htmlType="submit"
              style={{ width: "200px", float: "left" }}
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
