import React from "react";
import { Col, Affix, Timeline } from "antd";

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

const SideMenu = ({ active, setActive }) => {
  return (
    <Col flex="200px">
      <Affix offsetTop={220}>
        <Timeline
          items={menuList.map((item) => {
            return {
              color: active === item.name ? activeStyle.color : "gray",
              children: (
                <span
                  style={active === item.name ? activeStyle : {}}
                  onClick={() => setActive(item.name)}
                >
                  {item.name}
                </span>
              ),
            };
          })}
        />
      </Affix>
    </Col>
  );
};

export default SideMenu;
