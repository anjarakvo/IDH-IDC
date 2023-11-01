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
  Radio,
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
  const [allCases, setAllCases] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [loadingCaseOptions, setLoadingCaseOptions] = useState(true);
  const [caseOptions, setCaseOptions] = useState([]);
  const [selectedCases, setSelectedCases] = useState([]);
  const [isUserActive, setIsUserActive] = useState(null);

  const organisationOptions = UIState.useState((s) => s.organisationOptions);
  const tagOptions = UIState.useState((s) => s.tagOptions);

  const businessUnitOptions = window.master.business_units?.map((x) => ({
    label: x.name,
    value: x.id,
  }));
  const roleOptions = transformToSelectOptions(
    userRole === "super_admin" ? allUserRole : nonAdminRole
  );

  const casePermissionOptions = useMemo(() => {
    let casePermissionTemp = casePermission;
    if (selectedRole === "viewer") {
      casePermissionTemp = casePermission.filter((x) => x !== "edit");
    }
    return transformToSelectOptions(casePermissionTemp);
  }, [selectedRole]);

  const filteredCaseOptions = useMemo(() => {
    return caseOptions.map((opt) => {
      if (selectedCases.includes(opt.value)) {
        return {
          ...opt,
          disabled: true,
        };
      }
      return opt;
    });
  }, [caseOptions, selectedCases]);

  useEffect(() => {
    // get case options
    setLoadingCaseOptions(true);
    api
      .get("case/options")
      .then((res) => {
        setCaseOptions(res.data);
      })
      .catch(() => {
        setCaseOptions([]);
      })
      .finally(() => {
        setTimeout(() => {
          setLoadingCaseOptions(false);
        }, 100);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    if (userId && !loadingCaseOptions) {
      api
        .get(`user/${userId}`)
        .then((res) => {
          const { data } = res;
          setSelectedRole(data?.role || null);
          setIsUserActive(data.active);

          if (
            data?.all_cases !== null &&
            useRolerWithRadioButtonField.includes(data?.role)
          ) {
            setAllCases(data.all_cases ? 1 : 0);
            form.setFieldsValue({ all_cases: data.all_cases ? 1 : 0 });
          }

          const cases = data?.cases?.length
            ? data.cases
            : defFormListValue.cases;
          setSelectedCases(cases.map((x) => x.case));

          const businessUnits = data?.business_units?.length
            ? data.business_units.map((bu) => bu.business_unit)
            : [];

          setInitValues({
            ...data,
            cases: cases,
            business_units: businessUnits,
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
      setLoading(false);
    }
  }, [userId, loadingCaseOptions, form]);

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const onFinish = (values) => {
    setSubmitting(true);
    const {
      fullname,
      email,
      role,
      organisation,
      all_cases,
      tags,
      business_units,
      cases,
    } = values;
    const payload = new FormData();
    payload.append("fullname", fullname);
    payload.append("email", email);
    payload.append("role", role);
    payload.append("all_cases", all_cases);
    payload.append("organisation", organisation);
    if (tags && tags?.length) {
      const tagVal = Array.isArray(tags) ? tags : [tags];
      payload.append("tags", JSON.stringify(tagVal));
    }
    if (business_units && business_units?.length) {
      let businessUnitVals = Array.isArray(business_units)
        ? business_units
        : [business_units];
      businessUnitVals = businessUnitVals.map((bu) => ({
        business_unit: bu,
        role: adminRole.includes(role) ? "admin" : "member",
      }));
      payload.append("business_units", JSON.stringify(businessUnitVals));
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

  const isTagsAndCasesFieldAvailable = useMemo(
    () =>
      userRoleWithTagsCasesFieldByDefault.includes(selectedRole) ||
      (useRolerWithRadioButtonField.includes(selectedRole) && allCases === 0),
    [selectedRole, allCases]
  );

  const handleOnChangeRole = (value) => {
    setAllCases(null);
    setSelectedRole(value);
    form.setFieldsValue({ ["all_cases"]: null });
  };

  const handleOnChangeAllCases = (e) => {
    setAllCases(e.target.value);
  };

  const handleOnChangeCaseDropdown = (val) => {
    setSelectedCases([...selectedCases, val]);
  };

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
                    onChange={handleOnChangeRole}
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
                {/* Radio button for Editor / Viewer */}
                {useRolerWithRadioButtonField.includes(selectedRole) ? (
                  <Form.Item
                    name="all_cases"
                    rules={[
                      {
                        required: true,
                        message: "Please select access level",
                      },
                    ]}
                  >
                    <Radio.Group
                      onChange={handleOnChangeAllCases}
                      value={allCases}
                    >
                      <Radio value={1}>
                        {selectedRole === "editor" ? "Edit" : "View"} all cases
                        on this Business Unit
                      </Radio>
                      <Radio value={0}>Use specific cases or tags</Radio>
                    </Radio.Group>
                  </Form.Item>
                ) : (
                  ""
                )}
              </Card>
            </Col>
            {/* EOL User Information */}
            {/* Other Inputs */}
            <Col span={12}>
              {/* Business Unit Selector */}
              {useRolerWithBusinessUnitFieldByDefault.includes(selectedRole) ||
              (userRole === "super_admin" &&
                useRolerWithRadioButtonField.includes(selectedRole)) ? (
                <Card title="Business Units">
                  <Form.Item
                    label="Business Units"
                    name="business_units"
                    required={isBusinessUnitRequired}
                  >
                    <Select
                      showSearch
                      mode="multiple"
                      optionFilterProp="children"
                      filterOption={filterOption}
                      options={businessUnitOptions}
                    />
                  </Form.Item>
                </Card>
              ) : (
                ""
              )}
              {/* Tags */}
              {isTagsAndCasesFieldAvailable ? (
                <Card title="Tags">
                  <Form.Item label="Tags" name="tags" required={false}>
                    <Select
                      showSearch
                      mode="multiple"
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
              {isTagsAndCasesFieldAvailable ? (
                <Card title="Cases">
                  <Form.List name="cases">
                    {(fields, { add, remove } /*{ errors }*/) => {
                      return (
                        <>
                          {fields.map((field) => {
                            return (
                              <Form.Item
                                key={field.key}
                                required={allCases !== null && !allCases}
                              >
                                <Row gutter={[16, 16]} align="middle">
                                  <Col span={10}>
                                    <Form.Item
                                      {...field}
                                      label="Case"
                                      name={[field.name, "case"]}
                                      rules={[
                                        {
                                          required:
                                            allCases !== null && !allCases,
                                          message: "Case required",
                                        },
                                      ]}
                                    >
                                      <Select
                                        showSearch
                                        allowClear
                                        optionFilterProp="children"
                                        filterOption={filterOption}
                                        options={filteredCaseOptions}
                                        onChange={handleOnChangeCaseDropdown}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col span={10}>
                                    <Form.Item
                                      {...field}
                                      label="Permission"
                                      name={[field.name, "permission"]}
                                      rules={[
                                        {
                                          required:
                                            allCases !== null && !allCases,
                                          message: "Case permission required",
                                        },
                                      ]}
                                    >
                                      <Select
                                        showSearch
                                        allowClear
                                        optionFilterProp="children"
                                        filterOption={filterOption}
                                        options={casePermissionOptions}
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
              {isUserActive !== null && !isUserActive
                ? "Approve User"
                : "Save User"}
            </Button>
          </Form.Item>
        </Form>
      )}
    </ContentLayout>
  );
};

export default UserForm;
