import React from "react";
import { Card, Row, Col, Typography, Tag, Divider, Button, Descriptions, Statistic } from "antd";
import { EyeOutlined, EditOutlined, BankOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const FIELD_STYLE = { width: '100%', height: 50, borderRadius: 10 };

const dateFormat = "YYYY-MM-DD";

const ViewFundingAccountModal = ({ isVisible, onCancel, onEdit, accountData = null, branchData = [] }) => {
  if (!accountData) return null;

  const getAccountTypeColor = (type) => {
    const colors = {
      'Asset': 'green',
      'Liability': 'red',
      'Equity': 'blue',
      'Revenue': 'purple',
      'Expense': 'orange'
    };
    return colors[type] || 'default';
  };

  const getAccountTypeIcon = (type) => {
    return type === 'Asset' ? <BankOutlined /> : <DollarOutlined />;
  };

  // Get branch name from branch data
  const getBranchName = (branchId) => {
    if (!branchData || !branchData.length) return 'Unknown Branch';
    const branch = branchData.find(b => 
      (b.id || b.branch_id || b.code) === branchId
    );
    return branch ? (branch.name || branch.branch_name || branch.title) : 'Unknown Branch';
  };

  return (
    <div className="view-funding-account-modal">
      <Card className="mb-3">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center">
            <EyeOutlined style={{ fontSize: '1.5rem', color: '#1890ff', marginRight: '12px' }} />
            <div>
              <Title level={4} className="mb-1">Account Details</Title>
              <Text type="secondary">View funding account information</Text>
            </div>
          </div>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => onEdit(accountData)}
          >
            Edit Account
          </Button>
        </div>
      </Card>

      <Row gutter={[24, 24]}>
        {/* Account Overview */}
        <Col xs={24} lg={16}>
          <Card title="Account Information" className="mb-3">
            <Descriptions column={1} size="large">
              <Descriptions.Item label="Account Code">
                <Text strong style={{ fontSize: '16px' }}>{accountData.code}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Account Name">
                <Text strong style={{ fontSize: '16px' }}>{accountData.name}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Account Type">
                <Tag 
                  color={getAccountTypeColor(accountData.accountType)} 
                  icon={getAccountTypeIcon(accountData.accountType)}
                  style={{ fontSize: '14px', padding: '4px 12px' }}
                >
                  {accountData.accountType}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Parent Account">
                {accountData.parentKey ? (
                  <Text>Parent Account: {accountData.parentKey}</Text>
                ) : (
                  <Text type="secondary">This is a parent account</Text>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Branch">
                <Text>{getBranchName(accountData.branch)}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Account Status">
                <Tag color="green">Active</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Financial Information */}
          <Card title="Financial Information">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Statistic
                  title="Opening Balance"
                  value={parseFloat(accountData.openingBalance?.replace(/[GH¢,\s]/g, '') || '0')}
                  prefix="GH¢"
                  precision={2}
                  valueStyle={{ color: '#52c41a', fontSize: '24px' }}
                />
              </Col>
              <Col xs={24} sm={12}>
                <Statistic
                  title="Current Balance"
                  value={parseFloat(accountData.openingBalance?.replace(/[GH¢,\s]/g, '') || '0')}
                  prefix="GH¢"
                  precision={2}
                  valueStyle={{ color: '#1890ff', fontSize: '24px' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Account Summary */}
        <Col xs={24} lg={8}>
          <Card title="Account Summary" className="mb-3">
            <div className="account-summary">
              <div className="summary-item mb-3">
                <Text type="secondary" className="small">Account Hierarchy</Text>
                <div className="mt-1">
                  {accountData.isParent ? (
                    <Tag color="blue" icon={<BankOutlined />}>
                      Parent Account
                    </Tag>
                  ) : (
                    <Tag color="green" icon={<DollarOutlined />}>
                      Sub Account
                    </Tag>
                  )}
                </div>
              </div>

              <div className="summary-item mb-3">
                <Text type="secondary" className="small">Sub-Accounts</Text>
                <div className="mt-1">
                  <Text strong style={{ fontSize: '18px' }}>
                    {accountData.hasChildren ? accountData.children?.length || 0 : 0}
                  </Text>
                </div>
              </div>

              <div className="summary-item mb-3">
                <Text type="secondary" className="small">Created Date</Text>
                <div className="mt-1">
                  <Text>
                    <CalendarOutlined className="me-1" />
                    {new Date().toLocaleDateString()}
                  </Text>
                </div>
              </div>

              <div className="summary-item">
                <Text type="secondary" className="small">Last Modified</Text>
                <div className="mt-1">
                  <Text>
                    <CalendarOutlined className="me-1" />
                    {new Date().toLocaleDateString()}
                  </Text>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="d-grid gap-2">
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={() => onEdit(accountData)}
                block
              >
                Edit Account
              </Button>
              <Button 
                icon={<BankOutlined />}
                block
              >
                View Transactions
              </Button>
              <Button 
                icon={<DollarOutlined />}
                block
              >
                Generate Report
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row justify="end">
        <Col>
          <Button 
            size="large"
            onClick={onCancel}
          >
            Close
          </Button>
        </Col>
      </Row>

      <style jsx>{`
        .account-summary .summary-item {
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .account-summary .summary-item:last-child {
          border-bottom: none;
        }
        
        .view-funding-account-modal .ant-card {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }
        
        .view-funding-account-modal .ant-descriptions-item-label {
          font-weight: 600;
        }
        
        .view-funding-account-modal .ant-btn {
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
};

export default ViewFundingAccountModal;
