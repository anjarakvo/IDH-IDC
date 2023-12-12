import React, { useState } from "react";
import "./reference-data.scss";
import { useNavigate, useParams } from "react-router-dom";
import { ContentLayout } from "../../components/layout";
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

const ReferenceDataForm = () => {
  const navigate = useNavigate();
  const { referenceDataId } = useParams();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [initValues, setInitValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <ContentLayout
      breadcrumbItems={[
        { title: "Home", href: "/welcome" },
        { title: "Reference Data", href: "/reference-data" },
        {
          title: `${referenceDataId ? "Edit" : "Add"} Reference Data`,
          href: `/reference-data/${referenceDataId ? referenceDataId : "new"}`,
        },
      ]}
      title="Reference Data"
      wrapperId="reference-data"
    >
      ReferenceDataForm
    </ContentLayout>
  );
};

export default ReferenceDataForm;
