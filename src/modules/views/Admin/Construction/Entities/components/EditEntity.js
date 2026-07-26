import { useEffect, useState } from "react";
import { Button, Form, Card, Row, Col, Grid, Input } from "antd";
import CustomInput from "@/components/form/CustomInput";
import { URL_UPDATE_ENTITIES } from "@/config/api-paths";
import { updateRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";

const EditEntity = (props) => {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const { jwt, setIsModalVisible, record, forceRefetch } = props;
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const [form] = Form.useForm();

  useEffect(() => {
    try {
      form.setFieldsValue({
        name: record?.name,
        email: record?.email,
        phone: record?.phone,
        alternative_number: record?.alternative_number,
      });
    } catch (error) {
      console.log(error);
    }
  }, [props?.record]);

  const [isloadingSubmit, setIsloadingSubmit] = useState(false);

  const onFinish = async (values) => {
    setIsloadingSubmit(true);
    updateRequest(URL_UPDATE_ENTITIES, record?.id, { ...values }, jwt)
      .then(async (res) => {
        setIsloadingSubmit(false);
        handleRequestResponse(res);
        await forceRefetch();
        setIsModalVisible(false);
      })
      .catch((err) => {
        handleRequestError(err);
        setIsloadingSubmit(false);
      });
  };

  return (
    <Form
      form={form}
      name="editEntity"
      onFinish={onFinish}
      layout="vertical"
    >
      <Card type="inner" title="Edit Entity" style={{ marginBottom: 24, borderRadius: 8 }}>
        <Row gutter={[16, 0]}>
          <Col span={24} md={24}>
            <Form.Item
              label="Entity ID"
              extra="Share this code with the entity so they can post properties."
            >
              <Input
                disabled
                value={record?.entity_code || '—'}
                style={{ width: '100%', height: 50, borderRadius: 10 }}
              />
            </Form.Item>
          </Col>

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

export default EditEntity;
