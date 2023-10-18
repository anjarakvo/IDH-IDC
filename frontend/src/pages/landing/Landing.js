import React from "react";
import "./landing.scss";
import { Row, Col, Space } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="landing-container" id="landing">
      <Row
        data-testid="jumbotron-wrapper"
        justify="center"
        className="jumbotron-wrapper"
      >
        <Col span={24}>
          <h1 data-testid="jumbotron-title">
            Catalysing positive change <br />
            by bringing together committed <br />
            stakeholders from across global markets.
          </h1>
          <h3 data-testid="jumbotron-subtitle">
            Our mission is to put people, planet, and progress at the heart of
            markets.
          </h3>
          <Link
            data-testid="button-learn-more"
            className="button button-yellow"
          >
            Learn More
          </Link>
        </Col>
      </Row>
      <Row
        data-testid="first-section-wrapper"
        justify="center"
        className="first-section-wrapper"
      >
        <Col span={12}>
          <h2 data-testid="first-section-left-text">
            Explore farmer Living incomes as well as Better income targets.
          </h2>
        </Col>
        <Col span={12}>
          <p data-testid="first-section-right-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            erat tellus, luctus id leo id, laoreet rhoncus dui. Curabitur
            mattis, leo quis lobortis eleifend, ligula lectus pellentesque nisl,
            sit amet elementum purus felis vel tortor. Vestibulum lacinia
            sollicitudin euismod. Morbi rhoncus vel nisl tristique sodales.
          </p>
          <Link
            data-testid="button-learn-more-2"
            className="button button-secondary"
          >
            Learn More
          </Link>
        </Col>
      </Row>
      <Row
        data-testid="second-section-wrapper"
        justify="center"
        className="second-section-wrapper"
      >
        <Col span={12} className="text-wrapper">
          <h2 data-testid="second-section-title">
            The Income Driver Calculator
          </h2>
          <p data-testid="second-section-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            erat tellus, luctus id leo id, laoreet rhoncus dui. Curabitur
            mattis, leo quis lobortis eleifend, ligula lectus pellentesque nisl,
            sit amet elementum purus felis vel tortor. Vestibulum lacinia
            sollicitudin euismod. Morbi rhoncus vel nisl tristique sodales.
          </p>
          <div className="text-with-icon-wrapper">
            <Space>
              <p>
                <CheckCircleOutlined /> Qualitative data
              </p>
              <p>
                <CheckCircleOutlined /> Report generation and visualizations
              </p>
            </Space>
          </div>
          <Link
            data-testid="button-use-the-calculator"
            className="button button-use-the-calculator"
          >
            Use the Calculator
          </Link>
        </Col>
        <Col
          span={12}
          data-testid="second-section-image"
          className="image-wrapper"
        >
          <div className="image-clip-path-wrapper" />
          <div className="image-farmer-wrapper" />
        </Col>
      </Row>
      <Row
        data-testid="third-section-wrapper"
        justify="center"
        className="third-section-wrapper"
      >
        <Col span={24} align="center">
          <h2 data-testid="third-section-title">Where we work</h2>
          <p data-testid="third-section-subtitle">
            IDH Operates in differnt landscapes and sectors in over 40 countries
            worldwide.
          </p>
          <div data-testid="map" className="map-container"></div>
        </Col>
      </Row>
      <Row
        data-testid="disclaimer-section-wrapper"
        justify="center"
        className="disclaimer-section-wrapper"
      >
        <Col span={24}>
          <h2 data-testid="disclaimer-section-title">Disclaimer</h2>
          <p data-testid="disclaimer-section-description">
            The data published on this website is provided by IDH as a public
            service to promote transparency, accountability, and informed
            decision-making. However, all data is provided &quot;as is&quot;
            without any warranty, representation, or guarantee of any kind,
            including but not limited to its content, accuracy, timeliness,
            completeness, or fitness for a particular purpose.
            <br />
            <br />
            IDH does not make any implied warranties and shall not be liable for
            any errors, omissions, or inaccuracies in the data provided,
            regardless of the cause, nor for any decision made or action taken
            or not taken by anyone using or relying on such data.
            <br />
            <br />
            For our own analyses, insights and recommendations based on this
            data, please refer to our Insights Explorer.
          </p>
        </Col>
      </Row>
    </div>
  );
};

export default Landing;
