import React, { useState } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Form,
  Select,
  Modal,
  Alert,
  Space,
  Typography,
  Tag,
  DatePicker
} from "antd";
import { updateRequest } from "@/hooks/apiService";
import { URL_VISITOR_APPOINTMENTS_STATUS } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import useToastMessage from "@/hooks/useToastMessage";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";
import { 
  CalendarOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import CustomDatePicker from "@/components/form/CustomDatePicker";

const { Text, Title } = Typography;
const { Option } = Select;

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const StatusUpdate = (props) => {
  const { jwt, record, setIsModalVisible, refreshAllData } = props;
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const { toastError, toastSuccess } = useToastMessage();
  
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(record?.status || 'Scheduled');
  const [showRescheduleDate, setShowRescheduleDate] = useState(false);

  // Status options with descriptions
  const statusOptions = [
    { 
      value: 'Scheduled', 
      label: 'Scheduled', 
      color: 'blue',
      icon: <CalendarOutlined />,
      description: 'Appointment is scheduled and confirmed'
    },
    { 
      value: 'Rescheduled', 
      label: 'Rescheduled', 
      color: 'orange',
      icon: <ClockCircleOutlined />,
      description: 'Appointment has been rescheduled to a new time'
    },
    { 
      value: 'Cancelled', 
      label: 'Cancelled', 
      color: 'red',
      icon: <CloseCircleOutlined />,
      description: 'Appointment has been cancelled'
    },
    { 
      value: 'Completed', 
      label: 'Completed', 
      color: 'green',
      icon: <CheckCircleOutlined />,
      description: 'Appointment has been completed successfully'
    },
    { 
      value: 'Missed', 
      label: 'Missed', 
      color: 'red',
      icon: <ExclamationCircleOutlined />,
      description: 'Appointment was missed by the guest'
    }
  ];

  // Initialize form with current status
  React.useEffect(() => {
    if (record) {
      setCurrentStatus(record.status || 'Scheduled');
      form.setFieldsValue({
        status: record.status || 'Scheduled',
        scheduled_for: record.scheduled_for ? dayjs(record.scheduled_for) : null
      });
    }
  }, [record, form]);

  const handleStatusChange = (value) => {
    setCurrentStatus(value);
    setShowRescheduleDate(value === 'Rescheduled');
    form.setFieldsValue({
      status: value
    });
  };

  const onFinish = (values) => {
    try {
      setIsLoading(true);
      
      const statusData = {
        status: values.status,
        ...(values.status === 'Rescheduled' && values.scheduled_for && {
          scheduled_for: values.scheduled_for.format('YYYY-MM-DD HH:mm:ss')
        })
      };

      updateRequest(URL_VISITOR_APPOINTMENTS_STATUS, record?.appointment_id, statusData, jwt)
        .then((res) => {
          setIsLoading(false);
          handleRequestResponse(res);
          // toastSuccess(`Appointment status updated to ${values.status}`);
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
      toastError('Failed to update appointment status');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getCurrentStatusInfo = () => {
    return statusOptions.find(option => option.value === currentStatus) || statusOptions[0];
  };

  const getStatusColor = (status) => {
    const statusInfo = statusOptions.find(option => option.value === status);
    return statusInfo ? statusInfo.color : 'default';
  };

  return (
    <div style={{ 
      maxWidth: 700, 
      margin: "0 auto", 
      padding: 24
    }}>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <CalendarOutlined style={{ color: '#1890ff', fontSize: 20 }} />
            <span style={{ fontSize: 20, fontWeight: 600, color: "#2a3f54" }}>
              Update Appointment Status
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
        {/* Appointment Information Display */}
        <div style={{ 
          background: '#f8f9fa', 
          padding: 16, 
          borderRadius: 8, 
          marginBottom: 24,
          border: '1px solid #e9ecef'
        }}>
          <Title level={5} style={{ margin: '0 0 12px 0', color: '#495057' }}>
            Appointment Information
          </Title>
          <Row gutter={[16, 8]}>
            <Col span={12}>
              <Text strong>Guest:</Text>
              <br />
              <Text>
                {record?.guest?.type === 'Individual' 
                  ? record?.guest?.full_name 
                  : record?.guest?.org_name || 'N/A'
                }
              </Text>
            </Col>
            <Col span={12}>
              <Text strong>Host:</Text>
              <br />
              <Text>{record?.host?.fullname || 'N/A'}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Department:</Text>
              <br />
              <Text>{record?.department?.name || 'N/A'}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Scheduled For:</Text>
              <br />
              <Text>{record?.scheduled_for ? new Date(record.scheduled_for).toLocaleString() : 'N/A'}</Text>
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
            background: getCurrentStatusInfo().color === 'green' ? '#e8f5e8' : 
                       getCurrentStatusInfo().color === 'red' ? '#f8d7da' :
                       getCurrentStatusInfo().color === 'orange' ? '#fff3cd' : '#e3f2fd', 
            padding: 16, 
            borderRadius: 8, 
            marginBottom: 24,
            border: `1px solid ${
              getCurrentStatusInfo().color === 'green' ? '#d4edda' : 
              getCurrentStatusInfo().color === 'red' ? '#f5c6cb' :
              getCurrentStatusInfo().color === 'orange' ? '#ffeaa7' : '#bbdefb'
            }`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              {getCurrentStatusInfo().icon}
              <Text strong style={{ 
                color: getCurrentStatusInfo().color === 'green' ? '#28a745' : 
                       getCurrentStatusInfo().color === 'red' ? '#dc3545' :
                       getCurrentStatusInfo().color === 'orange' ? '#fd7e14' : '#1890ff'
              }}>
                Current Status: {getCurrentStatusInfo().label}
              </Text>
            </div>
            <Text type="secondary" style={{ fontSize: 14 }}>
              {getCurrentStatusInfo().description}
            </Text>
          </div>

          {/* Status Selection */}
          <Form.Item
            label={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Text strong style={{ fontSize: 16 }}>Appointment Status</Text>
                <Text type="secondary">(Select new status)</Text>
              </div>
            }
            name="status"
            rules={[{ required: true, message: "Status is required" }]}
            style={{ marginBottom: 24 }}
          >
            <Select
              placeholder="Select appointment status"
              onChange={handleStatusChange}
              value={currentStatus}
              size="large"
              style={{ width: '100%' }}
            >
              {statusOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {option.icon}
                    <span>{option.label}</span>
                    <Tag color={option.color} style={{ marginLeft: 'auto' }}>
                      {option.label}
                    </Tag>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Reschedule Date Picker - Only show when Rescheduled is selected */}
          {showRescheduleDate && (
            <CustomDatePicker
              label={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CalendarOutlined style={{ color: '#1890ff' }} />
                  <Text strong style={{ fontSize: 16 }}>New Scheduled Date & Time</Text>
                  <Text type="secondary">(Required for rescheduling)</Text>
                </div>
              }
              name="scheduled_for"
              rules={[
                { required: true, message: "New scheduled date is required for rescheduling" },
                {
                  validator: (_, value) => {
                    if (value && value.isBefore(dayjs(), 'day')) {
                      return Promise.reject(new Error('Cannot schedule for a past date'));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
              placeholder="Select new date and time"
              style={{ marginBottom: 24, width: '100%' }}
              datePickerProps={{
                showTime: true,
                format: "YYYY-MM-DD HH:mm",
                size: "large",
                disabledDate: (current) => current && current < dayjs().startOf('day'),
                showNow: false
              }}
            />
          )}

          {/* Status Preview */}
          <div style={{ 
            background: '#f8f9fa',
            padding: 16,
            borderRadius: 8,
            marginBottom: 24,
            border: '1px solid #e9ecef'
          }}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              New Status Preview:
            </Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              {getCurrentStatusInfo().icon}
              <Tag 
                color={getCurrentStatusInfo().color}
                style={{ 
                  fontSize: 14,
                  padding: '4px 12px',
                  borderRadius: 6
                }}
              >
                {getCurrentStatusInfo().label}
              </Tag>
            </div>
            {showRescheduleDate && form.getFieldValue('scheduled_for') && (
              <div style={{ 
                background: '#e3f2fd', 
                padding: 8, 
                borderRadius: 4, 
                marginTop: 8,
                border: '1px solid #bbdefb'
              }}>
                <Text strong style={{ color: '#1890ff', fontSize: 12 }}>
                  New Scheduled Time: {form.getFieldValue('scheduled_for').format('YYYY-MM-DD HH:mm')}
                </Text>
              </div>
            )}
            <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
              {getCurrentStatusInfo().description}
            </Text>
          </div>

          {/* Warning Alert */}
          <Alert
            message="Status Change Warning"
            description={
              currentStatus === 'Completed' 
                ? "Marking this appointment as completed will finalize the visit. This action cannot be easily undone."
                : currentStatus === 'Cancelled'
                ? "Cancelling this appointment will prevent the guest from visiting. This action can be reversed later."
                : currentStatus === 'Missed'
                ? "Marking this appointment as missed indicates the guest did not show up. This may affect future scheduling."
                : currentStatus === 'Rescheduled'
                ? "Rescheduling this appointment will update the scheduled time. Please ensure the new date and time are correct."
                : "Changing the appointment status will update the guest's visit record. Please ensure this is the correct status."
            }
            type={currentStatus === 'Completed' ? "success" : 
                  currentStatus === 'Cancelled' || currentStatus === 'Missed' ? "warning" : 
                  currentStatus === 'Rescheduled' ? "info" : "info"}
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
            <Button 
              {...BUTTON_CONFIGS.CANCEL_BUTTON()}
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
