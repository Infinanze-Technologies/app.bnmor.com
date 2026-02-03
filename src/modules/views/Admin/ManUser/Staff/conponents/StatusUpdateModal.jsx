import React, { useState, useEffect } from "react";
import { Modal, Form, Select, Button, Card, Row, Col, message, Typography, Tag, Space } from "antd";
import { 
  EditOutlined, 
  UserOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { updateRequest } from "@/hooks/apiService";
import { URL_UPDATE_EMPLOYEE_STATUS } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";

const { Text } = Typography;

const StatusUpdateModal = ({ 
  isVisible, 
  onCancel, 
  record, 
  jwt, 
  refetch, 
  setpage 
}) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { handleRequestError, handleRequestResponse } = useHandleResponse();

  // Status options - matching backend enum
  const statusOptions = [
    { 
      value: 'pending', 
      label: 'Pending', 
      color: '#fff3cd',
      icon: <ClockCircleOutlined />,
      bgColor: '#fff3cd'
    },
    { 
      value: 'approved', 
      label: 'Approve', 
      color: '#e8f5e8',
      icon: <CheckCircleOutlined />,
      bgColor: '#e8f5e8'
    },
    { 
      value: 'rejected', 
      label: 'Reject', 
      color: '#f8d7da',
      icon: <CloseCircleOutlined />,
      bgColor: '#f8d7da'
    }
  ];

  const [selectedStatus, setSelectedStatus] = useState(null);

  // Reset form when modal opens
  useEffect(() => {
    if (form && record) {
      try {
        form.resetFields();
        const currentStatus = record?.account_status || 'pending';
        form.setFieldsValue({
          status: currentStatus
        });
        setSelectedStatus(currentStatus);
      } catch (error) {
        console.log('Error resetting form:', error);
      }
    }
  }, [form, record]);

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true);
      
      const updateData = {
        account_status: values.status,
      };

      await updateRequest(URL_UPDATE_EMPLOYEE_STATUS, record?.employee_id, updateData, jwt)
        .then((res) => {
          handleRequestResponse(res);
          refetch();
          onCancel();
          setpage(0);
        })
        .catch((err) => {
          handleRequestError(err);
        });
    } catch (error) {
      console.error('Error updating status:', error);
      message.error('Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={null}
      open={isVisible}
      onCancel={handleCancel}
      footer={null}
      width={700}
      maskClosable={false}
      keyboard={false}
      style={{
        top: 20
      }}
      bodyStyle={{
        padding: 0,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}
    >
      <div style={{ 
        maxWidth: 700, 
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
                background: 'linear-gradient(135deg, #4D4D4D 0%, #6B6B6B 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(77, 77, 77, 0.3)'
              }}>
                <EditOutlined style={{ color: 'white', fontSize: '14px' }} />
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                  Update Account Status
                </div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '1px' }}>
                  Modify employee account status
                </div>
              </div>
            </div>
          }
          bordered={false}
          style={{ 
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', 
            borderRadius: 12,
            border: '1px solid rgba(77, 77, 77, 0.1)'
          }}
          headStyle={{ 
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderRadius: '12px 12px 0 0',
            borderBottom: '1px solid rgba(77, 77, 77, 0.1)'
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            {/* Employee Information Display */}
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>Employee Information</span>
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
                    Employee Name
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
                    {record?.fullname || 'N/A'}
                  </div>
                </div>
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Email Address
                  </Text>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#6b7280', 
                    marginTop: '4px',
                    wordBreak: 'break-all'
                  }}>
                    {record?.email || 'N/A'}
                  </div>
                </div>
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Current Status
                  </Text>
                  <div style={{ marginTop: '4px' }}>
                    <Tag 
                      color={record?.account_status === 'pending' ? 'orange' : 
                            record?.account_status === 'approved' ? 'green' : 'red'}
                      style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px' }}
                    >
                      {record?.account_status || 'N/A'}
                    </Tag>
                  </div>
                </div>
              </div>
            </Card>

            {/* Status Update Form */}
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <EditOutlined style={{ color: '#4D4D4D', fontSize: '16px' }} />
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>Status Update</span>
                </div>
              }
              style={{ 
                marginBottom: 24, 
                borderRadius: 8,
                border: '1px solid rgba(77, 77, 77, 0.1)',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
              }}
              headStyle={{ 
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderRadius: '8px 8px 0 0',
                borderBottom: '1px solid rgba(77, 77, 77, 0.1)'
              }}
            >
              <Row gutter={16}>
                <Col xs={24} md={24}>
                  <Form.Item
                    name="status"
                    label={
                      <span style={{ 
                        fontSize: '14px', 
                        fontWeight: '500',
                        color: '#4D4D4D'
                      }}>
                        Select New Status
                      </span>
                    }
                    rules={[
                      { required: true, message: 'Please select a status' }
                    ]}
                  >
                    <Select
                      placeholder="Select status"
                      size="large"
                      style={{ width: '100%' }}
                      onChange={handleStatusChange}
                      optionLabelProp="label"
                    >
                      {statusOptions.map(option => (
                        <Select.Option 
                          key={option.value} 
                          value={option.value}
                          label={option.label}
                        >
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <div style={{ 
                              color: option.color,
                              fontSize: '16px'
                            }}>
                              {option.icon}
                            </div>
                            <span style={{ 
                              fontWeight: '500',
                              color: '#4D4D4D'
                            }}>
                              {option.label}
                            </span>
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
            

                {selectedStatus && (
                  <Col xs={24} md={24}>
                    <div style={{ 
                      padding: '20px', 
                      background: statusOptions.find(opt => opt.value === selectedStatus)?.bgColor || '#f8fafc', 
                      borderRadius: '8px',
                      border: `1px solid ${statusOptions.find(opt => opt.value === selectedStatus)?.color || '#e2e8f0'}`,
                      marginBottom: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <div style={{ 
                          color: statusOptions.find(opt => opt.value === selectedStatus)?.color,
                          fontSize: '16px'
                        }}>
                          {statusOptions.find(opt => opt.value === selectedStatus)?.icon}
                        </div>
                        <Text strong style={{ 
                          fontSize: '14px', 
                          color: statusOptions.find(opt => opt.value === selectedStatus)?.color 
                        }}>
                          Status Change Preview
                        </Text>
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#374151',
                        lineHeight: '1.6'
                      }}>
                        {selectedStatus === 'pending' && 'This employee will be marked as pending approval.'}
                        {selectedStatus === 'approved' && 'This employee will be approved and can access the system.'}
                        {selectedStatus === 'rejected' && 'This employee will be rejected and cannot access the system.'}
                      </div>
                    </div>
                  </Col>
                )}
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
              <Space>
                <Button
                  onClick={handleCancel}
                  size="large"
                  style={{
                    borderRadius: '8px',
                    height: '48px',
                    padding: '0 24px',
                    fontWeight: '500',
                    border: '1px solid #d9d9d9',
                    color: '#4D4D4D'
                  }}
                >
                  Cancel
                </Button>
                <Button
                  htmlType="submit"
                  loading={isLoading}
                  size="large"
                  shape="round"
                  style={{
                    background: 'linear-gradient(135deg, #4D4D4D 0%, #6B6B6B 100%)',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(77, 77, 77, 0.3)',
                    fontWeight: '600',
                    fontSize: '16px',
                    color: 'white',
                    height: '48px',
                    padding: '0 32px'
                  }}
                  icon={<EditOutlined />}
                >
                  Update Status
                </Button>
              </Space>
            </div>
          </Form>
        </Card>
      </div>
    </Modal>
  );
};

export default StatusUpdateModal;
