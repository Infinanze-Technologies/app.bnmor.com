import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Form,
  Modal
} from "antd";
import { postRequest } from "@/hooks/apiService";
import { URL_ADD_VISITOR_GUESTS, URL_GET_ACTIVE_ORGANIZATIONS } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import useToastMessage from "@/hooks/useToastMessage";
import useSelectQuery from "@/hooks/ReactQuery/useSelectQuery";
import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";
import AddOrganization from "./AddOrganization";


const AddGuest = (props) => {

  let { jwt, setIsModalVisible, refetch, setpage, ActiveOrganizationsDataObject,refreshOrganizations,refreshAllData  } = props;

  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
  const [guestType, setGuestType] = useState('Individual');
  const [isOrganizationModalVisible, setIsOrganizationModalVisible] = useState(false);
  const { toastError } = useToastMessage();



  const handleTypeChange = (value) => {
    setGuestType(value);
    form.setFieldsValue({
      type: value
    });
  };

  const handleAddOrganization = () => {
    setIsOrganizationModalVisible(true);
  };

  const handleOrganizationModalClose = () => {
    setIsOrganizationModalVisible(false);
  };

  const handleOrganizationAdded = () => {
    // Refetch organizations when a new one is added
    if (refreshOrganizations) {
      refreshOrganizations();
    }
    setIsOrganizationModalVisible(false);
  };

  // Reset form when modal opens
  useEffect(() => {
    if (form) {
      try {
        form.resetFields();
        form.setFieldsValue({
          type: 'Individual'
        });
        setGuestType('Individual');
      } catch (error) {
        console.log('Error resetting form:', error);
      }
    }
  }, [form]);

  const onFinish = (values) => {
    try {
      if (!values?.type) {
        return toastError("Guest type is required");
      }

      // Validate required fields based on type
      if (values?.type === 'Individual') {
        if (!values?.full_name) {
          return toastError("Full name is required for Individual guests");
        }
        if (!values?.phone) {
          return toastError("Phone number is required for Individual guests");
        }
        if (!values?.email) {
          return toastError("Email is required for Individual guests");
        }
        if (!values?.gender) {
          return toastError("Gender is required for Individual guests");
        }
      } else if (values?.type === 'Organization') {
        if (!values?.full_name) {
          return toastError("Full name is required for Organization guests");
        }
        if (!values?.phone) {
          return toastError("Phone number is required for Organization guests");
        }
        if (!values?.email) {
          return toastError("Email is required for Organization guests");
        }
        if (!values?.org_id) {
          return toastError("Organization is required for Organization guests");
        }
        if (!values?.gender) {
          return toastError("Gender is required for Organization guests");
        }
      }

      let guestData = {
        "type": values?.type,
        "full_name": values?.full_name,
        "phone": values?.phone,
        "email": values?.email,
        "org_id": values?.type === 'Organization' ? values?.org_id : null,
        "gender": values?.gender
      }

      setIsloadingSubmit(true);
      postRequest(URL_ADD_VISITOR_GUESTS, guestData, jwt)
        .then((res) => {
          setIsloadingSubmit(false);
          handleRequestResponse(res)
          form.resetFields()
          setGuestType('Individual')
          setpage(0);
          refreshAllData();
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

  // Prepare options for custom selects
  const typeOptions = [
    { value: 'Individual', label: 'Individual' },
    { value: 'Organization', label: 'Organization' }
  ];

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' }
  ];

  // Prepare organization options from API data
  const organizationOptions = [
    ...(ActiveOrganizationsDataObject?.data?.map(org => ({
      value: org.org_id,
      label: org.name
    })) || []),
    {
      value: 'ADD_NEW',
      label: '+ Add New Organization',
      disabled: false
    }
  ];

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
        title={<span style={{ fontSize: 24, fontWeight: 700, color: "#2a3f54" }}>Create New Guest</span>}
        bordered={false}
        style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)", borderRadius: 12 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          {/* Guest Type Selection */}
          <Card type="inner" title="Guest Information" style={{ marginBottom: 24, borderRadius: 8 }}>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <CustomSelect
                  label="Guest Type"
                  name="type"
                  options={typeOptions}
                  rules={[{ required: true, message: "Guest type is required" }]}
                  placeholder="Select guest type"
                  selectProps={{
                    onChange: handleTypeChange
                  }}
                />
              </Col>

                <Col xs={24} md={12}>
                  <CustomInput
                    label="Full Name"
                    name="full_name"
                    rules={[{ required: true, message: "Full name is required" }]}
                    placeholder="Enter full name"
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
                <Col xs={24}
                md={guestType === 'Organization' ? 12 : 24}
                >
                  <CustomSelect
                    label="Gender"
                    name="gender"
                    options={genderOptions}
                    rules={[{ required: true, message: "Gender is required" }]}
                    placeholder="Select gender"
                  />
                </Col>


                {guestType === 'Organization' && (
           
                <Col xs={24} md={12}>
                  <CustomSelect
                    label="Organization"
                    name="org_id"
                    options={organizationOptions}
                    rules={[{ required: true, message: "Organization is required" }]}
                    placeholder="Select organization"
                    loading={ActiveOrganizationsDataObject?.isLoading}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    selectProps={{
                      onChange: (value) => {
                        if (value === 'ADD_NEW') {
                          handleAddOrganization();
                          // Reset the field value
                          form.setFieldsValue({ org_id: undefined });
                        }
                      }
                    }}
                  />
                </Col>
           
          )}

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

      {/* Add Organization Modal */}
      <Modal
        title="Add New Organization"
        open={isOrganizationModalVisible}
        onCancel={handleOrganizationModalClose}
        footer={null}
        width={900}
        maskClosable={false}
        keyboard={false}
        bodyStyle={{
          maxHeight: '80vh',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        <AddOrganization
          jwt={jwt}
          setIsModalVisible={setIsOrganizationModalVisible}
          refreshOrganizations={refreshOrganizations}
          onSuccess={handleOrganizationAdded}
          setpage={setpage}
        />
      </Modal>
    </div>
  );
};

export default AddGuest;