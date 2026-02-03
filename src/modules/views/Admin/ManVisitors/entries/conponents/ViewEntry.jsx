import React from 'react';
import { Card, Row, Col, Tag, Descriptions, Typography, Space, Divider, Timeline, Badge, Table, Button, Modal } from 'antd';
import { 
  UserOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined, 
  PhoneOutlined, 
  MailOutlined,
  TeamOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined as PendingIcon,
  EyeOutlined,
  ExclamationCircleOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { formatDateHuman, formatTime } from "@/config/DateFormat";

const { Title, Text } = Typography;

const ViewEntry = (props) => {
  const { record } = props;

  if (!record) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Text type="secondary">No entry data available</Text>
      </div>
    );
  }

 

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'orange';
      case 'Checked In':
        return 'blue';
      case 'Checked Out':
        return 'green';
      case 'Cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <PendingIcon />;
      case 'Checked In':
        return <CheckCircleOutlined />;
      case 'Checked Out':
        return <CheckCircleOutlined />;
      case 'Cancelled':
        return <CloseCircleOutlined />;
      default:
        return <PendingIcon />;
    }
  };

  const getEntryTypeColor = (type) => {
    switch (type) {
      case 'Walk-in':
        return 'blue';
      case 'Appointment':
        return 'green';
      default:
        return 'default';
    }
  };

  const getVisitTypeColor = (type) => {
    switch (type) {
      case 'Vendor':
        return 'purple';
      case 'Interview':
        return 'orange';
      case 'Visitor':
        return 'blue';
      case 'Business':
        return 'green';
      case 'Other':
        return 'gray';
      default:
        return 'default';
    }
  };

  return (
    <div style={{ 
      maxWidth: 1200, 
      margin: "0 auto", 
      padding: 24,
      maxHeight: '80vh',
      overflowY: 'auto',
      overflowX: 'hidden',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: '100vh'
    }}>
      {/* Header */}
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
                Entry Details
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '1px' }}>
                Entry ID: {record.entry_id?.substring(0, 8)}...
              </div>
            </div>
          </div>
        }
        style={{ 
          marginBottom: 24, 
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.1)'
        }}
        headStyle={{ 
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderRadius: '12px 12px 0 0',
          borderBottom: '1px solid rgba(99, 102, 241, 0.1)'
        }}
        extra={
            <Space size="middle">
              <Tag 
                color={getEntryTypeColor(record?.entry_type)}
                style={{ 
                fontSize: '12px',
                padding: '4px 12px',
                borderRadius: '20px',
                  fontWeight: '500'
                }}
              >
                {record?.entry_type}
              </Tag>
              <Tag 
                color={getStatusColor(record?.status)}
                icon={getStatusIcon(record?.status)}
                style={{ 
                fontSize: '12px',
                padding: '4px 12px',
                borderRadius: '20px',
                  fontWeight: '500'
                }}
              >
                {record?.status === 'Waiting' ? 'Occupied' : record?.status}
              </Tag>
            </Space>
        }
      >
        <div style={{ 
          padding: '20px', 
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151' }}>
            Complete entry information and visitor details
          </Text>
        </div>
      </Card>

      {/* Main Entry Information */}
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
              <FileTextOutlined style={{ color: 'white', fontSize: '14px' }} />
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
          marginBottom: 24,
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(139, 92, 246, 0.1)'
        }}
        headStyle={{ 
          background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
          borderRadius: '12px 12px 0 0',
          borderBottom: '1px solid rgba(139, 92, 246, 0.1)'
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
                    {record.status === 'Waiting' ? 'Occupied' : record.status}
                    </Tag>
                </Space>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Guest & Host Information */}
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
                Guest & Host Information
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '1px' }}>
                Contact details and relationships
              </div>
            </div>
          </div>
        }
        style={{ 
          marginBottom: 24,
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(24, 144, 255, 0.1)'
        }}
        headStyle={{ 
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          borderRadius: '12px 12px 0 0',
          borderBottom: '1px solid rgba(24, 144, 255, 0.1)'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {/* Guest Information */}
          <div style={{ flex: '1', minWidth: '300px' }}>
            <div style={{ 
              padding: '20px', 
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <UserOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
                <Text strong style={{ fontSize: '16px', color: '#1f2937' }}>Guest Details</Text>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Full Name
                  </Text>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginTop: '4px' }}>
                    {record.guest?.full_name || 'N/A'}
                  </div>
                </div>
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Type
                  </Text>
                  <div style={{ marginTop: '4px' }}>
                    <Tag 
                      color={record.guest?.type === 'Individual' ? 'blue' : 'green'}
                      style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px' }}
                    >
                      {record.guest?.type || 'N/A'}
                    </Tag>
                  </div>
                </div>
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Email
                  </Text>
                  <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MailOutlined style={{ color: '#6b7280' }} />
                    {record.guest?.email || 'N/A'}
                  </div>
                </div>
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Phone
                  </Text>
                  <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PhoneOutlined style={{ color: '#6b7280' }} />
                    {record.guest?.phone || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Host Information */}
          <div style={{ flex: '1', minWidth: '300px' }}>
            <div style={{ 
              padding: '20px', 
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <TeamOutlined style={{ color: '#10b981', fontSize: '16px' }} />
                <Text strong style={{ fontSize: '16px', color: '#1f2937' }}>Host Details</Text>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Full Name
                  </Text>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginTop: '4px' }}>
                    {record.host?.fullname || 'N/A'}
                  </div>
                </div>
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Email
                  </Text>
                  <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MailOutlined style={{ color: '#6b7280' }} />
                    {record.host?.email || 'N/A'}
                  </div>
                </div>
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Phone
                  </Text>
                  <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PhoneOutlined style={{ color: '#6b7280' }} />
                    {record.host?.phone || 'N/A'}
                  </div>
                </div>
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Department
                  </Text>
                  <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HomeOutlined style={{ color: '#6b7280' }} />
                    {record.department?.name || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Timing Information */}
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
          marginBottom: 24,
          borderRadius: 12,
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

      {/* Purpose & Notes */}
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
                Additional Information
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '1px' }}>
                Purpose and notes
              </div>
            </div>
          </div>
        }
        style={{ 
          marginBottom: 24,
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(6, 182, 212, 0.1)'
        }}
        headStyle={{ 
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          borderRadius: '12px 12px 0 0',
          borderBottom: '1px solid rgba(6, 182, 212, 0.1)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Purpose */}
          <div style={{ 
            padding: '20px', 
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <div style={{ flex: 1 }}>
              <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Purpose
              </Text>
              <div style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginTop: '4px' }}>
                {record.purpose || 'No purpose specified'}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div style={{ 
            padding: '20px', 
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <div style={{ flex: 1 }}>
              <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Notes
              </Text>
              <div style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginTop: '4px' }}>
                {record.notes || 'No notes available'}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Appointments Information */}
      {record.appointments && record.appointments.length > 0 && (
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
                <CalendarOutlined style={{ color: 'white', fontSize: '14px' }} />
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
            borderRadius: 12,
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
                  Appointment ID
                </Text>
                <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px', fontFamily: 'monospace' }}>
                  {record.appointments[0]?.scheduled_id || 'N/A'}
                </div>
              </div>
            </div>
            <div style={{ flex: '1', minWidth: '250px' }}>
              <div style={{ marginBottom: '12px' }}>
                <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Scheduled For
                </Text>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginTop: '4px' }}>
                  {record.appointments[0]?.scheduled_for ? formatDateHuman(record.appointments[0].scheduled_for) : 'Not set'}
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
                    color={record.appointments[0]?.status === 'Scheduled' ? 'blue' : 'green'}
                    style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px' }}
                  >
                    {record.appointments[0]?.status || 'N/A'}
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
                  {record.appointments[0]?.createdAt ? formatDateHuman(record.appointments[0].createdAt) : 'Not set'}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ViewEntry;