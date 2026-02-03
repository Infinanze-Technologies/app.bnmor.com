import React, { useState } from 'react';
import { Card, Row, Col, Typography, Avatar, Button, Divider, List, Space, Modal, Image, Tabs, Tag, Switch } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, FileImageOutlined, DollarOutlined, PercentageOutlined, CalendarOutlined, BankOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Sample loan product data based on AddLoanProduct structure
const loanProduct = {
  product_title: 'Personal Loan Product',
  description: 'A flexible personal loan product with competitive interest rates for various purposes.',
  duration_period: 'months',
  duration_type: 'fixed',
  loan_duration_months: 24,
  min_principal_amount: 1000,
  max_principal_amount: 50000,
  interest_configuration: {
    method: 'flat',
    rate: 12.5,
    cycle: 'monthly',
    repayment_cycle: 'monthly'
  },
  fees: [
    {
      id: 1,
      name: 'Processing Fee',
      type: 'percentage',
      percentage: 2.5,
      calculate_on: 'Principal Amount',
      deduct_from_principal: true,
      spread_across_repayments: false
    },
    {
      id: 2,
      name: 'Insurance Fee',
      type: 'fixed',
      amount: 500,
      calculate_on: 'Principal Amount',
      deduct_from_principal: false,
      spread_across_repayments: true
    }
  ],
  late_repayment_penalty: {
    enabled: true,
    penalty_type: 'percentage',
    penalty_percentage: 5,
    calculate_penalty_on: 'Principal Amount',
    grace_period: 3,
    recurring_penalty: 'monthly'
  },
  accounts: {
    funding_account: 'Cash',
    loans_receivable_account: 'Loans Receivable',
    interest_income_account: 'Interest Income',
    fees_income_account: 'Fees Income',
    penalty_income_account: 'Penalties Income',
    overpayment_account: 'Loans Overpayment'
  }
};

const activityLogs = [
  {
    time: '2 hours ago',
    action: 'create',
    description: 'Loan product created successfully',
  },
  {
    time: '1 day ago',
    action: 'update',
    description: 'Interest rate updated from 10% to 12.5%',
  },
  {
    time: '3 days ago',
    action: 'configure',
    description: 'Late repayment penalty configured',
  },
];

