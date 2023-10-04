import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Result } from "antd";
import { ContentLayout } from "../../components/layout";

const NotFound = () => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate("/");
  };

  return (
    <ContentLayout>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button
            data-testid="btn-back-home"
            type="primary"
            onClick={handleOnClick}
          >
            Back Home
          </Button>
        }
        style={{ marginTop: "125px" }}
      />
    </ContentLayout>
  );
};

export default NotFound;
