import React, { useEffect, useState } from "react";
import { Collapse, Card, Row, Col, Typography, Tag, Skeleton } from "antd";
import { BankOutlined, WalletOutlined, DollarOutlined, RightOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { Text, Title } = Typography;

const ChartsOfAccountsTable = (props) => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  
  let { jwt, accountsData, loading, error } = props;

  // Transform API data to component format
  const transformApiData = (apiData) => {
    if (!apiData || !apiData.data) return [];
    
    const accountTypes = ['Asset', 'Liability', 'Income', 'Expense', 'Equity'];
    const transformedData = [];
    
    accountTypes.forEach(accountType => {
      if (apiData.data[accountType] && apiData.data[accountType].accounts) {
        const accounts = apiData.data[accountType].accounts;
        
        // Create parent account type entry
        const parentAccount = {
          key: `${accountType.toLowerCase()}-parent`,
          code: accountType === 'Asset' ? '1000' : 
                accountType === 'Liability' ? '2000' : 
                accountType === 'Income' ? '3000' : 
                accountType === 'Expense' ? '4000' : '5000',
          name: accountType,
          accountType: accountType,
          cashflowType: 'Cashflow', // Default cashflow type
      isParent: true,
          hasChildren: accounts.length > 0,
          children: accounts.map(account => ({
            key: account.key,
            code: account.code,
            name: account.name,
            accountType: account.accountType,
            cashflowType: account.cashflowType,
          isParent: false,
          isChild: true,
            parentKey: `${accountType.toLowerCase()}-parent`
          }))
        };
        
        transformedData.push(parentAccount);
      }
    });
    
    return transformedData;
  };

  const chartData = accountsData ? transformApiData(accountsData) : [];

  // Skeleton component for loading state
  const ChartsOfAccountsSkeleton = () => (
    <div className="card card-table flex-fill">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Skeleton.Input active size="large" style={{ width: 250, height: 24 }} />
            <Skeleton.Input active size="small" style={{ width: 350, height: 16, marginTop: 8 }} />
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="accordion-container">
          {[1, 2, 3, 4, 5].map((index) => (
            <Card key={index} className="mb-3" style={{ borderRadius: '8px' }}>
              <div className="p-3">
                <Row align="middle" justify="space-between">
                  <Col span={16}>
                    <div className="d-flex align-items-center">
                      <Skeleton.Avatar active size={40} className="me-3" />
                      <div>
                        <Skeleton.Input active size="small" style={{ width: 180, height: 20, marginBottom: 8 }} />
                        <Skeleton.Input active size="small" style={{ width: 120, height: 14 }} />
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className="text-end">
                      <Skeleton.Input active size="small" style={{ width: 60, height: 16 }} />
                    </div>
                  </Col>
                </Row>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
  
  // Debug logging

  // Get account type color
  const getAccountTypeColor = (type) => {
    const colors = {
      'Asset': 'green',
      'Liability': 'red',
      'Income': 'blue',
      'Expense': 'orange'
    };
    return colors[type] || 'default';
  };

  // Get account type icon
  const getAccountTypeIcon = (type) => {
    const icons = {
      'Asset': <BankOutlined />,
      'Liability': <WalletOutlined />,
      'Income': <DollarOutlined />,
      'Expense': <WalletOutlined />
    };
    return icons[type] || <BankOutlined />;
  };

  // Custom accordion header component
  const AccordionHeader = ({ record }) => (
    <div className="d-flex justify-content-between align-items-center w-100" style={{ paddingRight: '40px' }}>
      <div className="d-flex align-items-center">
        <div className="me-3">
          {getAccountTypeIcon(record.accountType)}
        </div>
        <div>
          <Title level={4} className="mb-1">
            {record.name}
          </Title>
          <Text type="secondary" className="small">
            Code: {record.code} | {record.children?.length || 0} account{(record.children?.length || 0) !== 1 ? 's' : ''}
          </Text>
        </div>
      </div>
      <div className="d-flex align-items-center">

        
   
      </div>
    </div>
  );

  // Child account row component
  const ChildAccountRow = ({ child }) => (
    <Card 
      size="small" 
      className="mb-2 ms-4 border-start border-3 border-primary"
      style={{ 
        transition: 'all 0.3s ease',
        backgroundColor: '#f8f9fa'
      }}
    >
      <Row align="middle" justify="space-between">
        <Col span={16}>
          <div className="d-flex align-items-center">
            <div className="me-3">
              {getAccountTypeIcon(child.accountType)}
            </div>
            <div>
              <Text strong>{child.name}</Text>
              <br />
              <Text type="secondary" className="small">
                Code: {child.code} | Type: {child.accountType}
              </Text>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className="d-flex justify-content-between align-items-center">
            <Tag 
              color={getAccountTypeColor(child.accountType)}
              style={{ fontSize: '11px', padding: '1px 6px' }}
            >
              {child.accountType}
            </Tag>
            <Text type="secondary" className="small">
              {child.cashflowType}
            </Text>
          </div>
        </Col>
      </Row>
    </Card>
  );

  // Show loading state
  if (loading) {
    return <ChartsOfAccountsSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className="card card-table flex-fill">
        <div className="card-body text-center py-5">
          <div className="text-danger">
            <h5>Error Loading Data</h5>
            <p className="text-muted">Failed to load chart of accounts. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card card-table flex-fill">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h3 className="card-title mb-1">Charts of Accounts</h3>
            <p className="text-muted mb-0">
              View your complete chart of accounts organized by category
            </p>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="accordion-container">
          <Collapse
            activeKey={expandedKeys}
            onChange={setExpandedKeys}
            expandIcon={({ isActive }) => (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: isActive ? '#1890ff' : '#f5f5f5',
                transition: 'all 0.3s ease'
              }}>
                <RightOutlined 
                  style={{ 
                    transform: isActive ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    color: isActive ? '#fff' : '#666',
                    fontSize: '12px'
                  }} 
                />
              </div>
            )}
            expandIconPosition="right"
            ghost
            className="charts-accounts-accordion"
          >
            {chartData.map((record) => (
              <Panel
                key={record.key}
                header={<AccordionHeader record={record} />}
                showArrow={record.hasChildren}
                className="accordion-panel"
                style={{
                  marginBottom: '12px',
                  borderRadius: '8px',
                  border: '1px solid #f0f0f0',
                  transition: 'all 0.3s ease'
                }}
              >
                {record.hasChildren && record.children && record.children.length > 0 ? (
                  <div 
                    className="children-container"
                    style={{
                      padding: '16px 0',
                      animation: 'slideDown 0.3s ease-out'
                    }}
                  >
                    <div className="mb-3">
                      <Text type="secondary" className="small">
                        <strong>{record.children.length}</strong> account{record.children.length > 1 ? 's' : ''} under {record.name} category
                      </Text>
                    </div>
                    {record.children.map((child) => (
                      <ChildAccountRow key={child.key} child={child} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Text type="secondary">
                        No accounts available in this category
                    </Text>
                  </div>
                )}
              </Panel>
            ))}
          </Collapse>
        </div>
      </div>

      <style jsx>{`
        .charts-accounts-accordion .ant-collapse-item {
          border-radius: 8px !important;
          margin-bottom: 12px !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;
          transition: all 0.3s ease !important;
        }
        
        .charts-accounts-accordion .ant-collapse-item:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        }
        
        .charts-accounts-accordion .ant-collapse-header {
          padding: 16px 20px !important;
          border-radius: 8px !important;
          transition: all 0.3s ease !important;
          display: flex !important;
          align-items: center !important;
        }
        
        .charts-accounts-accordion .ant-collapse-arrow {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          margin-left: 12px !important;
        }
        
        .charts-accounts-accordion .ant-collapse-content {
          border-radius: 0 0 8px 8px !important;
        }
        
        .charts-accounts-accordion .ant-collapse-content-box {
          padding: 0 20px 20px 20px !important;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .children-container {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ChartsOfAccountsTable;
