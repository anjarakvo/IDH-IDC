import React from "react";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { toPng } from "html-to-image";

const htmlToImageConvert = (elementRef, filename) => {
  if (!elementRef) {
    console.error("Please provide you element ref using react useRef");
    return;
  }
  toPng(elementRef.current, {
    cacheBust: false,
    backgroundColor: "#fff",
    style: { padding: "24px" },
  })
    .then((dataUrl) => {
      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
    })
    .catch((err) => {
      console.error("Error while downloading content", err);
    });
};

const SaveAsImageButton = ({
  elementRef,
  filename = "Undefined",
  style = {},
}) => {
  return (
    <Button
      icon={<DownloadOutlined />}
      size="small"
      onClick={() => htmlToImageConvert(elementRef, filename)}
      style={{ fontSize: 12, ...style }}
    >
      Save as Image
    </Button>
  );
};

export default SaveAsImageButton;
