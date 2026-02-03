import { useEffect, useState } from "react";
import { Button, Space, Row, Col, Card, Typography, Divider, message } from "antd";
import { DownloadOutlined, PrinterOutlined, MailOutlined, FileTextOutlined } from '@ant-design/icons';
import { postRequest } from "@/hooks/apiService";
import { URL_CREATE_ROLE } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
const accounting = require('accounting');

const { Title, Text } = Typography;

const ViewPayslip = (props) => {
  const { record } = props;
  let earnings = Number(record?.salary || 0) + Number(record?.overtime || 0) + Number(record?.other_payment || 0) + Number(record?.commission || 0) + Number(record?.allowance || 0);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    message.success('Download feature coming soon!');
  };

  const handleEmail = () => {
    message.success('Email feature coming soon!');
  };

  return (
    <div className="payslip-container" id="printableArea">
      {/* Print Actions - Hidden when printing */}
      <div className="no-print" style={{ marginBottom: '24px' }}>
        <Card style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
        }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Title level={4} style={{ color: 'white', margin: 0 }}>
                📄 Payslip Details
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
                {record?.month} {record?.year}
              </Text>
            </Col>
            {/* <Col xs={24} sm={12} md={16}>
              <Space size="small" style={{ float: 'right' }}>
                <Button
                  type="primary"
                  icon={<PrinterOutlined />}
                  onClick={handlePrint}
                  style={{
                    background: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    color: '#667eea',
                    fontWeight: '600'
                  }}
                >
                  Print
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleDownload}
                  style={{
                    background: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    color: '#667eea',
                    fontWeight: '600'
                  }}
                >
                  Download
                </Button>
                <Button
                  icon={<MailOutlined />}
                  onClick={handleEmail}
                  style={{
                    background: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    color: '#667eea',
                    fontWeight: '600'
                  }}
                >
                  Email
                </Button>
              </Space>
            </Col> */}
          </Row>
        </Card>
      </div>

      {/* Payslip Content */}
      <div className="payslip-content" style={{ 
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header Section */}
        <div style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          padding: '32px',
          textAlign: 'center',
          color: 'white'
        }}>
          <Title level={2} style={{ color: 'white', margin: '0 0 8px 0' }}>
            {record?.business?.name || 'Company Name'}
          </Title>
          <Text style={{ fontSize: '16px', opacity: 0.9 }}>
            Official Salary Slip
          </Text>
          <div style={{ 
            marginTop: '16px',
            padding: '12px 24px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '24px',
            display: 'inline-block'
          }}>
            <Text style={{ fontSize: '18px', fontWeight: '600' }}>
              {record?.month} {record?.year}
            </Text>
          </div>
        </div>

        {/* Employee & Company Info */}
        <div style={{ padding: '32px' }}>
          <Row gutter={[32, 24]}>
            <Col xs={24} md={12}>
              <Card 
                size="small" 
                style={{ 
                  border: '2px solid #f0f0f0',
                  borderRadius: '12px',
                  background: '#fafafa'
                }}
              >
                <Title level={4} style={{ margin: '0 0 16px 0', color: '#1890ff' }}>
                  👤 Employee Information
                </Title>
                <div style={{ lineHeight: '2' }}>
                  <div><strong>Name:</strong> {record?.employee?.fullname || 'N/A'}</div>
                  <div><strong>Position:</strong> {record?.employee?.designation || 'N/A'}</div>
                  <div><strong>Employee ID:</strong> {record?.employee?.employee_number || 'N/A'}</div>
                  <div><strong>Department:</strong> {record?.employee?.department || 'N/A'}</div>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card 
                size="small" 
                style={{ 
                  border: '2px solid #f0f0f0',
                  borderRadius: '12px',
                  background: '#fafafa'
                }}
              >
                <Title level={4} style={{ margin: '0 0 16px 0', color: '#52c41a' }}>
                  🏢 Company Information
                </Title>
                <div style={{ lineHeight: '2' }}>
                  <div><strong>Company:</strong> {record?.business?.name || 'N/A'}</div>
                  <div><strong>Address:</strong> {record?.business?.address || 'N/A'}</div>
                  <div><strong>Country:</strong> {record?.business?.country || 'N/A'}</div>
                  <div><strong>Pay Period:</strong> {record?.month} {record?.year}</div>
                </div>
              </Card>
            </Col>
          </Row>

          <Divider style={{ margin: '32px 0' }} />

          {/* Earnings Section */}
          <Card 
            title={
              <span style={{ color: '#52c41a', fontSize: '18px', fontWeight: '600' }}>
                💰 Earnings Breakdown
              </span>
            }
            style={{ marginBottom: '24px', borderRadius: '12px' }}
          >
            <div className="table-responsive">
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                fontSize: '14px'
              }}>
                <thead>
                  <tr style={{ 
                    background: '#f6ffed',
                    borderBottom: '2px solid #b7eb8f'
                  }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Category</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Description</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Type</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px', fontWeight: '500' }}>Basic Salary</td>
                    <td style={{ padding: '12px' }}>-</td>
                    <td style={{ padding: '12px' }}>-</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#52c41a' }}>
                      {accounting.formatMoney(record?.salary || 0, { symbol: '₵', format: '%s%v' })}
                    </td>
                  </tr>
                  
                  {record?.allowance_data?.length > 0 && record?.allowance_data?.map((data, index) => (
                    <tr key={`allowance-${index}`} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px', fontWeight: '500' }}>Allowance</td>
                      <td style={{ padding: '12px' }}>{data?.title || 'N/A'}</td>
                      <td style={{ padding: '12px' }}>{data?.amount_type || 'N/A'}</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#52c41a' }}>
                        {data?.amount_type === "Fixed" ? 
                          `₵ ${(data?.amount || 0).toFixed(2)}` : 
                          `${data?.sal_amount || 0}% (₵${(data?.amount || 0).toFixed(2)})`
                        }
                      </td>
                    </tr>
                  ))}

                  {record?.commission_data?.length > 0 && record?.commission_data?.map((data, index) => (
                    <tr key={`commission-${index}`} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px', fontWeight: '500' }}>Commission</td>
                      <td style={{ padding: '12px' }}>{data?.title || 'N/A'}</td>
                      <td style={{ padding: '12px' }}>{data?.amount_type || 'N/A'}</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#52c41a' }}>
                        {data?.amount_type === "Fixed" ? 
                          `₵ ${(data?.amount || 0).toFixed(2)}` : 
                          `${data?.sal_amount || 0}% (₵${(data?.amount || 0).toFixed(2)})`
                        }
                      </td>
                    </tr>
                  ))}

                  {record?.other_payment_data?.length > 0 && record?.other_payment_data?.map((data, index) => (
                    <tr key={`other-${index}`} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px', fontWeight: '500' }}>Other Payment</td>
                      <td style={{ padding: '12px' }}>{data?.title || 'N/A'}</td>
                      <td style={{ padding: '12px' }}>{data?.amount_type || 'N/A'}</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#52c41a' }}>
                        {data?.amount_type === "Fixed" ? 
                          `₵ ${(data?.amount || 0).toFixed(2)}` : 
                          `${data?.sal_amount || 0}% (₵${(data?.amount || 0).toFixed(2)})`
                        }
                      </td>
                    </tr>
                  ))}

                  {record?.overtime_data?.length > 0 && record?.overtime_data?.map((data, index) => (
                    <tr key={`overtime-${index}`} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px', fontWeight: '500' }}>Overtime</td>
                      <td style={{ padding: '12px' }}>{data?.title || 'N/A'}</td>
                      <td style={{ padding: '12px' }}>-</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#52c41a' }}>
                        {accounting.formatMoney(data?.amount || 0, { symbol: '₵', format: '%s%v' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Deductions Section */}
          {record?.deduction_data?.length > 0 && (
            <Card 
              title={
                <span style={{ color: '#ff4d4f', fontSize: '18px', fontWeight: '600' }}>
                  💸 Deductions
                </span>
              }
              style={{ marginBottom: '24px', borderRadius: '12px' }}
            >
              <div className="table-responsive">
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  fontSize: '14px'
                }}>
                  <thead>
                    <tr style={{ 
                      background: '#fff2f0',
                      borderBottom: '2px solid #ffccc7'
                    }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Category</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Description</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Type</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {record?.deduction_data?.map((data, index) => (
                      <tr key={`deduction-${index}`} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '12px', fontWeight: '500' }}>Deduction</td>
                        <td style={{ padding: '12px' }}>{data?.title || 'N/A'}</td>
                        <td style={{ padding: '12px' }}>{data?.amount_type || 'N/A'}</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#ff4d4f' }}>
                          {data?.amount_type === "Fixed" ? 
                            `₵ ${(data?.amount || 0).toFixed(2)}` : 
                            `${data?.sal_amount || 0}% (₵${(data?.amount || 0).toFixed(2)})`
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Summary Section */}
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '16px',
              color: 'white'
            }}
          >
            <Row gutter={[24, 16]}>
              <Col xs={24} md={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Earnings</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', marginTop: '8px' }}>
                    {accounting.formatMoney(earnings, { symbol: '₵', format: '%s%v' })}
                  </div>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Deductions</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', marginTop: '8px' }}>
                    {accounting.formatMoney(record?.deductions || 0, { symbol: '₵', format: '%s%v' })}
                  </div>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>Net Salary</div>
                  <div style={{ fontSize: '28px', fontWeight: '700', marginTop: '8px', color: '#52c41a' }}>
                    {accounting.formatMoney(record?.net_salary || 0, { symbol: '₵', format: '%s%v' })}
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Footer */}
          <div style={{ 
            marginTop: '32px', 
            padding: '24px', 
            background: '#fafafa',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <Text style={{ color: '#666', fontSize: '14px' }}>
              This is an official document generated by {record?.business?.name || 'Company Name'}
            </Text>
            <br />
            <Text style={{ color: '#999', fontSize: '12px' }}>
              Generated on {new Date().toLocaleDateString()}
            </Text>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .payslip-container {
            padding: 0 !important;
            margin: 0 !important;
          }
          .payslip-content {
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
        
        @media (max-width: 768px) {
          .payslip-container {
            padding: 16px !important;
          }
          .payslip-content {
            margin: 0 !important;
            border-radius: 8px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ViewPayslip;
