import { useEffect, useState } from "react";
import { Button, Select, Form, Card, Row, Col, Grid } from "antd";
import CustomInput from "@/components/form/CustomInput";
import { URL_UPDATE_BRANCH } from "@/config/api-paths";
import { updateRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
import CustomSelect from "@/components/form/CustomSelect";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";

const { Option } = Select;

const EditCategory = (props) => {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const { jwt, setIsModalVisible, record, refetch,forceRefetch } = props;
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const [form] = Form.useForm();
  const [attr_type, setAttrType] = useState(record?.attribute_type);

  useEffect(() => {
    try {
      form.setFieldsValue({
        ...record,
        status: record?.status === true ? 'Active' : 'Inactive',
      });
    } catch (error) {
      console.log(error);
    }
  }, [props?.record]);

  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
  
  const onFinish = async (values) => {
    setIsloadingSubmit(true);
    updateRequest(URL_UPDATE_BRANCH, record?.branch_id, { ...values }, jwt)
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
        name="editBranch"
        onFinish={onFinish}
        layout="vertical"
      >
        <Card type="inner" title="Edit Branch" style={{ marginBottom: 24, borderRadius: 8 }}>
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

export default EditCategory;
