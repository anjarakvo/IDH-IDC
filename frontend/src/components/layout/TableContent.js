import React from "react";
import { Row, Col, Table, Card, Input } from "antd";
import { Link } from "react-router-dom";

const { Search } = Input;

const TableContent = ({
  dataSource = [],
  columns = [],
  loading = true,
  searchProps = {},
  buttonProps = {},
}) => {
  return (
    <Row>
      <Col span={24}>
        <Card className="search-and-add">
          <Row align="middle">
            <Col span={12}>
              <Search className="search" allowClear {...searchProps} />
            </Col>
            <Col span={12} align="right">
              <Link className="button button-secondary" to={buttonProps.linkTo}>
                {buttonProps.text}
              </Link>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={24}>
        <Table dataSource={dataSource} columns={columns} loading={loading} />
      </Col>
    </Row>
  );
};

export default TableContent;
