import React from 'react';
import { Card, Row, Col, Typography, Space, Tag } from 'antd';

const { Title, Text } = Typography;

const FeesAndPenaltiesTab = ({ singleLoanDataObject }) => {
  return (
    <div>
      {/* Fees Section */}
      <div style={{ marginBottom: 32 }}>
        <Title level={5} style={{ marginBottom: 8 }}>Fees</Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>Loan fees configuration</Text>
        
        <div style={{ marginBottom: 16 }}>
          {singleLoanDataObject?.fees && singleLoanDataObject.fees.length > 0 ? (
            singleLoanDataObject.fees.map((fee, index) => (
              <Card key={index} size="small" style={{ marginBottom: 8, borderRadius: 8 }}>
                <Row gutter={[16, 8]} align="middle">
                  <Col xs={24} lg={6}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: 16, marginRight: 8 }}>
                        {fee.fee_type === 'Percentage' ? '%' : '$'}
                      </span>
                      <Text strong>{fee.name}</Text>
                    </div>
                  </Col>
                  <Col xs={24} lg={8}>
                    <Text type="secondary">
                      {fee.deduct_from_principal ? 'Deducted from principal' : 'Spread over repayments'}
                    </Text>
                  </Col>
                  <Col xs={24} lg={6}>
                    <Text type="secondary">
                      {fee.fee_type === 'Percentage' 
                        ? `Percentage: ${fee.fee_percentage}% of ${fee.calculate_on}`
                        : `Fixed Amount: GH₵${fee.fee_amount} GHS`
                      }
                    </Text>
                  </Col>
                  <Col xs={24} lg={4}>
                    <Text strong style={{ textAlign: 'right' }}>
                      {fee.fee_type === 'Percentage' 
                        ? `GH₵${(parseFloat(singleLoanDataObject.loan_amount) * parseFloat(fee.fee_percentage) / 100).toFixed(2)} GHS`
                        : `GH₵${fee.fee_amount} GHS`
                      }
                    </Text>
                  </Col>
                </Row>
              </Card>
            ))
          ) : (
            <Card size="small" style={{ marginBottom: 8, borderRadius: 8 }}>
              <Text type="secondary">No fees configured for this loan</Text>
            </Card>
          )}
        </div>
      </div>
      
      {/* Penalty Settings Section */}
      {/* <div>
        <Title level={5} style={{ marginBottom: 8 }}>Penalty Settings</Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>Loan penalty configuration</Text>
        
        {singleLoanDataObject?.penalties && singleLoanDataObject.penalties.length > 0 ? (
          singleLoanDataObject.penalties.map((penalty, index) => (
            <Row key={index} gutter={[32, 24]}>
              <Col xs={24} md={12}>
                <Text strong>Penalty Type</Text><br />
                <Text>{penalty.penalty_type || 'N/A'}</Text>
              </Col>
              <Col xs={24} md={12}>
                <Text strong>Grace Period</Text><br />
                <Text>{penalty.grace_period || '0'} days</Text>
              </Col>
              <Col xs={24} md={12}>
                <Text strong>Late Repayment Fee</Text><br />
                <Text>
                  {penalty.penalty_type === 'Percentage' 
                    ? `${penalty.penalty_percentage}% of ${penalty.calculate_penalty_on}`
                    : `GH₵${penalty.penalty_amount} GHS ${penalty.recurring_penalty || 'once'}`
                  }
                </Text>
              </Col>
              <Col xs={24} md={12}>
                <Text strong>Recurring Penalty</Text><br />
                <Text>{penalty.recurring_penalty || 'Once'}</Text>
              </Col>
            </Row>
          ))
        ) : (
          <Row gutter={[32, 24]}>
            <Col xs={24}>
              <Text type="secondary">No penalties configured for this loan</Text>
            </Col>
          </Row>
        )}
      </div> */}
    </div>
  );
};

export default FeesAndPenaltiesTab; 