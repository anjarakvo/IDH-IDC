import React, { useState, useEffect, useMemo } from "react";
import {
  Row,
  Col,
  Space,
  Card,
  Tabs,
  Button,
  Input,
  Popover,
  message,
  InputNumber,
} from "antd";
import {
  PlusCircleFilled,
  DeleteTwoTone,
  InfoCircleFilled,
  CheckCircleTwoTone,
  EditTwoTone,
  CloseCircleTwoTone,
  CaretDownFilled,
  CaretUpFilled,
} from "@ant-design/icons";
import Chart from "../../../components/chart";
import {
  IncomeDriverForm,
  IncomeDriverTarget,
  generateSegmentPayloads,
} from "./";
import { api } from "../../../lib";
import orderBy from "lodash/orderBy";
import groupBy from "lodash/groupBy";
import map from "lodash/map";

const masterCommodityCategories = window.master?.commodity_categories || [];
const commodityNames = masterCommodityCategories.reduce((acc, curr) => {
  const commodities = curr.commodities.reduce((a, c) => {
    return { ...a, [c.id]: c.name };
  }, {});
  return { ...acc, ...commodities };
}, {});

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
        commodityNames?.[g[0].commodity_id] || "diversified";
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
          },
          {
            name: "Feasible",
            title: "Additional income if feasible values are reached",
            value: g.reduce((a, b) => a + b.feasibleValue, 0),
            total: g.reduce((a, b) => a + b.feasibleValue, 0),
            order: 1,
          },
        ],
      };
    });
    return commodityGroup;
  }, [totalIncomeQuestion, formValues, segment, questionGroups, commodityList]);

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

