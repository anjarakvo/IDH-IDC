import React from "react";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { toPng } from "html-to-image";

const htmlToImageConvert = (elementRef, filename) => {
  toPng(elementRef.current, { cacheBust: false, backgroundColor: "#fff" })
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

const SaveAsImageButton = ({ elementRef, filename = "Undefined" }) => {
  return (
    <Button
      icon={<DownloadOutlined />}
      size="small"
      onClick={() => htmlToImageConvert(elementRef, filename)}
      style={{ fontSize: 12 }}
    >
      Save as Image
    </Button>
  );
};

export default SaveAsImageButton;
