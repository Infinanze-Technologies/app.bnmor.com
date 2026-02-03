import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Table, Tag, Space, Skeleton, Empty, Button, Collapse } from 'antd';
import { 
  FileTextOutlined, 
  DollarOutlined, 
  CalendarOutlined, 
  BankOutlined,
  ReloadOutlined,
  PrinterOutlined,
  DownloadOutlined,
  RightOutlined,
  UserOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const AccountingTab = ({ singleLoanDataObject, jwt, LoanJournalEntriesData }) => {
  const [journalEntries, setJournalEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  let LoanJournalEntriesDataObject = LoanJournalEntriesData?.data?.data;

  // Transform journal entries data into hierarchical structure
  const transformJournalEntries = (data) => {
    if (!data || !data.journal_entries) return [];
    
    return data.journal_entries.map((journal, journalIndex) => ({
      key: journal.journal_id,
      journal_id: journal.journal_id,
      entry_date: journal.entry_date,
      journal_type: journal.journal_type,
      description: journal.description,
      total_debit: journal.total_debit,
      total_credit: journal.total_credit,
      is_posted: journal.is_posted,
      posted_at: journal.posted_at,
      created_at: journal.created_at,
      creator: journal.creator?.fullname,
      poster: journal.poster?.fullname,
      funding_branch: journal.funding_branch?.branch?.name,
      hasChildren: journal.journal_lines && journal.journal_lines.length > 0,
      children: journal.journal_lines?.map((line, lineIndex) => ({
        key: `${journal.journal_id}-${line.line_id}`,
        journal_id: journal.journal_id,
        line_id: line.line_id,
        entry_date: journal.entry_date,
        journal_type: journal.journal_type,
        description: line.description,
        reference_number: line.reference_number,
        debit: line.debit,
        credit: line.credit,
        account_name: line.account.acc_name,
        account_code: line.account.acc_code,
        account_type: line.account.acc_type,
        line_number: line.line_number,
        is_posted: journal.is_posted,
        posted_at: journal.posted_at,
        created_at: journal.created_at,
        creator: journal.creator?.fullname,
        poster: journal.poster?.fullname,
        funding_branch: journal.funding_branch?.branch?.name,
        isChild: true,
        parentKey: journal.journal_id
      })) || []
    }));
  };

  useEffect(() => {
    if (LoanJournalEntriesDataObject) {
      const transformedData = transformJournalEntries(LoanJournalEntriesDataObject);
      setJournalEntries(transformedData);
    }
  }, [LoanJournalEntriesDataObject]);

  // Get entry type color
  const getEntryTypeColor = (type) => {
    const colors = {
      'LOAN_DISBURSEMENT': 'green',
      'LOAN_REPAYMENT': 'blue',
      'LOAN_INTEREST': 'orange',
      'LOAN_FEE': 'purple',
      'LOAN_PENALTY': 'red',
      'LOAN_ADJUSTMENT': 'cyan',
      'LOAN_WRITE_OFF': 'magenta'
    };
    return colors[type] || 'default';
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'Posted': 'green',
      'Pending': 'orange',
      'Draft': 'blue',
      'Cancelled': 'red'
    };
    return colors[status] || 'default';
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return '0.00';
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount);
  };

  // Custom accordion header component
  const AccordionHeader = ({ record }) => (
    <div className="d-flex justify-content-between align-items-center w-100" style={{ paddingRight: '40px' }}>
      <div className="d-flex align-items-center">
        <div className="me-3">
          <FileTextOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
        </div>
        <div>
          <Title level={4} className="mb-1">
            {record.description}
          </Title>
          <Text type="secondary" className="small">
            {dayjs(record.entry_date).format('DD/MM/YYYY')} | {record.journal_type?.replace('_', ' ')} | {record.children?.length || 0} line{(record.children?.length || 0) !== 1 ? 's' : ''}
          </Text>
        </div>
      </div>
      <div className="d-flex align-items-center gap-3">
        <div className="text-end">
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#cf1322' }}>
            {formatCurrency(record.total_debit)}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>Total Debit</div>
        </div>
        <div className="text-end">
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#389e0d' }}>
            {formatCurrency(record.total_credit)}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>Total Credit</div>
        </div>
        <Tag color={record.is_posted ? 'green' : 'orange'} style={{ fontSize: '11px' }}>
          {record.is_posted ? 'Posted' : 'Pending'}
        </Tag>
      </div>
    </div>
  );

  // Child journal line row component
  const ChildJournalLineRow = ({ child }) => (
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
              <BankOutlined style={{ color: '#1890ff' }} />
            </div>
            <div>
              <Text strong>{child.description}</Text>
              <br />
              <Text type="secondary" className="small">
                {child.account_name} | Code: {child.account_code} | Line #{child.line_number}
              </Text>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-end me-3">
              <div style={{ fontSize: '14px', color: '#cf1322', fontWeight: 'bold' }}>
                {child.debit > 0 ? formatCurrency(child.debit) : '-'}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Debit</div>
            </div>
            <div className="text-end">
              <div style={{ fontSize: '14px', color: '#389e0d', fontWeight: 'bold' }}>
                {child.credit > 0 ? formatCurrency(child.credit) : '-'}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Credit</div>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );


  // Loading skeleton
  const JournalEntriesSkeleton = () => (
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
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    </div>
  );

  // Show loading state
  if (LoanJournalEntriesData?.isLoading) {
    return <JournalEntriesSkeleton />;
  }

  // Show error state
  if (LoanJournalEntriesData?.error) {
    return (
      <div className="card card-table flex-fill">
        <div className="card-body text-center py-5">
          <div className="text-danger">
            <h5>Error Loading Journal Entries</h5>
            <p className="text-muted">Failed to load journal entries. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  // Get summary data from API or calculate from entries
  const summary = LoanJournalEntriesDataObject?.summary;
  const totalDebit = summary?.total_debit || journalEntries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
  const totalCredit = summary?.total_credit || journalEntries.reduce((sum, entry) => sum + (entry.credit || 0), 0);
  const totalEntries = summary?.total_entries || journalEntries.length;
  const postedEntries = summary?.posted_entries || journalEntries.filter(entry => entry.is_posted).length;
  const unpostedEntries = summary?.unposted_entries || journalEntries.filter(entry => !entry.is_posted).length;

  return (
    <div className="card card-table flex-fill">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h3 className="card-title mb-1">Journal Entries</h3>
            <p className="text-muted mb-0">
              Complete transaction history and accounting entries for this loan
            </p>
          </div>
          {/* <div className="d-flex gap-2">
            <Button 
              icon={<ReloadOutlined />} 
              size="small"
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
            <Button 
              icon={<PrinterOutlined />} 
              size="small"
              type="default"
            >
              Print
            </Button>
            <Button 
              icon={<DownloadOutlined />} 
              size="small"
              type="primary"
            >
              Export
            </Button>
          </div> */}
        </div>
      </div>
      
      <div className="card-body">
        {journalEntries.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No journal entries found for this loan"
            style={{ padding: '40px 0' }}
          />
        ) : (
          <>
            {/* Summary Cards */}
            <Row gutter={[16, 16]} className="mb-4">
              <Col xs={24} sm={6}>
                <Card size="small" style={{ background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)' }}>
                  <div className="text-center text-white">
                    <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                      {formatCurrency(totalDebit)}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.9 }}>Total Debit</div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={6}>
                <Card size="small" style={{ background: 'linear-gradient(135deg, #51cf66, #40c057)' }}>
                  <div className="text-center text-white">
                    <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                      {formatCurrency(totalCredit)}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.9 }}>Total Credit</div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={6}>
                <Card size="small" style={{ 
                  background: totalDebit === totalCredit 
                    ? 'linear-gradient(135deg, #51cf66, #40c057)' 
                    : 'linear-gradient(135deg, #ffa8a8, #ff6b6b)'
                }}>
                  <div className="text-center text-white">
                    <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                      {formatCurrency(Math.abs(totalDebit - totalCredit))}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.9 }}>
                      {totalDebit === totalCredit ? 'Balanced' : 'Difference'}
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={6}>
                <Card size="small" style={{ background: 'linear-gradient(135deg, #1890ff, #096dd9)' }}>
                  <div className="text-center text-white">
                    <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                      {totalEntries}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.9 }}>
                      {postedEntries} Posted, {unpostedEntries} Pending
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Journal Entries Accordion */}
            <div className="accordion-container">
              <Collapse
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
                className="journal-entries-accordion"
              >
                {journalEntries.map((record) => (
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
                            <strong>{record.children.length}</strong> journal line{record.children.length > 1 ? 's' : ''} for this entry
                          </Text>
                        </div>
                        {record.children.map((child) => (
                          <ChildJournalLineRow key={child.key} child={child} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Text type="secondary">
                          No journal lines available for this entry
                        </Text>
                      </div>
                    )}
                  </Panel>
                ))}
              </Collapse>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .journal-entries-accordion .ant-collapse-item {
          border-radius: 8px !important;
          margin-bottom: 12px !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;
          transition: all 0.3s ease !important;
        }
        
        .journal-entries-accordion .ant-collapse-item:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        }
        
        .journal-entries-accordion .ant-collapse-header {
          padding: 16px 20px !important;
          border-radius: 8px !important;
          transition: all 0.3s ease !important;
          display: flex !important;
          align-items: center !important;
        }
        
        .journal-entries-accordion .ant-collapse-arrow {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          margin-left: 12px !important;
        }
        
        .journal-entries-accordion .ant-collapse-content {
          border-radius: 0 0 8px 8px !important;
        }
        
        .journal-entries-accordion .ant-collapse-content-box {
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

export default AccountingTab;
