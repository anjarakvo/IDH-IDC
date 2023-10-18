import React from "react";
import { Row, Col, Table, Card, Input } from "antd";
import { Link } from "react-router-dom";

const { Search } = Input;

const TableContent = ({
  title = "Data",
  filterComponent = null,
  dataSource = [],
  columns = [],
  loading = true,
  searchProps = {},
  buttonProps = {},
  paginationProps = {},
}) => {
  return (
    <Row data-testid="table-content">
      <Col span={24}>
        <Card className="search-and-add">
          <Row align="middle">
            <Col span={12}>
              <Search className="search" allowClear {...searchProps} />
            </Col>
            <Col span={12} align="right">
              <Link className="button button-secondary" to={buttonProps.to}>
                {buttonProps.text}
              </Link>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={24}>
        <Row align="middle" style={{ background: "#fff", padding: "6px 24px" }}>
          <Col span={4}>
            <h4>{title}</h4>
          </Col>
          <Col span={20} align="end">
            {filterComponent ? (
              <div style={{ float: "right" }}>{filterComponent}</div>
            ) : (
              ""
            )}
          </Col>
        </Row>
        <Table
          rowKey="id"
          dataSource={dataSource}
          columns={columns}
          loading={loading}
          pagination={paginationProps}
        />
      </Col>
    </Row>
  );
};

export default TableContent;
