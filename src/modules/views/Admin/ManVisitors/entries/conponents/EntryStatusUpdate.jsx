import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Form,
  Select,
  DatePicker,
  TimePicker,
  message,
  Typography,
  Space,
  Tag
} from "antd";
import {
  EditOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PauseCircleOutlined
} from '@ant-design/icons';
import { updateRequest } from "@/hooks/apiService";
import {URL_VISITOR_ENTRIES_STATUS } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import useToastMessage from "@/hooks/useToastMessage";
import CustomSelect from "@/components/form/CustomSelect";
import CustomDatePicker from "@/components/form/CustomDatePicker";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";
import dayjs from 'dayjs';

const { Text } = Typography;

const dateFormat = 'YYYY-MM-DD HH:mm';
const { Option } = Select;

const EntryStatusUpdate = (props) => {
  let { jwt, record, setIsModalVisible, refetch, setpage, forceRefetch } = props;

  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const { toastError, toastSuccess } = useToastMessage();

  // Status options
  const statusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Available', label: 'Available' },
    { value: 'Unavailable', label: 'Unavailable' },
    { value: 'Waiting', label: 'Occupied' }
  ];


  // Reset form when modal opens
  useEffect(() => {
    if (form && record) {
      try {
        form.resetFields();
        // Pre-populate form with current entry data
        const currentStatus = record?.status || 'Pending';
        form.setFieldsValue({
          status: currentStatus,
          estimated_check_in: record?.estimated_check_in ? dayjs(record.estimated_check_in) : null
        });
        setSelectedStatus(currentStatus);
      } catch (error) {
        console.log('Error resetting form:', error);
      }
    }
  }, [form, record]);

  const onFinish = (values) => {
    try {
      if (!values?.status) {
        return toastError("Status is required");
      }

      let updateData = {
        "status": values?.status,
        "estimated_check_in": values?.estimated_check_in ? values.estimated_check_in.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : null
      }

      setIsloadingSubmit(true);
      updateRequest(URL_VISITOR_ENTRIES_STATUS, record?.entry_id, updateData, jwt)
        .then(async (res) => {
          setIsloadingSubmit(false);
          handleRequestResponse(res);
          form.resetFields();
          setpage(0);
          await forceRefetch();
          setIsModalVisible(false);
        //   toastSuccess("Entry status updated successfully");
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

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    // Auto-set estimated check-in time for waiting status
    if (status === 'Waiting') {
      // For waiting status, set estimated check-in time to 15 minutes from now
      const estimatedTime = dayjs().add(15, 'minutes');
      form.setFieldsValue({
        estimated_check_in: estimatedTime
      });
    } else {
      // For other statuses, clear estimated check-in time
      form.setFieldsValue({
        estimated_check_in: null
      });
    }
  };

  return (
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
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
            }}>
              <EditOutlined style={{ color: 'white', fontSize: '14px' }} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                Update Entry Status
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '1px' }}>
                Modify visitor entry status
              </div>
            </div>
          </div>
        }
        bordered={false}
        style={{ 
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', 
          borderRadius: 12,
          border: '1px solid rgba(139, 92, 246, 0.1)'
        }}
        headStyle={{ 
          background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
          borderRadius: '12px 12px 0 0',
          borderBottom: '1px solid rgba(139, 92, 246, 0.1)'
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
              <div style={{ flex: '1', minWidth: '200px' }}>
                <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Current Status
                </Text>
                <div style={{ marginTop: '4px' }}>
                  <Tag 
                    color={record?.status === 'Pending' ? 'orange' : record?.status === 'Available' ? 'green' : 'red'}
                    style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px' }}
                  >
                    {record?.status || 'N/A'}
                  </Tag>
                </div>
              </div>
            </div>
          </Card>

          {/* Status Update Form */}
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <EditOutlined style={{ color: '#8b5cf6', fontSize: '16px' }} />
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Status Update</span>
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
                <CustomSelect
                  label="Status"
                  name="status"
                  options={statusOptions}
                  rules={[{ required: true, message: "Status is required" }]}
                  placeholder="Select status"
                  selectProps={{
                    onChange: handleStatusChange
                  }}
                />
              </Col>
              <Col xs={24} md={12}>
                <div style={{ marginBottom: '24px' }}>
                  <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Visit Type
                  </Text>
                  <div style={{
                    padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    backgroundColor: '#f8fafc',
                    color: '#374151',
                    fontWeight: '500',
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <FileTextOutlined style={{ color: '#6b7280' }} />
                    {record?.visit_type || 'N/A'}
                  </div>
                </div>
              </Col>

              {selectedStatus === 'Waiting' && (
                <Col xs={24} md={24}>
                  <div style={{ 
                    padding: '20px', 
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', 
                    borderRadius: '8px',
                    border: '1px solid #f59e0b',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <ClockCircleOutlined style={{ color: '#f59e0b', fontSize: '16px' }} />
                      <Text strong style={{ fontSize: '14px', color: '#92400e' }}>Estimated Check-In Time Required</Text>
                    </div>
                    <CustomDatePicker
                      label="Estimated Check-In Time"
                      name="estimated_check_in"
                      placeholder="Select estimated check-in time"
                      rules={[{ required: true, message: "Estimated check-in time is required for waiting status" }]}
                      datePickerProps={{
                        showTime: true,
                        format: dateFormat,
                        style: { width: '100%' }
                      }}
                    />
                  </div>
                </Col>
              )}
              
              <Col xs={24} md={24}>
                <div style={{ 
                  marginBottom: '20px',
                  padding: '20px', 
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Purpose
                  </Text>
                  <div style={{
                    fontSize: '15px',
                    color: '#374151',
                    marginTop: '4px',
                    lineHeight: '1.6'
                  }}>
                    {record?.purpose || 'No purpose specified'}
                  </div>
                </div>
              </Col>
              
              <Col xs={24} md={24}>
                <div style={{ 
                  marginBottom: '20px',
                  padding: '20px', 
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Notes
                  </Text>
                  <div style={{
                    fontSize: '15px',
                    color: '#374151',
                    marginTop: '4px',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {record?.notes || 'No notes available'}
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
                background: 'linear-gradient(135deg, #4D4D4D 0%, #6B6B6B 100%)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                fontWeight: '600',
                fontSize: '16px',
                color: 'white',
                height: '48px',
                padding: '0 32px'
              }}
              icon={<EditOutlined />}
            >
              Update Entry Status
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default EntryStatusUpdate;
