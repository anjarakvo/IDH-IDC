import React, { useState } from "react";
import { Card, Form, Row, Col } from "antd";
import { Questions, flatten, indentSize } from "./";

// example question id = #1
// example question function_name = #1 + #2 + #3
const regexQuestionId = /#(\d+)/;

const getFunctionDefaultValue = (question, prefix, values = {}) => {
  const function_name = question.default_value.split(" ");
  const getFunction = function_name.reduce((acc, fn) => {
    const questionValue = fn.match(regexQuestionId);
    if (questionValue) {
      const valueName = `${prefix}-${questionValue[1]}`;
      const value = values.find((v) => v.id === valueName)?.value;
      if (!value) {
        acc.push(0);
        return acc;
      }
      acc.push(value.toString());
    } else {
      acc.push(fn);
    }
    return acc;
  }, []);
  const finalFunction = getFunction.join("");
  return eval(finalFunction);
};

const IncomeDriverForm = ({ group, groupIndex, commodity }) => {
  const [form] = Form.useForm();
  const [refresh, setRefresh] = useState(false);

  const flattenQuestionList = flatten(group.questions);

  const onValuesChange = (value, currentValues) => {
    const id = Object.keys(value)[0];
    const dataType = id.split("-")[0];
    const questionId = id.split("-")[1];
    const question = flattenQuestionList.find(
      (q) => q.id === parseInt(questionId)
    );
    if (!question.parent) {
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
            {...question}
          />
        ))}
      </Form>
    </Card.Grid>
  );
};

export default IncomeDriverForm;
