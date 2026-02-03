import React from "react";
import {
  Button,
  Card,
  Modal,
  Typography,
  Tag,
  Space,
  Timeline
} from "antd";

const { Text } = Typography;

import {
  EyeOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import useHandleResponse from "@/hooks/useHandleResponse";
const ViewEntry = (props) => {
  let {record, jwt, setIsModalVisible, refetch, viewModalVisible, setViewModalVisible, selectedGuest, GuestsDataObject, DepartmentsDataObject, setpage} = props;

  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  console.log(record);

  // Utility functions
  const formatDateHuman = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEntryTypeColor = (entryType) => {
    switch (entryType) {
      case 'Walk-in': return 'blue';
      case 'Appointment': return 'green';
      default: return 'default';
    }
  };

  const getVisitTypeColor = (visitType) => {
    switch (visitType) {
      case 'Vendor': return 'orange';
      case 'Interview': return 'purple';
      case 'Visitor': return 'blue';
      case 'Business': return 'green';
      case 'Other': return 'default';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'green';
      case 'Completed': return 'blue';
      case 'Cancelled': return 'red';
      case 'Pending': return 'orange';
      case 'Checked-in': return 'success';
      case 'Checked-out': return 'default';
      case 'Unavailable': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'Completed': return <CheckCircleOutlined style={{ color: '#1890ff' }} />;
      case 'Cancelled': return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'Pending': return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      case 'Checked-in': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'Checked-out': return <CloseCircleOutlined style={{ color: '#8c8c8c' }} />;
      case 'Unavailable': return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      default: return <ClockCircleOutlined style={{ color: '#d9d9d9' }} />;
    }
  };


  return (
    <Modal
      title="Entry Details"
      open={viewModalVisible}
      onCancel={() => setViewModalVisible(false)}
      footer={[
        <Button 
          key="close" 
          onClick={() => setViewModalVisible(false)}
        >
          Close
        </Button>
      ]}
      width={900}
    >
  
        <div>
        
            {/* Entry Information */}
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)'
                  }}>
                    <EyeOutlined style={{ color: 'white', fontSize: '14px' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                      Entry Information
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '1px' }}>
                      Basic entry details
                    </div>
                  </div>
                </div>
              } 
              style={{ 
                marginBottom: '20px',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.1)'
              }}
              headStyle={{ 
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                borderRadius: '12px 12px 0 0',
                borderBottom: '1px solid rgba(99, 102, 241, 0.1)'
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Entry Type
                    </Text>
                    <div style={{ marginTop: '4px' }}>
                      <Tag 
                        color={getEntryTypeColor(record.entry_type)}
                        style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px' }}
                      >
                        {record.entry_type}
                      </Tag>
                    </div>
                  </div>
                </div>
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Visit Type
                    </Text>
                    <div style={{ marginTop: '4px' }}>
                      <Tag 
                        color={getVisitTypeColor(record.visit_type)}
                        style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px' }}
                      >
                        {record.visit_type}
                      </Tag>
                    </div>
                  </div>
                </div>
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Status
                    </Text>
                    <div style={{ marginTop: '4px' }}>
                      <Space>
                        {getStatusIcon(record.status)}
                        <Tag 
                          color={getStatusColor(record.status)}
                          style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px' }}
                        >
                          {record.status}
                        </Tag>
                      </Space>
                    </div>
                  </div>
                </div>
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Entry Code
                    </Text>
                    <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px' }}>
                      {record.entry_code || 'N/A'}
                    </div>
                  </div>
                </div>
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Created At
                    </Text>
                    <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px' }}>
                      {formatDateHuman(record.createdAt)}
                    </div>
                  </div>
                </div>
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Estimated Check In
                    </Text>
                    <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px' }}>
                      {record.estimated_check_in ? formatDateHuman(record.estimated_check_in) : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Purpose Information */}
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
                    <CalendarOutlined style={{ color: 'white', fontSize: '14px' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                      Purpose
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '1px' }}>
                      Visit purpose
                    </div>
                  </div>
                </div>
              } 
              style={{ 
                marginBottom: '20px',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(139, 92, 246, 0.1)'
              }}
              headStyle={{ 
                background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                borderRadius: '12px 12px 0 0',
                borderBottom: '1px solid rgba(139, 92, 246, 0.1)'
              }}
            >
              <div style={{ 
                padding: '20px', 
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                minHeight: '60px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151' }}>
                  {record.purpose || 'No purpose specified'}
                </Text>
              </div>
            </Card>

            {/* Notes Information */}
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(6, 182, 212, 0.3)'
                  }}>
                    <ExclamationCircleOutlined style={{ color: 'white', fontSize: '14px' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                      Notes
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '1px' }}>
                      Additional notes
                    </div>
                  </div>
                </div>
              } 
              style={{ 
                marginBottom: '20px',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.1)'
              }}
              headStyle={{ 
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                borderRadius: '12px 12px 0 0',
                borderBottom: '1px solid rgba(6, 182, 212, 0.1)'
              }}
            >
              <div style={{ 
                padding: '20px', 
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                minHeight: '60px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151' }}>
                  {record.notes || 'No notes available'}
                </Text>
              </div>
            </Card>

            {/* Host Information */}
            {record.host && (
              <Card 
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)'
                    }}>
                      <UserOutlined style={{ color: 'white', fontSize: '14px' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                        Host Information
                      </div>
                      <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '1px' }}>
                        Contact details
                      </div>
                    </div>
                  </div>
                } 
                style={{ 
                  marginBottom: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(24, 144, 255, 0.1)'
                }}
                headStyle={{ 
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                  borderRadius: '12px 12px 0 0',
                  borderBottom: '1px solid rgba(24, 144, 255, 0.1)'
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Full Name
                      </Text>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                        {record.host.fullname}
                      </div>
                    </div>
                  </div>
                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Email
                      </Text>
                      <div style={{ fontSize: '14px', color: '#374151' }}>
                        {record.host.email}
                      </div>
                    </div>
                  </div>
                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Phone
                      </Text>
                      <div style={{ fontSize: '14px', color: '#374151' }}>
                        {record.host.phone}
                      </div>
                    </div>
                  </div>
                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Department
                      </Text>
                      <div style={{ fontSize: '14px', color: '#374151' }}>
                        {record.department?.name || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}


            {/* Appointment Information (for appointments only) */}
            {record.appointments && (
              <Card 
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
                    }}>
                      <ClockCircleOutlined style={{ color: 'white', fontSize: '14px' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                        Appointment Information
                      </div>
                      <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '1px' }}>
                        Scheduled details
                      </div>
                    </div>
                  </div>
                } 
                style={{ 
                  marginBottom: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.1)'
                }}
                headStyle={{ 
                  background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                  borderRadius: '12px 12px 0 0',
                  borderBottom: '1px solid rgba(245, 158, 11, 0.1)'
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                  <div style={{ flex: '1', minWidth: '250px' }}>
                    <div style={{ marginBottom: '12px' }}>
                      <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Scheduled For
                      </Text>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginTop: '4px' }}>
                        {formatDateHuman(record.appointments.scheduled_for)}
                      </div>
                    </div>
                  </div>
                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <div style={{ marginBottom: '12px' }}>
                      <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Status
                      </Text>
                      <div style={{ marginTop: '4px' }}>
                        <Tag 
                          color={record.appointments.status === 'Completed' ? 'success' : 'processing'}
                          style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px' }}
                        >
                          {record.appointments.status}
                        </Tag>
                      </div>
                    </div>
                  </div>
                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <div style={{ marginBottom: '12px' }}>
                      <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Created At
                      </Text>
                      <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px' }}>
                        {formatDateHuman(record.appointments.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Check In/Out Information */}
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)'
                  }}>
                    <ClockCircleOutlined style={{ color: 'white', fontSize: '14px' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                      Visit Timeline
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '1px' }}>
                      Check-in/out progress
                    </div>
                  </div>
                </div>
              }
              style={{ 
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(5, 150, 105, 0.1)'
              }}
              headStyle={{ 
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                borderRadius: '12px 12px 0 0',
                borderBottom: '1px solid rgba(5, 150, 105, 0.1)'
              }}
            >
              <Timeline style={{ padding: '20px 0' }}>
                <Timeline.Item
                  color={record.check_in_time ? 'green' : 'gray'}
                  dot={record.check_in_time ? 
                    <CheckCircleOutlined style={{ fontSize: '16px', color: '#10b981' }} /> : 
                    <ClockCircleOutlined style={{ fontSize: '16px', color: '#9ca3af' }} />
                  }
                >
                  <div style={{ 
                    background: record.check_in_time ? '#f0fdf4' : '#f9fafb', 
                    padding: '12px 16px', 
                    borderRadius: '8px',
                    border: `1px solid ${record.check_in_time ? '#d1fae5' : '#e5e7eb'}`,
                    marginBottom: '8px'
                  }}>
                    <Text strong style={{ 
                      fontSize: '16px', 
                      color: record.check_in_time ? '#059669' : '#6b7280' 
                    }}>
                      Check In Date
                    </Text>
                    <div style={{ 
                      fontSize: '14px', 
                      color: record.check_in_time ? '#047857' : '#9ca3af',
                      marginTop: '4px'
                    }}>
                      {record.check_in_time ? formatDateHuman(record.check_in_time) : 'Not checked in'}
                    </div>
                  </div>
                </Timeline.Item>
                <Timeline.Item
                  color={record.check_in_time ? 'green' : 'gray'}
                  dot={record.check_in_time ? 
                    <CheckCircleOutlined style={{ fontSize: '16px', color: '#10b981' }} /> : 
                    <ClockCircleOutlined style={{ fontSize: '16px', color: '#9ca3af' }} />
                  }
                >
                  <div style={{ 
                    background: record.check_in_time ? '#f0fdf4' : '#f9fafb', 
                    padding: '12px 16px', 
                    borderRadius: '8px',
                    border: `1px solid ${record.check_in_time ? '#d1fae5' : '#e5e7eb'}`,
                    marginBottom: '8px'
                  }}>
                    <Text strong style={{ 
                      fontSize: '16px', 
                      color: record.check_in_time ? '#059669' : '#6b7280' 
                    }}>
                      Check In Time
                    </Text>
                    <div style={{ 
                      fontSize: '14px', 
                      color: record.check_in_time ? '#047857' : '#9ca3af',
                      marginTop: '4px'
                    }}>
                      {record.check_in_time ? formatTime(record.check_in_time) : 'Not checked in'}
                    </div>
                  </div>
                </Timeline.Item>
                <Timeline.Item
                  color={record.check_out_time ? 'blue' : 'gray'}
                  dot={record.check_out_time ? 
                    <CloseCircleOutlined style={{ fontSize: '16px', color: '#3b82f6' }} /> : 
                    <ClockCircleOutlined style={{ fontSize: '16px', color: '#9ca3af' }} />
                  }
                >
                  <div style={{ 
                    background: record.check_out_time ? '#eff6ff' : '#f9fafb', 
                    padding: '12px 16px', 
                    borderRadius: '8px',
                    border: `1px solid ${record.check_out_time ? '#dbeafe' : '#e5e7eb'}`
                  }}>
                    <Text strong style={{ 
                      fontSize: '16px', 
                      color: record.check_out_time ? '#1d4ed8' : '#6b7280' 
                    }}>
                      Check Out Time
                    </Text>
                    <div style={{ 
                      fontSize: '14px', 
                      color: record.check_out_time ? '#1e40af' : '#9ca3af',
                      marginTop: '4px'
                    }}>
                      {record.check_out_time ? formatTime(record.check_out_time) : 'Not checked out'}
                    </div>
                  </div>
                </Timeline.Item>
              </Timeline>
            </Card>
          </div>
     
    </Modal>
  );
};

export default ViewEntry;