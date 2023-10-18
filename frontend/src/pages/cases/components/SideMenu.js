import React from "react";
import { Col, Affix, Timeline } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";

const activeStyle = {
  color: "#26605f",
  fontWeight: "bold",
};
const menuList = [
  {
    name: "Case Profile",
  },
  {
    name: "Income Driver Data Entry",
  },
  {
    name: "Income Driver Dashboard",
  },
];

const SideMenu = ({ active, setActive, finished }) => {
  return (
    <Col flex="200px">
      <Affix offsetTop={220}>
        <Timeline
          items={menuList.map((item) => {
            const isFinished = finished.includes(item.name);
            const result = {
              color: active === item.name ? activeStyle.color : "gray",
              children: (
                <span
                  style={active === item.name || isFinished ? activeStyle : {}}
                  onClick={() => setActive(item.name)}
                >
                  {item.name}
                </span>
              ),
            };
            if (finished.includes(item.name)) {
              result.dot = (
                <CheckCircleFilled
                  color={activeStyle.color}
                  className="finished-dot"
                />
              );
            }
            return result;
          })}
        />
      </Affix>
    </Col>
  );
};

export default SideMenu;
