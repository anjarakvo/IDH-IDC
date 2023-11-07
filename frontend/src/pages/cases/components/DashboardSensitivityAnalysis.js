import React, { useState, useMemo } from "react";
import { Row, Col, Card, Alert, Select, InputNumber, Table } from "antd";
import { groupBy, map } from "lodash";

const columns = [
  {
    title: "Income Driver",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Current",
    dataIndex: "current",
    key: "current",
  },
  {
    title: "Feasible",
    dataIndex: "feasible",
    key: "feasible",
  },
];

const BinningForm = ({ hidden }) => {
  return (
    <Row gutter={[8, 8]} style={{ display: hidden ? "none" : "" }}>
      <Col span={12}>
        <b>Binning driver:</b>
      </Col>
      <Col span={12}>
        <Select
          size="small"
          className="binning-input"
          options={[
            {
              value: "A",
              label: "B",
            },
          ]}
        />
      </Col>
      <Col span={12}>Number of Bins:</Col>
      <Col span={12}>
        <InputNumber size="small" className="binning-input" />
      </Col>
      <Col span={12}>Bin Values:</Col>
      <Col span={4}>
        <InputNumber size="small" className="binning-input" />
      </Col>
      <Col span={4}>
        <InputNumber size="small" className="binning-input" />
      </Col>
      <Col span={4}>
        <InputNumber size="small" className="binning-input" />
      </Col>
      <Col span={12}>
        <b>X-Axis Driver:</b>
      </Col>
      <Col span={12}>
        <Select
          size="small"
          className="binning-input"
          options={[
            {
              value: "A",
              label: "B",
            },
          ]}
        />
      </Col>
      <Col span={12}>Maximum Value</Col>
      <Col span={12}>
        <InputNumber size="small" className="binning-input" />
      </Col>
      <Col span={12}>Minimum Value:</Col>
      <Col span={12}>
        <InputNumber size="small" className="binning-input" />
      </Col>
      <Col span={12}>
        <b>Y-Axis Driver:</b>
      </Col>
      <Col span={12}>
        <Select
          size="small"
          className="binning-input"
          options={[
            {
              value: "A",
              label: "B",
            },
          ]}
        />
      </Col>
      <Col span={12}>Maximum Value</Col>
      <Col span={12}>
        <InputNumber size="small" className="binning-input" />
      </Col>
      <Col span={12}>Minimum Value:</Col>
      <Col span={12}>
        <InputNumber size="small" className="binning-input" />
      </Col>
    </Row>
  );
};

const DashboardSensitivityAnalysis = ({ dashboardData = [] }) => {
  const [currentSegment, setCurrentSegment] = useState(null);
  const dataSource = useMemo(() => {
    if (!currentSegment) {
      return [];
    }
    const segmentData = dashboardData.find(
      (segment) => segment.id === currentSegment
    );
    const answers = segmentData.answers;
    const drivers = answers.filter(
      (answer) => answer.question.parent_id === 1 && answer.commodityFocus
    );
    const data = map(groupBy(drivers, "question.id"), (d, i) => {
      return {
        key: parseInt(i) - 1,
        name: d[0].question.text,
        current: d.find((a) => a.name === "current")?.value || 0,
        feasible: d.find((a) => a.name === "feasible")?.value || 0,
      };
    });
    return [
      ...data,
      {
        key: data.length + 1,
        name: "Diversified Income",
        current: segmentData.total_current_diversified_income,
        feasible: segmentData.total_feasible_diversified_income,
      },
    ];
  }, [currentSegment, dashboardData]);

  return (
    <Row>
      <Col span={24}>
        <Alert
          message="On this page you can explore how different combinations of drivers lead to different income levels. Whether it's optimizing land use, pricing strategies, or diversifying income sources, this page empowers you to explore various scenarios and find the best path towards improving farmer household income."
          type="success"
          className="alert-box"
        />
      </Col>
      <Col span={24}>
        <Card className="income-driver-dashboard">
          <Card.Grid
            style={{
              width: "100%",
            }}
            hoverable={false}
          >
            <Row className="income-driver-content" align="top" gutter={[8, 8]}>
              <Col span={24}>
                <h2>Settings for Analysis</h2>
              </Col>
              <Col>
                <b>Step 1</b>: Select segment for which you want to perform the
                sensitivity analysis
              </Col>
              <Col span={4}>
                <Select
                  size="small"
                  style={{ width: "100%", marginLeft: "10px" }}
                  onChange={setCurrentSegment}
                  options={dashboardData.map((segment) => ({
                    value: segment.id,
                    label: segment.name,
                  }))}
                />
              </Col>
              <Col span={24}>
                <b>Step 2</b>: Select three drivers you want to model. The other
                two drivers remain at their current level. Use the driver
                overview on the right as reference.
                <ul>
                  <li>
                    Binning driver: this driver will be evaluated on a maximum
                    of three different values, named bins. For each bin, a
                    seperate heatmap will be created to compare. They also
                    reflect the different lines in the line chart.
                  </li>
                  <li>
                    X-axis driver: this driver will be reflected on the x-axis
                    of the line chart, and in the columns of the heatmaps. You
                    need to set a minimum and maximum value.{" "}
                  </li>
                  <li>
                    Y-axis driver: this driver will be reflected on the y-axis
                    of the line chart, and in the rows of the heatmaps. You need
                    to set a minimum and maximum value.
                  </li>
                </ul>
              </Col>
              <Col span={12}>
                {dashboardData.map((segment, key) => (
                  <BinningForm
                    key={key}
                    segment={segment}
                    hidden={currentSegment !== segment.id}
                  />
                ))}
              </Col>
              <Col span={12}>
                <Table
                  size="small"
                  dataSource={dataSource}
                  columns={columns}
                  pagination={false}
                />
              </Col>
            </Row>
          </Card.Grid>
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardSensitivityAnalysis;
