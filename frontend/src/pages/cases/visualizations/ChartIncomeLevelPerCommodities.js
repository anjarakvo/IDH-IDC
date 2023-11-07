import React, { useState, useEffect, useMemo } from "react";
import { Row, Col } from "antd";
import { SegmentSelector } from ".";
import { uniqBy, capitalize } from "lodash";
import Chart from "../../../components/chart";
import { getFunctionDefaultValue } from "../components";

const colors = ["#0098FF", "#FFC505", "#47D985", "#FF5D00", "#00625F"];
const legendColors = ["#47D985", "#00625F"];

const ChartIncomeLevelPerCommodities = ({ dashboardData }) => {
  const [selectedSegment, setSelectedSegment] = useState(null);

  useEffect(() => {
    if (dashboardData.length > 0) {
      setSelectedSegment(dashboardData[0].id);
    }
  }, [dashboardData]);

  const currentSegmentData = useMemo(() => {
    if (!selectedSegment || !dashboardData.length) {
      return null;
    }
    return dashboardData.find(
      (d) => d.id === selectedSegment || d.currentSegment === selectedSegment
    );
  }, [selectedSegment, dashboardData]);

  const chartData = useMemo(() => {
    if (!currentSegmentData) {
      return [];
    }
    // list commodities exclude diversified income
    const commoditiesTemp = currentSegmentData.answers
      .filter((a) => a.commodityId && a.commodityName && !a.question.parent)
      .map((a) => ({
        commodityId: a.commodityId,
        commodityName: a.commodityName,
        commodityFocus: a.commodityFocus,
        questions: a.question.childrens.map((q) => ({
          id: q.id,
          text: q.text,
        })),
      }));
    const commodities = uniqBy(commoditiesTemp, "commodityId");
    // populate chart data
    const res = commodities.map((cm, cmi) => {
      const data = ["current", "feasible"].map((x, xi) => {
        const title = `${capitalize(x)}\n${currentSegmentData.name}`;
        // recalculate total value
        const incomeQuestion = currentSegmentData.answers.find(
          (a) => a.name === x && !a.question.parent
        ).question;
        const allAnswers = currentSegmentData.answers
          .filter((a) => a.name === x)
          .map((a) => ({
            id: `${a.name}-${a.commodityId}-${a.questionId}`,
            value: a.value,
          }));
        const newTotalValue = getFunctionDefaultValue(
          incomeQuestion,
          `${x}-${cm.commodityId}`,
          allAnswers
        );
        // map drivers value
        const stack = cm.questions.map((q, qi) => {
          const answer = currentSegmentData.answers.find(
            (a) =>
              a.commodityId === cm.commodityId &&
              a.name === x &&
              a.questionId === q.id
          );
          return {
            name: q.text,
            title: q.text,
            value: answer.value || 0,
            total: answer.value || 0,
            order: qi,
            color: colors[qi],
          };
        });
        return {
          name: title,
          title: title,
          stack: stack,
          value: newTotalValue,
          total: newTotalValue,
          commodityId: cm.commodityId,
          commodityName: cm.commodityName,
          color: legendColors[xi],
        };
      });
      return {
        name: cm.commodityName,
        title: cm.commodityName,
        order: cmi,
        data: data,
      };
    });
    return res;
  }, [currentSegmentData]);

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <SegmentSelector
            dashboardData={dashboardData}
            selectedSegment={selectedSegment}
            setSelectedSegment={setSelectedSegment}
          />
        </Col>
        <Col span={24}>
          <Chart
            wrapper={false}
            type="COLUMN-BAR"
            data={chartData}
            affix={true}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ChartIncomeLevelPerCommodities;
