import React from 'react';
import { Card, Row, Col, Typography, Button, Tag } from 'antd';
import { UserOutlined, MailOutlined, DollarOutlined, BankOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const BorrowerTab = ({ singleLoanDataObject }) => {
  return (
    <div>
      {/* Borrower Profile Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 12,
        padding: 24,
        marginBottom: 32,
        color: 'white',
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: 600, opacity: 0.9 }}>Borrower Profile</Text>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{singleLoanDataObject?.borrower?.fullname || 'N/A'}</div>
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

      {/* Main Borrower Information Grid */}
      <Row gutter={[24, 24]}>
        {/* Personal Information */}
        <Col xs={24} md={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <UserOutlined style={{ color: '#1890ff' }} />
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
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.borrower?.fullname || 'N/A'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Gender</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.borrower?.gender || 'N/A'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Date of Birth</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.borrower?.date_of_birth ? new Date(singleLoanDataObject.borrower.date_of_birth).toLocaleDateString() : 'N/A'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Marital Status</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.borrower?.marital_status || 'N/A'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Identification</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.borrower?.proof_of_identification || 'N/A'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Occupation</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.borrower?.occupation || 'N/A'}</Text>
              </div>
            </div>
          </Card>
        </Col>

        {/* Contact Information */}
        <Col xs={24} md={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MailOutlined style={{ color: '#52c41a' }} />
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
                <Text style={{ color: '#666', fontSize: 12 }}>Email Address</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.borrower?.email || 'N/A'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Primary Phone</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.borrower?.primary_phone || 'N/A'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Secondary Phone</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.borrower?.secondary_phone || 'N/A'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Address</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.borrower?.address || 'N/A'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>City</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.borrower?.city || 'N/A'}</Text>
              </div>
            </div>
          </Card>
        </Col>

        {/* Loan Information */}
        <Col xs={24} md={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <DollarOutlined style={{ color: '#fa8c16' }} />
                <span>Loan Information</span>
              </div>
            }
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px 20px' }}
            bodyStyle={{ padding: '20px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Loan Amount</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>GHC {singleLoanDataObject?.loan_amount || '0'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Interest Rate</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.interest_rate || '0'}% {singleLoanDataObject?.interest_cycle || 'N/A'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Repayment Cycle</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.repayment_cycle || 'N/A'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Installment Amount</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>GHC {singleLoanDataObject?.installment_amount || '0'}</Text>
              </div>
            </div>
          </Card>
        </Col>

        {/* Additional Information */}
        <Col xs={24} md={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BankOutlined style={{ color: '#722ed1' }} />
                <span>Additional Information</span>
              </div>
            }
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px 20px' }}
            bodyStyle={{ padding: '20px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>ID Number</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.borrower?.identification_number || 'N/A'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Loan Status</Text>
                <Tag color={singleLoanDataObject?.loan_status === 'Active' ? 'green' : singleLoanDataObject?.loan_status === 'Requested' ? 'blue' : 'red'} style={{ fontSize: 11 }}>{singleLoanDataObject?.loan_status || 'N/A'}</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Application Date</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.createdAt ? new Date(singleLoanDataObject.createdAt).toLocaleDateString() : 'N/A'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Release Date</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.loan_release_date ? new Date(singleLoanDataObject.loan_release_date).toLocaleDateString() : 'N/A'}</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* View Borrower Profile Button */}
      {/* <div style={{ 
        textAlign: 'center', 
        marginTop: 32, 
        padding: 24, 
        background: '#f8f9fa',
        borderRadius: 12,
        border: '1px solid #e8e8e8'
      }}>
        <Button 
          type="primary" 
          size="medium"
          icon={<UserOutlined />}
          style={{ 
            borderRadius: 8,
            backgroundColor: '#000',
            borderColor: '#000',
            paddingLeft: 16,
            paddingRight: 16,
            height: 35,
            fontSize: 14,
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          View Borrower Profile
        </Button>
      </div> */}
    </div>
  );
};

export default BorrowerTab; 