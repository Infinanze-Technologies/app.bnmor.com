import React from "react";
import {
  Button,
  Card,
  Modal,
  Typography,
  Tag,
  Space,
  Timeline,
  Divider
} from "antd";

const { Text, Title } = Typography;

import {
  EyeOutlined,
  UserOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BankOutlined,
  TeamOutlined,
  IdcardOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  GlobalOutlined
} from "@ant-design/icons";
import useHandleResponse from "@/hooks/useHandleResponse";

const ViewStaff = (props) => {
  let { record, viewModalVisible, setViewModalVisible, setIsModalVisible, jwt, setpage, refetch } = props;

  const { handleRequestError, handleRequestResponse } = useHandleResponse();

  // Debug logging
  console.log('ViewStaff Props:', props);
  console.log('Record:', record);
  console.log('Modal Visible:', viewModalVisible);

  // Fallback for modal visibility
  const isModalVisible = viewModalVisible !== undefined ? viewModalVisible : true;
  const handleCloseModal = setViewModalVisible || setIsModalVisible || (() => {});

  console.log('====================================');
  console.log(record);
  console.log('====================================');

  // Utility functions
  const formatDateHuman = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case true:
      case 'active':
      case 'approved': return 'green';
      case false:
      case 'inactive':
      case 'pending': return 'orange';
      case 'rejected': return 'red';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case true:
      case 'active':
      case 'approved': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case false:
      case 'inactive':
      case 'pending': return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      case 'rejected': return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default: return <ClockCircleOutlined style={{ color: '#d9d9d9' }} />;
    }
  };

  const getGenderColor = (gender) => {
    switch (gender) {
      case 'Male': return 'blue';
      case 'Female': return 'pink';
      default: return 'default';
    }
  };

  // Safety check for record
  if (!record) {
    return (
      <Modal
        title="Staff Details"
        open={isModalVisible}
        onCancel={() => handleCloseModal(false)}
        footer={[
          <Button 
            key="close" 
            onClick={() => handleCloseModal(false)}
          >
            Close
          </Button>
        ]}
        width={1000}
      >
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '16px', color: '#6b7280' }}>
            No staff data available
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title="Staff Details"
      open={isModalVisible}
      onCancel={() => handleCloseModal(false)}
      footer={[
        <Button 
          key="close" 
          onClick={() => handleCloseModal(false)}
        >
          Close
        </Button>
      ]}
      width={1000}
    >
      <div>
      
        {/* Personal Information */}
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
                  Personal Information
                </div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '1px' }}>
                  Basic staff details
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
                  Full Name
                </Text>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginTop: '4px' }}>
                  {record.fullname}
                </div>
              </div>
            </div>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <div style={{ marginBottom: '12px' }}>
                <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Employee Number
                </Text>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginTop: '4px' }}>
                  {record.employee_number}
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
                    color={getGenderColor(record.gender)}
                    style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px' }}
                  >
                    {record.gender}
                  </Tag>
                </div>
              </div>
            </div>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <div style={{ marginBottom: '12px' }}>
                <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Date of Birth
                </Text>
                <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px' }}>
                  {formatDateHuman(record.dob)}
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
                      {record.status ? 'Active' : 'Inactive'}
                    </Tag>
                  </Space>
                </div>
              </div>
            </div>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <div style={{ marginBottom: '12px' }}>
                <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Account Status
                </Text>
                <div style={{ marginTop: '4px' }}>
                  <Tag 
                    color={getStatusColor(record.account_status)}
                    style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px' }}
                  >
                    {record.account_status}
                  </Tag>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Contact Information */}
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
                <PhoneOutlined style={{ color: 'white', fontSize: '14px' }} />
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                  Contact Information
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <div style={{ marginBottom: '12px' }}>
                <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Email Address
                </Text>
                <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px' }}>
                  {record.email}
                </div>
              </div>
            </div>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <div style={{ marginBottom: '12px' }}>
                <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Phone Number
                </Text>
                <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px' }}>
                  {record.phone}
                </div>
              </div>
            </div>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <div style={{ marginBottom: '12px' }}>
                <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Address
                </Text>
                <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px' }}>
                  {record.address || 'N/A'}
                </div>
              </div>
            </div>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <div style={{ marginBottom: '12px' }}>
                <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  GPS Location
                </Text>
                <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px' }}>
                  {record.gps || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Employment Information */}
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
                <TeamOutlined style={{ color: 'white', fontSize: '14px' }} />
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                  Employment Information
                </div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '1px' }}>
                  Job details and organization
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <div style={{ marginBottom: '12px' }}>
                <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Department
                </Text>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginTop: '4px' }}>
                  {record.department?.name || 'N/A'}
                </div>
              </div>
            </div>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <div style={{ marginBottom: '12px' }}>
                <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Designation
                </Text>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginTop: '4px' }}>
                  {record.designation?.name || 'N/A'}
                </div>
              </div>
            </div>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <div style={{ marginBottom: '12px' }}>
                <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Role
                </Text>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginTop: '4px' }}>
                  {record.role?.name || 'N/A'}
                </div>
              </div>
            </div>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <div style={{ marginBottom: '12px' }}>
                <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Branch
                </Text>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginTop: '4px' }}>
                  {record.branch?.name || 'N/A'}
                </div>
              </div>
            </div>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <div style={{ marginBottom: '12px' }}>
                <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Join Date
                </Text>
                <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px' }}>
                  {formatDateHuman(record.join_date)}
                </div>
              </div>
            </div>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <div style={{ marginBottom: '12px' }}>
                <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Super User
                </Text>
                <div style={{ marginTop: '4px' }}>
                  <Tag 
                    color={record.is_super ? 'gold' : 'default'}
                    style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px' }}
                  >
                    {record.is_super ? 'Yes' : 'No'}
                  </Tag>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Business Information */}
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
                <GlobalOutlined style={{ color: 'white', fontSize: '14px' }} />
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                  Business Information
                </div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '1px' }}>
                  Organization details
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
            <div style={{ flex: '1', minWidth: '200px' }}>
              <div style={{ marginBottom: '12px' }}>
                <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Business Name
                </Text>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginTop: '4px' }}>
                  {record.business?.name || 'N/A'}
                </div>
              </div>
            </div>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <div style={{ marginBottom: '12px' }}>
                <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Business Email
                </Text>
                <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px' }}>
                  {record.business?.email || 'N/A'}
                </div>
              </div>
            </div>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <div style={{ marginBottom: '12px' }}>
                <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Business Phone
                </Text>
                <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px' }}>
                  {record.business?.phone || 'N/A'}
                </div>
              </div>
            </div>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <div style={{ marginBottom: '12px' }}>
                <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Business Status
                </Text>
                <div style={{ marginTop: '4px' }}>
                  <Tag 
                    color={getStatusColor(record.business?.status)}
                    style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px' }}
                  >
                    {record.business?.status ? 'Active' : 'Inactive'}
                  </Tag>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Banking Information */}
        {record.bank && (
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
                  <BankOutlined style={{ color: 'white', fontSize: '14px' }} />
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                    Banking Information
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '1px' }}>
                    Financial details
                  </div>
                </div>
              </div>
            } 
            style={{ 
              marginBottom: '20px',
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
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Account Holder
                  </Text>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginTop: '4px' }}>
                    {record.bank.holder_name}
                  </div>
                </div>
              </div>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Bank Name
                  </Text>
                  <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px' }}>
                    {record.bank.bank_name}
                  </div>
                </div>
              </div>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Branch Location
                  </Text>
                  <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px' }}>
                    {record.bank.branch_location}
                  </div>
                </div>
              </div>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Account Number
                  </Text>
                  <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px' }}>
                    {record.bank.account_number}
                  </div>
                </div>
              </div>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Bank Code
                  </Text>
                  <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px' }}>
                    {record.bank.bank_code}
                  </div>
                </div>
              </div>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Tax Payer ID
                  </Text>
                  <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px' }}>
                    {record.bank.tax_payer_id}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Verification Status */}
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
                <IdcardOutlined style={{ color: 'white', fontSize: '14px' }} />
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                  Verification Status
                </div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '1px' }}>
                  Account verification details
                </div>
              </div>
            </div>
          } 
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <div style={{ marginBottom: '12px' }}>
                <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Email Verified
                </Text>
                <div style={{ marginTop: '4px' }}>
                  <Space>
                    {getStatusIcon(record.is_verify)}
                    <Tag 
                      color={getStatusColor(record.is_verify)}
                      style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px' }}
                    >
                      {record.is_verify ? 'Verified' : 'Not Verified'}
                    </Tag>
                  </Space>
                </div>
              </div>
            </div>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <div style={{ marginBottom: '12px' }}>
                <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Documents
                </Text>
                <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px' }}>
                  {record.documents ? 'Available' : 'Not Available'}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Modal>
  );
};

export default ViewStaff;