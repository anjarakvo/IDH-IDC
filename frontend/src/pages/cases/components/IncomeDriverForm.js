import React, { useState, useEffect } from "react";
import { Card, Form, Row, Col } from "antd";
import { Questions, flatten, indentSize, getFunctionDefaultValue } from "./";
import isEmpty from "lodash/isEmpty";

const IncomeDriverForm = ({
  group,
  groupIndex,
  commodity,
  formValues,
  setFormValues,
  segmentItem,
  currentCaseId,
}) => {
  const [form] = Form.useForm();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    // set current feasible initial value
    if (currentCaseId) {
      const findValue = formValues.find((fv) => fv.key === segmentItem.key);
      if (!findValue && isEmpty(findValue)) {
        return;
      }
      Object.keys(findValue.answers).forEach((key) => {
        const val = findValue.answers[key];
        form.setFieldsValue({
          [key]: val,
        });
      });
      // refresh percentage
      setRefresh(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCaseId]);

  const flattenQuestionList = flatten(group.questions);

  const onValuesChange = (value, currentValues) => {
    // handle form values
    const defaultFormValue = {
      ...segmentItem,
      case_commodity: commodity.case_commodity,
      answers: {},
    };
    const filteredFormValues = formValues.filter(
      (x) => x.key !== segmentItem.key
    );
    let currentFormValue = formValues.find((x) => x.key === segmentItem.key);
    currentFormValue = isEmpty(currentFormValue)
      ? defaultFormValue
      : currentFormValue;
    setFormValues([
      ...filteredFormValues,
      {
        ...currentFormValue,
        case_commodity: commodity.case_commodity,
        answers: {
          ...currentFormValue.answers,
          ...currentValues,
        },
      },
    ]);
    // eol form values
    const id = Object.keys(value)[0];
    const dataType = `${id.split("-")[0]}-${id.split("-")[1]}`;
    const questionId = id.split("-")[2];
    const question = flattenQuestionList.find(
      (q) => q.id === parseInt(questionId)
    );
    if (!question.parent) {
      setRefresh(!refresh);
      return;
    }
    const parentQuestion = flattenQuestionList.find(
      (q) => q.id === question.parent
    );

    const allChildrens = flattenQuestionList.filter(
      (q) => q.parent === question.parent
    );
    const allChildrensIds = allChildrens.map((q) => `${dataType}-${q.id}`);
    const allChildrensValues = allChildrensIds.reduce((acc, id) => {
      const value = currentValues?.[id];
      if (value) {
        acc.push({ id: id, value: value });
      }
      return acc;
    }, []);

    let sumAllChildrensValues = 0;

    if (!parentQuestion.default_value) {
      sumAllChildrensValues = allChildrensValues.reduce(
        (acc, { value }) => acc + value,
        0
      );
    } else {
      sumAllChildrensValues = getFunctionDefaultValue(
        parentQuestion,
        dataType,
        allChildrensValues
      );
    }

    const parentQuestionId = `${dataType}-${question.parent}`;
    if (parentQuestion) {
      // handle form values
      setFormValues([
        ...filteredFormValues,
        {
          ...currentFormValue,
          case_commodity: commodity.case_commodity,
          answers: {
            ...currentFormValue.answers,
            ...currentValues,
            [parentQuestionId]: sumAllChildrensValues,
          },
        },
      ]);
      // eol handle form values
      form.setFieldsValue({
        [parentQuestionId]: sumAllChildrensValues,
      });
    }
    if (parentQuestion.parent) {
      onValuesChange(
        { [parentQuestionId]: sumAllChildrensValues },
        form.getFieldsValue()
      );
    }
    setRefresh(!refresh);
  };

  return (
    <Card.Grid
      style={{
        width: "100%",
        backgroundColor: groupIndex ? "#ececec" : "",
      }}
      hoverable={false}
    >
      {groupIndex === 1 && <h3>Diversified Income</h3>}
      <h3
        style={{
          paddingLeft: !groupIndex ? 24 : 54,
          backgroundColor: groupIndex ? "#dddddd" : "",
        }}
      >
        {groupIndex === 0
          ? "Focus Commodity:"
          : group.commodity_id === null
          ? "Other "
          : ""}{" "}
        {group.commodity_name}
      </h3>
      {!groupIndex && (
        <Row
          gutter={[16, 16]}
          style={{ borderBottom: "1px solid #f0f0f0" }}
          align="middle"
        >
          <Col span={14}></Col>
          <Col span={5}>
            <h4>Current</h4>
          </Col>
          <Col span={5}>
            <h4>Feasible</h4>
          </Col>
        </Row>
      )}
      <Form
        name={`drivers-income-${groupIndex}`}
        layout="vertical"
        form={form}
        onValuesChange={onValuesChange}
      >
        {group.questions.map((question) => (
          <Questions
            key={question.id}
            indent={!groupIndex ? 0 : indentSize}
            units={commodity}
            form={form}
            refresh={refresh}
            commodityName={group?.commodity_name}
            allQuestions={flattenQuestionList}
            {...question}
          />
        ))}
      </Form>
    </Card.Grid>
  );
};

export default IncomeDriverForm;