const ViewLoanProduct = () => {
  const router = useRouter();
  const { id } = router.query;
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const showDeleteModal = () => setDeleteModalOpen(true);
  const handleCancel = () => setDeleteModalOpen(false);
  const handleDelete = () => {
    // TODO: Implement actual delete logic
    setDeleteModalOpen(false);
  };

  const renderBasicInfo = () => (
    <Row gutter={[32, 24]}>
      <Col xs={24} md={12}>
        <Text strong>Product Title</Text><br />
        <Text>{loanProduct.product_title}</Text>
      </Col>
      <Col xs={24} md={12}>
        <Text strong>Duration Period</Text><br />
        <Text>{loanProduct.duration_period}</Text>
      </Col>
      <Col xs={24} md={12}>
        <Text strong>Duration Type</Text><br />
        <Text>{loanProduct.duration_type}</Text>
      </Col>
      <Col xs={24} md={12}>
        <Text strong>Loan Duration</Text><br />
        <Text>{loanProduct.loan_duration} months</Text>
      </Col>
      <Col xs={24}>
        <Text strong>Description</Text><br />
        <Text>{loanProduct.description}</Text>
      </Col>
    </Row>
  );

  const renderPrincipalAmount = () => (
    <Row gutter={[32, 24]}>
      <Col xs={24} md={12}>
        <Text strong>Minimum Principal Amount</Text><br />
        <Text>GH₵ {loanProduct.min_principal_amount.toLocaleString()}</Text>
      </Col>
      <Col xs={24} md={12}>
        <Text strong>Maximum Principal Amount</Text><br />
        <Text>GH₵ {loanProduct.max_principal_amount.toLocaleString()}</Text>
      </Col>
    </Row>
  );

  const renderInterestConfig = () => (
    <Row gutter={[32, 24]}>
      <Col xs={24} md={12}>
        <Text strong>Interest Method</Text><br />
        <Text>{loanProduct.interest_configuration.method}</Text>
      </Col>
      <Col xs={24} md={12}>
        <Text strong>Interest Rate</Text><br />
        <Text>{loanProduct.interest_configuration.rate}%</Text>
      </Col>
      <Col xs={24} md={12}>
        <Text strong>Interest Cycle</Text><br />
        <Text>{loanProduct.interest_configuration.cycle}</Text>
      </Col>
      <Col xs={24} md={12}>
        <Text strong>Repayment Cycle</Text><br />
        <Text>{loanProduct.interest_configuration.repayment_cycle}</Text>
      </Col>
    </Row>
  );

  const renderFees = () => (
    <div>
      {loanProduct.fees.length === 0 ? (
        <Text type="secondary">No fees configured</Text>
      ) : (
        loanProduct.fees.map((fee, index) => (
          <Card key={fee.id} size="small" style={{ marginBottom: 16, borderRadius: 8 }}>
            <Row gutter={[16, 8]} align="middle">
              <Col xs={24} lg={6}>
                <Text strong>{fee.name}</Text>
              </Col>
              <Col xs={24} lg={4}>
                <Text>
                  {fee.type === 'percentage' ? `${fee.percentage}%` : `GH₵ ${fee.amount}`}
                </Text>
              </Col>
              <Col xs={24} lg={8}>
                <Text type="secondary">On: {fee.calculate_on}</Text>
              </Col>
              <Col xs={24} lg={6}>
                <Space>
                  <Tag color={fee.deduct_from_principal ? 'green' : 'default'}>
                    {fee.deduct_from_principal ? 'Deduct from Principal' : 'Not Deducted'}
                  </Tag>
                  <Tag color={fee.spread_across_repayments ? 'blue' : 'default'}>
                    {fee.spread_across_repayments ? 'Spread Across' : 'Not Spread'}
                  </Tag>
                </Space>
              </Col>
            </Row>
          </Card>
        ))
      )}
    </div>
  );

  const renderLatePenalty = () => (
    <div>
      <Row gutter={[32, 24]} align="middle" style={{ marginBottom: 16 }}>
        <Col xs={24} lg={12}>
          <Text strong>Enable Late Repayment Penalty</Text>
        </Col>
        <Col xs={24} lg={12}>
          <Switch 
            checked={loanProduct.late_repayment_penalty.enabled} 
            disabled
          />
        </Col>
      </Row>
      
      {loanProduct.late_repayment_penalty.enabled && (
        <Row gutter={[32, 24]}>
          <Col xs={24} md={12}>
            <Text strong>Penalty Type</Text><br />
            <Text>{loanProduct.late_repayment_penalty.penalty_type}</Text>
          </Col>
          <Col xs={24} md={12}>
            <Text strong>Penalty Amount/Percentage</Text><br />
            <Text>
              {loanProduct.late_repayment_penalty.penalty_type === 'percentage' 
                ? `${loanProduct.late_repayment_penalty.penalty_percentage}%`
                : `GH₵ ${loanProduct.late_repayment_penalty.penalty_amount}`
              }
            </Text>
          </Col>
          <Col xs={24} md={12}>
            <Text strong>Calculate Penalty On</Text><br />
            <Text>{loanProduct.late_repayment_penalty.calculate_penalty_on}</Text>
          </Col>
          <Col xs={24} md={12}>
            <Text strong>Grace Period</Text><br />
            <Text>{loanProduct.late_repayment_penalty.grace_period} days</Text>
          </Col>
          <Col xs={24} md={12}>
            <Text strong>Recurring Penalty</Text><br />
            <Text>{loanProduct.late_repayment_penalty.recurring_penalty}</Text>
          </Col>
        </Row>
      )}
    </div>
  );

  const renderAccounts = () => (
    <Row gutter={[32, 24]}>
      <Col xs={24} md={12}>
        <Text strong>Funding Account</Text><br />
        <Text>{loanProduct.accounts.funding_account}</Text>
      </Col>
      <Col xs={24} md={12}>
        <Text strong>Loans Receivable Account</Text><br />
        <Text>{loanProduct.accounts.loans_receivable_account}</Text>
      </Col>
      <Col xs={24} md={12}>
        <Text strong>Interest Income Account</Text><br />
        <Text>{loanProduct.accounts.interest_income_account}</Text>
      </Col>
      <Col xs={24} md={12}>
        <Text strong>Fees Income Account</Text><br />
        <Text>{loanProduct.accounts.fees_income_account}</Text>
      </Col>
      <Col xs={24} md={12}>
        <Text strong>Penalty Income Account</Text><br />
        <Text>{loanProduct.accounts.penalty_income_account}</Text>
      </Col>
      <Col xs={24} md={12}>
        <Text strong>Overpayment Account</Text><br />
        <Text>{loanProduct.accounts.overpayment_account}</Text>
      </Col>
    </Row>
  );

  const renderActivityLogs = () => (
    <List
      itemLayout="horizontal"
      dataSource={activityLogs}
      renderItem={item => (
        <List.Item>
          <List.Item.Meta
            title={
              <span style={{ fontSize: 13, color: '#888' }}>
                {item.time} 
                <Button size="small" style={{ marginLeft: 8 }} type="dashed">
                  {item.action}
                </Button>
              </span>
            }
            description={<span style={{ fontSize: 14 }}>{item.description}</span>}
          />
        </List.Item>
      )}
    />
  );

  return (
    <div style={{ padding: 24, background: '#f7f8fa', minHeight: '100vh' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={24}>
          <Card
            title={<Title level={5} style={{ margin: 0 }}>Loan Product Details</Title>}
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
            bodyStyle={{ padding: 0 }}
          >
            <Tabs defaultActiveKey="basic" style={{ padding: '0 32px 32px' }}>
              <TabPane 
                tab={
                  <span>
                    {/* <UserOutlined /> */}
                    Basic Product Information
                  </span>
                } 
                key="basic"
              >
                {renderBasicInfo()}
              </TabPane>
              
              <TabPane 
                tab={
                  <span>
                    {/* <DollarOutlined /> */}
                    Principal Amount
                  </span>
                } 
                key="principal"
              >
                {renderPrincipalAmount()}
              </TabPane>
              
              <TabPane 
                tab={
                  <span>
                    {/* <PercentageOutlined /> */}
                    Interest Configuration
                  </span>
                } 
                key="interest"
              >
                {renderInterestConfig()}
              </TabPane>
              
              <TabPane 
                tab={
                  <span>
                    {/* <DollarOutlined /> */}
                    Fees
                  </span>
                } 
                key="fees"
              >
                {renderFees()}
              </TabPane>
              
              <TabPane 
                tab={
                  <span>
                    {/* <ExclamationCircleOutlined /> */}
                    Late Repayment Penalty
                  </span>
                } 
                key="penalty"
              >
                {renderLatePenalty()}
              </TabPane>
              
              <TabPane 
                tab={
                  <span>
                    {/* <BankOutlined /> */}
                    Accounts 
                  </span>
                } 
                key="accounts"
              >
                {renderAccounts()}
              </TabPane>
            </Tabs>
          </Card>
          
          <Card
            title={<Title level={5} style={{ margin: 0, color: '#d4380d' }}><ExclamationCircleOutlined style={{ color: '#d4380d', marginRight: 8 }} />Danger Zone</Title>}
            bordered={false}
            style={{ borderRadius: 12, marginTop: 32, boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}
            bodyStyle={{ padding: 32 }}
          >
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Text strong>Modify Loan Product</Text>
                <div style={{ color: '#888', marginBottom: 12 }}>Change details of the loan product.</div>
                <Button icon={<EditOutlined />} type="primary" shape="round" onClick={() => router.push(`/dashboard/loan-management/loan-products/edit/${id}`)}>Edit</Button>
              </Col>
              <Col xs={24} md={12}>
                <Text strong>Delete Loan Product</Text>
                <div style={{ color: '#888', marginBottom: 12 }}>Delete this loan product.</div>
                <Button icon={<DeleteOutlined />} type="danger" danger shape="round" onClick={showDeleteModal}>Delete</Button>
              </Col>
            </Row>
          </Card>
        </Col>
{/*         
        <Col xs={24} md={8}>
          <Card
            title={<Title level={5} style={{ margin: 0 }}>Activity Logs</Title>}
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}
            bodyStyle={{ padding: 24 }}
          >
            {renderActivityLogs()}
          </Card>
        </Col> */}
      </Row>
      
      <Modal
        open={deleteModalOpen}
        title={<span style={{ color: '#d4380d', fontWeight: 600 }}>Delete Loan Product</span>}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="delete" type="primary" danger onClick={handleDelete}>
            Delete
          </Button>,
        ]}
      >
        <p style={{ fontSize: 16, marginBottom: 0 }}>
          Are you sure you want to delete this loan product? <br />
          <b>All loans associated with this product will be affected and this action cannot be undone.</b>
        </p>
      </Modal>
    </div>
  );
};

export default ViewLoanProduct;