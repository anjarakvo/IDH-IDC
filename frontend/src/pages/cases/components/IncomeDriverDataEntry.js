import React, { useState, useEffect } from "react";
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
} from "antd";
import {
  PlusCircleFilled,
  DeleteTwoTone,
  InfoCircleFilled,
  CheckCircleTwoTone,
  EditTwoTone,
  CloseCircleTwoTone,
} from "@ant-design/icons";
import { IncomeDriverForm } from "./";
import { api } from "../../../lib";
import uniq from "lodash/uniq";
import orderBy from "lodash/orderBy";

const generateSegmentPayloads = (values, currentCaseId, isUpdate = false) => {
  // generate segment payloads
  const segmentPayloads = values.map((fv) => {
    const res = {
      case: currentCaseId,
      name: fv.label,
      target: null,
      household_size: null,
    };
    if (isUpdate) {
      return {
        ...res,
        id: fv?.currentSegmentId || 0,
      };
    }
    return res;
  });
  return segmentPayloads;
};

const generateSegmentAnswerPayloads = (values) => {
  // generate segment answer payloads
  const segmentAnswerPayloads = [];
  values.forEach((fv) => {
    const questionIDs = uniq(
      Object.keys(fv.answers).map((key) => {
        const splitted = key.split("-");
        return parseInt(splitted[1]);
      })
    );
    questionIDs.forEach((qid) => {
      const currentValue = fv.answers[`current-${qid}`];
      const feasibleValue = fv.answers[`feasible-${qid}`];
      const answerTmp = {
        case_commodity: fv.case_commodity,
        segment: fv?.currentSegmentId || 0,
        question: qid,
        current_value: currentValue,
        feasible_value: feasibleValue,
      };
      segmentAnswerPayloads.push(answerTmp);
    });
  });
  return segmentAnswerPayloads.filter(
    (x) => x.current_value && x.feasible_value
  );
};

const DataFields = ({
  segment,
  segmentLabel,
  onDelete,
  questionGroups,
  commodityList,
  renameItem,
  formValues,
  setFormValues,
  segmentItem,
  handleSave,
  isSaving,
}) => {
  const [confimationModal, setConfimationModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(segmentLabel);

  const finishEditing = () => {
    renameItem(segment, newName);
    setEditing(false);
  };
  const cancelEditing = () => {
    setNewName(segmentLabel);
    setEditing(false);
  };

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
    <Row>
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
          <h3>
            Income Drivers
            <small>
              <InfoCircleFilled />
            </small>
          </h3>
          {questionGroups.map((group, groupIndex) => (
            <IncomeDriverForm
              group={group}
              groupIndex={groupIndex}
              commodity={commodityList[groupIndex]}
              key={groupIndex}
              formValues={formValues}
              setFormValues={setFormValues}
              segmentItem={segmentItem}
            />
          ))}
        </Card>
        <Button
          htmlType="submit"
          className="button button-submit button-secondary"
          style={{ float: "right" }}
          loading={isSaving}
          onClick={handleSave}
          disabled={!formValues.length}
        >
          Save
        </Button>
      </Col>
      <Col span={8}></Col>
    </Row>
  );
};

const IncomeDriverDataEntry = ({ commodityList, currentCaseId }) => {
  const [activeKey, setActiveKey] = useState("1");
  const [questionGroups, setQuestionGroups] = useState([]);
  const [items, setItems] = useState([]);
  const [formValues, setFormValues] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [isSaving, setIsSaving] = useState(false);

  // handle save here
  const handleSave = () => {
    setIsSaving(true);
    const postSegmenPayloads = generateSegmentPayloads(
      formValues.filter((fv) => !fv.currentSegmentId),
      currentCaseId
    );
    const putSegmenPayloads = generateSegmentPayloads(
      formValues.filter((fv) => fv.currentSegmentId),
      currentCaseId,
      true
    );

    // POST
    if (postSegmenPayloads.length) {
      api
        .post("/segment", postSegmenPayloads)
        .then((res) => {
          const { data } = res;
          // set currentSegmentId to items state
          const transformItems = items.map((it) => {
            const findNewItem = data.find((d) => d.name === it.label);
            return {
              ...it,
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

          return transformFormValues;
        })
        .then((values) => {
          // handle postSegmentAnswersPayloads
          const segmenAnswerPayloads = generateSegmentAnswerPayloads(
            values.filter((fv) => fv.currentSegmentId)
          );
          values.forEach((val) => {
            if (!val.currentSegmentId) {
              return;
            }
            const payload = segmenAnswerPayloads.filter(
              (x) => x.segment === val.currentSegmentId
            );
            api
              .post(`segment-answer/${val.currentSegmentId}`, payload)
              .then(() => {
                console.info("post segment answers success");
              })
              .catch((e) => {
                console.error(e);
              });
          });
        })
        .then(() => {
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
    }

    // PUT
    if (putSegmenPayloads.length) {
      api
        .put("/segment", putSegmenPayloads)
        .then(() => {
          // handle postSegmentAnswersPayloads
          const segmenAnswerPayloads = generateSegmentAnswerPayloads(
            formValues.filter((fv) => fv.currentSegmentId)
          );
          formValues.forEach((val) => {
            if (!val.currentSegmentId) {
              return;
            }
            const payload = segmenAnswerPayloads.filter(
              (x) => x.segment === val.currentSegmentId
            );
            api
              .put(`segment-answer/${val.currentSegmentId}`, payload)
              .then(() => {
                console.info("put segment answers success");
              })
              .catch((e) => {
                console.error(e);
              });
          });
        })
        .then(() => {
          messageApi.open({
            type: "success",
            content: "Segments updated successfully.",
          });
        })
        .catch((e) => {
          console.error(e);
          messageApi.open({
            type: "error",
            content: "Failed to update segments.",
          });
        })
        .finally(() => {
          setIsSaving(false);
        });
    }
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
      setQuestionGroups(res.data);
      // load segment from database
      api
        .get(`segment/case/${currentCaseId}`)
        .then((res) => {
          const { data } = res;
          let itemsTmp = orderBy(data, "id").map((it, itIndex) => ({
            key: String(itIndex + 1),
            label: it.name,
            currentSegmentId: it.id,
          }));
          const formValuesTmp = orderBy(data, "id").map((it, itIndex) => ({
            key: String(itIndex + 1),
            label: it.name,
            currentSegmentId: it.id,
            answers: it.answers,
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
            onDelete={itemIndex ? onDelete(activeKey) : false}
            commodityList={commodityList}
            renameItem={renameItem}
            formValues={formValues}
            setFormValues={setFormValues}
            segmentItem={{ ...item, label: newLabel }}
            handleSave={handleSave}
            isSaving={isSaving}
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
      // remove add tab after 5 segments
      if (newKey === 5) {
        newItems.splice(newItems.length - 1, 1);
        setItems(newItems);
      }
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
                  commodityList={commodityList}
                  renameItem={renameItem}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  segmentItem={item}
                  handleSave={handleSave}
                  isSaving={isSaving}
                />
              ),
          }))}
        />
      </Col>
    </Row>
  );
};

export default IncomeDriverDataEntry;
