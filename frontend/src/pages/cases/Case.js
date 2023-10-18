import React, { useState } from "react";
import { ContentLayout } from "../../components/layout";
import { SideMenu, CaseProfile, IncomeDriverDataEntry } from "./components";
import { Row, Col } from "antd";
import "./cases.scss";

const Case = () => {
  const [caseTitle, setCaseTitle] = useState("New Case");
  const [page, setPage] = useState("Case Profile");
  const [formData, setFormData] = useState({});
  const [completed, setCompleted] = useState(false);

  const setActive = (selected) => {
    if (
      selected === "Income Driver Data Entry" ||
      selected === "Income Driver Dashboard"
    ) {
      if (completed) {
        setPage(selected);
      }
    } else {
      setPage("Case Profile");
    }
  };

  return (
    <ContentLayout
      breadcrumbItems={[
        { title: "Home", href: "/dashboard" },
        { title: "Cases", href: "/cases" },
        { title: caseTitle },
      ]}
      title={caseTitle}
      wrapperId="case"
    >
      <Row gutter={[16, 16]} className="case-content">
        <SideMenu active={page} setActive={setActive} />
        <Col flex="auto">
          {page === "Case Profile" && (
            <CaseProfile
              setCaseTitle={setCaseTitle}
              formData={formData}
              setFormData={setFormData}
              setCompleted={setCompleted}
              setPage={setPage}
            />
          )}
          {page === "Income Driver Data Entry" && <IncomeDriverDataEntry />}
        </Col>
      </Row>
    </ContentLayout>
  );
};

export default Case;
