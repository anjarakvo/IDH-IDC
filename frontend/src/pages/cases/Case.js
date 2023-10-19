import React, { useState } from "react";
import { ContentLayout } from "../../components/layout";
import { SideMenu, CaseProfile, IncomeDriverDataEntry } from "./components";
import { Row, Col } from "antd";
import "./cases.scss";

const pageDependencies = {
  "Income Driver Data Entry": ["Case Profile"],
  "Income Driver Dashboard": ["Case Profile", "Income Driver Data Entry"],
};

const Case = () => {
  const [caseTitle, setCaseTitle] = useState("New Case");
  const [page, setPage] = useState("Case Profile");
  const [formData, setFormData] = useState({});
  const [finished, setFinished] = useState([]);

  const setActive = (selected) => {
    if (finished.includes(selected)) {
      setPage(selected);
    } else {
      const dependencies = pageDependencies[selected];
      if (dependencies) {
        if (dependencies.every((dependency) => finished.includes(dependency))) {
          setPage(selected);
        }
      }
    }
  };

  return (
    <ContentLayout
      breadcrumbItems={[
        { title: "Home", href: "/welcome" },
        { title: "Cases", href: "/cases" },
        { title: caseTitle },
      ]}
      title={caseTitle}
      wrapperId="case"
    >
      <Row gutter={[16, 16]} className="case-content">
        <SideMenu active={page} setActive={setActive} finished={finished} />
        <Col flex="auto">
          {page === "Case Profile" && (
            <CaseProfile
              setCaseTitle={setCaseTitle}
              formData={formData}
              setFormData={setFormData}
              finished={finished}
              setFinished={setFinished}
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
