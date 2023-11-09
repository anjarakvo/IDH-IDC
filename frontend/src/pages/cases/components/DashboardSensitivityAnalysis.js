import React, { useState, useMemo } from "react";
import {
  Row,
  Col,
  Card,
  Divider,
  Alert,
  Select,
  InputNumber,
  Table,
  Form,
} from "antd";
import { groupBy, map } from "lodash";
import { ChartBinningHeatmap } from "../visualizations";

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

const generateDriverOptions = (drivers, selected, excludes) => {
  const options = selected.filter((s) => excludes.includes(s.name));
  return drivers.map((d) => ({
    ...d,
    disabled: options.find((o) => o.value === d.value),
  }));
};

const BinningForm = ({ selected = [], segment, drivers = [], hidden }) => {
  const options = useMemo(() => {
    if (!selected.length) {
      return {
        "binning-driver-name": drivers,
        "x-axis-driver": drivers,
        "y-axis-driver": drivers,
      };
    }
    return {
      "binning-driver-name": generateDriverOptions(drivers, selected, [
        "x-axis-driver",
        "y-axis-driver",
      ]),
      "x-axis-driver": generateDriverOptions(drivers, selected, [
        "binning-driver-name",
        "y-axis-driver",
      ]),
      "y-axis-driver": generateDriverOptions(drivers, selected, [
        "binning-driver-name",
        "x-axis-driver",
      ]),
    };
  }, [drivers, selected]);

  return (
    <Row gutter={[8, 8]} style={{ display: hidden ? "none" : "" }}>
      <Col span={12}>
        <b>Binning driver:</b>
      </Col>
      <Col span={12}>
        <Form.Item name={`${segment.id}_binning-driver-name`}>
          <Select
            size="small"
            className="binning-input"
            options={options["binning-driver-name"]}
            allowClear
          />
        </Form.Item>
      </Col>
      <Col span={12}>Bin Values:</Col>
      <Col span={4}>
        <Form.Item name={`${segment.id}_binning-value-1`}>
          <InputNumber size="small" className="binning-input" />
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item name={`${segment.id}_binning-value-2`}>
          <InputNumber size="small" className="binning-input" />
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item name={`${segment.id}_binning-value-3`}>
          <InputNumber size="small" className="binning-input" />
        </Form.Item>
      </Col>
      <Divider />
      <Col span={12}>
        <b>X-Axis Driver:</b>
      </Col>
      <Col span={12}>
        <Form.Item name={`${segment.id}_x-axis-driver`}>
          <Select
            size="small"
            className="binning-input"
            options={options["x-axis-driver"]}
            allowClear
          />
        </Form.Item>
      </Col>
      <Col span={12}>Minimum Value:</Col>
      <Col span={4}>
        <Form.Item name={`${segment.id}_x-axis-min-value`}>
          <InputNumber size="small" className="binning-input" />
        </Form.Item>
      </Col>
      <Col span={12}>Maximum Value</Col>
      <Col span={4}>
        <Form.Item name={`${segment.id}_x-axis-max-value`}>
          <InputNumber size="small" className="binning-input" />
        </Form.Item>
      </Col>
      <Divider />
      <Col span={12}>
        <b>Y-Axis Driver:</b>
      </Col>
      <Col span={12}>
        <Form.Item name={`${segment.id}_y-axis-driver`}>
          <Select
            size="small"
            className="binning-input"
            options={options["y-axis-driver"]}
            allowClear
          />
        </Form.Item>
      </Col>
      <Col span={12}>Minimum Value:</Col>
      <Col span={4}>
        <Form.Item name={`${segment.id}_y-axis-min-value`}>
          <InputNumber size="small" className="binning-input" />
        </Form.Item>
      </Col>
      <Col span={12}>Maximum Value</Col>
      <Col span={4}>
        <Form.Item name={`${segment.id}_y-axis-max-value`}>
          <InputNumber size="small" className="binning-input" />
        </Form.Item>
      </Col>
    </Row>
  );
};

