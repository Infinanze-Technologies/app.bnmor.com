import React, { useEffect, useState } from "react";
import { Card, Descriptions, Table, Tag, Spin, Empty, Tabs, Timeline, Space, Typography, Divider, Modal, Button } from "antd";
import { UserOutlined, CalendarOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { URL_GET_VISITOR_GUESTS_HISTORY_BY_GUEST_ID } from "@/config/api-paths";
import { getRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
import { formatDateHuman, formatTime } from "@/config/DateFormat";

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

//   console.log(historyData);

  const handleViewEntry = (entry) => {
    setSelectedEntry(entry);
    setViewModalVisible(true);
  };

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
          onClick={() => handleViewEntry(record)}
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
          onClick={() => handleViewEntry(record)}
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
    <div style={{ padding: '20px' }}>
      {/* Guest Information */}
      <Card 
        title={
          <Space>
            <UserOutlined />
            <span>Guest Information</span>
          </Space>
        }
        style={{ marginBottom: '24px' }}
      >
        <Descriptions column={2} size="small">
          <Descriptions.Item label="Full Name" span={2}>
            <Text strong>{guest?.full_name || 'N/A'}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {guest?.email || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            {guest?.phone || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Type">
            <Tag color={guest?.type === 'Individual' ? 'blue' : 'green'}>
              {guest?.type || 'N/A'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Gender">
            <Tag color={guest?.gender === 'Male' ? 'blue' : 'pink'}>
              {guest?.gender || 'N/A'}
            </Tag>
          </Descriptions.Item>
          {guest?.organization && (
            <>
              <Descriptions.Item label="Organization" span={2}>
                <Text strong>{guest.organization?.name || 'N/A'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Org Email">
                {guest.organization?.email || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Org Phone">
                {guest.organization?.phone || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Org Address" span={2}>
                {guest.organization?.address || 'N/A'}
              </Descriptions.Item>
            </>
          )}
        </Descriptions>
      </Card>

      {/* Summary Statistics */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
              {total_entries || 0}
            </div>
            <div style={{ color: '#666' }}>Total Entries</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
              {total_appointment_entries || 0}
            </div>
            <div style={{ color: '#666' }}>Appointments</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
              {total_walk_in_entries || 0}
            </div>
            <div style={{ color: '#666' }}>Walk-ins</div>
          </div>
        </div>
      </Card>

      {/* Entries Tabs */}
      <Tabs defaultActiveKey="appointments">
        <TabPane 
          tab={
            <span>
              <CalendarOutlined />
              Appointments ({total_appointment_entries || 0})
            </span>
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
            />
          ) : (
            <Empty description="No appointment entries found" />
          )}
        </TabPane>

        <TabPane 
          tab={
            <span>
              <UserOutlined />
              Walk-ins ({total_walk_in_entries || 0})
            </span>
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
            />
          ) : (
            <Empty description="No walk-in entries found" />
          )}
        </TabPane>
      </Tabs>

      {/* Entry Details Modal */}
      <Modal
        title={
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            padding: '8px 0'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}>
              <EyeOutlined style={{ color: 'white', fontSize: '18px' }} />
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                Entry Details
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                Complete visitor information
              </div>
            </div>
          </div>
        }
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button 
            key="close" 
            onClick={() => setViewModalVisible(false)}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              color: 'white',
              fontWeight: '500',
              padding: '8px 24px',
              height: '40px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}
          >
            Close
          </Button>
        ]}
        width={900}
        bodyStyle={{ 
          maxHeight: '75vh', 
          overflowY: 'auto',
          padding: '24px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}
        style={{
          borderRadius: '16px',
          overflow: 'hidden'
        }}
      >
        {selectedEntry && (
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
                        color={getEntryTypeColor(selectedEntry.entry_type)}
                        style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px' }}
                      >
                        {selectedEntry.entry_type}
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
                        color={getVisitTypeColor(selectedEntry.visit_type)}
                        style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px' }}
                      >
                        {selectedEntry.visit_type}
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
                        {getStatusIcon(selectedEntry.status)}
                        <Tag 
                          color={getStatusColor(selectedEntry.status)}
                          style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px' }}
                        >
                          {selectedEntry.status}
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
                      {selectedEntry.entry_code || 'N/A'}
                    </div>
                  </div>
                </div>
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Created At
                    </Text>
                    <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px' }}>
                      {formatDateHuman(selectedEntry.createdAt)}
                    </div>
                  </div>
                </div>
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Estimated Check In
                    </Text>
                    <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px' }}>
                      {selectedEntry.estimated_check_in ? formatDateHuman(selectedEntry.estimated_check_in) : 'N/A'}
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
                  {selectedEntry.purpose || 'No purpose specified'}
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
                  {selectedEntry.notes || 'No notes available'}
                </Text>
              </div>
            </Card>

            {/* Host Information */}
            {selectedEntry.host && (
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
                        {selectedEntry.host.fullname}
                      </div>
                    </div>
                  </div>
                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Email
                      </Text>
                      <div style={{ fontSize: '14px', color: '#374151' }}>
                        {selectedEntry.host.email}
                      </div>
                    </div>
                  </div>
                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Phone
                      </Text>
                      <div style={{ fontSize: '14px', color: '#374151' }}>
                        {selectedEntry.host.phone}
                      </div>
                    </div>
                  </div>
                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Department
                      </Text>
                      <div style={{ fontSize: '14px', color: '#374151' }}>
                        {selectedEntry.department?.name || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}


            {/* Appointment Information (for appointments only) */}
            {selectedEntry.appointments && (
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
                        {formatDateHuman(selectedEntry.appointments.scheduled_for)}
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
                          color={selectedEntry.appointments.status === 'Completed' ? 'success' : 'processing'}
                          style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px' }}
                        >
                          {selectedEntry.appointments.status}
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
                        {formatDateHuman(selectedEntry.appointments.createdAt)}
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
                  color={selectedEntry.check_in_time ? 'green' : 'gray'}
                  dot={selectedEntry.check_in_time ? 
                    <CheckCircleOutlined style={{ fontSize: '16px', color: '#10b981' }} /> : 
                    <ClockCircleOutlined style={{ fontSize: '16px', color: '#9ca3af' }} />
                  }
                >
                  <div style={{ 
                    background: selectedEntry.check_in_time ? '#f0fdf4' : '#f9fafb', 
                    padding: '12px 16px', 
                    borderRadius: '8px',
                    border: `1px solid ${selectedEntry.check_in_time ? '#d1fae5' : '#e5e7eb'}`,
                    marginBottom: '8px'
                  }}>
                    <Text strong style={{ 
                      fontSize: '16px', 
                      color: selectedEntry.check_in_time ? '#059669' : '#6b7280' 
                    }}>
                      Check In Date
                    </Text>
                    <div style={{ 
                      fontSize: '14px', 
                      color: selectedEntry.check_in_time ? '#047857' : '#9ca3af',
                      marginTop: '4px'
                    }}>
                      {selectedEntry.check_in_time ? formatDateHuman(selectedEntry.check_in_time) : 'Not checked in'}
                    </div>
                  </div>
                </Timeline.Item>
                <Timeline.Item
                  color={selectedEntry.check_in_time ? 'green' : 'gray'}
                  dot={selectedEntry.check_in_time ? 
                    <CheckCircleOutlined style={{ fontSize: '16px', color: '#10b981' }} /> : 
                    <ClockCircleOutlined style={{ fontSize: '16px', color: '#9ca3af' }} />
                  }
                >
                  <div style={{ 
                    background: selectedEntry.check_in_time ? '#f0fdf4' : '#f9fafb', 
                    padding: '12px 16px', 
                    borderRadius: '8px',
                    border: `1px solid ${selectedEntry.check_in_time ? '#d1fae5' : '#e5e7eb'}`,
                    marginBottom: '8px'
                  }}>
                    <Text strong style={{ 
                      fontSize: '16px', 
                      color: selectedEntry.check_in_time ? '#059669' : '#6b7280' 
                    }}>
                      Check In Time
                    </Text>
                    <div style={{ 
                      fontSize: '14px', 
                      color: selectedEntry.check_in_time ? '#047857' : '#9ca3af',
                      marginTop: '4px'
                    }}>
                      {selectedEntry.check_in_time ? formatTime(selectedEntry.check_in_time) : 'Not checked in'}
                    </div>
                  </div>
                </Timeline.Item>
                <Timeline.Item
                  color={selectedEntry.check_out_time ? 'blue' : 'gray'}
                  dot={selectedEntry.check_out_time ? 
                    <CloseCircleOutlined style={{ fontSize: '16px', color: '#3b82f6' }} /> : 
                    <ClockCircleOutlined style={{ fontSize: '16px', color: '#9ca3af' }} />
                  }
                >
                  <div style={{ 
                    background: selectedEntry.check_out_time ? '#eff6ff' : '#f9fafb', 
                    padding: '12px 16px', 
                    borderRadius: '8px',
                    border: `1px solid ${selectedEntry.check_out_time ? '#dbeafe' : '#e5e7eb'}`
                  }}>
                    <Text strong style={{ 
                      fontSize: '16px', 
                      color: selectedEntry.check_out_time ? '#1d4ed8' : '#6b7280' 
                    }}>
                      Check Out Time
                    </Text>
                    <div style={{ 
                      fontSize: '14px', 
                      color: selectedEntry.check_out_time ? '#1e40af' : '#9ca3af',
                      marginTop: '4px'
                    }}>
                      {selectedEntry.check_out_time ? formatTime(selectedEntry.check_out_time) : 'Not checked out'}
                    </div>
                  </div>
                </Timeline.Item>
              </Timeline>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default GuestHistoryView;
