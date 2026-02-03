import { useEffect, useState } from "react";
import { Button, Form, Card, Row, Col } from "antd";
import CustomInput from "@/components/form/CustomInput";
import { postRequest } from "@/hooks/apiService";
import { URL_ADD_ATTRIBUTE } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";

const AddAllowanceOption = (props) => {
  const { jwt, setIsModalVisible, refetch,forceRefetch } = props;
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);

  const onFinish = async (values) => {
    try {
      values['attribute_type'] = "Allowance Option"
      setIsloadingSubmit(true);
      postRequest(URL_ADD_ATTRIBUTE, { ...values }, jwt)
        .then(async (res) => {
          setIsloadingSubmit(false);
          handleRequestResponse(res)
          setIsModalVisible(false);
          await forceRefetch()
        }).finally(() => {
   
          setIsloadingSubmit(false);
        })
        .catch((err) => {
          handleRequestError(err);
        });
    } catch (error) {
      setIsloadingSubmit(false);
      console.log(error)
    }
  };

  return (
   
      <Form onFinish={onFinish} form={form} name="addAllowanceOption" layout="vertical">
        <Card type="inner" title="Add Allowance Option" style={{ marginBottom: 24, borderRadius: 8 }}> 
      <Row gutter={16}>
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
            <div className="d-flex justify-content-end">
              <Form.Item>
                <Button
                  {...BUTTON_CONFIGS.SAVE_BUTTON()}
                  loading={isloadingSubmit}
                  htmlType="submit"
                  size="small"
                  shape="round"
                >
                  {isloadingSubmit ? 'Loading...' : 'Save'}   
                  Save
                </Button>
              </Form.Item>
            </div>
          </Col>
        </Row>
        </Card>
      </Form>
    
  );
};

export default AddAllowanceOption;
