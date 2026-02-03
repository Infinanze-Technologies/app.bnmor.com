import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Form,
  message,
  Typography,
  Space,
  Tag
} from "antd";
import {
  CloseCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  KeyOutlined,
  ClockCircleOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { postRequest } from "@/hooks/apiService";
import { URL_UPDATE_VISITOR_ENTRIES_CHECK_OUT } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import useToastMessage from "@/hooks/useToastMessage";
import CustomInput from "@/components/form/CustomInput";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";

const { Text } = Typography;

const EntryCheckOut = (props) => {
  let { jwt, record, setIsModalVisible, refetch, setpage, forceRefetch } = props;

  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
  const { toastError, toastSuccess } = useToastMessage();

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
      if (!values?.guest_phone) {
        return toastError("Guest phone number is required");
      }

      if (!values?.entry_code) {
        return toastError("Entry code is required");
      }

      let checkOutData = {
        "guest_phone": values?.guest_phone,
        "entry_code": values?.entry_code,
        "check_out_time": new Date().toISOString()
      }

      setIsloadingSubmit(true);
      postRequest(URL_UPDATE_VISITOR_ENTRIES_CHECK_OUT, checkOutData, jwt)
        .then(async (res) => {
          setIsloadingSubmit(false);
          handleRequestResponse(res);
          form.resetFields();
          setpage(0);
          await forceRefetch();
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
      maxWidth: 600, 
      margin: "0 auto", 
      padding: 24,
      maxHeight: '80vh',
      overflowY: 'auto',
      overflowX: 'hidden',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: 'auto'
    }}>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
            }}>
              <CloseCircleOutlined style={{ color: 'white', fontSize: '14px' }} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                Check Out
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '1px' }}>
                Process visitor check-out
              </div>
            </div>
          </div>
        }
        bordered={false}
        style={{ 
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', 
          borderRadius: 12,
          border: '1px solid rgba(239, 68, 68, 0.1)'
        }}
        headStyle={{ 
          background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
          borderRadius: '12px 12px 0 0',
          borderBottom: '1px solid rgba(239, 68, 68, 0.1)'
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          {/* Entry Information Display */}
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Entry Information</span>
              </div>
            }
            style={{ 
              marginBottom: 24, 
              borderRadius: 8,
              border: '1px solid rgba(24, 144, 255, 0.1)',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
            }}
            headStyle={{ 
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              borderRadius: '8px 8px 0 0',
              borderBottom: '1px solid rgba(24, 144, 255, 0.1)'
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Guest Name
                </Text>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#1f2937', 
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <UserOutlined style={{ color: '#6b7280' }} />
                  {record?.guest?.full_name || 'N/A'}
                </div>
              </div>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Entry Type
                </Text>
                <div style={{ marginTop: '4px' }}>
                  <Tag 
                    color={record?.entry_type === 'Appointment' ? 'blue' : 'green'}
                    style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px' }}
                  >
                    {record?.entry_type || 'N/A'}
                  </Tag>
                </div>
              </div>
            </div>
          </Card>

          {/* Check Out Credentials */}
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <KeyOutlined style={{ color: '#8b5cf6', fontSize: '16px' }} />
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Check Out Credentials</span>
              </div>
            }
            style={{ 
              marginBottom: 24, 
              borderRadius: 8,
              border: '1px solid rgba(139, 92, 246, 0.1)',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
            }}
            headStyle={{ 
              background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
              borderRadius: '8px 8px 0 0',
              borderBottom: '1px solid rgba(139, 92, 246, 0.1)'
            }}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <CustomInput
                  label="Guest Phone Number"
                  name="guest_phone"
                  rules={[
                    { required: true, message: "Guest phone number is required" },
                    { pattern: /^[0-9+\-\s()]+$/, message: "Please enter a valid phone number" }
                  ]}
                  placeholder="Enter guest phone number"
                  prefix={<PhoneOutlined style={{ color: '#6b7280' }} />}
                />
              </Col>
              <Col xs={24} md={12}>
                <CustomInput
                  label="Entry Code"
                  name="entry_code"
                  rules={[
                    { required: true, message: "Entry code is required" },
                    { min: 4, message: "Entry code must be at least 4 characters" }
                  ]}
                  placeholder="Enter entry code"
                  prefix={<KeyOutlined style={{ color: '#6b7280' }} />}
                />
              </Col>
              <Col xs={24} md={24}>
                <div style={{ 
                  marginTop: '20px',
                  padding: '20px', 
                  background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)', 
                  borderRadius: '8px',
                  border: '1px solid #fecaca'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <ClockCircleOutlined style={{ color: '#ef4444', fontSize: '16px' }} />
                    <Text strong style={{ fontSize: '14px', color: '#dc2626' }}>Check Out Time</Text>
                  </div>
                  <div style={{
                    fontSize: '16px',
                    color: '#b91c1c',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <CalendarOutlined style={{ color: '#ef4444' }} />
                    {new Date().toLocaleString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true
                    })}
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Submit Button */}
          <div style={{ 
            textAlign: 'right', 
            marginTop: 24,
            padding: '20px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <Button
              // {...BUTTON_CONFIGS.SAVE_BUTTON()}
              htmlType="submit"
              loading={isloadingSubmit}
              size="large"
              shape="round"
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                fontWeight: '600',
                fontSize: '16px',
                color: 'white',
                height: '48px',
                padding: '0 32px'
              }}
              icon={<CloseCircleOutlined />}
            >
              Check Out Visitor
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default EntryCheckOut;
