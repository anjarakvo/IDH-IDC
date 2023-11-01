import React, { useState, useEffect } from "react";
import { Form } from "antd";
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
  totalIncomeQuestion,
  setTotalCurrentIncome,
  setTotalFeasibleIncome,
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

  useEffect(() => {
    // for total income
    const currentFormValue = formValues.find((x) => x.key === segmentItem.key);
    const totalCurrentIncomeAnswer = totalIncomeQuestion
      .map((qs) => currentFormValue?.answers[`current-${qs}`])
      .filter((a) => a)
      .reduce((acc, a) => acc + a, 0);
    setTotalCurrentIncome(totalCurrentIncomeAnswer);
    const totalFeasibleIncomeAnswer = totalIncomeQuestion
      .map((qs) => currentFormValue?.answers[`feasible-${qs}`])
      .filter((a) => a)
      .reduce((acc, a) => acc + a, 0);
    setTotalFeasibleIncome(totalFeasibleIncomeAnswer);
  }, [
    formValues,
    segmentItem,
    totalIncomeQuestion,
    setTotalCurrentIncome,
    setTotalFeasibleIncome,
  ]);

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
    const [fieldName, caseCommodityId, questionId] = id.split("-");
    const dataType = `${fieldName}-${caseCommodityId}`;
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

    if (!parentQuestion?.default_value) {
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
    <div
      style={{
        backgroundColor: groupIndex ? "#ececec" : "transparent",
        marginLeft: groupIndex ? -12 : 0,
        marginRight: groupIndex ? -12 : 0,
      }}
    >
      {groupIndex === 1 && (
        <h3 className="diversified-income-title">Diversified Income</h3>
      )}
      <h3
        style={{
          paddingLeft: !groupIndex ? 24 : 45,
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
      <Form
        name={`drivers-income-${segmentItem.key}-${groupIndex}`}
        layout="vertical"
        form={form}
        onValuesChange={onValuesChange}
      >
        {group.questions.map((question, questionIndex) => (
          <Questions
            key={question.id}
            indent={!groupIndex ? 0 : indentSize}
            units={commodity}
            form={form}
            refresh={refresh}
            commodityName={group?.commodity_name}
            allQuestions={flattenQuestionList}
            totalIncome={
              !groupIndex &&
              questionIndex === 0 &&
              question.question_type === "aggregator"
            }
            {...question}
          />
        ))}
      </Form>
    </div>
  );
};

export default IncomeDriverForm;
