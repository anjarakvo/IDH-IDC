import React from "react";
import { Button } from "antd";

const defaultStyle = {
  fontSize: "12px",
  borderRadius: "20px",
  padding: "0 10px",
};

const buttonTypeStyle = {
  "ghost-white": {
    backgroundColor: "transparent",
    color: "#fff",
    fontWeight: 600,
  },
};

const ShowLabelButton = ({
  showLabel = false,
  setShowLabel,
  type,
  style = {},
}) => {
  const typeStyle = buttonTypeStyle?.[type] || {};

  return (
    <Button
      id="show-label-btn"
      className="show-label-btn"
      size="small"
      onClick={() => setShowLabel(!showLabel)}
      style={{ ...defaultStyle, ...typeStyle, ...style }}
    >
      {showLabel ? "Hide" : "Show"} Label
    </Button>
  );
};

export default ShowLabelButton;
