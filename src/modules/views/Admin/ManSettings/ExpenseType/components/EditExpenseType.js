import { useEffect, useState } from "react";
import { Button, Form, Card, Row, Col } from "antd";
import CustomInput from "@/components/form/CustomInput";
import { URL_UPDATE_ATTRIBUTE } from "@/config/api-paths";
import { updateRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";

const EditExpenseType = (props) => {
  const { jwt, setIsModalVisible, record, refetch,forceRefetch } = props;
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const [form] = Form.useForm();

  useEffect(() => {
    try {
      form.setFieldsValue({
        ...record,
      });
    } catch (error) {
      console.log(error);
    }
  }, [props?.record]);

  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
  
  const onFinish = async (values) => {
    setIsloadingSubmit(true);
    updateRequest(URL_UPDATE_ATTRIBUTE, record?.attribute_id, { ...values }, jwt)
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
        name="editExpenseType"
        onFinish={onFinish}
        layout="vertical"
      >
        <Card type="inner" title="Edit Expense Type" style={{ marginBottom: 24, borderRadius: 8 }}>
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
                    loading={isloadingSubmit}
                   
                  shape="round"
                  {...BUTTON_CONFIGS.SAVE_BUTTON()}
                  size="small"
                  htmlType="submit"
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

export default EditExpenseType;