const DashboardSensitivityAnalysis = ({ dashboardData = [] }) => {
  const [currentSegment, setCurrentSegment] = useState(null);
  const [binningData, setBinningData] = useState({});
  const [form] = Form.useForm();

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
        key: data.length + 10,
        name: "Diversified Income",
        current: segmentData.total_current_diversified_income,
        feasible: segmentData.total_feasible_diversified_income,
      },
      {
        key: data.length + 11,
        name: "Total Focus Income",
        current: segmentData.total_current_focus_income?.toFixed(2) || 0,
        feasible: segmentData.total_feasible_focus_income?.toFixed(2) || 0,
      },
      {
        key: data.length + 12,
        name: "Total Income",
        current: segmentData.total_current_income?.toFixed(2) || 0,
        feasible: segmentData.total_feasible_income?.toFixed(2) || 0,
      },
      {
        key: data.length + 13,
        name: "Income Target",
        current: segmentData.target?.toFixed(2) || 0,
        render: (i) => {
          <div>test {i}</div>;
        },
      },
    ];
  }, [currentSegment, dashboardData]);

  const drivers = useMemo(() => {
    if (!currentSegment) {
      return [];
    }
    return dataSource.filter(
      (d) =>
        ![
          "Diversified Income",
          "Total Focus Income",
          "Total Income",
          "Income Target",
        ].includes(d.name)
    );
  }, [currentSegment, dataSource]);

  const binningValues = useMemo(() => {
    const allBining = Object.keys(binningData);
    const groupBinning = Object.keys(
      groupBy(allBining, (b) => b.split("_")[0])
    ).map((g) => {
      const binning = allBining.filter((b) => b.split("_")[0] === g);
      const binningValue = binning.reduce((acc, b) => {
        const value = binningData[b];
        return {
          ...acc,
          [b.split("_")[1]]: value,
        };
      }, {});
      const selected = [
        "binning-driver-name",
        "x-axis-driver",
        "y-axis-driver",
      ];
      return {
        id: parseInt(g),
        binning: binning,
        values: binningValue,
        selected: selected
          .map((s) => {
            return {
              name: s,
              value: binningValue?.[s],
            };
          })
          .filter((s) => s),
      };
    });
    return groupBinning;
  }, [binningData]);

  const onValuesChange = (c, values) => {
    const objectName = Object.keys(c)[0];
    const [segmentId, valueName] = objectName.split("_");
    const value = c[objectName];

    if (valueName === "x-axis-driver") {
      const dataValue = dataSource.find((d) => d.name === value);
      if (!dataValue) {
        values = {
          ...values,
          [`${segmentId}_x-axis-driver`]: undefined,
        };
      }
      values = {
        ...values,
        [`${segmentId}_x-axis-min-value`]: dataValue?.current,
        [`${segmentId}_x-axis-max-value`]: dataValue?.feasible,
      };
    }
    if (valueName === "y-axis-driver") {
      const dataValue = dataSource.find((d) => d.name === value);
      if (!dataValue) {
        values = {
          ...values,
          [`${segmentId}_y-axis-driver`]: undefined,
        };
      }
      values = {
        ...values,
        [`${segmentId}_y-axis-min-value`]: dataValue?.current,
        [`${segmentId}_y-axis-max-value`]: dataValue?.feasible,
      };
    }
    if (valueName === "binning-driver-name") {
      const dataValue = dataSource.find((d) => d.name === value);
      if (!dataValue) {
        values = {
          ...values,
          [`${segmentId}_binning-driver-name`]: undefined,
        };
      }
      values = {
        ...values,
        [`${segmentId}_binning-value-1`]: dataValue?.current,
        [`${segmentId}_binning-value-2`]: dataValue
          ? (dataValue.current + dataValue.feasible) / 2
          : dataValue,
        [`${segmentId}_binning-value-3`]: dataValue?.feasible,
      };
    }
    setBinningData(values);
    form.setFieldsValue(values);
  };

  return (
    <Row id="sensitivity-analysis">
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
            <Row
              className="income-driver-content"
              align="middle"
              justify="space-evenly"
              gutter={[8, 8]}
            >
              <Col span={24}>
                <h2>Settings for Analysis</h2>
              </Col>
              <Col span={20}>
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
              <Divider />
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
              <Divider />
              <Col span={10}>
                <Form
                  name="sensitivity-analysis"
                  layout="horizontal"
                  form={form}
                  onValuesChange={onValuesChange}
                >
                  {dashboardData.map((segment, key) => (
                    <BinningForm
                      key={key}
                      segment={segment}
                      drivers={drivers.map((x) => {
                        return {
                          value: x.name,
                          label: x.name,
                        };
                      })}
                      selected={
                        binningValues.find((b) => b.id === segment.id)?.selected
                      }
                      hidden={currentSegment !== segment.id}
                    />
                  ))}
                </Form>
              </Col>
              <Col span={10}>
                {currentSegment ? (
                  <Table
                    size="small"
                    className="income-driver-table"
                    dataSource={dataSource.filter(
                      (d) => d.name !== "Income Target"
                    )}
                    columns={columns}
                    pagination={false}
                    summary={() => (
                      <Table.Summary>
                        <Table.Summary.Row>
                          <Table.Summary.Cell index={0}>
                            Income Target
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1}>
                            {
                              dataSource.find((d) => d.name === "Income Target")
                                .current
                            }
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={2}></Table.Summary.Cell>
                        </Table.Summary.Row>
                      </Table.Summary>
                    )}
                  />
                ) : null}
              </Col>
              <Divider />
              <Col span={24}>
                {dashboardData.map((segment) =>
                  currentSegment === segment.id ? (
                    <ChartBinningHeatmap
                      key={segment.id}
                      data={binningData}
                      segment={segment}
                      origin={dataSource}
                    />
                  ) : null
                )}
              </Col>
            </Row>
          </Card.Grid>
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardSensitivityAnalysis;
