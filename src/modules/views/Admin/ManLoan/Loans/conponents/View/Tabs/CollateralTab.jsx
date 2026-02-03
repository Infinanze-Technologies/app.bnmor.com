import React from 'react';
import { Card, Row, Col, Typography, Button, Tag, Space } from 'antd';
import { SafetyCertificateOutlined, DollarOutlined, FileImageOutlined, BankOutlined, EditOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const CollateralTab = ({ singleLoanDataObject }) => {
  return (
    <div>
      {/* Collateral Overview Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
        borderRadius: 12,
        padding: 24,
        marginBottom: 32,
        color: 'white',
        boxShadow: '0 8px 32px rgba(82, 196, 26, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: 600, opacity: 0.9 }}>Collateral Information</Text>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>Loan Collateral</div>
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
            <SafetyCertificateOutlined style={{ fontSize: 32, color: 'white' }} />
          </div>
        </div>
      </div>

      {/* Main Collateral Information Grid */}
      <Row gutter={[24, 24]}>
        {/* Vehicle Details */}
        <Col xs={24} md={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SafetyCertificateOutlined style={{ color: '#52c41a' }} />
                <span>Vehicle Details</span>
              </div>
            }
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px 20px' }}
            bodyStyle={{ padding: '20px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Collateral Type</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>Personal Guarantee</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Guarantor Name</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.guarantor?.fullname || 'N/A'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Guarantor ID</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.guarantor?.guarantor_id || 'N/A'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Relationship</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.guarantor_relationship || 'N/A'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Monthly Income</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>GHC {singleLoanDataObject?.guarantor?.monthly_income || '0'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Status</Text>
                <Tag color={singleLoanDataObject?.guarantor?.status === 'Active' ? 'green' : 'red'} style={{ fontSize: 11 }}>{singleLoanDataObject?.guarantor?.status || 'N/A'}</Tag>
              </div>
            </div>
          </Card>
        </Col>

        {/* Collateral Valuation */}
        <Col xs={24} md={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <DollarOutlined style={{ color: '#fa8c16' }} />
                <span>Valuation Details</span>
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
                <Text style={{ color: '#666', fontSize: 12 }}>Guarantee Amount</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>GHC {singleLoanDataObject?.loan_amount || '0'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Coverage Ratio</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>100%</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Loan Release Date</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.loan_release_date ? new Date(singleLoanDataObject.loan_release_date).toLocaleDateString() : 'N/A'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Loan Status</Text>
                <Tag color={singleLoanDataObject?.loan_status === 'Active' ? 'green' : singleLoanDataObject?.loan_status === 'Requested' ? 'blue' : 'red'} style={{ fontSize: 11 }}>{singleLoanDataObject?.loan_status || 'N/A'}</Tag>
              </div>
            </div>
          </Card>
        </Col>

        {/* Documentation */}
        <Col xs={24} md={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileImageOutlined style={{ color: '#1890ff' }} />
                <span>Documentation</span>
              </div>
            }
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px 20px' }}
            bodyStyle={{ padding: '20px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Guarantor ID Document</Text>
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
                <Text style={{ color: '#666', fontSize: 12 }}>Contact Information</Text>
                <Tag color={singleLoanDataObject?.guarantor?.phone_number ? 'green' : 'red'} style={{ fontSize: 11 }}>{singleLoanDataObject?.guarantor?.phone_number ? 'Verified' : 'Not Verified'}</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Address Verification</Text>
                <Tag color={singleLoanDataObject?.guarantor?.residential_address ? 'green' : 'red'} style={{ fontSize: 11 }}>{singleLoanDataObject?.guarantor?.residential_address ? 'Verified' : 'Not Verified'}</Tag>
              </div>
            </div>
          </Card>
        </Col>

        {/* Collateral Status */}
        <Col xs={24} md={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BankOutlined style={{ color: '#722ed1' }} />
                <span>Collateral Status</span>
              </div>
            }
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px 20px' }}
            bodyStyle={{ padding: '20px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Guarantee Status</Text>
                <Tag color={singleLoanDataObject?.guarantor?.status === 'Active' ? 'green' : 'red'} style={{ fontSize: 11 }}>{singleLoanDataObject?.guarantor?.status || 'N/A'}</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Guarantor Location</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.guarantor?.city || 'N/A'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Employment Status</Text>
                <Tag color={singleLoanDataObject?.guarantor?.employment_status === 'Employed' ? 'green' : 'orange'} style={{ fontSize: 11 }}>{singleLoanDataObject?.guarantor?.employment_status || 'N/A'}</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Registration Date</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.guarantor?.date_of_registration ? new Date(singleLoanDataObject.guarantor.date_of_registration).toLocaleDateString() : 'N/A'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Relationship Duration</Text>
                <Text strong style={{ fontSize: 14, color: '#2a3f54' }}>{singleLoanDataObject?.guarantor_relationship_duration || '0'} years</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Action Buttons */}
      <div style={{ 
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
            icon={<SafetyCertificateOutlined />}
            style={{ 
              borderRadius: 8,
              backgroundColor: '#52c41a',
              borderColor: '#52c41a',
              paddingLeft: 32,
              paddingRight: 32,
              height: 48,
              fontSize: 16,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(82, 196, 26, 0.3)'
            }}
          >
            View Collateral Details
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
            Edit Collateral
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default CollateralTab; 