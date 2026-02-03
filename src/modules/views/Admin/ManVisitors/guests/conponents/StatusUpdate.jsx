import React, { useState } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Form,
  Switch,
  Modal,
  Alert,
  Space,
  Typography
} from "antd";
import { updateRequest } from "@/hooks/apiService";
import { URL_VISITOR_GUESTS_STATUS } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import useToastMessage from "@/hooks/useToastMessage";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";
import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const StatusUpdate = (props) => {
  const { jwt, record, setIsModalVisible, refreshAllData } = props;
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const { toastError, toastSuccess } = useToastMessage();
  
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(record?.status || false);

  // Initialize form with current status
  React.useEffect(() => {
    if (record) {
      setCurrentStatus(record.status || false);
      form.setFieldsValue({
        status: record.status || false
      });
    }
  }, [record, form]);

  const handleStatusChange = (checked) => {
    setCurrentStatus(checked);
    form.setFieldsValue({
      status: checked
    });
  };

  const onFinish = (values) => {
    try {
      setIsLoading(true);
      
      const statusData = {
        status: values.status
      };

      updateRequest(URL_VISITOR_GUESTS_STATUS, record?.guest_id, statusData, jwt)
        .then((res) => {
          setIsLoading(false);
          handleRequestResponse(res);
          refreshAllData();
          setIsModalVisible(false);
        })
        .catch((err) => {
          setIsLoading(false);
          handleRequestError(err);
        });
    } catch (error) {
      setIsLoading(false);
      console.error('Error updating status:', error);
      toastError('Failed to update guest status');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ 
      maxWidth: 600, 
      margin: "0 auto", 
      padding: 24
    }}>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ExclamationCircleOutlined style={{ color: '#1890ff', fontSize: 20 }} />
            <span style={{ fontSize: 20, fontWeight: 600, color: "#2a3f54" }}>
              Update Guest Status
            </span>
          </div>
        }
        bordered={false}
        style={{ 
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)", 
          borderRadius: 12,
          border: '1px solid #f0f0f0'
        }}
      >
        {/* Guest Information Display */}
        <div style={{ 
          background: '#f8f9fa', 
          padding: 16, 
          borderRadius: 8, 
          marginBottom: 24,
          border: '1px solid #e9ecef'
        }}>
          <Title level={5} style={{ margin: '0 0 12px 0', color: '#495057' }}>
            Guest Information
          </Title>
          <Row gutter={[16, 8]}>
            <Col span={12}>
              <Text strong>Name:</Text>
              <br />
              <Text>{record?.full_name || 'N/A'}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Type:</Text>
              <br />
              <Text>{record?.type || 'N/A'}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Email:</Text>
              <br />
              <Text>{record?.email || 'N/A'}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Phone:</Text>
              <br />
              <Text>{record?.phone || 'N/A'}</Text>
            </Col>
          </Row>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          {/* Current Status Display */}
          <div style={{ 
            background: currentStatus ? '#e8f5e8' : '#f8d7da', 
            padding: 16, 
            borderRadius: 8, 
            marginBottom: 24,
            border: `1px solid ${currentStatus ? '#d4edda' : '#f5c6cb'}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              {currentStatus ? (
                <CheckOutlined style={{ color: '#28a745', fontSize: 16 }} />
              ) : (
                <CloseOutlined style={{ color: '#dc3545', fontSize: 16 }} />
              )}
              <Text strong style={{ color: currentStatus ? '#28a745' : '#dc3545' }}>
                Current Status: {currentStatus ? 'Active' : 'Inactive'}
              </Text>
            </div>
            <Text type="secondary" style={{ fontSize: 14 }}>
              {currentStatus 
                ? 'This guest is currently active and can access the system.' 
                : 'This guest is currently inactive and cannot access the system.'
              }
            </Text>
          </div>

          {/* Status Toggle */}
          <Form.Item
            label={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Text strong style={{ fontSize: 16 }}>Guest Status</Text>
                <Text type="secondary">(Toggle to change status)</Text>
              </div>
            }
            name="status"
            rules={[{ required: true, message: "Status is required" }]}
            style={{ marginBottom: 24 }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 16,
              padding: 16,
              background: '#f8f9fa',
              borderRadius: 8,
              border: '1px solid #e9ecef'
            }}>
              <Switch
                checked={currentStatus}
                onChange={handleStatusChange}
                size="large"
                style={{ 
                  transform: 'scale(1.2)',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
              />
              <div>
                <Text strong style={{ 
                  color: currentStatus ? '#28a745' : '#dc3545',
                  fontSize: 16
                }}>
                  {currentStatus ? 'Active' : 'Inactive'}
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {currentStatus 
                    ? 'Guest can access the system' 
                    : 'Guest cannot access the system'
                  }
                </Text>
              </div>
            </div>
          </Form.Item>

          {/* Warning Alert */}
          <Alert
            message="Status Change Warning"
            description={
              currentStatus 
                ? "Deactivating this guest will prevent them from accessing the system. This action can be reversed later."
                : "Activating this guest will allow them to access the system. Make sure this is the intended action."
            }
            type={currentStatus ? "warning" : "info"}
            showIcon
            style={{ marginBottom: 24 }}
          />

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: 12,
            marginTop: 24,
            paddingTop: 16,
            borderTop: '1px solid #f0f0f0'
          }}>
            <Button {...BUTTON_CONFIGS.CANCEL_BUTTON()}
              onClick={handleCancel}
              size="small"
           
            >
              Cancel
            </Button>
            <Button
              {...BUTTON_CONFIGS.SAVE_BUTTON()}
              htmlType="submit"
              loading={isLoading}
              size="small"
             
            >
              {isLoading ? 'Updating...' : 'Save'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default StatusUpdate;
