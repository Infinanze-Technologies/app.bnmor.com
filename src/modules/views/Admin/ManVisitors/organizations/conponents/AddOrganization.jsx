import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Form
} from "antd";
import { postRequest } from "@/hooks/apiService";
import { URL_ADD_VISITOR_ORGANIZATIONS } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import useToastMessage from "@/hooks/useToastMessage";
import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";

const AddOrganization = (props) => {

  let { jwt, setIsModalVisible, refetch, setpage } = props;

  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
  const { toastError } = useToastMessage();

  // Reset form when modal opens
  useEffect(() => {
    if (form) {
      try {
        form.resetFields();
      } catch (error) {
        console.log('Error resetting form:', error);
      }
    }
  }, [form]);

  const onFinish = (values) => {
    try {
      // Validate required fields for organization
      if (!values?.name) {
        return toastError("Organization name is required");
      }
      if (!values?.phone) {
        return toastError("Phone number is required");
      }
      if (!values?.email) {
        return toastError("Email is required");
      }
      if (!values?.address) {
        return toastError("Address is required");
      }

      let organizationData = {
        "name": values?.name,
        "phone": values?.phone,
        "email": values?.email,
        "address": values?.address
      }

      setIsloadingSubmit(true);
      postRequest(URL_ADD_VISITOR_ORGANIZATIONS, organizationData, jwt)
        .then((res) => {
          setIsloadingSubmit(false);
          handleRequestResponse(res)
          form.resetFields()
          setpage(0);
          refreshOrganizations();
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
    <div style={{ 
      maxWidth: 900, 
      margin: "0 auto", 
      padding: 24,
      maxHeight: '80vh',
      overflowY: 'auto',
      overflowX: 'hidden'
    }}>
      <Card
        title={<span style={{ fontSize: 24, fontWeight: 700, color: "#2a3f54" }}>Create New Organization</span>}
        bordered={false}
        style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)", borderRadius: 12 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          {/* Organization Information */}
          <Card type="inner" title="Organization Information" style={{ marginBottom: 24, borderRadius: 8 }}>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <CustomInput
                  label="Organization Name"
                  name="name"
                  rules={[{ required: true, message: "Organization name is required" }]}
                  placeholder="Enter organization name"
                />
              </Col>
              <Col xs={24} md={12}>
                <CustomInput
                  label="Email"
                  name="email"
                  type="email"
                  rules={[
                    { required: true, message: "Email is required" },
                    { type: "email", message: "Enter a valid email" }
                  ]}
                  placeholder="Enter email address"
                />
              </Col>
              <Col xs={24} md={12}>
                <CustomInput
                  label="Phone Number"
                  name="phone"
                  rules={[{ required: true, message: "Phone number is required" }]}
                  placeholder="Enter phone number"
                />
              </Col>
              <Col xs={24} md={12}>
                <CustomInput
                  label="Address"
                  name="address"
                  rules={[{ required: true, message: "Address is required" }]}
                  placeholder="Enter organization address"
                />
              </Col>
            </Row>
          </Card>

          {/* Submit Button */}
          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Button
              {...BUTTON_CONFIGS.SAVE_BUTTON()}
              htmlType="submit"
              loading={isloadingSubmit}
              size="small"
              shape="round"
            >
             Save
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AddOrganization;