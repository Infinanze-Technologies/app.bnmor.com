import React from 'react';
import { Card, Row, Col, Typography, Button, Tag, Space } from 'antd';
import { SafetyCertificateOutlined, DollarOutlined, FileImageOutlined, BankOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const GuarantorTab = ({ singleLoanDataObject }) => {
  return (
    <div>
      {/* Guarantor Overview Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)',
        borderRadius: 12,
        padding: 24,
        marginBottom: 32,
        color: 'white',
        boxShadow: '0 8px 32px rgba(114, 46, 209, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: 600, opacity: 0.9 }}>Guarantor Information</Text>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{singleLoanDataObject?.guarantor?.fullname || 'N/A'}</div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>Loan ID: {singleLoanDataObject?.loan_id || 'N/A'}</div>
          </div>
          <div style={{ 
            background: 'rgba(255,255,255,0.2)', 
            borderRadius: 50, 
            width: 80, 
            height: 80, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <UserOutlined style={{ fontSize: 32, color: 'white' }} />
          </div>
        </div>
      </div>

      {/* Main Guarantor Information Grid */}
      <Row gutter={[24, 24]}>
        {/* Personal Information */}
        <Col xs={24} md={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <UserOutlined style={{ color: '#722ed1' }} />
                <span>Personal Information</span>
              </div>
            }
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px 20px' }}
            bodyStyle={{ padding: '20px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Full Name</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.guarantor?.fullname || 'N/A'}</Text>
              </div>
   
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Gender</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.guarantor?.gender || 'N/A'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Date of Birth</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.guarantor?.date_of_birth ? new Date(singleLoanDataObject.guarantor.date_of_birth).toLocaleDateString() : 'N/A'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Marital Status</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.guarantor?.marital_status || 'N/A'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Status</Text>
                <Tag color={singleLoanDataObject?.guarantor?.status === 'Active' ? 'green' : 'red'} style={{ fontSize: 11 }}>{singleLoanDataObject?.guarantor?.status || 'N/A'}</Tag>
              </div>
            </div>
          </Card>
        </Col>

        {/* Contact Information */}
        <Col xs={24} md={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BankOutlined style={{ color: '#52c41a' }} />
                <span>Contact Information</span>
              </div>
            }
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px 20px' }}
            bodyStyle={{ padding: '20px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Phone Number</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.guarantor?.phone_number || 'N/A'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Email Address</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.guarantor?.email || 'N/A'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Address</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.guarantor?.residential_address || 'N/A'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>City</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.guarantor?.city || 'N/A'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>ID Type</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.guarantor?.id_type || 'N/A'}</Text>
              </div>
            </div>
          </Card>
        </Col>

        {/* Financial Information */}
        <Col xs={24} md={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <DollarOutlined style={{ color: '#fa8c16' }} />
                <span>Financial Information</span>
              </div>
            }
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px 20px' }}
            bodyStyle={{ padding: '20px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Monthly Income</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>GHC {singleLoanDataObject?.guarantor?.monthly_income || '0'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Employment Status</Text>
                <Tag color={singleLoanDataObject?.guarantor?.employment_status === 'Employed' ? 'green' : 'orange'} style={{ fontSize: 11 }}>{singleLoanDataObject?.guarantor?.employment_status || 'N/A'}</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Occupation</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.guarantor?.occupation || 'N/A'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Relationship to Borrower</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.guarantor_relationship || 'N/A'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Relationship Duration</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.guarantor_relationship_duration || '0'} years</Text>
              </div>
            </div>
          </Card>
        </Col>

        {/* Documentation Status */}
        <Col xs={24} md={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileImageOutlined style={{ color: '#1890ff' }} />
                <span>Documentation Status</span>
              </div>
            }
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px 20px' }}
            bodyStyle={{ padding: '20px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>ID Document</Text>
                <Tag color={singleLoanDataObject?.guarantor?.id_type ? 'green' : 'red'} style={{ fontSize: 11 }}>{singleLoanDataObject?.guarantor?.id_type ? 'Verified' : 'Not Verified'}</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Guarantee Agreement</Text>
                <Tag color={singleLoanDataObject?.guarantor_relationship ? 'green' : 'red'} style={{ fontSize: 11 }}>{singleLoanDataObject?.guarantor_relationship ? 'Signed' : 'Not Signed'}</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Income Verification</Text>
                <Tag color={singleLoanDataObject?.guarantor?.monthly_income ? 'green' : 'red'} style={{ fontSize: 11 }}>{singleLoanDataObject?.guarantor?.monthly_income ? 'Verified' : 'Not Verified'}</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Contact Verification</Text>
                <Tag color={singleLoanDataObject?.guarantor?.phone_number ? 'green' : 'red'} style={{ fontSize: 11 }}>{singleLoanDataObject?.guarantor?.phone_number ? 'Verified' : 'Not Verified'}</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Address Verification</Text>
                <Tag color={singleLoanDataObject?.guarantor?.residential_address ? 'green' : 'red'} style={{ fontSize: 11 }}>{singleLoanDataObject?.guarantor?.residential_address ? 'Verified' : 'Not Verified'}</Tag>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Action Buttons */}
      {/* <div style={{ 
        textAlign: 'center', 
        marginTop: 32, 
        padding: 24, 
        background: '#f8f9fa',
        borderRadius: 12,
        border: '1px solid #e8e8e8'
      }}>
        <Space size="large">
          <Button 
            type="primary" 
            size="large"
            icon={<UserOutlined />}
            style={{ 
              borderRadius: 8,
              backgroundColor: '#722ed1',
              borderColor: '#722ed1',
              paddingLeft: 32,
              paddingRight: 32,
              height: 48,
              fontSize: 16,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(114, 46, 209, 0.3)'
            }}
          >
            View Guarantor Profile
          </Button>
          <Button 
            type="default" 
            size="large"
            icon={<EditOutlined />}
            style={{ 
              borderRadius: 8,
              paddingLeft: 32,
              paddingRight: 32,
              height: 48,
              fontSize: 16,
              fontWeight: 600
            }}
          >
            Edit Guarantor
          </Button>
        </Space>
      </div> */}
    </div>
  );
};

export default GuarantorTab;
