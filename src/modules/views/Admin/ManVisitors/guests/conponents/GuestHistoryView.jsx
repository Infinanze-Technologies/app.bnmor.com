import React, { useEffect, useState } from "react";
import { Card, Descriptions, Table, Tag, Spin, Empty, Tabs, Space, Typography, Button, Statistic, Row, Col } from "antd";
import { 
  UserOutlined, 
  CalendarOutlined, 
  EyeOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ExclamationCircleOutlined,
  TeamOutlined,
  FileTextOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { URL_GET_VISITOR_GUESTS_HISTORY_BY_GUEST_ID } from "@/config/api-paths";
import { getRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
import { formatDateHuman } from "@/config/DateFormat";
import ViewEntry from "./ViewEntry";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const GuestHistoryView = ({ setIsModalVisible, jwt, record }) => {
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const { handleRequestError, handleRequestResponse } = useHandleResponse();

  useEffect(() => {
    if (record?.guest_id) {
      fetchGuestHistory();
    }
  }, []);

  const fetchGuestHistory = async () => {
    setLoading(true);
    try {
      await getRequest(`${URL_GET_VISITOR_GUESTS_HISTORY_BY_GUEST_ID}/${record.guest_id}`, jwt).then((res) => {
        setHistoryData(res.data?.data);
      }).catch((err) => {
        handleRequestError(err);
      });
    //   handleRequestResponse(response);
      //    setHistoryData(response.data?.data);
    } catch (error) {
      handleRequestError(error);
    } finally {
      setLoading(false);
    }
  };



  // Utility functions - these will be handled by ViewEntry component
  const getStatusColor = (status) => {
    switch (status) {
      case 'Checked-in':
        return 'success';
      case 'Checked-out':
        return 'default';
      case 'Pending':
        return 'processing';
      case 'Unavailable':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Checked-in':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'Checked-out':
        return <CloseCircleOutlined style={{ color: '#8c8c8c' }} />;
      case 'Pending':
        return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
      case 'Unavailable':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const getEntryTypeColor = (type) => {
    return type === 'Appointment' ? 'blue' : 'green';
  };

  const getVisitTypeColor = (type) => {
    switch (type) {
      case 'Business':
        return 'blue';
      case 'Interview':
        return 'orange';
      case 'Visitor':
        return 'green';
      default:
        return 'default';
    }
  };

  const appointmentColumns = [
    {
      title: 'Entry Code',
      dataIndex: 'entry_code',
      key: 'entry_code',
      render: (text) => text || 'N/A',
      width: 120,
    },
    {
      title: 'Visit Type',
      dataIndex: 'visit_type',
      key: 'visit_type',
      render: (text) => (
        <Tag color={getVisitTypeColor(text)}>
          {text}
        </Tag>
      ),
      width: 120,
    },
    {
    title: 'Department',
    dataIndex: ['department', 'name'],
    key: 'department',
    render: (text) => text || 'N/A',
    width: 150,
  },
    {
      title: 'Host',
      dataIndex: ['host', 'fullname'],
      key: 'host',
      render: (text) => text || 'N/A',
      width: 150,
    },
    {
      title: 'Scheduled For',
      dataIndex: ['appointments', 'scheduled_for'],
      key: 'scheduled_for',
      render: (text) => text ? formatDateHuman(text) : 'N/A',
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <Space>
          {getStatusIcon(text)}
          <Tag color={getStatusColor(text)}>
            {text}
          </Tag>
        </Space>
      ),
      width: 120,
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedEntry(record);
            setViewModalVisible(true);
          }}
          style={{ color: '#1890ff' }}
        />
      ),
      width: 120,
    },
  ];

  const walkInColumns = [
    {
      title: 'Visit Type',
      dataIndex: 'visit_type',
      key: 'visit_type',
      render: (text) => (
        <Tag color={getVisitTypeColor(text)}>
          {text}
        </Tag>
      ),
      width: 120,
    },
    {
        title: 'Department',
        dataIndex: ['department', 'name'],
        key: 'department',
        render: (text) => text || 'N/A',
        width: 150,
      },
    {
      title: 'Host',
      dataIndex: ['host', 'fullname'],
      key: 'host',
      render: (text) => text || 'N/A',
      width: 150,
    },
    {
      title: 'Check In',
      dataIndex: 'check_in_time',
      key: 'check_in_time',
      render: (text) => text ? formatDateHuman(text) : 'N/A',
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <Space>
          {getStatusIcon(text)}
          <Tag color={getStatusColor(text)}>
            {text}
          </Tag>
        </Space>
      ),
      width: 120,
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedEntry(record);
            setViewModalVisible(true);
          }}
          style={{ color: '#1890ff' }}
        />
      ),
      width: 120,
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Loading guest history...</div>
      </div>
    );
  }

  if (!historyData || !historyData.guest) {
    return (
      <Empty
        description="No history data found"
        style={{ padding: '50px' }}
      />
    );
  }

  const { guest, appointment_entries = [], walk_in_entries = [], total_appointment_entries, total_walk_in_entries, total_entries } = historyData;

  return (
    <div style={{ padding: '20px', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', minHeight: '100vh' }}>
      <style jsx>{`
        .table-row-light {
          background-color: #ffffff;
        }
        .table-row-dark {
          background-color: #f8fafc;
        }
        .table-row-light:hover,
        .table-row-dark:hover {
          background-color: #f0f9ff !important;
        }
        .ant-table-thead > tr > th {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
          border-bottom: 2px solid #e2e8f0 !important;
          font-weight: 600 !important;
          color: #374151 !important;
        }
        .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f1f5f9 !important;
        }
      `}</style>
      {/* Guest Information */}
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
              <UserOutlined style={{ color: 'white', fontSize: '14px' }} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                Guest Information
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '1px' }}>
                Personal details and contact information
              </div>
            </div>
          </div>
        }
        style={{ 
          marginBottom: '24px',
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
                Full Name
              </Text>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginTop: '4px' }}>
                {guest?.full_name || 'N/A'}
              </div>
            </div>
          </div>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <div style={{ marginBottom: '12px' }}>
              <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Email
              </Text>
              <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MailOutlined style={{ color: '#6b7280' }} />
                {guest?.email || 'N/A'}
              </div>
            </div>
          </div>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <div style={{ marginBottom: '12px' }}>
              <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Phone
              </Text>
              <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PhoneOutlined style={{ color: '#6b7280' }} />
                {guest?.phone || 'N/A'}
              </div>
            </div>
          </div>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <div style={{ marginBottom: '12px' }}>
              <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Type
              </Text>
              <div style={{ marginTop: '4px' }}>
                <Tag 
                  color={guest?.type === 'Individual' ? 'blue' : 'green'}
                  style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px' }}
                >
                  {guest?.type || 'N/A'}
                </Tag>
              </div>
            </div>
          </div>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <div style={{ marginBottom: '12px' }}>
              <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Gender
              </Text>
              <div style={{ marginTop: '4px' }}>
                <Tag 
                  color={guest?.gender === 'Male' ? 'blue' : 'pink'}
                  style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px' }}
                >
                  {guest?.gender || 'N/A'}
                </Tag>
              </div>
            </div>
          </div>
        </div>
        
        {guest?.organization && (
          <div style={{ 
            marginTop: '20px', 
            padding: '20px', 
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <TeamOutlined style={{ color: '#6366f1', fontSize: '16px' }} />
              <Text strong style={{ fontSize: '16px', color: '#1f2937' }}>Organization Details</Text>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Organization Name
                </Text>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginTop: '4px' }}>
                  {guest.organization?.name || 'N/A'}
                </div>
              </div>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Organization Email
                </Text>
                <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MailOutlined style={{ color: '#6b7280' }} />
                  {guest.organization?.email || 'N/A'}
                </div>
              </div>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Organization Phone
                </Text>
                <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PhoneOutlined style={{ color: '#6b7280' }} />
                  {guest.organization?.phone || 'N/A'}
                </div>
              </div>
              <div style={{ flex: '1', minWidth: '100%' }}>
                <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Organization Address
                </Text>
                <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HomeOutlined style={{ color: '#6b7280' }} />
                  {guest.organization?.address || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Summary Statistics */}
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
                Visit Statistics
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '1px' }}>
                Summary of guest visits
              </div>
            </div>
          </div>
        }
        style={{ 
          marginBottom: '24px',
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
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={8}>
            <div style={{ 
              textAlign: 'center', 
              padding: '20px',
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              borderRadius: '12px',
              border: '1px solid rgba(24, 144, 255, 0.1)'
            }}>
              <Statistic
                title={<span style={{ color: '#6b7280', fontSize: '14px' }}>Total Entries</span>}
                value={total_entries || 0}
                valueStyle={{ 
                  color: '#1890ff', 
                  fontSize: '32px', 
                  fontWeight: 'bold' 
                }}
                prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
              />
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div style={{ 
              textAlign: 'center', 
              padding: '20px',
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              borderRadius: '12px',
              border: '1px solid rgba(34, 197, 94, 0.1)'
            }}>
              <Statistic
                title={<span style={{ color: '#6b7280', fontSize: '14px' }}>Appointments</span>}
                value={total_appointment_entries || 0}
                valueStyle={{ 
                  color: '#10b981', 
                  fontSize: '32px', 
                  fontWeight: 'bold' 
                }}
                prefix={<CalendarOutlined style={{ color: '#10b981' }} />}
              />
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div style={{ 
              textAlign: 'center', 
              padding: '20px',
              background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
              borderRadius: '12px',
              border: '1px solid rgba(245, 158, 11, 0.1)'
            }}>
              <Statistic
                title={<span style={{ color: '#6b7280', fontSize: '14px' }}>Walk-ins</span>}
                value={total_walk_in_entries || 0}
                valueStyle={{ 
                  color: '#f59e0b', 
                  fontSize: '32px', 
                  fontWeight: 'bold' 
                }}
                prefix={<UserOutlined style={{ color: '#f59e0b' }} />}
              />
            </div>
          </Col>
        </Row>
      </Card>

      {/* Entries Tabs */}
      <Card 
        style={{ 
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
        <Tabs 
          defaultActiveKey="appointments"
          type="card"
          size="large"
          style={{ marginTop: '16px' }}
        >
          <TabPane 
            tab={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarOutlined style={{ color: '#10b981' }} />
                <span>Appointments</span>
                <Tag color="success" style={{ marginLeft: '4px' }}>
                  {total_appointment_entries || 0}
                </Tag>
              </div>
            } 
            key="appointments"
          >
            {appointment_entries.length > 0 ? (
              <Table
                columns={appointmentColumns}
                dataSource={appointment_entries}
                rowKey="entry_id"
                pagination={false}
                scroll={{ x: 1000 }}
                style={{ 
                  background: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
                rowClassName={(record, index) => 
                  index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
                }
              />
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <CalendarOutlined style={{ fontSize: '48px', color: '#d1d5db', marginBottom: '16px' }} />
                <div style={{ fontSize: '16px', color: '#6b7280', marginBottom: '8px' }}>
                  No appointment entries found
                </div>
                <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                  This guest hasn't made any appointments yet
                </div>
              </div>
            )}
          </TabPane>

          <TabPane 
            tab={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserOutlined style={{ color: '#f59e0b' }} />
                <span>Walk-ins</span>
                <Tag color="warning" style={{ marginLeft: '4px' }}>
                  {total_walk_in_entries || 0}
                </Tag>
              </div>
            } 
            key="walkins"
          >
            {walk_in_entries.length > 0 ? (
              <Table
                columns={walkInColumns}
                dataSource={walk_in_entries}
                rowKey="entry_id"
                pagination={false}
                scroll={{ x: 1000 }}
                style={{ 
                  background: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
                rowClassName={(record, index) => 
                  index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
                }
              />
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <UserOutlined style={{ fontSize: '48px', color: '#d1d5db', marginBottom: '16px' }} />
                <div style={{ fontSize: '16px', color: '#6b7280', marginBottom: '8px' }}>
                  No walk-in entries found
                </div>
                <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                  This guest hasn't made any walk-in visits yet
                </div>
              </div>
            )}
          </TabPane>
        </Tabs>
      </Card>

      {/* Entry Details Modal */}
      {viewModalVisible && selectedEntry && (
        <ViewEntry
          record={selectedEntry}
          jwt={jwt}
          setIsModalVisible={setIsModalVisible}
          viewModalVisible={viewModalVisible}
          setViewModalVisible={setViewModalVisible}
        />
      )}
    </div>
  );
};

export default GuestHistoryView;
