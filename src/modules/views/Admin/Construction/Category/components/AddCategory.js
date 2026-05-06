import { useEffect, useState } from "react";
import { Button, Form, Card, Row, Col, Select, Grid } from "antd";
import CustomInput from "@/components/form/CustomInput";
import { postRequest } from "@/hooks/apiService";
import { URL_ADD_BRANCH } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import CustomSelect from "@/components/form/CustomSelect";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";

const { Option } = Select;

  const AddCategory = (props) => {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const { jwt, setIsModalVisible, refetch,forceRefetch } = props;
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);

  const onFinish = async (values) => {
    try {
      setIsloadingSubmit(true);
      postRequest(URL_ADD_BRANCH, { ...values }, jwt)
        .then(async (res) => {
          setIsloadingSubmit(false);
          await forceRefetch()
          handleRequestResponse(res)
          setIsModalVisible(false);
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
 
    <Form
        form={form}
        name="addBranch"
        onFinish={onFinish}
        layout="vertical"
      >
        <Card type="inner" title="Add Announcement" style={{ marginBottom: 24, borderRadius: 8 }}>
      <Row gutter={[16, 0]}>
      <Col span={12} xs={24} md={24}>
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
              label="Address"
              name="address"
              placeholder="Enter address"
              rules={[
                {
                  required: true,
                  message: "Please input your address!",
                },
              ]}
            />
          </Col>

          <Col span={24} md={24}>
            <CustomSelect
              label="Status"
              name="status"
              options={[{ value: true, label: 'Active' }, { value: false, label: 'Inactive' }]}
              placeholder="Select status"
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

export default AddCategory;
