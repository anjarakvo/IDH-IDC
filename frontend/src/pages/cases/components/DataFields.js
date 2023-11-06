import React, { useState, useEffect, useMemo } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Space,
  Popover,
  Input,
  InputNumber,
} from "antd";
import {
  DeleteTwoTone,
  InfoCircleFilled,
  CheckCircleTwoTone,
  EditTwoTone,
  CloseCircleTwoTone,
  CaretDownFilled,
  CaretUpFilled,
} from "@ant-design/icons";
import { map, groupBy } from "lodash";
import { IncomeDriverForm, IncomeDriverTarget, commodityOptions } from "./";
import Chart from "../../../components/chart";

const DataFields = ({
  segment,
  segmentLabel,
  onDelete,
  questionGroups,
  totalIncomeQuestion,
  commodityList,
  renameItem,
  formValues,
  setFormValues,
  segmentItem,
  handleSave,
  isSaving,
  currentCaseId,
  currentCase,
}) => {
  const [confimationModal, setConfimationModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(segmentLabel);
  const [totalCurrentIncome, setTotalCurrentIncome] = useState(0);
  const [totalFeasibleIncome, setTotalFeasibleIncome] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const finishEditing = () => {
    renameItem(segment, newName);
    setEditing(false);
  };
  const cancelEditing = () => {
    setNewName(segmentLabel);
    setEditing(false);
  };

  useEffect(() => {
    const percent =
      ((totalFeasibleIncome - totalCurrentIncome) / totalCurrentIncome) * 100;
    setPercentage(percent || 0);
  }, [totalCurrentIncome, totalFeasibleIncome]);

  const chartData = useMemo(() => {
    if (!formValues.length) {
      return [];
    }
    const chartQuestion = totalIncomeQuestion.map((qid) => {
      const [caseCommodity, questionId] = qid.split("-");
      const feasibleId = `feasible-${qid}`;
      const currentId = `current-${qid}`;
      const segmentValues = formValues.find((v) => v.key === segment);
      const feasibleValue = segmentValues.answers?.[feasibleId] || 0;
      const currentValue = segmentValues.answers?.[currentId];
      const question = questionGroups
        .flatMap((g) => g.questions)
        .find((q) => q.id === parseInt(questionId));
      const commodityId = commodityList.find(
        (c) => c.case_commodity === parseInt(caseCommodity)
      ).commodity;
      return {
        case_id: caseCommodity,
        commodity_id: commodityId,
        question: question,
        feasibleValue: feasibleValue - (currentValue || 0),
        currentValue: currentValue || 0,
      };
    });
    const commodityGroup = map(groupBy(chartQuestion, "case_id"), (g) => {
      const commodityName =
        commodityOptions.find((c) => c.value === g[0].commodity_id)?.label ||
        "diversified";
      const additionalIncome = g.reduce((a, b) => a + b.feasibleValue, 0);
      return {
        name: commodityName,
        title: commodityName,
        stack: [
          {
            name: "Current",
            title: "Current",
            value: g.reduce((a, b) => a + b.currentValue, 0),
            total: g.reduce((a, b) => a + b.currentValue, 0),
            order: 2,
            color: "#3b78d8",
          },
          {
            name: "Feasible",
            title: "Additional income if feasible values are reached",
            value: additionalIncome < 0 ? 0 : additionalIncome,
            total: additionalIncome < 0 ? 0 : additionalIncome,
            order: 1,
            color: "#c9daf8",
          },
        ],
      };
    });
    const totalIncomeCommodityGroup = {
      name: "Total\nIncome",
      title: "Total\nIncome",
      stack: [
        {
          name: "Current",
          title: "Current",
          value: totalCurrentIncome,
          total: totalCurrentIncome,
          order: 2,
          color: "#6aa84f",
        },
        {
          name: "Feasible",
          title: "Additional income if feasible values are reached",
          value: totalFeasibleIncome - totalCurrentIncome,
          total: totalFeasibleIncome,
          order: 1,
          color: "#d9ead3",
        },
      ],
    };
    return [...commodityGroup, totalIncomeCommodityGroup];
  }, [
    totalIncomeQuestion,
    formValues,
    segment,
    questionGroups,
    commodityList,
    totalCurrentIncome,
    totalFeasibleIncome,
  ]);

  const ButtonEdit = () => (
    <Button
      size="small"
      shape="circle"
      type="secondary"
      icon={
        editing ? (
          <CheckCircleTwoTone twoToneColor="#52c41a" />
        ) : (
          <EditTwoTone twoToneColor="" />
        )
      }
      onClick={editing ? finishEditing : () => setEditing(true)}
    />
  );

  const ButtonCancelEdit = () => (
    <Button
      size="small"
      shape="circle"
      type="secondary"
      icon={<CloseCircleTwoTone twoToneColor="#eb2f96" />}
      onClick={cancelEditing}
    />
  );

  const ButtonDelete = () => (
    <Popover
      content={
        <Space align="end">
          <Button type="primary" onClick={() => setConfimationModal(false)}>
            Close
          </Button>
          <Button onClick={onDelete} danger>
            Delete
          </Button>
        </Space>
      }
      title="Are you sure want to delete this segment?"
      trigger="click"
      open={confimationModal}
      onOpenChange={(e) => setConfimationModal(e)}
    >
      <Button
        size="small"
        shape="circle"
        type="secondary"
        icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
      />
    </Popover>
  );

  const extra = onDelete ? (
    <Space>
      <ButtonEdit />
      {editing && <ButtonCancelEdit />}
      {!editing && <ButtonDelete />}
    </Space>
  ) : (
    <Space>
      <ButtonEdit />
      {editing && <ButtonCancelEdit />}
    </Space>
  );

  return (
    <Row gutter={[16, 16]}>
      <Col span={16}>
        <Card
          title={
            <h3>
              {editing ? (
                <Input
                  defaultValue={segmentLabel}
                  onChange={(e) => setNewName(e.target.value)}
                />
              ) : (
                segmentLabel
              )}
            </h3>
          }
          extra={extra}
          className="segment-group"
        >
          <Card.Grid
            style={{
              width: "100%",
            }}
            hoverable={false}
          >
            <h2 className="section-title">
              Income Target
              <small>
                <InfoCircleFilled />
              </small>
            </h2>
            <IncomeDriverTarget
              segment={segment}
              currentCase={currentCase}
              formValues={formValues}
              setFormValues={setFormValues}
              segmentItem={segmentItem}
              totalCurrentIncome={totalCurrentIncome}
            />
            <h2 className="section-title">
              Income Drivers
              <small>
                <InfoCircleFilled />
              </small>
            </h2>
            <Row gutter={[8, 8]} align="middle">
              <Col span={14}></Col>
              <Col span={4}>
                <h4>Current</h4>
              </Col>
              <Col span={4}>
                <h4>Feasible</h4>
              </Col>
              <Col span={2}></Col>
            </Row>
            <Row
              gutter={[8, 8]}
              style={{
                borderBottom: "1px solid #f0f0f0",
                padding: "8px 0",
              }}
              align="middle"
            >
              <Col span={14}>
                <h2>Total Income</h2>
              </Col>
              <Col span={4}>
                <InputNumber
                  value={totalCurrentIncome}
                  disabled
                  style={{ width: "100%" }}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  value={totalFeasibleIncome}
                  disabled
                  style={{ width: "100%" }}
                />
              </Col>
              <Col span={2}>
                <Space>
                  {percentage === 0 ? null : percentage > 0 ? (
                    <CaretUpFilled className="ceret-up" />
                  ) : (
                    <CaretDownFilled className="ceret-down" />
                  )}
                  <div
                    className={
                      percentage === 0
                        ? ""
                        : percentage > 0
                        ? "ceret-up"
                        : "ceret-down"
                    }
                  >
                    {totalFeasibleIncome < totalCurrentIncome
                      ? -percentage.toFixed(0)
                      : percentage.toFixed(0)}
                    %
                  </div>
                </Space>
              </Col>
            </Row>
            {questionGroups.map((group, groupIndex) => (
              <IncomeDriverForm
                group={group}
                groupIndex={groupIndex}
                commodity={commodityList[groupIndex]}
                key={groupIndex}
                formValues={formValues}
                setFormValues={setFormValues}
                segmentItem={segmentItem}
                currentCaseId={currentCaseId}
                totalIncomeQuestion={totalIncomeQuestion}
                setTotalCurrentIncome={setTotalCurrentIncome}
                setTotalFeasibleIncome={setTotalFeasibleIncome}
              />
            ))}
          </Card.Grid>
        </Card>
        <Button
          htmlType="submit"
          className="button button-submit button-secondary"
          style={{ float: "right" }}
          loading={isSaving}
          onClick={handleSave}
        >
          Save
        </Button>
      </Col>
      <Chart
        title="Calculated Household Income"
        span={8}
        type="BARSTACK"
        data={chartData}
        affix={true}
      />
    </Row>
  );
};

export default DataFields;
