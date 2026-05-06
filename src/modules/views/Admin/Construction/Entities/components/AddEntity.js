import { useState } from "react";
import { Button, Form, Card, Row, Col, Grid } from "antd";
import CustomInput from "@/components/form/CustomInput";
import { postRequest } from "@/hooks/apiService";
import { URL_ADD_ENTITIES } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";

const AddEntity = (props) => {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const { jwt, setIsModalVisible, forceRefetch } = props;
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);

  const onFinish = async (values) => {
    try {
      setIsloadingSubmit(true);
      postRequest(URL_ADD_ENTITIES, { ...values }, jwt)
        .then(async (res) => {
          await forceRefetch();
          handleRequestResponse(res);
          setIsModalVisible(false);
        })
        .catch((err) => {
          handleRequestError(err);
        })
        .finally(() => {
          setIsloadingSubmit(false);
        });
    } catch (error) {
      setIsloadingSubmit(false);
      console.log(error);
    }
  };

  return (

    <Form
      form={form}
      name="addEntity"
      onFinish={onFinish}
      layout="vertical"
    >
      <Card type="inner" title="Add Entity" style={{ marginBottom: 24, borderRadius: 8 }}>
        <Row gutter={[16, 0]}>
          <Col span={24} md={24}>
            <CustomInput
              label="Name"
              name="name"
              placeholder="Enter name"
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                },
              ]}
            />
          </Col>

          <Col span={24} md={24}>
            <CustomInput
              label="Email"
              name="email"
              placeholder="Enter email"
              type="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            />
          </Col>

          <Col span={24} md={24}>
            <CustomInput
              label="Phone"
              name="phone"
              placeholder="Enter phone"
              rules={[
                {
                  required: true,
                  message: "Please input phone!",
                },
              ]}
            />
          </Col>

          <Col span={24} md={24}>
            <CustomInput
              label="Alternative Number"
              name="alternative_number"
              placeholder="Enter alternative number"
            />
          </Col>

          <Col span={24} md={24}>
            <div className={`d-flex ${isMobile ? "justify-content-center" : "justify-content-end"}`}>
              <Form.Item>
                <Button
                  loading={isloadingSubmit}
                  {...BUTTON_CONFIGS.SAVE_BUTTON()}
                  size={isMobile ? "middle" : "small"}
                  shape="round"
                  htmlType="submit"
                  style={{ minWidth: isMobile ? 140 : undefined }}
                >
                  {isloadingSubmit ? 'Loading...' : 'Save'}
                </Button>
              </Form.Item>
            </div>
          </Col>
        </Row>
      </Card>
    </Form>

  );
};

export default AddEntity;