const IncomeDriverDataEntry = ({
  commodityList,
  currentCaseId,
  currentCase,
  setCaseData,
  questionGroups,
  setQuestionGroups,
  totalIncomeQuestion,
}) => {
  const [activeKey, setActiveKey] = useState("1");
  const [items, setItems] = useState([]);
  const [formValues, setFormValues] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const formValeusWithTotalCurrentIncomeAnswer = formValues.map(
      (currentFormValue) => {
        const totalCurrentIncomeAnswer = totalIncomeQuestion
          .map((qs) => currentFormValue?.answers[`current-${qs}`])
          .filter((a) => a)
          .reduce((acc, a) => acc + a, 0);
        const totalFeasibleIncomeAnswer = totalIncomeQuestion
          .map((qs) => currentFormValue?.answers[`feasible-${qs}`])
          .filter((a) => a)
          .reduce((acc, a) => acc + a, 0);
        return {
          ...currentFormValue,
          total_current_income: totalCurrentIncomeAnswer,
          total_feasible_income: totalFeasibleIncomeAnswer,
        };
      }
    );
    setCaseData(formValeusWithTotalCurrentIncomeAnswer);
  }, [formValues, setCaseData, totalIncomeQuestion]);

  // handle save here
  const handleSave = () => {
    setIsSaving(true);
    const apiCalls = [];
    const postFormValues = formValues.filter((fv) => !fv.currentSegmentId);
    const putFormValues = formValues.filter((fv) => fv.currentSegmentId);
    if (postFormValues.length) {
      const postPayloads = generateSegmentPayloads(
        postFormValues,
        currentCaseId,
        commodityList
      );
      apiCalls.push(api.post("/segment", postPayloads));
    }
    if (putFormValues.length) {
      const putPayloads = generateSegmentPayloads(
        putFormValues,
        currentCaseId,
        commodityList
      );
      apiCalls.push(api.put("/segment", putPayloads));
    }
    // api call
    Promise.all(apiCalls)
      .then((results) => {
        const [res, ,] = results;
        // handle after POST
        const { data } = res;
        // set currentSegmentId to items state
        const transformItems = items.map((it) => {
          const findNewItem = data.find((d) => d.name === it.label);
          return {
            ...it,
            ...findNewItem,
            currentSegmentId: findNewItem?.id || it.currentSegmentId,
          };
        });
        setItems(transformItems);
        // eol set currentSegmentId to items state

        // update form values
        const transformFormValues = formValues.map((fv) => {
          const findItem = transformItems.find((it) => it.key === fv.key);
          if (!findItem) {
            return fv;
          }
          return {
            ...fv,
            ...findItem,
          };
        });
        setFormValues(transformFormValues);
        messageApi.open({
          type: "success",
          content: "Segments saved successfully.",
        });
      })
      .catch((e) => {
        console.error(e);
        messageApi.open({
          type: "error",
          content: "Failed to save segments.",
        });
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  useEffect(() => {
    if (commodityList.length === 0 && !currentCaseId) {
      return;
    }
    api.get(`/questions/${currentCaseId}`).then((res) => {
      const defaultItems = [
        {
          key: "add",
          label: (
            <span>
              <PlusCircleFilled /> Add Segment
            </span>
          ),
          currentSegmentId: null,
        },
      ];
      // reorder question to match commodity list order (CORRECT ORDER)
      const dataTmp = commodityList.map((cl) =>
        res.data.find((d) => d.commodity_id === cl.commodity)
      );
      setQuestionGroups(dataTmp);
      // load segment from database
      api
        .get(`segment/case/${currentCaseId}`)
        .then((res) => {
          const { data } = res;
          let itemsTmp = orderBy(data, "id").map((it, itIndex) => ({
            key: String(itIndex + 1),
            label: it.name,
            currentSegmentId: it.id,
            ...it,
          }));
          const formValuesTmp = orderBy(data, "id").map((it, itIndex) => ({
            key: String(itIndex + 1),
            label: it.name,
            currentSegmentId: it.id,
            answers: it.answers,
            ...it,
          }));
          if (itemsTmp.length !== 5) {
            itemsTmp = [...itemsTmp, ...defaultItems];
          }
          setItems(itemsTmp);
          setFormValues(formValuesTmp);
        })
        .catch(() => {
          // default items if no segments in database
          setItems([
            {
              key: "1",
              label: "Segment 1",
              currentSegmentId: null,
            },
            ...defaultItems,
          ]);
          setFormValues([
            {
              key: "1",
              label: "Segment 1",
              currentSegmentId: null,
              answers: {},
            },
          ]);
        });
    });
  }, [commodityList, setQuestionGroups, currentCaseId]);

  const handleRemoveSegmentFromItems = (segmentKey) => {
    // handle form values
    const filteredFormValues = formValues.filter((x) => x.key !== segmentKey);
    setFormValues(filteredFormValues);
    // eol handle form values
    const newItems = items.filter((item) => item.key !== segmentKey);
    setItems(newItems);
    const newActiveKey = segmentKey - 1;
    setActiveKey(newActiveKey.toString());
  };

  const onDelete = (segmentKey) => {
    // delete segment & segment answers
    const currentSegmentId =
      items.find((item) => item.key === segmentKey)?.currentSegmentId || null;
    if (currentSegmentId) {
      api
        .delete(`segment/${currentSegmentId}`)
        .then(() => {
          handleRemoveSegmentFromItems(segmentKey);
        })
        .catch((e) => {
          console.error(e);
          messageApi.open({
            type: "error",
            content: "Failed to delete a segment.",
          });
        });
    } else {
      handleRemoveSegmentFromItems(segmentKey);
    }
  };

  const renameItem = (activeKey, newLabel) => {
    const newItem = items.map((item, itemIndex) => {
      if (item.key === activeKey.toString()) {
        item.label = newLabel;
        item.children = (
          <DataFields
            segment={activeKey}
            segmentLabel={newLabel}
            questionGroups={questionGroups}
            totalIncomeQuestion={totalIncomeQuestion}
            onDelete={itemIndex ? () => onDelete(activeKey) : false}
            commodityList={commodityList}
            renameItem={renameItem}
            formValues={formValues}
            setFormValues={setFormValues}
            segmentItem={{ ...item, label: newLabel }}
            handleSave={handleSave}
            isSaving={isSaving}
            currentCaseId={currentCaseId}
            currentCase={currentCase}
          />
        );
        // handle form values
        const filteredFormValues = formValues.filter((x) => x.key !== item.key);
        const currentFormValue = formValues.find((x) => x.key === item.key) || {
          ...item,
          answers: {},
        };
        setFormValues([
          ...filteredFormValues,
          {
            ...currentFormValue,
            label: newLabel,
          },
        ]);
        // EOL handle form values
      }
      return item;
    });
    setItems(newItem);
    setActiveKey(activeKey.toString());
  };

  const onChange = (activeKey) => {
    if (activeKey === "add") {
      const newKey = items.length;
      const newItems = [...items];
      newItems.splice(newItems.length - 1, 0, {
        key: newKey.toString(),
        label: `Segment ${newKey}`,
        currentSegmentId: null,
      });
      setItems(newItems);
      setActiveKey(newKey.toString());

      if (newKey === 5) {
        newItems.splice(newItems.length - 1, 1);
        setItems(newItems);
      }
      setFormValues([
        ...formValues,
        {
          key: newKey.toString(),
          label: `Segment ${newKey}`,
          currentSegmentId: null,
          answers: {},
        },
      ]);
    } else {
      setActiveKey(activeKey);
    }
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        {contextHolder}
        <Tabs
          onChange={onChange}
          activeKey={activeKey}
          items={items.map((item, itemIndex) => ({
            ...item,
            children:
              item.key === "add" ? null : (
                <DataFields
                  segment={item.key}
                  segmentLabel={item.label}
                  onDelete={itemIndex ? () => onDelete(item.key) : false}
                  questionGroups={questionGroups}
                  totalIncomeQuestion={totalIncomeQuestion}
                  commodityList={commodityList}
                  renameItem={renameItem}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  segmentItem={item}
                  handleSave={handleSave}
                  isSaving={isSaving}
                  currentCaseId={currentCaseId}
                  currentCase={currentCase}
                />
              ),
          }))}
        />
      </Col>
    </Row>
  );
};

export default IncomeDriverDataEntry;
